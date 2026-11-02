#!/usr/bin/env python3
"""Check that PFC can use installed apps' tools, on a device, with a scripted model.

    check_pfc_apps.py --host 192.168.1.249 --relay /path/to/ss-relay

Needs PFC installed. A small OpenAI-compatible server on this machine stands in for the
model, so a real turn runs on the device with no provider key or credit. PFC's config is
changed in memory only. Installs apps/mcpcheck and uses a session of its own, and removes both.
"""

import argparse
import json
import os
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from check_m1 import Check, expect
from check_relay import Relay

APP_ID = "mcp-check"
APP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "apps", "mcpcheck")
CHAT = "appcheck"
MODEL = "check-model"
PROVIDER = "_appcheck"
SHORT_WAIT_MS = 3000
TURN_TIMEOUT_S = 90


def tool_call(name, **args):
    return {"name": name, "arguments": json.dumps(args)}


class Model:
    """Answers each request with the next scripted step, and keeps what it was sent."""

    def __init__(self):
        self.steps = []
        self.requests = []
        self.lock = threading.Lock()

    def script(self, *steps):
        with self.lock:
            self.steps = list(steps)
            self.requests = []

    def next(self, request):
        with self.lock:
            self.requests.append(request)
            return self.steps.pop(0) if self.steps else "out of script"

    def tool_results(self):
        with self.lock:
            return [r["messages"][-1].get("content") for r in self.requests if r["messages"][-1].get("role") == "tool"]


def make_handler(model):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def _send(self, content_type, body):
            data = body.encode()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(data)

        def do_POST(self):
            request = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            step = model.next(request)
            calls = None
            text = None
            if isinstance(step, dict):
                calls = [{"index": 0, "id": "call_%d" % time.monotonic_ns(), "type": "function", "function": step}]
            else:
                text = step
            finish = "tool_calls" if calls else "stop"
            if not request.get("stream"):
                message = {"role": "assistant", "content": text}
                if calls:
                    message["tool_calls"] = calls
                self._send("application/json", json.dumps({"choices": [{"index": 0, "message": message, "finish_reason": finish}]}))
                return
            delta = {"role": "assistant", "content": text}
            events = []
            if calls:
                # Some providers put arguments in the first delta, and others only in later ones
                arguments = step["arguments"]
                split = len(arguments) // 2
                delta["tool_calls"] = [{**calls[0], "function": {"name": step["name"], "arguments": arguments[:split]}}]
                events.append({"choices": [{"index": 0, "delta": delta}]})
                events.append({"choices": [{"index": 0, "delta": {"tool_calls": [{"index": 0, "function": {"arguments": arguments[split:]}}]}}]})
            else:
                events.append({"choices": [{"index": 0, "delta": delta}]})
            events.append({"choices": [{"index": 0, "delta": {}, "finish_reason": finish}]})
            self._send("text/event-stream", "".join("data: %s\n\n" % json.dumps(e) for e in events) + "data: [DONE]\n\n")

    return Handler


def own_address(host):
    probe = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    probe.connect((host, 80))
    address = probe.getsockname()[0]
    probe.close()
    return address


class Device:
    def __init__(self, relay):
        self.relay = relay

    def run(self, code):
        return self.relay.ok("exec", code=code, echo=False)

    def set_up(self, url):
        self.run(f"""
import __main__
from lib.ext.pfc import gateway as _g
from lib.ext.pfc.session import get_session as _gs
if _g._pfc_instance is None:
    _g._pfc_instance = _g.PFCGateway()
_g._pfc_instance.config['providers'][{PROVIDER!r}] = {{'model': {MODEL!r}, 'base_url': {url!r}, 'api_key': 'none', 'type': 'chat'}}
_gs({CHAT!r}).model_override = {MODEL!r}
""")

    def tear_down(self):
        self.run(f"""
from lib.ext.pfc import gateway as _g
from lib.ext.pfc.session import reset_session as _rs
_rs({CHAT!r})
_g._pfc_instance.config['providers'].pop({PROVIDER!r}, None)
""")

    def set_wait(self, ms):
        self.run(f"from lib.ext.pfc.tools import app_tools as _a\n_a.WAIT_MS = {ms}")

    def start_turn(self, message, source="chat"):
        self.run(f"""
import __main__
from lib.sys import bg_tasks
from lib.ext.pfc import gateway as _g
__main__._pa_done = False
__main__._pa_reply = None
async def _pa_turn():
    try:
        __main__._pa_reply = await _g._pfc_instance.chat({message!r}, {CHAT!r}, prompt_source={source!r})
    finally:
        __main__._pa_done = True
bg_tasks.start('pa_turn', _pa_turn, restart=True)
""")

    def wait_turn(self, timeout=TURN_TIMEOUT_S):
        deadline = time.time() + timeout
        while time.time() < deadline:
            state = json.loads(self.run("import __main__, json\nprint(json.dumps([__main__._pa_done, str(__main__._pa_reply)]))"))
            if state[0]:
                return state[1]
            time.sleep(0.5)
        raise TimeoutError("the turn didn't finish")

    def turn(self, message, source="chat"):
        self.start_turn(message, source)
        return self.wait_turn()

    def jobs(self):
        return json.loads(self.run("from lib.sys import jobs\nimport json\nprint(json.dumps(jobs.list_all()))"))

    def stalls(self):
        return json.loads(self.run("import taskwatchdog, json\nprint(json.dumps(taskwatchdog.stall_log()))"))


def check(ck, relay, device, model, url):
    stalls_before = []

    def install():
        stalls_before.extend(device.stalls())
        relay.ok_json("sync", local=APP_DIR)
        device.set_up(url)

    def list_and_call():
        model.script(
            tool_call("app_tools"),
            tool_call("app_call", tool="mcp_check_count", args={"seconds": 2, "mode": "slow"}),
            "finished",
        )
        reply = device.turn("use the app")
        expect("finished" in reply, reply)
        offered = {t["function"]["name"] for t in model.requests[0]["tools"]}
        expect({"app_tools", "app_call", "app_job"} <= offered, sorted(offered))
        expect("mcp_check_count" not in offered, "app schemas belong in app_tools, not in every prompt")
        expect("app_tools" in model.requests[0]["messages"][0]["content"], "the prompt doesn't mention it")
        listing, result = model.tool_results()
        expect("mcp_check_count" in listing and "args:" in listing, listing)
        expect("mcp_check_broken" in listing and "broken" in listing, listing)
        expect('"counted": 2' in result and "tick 1" in result, result)
        return {"listing_chars": len(listing)}

    def failure_comes_back():
        model.script(
            tool_call("app_call", tool="mcp_check_fail", args={"need": "xyz"}),
            tool_call("app_call", tool="mcp_check_fail"),
            tool_call("app_call", tool="no_such_tool"),
            "reported",
        )
        expect("reported" in device.turn("break it"), "turn failed")
        failed, missing, unknown = model.tool_results()
        expect(failed.startswith("Error from mcp_check_fail") and "failed on purpose: xyz" in failed, failed)
        expect(missing.startswith("Error:") and "need" in missing, missing)
        expect(unknown.startswith("Error:") and "app_tools" in unknown, unknown)

    def unattended_is_refused():
        before = {r["job"] for r in device.jobs()}
        model.script(
            tool_call("app_call", tool="mcp_check_fail", args={"need": "xyz"}),
            tool_call("app_call", tool="mcp_check_count", args={"seconds": 1}),
            "cron done",
        )
        expect("cron done" in device.turn("scheduled work", "cron"), "turn failed")
        refused, allowed = model.tool_results()
        expect(refused.startswith("Error:") and "nobody is watching" in refused, refused)
        expect('"counted": 1' in allowed, allowed)
        started = [r["tool"] for r in device.jobs() if r["job"] not in before]
        expect(started == ["mcp_check_count"], started)

    def long_job_stays_a_job():
        device.set_wait(SHORT_WAIT_MS)
        try:
            model.script(tool_call("app_call", tool="mcp_check_count", args={"seconds": 30, "mode": "slow"}), "left it running")
            expect("left it running" in device.turn("start something long"), "turn failed")
            still = model.tool_results()[0]
            expect("still running as job" in still, still)
            job = int(still.split("job ")[1].split(".")[0])
            row = [r for r in device.jobs() if r["job"] == job][0]
            expect(row["state"] == "running", row)
            model.script(tool_call("app_job", job=job), tool_call("app_job", job=job, cancel=True), "stopped it")
            expect("stopped it" in device.turn("check on it, then stop it"), "turn failed")
            checked, cancelled = model.tool_results()
            expect("still running" in checked, checked)
            expect(cancelled.startswith("Error from") and "Cancelled" in cancelled, cancelled)
            row = [r for r in device.jobs() if r["job"] == job][0]
            expect(row["state"] == "cancelled", row)
            return {"seconds_running": row["seconds"]}
        finally:
            device.set_wait(60000)

    def stopping_the_turn_stops_the_job():
        before = {r["job"] for r in device.jobs()}
        model.script(tool_call("app_call", tool="mcp_check_count", args={"seconds": 30, "mode": "slow"}), "never reached")
        device.start_turn("start and get stopped")
        deadline = time.time() + 20
        new = []
        while time.time() < deadline and not new:
            new = [r for r in device.jobs() if r["job"] not in before and r["state"] == "running"]
            time.sleep(0.3)
        expect(new, "the job never started")
        device.run("from lib.sys import bg_tasks\nbg_tasks.stop('pa_turn')")
        time.sleep(2)
        row = [r for r in device.jobs() if r["job"] == new[0]["job"]][0]
        expect(row["state"] == "cancelled", row)

    def tools_answer_while_a_job_runs():
        before = {r["job"] for r in device.jobs()}
        model.script(tool_call("app_call", tool="mcp_check_count", args={"seconds": 5, "mode": "slow"}), "done")
        device.start_turn("run for a bit")
        deadline = time.time() + 20
        slowest = 0
        answered = 0
        started = False
        while time.time() < deadline:
            begin = time.time()
            rows = device.jobs()
            slowest = max(slowest, time.time() - begin)
            answered += 1
            mine = [r for r in rows if r["job"] not in before]
            started = started or bool(mine)
            if mine and mine[0]["state"] != "running":
                break
            time.sleep(0.2)
        expect(started and answered > 5, {"answered": answered})
        expect("done" in device.wait_turn(), "turn failed")
        return {"answered": answered, "slowest_ms": int(slowest * 1000)}

    def no_stalls():
        stalls = device.stalls()
        expect(stalls == stalls_before, stalls)

    ck.run("set up: install the app, point PFC at the scripted model", install)
    ck.run("chat: lists apps' tools and calls one, with schemas out of the prompt", list_and_call)
    ck.run("chat: a failure, bad arguments and an unknown tool all come back", failure_comes_back)
    ck.run("cron: a destructive tool is refused, a read-only one runs", unattended_is_refused)
    ck.run("long tool: stays a job, can be checked and cancelled", long_job_stays_a_job)
    ck.run("stopping the turn stops its job", stopping_the_turn_stops_the_job)
    ck.run("the board's tools answer while a turn waits on a job", tools_answer_while_a_job_runs)
    ck.run("no watchdog stalls", no_stalls)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", required=True)
    parser.add_argument("--relay", required=True)
    parser.add_argument("--scheme", default="ws")
    parser.add_argument("--password", default="password")
    parser.add_argument("--port", type=int, default=8791)
    parser.add_argument("--only")
    parser.add_argument("--out")
    args = parser.parse_args()

    model = Model()
    server = ThreadingHTTPServer(("0.0.0.0", args.port), make_handler(model))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://{own_address(args.host)}:{args.port}/v1"

    ck = Check(args.only)
    relay = Relay([args.relay, "--device", f"{args.scheme}://{args.host}/mcp"], args.password)
    for _ in range(50):
        if "exec" in {t["name"] for t in relay.call("tools/list")["result"]["tools"]}:
            break
        time.sleep(0.2)
    device = Device(relay)
    try:
        relay.tool("app_remove", id=APP_ID)
        check(ck, relay, device, model, url)
    finally:
        device.tear_down()
        relay.tool("app_remove", id=APP_ID)
        relay.close()
        server.shutdown()

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    out = args.out or f"pfc-apps-{args.host}-{int(time.time())}.json"
    with open(out, "w") as f:
        json.dump(ck.results, f, indent=2)
    raise SystemExit(1 if ck.failed else 0)


if __name__ == "__main__":
    main()
