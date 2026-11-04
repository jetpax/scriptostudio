#!/usr/bin/env python3
"""Check that the OpenInverter app can talk to a Zombieverter in a board's MicroMod socket.

    check_openinverter.py --host pybot-3d84 --port /dev/cu.usbserial-14101 --relay /path/to/ss-relay \\
        --image firmware.bin --helpers /path/to/OI_helpers.py

Needs esptool, an ESP-PROG on the port, and the micromod and openinverter apps installed. Puts
the given helpers on the board and programs the image, so what's on the module is lost. It calls
the helpers as Studio does. A parameter changes and goes back, in RAM only.
"""

import argparse
import json
import os
import subprocess
import time

from ss_relay.device import derive_token

from check_boot_apps import wait_for_board
from check_m1 import Check, expect
from check_relay import Relay

SDO_LIBRARY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "boards", "firmware", "device-scripts", "lib", "canopen_sdo.py")
HELPERS_ON_BOARD = "/lib/ext/openinverter/OI_helpers.py"
SDO_ON_BOARD = "/lib/canopen_sdo.py"
NODE = 1
ABSENT_NODE = 5
MIN_PARAMETERS = 100
MIN_SPOTS = 50
SPOT_REFRESH_S = 0.6
RETRY_SKIPPED_S = 0.9
STUDIO_EXEC_MS = 30000
READS_LINES = """
from machine import ADC, I2C, Pin
a = ADC(Pin(3), atten=ADC.ATTN_11DB)
buzzer_mv = a.read_uv() // 1000
Pin(3, Pin.IN, Pin.PULL_DOWN)
i = I2C(0, scl=Pin(7), sda=Pin(6), freq=100000, timeout=20000)
found = []
for address in (0x19, 0x32):
    try:
        i.writeto(address, b'')
        found.append(address)
    except OSError:
        pass
print(buzzer_mv, found)
"""


class Bench:
    def __init__(self, args):
        self.args = args
        self.relay = None

    def connect(self):
        # As a person, as Studio is, since an agent's exec gets less time than connecting takes
        token = derive_token(self.args.password, "human")
        self.relay = Relay([self.args.relay, "--device", f"ws://{self.args.host}/mcp", "--token", token], self.args.password)
        for _ in range(100):
            reply = self.relay.call("tools/list")
            if "result" in reply and "exec" in {t["name"] for t in reply["result"]["tools"]}:
                return
            time.sleep(0.3)
        raise TimeoutError("the device has no exec tool")

    def helper(self, call):
        """What Studio sends, and the JSON it gets back."""
        function = call.split("(")[0]
        code = f"from lib.ext.openinverter.OI_helpers import {function}; {call}"
        return json.loads(self.relay.ok("exec", code=code, echo=False, timeout_ms=STUDIO_EXEC_MS))


def check(ck, bench, args):
    state = {}

    def it_installs():
        bench.relay.ok_json("fs_push", local=os.path.abspath(args.helpers), remote=HELPERS_ON_BOARD)
        bench.relay.ok_json("fs_push", local=os.path.abspath(SDO_LIBRARY), remote=SDO_ON_BOARD)

    def the_firmware_goes_on_from_the_board():
        bench.relay.close()
        env = dict(os.environ, SS_RELAY_PASSWORD=args.password)
        done = subprocess.run([args.relay, "--device", f"ws://{args.host}/mcp", "stm32", args.image, args.port], env=env, capture_output=True, text=True, timeout=300)
        expect(done.returncode == 0, done.stderr[-400:])
        time.sleep(3)
        expect(wait_for_board(args.host, gone_first=False), "the board never came back")
        bench.connect()
        return json.loads(done.stdout)

    def a_scan_finds_it():
        reply = bench.helper('scanCanBus({"quick": True})')["ARG"]
        expect([node["nodeId"] for node in reply["devices"]] == [NODE], reply)
        return reply["devices"][0]

    def a_node_that_isnt_there_says_so():
        reply = bench.helper('initializeDevice({"node_id": %d})' % ABSENT_NODE)
        expect("Nothing answered" in reply.get("error", ""), reply)
        return reply

    def connecting_loads_its_parameters():
        started = time.time()
        reply = bench.helper('initializeDevice({"node_id": %d})' % NODE)
        expect(reply.get("success") and reply["parameters"] > MIN_PARAMETERS, reply)
        reply["seconds"] = round(time.time() - started, 1)
        state["uptime_ms"] = int(bench.relay.ok("exec", code="import time; print(time.ticks_ms())", echo=False))
        return reply

    def parameters_have_values_ranges_and_choices():
        params = bench.helper("getOiParams()")
        inverter = params["Inverter"]
        expect(inverter["enums"]["1"] == "Leaf_Gen1", inverter)
        expect(inverter["maximum"] > inverter["minimum"], inverter)
        expect(all(p["isparam"] for p in params.values()), "a spot value among the parameters")
        state["params"] = params
        return {"count": len(params), "categories": len({p.get("category") for p in params.values()})}

    def spot_values_are_read_live():
        started = time.time()
        spots = bench.helper("getSpotValues()")
        expect(bench.helper("getSpotValues()") is None, "a second ask straight away should get null, to leave the page as it is")
        expect(spots["cpuload"]["value"] > 0, spots["cpuload"])
        label = bench.relay.ok("exec", code="import lib.ext.openinverter.OI_helpers as h; print(list(h.parameters['version']['enums'].values())[0])", echo=False).strip()
        expect(label[0].isdigit(), label)
        # The page draws these as numbers, with a unit it may read as a scale
        expect(all(isinstance(v["value"], (int, float)) for v in spots.values()), "a value that isn't a number")
        expect(not any(v["unit"][:1].isdigit() for v in spots.values()), "a unit starting with digits")
        return {"count": len(spots), "version": label, "cpuload": spots["cpuload"]["value"], "seconds": round(time.time() - started, 2)}

    def a_parameter_changes_and_reads_back():
        name, param = next((n, p) for n, p in sorted(state["params"].items()) if "enums" not in p and p.get("id") is not None and p["maximum"] > p["minimum"] and p["value"] < p["maximum"])
        was = param["value"]
        new = min(was + 1, param["maximum"])

        def set_and_read(value):
            updated = bench.helper('setParameter({"NAME": "%s", "VALUE": %s})' % (name, value))
            expect(updated.get(name, {}).get("value") == value, updated)
            # The list comes from the firmware, so this isn't what the board remembers
            bench.helper("fetchParameterDatabase()")
            return bench.helper('getPlotData(["%s"])' % name)["values"][name]

        read = set_and_read(new)
        back = set_and_read(was)
        expect(read == new and back == was, (read, new, back, was))
        return {"name": name, "was": was, "set": new}

    def the_plot_reads_values():
        reply = bench.helper('getPlotData(["opmode", "udc"])')
        expect(set(reply["values"]) == {"opmode", "udc"}, reply)
        return reply["values"]

    def device_info_and_the_other_tabs_answer():
        info = bench.helper("getDeviceInfo()")
        words = info["serialNumber"].split(":")
        expect(len(set(words)) > 1 and info["connected"], info)
        canmap = bench.helper("getCanMap()")
        expect("error" not in canmap, canmap)
        errors = bench.helper("getErrorLog()")
        expect("error" not in errors, errors)
        return {"serial": info["serialNumber"], "canmap": canmap, "errors": errors}

    def the_shared_lines_stay_free():
        buzzer_mv, found = bench.relay.ok("exec", code=READS_LINES, echo=False).strip().split(" ", 1)
        expect(found == "[25, 50]", found)
        expect(int(buzzer_mv) < 1000, buzzer_mv)
        return {"buzzer_mv": int(buzzer_mv), "i2c": found}

    def the_board_didnt_restart():
        now = int(bench.relay.ok("exec", code="import time; print(time.ticks_ms())", echo=False))
        expect(now > state["uptime_ms"], (now, state["uptime_ms"]))

    def choosing_it_in_the_page_is_enough():
        # The Device Manager only marks it connected in the page, and asks for values
        bench.relay.ok("exec", code="from lib.ext.openinverter.OI_helpers import disconnectDevice; disconnectDevice()", echo=False)
        time.sleep(SPOT_REFRESH_S)
        expect(len(bench.helper("getSpotValues()")) > MIN_SPOTS, "it didn't connect by itself")

    def with_nothing_there_the_page_gets_nothing_to_draw():
        code = "import lib.ext.openinverter.OI_helpers as h; h.disconnectDevice(); h.device_node_id = %d; h._spots_read_at = None; h.getSpotValues()" % ABSENT_NODE
        expect(json.loads(bench.relay.ok("exec", code=code, echo=False, timeout_ms=STUDIO_EXEC_MS)) == {}, "it should be empty")
        started = time.time()
        bench.helper("getSpotValues()")
        expect(time.time() - started < RETRY_SKIPPED_S, "it tried again straight away")
        bench.relay.ok("exec", code="import lib.ext.openinverter.OI_helpers as h; h.device_node_id = %d; h._connect_retry_at = None" % NODE, echo=False)

    ck.run("it installs", it_installs)
    ck.run("the firmware goes on from the board", the_firmware_goes_on_from_the_board)
    ck.run("a scan finds it", a_scan_finds_it)
    ck.run("a node that isn't there says so", a_node_that_isnt_there_says_so)
    ck.run("connecting loads its parameters", connecting_loads_its_parameters)
    ck.run("parameters have values, ranges and choices", parameters_have_values_ranges_and_choices)
    ck.run("spot values are read live", spot_values_are_read_live)
    ck.run("a parameter changes and reads back", a_parameter_changes_and_reads_back)
    ck.run("the plot reads values", the_plot_reads_values)
    ck.run("device info and the other tabs answer", device_info_and_the_other_tabs_answer)
    ck.run("the buzzer line and I2C stay free", the_shared_lines_stay_free)
    ck.run("the board didn't restart", the_board_didnt_restart)
    ck.run("choosing it in the page is enough", choosing_it_in_the_page_is_enough)
    ck.run("with nothing there, the page gets nothing to draw", with_nothing_there_the_page_gets_nothing_to_draw)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--port", required=True)
    ap.add_argument("--relay", required=True)
    ap.add_argument("--image", required=True)
    ap.add_argument("--helpers", required=True)
    ap.add_argument("--password", default="password")
    ap.add_argument("--only", default=None)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    ck = Check(args.only)
    bench = Bench(args)
    bench.connect()
    try:
        check(ck, bench, args)
    finally:
        bench.relay.close()

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    if args.out:
        with open(args.out, "w") as f:
            json.dump(ck.results, f, indent=2)
    return 0 if passed == len(ck.results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
