"""
LVGL backend for the EPD 3.97" (800×480) e-Paper display.

CalmPilot portrait orientation: LVGL renders in portrait (480×800).
The flush callback calls lv_draw_sw_rotate() (C-level, patched for I1)
to rotate the full frame 270° CW into the 800×480 hardware layout.

Rendering is demand-driven — call lv_refresh() to render and push.

Usage:

import lvgl as lv
from lib.sys.display.display_manager import get_display

epd = get_display()

epd.init()
epd.lvgl_init()

import lvgl as lv
scr = lv.screen_active()
scr = lv.screen_active()
scr.clean()  # removes all children (old labels etc.)
scr.set_style_bg_color(lv.color_white(), 0)
label = lv.label(scr)
label.set_text("Hello World!")
label.set_style_text_color(lv.color_black(), 0)
label.set_style_text_font(lv.font_montserrat_48, 0)  # 48px
label.align(lv.ALIGN.CENTER, 0, -40)
epd.lv_refresh()

"""

from lib.sys.display.epd_3in97 import EPD_3in97

# Hardware panel geometry (landscape, as wired)
HW_WIDTH = 800
HW_HEIGHT = 480
HW_STRIDE = HW_WIDTH // 8  # 100 bytes per row

# LVGL logical dimensions (portrait, what apps see)
LV_WIDTH = 480
LV_HEIGHT = 800
LV_STRIDE = LV_WIDTH // 8  # 60 bytes per row

BUF_SIZE_MONO = HW_STRIDE * HW_HEIGHT  # 48000 bytes

# I1 CLUT: 2 palette entries × 4 bytes (ARGB8888) = 8 bytes
I1_CLUT_SIZE = 8


class EPD_3in97_lvgl(EPD_3in97):
    """EPD driver with LVGL integration (portrait via C rotation).

    LVGL renders at 480×800 in FULL mode. The flush callback uses
    lv_draw_sw_rotate() (patched for I1 format) to rotate the full
    frame 270° CW into a landscape shadow buffer (800×480).
    """

    def __init__(self, spi, cs, dc, rst, busy):
        super().__init__(spi, cs, dc, rst, busy)
        self._lv = None
        self._shadow = None
        self._dirty = False
        self._baseline_set = False
        self.disp_drv = None

    def lvgl_init(self):
        """Initialize LVGL display driver with C-level I1 rotation."""
        import lvgl as lv
        self._lv = lv

        if not lv.is_initialized():
            lv.init()

        # Shadow buffer in HARDWARE layout (800×480, landscape)
        self._shadow = bytearray(BUF_SIZE_MONO)
        self._dirty = False

        # Fill shadow with white (0xFF = white in ePaper)
        for i in range(BUF_SIZE_MONO):
            self._shadow[i] = 0xFF

        # Reuse existing LVGL display if present
        existing = lv.display_get_default()
        if existing is not None:
            self.disp_drv = existing
            self.disp_drv.set_flush_cb(self._flush_cb)
            return

        color_format = lv.COLOR_FORMAT.I1

        # Full-frame draw buffer (portrait: 480×800)
        draw_buf = lv.draw_buf_create(LV_WIDTH, LV_HEIGHT, color_format, 0)

        # Create LVGL display in portrait (480×800)
        self.disp_drv = lv.display_create(LV_WIDTH, LV_HEIGHT)
        self.disp_drv.set_color_format(color_format)
        self.disp_drv.set_draw_buffers(draw_buf, None)
        self.disp_drv.set_render_mode(lv.DISPLAY_RENDER_MODE.FULL)
        self.disp_drv.set_flush_cb(self._flush_cb)

        # White background
        scr = lv.screen_active()
        if scr:
            scr.set_style_bg_color(lv.color_white(), 0)

        print("[EPD] LVGL init OK (I1 portrait 480x800, FULL mode, C rotation)")

    def _flush_cb(self, disp_drv, area, color_p):
        """LVGL flush callback — rotate portrait frame to landscape via C.

        Calls lv_draw_sw_rotate() with ROTATION_270 and COLOR_FORMAT_I1.
        The I1 rotation was added to LVGL's lv_draw_sw_utils.c.
        """
        lv = self._lv
        w = area.x2 - area.x1 + 1
        h = area.y2 - area.y1 + 1

        src_stride = w // 8
        if w % 8:
            src_stride += 1

        pixel_size = src_stride * h
        data_view = color_p.__dereference__(I1_CLUT_SIZE + pixel_size)

        # Extract portrait pixel data (skip I1 CLUT header)
        portrait_data = bytes(data_view[I1_CLUT_SIZE:I1_CLUT_SIZE + pixel_size])

        # C-level rotation: 90° CW, portrait (480×800) → landscape (800×480)
        lv.draw_sw_rotate(portrait_data, self._shadow,
                          w, h, src_stride, HW_STRIDE,
                          lv.DISPLAY_ROTATION._90,
                          lv.COLOR_FORMAT.I1)

        self._dirty = True
        disp_drv.flush_ready()

    def _display_nowait(self, buf):
        """Push framebuffer and trigger refresh without blocking."""
        self._wait_busy(initial_ms=0)
        self._send_command(0x24)
        self._send_data_buf(buf)
        self._send_command(0x26)
        self._send_data_buf(buf)
        self._send_command(0x22)
        self._send_data(0xF7)
        self._send_command(0x20)

    def refresh(self, full=True):
        """Push shadow buffer to ePaper.

        Args:
            full: True = full waveform (both RAMs, ~2-4s, clears ghosting)
                  False = partial waveform (0x24 only, ~300-500ms, only
                  changed pixels drive ink). First call is always full
                  to establish the baseline in RAM 0x26.
        """
        if not self._dirty:
            return

        if full or not self._baseline_set:
            # Full refresh: write both RAMs (establishes baseline for partials)
            self._display_nowait(self._shadow)
            self._baseline_set = True
        else:
            # Partial refresh: write 0x24 only, partial waveform (0xFF)
            # Controller diffs 0x24 vs 0x26 — only changed pixels refresh
            self._wait_busy(initial_ms=0)
            self._send_command(0x3C)  # Border waveform for partial
            self._send_data(0x80)
            self._send_command(0x24)
            self._send_data_buf(self._shadow)
            self._send_command(0x22)
            self._send_data(0xFF)  # Partial waveform
            self._send_command(0x20)
        self._dirty = False

    def lv_refresh(self, partial=False):
        """Render LVGL and push to ePaper.

        Args:
            partial: True = partial waveform (~300-500ms, less flicker)
                     False = full waveform (~2-4s, clears ghosting)
        """
        lv = self._lv
        if lv:
            lv.tick_inc(100)
            lv.refr_now(self.disp_drv)
        self.refresh(full=not partial)
