#!/usr/bin/env python3
"""Check that an agent can leave code on a device that runs by itself, with or without a network.

    check_boot_apps.py --host 192.168.1.50 --relay /path/to/ss-relay

Creates apps named boot-check-*, resets the device several times, and removes the apps. One
check takes the device off the network for a while: it points WiFi at a network that doesn't
exist, and an app on the device measures, restores the setting and resets by itself.
"""

import argparse
import json
import subprocess
import time

from check_m1 import Check, expect
from check_relay import Relay

PREFIX = "boot-check"
COUNT_ID = PREFIX + "-count"
HOG_ID = PREFIX + "-hog"
CRASH_ID = PREFIX + "-crash"
OFFLINE_ID = PREFIX + "-offline"
WATCH_ID = PREFIX + "-watch"
PANIC_ID = PREFIX + "-panic"
LED_ID = PREFIX + "-led"
ENDS_ID = PREFIX + "-ends"
INTERRUPT_TASK = PREFIX + "-interrupt"
OFFLINE_RESULT = "/boot_check_offline.json"
OFFLINE_SECONDS = 75
OFFLINE_MAX_GAP_MS = 500
HOG_BROKEN_S = 16
# More than there are streams, so a watch left open by each run would run out
WATCH_RESTARTS = 12
LEFT_OUT_AFTER_CRASHES = 3
# Long enough for a crashed app to retry twice, if it's going to
CRASH_RETRIES_S = 2.5

COUNT_CODE = """
import asyncio, __main__, time

async def run():
    __main__._boot_first_ms = time.ticks_ms()
    __main__._boot_ticks = 0
    while True:
        __main__._boot_ticks += 1
        await asyncio.sleep_ms(50)
"""

HOG_CODE = """
async def run():
    while True:
        pass
"""

CRASH_CODE = """
async def run():
    raise RuntimeError("failed on purpose")
"""

WATCH_CODE = """
import asyncio, __main__
from lib.sys import can_tap

async def run():
    watcher = can_tap.watch([0x123])
    __main__._boot_watch = watcher._stream
    while True:
        watcher.read()
        await asyncio.sleep_ms(50)
"""

LED_CODE = """
import asyncio
from lib.sys.status_led import status_led

async def run():
    status_led.set_color((0, 255, 0))
    while True:
        await asyncio.sleep(1)
"""

RETURNS_CODE = """
async def run():
    pass
"""

CANCELS_CODE = """
import asyncio

async def run():
    raise asyncio.CancelledError()
"""

INTERRUPT_A_SYSTEM_TASK = """
from lib.sys import bg_tasks

_interrupted = []

async def _interrupt():
    if not _interrupted:
        _interrupted.append(1)
        raise KeyboardInterrupt

bg_tasks.start(%r, _interrupt, is_system=True)
"""

INTERRUPT_THE_LOOP = """
import asyncio

async def _interrupt():
    raise KeyboardInterrupt

asyncio.create_task(_interrupt())
"""

PANIC_CODE = """
import machine

async def run():
    machine.mem32[0] = 1
"""

# It holds the real SSID, since nothing can reach it to put that back while it's away
OFFLINE_CODE = """
import asyncio, json, machine, time
from lib.sys import apps, settings

SECONDS = %d
REAL_SSID = %r

async def run():
    start = time.ticks_ms()
    last = start
    worst = 0
    ticks = 0
    while time.ticks_diff(time.ticks_ms(), start) < SECONDS * 1000:
        await asyncio.sleep_ms(20)
        now = time.ticks_ms()
        worst = max(worst, time.ticks_diff(now, last))
        last = now
        ticks += 1
    from lib.sys.network import wifi
    with open(%r, "w") as f:
        json.dump({"worst_gap_ms": worst, "ticks": ticks, "started_at_ms": start, "connected": wifi.is_connected()}, f)
    settings.set("wifi.ssid", REAL_SSID)
    settings.save()
    apps.set_run_at_boot(%r, False)
    machine.reset()
"""


def wait_for_board(host, gone_first=True, timeout=120):
    deadline = time.time() + timeout
    if gone_first:
        while time.time() < deadline and subprocess.run(["ping", "-c", "1", "-t", "1", host], capture_output=True).returncode == 0:
            time.sleep(0.5)
    while time.time() < deadline:
        if subprocess.run(["curl", "-s", "-m", "2", "-o", "/dev/null", f"http://{host}/mcp"], capture_output=True).returncode == 0:
            time.sleep(1)
            return True
        time.sleep(1)
    return False


class Bench:
    def __init__(self, args):
        self.args = args
        self.relay = None
        self.connect()

    def connect(self):
        self.relay = Relay([self.args.relay, "--device", f"{self.args.scheme}://{self.args.host}/mcp"], self.args.password)
        for _ in range(100):
            if "scripto_create" in {t["name"] for t in self.relay.call("tools/list")["result"]["tools"]}:
                return
            time.sleep(0.2)
        raise TimeoutError("the device has no scripto_create tool")

    def reset(self):
        self.relay.tool("reset", mode="hard")
        self.relay.close()
        expect(wait_for_board(self.args.host), "the device never came back")
        self.connect()

    def app(self, app_id):
        rows = self.relay.ok_json("scriptos_list")["scriptos"]
        return next((row for row in rows if row["id"] == app_id), None)

    def create(self, app_id, code, **args):
        return json.loads(self.relay.ok("scripto_create", id=app_id, code=code, **args))

    def evaluate(self, code):
        return self.relay.ok("exec", code=code, echo=False).strip()

    def led(self):
        return json.loads(self.evaluate("import json\nfrom lib.sys.status_led import status_led\nprint(json.dumps(status_led.np[0]))"))

    def remove_all(self):
        for row in self.relay.ok_json("scriptos_list")["scriptos"]:
            if row["id"].startswith(PREFIX):
                self.relay.tool("scripto_remove", id=row["id"])


def check(ck, bench, args):
    def refuses_bad_code():
        for app_id, code, why in (
            ("Bad Id", "async def run():\n    pass", "id"),
            (COUNT_ID, "async def run(:\n", "syntax"),
            (COUNT_ID, "x = 1\n", "async def run"),
        ):
            result = bench.relay.tool("scripto_create", id=app_id, code=code)
            expect(result.get("isError"), (why, result))
        expect(bench.app(COUNT_ID) is None, "a refused app was recorded")

    def create_starts_it_and_says_so():
        row = bench.create(COUNT_ID, COUNT_CODE, name="Count", run_at_boot=True)
        expect(row["run_at_boot"] is True and row["state"] == "running", row)
        time.sleep(1)
        expect(int(bench.evaluate("import __main__\nprint(__main__._boot_ticks)")) > 5, "it isn't running")
        return row

    def survives_a_reset():
        bench.reset()
        row = bench.app(COUNT_ID)
        expect(row["run_at_boot"] is True and row["state"] == "running", row)
        first = int(bench.evaluate("import __main__\nprint(__main__._boot_ticks)"))
        time.sleep(1)
        later = int(bench.evaluate("import __main__\nprint(__main__._boot_ticks)"))
        expect(later > first, "it isn't counting")
        started = int(bench.evaluate("import __main__\nprint(__main__._boot_first_ms)"))
        return {"started_at_ms": started}

    def the_switch_turns_it_off():
        row = json.loads(bench.relay.ok("scripto_run_at_boot", id=COUNT_ID, on=False))
        expect(row["run_at_boot"] is False, row)
        bench.reset()
        row = bench.app(COUNT_ID)
        expect(row["run_at_boot"] is False and row["state"] == "not started", row)
        row = json.loads(bench.relay.ok("scripto_start", id=COUNT_ID))
        expect(row["state"] == "running", row)
        row = json.loads(bench.relay.ok("scripto_stop", id=COUNT_ID))
        time.sleep(0.5)
        expect(bench.app(COUNT_ID)["state"] != "running", row)

    def a_restart_leaves_one_copy_running():
        def ticks():
            return int(bench.evaluate("import __main__\nprint(__main__._boot_ticks)"))

        bench.create(COUNT_ID, COUNT_CODE)
        time.sleep(0.5)
        expect(bench.app(COUNT_ID)["state"] == "running", "a second scripto_create")
        for _ in range(2):
            bench.relay.ok("scripto_start", id=COUNT_ID)
            time.sleep(0.5)
            row = bench.app(COUNT_ID)
            expect(row["state"] == "running", row)
        bench.relay.ok("scripto_stop", id=COUNT_ID)
        time.sleep(0.5)
        expect(bench.app(COUNT_ID)["state"] != "running", "it didn't stop")
        first = ticks()
        time.sleep(1)
        expect(ticks() == first, "a copy kept running")

    def has_led():
        return bench.evaluate("from lib.sys import board\nprint(board.has('status_led'))") == "True"

    def led_colors_stay_what_they_are():
        if not has_led():
            return {"skipped": "no status LED on this board"}
        code = "import json\nfrom lib.sys.status_led import status_led, AMBER, RED\nstatus_led.set_color(AMBER)\namber = status_led.np[0]\nstatus_led.set_color(RED)\nprint(json.dumps([amber, status_led.np[0]]))"
        amber, red = json.loads(bench.evaluate(code))
        expect(amber[0] > 0 and amber[1] > 0 and amber[1] * 3 > amber[0], amber)
        expect(red[0] > 0 and red[1] == 0, red)
        bench.relay.ok("stop_user_tasks")
        expect(bench.led() != red, "stop didn't give the LED back")
        return {"amber": amber, "red": red}

    def an_app_keeps_the_led_until_it_ends():
        if not has_led():
            return {"skipped": "no status LED on this board"}

        def the_apps_color(why):
            red, green, blue = bench.led()
            expect(green > 0 and red == 0 and blue == 0, (why, red, green, blue))

        bench.create(LED_ID, LED_CODE, name="LED", run_at_boot=True)
        time.sleep(0.5)
        the_apps_color("started")
        other = Relay([args.relay, "--device", f"{args.scheme}://{args.host}/mcp"], args.password)
        other.call("tools/list")
        the_apps_color("a client came")
        other.close()
        time.sleep(1)
        the_apps_color("a client left")
        bench.create(COUNT_ID, COUNT_CODE)
        bench.relay.ok("scripto_stop", id=COUNT_ID)
        time.sleep(0.5)
        the_apps_color("another app ended")
        bench.reset()
        the_apps_color("after a reset")
        bench.relay.ok("scripto_stop", id=LED_ID)
        time.sleep(0.5)
        expect(bench.led()[2] > 0, "the board's own color didn't come back")
        bench.relay.tool("scripto_remove", id=LED_ID)

    def it_says_why_it_stopped():
        name = "boot-check"
        bench.relay.call("initialize", {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": name, "version": "1"}})
        bench.create(COUNT_ID, COUNT_CODE)
        row = bench.app(COUNT_ID)
        expect(row["state"] == "running" and "why" not in row, row)

        bench.relay.ok("scripto_stop", id=COUNT_ID)
        row = bench.app(COUNT_ID)
        expect(row["state"] == "stopped" and row["why"] == f"Stopped by {name}", row)
        expect(abs(row["stopped_at"] - time.time()) < 300, ("the clock", row))
        expect(not row["error"], row)

        bench.relay.ok("scripto_start", id=COUNT_ID)
        time.sleep(0.3)
        row = bench.app(COUNT_ID)
        expect(row["state"] == "running" and "why" not in row, ("start forgets it", row))
        bench.relay.ok("stop_user_tasks")
        row = bench.app(COUNT_ID)
        expect(row["why"] == f"Stopped by {name}, with every other user task", row)

        bench.create(ENDS_ID, RETURNS_CODE)
        time.sleep(0.3)
        row = bench.app(ENDS_ID)
        expect(row["state"] == "stopped" and "Finished" in row["why"] and not row["error"], row)
        bench.relay.ok("scripto_stop", id=ENDS_ID)
        expect("Finished" in bench.app(ENDS_ID)["why"], "stopping it again changed why it stopped")

        bench.create(ENDS_ID, CANCELS_CODE)
        time.sleep(0.3)
        row = bench.app(ENDS_ID)
        expect(row["state"] == "stopped" and "without saying why" in row["why"], row)
        bench.relay.tool("scripto_remove", id=ENDS_ID)

    def an_interrupt_says_where_it_landed():
        bench.create(COUNT_ID, COUNT_CODE)
        bench.evaluate(INTERRUPT_A_SYSTEM_TASK % INTERRUPT_TASK)
        time.sleep(0.5)
        row = bench.app(COUNT_ID)
        expect(row["state"] == "stopped" and f"KeyboardInterrupt reached {INTERRUPT_TASK}" in row["why"], row)

        bench.create(COUNT_ID, COUNT_CODE)
        bench.create(LED_ID, COUNT_CODE, run_at_boot=True)
        bench.relay.tool("exec", code=INTERRUPT_THE_LOOP, echo=False)
        bench.relay.close()
        time.sleep(3)
        expect(wait_for_board(args.host, gone_first=False), "the device never came back")
        bench.connect()
        row = bench.app(COUNT_ID)
        expect(row["state"] == "not started" and "KeyboardInterrupt reached the event loop" in row["why"], ("left stopped", row))
        row = bench.app(LED_ID)
        expect(row["state"] == "running" and "why" not in row, ("started again", row))
        bench.relay.tool("scripto_remove", id=LED_ID)
        bench.relay.tool("scripto_remove", id=COUNT_ID)

    def a_crash_is_reported_and_retried():
        bench.create(CRASH_ID, CRASH_CODE)
        time.sleep(3.5)
        row = bench.app(CRASH_ID)
        expect(row["restarts"] >= 2 and "failed on purpose" in (row["error"] or ""), row)
        bench.relay.ok("scripto_stop", id=CRASH_ID)
        return {"restarts": row["restarts"]}

    def waiting_to_retry(app_id):
        row = bench.app(app_id)
        expect(row["state"] == "crashed", ("it isn't waiting to retry", row))

    def it_stays_stopped(app_id):
        before = bench.app(app_id)
        expect(before["state"] == "stopped", before)
        time.sleep(CRASH_RETRIES_S)
        after = bench.app(app_id)
        expect(after["restarts"] == before["restarts"], ("still retrying", before, after))
        return after

    def stopping_everything_stops_a_crashing_app():
        bench.create(CRASH_ID, CRASH_CODE)
        time.sleep(0.3)
        waiting_to_retry(CRASH_ID)
        bench.relay.ok("stop_user_tasks")
        row = it_stays_stopped(CRASH_ID)
        expect("with every other user task" in (row.get("why") or ""), row)
        return {"restarts": row["restarts"]}

    def a_restart_while_it_waits_leaves_one_copy():
        bench.create(CRASH_ID, CRASH_CODE)
        time.sleep(0.3)
        waiting_to_retry(CRASH_ID)
        bench.relay.ok("scripto_start", id=CRASH_ID)
        time.sleep(0.3)
        waiting_to_retry(CRASH_ID)
        bench.relay.ok("scripto_stop", id=CRASH_ID)
        row = it_stays_stopped(CRASH_ID)
        return {"restarts": row["restarts"]}

    def a_hog_at_boot_cant_lock_the_board_out():
        bench.create(HOG_ID, HOG_CODE, run_at_boot=True, start=False)
        bench.reset()
        time.sleep(HOG_BROKEN_S)
        row = bench.app(HOG_ID)
        expect(row["state"] != "running" and "held the event loop" in (row["error"] or ""), row)
        expect(row["why"] == row["error"], row)
        bench.relay.ok("scripto_run_at_boot", id=HOG_ID, on=False)
        return {"state": row["state"]}

    def a_can_app_at_boot_keeps_its_stream():
        if bench.evaluate("from lib.sys import can_tap\nprint(can_tap.available())") != "True":
            return {"skipped": "no CAN on this board"}
        bench.create(WATCH_ID, WATCH_CODE, run_at_boot=True, start=False)
        bench.reset()
        row = bench.app(WATCH_ID)
        expect(row["state"] == "running" and not row["error"], row)
        status = bench.evaluate("import __main__, mcplink\nprint(mcplink.stream_status(__main__._boot_watch))")
        expect(status.startswith("(True"), status)
        for _ in range(WATCH_RESTARTS):
            bench.relay.ok("scripto_stop", id=WATCH_ID)
            time.sleep(0.1)
            bench.relay.ok("scripto_start", id=WATCH_ID)
            time.sleep(0.2)
        row = bench.app(WATCH_ID)
        expect(row["state"] == "running" and not row["error"], row)
        bench.relay.ok("scripto_remove", id=WATCH_ID)

    def a_crash_in_c_at_boot_cant_lock_the_board_out():
        bench.create(PANIC_ID, PANIC_CODE, run_at_boot=True, start=False)
        bench.reset()
        row = bench.app(PANIC_ID)
        expect(row["state"] == "not started" and "crashed" in (row["error"] or ""), row)
        crashes = int(bench.evaluate("import mcplink\nprint(mcplink.boot_crashes())"))
        expect(crashes == LEFT_OUT_AFTER_CRASHES, crashes)
        bench.relay.ok("scripto_remove", id=PANIC_ID)
        bench.reset()
        crashes_after = int(bench.evaluate("import mcplink\nprint(mcplink.boot_crashes())"))
        expect(crashes_after == 0, crashes_after)
        return {"crashes": crashes}

    def removing_it_stops_it():
        bench.create(COUNT_ID, COUNT_CODE)
        first = int(bench.evaluate("import __main__\ntime = __import__('time')\ntime.sleep_ms(100)\nprint(__main__._boot_ticks)"))
        bench.relay.ok("scripto_remove", id=COUNT_ID)
        time.sleep(0.5)
        expect(bench.app(COUNT_ID) is None, "still listed")
        one = int(bench.evaluate("import __main__\nprint(__main__._boot_ticks)"))
        time.sleep(0.5)
        two = int(bench.evaluate("import __main__\nprint(__main__._boot_ticks)"))
        expect(one == two and first >= 0, "it's still counting")

    def runs_with_no_network_and_isnt_held_up():
        real = bench.evaluate("from lib.sys import settings\nprint(settings.get('wifi.ssid', ''))")
        expect(real, "no SSID configured")
        bench.relay.tool("fs_rm", path=OFFLINE_RESULT)
        bench.create(OFFLINE_ID, OFFLINE_CODE % (OFFLINE_SECONDS, real, OFFLINE_RESULT, OFFLINE_ID), run_at_boot=True, start=False)
        bench.evaluate("from lib.sys import settings\nsettings.set('wifi.ssid', 'boot-check-no-such-network')\nsettings.save()\nprint('ok')")
        bench.relay.tool("reset", mode="hard")
        bench.relay.close()
        time.sleep(OFFLINE_SECONDS)
        expect(wait_for_board(args.host, gone_first=False, timeout=150), "the device never came back")
        time.sleep(3)
        bench.connect()
        result = json.loads(bench.relay.ok_json("fs_read_text", path=OFFLINE_RESULT)["text"])
        bench.relay.tool("fs_rm", path=OFFLINE_RESULT)
        expect(result["connected"] is False, f"it had a network after all: {result}")
        expect(result["worst_gap_ms"] <= OFFLINE_MAX_GAP_MS, f"held up: {result}")
        return result

    ck.run("scripto_create: refuses a bad id, bad syntax, and code with no run()", refuses_bad_code)
    ck.run("scripto_create: starts it, and says it runs at boot", create_starts_it_and_says_so)
    ck.run("run at boot: survives a reset", survives_a_reset)
    ck.run("run at boot: the switch turns it off, and start and stop still work", the_switch_turns_it_off)
    ck.run("a restart leaves one copy running, and says so", a_restart_leaves_one_copy_running)
    ck.run("status LED: colors stay what they are, and stop gives it back", led_colors_stay_what_they_are)
    ck.run("status LED: an app keeps it until it ends", an_app_keeps_the_led_until_it_ends)
    ck.run("it says why it stopped", it_says_why_it_stopped)
    ck.run("an interrupt says where it landed", an_interrupt_says_where_it_landed)
    ck.run("a crash is reported and retried", a_crash_is_reported_and_retried)
    ck.run("stopping everything stops an app waiting to retry", stopping_everything_stops_a_crashing_app)
    ck.run("a restart while it waits to retry leaves one copy", a_restart_while_it_waits_leaves_one_copy)
    ck.run("a hog at boot gets broken, and can't lock the board out", a_hog_at_boot_cant_lock_the_board_out)
    ck.run("a CAN app at boot keeps its stream, and restarts don't use them up", a_can_app_at_boot_keeps_its_stream)
    ck.run("a crash in C at boot can't lock the board out", a_crash_in_c_at_boot_cant_lock_the_board_out)
    ck.run("removing an app stops it", removing_it_stops_it)
    ck.run("with no network, it runs, and WiFi retries don't hold it up", runs_with_no_network_and_isnt_held_up)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--relay", required=True)
    ap.add_argument("--scheme", default="ws")
    ap.add_argument("--password", default="password")
    ap.add_argument("--only", default=None)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    ck = Check(args.only)
    bench = Bench(args)
    try:
        bench.remove_all()
        check(ck, bench, args)
    finally:
        bench.remove_all()
        bench.relay.close()

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    with open(args.out or f"boot-apps-{args.host}-{int(time.time())}.json", "w") as f:
        json.dump(ck.results, f, indent=2)
    raise SystemExit(1 if ck.failed else 0)


if __name__ == "__main__":
    main()
