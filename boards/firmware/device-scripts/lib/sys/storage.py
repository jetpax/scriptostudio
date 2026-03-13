"""
Storage Manager — SD card detection, path resolution, migration.

Single source of truth for data storage paths.
Import AFTER boot sequence has attempted SD card mount.

Usage:
    from lib.sys.storage import SESSIONS_DIR, IMAGES_DIR, has_sdcard
"""
import os

# Defaults (flash fallback — /pfc on root VFS partition)
DATA_DIR = '/pfc'
SESSIONS_DIR = '/pfc/sessions'
IMAGES_DIR = '/pfc/images'


def has_sdcard():
  """Is a real SD card mounted (not just a flash directory)?"""
  try:
    import builtins
    return hasattr(builtins, 'sd')
  except:
    return False


def init():
  """Called after SD card mount attempt. Resolves paths and migrates.
  Must be called once during boot, after mount_sdcard()."""
  global DATA_DIR, SESSIONS_DIR, IMAGES_DIR

  if has_sdcard():
    DATA_DIR = '/sd/pfc'
    SESSIONS_DIR = '/sd/pfc/sessions'
    IMAGES_DIR = '/sd/pfc/images'
    _migrate_flash_to_sd()

  # Ensure directories exist on whichever storage we're using
  for d in [DATA_DIR, SESSIONS_DIR, IMAGES_DIR]:
    try:
      os.mkdir(d)
    except:
      pass


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

    import builtins
    builtins.sd = sd

    info = sd.info()
    cap_gb = (info[0] * info[1]) / (1024**3)
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
    'data_dir': DATA_DIR,
  }


def _migrate_flash_to_sd():
  """One-time boot migration: /pfc/sessions|images → /sd/pfc/."""
  for subdir in ('sessions', 'images'):
    src = f'/pfc/{subdir}'
    dst = f'/sd/pfc/{subdir}'
    try:
      files = os.listdir(src)
    except:
      continue
    if not files:
      continue
    # Ensure destination tree
    for d in ['/sd/pfc', dst]:
      try:
        os.mkdir(d)
      except:
        pass
    # Copy each file then remove original
    migrated = 0
    for fname in files:
      src_path = f'{src}/{fname}'
      dst_path = f'{dst}/{fname}'
      try:
        with open(src_path, 'rb') as f:
          data = f.read()
        with open(dst_path, 'wb') as f:
          f.write(data)
        os.remove(src_path)
        migrated += 1
      except:
        pass  # Skip on error — don't lose data
    if migrated:
      _log("info", f"Migrated {migrated} files {src} → {dst}")


def _log(level, msg):
  """Log with lazy import to avoid circular deps at boot."""
  try:
    from lib.sys.log import log
    log(level, f"STORAGE: {msg}", source="sys")
  except:
    print(f"[STORAGE] {msg}")
