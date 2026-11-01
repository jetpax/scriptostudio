"""ss-relay: serve one device over stdio, or use its host tools from a shell."""

import argparse
import asyncio
import json
import os
import sys

from . import __version__, files, hosttools
from .device import Device, DeviceError, derive_token
from .server import Relay


def _token(args):
    if args.token:
        return args.token
    password = os.environ.get("SS_RELAY_PASSWORD")
    if not password:
        sys.exit("ss-relay: set SS_RELAY_PASSWORD, or pass --token")
    return derive_token(password)


async def _with_device(args, work):
    device = Device(args.device, _token(args), args.cafile)
    await device.connect()
    try:
        return await work(device)
    finally:
        await device.close()


def main():
    parser = argparse.ArgumentParser(prog="ss-relay", description=__doc__)
    parser.add_argument("--version", action="version", version=__version__)
    parser.add_argument("--device", help="host name, or a full ws:// or wss:// URL")
    parser.add_argument("--token", help="agent token, instead of SS_RELAY_PASSWORD")
    parser.add_argument("--cafile", help="verify the device's certificate against this, instead of trusting the first one seen")
    commands = parser.add_subparsers(dest="command")
    commands.add_parser("serve", help="stdio MCP server, the default")
    push = commands.add_parser("push", help="copy a file to the device")
    push.add_argument("local")
    push.add_argument("remote")
    pull = commands.add_parser("pull", help="copy a file from the device")
    pull.add_argument("remote")
    pull.add_argument("local")
    sync = commands.add_parser("sync", help="copy a directory to the device, skipping what matches")
    sync.add_argument("local")
    sync.add_argument("remote", nargs="?", default="/")
    sync.add_argument("--prune", action="store_true")
    sync.add_argument("--mpy-cross")
    sync.add_argument("--force", action="store_true")
    sync.add_argument("--dry-run", action="store_true", help="report what would be copied, and copy nothing")
    discover = commands.add_parser("discover", help="find devices on the local network")
    discover.add_argument("--seconds", type=float, default=hosttools.DISCOVER_SECONDS)
    flash = commands.add_parser("flash", help="write a merged firmware image with esptool")
    flash.add_argument("image")
    flash.add_argument("port")
    flash.add_argument("--address", default="0x0")
    args = parser.parse_args()

    needs_device = args.command in (None, "serve", "push", "pull", "sync")
    if needs_device and not args.device:
        parser.error("--device is required")

    try:
        if args.command in (None, "serve"):
            asyncio.run(Relay(args.device, _token(args), args.cafile).run())
            return
        if args.command == "push":
            result = asyncio.run(_with_device(args, lambda d: files.push(d, args.local, args.remote)))
        elif args.command == "pull":
            result = asyncio.run(_with_device(args, lambda d: files.pull(d, args.remote, args.local)))
        elif args.command == "sync":
            result = asyncio.run(_with_device(args, lambda d: files.sync(d, args.local, args.remote, prune=args.prune, mpy_cross=args.mpy_cross, force=args.force, dry_run=args.dry_run)))
        elif args.command == "discover":
            result = asyncio.run(hosttools.discover(args.seconds))
        else:
            result = asyncio.run(hosttools.flash(args.image, args.port, args.address))
    except (DeviceError, OSError) as e:
        sys.exit(f"ss-relay: {e}")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
