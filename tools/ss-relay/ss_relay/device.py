"""One held connection to a device: JSON-RPC in text frames, streams in binary frames."""

import asyncio
import hashlib
import json
import os
import socket
import ssl
import struct
from urllib.parse import urlparse, urlunparse

from websockets.asyncio.client import connect
from websockets.exceptions import ConnectionClosed

FRAME_HEADER = "<BBHI"
FRAME_HEADER_SIZE = struct.calcsize(FRAME_HEADER)
FRAME_DATA = 0
FRAME_CREDIT = 1
FRAME_END = 2
STREAM_NOTIFICATION = "notifications/com.scriptostudio/stream"
CHUNK = 16384
REPLY_TIMEOUT_S = 60
STREAM_TIMEOUT_S = 30
CONNECT_TIMEOUT_S = 15
CLOSE_POLICY_VIOLATION = 1008
UNCLAIMED_FRAMES_MAX = 64
KNOWN_DEVICES = os.path.expanduser("~/.config/ss-relay/known_devices.json")


class DeviceError(Exception):
    """The device can't be reached, or refused or failed a request."""


class ToolError(DeviceError):
    """A device tool ran and reported an error."""


def derive_token(password, role="agent"):
    """Same derivation as lib/sys/auth.py on the device."""
    return hashlib.sha256(f"ss-{role}:{password}".encode()).hexdigest()[:32]


def device_url(target):
    """Accept a bare host as well as a full URL."""
    url = target if "://" in target else f"wss://{target}/mcp"
    parts = urlparse(url)
    return urlunparse(parts._replace(path=parts.path if parts.path not in ("", "/") else "/mcp"))


def _load_pins():
    try:
        with open(KNOWN_DEVICES) as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def _check_pin(host, cert_der):
    """Devices have self-signed certs, so trust the first one seen, as ssh does."""
    seen = hashlib.sha256(cert_der).hexdigest()
    pins = _load_pins()
    known = pins.get(host)
    if known == seen:
        return
    if known:
        raise DeviceError(
            f"{host} presented a different certificate from the one recorded in {KNOWN_DEVICES}. "
            "If the device was reflashed or replaced, remove its entry and connect again."
        )
    pins[host] = seen
    os.makedirs(os.path.dirname(KNOWN_DEVICES), exist_ok=True)
    with open(KNOWN_DEVICES, "w") as f:
        json.dump(pins, f, indent=2)


class _Stream:
    def __init__(self):
        self.frames = asyncio.Queue()
        self.error = None

    async def next(self, what):
        try:
            return await asyncio.wait_for(self.frames.get(), STREAM_TIMEOUT_S)
        except asyncio.TimeoutError:
            raise DeviceError(f"{what} stalled") from None


class Device:
    def __init__(self, url, token, cafile=None, on_message=None, on_close=None):
        self.url = device_url(url)
        self.token = token
        self.cafile = cafile
        self.on_message = on_message
        self.on_close = on_close
        self.socket = None
        self._reader = None
        self._pending = {}
        self._streams = {}
        self._unclaimed = {}
        self._next_id = 0

    @property
    def connected(self):
        return self.socket is not None

    def _ssl_context(self):
        if not self.url.startswith("wss://"):
            return None
        if self.cafile:
            return ssl.create_default_context(cafile=self.cafile)
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx

    async def connect(self):
        parts = urlparse(self.url)
        secure = parts.scheme == "wss"
        port = parts.port or (443 if secure else 80)
        # IPv4 only: a .local name otherwise waits 5 s for an AAAA answer the board never sends
        loop = asyncio.get_running_loop()
        try:
            found = await loop.getaddrinfo(parts.hostname, port, family=socket.AF_INET, type=socket.SOCK_STREAM)
        except OSError as e:
            raise DeviceError(f"Can't resolve {parts.hostname}: {e}") from None
        try:
            ws = await asyncio.wait_for(
                connect(
                    self.url,
                    host=found[0][4][0],
                    port=port,
                    ssl=self._ssl_context(),
                    subprotocols=["mcp"],
                    additional_headers={"Authorization": f"Bearer {self.token}"},
                    max_size=None,
                    close_timeout=2,
                ),
                CONNECT_TIMEOUT_S,
            )
        except (OSError, asyncio.TimeoutError) as e:
            raise DeviceError(f"Can't connect to {self.url}: {e}") from None
        if secure and not self.cafile:
            _check_pin(parts.hostname, ws.transport.get_extra_info("ssl_object").getpeercert(True))
        self.socket = ws
        self._reader = asyncio.create_task(self._read(ws))
        try:
            await self.request("ping", timeout=CONNECT_TIMEOUT_S)
        except DeviceError:
            await self.close()
            raise

    async def close(self):
        ws, self.socket = self.socket, None
        if ws:
            await ws.close()

    async def _read(self, ws):
        reason = None
        try:
            async for message in ws:
                if isinstance(message, bytes):
                    self._on_frame(message)
                else:
                    self._on_text(message)
        except ConnectionClosed:
            pass
        finally:
            if ws.close_code == CLOSE_POLICY_VIOLATION:
                reason = {"origin": "the Origin isn't allowed", "full": "it has no free connections"}.get(
                    ws.close_reason, "the token is wrong"
                )
            if self.socket is ws:
                self.socket = None
            error = DeviceError(f"The device refused the connection: {reason}" if reason else "Connection to the device closed")
            for future in self._pending.values():
                if not future.done():
                    future.set_exception(error)
            self._pending.clear()
            for stream in self._streams.values():
                stream.error = str(error)
                stream.frames.put_nowait(None)
            self._streams.clear()
            self._unclaimed.clear()
            if self.on_close:
                self.on_close()

    def _on_text(self, text):
        msg = json.loads(text)
        future = self._pending.pop(msg.get("id"), None) if "id" in msg and "method" not in msg else None
        if future:
            if not future.done():
                future.set_result(msg)
            return
        if msg.get("method") == STREAM_NOTIFICATION:
            # Only streams this relay opened exist, since a stdio client can't carry their frames
            stream = self._streams.get(msg["params"].get("stream"))
            if stream and msg["params"].get("state") == "error":
                stream.error = msg["params"].get("message")
            return
        if self.on_message:
            self.on_message(text)

    def _on_frame(self, frame):
        if len(frame) < FRAME_HEADER_SIZE:
            return
        kind, sid, count, seq = struct.unpack_from(FRAME_HEADER, frame)
        item = (kind, count, seq, frame[FRAME_HEADER_SIZE:])
        stream = self._streams.get(sid)
        if stream:
            stream.frames.put_nowait(item)
            return
        # A read starts as soon as it opens, so its first frames can beat our turn to see the reply
        early = self._unclaimed.setdefault(sid, [])
        if len(early) < UNCLAIMED_FRAMES_MAX:
            early.append(item)

    async def send_text(self, text):
        if not self.socket:
            raise DeviceError("Not connected to the device")
        await self.socket.send(text)

    async def request(self, method, params=None, timeout=REPLY_TIMEOUT_S):
        """A request of the relay's own. Its id can't collide with a client's, whose replies pass through."""
        self._next_id += 1
        mid = f"ss-relay-{self._next_id}"
        future = asyncio.get_running_loop().create_future()
        self._pending[mid] = future
        message = {"jsonrpc": "2.0", "id": mid, "method": method}
        if params is not None:
            message["params"] = params
        try:
            await self.send_text(json.dumps(message))
            reply = await asyncio.wait_for(future, timeout)
        except asyncio.TimeoutError:
            raise DeviceError(f"No reply to {method}") from None
        finally:
            self._pending.pop(mid, None)
        if "error" in reply:
            raise DeviceError(reply["error"].get("message", str(reply["error"])))
        return reply.get("result", {})

    async def tool(self, name, **args):
        result = await self.request("tools/call", {"name": name, "arguments": args})
        text = "".join(c.get("text", "") for c in result.get("content", []))
        if result.get("isError"):
            raise ToolError(text.strip())
        return text

    async def tool_json(self, name, **args):
        return json.loads(await self.tool(name, **args))

    async def _send_frame(self, kind, sid, seq, payload=b""):
        await self.socket.send(struct.pack(FRAME_HEADER, kind, sid, 0, seq) + payload)

    async def _open_stream(self, kind, **args):
        info = await self.tool_json("stream_open", kind=kind, **args)
        stream = _Stream()
        self._streams[info["stream"]] = stream
        for item in self._unclaimed.pop(info["stream"], ()):
            stream.frames.put_nowait(item)
        return info, stream

    async def read_file(self, path):
        info, stream = await self._open_stream("file_read", path=path, chunk=CHUNK)
        sid = info["stream"]
        parts = []
        try:
            while True:
                frame = await stream.next(f"Read of {path}")
                if frame is None:
                    raise DeviceError(stream.error)
                kind, count, _, payload = frame
                if kind == FRAME_DATA:
                    parts.append(payload)
                elif kind == FRAME_END:
                    if count:
                        raise DeviceError(f"Read of {path} failed: {stream.error}")
                    return b"".join(parts)
        finally:
            self._streams.pop(sid, None)
            self._unclaimed.pop(sid, None)

    async def write_file(self, path, data):
        """Replaces the file once the whole of it has arrived, so a failure leaves the old one."""
        info, stream = await self._open_stream("file_write", path=path, chunk=CHUNK)
        sid = info["stream"]
        limit = info["credit"]
        offset = 0
        total = len(data)

        def failed(frame):
            if frame is None:
                return DeviceError(stream.error)
            if frame[0] == FRAME_END:
                return DeviceError(f"Write of {path} failed: {stream.error}")
            return None

        try:
            while offset < total:
                size = min(CHUNK, total - offset)
                while offset + size > limit:
                    frame = await stream.next(f"Write of {path}")
                    error = failed(frame)
                    if error:
                        raise error
                    if frame[0] == FRAME_CREDIT:
                        limit = frame[2]
                await self._send_frame(FRAME_DATA, sid, offset, data[offset : offset + size])
                offset += size
            await self._send_frame(FRAME_END, sid, offset)
            while True:
                frame = await stream.next(f"Confirmation of {path}")
                if frame is None:
                    raise DeviceError(stream.error)
                if frame[0] == FRAME_END:
                    if frame[1]:
                        raise DeviceError(f"Write of {path} failed: {stream.error}")
                    return
        finally:
            self._streams.pop(sid, None)
            self._unclaimed.pop(sid, None)
