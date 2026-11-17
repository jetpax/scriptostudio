# A Tour of Studio

Studio has three columns: the menu on the left, what you picked in the centre, and the Agent on the right. A bar along the bottom shows the board's live readings.

## The menu, on the left

The bolt at the top is the way to a board: grey with none connected, green with one. Click it to connect, or to show the board you're connected to.

Below it are the Apps:

- **Studio** is where you work on the board: the editor, its files and ScriptOs, the debugger, the terminal and the log. See [Editor](../user-guide/editor-features.md) and [Files](../user-guide/file-manager.md).
- Each App you've installed, with its own pages beneath it.
- **Browse** finds more Apps and ScriptOs for the connected board.

The gear at the top opens **Settings**: About, Appearance, Agent, Firmware, and the network panels the board's hardware calls for. Click the **×** in its place to go back to the Apps.

## Studio, in the centre

The editor fills the top, with the terminal beneath it. A pane down the right side holds three tabs:

- **Files**: the board's files, and a folder on your computer.
- **ScriptOs**: what's installed on the board, each with Start or Stop, At startup, Code and Remove. **Code** opens it in the editor.
- **Debug**: the debugger, which comes forward while a session runs.

Beneath the editor are the **Terminal**, the board's REPL, and the **Log**. See [Terminal](../user-guide/terminal.md).

**Files** at the right of the toolbar shows or hides the pane down the right side; its **×** hides it too. **Log** in the terminal's bar shows or hides the Log. Drag any divider to resize. Studio remembers all of it.

## The Agent, on the right

- **The board**: its name on your network, what it is, the agent's model, and the hardware it has. With none connected, the boards you've used.
- **The chat** with the agent. See [Studio's Agent](../agent/studio-agent.md).

Close it with its **×** to leave a strip with its name; click the strip to open it again. Drag its left edge to make it wider.

## Stopping things

- **Stop** in the chat ends the agent's turn and its call, and leaves everything else running.
- **Stop** above the editor breaks whatever is running, whichever client started it, and stops ScriptOs and Apps as well.
