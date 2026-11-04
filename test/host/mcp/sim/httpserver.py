# Host stand-in for pyDirect's httpserver, run under unix MicroPython.
#
# Handlers get (uri, body, ip) and may return (status, body), and run only from
# process_queue(), as on the device. Protected routes are checked before that.

import select
import socket

import mcplink
import wsserver

_handlers = {}
_slots = {}
_srv = None
_conn = None
_poll = select.poll()


def start(port=8080, cert_file=None, key_file=None):
    global _srv
    _srv = socket.socket()
    _srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    _srv.bind(socket.getaddrinfo("127.0.0.1", port)[0][-1])
    _srv.listen(8)
    _poll.register(_srv, select.POLLIN)
    return True


def on(uri, fn, method="GET"):
    key = (method, uri)
    slot = _slots.setdefault(key, len(_slots))
    _handlers[key] = fn
    return slot


def _send(conn, status, body="", kind="application/json"):
    data = body.encode()
    head = "HTTP/1.1 %d S\r\nContent-Type: %s\r\nContent-Length: %d\r\nConnection: close\r\n\r\n" % (status, kind, len(data))
    conn.write(head.encode())
    if data:
        conn.write(data)
    conn.close()


def send(body):
    """A handler answering with a page, which returning a string doesn't do."""
    global _conn
    _send(_conn, 200, body, "text/html")
    _conn = None


def _serve(conn):
    global _conn
    conn.setblocking(True)
    raw = b""
    while b"\r\n\r\n" not in raw:
        d = conn.recv(4096)
        if not d:
            conn.close()
            return
        raw += d
    head, _, body = raw.partition(b"\r\n\r\n")
    lines = head.decode().split("\r\n")
    method, uri, _ = lines[0].split(" ", 2)
    headers = {}
    for ln in lines[1:]:
        k, _, v = ln.partition(":")
        headers[k.strip().lower()] = v.strip()
    if "sec-websocket-key" in headers:
        wsserver.accept(conn, headers, uri)
        return
    want = int(headers.get("content-length", 0))
    while len(body) < want:
        d = conn.recv(want - len(body))
        if not d:
            break
        body += d
    key = (method, uri)
    fn = _handlers.get(key)
    if fn is None:
        _send(conn, 405 if any(k[1] == uri for k in _handlers) else 404)
        return
    if _slots[key] in mcplink._protected:
        refused = mcplink.http_status(headers)
        if refused:
            _send(conn, refused)
            return
    _conn = conn
    result = fn(uri, body.decode(), "127.0.0.1")
    if _conn is None:
        return
    _conn = None
    if isinstance(result, tuple):
        _send(conn, result[0], result[1])
    else:
        _send(conn, 200, result if isinstance(result, str) else "")


def process_queue():
    n = 0
    for obj, ev in _poll.poll(0):
        if obj is _srv:
            conn, _ = _srv.accept()
            _serve(conn)
            n += 1
    return n + wsserver.pump()
