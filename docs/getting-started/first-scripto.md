# First ScriptO

Run your first script on the device.

## Hello ScriptO!

ScriptO Studio opens with a default script already in the editor. To run your first code:

1. Connect to your device (see [Getting Started](../getting-started/index.md))
2. You should see the default script tab in the editor
3. Click **Run** in the toolbar (or press Ctrl+R / Cmd+R)
4. See "Hello ScriptO!" appear in the Terminal below

That's it! You've run your first ScriptO.

## Understanding the Default Script

The default script demonstrates basic Python output:

```python
print("Hello ScriptO!")
```

When you click Run, ScriptO Studio:
1. Sends the code to your connected device
2. The device executes it in the MicroPython interpreter
3. Output is streamed back and displayed in the Terminal

## Try Something More

Now try editing the script:

```python
print("Hello ScriptO!")
print("Device is running MicroPython")

import sys
print(f"Platform: {sys.platform}")
```

Click **Run** again to see the updated output.

## Save to Device

To run code automatically on boot:

1. Click **File → New** or press Ctrl+N / Cmd+N
2. Name the file `main.py`
3. Add your code
4. Save (Ctrl+S / Cmd+S)
5. Reboot device - code runs automatically

## Using the REPL

For interactive development, use the Terminal directly:

1. Click in the **Terminal** panel
2. Type Python commands directly
3. Press Enter to execute

```python
>>> import sys
>>> sys.platform
'esp32'
>>> 1 + 1
2
```

## Next Steps

- [IDE Overview](../getting-started/ide-overview.md) - Learn the interface
- [Writing ScriptOs](../user-guide/writing-scriptos.md) - Write more complex scripts
- [File Manager](../user-guide/file-manager.md) - Managing device files
