# Host stand-in for pyDirect's wsserver, run under unix MicroPython.
#
# Enough of RFC 6455 for the checks. Frames go to the Python MESSAGE callback as
# (client_id, "message", payload), str for text and bytes for binary, matching
# call_mp_ws_callback.

import binascii
import select
import struct

import mcplink

CONNECT = 0
DISCONNECT = 1
MESSAGE = 2
TEXT = 1
BINARY = 2
MAX_CLIENTS = 5
MAX_MESSAGE = 256 * 1024

_cb = {}
_clients = {}
_poll = select.poll()


def _sha1(data):
    h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]
    ml = len(data) * 8
    data = data + b"\x80" + b"\x00" * ((55 - len(data)) % 64) + struct.pack(">Q", ml)
    m = 0xFFFFFFFF
    for i in range(0, len(data), 64):
        w = list(struct.unpack(">16I", data[i : i + 64]))
        for t in range(16, 80):
            x = w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16]
            w.append(((x << 1) | (x >> 31)) & m)
        a, b, c, d, e = h
        for t in range(80):
            if t < 20:
                f, k = (b & c) | (~b & d & m), 0x5A827999
            elif t < 40:
                f, k = b ^ c ^ d, 0x6ED9EBA1
            elif t < 60:
                f, k = (b & c) | (b & d) | (c & d), 0x8F1BBCDC
            else:
                f, k = b ^ c ^ d, 0xCA62C1D6
            tmp = (((a << 5) | (a >> 27)) + f + e + k + w[t]) & m
            e, d, c, b, a = d, c, ((b << 30) | (b >> 2)) & m, a, tmp
        h = [(x + y) & m for x, y in zip(h, (a, b, c, d, e))]
    return b"".join(struct.pack(">I", x) for x in h)


def on(event, fn):
    _cb[event] = fn
    return True


def clients():
    return list(_clients.keys())


def count_clients():
    return len(_clients)


def client_role(client_id):
    c = _clients.get(client_id)
    return c["role"] if c else -1


def _frame(op, data):
    n = len(data)
    if n < 126:
        head = bytes([0x80 | op, n])
    elif n < 65536:
        head = bytes([0x80 | op, 126]) + struct.pack(">H", n)
    else:
        head = bytes([0x80 | op, 127]) + struct.pack(">Q", n)
    return head + data


def send(client_id, data, is_binary=False):
    c = _clients.get(client_id)
    if c is None:
        return False
    if isinstance(data, str):
        data = data.encode()
    c["sock"].setblocking(True)
    c["sock"].write(_frame(2 if is_binary else 1, data))
    c["sock"].setblocking(False)
    return True


def accept(conn, headers, uri):
    key = headers["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
    answer = binascii.b2a_base64(_sha1(key.encode())).decode().strip()
    resp = "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: %s\r\n" % answer
    if "mcp" in headers.get("sec-websocket-protocol", ""):
        resp += "Sec-WebSocket-Protocol: mcp\r\n"
    conn.write((resp + "\r\n").encode())

    role = mcplink.handshake_role(headers, uri)
    free = [i for i in range(MAX_CLIENTS) if i not in _clients]
    if role < 0 or not free:
        conn.write(_frame(8, struct.pack(">H", 1008)))
        conn.close()
        return
    conn.setblocking(False)
    cid = free[0]
    _clients[cid] = {"sock": conn, "buf": b"", "role": role}
    _poll.register(conn, select.POLLIN)
    if CONNECT in _cb:
        _cb[CONNECT](cid, "connect")


def _parse(cid, c):
    while cid in _clients:
        b = c["buf"]
        if len(b) < 2:
            return
        op = b[0] & 0x0F
        n = b[1] & 0x7F
        i = 2
        if n == 126:
            if len(b) < 4:
                return
            n = struct.unpack(">H", b[2:4])[0]
            i = 4
        elif n == 127:
            if len(b) < 10:
                return
            n = struct.unpack(">Q", b[2:10])[0]
            i = 10
        if len(b) < i + 4 + n:
            return
        mask = b[i : i + 4]
        payload = bytes(x ^ mask[j % 4] for j, x in enumerate(b[i + 4 : i + 4 + n]))
        c["buf"] = b[i + 4 + n :]
        if op == 1 and MESSAGE in _cb:
            _cb[MESSAGE](cid, "message", payload.decode())
        elif op == 2 and MESSAGE in _cb:
            _cb[MESSAGE](cid, "message", payload)
        elif op == 8:
            _drop(cid)
        elif op == 9:
            c["sock"].setblocking(True)
            c["sock"].write(_frame(10, payload))
            c["sock"].setblocking(False)


def _drop(cid):
    c = _clients.pop(cid, None)
    if c:
        _poll.unregister(c["sock"])
        c["sock"].close()
        if DISCONNECT in _cb:
            _cb[DISCONNECT](cid, "disconnect")


def pump():
    n = 0
    for sock, ev in _poll.poll(0):
        for cid, c in list(_clients.items()):
            if c["sock"] is not sock:
                continue
            d = sock.recv(65536)
            if d:
                c["buf"] += d
                _parse(cid, c)
                n += 1
            else:
                _drop(cid)
    return n
