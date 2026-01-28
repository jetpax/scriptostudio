# ScriptO Studio Registry

The official registry of ScriptOs and Extensions for [ScriptO Studio](https://app.scriptostudio.com).

## What's Here

This registry contains reusable code for ScriptO Studio:

### 🐍 ScriptOs (Python Scripts)

Python scripts that run directly on your device:
- Hardware drivers and protocol implementations
- Utility functions and helper libraries
- Ready-to-use device functionality

**Browse:** [registry.scriptostudio.com/catalogue/](https://registry.scriptostudio.com/catalogue/)

### 🔌 Extensions (JavaScript + Python)

Full-featured applications with rich UIs:
- **Frontend (JavaScript)**: Runs in ScriptO Studio
- **Backend (Python)**: Runs on your device
- **Integration**: Seamless browser-to-device communication

**Browse:** [registry.scriptostudio.com/extensions-catalogue/](https://registry.scriptostudio.com/extensions-catalogue/)

## Directory Structure

```
registry/
├── ScriptOs/           # Python scripts with metadata
├── Extensions/         # JavaScript extensions
│   ├── GVRET/
│   ├── OVMS/
│   ├── OpenInverter/
│   └── DBE/
└── index.json          # Auto-generated registry index
```

## Using the Registry

### From ScriptO Studio

**ScriptOs:** Open the ScriptOs panel → Browse → Install

**Extensions:** Click Extensions → Browse → Install

### Direct API Access

```
https://registry.scriptostudio.com/index.json
```

## Contributing

See the main [README](../README.md#-development) for contribution guidelines.

---

## 🌐 The Ecosystem

| Component | Description |
|-----------|-------------|
| **[ScriptO Studio](https://app.scriptostudio.com)** | Web IDE + Extension loader |
| **[Registry](https://registry.scriptostudio.com)** | Catalogue of Extensions and ScriptOs |
| **[pyDirect](https://github.com/jetpax/pyDirect)** | MicroPython fast-path C modules |
| **[MicroPython](https://micropython.org)** | Python for microcontrollers |
---

**Made with ❤️ for the Embedded Python community**
