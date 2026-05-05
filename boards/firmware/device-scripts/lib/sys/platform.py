"""
Port shim — one place that names the SDK.

Callers stop saying `import esp32` / `import esp` inline. board.json is
still the truth for "what's wired up" (pins, capabilities); this file
is the truth for "which SDK is here."

API:
    port()              -> str            ('esp32', 'rp2', ...)
    cpu_temp()          -> float | None   die temperature, °C
    flash_size()        -> int | None     total flash bytes
    psram_info()        -> dict | None    {'total': int, 'free': int}
    flash_partitions()  -> list           [] when not supported
"""
import sys

_PORT = sys.platform

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
