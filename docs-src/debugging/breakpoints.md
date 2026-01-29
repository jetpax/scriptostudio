# Setting Breakpoints

How to use print-based breakpoints for debugging in ScriptO Studio.

## Understanding Breakpoints in MicroPython

MicroPython on embedded devices doesn't support traditional IDE breakpoints (pause execution, step through code). Instead, we use **print-based breakpoints** - strategic logging statements that let you trace execution flow and inspect values.

## Setting a Breakpoint

Add a print statement at the location you want to inspect:

```python
def process_sensor_data(data):
    # BREAKPOINT: Check incoming data
    print(f"[BP1] process_sensor_data called, data={data}")
    
    result = transform(data)
    
    # BREAKPOINT: Check result
    print(f"[BP2] transform result={result}")
    
    return result
```

### Breakpoint Pattern

Use a consistent format for easy identification:

```python
print(f"[BP:{location}] {variable}={value}")
```

Example:
```python
print(f"[BP:main:45] sensor_value={sensor_value}, threshold={threshold}")
```

## Conditional Breakpoints

Only print when a condition is met:

```python
def handle_message(msg):
    # Only log when message type is unexpected
    if msg.type not in ['status', 'data']:
        print(f"[BP:COND] Unexpected message type: {msg.type}")
    
    # Only log when value exceeds threshold
    if msg.value > 100:
        print(f"[BP:COND] High value detected: {msg.value}")
```

## Variable Inspection Breakpoint

Dump multiple variables at once:

```python
def debug_state(**kwargs):
    """Helper to print multiple values"""
    pairs = ', '.join(f'{k}={v}' for k, v in kwargs.items())
    print(f"[DBG] {pairs}")

# Usage
debug_state(x=x, y=y, mode=mode, count=count)
```

## Memory Checkpoint Breakpoint

Track memory at specific points:

```python
import gc

def mem_checkpoint(label):
    gc.collect()
    print(f"[MEM:{label}] {gc.mem_free()} bytes free")

# Usage
mem_checkpoint("before_load")
load_large_data()
mem_checkpoint("after_load")
```

## Clearing Breakpoints

To remove breakpoints:

1. **Delete the print statement** from your code
2. **Comment it out** to disable temporarily:
   ```python
   # print(f"[BP1] ...")  # Disabled
   ```
3. **Use a flag** to enable/disable globally:
   ```python
   DEBUG = False  # Set to True to enable breakpoints
   
   def bp(msg):
       if DEBUG:
           print(f"[BP] {msg}")
   
   # Usage
   bp(f"value={value}")
   ```

## Viewing Breakpoint Output

Breakpoint output appears in:
- **Terminal** - All print() output
- **Log Sidebar** - Filtered view (click Log icon)

Use the Log Sidebar's search to filter by `[BP` to see only breakpoints.

## Entry/Exit Breakpoints

Track function entry and exit:

```python
def traced_function(arg1, arg2):
    print(f"[ENTER] traced_function({arg1}, {arg2})")
    try:
        result = do_work(arg1, arg2)
        print(f"[EXIT] traced_function -> {result}")
        return result
    except Exception as e:
        print(f"[EXIT:ERR] traced_function raised {e}")
        raise
```

## Decorator for Tracing

Create a reusable tracing decorator:

```python
def trace(func):
    def wrapper(*args, **kwargs):
        print(f"[TRACE] {func.__name__} called")
        try:
            result = func(*args, **kwargs)
            print(f"[TRACE] {func.__name__} returned")
            return result
        except Exception as e:
            print(f"[TRACE] {func.__name__} raised {type(e).__name__}")
            raise
    return wrapper

# Usage
@trace
def my_function():
    pass
```

## Best Practices

1. **Use consistent prefixes** - `[BP]`, `[DBG]`, `[TRACE]` for easy filtering
2. **Include context** - Function name, line number, variable names
3. **Remove before production** - Breakpoints add overhead
4. **Use sparingly in loops** - Can flood output and slow execution

## Related

- [Debugger Overview](../debugging/index.md)
- [Debug Console](../debugging/debug-console.md)
- [Troubleshooting Errors](../troubleshooting/errors.md)
