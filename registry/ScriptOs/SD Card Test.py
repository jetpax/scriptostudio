
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'SD Card Test',
        version     = [1, 1, 0],
        category    = 'Hardware Tests',
        description = 'Test SD card on Scripto P4+C6 - Diagnostics',
        author      = 'jetpax'
    ),
    args = dict()
)

# === END_CONFIG_PARAMETERS ===

from machine import Pin
import time

print("\n=== SD Card Hardware Diagnostic ===\n")

# Step 1: Test power control
print("[1/3] Testing power control (GPIO45)...")
sd_power = Pin(45, Pin.OUT)

print("      Setting GPIO45 HIGH (power OFF)...")
sd_power.value(1)
time.sleep_ms(100)
print("      GPIO45 =", sd_power.value())

print("      Setting GPIO45 LOW (power ON)...")
sd_power.value(0)
time.sleep_ms(200)
print("      GPIO45 =", sd_power.value())
print("      ✓ Power control working")

# Step 2: Check if pins can be read
print("\n[2/3] Waiting for card power to stabilize...")
time.sleep_ms(500)  # Give card more time to power up
print("      ✓ Ready")

print("\n[3/3] Checking SD card pin states...")
print("      (If card is inserted and powered, some pins may have pull-ups)")

pins_to_check = {
    43: 'CLK',
    44: 'CMD',
    39: 'D0',
    40: 'D1',
    41: 'D2',
    42: 'D3'
}

for pin_num, pin_name in pins_to_check.items():
    try:
        p = Pin(pin_num, Pin.IN)
        val = p.value()
        print(f"      GPIO{pin_num} ({pin_name}): {val}")
    except Exception as e:
        print(f"      GPIO{pin_num} ({pin_name}): ERROR - {e}")

# Step 4: Try basic SD card init (may fail)
print("\n[4/4] Attempting SD card initialization...")
print("      Slot: 0, Pins: CLK=43, CMD=44, D0-D3=39-42")
print("      Frequency: 400kHz (slow probe speed)")

try:
    from machine import SDCard
    # Use very slow frequency for initial probe
    sd = SDCard(slot=0, width=4, sck=43, cmd=44, data=(39, 40, 41, 42), freq=400000)
    print("      ✓ SDCard object created")
    
    try:
        info = sd.info()
        print("      ✓ Card detected!")
        print(f"      Sectors: {info[0]}, Block size: {info[1]}")
        print(f"      Capacity: {(info[0] * info[1]) / (1024*1024):.2f} MB")
        
        # Clean up
        sd.deinit()
        print("      ✓ Card deinitialized")
        
    except Exception as e:
        print(f"      ✗ Card not responding: {e}")
        print("\n      Possible causes:")
        print("        - No SD card inserted")
        print("        - Card not making good contact")
        print("        - Card is faulty or incompatible")
        print("        - Card needs formatting")
        try:
            sd.deinit()
        except:
            pass
        
except Exception as e:
    print(f"      ✗ Init failed: {e}")

print("\n=== Diagnostic Complete ===")
print("\nNext steps if card not detected:")
print("  1. Check SD card is fully inserted")
print("  2. Try a different SD card")
print("  3. Check card works in another device")
print("  4. Try formatting card as FAT32")
