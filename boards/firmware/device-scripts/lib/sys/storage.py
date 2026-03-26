"""
Storage Manager — SD card detection, path resolution, migration.

Single source of truth for data storage paths.
Import AFTER boot sequence has attempted SD card mount.

Usage:
    from lib.sys.storage import SESSIONS_DIR, IMAGES_DIR, has_sdcard
"""
import os

# Module-level SD card object (replaces builtins.sd to avoid creating builtins module)
_sd_card = None

# Defaults (flash fallback — /pfc on root VFS partition)
DATA_DIR = '/pfc'
SESSIONS_DIR = '/pfc/sessions'
IMAGES_DIR = '/pfc/images'
MEMORY_DIR = '/pfc/memory'
SKILLS_DIR = '/pfc/skills'
STATE_DIR = '/pfc/state'


def has_sdcard():
  """Is a real SD card mounted (not just a flash directory)?"""
  return _sd_card is not None


def get_sd_card():
  """Get the mounted SDCard object, or None if not mounted."""
  return _sd_card


def init():
  """Called after SD card mount attempt. Resolves paths and migrates.
  Must be called once during boot, after mount_sdcard()."""
  global DATA_DIR, SESSIONS_DIR, IMAGES_DIR, MEMORY_DIR, SKILLS_DIR, STATE_DIR

  if has_sdcard():
    DATA_DIR = '/sd/pfc'
    SESSIONS_DIR = '/sd/pfc/sessions'
    IMAGES_DIR = '/sd/pfc/images'
    MEMORY_DIR = '/sd/pfc/memory'
    SKILLS_DIR = '/sd/pfc/skills'
    STATE_DIR = '/sd/pfc/state'
    _migrate_flash_to_sd()

  # Ensure directories exist on whichever storage we're using
  for d in [DATA_DIR, SESSIONS_DIR, IMAGES_DIR, MEMORY_DIR, SKILLS_DIR, STATE_DIR]:
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
    'data_dir': DATA_DIR,
  }


# Soul/identity files that migrate to SD (user-mutable, portable).
# config.json, AGENTS.md, TOOLS.md stay on flash (firmware-deployed / system).
_SOUL_FILES = (
  'SOUL.md', 'IDENTITY.md', 'USER.md', 'MEMORY.md',
  'HEARTBEAT.md', 'BOOTSTRAP.md',
)


def _migrate_flash_to_sd():
  """One-time boot migration: /pfc → /sd/pfc.

  Migrates:
    - Soul/identity .md files (user-mutable, portable)
    - Subdirectories: sessions/, images/, memory/, skills/, state/
  Keeps on flash:
    - config.json (API keys — don't put on removable media)
    - AGENTS.md, TOOLS.md (firmware-deployed system files)
  """
  # Ensure /sd/pfc exists
  try:
    os.mkdir('/sd/pfc')
  except:
    pass

  # Migrate individual soul files
  migrated = 0
  for fname in _SOUL_FILES:
    src = f'/pfc/{fname}'
    dst = f'/sd/pfc/{fname}'
    try:
      os.stat(dst)  # Already exists on SD — skip
      continue
    except:
      pass
    try:
      with open(src, 'rb') as f:
        data = f.read()
      with open(dst, 'wb') as f:
        f.write(data)
      migrated += 1
    except:
      pass  # Source doesn't exist or write failed — skip
  if migrated:
    _log("info", f"Migrated {migrated} soul files to SD")

  # Migrate subdirectories
  for subdir in ('sessions', 'images', 'memory', 'skills', 'state'):
    src = f'/pfc/{subdir}'
    dst = f'/sd/pfc/{subdir}'
    try:
      files = os.listdir(src)
    except:
      continue
    if not files:
      continue
    try:
      os.mkdir(dst)
    except:
      pass
    dir_migrated = 0
    for fname in files:
      src_path = f'{src}/{fname}'
      dst_path = f'{dst}/{fname}'
      try:
        os.stat(dst_path)  # Already on SD — skip
        continue
      except:
        pass
      try:
        with open(src_path, 'rb') as f:
          data = f.read()
        with open(dst_path, 'wb') as f:
          f.write(data)
        os.remove(src_path)
        dir_migrated += 1
      except:
        pass  # Skip on error — don't lose data
    if dir_migrated:
      _log("info", f"Migrated {dir_migrated} files {src} → {dst}")


def _log(level, msg):
  """Log with lazy import to avoid circular deps at boot."""
  try:
    from lib.sys.log import log
    log(level, f"STORAGE: {msg}", source="sys")
  except:
    print(f"[STORAGE] {msg}")
