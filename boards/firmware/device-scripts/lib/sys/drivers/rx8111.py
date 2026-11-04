"""
RX8111CE real-time clock driver — MicroPython I2C interface.

Register map from Epson's RX8111CE application manual (ETM61E-04).

From power-on its VLF flag says the time isn't valid, until the time has been set. It neither
charges a capacitor on VBAT nor switches to it until told to, and it forgets that if VBAT runs
low, so setup() belongs in every boot. Charging takes a resistor keeping the current under
40 mA, which the manual leaves to the board.

Usage:
    import time
    from lib.sys import bus
    from lib.sys.drivers.rx8111 import RX8111

    rtc = RX8111(bus.get_i2c("i2c0"), 0x32)
    rtc.setup()
    print(rtc.read())             # (2026, 11, 4, 17, 3, 23), or None if it isn't valid
    rtc.write(time.gmtime()[:6])

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import time

REG_SECOND = 0x10
REG_FLAG = 0x1E
REG_CONTROL = 0x1F
REG_POWER_SWITCH = 0x32

FLAG_XST = 0x01  # The crystal stopped
FLAG_VLF = 0x02  # Power-on, or the crystal stopped: the time isn't valid
CONTROL_STOP = 0x01
POWER_CHARGE = 0x80  # CHGEN
POWER_SWITCHOVER = 0x40  # INIEN, which CHGEN needs

CENTURY = 2000


def _to_bcd(value):
    return value // 10 << 4 | value % 10


def _from_bcd(value):
    return (value >> 4) * 10 + (value & 0x0F)


class RX8111:
    def __init__(self, i2c, address):
        self._i2c = i2c
        self._address = address

    def _get(self, register):
        return self._i2c.readfrom_mem(self._address, register, 1)[0]

    def _set(self, register, value):
        self._i2c.writeto_mem(self._address, register, bytes([value]))

    def setup(self):
        """Charge what's on VBAT, and run from it when the main supply goes."""
        wanted = POWER_SWITCHOVER | POWER_CHARGE
        if self._get(REG_POWER_SWITCH) != wanted:
            self._set(REG_POWER_SWITCH, wanted)

    def read(self):
        """(year, month, day, hour, minute, second), or None if the chip says it isn't valid."""
        if self._get(REG_FLAG) & (FLAG_VLF | FLAG_XST):
            return None
        second, minute, hour, _, day, month, year = self._i2c.readfrom_mem(self._address, REG_SECOND, 7)
        return (
            CENTURY + _from_bcd(year),
            _from_bcd(month & 0x1F),
            _from_bcd(day & 0x3F),
            _from_bcd(hour & 0x3F),
            _from_bcd(minute & 0x7F),
            _from_bcd(second & 0x7F),
        )

    def write(self, now):
        """Set it from (year, month, day, hour, minute, second), as the manual's flow does it."""
        year, month, day, hour, minute, second = now[:6]
        # A week register has one bit set, from bit 0 for Sunday. gmtime counts from Monday
        weekday = time.gmtime(time.mktime((year, month, day, hour, minute, second, 0, 0)))[6]
        self.setup()
        self._set(REG_CONTROL, CONTROL_STOP)
        self._i2c.writeto_mem(
            self._address,
            REG_SECOND,
            bytes((
                _to_bcd(second),
                _to_bcd(minute),
                _to_bcd(hour),
                1 << (weekday + 1) % 7,
                _to_bcd(day),
                _to_bcd(month),
                _to_bcd(year - CENTURY),
            )),
        )
        self._set(REG_FLAG, 0)
        self._set(REG_CONTROL, 0)
