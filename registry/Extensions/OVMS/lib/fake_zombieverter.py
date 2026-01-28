"""
Fake ZombieVerter VCU Simulator
================================

Simulates a ZombieVerter VCU for testing OVMS and OpenInverter extensions
without requiring actual TWAI/CAN hardware.

This provides realistic ZombieVerter metrics that vary over time to simulate
driving, charging, and temperature changes.
"""

import time
import math

# Simulated state
_sim_state = {
    'started': False,
    'start_time': 0,
    'driving': False,
    'charging': False,
    'soc': 75.0,  # Battery State of Charge %
    'speed_rpm': 0,
    'speed_kph': 0,
    'throttle': 0,
    'voltage': 385.0,  # Nominal pack voltage
    'current': 0.0,
    'temp_motor': 25.0,
    'temp_inverter': 28.0,
    'temp_battery': 22.0,
    'power_kw': 0.0,
    'torque': 0,
    'kwh_used': 15.5,
    'ah_used': 42.0,
}


def _update_simulation():
    """Update simulated metrics based on elapsed time"""
    global _sim_state
    
    if not _sim_state['started']:
        _sim_state['started'] = True
        _sim_state['start_time'] = time.time()
    
    elapsed = time.time() - _sim_state['start_time']
    
    # Simulate varying driving patterns using sine waves
    # Speed varies between 0-4000 RPM with a 30-second cycle
    base_rpm = (math.sin(elapsed / 30) + 1) * 2000  # 0-4000 RPM
    
    # Add some throttle variation
    throttle_factor = (math.sin(elapsed / 10) + 1) / 2  # 0-1
    _sim_state['throttle'] = int(throttle_factor * 100)
    
    # Speed follows throttle
    _sim_state['speed_rpm'] = int(base_rpm * throttle_factor)
    _sim_state['speed_kph'] = int(_sim_state['speed_rpm'] / 100 * 3.6)  # Rough conversion
    
    # Power and current based on speed and throttle
    if _sim_state['speed_rpm'] > 100:
        _sim_state['driving'] = True
        _sim_state['charging'] = False
        # Power varies from 0-50kW
        _sim_state['power_kw'] = (throttle_factor * 50) * (1 + math.sin(elapsed / 15) * 0.2)
        _sim_state['current'] = _sim_state['power_kw'] * 1000 / _sim_state['voltage']
        _sim_state['torque'] = int(throttle_factor * 200)  # 0-200 Nm
        
        # Discharge battery slowly
        _sim_state['soc'] -= 0.001
        if _sim_state['soc'] < 10:
            _sim_state['soc'] = 75  # Reset to simulate "recharge"
        
        # Heat up components
        _sim_state['temp_motor'] = min(25 + _sim_state['power_kw'], 70)
        _sim_state['temp_inverter'] = min(28 + _sim_state['power_kw'] * 0.8, 65)
        _sim_state['temp_battery'] = min(22 + _sim_state['power_kw'] * 0.3, 40)
    else:
        _sim_state['driving'] = False
        _sim_state['power_kw'] = 0
        _sim_state['current'] = 0
        _sim_state['torque'] = 0
        
        # Cool down
        _sim_state['temp_motor'] = max(_sim_state['temp_motor'] - 0.1, 25)
        _sim_state['temp_inverter'] = max(_sim_state['temp_inverter'] - 0.1, 28)
        _sim_state['temp_battery'] = max(_sim_state['temp_battery'] - 0.05, 22)
    
    # Voltage sag under load
    voltage_sag = _sim_state['current'] * 0.05  # Simulate internal resistance
    _sim_state['voltage'] = 385.0 - voltage_sag + (math.sin(elapsed / 60) * 5)
    
    # Track energy consumption
    _sim_state['kwh_used'] += _sim_state['power_kw'] / 3600 / 10  # Rough approximation
    _sim_state['ah_used'] = _sim_state['kwh_used'] / _sim_state['voltage'] * 1000


def get_zombie_spot_values():
    """Get simulated ZombieVerter spot values (parameters)
    
    Returns dict matching ZombieVerter param_prj.h VALUE_ENTRY format
    """
    _update_simulation()
    
    # Map to ZombieVerter parameter IDs from param_prj.h
    return {
        # Core metrics
        'udc': {'value': _sim_state['voltage'], 'unit': 'V', 'id': 2006},
        'idc': {'value': _sim_state['current'], 'unit': 'A', 'id': 2012},
        'power': {'value': _sim_state['power_kw'], 'unit': 'kW', 'id': 2011},
        'SOC': {'value': _sim_state['soc'], 'unit': '%', 'id': 2015},
        'KWh': {'value': _sim_state['kwh_used'], 'unit': 'kwh', 'id': 2013},
        'AMPh': {'value': _sim_state['ah_used'], 'unit': 'Ah', 'id': 2014},
        
        # Speed and motion
        'speed': {'value': _sim_state['speed_rpm'], 'unit': 'rpm', 'id': 2016},
        'Veh_Speed': {'value': _sim_state['speed_kph'], 'unit': 'kph', 'id': 2017},
        'torque': {'value': _sim_state['torque'], 'unit': 'dig', 'id': 2018},
        'potnom': {'value': _sim_state['throttle'], 'unit': '%', 'id': 2023},
        
        # Temperatures
        'tmphs': {'value': _sim_state['temp_inverter'], 'unit': '°C', 'id': 2028},
        'tmpm': {'value': _sim_state['temp_motor'], 'unit': '°C', 'id': 2029},
        'tmpaux': {'value': _sim_state['temp_battery'], 'unit': '°C', 'id': 2030},
        
        # Status indicators
        'opmode': {
            'value': 1 if _sim_state['driving'] else 0,  # 0=Off, 1=Run, 4=Charge
            'unit': 'OPMODES',
            'id': 2002
        },
        'dir': {
            'value': 1 if _sim_state['driving'] else 0,  # -1=Reverse, 0=Neutral, 1=Drive
            'unit': 'DIRS',
            'id': 2024
        },
        
        # Auxiliary
        'uaux': {'value': 13.8, 'unit': 'V', 'id': 2031},  # 12V system
        'U12V': {'value': 13.8, 'unit': 'V', 'id': 2070},
        'cpuload': {'value': 15, 'unit': '%', 'id': 2063},
    }


def get_zombie_parameters():
    """Get simulated ZombieVerter parameters (configuration values)
    
    Returns dict of configuration parameters from param_prj.h PARAM_ENTRY
    """
    return {
        # Setup
        'Vehicle': {'value': 0, 'unit': 'VEHMODES', 'id': 6},  # 0=BMW_E46
        'Inverter': {'value': 4, 'unit': 'INVMODES', 'id': 5},  # 4=OpenI
        
        # Throttle limits
        'udcmin': {'value': 450, 'unit': 'V', 'id': 19},
        'udclim': {'value': 520, 'unit': 'V', 'id': 20},
        'idcmax': {'value': 200, 'unit': 'A', 'id': 21},
        'throtmax': {'value': 100, 'unit': '%', 'id': 25},
        'revlim': {'value': 6000, 'unit': 'rpm', 'id': 15},
        
        # Temperature limits
        'tmphsmax': {'value': 85, 'unit': '°C', 'id': 23},
        'tmpmmax': {'value': 150, 'unit': '°C', 'id': 24},
        
        # Charger
        'BattCap': {'value': 22, 'unit': 'kWh', 'id': 38},
        'Voltspnt': {'value': 395, 'unit': 'V', 'id': 40},
    }

