# VM Sharing & Async Architecture

Understanding how your scripts share the single MicroPython VM with the system.

## Single VM, Cooperative Multitasking

pyDirect runs **everything in one MicroPython VM** using `asyncio` for cooperative multitasking. There are no threads—only one thing executes at a time.

```
main.py (Orchestrator)
    └── asyncio.run()
            ├── queue_pump()      ← processes M2M commands every 10ms
            ├── wifi_task()       ← manages WiFi connection
            ├── eth_task()        ← manages Ethernet (if available)
            └── your_script()     ← your ScriptO runs here
```

## How Tasks Share CPU Time

| Component | Runs As | Yields Via |
|-----------|---------|------------|
| **Orchestrator** | System task | `await asyncio.sleep()` |
| **Queue Pump** | System task (10ms loop) | `await asyncio.sleep_ms(10)` |
| **Your Scripts** | User task | Must `await` periodically |
| **M2M Commands** | Synchronous exec | Runs to completion |

> [!IMPORTANT]
> If your script runs a loop without `await`, **everything freezes**—including M2M commands from Scripto Studio.

## Writing Async Scripts

### ✅ Good: Yields Regularly

```python
import asyncio
from lib.sys import bg_tasks

async def my_task():
    while True:
        do_work()
        await asyncio.sleep(0.1)  # Yields to other tasks

bg_tasks.start("my_task", my_task)
```

### ❌ Bad: Blocks the VM

```python
# DON'T DO THIS - blocks everything!
while True:
    do_work()
    time.sleep(0.1)  # time.sleep() does NOT yield!
```

## System vs User Tasks

Tasks registered via `bg_tasks` are classified as:

| Type | Protected? | Stopped By |
|------|------------|------------|
| **System** (`is_system=True`) | Yes | Only `bg_tasks.stop_all()` |
| **User** (`is_system=False`) | No | Stop button, Ctrl+C, soft reset |

```python
# System task - keeps running even after Stop button
bg_tasks.start("critical_monitor", monitor_func, is_system=True)

# User task - stopped by Stop button
bg_tasks.start("my_animation", animate_leds)
```

## M2M Commands

When Scripto Studio calls a device function (like `getSysInfo()`), it happens via the **M2M pattern**:

```
┌────────────────┐         ┌──────────────────┐
│ Scripto Studio │         │  pyDirect Device │
│                │  exec() │                  │
│ getSystemInfo()├────────►│ getSysInfo()     │
│                │         │     │            │
│                │◄────────┤ print(json)      │
│ parse response │  output │                  │
└────────────────┘         └──────────────────┘
```

M2M commands run **synchronously** in the REPL context—they block until complete. Keep them fast (<100ms).

## The Queue Pump

The `queue_pump()` task is the system's heartbeat:

```python
async def queue_pump():
    while True:
        webrepl.process_queue()   # Handle WebSocket/WebRTC messages
        httpserver.process_queue() # Handle HTTP requests
        await asyncio.sleep_ms(10) # Yield every 10ms
```

This ensures:

- M2M commands are processed promptly
- HTTP requests are served
- Your UI stays responsive

## Task Lifecycle

```
Start Script
     │
     ▼
┌─────────────┐
│   Running   │◄──────────────────┐
└──────┬──────┘                   │
       │                          │
  Exception?                  Restart
       │                      (after 1s)
       ▼                          │
┌─────────────┐                   │
│   Crashed   │───────────────────┘
└─────────────┘

       │ Stop button / Ctrl+C
       ▼
┌─────────────┐
│   Stopped   │
└─────────────┘
```

Crashed user tasks auto-restart after a 1-second backoff.

## Defensive Skill Loading

When an agent (like PFC) dynamically loads skills/scriptos, use these patterns to avoid crashing:

### 1. Wrap Everything in Try/Except

```python
async def run_skill(path):
    try:
        skill_globals = {}
        with open(path) as f:
            code = f.read()
        exec(compile(code, path, 'exec'), skill_globals)
        
        if 'run' in skill_globals:
            return await skill_globals['run']()
    except SyntaxError as e:
        return {"error": f"Syntax error in skill: {e}"}
    except MemoryError:
        gc.collect()
        return {"error": "Out of memory loading skill"}
    except Exception as e:
        return {"error": f"Skill failed: {e}"}
```

### 2. Pre-flight Memory Check

```python
import gc

def can_load_skill(min_free_kb=50):
    """Check if we have enough memory to load a skill"""
    gc.collect()
    free_kb = gc.mem_free() // 1024
    return free_kb >= min_free_kb
```

### 3. Syntax Validation Before Exec

```python
def validate_skill(code, filename="skill"):
    """Check syntax without executing"""
    try:
        compile(code, filename, 'exec')
        return True, None
    except SyntaxError as e:
        return False, str(e)
```

### 4. Timeout Protection (Cooperative)

Since MicroPython is single-threaded, true timeouts aren't possible. Instead, skills must cooperate:

```python
import time

# Pass a deadline to the skill
async def run_skill_with_timeout(skill_func, timeout_ms=5000):
    deadline = time.ticks_add(time.ticks_ms(), timeout_ms)
    
    # Skill must check this periodically
    return await skill_func(deadline=deadline)

# Inside skill:
async def my_skill(deadline=None):
    while work_remaining:
        if deadline and time.ticks_diff(deadline, time.ticks_ms()) < 0:
            raise TimeoutError("Skill timed out")
        do_chunk_of_work()
        await asyncio.sleep(0)  # Yield
```

### 5. Isolated Namespace

Prevent skills from polluting globals:

```python
def exec_isolated(code, filename="skill"):
    """Execute code in isolated namespace"""
    skill_ns = {
        '__name__': 'skill',
        '__builtins__': __builtins__,
        # Explicitly provide allowed modules
        'asyncio': __import__('asyncio'),
        'json': __import__('json'),
        'gc': __import__('gc'),
    }
    exec(compile(code, filename, 'exec'), skill_ns)
    return skill_ns
```

### 6. Cleanup After Skills

```python
async def run_and_cleanup(skill_path):
    try:
        result = await run_skill(skill_path)
        return result
    finally:
        # Always clean up
        gc.collect()
```

> [!TIP]
> Log execution results via `syslog` so you can debug failures remotely.

## Thread Safety in MicroPython

While pyDirect primarily uses `asyncio`, some components (like the status LED) use `_thread` for background work. Threads work but have significant gotchas.

### Known Thread Limitations

| Issue | Description | Impact |
|-------|-------------|--------|
| **No thread-safe data structures** | No `Queue`, basic `Lock` only | Race conditions if sharing data |
| **GIL contention** | Only one thread runs Python at a time | Blocked thread affects all |
| **No `thread.join()`** | Can't wait for thread completion | Must use flags for coordination |
| **No `thread.kill()`** | Can't forcibly terminate | Runaway thread can't be stopped |
| **Silent exception death** | Uncaught exceptions crash thread silently | Hard to debug |
| **Small stack** | ~4KB default stack size | Deep recursion crashes |
| **Memory fragmentation** | Create/destroy fragments heap | Create once, reuse |

### ❌ Dangerous Patterns

```python
# DANGEROUS: Shared mutable state without locks
shared_data = []
def skill_thread():
    shared_data.append("from thread")  # Race condition!

# DANGEROUS: Async/await in thread
def skill_thread():
    await asyncio.sleep(1)  # CRASHES - asyncio not thread-safe!

# DANGEROUS: WebREPL/network from thread  
def skill_thread():
    webrepl.notify("msg")  # Undefined behavior!

# DANGEROUS: Frequent thread creation
for i in range(100):
    _thread.start_new_thread(task, ())  # Memory fragmentation!
```

### ✅ Safe Thread Pattern

The status LED thread demonstrates the safe pattern:

```python
import _thread
import time

def _animation_thread():
    while True:
        if status_led:            # Read-only check
            status_led.update()   # Self-contained, fast work
        time.sleep_ms(50)         # Always yields GIL
```

**Why this works:**

- Read-only access to singleton (no mutation races)
- Short, bounded work per iteration
- Regular `sleep_ms()` to yield GIL
- Created once at boot, never destroyed
- No asyncio or network calls

### Thread + Stop Flag Pattern

If you need to run skills in a thread:

```python
import _thread

_skill_stop = False

def run_skill_threaded(code):
    global _skill_stop
    _skill_stop = False
    
    def runner():
        try:
            skill_globals = {'should_stop': lambda: _skill_stop}
            exec(compile(code, 'skill', 'exec'), skill_globals)
        except Exception as e:
            print(f"Thread error: {e}")  # Log, don't crash silently
    
    _thread.start_new_thread(runner, ())

def stop_skill():
    global _skill_stop
    _skill_stop = True  # Skill must check this!
```

> [!WARNING]
> The skill must cooperate by checking `should_stop()`. A skill that ignores this cannot be terminated.

### When to Use Threads

| Use Case | Recommendation |
|----------|----------------|
| Most skills | **Use asyncio** - safer, simpler |
| Blocking hardware I/O | **Thread OK** - like NeoPixel animations |
| Network/WebREPL calls | **Use asyncio only** - not thread-safe |
| CPU-intensive work | **Thread with yields** - call `time.sleep_ms(0)` frequently |
| Long-lived background | **Thread OK** - create once, run forever |
| Short one-off tasks | **Avoid threads** - use asyncio task |

### Thread Pool Pattern (Advanced)

For frequent skill execution, use a single long-lived worker thread:

```python
import _thread
import time

_skill_queue = None  # Skill code to run
_skill_result = None

def _worker_thread():
    global _skill_queue, _skill_result
    while True:
        if _skill_queue:
            try:
                _skill_result = exec_skill(_skill_queue)
            except Exception as e:
                _skill_result = {"error": str(e)}
            _skill_queue = None
        time.sleep_ms(10)

# Start once at boot
_thread.start_new_thread(_worker_thread, ())

def submit_skill(code):
    global _skill_queue
    _skill_queue = code
```

This avoids memory fragmentation from creating/destroying threads.

## Bus Sharing (I2C / SPI)

When multiple extensions or ScriptOs talk to devices on the same I2C or SPI bus, they must share a **single `machine.I2C` or `machine.SPI` instance**. If two extensions each create their own instance for the same hardware peripheral, the second one silently reconfigures the bus — potentially breaking the first.

### Why No Locking Is Needed

In CircuitPython, the `busio.I2C` class has `try_lock()` / `unlock()` methods because its USB stack can preempt a transaction mid-byte. **MicroPython on pyDirect doesn't have this problem** — all I2C/SPI calls are synchronous C functions that run to completion. Since the VM is single-threaded and cooperative, no other coroutine can interleave on the bus between `await` points.

The real risk is **configuration conflicts**, not data races. The `bus` module solves this with a singleton cache.

### The `bus` Module

```python
from lib.sys import bus

# Board-manifest-aware (recommended — uses board.json pin definitions)
i2c = bus.get_i2c("sensors")

# Explicit pins
i2c = bus.get_i2c(0, scl=9, sda=8, freq=400000)

# SPI works the same way
spi = bus.get_spi("display")
spi = bus.get_spi(1, sck=12, mosi=11, miso=13, baudrate=10000000)
```

Calling `bus.get_i2c("sensors")` twice returns the **same object** — no reconfiguration, no conflicts.

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

- [Writing ScriptOs](writing-scriptos.md) - Script basics
- [bg_tasks API](../api/bg-tasks.md) - Task management functions
