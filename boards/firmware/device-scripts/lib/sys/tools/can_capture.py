# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(
        name="Capture CAN",
        description=(
            "Listen to the CAN bus for a while, and report what's on it, per identifier: rate, latest "
            "data, and which bits changed and how often. Sends nothing. To find what an action does, "
            "capture with baseline=true while nothing is happening, ask the person to do it, then "
            "capture again: reaction lists the bits that moved or now differ, and were steady before, "
            "steadiest first. Slow counters and analog values get in too, so repeat it to see what "
            "follows the action. A bit toggling a few times a second is likely a flashing indicator. "
            "A ScriptO reads what you find on can0 with from lib.sys import can_tap, then watcher = "
            "can_tap.watch([0x470]), and watcher.read() returns (id, data) rows and never waits. "
            "watch([]) gets every identifier, and watcher.lost() says how many frames read() was too "
            "slow for. It stays listen-only, so don't send anything to do this. To send a frame, "
            "can_tap.bus().send([1, 6], 0x123). If that's refused as not armed, ask the person to arm it."
        ),
        effects=dict(readOnly=True, destructive=False, openWorld=False),
    ),
    args=dict(
        seconds=dict(label="How many seconds, up to 60:", type=int, value=5),
        baseline=dict(label="Remember this as the baseline to compare later captures with:", type=bool, value=False),
        id=dict(label="Only this identifier, or those matching it under mask:", type=int, optional=True),
        mask=dict(label="Identifier bits that have to match:", type=int, optional=True),
    ),
)
# === END_CONFIG_PARAMETERS ===

import __main__
import asyncio
import binascii
import struct
import time

from lib.sys import can_tap

MAX_SECONDS = 60
MAX_IDS = 256
POLL_MS = 200
FREE_DELAY_MS = 50
EVERY_BIT = 0x1FFFFFFF
EXTENDED = 1
BASELINE = "_can_capture_baseline"


def _hex(data):
    return binascii.hexlify(data).decode()


def _bits(mask):
    """Each set bit of some bytes, as (byte, bit)."""
    return [(byte, bit) for byte in range(len(mask)) for bit in range(8) if mask[byte] & (1 << bit)]


def _reaction(rows, baseline):
    found = []
    for key, row in rows.items():
        before = baseline.get(key)
        if before is None:
            found.append({"id": key, "new_identifier": True, "data": _hex(row["last_raw"])})
            continue
        size = min(len(row["last_raw"]), len(before["last_raw"]))
        moved = bytes(
            (row["changed_raw"][i] | (row["last_raw"][i] ^ before["last_raw"][i])) & ~before["changed_raw"][i] & 0xFF
            for i in range(size)
        )
        for byte, bit in _bits(moved):
            mask = 1 << bit
            found.append(
                {
                    "id": key,
                    "byte": byte,
                    "bit": bit,
                    "was": 1 if before["last_raw"][byte] & mask else 0,
                    "now": 1 if row["last_raw"][byte] & mask else 0,
                    "toggles_per_s": round(row["toggles"][byte * 8 + bit] / row["took"], 2),
                }
            )
    found.sort(key=lambda row: row.get("toggles_per_s", 0))
    return found


async def run(args, job):
    seconds = min(args.seconds, MAX_SECONDS)
    mask = EVERY_BIT if args.mask is None else args.mask
    filters = () if args.id is None else ((args.id, mask),)
    activity = can_tap.Activity(MAX_IDS, filters)
    try:
        missed_before = can_tap.stats().get("rx_missed", 0)
        start = time.ticks_ms()
        while time.ticks_diff(time.ticks_ms(), start) < seconds * 1000:
            job.progress(time.ticks_diff(time.ticks_ms(), start) // 1000, seconds)
            await asyncio.sleep_ms(POLL_MS)
        took = time.ticks_diff(time.ticks_ms(), start) / 1000
        stats = can_tap.stats()
        activity.stop()
        await asyncio.sleep_ms(FREE_DELAY_MS)
        found, beyond = activity.read()
    finally:
        activity.free()

    rows = {}
    frames = 0
    for frame_id, flags, dlc, count, first_us, last_us, first, last, changed, toggles in found:
        frames += count
        key = ("%08x" if flags & EXTENDED else "%03x") % frame_id
        rows[key] = {"last_raw": last, "changed_raw": changed, "took": took, "toggles": struct.unpack("<64H", toggles), "count": count, "dlc": dlc, "first": first}

    report = {}
    for key, row in rows.items():
        report[key] = {
            "count": row["count"],
            "per_s": round(row["count"] / took, 1),
            "dlc": row["dlc"],
            "first": _hex(row["first"]),
            "last": _hex(row["last_raw"]),
            "changing_bits": [
                {"byte": byte, "bit": bit, "toggles_per_s": round(row["toggles"][byte * 8 + bit] / took, 2)}
                for byte, bit in _bits(row["changed_raw"])
            ],
        }
    result = {
        "seconds": round(took, 1),
        "frames": frames,
        "per_s": round(frames / took, 1),
        "ids": report,
        "frames_beyond_id_limit": beyond,
        "lost_in_controller": stats.get("rx_missed", 0) - missed_before,
        "bus": stats,
    }
    if args.baseline:
        setattr(__main__, BASELINE, rows)
        result["baseline"] = "remembered"
    elif hasattr(__main__, BASELINE):
        result["reaction"] = _reaction(rows, getattr(__main__, BASELINE))
    return result
