# Host stand-in for pyDirect's mcplink, run under unix MicroPython.
#
# Models the auth rules, the output rings and the stream table, so lib/sys/mcp.py
# and the check tools can run with no board. It can't model the C frame filter, the
# timer or the drain task: guard() just calls fn, so nothing here can break a blocked
# exec or feed its input(), and stream output only goes out when the pump runs. The
# checks skip those with --no-interrupt.

import binascii
import hashlib
import io
import os
import struct

import wsserver

ROLE_AGENT = 0
ROLE_HUMAN = 1
REASON_NONE = 0
REASON_CANCEL = 1
REASON_TIMEOUT = 2
FRAME_HEADER_SIZE = 8
FRAME_DATA = 0
FRAME_CREDIT = 1
FRAME_END = 2
KIND_TERMINAL = 0
KIND_FILE_READ = 1
KIND_FILE_WRITE = 2
KIND_APP = 3

_RING_SIZE = 32768
_DUPTERM_SLOT = 0

_verifiers = {}
_origins = ()
_protected = set()
_private = False
_streams = {}
_next_stream = 1
_DRAIN_CHUNK = 4096
_STREAM_MAX = 8


class _Ring:
    def __init__(self, size=_RING_SIZE):
        self.size = size
        self.buf = bytearray(size)
        self.total = 0

    def write(self, data):
        for b in data:
            self.buf[self.total % self.size] = b
            self.total += 1

    def read(self, start_at, end):
        return bytes(self.buf[i % self.size] for i in range(start_at, end))

    def clamp(self, cursor):
        """A cursor the ring can still serve, and how many bytes were lost getting there."""
        filled = min(self.total, self.size)
        behind = self.total - cursor
        return (cursor, 0) if behind <= filled else (self.total - filled, behind - filled)


class _Dupterm(io.IOBase):
    def write(self, data):
        (_private_ring if _private else _ring).write(data)
        return len(data)

    def readinto(self, buf):
        return None


_ring = None
_private_ring = None


def start(path):
    global _ring, _private_ring
    if _ring is None:
        _ring = _Ring()
        _private_ring = _Ring()
        os.dupterm(_Dupterm(), _DUPTERM_SLOT)


def set_auth(human, agent):
    _verifiers[ROLE_HUMAN] = human
    _verifiers[ROLE_AGENT] = agent


def set_origins(origins):
    global _origins
    _origins = tuple(origins)


def protect(slot):
    _protected.add(slot)


def guard(fn, client=-1, request_id=None, timeout_ms=0, private=False):
    global _private
    saved = _private
    _private = private
    try:
        return fn()
    finally:
        _private = saved


def interrupt_reason():
    return REASON_NONE


def interrupt_requested():
    return False


def cursor(private=False):
    return (_private_ring if private else _ring).total


def output_since(after, private=False):
    ring = _private_ring if private else _ring
    start_at, dropped = ring.clamp(after)
    return ring.read(start_at, ring.total), ring.total, dropped


def stream_open(client, kind, ring_size=0):
    global _next_stream
    for i in range(_STREAM_MAX):
        sid = (_next_stream + i - 1) % _STREAM_MAX + 1
        if sid not in _streams:
            _next_stream = sid % _STREAM_MAX + 1
            if kind == KIND_TERMINAL:
                ring = _ring
            elif kind == KIND_APP:
                ring = _Ring(ring_size or 16384)
            elif kind == KIND_FILE_READ:
                ring = _Ring(ring_size or 65536)
            else:
                ring = None
            _streams[sid] = {"kind": kind, "client": client, "ring": ring, "cursor": ring.total if ring else 0, "dropped": 0}
            return sid
    raise OSError("no free streams")


def stream_close(sid):
    _streams.pop(sid, None)


def stream_write(sid, data):
    st = _streams.get(sid)
    if st is None or st["ring"] is None or st["kind"] == KIND_TERMINAL:
        return False
    if st["kind"] == KIND_FILE_READ and stream_room(sid) < len(data):
        return False
    st["ring"].write(data)
    return True


def stream_room(sid):
    st = _streams.get(sid)
    if st is None or st["ring"] is None:
        return -1
    return st["ring"].size - (st["ring"].total - st["cursor"])


def stream_flush(sid):
    st = _streams.get(sid)
    if st is None or st["ring"] is None:
        return
    st["cursor"], lost = st["ring"].clamp(st["cursor"])
    st["dropped"] += lost
    while st["cursor"] != st["ring"].total:
        n = min(st["ring"].total - st["cursor"], _DRAIN_CHUNK)
        if n == 0:
            break
        head = struct.pack("<BBHI", FRAME_DATA, sid, 0, st["cursor"])
        wsserver.send(st["client"], head + st["ring"].read(st["cursor"], st["cursor"] + n), True)
        st["cursor"] += n


def stream_status(sid):
    st = _streams.get(sid)
    if st is None:
        return (False, 0, -1, 0, 0, 0)
    total = st["ring"].total if st["ring"] else 0
    return (True, st["kind"], st["client"], st["cursor"], total, st["dropped"])


def streams_reset():
    _streams.clear()


def drain():
    for sid in list(_streams):
        stream_flush(sid)


def on_disconnect(client):
    for sid, st in list(_streams.items()):
        if st["client"] == client:
            del _streams[sid]


def complete(text):
    return "", ""


def needs_more(text):
    t = text.rstrip()
    if t.endswith(":") or t.endswith("\\"):
        return True
    if "\n" in text and not text.endswith("\n"):
        return True
    return sum(t.count(c) for c in "([{") > sum(t.count(c) for c in ")]}")


def _token_role(token):
    h = binascii.hexlify(hashlib.sha256(token.encode()).digest()).decode()
    for role, v in _verifiers.items():
        if h == v:
            return role
    return -1


def _origin_ok(headers):
    origin = headers.get("origin")
    if origin is None or origin in _origins:
        return True
    return origin.split("://")[-1] == headers.get("host")


def _bearer(headers):
    v = headers.get("authorization", "")
    return _token_role(v[7:]) if v.lower().startswith("bearer ") else -1


def handshake_role(headers, uri):
    if not _origin_ok(headers):
        return -1
    role = _bearer(headers)
    if role < 0:
        for p in headers.get("sec-websocket-protocol", "").split(","):
            if p.strip().startswith("ss."):
                role = _token_role(p.strip()[3:])
    if role < 0 and "?token=" in uri:
        role = _token_role(uri.split("?token=")[1])
    return role


def http_status(headers):
    if not _origin_ok(headers):
        return 403
    return 401 if _bearer(headers) < 0 else 0
