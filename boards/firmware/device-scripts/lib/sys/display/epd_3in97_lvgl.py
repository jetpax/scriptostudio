"""
LVGL backend for the EPD 3.97" (800×480) e-Paper display.

CalmPilot portrait orientation: LVGL renders in portrait (480×800).
The flush callback rotates each dirty band directly into the shadow
buffer using lv_draw_sw_rotate() (C-level, patched for I1 — no
memzero, explicit set/clear, safe for sub-region writes).

Supports both full and partial (windowed) refresh:
  - lv_refresh()          → partial by default (fast, no flash)
  - lv_refresh(full=True) → full waveform (clears ghosting)

First refresh is always full to establish the EPD baseline.

Usage:

import lvgl as lv
from lib.sys.display.display_manager import get_display

epd = get_display()
epd.init()
epd.lvgl_init()

scr = lv.screen_active()
scr.clean()
scr.set_style_bg_color(lv.color_white(), 0)
label = lv.label(scr)
label.set_text("Hello World!")
label.set_style_text_color(lv.color_black(), 0)
label.set_style_text_font(lv.font_montserrat_48, 0)
label.align(lv.ALIGN.CENTER, 0, -40)

# First call: full refresh (establishes baseline)
epd.lv_refresh(full=True)

# Subsequent calls: partial (only changed pixels update)
import time; time.sleep(5)
label.set_text("Updated!")
epd.lv_refresh()  # fast, no flash
"""

from lib.sys.display.epd_3in97 import (
    EPD_3in97,
    BORDER_WAVEFORM, BORDER_NORMAL, BORDER_PARTIAL,
    WRITE_RAM_BW, WRITE_RAM_RED,
    DISPLAY_UPDATE_CTRL2, MASTER_ACTIVATION,
    DATA_ENTRY_MODE, ENTRY_X_INC_Y_DEC,
    WAVEFORM_FULL, WAVEFORM_PARTIAL,
    SET_RAM_X_RANGE, SET_RAM_Y_RANGE,
    SET_RAM_X_CURSOR, SET_RAM_Y_CURSOR,
)


# Hardware panel geometry (landscape, as wired)
HW_WIDTH = 800
HW_HEIGHT = 480
HW_STRIDE = HW_WIDTH // 8  # 100 bytes per row

# LVGL logical dimensions (portrait, what apps see)
LV_WIDTH = 480
LV_HEIGHT = 800
LV_STRIDE = LV_WIDTH // 8  # 60 bytes per row

BUF_SIZE_MONO = HW_STRIDE * HW_HEIGHT  # 48000 bytes

# Band buffer: 80 rows × 60 bytes/row = 4800 bytes (saves 43KB vs full frame)
BAND_ROWS = 80

# I1 CLUT: 2 palette entries × 4 bytes (ARGB8888) = 8 bytes
I1_CLUT_SIZE = 8


class EPD_3in97_lvgl(EPD_3in97):
    """EPD driver with LVGL integration (portrait via C rotation).

    Uses PARTIAL render mode with an 80-row band buffer. LVGL only
    renders dirty regions. Each band is rotated directly into the
    correct position in the landscape shadow buffer (no memzero in C).

    The flush callback tracks the dirty bounding box in hardware
    coordinates. refresh() pushes only the dirty window via RAM
    windowing commands for fast partial updates.
    """

    def __init__(self, spi, cs, dc, rst, busy):
        super().__init__(spi, cs, dc, rst, busy)
        self._lv = None
        self._shadow = None      # Current frame (rotated hw layout)
        self._baseline_set = False
        self.disp_drv = None
        # Dirty rect accumulators (hw pixel coords)
        self._dirty_x1 = HW_WIDTH
        self._dirty_x2 = 0
        self._dirty_y1 = HW_HEIGHT
        self._dirty_y2 = 0

    def _reset_dirty(self):
        """Reset dirty rect accumulators."""
        self._dirty_x1 = HW_WIDTH
        self._dirty_x2 = 0
        self._dirty_y1 = HW_HEIGHT
        self._dirty_y2 = 0

    def lvgl_init(self):
        """Initialize LVGL display driver with band-based partial rendering."""
        import lvgl as lv
        self._lv = lv

        if not lv.is_initialized():
            lv.init()

        # Shadow buffer in HARDWARE layout (800×480, landscape)
        self._shadow = bytearray(BUF_SIZE_MONO)
        # Fill with white (0xFF = white in ePaper)
        for i in range(BUF_SIZE_MONO):
            self._shadow[i] = 0xFF
        self._reset_dirty()

        # Reuse existing LVGL display if present
        existing = lv.display_get_default()
        if existing is not None:
            self.disp_drv = existing
            self.disp_drv.set_flush_cb(self._flush_cb)
            return

        color_format = lv.COLOR_FORMAT.I1

        # Band buffer (80 rows, saves 43KB vs full frame)
        draw_buf = lv.draw_buf_create(LV_WIDTH, BAND_ROWS, color_format, 0)

        # Create LVGL display in portrait (480×800)
        self.disp_drv = lv.display_create(LV_WIDTH, LV_HEIGHT)
        self.disp_drv.set_color_format(color_format)
        self.disp_drv.set_draw_buffers(draw_buf, None)
        self.disp_drv.set_render_mode(lv.DISPLAY_RENDER_MODE.PARTIAL)
        self.disp_drv.set_flush_cb(self._flush_cb)

        # White background
        scr = lv.screen_active()
        if scr:
            scr.set_style_bg_color(lv.color_white(), 0)

        print("[EPD] LVGL init OK (I1 portrait 480x800, PARTIAL mode, band=80)")

    def _flush_cb(self, disp_drv, area, color_p):
        """LVGL flush callback — rotate band directly into shadow.

        Each band is placed at the correct position in the shadow via
        memoryview offset + dst_stride. The patched C rotation (no
        memzero, explicit set/clear) preserves adjacent columns.

        Portrait → hardware coordinate mapping (90° CW):
          hw_x (column)   = portrait_y
          shadow_row      = (LV_WIDTH - 1) - portrait_x
        """
        lv = self._lv
        w = area.x2 - area.x1 + 1
        h = area.y2 - area.y1 + 1

        src_stride = (w + 7) // 8
        pixel_size = src_stride * h
        data_view = color_p.__dereference__(I1_CLUT_SIZE + pixel_size)

        # Extract portrait pixel data (skip I1 CLUT header)
        portrait_data = bytes(data_view[I1_CLUT_SIZE:I1_CLUT_SIZE + pixel_size])

        # Fix sub-byte alignment: the I1 rotation writes starting at
        # bit 0 of the destination byte, but if area.y1 isn't byte-
        # aligned the content should start at bit (area.y1 % 8).
        # Padding the source with white rows shifts the output to the
        # correct sub-byte position.
        bit_offset = area.y1 % 8
        if bit_offset > 0:
            pad_bytes = bit_offset * src_stride
            padded = bytearray(pad_bytes + pixel_size)
            for i in range(pad_bytes):
                padded[i] = 0xFF  # white padding
            padded[pad_bytes:] = portrait_data
            portrait_data = bytes(padded)
            h += bit_offset

        # Rotation output placement in shadow:
        # rotate90 maps src(x,y) → dst(y, src_width-1-x)
        # Output row 0 = portrait x = x1 + w - 1 = x2
        # Shadow row for portrait x = (LV_WIDTH - 1) - x
        # So output row 0 → shadow row (LV_WIDTH - 1) - x2
        hw_col_byte = area.y1 // 8
        shadow_row_start = (LV_WIDTH - 1) - area.x2
        dst_offset = shadow_row_start * HW_STRIDE + hw_col_byte

        dst = memoryview(self._shadow)[dst_offset:]

        lv.draw_sw_rotate(portrait_data, dst,
                          w, h, src_stride, HW_STRIDE,
                          lv.DISPLAY_ROTATION._90,
                          lv.COLOR_FORMAT.I1)

        # Accumulate dirty rect (hw pixel coordinates)
        # Portrait y → hw column (x)
        # Portrait x → shadow row = (LV_WIDTH - 1) - portrait_x
        hw_row_start = (LV_WIDTH - 1) - area.x2
        hw_row_end = LV_WIDTH - area.x1
        if area.y1 < self._dirty_x1:
            self._dirty_x1 = area.y1
        if area.y2 + 1 > self._dirty_x2:
            self._dirty_x2 = area.y2 + 1
        if hw_row_start < self._dirty_y1:
            self._dirty_y1 = hw_row_start
        if hw_row_end > self._dirty_y2:
            self._dirty_y2 = hw_row_end

        disp_drv.flush_ready()

    def _display_full(self):
        """Full refresh: write both RAMs (establishes baseline)."""
        self._wait_busy(initial_ms=0)
        self._send_command(BORDER_WAVEFORM)
        self._send_data(BORDER_NORMAL)
        self._set_window(0, HW_HEIGHT - 1, HW_WIDTH - 1, 0)
        self._set_cursor(0, 0)
        self._send_command(WRITE_RAM_BW)
        self._send_data_buf(self._shadow)
        self._send_command(WRITE_RAM_RED)
        self._send_data_buf(self._shadow)
        self._send_command(DISPLAY_UPDATE_CTRL2)
        self._send_data(WAVEFORM_FULL)
        self._send_command(MASTER_ACTIVATION)

    def _display_partial(self, col_start, col_end, row_start, row_end):
        """Partial refresh: full-buffer differential.

        Writes full shadow to BW, compares RED vs BW, syncs RED after.
        Pattern from papyrix-reader displayBuffer() single-buffer mode.
        Total time: ~650ms (22ms BW + 400ms waveform + 100ms margin + 22ms RED)
        """

        self._wait_busy(initial_ms=0)

        # Full window
        self._set_window(0, HW_HEIGHT - 1, HW_WIDTH - 1, 0)
        self._set_cursor(0, 0)

        # Write full shadow to BW
        self._send_command(WRITE_RAM_BW)
        self._send_data_buf(self._shadow)

        # Display Update Control 1: compare RED vs BW
        self._send_command(0x21)
        self._send_data(0x00)

        # Border + partial waveform (0xFF: self-manages power on/off)
        self._send_command(BORDER_WAVEFORM)
        self._send_data(BORDER_PARTIAL)
        self._send_command(DISPLAY_UPDATE_CTRL2)
        self._send_data(WAVEFORM_PARTIAL)
        self._send_command(MASTER_ACTIVATION)

        # Sync RED = current frame for next differential comparison
        self._wait_busy(initial_ms=100)
        self._set_window(0, HW_HEIGHT - 1, HW_WIDTH - 1, 0)
        self._set_cursor(0, 0)
        self._send_command(WRITE_RAM_RED)
        self._send_data_buf(self._shadow)


    def refresh(self, full=True):
        """Push shadow buffer to ePaper.

        Args:
            full: True = full waveform (both RAMs, ~2-4s)
                  False = partial waveform (windowed, ~200-500ms)
        """
        if full or not self._baseline_set:
            self._display_full()
            self._baseline_set = True
        else:
            # Check if anything is dirty
            if self._dirty_x1 >= self._dirty_x2:
                return
            # Byte-align column range
            col_start = self._dirty_x1 // 8
            col_end = (self._dirty_x2 + 7) // 8
            if col_end > HW_STRIDE:
                col_end = HW_STRIDE
            row_start = self._dirty_y1
            row_end = self._dirty_y2
            if row_end > HW_HEIGHT:
                row_end = HW_HEIGHT
            self._display_partial(col_start, col_end, row_start, row_end)

        self._reset_dirty()

    def lv_refresh(self, full=False):
        """Render LVGL and push to ePaper.

        Args:
            full: True = full waveform (de-ghosting)
                  False = partial waveform (fast, default)
        """
        lv = self._lv
        if lv:
            lv.tick_inc(100)
            lv.refr_now(self.disp_drv)
        if not self._baseline_set:
            full = True
        self.refresh(full=full)
