# Debugger Overview

ScriptO Studio includes debugging tools to help you find and fix issues in your MicroPython code.

## Features

| Feature | Description |
|---------|-------------|
| **REPL Inspection** | Examine variables and state interactively |
| **Print Debugging** | Strategic print() statements with log capture |
| **Error Tracebacks** | Formatted stack traces with source links |
| **Memory Monitoring** | Track heap usage to find leaks |
| **Log Sidebar** | Filtered view of device logs |

## Debugging Methods

### 1. Interactive REPL

The Terminal provides a live Python REPL on your device:

```python
>>> import gc
>>> gc.mem_free()
125648

>>> from machine import Pin
>>> led = Pin(2, Pin.OUT)
>>> led.value()
0
```

Use this to:
- Inspect variable values
- Test code snippets
- Check device state

### 2. Print Debugging

Add print statements to trace execution:

```python
def process_data(data):
    print(f"[DEBUG] process_data called with: {data}")
    result = transform(data)
    print(f"[DEBUG] transform result: {result}")
    return result
```

View output in the Terminal or Log sidebar.

### 3. Exception Handling

Wrap code in try/except to capture errors:

```python
try:
    result = risky_operation()
except Exception as e:
    import sys
    sys.print_exception(e)
    # Handle error or re-raise
```

### 4. Memory Debugging

Monitor memory to find leaks:

```python
import gc

def check_memory(label):
    gc.collect()
    print(f"[MEM] {label}: {gc.mem_free()} bytes free")

check_memory("start")
do_something()
check_memory("after operation")
```

## Using the Log Sidebar

The Log sidebar captures and displays:
- Print statements from your code
- Syslog messages from the device
- Error messages and warnings

Filter logs by:
- **Level** - Info, Warning, Error
- **Source** - Your code, system, extensions
- **Search** - Filter by text content

## Viewing Stack Traces

When an exception occurs, ScriptO Studio displays a formatted traceback:

```
Traceback (most recent call last):
  File "main.py", line 15, in <module>
  File "main.py", line 8, in setup
  File "sensors.py", line 23, in init_sensor
OSError: [Errno 19] ENODEV
```

Click on file references to jump to the source location.

## Remote Debugging Limitations

Due to the nature of MicroPython on embedded devices:
- **No breakpoints** - Cannot pause execution mid-code
- **No step debugging** - Cannot step through line-by-line
- **No variable watch** - Use REPL to inspect manually

For complex debugging, use the REPL and print statements strategically.

## Related

- [Setting Breakpoints](../debugging/breakpoints.md) - Using print-based breakpoints
- [Debug Console](../debugging/debug-console.md) - REPL debugging tips
- [Troubleshooting Errors](../troubleshooting/errors.md)
