# Architecture

ScriptO Studio is a browser-based IDE for MicroPython development on ESP32 devices running pyDirect firmware.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      ScriptO Studio                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Editor    │  │ File Manager│  │     Extensions      │  │
│  │ (CodeMirror)│  │             │  │  (JS Configurator)  │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                    │             │
│  ┌──────┴────────────────┴────────────────────┴──────────┐  │
│  │                   WebREPL Client                      │  │
│  │              (webrepl_binary.js)                      │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────┴────────────────────────────────┐  │
│  │              Transport Layer                          │  │
│  │   ┌─────────────┐          ┌─────────────────────┐    │  │
│  │   │   WebRTC    │◄────────►│     WebSocket       │    │  │
│  │   │  (Primary)  │          │     (Fallback)      │    │  │
│  │   └─────────────┘          └─────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ WBP (WebREPL Binary Protocol)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      pyDirect Device                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                webrepl_binary.py                      │  │
│  │         (Unified WebREPL Binary Protocol)             │  │
│  └──────────────────────────┬────────────────────────────┘  │
│                             │                               │
│  ┌──────────┐  ┌────────────┴───────────┐  ┌──────────────┐ │
│  │   VFS    │  │     MicroPython        │  │   Settings   │ │
│  │  (Files) │  │      Runtime           │  │   (JSON)     │ │
│  └──────────┘  └────────────────────────┘  └──────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Hardware Abstraction Layer               │  │
│  │   CAN • I2C • SPI • UART • GPIO • WiFi • BLE          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### ScriptO Studio (Browser)

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Editor** | CodeMirror 6 | Code editing with syntax highlighting |
| **File Manager** | Custom ESM | Device filesystem navigation |
| **Terminal** | xterm.js | Interactive REPL |
| **Extensions** | JS Configurator | Pluggable UI panels |
| **Transport** | WebRTC/WebSocket | Device communication |

### pyDirect Device (ESP32)

| Component | Purpose |
|-----------|---------|
| **webrepl_binary** | Binary protocol handler |
| **MicroPython** | Python runtime (1.27) |
| **ESP-IDF** | Hardware SDK (v5.5) |
| **Settings** | JSON configuration store |

## Communication Flow

1. **Connection**: Client negotiates WebRTC (or falls back to WebSocket)
2. **Authentication**: Challenge-response with hashed password
3. **Commands**: Client sends requests, device responds
4. **Streaming**: Device pushes logs and stdout continuously

## ESM Module Structure

ScriptO Studio uses ES Modules for clean separation:

```
pwa/
├── js/
│   ├── app.js              # Application bootstrap
│   ├── connection.js       # Connection management
│   ├── terminal.js         # Terminal integration
│   ├── file-operations.js  # File manager logic
│   ├── store.js            # State management
│   └── webrepl/
│       ├── webrepl.js      # Client protocol
│       └── transports/     # WebRTC, WebSocket
└── components/             # UI components
```

## Design Principles

1. **Lazy Loading** - Components loaded on demand
2. **Single Connection** - One client per device
3. **Client-Provided Scripts** - M2M logic stays under 10KB
4. **Minimalist UI** - Clean, focused interface

## Related

- [Building from Source](../developer/building-from-source.md)
- [ESM Modules](../developer/esm-modules.md)
- [WebREPL Binary Protocol](../protocol/webrepl-binary-protocol.md)
