# ZombieVerter VCU

ZombieVerter is an Open Source VCU by Damien Maguire/EVBMW + community https://openinverter.org/wiki/ZombieVerter_VCU used increasingly in electric vehicle conversion projects.

The OVMS integration makes use of the OBD2 module in the ZombieVerter VCU, so all you need to do is set the OBD2Can parameter in the ZombieVerter VCU Web UI to match the CAN interface the OVMS module is on and it'll be able to make the requests for the spot params.

This early version only supports 1 way communication, but I plan to add preheating and cooling as well as charge control as I get to it.

- **Vehicle Type:** `zombie_vcu`
- **Vehicle Code:** `ZOM`
- **Maintainers:** Jamie Jones

## Support Overview

| Function | Support Status |
|----------|---------------|
| Hardware | Any OVMS v3 (or later) module. |
| Vehicle Cable | Wire to one of the 2 main ZombieVerter CAN buses |
| GSM Antenna | 1000500 Open Vehicles OVMS GSM Antenna (or any compatible antenna) |
| GPS Antenna | 1020200 Universal GPS Antenna (SMA Connector) (or any compatible antenna) |
| SOC Display | Yes |
| Range Display | No |
| Cabin Pre-heat/cool Control | No |
| GPS Location | Yes (from modem module GPS) |
| Speed Display | No |
| Temperature Display | Yes |
| BMS v+t Display | No |
| TPMS Display | No |
| Charge Status Display | Yes |
| Charge Interruption Alerts | Yes |
| Charge Control | No |
| Lock/Unlock Vehicle | No |
| Valet Mode Control | No |

## Poll States

| State | Name | Description |
|-------|------|-------------|
| 0 | Sleep | The OVMS module is only checking the opmode |
| 1 | Charging | The OVMS module sends charging specific queries |
| 2 | Driving | The OVMS module sends driving specific queries |

## Protocol

Uses OBD2 Mode 0x2A (custom OpenInverter mode) to read parameters by PID:
- **Request CAN ID:** `0x7DF` (broadcast)
- **Response CAN ID:** `0x7E8` (node 0)
- **Protocol:** ISO-TP (ISO 15765-2)

## Metrics

All ZombieVerter VCU values can be found in https://github.com/damienmaguire/Stm32-vcu/blob/master/include/param_prj.h

Use the parameter ID to add to poller with desired frequency and add it to `IncomingPollReply` to add support for new metrics.

## Development Notes

Developers welcome! Follow the developer's guide on https://www.openvehicles.com/developers to get started!

Post on openinverter for development discussion and usage.

## Community Channels

- **Forum:** https://openinverter.org/wiki/Main_Page

