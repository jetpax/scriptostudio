# Writing ScriptOs

An agent will usually write these for you. This is what it's writing, for when you want to read or change one yourself.

## The code

A ScriptO's `main.py` defines `async def run()`:

```python
import asyncio
from lib.sys import imu, buzzer

async def run():
    while True:
        x, y, z = imu.read()
        if abs(x) > 500:
            buzzer.beep(200)
        await asyncio.sleep(0.1)
```

All Python on the board runs on one thread, shared with the server that Studio and agents talk to. So:

- **Await often.** Code that doesn't await holds up every client and ScriptO, and the watchdog breaks it after a few seconds.
- **Use `await asyncio.sleep()`**, never `time.sleep()`.
- **Get pins from the board.** Use `lib.sys.board`, as in `board.pin("status_led")` and `board.i2c("i2c0").scl`, or the helper a device's description names.

This is MicroPython, so there's no `os.path`. See the [MicroPython Reference](../developer/micropython-reference.md).

## Making one yourself

In the terminal:

```python
from lib.sys import apps
apps.create("my-scripto", open("/my_code.py").read(), name="My ScriptO")
apps.start("my-scripto")
```

An id is lowercase letters, digits and hyphens. The code is compiled before anything is written, so a mistake can't replace what's working.

## Changing one

Click **Code** on its row, edit it and save. A running ScriptO keeps running the old code until you **Stop** and **Start** it.

!!! warning "Leave `/main.py` alone"
    The board's own `/main.py` and `/boot.py` start its server. If you break them, you can't connect. A ScriptO's code goes in its own folder under `/lib/ext/`.

## Giving agents a tool

A file at `/lib/ext/<folder>/tools/<name>.py` appears to any agent as `<scripto>_<name>`. Its config block becomes the tool's schema:

```python
# === START_CONFIG_PARAMETERS ===
dict(
    info = dict(
        name = "Read parameter",
        description = "What an agent reads to decide to use this.",
        effects = dict(readOnly=True, destructive=False, openWorld=False),
    ),
    args = dict(
        name = dict(label="Parameter name", type=str),
        pin = dict(label="Pin", type=list, optional=True),
        mode = dict(label="Mode", type=dict, items=dict(a="First", b="Second"), value="a"),
    ),
)
# === END_CONFIG_PARAMETERS ===

async def run(args, job):
    job.progress(1, 2, "halfway")
    return {"value": 1}
```

`type=list` means a GPIO, with its choices taken from the board's manifest. Files starting with `_` aren't tools.

A tool runs as a task, so it can take as long as it needs. A client on a WebSocket stays on the call and gets progress. A client on plain HTTP gets a job id to poll with `job_status`.

## Reading CAN

`lib.sys.can_tap` lets a ScriptO watch the bus without getting in the way of anything else:

```python
from lib.sys import can_tap

watcher = can_tap.watch([0x470])
for can_id, data in watcher.read():
    ...
```

`read()` never waits. `watch([])` gets every identifier, and `watcher.lost()` says how many frames it was too slow for.
