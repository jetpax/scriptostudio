#!/usr/bin/env python3
"""Line-based REPL over MCP, for trying a device by hand. Tab completes; `exit` quits.

    term.py wss://192.168.1.50/mcp --password X
    term.py http://192.168.1.50/mcp --password X

Output arrives by polling repl://output until the terminal stream exists. Ctrl-C reaches
a blocked exec only on a held socket. The time printed per line runs from sending it until
the device has finished running it.
"""

import argparse
import readline
import threading
import time

from mcp_client import Http, Ws, token

POLL_S = 0.05


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("url")
    ap.add_argument("--password", default="password")
    a = ap.parse_args()
    held = a.url.startswith("ws")
    tok = token(a.password, "human")
    c = Ws(a.url, tok) if held else Http(a.url, tok)
    # A WebSocket client can't interleave calls, so input and polling share one lock.
    lock = threading.Lock()
    cursor = [c.tool_json("logs_read", max_bytes=0)["cursor"]]
    stop = threading.Event()

    def poll():
        while not stop.is_set():
            with lock:
                text, cursor[0] = c.read_output(cursor[0])
            if text:
                print(text, end="", flush=True)
            time.sleep(POLL_S)

    def complete(text, state):
        if state == 0:
            with lock:
                r = c.tool_json("repl_complete", prefix=readline.get_line_buffer())
            complete.names = [text + r["suffix"]] if r["suffix"] else r["candidates"]
        names = complete.names
        return names[state] if state < len(names) else None

    readline.set_completer_delims(" ()[]{},:=+-*/%<>!;'\".")
    readline.set_completer(complete)
    # macOS Pythons often use editline, which ignores the GNU binding syntax.
    editline = getattr(readline, "backend", "") == "editline" or "libedit" in (readline.__doc__ or "")
    readline.parse_and_bind("bind ^I rl_complete" if editline else "tab: complete")
    threading.Thread(target=poll, daemon=True).start()

    prompt = ">>> "
    while True:
        try:
            line = input(prompt)
        except EOFError:
            break
        except KeyboardInterrupt:
            print("^C")
            continue
        if line == "exit":
            break
        t0 = time.perf_counter()
        try:
            with lock:
                r = c.tool_json("repl_input", text=line)
        except KeyboardInterrupt:
            if held:
                c.send_interrupt_frame()
                print("^C")
            else:
                print("^C (HTTP can't reach a blocked exec; it keeps running on the device)")
            continue
        ms = (time.perf_counter() - t0) * 1000
        prompt = r["prompt"]
        # Let the poller print this line's output before the next prompt.
        time.sleep(POLL_S * 3)
        print(f"[{ms:.0f} ms]")
    stop.set()


if __name__ == "__main__":
    main()
