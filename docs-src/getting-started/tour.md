# A Tour of Studio

Studio has three columns: the menu on the left, what you picked in the centre, and the Agent on the right. A bar along the bottom shows the board's live readings.

## The menu, on the left

The bolt at the top is the way to a board: grey with none connected, green with one. Click it to connect, or to show the board you're connected to.

Below it are the Apps:

- **Studio** is where you work on the board: the editor, the debugger, the terminal and the log. See [Editor](../user-guide/editor-features.md).
- Each App you've installed, with its own pages beneath it. An App whose ScriptO the connected board doesn't have is left out; **Browse** offers it for that board.
- **Browse** finds more Apps and ScriptOs for the connected board.

Three buttons at the top say what the menu shows, and the one showing is lit. The house shows the Apps.

- The folder shows **Files**, in three parts: the board's **ScriptOs**, the **Board**'s files, and **This computer**, a folder on your computer. Whatever is in the centre stays there, and opening a file brings Studio forward. Drag the menu's right edge to make it wider. See [Files](../user-guide/file-manager.md).
- The gear opens **Settings**: About, Appearance, Agent, Firmware, and the network panels the board's hardware calls for.

Each ScriptO shows whether it's running. Hover over one for its start or stop button, and click it to open its code. Right-click it, or click its **⋯**, for **Run at startup**, **Open the code**, **Ask about the crash** when it has crashed, and **Remove**. Click the **ScriptOs** heading to fold the list away.

## Studio, in the centre

The editor fills the top. **Debug** in its toolbar shows the debugger beside the code; while it shows, **Run** runs the file in it, a line at a time. See [Debugging](../user-guide/debugging.md).

Beneath the editor are the **Terminal**, the board's REPL, and the **Log**. **Log** in the terminal's bar shows or hides the Log. See [Terminal](../user-guide/terminal.md).

Drag any divider to resize. Studio remembers all of it.

## The Agent, on the right

- **The board**: its name on your network, what it is, the agent's model, and the hardware it has. With none connected, the boards you've used.
- **The chat** with the agent. See [Studio's Agent](../agent/studio-agent.md).

It starts as wide as the centre. Drag its left edge to change that; it keeps its share as the window changes size. Close it with its **×** to leave a strip with its name, and click the strip to open it again.

## Stopping things

- **Stop** in the chat ends the agent's turn and its call, and leaves everything else running.
- **Stop** above the editor breaks whatever is running, whichever client started it, and stops ScriptOs and Apps as well.
