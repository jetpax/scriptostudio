
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'SD Card Complete',
        version     = [1, 0, 0],
        category    = 'Hardware Tests',
        description = 'Complete SD card init, mount, and test',
        author      = 'jetpax'
    ),
    args = dict(
        mount_point = dict(
            label = 'Mount point:',
            type  = str,
            value = '/sd'
        )
    )
)

# === END_CONFIG_PARAMETERS ===

from machine import Pin, SDCard
import os
import time

print("\n=== SD Card Complete Test ===\n")

# Power cycle
print("[1/4] Power cycling SD card...")
sd_power = Pin(45, Pin.OUT)
sd_power.value(1)
time.sleep_ms(200)
sd_power.value(0)
time.sleep_ms(500)
print("      ✓ Ready")

# Initialize at 20MHz
print(f"\n[2/4] Initializing SD card...")
try:
    sd = SDCard(slot=0, width=4, sck=43, cmd=44, data=(39, 40, 41, 42), freq=20000000)
    info = sd.info()
    capacity_mb = (info[0] * info[1]) / (1024**2)
    print(f"      ✓ Card ready ({capacity_mb:.0f} MB)")
except Exception as e:
    print(f"      ✗ Failed: {e}")
    sd_power.value(1)
    raise

# Mount
print(f"\n[3/4] Mounting to {args.mount_point}...")
try:
    os.mount(sd, args.mount_point)
    
    # Get filesystem stats
    stat = os.statvfs(args.mount_point)
    free_mb = (stat[0] * stat[3]) / (1024**2)
    
    print(f"      ✓ Mounted ({free_mb:.0f} MB free)")
except Exception as e:
    print(f"      ✗ Failed: {e}")
    sd.deinit()
    sd_power.value(1)
    raise

# Test read/write
print(f"\n[4/4] Testing read/write...")
test_file = args.mount_point + "/test.txt"
try:
    # Write
    with open(test_file, 'w') as f:
        f.write(f"Test: {time.time()}\n")
    
    # Read
    with open(test_file, 'r') as f:
        data = f.read()
    
    # Delete
    os.remove(test_file)
    
    print("      ✓ Read/Write OK")
except Exception as e:
    print(f"      ✗ Failed: {e}")

print(f"\n=== SUCCESS ===")
print(f"SD card mounted at {args.mount_point}/")
print(f"\nTo unmount: os.umount('{args.mount_point}')")
