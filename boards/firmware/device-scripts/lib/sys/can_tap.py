"""
Tapping the CAN bus (lib/sys/can_tap.py)
========================================

A tap sends every received frame to a link stream from C, with no Python per frame,
so a full bus doesn't take the interpreter with it. Records are as streams.py says.

Tapping a bus nothing else is using leaves it listen-only, which sends nothing at all.
That includes ACKs, so if nothing else on the bus acknowledges, its senders keep
retrying the same frame. ack=True joins in, and the driver then runs in normal mode. It
sends no frames of its own, so it isn't subject to the transmit latch.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import CAN
from machine import Pin

from lib.sys import board, settings

BUS = "can0"
DEFAULT_BITRATE = 500000


def available():
    return board.has("can")


def _running():
    try:
        CAN(0).info()
        return True
    except OSError:
        return False


def _set_up_bus(bitrate):
    """Whatever already has the bus running keeps its settings."""
    if _running():
        return
    if not available():
        raise ValueError("This board has no CAN bus")
    bus = board.can(BUS)
    # A transceiver in standby would hear nothing, and silently
    standby = getattr(bus, "standby", None)
    if standby is not None:
        Pin(standby, Pin.OUT, value=0)
    rate = bitrate or settings.get("can.bitrate", DEFAULT_BITRATE)
    # Normal only says what this object may do if it's used. The bus itself stays listen-only
    # until something that can transmit is active, and anything that opens it later can send.
    CAN(0, extframe=False, tx=bus.tx, rx=bus.rx, mode=CAN.NORMAL, bitrate=rate)


def open(stream_id, ack=False, bitrate=None):
    """Start sending received frames to a stream. Returns what close() takes."""
    _set_up_bus(bitrate)
    handle = CAN.register(CAN.TX_ENABLED if ack else CAN.RX_ONLY)
    CAN.tap(handle, stream_id)
    CAN.activate(handle)
    return handle


def close(handle):
    CAN.deactivate(handle)
    CAN.unregister(handle)


def stats():
    """What the controller lost before a tap ever saw it, and how the bus is doing."""
    if not _running():
        return {}
    info = CAN(0).info()
    return {
        "bitrate": settings.get("can.bitrate", DEFAULT_BITRATE),
        "state": info["state"],
        "rx_missed": info["rx_missed_count"],
        "bus_errors": info["bus_error_count"],
        "tx_errors": info["tx_error_counter"],
        "rx_errors": info["rx_error_counter"],
    }
