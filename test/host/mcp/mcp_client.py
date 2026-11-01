"""Minimal MCP clients for testing a device: one POST per call, or a held WebSocket."""

import base64
import hashlib
import http.client
import json
import ssl
import struct
import time
from collections import deque
from urllib.parse import urlparse

MODERN = "2026-07-28"
_META = {
    "io.modelcontextprotocol/protocolVersion": MODERN,
    "io.modelcontextprotocol/clientCapabilities": {},
    "io.modelcontextprotocol/clientInfo": {"name": "ss-mcp-check", "version": "0.2.0"},
}
FRAME_CONTROL_INTERRUPT = bytes([3, 1, 0, 0, 0, 0, 0, 0])
FRAME_HEADER = "<BBHI"
FRAME_HEADER_SIZE = 8
FRAME_DATA = 0
FRAME_CREDIT = 1
FRAME_END = 2
STREAM_NOTIFICATION = "notifications/com.scriptostudio/stream"


def token(password, role="agent"):
    """Same derivation as lib/sys/auth.py on the device."""
    return hashlib.sha256(f"ss-{role}:{password}".encode()).hexdigest()[:32]


def insecure_tls():
    """Devices have self-signed certs."""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx


class RpcError(Exception):
    def __init__(self, err):
        super().__init__(f"{err.get('code')}: {err.get('message')} {err.get('data', '')}")
        self.code = err.get("code")
        self.data = err.get("data")


class ToolError(Exception):
    pass


class _Base:
    """Tool and resource helpers shared by both transports."""

    def __init__(self):
        self.next_id = 0

    def _msg(self, method, params):
        self.next_id += 1
        p = dict(params or {})
        p["_meta"] = _META
        return self.next_id, json.dumps({"jsonrpc": "2.0", "id": self.next_id, "method": method, "params": p})

    def tool(self, name, /, **args):
        r = self.call("tools/call", {"name": name, "arguments": args})
        text = r["content"][0]["text"]
        if r.get("isError"):
            raise ToolError(text)
        return text

    def tool_json(self, name, /, **args):
        return json.loads(self.tool(name, **args))

    def read_output(self, cursor):
        c = self.call("resources/read", {"uri": f"repl://output?after={cursor}"})["contents"][0]
        return c["text"], c["_meta"]["com.scriptostudio/cursor"]

    def write_chunk(self, path, offset, data):
        return self.tool_json("fs_write", path=path, offset=offset, data=base64.b64encode(data).decode())

    def read_chunk(self, path, offset, length):
        r = self.tool_json("fs_read", path=path, offset=offset, length=length)
        return base64.b64decode(r["data"]), r["eof"]


class HttpStatus(Exception):
    def __init__(self, status, body):
        super().__init__(f"HTTP {status}: {body[:120]!r}")
        self.status = status


class Http(_Base):
    def __init__(self, url, bearer, origin=None, timeout=30.0):
        super().__init__()
        u = urlparse(url)
        self.secure = u.scheme == "https"
        self.host = u.netloc
        self.path = u.path or "/mcp"
        self.bearer = bearer
        self.origin = origin
        self.timeout = timeout

    def post(self, body, method="tools/call"):
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
            "MCP-Protocol-Version": MODERN,
            "Mcp-Method": method,
        }
        if self.bearer:
            headers["Authorization"] = f"Bearer {self.bearer}"
        if self.origin:
            headers["Origin"] = self.origin
        if self.secure:
            conn = http.client.HTTPSConnection(self.host, timeout=self.timeout, context=insecure_tls())
        else:
            conn = http.client.HTTPConnection(self.host, timeout=self.timeout)
        try:
            conn.request("POST", self.path, body=body.encode(), headers=headers)
            resp = conn.getresponse()
            return resp.status, resp.read()
        finally:
            conn.close()

    def call(self, method, params=None):
        _, body = self._msg(method, params)
        status, raw = self.post(body, method)
        if status != 200:
            raise HttpStatus(status, raw)
        msg = json.loads(raw)
        if "error" in msg:
            raise RpcError(msg["error"])
        return msg["result"]


class Ws(_Base):
    """MCP on a held socket. via says how the token travels: bearer, subprotocol, or query."""

    def __init__(self, url, tok, via="bearer", origin=None, ping_interval=None, timeout=30.0):
        super().__init__()
        from websockets.sync.client import connect

        ctx = insecure_tls() if url.startswith("wss://") else None
        protocols = ["mcp"]
        headers = {}
        if via == "bearer":
            headers["Authorization"] = f"Bearer {tok}"
        elif via == "subprotocol":
            protocols.append(f"ss.{tok}")
        elif via == "query":
            url = f"{url}?token={tok}"
        self.timeout = timeout
        self.replies = {}
        self.frames = deque()
        self.notes = deque()
        self.ws = connect(
            url,
            subprotocols=protocols,
            additional_headers=headers,
            origin=origin,
            ssl=ctx,
            max_size=1 << 20,
            ping_interval=ping_interval,
            open_timeout=timeout,
        )

    def send(self, method, params=None):
        mid, body = self._msg(method, params)
        self.ws.send(body)
        return mid

    def _receive(self, timeout):
        """Take one frame off the socket and file it by what it is."""
        frame = self.ws.recv(timeout=timeout)
        if isinstance(frame, bytes):
            self.frames.append(frame)
            return
        msg = json.loads(frame)
        if msg.get("id") is not None:
            self.replies[msg["id"]] = msg
        elif "error" in msg:
            raise RpcError(msg["error"])
        else:
            self.notes.append(msg)

    def wait(self, mid, timeout=None):
        """Anything else that arrives meanwhile is kept for whoever asks for it."""
        deadline = time.time() + (timeout or self.timeout)
        while mid not in self.replies:
            left = deadline - time.time()
            if left <= 0:
                raise TimeoutError(f"no response to {mid}")
            self._receive(left)
        msg = self.replies.pop(mid)
        if "error" in msg:
            raise RpcError(msg["error"])
        return msg["result"]

    def call(self, method, params=None):
        return self.wait(self.send(method, params))

    def notify(self, method, params=None):
        self.ws.send(json.dumps({"jsonrpc": "2.0", "method": method, "params": params or {}}))

    def cancel(self, request_id):
        self.notify("notifications/cancelled", {"requestId": request_id})

    def send_interrupt_frame(self):
        self.ws.send(FRAME_CONTROL_INTERRUPT)

    def stream_open(self, kind, **args):
        return self.tool_json("stream_open", kind=kind, **args)

    def send_frame(self, frame_type, stream, seq, payload=b"", count=0):
        self.ws.send(struct.pack(FRAME_HEADER, frame_type, stream, count, seq) + payload)

    def next_frame(self, timeout=None):
        """(type, stream, count, seq, payload), or None if nothing comes in time."""
        deadline = time.time() + (timeout or self.timeout)
        while not self.frames:
            left = deadline - time.time()
            if left <= 0:
                return None
            try:
                self._receive(left)
            except TimeoutError:
                return None
        f = self.frames.popleft()
        return (*struct.unpack_from(FRAME_HEADER, f), f[FRAME_HEADER_SIZE:])

    def next_note(self, timeout=None):
        deadline = time.time() + (timeout or self.timeout)
        while not self.notes:
            left = deadline - time.time()
            if left <= 0:
                return None
            try:
                self._receive(left)
            except TimeoutError:
                return None
        return self.notes.popleft()

    def read_file(self, path, chunk=16384, **args):
        """Returns (data, seconds)."""
        t0 = time.perf_counter()
        info = self.stream_open("file_read", path=path, chunk=chunk, **args)
        sid = info["stream"]
        parts = []
        while True:
            f = self.next_frame()
            if f is None:
                raise TimeoutError(f"read of {path} stalled")
            ftype, stream, count, seq, payload = f
            if stream != sid:
                continue
            if ftype == FRAME_DATA:
                parts.append(payload)
            elif ftype == FRAME_END:
                if count:
                    raise RuntimeError(f"read failed: {self.next_note(1)}")
                return b"".join(parts), time.perf_counter() - t0

    def write_file(self, path, data, chunk=16384, **args):
        """Returns seconds, up to the device confirming."""
        t0 = time.perf_counter()
        info = self.stream_open("file_write", path=path, chunk=chunk, **args)
        sid = info["stream"]
        limit = info["credit"]
        offset = 0
        while offset < len(data):
            while offset >= limit or offset + chunk > limit:
                f = self.next_frame()
                if f is None:
                    raise TimeoutError(f"write of {path} stalled at {offset}")
                if f[1] == sid and f[0] == FRAME_CREDIT:
                    limit = f[3]
                elif f[1] == sid and f[0] == FRAME_END:
                    raise RuntimeError(f"write failed: {self.next_note(1)}")
            self.send_frame(FRAME_DATA, sid, offset, data[offset : offset + chunk])
            offset += min(chunk, len(data) - offset)
        self.send_frame(FRAME_END, sid, offset)
        while True:
            f = self.next_frame()
            if f is None:
                raise TimeoutError(f"no confirmation for {path}")
            if f[1] == sid and f[0] == FRAME_END:
                if f[2]:
                    raise RuntimeError(f"write failed: {self.next_note(1)}")
                return time.perf_counter() - t0

    def close(self):
        self.ws.close()

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.close()
