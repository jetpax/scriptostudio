# IDE Overview

A tour of the ScriptO Studio interface.

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  🔧 Toolbar                                                     │
├───────────────┬─────────────────────────────────────────────────┤
│               │                                                 │
│   📁 Sidebar  │               📝 Editor                         │
│               │                                                 │
│   Files       │         Code editing area                       │
│   Extensions  │                                                 │
│               ├─────────────────────────────────────────────────┤
│               │               💻 Terminal                       │
│               │         REPL and output                         │
├───────────────┴─────────────────────────────────────────────────┤
│  📊 Status Bar                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### Toolbar

| Button | Action |
|--------|--------|
| **Connect** | Connect/disconnect from device |
| **Run** | Execute current file on device |
| **Stop** | Interrupt running code (Ctrl+C) |
| **Save** | Save current file to device |
| **New** | Create new file |

### Sidebar

- **Files** - Device filesystem browser
- **Extensions** - Installed extensions and marketplace
- **Settings** - Configuration options
- **Log** - System log messages

### Editor

Features:
- Syntax highlighting (Python)
- Line numbers
- Multiple tabs
- Error markers
- CodeMirror 6 based

### Terminal

- Interactive Python REPL
- Script output display
- Syslog messages
- Command history (up/down arrows)

### Status Bar

Shows:
- Connection status (🟢 Connected / 🔴 Disconnected)
- Device info (RAM, temperature)
- Current file path
- Disconnect button when connected

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+S** / **Cmd+S** | Save file |
| **Ctrl+R** / **Cmd+R** | Run code |
| **Ctrl+N** / **Cmd+N** | New file dialog |
| **Ctrl+L** / **Cmd+L** | Clear terminal |
| **Ctrl+Shift+C** / **Cmd+Shift+C** | Connect to device |

> [!NOTE]
> On macOS, use **Cmd** instead of **Ctrl**.

## Log Sidebar

The Log sidebar shows system messages from the device, including:
- Python print() output
- Syslog messages
- Error and warning logs

Click the Log icon in the sidebar to toggle visibility.

## Related

- [Editor Features](../user-guide/editor-features.md)
- [Terminal & REPL](../user-guide/terminal-repl.md)
- [File Manager](../user-guide/file-manager.md)
