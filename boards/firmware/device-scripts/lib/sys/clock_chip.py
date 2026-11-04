"""
The board's clock chip (lib/sys/clock_chip.py)
==============================================

What keeps the time while the board is off, on a board with an rtc device in its manifest and
a driver for it here. It holds UTC, as the system clock does.

restore() sets the system clock from it at boot, for a board that may never see a network, and
save() sets it whenever NTP has given the right time. Anything using time.time() gets all of
this without knowing the chip is there.

A MicroMod socket shares I2C's pins with the module's ROM bootloader. It takes the first thing
it sees on them as its sync, and if that isn't one it stops answering. So a boot sends it a real
one before any I2C. Anything after that it refuses and carries on, and if it isn't listening, I2C
just sees a START and a STOP.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import time

import machine
from machine import Pin, UART

from lib.sys import board, bus
from lib.sys.log import log

DRIVER = "rx8111"
# Before this, a clock hasn't been set
FIRST_VALID_YEAR = 2023
BOOTLOADER_BAUD = 115200
BOOTLOADER_SYNC = 0x7F

# The system clock came from the chip this boot, so it's as good as the chip's drift
restored = False


def _bus_name(device):
    return device.bus.split(".")[-1]


def _sync_bootloader():
    """Only a board with a socket has one, and ss-relay may have left it listening."""
    try:
        socket = board.device("micromod")
    except KeyError:
        return
    uart = UART(1, baudrate=BOOTLOADER_BAUD, bits=8, parity=0, stop=1, tx=socket.boot_uart_tx, rx=socket.boot_uart_rx)
    uart.write(bytes([BOOTLOADER_SYNC]))
    uart.flush()
    uart.deinit()
    Pin(socket.boot_uart_tx, Pin.IN)
    Pin(socket.boot_uart_rx, Pin.IN)


def _open():
    """The chip, and its bus's name to release after, or None if there's none to use."""
    if not board.has("rtc"):
        return None
    device = board.device("rtc")
    if getattr(device, "driver", None) != DRIVER:
        return None
    from lib.sys.drivers.rx8111 import RX8111

    name = _bus_name(device)
    return RX8111(bus.get_i2c(name), int(device.i2c_address, 16)), name


def restore():
    """Set the system clock from the chip, if the chip's valid and the clock hasn't been set."""
    global restored
    _sync_bootloader()
    opened = _open()
    if opened is None:
        return False
    chip, name = opened
    try:
        chip.setup()
        now = chip.read()
    except OSError as e:
        log("warning", f"Clock chip didn't answer: {e}", source="clock")
        return False
    finally:
        bus.release_i2c(name)
    if now is None or now[0] < FIRST_VALID_YEAR:
        log("info", "Clock chip hasn't got the time yet", source="clock")
        return False
    if time.gmtime()[0] >= FIRST_VALID_YEAR:
        return False
    year, month, day, hour, minute, second = now
    weekday = time.gmtime(time.mktime(now + (0, 0)))[6]
    machine.RTC().datetime((year, month, day, weekday + 1, hour, minute, second, 0))
    restored = True
    log("info", "System clock set from the clock chip: %d-%02d-%02d %02d:%02d:%02d UTC" % now, source="clock")
    return True


def save():
    """Set the chip from the system clock, which has just been set from NTP."""
    opened = _open()
    if opened is None:
        return False
    chip, name = opened
    try:
        chip.write(time.gmtime()[:6])
        return True
    except OSError as e:
        log("warning", f"Clock chip didn't answer: {e}", source="clock")
        return False
    finally:
        bus.release_i2c(name)
