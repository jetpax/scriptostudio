"""WBP host-side reference server.

Speaks the same WebREPL Binary Protocol (WBP) wire format as pyDirect's
ESP32 modwebrepl_binary.c, so the ScriptoStudio PWA can connect to it for
protocol bring-up and regression testing without any device involvement.

Wire format derived from scripto-studio/libs/webrepl-wcb.js (the source of
truth — comments in that file's top-of-file docstring and the C header in
pyDirect/webrepl/wbp_common.h are partially stale).

Subprotocol: webrepl.binary.v1
Encoding:    CBOR-encoded arrays over WebSocket binary frames.

Channels (CH_*):
    0  EVENT     system events (auth, info, log)
    1  TRM       interactive terminal REPL
    2  M2M       machine-to-machine programmatic exec (id-correlated)
    3  DBG       debug output stream
    4  LOG       structured logs
    23 FILE      TFTP-style file transfer (deferred)

Channel ops, client -> server:  EXE=0, INT=1, RST=2
Channel ops, server -> client:  RES=0, CON=1, PRO=2, COM=3
Events:                          AUTH=0, AUTH_OK=1, AUTH_FAIL=2, INFO=3, LOG=4
Formats (M2M):                   PY=0, MPY=1

Run:
    python -m pip install -r ports/host/requirements.txt
    python ports/host/wbp_server.py --password password

Then point the PWA connection dialog at:  ws://localhost:8765/webrepl
"""

from __future__ import annotations

import argparse
import asyncio
import codeop
import contextlib
import io
import json
import logging
import rlcompleter
import ssl
import traceback

import cbor2
import websockets
from websockets.asyncio.server import serve

# Channels
CH_EVENT = 0
CH_TRM = 1
CH_M2M = 2
CH_DBG = 3
CH_LOG = 4
CH_FILE = 23

# Channel opcodes (client -> server)
OP_EXE = 0
OP_INT = 1
OP_RST = 2

# Channel opcodes (server -> client)
OP_RES = 0
OP_CON = 1
OP_PRO = 2
OP_COM = 3

# Events
EVT_AUTH = 0
EVT_AUTH_OK = 1
EVT_AUTH_FAIL = 2
EVT_INFO = 3
EVT_LOG = 4

# Formats
FMT_PY = 0
FMT_MPY = 1

SUBPROTOCOL = "webrepl.binary.v1"

log = logging.getLogger("wbp")


class Session:
    """Per-connection state.

    TRM holds an interactive accumulator (multi-line buffer + globals dict)
    so successive `[1, 0, "x = 1\\n"]` / `[1, 0, "print(x)\\n"]` messages share
    state, mirroring a real REPL.

    M2M execs each message in a fresh namespace — it's meant to be used for
    one-shot scripts driven by the IDE.
    """

    def __init__(self, ws, password: str):
        self.ws = ws
        self.password = password
        self.authenticated = False
        self.trm_globals: dict = {"__name__": "__main__", "__doc__": None, "__builtins__": __builtins__}
        self.trm_buffer = ""
        self.completer = rlcompleter.Completer(self.trm_globals)
        peer = getattr(ws, "remote_address", None)
        self.label = f"{peer[0]}:{peer[1]}" if peer else "?"

    async def send(self, msg: list) -> None:
        await self.ws.send(cbor2.dumps(msg))

    async def run(self) -> None:
        async for raw in self.ws:
            if not isinstance(raw, (bytes, bytearray)):
                log.warning("[%s] ignoring TEXT frame", self.label)
                continue
            try:
                msg = cbor2.loads(raw)
            except Exception as e:
                log.error("[%s] CBOR decode failed: %s", self.label, e)
                continue
            if not isinstance(msg, list) or len(msg) < 2:
                log.warning("[%s] invalid message: %r", self.label, msg)
                continue
            ch = msg[0]
            try:
                if ch == CH_EVENT:
                    await self._on_event(msg)
                elif ch == CH_TRM:
                    await self._on_trm(msg)
                elif ch == CH_M2M:
                    await self._on_m2m(msg)
                else:
                    log.warning("[%s] unknown channel: %s", self.label, ch)
            except Exception:
                log.exception("[%s] handler raised on msg %r", self.label, msg[:2])

    # ------------------------------------------------------------------
    # CH_EVENT
    # ------------------------------------------------------------------

    async def _on_event(self, msg: list) -> None:
        ev = msg[1]
        if ev == EVT_AUTH:
            given = msg[2] if len(msg) > 2 else ""
            if given == self.password:
                self.authenticated = True
                log.info("[%s] auth ok", self.label)
                await self.send([CH_EVENT, EVT_AUTH_OK])
                # The PWA's INFO handler treats payload as a JSON string and
                # looks for keys like "welcome". This is non-essential but
                # gives a friendlier first-connect.
                await self.send([CH_EVENT, EVT_INFO, json.dumps({"welcome": "WBP host server"})])
            else:
                log.warning("[%s] auth failed", self.label)
                await self.send([CH_EVENT, EVT_AUTH_FAIL, "bad password"])
        else:
            log.debug("[%s] unhandled event %s", self.label, ev)

    def _check_auth(self) -> bool:
        if not self.authenticated:
            log.warning("[%s] dropping unauthenticated message", self.label)
            return False
        return True

    # ------------------------------------------------------------------
    # CH_TRM — interactive terminal REPL
    # ------------------------------------------------------------------

    async def _on_trm(self, msg: list) -> None:
        if not self._check_auth():
            return
        op = msg[1]
        if op == OP_EXE:
            data = msg[2] if len(msg) > 2 else ""
            if isinstance(data, (bytes, bytearray)):
                data = bytes(data).decode("utf-8", errors="replace")
            # Tab completion: client sends `partial\t` and expects [1, 3, [matches]]
            if data.endswith("\t"):
                matches = self._complete(data[:-1])
                await self.send([CH_TRM, OP_COM, matches])
                return
            await self._trm_exec(data)
        elif op == OP_INT:
            log.info("[%s] TRM interrupt", self.label)
            self.trm_buffer = ""
            # Best-effort: signal ready. Real interrupt of in-flight code is
            # non-trivial in CPython without ctypes hacks; out of scope for
            # the wire-spec PoC.
            await self.send([CH_TRM, OP_PRO, 0])
        elif op == OP_RST:
            hard = msg[2] if len(msg) > 2 else 0
            log.info("[%s] TRM reset (hard=%s)", self.label, bool(hard))
            self.trm_buffer = ""
            self.trm_globals = {"__name__": "__main__", "__doc__": None, "__builtins__": __builtins__}
            self.completer = rlcompleter.Completer(self.trm_globals)
            await self.send([CH_TRM, OP_PRO, 0])
        else:
            log.warning("[%s] unknown TRM op %s", self.label, op)

    async def _send_trm_traceback(self) -> None:
        buf = io.StringIO()
        traceback.print_exc(file=buf)
        self.trm_buffer = ""
        await self.send([CH_TRM, OP_RES, buf.getvalue()])
        await self.send([CH_TRM, OP_PRO, 0])

    def _complete(self, partial: str) -> list[str]:
        out: list[str] = []
        i = 0
        while True:
            try:
                m = self.completer.complete(partial, i)
            except Exception:
                break
            if m is None:
                break
            out.append(m)
            i += 1
            if i > 200:  # safety cap
                break
        return out

    async def _trm_exec(self, line: str) -> None:
        self.trm_buffer += line
        # The IDE's Run button sends an entire script as one TRM EXE; that's
        # multiple statements which "single" mode rejects. Try single first
        # (proper REPL semantics with auto-display) then fall back to exec.
        cobj = None
        try:
            cobj = codeop.compile_command(self.trm_buffer, "<wbp>", "single")
        except SyntaxError as e:
            if "multiple statements" in str(e):
                try:
                    cobj = compile(self.trm_buffer, "<wbp>", "exec")
                except (SyntaxError, OverflowError, ValueError):
                    await self._send_trm_traceback()
                    return
            else:
                await self._send_trm_traceback()
                return
        except (OverflowError, ValueError):
            await self._send_trm_traceback()
            return
        if cobj is None:
            await self.send([CH_TRM, OP_CON])
            return
        self.trm_buffer = ""
        out = io.StringIO()
        try:
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
                exec(cobj, self.trm_globals)
            text = out.getvalue()
        except SystemExit:
            text = out.getvalue() + "SystemExit\n"
        except BaseException:
            buf = io.StringIO()
            traceback.print_exc(file=buf)
            text = out.getvalue() + buf.getvalue()
        if text:
            await self.send([CH_TRM, OP_RES, text])
        await self.send([CH_TRM, OP_PRO, 0])

    # ------------------------------------------------------------------
    # CH_M2M — programmatic exec, id-correlated
    # ------------------------------------------------------------------

    async def _on_m2m(self, msg: list) -> None:
        if not self._check_auth():
            return
        # [2, op, data, format, id]
        op = msg[1]
        if op != OP_EXE:
            log.warning("[%s] unsupported M2M op %s", self.label, op)
            return
        data = msg[2] if len(msg) > 2 else ""
        fmt = msg[3] if len(msg) > 3 else FMT_PY
        ident = msg[4] if len(msg) > 4 else None
        if fmt == FMT_MPY:
            await self.send([CH_M2M, OP_PRO, 1, "MPY format not supported on host", ident])
            return
        if isinstance(data, (bytes, bytearray)):
            data = bytes(data).decode("utf-8", errors="replace")

        ns: dict = {"__name__": "__m2m__", "__builtins__": __builtins__}
        out = io.StringIO()
        try:
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
                exec(data, ns)
            text = out.getvalue()
            if text:
                await self.send([CH_M2M, OP_RES, text, ident])
            await self.send([CH_M2M, OP_PRO, 0, None, ident])
        except BaseException:
            buf = io.StringIO()
            traceback.print_exc(file=buf)
            text = out.getvalue() + buf.getvalue()
            if text:
                await self.send([CH_M2M, OP_RES, text, ident])
            await self.send([CH_M2M, OP_PRO, 1, "exec failed", ident])


async def _serve(args) -> None:
    async def handler(ws):
        # Path filter — keep parity with `wss://host/webrepl` URLs from the PWA.
        path = getattr(getattr(ws, "request", None), "path", None) or "/"
        if args.path and path != args.path:
            log.warning("rejecting path %s (expected %s)", path, args.path)
            await ws.close(code=1008, reason="bad path")
            return
        session = Session(ws, args.password)
        log.info("[%s] connected (subprotocol=%s, path=%s)", session.label, ws.subprotocol, path)
        try:
            await session.run()
        except websockets.exceptions.ConnectionClosed as e:
            log.info("[%s] closed: %s", session.label, e)

    ssl_context = None
    scheme = "ws"
    if args.tls_cert and args.tls_key:
        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ssl_context.load_cert_chain(args.tls_cert, args.tls_key)
        scheme = "wss"
    elif args.tls_cert or args.tls_key:
        raise SystemExit("--tls-cert and --tls-key must be provided together")

    url = f"{scheme}://{args.host}:{args.port}{args.path or '/'}"
    log.info("WBP server listening on %s", url)
    log.info("Point the PWA connection dialog at: %s", url)
    async with serve(
        handler,
        args.host,
        args.port,
        subprotocols=[SUBPROTOCOL],
        max_size=8 * 1024 * 1024,
        ssl=ssl_context,
    ):
        await asyncio.Future()


def main() -> None:
    parser = argparse.ArgumentParser(description="WBP host-side reference server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--path", default="/webrepl", help="WebSocket path to accept (empty to accept any)")
    parser.add_argument("--password", default="password")
    parser.add_argument("--tls-cert", help="PEM cert file (enables wss://); requires --tls-key")
    parser.add_argument("--tls-key", help="PEM private key file; requires --tls-cert")
    parser.add_argument("--log-level", default="INFO")
    args = parser.parse_args()

    logging.basicConfig(
        level=args.log_level.upper(),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    try:
        asyncio.run(_serve(args))
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
