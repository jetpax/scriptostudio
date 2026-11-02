#!/usr/bin/env python3
"""Check that the board's WiFi task survives failing reconnects and recovers by itself.

    check_wifi_recovery.py --host 192.168.1.249 --relay /path/to/ss-relay

Drops the board off WiFi, and makes its reconnects fail for 30 s. The wrong password lives
only in a wrapper around the STA object in RAM, and settings aren't touched. If WiFi hasn't
recovered in time the board writes its log and resets itself, so it can't stay lost.
"""

import argparse
import json
import subprocess
import time

from check_relay import Relay
from check_m1 import Check, expect

LOG = "/wifi_recovery.json"
FAIL_FOR_S = 30
GIVE_UP_S = 150
HOST_WAIT_S = GIVE_UP_S + 60
SAMPLE_S = 2
MAX_LOOP_GAP_S = 5

HARNESS = f"""
import asyncio, json, machine, time, taskwatchdog
from lib.sys import bg_tasks
from lib.sys.network import wifi as _w

class _WrongPassword:
    def __init__(self, real):
        self._real = real
    def connect(self, ssid, password, **kw):
        return self._real.connect(ssid, 'wrong-password-for-test', **kw)
    def __getattr__(self, name):
        return getattr(self._real, name)

async def _wifi_recovery_user_task():
    while True:
        await asyncio.sleep(1)

async def _wifi_recovery():
    bg_tasks.start('wifi_recovery_user', _wifi_recovery_user_task)
    await asyncio.sleep(2)
    t0 = time.ticks_ms()
    out = {{'samples': [], 'recovered_s': None, 'gave_up': False}}
    def save():
        with open({LOG!r}, 'w') as f:
            json.dump(out, f)
    real = _w._sta
    before = taskwatchdog.stall_log()
    _w._sta = _WrongPassword(real)
    real.disconnect()
    restored = False
    while True:
        await asyncio.sleep({SAMPLE_S})
        t = time.ticks_diff(time.ticks_ms(), t0) / 1000
        state = bg_tasks._tasks['wifi_task']['state']
        out['samples'].append([t, state])
        if t >= {FAIL_FOR_S} and not restored:
            restored = True
            if isinstance(_w._sta, _WrongPassword):
                _w._sta = real
        if restored and real.isconnected():
            out['recovered_s'] = t
        elif t >= {GIVE_UP_S}:
            out['gave_up'] = True
        if out['recovered_s'] is not None or out['gave_up']:
            out['new_stalls'] = taskwatchdog.stall_log()[len(before):]
            out['user_task'] = bg_tasks._tasks['wifi_recovery_user']['state']
            bg_tasks.stop('wifi_recovery_user')
            save()
            if out['gave_up']:
                machine.reset()
            return
        save()

bg_tasks.start('wifi_recovery', _wifi_recovery, is_system=True)
"""

def connect(relay_path, url, password):
    relay = Relay([relay_path, "--device", url], password)
    for _ in range(50):
        if "exec" in {t["name"] for t in relay.call("tools/list")["result"]["tools"]}:
            return relay
        time.sleep(0.2)
    relay.process.kill()
    return None


def wait_for_board(host):
    begin = time.time()
    time.sleep(10)
    while time.time() - begin < HOST_WAIT_S:
        if subprocess.run(["ping", "-c", "1", "-t", "1", host], capture_output=True).returncode == 0:
            return True
        time.sleep(1)
    return False


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--relay", required=True)
    ap.add_argument("--scheme", default="ws")
    ap.add_argument("--password", default="password")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    url = f"{args.scheme}://{args.host}/mcp"

    ck = Check()
    relay = connect(args.relay, url, args.password)
    expect(relay, "the board isn't reachable")
    relay.tool("fs_rm", path=LOG)
    relay.ok("exec", code=HARNESS, echo=False)
    relay.process.kill()

    expect(wait_for_board(args.host), "the board never came back: it needs a manual reset")
    time.sleep(5)
    relay = connect(args.relay, url, args.password)
    expect(relay, "the board answers ping, but not MCP")
    out = json.loads(relay.ok_json("fs_read_text", path=LOG)["text"])
    relay.tool("fs_rm", path=LOG)
    relay.close()

    def recovers():
        expect(not out["gave_up"], out["samples"][-5:])
        return {"seconds_after_failures_ended": round(out["recovered_s"] - FAIL_FOR_S)}

    def task_never_crashes():
        states = {s[1] for s in out["samples"]}
        expect(states == {"running"}, states)

    def loop_keeps_running():
        times = [0] + [s[0] for s in out["samples"]]
        gap = max(b - a for a, b in zip(times, times[1:]))
        expect(gap <= MAX_LOOP_GAP_S, f"held for {gap:.1f} s")
        return {"longest_gap_s": round(gap, 1)}

    def no_watchdog_stalls():
        expect(not out["new_stalls"], out["new_stalls"])

    def user_tasks_survive():
        expect(out["user_task"] == "running", out["user_task"])

    ck.run("wifi: recovers by itself once connecting works again", recovers)
    ck.run("wifi: the task never crashes", task_never_crashes)
    ck.run("wifi: the event loop keeps running throughout", loop_keeps_running)
    ck.run("wifi: no watchdog stalls", no_watchdog_stalls)
    ck.run("wifi: user tasks keep running", user_tasks_survive)

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    with open(args.out or f"wifi-recovery-{args.host}-{int(time.time())}.json", "w") as f:
        json.dump(ck.results, f, indent=2)
    raise SystemExit(1 if ck.failed else 0)


if __name__ == "__main__":
    main()
