# Serve lib/sys/mcp.py on 127.0.0.1 under unix MicroPython built with dupterm:
#
#   make -C micropython/ports/unix BUILD=<dir> FROZEN_MANIFEST= MICROPY_PY_BTREE=0 \
#     MICROPY_PY_FFI=0 MICROPY_PY_SSL=0 MICROPY_PY_TERMIOS=0 \
#     CFLAGS_EXTRA="-DMICROPY_PY_OS_DUPTERM=1 -DMICROPY_PY_IO_IOBASE=1"
#   D=boards/firmware/device-scripts
#   MICROPYPATH=test/host/mcp/sim:$D:$D/lib:micropython/extmod <dir>/micropython test/host/mcp/sim/run_sim.py [port]
#
# The loop mirrors app.py's queue_pump. The password is "password".

import asyncio
import binascii
import hashlib
import sys


class _Id:
    name = "Simulator"
    chip = "unix"


class _Board:
    id = _Id


sys.modules["lib.sys.board"] = _Board

import httpserver
import mcplink

from lib.sys import mcp


def _verifier(role):
    h = lambda t: binascii.hexlify(hashlib.sha256(t.encode()).digest()).decode()
    return h(h("ss-%s:password" % role)[:32])


async def pump():
    while True:
        httpserver.process_queue()
        mcp.after_pump()
        await asyncio.sleep_ms(10)


httpserver.start(int(sys.argv[1]) if len(sys.argv) > 1 else 8080)
mcplink.set_auth(_verifier("human"), _verifier("agent"))
mcp.start(["https://scriptostudio.com"])
print("sim ready")
asyncio.run(pump())
