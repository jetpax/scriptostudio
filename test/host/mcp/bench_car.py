#!/usr/bin/env python3
"""Play a car on a CAN bus, through an slcan adapter, for an agent to work out.

    bench_car.py --adapter /dev/cu.usbmodem11201

Sends background traffic with counters and analog-looking values, and body frames that follow
commands typed here: left, right, hazard, brake, lights, or off. Which identifiers and bits
those are is deliberately not printed, since finding them is the agent's job. It also counts
any frame it hears, since a device that's only listening never sends one.

A CANable has no way to send without an acknowledgement, and a device that's only listening
doesn't give one, so on a bench of just these two nothing would get through. This installs an
app that makes the device acknowledge at the bus level, and sends no frames:

    bench_car.py --device 192.168.1.50 --relay /path/to/ss-relay --ack on

The lights can be checked against a device, using the pins the agent was told to use:

    bench_car.py --adapter /dev/cu.usbmodem11201 --device 192.168.1.50 --relay /path/to/ss-relay --verify 1,2,3
"""

import argparse
import math
import random
import threading
import time

import serial

TICK_S = 0.01
FLASH_S = 0.33
# Identifier: how often it goes, in ticks
ENGINE = (0x0C0, 2)
SPEED = (0x1A0, 2)
BRAKE = (0x1F0, 2)
STEERING = (0x2F0, 5)
BODY = (0x470, 10)
CLIMATE = (0x5A0, 50)
VIN = (0x7A0, 100)
ACK_APP_ID = "bench-ack"
ACK_APP = """
import asyncio
import CAN
from lib.sys import can_tap

async def run():
    can_tap._set_up_bus(None)
    handle = CAN.register(CAN.TX_ENABLED)
    CAN.activate(handle)
    while True:
        await asyncio.sleep(3600)
"""


class BenchCar:
    def __init__(self, port):
        self.port = serial.Serial(port, 115200, timeout=0)
        for command in (b"C\r", b"S6\r", b"O\r"):
            self.port.write(command)
            time.sleep(0.05)
        self.left = False
        self.right = False
        self.brake = False
        self.lights = False
        self.running = True
        self.tick = 0
        self.heard = 0
        self.unread = b""
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def command(self, word):
        if word == "left":
            self.left, self.right = not self.left, False
        elif word == "right":
            self.right, self.left = not self.right, False
        elif word == "hazard":
            on = not (self.left and self.right)
            self.left = self.right = on
        elif word == "brake":
            self.brake = not self.brake
        elif word == "lights":
            self.lights = not self.lights
        elif word == "off":
            self.left = self.right = self.brake = self.lights = False
        else:
            return False
        return True

    def state(self):
        return {"left": self.left, "right": self.right, "brake": self.brake, "lights": self.lights, "frames_heard": self.heard}

    def _frame(self, frame_id, data):
        return b"t%03x%d%s\r" % (frame_id, len(data), bytes(data).hex().encode())

    def _flashing(self):
        return int(self.tick * TICK_S / FLASH_S) % 2 == 0

    def _frames(self):
        t = self.tick * TICK_S
        out = []
        if self.tick % ENGINE[1] == 0:
            rpm = int(1800 + 300 * math.sin(t / 3) + random.randint(-20, 20))
            out.append(self._frame(ENGINE[0], [rpm >> 8, rpm & 255, 90, 0, 0, 0, self.tick // ENGINE[1] & 15, 0]))
        if self.tick % SPEED[1] == 0:
            speed = int(1200 + 200 * math.sin(t / 7))
            out.append(self._frame(SPEED[0], [speed >> 8, speed & 255, speed >> 8, speed & 255, 0, 0, self.tick // SPEED[1] & 15, 0]))
        if self.tick % BRAKE[1] == 0:
            pressure = random.randint(60, 90) if self.brake else 0
            out.append(self._frame(BRAKE[0], [pressure, 0x08 if self.brake else 0, 0, 0, self.tick // BRAKE[1] & 15, 0]))
        if self.tick % STEERING[1] == 0:
            angle = int(32768 + 900 * math.sin(t / 5))
            out.append(self._frame(STEERING[0], [angle >> 8, angle & 255, 0, self.tick // STEERING[1] & 255]))
        if self.tick % BODY[1] == 0:
            lamps = (0x01 if self.left and self._flashing() else 0) | (0x02 if self.right and self._flashing() else 0)
            out.append(self._frame(BODY[0], [lamps, 0x40, 0, 0, 0, 0x01 if self.lights else 0, 0, self.tick // BODY[1] & 15]))
        if self.tick % CLIMATE[1] == 0:
            out.append(self._frame(CLIMATE[0], [21 + self.tick // 3000 % 3, 3, 0, 0]))
        if self.tick % VIN[1] == 0:
            out.append(self._frame(VIN[0], list(b"BENCHCAR")))
        return out

    def _run(self):
        next_at = time.time()
        while self.running:
            batch = self._frames()
            if batch:
                self.port.write(b"".join(batch))
            self.tick += 1
            next_at += TICK_S
            late = next_at - time.time()
            if late > 0:
                time.sleep(late)
            self._count_heard()

    def _count_heard(self):
        lines = (self.unread + self.port.read(4096)).split(b"\r")
        self.unread = lines.pop()
        self.heard += sum(1 for line in lines if line[:1] in (b"t", b"T"))

    def close(self):
        self.running = False
        self.thread.join(1)
        self.port.write(b"C\r")
        self.port.close()


def read_pins(relay, pins):
    code = "from machine import Pin\nprint([Pin(p).value() for p in %r])" % (pins,)
    return tuple(eval(relay.ok("exec", code=code, echo=False).strip()))


def connect(args):
    from check_relay import Relay

    relay = Relay([args.relay, "--device", f"ws://{args.device}/mcp"], args.password)
    for _ in range(50):
        if "exec" in {t["name"] for t in relay.call("tools/list")["result"]["tools"]}:
            return relay
        time.sleep(0.2)
    raise TimeoutError("the device never offered its tools")


def set_ack(args):
    relay = connect(args)
    try:
        if args.ack == "on":
            print(relay.ok("app_create", id=ACK_APP_ID, code=ACK_APP, name="Bench ACK", run_at_boot=True))
        else:
            print(relay.ok("app_remove", id=ACK_APP_ID))
    finally:
        relay.close()


def verify(car, args):
    pins = [int(p) for p in args.verify.split(",")]
    relay = connect(args)
    car.command("off")
    time.sleep(1)
    print("all off:", read_pins(relay, pins))
    for word in ("brake", "lights", "left", "right"):
        car.command(word)
        seen = set()
        begin = time.time()
        while time.time() - begin < 2.5:
            seen.add(read_pins(relay, pins))
            time.sleep(0.05)
        car.command(word)
        print(f"{word}: pins {pins} took the values {sorted(seen)}")
        time.sleep(1)
    print("frames heard from the device:", car.heard)
    relay.close()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--adapter")
    ap.add_argument("--device", help="the device's address")
    ap.add_argument("--relay")
    ap.add_argument("--ack", choices=("on", "off"), help="install or remove the app that acknowledges frames")
    ap.add_argument("--verify", metavar="PINS", help="pins to read, for the lights, as 1,2,3")
    ap.add_argument("--password", default="password")
    args = ap.parse_args()

    if args.ack:
        set_ack(args)
        return
    car = BenchCar(args.adapter)
    try:
        if args.verify:
            verify(car, args)
            return
        print("Running. Commands: left, right, hazard, brake, lights, off, quit. Each one toggles.")
        while True:
            word = input("> ").strip()
            if word == "quit":
                return
            if not car.command(word):
                print("Commands: left, right, hazard, brake, lights, off, quit")
            print(car.state())
    finally:
        car.close()


if __name__ == "__main__":
    main()
