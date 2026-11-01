# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(name="Fail", description="Raise an error, to test how tools report one."),
    args=dict(need=dict(label="A required argument:", type=str)),
)
# === END_CONFIG_PARAMETERS ===


async def run(args, job):
    raise RuntimeError("failed on purpose: " + args.need)
