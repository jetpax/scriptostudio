# Extensions Overview

Extensions add major new features to ScriptO Studio with rich UIs and device-side functionality.

## What Are Extensions?

Extensions are full-featured applications that:
- Add new UI panels and tabs to ScriptO Studio
- Install Python libraries on your device
- Provide specialized functionality (CAN logging, battery emulation, vehicle monitoring, etc.)

## Available Extensions

![Extensions Browser](https://raw.githubusercontent.com/jetpax/scriptostudio/main/.github/images/extensions.png)

| Extension | Description | Status |
|-----------|-------------|--------|
| **DBE** | Dala's Battery Emulator - CAN-to-RS485 bridge for battery management systems | ✅ Working |
| **GVRET** | High-performance GVRET implementation - SavvyCAN connection over TCP/IP | ✅ Working |
| **OVMS** | Push vehicle metrics to an OVMS v2 server for remote monitoring | 🚧 In development |
| **OpenInverter** | Configure parameters, map CAN messages, view spot values and real-time signals | 🚧 In development |

## Installing Extensions

1. Click **Extensions** in the left sidebar (or the **+** button next to "EXTENSIONS")
2. The Extensions browser opens showing available extensions
3. Find the extension you want
4. Click **CLICK TO INSTALL**
5. Wait for installation to complete

The extension:
- Downloads the UI code from the registry
- Installs any required Python libraries to your device's `/lib/` folder
- Appears in your sidebar under "EXTENSIONS"

## Using Installed Extensions

Click on an installed extension in the sidebar to open it.

### Example: OpenInverter Extension

![OpenInverter Extension](https://raw.githubusercontent.com/jetpax/scriptostudio/main/.github/images/OI.png)

The OpenInverter extension provides:

| Tab | Function |
|-----|----------|
| **Telemetry** | Live spot values with graphs (voltage, current, power, RPM) |
| **Parameters** | Configure inverter parameters |
| **CAN Mappings** | Map CAN messages to parameters |
| **CAN Messages** | View raw CAN traffic |
| **OTA Update** | Update inverter firmware |

Features shown in the telemetry view:
- **Electrical** - Voltage (346V), Current (45.04A), Power (15870W)
- **Motor** - RPM (3017 rpm)
- Real-time graphs with historical data
- Configurable update interval

## Extension Sidebar

Installed extensions appear under the **EXTENSIONS** section in the sidebar:

```
EXTENSIONS          +
├── DBE            ▶
├── GVRET          ▶
├── OpenInverter   ▶
│   ├── Device Manager
│   ├── DEVICES
│   └── Test Inverter 1 ←(selected device)
└── OVMS           ▶
```

Some extensions have sub-items:
- **Device Manager** - Manage connected devices
- **DEVICES** - List of configured devices
- Click a device to view its data

## Uninstalling Extensions

1. Right-click on the extension in the sidebar
2. Select **Uninstall**
3. Confirm removal

This removes the extension from ScriptO Studio but leaves device-side libraries installed.

## Extension Permissions

Extensions can:
- ✅ Execute Python code on your device
- ✅ Read and write files
- ✅ Access CAN bus, I2C, SPI, and other peripherals
- ✅ Make network connections

> [!NOTE]
> Only install extensions from trusted sources. Extensions have full access to your device.

## Related

- [Writing Extensions](../extensions/writing-extensions.md) - Create your own extensions
- [Extension API](../extensions/extension-api.md) - API reference
- [Built-in Extensions](../extensions/built-in-extensions.md) - Detailed extension docs
