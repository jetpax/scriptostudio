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


def init_display(brightness=80):
    """
    Initialize display from board manifest. Safe to call multiple times
    (returns existing instance if already initialized).

    Returns the St7789 instance, or None if no display capability.
    """
    global _lcd
    if _lcd is not None:
        return _lcd

    from lib.sys import board
    if not board.has("display"):
        return None

    import machine
    import gc

    spi_cfg = board.spi("lcd")
    disp = board.device("display")

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

    # ST7789 internal resolution is always 240x320;
    # the driver handles offset mapping via MADCTL rotation tables
    from lib.sys.display.st77xx import St7789
    _lcd = St7789(
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
    # Constructor sets backlight to 10% — kill it immediately
    _lcd.set_backlight(0)

    # Set LVGL screen bg to black BEFORE any render cycle
    try:
        import lvgl as lv
        scr = lv.screen_active()
        if scr:
            scr.set_style_bg_color(lv.color_hex(0x000000), 0)
        # Force LVGL to render the black bg now
        lv.refr_now(None)
    except Exception:
        pass

    # Clear display to black at SPI level (belt and suspenders)
    _lcd.clear(0x0000)

    # Blit splash icon centered on display (row-by-row to avoid SPI buffer limits)
    try:
        import struct as _st
        icon_w, icon_h = 128, 128
        x = (_lcd.width - icon_w) // 2
        y = (_lcd.height - icon_h) // 2
        row_bytes = icon_w * 2  # 256 bytes per row

        _lcd.set_window(x, y, icon_w, icon_h)
        # Send RAMWR command, then stream pixel data row by row
        _st.pack_into('B', _lcd.buf1, 0, 0x2C)  # ST77XX_RAMWR
        _lcd.cs.value(0)
        _lcd.dc.value(0)
        _lcd.spi.write(_lcd.buf1)
        _lcd.dc.value(1)
        with open('/lib/sys/display/splash.bin', 'rb') as f:
            for _ in range(icon_h):
                _lcd.spi.write(f.read(row_bytes))
        _lcd.cs.value(1)
    except Exception as e:
        print(f"[DISPLAY] splash skipped: {e}")

    # NOW turn on backlight — user sees black + icon, never white
    _lcd.set_backlight(brightness)
    return _lcd


def get_display():
    """Get the initialized display instance, or None if not initialized."""
    return _lcd
