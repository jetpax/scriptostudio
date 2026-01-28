"""
Generic OBDII Vehicle Module
=============================

Vehicle-specific configuration for generic OBDII vehicles.
Uses standard OBD-II PIDs over CAN bus.

Based on OVMS v3 vehicle_obdii module.
"""

from vehicle import PROTOCOL_OBD2

# Generic OBDII configuration
VEHICLE_CONFIG = {
    'name': 'OBDII Generic',
    'protocol': PROTOCOL_OBD2,
    'can_tx_id': 0x7DF,  # Broadcast
    'can_rx_id': 0x7E8,  # Response (typically 0x7E8-0x7EF)
    'node_id': 0,
    'poll_type': 0x01,  # OBD2 Mode 0x01 (current data)
    'metrics': {
        # Standard OBD-II PIDs
        'coolant_temp': {
            'pid': 0x05,  # Engine coolant temperature
            'unit': 'C',
            'poll_interval': 5,
            'parse_func': 'parse_obd2_temp'
        },
        'rpm': {
            'pid': 0x0C,  # Engine RPM
            'unit': 'rpm',
            'poll_interval': 1,
            'parse_func': 'parse_obd2_rpm'
        },
        'speed': {
            'pid': 0x0D,  # Vehicle speed
            'unit': 'km/h',
            'poll_interval': 1,
            'parse_func': 'parse_obd2_speed'
        },
        'fuel_level': {
            'pid': 0x2F,  # Fuel tank level
            'unit': '%',
            'poll_interval': 5,
            'parse_func': 'parse_obd2_percent'
        },
        'voltage': {
            'pid': 0x42,  # Control module voltage
            'unit': 'V',
            'poll_interval': 5,
            'parse_func': 'parse_obd2_voltage'
        },
        'ambient_temp': {
            'pid': 0x46,  # Ambient air temperature
            'unit': 'C',
            'poll_interval': 10,
            'parse_func': 'parse_obd2_temp'
        },
    }
}

# Custom parse functions for standard OBD-II PIDs
def parse_obd2_rpm(data):
    """Parse OBD2 RPM: (A * 256 + B) / 4"""
    if len(data) < 3:
        return 0.0
    return float((data[1] * 256 + data[2]) / 4.0)

def parse_obd2_speed(data):
    """Parse OBD2 speed: A (km/h)"""
    if len(data) < 2:
        return 0.0
    return float(data[1])

def parse_obd2_percent(data):
    """Parse OBD2 percentage: A * 100 / 255"""
    if len(data) < 2:
        return 0.0
    return float(data[1] * 100 / 255.0)

def parse_obd2_voltage(data):
    """Parse OBD2 voltage: (A * 256 + B) / 1000"""
    if len(data) < 3:
        return 0.0
    return float((data[1] * 256 + data[2]) / 1000.0)

PARSE_FUNCTIONS = {
    'parse_obd2_rpm': parse_obd2_rpm,
    'parse_obd2_speed': parse_obd2_speed,
    'parse_obd2_percent': parse_obd2_percent,
    'parse_obd2_voltage': parse_obd2_voltage,
}

