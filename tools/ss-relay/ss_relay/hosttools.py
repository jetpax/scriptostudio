"""Tools that need the host: finding devices and flashing them."""

import asyncio
import shutil
import sys

from .device import DeviceError

SERVICE = "_mcp._tcp.local."
DISCOVER_SECONDS = 3
FLASH_TIMEOUT_S = 300


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
