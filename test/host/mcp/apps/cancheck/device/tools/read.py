# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(name="Read", description="Request a value, as an SDO read would.", effects=dict(readOnly=True, destructive=False, openWorld=False)),
    args=dict(id=dict(label="Identifier:", type=int)),
)
# === END_CONFIG_PARAMETERS ===

import CAN


async def run(args, job):
    CAN(0).send([1, 6], args.id)
    return {"requested": args.id}
