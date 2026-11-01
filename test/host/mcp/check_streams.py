#!/usr/bin/env python3
"""Checks of binary streams against a running device.

    check_streams.py --host 192.168.1.50 --password X

Each check prints PASS or FAIL, and all of them run whatever the others do. Results are
saved as JSON. What it does to the board: writes and removes /st_big.bin (1 MB of random
data, several times), starts and stops a background task called st_check, and runs some
lines that block the interpreter for a few seconds.

Against the simulator (test/host/mcp/sim/run_sim.py), add --scheme-http --no-interrupt --fs-root DIR.
"""

import argparse
import hashlib
import json
import os
import statistics
import time

from mcp_client import FRAME_CREDIT, FRAME_DATA, FRAME_END, Http, ToolError, Ws, token

MB = 1024 * 1024
READ_TARGET_KBS = 118.5
WRITE_TARGET_KBS = 34.8
START_TASK = """
import asyncio
from lib.sys import bg_tasks
_st_ticks = 0
async def _st_task():
    global _st_ticks
    while True:
        _st_ticks += 1
        await asyncio.sleep_ms(20)
bg_tasks.start('st_check', _st_task)
"""
STOP_TASK = "from lib.sys import bg_tasks\nbg_tasks.stop('st_check')\n"


class Check:
    def __init__(self, only=None):
        self.only = only
        self.results = {}
        self.failed = 0

    def run(self, name, fn):
        if self.only and self.only not in name:
            return
        print(f"--- {name}", flush=True)
        try:
            detail = fn() or {}
            self.results[name] = {"ok": True, **detail}
            print(f"PASS {name} {json.dumps(detail)}", flush=True)
        except Exception as e:
            self.failed += 1
            self.results[name] = {"ok": False, "error": repr(e)}
            print(f"FAIL {name}: {e!r}", flush=True)


def expect(cond, why):
    if not cond:
        raise AssertionError(why)


def kbs(n, seconds):
    return round(n / 1024 / seconds, 1)


class Terminal:
    def __init__(self, c):
        self.c = c
        self.sid = c.stream_open("terminal")["stream"]

    def line(self, text):
        self.c.send_frame(FRAME_DATA, self.sid, 0, text.encode())

    def collect(self, timeout=8):
        """Output up to the next prompt: (text, prompt, [arrival seconds per frame])."""
        c = self.c
        out = []
        times = []
        t0 = time.perf_counter()
        deadline = time.time() + timeout
        while time.time() < deadline:
            while c.notes:
                p = c.notes.popleft().get("params", {})
                if p.get("stream") == self.sid and p.get("state") == "prompt":
                    return "".join(out), p["prompt"], times
            f = c.next_frame(0.1)
            if f and f[1] == self.sid and f[0] == FRAME_DATA:
                out.append(f[4].decode(errors="replace"))
                times.append(time.perf_counter() - t0)
        raise TimeoutError(f"no prompt, got {''.join(out)!r}")

    def read_until(self, want, timeout=8):
        got = ""
        deadline = time.time() + timeout
        while time.time() < deadline:
            f = self.c.next_frame(0.1)
            if f and f[1] == self.sid and f[0] == FRAME_DATA:
                got += f[4].decode(errors="replace")
                if want in got:
                    return got
        raise TimeoutError(f"no {want!r}, got {got!r}")

    def close(self):
        self.c.tool_json("stream_close", stream=self.sid)


def check_terminal(ck, url, tok, interrupts):
    def basic():
        with Ws(url, tok) as c:
            t = Terminal(c)
            t.line("print(6*7)")
            out, prompt, _ = t.collect()
            expect("42" in out and prompt == ">>> ", (out, prompt))
            t.line("6*7")
            expect("42" in t.collect()[0], "single mode should echo")
            t.line("for i in range(2):")
            expect(t.collect()[1] == "... ", "wanted a continuation")
            t.line("    print('row', i)")
            expect(t.collect()[1] == "... ", "wanted a continuation")
            t.line("")
            out, prompt, _ = t.collect()
            expect("row 0" in out and "row 1" in out and prompt == ">>> ", (out, prompt))
            t.line("1/0")
            out, prompt, _ = t.collect()
            expect("ZeroDivisionError" in out and prompt == ">>> ", (out, prompt))
            t.close()

    def exec_output_stays_private():
        with Ws(url, tok) as c:
            t = Terminal(c)
            with Ws(url, tok) as agent:
                expect("secret" in agent.tool("exec", code="print('secret')"), "exec lost its output")
            r = c.tool("exec", code="print('also secret')")
            expect("also secret" in r, r)
            t.line("print('shown')")
            out = t.collect()[0]
            expect("shown" in out and "secret" not in out, out)
            t.close()

    def no_stream_no_binary():
        with Ws(url, tok) as c:
            c.tool("exec", code="print('x')")
            c.call("tools/list")
            time.sleep(0.5)
            c.call("ping")
            expect(not c.frames, c.frames)

    def http_has_no_streams():
        try:
            Http(url.replace("wss://", "https://").replace("ws://", "http://"), tok).tool("stream_open", kind="terminal")
        except ToolError as e:
            expect("held WebSocket" in str(e), e)
            return
        raise AssertionError("opened a stream over HTTP")

    ck.run("terminal: lines, continuation, traceback", basic)
    ck.run("terminal: exec output stays private", exec_output_stays_private)
    ck.run("no stream opened, no binary frames", no_stream_no_binary)
    ck.run("http has no streams", http_has_no_streams)
    if not interrupts:
        return

    def live_output():
        with Ws(url, tok) as c:
            t = Terminal(c)
            t.line("import time\nfor i in range(4):\n    print('tick', i)\n    time.sleep_ms(400)\n\n")
            out, _, times = t.collect(12)
            expect(out.count("tick") == 4, out)
            spread = times[-1] - times[0]
            expect(spread > 0.8, f"output arrived all at once, over {spread:.2f} s: {times}")
            t.close()
            return {"spread_s": round(spread, 2), "frames": len(times)}

    def input_works():
        with Ws(url, tok) as c:
            t = Terminal(c)
            t.line("x = input('name? ')\nprint('hi ' + x)\n")
            t.read_until("name? ")
            t0 = time.perf_counter()
            c.send_frame(FRAME_DATA, t.sid, 0, b"bob\r")
            out, prompt, _ = t.collect()
            ms = (time.perf_counter() - t0) * 1000
            expect("hi bob" in out and prompt == ">>> ", (out, prompt))
            t.close()
            return {"ms": round(ms)}

    def interrupt_works():
        with Ws(url, tok) as c:
            c.tool("exec", code=START_TASK)
            t = Terminal(c)
            t.line("import time\nwhile True:\n    time.sleep_ms(10)\n\n")
            time.sleep(0.5)
            t0 = time.perf_counter()
            c.send_interrupt_frame()
            out, prompt, _ = t.collect()
            ms = (time.perf_counter() - t0) * 1000
            expect("KeyboardInterrupt" in out and prompt == ">>> ", (out, prompt))
            before = int(c.tool("exec", code="print(_st_ticks)").split()[-1])
            time.sleep(0.3)
            after = int(c.tool("exec", code="print(_st_ticks)").split()[-1])
            expect(after > before, "background task stopped")
            c.tool("exec", code=STOP_TASK)
            t.close()
            return {"ms": round(ms)}

    def interrupted_input():
        with Ws(url, tok) as c:
            t = Terminal(c)
            t.line("input('waiting ')")
            t.read_until("waiting ")
            c.send_interrupt_frame()
            out, prompt, _ = t.collect()
            expect("KeyboardInterrupt" in out and prompt == ">>> ", (out, prompt))
            t.close()

    ck.run("terminal: output arrives while the call runs", live_output)
    ck.run("terminal: input() over the stream", input_works)
    ck.run("terminal: interrupt, background task survives", interrupt_works)
    ck.run("terminal: interrupt a blocked input()", interrupted_input)


def check_files(ck, url, tok, root, full):
    path = f"{root}/st_big.bin"
    blob = os.urandom(MB if full else 128 * 1024)
    want = hashlib.sha256(blob).hexdigest()

    def upload(chunk, window, target=None):
        def run():
            with Ws(url, tok, timeout=120) as c:
                s = c.write_file(path, blob, chunk=chunk, window=window)
                h = c.tool_json("fs_hash", path=path)
            expect(h["sha256"] == want and h["n"] == len(blob), h)
            rate = kbs(len(blob), s)
            if target:
                expect(rate >= target, f"{rate} kB/s")
            return {"kB_s": rate, "seconds": round(s, 2)}

        return run

    def download(chunk, target=None):
        def run():
            with Ws(url, tok, timeout=120) as c:
                data, s = c.read_file(path, chunk=chunk)
            expect(hashlib.sha256(data).hexdigest() == want, "bytes differ")
            rate = kbs(len(data), s)
            if target:
                expect(rate >= target, f"{rate} kB/s")
            return {"kB_s": rate, "seconds": round(s, 2)}

        return run

    ck.run("file_write: 16 KB chunks, window 4", upload(16384, 4, WRITE_TARGET_KBS if full else None))
    ck.run("file_write: 4 KB chunks, window 4", upload(4096, 4))
    ck.run("file_write: 16 KB chunks, window 1", upload(16384, 1))
    ck.run("file_read: 16 KB chunks", download(16384, READ_TARGET_KBS if full else None))
    ck.run("file_read: 4 KB chunks", download(4096))
    ck.run("file_read: 32 KB chunks", download(32768))

    def read_range():
        with Ws(url, tok, timeout=60) as c:
            data, _ = c.read_file(path, offset=1000, length=5000)
        expect(data == blob[1000:6000], f"{len(data)} bytes")

    def tools_answer_during_read():
        with Ws(url, tok, timeout=120) as c:
            info = c.stream_open("file_read", path=path)
            times = []
            done = False
            for _ in range(8):
                t0 = time.perf_counter()
                c.tool("exec", code="pass")
                times.append((time.perf_counter() - t0) * 1000)
            while not done:
                f = c.next_frame()
                expect(f is not None, "read stalled")
                done = f[1] == info["stream"] and f[0] == FRAME_END
        return {"p50_ms": round(statistics.median(times), 1), "worst_ms": round(max(times), 1)}

    def missing_file():
        with Ws(url, tok) as c:
            try:
                c.stream_open("file_read", path=f"{root}/st_nothing_here")
            except ToolError:
                return
        raise AssertionError("opened a missing file")

    def closing_a_read_stops_it():
        with Ws(url, tok, timeout=30) as c:
            sid = c.stream_open("file_read", path=path)["stream"]
            c.next_frame()
            c.tool_json("stream_close", stream=sid)
            c.call("ping")
            c.frames.clear()
            time.sleep(0.5)
            c.call("ping")
            late = [f for f in c.frames if f[1] == sid]
            expect(not late, f"{len(late)} frames after close")
            # Closing again, or closing one that already ended, isn't an error
            c.tool_json("stream_close", stream=sid)

    def closing_an_upload_keeps_the_old_file():
        with Ws(url, tok, timeout=30) as c:
            info = c.stream_open("file_write", path=path)
            c.send_frame(FRAME_DATA, info["stream"], 0, b"partial")
            c.next_frame()
            c.tool_json("stream_close", stream=info["stream"])
            h = c.tool_json("fs_hash", path=path)
            expect(h["sha256"] == want, "a partial upload replaced the file")
            names = [e["name"] for e in c.tool_json("fs_list", path=root or "/")]
            expect("st_big.bin.mcp-tmp" not in names, names)

    def sending_past_credit_fails():
        with Ws(url, tok, timeout=30) as c:
            info = c.stream_open("file_write", path=f"{root}/st_small.bin", chunk=1024, window=1)
            c.send_frame(FRAME_DATA, info["stream"], 0, b"x" * 2048)
            while True:
                f = c.next_frame(8)
                expect(f is not None, "no refusal")
                if f[0] == FRAME_END:
                    expect(f[2] == 1, "end should report failure")
                    break
            note = c.next_note(2)
            expect(note and note["params"]["state"] == "error", note)

    def out_of_order_fails():
        with Ws(url, tok, timeout=30) as c:
            info = c.stream_open("file_write", path=f"{root}/st_small.bin")
            c.send_frame(FRAME_DATA, info["stream"], 5, b"x")
            while True:
                f = c.next_frame(8)
                expect(f is not None, "no refusal")
                if f[0] == FRAME_END:
                    expect(f[2] == 1, "end should report failure")
                    return

    def disconnect_mid_transfer():
        c = Ws(url, tok, timeout=30)
        c.stream_open("file_read", path=path)
        c.next_frame()
        c.ws.close()
        time.sleep(1)
        c = Ws(url, tok, timeout=30)
        info = c.stream_open("file_write", path=f"{root}/st_small.bin")
        c.send_frame(FRAME_DATA, info["stream"], 0, b"partial")
        c.next_frame()
        c.ws.close()
        time.sleep(1)
        with Ws(url, tok, timeout=30) as c:
            names = [e["name"] for e in c.tool_json("fs_list", path=root or "/")]
            expect("st_small.bin.mcp-tmp" not in names, names)
            data, _ = c.read_file(path, length=1024)
            expect(data == blob[:1024], "read after disconnect")

    def streams_run_together():
        with Ws(url, tok, timeout=120) as c:
            t = Terminal(c)
            info = c.stream_open("file_read", path=path)
            t.line("print('together')")
            parts = []
            saw_prompt = False
            end = False
            text = ""
            deadline = time.time() + 60
            while not (saw_prompt and end):
                expect(time.time() < deadline, "stalled")
                f = c.next_frame(0.2)
                if f is None:
                    pass
                elif f[1] == info["stream"]:
                    if f[0] == FRAME_DATA:
                        parts.append(f[4])
                    elif f[0] == FRAME_END:
                        end = True
                elif f[1] == t.sid:
                    text += f[4].decode(errors="replace")
                while c.notes:
                    saw_prompt |= c.notes.popleft()["params"].get("state") == "prompt"
            expect("together" in text, text)
            expect(hashlib.sha256(b"".join(parts)).hexdigest() == want, "file bytes differ")
            t.close()

    def clean_up():
        with Ws(url, tok) as c:
            for f in (path, f"{root}/st_small.bin"):
                try:
                    c.tool_json("fs_rm", path=f)
                except ToolError:
                    pass

    ck.run("file_read: a byte range", read_range)
    ck.run("tools answer during a read", tools_answer_during_read)
    ck.run("file_read: missing file is refused", missing_file)
    ck.run("file_read: closing stops it", closing_a_read_stops_it)
    ck.run("file_write: closing keeps the old file", closing_an_upload_keeps_the_old_file)
    ck.run("file_write: past credit is refused", sending_past_credit_fails)
    ck.run("file_write: out of order is refused", out_of_order_fails)
    ck.run("disconnect mid-transfer leaves the board fine", disconnect_mid_transfer)
    ck.run("terminal and file stream together", streams_run_together)
    ck.run("clean up", clean_up)


def check_app(ck, url, tok):
    SETUP = "from lib.sys import streams\n"

    def round_trip():
        with Ws(url, tok) as c:
            sid = c.stream_open("app", name="st")["stream"]
            c.tool("exec", code=SETUP + "streams.app_write('st', b'hello')")
            f = c.next_frame(5)
            expect(f and f[1] == sid and f[4] == b"hello" and f[3] == 0, f)
            c.tool(
                "exec",
                code=SETUP + "_st_got = []\nstreams.on_app_data('st', _st_got.append)",
            )
            c.send_frame(FRAME_DATA, sid, 0, b"to device")
            time.sleep(0.3)
            got = c.tool("exec", code="print(_st_got)")
            expect("to device" in got, got)
            c.tool_json("stream_close", stream=sid)

    def lossy_shows_in_seq():
        with Ws(url, tok, timeout=30) as c:
            sid = c.stream_open("app", name="st", ring_size=4096)["stream"]
            # Faster than anything can drain: the VM holds the pump and writes 64 KB in one go
            c.tool("exec", code=SETUP + "b = bytes(1024)\nfor i in range(64):\n    streams.app_write('st', b)\n")
            expected = None
            jumped = 0
            total = 0
            deadline = time.time() + 5
            while time.time() < deadline and total + jumped < 64 * 1024:
                f = c.next_frame(0.5)
                if f is None or f[1] != sid:
                    continue
                if expected is not None and f[3] != expected:
                    jumped += f[3] - expected
                elif expected is None:
                    jumped += f[3]
                expected = f[3] + len(f[4])
                total += len(f[4])
            st = c.tool_json("stream_status", stream=sid)
            expect(total + jumped == 64 * 1024, (total, jumped))
            expect(st["dropped"] == jumped and jumped > 0, (st, jumped))
            c.tool_json("stream_close", stream=sid)
            return {"received": total, "dropped": jumped}

    def others_cant_touch_it():
        with Ws(url, tok) as a, Ws(url, tok) as b:
            sid = a.stream_open("app", name="st")["stream"]
            try:
                b.tool_json("stream_close", stream=sid)
            except ToolError:
                a.tool_json("stream_status", stream=sid)
                a.tool_json("stream_close", stream=sid)
                return
        raise AssertionError("another client closed the stream")

    def no_subscriber_is_cheap():
        with Ws(url, tok) as c:
            c.tool("exec", code=SETUP + "streams.app_write('nobody', b'x' * 100)")

    ck.run("app: both directions", round_trip)
    ck.run("app: loss shows in seq and status", lossy_shows_in_seq)
    ck.run("app: another client can't close it", others_cant_touch_it)
    ck.run("app: no subscriber", no_subscriber_is_cheap)


def extension_advertised(url, tok):
    with Ws(url, tok) as c:
        modern = c.call("server/discover")["capabilities"]["extensions"]["com.scriptostudio/streams"]
        legacy = c.call("initialize", {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "t", "version": "0"}})
        expect("terminal" in modern["kinds"], modern)
        expect("com.scriptostudio/streams" in legacy["capabilities"]["experimental"], legacy)
    return {"kinds": modern["kinds"], "maxFrame": modern["maxFrame"]}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--password", default="password")
    ap.add_argument("--scheme-http", action="store_true", help="ws:// only, for the simulator")
    ap.add_argument("--no-interrupt", action="store_true", help="skip the checks the simulator can't do")
    ap.add_argument("--fs-root", default="", help="where file checks write; the simulator needs a host directory")
    ap.add_argument("--only", default=None, help="run only the checks whose name contains this")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()

    tok = token(a.password, "agent")
    url = f"{'ws' if a.scheme_http else 'wss'}://{a.host}/mcp"
    ck = Check(a.only)
    ck.run("extension advertised in both eras", lambda: extension_advertised(url, tok))
    check_terminal(ck, url, tok, not a.no_interrupt)
    check_files(ck, url, tok, a.fs_root, full=not a.scheme_http)
    check_app(ck, url, tok)

    out = a.out or f"streams-{a.host.replace(':', '_')}-{int(time.time())}.json"
    with open(out, "w") as f:
        json.dump(ck.results, f, indent=1)
    print(f"\n{len(ck.results) - ck.failed} of {len(ck.results)} passed. Saved {out}")
    return 1 if ck.failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
