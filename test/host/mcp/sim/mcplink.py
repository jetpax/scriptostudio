# Host stand-in for pyDirect's mcplink, run under unix MicroPython.
#
# Models the auth rules and the output ring, so lib/sys/mcp.py and the check tool
# can run with no board. It can't model the C frame filter or the timer: guard()
# just calls fn, so nothing here can break a blocked exec. check_m1.py --no-interrupt
# skips those checks.

import binascii
import hashlib
import io
import os

ROLE_AGENT = 0
ROLE_HUMAN = 1
REASON_NONE = 0
REASON_CANCEL = 1
REASON_TIMEOUT = 2

_RING_SIZE = 32768
_DUPTERM_SLOT = 0

_verifiers = {}
_origins = ()
_protected = set()


class _Ring(io.IOBase):
    def __init__(self):
        self.buf = bytearray(_RING_SIZE)
        self.total = 0

    def write(self, data):
        for b in data:
            self.buf[self.total % _RING_SIZE] = b
            self.total += 1
        return len(data)

    def readinto(self, buf):
        return None


_ring = None


def start(path):
    global _ring
    if _ring is None:
        _ring = _Ring()
        os.dupterm(_ring, _DUPTERM_SLOT)


def set_auth(human, agent):
    _verifiers[ROLE_HUMAN] = human
    _verifiers[ROLE_AGENT] = agent


def set_origins(origins):
    global _origins
    _origins = tuple(origins)


def protect(slot):
    _protected.add(slot)


def guard(fn, client=-1, request_id=None, timeout_ms=0):
    return fn()


def interrupt_reason():
    return REASON_NONE


def interrupt_requested():
    return False


def cursor():
    return _ring.total


def output_since(after):
    behind = _ring.total - after
    filled = min(_ring.total, _RING_SIZE)
    dropped = max(0, behind - filled)
    behind = min(behind, filled)
    start_at = _ring.total - behind
    return bytes(_ring.buf[i % _RING_SIZE] for i in range(start_at, _ring.total)), _ring.total, dropped


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
