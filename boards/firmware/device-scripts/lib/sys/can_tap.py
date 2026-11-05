"""
Tapping the CAN bus (lib/sys/can_tap.py)
========================================

A tap sends every received frame to a link stream from C, with no Python per frame,
so a full bus doesn't take the interpreter with it. Records are as streams.py says.

Tapping a bus nothing else is using leaves it listen-only, which sends nothing at all.
That includes ACKs, so if nothing else on the bus acknowledges, its senders keep
retrying the same frame. ack=True joins in, and the driver then runs in normal mode. It
sends no frames of its own, so it isn't subject to the transmit latch.

An app that has to act on a few identifiers uses watch(), which filters in C, so the rest
of a busy bus costs it nothing:

    watcher = can_tap.watch([0x470])
    while True:
        for frame_id, data in watcher.read():
            ...
        await asyncio.sleep_ms(10)

watch([]) gets every identifier. A watch opened by an app's own work is closed when that work
ends, however it ends.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import asyncio
import struct

import mcplink

from lib.sys import board, settings

# Not every build has CAN, and this gets imported on all of them. available() says whether
# there's a bus to use
try:
    import CAN
except ImportError:
    CAN = None

BUS = "can0"
DEFAULT_BITRATE = 500000
EVERY_BIT = 0x1FFFFFFF
RECORD = "<IIBBH8s"
RECORD_SIZE = 20
RTR = 2
WATCH_RING_BYTES = 8192
WATCH_READ_BYTES = 2000


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
    from machine import Pin

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


def bus(bitrate=None):
    """The bus, set up if nothing has yet, to send on with send(data, id)."""
    _set_up_bus(bitrate)
    return CAN(0)


def _client(ack, filters):
    handle = CAN.register(CAN.TX_ENABLED if ack else CAN.RX_ONLY)
    for frame_id, mask in filters:
        CAN.add_filter(handle, frame_id, mask)
    return handle


def open(stream_id, ack=False, bitrate=None, filters=()):
    """Start sending received frames to a stream. Returns what close() takes."""
    _set_up_bus(bitrate)
    handle = _client(ack, filters)
    CAN.tap(handle, stream_id)
    CAN.activate(handle)
    return handle


def close(handle):
    CAN.deactivate(handle)
    CAN.unregister(handle)


_watches = []


class Watch:
    """Frames with given identifiers, for an app to read as it goes."""

    def __init__(self, ids, bitrate=None):
        self._stream = mcplink.stream_open(-1, mcplink.KIND_CAN, WATCH_RING_BYTES)
        try:
            self._tap = open(self._stream, bitrate=bitrate, filters=[(frame_id, EVERY_BIT) for frame_id in ids])
        except Exception:
            mcplink.stream_close(self._stream)
            raise
        self._owner = asyncio.current_task()
        _watches.append(self)

    def read(self):
        """What's arrived since the last read, oldest first, as (id, data). Never waits."""
        frames = []
        while True:
            chunk = mcplink.stream_take(self._stream, WATCH_READ_BYTES)
            if not chunk:
                return frames
            for at in range(0, len(chunk), RECORD_SIZE):
                _, frame_id, flags, dlc, _, data = struct.unpack_from(RECORD, chunk, at)
                frames.append((frame_id, b"" if flags & RTR else data[:dlc]))

    def lost(self):
        """Frames lost because read() wasn't called often enough."""
        return mcplink.stream_status(self._stream)[5] // RECORD_SIZE

    def close(self):
        if self in _watches:
            _watches.remove(self)
            close(self._tap)
            mcplink.stream_close(self._stream)


def watch(ids, bitrate=None):
    return Watch(ids, bitrate)


def close_watches(owner=None):
    """Close the watches a task opened, or with no task, all of them."""
    for watcher in [w for w in _watches if owner is None or w._owner is owner]:
        watcher.close()


class Activity:
    """What the bus is doing per identifier, kept up in C. Read it after stop()."""

    def __init__(self, max_ids, filters=(), bitrate=None):
        _set_up_bus(bitrate)
        self._handle = _client(False, filters)
        self._table = CAN.activity_start(self._handle, max_ids)
        CAN.activate(self._handle)

    def stop(self):
        close(self._handle)

    def read(self):
        return CAN.activity_read(self._table)

    def free(self):
        CAN.activity_free(self._table)


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
