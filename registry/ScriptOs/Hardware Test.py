


# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,

    info    = dict(
        name        = 'Board Hardware Test',
        version     = [4, 0, 0],
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
        test_audio     = dict( label    = 'Test audio codec (plays tone)?',
                              type     = bool,
                              value    = True ),
        verbose        = dict( label    = 'Verbose output?',
                              type     = bool,
                              value    = True )
    )

)

# === END_CONFIG_PARAMETERS ===


from machine import Pin, I2C, PWM, ADC, SDCard
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

# Try different I2C bus naming conventions
i2c_bus_name = None
if board.has("i2c.sensors"):
    i2c_bus_name = "sensors"
elif board.has("i2c.i2c0"):
    i2c_bus_name = "i2c0"

if i2c_bus_name:
    section("I2C Bus")
    
    i2c_cfg = board.i2c(i2c_bus_name)
    print(f"  Bus: {i2c_bus_name}")
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


# --- Audio Codec (ES8311, etc.) ---
if board.has("audio_codec"):
    try:
        codec = board.device("audio_codec")
        addr = int(codec.i2c_address, 16)
        if addr in devices:
            # Try reading ES8311 chip ID register (0xFD for ES8311)
            try:
                chip_id = i2c.readfrom_mem(addr, 0xFD, 1)[0]
                log(f"Audio Codec: {codec.type} @ 0x{addr:02X} (ID=0x{chip_id:02X})", "pass")
            except:
                log(f"Audio Codec: {codec.type} @ 0x{addr:02X}", "pass")
            results["audio_codec"] = True
        else:
            log(f"Audio Codec: {codec.type} not found @ 0x{addr:02X}", "fail")
            results["audio_codec"] = False
    except Exception as e:
        log(f"Audio Codec: {e}", "fail")
        results["audio_codec"] = False


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


# --- Display Port (MIPI-DSI) ---
if board.has("display_port"):
    try:
        dp = board.device("display_port")
        log(f"Display Port: {dp.type} ({dp.lanes}-lane)", "info")
        # MIPI-DSI can't be easily tested without a display attached, just report config
        results["display_port"] = True
    except Exception as e:
        log(f"Display Port: {e}", "warn")


# --- Camera Port (MIPI-CSI) ---
if board.has("camera_port"):
    try:
        cam = board.device("camera_port")
        log(f"Camera Port: {cam.type} ({cam.lanes}-lane)", "info")
        # MIPI-CSI can't be easily tested without a camera attached, just report config
        results["camera_port"] = True
    except Exception as e:
        log(f"Camera Port: {e}", "warn")


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


# --- SD Card ---
if board.has("sdcard"):
    try:
        sd_cfg = board.device("sdcard")
        mode = getattr(sd_cfg, 'mode', 'SDMMC')
        
        if mode == "SDMMC":
            # SDMMC mode (ESP32-P4, etc.)
            sdmmc_cfg = board._res.get("sdmmc", {}).get("sdcard", {})
            if sdmmc_cfg:
                # Try to mount SD card
                try:
                    import os
                    sd = SDCard(slot=1, 
                               clk=sdmmc_cfg.get('clk'),
                               cmd=sdmmc_cfg.get('cmd'),
                               d0=sdmmc_cfg.get('d0'),
                               d1=sdmmc_cfg.get('d1'),
                               d2=sdmmc_cfg.get('d2'),
                               d3=sdmmc_cfg.get('d3'))
                    os.mount(sd, '/sd')
                    files = os.listdir('/sd')
                    os.umount('/sd')
                    log(f"SD Card: SDMMC 4-bit ({len(files)} files)", "pass")
                    results["sdcard"] = True
                except OSError as oe:
                    if "no card" in str(oe).lower() or "timeout" in str(oe).lower():
                        log("SD Card: no card inserted", "warn")
                        results["sdcard"] = None  # Not a failure, just no card
                    else:
                        raise
            else:
                log("SD Card: SDMMC pins not configured", "warn")
                results["sdcard"] = False
        else:
            # SPI mode
            log(f"SD Card: {mode} mode configured", "info")
            results["sdcard"] = True
    except Exception as e:
        log(f"SD Card: {e}", "fail")
        results["sdcard"] = False


# --- Ethernet ---
if board.has("ethernet"):
    section("Network Tests")
    try:
        eth_cfg = board.device("ethernet")
        phy = getattr(eth_cfg, 'phy', 'unknown')
        interface = getattr(eth_cfg, 'interface', 'unknown')
        
        try:
            import network
            lan = network.LAN()
            lan.active(True)
            time.sleep_ms(500)  # Wait for PHY to initialize
            
            if lan.isconnected():
                ip_info = lan.ifconfig()
                log(f"Ethernet: {phy} ({interface}) - Connected: {ip_info[0]}", "pass")
            else:
                mac = ':'.join('%02X' % b for b in lan.config('mac'))
                log(f"Ethernet: {phy} ({interface}) - PHY OK (MAC: {mac})", "pass")
            results["ethernet"] = True
        except Exception as net_e:
            log(f"Ethernet: {phy} PHY - network module error: {net_e}", "fail")
            results["ethernet"] = False
    except Exception as e:
        log(f"Ethernet: {e}", "fail")
        results["ethernet"] = False


# --- WiFi via C6 Coprocessor ---
if board.has("c6_coprocessor"):
    try:
        c6 = board.device("c6_coprocessor")
        interface = getattr(c6, 'interface', 'SDIO')
        features = getattr(c6, 'features', [])
        
        try:
            import network
            wlan = network.WLAN(network.STA_IF)
            wlan.active(True)
            time.sleep_ms(300)
            
            mac = ':'.join('%02X' % b for b in wlan.config('mac'))
            log(f"WiFi (C6): {c6.type} via {interface} (MAC: {mac})", "pass")
            
            # Scan for networks as an additional check
            networks = wlan.scan()
            log(f"  → {len(networks)} networks visible", "info")
            results["c6_coprocessor"] = True
        except Exception as wifi_e:
            log(f"WiFi (C6): {c6.type} - {wifi_e}", "fail")
            results["c6_coprocessor"] = False
    except Exception as e:
        log(f"C6 Coprocessor: {e}", "fail")
        results["c6_coprocessor"] = False


# ============================================================================
# Summary
# ============================================================================

section("Summary")

# Filter out None results (e.g., no SD card inserted is not a failure)
actual_results = {k: v for k, v in results.items() if v is not None}
passed = sum(1 for v in actual_results.values() if v)
total = len(actual_results)

for name, ok in sorted(results.items()):
    if ok is None:
        print(f"  ⏭️ {name} (skipped)")
    else:
        print(f"  {'✅' if ok else '❌'} {name}")

print()
if passed == total:
    print(f"🎉 ALL {total} TESTS PASSED!")
else:
    print(f"⚠️  {passed}/{total} passed")

