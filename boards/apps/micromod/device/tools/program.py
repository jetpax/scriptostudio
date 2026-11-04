# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(
        name="Program STM32",
        description="Write a raw binary from this board's filesystem to the STM32 in the MicroMod socket, check it by reading it back, and start it. It has to be in its bootloader, and anything it drives may fight the ESP32, since the socket shares most of its buses.",
        effects=dict(readOnly=False, destructive=True, openWorld=False),
    ),
    args=dict(
        path=dict(label="Image on this board", type=str),
        run=dict(label="Start it afterwards", type=bool, optional=True, value=True),
    ),
)
# === END_CONFIG_PARAMETERS ===

import os
import time

from lib.ext.micromod.lib.rom import BLOCK, FLASH_BASE, Rom, sectors_for

MIN_SIZE = 8
# An image starts with its stack pointer, which is in SRAM, or CCM from 0x10000000
RAM_REGIONS = (0x20, 0x10)


def _check(path, size):
    if size < MIN_SIZE:
        raise ValueError("%s is too small to be an image" % path)
    with open(path, "rb") as f:
        top = f.read(4)[3]
    if top not in RAM_REGIONS:
        raise ValueError("%s doesn't start with a stack pointer, so it isn't a raw binary" % path)


async def run(args, job):
    path = args.path
    size = os.stat(path)[6]
    _check(path, size)
    sectors = sectors_for(size)
    total = size * 2
    started = time.ticks_ms()
    rom = Rom()
    try:
        await rom.sync()
        for sector in range(sectors):
            job.progress(0, total, "erasing sector %d of %d" % (sector + 1, sectors))
            await rom.erase_sector(sector)
        with open(path, "rb") as f:
            done = 0
            while done < size:
                data = f.read(BLOCK)
                await rom.write(FLASH_BASE + done, data + b"\xff" * (-len(data) % 4))
                done += len(data)
                job.progress(done, total, "writing")
            f.seek(0)
            done = 0
            while done < size:
                data = f.read(BLOCK)
                back = await rom.read(FLASH_BASE + done, len(data))
                if back != data:
                    raise OSError("Flash at 0x%08x doesn't match what was written" % (FLASH_BASE + done))
                done += len(data)
                job.progress(size + done, total, "checking")
        if args.run:
            await rom.go()
    finally:
        rom.close()
    return {
        "bytes": size,
        "sectors_erased": sectors,
        "verified": True,
        "running": args.run,
        "seconds": time.ticks_diff(time.ticks_ms(), started) // 1000,
    }
