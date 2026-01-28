"""
ZombieVerter VCU Vehicle Module
================================

Vehicle-specific configuration for ZombieVerter VCU.
Uses OBD2 Mode 0x2A protocol to read OpenInverter parameters.

Based on OVMS v3 vehicle_zombie_vcu module.
"""

from vehicle import PROTOCOL_OBD2

# ZombieVerter VCU configuration
VEHICLE_CONFIG = {
    'name': 'ZombieVerter VCU',
    'protocol': PROTOCOL_OBD2,
    'can_tx_id': 0x7DF,  # Broadcast
    'can_rx_id': 0x7E8,  # Response (node 0)
    'node_id': 0,
    'poll_type': 0x2A,  # OBD2 Mode 0x2A (OpenInverter custom)
    'metrics': {
        'soc': {
            'pid': 0x07DF,
            'unit': '%',
            'poll_interval': 15,
            'parse_func': 'parse_16bit_high'
        },
        'udc': {
            'pid': 0x07D6,
            'unit': 'V',
            'poll_interval': 30,
            'parse_func': 'parse_16bit_high'
        },
        'idc': {
            'pid': 0x07DC,
            'unit': 'A',
            'poll_interval': 1,
            'parse_func': 'parse_32bit_negative'  # Negative for OVMS convention
        },
        'opmode': {
            'pid': 0x07D2,
            'unit': '',
            'poll_interval': 1,
            'parse_func': 'parse_8bit_opmode'
        },
        'tmpi': {
            'pid': 0x07EC,
            'unit': 'C',
            'poll_interval': 5,
            'parse_func': 'parse_16bit_high'
        },
        'tmpm': {
            'pid': 0x05,  # OBD2 standard PID
            'unit': 'C',
            'poll_interval': 5,
            'parse_func': 'parse_obd2_temp'
        },
        'tmax': {
            'pid': 0x0827,
            'unit': 'C',
            'poll_interval': 30,
            'parse_func': 'parse_16bit_high'
        },
        'tmin': {
            'pid': 0x0826,
            'unit': 'C',
            'poll_interval': 30,
            'parse_func': 'parse_16bit_high'
        },
        'vmin': {
            'pid': 0x0824,
            'unit': 'V',
            'poll_interval': 30,
            'parse_func': 'parse_24bit_millivolt'
        },
        'vmax': {
            'pid': 0x0825,
            'unit': 'V',
            'poll_interval': 30,
            'parse_func': 'parse_24bit_millivolt'
        },
        'tmpc': {
            'pid': 0x81E,
            'unit': 'C',
            'poll_interval': 30,
            'parse_func': 'parse_16bit_high'
        },
        'acv': {
            'pid': 0x81F,
            'unit': 'V',
            'poll_interval': 30,
            'parse_func': 'parse_32bit'
        },
        'aca': {
            'pid': 0x829,
            'unit': 'A',
            'poll_interval': 10,
            'parse_func': 'parse_32bit'
        },
    }
}

# No custom parse functions needed - uses standard ones from vehicle.py
PARSE_FUNCTIONS = {}
