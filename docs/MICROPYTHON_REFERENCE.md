# MicroPython Quick Reference for ScriptO Studio

This document provides a quick reference for MicroPython differences from CPython that are relevant to ScriptO Studio development.

## Official Documentation

**Full MicroPython differences documentation:** https://docs.micropython.org/en/latest/genrst/

This is the authoritative source for all MicroPython vs CPython differences. Always refer to this when in doubt.

## Common Gotchas Encountered in This Project

### Filesystem Operations

**❌ MicroPython does NOT have `os.path` module**

```python
# ❌ WRONG - This will fail
import os.path
path = os.path.join('/lib', 'vehicles', 'zombie_vcu')
dirname = os.path.dirname(__file__)
exists = os.path.exists(path)

# ✅ CORRECT - Use direct string manipulation
path = '/lib/vehicles/zombie_vcu'
# Check existence by trying to open/list
try:
    os.listdir(path)  # If this works, it exists
except OSError:
    pass  # Doesn't exist
```

**Alternatives:**
- Use string concatenation: `f'{base}/{subdir}/{file}'` or `base + '/' + subdir + '/' + file`
- Check existence by trying operations: `os.listdir()`, `open()`, etc.
- Use `os.stat()` to check if path exists (raises `OSError` if not)

### String Methods

**❌ MicroPython strings do NOT have `.title()` method**

```python
# ❌ WRONG - This will fail
name = "zombie_vcu".replace('_', ' ').title()  # AttributeError!

# ✅ CORRECT - Implement manually
def title_case(text):
    parts = text.replace('_', ' ').split(' ')
    title_parts = []
    for p in parts:
        if len(p) > 0:
            title_parts.append(p[0].upper() + p[1:])
        else:
            title_parts.append(p)
    return ' '.join(title_parts)

name = title_case("zombie_vcu")  # "Zombie Vcu"
```

**Other string methods that may be missing:**
- `.capitalize()` - Implement manually
- `.title()` - Implement manually (as shown above)
- `.casefold()` - May not be available

### F-Strings

**✅ MicroPython DOES support f-strings** (Python 3.6+ feature)

```python
# ✅ This works fine
name = "zombie_vcu"
path = f'/lib/vehicles/{name}/{name}.py'
```

F-strings are supported in MicroPython, so use them freely.

### Standard Library Modules

**Limited standard library** - Many CPython modules are not available:

- ❌ `os.path` - Not available
- ❌ `pathlib` - Not available  
- ❌ `importlib.util` - Not available
- ✅ `os` - Available (but limited - no `os.path`)
- ✅ `sys` - Available
- ✅ `json` - Available
- ✅ `time` - Available
- ✅ `gc` - Available (garbage collector)

**Check availability before using:**
```python
try:
    import some_module
except ImportError:
    # Module not available, use alternative
    pass
```

### Import System

**Package imports work differently:**

```python
# ✅ CORRECT - Direct file execution (most reliable)
with open('/lib/vehicles/zombie_vcu/zombie_vcu.py', 'r') as f:
    code = f.read()
exec(code, namespace)

# ⚠️ Package imports may not work if __init__.py is missing
# from vehicles.zombie_vcu import zombie_vcu  # May fail
```

### Exception Handling

**Exception objects may behave differently:**

```python
# ✅ CORRECT - Use str() for string conversion
try:
    # something
except Exception as e:
    error_msg = str(e)  # Works
    # e.message may not exist
```

### Dictionary Comprehensions

**✅ Dictionary comprehensions work:**

```python
# ✅ This works fine
vehicle_list = {k: v['name'] for k, v in VEHICLES.items()}
```

### File Operations

**File operations work similarly:**

```python
# ✅ Standard file operations work
with open('/lib/config.json', 'r') as f:
    data = f.read()

with open('/lib/output.txt', 'w') as f:
    f.write('content')
```

### Memory Constraints

**Be mindful of memory:**

- Avoid loading large files into memory at once
- Use generators where possible
- Be careful with large lists/dicts
- Use `gc.collect()` if needed to force garbage collection

## Best Practices for ScriptO Studio

1. **Always test on actual MicroPython device** - Don't assume CPython compatibility
2. **Use try/except for filesystem operations** - Check existence by trying operations
3. **Avoid `os.path`** - Use string manipulation instead
4. **Implement missing string methods manually** - Don't rely on `.title()`, `.capitalize()`, etc.
5. **Keep dependencies minimal** - Only use MicroPython standard library
6. **Test imports** - Wrap imports in try/except for optional modules
7. **Use f-strings** - They're supported and cleaner than `.format()`

## Testing Checklist

Before committing code, verify:

- [ ] No `os.path` usage
- [ ] No `.title()` or `.capitalize()` on strings
- [ ] File operations wrapped in try/except
- [ ] Imports checked for availability
- [ ] Code tested on actual MicroPython device
- [ ] Memory usage is reasonable

## Resources

- **Official MicroPython Docs:** https://docs.micropython.org/en/latest/genrst/
- **MicroPython Language Reference:** https://docs.micropython.org/en/latest/reference/
- **MicroPython Libraries:** https://docs.micropython.org/en/latest/library/

## Project-Specific Notes

### ESP32 Port Specifics

- Uses ESP-IDF v5.4.2
- Has access to hardware-specific modules (`machine`, `network`, etc.)
- WebREPL available for remote access
- File system is typically SPIFFS or LittleFS

### ScriptO Studio Integration

- Extensions run in MicroPython on the device
- Communication via WebREPL Binary Protocol (WBP)
- Notifications via `webrepl.notify({"key": value})` - sends CBOR-encoded INFO events
- Device API provides `execute()` for running code and parsing responses
