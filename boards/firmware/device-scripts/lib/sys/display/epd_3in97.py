"""
EPD 3.97" (800×480) e-Paper SPI driver — MicroPython.

Ported from Waveshare epaper_port.c (ESP-IDF C driver).
Uses board manifest for pin configuration.

Usage:
    from lib.sys.display.epd_3in97 import EPD_3in97

    # From board manifest pins
    epd = EPD_3in97(spi, cs=10, dc=9, rst=46, busy=3)
    epd.init()
    epd.clear()

    # With a framebuffer (48000 bytes for mono)
    import framebuf
    buf = bytearray(48000)
    fb = framebuf.FrameBuffer(buf, 800, 480, framebuf.MONO_HLSB)
    fb.fill(1)  # white
    fb.text("Hello ePaper!", 10, 10, 0)
    epd.display(buf)

    epd.sleep()
"""

import machine
import time

# Display geometry
WIDTH = 800
HEIGHT = 480
BUF_SIZE_MONO = (WIDTH // 8) * HEIGHT   # 48000
BUF_SIZE_4GRAY = BUF_SIZE_MONO * 2      # 96000


class EPD_3in97:
    """Driver for the 3.97" 800×480 B/W e-Paper display."""

    def __init__(self, spi, cs, dc, rst, busy):
        """
        Args:
            spi: machine.SPI instance (pre-configured)
            cs, dc, rst: GPIO pin numbers (int)
            busy: GPIO pin number (int), active HIGH while busy
        """
        self.spi = spi
        self.cs = machine.Pin(cs, machine.Pin.OUT, value=1)
        self.dc = machine.Pin(dc, machine.Pin.OUT, value=0)
        self.rst = machine.Pin(rst, machine.Pin.OUT, value=1)
        self.busy = machine.Pin(busy, machine.Pin.IN)
        self.width = WIDTH
        self.height = HEIGHT
        self._buf1 = bytearray(1)

    # ── Low-level SPI protocol ──

    def _send_command(self, cmd):
        """Send a command byte (DC=low)."""
        self.dc.value(0)
        self.cs.value(0)
        self._buf1[0] = cmd
        self.spi.write(self._buf1)
        self.cs.value(1)

    def _send_data(self, data):
        """Send a single data byte (DC=high)."""
        self.dc.value(1)
        self.cs.value(0)
        self._buf1[0] = data
        self.spi.write(self._buf1)
        self.cs.value(1)

    def _send_data_buf(self, buf):
        """Send a buffer of data bytes via SPI (DC=high).

        Sends in 4096-byte chunks to stay within SPI DMA limits.
        """
        self.dc.value(1)
        self.cs.value(0)
        mv = memoryview(buf)
        total = len(buf)
        chunk = 4096
        for i in range(0, total, chunk):
            end = min(i + chunk, total)
            self.spi.write(mv[i:end])
        self.cs.value(1)

    def _wait_busy(self, initial_ms=50):
        """Wait until the BUSY pin goes LOW (display ready)."""
        time.sleep_ms(initial_ms)
        while self.busy.value():
            time.sleep_ms(10)

    def _reset(self):
        """Hardware reset sequence."""
        self.rst.value(1)
        time.sleep_ms(50)
        self.rst.value(0)
        time.sleep_ms(2)
        self.rst.value(1)
        time.sleep_ms(50)

    def _set_window(self, x_start, y_start, x_end, y_end):
        """Set the RAM X/Y window and cursor position."""
        # RAM-X start/end (pixel units, 16-bit)
        self._send_command(0x44)
        self._send_data(x_start & 0xFF)
        self._send_data((x_start >> 8) & 0xFF)
        self._send_data(x_end & 0xFF)
        self._send_data((x_end >> 8) & 0xFF)

        # RAM-Y start/end (pixel units, 16-bit)
        self._send_command(0x45)
        self._send_data(y_start & 0xFF)
        self._send_data((y_start >> 8) & 0xFF)
        self._send_data(y_end & 0xFF)
        self._send_data((y_end >> 8) & 0xFF)

    def _set_cursor(self, x, y):
        """Set RAM X/Y cursor position."""
        self._send_command(0x4E)
        self._send_data(x & 0xFF)
        self._send_data((x >> 8) & 0xFF)
        self._send_command(0x4F)
        self._send_data(y & 0xFF)
        self._send_data((y >> 8) & 0xFF)

    # ── Display trigger modes ──

    def _turn_on_display(self):
        """Full refresh (slowest, best quality)."""
        self._send_command(0x22)
        self._send_data(0xF7)
        self._send_command(0x20)
        self._wait_busy()

    def _turn_on_display_fast(self):
        """Fast refresh (~1.5s)."""
        self._send_command(0x22)
        self._send_data(0xD7)
        self._send_command(0x20)
        self._wait_busy()

    def _turn_on_display_partial(self):
        """Partial refresh (fastest, some ghosting)."""
        self._send_command(0x22)
        self._send_data(0xFF)
        self._send_command(0x20)
        self._wait_busy(5)

    # ── Initialization modes ──

    def init(self):
        """Standard full-refresh initialization."""
        time.sleep_ms(10)
        self._reset()
        self._wait_busy()

        self._send_command(0x12)  # SWRESET
        self._wait_busy()

        # Temperature sensor internal
        self._send_command(0x18)
        self._send_data(0x80)

        # Booster soft start
        self._send_command(0x0C)
        for b in (0xAE, 0xC7, 0xC3, 0xC0, 0x80):
            self._send_data(b)

        # Driver output control
        self._send_command(0x01)
        self._send_data((HEIGHT - 1) & 0xFF)
        self._send_data(((HEIGHT - 1) >> 8) & 0xFF)
        self._send_data(0x02)

        # Border waveform
        self._send_command(0x3C)
        self._send_data(0x01)

        # Data entry mode: Y decrement, X increment
        self._send_command(0x11)
        self._send_data(0x01)

        # Window: full display
        self._set_window(0, HEIGHT - 1, WIDTH - 1, 0)
        self._set_cursor(0, 0)
        self._wait_busy()

        print("[EPD] init OK (full refresh mode)")

    def init_fast(self):
        """Fast refresh initialization (~1.5s update)."""
        time.sleep_ms(500)
        self._reset()
        self._wait_busy()

        self._send_command(0x12)  # SWRESET
        self._wait_busy()

        # Booster soft start
        self._send_command(0x0C)
        for b in (0xAE, 0xC7, 0xC3, 0xC0, 0x80):
            self._send_data(b)

        # Driver output control
        self._send_command(0x01)
        self._send_data((HEIGHT - 1) & 0xFF)
        self._send_data(((HEIGHT - 1) >> 8) & 0xFF)
        self._send_data(0x02)

        # Data entry mode
        self._send_command(0x11)
        self._send_data(0x01)

        # Window: full display
        self._set_window(0, HEIGHT - 1, WIDTH - 1, 0)
        self._set_cursor(0, 0)
        self._wait_busy()

        # Border + fast mode
        self._send_command(0x3C)
        self._send_data(0x01)
        self._send_command(0x18)
        self._send_data(0x80)
        self._send_command(0x1A)
        self._send_data(0x6A)

        print("[EPD] init OK (fast refresh mode)")

    def init_4gray(self):
        """4-gray level initialization."""
        time.sleep_ms(500)
        self._reset()
        self._wait_busy()

        self._send_command(0x12)
        self._wait_busy()

        self._send_command(0x0C)
        for b in (0xAE, 0xC7, 0xC3, 0xC0, 0x80):
            self._send_data(b)

        self._send_command(0x01)
        self._send_data((HEIGHT - 1) & 0xFF)
        self._send_data(((HEIGHT - 1) >> 8) & 0xFF)
        self._send_data(0x02)

        self._send_command(0x11)
        self._send_data(0x01)

        self._set_window(0, HEIGHT - 1, WIDTH - 1, 0)
        self._set_cursor(0, 0)
        self._wait_busy()

        self._send_command(0x3C)
        self._send_data(0x01)
        self._send_command(0x18)
        self._send_data(0x80)
        self._send_command(0x1A)
        self._send_data(0x5A)

        print("[EPD] init OK (4-gray mode)")

    # ── Display operations ──

    def clear(self, color=0xFF):
        """Clear display to white (0xFF) or black (0x00)."""
        w = WIDTH // 8
        row = bytes([color] * w)

        self._send_command(0x24)
        self.dc.value(1)
        self.cs.value(0)
        for _ in range(HEIGHT):
            self.spi.write(row)
        self.cs.value(1)

        self._send_command(0x26)
        self.dc.value(1)
        self.cs.value(0)
        for _ in range(HEIGHT):
            self.spi.write(row)
        self.cs.value(1)

        self._turn_on_display()

    def display(self, buf):
        """Display a full framebuffer (48000 bytes, 1-bit mono).

        Writes to both RAM channels (0x24 + 0x26) for clean base image.
        Use this for initial/full display updates.
        """
        self._send_command(0x24)
        self._send_data_buf(buf)
        self._send_command(0x26)
        self._send_data_buf(buf)
        self._turn_on_display()

    def display_fast(self, buf):
        """Display with fast refresh (~1.5s). Call init_fast() first."""
        self._send_command(0x24)
        self._send_data_buf(buf)
        self._turn_on_display_fast()

    def display_partial(self, buf, x, y, w, h):
        """Partial refresh of a rectangular region.

        Args:
            buf: pixel data for the region (w/8 * h bytes)
            x, y: top-left corner (x must be multiple of 8)
            w, h: width and height (w must be multiple of 8)
        """
        x_start = x // 8
        x_end = (x + w) // 8
        if (x + w) % 8:
            x_end += 1

        x_end -= 1
        y_end = y + h - 1

        # No hardware reset needed — display is already initialized.
        # Just configure border for partial mode.
        self._send_command(0x3C)
        self._send_data(0x80)

        # Set partial window (pixel coordinates for X, row for Y)
        self._send_command(0x44)
        self._send_data((x_start * 8) & 0xFF)
        self._send_data(((x_start * 8) >> 8) & 0xFF)
        self._send_data((x_end * 8) & 0xFF)
        self._send_data(((x_end * 8) >> 8) & 0xFF)

        self._send_command(0x45)
        self._send_data(y_end & 0xFF)
        self._send_data((y_end >> 8) & 0xFF)
        self._send_data(y & 0xFF)
        self._send_data((y >> 8) & 0xFF)

        # Set cursor
        self._send_command(0x4E)
        self._send_data((x_start * 8) & 0xFF)
        self._send_data(((x_start * 8) >> 8) & 0xFF)
        self._send_command(0x4F)
        self._send_data(y & 0xFF)
        self._send_data((y >> 8) & 0xFF)

        # Write to RAM and refresh
        self._send_command(0x24)
        self._send_data_buf(buf)
        self._turn_on_display_partial()

    # ── Power management ──

    def sleep(self):
        """Enter deep sleep mode. Call init() to wake."""
        self._send_command(0x10)
        self._send_data(0x01)
        time.sleep_ms(10)
        self.rst.value(0)
        self.cs.value(0)
        self.dc.value(0)
        time.sleep_ms(10)
        print("[EPD] sleep")

    def wake(self):
        """Wake from sleep by re-initializing."""
        self.init()
