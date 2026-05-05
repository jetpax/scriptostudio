"""
Storage Manager — SD card detection, mount, and recovery.

Generic infrastructure for SD-aware storage. App-specific paths
and migration logic belong in the consuming application.

Usage:
    from lib.sys.storage import has_sdcard, sd_root, sd_recover

Concurrency:
    SD operations that want to be race-safe against sd_recover() should
    run under the shared sd_lock. sd_recover_async() acquires it around
    the unmount/remount window; a file op that also acquires it will
    wait for recovery to finish (and vice versa) rather than hitting the
    SDMMC driver while its queue semaphore is NULL.

        from lib.sys.storage import sd_lock
        async with sd_lock:
            with open('/sd/foo') as f: ...
"""
import os

try:
  import asyncio
  sd_lock = asyncio.Lock()
except ImportError:
  asyncio = None
  sd_lock = None

# Module-level SD card object
_sd_card = None

# Root prefix: '' for flash, '/sd' for SD card
_sd_root = ''

# Cached mount parameters for recovery (set by mount_sdcard)
_mount_params = None


def has_sdcard():
  """Is a real SD card mounted (not just a flash directory)?"""
  return _sd_card is not None


def sd_root():
  """Get storage root prefix: '' for flash, '/sd' for SD card.

  Apps build their own paths: f"{sd_root()}/myapp/data"
  """
  return _sd_root


def get_sd_card():
  """Get the mounted SDCard object, or None if not mounted."""
  return _sd_card


def init():
  """Called after SD card mount attempt. Sets sd_root.
  Must be called once during boot, after mount_sdcard()."""
  global _sd_root
  if has_sdcard():
    _sd_root = '/sd'


def mount_sdcard():
  """Attempt SD card mount. Called from main.py boot sequence.
  If board has sdcard capability, always try. Silent fail if no card."""
  try:
    from lib.sys import board
  except ImportError:
    return False

  if not board.has("sdcard"):
    return False

  try:
    sd_device = board.device('sdcard')
  except KeyError:
    return False

  pc = getattr(sd_device, 'power_control', None)
  if isinstance(pc, dict) and pc.get('pin') is not None:
    from machine import Pin
    import time
    pin = Pin(pc['pin'], Pin.OUT)
    active_low = pc.get('active_low', True)
    pin.value(1 if active_low else 0)
    time.sleep_ms(200)
    pin.value(0 if active_low else 1)
    time.sleep_ms(500)

  if sd_device.type == 'sd_spi':
    params = _build_sd_spi_params(sd_device, board)
  else:
    params = _build_sd_sdmmc_params(sd_device, board)
  if params is None:
    return False

  return _do_mount(params)


def _build_sd_sdmmc_params(sd_device, board):
  try:
    sd_bus = board.sdmmc('sdcard')
  except KeyError:
    return None
  width = 4 if hasattr(sd_bus, 'd3') else 1
  data_pins = (sd_bus.d0, sd_bus.d1, sd_bus.d2, sd_bus.d3) if width == 4 else (sd_bus.d0,)
  return {
    'kind': 'sdmmc',
    'slot': getattr(sd_bus, 'slot', 0),
    'width': width,
    'sck': sd_bus.clk,
    'cmd': sd_bus.cmd,
    'data': data_pins,
    'freq': 4_000_000,
  }


def _build_sd_spi_params(sd_device, board):
  d = sd_device._data
  spi_name = d.get('spi_bus')
  if not spi_name:
    return None
  try:
    bus = board.spi(spi_name)
  except KeyError:
    return None
  return {
    'kind': 'spi',
    'spi_id': int(spi_name.replace('spi', '')),
    'sck': bus.sck,
    'mosi': bus.mosi,
    'miso': bus.miso,
    'cs': d['cs'],
    'baud': 4_000_000,
  }


def _do_mount(params):
  """Build the SDCard object and mount it. Used by both mount_sdcard()
  and sd_recover()."""
  global _sd_card, _mount_params
  try:
    if params.get('kind') == 'spi':
      sd = _build_sdcard_spi(params)
    else:
      sd = _build_sdcard_sdmmc(params)
    if sd is None:
      return False

    try:
      os.mkdir('/sd')
    except:
      pass
    os.mount(sd, '/sd')

    _sd_card = sd
    _mount_params = params

    try:
      info = sd.info()
      _log("info", f"SD card mounted ({info[0] / (1024**3):.1f} GB)")
    except (AttributeError, OSError):
      _log("info", "SD card mounted")
    return True
  except Exception as e:
    _log("info", f"SD card not available: {e}")
    return False


def _build_sdcard_sdmmc(params):
  from machine import SDCard
  import time
  time.sleep_ms(200)
  return SDCard(
    slot=params['slot'], width=params['width'],
    sck=params['sck'], cmd=params['cmd'],
    data=params['data'], freq=params['freq']
  )


def _build_sdcard_spi(params):
  from machine import Pin, SPI
  try:
    from sdcard import SDCard
  except ImportError:
    _log("warn", "sdcard driver missing — add require(\"sdcard\") to firmware manifest")
    return None
  spi = SPI(params['spi_id'], baudrate=params['baud'],
            sck=Pin(params['sck']), mosi=Pin(params['mosi']),
            miso=Pin(params['miso']))
  cs = Pin(params['cs'], Pin.OUT, value=1)
  return SDCard(spi, cs)


def _recover_inner():
  """Do the actual unmount + remount. Callers must serialize via sd_lock
  if they want race safety against concurrent SD operations."""
  global _sd_card
  if _mount_params is None:
    _log("warn", "SD recovery: no mount params cached")
    return False

  _log("info", "SD recovery: unmounting stale card...")

  # Unmount stale filesystem — this frees the SDMMC host's internal
  # queue semaphore. Any concurrent reader between here and the
  # _do_mount() below will dereference a NULL handle and crash
  # (LoadProhibited at offset 0x54). The lock in sd_recover_async()
  # prevents that for cooperating callers.
  try:
    os.umount('/sd')
  except:
    pass

  _sd_card = None

  ok = _do_mount(_mount_params)
  if ok:
    _log("info", "SD recovery: remounted OK")
  else:
    _log("warn", "SD recovery: remount failed")
  return ok


async def sd_recover_async():
  """Recover from SD card EIO — async, lock-safe variant.

  Acquires sd_lock around the unmount/remount. Other coroutines that
  also hold sd_lock during their SD operations will wait for recovery
  to complete instead of racing the SDMMC host teardown.

  Returns True if recovery succeeded, False if not.
  """
  if sd_lock is None:
    return _recover_inner()
  async with sd_lock:
    return _recover_inner()


def sd_recover():
  """Recover from SD card EIO — sync variant. No locking.

  Safe to call only from boot-time code or contexts where no event loop
  is running. Callers with a running loop should use sd_recover_async()
  to avoid racing in-flight SD operations.

  Usage:
      try:
          f = open('/sd/pfc/data.txt', 'w')
          ...
      except OSError as e:
          if e.errno == 5 and sd_recover():
              # retry the operation
  """
  return _recover_inner()


def get_storage_info():
  """Storage info dict for gateway_status and system prompt."""
  path = '/sd' if has_sdcard() else '/'
  try:
    stat = os.statvfs(path)
    total = stat[0] * stat[2]
    free = stat[0] * stat[3]
  except:
    total = free = 0
  return {
    'type': 'sdcard' if has_sdcard() else 'flash',
    'total_mb': total // (1024 * 1024),
    'free_mb': free // (1024 * 1024),
  }


def _log(level, msg):
  """Log with lazy import to avoid circular deps at boot."""
  try:
    from lib.sys.log import log
    log(level, f"STORAGE: {msg}", source="sys")
  except:
    print(f"[STORAGE] {msg}")
