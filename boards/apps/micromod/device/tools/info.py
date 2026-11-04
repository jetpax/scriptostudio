# === START_CONFIG_PARAMETERS ===
dict(
    info=dict(
        name="STM32 info",
        description="Identify the STM32 in the MicroMod socket and say whether its flash has anything on it. It has to be in its bootloader. I2C doesn't answer while it is.",
        effects=dict(readOnly=True, destructive=False, openWorld=False),
    ),
    args=dict(),
)
# === END_CONFIG_PARAMETERS ===

from lib.ext.micromod.lib.rom import FLASH_BASE, Rom


async def run(args, job):
    rom = Rom()
    try:
        await rom.sync()
        chip = await rom.chip_id()
        start = await rom.read(FLASH_BASE, 8)
    finally:
        rom.close()
    return {
        "chip_id": "0x%04x" % chip,
        "blank": all(byte == 0xFF for byte in start),
    }
