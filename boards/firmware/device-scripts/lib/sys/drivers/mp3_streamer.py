"""
mp3_streamer.py - Unified Audio Streamer Driver

Provides a centralized class managing the state machine, hardware volume pairing, 
and background streaming workflows for the MicroPython native audioplayer.

Usage (from board manifest — recommended):
    from lib.sys.drivers.mp3_streamer import AudioStreamer
    player = AudioStreamer.from_board(board, volume=80)
    bg_tasks.start('audio_pump', player.local_pump)
    player.play('/sd/music.mp3')
    player.play('http://stream.example.com/radio')

Usage (manual setup):
    from lib.sys.drivers.mp3_streamer import AudioStreamer
    player = AudioStreamer(es8311, start_volume=80)
    bg_tasks.start('audio_pump', player.local_pump)
    player.play_local('/sd/music.mp3')
"""

import audioplayer
import asyncio
import time
import os

class AudioStreamer:
    _instance_gen = 0   # class-level: incremented each time a new instance is created

    def __init__(self, codec=None, start_volume=80, chunk_size=8192, i2c=None, pa_pin=None):
        AudioStreamer._instance_gen += 1
        self._gen = AudioStreamer._instance_gen
        self.codec = codec
        self.i2c = i2c              # shared I2C bus (for consumers like touch controllers)
        self.pa_pin = pa_pin        # PA enable pin (for clean shutdown)
        self.volume_pct = max(0, min(100, start_volume))
        self.chunk_size = chunk_size
        
        self.playing = False
        self._stop_requested = False
        self._playback_active = False
        self._is_local = True
        self._play_gen = 0          # incremented on every new track; guards stale local_pump cleanup

        self.path = None
        self.pause_start_ms = 0
        self.paused_total_ms = 0
        self.play_start_ms = 0
        
        # Apply initial volume via hardware codec only
        self._apply_hw_volume(self.volume_pct)

    @classmethod
    def from_board(cls, board, volume=80, chunk_size=8192):
        """One-call setup from board manifest — encapsulates I2S + codec + PA init.
        
        Eliminates ~40 lines of boilerplate that was duplicated across every ScriptO.
        Returns a ready-to-use AudioStreamer with hardware fully configured.
        """
        from machine import Pin, I2C
        from lib.sys.drivers.es8311 import ES8311

        if not board.has('audio'):
            raise RuntimeError('No audio capability in board manifest')

        codec_cfg = board.device('audio_codec')
        i2c_cfg   = board.i2c('i2c0')
        i2s_cfg   = board.i2s('audio')

        addr = int(codec_cfg.i2c_address, 0)
        i2c = I2C(0, scl=Pin(i2c_cfg.scl), sda=Pin(i2c_cfg.sda), freq=400000)

        # Stop any previous session and wait for its async teardown to
        # finish.  stop() launches a background _teardown_task that waits
        # for the decode task to exit and free its 8 KB internal-DRAM in_buf.
        # If we call start() before that completes, the new decode task
        # can't allocate its own in_buf → "failed to alloc in_buf".
        audioplayer.stop()
        for _ in range(60):            # up to 3 s
            try:
                if audioplayer.status().get('state', 'idle') == 'idle':
                    break
            except Exception:
                break
            time.sleep_ms(50)

        # Start I2S clocks + decoder task — hw_volume=True means the ES8311
        # hardware register is the sole volume authority; C skips PCM scaling.
        audioplayer.config(
            bck=i2s_cfg.bck, ws=i2s_cfg.ws,
            dout=i2s_cfg.dout, mclk=i2s_cfg.mclk,
            sample_rate=44100, channels=1,
            hw_volume=True,
        )
        audioplayer.start()

        # Wait for MCLK to stabilize before configuring codec over I2C
        time.sleep_ms(150)
        es8311 = ES8311(i2c, addr)
        print('ES8311 ID: 0x%02x%02x' % (es8311._rd(0xFD), es8311._rd(0xFE)))
        es8311.init(44100, volume)
        print('ES8311 configured OK')

        # Power amplifier on
        pa_pin_num = codec_cfg._data.get('pa_pin')
        pa_pin_obj = None
        if pa_pin_num is not None:
            pa_pin_obj = Pin(pa_pin_num, Pin.OUT)
            pa_pin_obj.value(1)
            time.sleep_ms(50)

        return cls(es8311, start_volume=volume, chunk_size=chunk_size,
                   i2c=i2c, pa_pin=pa_pin_obj)

    def _apply_hw_volume(self, pct):
        """Single volume authority: hardware DAC register only."""
        if self.codec and hasattr(self.codec, 'set_volume'):
            self.codec.set_volume(pct)

    def set_volume(self, pct):
        """Update volume (0-100%). Routes to hardware codec register only."""
        self.volume_pct = max(0, min(100, pct))
        self._apply_hw_volume(self.volume_pct)

    async def toggle_pause(self):
        try:
            if self.playing:
                if self.pause_start_ms == 0:
                    self.pause_start_ms = time.ticks_ms()
                self.playing = False
                audioplayer.pause()
                # No need to set audioplayer.set_volume(0) — the decode task
                # feeds silence to I2S DMA when paused (AP_PAUSED branch).
            else:
                if self.pause_start_ms:
                    self.paused_total_ms += time.ticks_diff(time.ticks_ms(), self.pause_start_ms)
                self.pause_start_ms = 0
                audioplayer.resume()
                self.playing = True
            await asyncio.sleep_ms(0)
        except Exception as e:
            print('[STREAMER] Error in toggle_pause: %s' % e)

    def play(self, source):
        """Automatically routes to HTTP streaming or local SD file chunking based on prefix."""
        if source.startswith('http://') or source.startswith('https://'):
            self.play_stream(source)
        else:
            self.play_local(source)

    def _transition_begin(self):
        """Mute DAC → pause decode task → clear buffers.  Called at the start
        of every track switch so the I2S DMA's stale PCM plays silently."""
        if self.codec:
            self.codec.set_volume(0)       # hardware-mute the DAC output
        audioplayer.pause()
        audioplayer.clear()                # abort fetch + flush ring/decoder

    def _transition_end(self):
        """Resume decode task → restore DAC volume.  New data flowing; unmute."""
        audioplayer.resume()
        self._apply_hw_volume(self.volume_pct)  # unmute after new data is queued
        self.pause_start_ms = 0
        self.paused_total_ms = 0
        self.play_start_ms = time.ticks_ms()
        self.playing = True

    def play_local(self, path):
        """Signals the background async local_pump to start extracting and piping chunks natively."""
        # Guard: if a URL is passed, route to stream instead of failing on os.stat()
        if path.startswith('http://') or path.startswith('https://'):
            self.play_stream(path)
            return

        self._play_gen += 1         # invalidate any in-flight local_pump iteration
        self._stop_requested = True  # break the old pump's inner while immediately
        self.path = path
        self._is_local = True
        self._playback_active = False

        # clear() aborts any live fetch_task in C (stream→local transition)
        # then flushes the ring buffer and decoder state.  No stop/start needed.
        # SKIP on fresh start: the decode task is blocked on EV_BUFFERED, so
        # pause() is a no-op and clear()'s redundant decoder reset can corrupt
        # state after a deinit/config/start cycle (same issue as play_stream).
        if self._playback_active or self.playing:
            self._transition_begin()
        self._stop_requested = False  # allow new pump iteration to proceed
        self._transition_end()
        self._playback_active = True

    def play_stream(self, url, prebuffer_pct=20, prebuffer_timeout_ms=5000):
        """Fire-and-forget native HTTP fetching offloaded completely to C hooks."""
        self._play_gen += 1         # invalidate any in-flight local_pump iteration
        self._stop_requested = True  # break old pump immediately
        self.path = url
        self._is_local = False

        # CRITICAL ORDER: stream() must be called BEFORE resume().
        # stream() resets the decoder internally (esp_audio_simple_dec_reset).
        # If resume() runs first, the decode task is actively calling
        # esp_audio_simple_dec_process() on core 1 — a concurrent reset
        # corrupts the decoder state and produces permanent silence.
        # With stream() before resume(), both clear() and stream() resets
        # happen while the decode task is paused (safe).
        #
        # SKIP _transition_begin on fresh start: when no track is active,
        # the decode task is blocked on EV_BUFFERED (not decoding), so
        # pause() is a no-op and clear() redundantly resets the decoder.
        # stream() handles all reset internally.  The redundant
        # esp_audio_simple_dec_reset() from clear() + stream() can corrupt
        # the decoder after a close/open cycle, causing "Not supported
        # format" errors on subsequent runs.
        if self._playback_active or self.playing:
            self._transition_begin()

        try:
            audioplayer.stream(url)
        except Exception as e:
            print("[STREAMER] stream() failed:", e)
            self._transition_end()
            return

        # Do not spin in Python waiting for prebuffer.
        # The native C player already keeps the decode task in AP_BUFFERING
        # and outputs silence until enough data has arrived (EV_BUFFERED).
        # A blocking Python wait here starves queue_pump/WebREPL for up to 5 s,
        # which is exactly what causes the watchdog trips and reconnects.

        self._transition_end()
        self._playback_active = True

    def stop(self):
        self._play_gen += 1
        self._stop_requested = True
        self.playing = False
        self._playback_active = False
        audioplayer.stop()

    def deinit(self):
        """Full teardown: stop playback, mute DAC, disable PA, release I2S.

        Call this before re-running the ScriptO or switching to a different
        audio script.  After deinit() the instance is unusable — create a
        new one via from_board().

        Safe to call from async finally blocks: if a newer AudioStreamer
        instance already owns the C singleton (rerun race), this is a no-op.
        """
        if self._gen != AudioStreamer._instance_gen:
            return  # a newer instance owns the C singleton — don't destroy it
        self.stop()
        # Mute DAC before killing clocks to avoid pop
        if self.codec:
            try:
                self.codec.set_volume(0)
            except Exception:
                pass
        # Disable power amplifier
        if self.pa_pin:
            try:
                self.pa_pin.value(0)
            except Exception:
                pass
        # Fully destroy the C singleton (event group, ap_player_t struct).
        # This ensures the next from_board() → config() + start() begins
        # with completely clean state — no stale decoder/event bits from
        # a previous session.
        audioplayer.deinit()

    def is_active(self):
        """Returns True if decoding engine is actively engaged on a track."""
        if not self._is_local:
            # Give the HTTP client 3 seconds to resolve DNS and start buffering
            if time.ticks_diff(time.ticks_ms(), self.play_start_ms) < 3000:
                return True
        # Poll native C status — covers both local and stream playback.
        # For local files the Python pump may have finished writing but the
        # C-side decode task and I2S DMA can still have buffered PCM to output.
        try:
            st = audioplayer.status()
            state = st.get('state', 'idle')
            if state != 'idle':
                return True
        except Exception:
            # Assume still active if status() fails (e.g., MemoryError).
            # Returning False would trigger auto-advance → new stream →
            # more memory pressure → death spiral.
            return True
        return self._playback_active

    def is_playing(self):
        return self.playing

    def elapsed_ms(self):
        """Returns accurate wall-clock ms since play started, minus any pauses."""
        if self.play_start_ms == 0:
            return 0
        now = time.ticks_ms()
        el = time.ticks_diff(now, self.play_start_ms) - self.paused_total_ms
        if self.pause_start_ms > 0:
            el -= time.ticks_diff(now, self.pause_start_ms)
        return max(0, el)

    async def local_pump(self):
        """Async polling loop for local file playback.  HTTP streams run
        entirely in C (fetch task) and do not need this pump."""
        while True:
            if not self._playback_active or not self._is_local or not self.path or self._stop_requested:
                await asyncio.sleep_ms(50)
                continue

            # Snapshot generation + path so we can detect if a new play call
            # superseded us while we were yielded at an await point.
            gen = self._play_gen
            active_path = self.path

            print('[STREAMER] Playing Local: %s' % active_path)
            f = None
            try:
                try:
                    os.stat(active_path)
                except OSError:
                    print('[STREAMER] File not found: %s' % active_path)
                    self._playback_active = False
                    continue

                f = open(active_path, 'rb')
                buf = bytearray(self.chunk_size)
                mv = memoryview(buf)

                while not self._stop_requested:
                    if not self.playing:
                        await asyncio.sleep_ms(50)
                        continue

                    # Direct ring buffer chunking with back-pressure handling
                    n = f.readinto(buf)
                    if n is None or n == 0:
                        break
                    
                    chunk = mv[:n]
                    off = 0
                    while off < n and not self._stop_requested:
                        if not self.playing:
                            await asyncio.sleep_ms(50)
                            continue
                        written = audioplayer.write(chunk[off:])
                        off += written
                        if written == 0:
                            await asyncio.sleep_ms(10)
                    
                    await asyncio.sleep_ms(0)

                # Signal C that no more data is coming — the decode task
                # will drain the ring buffer, output the final PCM samples
                # via I2S DMA, then transition to 'idle'.
                if not self._stop_requested and self._play_gen == gen:
                    audioplayer.flush()

                    # Wait for C to finish decoding + DMA output
                    _drain_ms = 0
                    _DRAIN_TIMEOUT = 20000
                    _DRAIN_POLL_MS = 100
                    while not self._stop_requested and _drain_ms < _DRAIN_TIMEOUT:
                        if self._play_gen != gen:
                            break
                        try:
                            _st = audioplayer.status()
                            if _st.get('state', 'idle') == 'idle':
                                break
                        except Exception:
                            break
                        await asyncio.sleep_ms(_DRAIN_POLL_MS)
                        _drain_ms += _DRAIN_POLL_MS

                    if self._play_gen == gen:
                        print('[STREAMER] Finished: %s' % active_path)

            except OSError as e:
                print('[STREAMER] Error reading %s: %s' % (active_path, e))

            finally:
                if f:
                    try:
                        f.close()
                    except:
                        pass
                # Only clear _playback_active if we're still the active track.
                # If play_stream() or play_local() was called during an await,
                # _play_gen has changed and _playback_active belongs to the new track.
                if self._play_gen == gen:
                    self._playback_active = False
                    print('[STREAMER] Local playback ended')

            await asyncio.sleep_ms(50)

    # ── Backward compatibility ──
    loop = local_pump
