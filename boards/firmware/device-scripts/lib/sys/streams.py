"""
Binary streams (lib/sys/streams.py)
===================================

MCP's tools open and close streams. The data itself goes in binary WebSocket
frames on the same socket, so it isn't base64 and doesn't queue behind tool calls.
Clients that never call stream_open never see a binary frame. Plain HTTP has no
socket to hold, so it has no streams.

    frame := type:u8 stream:u8 count:u16 seq:u32 payload     (little-endian)

    type    data, credit, end, or control (see mcplink)
    seq     data: bytes since the stream began, up to the first payload byte. A jump
            means a lossy stream dropped that many
            credit: the offset the host may send up to, exclusive
            end: total bytes
    count   end: 0, or 1 for failure. The reason arrives first as a notification
            terminal data to the device: 1 to run the text as one script, not as lines

Kinds:

    terminal    Device to host: everything printed, except private exec output, from
                the C drain task, so it flows while the VM is blocked. Lossy.
                Host to device: a line for the REPL. If a call is running, the C
                frame filter gives it to input() instead, so end it with \\r.
    file_read   Device to host: a file, then end. Reliable. Python reads ahead into a
                ring and the C drain task sends, so flash and socket run side by side
                and a slow client can't block the interpreter.
    file_write  Host to device: a file, within credits so it can't outrun flash, then
                end. Replaces the target atomically, and the device confirms with end.
    app         Bytes a device app writes with app_write(name, data), and bytes it
                receives with on_app_data(name, fn). Lossy toward the host.
    can         Device to host: every frame the CAN bus receives, sent from C. Lossy, but
                only ever in whole records, so a jump in seq is a number of frames.
                ack: also acknowledge frames, for a person's session on a bus with no
                other receiver. A record is 20 bytes, little-endian:
                    time_us:u32 id:u32 flags:u8 dlc:u8 reserved:u16 data:8
                flags: bit 0 extended, bit 1 RTR

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import asyncio
import json
import os
import struct

import mcplink
import wsserver

from lib.sys import can_tap, events

HEADER = "<BBHI"
HEADER_SIZE = mcplink.FRAME_HEADER_SIZE
KINDS = {
    "terminal": mcplink.KIND_TERMINAL,
    "file_read": mcplink.KIND_FILE_READ,
    "file_write": mcplink.KIND_FILE_WRITE,
    "app": mcplink.KIND_APP,
    "can": mcplink.KIND_CAN,
}
_KIND_NAMES = {v: k for k, v in KINDS.items()}
DEFAULT_CHUNK = 16384
MAX_CHUNK = 65536
WRITE_WINDOW_CHUNKS = 4
READ_WAIT_MS = 5
NOTIFICATION = "notifications/com.scriptostudio/stream"
TMP_SUFFIX = ".mcp-tmp"

_streams = {}
_app_handlers = {}
_on_terminal_text = None


class _Stream:
    def __init__(self, sid, kind, client):
        self.id = sid
        self.kind = kind
        self.client = client
        self.file = None
        self.path = None
        self.name = None
        self.chunk = DEFAULT_CHUNK
        self.done = 0
        self.limit = 0
        self.window = 0
        self.closing = False
        self.tap = None


def init(on_terminal_text):
    """on_terminal_text(stream_id, client, text, whole) runs what a terminal sent."""
    global _on_terminal_text
    _on_terminal_text = on_terminal_text


def notify(client, sid, state, **fields):
    params = {"stream": sid, "state": state}
    params.update(fields)
    wsserver.send(client, json.dumps({"jsonrpc": "2.0", "method": NOTIFICATION, "params": params}))


def _send_frame(s, frame_type, seq, count=0):
    wsserver.send(s.client, struct.pack(HEADER, frame_type, s.id, count, seq), True)


def _forget(s):
    _streams.pop(s.id, None)
    if s.tap is not None:
        can_tap.close(s.tap)
        s.tap = None
    mcplink.stream_close(s.id)


def _fail(s, message):
    notify(s.client, s.id, "error", message=message)
    _send_frame(s, mcplink.FRAME_END, s.done, 1)
    _abort(s)


def _abort(s):
    """Drop a stream without completing it. A partial upload never replaces its target."""
    s.closing = True
    if s.file:
        s.file.close()
        s.file = None
        if s.kind == mcplink.KIND_FILE_WRITE:
            try:
                os.remove(s.path + TMP_SUFFIX)
            except OSError:
                pass
    _forget(s)


# --- opening -------------------------------------------------------------


def open_stream(kind, args, client):
    """Returns what the client needs to use the stream. Raises ValueError or OSError."""
    code = KINDS.get(kind)
    if code is None:
        raise ValueError("Unknown stream kind: %s" % kind)
    chunk = min(args.get("chunk", DEFAULT_CHUNK), MAX_CHUNK)

    # Open any file before taking a stream id, so a bad path leaves nothing to undo
    f = None
    size = 0
    if code == mcplink.KIND_FILE_READ:
        path = args["path"]
        size = os.stat(path)[6]
        f = open(path, "rb")
    elif code == mcplink.KIND_FILE_WRITE:
        path = args["path"]
        f = open(path + TMP_SUFFIX, "wb")
    elif code == mcplink.KIND_APP and "name" not in args:
        raise ValueError("An app stream needs a name")

    try:
        sid = mcplink.stream_open(client, code, args.get("ring_size", 0))
    except OSError:
        if f:
            f.close()
        raise
    s = _Stream(sid, code, client)
    s.file = f
    s.chunk = chunk
    s.name = args.get("name")
    if code == mcplink.KIND_CAN:
        try:
            s.tap = can_tap.open(sid, args.get("ack") and wsserver.client_role(client) == mcplink.ROLE_HUMAN, args.get("bitrate"))
        except Exception:
            mcplink.stream_close(sid)
            raise
    _streams[sid] = s
    result = {"stream": sid, "kind": kind, "max_frame": wsserver.MAX_MESSAGE, "chunk": chunk}

    if code == mcplink.KIND_FILE_READ:
        offset = args.get("offset", 0)
        length = args.get("length", max(0, size - offset))
        s.path = args["path"]
        f.seek(offset)
        result["size"] = size
        result["length"] = length
        asyncio.create_task(_read_task(s, length))
    elif code == mcplink.KIND_FILE_WRITE:
        s.path = args["path"]
        s.window = chunk * args.get("window", WRITE_WINDOW_CHUNKS)
        s.limit = s.window
        result["credit"] = s.limit
    elif code == mcplink.KIND_TERMINAL:
        result["cursor"] = mcplink.stream_status(sid)[3]
    return result


async def _read_task(s, left):
    buf = bytearray(s.chunk)
    mv = memoryview(buf)
    try:
        while not s.closing and left > 0:
            room = mcplink.stream_room(s.id)
            if room < 0:
                s.closing = True
                break
            if room < s.chunk:
                await asyncio.sleep_ms(READ_WAIT_MS)
                continue
            n = s.file.readinto(mv[: min(s.chunk, left)])
            if not n:
                break
            mcplink.stream_write(s.id, mv[:n])
            s.done += n
            left -= n
            # Let the pump run between chunks, so tools still answer during a transfer
            await asyncio.sleep_ms(0)
        if not s.closing:
            # Everything queued goes out first, so end can't overtake it
            mcplink.stream_flush(s.id)
            _send_frame(s, mcplink.FRAME_END, s.done)
    except Exception as e:
        if s.id in _streams:
            _fail(s, str(e))
        return
    if s.id in _streams:
        _abort(s)


# --- host to device ------------------------------------------------------


def _write_data(s, seq, payload):
    if seq != s.done:
        _fail(s, "Expected offset %d, got %d" % (s.done, seq))
        return
    if s.done + len(payload) > s.limit:
        _fail(s, "Sent past the credit limit %d" % s.limit)
        return
    s.file.write(payload)
    s.done += len(payload)
    s.limit = s.done + s.window
    _send_frame(s, mcplink.FRAME_CREDIT, s.limit)


def _write_end(s, seq):
    if seq != s.done:
        _fail(s, "End at offset %d, received %d" % (seq, s.done))
        return
    s.file.close()
    s.file = None
    os.rename(s.path + TMP_SUFFIX, s.path)
    _send_frame(s, mcplink.FRAME_END, s.done)
    events.file_changed(s.client, s.path)
    _forget(s)


def on_frame(client, frame):
    """A binary frame from a client, in the pump. Terminal input during a call never gets here."""
    if len(frame) < HEADER_SIZE:
        return
    frame_type, sid, count, seq = struct.unpack_from(HEADER, frame)
    s = _streams.get(sid)
    # A late frame for a stream that has ended isn't an error
    if s is None or s.client != client:
        return
    payload = memoryview(frame)[HEADER_SIZE:]
    try:
        if s.kind == mcplink.KIND_FILE_WRITE:
            if frame_type == mcplink.FRAME_DATA:
                _write_data(s, seq, payload)
            elif frame_type == mcplink.FRAME_END:
                _write_end(s, seq)
        elif frame_type != mcplink.FRAME_DATA:
            return
        elif s.kind == mcplink.KIND_TERMINAL:
            _on_terminal_text(s.id, client, bytes(payload).decode(), count == 1)
        elif s.kind == mcplink.KIND_APP:
            fn = _app_handlers.get(s.name)
            if fn:
                fn(bytes(payload))
    except Exception as e:
        if s.id in _streams:
            _fail(s, str(e))


# --- status and closing --------------------------------------------------


def _owned(sid, client):
    s = _streams.get(sid)
    if s is None or s.client != client:
        raise ValueError("No such stream: %s" % sid)
    return s


def status(sid, client):
    s = _owned(sid, client)
    st = mcplink.stream_status(sid)
    row = {
        "stream": sid,
        "kind": _KIND_NAMES[s.kind],
        "done": s.done,
        "sent": st[3],
        "pending": st[4] - st[3],
        "dropped": st[5],
    }
    if s.kind == mcplink.KIND_CAN:
        row["bus"] = can_tap.stats()
    return row


def close(sid, client):
    # A stream can end by itself just as a client closes it, so that's no error
    s = _streams.get(sid)
    if s is None:
        return
    if s.client != client:
        raise ValueError("No such stream: %s" % sid)
    _abort(s)


def on_disconnect(client):
    for s in list(_streams.values()):
        if s.client == client:
            _abort(s)


# --- device apps ---------------------------------------------------------


def app_write(name, data):
    """Send data to everyone streaming this name. Cheap when no one is, and never blocks."""
    for s in _streams.values():
        if s.kind == mcplink.KIND_APP and s.name == name:
            mcplink.stream_write(s.id, data)


def on_app_data(name, fn):
    """fn(bytes) gets what clients send on this name, in the pump."""
    _app_handlers[name] = fn
