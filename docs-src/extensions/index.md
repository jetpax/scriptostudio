# Extensions

Extensions add new functionality to ScriptO Studio through the **JS Configurator** pattern - JavaScript modules that provide custom UI tabs and device-side Python libraries.

## What are Extensions?

Extensions are JavaScript modules (ESM) that integrate into ScriptO Studio to:

- Add new sidebar menu tabs with custom UI
- Bundle device-side Python libraries
- Communicate with hardware using the M2M (machine-to-machine) pattern
- Provide specialized tools for specific use cases

## Built-in Extensions

| Extension | Description |
|-----------|-------------|
| **DBE** | Battery emulator with MQTT integration |
| **OVMS** | Open Vehicle Monitoring System interface |
| **DTC Explorer** | Diagnostic Trouble Code viewer |
| **OpenInverter** | Motor controller configuration |

## Extensions vs ScriptOs

Both Extensions and [ScriptOs](../scriptos/index.md) expand ScriptO Studio functionality, but they serve different purposes:

| Aspect | Extensions | ScriptOs |
|--------|------------|----------|
| **Language** | JavaScript (+ Python libs) | Python only |
| **UI Location** | Sidebar tabs | Run from ScriptOs panel |
| **Persistence** | Always loaded | Run on-demand |
| **Use Case** | Complex tools with dedicated UI | Quick utilities, demos, automation |
| **Install** | Via registry + device libs | Just run from registry |

**Choose Extensions** when you need:
- Permanent sidebar presence
- Complex multi-tab interfaces
- Bundled device-side libraries

**Choose ScriptOs** when you need:
- Quick one-off scripts
- Simple UI plugins (iframe modals)
- Hardware testing/diagnostics

## Getting Started

- [Writing Extensions](writing-extensions.md) - Create your own extension
- [Extension API](extension-api.md) - Full API reference
- [Built-in Extensions](built-in-extensions.md) - Example implementations
