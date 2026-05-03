"""Smoke test for wbp_server.py — drives the protocol the same way the PWA does.

Covers: subprotocol negotiation, auth, TRM exec, TRM continuation, TRM
completion, TRM error path, M2M exec with id correlation, M2M error path,
TRM reset.

Run after starting the server:
    ports/host/.venv/bin/python ports/host/wbp_server.py &
    ports/host/.venv/bin/python ports/host/test_smoke.py

For wss:// (server started with --tls-cert/--tls-key):
    ports/host/.venv/bin/python ports/host/test_smoke.py --url wss://127.0.0.1:8765/webrepl
"""

from __future__ import annotations

import argparse
import asyncio
import ssl
import sys

import cbor2
from websockets.asyncio.client import connect

DEFAULT_URL = "ws://127.0.0.1:8765/webrepl"
PASSWORD = "password"
SUBPROTOCOL = "webrepl.binary.v1"

CH_EVENT, CH_TRM, CH_M2M = 0, 1, 2
OP_EXE, OP_INT, OP_RST = 0, 1, 2
OP_RES, OP_CON, OP_PRO, OP_COM = 0, 1, 2, 3
EVT_AUTH, EVT_AUTH_OK, EVT_AUTH_FAIL, EVT_INFO = 0, 1, 2, 3
FMT_PY = 0


async def send(ws, msg):
    await ws.send(cbor2.dumps(msg))


async def recv(ws):
    return cbor2.loads(await ws.recv())


async def expect(ws, predicate, label, timeout=2.0):
    """Receive messages until predicate(msg) is true. Drains harmless events."""
    deadline = asyncio.get_event_loop().time() + timeout
    drained = []
    while True:
        remaining = deadline - asyncio.get_event_loop().time()
        if remaining <= 0:
            raise AssertionError(f"timeout waiting for {label}; drained {drained!r}")
        msg = await asyncio.wait_for(recv(ws), timeout=remaining)
        if predicate(msg):
            return msg
        drained.append(msg)


def is_auth_ok(m):
    return m[:2] == [CH_EVENT, EVT_AUTH_OK]


def is_trm_pro(m):
    return len(m) >= 3 and m[0] == CH_TRM and m[1] == OP_PRO


def is_trm_con(m):
    return m[:2] == [CH_TRM, OP_CON]


def is_trm_com(m):
    return len(m) >= 3 and m[0] == CH_TRM and m[1] == OP_COM


def is_m2m_pro(m, ident):
    return len(m) >= 5 and m[0] == CH_M2M and m[1] == OP_PRO and m[4] == ident


async def gather_trm_until_pro(ws):
    """Collect RES output until PRO. Returns (text, status)."""
    out = []
    while True:
        msg = await asyncio.wait_for(recv(ws), timeout=2.0)
        if msg[0] == CH_TRM and msg[1] == OP_RES:
            out.append(msg[2])
        elif msg[0] == CH_TRM and msg[1] == OP_PRO:
            return "".join(out), msg[2]
        # ignore other channels for this drain


async def gather_m2m_until_pro(ws, ident):
    """Collect M2M RES with matching id until PRO with matching id."""
    out = []
    while True:
        msg = await asyncio.wait_for(recv(ws), timeout=2.0)
        if msg[0] == CH_M2M and msg[1] == OP_RES and len(msg) > 3 and msg[3] == ident:
            out.append(msg[2])
        elif msg[0] == CH_M2M and msg[1] == OP_PRO and len(msg) > 4 and msg[4] == ident:
            return "".join(out), msg[2], (msg[3] if len(msg) > 3 else None)


async def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default=DEFAULT_URL,
                        help="ws:// or wss:// URL (default: %(default)s)")
    args = parser.parse_args()

    ssl_ctx = None
    if args.url.startswith("wss://"):
        # Self-signed dev cert — verification off in tests only.
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE

    async with connect(args.url, subprotocols=[SUBPROTOCOL], ssl=ssl_ctx) as ws:
        assert ws.subprotocol == SUBPROTOCOL, f"subprotocol={ws.subprotocol!r}"

        # --- auth ---
        await send(ws, [CH_EVENT, EVT_AUTH, PASSWORD])
        await expect(ws, is_auth_ok, "AUTH_OK")
        print("[ok] auth")

        # --- TRM single-line exec ---
        await send(ws, [CH_TRM, OP_EXE, 'print("hi")\n'])
        text, status = await gather_trm_until_pro(ws)
        assert status == 0
        assert "hi" in text, f"expected 'hi' in {text!r}"
        print("[ok] TRM print")

        # --- TRM multi-line continuation ---
        # codeop treats a for-body as complete after the first indented line;
        # all we need to verify on the wire is that incomplete code -> CON
        # and the next chunk that completes it executes.
        await send(ws, [CH_TRM, OP_EXE, "for i in range(3):\n"])
        msg = await expect(ws, is_trm_con, "CON")
        assert msg == [CH_TRM, OP_CON]
        await send(ws, [CH_TRM, OP_EXE, "    print(i)\n"])
        text, status = await gather_trm_until_pro(ws)
        assert status == 0
        assert "0\n1\n2\n" in text, f"unexpected loop output: {text!r}"
        print("[ok] TRM continuation")

        # --- TRM whole-script (IDE Run button) ---
        # Multi-statement input that 'single' mode would reject — must fall
        # back to 'exec' mode so scripts run end-to-end.
        script = "# header\nprint('Hello, ')\nprint('ScriptO!')\n"
        await send(ws, [CH_TRM, OP_EXE, script])
        text, status = await gather_trm_until_pro(ws)
        assert status == 0
        assert "Hello, \nScriptO!\n" in text, f"unexpected script output: {text!r}"
        print("[ok] TRM whole-script Run")

        # --- TRM stateful (globals persist) ---
        await send(ws, [CH_TRM, OP_EXE, "x = 42\n"])
        await gather_trm_until_pro(ws)
        await send(ws, [CH_TRM, OP_EXE, "print(x * 2)\n"])
        text, _ = await gather_trm_until_pro(ws)
        assert "84" in text
        print("[ok] TRM stateful globals")

        # --- TRM completion ---
        await send(ws, [CH_TRM, OP_EXE, "pri\t"])
        msg = await expect(ws, is_trm_com, "COM")
        matches = msg[2]
        assert any(m.startswith("print") for m in matches), f"completions: {matches}"
        print(f"[ok] TRM completion ({len(matches)} matches)")

        # --- TRM error path ---
        await send(ws, [CH_TRM, OP_EXE, "1/0\n"])
        text, status = await gather_trm_until_pro(ws)
        assert "ZeroDivisionError" in text, text
        assert status == 0  # PRO status reflects "ready", not exec result
        print("[ok] TRM error capture")

        # --- M2M with id ---
        ident = "abc1234"
        await send(ws, [CH_M2M, OP_EXE, "import json; print(json.dumps({'k': 7}))\n", FMT_PY, ident])
        text, status, err = await gather_m2m_until_pro(ws, ident)
        assert status == 0, f"status={status} err={err}"
        assert '"k": 7' in text
        print("[ok] M2M with id")

        # --- M2M error path ---
        ident2 = "xyz9876"
        await send(ws, [CH_M2M, OP_EXE, "raise RuntimeError('boom')\n", FMT_PY, ident2])
        text, status, err = await gather_m2m_until_pro(ws, ident2)
        assert status == 1
        assert "RuntimeError" in text
        print("[ok] M2M error correlation")

        # --- TRM reset clears globals ---
        await send(ws, [CH_TRM, OP_RST, 0])
        await expect(ws, is_trm_pro, "PRO after RST")
        await send(ws, [CH_TRM, OP_EXE, "print(x)\n"])
        text, _ = await gather_trm_until_pro(ws)
        assert "NameError" in text, f"expected NameError after reset, got: {text!r}"
        print("[ok] TRM reset clears globals")

    print("\nALL PASS")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
