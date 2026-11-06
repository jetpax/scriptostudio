#!/usr/bin/env python3
"""Checks of what the person wires to a board: wired_add, wired_remove, and what agents see.

    check_wired.py --host 192.168.1.50 --password X

For a board set up as a Generic ESP32-S3, or the simulator run with
SIM_MANIFEST=boards/manifests/generic_esp32s3.json. Records and removes entries named chk_*, and
leaves anything else wired as it was. Nothing is driven: it only writes /settings/wired.json.
"""

import argparse
import json

from check_m1 import Check, expect
from mcp_client import Http, ToolError, token

BOARD = "generic_esp32s3"
DOOR = {"type": "switch", "pin": 2, "description": "Reed switch to GND, use Pin.PULL_UP. Reads 0 when the door is shut."}


def refused(c, why, **args):
    """Call wired_add, expecting it to refuse with a message containing why."""
    try:
        c.tool("wired_add", **args)
    except ToolError as e:
        expect(why in str(e), f"refused, but with {e}")
        return {"said": str(e)}
    raise AssertionError(f"wired {args.get('name')} when it should have refused: {why}")


def instructions(c):
    return c.call("server/discover")["instructions"]


def pin_of(c, name):
    return c.tool("exec", code=f"from lib.sys import board\nprint(board.pin({name!r}))").strip()


def clear(c):
    wired = c.tool_json("device_info").get("wired", {})
    names = list(wired.get("devices", {}))
    for buses in wired.get("resources", {}).values():
        names += list(buses)
    # Devices first, since a wired bus can't go while a device names it
    for name in sorted(names, key=lambda n: n not in wired.get("devices", {})):
        if name.startswith("chk_"):
            c.tool("wired_remove", name=name)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--password", default="password")
    ap.add_argument("--token", default=None, help="the agent token itself, instead of the password it comes from")
    ap.add_argument("--only", default=None)
    a = ap.parse_args()

    c = Http(f"http://{a.host}/mcp", a.token or token(a.password, "agent"))
    board_id = c.tool_json("device_info")["identity"].get("id")
    if board_id != BOARD:
        raise SystemExit(f"These checks are for {BOARD}, and this board is {board_id}")
    clear(c)
    ck = Check(a.only)

    def tools_and_rule():
        tools = [t["name"] for t in c.call("tools/list")["tools"]]
        expect("wired_add" in tools and "wired_remove" in tools, tools)
        expect("Record what they've wired with wired_add" in instructions(c), "the instructions don't say to record wiring")
        return {"tools": len(tools)}

    def switch_recorded():
        r = c.tool_json("wired_add", name="chk_door", entry=DOOR)
        expect(r == {"wired": "chk_door", "notes": []}, r)
        text = instructions(c)
        expect("Wired by the person:" in text and "chk_door" in text, "the instructions don't show it")
        expect(pin_of(c, "chk_door") == "2", "board.pin doesn't find it")
        expect(c.tool("exec", code="from lib.sys import board\nprint(2 in board.pins())").strip() == "True", "not in pins()")
        expect(c.tool_json("device_info")["wired"]["devices"]["chk_door"] == DOOR, "device_info doesn't show it")

    def replaced_in_place():
        again = dict(DOOR, description="Reed switch to GND with Pin.PULL_UP. 0 is shut, 1 is open.")
        c.tool_json("wired_add", name="chk_door", entry=again)
        expect(c.tool_json("device_info")["wired"]["devices"]["chk_door"] == again, "not replaced")

    def default_bus_gives_way():
        led = {"type": "led", "pin": 4, "description": "Red LED to GND through 330R. Pin.OUT, 1 is on."}
        r = c.tool_json("wired_add", name="chk_led", entry=led)
        expect(len(r["notes"]) == 1 and "can.can0" in r["notes"][0], r)
        expect('"can0"' not in instructions(c), "can0 still offered as a bus")
        out = c.tool("exec", code="from lib.sys import board\ntry:\n    board.can('can0')\nexcept KeyError as e:\n    print('gone')")
        expect("gone" in out, out)
        return {"note": r["notes"][0]}

    def sensor_shares_i2c():
        bme = {"type": "BME280", "bus": "i2c.i2c0", "i2c_address": "0x76", "description": "Temperature, humidity, pressure."}
        c.tool_json("wired_add", name="chk_temp", entry=bme)
        return refused(c, "used by i2c.i2c0", name="chk_btn", entry={"type": "button", "pin": 8, "description": "x"})

    def own_bus():
        c.tool_json("wired_add", kind="i2c", name="chk_bus", entry={"sda": 1, "scl": 3})
        c.tool_json("wired_add", name="chk_mag", entry={"type": "QMC5883", "bus": "i2c.chk_bus", "i2c_address": "0x0d", "description": "Compass."})
        try:
            c.tool("wired_remove", name="chk_bus")
            raise AssertionError("removed a bus a device names")
        except ToolError as e:
            expect("chk_mag uses chk_bus" in str(e), e)
        refused(c, "already gives that bus's pins", name="chk_x", entry={"type": "x", "bus": "i2c.chk_bus", "sda": 1, "description": "x"})

    switch = lambda pin: {"type": "switch", "pin": pin, "description": "x"}
    ck.run("tools and the rule are there", tools_and_rule)
    ck.run("a switch is recorded, named and shown", switch_recorded)
    ck.run("the same name replaces it", replaced_in_place)
    ck.run("a default bus gives way to what's wired", default_bus_gives_way)
    ck.run("a sensor shares the default I2C bus, whose pins are then taken", sensor_shares_i2c)
    ck.run("a bus of its own, and a device on it", own_bus)
    ck.run("refused: a board device's pin", lambda: refused(c, "used by status_led", name="chk_x", entry=switch(48)))
    ck.run("refused: the console UART", lambda: refused(c, "used by uart.primary", name="chk_x", entry=switch(43)))
    ck.run("refused: USB", lambda: refused(c, "used by usb", name="chk_x", entry=switch(19)))
    ck.run("refused: flash and PSRAM", lambda: refused(c, "flash and PSRAM", name="chk_x", entry=switch(30)))
    ck.run("refused: a GPIO the S3 lacks", lambda: refused(c, "doesn't exist", name="chk_x", entry=switch(23)))
    ck.run("refused: a pin already wired", lambda: refused(c, "used by chk_door", name="chk_x", entry=switch(2)))
    ck.run("refused: a bus that isn't there", lambda: refused(c, "no bus i2c.i2c9", name="chk_x", entry={"type": "x", "bus": "i2c.i2c9", "description": "x"}))
    ck.run("refused: the board's own name", lambda: refused(c, "own hardware", name="status_led", entry=switch(5)))
    ck.run("refused: a bad name", lambda: refused(c, "lowercase", name="Door", entry=switch(5)))
    ck.run("refused: a long description", lambda: refused(c, "under 300", name="chk_x", entry=dict(switch(5), description="x" * 301)))
    ck.run("refused: no description", lambda: refused(c, "type and a description", name="chk_x", entry={"type": "switch", "pin": 5}))

    def removed():
        clear(c)
        text = instructions(c)
        expect("chk_" not in text and '"can0"' in text, "not all taken out")
        try:
            c.tool("wired_remove", name="chk_door")
            raise AssertionError("removed something not there")
        except ToolError as e:
            expect("Nothing named chk_door" in str(e), e)

    ck.run("removing them brings the defaults back", removed)
    print(json.dumps({"failed": ck.failed}))
    raise SystemExit(1 if ck.failed else 0)


if __name__ == "__main__":
    main()
