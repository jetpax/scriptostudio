"""
OVMS Vehicle Framework
=======================

Base framework for OVMS vehicle modules (analogous to vehicle.h/vehicle.cpp in OVMS v3).

This module provides:
- Protocol type definitions
- Common parsing functions
- Vehicle discovery and registration system

Vehicle-specific configurations should be in separate files in the vehicles/ subdirectory
(e.g., vehicles/zombie_vcu/zombie_vcu.py, vehicles/obdii/obdii.py) to match OVMS v3's modular structure.

Each vehicle module should define:
- VEHICLE_CONFIG dict with protocol, CAN IDs, metrics, etc.
- PARSE_FUNCTIONS dict with custom parsing functions (if needed)

Based on OVMS v3 vehicle framework (vehicle.h, vehicle.cpp, etc.)
"""

# Vehicle protocol types
PROTOCOL_OBD2 = 'obd2'
PROTOCOL_CANOPEN_SDO = 'canopen_sdo'
PROTOCOL_CAN_RAW = 'can_raw'
PROTOCOL_FAKE = 'fake'  # For simulated vehicles (no CAN hardware required)

# OBD2 Mode definitions
OBD2_MODE_CURRENT_DATA = 0x01
OBD2_MODE_READ_PARAM = 0x2A  # OpenInverter custom mode
OBD2_MODE_RESPONSE_PARAM = 0x6A

# Parsing functions for OBD2 responses
# OpenInverter response format: [length, mode(0x6A), pid_high, pid_low, val_byte3, val_byte2, val_byte1, val_byte0]
# The 32-bit fixed-point value is in bytes 4-7 (little-endian)
def parse_16bit_high(data):
    """Parse 16-bit value from bytes 2-3 (high bytes)"""
    if len(data) < 4:
        return 0.0
    return ((data[2] << 8) + data[3]) / 32.0

def parse_32bit(data):
    """Parse 32-bit value from bytes 4-7 (little-endian)"""
    if len(data) < 8:
        return 0.0
    val = (data[4] << 24) + (data[5] << 16) + (data[6] << 8) + data[7]
    # Convert to signed
    if val >= 0x80000000:
        val -= 0x100000000
    return val / 32.0

def parse_32bit_negative(data):
    """Parse 32-bit value and negate (for OVMS current convention)"""
    return -parse_32bit(data)

def parse_8bit_opmode(data):
    """Parse opmode from byte 3"""
    if len(data) < 4:
        return 0
    return int(data[3] / 32)

def parse_obd2_temp(data):
    """Parse OBD2 standard temperature (byte 0 - 0x28)"""
    if len(data) < 1:
        return 0.0
    return float(data[0] - 0x28)

def parse_24bit_millivolt(data):
    """Parse 24-bit millivolt value from bytes 1-3, convert to volts"""
    if len(data) < 4:
        return 0.0
    milliVolt = ((data[1] << 16) + (data[2] << 8) + data[3]) / 32
    return float(milliVolt) / 1000.0

# Vehicle definitions
# Built-in vehicles can be defined here, but it's recommended to use
# separate vehicle_*.py files for better organization (matches OVMS v3 structure)
VEHICLES = {
    # No built-in vehicles - all vehicles should be in separate files
    # This matches OVMS v3's modular structure where each vehicle is a separate component
}

# Parse function lookup
PARSE_FUNCTIONS = {
    'parse_16bit_high': parse_16bit_high,
    'parse_32bit': parse_32bit,
    'parse_32bit_negative': parse_32bit_negative,
    'parse_8bit_opmode': parse_8bit_opmode,
    'parse_obd2_temp': parse_obd2_temp,
    'parse_24bit_millivolt': parse_24bit_millivolt,
}


def get_vehicle_config(vehicle_type):
    """Get vehicle configuration by type
    
    Supports both built-in vehicles (in VEHICLES dict) and
    external vehicle modules in vehicles/ subdirectory (e.g., vehicles/zombie_vcu/zombie_vcu.py).
    """
    # First check built-in vehicles
    if vehicle_type in VEHICLES:
        return VEHICLES[vehicle_type]
    
    # Try to load external vehicle module from vehicles/ subdirectory
    try:
        import os
        
        # MicroPython doesn't have os.path, so use direct string manipulation
        vehicle_file = f'/lib/vehicles/{vehicle_type}/{vehicle_type}.py'
        
        # Check if file exists by trying to open it
        try:
            # Read and execute the vehicle file directly
            with open(vehicle_file, 'r') as f:
                vehicle_code = f.read()
            # Create a namespace for the vehicle module
            # Pass the constants directly instead of importing vehicle module
            # to avoid circular import issues
            vehicle_globals = {
                'PROTOCOL_OBD2': PROTOCOL_OBD2,
                'PROTOCOL_CANOPEN_SDO': PROTOCOL_CANOPEN_SDO,
                'PROTOCOL_CAN_RAW': PROTOCOL_CAN_RAW,
                'PROTOCOL_FAKE': PROTOCOL_FAKE,
                'OBD2_MODE_CURRENT_DATA': OBD2_MODE_CURRENT_DATA,
                'OBD2_MODE_READ_PARAM': OBD2_MODE_READ_PARAM,
                'OBD2_MODE_RESPONSE_PARAM': OBD2_MODE_RESPONSE_PARAM,
            }
            # Also add a mock vehicle module for 'from vehicle import ...' syntax
            class VehicleModule:
                PROTOCOL_OBD2 = PROTOCOL_OBD2
                PROTOCOL_CANOPEN_SDO = PROTOCOL_CANOPEN_SDO
                PROTOCOL_CAN_RAW = PROTOCOL_CAN_RAW
                PROTOCOL_FAKE = PROTOCOL_FAKE
                OBD2_MODE_CURRENT_DATA = OBD2_MODE_CURRENT_DATA
                OBD2_MODE_READ_PARAM = OBD2_MODE_READ_PARAM
                OBD2_MODE_RESPONSE_PARAM = OBD2_MODE_RESPONSE_PARAM
            vehicle_globals['vehicle'] = VehicleModule()
            exec(vehicle_code, vehicle_globals)
            config = vehicle_globals.get('VEHICLE_CONFIG', None)
            if config:
                # Merge parse functions from external module
                external_parse_funcs = vehicle_globals.get('PARSE_FUNCTIONS', {})
                PARSE_FUNCTIONS.update(external_parse_funcs)
                return config
        except OSError:
            # File doesn't exist, return None
            pass
    except Exception as e:
        # Log error but don't print to avoid noise
        # Send error via M2M_LOG (opcode 0x03) if webrepl is available
        try:
            import webrepl
            webrepl.send_m2m(f"[OVMS] Error loading vehicle config for {vehicle_type}: {e}", 0x03)
        except:
            pass  # Silent if webrepl not available
    
    return None


def list_vehicles():
    """List all available vehicle types (built-in + external modules in vehicles/ subdirectory)"""
    vehicle_list = {k: v['name'] for k, v in VEHICLES.items()}
    
    # Try to discover external vehicle modules in vehicles/ subdirectory
    try:
        import os
        import sys
        
        # MicroPython doesn't have os.path, so use direct string manipulation
        vehicles_dir = '/lib/vehicles'
        
        # Check if vehicles directory exists by trying to list it
        try:
            items = os.listdir(vehicles_dir)
            # Look for subdirectories (e.g., zombie_vcu/, obdii/)
            for item in items:
                # Build path manually (no os.path.join)
                item_path = f'{vehicles_dir}/{item}'
                
                # Check if it's a directory by trying to list it
                try:
                    os.listdir(item_path)
                    # If we can list it, it's a directory
                    if not item.startswith('_'):
                        # Build vehicle file path manually
                        vehicle_file = f'{item_path}/{item}.py'
                        
                        # Check if file exists by trying to open it
                        try:
                            with open(vehicle_file, 'r') as f:
                                vehicle_id = item
                                if vehicle_id not in vehicle_list:
                                    try:
                                        # Read and execute the vehicle file directly
                                        vehicle_code = f.read()
                                        # Create a namespace for the vehicle module
                                        # Pass the constants directly instead of importing vehicle module
                                        # to avoid circular import issues
                                        vehicle_globals = {
                                            'PROTOCOL_OBD2': PROTOCOL_OBD2,
                                            'PROTOCOL_CANOPEN_SDO': PROTOCOL_CANOPEN_SDO,
                                            'PROTOCOL_CAN_RAW': PROTOCOL_CAN_RAW,
                                            'PROTOCOL_FAKE': PROTOCOL_FAKE,
                                            'OBD2_MODE_CURRENT_DATA': OBD2_MODE_CURRENT_DATA,
                                            'OBD2_MODE_READ_PARAM': OBD2_MODE_READ_PARAM,
                                            'OBD2_MODE_RESPONSE_PARAM': OBD2_MODE_RESPONSE_PARAM,
                                        }
                                        # Also add a mock vehicle module for 'from vehicle import ...' syntax
                                        class VehicleModule:
                                            PROTOCOL_OBD2 = PROTOCOL_OBD2
                                            PROTOCOL_CANOPEN_SDO = PROTOCOL_CANOPEN_SDO
                                            PROTOCOL_CAN_RAW = PROTOCOL_CAN_RAW
                                            PROTOCOL_FAKE = PROTOCOL_FAKE
                                            OBD2_MODE_CURRENT_DATA = OBD2_MODE_CURRENT_DATA
                                            OBD2_MODE_READ_PARAM = OBD2_MODE_READ_PARAM
                                            OBD2_MODE_RESPONSE_PARAM = OBD2_MODE_RESPONSE_PARAM
                                        vehicle_globals['vehicle'] = VehicleModule()
                                        exec(vehicle_code, vehicle_globals)
                                        config = vehicle_globals.get('VEHICLE_CONFIG', None)
                                        if config:
                                            # MicroPython doesn't have .title(), so use config name or format manually
                                            vehicle_name = config.get('name')
                                            if not vehicle_name:
                                                # Simple title case: capitalize first letter of each word
                                                parts = vehicle_id.replace('_', ' ').split(' ')
                                                title_parts = []
                                                for p in parts:
                                                    if len(p) > 0:
                                                        title_parts.append(p[0].upper() + p[1:])
                                                    else:
                                                        title_parts.append(p)
                                                vehicle_name = ' '.join(title_parts)
                                            vehicle_list[vehicle_id] = vehicle_name
                                    except Exception as e:
                                        # Log error but continue with other vehicles
                                        # Send error via M2M_LOG (opcode 0x03) if webrepl is available
                                        try:
                                            import webrepl
                                            webrepl.send_m2m(f"[OVMS] Error loading vehicle {vehicle_id}: {e}", 0x03)
                                        except:
                                            pass  # Silent if webrepl not available
                        except OSError:
                            # File doesn't exist, skip
                            pass
                except OSError:
                    # Not a directory or doesn't exist, skip
                    pass
        except OSError:
            # Vehicles directory doesn't exist, return empty list
            pass
    except Exception as e:
        # Log error instead of silently failing
        # Send error via M2M_LOG (opcode 0x03) if webrepl is available
        try:
            import webrepl
            webrepl.send_m2m(f"[OVMS] Error listing vehicles: {e}", 0x03)
        except:
            pass  # Silent if webrepl not available
    
    return vehicle_list
