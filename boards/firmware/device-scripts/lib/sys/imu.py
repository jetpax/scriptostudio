"""
The board's accelerometer.

    from lib.sys import imu
    x, y, z = imu.read()

read() gives milli-g, and wakes the sensor the first time. At rest, gravity reads about 1000 mg on
the axis facing down, and tilting moves it between the axes, so to notice a tilt, compare with a
reading taken at rest.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import struct
import time

from lib.sys import board, bus

_LIS3DH_CTRL1 = 0x20
_LIS3DH_CTRL4 = 0x23
_LIS3DH_OUT_X_AUTO_INCREMENT = 0xA8
_LIS3DH_100HZ_ALL_AXES = b"\x57"
_LIS3DH_HIGH_RESOLUTION_2G = b"\x08"
# Its first samples aren't good until 7 sample periods after waking
_LIS3DH_WAKE_MS = 80

_i2c = None
_address = None


def _start():
    global _i2c, _address
    device = board.device("imu")
    if device.type != "LIS3DH":
        raise NotImplementedError("No driver yet for a %s" % device.type)
    i2c = bus.get_i2c(device.bus.split(".")[1])
    _address = int(device.i2c_address, 16)
    i2c.writeto_mem(_address, _LIS3DH_CTRL1, _LIS3DH_100HZ_ALL_AXES)
    i2c.writeto_mem(_address, _LIS3DH_CTRL4, _LIS3DH_HIGH_RESOLUTION_2G)
    time.sleep_ms(_LIS3DH_WAKE_MS)
    _i2c = i2c


def read():
    """The acceleration on each axis, as (x, y, z) in milli-g."""
    if _i2c is None:
        _start()
    x, y, z = struct.unpack("<hhh", _i2c.readfrom_mem(_address, _LIS3DH_OUT_X_AUTO_INCREMENT, 6))
    return x >> 4, y >> 4, z >> 4
