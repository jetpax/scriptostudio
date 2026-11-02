#!/usr/bin/env python3
"""Checks of the MCP floor against a running device.

    check_m1.py --host 192.168.1.50 --password X

Each check prints PASS or FAIL, and all of them run whatever the others do. Results are
saved as JSON. What it does to the board: writes and removes /m1_big.txt, starts and stops
a background task called m1_check, and blocks the interpreter for up to 4 s at a time.
With --reset it also soft and hard resets the board.

Against the simulator (test/host/mcp/sim/run_sim.py), add --scheme-http --no-interrupt.
"""

import argparse
import hashlib
import json
import os
import re
import socket
import statistics
import subprocess
import time

from mcp_client import Http, HttpStatus, RpcError, ToolError, Ws, insecure_tls, token

EXEC_NOOP_N = 50
BIG_TEXT_BYTES = 64 * 1024
TOO_BIG_BYTES = 300 * 1024
CANCEL_LIMIT_MS = 100
CANCEL_TRIES = 8
EXEC_TARGET_MS = 33
LINK_NOISY_MS = 10
BASE64_READ_BYTES = 16 * 1024
BASE64_READ_LIMIT_MS = 500
SPIN = "import time\nwhile True:\n    time.sleep_ms(10)\n"
START_TASK = """
import asyncio
from lib.sys import bg_tasks
_m1_ticks = 0
async def _m1_task():
    global _m1_ticks
    while True:
        _m1_ticks += 1
        await asyncio.sleep_ms(20)
bg_tasks.start('m1_check', _m1_task)
"""
STOP_TASK = "from lib.sys import bg_tasks\nbg_tasks.stop('m1_check')\n"


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


def percentile(xs, p):
    xs = sorted(xs)
    return xs[min(len(xs) - 1, int(len(xs) * p))]


def icmp_ms(host, n=20):
    """Round trips to the board with no firmware above lwIP involved: the link's share."""
    out = subprocess.run(["ping", "-c", str(n), "-i", "0.1", host.split(":")[0]], capture_output=True, text=True).stdout
    return sorted(float(m) for m in re.findall(r"time=([\d.]+)", out))


def timed_exec(c, n):
    t = []
    for _ in range(n):
        t0 = time.perf_counter()
        c.tool("exec", code="pass")
        t.append((time.perf_counter() - t0) * 1000)
    return {
        "min_ms": round(min(t), 1),
        "p25_ms": round(percentile(t, 0.25), 1),
        "p50_ms": round(statistics.median(t), 1),
        "p95_ms": round(percentile(t, 0.95), 1),
    }


def discover_and_work(c):
    d = c.call("server/discover")
    expect("2026-07-28" in d["supportedVersions"], d)
    legacy = c.call("initialize", {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "t", "version": "0"}})
    expect(legacy["protocolVersion"] == "2025-11-25", legacy)
    tools = [t["name"] for t in c.call("tools/list")["tools"]]
    for want in ("exec", "device_info", "fs_list", "fs_read_text", "fs_write_text", "interrupt", "stop_user_tasks", "reset", "logs_read"):
        expect(want in tools, f"{want} missing from {tools}")
    out = c.tool("exec", code="print(6*7)")
    expect("42" in out, out)
    out = c.tool("exec", code="6*7")
    expect("42" in out, f"single mode should echo: {out!r}")
    try:
        c.tool("exec", code="1/0")
        raise AssertionError("expected a traceback")
    except ToolError as e:
        expect("ZeroDivisionError" in str(e), e)
    return {"tools": len(tools)}


def fs_round_trip(c, root):
    d = f"{root}/m1_dir"
    f = f"{d}/a/t.txt"
    text = "héllo\n" * 10
    c.tool_json("fs_mkdir", path=f"{d}/a")
    c.tool_json("fs_write_text", path=f, text=text)
    r = c.tool_json("fs_read_text", path=f)
    expect(r["text"] == text and r["eof"], r)
    expect(c.tool_json("fs_stat", path=f)["type"] == "file", "stat")
    names = [e["name"] for e in c.tool_json("fs_list", path=f"{d}/a")]
    expect(names == ["t.txt"], names)
    h = c.tool_json("fs_hash", path=f)
    expect(h["sha256"] == hashlib.sha256(text.encode()).hexdigest(), h)
    for p in (f, f"{d}/a", d):
        c.tool_json("fs_rm", path=p)


def big_text_arrives_whole(c, root):
    f = f"{root}/m1_big.txt"
    text = ("0123456789abcde\n" * (BIG_TEXT_BYTES // 16 + 1))[:BIG_TEXT_BYTES]
    c.tool_json("fs_write_text", path=f, text=text)
    h = c.tool_json("fs_hash", path=f)
    c.tool_json("fs_rm", path=f)
    expect(h["n"] == BIG_TEXT_BYTES and h["sha256"] == hashlib.sha256(text.encode()).hexdigest(), h)
    return {"bytes": h["n"]}


def task_ticks(c):
    return int(c.tool("exec", code="print(_m1_ticks)").split()[-1])


def task_alive(c):
    before = task_ticks(c)
    time.sleep(0.3)
    after = task_ticks(c)
    expect(after > before, f"m1_check stopped ticking: {before} then {after}")
    state = c.tool("exec", code="from lib.sys import bg_tasks\nprint(bg_tasks.list_tasks()['m1_check'])")
    expect("running" in state, state)


def cancel_and_time(c, cancel):
    mid = c.send("tools/call", {"name": "exec", "arguments": {"code": SPIN}})
    time.sleep(0.3)
    t0 = time.perf_counter()
    cancel(mid)
    r = c.wait(mid, timeout=8)
    ms = (time.perf_counter() - t0) * 1000
    text = r["content"][0]["text"]
    expect(r.get("isError") and "KeyboardInterrupt" in text, text)
    return ms


def cancel_times(c, cancel):
    """Link spikes only ever add delay, so the best try bounds the device's share."""
    t = [cancel_and_time(c, cancel) for _ in range(CANCEL_TRIES)]
    expect(min(t) < CANCEL_LIMIT_MS, f"best of {CANCEL_TRIES} was {min(t):.0f} ms")
    return {"best_ms": round(min(t), 1), "median_ms": round(statistics.median(t), 1), "worst_ms": round(max(t), 1)}


def check_interrupts(ck, c):
    c.tool("exec", code=START_TASK)
    time.sleep(0.2)
    task_alive(c)

    def by_cancel():
        r = cancel_times(c, c.cancel)
        task_alive(c)
        return r

    def by_control_frame():
        r = cancel_times(c, lambda mid: c.send_interrupt_frame())
        task_alive(c)
        return r

    def by_tool():
        tool_ids = []
        r = cancel_times(c, lambda mid: tool_ids.append(c.send("tools/call", {"name": "interrupt"})))
        for i in tool_ids:
            reply = c.wait(i, timeout=8)
            expect(json.loads(reply["content"][0]["text"])["delivered"] is True, reply)
        task_alive(c)
        return r

    def wrong_id_leaves_exec_alone():
        mid = c.send("tools/call", {"name": "exec", "arguments": {"code": "import time\ntime.sleep_ms(800)\nprint('done')"}})
        time.sleep(0.2)
        c.cancel(mid + 1000)
        r = c.wait(mid, timeout=8)
        expect(not r.get("isError") and "done" in r["content"][0]["text"], r)

    def cancel_when_idle_changes_nothing():
        c.cancel(424242)
        c.send_interrupt_frame()
        time.sleep(0.5)
        task_alive(c)

    def exec_stops_itself():
        t0 = time.perf_counter()
        r = c.call("tools/call", {"name": "exec", "arguments": {"code": SPIN}})
        ms = (time.perf_counter() - t0) * 1000
        text = r["content"][0]["text"]
        expect(r.get("isError") and "stopped after" in text, text)
        expect(3500 < ms < 4800, f"{ms:.0f} ms")
        task_alive(c)
        return {"ms": round(ms)}

    ck.run("cancel: notifications/cancelled, user task survives", by_cancel)
    ck.run("cancel: control frame, user task survives", by_control_frame)
    ck.run("cancel: interrupt tool, user task survives", by_tool)
    ck.run("cancel: wrong id leaves the exec alone", wrong_id_leaves_exec_alone)
    ck.run("cancel: nothing running, nothing happens", cancel_when_idle_changes_nothing)
    ck.run("exec: 4 s cap, user task survives", exec_stops_itself)
    c.tool("exec", code=STOP_TASK)


# With a collection first, since what the watchdog calls has to survive one
WD_TASKS = """
import asyncio, gc, time
from lib.sys import bg_tasks
gc.collect()
_wd = {"ticks": 0, "finished": False}
async def _wd_bystander():
    while True:
        _wd["ticks"] += 1
        await asyncio.sleep_ms(100)
bg_tasks.start("wd_bystander", _wd_bystander, restart=True)
"""
WD_HOG_ENDS = """
async def _wd_hog():
    time.sleep(6)
    await asyncio.sleep(0)
    _wd["finished"] = True
bg_tasks.start("wd_hog", _wd_hog, restart=True)
"""
WD_HOG_STUCK = """
async def _wd_hog():
    while True:
        time.sleep_ms(100)
bg_tasks.start("wd_hog", _wd_hog, restart=True)
"""
WD_STOPS_ITSELF = """
_wd["finished"] = False
async def _wd_hog():
    bg_tasks.stop("wd_hog")
    await asyncio.sleep(0)
    _wd["finished"] = True
bg_tasks.start("wd_hog", _wd_hog, restart=True)
"""
WD_STATE = """
import json
_t = bg_tasks.list_tasks()
print(json.dumps({"ticks": _wd["ticks"], "finished": _wd["finished"], "hog": _t.get("wd_hog", {}).get("state"), "bystander": _t["wd_bystander"]["state"]}))
"""
WD_LONG_CALL = "import time\ntime.sleep(7)\nprint('done')"
WD_DEADLINE_END_S = 7.5
WD_TIER2_END_S = 11.5


def check_watchdog(ck, ws_url, agent, human):
    """Stall the loop past queue_pump's 5 s deadline. Only what's holding it may suffer."""
    with Ws(ws_url, agent, timeout=30) as c, Ws(ws_url, human, timeout=30) as person:
        c.tool("exec", code=WD_TASKS)

        def state():
            return json.loads(c.tool("exec", code=WD_STATE))

        def logs_since(start):
            now = c.tool_json("logs_read", max_bytes=1)["cursor"]
            return c.tool_json("logs_read", max_bytes=max(1, now - start))["text"]

        def cursor():
            return c.tool_json("logs_read", max_bytes=1)["cursor"]

        def bystander_alive(st):
            expect(st["bystander"] == "running", st)
            time.sleep(0.5)
            expect(state()["ticks"] > st["ticks"], "bystander stopped ticking")

        def stall_ends():
            start = cursor()
            c.tool("exec", code=WD_HOG_ENDS)
            time.sleep(WD_DEADLINE_END_S)
            st = state()
            expect(st["finished"], f"hog was stopped: {st}")
            log = logs_since(start)
            expect("starved by 'wd_hog'" in log, log)
            expect("Traceback" not in log, log)
            bystander_alive(st)
            return {"ticks": st["ticks"]}

        def stuck():
            start = cursor()
            c.tool("exec", code=WD_HOG_STUCK)
            time.sleep(WD_TIER2_END_S)
            st = state()
            expect(st["hog"] == "stopped", st)
            log = logs_since(start)
            expect("starved by 'wd_hog'" in log, log)
            expect("Traceback" not in log, log)
            bystander_alive(st)

        def long_call():
            start = cursor()
            r = person.call("tools/call", {"name": "exec", "arguments": {"code": WD_LONG_CALL, "timeout_ms": 9000}})
            text = r["content"][0]["text"]
            expect(not r.get("isError") and "done" in text, text)
            expect("starved" not in logs_since(start), "watchdog blamed someone")
            bystander_alive(state())

        def stops_itself():
            start = cursor()
            c.tool("exec", code=WD_STOPS_ITSELF)
            time.sleep(0.3)
            st = state()
            expect(not st["finished"], "it ran on past its next await")
            expect(st["hog"] == "stopped", st)
            expect("Traceback" not in logs_since(start), "stop() raised")
            bystander_alive(st)

        ck.run("watchdog: a stall that ends, the hog finishes and others keep running", stall_ends)
        ck.run("watchdog: a stuck task is broken, and others keep running", stuck)
        ck.run("watchdog: a person's long call stops nothing", long_call)
        ck.run("bg_tasks: a task can stop itself", stops_itself)
        c.tool("exec", code='bg_tasks.stop("wd_bystander")')


def ws_refused(url, tok, via="bearer", origin=None, reason="token"):
    """A refused client completes the upgrade, then gets close code 1008 and why."""
    from websockets.exceptions import ConnectionClosed, InvalidStatus

    try:
        c = Ws(url, tok, via=via, origin=origin, timeout=8)
    except InvalidStatus as e:
        return {"status": e.response.status_code}
    try:
        c.call("ping")
    except ConnectionClosed as e:
        code = e.rcvd.code if e.rcvd else None
        expect(code == 1008, f"closed with {code}")
        expect(e.rcvd.reason == reason, f"reason was {e.rcvd.reason!r}")
        return {"close_code": code, "reason": reason}
    raise AssertionError("connection was accepted")


def http_status(http_url, tok, origin=None):
    try:
        Http(http_url, tok, origin=origin).call("ping")
    except HttpStatus as e:
        return e.status
    return 200


def two_frames_one_write(host, secure, tok):
    """Both frames in one TLS record. The second must not wait for unrelated traffic."""
    sock = socket.create_connection(host_port(host, secure), timeout=8)
    if secure:
        sock = insecure_tls().wrap_socket(sock, server_hostname="device")
    sock.sendall(
        (
            f"GET /mcp HTTP/1.1\r\nHost: {host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
            "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n"
            f"Sec-WebSocket-Protocol: mcp\r\nAuthorization: Bearer {tok}\r\n\r\n"
        ).encode()
    )
    raw = b""
    while b"\r\n\r\n" not in raw:
        raw += sock.recv(1024)
    expect(b"101" in raw.split(b"\r\n")[0], raw)

    def frame(mid):
        body = json.dumps({"jsonrpc": "2.0", "id": mid, "method": "ping"}).encode()
        return bytes([0x81, 0x80 | len(body), 0, 0, 0, 0]) + body  # A zero mask leaves the bytes as they are

    t0 = time.perf_counter()
    sock.sendall(frame(1) + frame(2))
    got = raw.split(b"\r\n\r\n", 1)[1]
    sock.settimeout(5)
    while got.count(b'"result"') < 2:
        got += sock.recv(1024)
    ms = (time.perf_counter() - t0) * 1000
    sock.close()
    expect(ms < 1000, f"{ms:.0f} ms")
    return {"ms": round(ms)}


def host_port(host, secure):
    if ":" in host:
        h, p = host.rsplit(":", 1)
        return h, int(p)
    return host, 443 if secure else 80


def ping_during_transfer(url, tok, root):
    """Library default keepalive on, as most clients run. Used to wedge the socket."""
    f = f"{root}/m1_big.txt"
    blob = os.urandom(4096)
    with Ws(url, tok, ping_interval=1) as c:
        t0 = time.perf_counter()
        n = 0
        while time.perf_counter() - t0 < 5:
            c.write_chunk(f, n * len(blob), blob)
            n += 1
        c.tool_json("fs_rm", path=f)
    return {"chunks": n}


def internal_ram(heap):
    regions = [r for r in heap.get("idf_regions", []) if r[0] < 512 * 1024]
    return {
        "internal_free": sum(r[1] for r in regions),
        "internal_largest": max((r[2] for r in regions), default=None),
    }


def client_limit(url, tok):
    """Keep opening sockets, using every one each time, to see what gives."""
    held = []
    detail = {"limit": 0}
    for n in range(1, 7):
        try:
            held.append(Ws(url, tok, timeout=8))
        except Exception as e:
            detail[f"open_{n}"] = repr(e)
            break
        alive = []
        for h in held:
            try:
                h.call("ping")
                alive.append(h)
            except Exception:
                pass
        refused = len(held) - len(alive)
        held = alive
        row = {"alive": len(held), "refused": refused}
        if held:
            row.update(internal_ram(held[-1].tool_json("device_info")["heap"]))
        detail[f"open_{n}"] = row
        detail["limit"] = max(detail["limit"], len(held))
    for h in held:
        try:
            h.close()
        except Exception:
            pass
    return detail


def base64_read_is_fast(c, root):
    """fs_read leans on binascii. A Python one shadowing the C module took minutes for this."""
    f = f"{root}/m1_big.txt"
    blob = os.urandom(BASE64_READ_BYTES)
    c.write_chunk(f, 0, blob)
    t0 = time.perf_counter()
    data, _ = c.read_chunk(f, 0, BASE64_READ_BYTES)
    ms = (time.perf_counter() - t0) * 1000
    c.tool_json("fs_rm", path=f)
    expect(data == blob, "read back different bytes")
    expect(ms < BASE64_READ_LIMIT_MS, f"{ms:.0f} ms")
    return {"ms": round(ms)}


def two_clients(url, tok):
    t = []
    with Ws(url, tok) as a, Ws(url, tok) as b:
        for i in range(EXEC_NOOP_N // 2):
            for c in (a, b):
                t0 = time.perf_counter()
                expect("7" in c.tool("exec", code=f"print({i}+7-{i})"), "wrong answer")
                t.append((time.perf_counter() - t0) * 1000)
        heap = a.tool_json("device_info")["heap"]
    return {"p50_ms": round(statistics.median(t), 1), "p95_ms": round(percentile(t, 0.95), 1), **internal_ram(heap)}


def check_reset(ws_url, http_url, tok):
    c = Ws(ws_url, tok)
    c.tool("exec", code="import __main__\n__main__._m1_marker = 1")
    c.tool_json("reset", mode="soft")
    time.sleep(3)
    c2 = None
    deadline = time.time() + 30
    while time.time() < deadline:
        try:
            c2 = Http(http_url, tok, timeout=5)
            c2.call("ping")
            break
        except Exception:
            time.sleep(1)
    expect(c2 is not None, "no answer after soft reset")
    c = Ws(ws_url, tok)
    c.tool_json("reset", mode="hard")
    time.sleep(5)
    deadline = time.time() + 60
    while time.time() < deadline:
        try:
            Http(http_url, tok, timeout=5).call("ping")
            return
        except Exception:
            time.sleep(2)
    raise AssertionError("no answer after hard reset")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--password", default="password")
    ap.add_argument("--scheme-http", action="store_true", help="ws:// and http:// only, for the simulator")
    ap.add_argument("--no-interrupt", action="store_true", help="skip the checks the simulator can't do")
    ap.add_argument("--reset", action="store_true", help="also soft and hard reset the board")
    ap.add_argument("--fs-root", default="", help="where file checks write; the simulator needs a host directory")
    ap.add_argument("--only", default=None, help="run only the checks whose name contains this")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()

    agent = token(a.password, "agent")
    human = token(a.password, "human")
    ws_url = f"{'ws' if a.scheme_http else 'wss'}://{a.host}/mcp"
    http_url = f"http://{a.host}/mcp"
    ck = Check(a.only)

    def once(fn, tok=agent, **kw):
        with Ws(ws_url, tok, **kw) as c:
            return fn(c)

    ck.run("http: discover, tools, exec, traceback", lambda: discover_and_work(Http(http_url, agent)))
    if not a.scheme_http:
        ck.run("https: discover, tools, exec, traceback", lambda: discover_and_work(Http(f"https://{a.host}/mcp", agent)))
    ck.run("http: 202 for a notification", lambda: expect(
        Http(http_url, agent).post(json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}))[0] == 202, "not 202"))
    ck.run("http: 400 for bad JSON", lambda: expect(Http(http_url, agent).post("{nope")[0] == 400, "not 400"))
    ck.run("http: GET is 405, so SSE clients move on", lambda: expect(http_get_status(a.host) == 405, "not 405"))

    ck.run("wss: discover, tools, exec, traceback", lambda: once(discover_and_work))
    for via in ("bearer", "subprotocol", "query"):
        ck.run(f"wss: token by {via}", lambda via=via: expect(once(lambda c: c.call("ping"), via=via) == {"resultType": "complete"}, "ping"))
    ck.run("wss: human token works too", lambda: expect(once(lambda c: c.tool_json("device_info"), human)["role"] == 1, "role"))
    ck.run("wss: agent role reported", lambda: expect(once(lambda c: c.tool_json("device_info"))["role"] == 0, "role"))

    ck.run("refused: wss bad token", lambda: ws_refused(ws_url, "0" * 32))
    ck.run("refused: wss bad token in subprotocol", lambda: ws_refused(ws_url, "0" * 32, via="subprotocol"))
    ck.run("refused: wss bad Origin", lambda: ws_refused(ws_url, agent, origin="https://evil.example", reason="origin"))
    ck.run("accepted: wss allowed Origin", lambda: expect(once(lambda c: c.call("ping"), origin="https://scriptostudio.com") is not None, "ping"))
    ck.run("refused: http no token", lambda: expect(http_status(http_url, None) == 401, "not 401"))
    ck.run("refused: http bad token", lambda: expect(http_status(http_url, "0" * 32) == 401, "not 401"))
    ck.run("refused: http bad Origin", lambda: expect(http_status(http_url, agent, "https://evil.example") == 403, "not 403"))

    def latency():
        link = icmp_ms(a.host)
        r = once(lambda c: timed_exec(c, EXEC_NOOP_N))
        r["icmp_p50_ms"] = round(statistics.median(link), 1) if link else None
        r["link"] = "noisy" if link and statistics.median(link) > LINK_NOISY_MS else "quiet"
        # On a noisy link the median measures the link, so judge by a quieter quartile.
        judged = "p50_ms" if r["link"] == "quiet" else "p25_ms"
        r["judged_on"] = judged
        expect(r[judged] <= EXEC_TARGET_MS, r)
        return r

    if not a.scheme_http:
        ck.run("latency: exec on wss", latency)

    ck.run("fs tools round trip", lambda: once(lambda c: fs_round_trip(c, a.fs_root)))
    ck.run("base64 read of random data is fast", lambda: once(lambda c: base64_read_is_fast(c, a.fs_root)))
    ck.run("64 KB text arrives whole over http", lambda: big_text_arrives_whole(Http(http_url, agent, timeout=60), a.fs_root))
    ck.run("64 KB text arrives whole over wss", lambda: once(lambda c: big_text_arrives_whole(c, a.fs_root), timeout=60))
    if not a.scheme_http:
        ck.run("http: over 256 KB is 413", lambda: expect(
            Http(http_url, agent, timeout=60).post("x" * TOO_BIG_BYTES)[0] == 413, "not 413"))

    if not a.no_interrupt:
        once(lambda c: check_interrupts(ck, c))
        check_watchdog(ck, ws_url, agent, human)

    ck.run("wss: two frames in one write", lambda: two_frames_one_write(a.host, not a.scheme_http, agent))
    ck.run("wss: client PINGs during a transfer", lambda: ping_during_transfer(ws_url, agent, a.fs_root))
    ck.run("two held clients together", lambda: two_clients(ws_url, agent))
    ck.run("held client limit (record it)", lambda: client_limit(ws_url, agent))

    if a.reset:
        ck.run("reset: soft, then hard", lambda: check_reset(ws_url, http_url, agent))

    out = a.out or f"m1-{a.host.replace(':', '_')}-{int(time.time())}.json"
    with open(out, "w") as f:
        json.dump(ck.results, f, indent=1)
    print(f"\n{len(ck.results) - ck.failed} of {len(ck.results)} passed. Saved {out}")
    return 1 if ck.failed else 0


def http_get_status(host):
    import http.client

    conn = http.client.HTTPConnection(host, timeout=10)
    conn.request("GET", "/mcp")
    status = conn.getresponse().status
    conn.close()
    return status


if __name__ == "__main__":
    raise SystemExit(main())
