"""
Tesla Model 3 Vehicle Module
============================

Vehicle-specific configuration for Tesla Model 3.
Uses raw CAN frames (not OBD2) - listens to CAN bus messages directly.
"""

from vehicle import PROTOCOL_CAN_RAW

# Tesla Model 3 uses raw CAN frames, not OBD2 polling
# This is a placeholder - actual implementation would need CAN frame handlers
VEHICLE_CONFIG = {
    'name': 'Tesla Model 3',
    'protocol': PROTOCOL_CAN_RAW,
    'can_buses': [1, 2, 3],  # Model 3 uses multiple CAN buses
    'metrics': {
        # Tesla Model 3 metrics would be extracted from CAN frames
        # This is a placeholder structure
        'soc': {
            'can_id': 0x102,  # Example CAN ID
            'can_bus': 1,
            'unit': '%',
            'parse_func': 'parse_tesla_soc'
        },
        'speed': {
            'can_id': 0x2B9,  # Example CAN ID
            'can_bus': 1,
            'unit': 'km/h',
            'parse_func': 'parse_tesla_speed'
        },
        # ... more metrics
    }
}


def parse_tesla_soc(can_frame_data):
    """Parse SOC from Tesla Model 3 CAN frame"""
    # Placeholder - actual parsing would depend on CAN frame format
    if len(can_frame_data) >= 2:
        return float(can_frame_data[0] + (can_frame_data[1] << 8)) / 100.0
    return 0.0


def parse_tesla_speed(can_frame_data):
    """Parse speed from Tesla Model 3 CAN frame"""
    # Placeholder - actual parsing would depend on CAN frame format
    if len(can_frame_data) >= 2:
        return float(can_frame_data[0] + (can_frame_data[1] << 8)) / 100.0
    return 0.0


# Register parse functions (would be imported by vehicle.py)
PARSE_FUNCTIONS = {
    'parse_tesla_soc': parse_tesla_soc,
    'parse_tesla_speed': parse_tesla_speed,
}
