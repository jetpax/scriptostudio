"""Tools that need the host: finding devices and flashing them."""

import asyncio
import contextlib
import json
import shutil
import sys
import time

from . import files
from .device import DeviceError

SERVICE = "_mcp._tcp.local."
DISCOVER_SECONDS = 3
FLASH_TIMEOUT_S = 300
STM32_BOOT_S = 60
STM32_PROGRAM_S = 600
STM32_IMAGE = "/stm32_image.bin"


async def discover(seconds=DISCOVER_SECONDS):
    from zeroconf import IPVersion, ServiceBrowser, Zeroconf

    class Listener:
        def __init__(self):
            self.names = set()

        def add_service(self, zc, kind, name):
            self.names.add(name)

        def update_service(self, zc, kind, name):
            self.names.add(name)

        def remove_service(self, zc, kind, name):
            self.names.discard(name)

    zc = Zeroconf(ip_version=IPVersion.V4Only)
    listener = Listener()
    ServiceBrowser(zc, SERVICE, listener)
    await asyncio.sleep(seconds)
    found = []
    for name in sorted(listener.names):
        info = await asyncio.to_thread(zc.get_service_info, SERVICE, name, 2000)
        if not info:
            continue
        txt = {k.decode(): (v.decode() if v is not None else "") for k, v in info.properties.items()}
        host = info.server.rstrip(".")
        scheme = "wss" if txt.get("tls") == "1" else "ws"
        found.append(
            {
                "name": name.removesuffix("." + SERVICE),
                "host": host,
                "addresses": info.parsed_addresses(),
                "port": info.port,
                "url": f"{scheme}://{host}{txt.get('path', '/mcp')}",
                "txt": txt,
            }
        )
    zc.close()
    return found


async def flash(image, port, address="0x0"):
    """Writes a merged image. Runs esptool, which takes the port for as long as that lasts."""
    command = None
    if shutil.which("esptool.py"):
        command = ["esptool.py"]
    else:
        try:
            import esptool  # noqa: F401

            command = [sys.executable, "-m", "esptool"]
        except ImportError:
            raise DeviceError("esptool isn't installed. Run: pip install ss-relay[flash]") from None
    process = await asyncio.create_subprocess_exec(
        *command,
        "--port",
        port,
        "write_flash",
        address,
        image,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT,
    )
    try:
        output, _ = await asyncio.wait_for(process.communicate(), FLASH_TIMEOUT_S)
    except asyncio.TimeoutError:
        process.kill()
        raise DeviceError(f"esptool was still running after {FLASH_TIMEOUT_S} s") from None
    text = output.decode(errors="replace")
    if process.returncode:
        raise DeviceError(f"esptool failed: {text[-500:]}")
    return {"image": image, "port": port, "output": text[-300:]}


def _stm32_enter(port):
    """Reset the board with ~BOOT low, which a MicroMod socket shares with the ESP32, so both
    chips start in their ROMs. A watchdog reset then restarts only the ESP32. It doesn't touch
    the shared reset line, so the STM32 stays in its bootloader."""
    try:
        from esptool.cmds import detect_chip
    except ImportError:
        raise DeviceError("esptool isn't installed. Run: pip install ss-relay[flash]") from None
    with contextlib.redirect_stdout(sys.stderr):
        esp = detect_chip(port=port, baud=115200, connect_mode="default_reset")
        esp.watchdog_reset()
    return esp


def _stm32_leave(esp):
    """A real reset, so the STM32 starts from its flash, and I2C comes back."""
    with contextlib.redirect_stdout(sys.stderr):
        esp.hard_reset()
    esp._port.close()


async def _when_up(connect):
    deadline = time.monotonic() + STM32_BOOT_S
    while True:
        try:
            return await connect()
        except (DeviceError, OSError):
            if time.monotonic() > deadline:
                raise DeviceError(f"The board didn't come back within {STM32_BOOT_S} s") from None
            await asyncio.sleep(1)


async def stm32_boot(port, seconds):
    """Hold a MicroMod STM32 in its bootloader for a while, for the micromod app's tools."""
    esp = _stm32_enter(port)
    try:
        print(f"The STM32 is in its bootloader for {seconds} s, or until this stops. I2C won't answer until then.", file=sys.stderr, flush=True)
        await asyncio.sleep(seconds)
    finally:
        _stm32_leave(esp)
    return {"port": port, "held_seconds": seconds}


async def stm32_program(image, port, connect):
    """Program a MicroMod STM32 from the board it's on, which needs the micromod app."""
    esp = _stm32_enter(port)
    try:
        device = await _when_up(connect)
        try:
            await files.push(device, image, STM32_IMAGE)
            try:
                reply = await device.request(
                    "tools/call",
                    {"name": "micromod_program", "arguments": {"path": STM32_IMAGE, "run": False}},
                    timeout=STM32_PROGRAM_S,
                )
            finally:
                await device.tool("fs_rm", path=STM32_IMAGE)
        finally:
            await device.close()
    finally:
        _stm32_leave(esp)
    text = reply["content"][0]["text"]
    if reply.get("isError"):
        raise DeviceError(text)
    return json.loads(text)
