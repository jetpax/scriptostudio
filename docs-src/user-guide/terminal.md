# Terminal

Studio has one terminal, a MicroPython REPL on the connected board. It sits in the sidebar on the right, under the board and its ScriptOs, and stays there in every view: Home, Files, the Editor, panels and Apps.

## Use it

Click in the terminal and type, as you would at a MicroPython prompt. Output from **Run** in the editor appears here, along with error messages and tracebacks.

The buttons above the terminal:

| Button | Action |
|--------|--------|
| Copy | Copy the selected text. |
| Paste | Paste into the prompt. |
| Clean | Clear the terminal. Shortcut: Ctrl+L or Cmd+L. |
| Toggle Logs | Show or hide the Logs list beside the terminal. |

The arrow at the end of the bar closes the terminal and opens it again.

## Resize it

Drag the handle in the terminal's bar up or down to change its height. Drag the vertical divider between the main area and the sidebar to change the sidebar's width. Studio remembers the width.

## What an agent does

When an agent runs code on the board, the code and its output appear in this terminal. Each line is tagged with the name the agent's client gives itself, in square brackets, for example `[Claude Code]`. Calls an agent makes also show in the Logs list. If the terminal is closed when an agent starts working, it opens.

Stop is above the editor. It interrupts what's running in the terminal and stops background tasks, whoever started them.

## Related

- [Editor Features](editor-features.md)
- [Debugging](debugging.md)
- [Other agents](../agent/other-agents.md)
