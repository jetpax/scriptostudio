"""
MCP server (lib/sys/mcp.py)
===========================

The device's only protocol, for agents and for Studio alike. Text WebSocket
frames and HTTP POST bodies carry JSON-RPC, and both land in _dispatch().
Everything here runs in queue_pump, on the single interpreter thread, so a tool
that blocks holds up every other client until it returns.

Speaks both eras of MCP: stateless 2026-07-28 (server/discover), and the
initialize handshake that shipping clients still use.

What can't wait for the pump is in the C module mcplink: authorization, breaking
a blocked exec, and the stdout ring.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import __main__
import binascii
import gc
import hashlib
import io
import json
import os
import sys
import time

import httpserver
import mcplink
import wsserver

from lib.sys import apps, bg_tasks, events, jobs, settings, streams, tx_gate

try:
    import esp32
except ImportError:
    esp32 = None

PATH = "/mcp"

MODERN = "2026-07-28"
LEGACY = ("2025-11-25", "2025-06-18", "2025-03-26")
SUPPORTED = (MODERN,) + LEGACY
PROTOCOL_VERSION_KEY = "io.modelcontextprotocol/protocolVersion"
CLIENT_INFO_KEY = "io.modelcontextprotocol/clientInfo"
SERVER_INFO = {"name": "scriptostudio-device", "version": "2.0.0"}
STREAMS_EXTENSION = "com.scriptostudio/streams"
_STREAMS_INFO = {"kinds": list(streams.KINDS), "maxFrame": wsserver.MAX_MESSAGE}
CAPABILITIES = {"tools": {"listChanged": True}, "resources": {}, "logging": {}, "extensions": {STREAMS_EXTENSION: _STREAMS_INFO}}
# The older protocol revisions have no extensions field
LEGACY_CAPABILITIES = {"tools": {"listChanged": True}, "resources": {}, "logging": {}, "experimental": {STREAMS_EXTENSION: _STREAMS_INFO}}
INSTRUCTIONS = (
    "MicroPython device. exec runs in __main__ on the single interpreter thread "
    "and is stopped after 4 s, because a longer block would make the watchdog stop "
    "user tasks. No os.path. Use lib.sys.board for pins, never hardcode them. "
    "Installed apps add tools named <app>_<tool>, which can run for a long time and "
    "report progress. On plain HTTP they return a job id to poll with job_status. "
    "If a CAN transmit is refused as not armed, ask the person to arm it."
)

EXEC_TIMEOUT_MS = 4000
# Only a person's panels may ask for longer, and they stop themselves at this
EXEC_TIMEOUT_MAX_MS = 60000
READ_TEXT_DEFAULT = 16384
HASH_BLOCK = 4096
LOGS_DEFAULT = 4096
HTTP_CLIENT = -1

_RESET_FLUSH_MS = 200
_FRAME_MARKER = "lib/sys/mcp.py"

_started = False
_on_clients = None
_write_cache = None
_reset_mode = None
_tx_armed = False
_repl_lines = {}

# The request being handled. Handlers can re-enter via a nested process_queue,
# so _dispatch saves and restores these around each message.
_client = HTTP_CLIENT
_request_id = None
_long_calls = 0
_advertised = False
_advertise_next = 0
_ADVERTISE_EVERY_MS = 2000
HTTPS_PORT = 443


class _RpcError(Exception):
    def __init__(self, code, message, data=None):
        self.code = code
        self.message = message
        self.data = data


def _traceback(exc):
    s = io.StringIO()
    sys.print_exception(exc, s)
    return s.getvalue()


def _text(s, is_error=False):
    return {"content": [{"type": "text", "text": s}], "isError": is_error}


def _json(obj):
    return _text(json.dumps(obj))


def _decode(raw):
    # Output can stop mid-character when the ring wraps, or be binary from print()
    try:
        return raw.decode()
    except UnicodeError:
        return "".join(chr(c) if c < 128 else "?" for c in raw)


def _run(src, timeout_ms, private, echo=True):
    """Run src in __main__ with interrupt armed. Returns (output, traceback or None).

    With private set, its output goes only to the caller, not to terminal streams.
    Studio's panels run on exec all the time, and none of that belongs in a terminal.
    With echo set, a lone expression prints its value, as at a REPL. A script that
    prints JSON for its caller doesn't want that added.
    """
    global _long_calls
    start = mcplink.cursor(private)
    g = __main__.__dict__

    def body():
        code = None
        if echo:
            try:
                code = compile(src, "<mcp>", "single")
            except SyntaxError:
                pass
        exec(code or compile(src, "<mcp>", "exec"), g, g)

    tb = None
    long_call = 1 if timeout_ms == 0 or timeout_ms > EXEC_TIMEOUT_MS else 0
    _long_calls += long_call
    def guarded():
        mcplink.guard(body, _client, _request_id, timeout_ms, private)

    try:
        if wsserver.client_role(_client) == mcplink.ROLE_HUMAN:
            guarded()
        else:
            tx_gate.run_as_agent(guarded)
    except BaseException as e:
        # Client code can raise anything, and the caller is owed the traceback.
        # Its frames only, since the ones that called it aren't the caller's concern.
        tb = "\n".join(line for line in _traceback(e).split("\n") if _FRAME_MARKER not in line)
        if mcplink.interrupt_reason() == mcplink.REASON_TIMEOUT:
            tb += "exec stopped after %d ms. Run longer work as a background task.\n" % timeout_ms
    finally:
        _long_calls -= long_call
    return _decode(mcplink.output_since(start, private)[0]), tb


def in_long_call():
    """True while a call runs that may outlast the task watchdog's deadline. Its timer
    bounds it, or a person is there to stop it. A call past the deadline that isn't one
    of these is stuck."""
    return _long_calls > 0


# --- tools ---------------------------------------------------------------


def _t_exec(a):
    timeout_ms = EXEC_TIMEOUT_MS
    if wsserver.client_role(_client) == mcplink.ROLE_HUMAN:
        timeout_ms = min(a.get("timeout_ms", EXEC_TIMEOUT_MS), EXEC_TIMEOUT_MAX_MS)
    out, tb = _run(a["code"], timeout_ms, True, a.get("echo", True))
    return _text(out + tb if tb else out, tb is not None)


def _heap():
    h = {"gc_free": gc.mem_free(), "gc_alloc": gc.mem_alloc()}
    if esp32:
        rows = esp32.idf_heap_info(esp32.HEAP_DATA)
        h["idf_free"] = sum(r[1] for r in rows)
        h["idf_largest"] = max(r[2] for r in rows)
        h["idf_regions"] = rows
    return h


def _firmware():
    try:
        with open("/firmware-version.json") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def _t_device_info(a):
    from lib.sys import board

    return _json(
        {
            "machine": getattr(sys.implementation, "_machine", sys.platform),
            "micropython": sys.version,
            "firmware": _firmware(),
            "board": board.id.name,
            "chip": board.id.chip,
            "heap": _heap(),
            "max_frame": wsserver.MAX_MESSAGE,
            "streams": list(streams.KINDS),
            "clients": wsserver.count_clients(),
            "role": wsserver.client_role(_client),
            "tx_gate": mcplink.tx_gate(),
            "tx_armed_ms": mcplink.tx_armed_ms(),
            "transport": "http" if _client == HTTP_CLIENT else "websocket",
        }
    )


def _t_fs_list(a):
    path = a.get("path", "/")
    rows = []
    for e in os.ilistdir(path):
        rows.append({"name": e[0], "type": "dir" if e[1] & 0x4000 else "file", "size": e[3] if len(e) > 3 else -1})
    return _json(rows)


def _t_fs_stat(a):
    s = os.stat(a["path"])
    return _json({"type": "dir" if s[0] & 0x4000 else "file", "size": s[6], "mtime": s[8]})


def _t_fs_read_text(a):
    offset = a.get("offset", 0)
    length = a.get("length", READ_TEXT_DEFAULT)
    with open(a["path"], "rb") as f:
        f.seek(offset)
        data = f.read(length)
    try:
        text = data.decode()
    except UnicodeError:
        return _text("Not UTF-8 text, or the range splits a character. ss-relay moves binary files by path.", True)
    return _json({"text": text, "eof": len(data) < length, "next_offset": offset + len(data)})


def _t_fs_write_text(a):
    # Through a temporary file, since an agent may be rewriting a system script
    # and a power cut mid-write would otherwise leave half of it.
    path = a["path"]
    if a.get("append"):
        with open(path, "ab") as f:
            n = f.write(a["text"].encode())
    else:
        tmp = path + ".mcp-tmp"
        with open(tmp, "wb") as f:
            n = f.write(a["text"].encode())
        os.rename(tmp, path)
    events.file_changed(_client, path)
    return _json({"written": n})


def _t_fs_rm(a):
    path = a["path"]
    if os.stat(path)[0] & 0x4000:
        os.rmdir(path)
    else:
        os.remove(path)
    events.file_changed(_client, path, "removed")
    return _json({"removed": path})


def _t_fs_mkdir(a):
    # Parents as well, and an existing directory isn't an error: agents retry.
    made = ""
    for part in a["path"].strip("/").split("/"):
        made += "/" + part
        try:
            os.stat(made)
        except OSError:
            os.mkdir(made)
    events.file_changed(_client, made, "made")
    return _json({"path": made})


def _t_fs_hash(a):
    offset = a.get("offset", 0)
    left = a.get("length", 1 << 30)
    h = hashlib.sha256()
    n = 0
    with open(a["path"], "rb") as f:
        f.seek(offset)
        while left > 0:
            d = f.read(min(HASH_BLOCK, left))
            if not d:
                break
            h.update(d)
            n += len(d)
            left -= len(d)
    return _json({"sha256": binascii.hexlify(h.digest()).decode(), "n": n})


def _close_write_cache():
    global _write_cache
    if _write_cache:
        _write_cache[2].close()
        events.file_changed(_write_cache[3], _write_cache[0])
        _write_cache = None


def _t_fs_read(a):
    offset = a.get("offset", 0)
    length = a.get("length", 4096)
    with open(a["path"], "rb") as f:
        f.seek(offset)
        data = f.read(length)
    b64 = binascii.b2a_base64(data).decode().strip()
    return _text('{"data":"%s","eof":%s,"n":%d}' % (b64, "true" if len(data) < length else "false", len(data)))


def _t_fs_write(a):
    # The cached handle saves reopening per chunk. It isn't protocol state: a miss reopens.
    global _write_cache
    path = a["path"]
    offset = a.get("offset", 0)
    data = binascii.a2b_base64(a["data"])
    if _write_cache and (offset == 0 or _write_cache[0] != path or _write_cache[1] != offset):
        _close_write_cache()
    if not _write_cache:
        f = open(path, "wb" if offset == 0 else "r+b")
        if offset:
            f.seek(offset)
        _write_cache = [path, offset, f, _client]
    _write_cache[2].write(data)
    _write_cache[1] = offset + len(data)
    return _text('{"written":%d,"offset":%d}' % (len(data), _write_cache[1]))


def _t_apps_list(a):
    return _json(apps.describe())


def _t_app_installed(a):
    return _json(apps.register(a["id"], a["version"], a.get("name"), a.get("folder")))


def _app_row(app_id):
    for row in apps.describe()["apps"]:
        if row["id"] == app_id:
            return row
    raise ValueError("No such app: %s" % app_id)


def _app_folder(app_id):
    return "%s/%s" % (apps.ROOT, apps.folder_of(app_id, apps.read().get(app_id)))


def _start_app(app_id):
    if wsserver.client_role(_client) == mcplink.ROLE_HUMAN:
        apps.start(app_id)
    else:
        tx_gate.mark(apps.start(app_id))


def _t_app_create(a):
    apps.create(a["id"], a["code"], a.get("name"), a.get("version", "1.0.0"), a.get("tools"), a.get("run_at_boot", False))
    if a.get("start", True):
        _start_app(a["id"])
    events.file_changed(_client, _app_folder(a["id"]))
    return _json(_app_row(a["id"]))


def _t_app_run_at_boot(a):
    apps.set_run_at_boot(a["id"], a["on"])
    return _json(_app_row(a["id"]))


def _t_app_start(a):
    _start_app(a["id"])
    return _json(_app_row(a["id"]))


def _t_app_stop(a):
    apps.stop(a["id"])
    return _json(_app_row(a["id"]))


def _t_app_remove(a):
    folder = _app_folder(a["id"])
    result = apps.remove(a["id"])
    events.file_changed(_client, folder, "removed")
    return _json(result)


def _t_job_start(a):
    return _json(jobs.start(a["tool"], a.get("arguments") or {}, _client).status())


def _t_job_status(a):
    return _json(jobs.get(a["job"]).status() if "job" in a else jobs.list_all())


def _t_job_cancel(a):
    return _json(jobs.cancel(a["job"]).status())


def _t_interrupt(a):
    # The C frame filter already acted on this call as it arrived, ahead of the
    # blocked exec. By the time this runs, that exec has returned.
    return _json({"delivered": mcplink.interrupt_requested()})


def _t_stop_user_tasks(a):
    stopped = bg_tasks.stop_user_tasks()
    events.tell_people({"apps_changed": True})
    return _json({"stopped": stopped})


def _t_reset(a):
    global _reset_mode
    mode = a.get("mode", "soft")
    if mode not in ("soft", "hard"):
        raise ValueError("mode must be soft or hard")
    _reset_mode = mode
    return _json({"mode": mode})


def _t_logs_read(a):
    max_bytes = a.get("max_bytes", LOGS_DEFAULT)
    cursor = mcplink.cursor()
    raw = mcplink.output_since(cursor - max_bytes)[0]
    return _json({"text": _decode(raw), "cursor": cursor})


def _repl_line(text):
    """One line for the current client's REPL. Returns (status, prompt)."""
    src = _repl_lines.get(_client, "") + text
    if mcplink.needs_more(src):
        _repl_lines[_client] = src + "\n"
        return "more", "... "
    _repl_lines.pop(_client, None)
    # No time cap here. A person at a terminal stops what they started.
    tb = _run(src, 0, False)[1]
    if tb:
        print(tb, end="")
    return "ok", ">>> "


def _t_repl_input(a):
    status, prompt = _repl_line(a["text"])
    return _json({"status": status, "prompt": prompt, "cursor": mcplink.cursor()})


def _t_repl_complete(a):
    suffix, printed = mcplink.complete(a["prefix"])
    return _json({"suffix": suffix, "candidates": printed.split()})


def _t_stream_open(a):
    if _client == HTTP_CLIENT:
        raise ValueError("Streams need a held WebSocket")
    return _json(streams.open_stream(a["kind"], a, _client))


def _t_stream_status(a):
    return _json(streams.status(a["stream"], _client))


def _t_stream_close(a):
    streams.close(a["stream"], _client)
    return _json({"closed": a["stream"]})


_S = {"type": "string"}
_B = {"type": "boolean"}
_I = {"type": "integer"}


def _tool(name, fn, desc, props=None, required=(), read_only=False, destructive=False, app_only=False):
    t = {
        "name": name,
        "description": desc,
        "inputSchema": {"type": "object", "properties": props or {}, "required": list(required)},
        "annotations": {"readOnlyHint": read_only, "destructiveHint": destructive},
    }
    if app_only:
        t["_meta"] = {"ui": {"visibility": ["app"]}}
    return t, fn


_TOOLS = [
    _tool(
        "exec",
        _t_exec,
        "Run MicroPython in __main__. Returns stdout and any traceback. Stopped after 4 s.",
        {"code": _S, "echo": {"type": "boolean"}, "timeout_ms": _I},
        ("code",),
        destructive=True,
    ),
    _tool("device_info", _t_device_info, "Versions, board, heap, and limits.", read_only=True),
    _tool("fs_list", _t_fs_list, "List a directory.", {"path": _S}, read_only=True),
    _tool("fs_stat", _t_fs_stat, "Type, size and mtime of a path.", {"path": _S}, ("path",), read_only=True),
    _tool(
        "fs_read_text",
        _t_fs_read_text,
        "Read a UTF-8 text file. Page through a long one with offset.",
        {"path": _S, "offset": _I, "length": _I},
        ("path",),
        read_only=True,
    ),
    _tool(
        "fs_write_text",
        _t_fs_write_text,
        "Write a UTF-8 text file, replacing it atomically unless append is set.",
        {"path": _S, "text": _S, "append": {"type": "boolean"}},
        ("path", "text"),
        destructive=True,
    ),
    _tool("fs_rm", _t_fs_rm, "Remove a file or an empty directory.", {"path": _S}, ("path",), destructive=True),
    _tool("fs_mkdir", _t_fs_mkdir, "Make a directory and any missing parents.", {"path": _S}, ("path",)),
    _tool(
        "fs_hash",
        _t_fs_hash,
        "sha256 of a file or byte range.",
        {"path": _S, "offset": _I, "length": _I},
        ("path",),
        read_only=True,
    ),
    _tool(
        "apps_list",
        _t_apps_list,
        "The apps installed on this board, and the tools each one adds.",
        read_only=True,
    ),
    _tool(
        "app_installed",
        _t_app_installed,
        "Record an app as installed, once its files are in place.",
        {"id": _S, "version": _S, "name": _S, "folder": _S},
        ("id", "version"),
    ),
    _tool(
        "app_create",
        _t_app_create,
        "Leave working code on this board as an app, so it survives resets and needs no one connected. code is a "
        "MicroPython module defining async def run(), which should loop and await often, since one interpreter runs "
        "everything. With run_at_boot it starts at every boot, even with no network. It starts now unless start is "
        "false, and replaces an app of the same id. tools maps a tool's file name to its source. Try the code with "
        "exec first. apps_list shows whether it's running, and its last error.",
        {"id": _S, "code": _S, "name": _S, "version": _S, "run_at_boot": _B, "start": _B, "tools": {"type": "object"}},
        ("id", "code"),
        destructive=True,
    ),
    _tool(
        "app_run_at_boot",
        _t_app_run_at_boot,
        "Say whether an app starts at every boot.",
        {"id": _S, "on": _B},
        ("id", "on"),
        destructive=True,
    ),
    _tool(
        "app_start",
        _t_app_start,
        "Start or restart an app's own work.",
        {"id": _S},
        ("id",),
        destructive=True,
    ),
    _tool(
        "app_stop",
        _t_app_stop,
        "Stop an app's own work, until it's started again or the next boot.",
        {"id": _S},
        ("id",),
        destructive=True,
    ),
    _tool(
        "app_remove",
        _t_app_remove,
        "Remove an app's code from this board. Its data stays. What it has running stops at the next reset.",
        {"id": _S},
        ("id",),
        destructive=True,
    ),
    _tool(
        "job_start",
        _t_job_start,
        "Start an app's tool and return at once with a job id, instead of waiting for it.",
        {"tool": _S, "arguments": {"type": "object"}},
        ("tool",),
    ),
    _tool(
        "job_status",
        _t_job_status,
        "A job's state, progress, output and result. With no job, every recent job.",
        {"job": _I},
        read_only=True,
    ),
    _tool("job_cancel", _t_job_cancel, "Stop a job at its next await.", {"job": _I}, ("job",)),
    _tool(
        "interrupt",
        _t_interrupt,
        "Break the exec running now, if any. Background tasks keep running.",
    ),
    _tool(
        "stop_user_tasks",
        _t_stop_user_tasks,
        "Stop all user background tasks. System tasks keep running.",
        destructive=True,
    ),
    _tool(
        "reset",
        _t_reset,
        "Restart the device: soft restarts Python, hard reboots the chip. Clients must reconnect after hard.",
        {"mode": {"type": "string", "enum": ["soft", "hard"]}},
        destructive=True,
    ),
    _tool(
        "logs_read",
        _t_logs_read,
        "Recent console output from the whole device.",
        {"max_bytes": _I},
        read_only=True,
    ),
    _tool("fs_read", _t_fs_read, "Read a byte range as base64.", {"path": _S, "offset": _I, "length": _I}, ("path",), read_only=True, app_only=True),
    _tool("fs_write", _t_fs_write, "Write base64 at an offset. Offset 0 truncates.", {"path": _S, "offset": _I, "data": _S}, ("path", "data"), destructive=True, app_only=True),
    _tool("repl_input", _t_repl_input, "One terminal line. Output goes to repl://output.", {"text": _S}, ("text",), destructive=True, app_only=True),
    _tool("repl_complete", _t_repl_complete, "Tab completions.", {"prefix": _S}, ("prefix",), read_only=True, app_only=True),
    _tool(
        "stream_open",
        _t_stream_open,
        "Open a binary stream on this socket: terminal, file_read, file_write or app.",
        {
            "kind": {"type": "string", "enum": list(streams.KINDS)},
            "path": _S,
            "offset": _I,
            "length": _I,
            "chunk": _I,
            "window": _I,
            "name": _S,
            "ring_size": _I,
        },
        ("kind",),
        destructive=True,
        app_only=True,
    ),
    _tool("stream_status", _t_stream_status, "Progress and loss on an open stream.", {"stream": _I}, ("stream",), read_only=True, app_only=True),
    _tool("stream_close", _t_stream_close, "Stop a stream. A partial upload is discarded.", {"stream": _I}, ("stream",), app_only=True),
]
_TOOL_FNS = {t[0]["name"]: t[1] for t in _TOOLS}
_TOOL_DEFS = [t[0] for t in _TOOLS]
# The reply to this tools/call goes out when its job finishes
_DEFERRED = object()
_ACTIVITY_TEXT_MAX = 4096
_ACTIVITY_ARG_MAX = 120
# Polling and chunks would bury what a person wants to see
_UNREPORTED = ("job_status", "stream_status", "fs_read", "fs_write", "fs_hash")
_CONTENT_ARGS = ("code", "text", "data", "tools")
_activity_seq = 0
_streams_cleared = False


# --- protocol ------------------------------------------------------------


def _note_client(p):
    """Remember what it calls itself, for what people see. HTTP has no one client to remember."""
    info = p.get("clientInfo") or (p.get("_meta") or {}).get(CLIENT_INFO_KEY)
    if info and info.get("name") and _client != HTTP_CLIENT:
        events.set_name(_client, info["name"])


def _m_discover(p):
    _note_client(p)
    return {
        "supportedVersions": list(SUPPORTED),
        "capabilities": CAPABILITIES,
        "instructions": INSTRUCTIONS,
        "ttlMs": 0,
        "cacheScope": "private",
        "_meta": {"io.modelcontextprotocol/serverInfo": SERVER_INFO},
    }


def _m_initialize(p):
    _note_client(p)
    v = p.get("protocolVersion")
    return {
        "protocolVersion": v if v in LEGACY else LEGACY[0],
        "capabilities": LEGACY_CAPABILITIES,
        "serverInfo": SERVER_INFO,
        "instructions": INSTRUCTIONS,
    }


def _m_tools_list(p):
    return {"tools": _TOOL_DEFS + apps.tool_defs(), "ttlMs": 0, "cacheScope": "private"}


def _brief(args):
    """An agent's arguments for a person to read, without what could be long."""
    rows = {}
    for key, value in args.items():
        if key not in _CONTENT_ARGS:
            rows[key] = value if value is None or isinstance(value, (bool, int, float)) else str(value)[:_ACTIVITY_ARG_MAX]
    return rows


def _activity_row(tool, args):
    """Who is calling what, if a person should see it. None if not."""
    global _activity_seq
    if tool in _UNREPORTED or wsserver.client_role(_client) == mcplink.ROLE_HUMAN or not events.people():
        return None
    _activity_seq += 1
    return {"id": _activity_seq, "who": events.name_of(_client), "tool": tool, "args": _brief(args)}


def _activity_running(row):
    row["state"] = "running"
    events.tell_people({"agent_activity": row})


def _activity_ended(row, started, failed, text=None):
    row["state"] = "failed" if failed else "done"
    row["ms"] = time.ticks_diff(time.ticks_ms(), started)
    row.pop("code", None)
    if text is not None:
        row["output"] = text[:_ACTIVITY_TEXT_MAX]
    events.tell_people({"agent_activity": row})


def _job_finished(job):
    row = job.activity
    if row:
        _activity_ended(row, job.started, job.state != "done", job.error)


def _call_app_tool(name, p):
    if name not in apps.tools():
        raise _RpcError(-32602, "Unknown tool: %s" % name)
    given = p.get("arguments") or {}
    try:
        if _client == HTTP_CLIENT:
            # Nothing can hold an HTTP reply open
            job = jobs.start(name, given)
            result = _json(job.status())
        else:
            job = jobs.start(name, given, _client, json.loads(_request_id), (p.get("_meta") or {}).get("progressToken"))
            result = _DEFERRED
    except ValueError as e:
        return _text(str(e), True)
    job.activity = _activity_row(name, given)
    if job.activity:
        _activity_running(job.activity)
    return result


def _m_tools_call(p):
    name = p.get("name")
    fn = _TOOL_FNS.get(name)
    if fn is None:
        return _call_app_tool(name, p)
    if name != "fs_write":
        _close_write_cache()
    args = p.get("arguments") or {}
    row = _activity_row(name, args)
    started = time.ticks_ms()
    if row and name == "exec":
        # Ahead of the call, since it holds up the board until it returns
        row["code"] = args.get("code", "")[:_ACTIVITY_TEXT_MAX]
        _activity_running(row)
    try:
        result = fn(args)
    except Exception as e:
        result = _text(_traceback(e), True)
    if row:
        failed = result.get("isError")
        _activity_ended(row, started, failed, result["content"][0]["text"] if failed or name == "exec" else None)
    return result


def _m_resources_list(p):
    return {
        "resources": [{"uri": "repl://output", "name": "repl-output", "mimeType": "text/plain"}],
        "ttlMs": 0,
        "cacheScope": "private",
    }


def _m_templates_list(p):
    return {
        "resourceTemplates": [{"uriTemplate": "repl://output{?after}", "name": "repl-output", "mimeType": "text/plain"}],
        "ttlMs": 0,
        "cacheScope": "private",
    }


def _m_resources_read(p):
    uri = p.get("uri", "")
    if not uri.startswith("repl://output"):
        raise _RpcError(-32602, "Resource not found: %s" % uri)
    after = int(uri.split("after=")[1]) if "after=" in uri else mcplink.cursor()
    raw, cursor, dropped = mcplink.output_since(after)
    return {
        "contents": [
            {
                "uri": uri,
                "mimeType": "text/plain",
                "text": _decode(raw),
                "_meta": {"com.scriptostudio/cursor": cursor, "com.scriptostudio/dropped": dropped},
            }
        ],
        "ttlMs": 0,
        "cacheScope": "private",
    }


def _m_set_level(p):
    level = p.get("level")
    if not events.set_level(_client, level):
        raise _RpcError(-32602, "Unknown level: %s" % level)
    return {}


_METHODS = {
    "server/discover": _m_discover,
    "initialize": _m_initialize,
    "ping": lambda p: {},
    "tools/list": _m_tools_list,
    "tools/call": _m_tools_call,
    "resources/list": _m_resources_list,
    "resources/templates/list": _m_templates_list,
    "resources/read": _m_resources_read,
    "logging/setLevel": _m_set_level,
}


def _err(mid, code, message, data=None):
    e = {"code": code, "message": message}
    if data is not None:
        e["data"] = data
    return json.dumps({"jsonrpc": "2.0", "id": mid, "error": e})


def _call(mid, method, params):
    version = (params.get("_meta") or {}).get(PROTOCOL_VERSION_KEY)
    if version and version not in SUPPORTED:
        return _err(mid, -32022, "Unsupported protocol version", {"supported": list(SUPPORTED), "requested": version})
    fn = _METHODS.get(method)
    if fn is None:
        return _err(mid, -32601, "Method not found: %s" % method)
    try:
        result = fn(params)
        if result is _DEFERRED:
            return ""
        if "resultType" not in result:
            result["resultType"] = "complete"
        return json.dumps({"jsonrpc": "2.0", "id": mid, "result": result})
    except _RpcError as e:
        return _err(mid, e.code, e.message, e.data)
    except Exception as e:
        return _err(mid, -32603, "Internal error", _traceback(e))


def _dispatch(msg, client):
    """One decoded JSON-RPC message in, a response string out ("" for a notification)."""
    global _client, _request_id
    if not isinstance(msg, dict):
        return _err(None, -32600, "Invalid request")
    mid = msg.get("id")
    # For an exec, the C frame filter has already acted on notifications/cancelled.
    # A job is a task, so it's stopped from here.
    if mid is None:
        if msg.get("method") == "notifications/cancelled":
            jobs.cancel_request(client, (msg.get("params") or {}).get("requestId"))
        return ""
    saved = (_client, _request_id)
    _client = client
    _request_id = json.dumps(mid)
    try:
        return _call(mid, msg.get("method"), msg.get("params") or {})
    finally:
        _client, _request_id = saved
        # Handling a message proves the pump is moving, however long the queue
        bg_tasks.feed("queue_pump")


# --- carriers ------------------------------------------------------------


def _http(uri, body, ip):
    try:
        msg = json.loads(body)
    except ValueError:
        return 400, _err(None, -32700, "Parse error")
    resp = _dispatch(msg, HTTP_CLIENT)
    return (200, resp) if resp else (202, "")


def _terminal_text(stream, client, text, whole):
    """What a stream terminal sent while nothing was running: lines for the REPL, or
    with whole set, a script to run as one. Output is on its way through the drain
    task, so flush it to keep the prompt behind it."""
    global _client, _request_id
    saved = (_client, _request_id)
    _client = client
    _request_id = None
    error = None
    try:
        if whole:
            status, prompt = "ok", ">>> "
            tb = _run(text, 0, False)[1]
            if tb:
                print(tb, end="")
                error = tb.strip().split("\n")[-1]
        else:
            # A trailing newline ends the text, it isn't a blank line for the REPL
            for line in (text[:-1] if text.endswith("\n") else text).split("\n"):
                status, prompt = _repl_line(line)
    finally:
        _client, _request_id = saved
    mcplink.stream_flush(stream)
    if error:
        streams.notify(client, stream, "prompt", status=status, prompt=prompt, error=error)
    else:
        streams.notify(client, stream, "prompt", status=status, prompt=prompt)


def _ws_message(client, event, payload=None):
    if not isinstance(payload, str):
        streams.on_frame(client, payload)
        bg_tasks.feed("queue_pump")
        return
    try:
        msg = json.loads(payload)
    except ValueError:
        wsserver.send(client, _err(None, -32700, "Parse error"))
        return
    resp = _dispatch(msg, client)
    if resp:
        wsserver.send(client, resp)


def handle_text(payload, send):
    """For carriers that aren't a wsserver client, such as a WebRTC DataChannel."""
    resp = _dispatch(json.loads(payload), HTTP_CLIENT)
    if resp:
        send(resp)


def _ws_connect(client, event, payload=None):
    if _on_clients:
        _on_clients(wsserver.count_clients())


def _ws_disconnect(client, event, payload=None):
    _repl_lines.pop(client, None)
    events.forget(client)
    streams.on_disconnect(client)
    jobs.on_disconnect(client)
    if _on_clients:
        _on_clients(wsserver.count_clients())


def _advertise():
    """mDNS starts when the network does, so keep trying until then."""
    global _advertised, _advertise_next
    now = time.ticks_ms()
    if time.ticks_diff(now, _advertise_next) < 0:
        return
    _advertise_next = time.ticks_add(now, _ADVERTISE_EVERY_MS)
    from lib.sys import board

    _advertised = mcplink.advertise(HTTPS_PORT, {"path": PATH, "tls": "1", "board": board.id.name})


def started():
    return _started


def clear_old_streams():
    """A real soft reset forgets Python's streams, while C's survive. This goes before anything
    can open one, and an app at boot does that long before the servers start."""
    global _streams_cleared
    if not _streams_cleared:
        _streams_cleared = True
        mcplink.streams_reset()


def after_pump():
    """Called by queue_pump between batches, so a reset's response has gone out first."""
    global _reset_mode, _tx_armed
    if not _advertised:
        _advertise()
    armed_ms = mcplink.tx_armed_ms()
    if (armed_ms > 0) != _tx_armed:
        _tx_armed = armed_ms > 0
        events.notify({"tx_armed_ms": armed_ms})
    mode = _reset_mode
    if mode is None:
        return
    _reset_mode = None
    time.sleep_ms(_RESET_FLUSH_MS)
    if mode == "hard":
        import machine

        # A reboot sends no FIN, and a client that isn't sending would never notice
        for client in wsserver.clients():
            wsserver.close(client)
        time.sleep_ms(_RESET_FLUSH_MS)
        machine.reset()
    # app.main() catches this and restarts the event loop
    raise SystemExit


def _notify_tools_changed():
    text = json.dumps({"jsonrpc": "2.0", "method": "notifications/tools/list_changed"})
    for client in wsserver.clients():
        wsserver.send(client, text)


def start(origins=(), on_clients=None):
    """Serve MCP on PATH over WebSocket and HTTP. httpserver must be running."""
    global _on_clients, _started
    _on_clients = on_clients
    mcplink.set_origins(origins)
    mcplink.start(PATH)
    streams.init(_terminal_text)
    apps.on_change = _notify_tools_changed
    apps.on_state = lambda: events.tell_people({"apps_changed": True})
    jobs.on_finish = _job_finished
    mcplink.tx_gate(settings.get("can.agent_tx_needs_arm", False))
    if _started:
        return
    wsserver.on(wsserver.MESSAGE, _ws_message)
    wsserver.on(wsserver.CONNECT, _ws_connect)
    wsserver.on(wsserver.DISCONNECT, _ws_disconnect)
    mcplink.protect(httpserver.on(PATH, _http, "POST"))
    _started = True
