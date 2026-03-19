"""
Display Singleton — boot-time LVGL display initialization.

Initializes the display once from board.json at boot.
The agent can then create LVGL widgets without reinitializing
the SPI bus or display driver (which requires POR to recover).

Usage:
    from lib.sys.display.display_manager import init_display, get_display
    lcd = init_display()  # call once at boot
    lcd = get_display()   # later, get the singleton
"""

_lcd = None


def _reset_via_expander(board):
    """Toggle LCD RST via I2C GPIO expander (e.g. TCA9554PWR)."""
    try:
        exp = board._res.get("expander", {})
        lcd_rst_pin = exp.get("pins", {}).get("lcd_rst")
        if lcd_rst_pin is None:
            return

        i2c_bus_name = exp.get("i2c_bus", "sensors")
        i2c_cfg = board.i2c(i2c_bus_name)
        exp_dev = board.device("gpio_expander")
        addr = int(exp_dev.i2c_address, 16) if isinstance(exp_dev.i2c_address, str) else exp_dev.i2c_address

        import machine
        i2c = machine.SoftI2C(scl=machine.Pin(i2c_cfg.scl),
                               sda=machine.Pin(i2c_cfg.sda), freq=400_000)

        # TCA9554: reg 0x01=output, reg 0x03=config (0=output, 1=input)
        # Set the LCD RST pin as output
        config = i2c.readfrom_mem(addr, 0x03, 1)[0]
        config &= ~(1 << lcd_rst_pin)  # clear bit = output
        i2c.writeto_mem(addr, 0x03, bytes([config]))

        # Toggle reset: low → high
        import time
        out = i2c.readfrom_mem(addr, 0x01, 1)[0]
        out &= ~(1 << lcd_rst_pin)
        i2c.writeto_mem(addr, 0x01, bytes([out]))
        time.sleep_ms(20)
        out |= (1 << lcd_rst_pin)
        i2c.writeto_mem(addr, 0x01, bytes([out]))
        time.sleep_ms(120)
        print("[DISPLAY] LCD reset via expander OK")
    except Exception as e:
        print(f"[DISPLAY] expander reset skipped: {e}")


def _init_qspi_display(board, disp, brightness):
    """Initialize a QSPI display (e.g. SPD2010)."""
    import gc

    qspi_cfg = board.qspi("lcd")

    # Reset LCD via expander if wired that way
    _reset_via_expander(board)

    # Backlight pin
    bl_pin = board._res.get("gpio", {}).get("bl_pwm")

    gc.collect()

    import qspi_lcd
    bus = qspi_lcd.Bus(
        host=1,
        sck=qspi_cfg.sck,
        data0=qspi_cfg.data0,
        data1=qspi_cfg.data1,
        data2=qspi_cfg.data2,
        data3=qspi_cfg.data3,
        cs=qspi_cfg.cs,
        freq=40_000_000,
        cmd_bits=32,
        param_bits=8,
        spi_mode=getattr(disp, 'spi_mode', 0),
    )

    from lib.sys.display.spd2010 import Spd2010
    lcd = Spd2010(
        bus=bus,
        res=(disp.width, disp.height),
        bl=bl_pin,
        color_bits=getattr(disp, 'color_bits', 16),
        doublebuffer=False,
        factor=32,
    )

    lcd.set_backlight(0)
    lcd.clear(0x0000)

    # Blit splash icon centered on display
    try:
        icon_w, icon_h = 128, 128
        x = (disp.width - icon_w) // 2
        y = (disp.height - icon_h) // 2
        band = 4  # rows per read (128*4*2 = 1024 bytes per band)
        with open('/lib/sys/display/splash.bin', 'rb') as f:
            for row in range(0, icon_h, band):
                h = min(band, icon_h - row)
                data = f.read(icon_w * h * 2)
                lcd.blit(x, y + row, icon_w, h, data)
    except Exception as e:
        print(f"[DISPLAY] splash skipped: {e}")

    lcd.display_on()
    lcd.set_backlight(brightness)
    return lcd


def _init_spi_display(board, disp, brightness):
    """Initialize a standard SPI display (e.g. ST7789)."""
    import machine
    import gc

    spi_cfg = board.spi("lcd")

    # SPI bus
    spi = machine.SPI(
        1,
        baudrate=40_000_000,
        polarity=0,
        phase=0,
        sck=machine.Pin(spi_cfg.sck, machine.Pin.OUT),
        mosi=machine.Pin(spi_cfg.mosi, machine.Pin.OUT),
    )

    # Backlight pin
    bl_pin = None
    try:
        bl_pin = disp.backlight['pin']
    except (AttributeError, KeyError, TypeError):
        bl_pin = board._res.get("gpio", {}).get("bl_pwm")

    gc.collect()

    from lib.sys.display.st77xx import St7789
    lcd = St7789(
        rot=0,
        res=(240, 320),
        spi=spi,
        cs=spi_cfg.cs,
        dc=spi_cfg.dc,
        rst=spi_cfg.rst,
        bl=bl_pin,
        doublebuffer=False,
        factor=16,
    )

    # ── Boot splash: prevent white flash ──
    lcd.set_backlight(0)

    try:
        import lvgl as lv
        scr = lv.screen_active()
        if scr:
            scr.set_style_bg_color(lv.color_hex(0x000000), 0)
        lv.refr_now(None)
    except Exception:
        pass

    lcd.clear(0x0000)

    # Blit splash icon centered on display
    try:
        import struct as _st
        icon_w, icon_h = 128, 128
        x = (lcd.width - icon_w) // 2
        y = (lcd.height - icon_h) // 2
        row_bytes = icon_w * 2

        lcd.set_window(x, y, icon_w, icon_h)
        _st.pack_into('B', lcd.buf1, 0, 0x2C)
        lcd.cs.value(0)
        lcd.dc.value(0)
        lcd.spi.write(lcd.buf1)
        lcd.dc.value(1)
        with open('/lib/sys/display/splash.bin', 'rb') as f:
            for _ in range(icon_h):
                lcd.spi.write(f.read(row_bytes))
        lcd.cs.value(1)
    except Exception as e:
        print(f"[DISPLAY] splash skipped: {e}")

    lcd.set_backlight(brightness)
    return lcd


def _init_epd_display(board, disp):
    """Initialize an ePaper display (e.g. EPD_3in97)."""
    import machine
    import gc

    # Power up ePaper via AXP2101 PMU (ALDO1 = EPD_VCC_AXP)
    try:
        i2c_cfg = board.i2c("i2c0")
        i2c = machine.SoftI2C(
            scl=machine.Pin(i2c_cfg.scl),
            sda=machine.Pin(i2c_cfg.sda),
            freq=400_000,
        )
        from lib.sys.drivers.axp2101 import AXP2101
        pmu = AXP2101(i2c)
        pmu.init()
        print(f"[DISPLAY] AXP2101 OK — battery {pmu.battery_percent()}%")
    except Exception as e:
        print(f"[DISPLAY] AXP2101 init skipped: {e}")

    # SPI bus for ePaper — use hardware SPI1, same bus ID proven with ST7789.
    # ESP32-S3 SPI buses can map to any GPIO through the GPIO matrix.
    spi_cfg = board.spi("epaper")
    spi = machine.SPI(
        1,
        baudrate=getattr(disp, 'spi_speed_hz', 20_000_000),
        polarity=0,
        phase=0,
        sck=machine.Pin(spi_cfg.sclk, machine.Pin.OUT),
        mosi=machine.Pin(spi_cfg.mosi, machine.Pin.OUT),
        miso=None,
    )

    gc.collect()

    from lib.sys.display.epd_3in97_lvgl import EPD_3in97_lvgl
    epd = EPD_3in97_lvgl(
        spi=spi,
        cs=disp.cs_pin,
        dc=disp.dc_pin,
        rst=disp.rst_pin,
        busy=disp.busy_pin,
    )

    epd.init()
    gc.collect()

    epd.lvgl_init()
    return epd


def init_display(brightness=80):
    """
    Initialize display from board manifest. Safe to call multiple times
    (returns existing instance if already initialized).

    Dispatches based on the manifest's devices.display.interface field:
      - "epd"  → ePaper display (e.g. EPD_3in97)
      - "qspi" → SPD2010 QSPI driver
      - "spi"  → ST7789 SPI driver (default)

    Returns the display instance, or None if no display capability.
    """
    global _lcd
    if _lcd is not None:
        return _lcd

    from lib.sys import board
    if not board.has("display"):
        return None

    disp = board.device("display")

    # Determine interface type from manifest
    interface = getattr(disp, 'interface', 'spi')

    if interface == 'epd':
        _lcd = _init_epd_display(board, disp)
    elif interface == 'qspi':
        _lcd = _init_qspi_display(board, disp, brightness)
    else:
        _lcd = _init_spi_display(board, disp, brightness)

    return _lcd


def get_display():
    """Get the initialized display instance, or None if not initialized."""
    return _lcd
