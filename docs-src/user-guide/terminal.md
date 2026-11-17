# Terminal

Studio has one terminal, a MicroPython REPL on the connected board. It sits beneath the editor in **Studio**, with the **Log** beside it.

## Use it

Click in the terminal and type, as you would at a MicroPython prompt. Output from **Run** in the editor appears here, along with error messages and tracebacks.

**Clear** in the terminal's bar clears it. Shortcut: Ctrl+L or Cmd+L.

## The Log

The Log lists the board's messages and the calls agents make, newest at the foot. **Clear** empties it. **Log** in the terminal's bar shows or hides it; hidden, the terminal has the full width.

## Resize it

Drag the divider above the terminal to change its height, and the one between the terminal and the Log to share the width. Studio remembers both.

## What an agent does

When an agent runs code on the board, the code and its output appear in this terminal. Each line is tagged with the name the agent's client gives itself, in square brackets, for example `[Claude Code]`. Calls an agent makes also show in the Log.

Stop is above the editor. It interrupts what's running in the terminal and stops background tasks, whoever started them.

## Related

- [Editor Features](editor-features.md)
- [Debugging](debugging.md)
- [Other agents](../agent/other-agents.md)
