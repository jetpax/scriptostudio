"""
Port shim — one place that names the SDK.

Callers stop saying `import esp32` / `import esp` inline. board.json is
still the truth for "what's wired up" (pins, capabilities); this file
is the truth for "which SDK is here."

API:
    port()                       -> str            ('esp32', 'rp2', 'zephyr', ...)
    cpu_temp()                   -> float | None   die temperature, °C
    flash_size()                 -> int | None     total flash bytes
    psram_info()                 -> dict | None    {'total': int, 'free': int}
    flash_partitions()           -> list           [] when not supported
    osdebug(level)               -> None           routes esp.osdebug on ESP32, no-op elsewhere
    uname()                      -> uname-like     os.uname() where native, synthesized on Zephyr
    verify_memory_requirements() -> (bool, str)    PSRAM/heap sanity check

Log levels for osdebug() — mirror the values in ESP-IDF's esp_log.h so
existing ESP32 callers keep working unchanged.
"""
import sys

_PORT = sys.platform

LOG_NONE    = 0
LOG_ERROR   = 1
LOG_WARNING = 2
LOG_INFO    = 3
LOG_DEBUG   = 4
LOG_VERBOSE = 5

# SDK imports happen once, at module load, gated by port. After this block
# the rest of the file references _esp32 / _esp / _machine without further
# port checks except where the API differs.
_esp32 = None
_esp = None
_machine = None

if _PORT == 'esp32':
  try:
    import esp32 as _esp32
  except ImportError:
    pass
  try:
    import esp as _esp
  except ImportError:
    pass

if _PORT == 'rp2':
  try:
    import machine as _machine
  except ImportError:
    pass


def port():
  return _PORT


def cpu_temp():
  """Die temperature in °C, or None if unsupported on this port."""
  if _esp32 is not None:
    try:
      return _esp32.mcu_temperature()
    except (OSError, AttributeError):
      return None
  if _machine is not None:
    # RP2040/RP2350 internal sensor on ADC channel 4. Datasheet formula.
    try:
      v = _machine.ADC(4).read_u16() * 3.3 / 65535
      return 27 - (v - 0.706) / 0.001721
    except (OSError, ValueError):
      return None
  return None


def flash_size():
  """Total flash size in bytes, or None if neither the SDK nor board.json
  exposes it."""
  if _esp is not None:
    try:
      return _esp.flash_size()
    except (OSError, AttributeError):
      pass
  return _manifest_int('flash', 'size_bytes')


def psram_info():
  """{'total': int, 'free': int|None} or None if no PSRAM.

  ESP32 reports live total+free via idf_heap_info; rp2's PSRAM is merged
  into the GC heap so only total (from board.json) is recoverable here.
  """
  if _esp32 is not None and hasattr(_esp32, 'idf_heap_info'):
    try:
      regions = _esp32.idf_heap_info(0x80)  # MALLOC_CAP_SPIRAM
    except (OSError, ValueError):
      regions = None
    if regions:
      total = sum(r[0] for r in regions)
      if total > 0:
        return {'total': total, 'free': sum(r[1] for r in regions)}
  total = _manifest_int('psram', 'size_bytes')
  if total:
    return {'total': total, 'free': None}
  return None


def _manifest_int(section, key):
  """Read resources.<section>.<key> from /settings/board.json, or None."""
  try:
    from lib.sys import board
    return getattr(getattr(board, section)(), key)
  except (ImportError, AttributeError, OSError, KeyError):
    return None


def flash_partitions():
  """List of partition info tuples, [] when the port has no partitions."""
  if _esp32 is not None and hasattr(_esp32, 'Partition'):
    try:
      P = _esp32.Partition
      return ([p.info() for p in P.find(P.TYPE_APP)] +
              [p.info() for p in P.find(P.TYPE_DATA)])
    except (OSError, AttributeError):
      pass
  return []


def osdebug(level):
  """Set the SDK log level (where it's a concept). No-op on ports without one."""
  if _esp is not None:
    try:
      _esp.osdebug(level)
    except (OSError, AttributeError):
      pass


class _Uname:
  """uname()-like result: indexable AND attribute-accessible, matches MP's `os.uname()`."""
  __slots__ = ('sysname', 'nodename', 'release', 'version', 'machine')

  def __init__(self, sysname, nodename, release, version, machine):
    self.sysname = sysname
    self.nodename = nodename
    self.release = release
    self.version = version
    self.machine = machine

  def __getitem__(self, i):
    return (self.sysname, self.nodename, self.release, self.version, self.machine)[i]

  def __repr__(self):
    return ("(sysname='%s', nodename='%s', release='%s', version='%s', machine='%s')"
            % (self.sysname, self.nodename, self.release, self.version, self.machine))


def uname():
  """Return a uname-like result. Wraps `os.uname()` where the port has it,
  synthesizes one from `sys.implementation` + `/firmware-version.json` otherwise.
  The result supports both indexing and attribute access, matching MP's API."""
  import os
  try:
    return os.uname()
  except AttributeError:
    pass

  impl = sys.implementation
  try:
    release = '.'.join(str(x) for x in impl.version)
  except (AttributeError, TypeError):
    release = ''
  version = getattr(impl, '_machine', '') or ''

  machine = _PORT
  try:
    import json
    with open('/firmware-version.json') as _f:
      _data = json.load(_f)
      machine = _data.get('variant') or _data.get('platform') or _PORT
  except (OSError, ValueError):
    pass

  return _Uname(_PORT, _PORT, release, version, machine)


def verify_memory_requirements():
  """Returns (ok, message). Replaces the historical ESP32-only PSRAM hard-check.

  ESP32-S3 firmwares assume PSRAM (>4 MiB heap); without it, networking and
  WebREPL buffers won't fit. Other ports always have enough RAM (rp2 with
  PSRAM-init, Zephyr with full DRAM-backed heap)."""
  import gc
  gc.collect()
  total = gc.mem_alloc() + gc.mem_free()
  if _PORT == 'esp32' and total < 1_000_000:
    return False, "PSRAM not detected (heap=%d bytes); ESP32-S3 with PSRAM required" % total
  return True, "heap=%d bytes" % total
