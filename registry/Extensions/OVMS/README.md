# OVMS Extension

Open Vehicle Monitoring System (OVMS) v2 client for Scripto Studio.

## Overview

This extension connects pyDirect devices to an OVMS server, allowing vehicle monitoring via the OVMS mobile apps. It reads metrics from vehicle ECUs over CAN bus and transmits them to the OVMS cloud infrastructure.

## Protocol Stack

```
┌───────────────────────────────────────┐
│ OVMS v2 Protocol (TCP/RC4 encrypted)  │
├───────────────────────────────────────┤
│ Vehicle Metrics Layer                 │
├───────────────────────────────────────┤
│ OBD2 / UDS Client (lib.uds_client)    │
├───────────────────────────────────────┤
│ ISO-TP Transport (lib.isotp)          │
├───────────────────────────────────────┤
│ CAN Bus (pyDirect CAN module)         │
└───────────────────────────────────────┘
```

## Supported Vehicles

Vehicle-specific implementations are in `lib/vehicles/`:

| Vehicle | Description |
|---------|-------------|
| `zombie_vcu.py` | ZombieVerter VCU (OpenInverter-based) |
| Additional vehicles can be added |

## Dependencies

- **pyDirect Core Library**: Uses `lib.uds_client` for CAN communication (no longer bundles its own)
- **CAN Module**: Requires board with CAN capability defined in board.json

## Key Files

| File | Purpose |
|------|---------|
| `OVMS.js` | Extension UI and OVMS v2 client control |
| `lib/OVMS_helpers.py` | Python helpers for OVMS protocol and vehicle polling |
| `lib/vehicle.py` | Vehicle configuration loader |
| `lib/vehicles/*.py` | Vehicle-specific metric definitions |

## Configuration

Settings stored via pyDirect settings module:

| Setting | Description |
|---------|-------------|
| `ovms.server` | OVMS server hostname |
| `ovms.port` | Server port (default: 6867) |
| `ovms.vehicleid` | Your vehicle ID |
| `ovms.password` | Vehicle password |
| `ovms.vehicle_type` | Vehicle type (e.g., `zombie_vcu`) |

## How It Works

1. **CAN Polling**: Reads vehicle metrics via UDS/OBD2 on CAN bus
2. **OVMS Protocol**: Encrypts and sends metrics to OVMS server (RC4 + HMAC-MD5)
3. **Mobile App**: OVMS apps receive and display real-time vehicle data

## Related

- [UDS Extension](../UDS/) - Generic UDS diagnostic tool
- [OpenInverter Extension](../OpenInverter/) - OpenInverter parameter tuning
- [pyDirect UDS Library](https://github.com/jetpax/pyDirect) - Core ISO-TP/UDS implementation
