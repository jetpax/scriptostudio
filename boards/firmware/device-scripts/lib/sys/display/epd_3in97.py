"""
EPD 3.97" (800×480) e-Paper SPI driver — MicroPython.

Ported from Waveshare epaper_port.c (ESP-IDF C driver).
Uses board manifest for pin configuration.

Controller: SSD1677 (Solomon Systech)

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

# ── SSD1677 Register Definitions ──
# Reference: SSD1677 datasheet (Solomon Systech)

# Control registers
DRIVER_OUTPUT_CONTROL  = 0x01  # Gate line count + scan direction
BOOSTER_SOFT_START     = 0x0C  # Charge pump phase timing
DEEP_SLEEP_MODE        = 0x10  # Enter deep sleep (0x01 = deep sleep mode 1)
DATA_ENTRY_MODE        = 0x11  # Address counter direction (X/Y inc/dec)
SW_RESET               = 0x12  # Software reset — restores all defaults
TEMP_SENSOR_CONTROL    = 0x18  # Temperature sensor selection (0x80 = internal)
TEMP_SENSOR_WRITE      = 0x1A  # Write temperature value (fast/4gray speed)
MASTER_ACTIVATION      = 0x20  # Trigger display update sequence
DISPLAY_UPDATE_CTRL2   = 0x22  # Select waveform sequence (see WAVEFORM_*)
WRITE_RAM_BW           = 0x24  # Write to B/W RAM (new image)
WRITE_RAM_RED          = 0x26  # Write to RED/OLD RAM (baseline image)
BORDER_WAVEFORM        = 0x3C  # Border waveform control
SET_RAM_X_RANGE        = 0x44  # RAM X start/end address (pixel units)
SET_RAM_Y_RANGE        = 0x45  # RAM Y start/end address (pixel units)
SET_RAM_X_CURSOR       = 0x4E  # RAM X address counter
SET_RAM_Y_CURSOR       = 0x4F  # RAM Y address counter

# Display Update Control 2 waveform sequences (0x22 data byte)
# Each bit enables a pipeline stage: LUT load, clock, analog, display, etc.
WAVEFORM_FULL          = 0xF7  # Full: all stages, both RAMs, slowest/cleanest
WAVEFORM_FAST          = 0xD7  # Fast: skip some stages (~1.5s, some ghosting)
WAVEFORM_PARTIAL       = 0xFF  # Partial: drives only changed pixels (RAM XOR)

# Data Entry Mode values (0x11 data byte)
# Bit 0: X direction (0=dec, 1=inc)
# Bit 1: Y direction (0=dec, 1=inc)
ENTRY_X_INC_Y_DEC     = 0x01  # X increment, Y decrement (default for portrait)

# Border Waveform values (0x3C data byte)
BORDER_NORMAL          = 0x01  # Normal — border follows LUT waveform
BORDER_PARTIAL         = 0x80  # Partial — keeps border stable (no flash)

# Driver Output Control scan direction
SCAN_DIRECTION         = 0x02  # Interlace scan

# Temperature presets (0x1A data byte)
TEMP_FAST              = 0x6A  # Fast refresh timing preset
TEMP_4GRAY             = 0x5A  # 4-gray level timing preset


class EPD_3in97:
    """Driver for the 3.97" 800×480 B/W e-Paper display (SSD1677)."""

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
        """Set the RAM X/Y window."""
        self._send_command(SET_RAM_X_RANGE)
        self._send_data(x_start & 0xFF)
        self._send_data((x_start >> 8) & 0xFF)
        self._send_data(x_end & 0xFF)
        self._send_data((x_end >> 8) & 0xFF)

        self._send_command(SET_RAM_Y_RANGE)
        self._send_data(y_start & 0xFF)
        self._send_data((y_start >> 8) & 0xFF)
        self._send_data(y_end & 0xFF)
        self._send_data((y_end >> 8) & 0xFF)

    def _set_cursor(self, x, y):
        """Set RAM X/Y cursor position."""
        self._send_command(SET_RAM_X_CURSOR)
        self._send_data(x & 0xFF)
        self._send_data((x >> 8) & 0xFF)
        self._send_command(SET_RAM_Y_CURSOR)
        self._send_data(y & 0xFF)
        self._send_data((y >> 8) & 0xFF)

    # ── Display trigger modes ──

    def _turn_on_display(self):
        """Full refresh (slowest, best quality)."""
        self._send_command(DISPLAY_UPDATE_CTRL2)
        self._send_data(WAVEFORM_FULL)
        self._send_command(MASTER_ACTIVATION)
        self._wait_busy()

    def _turn_on_display_fast(self):
        """Fast refresh (~1.5s)."""
        self._send_command(DISPLAY_UPDATE_CTRL2)
        self._send_data(WAVEFORM_FAST)
        self._send_command(MASTER_ACTIVATION)
        self._wait_busy()

    def _turn_on_display_partial(self):
        """Partial refresh (fastest, some ghosting)."""
        self._send_command(DISPLAY_UPDATE_CTRL2)
        self._send_data(WAVEFORM_PARTIAL)
        self._send_command(MASTER_ACTIVATION)
        self._wait_busy(5)

    # ── Initialization modes ──

    def init(self):
        """Standard full-refresh initialization."""
        time.sleep_ms(10)
        self._reset()
        self._wait_busy()

        self._send_command(SW_RESET)
        self._wait_busy()

        self._send_command(TEMP_SENSOR_CONTROL)
        self._send_data(0x80)  # Use internal temperature sensor

        self._send_command(BOOSTER_SOFT_START)
        for b in (0xAE, 0xC7, 0xC3, 0xC0, 0x80):
            self._send_data(b)

        self._send_command(DRIVER_OUTPUT_CONTROL)
        self._send_data((HEIGHT - 1) & 0xFF)
        self._send_data(((HEIGHT - 1) >> 8) & 0xFF)
        self._send_data(SCAN_DIRECTION)

        self._send_command(BORDER_WAVEFORM)
        self._send_data(BORDER_NORMAL)

        self._send_command(DATA_ENTRY_MODE)
        self._send_data(ENTRY_X_INC_Y_DEC)

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

        self._send_command(SW_RESET)
        self._wait_busy()

        self._send_command(BOOSTER_SOFT_START)
        for b in (0xAE, 0xC7, 0xC3, 0xC0, 0x80):
            self._send_data(b)

        self._send_command(DRIVER_OUTPUT_CONTROL)
        self._send_data((HEIGHT - 1) & 0xFF)
        self._send_data(((HEIGHT - 1) >> 8) & 0xFF)
        self._send_data(SCAN_DIRECTION)

        self._send_command(DATA_ENTRY_MODE)
        self._send_data(ENTRY_X_INC_Y_DEC)

        # Window: full display
        self._set_window(0, HEIGHT - 1, WIDTH - 1, 0)
        self._set_cursor(0, 0)
        self._wait_busy()

        self._send_command(BORDER_WAVEFORM)
        self._send_data(BORDER_NORMAL)
        self._send_command(TEMP_SENSOR_CONTROL)
        self._send_data(0x80)
        self._send_command(TEMP_SENSOR_WRITE)
        self._send_data(TEMP_FAST)

        print("[EPD] init OK (fast refresh mode)")

    def init_4gray(self):
        """4-gray level initialization."""
        time.sleep_ms(500)
        self._reset()
        self._wait_busy()

        self._send_command(SW_RESET)
        self._wait_busy()

        self._send_command(BOOSTER_SOFT_START)
        for b in (0xAE, 0xC7, 0xC3, 0xC0, 0x80):
            self._send_data(b)

        self._send_command(DRIVER_OUTPUT_CONTROL)
        self._send_data((HEIGHT - 1) & 0xFF)
        self._send_data(((HEIGHT - 1) >> 8) & 0xFF)
        self._send_data(SCAN_DIRECTION)

        self._send_command(DATA_ENTRY_MODE)
        self._send_data(ENTRY_X_INC_Y_DEC)

        self._set_window(0, HEIGHT - 1, WIDTH - 1, 0)
        self._set_cursor(0, 0)
        self._wait_busy()

        self._send_command(BORDER_WAVEFORM)
        self._send_data(BORDER_NORMAL)
        self._send_command(TEMP_SENSOR_CONTROL)
        self._send_data(0x80)
        self._send_command(TEMP_SENSOR_WRITE)
        self._send_data(TEMP_4GRAY)

        print("[EPD] init OK (4-gray mode)")

    # ── Display operations ──

    def clear(self, color=0xFF):
        """Clear display to white (0xFF) or black (0x00)."""
        w = WIDTH // 8
        row = bytes([color] * w)

        self._send_command(WRITE_RAM_BW)
        self.dc.value(1)
        self.cs.value(0)
        for _ in range(HEIGHT):
            self.spi.write(row)
        self.cs.value(1)

        self._send_command(WRITE_RAM_RED)
        self.dc.value(1)
        self.cs.value(0)
        for _ in range(HEIGHT):
            self.spi.write(row)
        self.cs.value(1)

        self._turn_on_display()

    def display(self, buf):
        """Display a full framebuffer (48000 bytes, 1-bit mono).

        Writes to both RAM channels for clean base image.
        Use this for initial/full display updates.
        """
        self._send_command(WRITE_RAM_BW)
        self._send_data_buf(buf)
        self._send_command(WRITE_RAM_RED)
        self._send_data_buf(buf)
        self._turn_on_display()

    def display_fast(self, buf):
        """Display with fast refresh (~1.5s). Call init_fast() first."""
        self._send_command(WRITE_RAM_BW)
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

        # Configure border for partial mode
        self._send_command(BORDER_WAVEFORM)
        self._send_data(BORDER_PARTIAL)

        # Set partial window
        self._send_command(SET_RAM_X_RANGE)
        self._send_data((x_start * 8) & 0xFF)
        self._send_data(((x_start * 8) >> 8) & 0xFF)
        self._send_data((x_end * 8) & 0xFF)
        self._send_data(((x_end * 8) >> 8) & 0xFF)

        self._send_command(SET_RAM_Y_RANGE)
        self._send_data(y_end & 0xFF)
        self._send_data((y_end >> 8) & 0xFF)
        self._send_data(y & 0xFF)
        self._send_data((y >> 8) & 0xFF)

        self._send_command(SET_RAM_X_CURSOR)
        self._send_data((x_start * 8) & 0xFF)
        self._send_data(((x_start * 8) >> 8) & 0xFF)
        self._send_command(SET_RAM_Y_CURSOR)
        self._send_data(y & 0xFF)
        self._send_data((y >> 8) & 0xFF)

        # Write to RAM and refresh
        self._send_command(WRITE_RAM_BW)
        self._send_data_buf(buf)
        self._turn_on_display_partial()

    # ── Power management ──

    def sleep(self):
        """Enter deep sleep mode. Call init() to wake."""
        self._send_command(DEEP_SLEEP_MODE)
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
