"""
CO5300 QSPI AMOLED Display Driver

Self-contained driver for the CO5300 QSPI AMOLED display controller used on
boards like the Waveshare ESP32-S3-Touch-AMOLED-1.75 (466×466 round AMOLED).

Requires the `qspi_lcd` C module for QSPI bus communication.

Usage:
    import qspi_lcd
    bus = qspi_lcd.Bus(host=1, sck=38, data0=4, data1=5,
                       data2=6, data3=7, cs=12, freq=40000000,
                       cmd_bits=32, param_bits=8)
    from lib.sys.display.co5300 import Co5300
    lcd = Co5300(bus=bus, res=(466, 466), rst=39)

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT

Init sequence ported from:
  Arduino GFX Library — Arduino_CO5300.h / Arduino_CO5300.cpp
"""

import time
import machine
from micropython import const

# QSPI command prefixes (same MIPI-QSPI encoding as SPD2010)
_WRITE_CMD   = const(0x02)
_WRITE_COLOR = const(0x32)

# Standard MIPI DCS commands
_CASET  = const(0x2A)
_RASET  = const(0x2B)
_RAMWR  = const(0x2C)
_SLPOUT = const(0x11)
_DISPON = const(0x29)

# CO5300-specific commands
_SWRESET            = const(0x01)
_PIXFMT             = const(0x3A)
_MADCTL             = const(0x36)
_SPIMODECTL         = const(0xC4)
_WCTRLD1            = const(0x53)
_BRIGHTNESS_NOR     = const(0x51)
_BRIGHTNESS_HBM     = const(0x63)
_WCE                = const(0x58)

# CO5300 timing
_RST_DELAY_MS    = const(200)
_SLPOUT_DELAY_MS = const(120)


def _qspi_cmd(cmd):
    """Encode a command for QSPI write.

    ESP-IDF byte-reverses the 32-bit command word.
    Encoding: (cmd << 8) | (_WRITE_CMD << 24)
    """
    return (cmd << 8) | (_WRITE_CMD << 24)


def _qspi_color_cmd(cmd):
    """Encode a color-write command for QSPI (0x32 prefix)."""
    return (cmd << 8) | (_WRITE_COLOR << 24)


class Co5300_hw:
    """Low-level CO5300 hardware driver (QSPI bus)."""

    def __init__(self, *, bus, res, rst=None, rot=0, color_bits=16,
                 offset_x=0, offset_y=0):
        """
        Args:
            bus: qspi_lcd.Bus instance
            res: (width, height) tuple, e.g. (466, 466)
            rst: reset pin number (optional, GPIO — not via expander)
            rot: rotation (0-3)
            color_bits: 16 (RGB565) or 24 (RGB888)
            offset_x: column offset into panel framebuffer (CO5300: 6)
            offset_y: row offset into panel framebuffer (CO5300: 0)
        """
        self.bus = bus
        self.res = res
        self.rot = rot
        self.width, self.height = res
        self.color_bits = color_bits
        self.offset_x = offset_x
        self.offset_y = offset_y

        # Precompute QSPI-encoded commands
        self._caset = _qspi_cmd(_CASET)
        self._raset = _qspi_cmd(_RASET)
        self._ramwr = _qspi_color_cmd(_RAMWR)

        # Reset pin (direct GPIO, not via expander)
        self.rst = None
        if rst is not None:
            self.rst = machine.Pin(rst, machine.Pin.OUT)

        # Param buffer for set_params / set_memory_location
        self._param_buf = bytearray(4)
        self._param_mv = memoryview(self._param_buf)

        self.hard_reset()

    def hard_reset(self):
        if self.rst:
            self.rst.value(1)
            time.sleep_ms(10)
            self.rst.value(0)
            time.sleep_ms(_RST_DELAY_MS)
            self.rst.value(1)
            time.sleep_ms(_RST_DELAY_MS)
        self._init_sequence()

    def set_params(self, cmd, data=None):
        """Send a QSPI command with optional parameter data."""
        qcmd = _qspi_cmd(cmd)
        if data is not None:
            self.bus.tx_param(qcmd, data)
        else:
            self.bus.tx_param(qcmd)

    def set_memory_location(self, x1, y1, x2, y2):
        buf = self._param_buf
        x1 += self.offset_x
        x2 += self.offset_x
        buf[0] = (x1 >> 8) & 0xFF
        buf[1] = x1 & 0xFF
        buf[2] = (x2 >> 8) & 0xFF
        buf[3] = x2 & 0xFF
        self.bus.tx_param(self._caset, self._param_mv)

        y1 += self.offset_y
        y2 += self.offset_y
        buf[0] = (y1 >> 8) & 0xFF
        buf[1] = y1 & 0xFF
        buf[2] = (y2 >> 8) & 0xFF
        buf[3] = y2 & 0xFF
        self.bus.tx_param(self._raset, self._param_mv)

    def blit(self, x, y, w, h, data):
        """Write pixel data to a rectangular region."""
        self.set_memory_location(x, y, x + w - 1, y + h - 1)
        self.bus.tx_color(self._ramwr, data)

    def clear(self, color=0x0000):
        """Fill entire display with a single color (RGB565)."""
        rows_per_band = 4
        row_pixels = self.width * rows_per_band
        buf = bytearray(row_pixels * 2)
        hi = (color >> 8) & 0xFF
        lo = color & 0xFF
        for i in range(0, len(buf), 2):
            buf[i] = hi
            buf[i + 1] = lo
        for y in range(0, self.height, rows_per_band):
            self.blit(0, y, self.width, rows_per_band, buf)

    def set_backlight(self, percent):
        """Set AMOLED brightness via CO5300 register 0x51.

        CO5300 is self-emitting — no external backlight PWM pin needed.
        Maps 0-100% to 0x00-0xFF register value.
        """
        val = min(255, max(0, int(percent * 255 / 100)))
        p = self._param_buf
        p[0] = val
        self.set_params(_BRIGHTNESS_NOR, self._param_mv[:1])

    def _init_sequence(self):
        """CO5300 initialization sequence.

        Ported from Arduino GFX Library Arduino_CO5300.h.
        The CO5300 uses standard MIPI DCS commands — init is minimal.
        """
        p = self._param_buf
        mv = self._param_mv

        def sp(cmd, val):
            p[0] = val
            self.set_params(cmd, mv[:1])

        # Sleep out
        self.set_params(_SLPOUT)
        time.sleep_ms(_SLPOUT_DELAY_MS)

        # Page select
        sp(0xFE, 0x00)

        # SPI quad mode enable
        sp(_SPIMODECTL, 0x80)

        # Pixel format: 0x55 = RGB565, 0x66 = RGB666, 0x77 = RGB888
        colmod = 0x55 if self.color_bits == 16 else 0x77
        sp(_PIXFMT, colmod)

        # Display control
        sp(_WCTRLD1, 0x20)

        # HBM brightness max
        sp(_BRIGHTNESS_HBM, 0xFF)

        # Display ON
        self.set_params(_DISPON)

        # Normal mode brightness
        sp(_BRIGHTNESS_NOR, 0xD0)

        # Contrast enhancement off
        sp(_WCE, 0x00)

        time.sleep_ms(10)

    def display_on(self):
        """Send DISPON command."""
        self.set_params(_DISPON)

    def display_off(self):
        """Send DISPOFF + SLPIN commands."""
        self.set_params(0x28)  # DISPOFF
        time.sleep_ms(120)
        self.set_params(0x10)  # SLPIN
        time.sleep_ms(120)


class Co5300_lvgl:
    """LVGL wrapper for Co5300 — creates display driver and buffers."""

    def disp_drv_flush_cb(self, disp_drv, area, color_p):
        x1 = area.x1
        y1 = area.y1
        x2 = area.x2
        y2 = area.y2
        w = x2 - x1 + 1
        h = y2 - y1 + 1
        size = w * h * self.pixel_size
        data_view = color_p.__dereference__(size)

        if self.rgb565_swap_func:
            self.rgb565_swap_func(data_view, w * h)

        self.blit(x1, y1, w, h, data_view)
        self.disp_drv.flush_ready()

    def __init__(self, doublebuffer=True, factor=32):
        import lvgl as lv
        try:
            import lv_utils
        except ImportError:
            from lib.sys.display import lv_utils

        color_format = lv.COLOR_FORMAT.RGB565
        self.pixel_size = lv.color_format_get_size(color_format)
        self.rgb565_swap_func = lv.draw_sw_rgb565_swap

        if not lv.is_initialized():
            lv.init()

        if not lv_utils.event_loop.is_running():
            self.event_loop = lv_utils.event_loop()

        # Reuse existing display if present
        existing = lv.display_get_default()
        if existing is not None:
            self.disp_drv = existing
            self.disp_drv.set_flush_cb(self.disp_drv_flush_cb)
            return

        draw_buf1 = lv.draw_buf_create(self.width, self.height // factor,
                                        color_format, 0)
        draw_buf2 = None
        if doublebuffer:
            draw_buf2 = lv.draw_buf_create(self.width, self.height // factor,
                                            color_format, 0)

        self.disp_drv = lv.display_create(self.width, self.height)
        self.disp_drv.set_color_format(color_format)
        self.disp_drv.set_draw_buffers(draw_buf1, draw_buf2)
        self.disp_drv.set_render_mode(lv.DISPLAY_RENDER_MODE.PARTIAL)
        self.disp_drv.set_flush_cb(self.disp_drv_flush_cb)

        # Prevent white flash: set initial screen to black
        scr = lv.screen_active()
        if scr:
            scr.set_style_bg_color(lv.color_hex(0x000000), 0)
            lv.refr_now(None)


class Co5300(Co5300_hw, Co5300_lvgl):
    """Combined CO5300 hardware + LVGL driver.

    Usage:
        lcd = Co5300(bus=bus, res=(466, 466), rst=39, doublebuffer=False, factor=32)
    """
    def __init__(self, *, bus, res, rst=None, rot=0,
                 color_bits=16, offset_x=0, offset_y=0,
                 doublebuffer=True, factor=32):
        Co5300_hw.__init__(self, bus=bus, res=res, rst=rst,
                             rot=rot, color_bits=color_bits,
                             offset_x=offset_x, offset_y=offset_y)
        Co5300_lvgl.__init__(self, doublebuffer=doublebuffer, factor=factor)
