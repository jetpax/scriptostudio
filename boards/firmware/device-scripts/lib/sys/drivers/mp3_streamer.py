"""
mp3_streamer.py - Unified Audio Streamer Driver

Provides a centralized class managing the state machine, hardware volume pairing, 
and background streaming workflows for the MicroPython native audioplayer.

Usage (Local SD MP3):
    from lib.sys.drivers.mp3_streamer import AudioStreamer
    player = AudioStreamer(es8311, start_volume=80)
    bg_tasks.start('audio_pump', player.loop)
    player.play_local('/sd/music.mp3')

Usage (Web Radio HTTP):
    from lib.sys.drivers.mp3_streamer import AudioStreamer
    player = AudioStreamer(es8311, start_volume=80)
    player.play_stream('http://discodiamond.radioca.st/stream')
"""

import audioplayer
import asyncio
import time
import os

class AudioStreamer:
    def __init__(self, codec=None, start_volume=80, chunk_size=8192):
        self.codec = codec
        self.volume_pct = start_volume
        self.chunk_size = chunk_size
        
        self.playing = False
        self._stop_requested = False
        self._playback_active = False
        self._is_local = True
        
        self.path = None
        self.pause_start_ms = 0
        self.paused_total_ms = 0
        self.play_start_ms = 0
        
        self.set_volume(self.volume_pct)

    def set_volume(self, pct):
        """Update both hardware DAC (if assigned) and software PCM limits."""
        self.volume_pct = max(0, min(100, pct))
        if self.codec and hasattr(self.codec, 'set_volume'):
            self.codec.set_volume(self.volume_pct)
        audioplayer.set_volume(100)

    async def toggle_pause(self):
        try:
            if self.playing:
                if self.pause_start_ms == 0:
                    self.pause_start_ms = time.ticks_ms()
                self.playing = False
                audioplayer.pause()
                audioplayer.set_volume(0)  # Silence PCM output instantly
            else:
                if self.pause_start_ms:
                    self.paused_total_ms += time.ticks_diff(time.ticks_ms(), self.pause_start_ms)
                self.pause_start_ms = 0
                audioplayer.set_volume(100)
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
        self.set_volume(self.volume_pct)   # unmute after new data is queued
        self.pause_start_ms = 0
        self.paused_total_ms = 0
        self.play_start_ms = time.ticks_ms()
        self.playing = True

    def play_local(self, path):
        """Signals the background async loop to start extracting and piping chunks natively."""
        # Guard: if a URL is passed, route to stream instead of failing on os.stat()
        if path.startswith('http://') or path.startswith('https://'):
            self.play_stream(path)
            return

        self.path = path
        self._is_local = True
        self._stop_requested = False
        self._playback_active = False

        # clear() aborts any live fetch_task in C (stream→local transition)
        # then flushes the ring buffer and decoder state.  No stop/start needed.
        self._transition_begin()
        self._transition_end()
        self._playback_active = True

    def play_stream(self, url):
        """Fire-and-forget native HTTP fetching offloaded completely to C hooks."""
        self.path = url
        self._is_local = False
        self._stop_requested = False

        # CRITICAL ORDER: stream() must be called BEFORE resume().
        # stream() resets the decoder internally (esp_audio_simple_dec_reset).
        # If resume() runs first, the decode task is actively calling
        # esp_audio_simple_dec_process() on core 1 — a concurrent reset
        # corrupts the decoder state and produces permanent silence.
        # With stream() before resume(), both clear() and stream() resets
        # happen while the decode task is paused (safe).
        self._transition_begin()

        try:
            audioplayer.stream(url)
        except Exception as e:
            print("[STREAMER] stream() failed:", e)
            self._transition_end()
            return

        self._transition_end()
        self._playback_active = True

    def stop(self):
        self._stop_requested = True
        self.playing = False
        self._playback_active = False
        audioplayer.stop()

    def is_active(self):
        """Returns True if decoding engine is actively engaged on a track."""
        if not self._is_local:
            # Give the HTTP client 3 seconds to resolve DNS and start buffering
            if time.ticks_diff(time.ticks_ms(), self.play_start_ms) < 3000:
                return True
            # Poll native C status for HTTP streams
            try:
                st = audioplayer.status()
                state = st.get('state', 'idle')
                return state != 'idle'
            except Exception:
                return False
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

    async def loop(self):
        """Async polling loop. Safely bridges MicroPython File I/O natively down to the C pipeline."""
        while True:
            if not self._playback_active or not self._is_local or not self.path or self._stop_requested:
                await asyncio.sleep_ms(50)
                continue

            print('[STREAMER] Playing Local: %s' % self.path)
            f = None
            try:
                try:
                    os.stat(self.path)
                except OSError:
                    print('[STREAMER] File not found: %s' % self.path)
                    self._playback_active = False
                    continue

                f = open(self.path, 'rb')
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

                # Ring buffer drain handling before track completion
                if not self._stop_requested:
                    _drain_ms = 0
                    _DRAIN_TIMEOUT = 20000
                    _DRAIN_POLL_MS = 80
                    while not self._stop_requested and _drain_ms < _DRAIN_TIMEOUT:
                        if not self.playing:
                            await asyncio.sleep_ms(_DRAIN_POLL_MS)
                            continue
                        try:
                            _st = audioplayer.status()
                            _fill = _st.get('buffer_fill', 0)
                        except Exception:
                            _fill = 0
                        if _fill <= 5:
                            break
                        await asyncio.sleep_ms(_DRAIN_POLL_MS)
                        _drain_ms += _DRAIN_POLL_MS

                    print('[STREAMER] Finished: %s' % self.path)
            
            except OSError as e:
                print('[STREAMER] Error reading %s: %s' % (self.path, e))
            
            finally:
                if f:
                    try:
                        f.close()
                    except:
                        pass
                self._playback_active = False
                print('[STREAMER] Local playback ended')

            await asyncio.sleep_ms(50)
