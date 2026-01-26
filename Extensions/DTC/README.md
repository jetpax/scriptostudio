# DTC Extension

Diagnostic Trouble Codes - Read, display, and clear DTCs from vehicle ECUs using UDS/OBD2.

## Features

- **Read DTCs** from any UDS/OBD2 compatible ECU
- **12,000+ DTC descriptions** from integrated database
- **Color-coded status**: Active (red), Pending (yellow), History (gray)
- **Expandable details** with status flags and manufacturer info
- **Clear DTCs** with safety confirmation
- **Emissions readiness** monitor status
- **Live data** OBD2 PID monitoring
- **Service builder** for advanced UDS commands

## Panels

| Panel | Purpose |
|-------|---------|
| Connection | CAN ID, bitrate, loopback/normal mode |
| DTCs | Read/clear trouble codes with descriptions |
| Readiness | I/M monitor status for emissions testing |
| Live Data | Real-time OBD2 sensor values |
| Service Builder | Raw UDS command interface |

## DTC Database

Includes 12,000+ DTC definitions exported from [dtc-database](https://github.com/Wal33D/dtc-database):

- **Generic OBD-II codes** (SAE J2012 standard)
- **Manufacturer-specific codes** for 33+ brands
- **All code types**: P (Powertrain), B (Body), C (Chassis), U (Network)

Database is loaded client-side (1MB JSON) - no device storage required.

## Architecture

```
DTC.js (browser)              pyDirect (device)
┌──────────────────────────┐   ┌──────────────────────────┐
│ dtc_codes.json (1MB)     │   │ lib/uds_client.py        │
│ - O(1) code lookup       │◀──│ - CAN communication      │
│ - Description display    │   │ - UDS protocol handling  │
└──────────────────────────┘   └──────────────────────────┘
```

## Files

```
Extensions/DTC/
├── DTC.js                 ← Main extension
├── README.md              ← This file
├── export_dtc_json.py     ← Database export script
└── data/
    └── dtc_codes.json     ← 12K DTC descriptions (1MB)
```

## Usage

1. Connect pyDirect device with CAN capability
2. Set TX/RX CAN IDs (default: 7E0/7E8)
3. Select mode: Loopback (test) or Normal (real ECU)
4. Click "Read DTCs" to scan for trouble codes

## Related

- [OVMS Extension](../OVMS/) - Vehicle monitoring via OBD2
- [OpenInverter Extension](../OpenInverter/) - CANopen SDO parameter tuning
- [pyDirect UDS Library](https://github.com/jetpax/pyDirect) - Core ISO-TP/UDS implementation
