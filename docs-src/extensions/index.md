# Extensions

Extensions add new functionality to ScriptO Studio through the **JS Configurator** pattern - JavaScript classes that provide custom UI panels and device-side Python libraries.

![Extensions in ScriptO Studio](../assets/extensions.png)

## What are Extensions?

Extensions are bundled JavaScript modules that integrate into ScriptO Studio to:

- Add new sidebar menu tabs with custom UI
- Deploy device-side Python libraries during installation
- Communicate with hardware using the M2M (machine-to-machine) pattern
- Provide specialized tools for specific use cases

## Extension Structure

Extensions use a modular source structure:

```
MyExtension/
├── extension.json      # Metadata and configuration
├── src/
│   └── index.js       # Entry point (exports class)
└── device/             # Device-side files (optional)
    └── lib/
```

These are bundled into a single `.bundle.js` file for distribution.

## Built-in Extensions

| Extension | Description |
|-----------|-------------|
| **DBE** | Battery emulator with MQTT integration |
| **OpenInverter** | Motor controller configuration |
| **DTC Explorer** | Diagnostic Trouble Code viewer |
| **OVMS** | Open Vehicle Monitoring System interface |

## Extensions vs ScriptOs

Both Extensions and [ScriptOs](../scriptos/index.md) expand ScriptO Studio functionality, but they serve different purposes:

| Aspect | Extensions | ScriptOs |
|--------|------------|----------|
| **Language** | JavaScript (+ Python libs) | Python only |
| **UI Location** | Sidebar tabs | Run from ScriptOs panel |
| **Persistence** | Always loaded | Run on-demand |
| **Use Case** | Complex tools with dedicated UI | Quick utilities, demos, automation |
| **Install** | Via registry, deploys device libs | Just run from registry |

**Choose Extensions** when you need:
- Permanent sidebar presence
- Complex multi-panel interfaces
- Bundled device-side libraries

**Choose ScriptOs** when you need:
- Quick one-off scripts
- Simple UI plugins (iframe modals)
- Hardware testing/diagnostics

## Getting Started

- [Writing Extensions](writing-extensions.md) - Create your own extension
- [Extension API](extension-api.md) - Full API reference
- [Device Libraries](device-libraries.md) - Python libraries for device
- [Built-in Extensions](built-in-extensions.md) - Example implementations
