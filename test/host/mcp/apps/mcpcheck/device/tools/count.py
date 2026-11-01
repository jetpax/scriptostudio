# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(
        name="Count",
        description="Count seconds, reporting progress.",
        effects=dict(readOnly=True, destructive=False, openWorld=False),
    ),
    args=dict(
        seconds=dict(label="How many seconds:", type=int, value=3),
        pin=dict(label="A pin, to show its enum:", type=list, optional=True),
        mode=dict(label="Mode:", type=dict, items=dict(fast="No sleeping", slow="Sleep each second"), value="slow"),
    ),
)
# === END_CONFIG_PARAMETERS ===

import asyncio


async def run(args, job):
    for i in range(args.seconds):
        print("tick", i)
        job.progress(i + 1, args.seconds, "second %d" % (i + 1))
        await asyncio.sleep(1 if args.mode == "slow" else 0)
    return {"counted": args.seconds, "pin": args.pin}
