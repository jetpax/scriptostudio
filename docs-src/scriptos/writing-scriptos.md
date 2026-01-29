# Writing ScriptOs

A guide to writing MicroPython scripts for pyDirect devices.

## Script Basics

A ScriptO is simply a MicroPython script that runs on your device. You can:
- Run scripts directly from the editor (temporary execution)
- Save scripts to the device (persistent storage)
- Set scripts to run on boot (via `main.py`)

## Script Structure

### Simple Script

```python
# hello.py - A simple script
print("Hello from pyDirect!")
```

### Script with Imports

```python
# blink.py - Blink an LED
from machine import Pin
import time

led = Pin(2, Pin.OUT)

for i in range(5):
    led.on()
    time.sleep(0.5)
    led.off()
    time.sleep(0.5)

print("Done blinking!")
```

### Async Script

For non-blocking operations, use asyncio:

```python
# async_example.py
import asyncio
from machine import Pin

led = Pin(2, Pin.OUT)

async def blink():
    while True:
        led.toggle()
        await asyncio.sleep(0.5)

async def main():
    # Run tasks concurrently
    await asyncio.gather(
        blink(),
        other_task(),
    )

asyncio.run(main())
```

## Boot Scripts

pyDirect executes scripts in this order on boot:

1. `boot.py` - System initialization (don't edit unless you know what you're doing)
2. `main.py` - Your application code

### Creating main.py

```python
# main.py - Runs on every boot
print("Device starting...")

# Your application logic here
import my_app
my_app.run()
```

> [!WARNING]
> If `main.py` has an error or infinite loop, you may need to connect via USB REPL to fix it.

## Working with Hardware

### GPIO

```python
from machine import Pin

# Digital output
led = Pin(2, Pin.OUT)
led.on()
led.off()
led.toggle()

# Digital input
button = Pin(0, Pin.IN, Pin.PULL_UP)
if button.value() == 0:
    print("Button pressed")
```

### I2C

```python
from machine import I2C, Pin

i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)

# Scan for devices
devices = i2c.scan()
print(f"Found: {[hex(d) for d in devices]}")

# Read from device
data = i2c.readfrom(0x68, 7)
```

### CAN Bus

```python
from machine import CAN

can = CAN(0, mode=CAN.NORMAL, baudrate=500000,
          tx=Pin(5), rx=Pin(4))

# Send message
can.send([0x11, 0x22, 0x33], 0x123)

# Receive message
id, data = can.recv()
print(f"Received: ID={hex(id)}, data={data}")
```

## Best Practices

### Memory Management

```python
import gc

# Force garbage collection to free memory
gc.collect()

# Check available memory
print(f"Free: {gc.mem_free()} bytes")
```

### Error Handling

```python
try:
    risky_operation()
except OSError as e:
    print(f"OS error: {e}")
except Exception as e:
    import sys
    sys.print_exception(e)
```

### Modular Code

Split large scripts into modules:

```
/lib/
  my_sensors.py
  my_network.py
main.py  # imports from lib/
```

## Testing Scripts

1. **Run in editor** - Quick iteration, no save required
2. **Save and run** - Test persistent behavior
3. **Soft reset** - Ctrl+D in REPL to restart without power cycle
4. **Hard reset** - Power cycle or reset button

## Related

- [First ScriptO](../getting-started/first-scripto.md) - Your first script
- [Writing Extensions](../extensions/writing-extensions.md) - Create UI extensions
- [Debugger Overview](../debugging/index.md) - Debug your code
