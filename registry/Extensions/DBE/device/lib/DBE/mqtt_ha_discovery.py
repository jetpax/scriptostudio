"""
Home Assistant MQTT Autodiscovery Module for DBE
=================================================

Publish Home Assistant MQTT discovery messages for automatic entity creation.

Discovery Topics (following Battery Emulator pattern):
- homeassistant/sensor/{prefix}/SOC/config
- homeassistant/sensor/{prefix}/battery_voltage/config
- homeassistant/sensor/{prefix}/cell_voltage1/config
- ...
- homeassistant/button/{prefix}/PAUSE/config
- homeassistant/button/{prefix}/RESUME/config

Performance:
- Only publish discovery once on startup (or when config changes)
- Use retain=True for discovery messages
- Batch publish with small delays to avoid overwhelming broker
"""

import json
import time
from lib.DBE import mqtt_client

# Discovery published flag
_discovery_published = False


# Sensor definitions (from Battery Emulator)
SENSOR_CONFIGS = [
    # State of Charge
    {"id": "SOC", "name": "Battery SOC (Scaled)", "unit": "%", "device_class": "battery", "state_class": "measurement"},
    {"id": "SOC_real", "name": "Battery SOC (Real)", "unit": "%", "device_class": "battery", "state_class": "measurement"},
    
    # State of Health
    {"id": "state_of_health", "name": "State Of Health", "unit": "%", "device_class": "battery", "state_class": "measurement"},
    
    # Temperature
    {"id": "temperature_min", "name": "Temperature Min", "unit": "°C", "device_class": "temperature", "state_class": "measurement"},
    {"id": "temperature_max", "name": "Temperature Max", "unit": "°C", "device_class": "temperature", "state_class": "measurement"},
    
    # Current and Voltage
    {"id": "battery_current", "name": "Battery Current", "unit": "A", "device_class": "current", "state_class": "measurement"},
    {"id": "battery_voltage", "name": "Battery Voltage", "unit": "V", "device_class": "voltage", "state_class": "measurement"},
    
    # Cell Voltages
    {"id": "cell_max_voltage", "name": "Cell Max Voltage", "unit": "V", "device_class": "voltage", "state_class": "measurement"},
    {"id": "cell_min_voltage", "name": "Cell Min Voltage", "unit": "V", "device_class": "voltage", "state_class": "measurement"},
    {"id": "cell_voltage_delta", "name": "Cell Voltage Delta", "unit": "mV", "device_class": "voltage", "state_class": "measurement"},
    
    # Capacity
    {"id": "total_capacity", "name": "Battery Total Capacity", "unit": "Wh", "device_class": "energy", "state_class": "total"},
    {"id": "remaining_capacity", "name": "Battery Remaining Capacity", "unit": "Wh", "device_class": "energy", "state_class": "total"},
    
    # Power
    {"id": "max_discharge_power", "name": "Battery Max Discharge Power", "unit": "W", "device_class": "power", "state_class": "measurement"},
    {"id": "max_charge_power", "name": "Battery Max Charge Power", "unit": "W", "device_class": "power", "state_class": "measurement"},
    {"id": "stat_batt_power", "name": "Battery Power", "unit": "W", "device_class": "power", "state_class": "measurement"},
    
    # Balancing
    {"id": "balancing_active_cells", "name": "Balancing Active Cells", "unit": "", "device_class": None, "state_class": "measurement"},
    {"id": "balancing_status", "name": "Balancing Status", "unit": "", "device_class": None, "state_class": None},
    
    # Status
    {"id": "bms_status", "name": "BMS Status", "unit": "", "device_class": None, "state_class": None},
    {"id": "emulator_status", "name": "Emulator Status", "unit": "", "device_class": None, "state_class": None},
]


# Button definitions
BUTTON_CONFIGS = [
    {"id": "PAUSE", "name": "Pause Battery"},
    {"id": "RESUME", "name": "Resume Battery"},
    {"id": "RESTART", "name": "Restart Emulator"},
    {"id": "STOP", "name": "Stop Emulator"},
    {"id": "BMSRESET", "name": "Reset BMS"},
]


def publish_sensor_discovery(sensor_config, topic_prefix):
    """Publish sensor discovery message
    
    Args:
        sensor_config (dict): Sensor configuration
        topic_prefix (str): MQTT topic prefix (e.g., 'BE')
    
    Returns:
        bool: True if published successfully
    """
    try:
        # Generate discovery topic
        discovery_topic = f"homeassistant/sensor/{topic_prefix}/{sensor_config['id']}/config"
        
        # Create discovery payload
        payload = {
            "name": sensor_config['name'],
            "state_topic": f"{topic_prefix}/info",
            "unique_id": f"{topic_prefix}_{sensor_config['id']}",
            "object_id": f"{topic_prefix.lower()}_{sensor_config['id']}",
            "value_template": f"{{{{ value_json.{sensor_config['id']} }}}}",
            "device": {
                "identifiers": ["battery-emulator"],
                "manufacturer": "DalaTech",
                "model": "BatteryEmulator",
                "name": "Battery Emulator"
            },
            "availability": {
                "topic": f"{topic_prefix}/status",
                "payload_available": "online",
                "payload_not_available": "offline"
            }
        }
        
        # Add unit of measurement if specified
        if sensor_config['unit']:
            payload["unit_of_measurement"] = sensor_config['unit']
        
        # Add device class if specified
        if sensor_config['device_class']:
            payload["device_class"] = sensor_config['device_class']
        
        # Add state class if specified
        if sensor_config['state_class']:
            payload["state_class"] = sensor_config['state_class']
        
        # Convert to JSON
        payload_json = json.dumps(payload)
        
        # Publish discovery message (retain=True so HA can discover after restart)
        # Note: We need to publish to the full topic, not using mqtt_client.publish()
        # because that adds the prefix automatically
        from umqtt.simple import MQTTClient
        
        # Get MQTT client from mqtt_client module (internal access)
        if not mqtt_client._mqtt_client or not mqtt_client._mqtt_connected:
            return False
        
        mqtt_client._mqtt_client.publish(discovery_topic.encode(), payload_json.encode(), retain=True, qos=0)
        
        return True
        
    except Exception as e:
        print(f"[HA Discovery] Error publishing sensor {sensor_config['id']}: {e}")
        return False


def publish_button_discovery(button_config, topic_prefix):
    """Publish button discovery message
    
    Args:
        button_config (dict): Button configuration
        topic_prefix (str): MQTT topic prefix (e.g., 'BE')
    
    Returns:
        bool: True if published successfully
    """
    try:
        # Generate discovery topic
        discovery_topic = f"homeassistant/button/{topic_prefix}/{button_config['id']}/config"
        
        # Create discovery payload
        payload = {
            "name": button_config['name'],
            "unique_id": f"{topic_prefix.lower()}_{button_config['id']}",
            "command_topic": f"{topic_prefix}/command/{button_config['id']}",
            "device": {
                "identifiers": ["battery-emulator"],
                "manufacturer": "DalaTech",
                "model": "BatteryEmulator",
                "name": "Battery Emulator"
            },
            "availability": {
                "topic": f"{topic_prefix}/status",
                "payload_available": "online",
                "payload_not_available": "offline"
            }
        }
        
        # Convert to JSON
        payload_json = json.dumps(payload)
        
        # Publish discovery message (retain=True)
        if not mqtt_client._mqtt_client or not mqtt_client._mqtt_connected:
            return False
        
        mqtt_client._mqtt_client.publish(discovery_topic.encode(), payload_json.encode(), retain=True, qos=0)
        
        return True
        
    except Exception as e:
        print(f"[HA Discovery] Error publishing button {button_config['id']}: {e}")
        return False


def publish_cell_voltage_discovery(cell_number, topic_prefix):
    """Publish cell voltage sensor discovery message
    
    Args:
        cell_number (int): Cell number (1-based)
        topic_prefix (str): MQTT topic prefix (e.g., 'BE')
    
    Returns:
        bool: True if published successfully
    """
    try:
        # Generate discovery topic
        discovery_topic = f"homeassistant/sensor/{topic_prefix}/cell_voltage{cell_number}/config"
        
        # Create discovery payload
        payload = {
            "name": f"Battery Cell Voltage {cell_number}",
            "state_topic": f"{topic_prefix}/spec_data",
            "unique_id": f"{topic_prefix}_battery_voltage_cell{cell_number}",
            "object_id": f"{topic_prefix.lower()}_battery_voltage_cell{cell_number}",
            "value_template": f"{{{{ value_json.cell_voltages[{cell_number - 1}] }}}}",
            "unit_of_measurement": "V",
            "device_class": "voltage",
            "state_class": "measurement",
            "device": {
                "identifiers": ["battery-emulator"],
                "manufacturer": "DalaTech",
                "model": "BatteryEmulator",
                "name": "Battery Emulator"
            },
            "availability": {
                "topic": f"{topic_prefix}/status",
                "payload_available": "online",
                "payload_not_available": "offline"
            }
        }
        
        # Convert to JSON
        payload_json = json.dumps(payload)
        
        # Publish discovery message (retain=True)
        if not mqtt_client._mqtt_client or not mqtt_client._mqtt_connected:
            return False
        
        mqtt_client._mqtt_client.publish(discovery_topic.encode(), payload_json.encode(), retain=True, qos=0)
        
        return True
        
    except Exception as e:
        print(f"[HA Discovery] Error publishing cell voltage {cell_number}: {e}")
        return False


def publish_discovery(num_cells=0, publish_cell_voltages=False):
    """Publish all Home Assistant discovery messages
    
    Args:
        num_cells (int): Number of battery cells (for cell voltage sensors)
        publish_cell_voltages (bool): Whether to publish cell voltage sensors
    
    Returns:
        bool: True if all published successfully
    """
    global _discovery_published
    
    if _discovery_published:
        print("[HA Discovery] Already published, skipping")
        return True
    
    if not mqtt_client.is_connected():
        print("[HA Discovery] MQTT not connected")
        return False
    
    topic_prefix = mqtt_client.get_topic_prefix()
    
    print("[HA Discovery] Publishing discovery messages...")
    
    success = True
    
    # Publish sensor discoveries
    for sensor_config in SENSOR_CONFIGS:
        if not publish_sensor_discovery(sensor_config, topic_prefix):
            success = False
        time.sleep_ms(50)  # Small delay to avoid overwhelming broker
    
    # Publish button discoveries
    for button_config in BUTTON_CONFIGS:
        if not publish_button_discovery(button_config, topic_prefix):
            success = False
        time.sleep_ms(50)
    
    # Publish cell voltage discoveries (if enabled)
    if publish_cell_voltages and num_cells > 0:
        print(f"[HA Discovery] Publishing {num_cells} cell voltage sensors...")
        for cell_num in range(1, num_cells + 1):
            if not publish_cell_voltage_discovery(cell_num, topic_prefix):
                success = False
            time.sleep_ms(50)
    
    if success:
        _discovery_published = True
        print("[HA Discovery] All discovery messages published successfully")
    else:
        print("[HA Discovery] Some discovery messages failed to publish")
    
    return success


def clear_discovery():
    """Clear Home Assistant discovery (publish empty payloads)
    
    This removes the entities from Home Assistant.
    
    Returns:
        bool: True if cleared successfully
    """
    global _discovery_published
    
    if not mqtt_client.is_connected():
        print("[HA Discovery] MQTT not connected")
        return False
    
    topic_prefix = mqtt_client.get_topic_prefix()
    
    print("[HA Discovery] Clearing discovery messages...")
    
    success = True
    
    # Clear sensor discoveries
    for sensor_config in SENSOR_CONFIGS:
        discovery_topic = f"homeassistant/sensor/{topic_prefix}/{sensor_config['id']}/config"
        if not mqtt_client._mqtt_client.publish(discovery_topic.encode(), b"", retain=True, qos=0):
            success = False
        time.sleep_ms(50)
    
    # Clear button discoveries
    for button_config in BUTTON_CONFIGS:
        discovery_topic = f"homeassistant/button/{topic_prefix}/{button_config['id']}/config"
        if not mqtt_client._mqtt_client.publish(discovery_topic.encode(), b"", retain=True, qos=0):
            success = False
        time.sleep_ms(50)
    
    _discovery_published = False
    
    if success:
        print("[HA Discovery] Discovery cleared successfully")
    else:
        print("[HA Discovery] Some discovery messages failed to clear")
    
    return success


def reset_discovery_flag():
    """Reset discovery published flag (for re-publishing after config change)"""
    global _discovery_published
    _discovery_published = False
