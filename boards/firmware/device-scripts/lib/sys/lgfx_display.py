"""
lgfx_display.py - Auto-configure lgfx.Display from board manifest.

This module provides a simple interface to create an lgfx display instance
that is automatically configured based on the board manifest (board.json).

Usage:
    from lib.sys.lgfx_display import get_display
    display = get_display()
    display.brightness(128)

Supported panel types:
    - CO5300: QSPI AMOLED (e.g. Waveshare ESP32-S3 1.75" AMOLED)
    - ST7789: SPI LCD (common 240x320 displays)
"""

try:
    from lib.sys import board
    _BOARD_AVAILABLE = True
except ImportError:
    _BOARD_AVAILABLE = False
    board = None

import lgfx
from machine import Pin
import time

# Panel type mappings (driver name -> lgfx constant)
_PANEL_TYPES = {
    'co5300': lgfx.PANEL_CO5300,
    'st7789': lgfx.PANEL_ST7789,
}

_display = None  # Singleton


def _pulse_reset():
    """Toggle the display reset pin low then high to force a hardware reset."""
    if not _BOARD_AVAILABLE or not board.has('display'):
        return
    try:
        disp = board.device('display')
        rst_pin = getattr(disp, 'rst_pin', -1)
        if rst_pin >= 0:
            rst = Pin(rst_pin, Pin.OUT)
            rst.value(0)
            time.sleep_ms(10)
            rst.value(1)
            time.sleep_ms(120)  # CO5300 needs ~120ms after reset
    except Exception:
        pass


def get_display(brightness=None):
    """
    Get the configured display singleton.

    Reads display configuration from board manifest and creates
    the appropriate lgfx.Display instance.

    Args:
        brightness: Optional initial brightness (0-255). If provided,
                   sets brightness immediately after init.

    Returns:
        lgfx.Display instance, or None if display not configured.
    """
    global _display

    if _display is not None:
        # Pulse the hardware reset pin — ensures clean state after soft resets
        _pulse_reset()
        if brightness is not None:
            _display.brightness(brightness)
        return _display

    if not _BOARD_AVAILABLE or not board.has('display'):
        return None

    try:
        cfg = _build_config_from_board()
        _display = lgfx.Display(**cfg)

        if brightness is not None:
            _display.brightness(brightness)

        return _display
    except Exception as e:
        print("[lgfx_display] Failed to init display: %s" % e)
        return None


def _build_config_from_board():
    """Build lgfx.Display kwargs from board manifest."""
    disp = board.device('display')

    # Determine panel type from driver name
    driver_name = getattr(disp, 'driver', 'co5300').lower()
    panel_type = _PANEL_TYPES.get(driver_name, lgfx.PANEL_CO5300)

    # Determine interface type
    interface = getattr(disp, 'interface', 'qspi').lower()

    # Common config
    cfg = {
        'panel_type': panel_type,
        'width':      getattr(disp, 'width', 240),
        'height':     getattr(disp, 'height', 240),
        'col_offset': getattr(disp, 'offset_x', 0),
        'row_offset': getattr(disp, 'offset_y', 0),
        'freq':       getattr(disp, 'freq', 40000000),
        'rst':        getattr(disp, 'rst_pin', -1),
    }

    # Get bus name (e.g., "qspi.lcd" -> "lcd")
    bus_name = getattr(disp, 'bus', '')
    bus_key = bus_name.split('.')[-1] if '.' in bus_name else 'lcd'

    if interface == 'qspi':
        # QSPI bus config
        try:
            qspi_bus = board.qspi(bus_key)
            cfg.update({
                'sck': qspi_bus.sck,
                'd0':  qspi_bus.data0,
                'd1':  qspi_bus.data1,
                'd2':  qspi_bus.data2,
                'd3':  qspi_bus.data3,
                'cs':  qspi_bus.cs,
            })
        except Exception as e:
            print("[lgfx_display] Failed to get QSPI bus config: %s" % e)
    else:
        # Standard SPI bus config
        try:
            spi_bus = board.spi(bus_key)
            cfg.update({
                'sclk':   spi_bus.sclk,
                'mosi':   spi_bus.mosi,
                'miso':   getattr(spi_bus, 'miso', -1),
                'dc':     spi_bus.dc,
                'spi_cs': spi_bus.cs,
            })
        except Exception as e:
            print("[lgfx_display] Failed to get SPI bus config: %s" % e)

    # Backlight config (LCD panels only)
    bl_pin = getattr(disp, 'bl_pin', -1)
    if bl_pin < 0:
        # Try to get from gpio resources
        try:
            bl_pin = board._res.get('gpio', {}).get('bl_pwm', -1)
        except Exception:
            pass

    if bl_pin >= 0:
        cfg.update({
            'bl_pin':         bl_pin,
            'bl_pwm_ch':      getattr(disp, 'bl_pwm_channel', 0),
            'bl_active_high': getattr(disp, 'bl_active_high', True),
        })

    return cfg
