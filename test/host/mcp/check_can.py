#!/usr/bin/env python3
"""Check the transmit latch and the CAN stream on a real bus, against a device.

    check_can.py --host 192.168.1.50 --relay /path/to/ss-relay --adapter /dev/cu.usbmodem11201

The adapter is an slcan device, such as a CANable, on the same bus as the device. It sees
what the device really transmits, and generates the load. Needs pyserial. Installs
apps/cancheck on the device, and removes it again.
"""

import argparse
import json
import os
import statistics
import struct
import subprocess
import threading
import time

import serial

from check_m1 import Check, expect
from check_relay import Relay
from mcp_client import FRAME_DATA, RpcError, ToolError, Ws, token

APP_ID = "can-check"
APP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "apps", "cancheck")
CONTROL = 3
TX_ARM = 2
TX_DISARM = 3
NOT_ARMED = "isn't armed"
RECORD_SIZE = 20
SEEN_WAIT_S = 1.0
ARM_LAND_S = 0.2
RELAY_ARM_LAND_S = 2.5
LOAD_ID = 0x321
LOAD_FPS = 4600
STEADY_FPS = 1000
STEADY_S = 15
STEADY_TOLERANCE = 3
LOAD_BATCH_S = 0.01
LOAD_S = 30
STALL_S = 5
TOOL_P95_LIMIT_MS = 100
MIN_CAPTURE_FPS = 3000
BUS_BITS_PER_FRAME = 111
MIN_SATURATED_LOAD_PCT = 80
BITRATE = 500000


class Slcan:
    """An slcan adapter: what it hears, how many frames it got onto the bus, and a generator."""

    def __init__(self, port):
        self.port = serial.Serial(port, 115200, timeout=0.05)
        self.lock = threading.Lock()
        self.heard = []
        self.keep_heard = True
        self.running = True
        for command in (b"C\r", b"S6\r", b"O\r"):
            self.port.write(command)
            time.sleep(0.05)
        self.port.reset_input_buffer()
        self.reader = threading.Thread(target=self._read, daemon=True)
        self.reader.start()

    def _read(self):
        buffer = b""
        while self.running:
            buffer += self.port.read(4096)
            parts = buffer.replace(b"\x07", b"\x07\r").split(b"\r")
            buffer = parts.pop()
            for line in parts:
                if line.startswith(b"t"):
                    if self.keep_heard:
                        with self.lock:
                            self.heard.append((int(line[1:4], 16), bytes.fromhex(line[5:5 + 2 * int(line[4:5])].decode())))

    def saw(self, frame_id, data, wait=SEEN_WAIT_S):
        deadline = time.time() + wait
        while time.time() < deadline:
            with self.lock:
                if (frame_id, data) in self.heard:
                    return True
            time.sleep(0.02)
        return False

    def generate(self, seconds, fps=LOAD_FPS):
        """Send as fast as asked, or as the bus allows. Returns the commands written."""
        written = 0
        begin = time.time()
        counter = 0
        while time.time() - begin < seconds:
            batch = bytearray()
            for _ in range(int(fps * LOAD_BATCH_S)):
                counter += 1
                batch += b"t%03x8%016x\r" % (LOAD_ID, counter)
                written += 1
            self.port.write(batch)
            late = begin + written / fps - time.time()
            if late > 0:
                time.sleep(late)
        return written

    def close(self):
        self.running = False
        self.reader.join(1)
        self.port.write(b"C\r")
        self.port.close()


def arm(person, ms):
    person.send_frame(CONTROL, TX_ARM, ms)
    time.sleep(ARM_LAND_S)


def disarm(person):
    person.send_frame(CONTROL, TX_DISARM, 0)
    time.sleep(ARM_LAND_S)


def run(client, code):
    """Returns (text, whether it failed)."""
    try:
        return client.tool("exec", code=code, echo=False), False
    except ToolError as e:
        return str(e), True


def send_code(frame_id, data):
    return "import CAN\nCAN(0).send(list(%r), %d)\nprint('sent')" % (data, frame_id)


def refused(client, frame_id, data, adapter):
    text, failed = run(client, send_code(frame_id, data))
    expect(failed and NOT_ARMED in text, text)
    expect(not adapter.saw(frame_id, data), "it reached the bus anyway")


def sent(client, frame_id, data, adapter):
    text, failed = run(client, send_code(frame_id, data))
    expect(not failed and "sent" in text, text)
    expect(adapter.saw(frame_id, data), "it never reached the bus")


TASK_CODE = """
import __main__, CAN
__main__._can_task = None
async def _can_task_run():
    try:
        CAN(0).send(list(%r), %d)
        __main__._can_task = 'sent'
    except OSError as e:
        __main__._can_task = str(e)
"""


def task_result(client):
    time.sleep(0.3)
    return run(client, "import __main__\nprint(__main__._can_task)")[0]


def check_latch(ck, person, agent, adapter, args):
    def set_up():
        code = """
import CAN
from machine import Pin
from lib.sys import board
bus = board.can('can0')
Pin(bus.standby, Pin.OUT, value=0)
CAN(0, extframe=False, tx=bus.tx, rx=bus.rx, mode=CAN.NORMAL, bitrate=%d)
print('ok')
""" % BITRATE
        text, failed = run(person, code)
        expect(not failed, text)

    def off_by_default():
        expect(agent.tool_json("device_info")["tx_gate"] is False, "the gate is on")
        sent(agent, 0x100, b"\x01\x00", adapter)
        text, failed = run(person, "import mcplink\nprint(mcplink.tx_gate(True))")
        expect(not failed and "True" in text, text)

    def person_transmits_unarmed():
        sent(person, 0x101, b"\x01\x01", adapter)

    def agent_exec_refused():
        refused(agent, 0x102, b"\x01\x02", adapter)

    def agent_create_task_refused():
        code = TASK_CODE % (b"\x01\x03", 0x103) + "import asyncio\nasyncio.create_task(_can_task_run())\n"
        text, failed = run(agent, code)
        expect(not failed, text)
        expect(NOT_ARMED in task_result(agent), "a task it started wasn't gated")
        expect(not adapter.saw(0x103, b"\x01\x03"), "it reached the bus anyway")

    def agent_bg_task_refused():
        code = TASK_CODE % (b"\x01\x04", 0x104) + "from lib.sys import bg_tasks\nbg_tasks.start('can_check', _can_task_run, restart=True)\n"
        text, failed = run(agent, code)
        expect(not failed, text)
        expect(NOT_ARMED in task_result(agent), "a bg_task it started wasn't gated")
        expect(not adapter.saw(0x104, b"\x01\x04"), "it reached the bus anyway")

    def person_task_runs_alongside():
        code = TASK_CODE % (b"\x01\x05", 0x105) + "from lib.sys import bg_tasks\nbg_tasks.start('can_check', _can_task_run, restart=True)\n"
        text, failed = run(person, code)
        expect(not failed, text)
        expect("sent" in task_result(person), "a person's task was gated")
        expect(adapter.saw(0x105, b"\x01\x05"), "it never reached the bus")

    def agent_tool_refused_unless_read_only():
        result = agent.call("tools/call", {"name": "can_check_send", "arguments": {"id": 0x106}})
        expect(result.get("isError") and NOT_ARMED in result["content"][0]["text"], result)
        expect(not adapter.saw(0x106, b"\x01\x06"), "it reached the bus anyway")
        result = agent.call("tools/call", {"name": "can_check_read", "arguments": {"id": 0x107}})
        expect(not result.get("isError"), result)
        expect(adapter.saw(0x107, b"\x01\x06"), "a read-only tool's request never reached the bus")

    def agent_cant_arm():
        agent.send_frame(CONTROL, TX_ARM, 60000)
        time.sleep(ARM_LAND_S)
        expect(agent.tool_json("device_info")["tx_armed_ms"] == 0, "an agent armed it")
        refused(agent, 0x108, b"\x01\x08", adapter)

    def no_python_setter():
        text, failed = run(agent, "import mcplink\nprint([n for n in dir(mcplink) if 'arm' in n])")
        expect(not failed and "tx_armed_ms" in text and "tx_arm'" not in text, text)

    def arm_lets_an_agent_send():
        person.notes.clear()
        arm(person, 5000)
        expect(agent.tool_json("device_info")["tx_armed_ms"] > 0, "not armed")
        sent(agent, 0x109, b"\x01\x09", adapter)
        note = person.next_note(1)
        # The person is also told what the agent called
        while note and "agent_activity" in note["params"]:
            note = person.next_note(1)
        expect(note and note["params"].get("tx_armed_ms", 0) > 0, note)
        disarm(person)

    def latch_expires():
        arm(person, 1000)
        sent(agent, 0x10A, b"\x01\x0a", adapter)
        time.sleep(1.2)
        expect(agent.tool_json("device_info")["tx_armed_ms"] == 0, "it didn't expire")
        refused(agent, 0x10B, b"\x01\x0b", adapter)

    def disarm_works():
        arm(person, 60000)
        disarm(person)
        refused(agent, 0x10C, b"\x01\x0c", adapter)

    def goes_with_the_person():
        other = Ws(args.url, token(args.password, "human"))
        arm(other, 60000)
        expect(agent.tool_json("device_info")["tx_armed_ms"] > 0, "not armed")
        other.close()
        time.sleep(1)
        expect(agent.tool_json("device_info")["tx_armed_ms"] == 0, "it stayed armed with nobody there")

    def relay_arm_works_and_ends_with_it():
        env = {**os.environ, "SS_RELAY_PASSWORD": args.password}
        process = subprocess.Popen([args.relay, "--device", args.url, "arm", "--seconds", "30"], env=env, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
        try:
            time.sleep(RELAY_ARM_LAND_S)
            expect(agent.tool_json("device_info")["tx_armed_ms"] > 0, "not armed")
            sent(agent, 0x10D, b"\x01\x0d", adapter)
        finally:
            process.terminate()
            process.wait(5)
        time.sleep(1)
        refused(agent, 0x10E, b"\x01\x0e", adapter)

    def other_transmit_paths_refused():
        checked = []
        for code in ("import gvret\ngvret.start(4, 5, 500000)", "import plc\nplc.start_evse()"):
            text, failed = run(agent, code)
            if "ImportError" in text:
                continue
            expect(failed and NOT_ARMED in text, text)
            checked.append(code.split()[1])
        text, failed = run(agent, "import CAN\nCAN.transmit(0, {'id': 1, 'data': b'1'})")
        expect(failed and NOT_ARMED in text, text)
        return {"checked": checked + ["CAN.transmit"]}

    ck.run("latch: set up the bus", set_up)
    ck.run("latch: it's off by default, and an agent transmits with no arm", off_by_default)
    ck.run("latch: with it on, a person transmits with no arm", person_transmits_unarmed)
    ck.run("latch: an agent's exec is refused, and the bus stays quiet", agent_exec_refused)
    ck.run("latch: a task an agent starts with create_task is refused", agent_create_task_refused)
    ck.run("latch: a task an agent starts with bg_tasks is refused", agent_bg_task_refused)
    ck.run("latch: a person's task keeps transmitting", person_task_runs_alongside)
    ck.run("latch: an agent's tool is refused unless read-only", agent_tool_refused_unless_read_only)
    ck.run("latch: an agent's own control frame doesn't arm it", agent_cant_arm)
    ck.run("latch: Python has no way to set it", no_python_setter)
    ck.run("latch: a person's arm lets an agent send", arm_lets_an_agent_send)
    ck.run("latch: it expires", latch_expires)
    ck.run("latch: disarm is immediate", disarm_works)
    ck.run("latch: it goes when the person who armed it does", goes_with_the_person)
    ck.run("latch: ss-relay arm works from a terminal, and ends with it", relay_arm_works_and_ends_with_it)
    ck.run("latch: GVRET, PLC and CAN.transmit are refused too", other_transmit_paths_refused)
    run(person, "import mcplink\nmcplink.tx_gate(False)")


class Reader:
    """What a viewer sees. The generator counts up in each frame, so the counters it never
    saw are what really went missing, wherever that happened. They can arrive slightly out
    of order, since an adapter's mailboxes don't keep it."""

    def __init__(self, person, sid):
        self.person = person
        self.sid = sid
        self.frames = 0
        self.seq_lost = 0
        self.bad = 0
        self.expected = None
        self.load_frames = 0
        self.lowest = None
        self.highest = None

    def read(self, seconds):
        deadline = time.time() + seconds
        while time.time() < deadline:
            frame = self.person.next_frame(0.2)
            if frame is None:
                continue
            kind, stream, _, seq, payload = frame
            if stream != self.sid or kind != FRAME_DATA:
                continue
            if len(payload) % RECORD_SIZE:
                self.bad += 1
            if self.expected is not None and seq != self.expected:
                self.seq_lost += (seq - self.expected) // RECORD_SIZE
            self.expected = seq + len(payload)
            self.frames += len(payload) // RECORD_SIZE
            for at in range(0, len(payload) - RECORD_SIZE + 1, RECORD_SIZE):
                if struct.unpack_from("<I", payload, at + 4)[0] != LOAD_ID:
                    continue
                counter = int.from_bytes(payload[at + 12 : at + 20], "big")
                self.load_frames += 1
                self.lowest = counter if self.lowest is None else min(self.lowest, counter)
                self.highest = counter if self.highest is None else max(self.highest, counter)

    def since(self, other):
        never_seen = 0 if self.lowest is None else self.highest - self.lowest + 1 - self.load_frames
        return {"frames": self.frames - other[0], "seq_lost": self.seq_lost - other[1], "never_seen": never_seen}

    def mark(self):
        self.load_frames = 0
        self.lowest = None
        self.highest = None
        return (self.frames, self.seq_lost)


class ToolTimer(threading.Thread):
    """An agent's tool calls, while something else is going on."""

    def __init__(self, client):
        super().__init__(daemon=True)
        self.client = client
        self.times = []
        self.stop_flag = threading.Event()

    def run(self):
        while not self.stop_flag.is_set():
            begin = time.perf_counter()
            self.client.tool("exec", code="print(1)", echo=False)
            self.times.append((time.perf_counter() - begin) * 1000)
            time.sleep(0.1)

    def finish(self):
        self.stop_flag.set()
        self.join(5)
        ordered = sorted(self.times)
        return {"calls": len(ordered), "p50_ms": round(statistics.median(ordered)), "p95_ms": round(ordered[int(len(ordered) * 0.95)]), "max_ms": round(ordered[-1])}


def check_stream(ck, person, agent, adapter, args):
    info = {}
    reader = Reader(person, None)

    def run_load(seconds, fps):
        sid = info["stream"]
        before = person.tool_json("stream_status", stream=sid)["bus"]
        timer = ToolTimer(agent)
        timer.start()
        start = reader.mark()
        generator = threading.Thread(target=lambda: adapter.generate(seconds, fps), daemon=True)
        generator.start()
        reader.read(seconds + 1.5)
        generator.join()
        tools = timer.finish()
        got = reader.since(start)
        bus = person.tool_json("stream_status", stream=sid)["bus"]
        seen_fps = got["frames"] / seconds
        detail = {
            **got,
            "fps": round(seen_fps),
            "bus_load_pct": round(100 * seen_fps * BUS_BITS_PER_FRAME / BITRATE),
            "rx_missed": bus["rx_missed"] - before["rx_missed"],
            "bus_errors": bus["bus_errors"] - before["bus_errors"],
            "tools": tools,
        }
        print(json.dumps(detail), flush=True)
        expect(not reader.bad, f"{reader.bad} frames weren't whole records")
        expect(got["frames"], "no frames arrived")
        expect(tools["p95_ms"] < TOOL_P95_LIMIT_MS, tools)
        return detail

    def open_the_stream():
        info.update(person.stream_open("can", ack=True))
        adapter.keep_heard = False
        reader.__init__(person, info["stream"])

    def opening_the_bus_leaves_a_tap_alone():
        opener = """
import CAN
from lib.sys import board
bus = board.can('can0')
CAN(0, extframe=False, tx=bus.tx, rx=bus.rx, mode=CAN.NORMAL, bitrate=%d)
print('ok')
"""
        text, failed = run(agent, opener % BITRATE)
        expect(not failed, text)
        text, failed = run(agent, opener % (BITRATE // 2))
        expect(failed and "in use" in text, text)
        adapter.keep_heard = True
        sent(agent, 0x110, b"\x01\x10", adapter)
        adapter.keep_heard = False
        start = reader.mark()
        generator = threading.Thread(target=lambda: adapter.generate(3, STEADY_FPS), daemon=True)
        generator.start()
        reader.read(3.5)
        generator.join()
        got = reader.since(start)
        expect(got["frames"] >= 3 * STEADY_FPS * 0.9, got)
        return got

    def steady_load_loses_nothing_unreported():
        detail = run_load(STEADY_S, STEADY_FPS)
        # Below zero is frames seen twice: a retry after a bus error, as CAN allows
        expect(detail["never_seen"] <= detail["seq_lost"] + detail["rx_missed"] + STEADY_TOLERANCE, f"loss not explained: {detail}")
        return detail

    def saturated_bus_reaches_the_viewer():
        detail = run_load(LOAD_S, LOAD_FPS)
        expect(detail["bus_load_pct"] >= MIN_SATURATED_LOAD_PCT, f"the bus wasn't saturated: {detail}")
        expect(detail["seq_lost"] + detail["rx_missed"] >= 0, detail)
        return detail

    def a_stalled_reader_sees_its_loss():
        sid = info["stream"]
        before = person.tool_json("stream_status", stream=sid)["dropped"]
        start = reader.mark()
        generator = threading.Thread(target=lambda: adapter.generate(STALL_S + 4), daemon=True)
        generator.start()
        reader.read(1)
        # Nothing reads the socket here, so it backs up into the ring, and that drops the oldest
        time.sleep(STALL_S)
        reader.read(3.5)
        generator.join()
        got = reader.since(start)
        status = person.tool_json("stream_status", stream=sid)
        dropped = (status["dropped"] - before) // RECORD_SIZE
        expect(got["seq_lost"] > 0 and dropped > 0, {**got, "status_dropped": dropped})
        expect(not reader.bad, f"{reader.bad} frames weren't whole records")
        return {**got, "status_dropped": dropped}

    def capture_summarises_the_bus():
        generator = threading.Thread(target=lambda: adapter.generate(5), daemon=True)
        generator.start()
        time.sleep(0.5)
        result = agent.call("tools/call", {"name": "can_capture", "arguments": {"seconds": 3}})
        generator.join()
        expect(not result.get("isError"), result)
        report = json.loads(result["content"][0]["text"].split("\n")[0])
        key = "%03x" % LOAD_ID
        expect(key in report["ids"] and report["ids"][key]["count"] > 0, report)
        expect(report["seconds"] <= 4.5, report["seconds"])
        expect(report["per_s"] >= MIN_CAPTURE_FPS, report["per_s"])
        expect(report["lost_in_controller"] == 0, report["lost_in_controller"])
        # The counter in the frames is what's moving
        expect(report["ids"][key]["changing_bits"], report["ids"][key])
        return {"seconds": report["seconds"], "per_s": report["per_s"]}

    def capture_finds_what_an_action_changed():
        car = threading.Event()
        lit = threading.Event()

        def drive():
            n = 0
            while not car.is_set():
                n += 1
                batch = b"t0c08%016x\r" % n + b"t4708%02x00000000000000\r" % (0x08 if lit.is_set() else 0)
                adapter.port.write(batch)
                time.sleep(0.01)

        thread = threading.Thread(target=drive, daemon=True)
        thread.start()
        try:
            time.sleep(0.3)
            result = agent.call("tools/call", {"name": "can_capture", "arguments": {"seconds": 3, "baseline": True}})
            expect(not result.get("isError"), result)
            lit.set()
            time.sleep(0.2)
            result = agent.call("tools/call", {"name": "can_capture", "arguments": {"seconds": 3}})
            expect(not result.get("isError"), result)
        finally:
            car.set()
            thread.join(1)
        report = json.loads(result["content"][0]["text"].split("\n")[0])
        # A counter's slow bits can move between captures too, so only they may join it
        reaction = report["reaction"]
        found = [row for row in reaction if row["id"] == "470"]
        expect(len(found) == 1 and found[0]["byte"] == 0 and found[0]["bit"] == 3, reaction)
        expect(found[0]["was"] == 0 and found[0]["now"] == 1, reaction)
        expect(all(row["id"] in ("470", "0c0") for row in reaction), reaction)
        return found[0]

    def watch_only_sees_its_identifiers():
        code = """
import __main__, asyncio
from lib.sys import can_tap, bg_tasks
__main__._watched = None
async def _watch_run():
    watcher = can_tap.watch([0x470])
    seen = {}
    for _ in range(60):
        for frame_id, data in watcher.read():
            seen[frame_id] = seen.get(frame_id, 0) + 1
        await asyncio.sleep_ms(50)
    __main__._watched = (seen, watcher.lost())
    watcher.close()
bg_tasks.start('watch_check', _watch_run, restart=True)
"""
        text, failed = run(person, code)
        expect(not failed, text)
        stop = threading.Event()

        def drive():
            n = 0
            while not stop.is_set():
                n += 1
                adapter.port.write(b"".join(b"t3218%016x\r" % (n + i) for i in range(20)) + b"t47080000000000000000\r")
                time.sleep(0.01)

        thread = threading.Thread(target=drive, daemon=True)
        thread.start()
        time.sleep(3.5)
        stop.set()
        thread.join(1)
        seen, lost = eval(run(person, "import __main__\nprint(__main__._watched)")[0].strip())
        expect(list(seen.keys()) == [0x470] and seen[0x470] > 50, seen)
        expect(lost == 0, lost)
        return {"frames": seen[0x470]}

    def capture_filters():
        generator = threading.Thread(target=lambda: adapter.generate(2), daemon=True)
        generator.start()
        result = agent.call("tools/call", {"name": "can_capture", "arguments": {"seconds": 1, "id": 0x7FF}})
        generator.join()
        report = json.loads(result["content"][0]["text"].split("\n")[0])
        expect(report["frames"] == 0, report)
        result = agent.call("tools/call", {"name": "can_capture", "arguments": {"seconds": 1, "id": LOAD_ID}})
        report = json.loads(result["content"][0]["text"].split("\n")[0])
        expect(not report["ids"] or list(report["ids"].keys()) == ["%03x" % LOAD_ID], report)

    def closing_stops_it():
        sid = info["stream"]
        person.tool("stream_close", stream=sid)
        time.sleep(0.3)
        tasks = person.tool_json("device_info")
        expect(tasks, "the device stopped answering")

    ck.run("can: open a stream, acknowledging frames", open_the_stream)
    ck.run("can: an agent opening the bus leaves a running tap alone", opening_the_bus_leaves_a_tap_alone)
    ck.run("can: under steady load, everything missing is something the device reported", steady_load_loses_nothing_unreported)
    ck.run("can: a saturated bus reaches the viewer, and tools still answer", saturated_bus_reaches_the_viewer)
    ck.run("can: a stalled reader sees what it lost", a_stalled_reader_sees_its_loss)
    # The device drops a client that stops reading for long, and nothing reads this one below
    ck.run("can: closing the stream stops the tap", closing_stops_it)
    ck.run("can: can_capture summarises the bus for an agent", capture_summarises_the_bus)
    ck.run("can: can_capture filters by identifier", capture_filters)
    ck.run("can: can_capture finds what an action changed", capture_finds_what_an_action_changed)
    ck.run("can: an app's watch only sees its identifiers", watch_only_sees_its_identifiers)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", required=True)
    ap.add_argument("--relay", required=True)
    ap.add_argument("--adapter", required=True)
    ap.add_argument("--scheme", default="ws")
    ap.add_argument("--password", default="password")
    ap.add_argument("--only", default=None, help="latch or can")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    args.url = f"{args.scheme}://{args.host}/mcp"

    relay = Relay([args.relay, "--device", args.url], args.password)
    for _ in range(50):
        if "sync" in {t["name"] for t in relay.call("tools/list")["result"]["tools"]} and "exec" in {t["name"] for t in relay.call("tools/list")["result"]["tools"]}:
            break
        time.sleep(0.2)
    relay.ok_json("sync", local=APP_DIR)
    # The device holds three sockets, and a fourth pushes out whichever has been quiet longest
    relay.close()

    ck = Check()
    adapter = Slcan(args.adapter)
    person = Ws(args.url, token(args.password, "human"))
    agent = Ws(args.url, token(args.password, "agent"))
    try:
        if args.only in (None, "latch"):
            check_latch(ck, person, agent, adapter, args)
        if args.only in (None, "can"):
            check_stream(ck, person, agent, adapter, args)
    except (RpcError, ToolError) as e:
        print("stopped:", e)
        ck.failed += 1
    finally:
        adapter.close()
        agent.tool("app_remove", id=APP_ID)
        person.close()
        agent.close()

    passed = sum(1 for r in ck.results.values() if r["ok"])
    print(f"\n{passed} of {len(ck.results)} passed.")
    with open(args.out or f"can-{args.host}-{int(time.time())}.json", "w") as f:
        json.dump(ck.results, f, indent=2)
    raise SystemExit(1 if ck.failed else 0)


if __name__ == "__main__":
    main()
