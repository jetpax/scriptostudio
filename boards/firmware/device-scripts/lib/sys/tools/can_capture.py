# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(
        name="Capture CAN",
        description=(
            "Listen to the CAN bus for a while, and report what's on it: frames per identifier, "
            "their rates and latest data, a few frames in full, and anything lost. Sends nothing."
        ),
        effects=dict(readOnly=True, destructive=False, openWorld=False),
    ),
    args=dict(
        seconds=dict(label="How many seconds, up to 60:", type=int, value=5),
        id=dict(label="Only this identifier, or those matching it under mask:", type=int, optional=True),
        mask=dict(label="Identifier bits that have to match:", type=int, optional=True),
        frames=dict(label="How many frames to include in full, up to 200:", type=int, value=20),
    ),
)
# === END_CONFIG_PARAMETERS ===

import asyncio
import binascii
import struct
import time

import mcplink

from lib.sys import can_tap

MAX_SECONDS = 60
MAX_FRAMES = 200
MAX_IDS = 128
RING_BYTES = 64 * 1024
READ_BYTES = 4000
POLL_MS = 100
RECORD = "<IIBBH8s"
RECORD_SIZE = 20
EXTENDED = 1
RTR = 2
NO_MASK = 0x1FFFFFFF


def _hex(data, dlc):
    return binascii.hexlify(data[:dlc]).decode()


async def run(args, job):
    seconds = min(args.seconds, MAX_SECONDS)
    wanted = min(args.frames, MAX_FRAMES)
    mask = NO_MASK if args.mask is None else args.mask
    match = None if args.id is None else args.id & mask

    frames = 0
    ids = {}
    other_ids = 0
    sample = []
    first = None
    sid = mcplink.stream_open(-1, mcplink.KIND_CAN, RING_BYTES)
    tap = None
    try:
        tap = can_tap.open(sid)
        start = time.ticks_ms()
        missed_before = can_tap.stats().get("rx_missed", 0)
        ends = seconds * 1000
        while time.ticks_diff(time.ticks_ms(), start) < ends:
            job.progress(time.ticks_diff(time.ticks_ms(), start) // 1000, seconds)
            await asyncio.sleep_ms(POLL_MS)
            chunk = mcplink.stream_take(sid, READ_BYTES)
            # On a full bus this may never catch up, and that's reported as lost
            while chunk and time.ticks_diff(time.ticks_ms(), start) < ends:
                for at in range(0, len(chunk), RECORD_SIZE):
                    t, frame_id, flags, dlc, _, data = struct.unpack_from(RECORD, chunk, at)
                    if match is not None and frame_id & mask != match:
                        continue
                    if first is None:
                        first = t
                    frames += 1
                    key = ("%08x" if flags & EXTENDED else "%03x") % frame_id
                    row = ids.get(key)
                    if row is None:
                        if len(ids) >= MAX_IDS:
                            other_ids += 1
                            continue
                        row = ids[key] = {"count": 0}
                    row["count"] += 1
                    row["dlc"] = dlc
                    row["last"] = _hex(data, dlc)
                    if len(sample) < wanted:
                        sample.append(
                            {
                                "ms": time.ticks_diff(t, first) // 1000,
                                "id": key,
                                "rtr": bool(flags & RTR),
                                "data": _hex(data, dlc),
                            }
                        )
                # Let everything else run between batches, however full the bus is
                await asyncio.sleep_ms(0)
                chunk = mcplink.stream_take(sid, READ_BYTES)
        took = time.ticks_diff(time.ticks_ms(), start) / 1000
        status = mcplink.stream_status(sid)
        stats = can_tap.stats()
    finally:
        if tap is not None:
            can_tap.close(tap)
        mcplink.stream_close(sid)

    for row in ids.values():
        row["per_s"] = round(row["count"] / took, 1)
    return {
        "seconds": round(took, 1),
        "frames": frames,
        "per_s": round(frames / took, 1),
        "ids": ids,
        "frames_beyond_id_limit": other_ids,
        "sample": sample,
        "lost": {
            "behind_reader": status[5] // RECORD_SIZE,
            "in_controller": stats.get("rx_missed", 0) - missed_before,
        },
        "bus": stats,
    }
