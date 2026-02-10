
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'SD Card Test',
        version     = [2, 0, 0],
        category    = 'Hardware Tests',
        description = 'Mount SD card, test read/write, stress test (uses board manifest)',
        author      = 'jetpax'
    ),
    args = dict(
        mount_point = dict(
            label = 'Mount point:',
            type  = str,
            value = '/sd'
        ),
        stress_kb = dict(
            label = 'Stress test size (KB):',
            type  = int,
            value = 100
        ),
        freq_mhz = dict(
            label = 'Bus frequency (MHz):',
            type  = int,
            value = 4
        )
    )
)

# === END_CONFIG_PARAMETERS ===

from machine import Pin, SDCard
from lib.sys import board
import os, time, gc

print("\n=== SD Card Test ===\n")

# --- Board config ---
if not board.has("sdcard"):
    print("✗ No SD card configured for this board")
    raise SystemExit

sd_device = board.device('sdcard')
sd_bus = board.sdmmc('sdcard') if hasattr(board, 'sdmmc') else board.sdmmc('slot0')
width = 4 if hasattr(sd_bus, 'd3') else 1
power_ctrl = getattr(sd_device, 'power_control', {})
power_pin = power_ctrl.get('pin', None)
active_low = power_ctrl.get('active_low', True)

print(f"Board: {board.id.name}")
print(f"Slot 0, {width}-bit, power pin: {power_pin or 'none'}")

# --- Cleanup stale mounts from prior sessions ---
try:
    os.umount(args.mount_point)
    print(f"(unmounted stale {args.mount_point})")
except:
    pass
gc.collect()
time.sleep_ms(100)

# --- Power cycle ---
if power_pin is not None:
    print("\n[1/5] Power cycling...")
    p = Pin(power_pin, Pin.OUT)
    p.value(1 if active_low else 0)
    time.sleep_ms(500)
    p.value(0 if active_low else 1)
    time.sleep_ms(500)
    print("      ✓ Ready")
else:
    print("\n[1/5] No power control pin, skipping")

# --- Init (with retry) ---
print("\n[2/5] Initializing SD card...")

data_pins = (sd_bus.d0, sd_bus.d1, sd_bus.d2, sd_bus.d3) if width == 4 else (sd_bus.d0,)
freq_hz = args.freq_mhz * 1000000

for attempt in range(2):
    try:
        sd = SDCard(slot=0, width=width, sck=sd_bus.clk, cmd=sd_bus.cmd, data=data_pins, freq=freq_hz)
        print(f"      Bus freq: {args.freq_mhz}MHz")
        info = sd.info()
        capacity_mb = info[0] / (1024 * 1024)
        print(f"      ✓ {capacity_mb:.0f} MB card ({info[1]}B sectors)")
        break
    except OSError as e:
        if attempt == 0 and power_pin is not None:
            print(f"      ✗ {e} — retrying with longer power cycle...")
            p.value(1 if active_low else 0)
            time.sleep_ms(2000)
            p.value(0 if active_low else 1)
            time.sleep_ms(2000)
            gc.collect()
        else:
            raise

# --- Mount ---
print(f"\n[3/5] Mounting to {args.mount_point}...")
try:
    os.umount(args.mount_point)
except:
    pass
try:
    os.mkdir(args.mount_point)
except OSError:
    pass  # Already exists
os.mount(sd, args.mount_point)

stat = os.statvfs(args.mount_point)
total_mb = (stat[0] * stat[2]) / (1024**2)
free_mb = (stat[0] * stat[3]) / (1024**2)
print(f"      ✓ Mounted (Total: {total_mb:.0f} MB, Free: {free_mb:.0f} MB)")

files = os.listdir(args.mount_point)
print(f"      {len(files)} items: {', '.join(files[:5])}{'...' if len(files) > 5 else ''}")

# --- Read/Write ---
print("\n[4/5] Testing read/write...")
test_file = args.mount_point + "/_sd_test.txt"
test_data = f"SD Card Test @ {time.time()}\n"

try:
    with open(test_file, 'w') as f:
        f.write(test_data)
    with open(test_file, 'r') as f:
        verify = f.read()
    os.remove(test_file)
    if verify == test_data:
        print("      ✓ Write/Read/Delete OK")
    else:
        print("      ✗ Data mismatch!")
except OSError as e:
    print(f"      ✗ Failed: {e}")
    print(f"      Hint: try lowering freq_mhz (currently {args.freq_mhz})")
    print(f"\n=== FAILED (I/O error during write) ===")
    raise SystemExit

# --- Stress test ---
size_kb = args.stress_kb
print(f"\n[5/5] Stress test ({size_kb}KB)...")
chunk = 'ABCDEFGHIJ' * 100  # 1KB
stress_file = args.mount_point + "/_stress.bin"

t0 = time.ticks_ms()
with open(stress_file, 'w') as f:
    for i in range(size_kb):
        f.write(chunk)
t_write = time.ticks_diff(time.ticks_ms(), t0)

t0 = time.ticks_ms()
with open(stress_file, 'r') as f:
    data = f.read()
t_read = time.ticks_diff(time.ticks_ms(), t0)

os.remove(stress_file)

ok = len(data) == size_kb * 1000
w_speed = size_kb / (t_write / 1000) if t_write > 0 else 0
r_speed = size_kb / (t_read / 1000) if t_read > 0 else 0

print(f"      Write: {size_kb}KB in {t_write}ms ({w_speed:.0f} KB/s)")
print(f"      Read:  {len(data)//1000}KB in {t_read}ms ({r_speed:.0f} KB/s)")
print(f"      Verify: {'✓ PASS' if ok else '✗ FAIL'}")

print(f"\n=== {'SUCCESS' if ok else 'FAILED'} ===")
print(f"Card mounted at {args.mount_point}/")
print(f"To unmount: os.umount('{args.mount_point}')")
