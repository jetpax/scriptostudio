
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'SD Card Mount Test',
        version     = [1, 1, 0],
        category    = 'Hardware Tests',
        description = 'Mount SD card and test read/write',
        author      = 'jetpax'
    ),
    args = dict(
        mount_point = dict(
            label = 'Mount point:',
            type  = str,
            value = '/sd'
        ),
        test_write = dict(
            label = 'Test write operations:',
            type  = bool,
            value = True
        )
    )
)

# === END_CONFIG_PARAMETERS ===

from machine import Pin, SDCard
import os
import time
from lib import hw_config

print("\n=== SD Card Mount & Test ===\n")

# Load board configuration
print("[1/6] Loading board configuration...")
config = hw_config.init()
print(f"      Board: {config.get('board_name', 'Unknown')}")

# Get SD card hardware config
sd_hw = hw_config.get_hardware('sdcard')
if not sd_hw:
    print("      ✗ No SD card configuration found for this board")
    print("      Using default pins for SCRIPTO_P4...")
    sd_hw = {
        'pins': {
            'power': 45,
            'clk': 43,
            'cmd': 44,
            'd0': 39,
            'd1': 40,
            'd2': 41,
            'd3': 42
        },
        'slot': 0,
        'width': 4,
        'power_active_low': True
    }
else:
    # Normalize config from board JSON format
    # Calculate width from number of data pins
    pins = sd_hw.get('pins', {})
    width = 4 if 'd3' in pins else (1 if 'd0' in pins else 4)
    
    # Extract power control settings
    power_ctrl = sd_hw.get('power_control', {})
    power_pin = power_ctrl.get('pin', 45)
    power_active_low = power_ctrl.get('active_low', True)
    
    # Normalize to simpler structure
    sd_hw = {
        'pins': {
            'power': power_pin,
            'clk': pins.get('clk', 43),
            'cmd': pins.get('cmd', 44),
            'd0': pins.get('d0', 39),
            'd1': pins.get('d1', 40),
            'd2': pins.get('d2', 41),
            'd3': pins.get('d3', 42)
        },
        'slot': sd_hw.get('slot', 0),
        'width': width,
        'power_active_low': power_active_low
    }
    print("      ✓ Loaded from board configuration")

print(f"      Slot: {sd_hw['slot']}, Width: {sd_hw['width']}-bit")

# Power cycle the card
print("\n[2/6] Power cycling SD card...")
power_pin = sd_hw['pins']['power']
power_active_low = sd_hw.get('power_active_low', True)
sd_power = Pin(power_pin, Pin.OUT)
print("      Power OFF...")
sd_power.value(1 if power_active_low else 0)  # Disable power
time.sleep_ms(200)  # Wait for capacitors to discharge
print("      Power ON...")
sd_power.value(0 if power_active_low else 1)  # Enable power
time.sleep_ms(500)  # Wait for card to power up
print("      ✓ Power cycle complete")

# Initialize SD card
print("\n[3/6] Initializing SD card...")

# First, try to deinit any existing SD card instance
print("      Cleaning up any previous instances...")
try:
    import gc
    gc.collect()
    time.sleep_ms(200)
except:
    pass

print("      Creating SDCard object...")
try:
    # Get pins from config
    pins = sd_hw['pins']
    data_pins = (pins['d0'], pins['d1'], pins['d2'], pins['d3']) if sd_hw['width'] == 4 else (pins['d0'],)
    
    # Start with slow frequency for init, then speed up after mount
    sd = SDCard(
        slot=sd_hw['slot'],
        width=sd_hw['width'],
        sck=pins['clk'],  # Note: 'clk' in config, but 'sck' in SDCard API
        cmd=pins['cmd'],
        data=data_pins,
        freq=400000
    )
    print("      ✓ Object created")
    print("      Reading card info...")
    info = sd.info()
    capacity_gb = (info[0] * info[1]) / (1024**3)
    print(f"      ✓ {capacity_gb:.1f} GB card detected")
except Exception as e:
    print(f"      ✗ Failed: {e}")
    print("\n      This usually means:")
    print("        - Another SD card instance is still active")
    print("        - Please reset the board and try again")
    sd_power.value(1 if power_active_low else 0)
    raise

# Mount filesystem
print(f"\n[4/6] Mounting to {args.mount_point}...")
try:
    os.mount(sd, args.mount_point)
    print(f"      ✓ Mounted")
except Exception as e:
    print(f"      ✗ Failed: {e}")
    sd.deinit()
    sd_power.value(1 if power_active_low else 0)
    raise

# Check filesystem
print("\n[5/6] Checking filesystem...")
try:
    print("      Getting statvfs...")
    stat = os.statvfs(args.mount_point)
    total_mb = (stat[0] * stat[2]) / (1024**2)
    free_mb = (stat[0] * stat[3]) / (1024**2)
    used_mb = total_mb - free_mb
    
    print(f"      Total: {total_mb:.0f} MB")
    print(f"      Free:  {free_mb:.0f} MB")
    print(f"      Used:  {used_mb:.0f} MB ({used_mb/total_mb*100:.1f}%)")
    
    print("      Listing directory...")
    import time
    time.sleep_ms(100)  # Small delay before listing
    
    try:
        files = os.listdir(args.mount_point)
        print(f"      ✓ Found {len(files)} items")
        
        if files:
            print("      Contents:")
            for i, f in enumerate(files[:10]):
                try:
                    print(f"        - {f}")
                except:
                    print(f"        - [non-ASCII filename, {len(f)} bytes]")
                if i < len(files) - 1:
                    time.sleep_ms(50)  # Small delay between items
            if len(files) > 10:
                print(f"        ...and {len(files)-10} more")
    except UnicodeError as ue:
        print("      ✗ UnicodeError: SD card contains non-ASCII filenames")
        print("      This is a MicroPython limitation - FAT32 filenames must be ASCII")
        print("      Suggestion: Format card or remove files with special characters")
    except Exception as e2:
        print(f"      ✗ Failed: {e2}")
        import sys
        sys.print_exception(e2)
except Exception as e:
    print(f"      ✗ Failed: {e}")
    import sys
    sys.print_exception(e)

# Test write
if args.test_write:
    print("\n[6/6] Testing write operations...")
    test_file = args.mount_point + "/scripto_test.txt"
    test_data = f"ScriptO Studio SD Card Test\nTimestamp: {time.time()}\n"
    
    try:
        # Write
        with open(test_file, 'w') as f:
            f.write(test_data)
        print("      ✓ Write OK")
        
        # Read back
        with open(test_file, 'r') as f:
            read_data = f.read()
        
        if read_data == test_data:
            print("      ✓ Read OK - data verified")
        else:
            print("      ✗ Read data mismatch")
        
        # Cleanup
        os.remove(test_file)
        print("      ✓ Delete OK")
        
    except Exception as e:
        print(f"      ✗ Failed: {e}")
else:
    print("\n[6/6] Skipping write test")

print("\n=== SUCCESS ===")
print(f"SD card is mounted at {args.mount_point}/")
print("\nYou can now:")
print(f"  - Browse files: os.listdir('{args.mount_point}')")
print(f"  - View in file explorer")
print(f"  - Unmount when done: os.umount('{args.mount_point}')")
