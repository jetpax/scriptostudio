# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(
        name="Erase STM32",
        description="Erase all the flash of the STM32 in the MicroMod socket. It has to be in its bootloader, and it stays there holding I2C's clock until the board is reset.",
        effects=dict(readOnly=False, destructive=True, openWorld=False),
    ),
    args=dict(),
)
# === END_CONFIG_PARAMETERS ===

from lib.ext.micromod.lib.rom import FLASH_BASE, Rom, SECTORS_KB


async def run(args, job):
    rom = Rom()
    blank = True
    try:
        await rom.sync()
        job.progress(0, 1, "erasing")
        await rom.erase_all()
        address = FLASH_BASE
        for kb in SECTORS_KB:
            start = await rom.read(address, 8)
            blank = blank and all(byte == 0xFF for byte in start)
            address += kb * 1024
    finally:
        rom.close()
    return {"blank": blank}
