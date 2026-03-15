"""
LVGL backend for the EPD 3.97" (800×480) e-Paper display.

Connects LVGL's rendering engine to the EPD_3in97 SPI driver,
providing proportional fonts, widgets, and layout on ePaper.

Uses deferred full-frame refresh: LVGL renders bands into a shadow
buffer, then a single epd.display() call pushes the whole frame.

Usage:
    from lib.sys.display.epd_3in97_lvgl import EPD_3in97_lvgl

    # Create with SoftSPI (see display_manager.py for full setup)
    epd = EPD_3in97_lvgl(spi=spi, cs=10, dc=9, rst=46, busy=3)
    epd.init()
    epd.lvgl_init()

    # Now use LVGL widgets:
    import lvgl as lv
    scr = lv.screen_active()
    label = lv.label(scr)
    label.set_text("Hello ePaper!")
    epd.refresh()  # Push to display
"""

from lib.sys.display.epd_3in97 import EPD_3in97

# Display geometry
WIDTH = 800
HEIGHT = 480
BUF_SIZE_MONO = (WIDTH // 8) * HEIGHT  # 48000 bytes


class EPD_3in97_lvgl(EPD_3in97):
    """EPD driver with LVGL integration.

    Extends EPD_3in97 with LVGL display driver wiring.
    LVGL renders in I1 (1-bit monochrome) format, and bands
    are collected into a shadow framebuffer for deferred refresh.
    """

    def __init__(self, spi, cs, dc, rst, busy):
        super().__init__(spi, cs, dc, rst, busy)
        self._lv = None
        self._shadow = None
        self._dirty = False
        self.disp_drv = None
        self.event_loop = None

    def lvgl_init(self, factor=8):
        """Initialize LVGL display driver for this ePaper.

        Args:
            factor: buffer height divisor (default 8 = 60-row bands)
        """
        import lvgl as lv
        self._lv = lv

        try:
            import lv_utils
        except ImportError:
            from lib.sys.display import lv_utils

        if not lv.is_initialized():
            lv.init()

        # Start event loop if not running
        if not lv_utils.event_loop.is_running():
            self.event_loop = lv_utils.event_loop()

        # Shadow framebuffer — full screen, 1-bit packed
        self._shadow = bytearray(BUF_SIZE_MONO)
        self._shadow_mv = memoryview(self._shadow)
        self._dirty = False

        # Reuse existing LVGL display if present
        existing = lv.display_get_default()
        if existing is not None:
            self.disp_drv = existing
            self.disp_drv.set_flush_cb(self._flush_cb)
            return

        # Use I1 (1-bit indexed) color format for monochrome
        color_format = lv.COLOR_FORMAT.I1

        # Create draw buffers — band height = HEIGHT // factor
        band_h = self.height // factor
        draw_buf1 = lv.draw_buf_create(self.width, band_h, color_format, 0)
        draw_buf2 = None  # single buffer is fine for ePaper

        # Create and configure LVGL display
        self.disp_drv = lv.display_create(self.width, self.height)
        self.disp_drv.set_color_format(color_format)
        self.disp_drv.set_draw_buffers(draw_buf1, draw_buf2)
        self.disp_drv.set_render_mode(lv.DISPLAY_RENDER_MODE.PARTIAL)
        self.disp_drv.set_flush_cb(self._flush_cb)

        # Set white background (0xFF = white in ePaper)
        scr = lv.screen_active()
        if scr:
            scr.set_style_bg_color(lv.color_white(), 0)

        # Fill shadow with white
        for i in range(len(self._shadow)):
            self._shadow[i] = 0xFF

        print("[EPD] LVGL init OK (I1 monochrome)")

    def _flush_cb(self, disp_drv, area, color_p):
        """LVGL flush callback — copy rendered band into shadow buffer.

        LVGL renders in bands (partial render mode). Each band is
        a horizontal strip of the display. We copy each band into
        the shadow buffer at the correct offset.
        """
        lv = self._lv
        x1 = area.x1
        y1 = area.y1
        x2 = area.x2
        y2 = area.y2
        w = x2 - x1 + 1
        h = y2 - y1 + 1

        # I1 format: 1 bit per pixel, packed MSB first (MONO_HLSB)
        # Row stride for the full display = WIDTH // 8 = 100 bytes
        row_stride = self.width // 8

        # Row stride for the rendered band
        band_stride = w // 8
        if w % 8:
            band_stride += 1

        # Get the raw pixel data from LVGL
        buf_size = band_stride * h
        data_view = color_p.__dereference__(buf_size)

        if x1 == 0 and w == self.width:
            # Fast path: band spans full width — direct memcpy
            offset = y1 * row_stride
            self._shadow_mv[offset:offset + buf_size] = data_view
        else:
            # Slow path: partial width — copy row by row
            for row in range(h):
                src_offset = row * band_stride
                dst_offset = (y1 + row) * row_stride + (x1 // 8)
                for b in range(band_stride):
                    self._shadow[dst_offset + b] = data_view[src_offset + b]

        self._dirty = True
        disp_drv.flush_ready()

    def refresh(self, full=True):
        """Push the shadow buffer to the ePaper display.

        Args:
            full: if True, use full refresh (best quality, ~4s)
                  if False, use fast refresh (~1.5s, needs init_fast())
        """
        if not self._dirty:
            return

        if full:
            self.display(self._shadow)
        else:
            self.display_fast(self._shadow)

        self._dirty = False

    def lv_refresh(self):
        """Run LVGL rendering and push to ePaper in one call.

        Convenience method: triggers LVGL to render dirty areas,
        then pushes the result to the display.
        """
        lv = self._lv
        if lv:
            lv.refr_now(self.disp_drv)
        self.refresh()
