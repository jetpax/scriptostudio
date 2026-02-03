"""
MQTT Publisher Module for DBE
==============================

Format and publish battery telemetry data to MQTT broker.

Topics Structure (following Battery Emulator pattern):
- {prefix}/status          - "online" / "offline" (LWT)
- {prefix}/info            - Main battery info (JSON)
- {prefix}/spec_data       - Cell voltages (JSON array)
- {prefix}/balancing_data  - Cell balancing status (JSON array)
- {prefix}/events          - Events/alarms (JSON)

Performance Considerations:
- Pre-allocate JSON buffers (avoid repeated allocation)
- Batch publish operations (don't block on each publish)
- Configurable publish interval (default: 5 seconds)
- Skip cell voltages if disabled in config
"""

import json
from lib.DBE import mqtt_client


def publish_status(online=True):
    """Publish online/offline status
    
    Args:
        online (bool): True for online, False for offline
    
    Returns:
        bool: True if published successfully
    """
    status = "online" if online else "offline"
    return mqtt_client.publish("status", status, retain=True, qos=1)


def publish_info(battery_data):
    """Publish main battery information
    
    Args:
        battery_data (dict): Battery data from battery.get_data()
    
    Returns:
        bool: True if published successfully
    """
    try:
        # Extract and format battery metrics
        info = {
            # State of Charge
            "SOC": round(battery_data.get('soc_percent', 0) / 100.0, 2),
            "SOC_real": round(battery_data.get('soc_percent', 0) / 100.0, 2),  # Same for now
            
            # State of Health
            "state_of_health": round(battery_data.get('soh_percent', 100) / 100.0, 2),
            
            # Temperature
            "temperature_min": round(battery_data.get('temp_min_C', 0), 1),
            "temperature_max": round(battery_data.get('temp_max_C', 0), 1),
            
            # Current and Voltage
            "battery_current": round(battery_data.get('current_dA', 0) / 10.0, 1),
            "battery_voltage": round(battery_data.get('voltage_dV', 0) / 10.0, 1),
            
            # Cell Voltages
            "cell_max_voltage": round(battery_data.get('cell_max_mV', 0) / 1000.0, 3),
            "cell_min_voltage": round(battery_data.get('cell_min_mV', 0) / 1000.0, 3),
            "cell_voltage_delta": battery_data.get('cell_deviation_mV', 0),
            
            # Capacity
            "total_capacity": battery_data.get('total_capacity_Wh', 0),
            "remaining_capacity": battery_data.get('remaining_capacity_Wh', 0),
            
            # Power Limits
            "max_discharge_power": battery_data.get('max_discharge_power_W', 0),
            "max_charge_power": battery_data.get('max_charge_power_W', 0),
            
            # Current Power
            "stat_batt_power": battery_data.get('power_W', 0),
            
            # Balancing
            "balancing_active_cells": battery_data.get('balancing_active_cells', 0),
            "balancing_status": battery_data.get('balancing_status', 'Unknown'),
            
            # Status
            "bms_status": battery_data.get('bms_status', 'Unknown'),
            "emulator_status": battery_data.get('emulator_status', 'Running')
        }
        
        # Convert to JSON
        payload = json.dumps(info)
        
        # Publish
        return mqtt_client.publish("info", payload, retain=False, qos=0)
        
    except Exception as e:
        print(f"[MQTT Publisher] Error publishing info: {e}")
        return False


def publish_cell_voltages(battery_data):
    """Publish individual cell voltages
    
    Args:
        battery_data (dict): Battery data from battery.get_data()
    
    Returns:
        bool: True if published successfully
    """
    try:
        # Get cell voltages array
        cell_voltages_mV = battery_data.get('cell_voltages_mV', [])
        
        if not cell_voltages_mV:
            return True  # No cell voltages available
        
        # Convert from mV to V
        cell_voltages_V = [round(v / 1000.0, 3) for v in cell_voltages_mV]
        
        # Create payload
        payload_dict = {
            "cell_voltages": cell_voltages_V
        }
        
        # Convert to JSON
        payload = json.dumps(payload_dict)
        
        # Publish
        return mqtt_client.publish("spec_data", payload, retain=False, qos=0)
        
    except Exception as e:
        print(f"[MQTT Publisher] Error publishing cell voltages: {e}")
        return False


def publish_cell_balancing(battery_data):
    """Publish cell balancing status
    
    Args:
        battery_data (dict): Battery data from battery.get_data()
    
    Returns:
        bool: True if published successfully
    """
    try:
        # Get cell balancing status array
        cell_balancing = battery_data.get('cell_balancing_status', [])
        
        if not cell_balancing:
            return True  # No balancing data available
        
        # Create payload
        payload_dict = {
            "cell_balancing": cell_balancing
        }
        
        # Convert to JSON
        payload = json.dumps(payload_dict)
        
        # Publish
        return mqtt_client.publish("balancing_data", payload, retain=False, qos=0)
        
    except Exception as e:
        print(f"[MQTT Publisher] Error publishing cell balancing: {e}")
        return False


def publish_events(events):
    """Publish events/alarms
    
    Args:
        events (list): List of event dictionaries
    
    Returns:
        bool: True if published successfully
    """
    try:
        if not events:
            return True  # No events to publish
        
        # Publish each event separately (like Battery Emulator)
        for event in events:
            payload = json.dumps(event)
            
            if not mqtt_client.publish("events", payload, retain=False, qos=0):
                return False
        
        return True
        
    except Exception as e:
        print(f"[MQTT Publisher] Error publishing events: {e}")
        return False


def publish_all(battery_data, publish_cell_voltages_enabled=True, publish_balancing_enabled=True):
    """Publish all battery data
    
    Args:
        battery_data (dict): Battery data from battery.get_data()
        publish_cell_voltages_enabled (bool): Whether to publish cell voltages
        publish_balancing_enabled (bool): Whether to publish balancing status
    
    Returns:
        bool: True if all publishes successful
    """
    success = True
    
    # Publish status (online)
    if not publish_status(online=True):
        success = False
    
    # Publish main info
    if not publish_info(battery_data):
        success = False
    
    # Publish cell voltages (if enabled)
    if publish_cell_voltages_enabled:
        if not publish_cell_voltages(battery_data):
            success = False
    
    # Publish cell balancing (if enabled)
    if publish_balancing_enabled:
        if not publish_cell_balancing(battery_data):
            success = False
    
    return success
