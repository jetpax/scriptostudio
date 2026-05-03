"""
Touch Manager — boot-time LVGL pointer-input wiring.

Mirrors display_manager.py: singleton, idempotent, reads driver type
and pin/address config from the board manifest. Instantiates the right
touch driver and registers an `lv.indev_t` of type POINTER whose
read_cb polls the driver each tick.

Without this wiring, LVGL widgets never see press/release events —
buttons look tappable but don't fire. Equivalent to the C++ original's
DisplayManager::touchpad_read_cb path (touch_driver.h).

Usage:
    from lib.sys.touch_manager import init_touch
    init_touch()   # call after init_display(); LVGL gets a pointer indev

Idempotent — safe to call multiple times.
"""

_tp = None
_indev = None
_pressed = False
_x = 0
_y = 0


def _make_driver(tp_cfg, i2c):
    """Instantiate the manifest-named driver. Returns instance or raises."""
    driver = getattr(tp_cfg, 'driver', None)
    addr    = getattr(tp_cfg, 'i2c_address', None)
    int_pin = getattr(tp_cfg, 'int_pin', None)
    rst_pin = getattr(tp_cfg, 'rst_pin', None)

    if driver == 'ft3168':
        from lib.sys.drivers.ft3168 import FT3168
        return FT3168(i2c, int_pin=int_pin, rst_pin=rst_pin, addr=addr)
    if driver == 'cst92xx':
        from lib.sys.drivers.cst92xx import CST92xx
        return CST92xx(i2c, int_pin, rst_pin, addr)
    raise ValueError("unsupported touch driver: %r" % driver)


def _read_cb(indev, data):
    """LVGL pointer read_cb — poll the driver, push state to LVGL.

    Cache last (x, y) across polls so RELEASED carries the lift point,
    matching the C++ TouchData semantics.
    """
    global _pressed, _x, _y
    import lvgl as lv

    if _tp is not None:
        try:
            e = _tp.poll()
        except Exception:
            e = None
        if e is not None:
            if e.type == 'up':
                _pressed = False
                _x, _y = e.x, e.y
            else:
                _pressed = True
                _x, _y = e.x, e.y

    if _pressed:
        data.state = lv.INDEV_STATE.PRESSED
    else:
        data.state = lv.INDEV_STATE.RELEASED
    data.point.x = _x
    data.point.y = _y


def init_touch():
    """Initialize touch driver and register LVGL pointer indev.

    Returns the driver instance, or None if the board has no touch.
    """
    global _tp, _indev
    if _tp is not None:
        return _tp

    from lib.sys import board
    if not board.has('touch'):
        return None

    tp_cfg = board.device('touch')
    bus_name = getattr(tp_cfg, 'bus', 'i2c.i2c0').split('.', 1)[-1]
    i2c_cfg = board.i2c(bus_name)

    from machine import Pin, I2C
    i2c = I2C(0, scl=Pin(i2c_cfg.scl), sda=Pin(i2c_cfg.sda), freq=100_000)

    try:
        _tp = _make_driver(tp_cfg, i2c)
    except Exception as e:
        print("[touch] driver init failed: %s" % e)
        _tp = None
        return None

    try:
        import lvgl as lv
        _indev = lv.indev_create()
        _indev.set_type(lv.INDEV_TYPE.POINTER)
        _indev.set_read_cb(_read_cb)
        print("[touch] indev registered (%s)" % getattr(tp_cfg, 'driver', '?'))
    except Exception as e:
        print("[touch] indev registration failed: %s" % e)

    return _tp


def get_touch():
    """Return the touch driver instance, or None if not initialized."""
    return _tp


def get_indev():
    """Return the registered lv.indev_t, or None if not initialized."""
    return _indev
