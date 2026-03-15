"""
LVGL backend for the EPD 3.97" (800×480) e-Paper display.

CalmPilot portrait orientation: LVGL works in portrait coordinates
(480×800). The flush callback rotates each band 90° CW into the
800×480 shadow buffer using per-pixel bit manipulation, matching
the Waveshare GUI_Paint rotation pattern.

The shadow buffer is always in hardware layout (800 wide × 480 tall).
Rendering is demand-driven — call lv_refresh() to render and push.

Usage:
    from lib.sys.display.epd_3in97_lvgl import EPD_3in97_lvgl

    epd = EPD_3in97_lvgl(spi=spi, cs=10, dc=9, rst=46, busy=3)
    epd.init()
    epd.lvgl_init()

    import lvgl as lv
    scr = lv.screen_active()
    scr.set_style_bg_color(lv.color_white(), 0)
    label = lv.label(scr)
    label.set_text("CalmPilot")
    label.set_style_text_color(lv.color_black(), 0)
    label.center()
    epd.lv_refresh()
"""

from lib.sys.display.epd_3in97 import EPD_3in97

# Hardware panel geometry (landscape, as wired)
HW_WIDTH = 800
HW_HEIGHT = 480
HW_STRIDE = HW_WIDTH // 8  # 100 bytes per row
BUF_SIZE_MONO = HW_STRIDE * HW_HEIGHT  # 48000 bytes

# LVGL logical dimensions (portrait, what apps see)
LV_WIDTH = 480
LV_HEIGHT = 800

# I1 CLUT: 2 palette entries × 4 bytes (ARGB8888) = 8 bytes
I1_CLUT_SIZE = 8


class EPD_3in97_lvgl(EPD_3in97):
    """EPD driver with LVGL integration (portrait orientation).

    LVGL renders in portrait I1 (480×800). The flush callback
    rotates each band 90° CW into a landscape shadow buffer
    (800×480) for hardware. Per-pixel bit manipulation follows
    the Waveshare GUI_Paint rotation pattern:
        X_hw = 799 - y_lv
        Y_hw = x_lv
    """

    def __init__(self, spi, cs, dc, rst, busy):
        super().__init__(spi, cs, dc, rst, busy)
        self._lv = None
        self._shadow = None
        self._dirty = False
        self.disp_drv = None

    def lvgl_init(self, factor=10):
        """Initialize LVGL display driver for portrait ePaper.

        Args:
            factor: buffer height divisor (default 10 = 80-row bands)
        """
        import lvgl as lv
        self._lv = lv

        if not lv.is_initialized():
            lv.init()

        # No event loop — ePaper is demand-driven via lv_refresh()

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

        # Band height for partial rendering
        band_h = LV_HEIGHT // factor

        # Create draw buffer for one band (portrait width)
        draw_buf = lv.draw_buf_create(LV_WIDTH, band_h, color_format, 0)

        # Create LVGL display in PORTRAIT dimensions (480×800)
        self.disp_drv = lv.display_create(LV_WIDTH, LV_HEIGHT)
        self.disp_drv.set_color_format(color_format)
        self.disp_drv.set_draw_buffers(draw_buf, None)
        self.disp_drv.set_render_mode(lv.DISPLAY_RENDER_MODE.PARTIAL)
        self.disp_drv.set_flush_cb(self._flush_cb)

        # White background
        scr = lv.screen_active()
        if scr:
            scr.set_style_bg_color(lv.color_white(), 0)

        print(f"[EPD] LVGL init OK (portrait 480x800, {factor} bands)")

    def _flush_cb(self, disp_drv, area, color_p):
        """LVGL flush callback — rotate portrait band into landscape shadow.

        For each pixel in the LVGL portrait band, compute the rotated
        position in the 800×480 landscape shadow buffer:
            X_hw = 799 - y_lv      (portrait Y maps to hardware X, reversed)
            Y_hw = x_lv            (portrait X maps to hardware Y)

        Then set/clear the corresponding bit in the shadow buffer.
        Skips the 8-byte I1 CLUT palette at the start of the band data.
        """
        lv_x1 = area.x1
        lv_y1 = area.y1
        lv_x2 = area.x2
        lv_y2 = area.y2
        w = lv_x2 - lv_x1 + 1
        h = lv_y2 - lv_y1 + 1

        # Band stride in the LVGL portrait buffer
        band_stride = w // 8
        if w % 8:
            band_stride += 1

        # Dereference band data, skip CLUT header
        pixel_size = band_stride * h
        data_view = color_p.__dereference__(I1_CLUT_SIZE + pixel_size)

        shadow = self._shadow

        # Rotate each pixel from portrait → landscape
        for row in range(h):
            lv_y = lv_y1 + row
            src_row_offset = I1_CLUT_SIZE + row * band_stride

            for col in range(w):
                lv_x = lv_x1 + col

                # Read source pixel from portrait band (I1: MSB first)
                src_byte_idx = src_row_offset + (col >> 3)
                src_bit_mask = 0x80 >> (col & 7)
                pixel_set = data_view[src_byte_idx] & src_bit_mask

                # 270° CW rotation: X_hw = y_lv, Y_hw = 479 - x_lv
                hw_x = lv_y
                hw_y = 479 - lv_x

                # Write to shadow buffer (landscape 800×480)
                dst_byte_idx = (hw_y * HW_STRIDE) + (hw_x >> 3)
                dst_bit_mask = 0x80 >> (hw_x & 7)

                if pixel_set:
                    shadow[dst_byte_idx] |= dst_bit_mask
                else:
                    shadow[dst_byte_idx] &= ~dst_bit_mask & 0xFF

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
        """Push shadow buffer to ePaper (non-blocking)."""
        if not self._dirty:
            return
        if full:
            self._display_nowait(self._shadow)
        else:
            self._wait_busy(initial_ms=0)
            self._send_command(0x24)
            self._send_data_buf(self._shadow)
            self._send_command(0x22)
            self._send_data(0xD7)
            self._send_command(0x20)
        self._dirty = False

    def lv_refresh(self):
        """Render LVGL and push to ePaper in one call."""
        lv = self._lv
        if lv:
            lv.tick_inc(100)
            lv.refr_now(self.disp_drv)
        self.refresh()
