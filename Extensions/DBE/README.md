# DBE Extension - Dala The Great's Battery Emulator

Port of the Battery Emulator to Scripto Studio, providing a bidirectional CAN-to-RS485 bridge for battery management systems.

## Overview

The DBE extension bridges EV battery packs (via CAN bus) to solar inverters (via RS485), translating battery data into inverter-compatible protocols. This allows repurposed EV batteries to be used in home energy storage systems.

## Features

- **Bidirectional Communication**: Battery ⟷ ESP32 ⟷ Inverter
- **Multiple Battery Support**: Nissan LEAF, Tesla Model 3/Y, BMW i3, and more
- **Inverter Protocols**: Pylon CAN (with more planned)
- **Autonomous Operation**: Runs independently once configured
- **CAN Manager Integration**: Coexists with OVMS, OpenInverter, GVRET

## Supported Batteries

### Currently Implemented
- Nissan LEAF (ZE0, AZE0, ZE1)

### Planned
- Tesla Model 3/Y
- BMW i3
- Chevy Bolt/Ampera
- Renault Zoe
- VW MEB platform

## Supported Inverter Protocols

- **Pylon CAN**: Most common protocol (Growatt, Goodwe, Deye, etc.)

## Architecture

```
Battery (CAN) ⟷ ESP32 (DBE Extension) ⟷ Inverter (RS485/Pylon Protocol)
```

**Message Flow**:

**Battery → Inverter** (cyclic, ~1Hz):
- Total voltage, current, SOC%, SOH%
- Max charge/discharge current limits
- Cell temperature extremes
- Alarm/status bitfields

**Inverter → Battery** (as needed):
- Heartbeat/keepalive
- Enable/disable charge/discharge
- Requested power limits

## Configuration

### CAN Settings
CAN bus configuration is managed globally in Scripto Studio System panel. DBE uses existing CAN settings automatically.

### DBE Settings
- **Battery Type**: Select your battery pack model
- **RS485 Baudrate**: Match your inverter (typically 9600)
- **Inverter Protocol**: Select protocol (Pylon CAN)
- **Enable/Disable**: Toggle bridge operation

## Installation

1. Extension auto-installs device-side code via mip package
2. Configure CAN bus in System panel (if not already done)
3. Open DBE extension
4. Select battery type and inverter protocol
5. Configure RS485 settings
6. Click "Start" to begin bridging

## Usage

### Initial Setup
1. Connect battery pack to CAN bus
2. Connect inverter to RS485 port
3. Configure DBE extension settings
4. Start the bridge

### Monitoring
- **Config Panel**: Adjust settings, start/stop bridge
- **Status Panel**: View connection state, data flow
- **Metrics Panel**: Real-time battery data (voltage, SOC, temps, cells)

### Autonomous Operation
Once started, DBE runs independently. You can disconnect the PWA client and the bridge continues operating. The bridge will auto-start on boot if enabled in settings.

## Technical Details

### CAN Manager Integration
DBE uses the CAN manager from mpDirect TWAI module, allowing it to coexist with other CAN-based extensions:
- **DBE + OVMS**: Monitor battery while sending to OVMS server
- **DBE + OpenInverter**: Bridge battery + control motor controller
- **DBE + GVRET**: Bridge battery + log CAN traffic

### Device-Side Code
All Python code is in `/lib/DBE/` module:
- `DBE_helpers.py`: Main control functions
- `battery/`: Battery protocol implementations
- `inverter/`: Inverter protocol implementations

### Import Paths
```python
from lib.DBE.DBE_helpers import startDBE, stopDBE
from lib.DBE.battery.nissan_leaf import NissanLeafBattery
from lib.DBE.inverter.pylon_can import PylonCANProtocol
```

## Development

### Adding New Batteries
See `BATTERY_PORTING.md` for guide on porting additional battery types from the original Battery Emulator C++ codebase.

### Adding New Inverter Protocols
Inverter protocols are in `/lib/DBE/inverter/`. Extend `InverterBase` class and implement protocol-specific message formatting.

## Credits

Based on [Dala The Great's Battery Emulator](https://github.com/dalathegreat/Battery-Emulator) - a comprehensive ESP32 firmware for bridging EV batteries to solar inverters.

Ported to Scripto Studio MicroPython environment by JetPax.

## License

MIT License - See LICENSE file for details
