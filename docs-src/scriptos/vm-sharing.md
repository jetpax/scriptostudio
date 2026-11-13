# Sharing the interpreter

Everything on the board runs in one MicroPython interpreter, so your ScriptO shares it with the system. This page covers what that means for the code you write.

## One interpreter, cooperative multitasking

The board runs `asyncio`. Only one task executes at a time, and a task gives up the interpreter when it awaits.

```
asyncio event loop
    ├── queue_pump()      serves MCP and HTTP every 10 ms
    ├── network tasks     WiFi, Ethernet and the like
    └── your ScriptO      its run() in /lib/ext/<folder>/main.py
```

| Component | Runs as | Yields by |
|-----------|---------|-----------|
| Queue pump | System task, a 10 ms loop | `await asyncio.sleep_ms(10)` |
| Your ScriptO | User task | Your `await`s |
| `exec` calls from an agent or Studio | Synchronous, on the interpreter thread | Running to completion |

> [!IMPORTANT]
> A loop with no `await` freezes everything, including the queue pump. Agents and Studio can't reach the board until it yields. If something holds the event loop too long, the watchdog breaks it with a `KeyboardInterrupt` and the ScriptO stops with the reason "it held the event loop too long".

An `exec` call is stopped after 4 seconds by default, because a longer block would make the watchdog stop user tasks. Put long work in a ScriptO and await in it.

## The queue pump

`queue_pump()` in `lib/sys/app.py` is a system task:

```python
async def queue_pump():
    while True:
        if mcp.started():
            httpserver.process_queue()   # MCP over WebSocket and HTTP, and any routes you add
            mcp.after_pump()
        await asyncio.sleep_ms(10)
        bg_tasks.feed("queue_pump")
```

Every tool call, from an agent or from Studio, is handled here. The task feeds a watchdog on each pass, which is how a ScriptO that holds the loop gets caught.

## Writing a ScriptO that yields

```python
import asyncio

async def run():
    while True:
        do_work()
        await asyncio.sleep(0.1)
```

Don't use `time.sleep()` in a loop. It blocks the interpreter and doesn't yield.

## System and user tasks

`lib/sys/bg_tasks.py` keeps the board's tasks by name. A ScriptO's `run()` runs as a user task named `app_<id>`.

| Type | Stopped by |
|------|------------|
| System (`is_system=True`) | Only `bg_tasks.stop_all()` |
| User (`is_system=False`) | The Stop button, Ctrl+C, a watchdog break, a reset |

```python
from lib.sys import bg_tasks

bg_tasks.start("my_animation", animate_leds)                  # user task
bg_tasks.start("monitor", monitor, is_system=True)            # survives Stop
```

Useful calls: `stop(name)`, `stop_user_tasks()`, `is_running(name)`, `list_tasks()`, and `feed(name)` to feed a task's watchdog from inside its loop. Stop, above the editor, calls `stop_user_tasks()`.

## Task lifecycle

A user task that raises is marked crashed. It restarts after one second, and the ScriptO's row in the sidebar shows it as crashed with the restart count and last error. A task that returns ends as stopped. A task that's stopped by Stop or a break records why it stopped.

If the board crashes three times in a row at boot, it starts without its run-at-boot ScriptOs and says so in each one's status. A reset tries again.

## Threads

`_thread` works, but use it rarely. The status LED animation runs in a thread, and that pattern is safe because it's created once at boot, reads a singleton, does short bounded work and sleeps each pass.

- Don't use `await`, `asyncio` or the network from a thread.
- Don't share mutable data between threads without a flag or lock.
- A thread can't be joined or killed, and an uncaught exception ends it silently.
- Create threads once and reuse them. Creating and destroying them fragments the heap.

For nearly everything else, use an asyncio task.

## Bus Sharing (I2C / SPI)

When multiple Apps or ScriptOs talk to devices on the same I2C or SPI bus, they must share a **single `machine.I2C` or `machine.SPI` instance**. If two of them each create their own instance for the same hardware peripheral, the second one silently reconfigures the bus, potentially breaking the first.

### Why No Locking Is Needed

In CircuitPython, the `busio.I2C` class has `try_lock()` / `unlock()` methods because its USB stack can preempt a transaction mid-byte. **MicroPython doesn't have this problem**, all I2C/SPI calls are synchronous C functions that run to completion. Since the VM is single-threaded and cooperative, no other coroutine can interleave on the bus between `await` points.

The real risk is **configuration conflicts**, not data races. The `bus` module solves this with a singleton cache.

### The `bus` Module

```python
from lib.sys import bus

# Board-manifest-aware (recommended: uses board.json pin definitions)
i2c = bus.get_i2c("sensors")

# Explicit pins
i2c = bus.get_i2c(0, scl=9, sda=8, freq=400000)

# SPI works the same way
spi = bus.get_spi("display")
spi = bus.get_spi(1, sck=12, mosi=11, miso=13, baudrate=10000000)
```

Calling `bus.get_i2c("sensors")` twice returns the **same object**, no reconfiguration, no conflicts.

### Comparison

| Approach | What Happens |
|----------|-------------|
| `machine.I2C(0, scl=Pin(9), sda=Pin(8))` × 2 | Second call may reconfigure the peripheral |
| `bus.get_i2c(0, scl=9, sda=8)` × 2 | Returns the **same** cached instance |
| `bus.get_i2c("sensors")` × 2 | Same, using board manifest pins |

### Utility Functions

```python
bus.info()                  # Print all cached buses
bus.release_i2c("sensors")  # Remove from cache (doesn't deinit hardware)
```

!!! tip
    Always prefer the named form (`bus.get_i2c("sensors")`) over explicit pins. This keeps your ScriptOs portable across different boards.

## Related

- [Writing ScriptOs](writing-scriptos.md)
- [MicroPython reference](../developer/micropython-reference.md)
