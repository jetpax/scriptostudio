#!/usr/bin/env python3
"""Check that a person can follow and stop what an agent does on a device, and stays connected.

    check_watching.py --host 192.168.1.50
    check_watching.py --host 192.168.1.50 --scheme wss

Holds up to three connections, so close anything else connected to the device first. The last
check resets it.
"""

import argparse
import json
import socket
import threading
import time

from websockets.exceptions import ConnectionClosed

from check_m1 import Check, expect
from mcp_client import Http, Ws, token

EVENT = "notifications/com.scriptostudio/event"
PATH = "/watch_check.txt"
FOLDER = "/watch_check"
APP_ID = "watch-check"
APP_CODE = "import asyncio\n\nasync def run():\n    while True:\n        await asyncio.sleep_ms(100)\n"
CRASH_CODE = "async def run():\n    raise RuntimeError('on purpose')\n"
HELD = 3
# A session idle through two sweeps of the board's 20 s timer, and a margin
IDLE_CLOSED_S = 50
SEEN_LATE_S = 1.0
STOP_WITHIN_S = 1.5
QUIET_S = 0.5


def wait_for(person, key, match=lambda value: True, timeout=8):
    """The next event with this key that matches. Others on the way are dropped."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        note = person.next_note(deadline - time.time())
        if note and note.get("method") == EVENT and key in note["params"] and match(note["params"][key]):
            return note["params"][key]
    raise AssertionError(f"no {key} event came")


def assert_quiet(client, key):
    """Nothing with this key arrives."""
    deadline = time.time() + QUIET_S
    while time.time() < deadline:
        note = client.next_note(deadline - time.time())
        if note and note.get("method") == EVENT:
            expect(key not in note["params"], f"got {note['params']}")


def drain(client):
    while client.next_note(0.05):
        pass


def refused(url, tok):
    """Open a connection past the limit, and say how the device answered."""
    newcomer = Ws(url, tok, timeout=10)
    try:
        newcomer.ws.recv(timeout=5)
        return None
    except ConnectionClosed as e:
        return e.rcvd.code, e.rcvd.reason
    except TimeoutError:
        return None
    finally:
        newcomer.close()


def check(ck, args, url):
    person = Ws(url, token(args.password, "human"))
    agent = Ws(url, token(args.password, "agent"))

    def exec_shows_code_then_output():
        drain(person)
        mid = agent.send("tools/call", {"name": "exec", "arguments": {"code": "print('hi from the agent')"}})
        running = wait_for(person, "agent_activity")
        expect(running["state"] == "running" and running["tool"] == "exec", running)
        expect("hi from the agent" in running["code"], running)
        done = wait_for(person, "agent_activity", lambda row: row["id"] == running["id"])
        expect(done["state"] == "done" and "hi from the agent" in done["output"], done)
        agent.wait(mid)
        assert_quiet(agent, "agent_activity")

    def it_shows_while_the_call_holds_the_board():
        drain(person)
        started = time.time()
        mid = agent.send("tools/call", {"name": "exec", "arguments": {"code": "import time\ntime.sleep_ms(2500)"}})
        wait_for(person, "agent_activity")
        seen_after = time.time() - started
        expect(seen_after < SEEN_LATE_S, seen_after)
        agent.wait(mid)
        return {"seen_after_s": round(seen_after, 2)}

    def a_failure_says_why():
        drain(person)
        agent.send("tools/call", {"name": "exec", "arguments": {"code": "1/0"}})
        done = wait_for(person, "agent_activity", lambda row: row["state"] != "running")
        expect(done["state"] == "failed" and "ZeroDivisionError" in done["output"], done)

    def it_says_who():
        drain(person)
        agent.call("initialize", {"protocolVersion": "2025-11-25", "clientInfo": {"name": "claude-code", "version": "1"}})
        agent.tool("fs_stat", path="/")
        row = wait_for(person, "agent_activity")
        expect(row["who"] == "claude-code" and row["tool"] == "fs_stat" and row["args"]["path"] == "/", row)
        return {"who": row["who"]}

    def a_persons_own_calls_arent_reported():
        drain(person)
        person.tool("exec", code="print(1)")
        person.tool("fs_stat", path="/")
        assert_quiet(person, "agent_activity")

    def file_writes_are_announced():
        drain(person)
        agent.tool("fs_write_text", path=PATH, text="one")
        change = wait_for(person, "file_changed")
        expect(change == {"path": PATH, "op": "wrote", "who": "claude-code"}, change)
        agent.write_file(PATH, b"two")
        change = wait_for(person, "file_changed")
        expect(change["path"] == PATH and change["op"] == "wrote", change)
        agent.tool("fs_mkdir", path=FOLDER)
        expect(wait_for(person, "file_changed")["op"] == "made", "no mkdir event")
        agent.tool("fs_rm", path=FOLDER)
        agent.tool("fs_rm", path=PATH)
        expect(wait_for(person, "file_changed")["path"] == FOLDER, "no rmdir event")
        change = wait_for(person, "file_changed")
        expect(change["path"] == PATH and change["op"] == "removed", change)
        assert_quiet(agent, "file_changed")

    def stop_breaks_an_agents_call():
        drain(person)
        started = time.time()
        mid = agent.send("tools/call", {"name": "exec", "arguments": {"code": "while True:\n    pass"}})
        wait_for(person, "agent_activity")
        person.send_interrupt_frame()
        result = agent.wait(mid)
        taken = time.time() - started
        expect(result.get("isError") and "KeyboardInterrupt" in result["content"][0]["text"], result)
        expect(taken < STOP_WITHIN_S, taken)
        done = wait_for(person, "agent_activity", lambda row: row["state"] == "failed")
        expect("KeyboardInterrupt" in done["output"], done)
        return {"stopped_after_s": round(taken, 2)}

    def stop_with_nothing_running_is_harmless():
        person.send_interrupt_frame()
        time.sleep(0.2)
        expect("still here" in agent.tool("exec", code="print('still here')"), "the next call was hurt")

    def app_changes_are_pushed():
        drain(person)
        agent.tool("app_create", id=APP_ID, code=APP_CODE, name="Watch check")
        wait_for(person, "apps_changed")
        row = wait_for(person, "agent_activity", lambda row: row["tool"] == "app_create")
        expect(row["args"]["id"] == APP_ID and "code" not in row["args"], row)
        drain(person)
        agent.tool("app_create", id=APP_ID, code=CRASH_CODE)
        wait_for(person, "apps_changed")
        time.sleep(1)
        rows = {r["id"]: r for r in person.tool_json("apps_list")["apps"]}
        expect("on purpose" in (rows[APP_ID]["error"] or ""), rows[APP_ID])
        drain(person)
        person.tool("stop_user_tasks")
        wait_for(person, "apps_changed")
        agent.tool("app_remove", id=APP_ID)

    def an_app_tool_shows_while_it_runs():
        if "can_capture" not in {t["name"] for t in agent.call("tools/list")["tools"]}:
            return {"skipped": "no CAN on this board"}
        drain(person)
        mid = agent.send("tools/call", {"name": "can_capture", "arguments": {"seconds": 1}})
        row = wait_for(person, "agent_activity", lambda r: r["tool"] == "can_capture")
        expect(row["state"] == "running", row)
        done = wait_for(person, "agent_activity", lambda r: r["id"] == row["id"])
        expect(done["state"] == "done", done)
        agent.wait(mid)
        return {"ms": done["ms"]}

    def nobody_gets_pushed_off():
        other = Ws(url, token(args.password, "agent"))
        try:
            answers = []
            for _ in range(5):
                answers.append(refused(url, token(args.password, "agent")))
            for answer in answers:
                expect(answer == (1008, "full"), answers)
            for holder in (person, agent, other):
                holder.call("ping")
            person_answer = refused(url, token(args.password, "human"))
            expect(person_answer == (1008, "full"), person_answer)
            person.call("ping")
            expect(Http(f"{args.http_scheme}://{args.host}/mcp", token(args.password, "agent")).tool("fs_stat", path="/"), "HTTP didn't answer")
        finally:
            other.close()
        for _ in range(20):
            time.sleep(0.25)
            try:
                newcomer = Ws(url, token(args.password, "agent"))
                newcomer.call("ping")
                newcomer.close()
                return {"held": HELD}
            except (ConnectionClosed, OSError):
                pass
        raise AssertionError("a newcomer never got in after someone left")

    def an_idle_socket_doesnt_block_anyone():
        other = Ws(url, token(args.password, "agent"))
        idle = socket.create_connection((args.host, 443 if url.startswith("wss") else 80), timeout=5)
        answered = threading.Event()
        started = time.time()
        taken = []
        failure = []

        def ask():
            try:
                Http(f"{args.http_scheme}://{args.host}/mcp", token(args.password, "agent"), timeout=IDLE_CLOSED_S + 10).tool("fs_stat", path="/")
                taken.append(time.time() - started)
            except Exception as e:
                failure.append(repr(e))
            answered.set()

        try:
            threading.Thread(target=ask, daemon=True).start()
            expect(answered.wait(IDLE_CLOSED_S + 15), "nothing answered")
            expect(not failure and taken[0] <= IDLE_CLOSED_S, (failure, taken))
            for holder in (person, agent, other):
                holder.call("ping")
        finally:
            idle.close()
            other.close()
        return {"answered_after_s": round(taken[0], 1)}

    def a_reset_is_reported_first():
        drain(person)
        agent.tool("reset", mode="hard")
        row = wait_for(person, "agent_activity", lambda r: r["tool"] == "reset")
        expect(row["state"] == "done" and row["args"]["mode"] == "hard", row)

    ck.run("exec: a person sees the code, then the output, and the agent isn't told", exec_shows_code_then_output)
    ck.run("exec: it shows while the call holds the board", it_shows_while_the_call_holds_the_board)
    ck.run("exec: a failure says why", a_failure_says_why)
    ck.run("activity: it says who, by the name the client gave", it_says_who)
    ck.run("activity: a person's own calls aren't reported", a_persons_own_calls_arent_reported)
    ck.run("files: writes, folders and removals are announced", file_writes_are_announced)
    ck.run("stop: a person breaks an agent's call", stop_breaks_an_agents_call)
    ck.run("stop: with nothing running, it does no harm", stop_with_nothing_running_is_harmless)
    ck.run("apps: creating, crashing and stopping are pushed", app_changes_are_pushed)
    ck.run("apps: a tool that takes a while shows while it runs", an_app_tool_shows_while_it_runs)
    ck.run("sockets: a newcomer is refused, and nobody is pushed off", nobody_gets_pushed_off)
    ck.run("sockets: an idle socket can't block the board for good", an_idle_socket_doesnt_block_anyone)
    ck.run("reset: it's reported before it happens", a_reset_is_reported_first)
    person.close()
    agent.close()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--scheme", default="ws")
    ap.add_argument("--password", default="password")
    ap.add_argument("--only", default=None)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    args.http_scheme = "https" if args.scheme == "wss" else "http"

    ck = Check(args.only)
    check(ck, args, f"{args.scheme}://{args.host}/mcp")

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    with open(args.out or f"watching-{args.host}-{int(time.time())}.json", "w") as f:
        json.dump(ck.results, f, indent=2)
    raise SystemExit(1 if ck.failed else 0)


if __name__ == "__main__":
    main()
