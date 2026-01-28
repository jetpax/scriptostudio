# OVMS Vehicle Modules Documentation

This directory contains documentation for each vehicle module supported by the OVMS extension.

## Structure

The OVMS extension follows the same modular structure as OVMS v3:

- **`vehicle.py`** - Base vehicle framework (analogous to `vehicle.h/vehicle.cpp` in OVMS v3)
  - Defines protocol types, common parsing functions, and vehicle discovery system
  - Provides base infrastructure for all vehicle modules

- **`vehicles/<vehicle_name>/`** - Individual vehicle modules (e.g., `vehicles/zombie_vcu/`, `vehicles/obdii/`)
  - Each vehicle has its own directory (matches OVMS v3 structure)
  - Contains `<vehicle_name>.py` with `VEHICLE_CONFIG` dict
  - Optionally defines `PARSE_FUNCTIONS` dict for custom parsing
  - Contains `docs.md` for vehicle documentation

- **`docs/`** - Global documentation
  - README.md with overall structure and guidelines

## Adding a New Vehicle

To add a new vehicle module:

1. **Create vehicle directory** (`vehicles/<vehicle_name>/`):
   - Create directory: `vehicles/<vehicle_name>/`
   - Create module file: `vehicles/<vehicle_name>/<vehicle_name>.py`
   
   ```python
   from vehicle import PROTOCOL_OBD2  # or PROTOCOL_CAN_RAW, etc.
   
   VEHICLE_CONFIG = {
       'name': 'Vehicle Display Name',
       'protocol': PROTOCOL_OBD2,
       'can_tx_id': 0x7DF,
       'can_rx_id': 0x7E8,
       'poll_type': 0x2A,
       'metrics': {
           'metric_name': {
               'pid': 0x1234,
               'unit': 'V',
               'poll_interval': 5,
               'parse_func': 'parse_16bit_high'
           }
       }
   }
   
   PARSE_FUNCTIONS = {}  # Add custom parse functions if needed
   ```

2. **Create documentation** (`<vehicle_name>/docs.md`):
   - Follow the format of existing vehicle docs
   - Include support overview table
   - Document protocol details and CAN IDs
   - List available metrics

3. **Add to package.json**:
   ```json
   ["vehicles/<vehicle_name>/<vehicle_name>.py", "github:jetpax/scripto-studio-registry/Extensions/OVMS/lib/vehicles/<vehicle_name>/<vehicle_name>.py"]
   ```

4. **The system will automatically discover and register the vehicle**

## Available Vehicles

- **ZombieVerter VCU** (`vehicles/zombie_vcu/`) - OpenInverter-based VCU using OBD2 Mode 0x2A
- **OBDII Generic** (`vehicles/obdii/`) - Generic OBD-II support for standard PIDs
- **Tesla Model 3** (`vehicles/tesla_model3/`) - Tesla Model 3 support (placeholder)

## Protocol Types

- **`PROTOCOL_OBD2`** - OBD2/UDS protocol over ISO-TP
- **`PROTOCOL_CANOPEN_SDO`** - CANopen Service Data Object protocol
- **`PROTOCOL_CAN_RAW`** - Raw CAN frame processing (for Tesla, etc.)

## Common Parse Functions

Available in `vehicle.py`:
- `parse_16bit_high` - Parse 16-bit value from bytes 2-3
- `parse_32bit` - Parse 32-bit value from bytes 4-7
- `parse_32bit_negative` - Parse 32-bit value and negate (for current)
- `parse_8bit_opmode` - Parse 8-bit operating mode
- `parse_obd2_temp` - Parse OBD2 temperature (byte - 0x28)
- `parse_24bit_millivolt` - Parse 24-bit millivolt value

Custom parse functions can be added per vehicle module.
