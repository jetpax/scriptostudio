# Debugging

The debugger runs the file you're editing on the board and stops it at breakpoints. At each stop you see the watch expressions and the variables, and you choose how to go on.

## Start a session

1. Connect a board and open a Python file in the **Editor**.
2. Optionally, set breakpoints in the gutter (below).
3. Click **Debug** in the toolbar. The **Setup Debugger** sidebar opens. It's available only in the Editor view, with a board connected and a file open.
4. Add watch expressions if you want them.
5. Click **Start Debugging**, or click **Run** in the toolbar.

Studio prepares the file in the browser, interrupts whatever is running, and runs the prepared file in the terminal. While a session is open the editor is read-only, and **New** and **Save** are disabled.

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

**Watch Expressions** takes one expression per line, for example `x * 2`. Studio evaluates them each time the program stops.

## While the program is stopped

The toolbar shows these buttons during a session:

| Button | Action |
|--------|--------|
| **Stop** | End the session and interrupt the board. |
| **Continue** | Run until the next breakpoint. |
| **Step** | Step over the current line. |
| **Step In** | Step into a call. |
| **Step Out** | Run until the current function returns. |

The sidebar, titled **Debug Session**, shows **Live Variables**: your watch expressions and the local variables at the stop. The terminal prints the stop as well, with the file and line, the watches, the locals, the memory in use and the elapsed time.

## How it connects

The prepared file runs on the terminal stream. The board reports each stop on that stream, and Studio sends **Continue** and the step commands back through the `exec` tool. See [MCP tools](../reference/mcp-tools.md).

## Related

- [Editor Features](editor-features.md)
- [Terminal](terminal.md)
