# CCS Extension - CCS/NACS DC Fast Charging

EVSE emulator for CCS/NACS DC fast charging. Enables an ESP32-P4 to act as a charger and trigger contactor closure in electric vehicles.

## Overview

This extension provides a complete CCS charging emulator that:
1. Performs SLAC handshake with the vehicle
2. Handles V2G (DIN 70121) protocol negotiation
3. Simulates PreCharge to trigger contactor closure

**Use Cases:**
- V2G (Vehicle-to-Grid) power extraction
- Battery diagnostics and SOC reading
- CCS-to-CHAdeMO bridge development
- EV charging protocol research

## Hardware Requirements

- **ESP32-P4** with Ethernet
- **TP-Link TL-PA4010P** HomePlug modem (EVSE mode configured)
- **CCS/NACS connector** (CCS1, CCS2, or NACS depending on vehicle)
- **CP coupling circuit** (PWM + PLC transformer)
- **PP resistor** (1.5kΩ for 13A rating)

## Installation

1. Flash ESP32-P4 with mpDirect firmware (PLC module enabled)
2. Configure TP-Link modem for EVSE mode
3. Install extension via Scripto Studio Extensions panel

## Usage

### 1. Configuration Panel
- Set CP PWM GPIO pin
- Check modem detection
- Start/stop CCS emulator

### 2. Status Panel
- Monitor SLAC state (IDLE → MATCHED)
- See vehicle MAC address
- Track contactor state

### 3. V2G Panel
- View charging parameters from vehicle
- Monitor PreCharge voltage simulation
- See SOC and target values

## Protocol Flow

```
Start CCS
    ↓
CP PWM 5% ─────────────────────────────────────────┐
    ↓                                               │
SLAC Handshake ─────────────────────────────────────│
    ↓                                               │
Network Formed (NID/NMK) ───────────────────────────│
    ↓                                               │
V2G TCP Connection ─────────────────────────────────│
    ↓                                               │
DIN Protocol Negotiation ───────────────────────────│
    ↓                                               │
ChargeParameterDiscovery ───────────────────────────│
    ↓                                               │
CableCheck (simulated OK) ──────────────────────────│
    ↓                                               │
PreCharge (voltage ramp) ───────────────────────────│
    ↓                                               │
🎉 CONTACTORS CLOSE! ────────────────────────────────┘
```

## Safety Warning

⚠️ **HIGH VOLTAGE**: When contactors close, the vehicle's battery voltage (300-400V DC) appears on the CCS connector pins. Ensure proper safety precautions.

## Technical Details

### SLAC States
- `IDLE` - Waiting for car connection
- `WAIT_PARAM_REQ` - CP active, waiting for SLAC initiation
- `WAIT_ATTEN_CHAR` - Exchanging attenuation data
- `WAIT_MATCH_REQ` - Waiting for network join request  
- `MATCHED` - SLAC complete, ready for V2G

### V2G States
- `IDLE` - No session
- `SESSION_SETUP` - Establishing session
- `SERVICE_DISCOVERY` - Negotiating services
- `CHARGE_PARAM` - Exchanging charge parameters
- `CABLE_CHECK` - Isolation test
- `PRECHARGE` - Voltage matching
- `POWER_DELIVERY` - Contactors closing
- `CURRENT_DEMAND` - Active charging loop

## Credits

Based on [pyPLC](https://github.com/uhi22/pyPLC) by uhi22.

## License

MIT License
