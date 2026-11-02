# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(name="Send", description="Send a frame.", effects=dict(readOnly=False, destructive=True, openWorld=False)),
    args=dict(id=dict(label="Identifier:", type=int)),
)
# === END_CONFIG_PARAMETERS ===

import CAN


async def run(args, job):
    CAN(0).send([1, 6], args.id)
    return {"sent": args.id}
