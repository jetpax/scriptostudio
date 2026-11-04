#!/usr/bin/env python3
"""Check that a board can program the STM32 in its MicroMod socket.

    check_micromod.py --host pybot-3d84 --port /dev/cu.usbserial-14101 --relay /path/to/ss-relay --mpy-cross /path/to/mpy-cross

Needs esptool, and an ESP-PROG on the port. Installs the micromod app and leaves it installed.
Erases the module, so anything on it is lost, then leaves a program on it that only blinks its
blue LED about once a second.
"""

import argparse
import json
import os
import subprocess
import tempfile
import time

from ss_relay import hosttools

from check_boot_apps import wait_for_board
from check_m1 import Check, expect
from check_relay import Relay

APP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "boards", "apps", "micromod")
F405 = "0x0413"
IMAGE = "/micromod_check.bin"
# Over the first four sectors, which hold 64 KB
LONG_IMAGE_BYTES = 70000
BLINK = bytes.fromhex("000002200900000882b0114bd3f8302842f00102c3f83028d3f830380d4a136823f0404343f080431360114600200a4a4b6983f400434b610190019b9342f7d8019b01330193019b9342f9d9f0e700bf00300240000002407f1a0600")
I2C_ADDRESSES = (0x19, 0x32)
BOOT_HOLD_S = 45
READS_LINES = """
from machine import ADC, I2C, Pin
a = ADC(Pin(3), atten=ADC.ATTN_11DB)
buzzer_mv = a.read_uv() // 1000
Pin(3, Pin.IN, Pin.PULL_DOWN)
i = I2C(0, scl=Pin(7), sda=Pin(6), freq=100000, timeout=20000)
found = []
for address in %r:
    try:
        i.writeto(address, b'')
        found.append(address)
    except OSError:
        pass
print(buzzer_mv, found)
""" % (I2C_ADDRESSES,)


def long_image():
    body = bytes((i * 7 + (i >> 8)) & 0xFF for i in range(LONG_IMAGE_BYTES - 8))
    return bytes.fromhex("0000022009000008") + body


class Bench:
    def __init__(self, args):
        self.args = args
        self.relay = None
        self.esp = None

    def connect(self):
        self.relay = Relay([self.args.relay, "--device", f"ws://{self.args.host}/mcp"], self.args.password)
        for _ in range(100):
            reply = self.relay.call("tools/list")
            if "result" in reply and "exec" in {t["name"] for t in reply["result"]["tools"]}:
                return
            time.sleep(0.3)
        raise TimeoutError("the device has no exec tool")

    def wait_for_tool(self, name):
        for _ in range(100):
            reply = self.relay.call("tools/list")
            if "result" in reply and name in {t["name"] for t in reply["result"]["tools"]}:
                return
            time.sleep(0.3)
        raise TimeoutError(f"the device has no {name} tool")

    def enter(self):
        self.relay.close()
        self.esp = hosttools._stm32_enter(self.args.port)
        time.sleep(5)
        expect(wait_for_board(self.args.host, gone_first=False), "the board never came back")
        self.connect()
        self.wait_for_tool("micromod_info")

    def leave(self):
        self.relay.close()
        hosttools._stm32_leave(self.esp)
        self.esp = None
        self.back_up()

    def reset_both(self):
        """Only a reset takes the module out of its bootloader, and an earlier run may have left it there."""
        self.relay.close()
        hosttools._stm32_leave(hosttools._stm32_enter(self.args.port))
        self.back_up()

    def back_up(self):
        time.sleep(3)
        expect(wait_for_board(self.args.host, gone_first=False), "the board never came back")
        self.connect()

    def error(self, name, **args):
        result = self.relay.tool(name, **args)
        expect(result.get("isError"), f"{name} should have failed: {result}")
        return "".join(c.get("text", "") for c in result["content"])

    def lines(self):
        buzzer_mv, found = self.relay.ok("exec", code=READS_LINES, echo=False).strip().split(" ", 1)
        return int(buzzer_mv), found


def check(ck, bench, args):
    long = long_image()

    def push(image):
        with tempfile.NamedTemporaryFile(suffix=".bin") as f:
            f.write(image)
            f.flush()
            bench.relay.ok_json("fs_push", local=f.name, remote=IMAGE)

    def expect_not_in_bootloader():
        text = bench.error("micromod_info")
        expect("isn't in its bootloader" in text and "ss-relay stm32" in text, text)

    def install():
        bench.relay.ok_json("sync", local=os.path.abspath(APP_DIR), mpy_cross=args.mpy_cross)
        bench.wait_for_tool("micromod_info")

    def without_the_bootloader_it_says_how():
        bench.reset_both()
        bench.wait_for_tool("micromod_info")
        expect_not_in_bootloader()

    def it_identifies_the_chip():
        bench.enter()
        info = bench.relay.ok_json("micromod_info")
        expect(info["chip_id"] == F405, info)
        return info

    def asking_again_works():
        expect(bench.relay.ok_json("micromod_info")["chip_id"] == F405, "the second time failed")

    def i2c_is_held_while_it_is_there():
        expect(bench.lines()[1] == "[]", "I2C answered with the module in its bootloader")

    def it_refuses_what_isnt_an_image():
        bench.relay.ok("fs_write_text", path=IMAGE, text="this is not a firmware image")
        expect("isn't a raw binary" in bench.error("micromod_program", path=IMAGE, run=False), "it took text")
        expect("too small" in (bench.relay.ok("fs_write_text", path=IMAGE, text="abc") and bench.error("micromod_program", path=IMAGE, run=False)), "it took 3 bytes")

    def it_programs_what_it_just_read():
        push(BLINK)
        bench.relay.ok_json("micromod_info")
        result = bench.relay.ok_json("micromod_program", path=IMAGE, run=False)
        expect(result["verified"] and result["bytes"] == len(BLINK), result)
        return result

    def it_programs_across_sectors_and_checks():
        push(long)
        result = bench.relay.ok_json("micromod_program", path=IMAGE, run=False)
        expect(result["verified"] and result["bytes"] == LONG_IMAGE_BYTES and result["sectors_erased"] == 5, result)
        expect(bench.relay.ok_json("micromod_info")["blank"] is False, "it reads as blank")
        return result

    def it_erases():
        # Right after reading the same place, which still read as it was until the cache cleared
        expect(bench.relay.ok_json("micromod_info")["blank"] is False, "there's nothing to erase")
        result = bench.relay.ok_json("micromod_erase")
        expect(result["blank"] is True, result)
        expect(bench.relay.ok_json("micromod_info")["blank"] is True, "info says it isn't blank")

    def it_starts_what_it_programs():
        push(BLINK)
        result = bench.relay.ok_json("micromod_program", path=IMAGE)
        expect(result["running"] is True and result["verified"], result)
        expect_not_in_bootloader()
        return {"i2c_after_starting": bench.lines()[1]}

    def it_lets_go_of_the_port():
        try:
            bench.relay.ok("fs_rm", path=IMAGE)
        finally:
            bench.leave()

    def ss_relay_programs_it_and_it_runs():
        bench.relay.close()
        env = dict(os.environ, SS_RELAY_PASSWORD=args.password)
        with tempfile.NamedTemporaryFile(suffix=".bin") as f:
            f.write(BLINK)
            f.flush()
            done = subprocess.run([args.relay, "--device", f"ws://{args.host}/mcp", "stm32", f.name, args.port], env=env, capture_output=True, text=True, timeout=300)
        expect(done.returncode == 0, done.stderr[-400:])
        result = json.loads(done.stdout)
        expect(result["verified"] and result["bytes"] == len(BLINK), result)
        time.sleep(3)
        expect(wait_for_board(args.host, gone_first=False), "the board never came back")
        bench.connect()
        return result

    def stm32_boot_holds_it_there():
        bench.relay.close()
        holding = subprocess.Popen([args.relay, "stm32-boot", args.port, "--seconds", str(BOOT_HOLD_S)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        try:
            time.sleep(5)
            expect(wait_for_board(args.host, gone_first=False), "the board never came back")
            bench.connect()
            bench.wait_for_tool("micromod_info")
            expect(bench.relay.ok_json("micromod_info")["chip_id"] == F405, "it isn't in its bootloader")
            bench.relay.close()
        finally:
            out, err = holding.communicate(timeout=BOOT_HOLD_S + 30)
        expect(holding.returncode == 0, err[-400:])
        expect(json.loads(out)["held_seconds"] == BOOT_HOLD_S, out)
        bench.back_up()
        bench.wait_for_tool("micromod_info")
        expect_not_in_bootloader()

    def afterwards_the_shared_lines_are_free():
        buzzer_mv, found = bench.lines()
        expect(found == str(list(I2C_ADDRESSES)), found)
        expect(buzzer_mv < 1000, buzzer_mv)
        return {"buzzer_mv": buzzer_mv, "i2c": found}

    ck.run("install the app", install)
    ck.run("without the bootloader, it says how to get there", without_the_bootloader_it_says_how)
    ck.run("it identifies the chip", it_identifies_the_chip)
    ck.run("asking again still works", asking_again_works)
    ck.run("I2C is held while it's in its bootloader", i2c_is_held_while_it_is_there)
    ck.run("it refuses what isn't an image", it_refuses_what_isnt_an_image)
    ck.run("it programs what it just read", it_programs_what_it_just_read)
    ck.run("it programs across sectors, and checks", it_programs_across_sectors_and_checks)
    ck.run("it erases", it_erases)
    ck.run("it starts what it programs", it_starts_what_it_programs)
    ck.run("it lets go of the port", it_lets_go_of_the_port)
    ck.run("ss-relay programs it, from one command", ss_relay_programs_it_and_it_runs)
    ck.run("ss-relay stm32-boot holds it there", stm32_boot_holds_it_there)
    ck.run("afterwards the buzzer line and I2C are free", afterwards_the_shared_lines_are_free)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--port", required=True)
    ap.add_argument("--relay", required=True)
    ap.add_argument("--mpy-cross", required=True)
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
        # Even after a failure, so the port is free and the module leaves its bootloader
        if bench.esp:
            hosttools._stm32_leave(bench.esp)
        bench.relay.close()

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    if args.out:
        with open(args.out, "w") as f:
            json.dump(ck.results, f, indent=2)
    return 0 if passed == len(ck.results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
