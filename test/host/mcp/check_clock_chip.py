#!/usr/bin/env python3
"""Check a RetroVMS Mini's clock chip: the system clock comes from it at boot, and NTP corrects it.

    check_clock_chip.py --host pybot-3d84 --port /dev/cu.usbserial-14101 --relay /path/to/ss-relay

Needs esptool, an ESP-PROG on the port, the board on a network that reaches NTP, and the micromod
app. Sets the chip an hour wrong, and resets the board three times.
"""

import argparse
import calendar
import json
import time

from ss_relay import hosttools

from check_boot_apps import wait_for_board
from check_m1 import Check, expect
from check_relay import Relay

HOUR_S = 3600
CLOSE_ENOUGH_S = 3
NTP_WAIT_S = 30
POWER_SWITCH_CHARGING = "c0"
READS_CLOCKS = """
import json, time
from lib.sys import clock_chip
chip, name = clock_chip._open()
print(json.dumps({"restored": clock_chip.restored, "system": time.gmtime()[:6], "chip": chip.read()}))
"""
READS_POWER = """
from lib.sys import board, bus
device = board.device("rtc")
print("%02x" % bus.get_i2c("i2c0").readfrom_mem(int(device.i2c_address, 16), 0x32, 1)[0])
bus.release_i2c("i2c0")
"""
SETS_CHIP_WRONG = """
import time
from lib.sys import clock_chip
chip, name = clock_chip._open()
chip.write(time.gmtime(time.time() + %d)[:6])
""" % HOUR_S
INVALID_CHIP = """
from lib.sys import clock_chip
from lib.sys.drivers.rx8111 import RX8111
real = RX8111.read
RX8111.read = lambda self: None
print(clock_chip.restore())
RX8111.read = real
"""


def seconds_off(moment):
    """How far a board's (year, month, day, hour, minute, second) is from this computer's UTC."""
    return abs(calendar.timegm(tuple(moment) + (0, 0, 0)) - time.time())


class Bench:
    def __init__(self, args):
        self.args = args
        self.relay = None

    def connect(self):
        self.relay = Relay([self.args.relay, "--device", f"ws://{self.args.host}/mcp"], self.args.password)
        for _ in range(100):
            reply = self.relay.call("tools/list")
            if "result" in reply and "exec" in {t["name"] for t in reply["result"]["tools"]}:
                return
            time.sleep(0.3)
        raise TimeoutError("the device has no exec tool")

    def reset(self):
        self.relay.close()
        hosttools._stm32_leave(hosttools._stm32_enter(self.args.port))
        time.sleep(3)
        expect(wait_for_board(self.args.host, gone_first=False), "the board never came back")
        self.connect()

    def clocks(self):
        return json.loads(self.relay.ok("exec", code=READS_CLOCKS, echo=False))


def check(ck, bench):
    def the_manifest_declares_it():
        code = "from lib.sys import board; device = board.device('rtc'); print(board.has('rtc'), device.type, device.driver, device.i2c_address)"
        text = bench.relay.ok("exec", code=code, echo=False).strip()
        expect(text == "True RX8111 rx8111 0x32", text)

    def a_boot_sets_the_clock_from_the_chip():
        bench.relay.ok("exec", code=SETS_CHIP_WRONG, echo=False)
        bench.reset()
        clocks = bench.clocks()
        expect(clocks["restored"], clocks)
        return clocks

    def ntp_corrects_the_clock_and_the_chip():
        started = time.time()
        while True:
            clocks = bench.clocks()
            if seconds_off(clocks["system"]) < CLOSE_ENOUGH_S and seconds_off(clocks["chip"]) < CLOSE_ENOUGH_S:
                return dict(clocks, seconds=round(time.time() - started, 1))
            expect(time.time() - started < NTP_WAIT_S, clocks)
            time.sleep(1)

    def the_chip_charges_its_capacitors():
        power = bench.relay.ok("exec", code=READS_POWER, echo=False).strip()
        expect(power == POWER_SWITCH_CHARGING, power)

    def a_chip_without_the_time_leaves_the_clock_alone():
        text = bench.relay.ok("exec", code=INVALID_CHIP, echo=False).strip()
        expect(text == "False", text)
        expect(seconds_off(bench.clocks()["system"]) < CLOSE_ENOUGH_S, "the clock moved")

    def the_chip_still_has_the_time_after_another_reset():
        bench.reset()
        clocks = bench.clocks()
        expect(clocks["restored"], clocks)
        expect(seconds_off(clocks["system"]) < NTP_WAIT_S, clocks)
        return clocks

    def a_module_waiting_in_its_bootloader_still_answers():
        bench.relay.close()
        esp = hosttools._stm32_enter(bench.args.port)
        try:
            time.sleep(3)
            expect(wait_for_board(bench.args.host, gone_first=False), "the board never came back")
            bench.connect()
            for _ in range(100):
                reply = bench.relay.call("tools/list")
                if "micromod_info" in {t["name"] for t in reply.get("result", {}).get("tools", [])}:
                    break
                time.sleep(0.3)
            info = bench.relay.ok_json("micromod_info")
            restored = bench.relay.ok("exec", code="from lib.sys import clock_chip; print(clock_chip.restored)", echo=False).strip()
            expect(restored == "False", "I2C answered with the module in its bootloader")
            bench.relay.close()
        finally:
            hosttools._stm32_leave(esp)
        time.sleep(3)
        expect(wait_for_board(bench.args.host, gone_first=False), "the board never came back")
        bench.connect()
        return info

    ck.run("the manifest declares it", the_manifest_declares_it)
    ck.run("a boot sets the clock from the chip", a_boot_sets_the_clock_from_the_chip)
    ck.run("NTP corrects the clock and the chip", ntp_corrects_the_clock_and_the_chip)
    ck.run("the chip charges its capacitors", the_chip_charges_its_capacitors)
    ck.run("a chip without the time leaves the clock alone", a_chip_without_the_time_leaves_the_clock_alone)
    ck.run("the chip still has the time after another reset", the_chip_still_has_the_time_after_another_reset)
    ck.run("a module waiting in its bootloader still answers", a_module_waiting_in_its_bootloader_still_answers)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--port", required=True)
    ap.add_argument("--relay", required=True)
    ap.add_argument("--password", default="password")
    ap.add_argument("--only", default=None)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    ck = Check(args.only)
    bench = Bench(args)
    bench.connect()
    try:
        check(ck, bench)
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
