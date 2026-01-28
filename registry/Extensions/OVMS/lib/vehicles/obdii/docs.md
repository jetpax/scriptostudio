# OBDII Vehicles

Generic OBDII support for vehicles that support standard OBD-II PIDs over CAN bus.

- **Vehicle Type:** `obdii`
- **Vehicle Code:** `O2`

## Support Overview

| Function | Support Status |
|----------|---------------|
| Hardware | Any OVMS v3 (or later) module. Vehicle support: Not widely tested, but should be all that support OBDII standard PIDs over CAN bus. |
| Vehicle Cable | OBD-II to DB9 Data Cable for OVMS (1441200 right, or 1139300 left) |
| GSM Antenna | 1000500 Open Vehicles OVMS GSM Antenna (or any compatible antenna) |
| GPS Antenna | 1020200 Universal GPS Antenna (SMA Connector) (or any compatible antenna) |
| SOC Display | Yes (based on fuel level PID) |
| Range Display | No |
| GPS Location | Yes (from modem module GPS) |
| Speed Display | Yes (from vehicle speed PID) |
| Temperature Display | Yes (from vehicle temperature PIDs) |
| BMS v+t Display | No |
| TPMS Display | No |
| Charge Status Display | No |
| Charge Interruption Alerts | No |
| Charge Control | No |
| Cabin Pre-heat/cool Control | No |
| Lock/Unlock Vehicle | No |
| Valet Mode Control | No |
| Others | VIN and RPMs should be available |

## Protocol

Uses standard OBD-II PIDs over CAN bus:
- **Request CAN ID:** `0x7DF` (broadcast)
- **Response CAN ID:** `0x7E8-0x7EF` (ECU responses)
- **Protocol:** ISO-TP (ISO 15765-2)

## Standard OBD-II PIDs

Common PIDs supported:
- **0x05:** Engine coolant temperature
- **0x0C:** Engine RPM
- **0x0D:** Vehicle speed
- **0x2F:** Fuel tank level
- **0x42:** Control module voltage
- **0x46:** Ambient air temperature

See https://en.wikipedia.org/wiki/OBD-II_PIDs for complete list.

