#!/usr/bin/env python3
"""Line-based terminal over MCP, for trying a device by hand. Tab completes; `exit` quits.

    term.py wss://192.168.1.50/mcp --password X
    term.py http://192.168.1.50/mcp --password X

On a held socket this is a stream terminal: output arrives as it's printed, Ctrl-C reaches
a blocked call, and a line typed while a call runs goes to its input(). The device echoes
what input() reads, so you'll see those lines twice. Plain HTTP has no streams, so it polls
repl://output and Ctrl-C can't reach anything.
"""

import argparse
import readline
import threading
import time

from mcp_client import FRAME_DATA, Http, Ws, token

POLL_S = 0.05


def bind_tab(complete):
    readline.set_completer_delims(" ()[]{},:=+-*/%<>!;'\".")
    readline.set_completer(complete)
    # macOS Pythons often use editline, which ignores the GNU binding syntax.
    editline = getattr(readline, "backend", "") == "editline" or "libedit" in (readline.__doc__ or "")
    readline.parse_and_bind("bind ^I rl_complete" if editline else "tab: complete")


def streamed(url, tok):
    c = Ws(url, tok, timeout=3600)
    sid = c.stream_open("terminal")["stream"]
    prompt = [">>> "]
    idle = threading.Event()
    idle.set()
    stop = threading.Event()

    def reader():
        while not stop.is_set():
            f = c.next_frame(0.2)
            if f and f[0] == FRAME_DATA and f[1] == sid:
                print(f[4].decode(errors="replace"), end="", flush=True)
            while c.notes:
                p = c.notes.popleft().get("params", {})
                if p.get("stream") == sid and p.get("state") == "prompt":
                    prompt[0] = p["prompt"]
                    idle.set()

    threading.Thread(target=reader, daemon=True).start()
    while True:
        try:
            line = input(prompt[0] if idle.is_set() else "")
        except EOFError:
            break
        except KeyboardInterrupt:
            c.send_interrupt_frame()
            print("^C")
            continue
        if line == "exit":
            break
        if idle.is_set():
            idle.clear()
            c.send_frame(FRAME_DATA, sid, 0, line.encode())
            # Give a quick line time to finish, so its output lands before the next prompt
            idle.wait(0.5)
        else:
            c.send_frame(FRAME_DATA, sid, 0, line.encode() + b"\r")
    stop.set()


def polled(url, tok):
    c = Http(url, tok)
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

    bind_tab(complete)
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
            print("^C (HTTP can't reach a blocked exec; it keeps running on the device)")
            continue
        ms = (time.perf_counter() - t0) * 1000
        prompt = r["prompt"]
        # Let the poller print this line's output before the next prompt.
        time.sleep(POLL_S * 3)
        print(f"[{ms:.0f} ms]")
    stop.set()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("url")
    ap.add_argument("--password", default="password")
    a = ap.parse_args()
    tok = token(a.password, "human")
    if a.url.startswith("ws"):
        streamed(a.url, tok)
    else:
        polled(a.url, tok)


if __name__ == "__main__":
    main()
