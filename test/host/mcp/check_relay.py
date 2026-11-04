#!/usr/bin/env python3
"""Check ss-relay end to end, over stdio like an agent, against a device.

    check_relay.py --host 192.168.1.249 --relay /path/to/ss-relay --mpy-cross /path/to/mpy-cross

Writes under /_relay_check on the device, and removes it. --app also syncs that app directory,
which leaves it installed.
"""

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
import threading
import time
from queue import Empty, Queue

from check_m1 import Check, expect
from mcp_client import Ws, token

ROOT = "/_relay_check"
UNREACHABLE = "ws://127.0.0.1:9/mcp"
OFFLINE_NOTE_S = 3


class Relay:
    """An MCP client over stdio, as Claude Code or the SDK would be."""

    def __init__(self, command, password):
        env = {**os.environ, "SS_RELAY_PASSWORD": password}
        self.process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, env=env, text=True)
        self.replies = {}
        self.notes = Queue()
        self.next_id = 0
        self.lock = threading.Condition()
        threading.Thread(target=self._read, daemon=True).start()

    def _read(self):
        for line in self.process.stdout:
            message = json.loads(line)
            if "id" in message and "method" not in message:
                with self.lock:
                    self.replies[message["id"]] = message
                    self.lock.notify_all()
            else:
                self.notes.put(message)

    def call(self, method, params=None, timeout=120):
        self.next_id += 1
        mid = self.next_id
        message = {"jsonrpc": "2.0", "id": mid, "method": method}
        if params is not None:
            message["params"] = params
        self.process.stdin.write(json.dumps(message) + "\n")
        self.process.stdin.flush()
        with self.lock:
            if not self.lock.wait_for(lambda: mid in self.replies, timeout):
                raise TimeoutError(f"no reply to {method}")
            return self.replies.pop(mid)

    def tool(self, name, /, timeout=300, **args):
        reply = self.call("tools/call", {"name": name, "arguments": args}, timeout)
        expect("result" in reply, reply)
        return reply["result"]

    def ok(self, name, /, **args):
        result = self.tool(name, **args)
        text = result["content"][0]["text"]
        expect(not result.get("isError"), f"{name} failed: {text}")
        return text

    def ok_json(self, name, /, **args):
        return json.loads(self.ok(name, **args))

    def close(self):
        self.process.stdin.close()
        self.process.wait(timeout=10)


def write(folder, name, data):
    path = os.path.join(folder, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)
    return path


def tool_names(relay):
    return {t["name"] for t in relay.call("tools/list")["result"]["tools"]}


def check_offline(ck, command):
    def host_tools_without_a_device():
        relay = Relay(command, "password")
        try:
            reply = relay.call("initialize", {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "check", "version": "1"}})
            expect(reply["result"]["capabilities"]["tools"]["listChanged"] is True, reply)
            names = tool_names(relay)
            expect("sync" in names and "exec" not in names, names)
            result = relay.tool("fs_pull", remote="/x", local="/tmp/x")
            expect(result.get("isError") and "Not connected" in result["content"][0]["text"], result)
            reply = relay.call("tools/call", {"name": "exec", "arguments": {"code": "1"}})
            expect("error" in reply, reply)
        finally:
            relay.close()

    ck.run("offline: host tools still work, device tools don't appear", host_tools_without_a_device)


def check_device(ck, relay, folder, args):
    def clean_up():
        relay.ok("exec", code=(
            "import os\n"
            "def rm(p):\n"
            "    try:\n"
            "        for n in os.listdir(p):\n"
            "            rm(p + '/' + n)\n"
            "        os.rmdir(p)\n"
            "    except OSError:\n"
            "        try:\n"
            "            os.remove(p)\n"
            "        except OSError:\n"
            "            pass\n"
            f"rm('{ROOT}')\n"
        ))
        # Unregisters it too, or the board goes on listing an app with no files
        relay.tool("scripto_remove", id="relaycheck")

    # A filtered or failed run can leave files, which would change what this one sees
    clean_up()

    def read_text(path):
        return relay.ok_json("fs_read_text", path=path)["text"]

    def passes_device_tools_through():
        reply = relay.call("initialize", {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "check", "version": "1"}})
        expect(reply["result"]["serverInfo"]["name"] == "scriptostudio-device", reply)
        names = tool_names(relay)
        expect({"exec", "device_info", "fs_hash", "fs_push", "fs_pull", "sync", "discover", "flash"} <= names, names)
        expect(not names & {"stream_open", "stream_close"}, names)
        expect(relay.ok_json("device_info")["transport"] == "websocket", "not on the socket")
        expect(relay.ok("exec", code="print(6 * 7)").strip() == "42", "wrong answer")
        result = relay.tool("exec", code="1/0")
        expect(result.get("isError") and "ZeroDivisionError" in result["content"][0]["text"], result)

    def push_and_pull():
        data = os.urandom(70000)
        local = write(folder, "up.bin", data)
        pushed = relay.ok_json("fs_push", local=local, remote=f"{ROOT}/deep/up.bin")
        expect(pushed["bytes"] == len(data), pushed)
        back = os.path.join(folder, "back.bin")
        relay.ok_json("fs_pull", remote=f"{ROOT}/deep/up.bin", local=back)
        with open(back, "rb") as f:
            expect(f.read() == data, "pulled different bytes")
        return {"up_kB_s": round(len(data) / 1024 / pushed["seconds"], 1)}

    def pull_missing_file_is_refused():
        result = relay.tool("fs_pull", remote=f"{ROOT}/nope", local=os.path.join(folder, "nope"))
        expect(result.get("isError"), result)
        expect(not os.path.exists(os.path.join(folder, "nope")), "left a file behind")

    tree = os.path.join(folder, "tree")

    def sync_copies_then_skips():
        write(tree, "a.txt", b"one")
        write(tree, "sub/b.txt", b"two" * 1000)
        write(tree, "__pycache__/skip.pyc", b"no")
        first = relay.ok_json("sync", local=tree, remote=ROOT + "/tree")
        expect(first["copied"] == 2 and first["unchanged"] == 0, first)
        expect(read_text(f"{ROOT}/tree/a.txt") == "one", "wrong content")
        second = relay.ok_json("sync", local=tree, remote=ROOT + "/tree")
        expect(second["copied"] == 0 and second["unchanged"] == 2, second)
        write(tree, "a.txt", b"changed")
        third = relay.ok_json("sync", local=tree, remote=ROOT + "/tree")
        expect(third["copied"] == 1 and third["changed"] == [f"{ROOT}/tree/a.txt"], third)
        return {"rerun_s": second["seconds"]}

    def dry_run_copies_nothing():
        write(tree, "a.txt", b"dry")
        plan = relay.ok_json("sync", local=tree, remote=ROOT + "/tree", dry_run=True)
        expect(plan["dry_run"] and plan["copied"] == 1, plan)
        expect(read_text(f"{ROOT}/tree/a.txt") == "changed", "dry run wrote")

    def prune_removes_only_extras():
        relay.ok_json("fs_push", local=write(folder, "extra", b"x"), remote=f"{ROOT}/tree/extra.txt")
        done = relay.ok_json("sync", local=tree, remote=ROOT + "/tree", prune=True)
        expect(done["removed"] == 1, done)
        expect(relay.tool("fs_stat", path=f"{ROOT}/tree/extra.txt").get("isError"), "extra is still there")
        expect(not relay.tool("fs_stat", path=f"{ROOT}/tree/sub/b.txt").get("isError"), "pruned a real file")

    def firmware_check_refuses():
        bad = os.path.join(folder, "needs_new_firmware")
        write(bad, "x.py", b"import mcplink\nmcplink.no_such_function()\n")
        result = relay.tool("sync", local=bad, remote=ROOT + "/bad")
        text = result["content"][0]["text"]
        expect(result.get("isError") and "no_such_function" in text, text)
        expect(relay.tool("fs_stat", path=f"{ROOT}/bad/x.py").get("isError"), "copied it anyway")
        forced = relay.ok_json("sync", local=bad, remote=ROOT + "/bad", force=True)
        expect(forced["copied"] == 1, forced)

    def board_files_are_kept():
        before = relay.ok_json("fs_hash", path="/settings/board.json")["sha256"]
        tree_b = os.path.join(folder, "board_tree")
        write(tree_b, "settings/board.json", b'{"not": "this board"}')
        write(tree_b, "firmware-version.json", b"{}")
        done = relay.ok_json("sync", local=tree_b, remote="/", dry_run=True)
        expect(done["copied"] == 0 and len(done["kept"]) == 2, done)
        done = relay.ok_json("sync", local=tree_b, remote="/")
        expect(done["copied"] == 0, done)
        expect(relay.ok_json("fs_hash", path="/settings/board.json")["sha256"] == before, "overwrote board.json")

    app = os.path.join(folder, "app")

    def app_data_is_kept_and_code_compiled():
        write(app, "extension.json", json.dumps({
            "id": "relaycheck",
            "name": "Relay check",
            "version": [1, 0, 0],
            "devicePaths": {
                "lib/mod.py": "/lib/ext/relaycheck/mod.py",
                "data/seed.json": f"{ROOT}/appdata/seed.json",
                "../extension.json": "/lib/ext/relaycheck/extension.json",
            },
        }).encode())
        write(app, "device/lib/mod.py", b"VALUE = 1\n")
        write(app, "device/data/seed.json", b'{"from": "host"}')
        first = relay.ok_json("sync", local=app, mpy_cross=args.mpy_cross)
        expect(first["copied"] == 3, first)
        expect(not relay.tool("fs_stat", path="/lib/ext/relaycheck/mod.mpy").get("isError"), "not compiled")
        expect(relay.tool("fs_stat", path="/lib/ext/relaycheck/mod.py").get("isError"), "left the source")
        expect(relay.ok("exec", code="from lib.ext.relaycheck import mod\nprint(mod.VALUE)").strip() == "1", "won't import")
        relay.ok("fs_write_text", path=f"{ROOT}/appdata/seed.json", text='{"from": "user"}')
        write(app, "device/data/seed.json", b'{"from": "newer host"}')
        write(app, "device/lib/mod.py", b"VALUE = 2\n")
        second = relay.ok_json("sync", local=app, mpy_cross=args.mpy_cross)
        expect(second["copied"] == 1 and second["changed"] == ["/lib/ext/relaycheck/mod.mpy"], second)
        expect(second["kept"] == [f"{ROOT}/appdata/seed.json"], second)
        expect("user" in read_text(f"{ROOT}/appdata/seed.json"), "overwrote the app's data")

    def wrong_mpy_cross_is_refused():
        fake = write(folder, "fake-mpy-cross", b'#!/bin/sh\necho "MicroPython v9; mpy-cross emitting mpy v99.0"\n')
        os.chmod(fake, 0o755)
        write(app, "device/lib/mod.py", b"VALUE = 3\n")
        result = relay.tool("sync", local=app, mpy_cross=fake)
        expect(result.get("isError") and "v99.0" in result["content"][0]["text"], result)

    def survives_a_device_reset():
        relay.ok("reset", mode="soft")
        deadline = time.time() + 40
        while time.time() < deadline:
            result = relay.tool("device_info")
            if not result.get("isError"):
                return
            time.sleep(2)
        raise AssertionError("never came back")

    def cancel_frees_the_board():
        """What an agent's stop button comes down to: another client gets the board straight after."""
        relay.next_id += 1
        mid = relay.next_id
        call = {"name": "exec", "arguments": {"code": "while True:\n    pass"}}
        relay.process.stdin.write(json.dumps({"jsonrpc": "2.0", "id": mid, "method": "tools/call", "params": call}) + "\n")
        relay.process.stdin.flush()
        time.sleep(0.5)
        begin = time.time()
        note = {"jsonrpc": "2.0", "method": "notifications/cancelled", "params": {"requestId": mid}}
        relay.process.stdin.write(json.dumps(note) + "\n")
        relay.process.stdin.flush()
        with relay.lock:
            expect(relay.lock.wait_for(lambda: mid in relay.replies, 3), "the call didn't stop")
            reply = relay.replies.pop(mid)
        stopped = time.time() - begin
        expect("KeyboardInterrupt" in reply["result"]["content"][0]["text"], reply)
        other = Ws(f"{args.scheme}://{args.host}/mcp", token(args.password, "human"))
        try:
            begin = time.time()
            expect("41" in other.tool("exec", code="print(40 + 1)"), "the other client got no answer")
            answered = time.time() - begin
        finally:
            other.close()
        return {"stopped_ms": int(stopped * 1000), "other_client_ms": int(answered * 1000)}

    def discover_finds_this_device():
        found = relay.ok_json("discover", seconds=4)
        expect(found, "found nothing")
        match = [d for d in found if args.host in d["addresses"] or args.host in d["host"]]
        expect(match, found)
        expect(match[0]["txt"].get("path") == "/mcp", match)
        return {"url": match[0]["url"], "board": match[0]["txt"].get("board")}

    ck.run("relay: passes device tools through", passes_device_tools_through)
    ck.run("relay: cancelling a call frees the board for another client", cancel_frees_the_board)
    ck.run("relay: push and pull by path", push_and_pull)
    ck.run("relay: a missing file is refused", pull_missing_file_is_refused)
    ck.run("sync: copies, then skips, then copies only what changed", sync_copies_then_skips)
    ck.run("sync: a dry run copies nothing", dry_run_copies_nothing)
    ck.run("sync: prune removes only extras", prune_removes_only_extras)
    ck.run("sync: refuses scripts needing newer firmware", firmware_check_refuses)
    ck.run("sync: a board's own files are kept", board_files_are_kept)
    ck.run("sync: an app's data is kept, its code is compiled", app_data_is_kept_and_code_compiled)
    ck.run("sync: the wrong mpy-cross is refused", wrong_mpy_cross_is_refused)
    if not args.no_discover:
        ck.run("discover: finds this device", discover_finds_this_device)
    if not args.no_reset:
        ck.run("relay: survives a device reset", survives_a_device_reset)

    clean_up()


def check_app(ck, relay, args):
    """All of an app, by path, then a rerun that copies only what changed."""
    folder = tempfile.mkdtemp(prefix="relay-app-")
    copy = os.path.join(folder, "app")
    shutil.copytree(args.app, copy, ignore=shutil.ignore_patterns("node_modules", ".git", "*.bundle.js", "docs", "tests", "pfc-mcp-*"))
    try:
        def first():
            done = relay.ok_json("sync", local=copy, mpy_cross=args.mpy_cross)
            expect(not [p for p in done["changed"] if not p.startswith("/lib/")], done)
            return {k: done[k] for k in ("copied", "unchanged", "bytes", "seconds")} | {"kept": len(done["kept"])}

        def rerun():
            done = relay.ok_json("sync", local=copy, mpy_cross=args.mpy_cross)
            expect(done["copied"] == 0, done)
            return {k: done[k] for k in ("unchanged", "seconds")}

        def one_changed():
            path = os.path.join(copy, "device/lib/workspace.py")
            with open(path, "a") as f:
                f.write("\n_RELAY_CHECK = 1\n")
            done = relay.ok_json("sync", local=copy, mpy_cross=args.mpy_cross)
            expect(done["copied"] == 1, done)
            shutil.copy(os.path.join(args.app, "device/lib/workspace.py"), path)
            back = relay.ok_json("sync", local=copy, mpy_cross=args.mpy_cross)
            expect(back["copied"] == 1, back)
            return {"changed": done["changed"], "seconds": done["seconds"]}

        ck.run("app: the first sync", first)
        ck.run("app: a rerun copies nothing", rerun)
        ck.run("app: one changed file copies one file", one_changed)
    finally:
        shutil.rmtree(folder)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--relay", required=True, help="the ss-relay command")
    ap.add_argument("--password", default="password")
    ap.add_argument("--scheme", default="wss")
    ap.add_argument("--mpy-cross", required=True)
    ap.add_argument("--app", help="also sync this app directory, which leaves it installed")
    ap.add_argument("--no-discover", action="store_true")
    ap.add_argument("--no-reset", action="store_true")
    ap.add_argument("--only", default=None)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    ck = Check(args.only)
    check_offline(ck, [args.relay, "--device", UNREACHABLE])
    folder = tempfile.mkdtemp(prefix="relay-check-")
    relay = Relay([args.relay, "--device", f"{args.scheme}://{args.host}/mcp"], args.password)
    try:
        check_device(ck, relay, folder, args)
        if args.app:
            check_app(ck, relay, args)
    finally:
        relay.close()
        shutil.rmtree(folder)

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    out = args.out or f"relay-{args.host}-{int(time.time())}.json"
    with open(out, "w") as f:
        json.dump(ck.results, f, indent=2)
    raise SystemExit(1 if ck.failed else 0)


if __name__ == "__main__":
    main()
