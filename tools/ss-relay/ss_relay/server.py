"""The stdio MCP server. Device tools pass through untouched, so nothing here can drift from them."""

import asyncio
import json
import sys

from . import __version__, files, hosttools
from .device import Device, DeviceError

RECONNECT_S = 3
HIDDEN_DEVICE_TOOLS = {"stream_open", "stream_status", "stream_close"}
_STRING = {"type": "string"}
_BOOL = {"type": "boolean"}

HOST_TOOLS = [
    {
        "name": "fs_push",
        "description": "Copy one file from a host path to the device. Replaces the target only once all of it has arrived.",
        "inputSchema": {
            "type": "object",
            "properties": {"local": _STRING, "remote": _STRING},
            "required": ["local", "remote"],
        },
    },
    {
        "name": "fs_pull",
        "description": "Copy one file from the device to a host path.",
        "inputSchema": {
            "type": "object",
            "properties": {"remote": _STRING, "local": _STRING},
            "required": ["remote", "local"],
        },
        "annotations": {"readOnlyHint": True},
    },
    {
        "name": "sync",
        "description": (
            "Copy a host directory to the device, skipping files whose hash already matches. A directory holding "
            "extension.json goes where that file says, with .py under lib/ compiled to .mpy. Never overwrites a board's "
            "own files or an app's existing data outside /lib, and lists them as kept. Refuses scripts that call into C "
            "the board's firmware doesn't have, unless force is set."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "local": _STRING,
                "remote": {**_STRING, "description": "Target directory. Ignored for a directory holding extension.json."},
                "prune": {**_BOOL, "description": "Also remove files under remote that the host doesn't have."},
                "mpy_cross": {**_STRING, "description": "Path to mpy-cross, if it isn't on PATH or in MPY_CROSS."},
                "compile": {**_BOOL, "description": "Compile .py to .mpy. Defaults to on for a directory holding extension.json."},
                "force": {**_BOOL, "description": "Skip the firmware check."},
                "dry_run": {**_BOOL, "description": "Report what would be copied, and copy nothing."},
            },
            "required": ["local"],
        },
    },
    {
        "name": "discover",
        "description": "Find devices advertising MCP on the local network.",
        "inputSchema": {"type": "object", "properties": {"seconds": {"type": "number"}}},
        "annotations": {"readOnlyHint": True},
    },
    {
        "name": "flash",
        "description": "Write a merged firmware image to a device on a serial port, using esptool.",
        "inputSchema": {
            "type": "object",
            "properties": {"image": _STRING, "port": _STRING, "address": _STRING},
            "required": ["image", "port"],
        },
        "annotations": {"destructiveHint": True},
    },
]
_HOST_NAMES = {t["name"] for t in HOST_TOOLS}
_NEEDS_DEVICE = {"fs_push", "fs_pull", "sync"}
_OFFLINE_INSTRUCTIONS = "The device isn't reachable yet. Host tools work, and its own tools appear when it connects."


def _reply(mid, result):
    return {"jsonrpc": "2.0", "id": mid, "result": result}


def _text(value, is_error=False):
    return {"content": [{"type": "text", "text": value if isinstance(value, str) else json.dumps(value)}], "isError": is_error}


class Relay:
    def __init__(self, url, token, cafile=None):
        self.device = Device(url, token, cafile, on_message=self._from_device, on_close=self._on_close)
        self.out = None
        self.connecting = None
        self.initialize = None
        self.list_requests = set()
        self.tasks = set()

    def _write(self, message):
        self.out.write((message if isinstance(message, str) else json.dumps(message)) + "\n")
        self.out.flush()

    def _from_device(self, text):
        message = json.loads(text)
        if message.get("id") in self.list_requests and "result" in message:
            self.list_requests.discard(message["id"])
            tools = [t for t in message["result"].get("tools", []) if t["name"] not in HIDDEN_DEVICE_TOOLS and t["name"] not in _HOST_NAMES]
            message["result"]["tools"] = tools + HOST_TOOLS
            self._write(message)
            return
        self._write(text)

    def _on_close(self):
        self._log("warning", "Connection to the device closed")

    def _log(self, level, text):
        print(f"ss-relay: {level}: {text}", file=sys.stderr, flush=True)

    async def _keep_connected(self):
        """A board that's rebooting, or off, shouldn't take the relay down with it."""
        was_connected = False
        while True:
            if not self.device.connected:
                if was_connected:
                    was_connected = False
                try:
                    await self.device.connect()
                    was_connected = True
                    self._log("info", f"Connected to {self.device.url}")
                    self._write({"jsonrpc": "2.0", "method": "notifications/tools/list_changed"})
                except DeviceError as e:
                    self._log("warning", str(e))
            await asyncio.sleep(RECONNECT_S)

    async def _call_host_tool(self, mid, name, args, meta):
        try:
            if name in _NEEDS_DEVICE and not self.device.connected:
                raise DeviceError("Not connected to the device")
            if name == "fs_push":
                result = await files.push(self.device, args["local"], args["remote"])
            elif name == "fs_pull":
                result = await files.pull(self.device, args["remote"], args["local"])
            elif name == "sync":
                token = (meta or {}).get("progressToken")

                async def progress(done, total, path):
                    if token is not None:
                        self._write({"jsonrpc": "2.0", "method": "notifications/progress", "params": {"progressToken": token, "progress": done, "total": total, "message": path}})

                result = await files.sync(
                    self.device,
                    args["local"],
                    args.get("remote", "/"),
                    prune=args.get("prune", False),
                    mpy_cross=args.get("mpy_cross"),
                    compile_py=args.get("compile"),
                    force=args.get("force", False),
                    dry_run=args.get("dry_run", False),
                    progress=progress,
                )
            elif name == "discover":
                result = await hosttools.discover(args.get("seconds", hosttools.DISCOVER_SECONDS))
            else:
                await self.device.close()
                result = await hosttools.flash(args["image"], args["port"], args.get("address", "0x0"))
            self._write(_reply(mid, _text(result)))
        except (DeviceError, OSError, KeyError) as e:
            self._write(_reply(mid, _text(str(e), True)))
        except Exception as e:
            # Whatever went wrong, the client is waiting for an answer
            self._write(_reply(mid, _text(f"{type(e).__name__}: {e}", True)))
            self._log("error", f"{name}: {type(e).__name__}: {e}")

    def _spawn(self, coroutine):
        task = asyncio.create_task(coroutine)
        self.tasks.add(task)
        task.add_done_callback(self.tasks.discard)

    async def _forward(self, line, message):
        try:
            await self.device.send_text(line)
        except DeviceError as e:
            if "id" in message:
                self._write({"jsonrpc": "2.0", "id": message["id"], "error": {"code": -32000, "message": str(e)}})

    def _offline_answer(self, message):
        """Something for a client to work with until the board appears. True if answered."""
        method = message.get("method")
        mid = message.get("id")
        if method == "initialize":
            self._write(
                _reply(
                    mid,
                    {
                        "protocolVersion": message["params"].get("protocolVersion", "2025-11-25"),
                        "capabilities": {"tools": {"listChanged": True}},
                        "serverInfo": {"name": "ss-relay", "version": __version__},
                        "instructions": _OFFLINE_INSTRUCTIONS,
                    },
                )
            )
        elif method == "tools/list":
            self._write(_reply(mid, {"tools": HOST_TOOLS}))
        elif method == "ping":
            self._write(_reply(mid, {}))
        else:
            return False
        return True

    async def _handle(self, line):
        try:
            message = json.loads(line)
        except ValueError:
            self._write({"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "Parse error"}})
            return
        method = message.get("method")
        params = message.get("params") or {}
        if method == "tools/call" and params.get("name") in _HOST_NAMES:
            self._spawn(self._call_host_tool(message.get("id"), params["name"], params.get("arguments") or {}, params.get("_meta")))
            return
        if not self.device.connected and self._offline_answer(message):
            return
        if method == "tools/list":
            self.list_requests.add(message.get("id"))
        await self._forward(line, message)

    async def run(self):
        loop = asyncio.get_running_loop()
        self.out = sys.stdout
        reader = asyncio.StreamReader(limit=1 << 26)
        await loop.connect_read_pipe(lambda: asyncio.StreamReaderProtocol(reader), sys.stdin)
        keeper = asyncio.create_task(self._keep_connected())
        try:
            # Give a board that's up a moment, so the first tools/list has its tools
            for _ in range(50):
                if self.device.connected:
                    break
                await asyncio.sleep(0.1)
            while True:
                line = await reader.readline()
                if not line:
                    break
                line = line.decode().strip()
                if line:
                    await self._handle(line)
        finally:
            keeper.cancel()
            await self.device.close()
