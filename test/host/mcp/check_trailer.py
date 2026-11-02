#!/usr/bin/env python3
"""Rehearse the trailer-light job on a real bus, knowing the answers, with no agent involved.

    check_trailer.py --host 192.168.1.50 --relay /path/to/ss-relay --adapter /dev/cu.usbmodem11201

Plays the bench car, finds its frames with the tools an agent has, then leaves an app on the
device that follows them and runs at boot. The outputs are variables rather than pins, so it can
run on a board whose free pins nobody has said. Installs and removes its apps, and resets the device.
"""

import argparse
import json
import time

from bench_car import ACK_APP, ACK_APP_ID, BenchCar
from check_boot_apps import wait_for_board
from check_m1 import Check, expect
from check_relay import Relay

APP_ID = "trailer-rehearsal"
CAPTURE_S = 3
OUTPUTS_S = 1.5
# Each command, and the bit that should show it
EXPECTED = {
    "brake": ("1f0", 1, 3),
    "lights": ("470", 5, 0),
    "left": ("470", 0, 0),
    "right": ("470", 0, 1),
}
FOLLOWS = {"brake": "brake", "lights": "lights", "left": "indicator", "right": "indicator"}

APP_CODE = """
import asyncio, __main__
from lib.sys import can_tap

async def run():
    watcher = can_tap.watch([0x1F0, 0x470])
    outputs = {"brake": 0, "lights": 0, "indicator": 0}
    while True:
        for frame_id, data in watcher.read():
            if frame_id == 0x1F0:
                outputs["brake"] = (data[1] >> 3) & 1
            else:
                outputs["lights"] = data[5] & 1
                outputs["indicator"] = 1 if data[0] & 3 else 0
        __main__._trailer = dict(outputs)
        await asyncio.sleep_ms(10)
"""


class Bench:
    def __init__(self, args):
        self.args = args
        self.relay = None
        self.connect()

    def connect(self):
        self.relay = Relay([self.args.relay, "--device", f"ws://{self.args.host}/mcp"], self.args.password)
        for _ in range(100):
            if "app_create" in {t["name"] for t in self.relay.call("tools/list")["result"]["tools"]}:
                return
            time.sleep(0.2)
        raise TimeoutError("the device has no app_create tool")

    def reset(self):
        self.relay.tool("reset", mode="hard")
        self.relay.close()
        expect(wait_for_board(self.args.host), "the device never came back")
        self.connect()

    def capture(self, **args):
        return json.loads(self.relay.ok("can_capture", seconds=CAPTURE_S, **args).split("\n")[0])

    def outputs(self):
        return json.loads(self.relay.ok("exec", code="import __main__, json\nprint(json.dumps(__main__._trailer))", echo=False))


def check(ck, bench, car):
    def the_bus_is_visible():
        report = bench.capture()
        expect(report["per_s"] > 150, report["per_s"])
        expect(report["lost_in_controller"] == 0, report["lost_in_controller"])
        return {"per_s": report["per_s"], "ids": sorted(report["ids"])}

    def finding(word):
        def find():
            frame_id, byte, bit = EXPECTED[word]
            bench.capture(baseline=True)
            car.command(word)
            time.sleep(0.3)
            report = bench.capture()
            car.command(word)
            time.sleep(0.3)
            rows = report["reaction"]
            matches = [i for i, r in enumerate(rows) if (r.get("id"), r.get("byte"), r.get("bit")) == (frame_id, byte, bit)]
            expect(matches, rows)
            return {"found_at": matches[0], "of": len(rows), "toggles_per_s": rows[matches[0]]["toggles_per_s"]}

        return find

    def follows(label):
        def outputs_follow():
            time.sleep(1)
            for word, output in FOLLOWS.items():
                car.command(word)
                seen = set()
                begin = time.time()
                while time.time() - begin < OUTPUTS_S:
                    seen.add(bench.outputs()[output])
                    time.sleep(0.05)
                car.command(word)
                time.sleep(0.5)
                expect(1 in seen, (label, word, seen))
                expect(bench.outputs()[output] == 0, (label, word, "stuck on"))

        return outputs_follow

    def runs_at_boot_and_says_so():
        rows = {r["id"]: r for r in bench.relay.ok_json("apps_list")["apps"]}
        row = rows[APP_ID]
        expect(row["run_at_boot"] is True and row["state"] == "running" and not row["error"], row)

    def nothing_was_sent():
        expect(car.heard == 0, car.heard)
        return {"frames_heard": car.heard}

    ck.run("trailer: the bus is visible", the_bus_is_visible)
    for word in EXPECTED:
        ck.run(f"trailer: {word} shows up in the reaction", finding(word))
    bench.relay.ok("app_create", id=APP_ID, code=APP_CODE, name="Trailer rehearsal", run_at_boot=True)
    ck.run("trailer: the outputs follow", follows("before the reset"))
    ck.run("trailer: it's marked to run at boot", runs_at_boot_and_says_so)
    bench.reset()
    ck.run("trailer: after a reset they still follow", follows("after the reset"))
    ck.run("trailer: it's still marked and running", runs_at_boot_and_says_so)
    ck.run("trailer: the device sent no frames", nothing_was_sent)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--relay", required=True)
    ap.add_argument("--adapter", required=True)
    ap.add_argument("--password", default="password")
    ap.add_argument("--only", default=None)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    ck = Check(args.only)
    bench = Bench(args)
    bench.relay.ok("app_create", id=ACK_APP_ID, code=ACK_APP, name="Bench ACK", run_at_boot=True)
    car = BenchCar(args.adapter)
    try:
        time.sleep(0.5)
        check(ck, bench, car)
    finally:
        car.close()
        for app_id in (APP_ID, ACK_APP_ID):
            bench.relay.tool("app_remove", id=app_id)
        bench.relay.close()

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    with open(args.out or f"trailer-{args.host}-{int(time.time())}.json", "w") as f:
        json.dump(ck.results, f, indent=2)
    raise SystemExit(1 if ck.failed else 0)


if __name__ == "__main__":
    main()
