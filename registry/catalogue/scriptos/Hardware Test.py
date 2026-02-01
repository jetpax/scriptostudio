


# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,

    info    = dict(
        name        = 'Board Hardware Test',
        version     = [3, 0, 0],
        category    = 'Hardware',
        description = 'Tests only the hardware features defined in your board.json. Reads the manifest and validates each enabled capability - skips anything not configured.',
        author      = 'JetPax',
        mail        = 'jep@alphabetiq.com',
        www         = 'https://github.com/jetpax'
    ),
    
    args    = dict(
        test_buzzer    = dict( label    = 'Test buzzer (makes sound)?',
                              type     = bool,
                              value    = True ),
        verbose        = dict( label    = 'Verbose output?',
                              type     = bool,
                              value    = True )
    )

)

# === END_CONFIG_PARAMETERS ===


from machine import Pin, I2C, PWM, ADC
import time
from lib.sys import board

termWidth = 50
results = {}

def log(msg, level="info"):
    icons = {"pass": "✅", "fail": "❌", "warn": "⚠️", "info": "ℹ️"}
    print(f"{icons.get(level, 'ℹ️')} {msg}")

def section(title):
    print()
    print("=" * termWidth)
    print(title)
    print("=" * termWidth)


# ============================================================================
# Board Identity
# ============================================================================

section(f"{board.id.name}")

print(f"  ID:       {board.id.id}")
print(f"  Chip:     {board.id.chip}")
print(f"  Vendor:   {board.id.vendor}")
print(f"  Revision: {board.id.revision}")


# ============================================================================
# I2C Bus Scan (if configured)
# ============================================================================

i2c = None
devices = []

if board.has("i2c.sensors"):
    section("I2C Bus")
    
    i2c_cfg = board.i2c("sensors")
    print(f"  SCL: GPIO{i2c_cfg.scl}, SDA: GPIO{i2c_cfg.sda}")
    
    # Wake up touch controller if reset pin defined
    touch_rst = board._res.get("gpio", {}).get("touch_rst")
    if touch_rst:
        rst = Pin(touch_rst, Pin.OUT)
        rst.value(0)
        time.sleep_ms(10)
        rst.value(1)
        time.sleep_ms(50)
        print(f"  Touch wake: GPIO{touch_rst} toggled")
    
    i2c = I2C(0, scl=Pin(i2c_cfg.scl), sda=Pin(i2c_cfg.sda), freq=400000)
    devices = i2c.scan()
    
    addr_list = ", ".join(["0x%02X" % d for d in devices])
    print(f"  Devices: [{addr_list}]")
    results["i2c_bus"] = len(devices) > 0


# ============================================================================
# Test each configured device
# ============================================================================

section("Device Tests")


# --- Touch ---
if board.has("touch"):
    try:
        touch = board.device("touch")
        addr = int(touch.i2c_address, 16)
        if addr in devices:
            log(f"Touch: {touch.type} @ 0x{addr:02X}", "pass")
            results["touch"] = True
        else:
            log(f"Touch: {touch.type} not found @ 0x{addr:02X}", "fail")
            results["touch"] = False
    except Exception as e:
        log(f"Touch: {e}", "fail")
        results["touch"] = False


# --- IMU ---
if board.has("imu"):
    try:
        imu = board.device("imu")
        addr = int(imu.i2c_address, 16)
        if addr in devices:
            who = i2c.readfrom_mem(addr, 0x00, 1)[0]
            log(f"IMU: {imu.type} @ 0x{addr:02X} (WHO_AM_I=0x{who:02X})", "pass")
            results["imu"] = True
        else:
            log(f"IMU: {imu.type} not found @ 0x{addr:02X}", "fail")
            results["imu"] = False
    except Exception as e:
        log(f"IMU: {e}", "fail")
        results["imu"] = False


# --- RTC ---
if board.has("rtc"):
    try:
        rtc = board.device("rtc")
        addr = int(rtc.i2c_address, 16)
        if addr in devices:
            sec = i2c.readfrom_mem(addr, 0x04, 1)[0]
            log(f"RTC: {rtc.type} @ 0x{addr:02X} (sec=0x{sec:02X})", "pass")
            results["rtc"] = True
        else:
            log(f"RTC: {rtc.type} not found @ 0x{addr:02X}", "fail")
            results["rtc"] = False
    except Exception as e:
        log(f"RTC: {e}", "fail")
        results["rtc"] = False


# --- GPIO Expander ---
if board.has("gpio_expander"):
    try:
        exp = board.device("gpio_expander")
        addr = int(exp.i2c_address, 16)
        if addr in devices:
            data = i2c.readfrom_mem(addr, 0x00, 1)[0]
            log(f"Expander: {exp.type} @ 0x{addr:02X}", "pass")
            results["gpio_expander"] = True
        else:
            log(f"Expander: {exp.type} not found @ 0x{addr:02X}", "fail")
            results["gpio_expander"] = False
    except Exception as e:
        log(f"Expander: {e}", "fail")
        results["gpio_expander"] = False


# --- Display/Backlight ---
if board.has("display"):
    try:
        bl_pin = board._res.get("gpio", {}).get("bl_pwm")
        if bl_pin:
            pwm = PWM(Pin(bl_pin), freq=20000, duty=512)
            log(f"Backlight: GPIO{bl_pin} PWM", "pass")
            pwm.deinit()
            results["backlight"] = True
        else:
            log("Backlight: pin not defined", "warn")
            results["backlight"] = False
    except Exception as e:
        log(f"Backlight: {e}", "fail")
        results["backlight"] = False


# --- Battery ---
if board.has("battery"):
    try:
        bat_pin = board._res.get("gpio", {}).get("bat_adc")
        if bat_pin:
            adc = ADC(Pin(bat_pin))
            adc.atten(ADC.ATTN_11DB)
            v = adc.read_uv() / 1000000
            log(f"Battery: GPIO{bat_pin} ADC ({v:.2f}V)", "pass")
            results["battery"] = True
        else:
            log("Battery: ADC pin not defined", "warn")
            results["battery"] = False
    except Exception as e:
        log(f"Battery: {e}", "fail")
        results["battery"] = False


# --- Buzzer ---
if board.has("buzzer"):
    try:
        buzzer = board.device("buzzer")
        pin = buzzer.pin
        if args.test_buzzer:
            pwm = PWM(Pin(pin), freq=1000, duty=512)
            time.sleep_ms(100)
            pwm.deinit()
            log(f"Buzzer: GPIO{pin} (tone played)", "pass")
        else:
            log(f"Buzzer: GPIO{pin} (skipped)", "pass")
        results["buzzer"] = True
    except Exception as e:
        log(f"Buzzer: {e}", "fail")
        results["buzzer"] = False


# ============================================================================
# Summary
# ============================================================================

section("Summary")

passed = sum(1 for v in results.values() if v)
total = len(results)

for name, ok in sorted(results.items()):
    print(f"  {'✅' if ok else '❌'} {name}")

print()
if passed == total:
    print(f"🎉 ALL {total} TESTS PASSED!")
else:
    print(f"⚠️  {passed}/{total} passed")
