# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(name="Hog", description="Hold the event loop without yielding, to test the watchdog."),
    args=dict(),
)
# === END_CONFIG_PARAMETERS ===

import time


async def run(args, job):
    while True:
        time.sleep_ms(100)
