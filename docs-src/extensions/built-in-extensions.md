# Built-in Extensions

ScriptO Studio includes several pre-built extensions for common use cases.

## DBE (Battery Emulator)

**ID:** `dbe`

Dala's Battery Emulator - bridges EV battery packs to solar inverters via CAN-to-RS485.

**Features:**
- Support for Nissan LEAF, BMW i3, and other battery packs
- Pylon CAN and SMA inverter protocols
- MQTT integration with Home Assistant auto-discovery
- Real-time battery metrics and status

**Panels:** Configuration, Status, Metrics, MQTT

---

## OpenInverter

**ID:** `openinverter`

Complete suite for OpenInverter motor controllers.

**Features:**
- Parameter configuration and management
- CAN message mapping (TX/RX)
- Spot value monitoring with charts
- Device discovery on CAN bus

**Panels:** Device Manager, Parameters, Telemetry, CAN Mappings, OTA

---

## DTC Explorer

**ID:** `dtc-explorer`

Diagnostic Trouble Code viewer using UDS/ISO 14229.

**Features:**
- Read and clear DTCs from ECUs
- Standard code definitions (SAE J2012)
- Support for manufacturer-specific codes

---

## OVMS

**ID:** `ovms`

Open Vehicle Monitoring System interface.

**Features:**
- Vehicle telemetry display
- Remote commands
- Charge scheduling
- GPS location

---

## GVRET

**ID:** `gvret`

CAN bus analyzer using GVRET protocol.

**Features:**
- Live CAN frame capture
- DBC file parsing
- Signal decoding
- Export to CSV/ASC

---

## Source Code

All built-in extensions follow the modular structure:

```
ExtensionName/
├── extension.json
├── src/
│   └── index.js
└── device/
    └── lib/
```

View source on GitHub: [scriptostudio/registry/Extensions](https://github.com/jetpax/scriptostudio)
