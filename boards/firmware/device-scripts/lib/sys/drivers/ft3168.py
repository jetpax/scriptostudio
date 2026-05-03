"""
ft3168.py - Focaltech FT3168 capacitive touch controller driver.

Drop-in surface for the CST92xx driver: same TouchEvent shape, same
poll() / wait_for_touch() / is_touched() / irq_handler() entry points.

Used on boards like the Waveshare ESP32-S3 Touch AMOLED 1.64. On that
board both INT and RST are not-connected, so the driver runs polled-only
and skips reset (the panel ships ready after power-on). Hardware-reset
support is wired up so future boards that route TP_RST can use it.

Register layout (single-byte addresses):
    0x00  device mode
    0x01  gesture id
    0x02  touch count (low 4 bits)
    0x03  P1 X[11:8] in low nibble
    0x04  P1 X[7:0]
    0x05  P1 Y[11:8] in low nibble
    0x06  P1 Y[7:0]
    0xA3  chip id
    0xA8  vendor id

Read 5 bytes starting at 0x02 to get count + first-point coords. The
event-flag nibble that some FT-series chips put in the X high byte is
not populated by the FT3168 firmware — Waveshare's reference reads only
the low nibble — so finger up/down is inferred from count alone.

The FT3168 supports two simultaneous fingers; this driver tracks the
first point only (matching the CST92xx driver) and adds swipe / tap
classification on lift.
"""

from machine import Pin
import time


_REG_DATA   = 0x02     # 5 bytes: count, x_h, x_l, y_h, y_l
_REG_CHIPID = 0xA3
_REG_VENDOR = 0xA8

_DATA_LEN  = 5
_IDX_COUNT = 0
_IDX_XHI   = 1
_IDX_XLO   = 2
_IDX_YHI   = 3
_IDX_YLO   = 4

_MAX_JUMP_PX = 150


class TouchEvent:
    """Represents a touch event."""
    def __init__(self, event_type, x=0, y=0, dx=0, dy=0):
        self.type    = event_type
        self.x       = x
        self.y       = y
        self.dx      = dx
        self.dy      = dy
        self.gesture = None

    def __repr__(self):
        return "TouchEvent(%s, x=%d, y=%d, dx=%d, dy=%d, gesture=%s)" % (
            self.type, self.x, self.y, self.dx, self.dy, self.gesture)


class FT3168:
    """Focaltech FT3168 capacitive touch controller.

    Args:
        i2c: machine.I2C instance
        int_pin: INT pin number, or None for polled-only operation
        rst_pin: RST pin number, or None when reset is not wired (or
            handled elsewhere). FT3168 ships ready after power-on so
            omitting reset is safe.
        addr: I2C address (default 0x38)
        swipe_threshold: minimum px displacement for swipe gesture
        tap_timeout: max ms between down and up for a tap
    """

    def __init__(self, i2c, int_pin=None, rst_pin=None, addr=0x38,
                 swipe_threshold=40, tap_timeout=300):
        self.i2c             = i2c
        self.ADDR            = int(addr, 0) if isinstance(addr, str) else int(addr)
        self.swipe_threshold = swipe_threshold
        self.tap_timeout     = tap_timeout

        if int_pin is not None:
            _int = int(int_pin, 0) if isinstance(int_pin, str) else int(int_pin)
            self._int_pin = Pin(_int, Pin.IN, Pin.PULL_UP)
        else:
            self._int_pin = None

        if rst_pin is not None:
            _rst = int(rst_pin, 0) if isinstance(rst_pin, str) else int(rst_pin)
            self._rst_pin = Pin(_rst, Pin.OUT, value=1)
        else:
            self._rst_pin = None

        self._touch_down  = False
        self._x0          = 0
        self._y0          = 0
        self._x1          = 0
        self._y1          = 0
        self._down_time   = 0

        self._init_hw()

    def _init_hw(self):
        # Active-low reset, 200 ms either side per Waveshare reference.
        if self._rst_pin is not None:
            self._rst_pin.value(0)
            time.sleep_ms(200)
            self._rst_pin.value(1)
            time.sleep_ms(200)

        # No bus probe — FT3168 enters dynamic sleep when idle and stops
        # ACKing its own address until the next finger touch wakes it.
        # Validating presence here would spuriously fail on every cold
        # init. poll() handles the NACK case (returns None) so the runtime
        # boots cleanly and starts producing events as soon as the user
        # taps the screen. Matches the C++ original (touch_driver.cpp).

    def _read_reg(self, reg, length):
        self.i2c.writeto(self.ADDR, bytes([reg]))
        return self.i2c.readfrom(self.ADDR, length)

    def get_chip_info(self):
        """Returns {'chip_id': int, 'vendor_id': int} or None."""
        try:
            chip = self._read_reg(_REG_CHIPID, 1)[0]
            vendor = self._read_reg(_REG_VENDOR, 1)[0]
            return {'chip_id': chip, 'vendor_id': vendor}
        except OSError:
            return None

    def poll(self):
        """Read and decode a touch event. Returns TouchEvent or None."""
        try:
            data = self._read_reg(_REG_DATA, _DATA_LEN)
        except OSError:
            return None

        count = data[_IDX_COUNT] & 0x0F
        if count == 0:
            if self._touch_down:
                return self._emit_up()
            return None

        x = ((data[_IDX_XHI] & 0x0F) << 8) | data[_IDX_XLO]
        y = ((data[_IDX_YHI] & 0x0F) << 8) | data[_IDX_YLO]

        if not self._touch_down:
            self._touch_down = True
            self._x0 = x
            self._y0 = y
            self._x1 = x
            self._y1 = y
            self._down_time = time.ticks_ms()
            return TouchEvent('down', x, y)

        if abs(x - self._x1) > _MAX_JUMP_PX or abs(y - self._y1) > _MAX_JUMP_PX:
            return None

        if x == self._x1 and y == self._y1:
            return None

        self._x1 = x
        self._y1 = y
        return TouchEvent('move', x, y, x - self._x0, y - self._y0)

    def _emit_up(self):
        self._touch_down = False
        dx = self._x1 - self._x0
        dy = self._y1 - self._y0
        elapsed = time.ticks_diff(time.ticks_ms(), self._down_time)

        event = TouchEvent('up', self._x1, self._y1, dx, dy)

        if abs(dx) > self.swipe_threshold or abs(dy) > self.swipe_threshold:
            event.gesture = self._detect_swipe(dx, dy)
        elif elapsed <= self.tap_timeout:
            event.gesture = 'tap'

        return event

    def _detect_swipe(self, dx, dy):
        if abs(dx) > abs(dy):
            return 'swipe_right' if dx > 0 else 'swipe_left'
        return 'swipe_down' if dy > 0 else 'swipe_up'

    def is_touched(self):
        return self._touch_down

    def wait_for_touch(self, timeout_ms=None):
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
        self.poll()
