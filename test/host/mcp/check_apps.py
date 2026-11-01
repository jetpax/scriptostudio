#!/usr/bin/env python3
"""Check app tools and jobs end to end, over stdio like an agent, against a device.

    check_apps.py --host 192.168.1.249 --relay /path/to/ss-relay

Installs apps/mcpcheck on the device, and removes it again.
"""

import argparse
import json
import os
import threading
import time
from queue import Empty

from check_m1 import Check, expect
from check_relay import Relay
from mcp_client import Http, token

APP_ID = "mcp-check"
APP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "apps", "mcpcheck")
PREFIX = "mcp_check_"
LONG_JOB_S = 30
WATCHDOG_TIER2_S = 14
CHANGED = "notifications/tools/list_changed"


def wait_note(relay, method, timeout=10):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            note = relay.notes.get(timeout=max(0.1, deadline - time.time()))
        except Empty:
            break
        if note.get("method") == method:
            return note
    return None


def drain(relay):
    while True:
        try:
            relay.notes.get_nowait()
        except Empty:
            return


def call_with_progress(relay, name, args, token_value, timeout=120):
    """Returns the reply and every progress notification on the way."""
    relay.next_id += 1
    mid = relay.next_id
    message = {"jsonrpc": "2.0", "id": mid, "method": "tools/call", "params": {"name": name, "arguments": args, "_meta": {"progressToken": token_value}}}
    relay.process.stdin.write(json.dumps(message) + "\n")
    relay.process.stdin.flush()
    return mid


def wait_reply(relay, mid, timeout):
    with relay.lock:
        if not relay.lock.wait_for(lambda: mid in relay.replies, timeout):
            raise TimeoutError(f"no reply to {mid}")
        return relay.replies.pop(mid)


def stalls(relay):
    code = "import taskwatchdog, json\nprint(json.dumps(taskwatchdog.stall_log()))"
    return json.loads(relay.ok("exec", code=code))


def check(ck, relay, args):
    defs = {}

    def tools():
        return {t["name"]: t for t in relay.call("tools/list")["result"]["tools"]}

    def absent_before_install():
        relay.call("initialize", {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "check", "version": "1"}})
        expect(not [n for n in tools() if n.startswith(PREFIX)], "already installed")
        expect(APP_ID not in [a["id"] for a in relay.ok_json("apps_list")["apps"]], "already listed")

    def install_appears_mid_session():
        drain(relay)
        relay.ok_json("sync", local=APP_DIR)
        expect(wait_note(relay, CHANGED), "no tools/list_changed")
        defs.update(tools())
        names = [n for n in defs if n.startswith(PREFIX)]
        expect(sorted(names) == [PREFIX + "count", PREFIX + "fail", PREFIX + "hog"], names)
        listed = relay.ok_json("apps_list")
        row = [a for a in listed["apps"] if a["id"] == APP_ID][0]
        expect(row["version"] == "1.0.0" and row["folder"] == "mcp_check", row)
        expect(sorted(row["tools"]) == sorted(names), row)
        return {"tools": names}

    def a_broken_tool_is_reported():
        listed = relay.ok_json("apps_list")
        expect(PREFIX + "broken" in listed["tool_errors"], listed)

    def schema_comes_from_the_config_block():
        count = defs[PREFIX + "count"]
        props = count["inputSchema"]["properties"]
        expect(props["seconds"]["type"] == "integer" and props["seconds"]["default"] == 3, props)
        expect(props["mode"]["enum"] == ["fast", "slow"] or set(props["mode"]["enum"]) == {"fast", "slow"}, props)
        expect(props["pin"]["type"] == "integer", props)
        board = json.loads(relay.ok("exec", code="from lib.sys import board\nimport json\nprint(json.dumps(board.pins()))"))
        expect(board and props["pin"]["enum"] == board, (props["pin"], board))
        expect(count["inputSchema"]["required"] == [], count)
        expect(count["annotations"]["readOnlyHint"] is True and count["annotations"]["destructiveHint"] is False, count)
        fail = defs[PREFIX + "fail"]
        expect(fail["inputSchema"]["required"] == ["need"], fail)
        expect(fail["annotations"]["destructiveHint"] is True, "effects left out should be conservative")
        return {"pins": len(board)}

    def a_short_call_returns_its_result():
        result = relay.tool(PREFIX + "count", seconds=2, pin=0)
        text = result["content"][0]["text"]
        expect(not result.get("isError"), text)
        expect('"counted": 2' in text and "tick 1" in text, text)

    def bad_arguments_are_refused():
        result = relay.tool(PREFIX + "fail")
        expect(result.get("isError") and "Missing argument" in result["content"][0]["text"], result)
        result = relay.tool(PREFIX + "count", mode="nope")
        expect(result.get("isError") and "must be one of" in result["content"][0]["text"], result)

    def an_error_comes_back_with_its_traceback():
        result = relay.tool(PREFIX + "fail", need="x")
        text = result["content"][0]["text"]
        expect(result.get("isError") and "failed on purpose: x" in text and "Traceback" in text, text)

    def long_job_with_progress_and_no_stall():
        drain(relay)
        before = stalls(relay)
        mid = call_with_progress(relay, PREFIX + "count", {"seconds": LONG_JOB_S}, "tok-long")
        answers = []
        deadline = time.time() + LONG_JOB_S - 3
        while time.time() < deadline:
            t0 = time.time()
            relay.ok_json("device_info")
            answers.append((time.time() - t0) * 1000)
            time.sleep(2)
        reply = wait_reply(relay, mid, 30)
        text = reply["result"]["content"][0]["text"]
        expect(not reply["result"].get("isError") and f'"counted": {LONG_JOB_S}' in text, text)
        notes = []
        while True:
            try:
                note = relay.notes.get_nowait()
            except Empty:
                break
            if note.get("method") == "notifications/progress":
                notes.append(note["params"])
        expect(len(notes) >= LONG_JOB_S - 1, f"{len(notes)} progress notes")
        expect(all(n["progressToken"] == "tok-long" for n in notes), notes[:2])
        expect(notes[-1]["progress"] == LONG_JOB_S and notes[-1]["total"] == LONG_JOB_S, notes[-1])
        after = stalls(relay)
        expect(len(after) == len(before), f"watchdog fired: {after[len(before):]}")
        return {"progress_notes": len(notes), "tool_reply_ms_max": round(max(answers)), "stalls": 0}

    def cancel_stops_it():
        mid = call_with_progress(relay, PREFIX + "count", {"seconds": 60}, "tok-cancel")
        time.sleep(3)
        message = {"jsonrpc": "2.0", "method": "notifications/cancelled", "params": {"requestId": mid, "reason": "check"}}
        relay.process.stdin.write(json.dumps(message) + "\n")
        relay.process.stdin.flush()
        time.sleep(2.5)
        jobs = relay.ok_json("job_status")
        states = [j for j in jobs if j["tool"] == PREFIX + "count"]
        expect(states[-1]["state"] == "cancelled", states[-1])
        expect(states[-1]["seconds"] < 10, states[-1])
        with relay.lock:
            expect(mid not in relay.replies, "a cancelled request should get no reply")
        return {"seconds": states[-1]["seconds"]}

    def stop_user_tasks_stops_a_call_and_answers_it():
        mid = call_with_progress(relay, PREFIX + "count", {"seconds": 60}, "tok-stop")
        time.sleep(2)
        relay.ok_json("stop_user_tasks")
        reply = wait_reply(relay, mid, 8)
        expect(reply["result"].get("isError") and "Cancelled" in reply["result"]["content"][0]["text"], reply)

    def job_start_status_cancel():
        job = relay.ok_json("job_start", tool=PREFIX + "count", arguments={"seconds": 40})
        expect(job["state"] == "running", job)
        time.sleep(3)
        status = relay.ok_json("job_status", job=job["job"])
        expect(status["state"] == "running" and status["done"] >= 1 and "tick" in status["output"], status)
        stopped = relay.ok_json("job_cancel", job=job["job"])
        time.sleep(2.5)
        status = relay.ok_json("job_status", job=job["job"])
        expect(status["state"] == "cancelled", (stopped, status))
        result = relay.tool("job_status", job=99999)
        expect(result.get("isError"), result)

    def a_job_finishes_with_its_result():
        job = relay.ok_json("job_start", tool=PREFIX + "count", arguments={"seconds": 2, "mode": "fast"})
        time.sleep(1.5)
        status = relay.ok_json("job_status", job=job["job"])
        expect(status["state"] == "done" and status["result"]["counted"] == 2, status)

    def http_gets_a_job_id():
        http = Http(f"http://{args.host}/mcp", token(args.password, "agent"))
        text = http.tool(PREFIX + "count", seconds=2, mode="fast")
        job = json.loads(text)
        expect(job["state"] == "running" and "job" in job, job)
        time.sleep(1.5)
        status = json.loads(http.tool("job_status", job=job["job"]))
        expect(status["state"] == "done", status)

    def disconnecting_stops_a_waiting_call():
        other = Relay([args.relay, "--device", f"{args.scheme}://{args.host}/mcp"], args.password)
        try:
            for _ in range(40):
                if PREFIX + "count" in {t["name"] for t in other.call("tools/list")["result"]["tools"]}:
                    break
                time.sleep(0.25)
            call_with_progress(other, PREFIX + "count", {"seconds": 60}, "tok-gone")
            time.sleep(2)
        finally:
            other.process.kill()
            other.process.wait()
        time.sleep(4)
        running = [j for j in relay.ok_json("job_status") if j["state"] == "running"]
        expect(not running, running)

    def a_hog_is_named_broken_and_reported():
        mid = call_with_progress(relay, PREFIX + "hog", {}, "tok-hog")
        time.sleep(WATCHDOG_TIER2_S)
        reply = wait_reply(relay, mid, 15)
        text = reply["result"]["content"][0]["text"]
        expect(reply["result"].get("isError") and "held the event loop" in text, text)
        expect(relay.ok("exec", code="print(1)").strip() == "1", "board didn't recover")
        log = relay.ok_json("logs_read", max_bytes=600)["text"]
        expect("starved by 'job_" in log, log[-200:])

    def rerun_does_not_notify():
        drain(relay)
        relay.ok_json("sync", local=APP_DIR)
        expect(not wait_note(relay, CHANGED, 2), "nothing changed, but it said so")

    def removing_takes_tools_and_files():
        drain(relay)
        done = relay.ok_json("app_remove", id=APP_ID)
        expect(done["files"] >= 5, done)
        expect(wait_note(relay, CHANGED), "no tools/list_changed")
        expect(not [n for n in tools() if n.startswith(PREFIX)], "tools still listed")
        expect(relay.tool("fs_stat", path="/lib/ext/mcp_check").get("isError"), "files still there")
        expect(APP_ID not in [a["id"] for a in relay.ok_json("apps_list")["apps"]], "still listed")
        reply = relay.call("tools/call", {"name": PREFIX + "count", "arguments": {}})
        expect("error" in reply, reply)
        result = relay.tool("app_remove", id=APP_ID)
        expect(result.get("isError"), result)

    ck.run("apps: absent before install", absent_before_install)
    ck.run("apps: installing makes tools appear mid-session", install_appears_mid_session)
    ck.run("apps: a broken tool is reported, not fatal", a_broken_tool_is_reported)
    ck.run("apps: the schema comes from the config block, with pins from board.json", schema_comes_from_the_config_block)
    ck.run("tool: a short call returns its result", a_short_call_returns_its_result)
    ck.run("tool: bad arguments are refused", bad_arguments_are_refused)
    ck.run("tool: an error comes back with its traceback", an_error_comes_back_with_its_traceback)
    ck.run(f"job: {LONG_JOB_S} s with progress, tools still answer, no watchdog", long_job_with_progress_and_no_stall)
    ck.run("job: notifications/cancelled stops it", cancel_stops_it)
    ck.run("job: stop_user_tasks stops a call and answers it", stop_user_tasks_stops_a_call_and_answers_it)
    ck.run("job: start, status, cancel", job_start_status_cancel)
    ck.run("job: finishes with its result", a_job_finishes_with_its_result)
    ck.run("job: plain HTTP gets a job id to poll", http_gets_a_job_id)
    ck.run("job: a client vanishing stops its call", disconnecting_stops_a_waiting_call)
    ck.run("job: a hog is named, broken and reported", a_hog_is_named_broken_and_reported)
    ck.run("apps: a rerun that changes nothing doesn't notify", rerun_does_not_notify)
    ck.run("apps: removing takes the tools and files, and tells clients", removing_takes_tools_and_files)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--relay", required=True)
    ap.add_argument("--password", default="password")
    ap.add_argument("--scheme", default="wss")
    ap.add_argument("--only", default=None)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    ck = Check(args.only)
    relay = Relay([args.relay, "--device", f"{args.scheme}://{args.host}/mcp"], args.password)
    for _ in range(50):
        if "exec" in {t["name"] for t in relay.call("tools/list")["result"]["tools"]}:
            break
        time.sleep(0.2)
    try:
        relay.tool("app_remove", id=APP_ID)
        check(ck, relay, args)
    finally:
        relay.tool("app_remove", id=APP_ID)
        relay.close()

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    out = args.out or f"apps-{args.host}-{int(time.time())}.json"
    with open(out, "w") as f:
        json.dump(ck.results, f, indent=2)
    raise SystemExit(1 if ck.failed else 0)


if __name__ == "__main__":
    main()
