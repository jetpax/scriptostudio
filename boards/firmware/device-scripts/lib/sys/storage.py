"""
Storage Manager — SD card detection and mount.

Generic infrastructure for SD-aware storage. App-specific paths
and migration logic belong in the consuming application.

Usage:
    from lib.sys.storage import has_sdcard, sd_root
"""
import os

# Module-level SD card object
_sd_card = None

# Root prefix: '' for flash, '/sd' for SD card
_sd_root = ''


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
    sd_bus = board.sdmmc('sdcard')
  except KeyError:
    return False

  slot = getattr(sd_bus, 'slot', 0)
  width = 4 if hasattr(sd_bus, 'd3') else 1

  # Power cycle if board defines power_control
  power_ctrl = getattr(sd_device, 'power_control', None)
  if power_ctrl:
    from machine import Pin
    import time
    pin_num = power_ctrl.get('pin') if isinstance(power_ctrl, dict) else getattr(power_ctrl, 'pin', None)
    active_low = power_ctrl.get('active_low', True) if isinstance(power_ctrl, dict) else getattr(power_ctrl, 'active_low', True)
    if pin_num is not None:
      p = Pin(pin_num, Pin.OUT)
      p.value(1 if active_low else 0)  # power off
      time.sleep_ms(200)
      p.value(0 if active_low else 1)  # power on
      time.sleep_ms(500)

  # Mount SD card
  try:
    from machine import SDCard
    import time
    time.sleep_ms(200)

    if width == 4:
      data_pins = (sd_bus.d0, sd_bus.d1, sd_bus.d2, sd_bus.d3)
    else:
      data_pins = (sd_bus.d0,)

    sd = SDCard(
      slot=slot, width=width,
      sck=sd_bus.clk, cmd=sd_bus.cmd,
      data=data_pins, freq=4000000
    )

    try:
      os.mkdir('/sd')
    except:
      pass
    os.mount(sd, '/sd')

    global _sd_card
    _sd_card = sd

    info = sd.info()
    cap_gb = info[0] / (1024**3)
    _log("info", f"SD card mounted ({cap_gb:.1f} GB)")
    return True
  except Exception as e:
    _log("info", f"SD card not available: {e}")
    return False


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
