# Debugging

The debugger runs the file you're editing on the board and stops it at breakpoints. At each stop you see the watch expressions and the variables, and you choose how to go on.

## Start a session

1. Connect a board and open a Python file in the **Editor**.
2. Optionally, set breakpoints in the gutter (below).
3. Click **Debug** in the toolbar, or press F5. The debugger opens beside the code, with the file's breakpoints and your watch expressions.
4. Click **Run**, or press F5 again. The file runs, and stops at its first breakpoint, or at its first line if it has none.

Click **Debug** again to hide the debugger; **Run** then runs the file as usual.

Running in the debugger needs a board connected and a file open. Studio prepares the file in the browser, interrupts whatever is running, and runs the prepared file in the terminal. While a session is open the editor is read-only, and **New** and **Save** are disabled.

## Breakpoints

Click the gutter beside a line number to set a breakpoint. A marker appears in the gutter, and the line gets a ` # ●` comment at its end. Click the marker to open the breakpoint dialog:

| Field | Meaning |
|-------|---------|
| Enabled switch | Turns the breakpoint on or off without removing it. |
| Condition | An expression, for example `x == 0`. The breakpoint stops only when it's true. |
| Hit count | Stops by count: `<1`, `<=2`, `=3`, `>4`, `>=5` or `%6`. |
| Trash button | Deletes the breakpoint. |

Click **Save** to keep your changes.

## Watch expressions

**Watch**, in the debugger, takes one expression per line, for example `x * 2`. Studio works them out each time the program stops. They become part of the file that runs, so watches you add during a session are worked out from the next time you click **Run**. Studio keeps them for next time.

## While the program is stopped

The toolbar shows these buttons during a session:

| Button | Action |
|--------|--------|
| **Stop** | End the session and interrupt the board. |
| **Continue** | Run until the next breakpoint. F5. |
| **Step** | Step over the current line. F10. |
| **Step In** | Step into a call. F11. |
| **Step Out** | Run until the current function returns. F12. |

The debugger shows where the program stopped, its **Variables** and your **Watch** expressions, with the values that changed since the last stop highlighted. **Ask about this** hands the file and the values to the agent. The terminal marks each stop with its line.

## How it connects

The prepared file runs on the terminal stream. The board reports each stop on that stream, and Studio sends **Continue** and the step commands back through the `exec` tool. See [MCP tools](../reference/mcp-tools.md).

## Related

- [Editor Features](editor-features.md)
- [Terminal](terminal.md)
