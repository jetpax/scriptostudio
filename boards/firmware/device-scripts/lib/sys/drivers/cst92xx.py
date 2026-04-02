"""
cst92xx.py - CST92xx capacitive touch controller driver.

Supports CST9217 and similar CST92xx series touch controllers.
Provides interrupt-driven touch events with gesture detection.

Protocol reference: Waveshare esp_lcd_touch_cst9217.c

Register addresses are 16-bit. All I2C access uses TWO separate transactions:
  TX: write [reg_hi, reg_lo] as one writeto()
  RX: readfrom() as a second call  (NOT combined in one writeto+readfrom_mem)

The esp-idf implementation uses esp_lcd_panel_io_tx_param / rx_param which
maps to exactly this two-call pattern on bare I2C.

Usage:
    from machine import Pin, I2C
    from lib.sys import board
    from lib.sys.drivers.cst92xx import CST92xx

    i2c_cfg = board.i2c('i2c0')
    i2c = I2C(0, scl=Pin(i2c_cfg.scl), sda=Pin(i2c_cfg.sda), freq=400000)

    tp = board.device('touch')
    touch = CST92xx(i2c, tp.int_pin, tp.rst_pin, tp.i2c_address)

    # Poll for events (or use with async handler):
    while True:
        event = touch.poll()
        if event:
            print(event)
"""

try:
    from lib.sys import board
    _BOARD_AVAILABLE = True
except ImportError:
    _BOARD_AVAILABLE = False
    board = None

from machine import Pin
import time

# ── 16-bit register addresses (high byte, low byte) ──────────────────────────
# Waveshare reference: esp_lcd_touch_cst9217.c
#   DATA_REG       = 0xD000
#   CMD_MODE_REG   = 0xD101
#   PROJECT_ID_REG = 0xD204
#   RESOLUTION_REG = 0xD1F8
#   CHECKCODE_REG  = 0xD1FC

_REG_DATA     = b'\xD0\x00'
_REG_CMD      = b'\xD1\x01'
_REG_CHIPINFO = b'\xD2\x04'
_REG_RES      = b'\xD1\xF8'
_REG_CHECK    = b'\xD1\xFC'

# ── DATA register response layout (CST9217_DATA_LENGTH = 1*5 + 5 = 10 bytes) ─
# Reference: esp_lcd_touch_cst9217_read_data()
#
#   data[5]       — touch count (low 7 bits)
#   data[6]       — ACK byte, must be 0xAB for valid data
#
# Per-point struct starting at data[i*5 + (i ? 2 : 0)] for point i:
#   p[0]  status   (0x06 = finger down)
#   p[1]  X[11:4]
#   p[2]  Y[11:4]
#   p[3]  X[3:0] (high nibble) | Y[3:0] (low nibble)
#
# For a single touch (i=0), point struct starts at data[0]:
#   data[0] = status
#   data[1] = X hi
#   data[2] = Y hi
#   data[3] = nibbles
#   data[5] = count
#   data[6] = ACK

_DATA_LEN   = 10   # CST9217_MAX_TOUCH_POINTS * 5 + 5
_IDX_COUNT  = 5
_IDX_ACK    = 6
_ACK_VALID  = 0xAB
_STATUS_DOWN = 0x06

_EVENT_NONE = 0
_EVENT_DOWN = 1
_EVENT_MOVE = 2
_EVENT_UP   = 3

# Maximum plausible coordinate jump between consecutive 10ms samples.
# Human finger at top swipe speed ≈ 100px/frame; glitches jump 200-400px.
_MAX_JUMP_PX = 150


class TouchEvent:
    """Represents a touch event."""
    def __init__(self, event_type, x=0, y=0, dx=0, dy=0):
        self.type    = event_type  # 'down', 'move', 'up'
        self.x       = x
        self.y       = y
        self.dx      = dx
        self.dy      = dy
        self.gesture = None  # 'tap', 'swipe_left', 'swipe_right', etc.

    def __repr__(self):
        return "TouchEvent(%s, x=%d, y=%d, dx=%d, dy=%d, gesture=%s)" % (
            self.type, self.x, self.y, self.dx, self.dy, self.gesture)


class CST92xx:
    """
    CST92xx capacitive touch controller driver.

    Args:
        i2c: machine.I2C instance
        int_pin: Interrupt pin number (GPIO for IRQ line, active-low)
        rst_pin: Reset pin number (GPIO for reset line, or None)
        addr: I2C address (default 0x5A)
        swipe_threshold: Minimum pixels for swipe detection (default 40)
        tap_timeout: Max ms between down/up for tap (default 300)
    """

    def __init__(self, i2c, int_pin, rst_pin=None, addr=0x5A,
                 swipe_threshold=40, tap_timeout=300):
        self.i2c             = i2c
        # Board manifests may return pin numbers / addresses as strings
        # (e.g. "14" or "0x5A").  int(x, 0) handles both decimal and hex.
        self.ADDR            = int(addr, 0) if isinstance(addr, str) else int(addr)
        self.swipe_threshold = swipe_threshold
        self.tap_timeout     = tap_timeout

        _int = int(int_pin, 0) if isinstance(int_pin, str) else int(int_pin)
        self._int_pin = Pin(_int, Pin.IN, Pin.PULL_UP)
        if rst_pin is not None:
            _rst = int(rst_pin, 0) if isinstance(rst_pin, str) else int(rst_pin)
            self._rst_pin = Pin(_rst, Pin.OUT)
        else:
            self._rst_pin = None

        self._touch_down  = False
        self._x0          = 0
        self._y0          = 0
        self._x1          = 0
        self._y1          = 0
        self._down_time   = 0
        self._pending_event = None

        self._init_hw()

    def _init_hw(self):
        """Initialize hardware: reset and verify chip."""
        if self._rst_pin is not None:
            self._rst_pin.value(0)
            time.sleep_ms(10)
            self._rst_pin.value(1)
            time.sleep_ms(50)

        if not self._check_present():
            raise RuntimeError("CST92xx not found at 0x%02X" % self.ADDR)

        # Clear stale data after reset
        self._raw_read()

    def _check_present(self):
        """Check if device is present on I2C bus."""
        return self.ADDR in self.i2c.scan()

    def _read_reg(self, reg, length):
        """Read from a 16-bit register address.

        Protocol (from cst9217_read_reg in C reference):
          TX transaction:  writeto(addr, [reg_hi, reg_lo])
          delay 2ms
          RX transaction:  readfrom(addr, length)

        These MUST be two separate I2C transactions — this matches what
        esp_lcd_panel_io_tx_param / rx_param does on the esp-idf side.

        Retry logic matches C reference: up to 5 attempts with 3ms between,
        hardware reset on persistent failure.
        """
        for attempt in range(5):
            try:
                self.i2c.writeto(self.ADDR, reg)
                time.sleep_ms(2)
                return self.i2c.readfrom(self.ADDR, length)
            except OSError:
                time.sleep_ms(3)
        # Persistent failure — trigger hardware reset if pin available
        if self._rst_pin is not None:
            self._rst_pin.value(0)
            time.sleep_ms(10)
            self._rst_pin.value(1)
            time.sleep_ms(100)
        raise OSError("CST92xx: I2C read failed after 5 retries")

    def _write_reg(self, reg, data):
        """Write to a 16-bit register address.

        Protocol (from Waveshare reference cst9217_write_reg):
          TX transaction 1: writeto(addr, [reg_hi, reg_lo])
          delay 2ms
          TX transaction 2: writeto(addr, data)

        Two separate transactions to match esp_lcd_panel_io_tx_param calls.
        """
        self.i2c.writeto(self.ADDR, reg)
        time.sleep_ms(2)
        self.i2c.writeto(self.ADDR, data)

    def _enter_cmd_mode(self):
        """Enter command mode for reading config registers.

        Reference: cst9217_read_config() calls cst9217_write_reg with:
          reg  = CMD_MODE_REG (0xD101) → TX1: [0xD1, 0x01]
          data = {0xD1, 0x01}          → TX2: [0xD1, 0x01]  (same bytes)
        Both transactions carry the same two bytes — this is the chip's
        command-mode entry protocol.
        """
        self._write_reg(_REG_CMD, _REG_CMD)
        time.sleep_ms(10)

    def _raw_read(self):
        """Read raw 10-byte DATA register. Returns bytes or None on error."""
        try:
            return self._read_reg(_REG_DATA, _DATA_LEN)
        except OSError:
            return None

    def get_chip_info(self):
        """Get chip information (project ID, chip type).

        Reference: cst9217_read_config() reads 4 bytes from 0xD204:
          project_id = (data[1] << 8) | data[0]
          chip_type  = (data[3] << 8) | data[2]
        """
        try:
            self._enter_cmd_mode()
            info = self._read_reg(_REG_CHIPINFO, 4)
            project_id = (info[1] << 8) | info[0]
            chip_type  = (info[3] << 8) | info[2]
            return {'project_id': project_id, 'chip_type': chip_type}
        except Exception:
            return None

    def get_resolution(self):
        """Get touchscreen resolution.

        Reference: cst9217_read_config() reads 4 bytes from 0xD1F8:
          x = (data[1] << 8) | data[0]
          y = (data[3] << 8) | data[2]
        """
        try:
            self._enter_cmd_mode()
            res = self._read_reg(_REG_RES, 4)
            x = (res[1] << 8) | res[0]
            y = (res[3] << 8) | res[2]
            return {'width': x, 'height': y}
        except Exception:
            return None

    def get_checkcode(self):
        """Read checkcode register (requires command mode)."""
        try:
            self._enter_cmd_mode()
            cc = self._read_reg(_REG_CHECK, 4)
            return {'checkcode': cc}
        except Exception:
            return None

    def poll(self):
        """
        Read and decode a touch event from the DATA register.

        Protocol matches esp_lcd_touch_cst9217_read_data():
          - Read 10 bytes from DATA_REG (0xD000) via two-transaction _read_reg
          - Validate ACK at data[6] == 0xAB
          - Touch count at data[5] & 0x7F
          - Point struct at data[0..4]: status, x_hi, y_hi, xy_nibbles

        Returns TouchEvent or None (None on no touch, invalid ACK, or I2C error).
        """
        data = self._raw_read()
        if data is None:
            return None

        if data[_IDX_ACK] != _ACK_VALID:
            # 0xFF is normal when INT is not asserted (no touch pending)
            return None

        count = data[_IDX_COUNT] & 0x7F
        if count == 0:
            # ACK valid but no points — finger just lifted
            if self._touch_down:
                return self._emit_up()
            return None

        # Point 0 struct starts at data[0] (i=0 → offset = i*5 + (i?2:0) = 0)
        status = data[0] & 0x0F
        if status != _STATUS_DOWN:
            if self._touch_down:
                return self._emit_up()
            return None

        x = (data[1] << 4) | (data[3] >> 4)
        y = (data[2] << 4) | (data[3] & 0x0F)

        if not self._touch_down:
            self._touch_down = True
            self._x0 = x
            self._y0 = y
            # Seed _x1/_y1 to the down position so _emit_up works even if
            # no move event fires before the finger lifts.
            self._x1 = x
            self._y1 = y
            self._down_time = time.ticks_ms()
            return TouchEvent('down', x, y)

        # Outlier rejection: discard chip-glitch samples that jump
        # implausibly far from the last accepted position.
        if abs(x - self._x1) > _MAX_JUMP_PX or abs(y - self._y1) > _MAX_JUMP_PX:
            return None

        # Deduplication: suppress redundant move events with no position change.
        if x == self._x1 and y == self._y1:
            return None

        self._x1 = x
        self._y1 = y
        return TouchEvent('move', x, y, x - self._x0, y - self._y0)

    def _emit_up(self):
        """Emit a touch-up event with gesture classification.

        Priority:
          1. Displacement > threshold → swipe (fast or slow)
          2. Displacement <= threshold + quick → tap
          3. Displacement <= threshold + slow  → no gesture (hold/none)
        """
        self._touch_down = False
        dx      = self._x1 - self._x0
        dy      = self._y1 - self._y0
        elapsed = time.ticks_diff(time.ticks_ms(), self._down_time)

        event = TouchEvent('up', self._x1, self._y1, dx, dy)

        if abs(dx) > self.swipe_threshold or abs(dy) > self.swipe_threshold:
            # Large displacement always means swipe, regardless of speed
            event.gesture = self._detect_swipe(dx, dy)
        elif elapsed <= self.tap_timeout:
            event.gesture = 'tap'
        # else: slow press with tiny movement → gesture stays None (hold)

        return event

    def _detect_swipe(self, dx, dy):
        """Detect swipe direction from delta values.

        Screen coordinates: X increases right, Y increases downward.
          dx > 0 → finger moved right  → swipe_right
          dx < 0 → finger moved left   → swipe_left
          dy > 0 → finger moved down   → swipe_down
          dy < 0 → finger moved up     → swipe_up
        """
        if abs(dx) > abs(dy):
            return 'swipe_right' if dx > 0 else 'swipe_left'
        else:
            return 'swipe_down' if dy > 0 else 'swipe_up'

    def is_touched(self):
        """Quick check if screen is currently being touched."""
        return self._touch_down

    def wait_for_touch(self, timeout_ms=None):
        """
        Block until touch event occurs.

        Args:
            timeout_ms: Max wait time in ms, None for indefinite

        Returns:
            TouchEvent or None on timeout
        """
        start = time.ticks_ms()
        while True:
            event = self.poll()
            if event:
                return event
            if timeout_ms is not None:
                if time.ticks_diff(time.ticks_ms(), start) >= timeout_ms:
                    return None
            time.sleep_ms(5)

    def irq_handler(self):
        """
        Interrupt handler for use with Pin IRQ callback.
        Reads and queues touch events.
        """
        self.poll()
