"""
MQTT Client Module for DBE
===========================

Core MQTT connection management using umqtt.simple.

Features:
- Connect/disconnect to MQTT broker
- Load configuration from settings module
- Handle connection errors and reconnection
- Last Will and Testament (LWT) for online/offline status
- Non-blocking message checking

MicroPython Compatibility:
- Uses umqtt.simple (not umqtt.robust)
- Manual reconnection logic
- No blocking operations
- Exception handling for network errors
"""

import time
from lib import settings

# Global MQTT client instance
_mqtt_client = None
_mqtt_connected = False
_mqtt_config = {}
_mqtt_stats = {
    'messages_published': 0,
    'commands_received': 0,
    'last_publish_ms': 0,
    'last_connect_attempt_ms': 0,
    'connection_errors': 0
}


def init_mqtt():
    """Initialize MQTT client with configuration from settings
    
    Returns:
        bool: True if initialization successful, False otherwise
    """
    global _mqtt_client, _mqtt_config
    
    try:
        # Import umqtt.simple (may not be installed yet)
        from umqtt.simple import MQTTClient
    except ImportError:
        print("[MQTT] umqtt.simple not installed - run: import mip; mip.install('umqtt.simple')")
        return False
    
    # Load configuration from settings
    _mqtt_config = {
        'server': settings.get('mqtt.server', ''),
        'port': settings.get('mqtt.port', 1883),
        'username': settings.get('mqtt.username', ''),
        'password': settings.get('mqtt.password', ''),
        'client_id': settings.get('mqtt.client_id', 'dbe_client'),
        'topic_prefix': settings.get('mqtt.topic_prefix', 'BE'),
        'keepalive': settings.get('mqtt.keepalive', 60)
    }
    
    # Validate configuration
    if not _mqtt_config['server']:
        print("[MQTT] No MQTT server configured")
        return False
    
    # Create MQTT client
    try:
        # Prepare LWT (Last Will and Testament) for online/offline status
        lwt_topic = f"{_mqtt_config['topic_prefix']}/status"
        
        _mqtt_client = MQTTClient(
            client_id=_mqtt_config['client_id'],
            server=_mqtt_config['server'],
            port=_mqtt_config['port'],
            user=_mqtt_config['username'] if _mqtt_config['username'] else None,
            password=_mqtt_config['password'] if _mqtt_config['password'] else None,
            keepalive=_mqtt_config['keepalive']
        )
        
        # Set LWT (sent by broker when client disconnects unexpectedly)
        _mqtt_client.set_last_will(lwt_topic.encode(), b"offline", retain=True, qos=1)
        
        print(f"[MQTT] Client initialized: {_mqtt_config['server']}:{_mqtt_config['port']}")
        return True
        
    except Exception as e:
        print(f"[MQTT] Initialization error: {e}")
        _mqtt_client = None
        return False


def connect():
    """Connect to MQTT broker
    
    Returns:
        bool: True if connected, False otherwise
    """
    global _mqtt_client, _mqtt_connected, _mqtt_stats
    
    if _mqtt_client is None:
        if not init_mqtt():
            return False
    
    if _mqtt_connected:
        return True
    
    try:
        _mqtt_stats['last_connect_attempt_ms'] = time.ticks_ms()
        
        print(f"[MQTT] Connecting to {_mqtt_config['server']}:{_mqtt_config['port']}...")
        _mqtt_client.connect()
        
        # Publish online status (overrides LWT)
        status_topic = f"{_mqtt_config['topic_prefix']}/status"
        _mqtt_client.publish(status_topic.encode(), b"online", retain=True, qos=1)
        
        _mqtt_connected = True
        _mqtt_stats['connection_errors'] = 0
        print("[MQTT] Connected successfully")
        return True
        
    except OSError as e:
        _mqtt_connected = False
        _mqtt_stats['connection_errors'] += 1
        print(f"[MQTT] Connection failed: {e}")
        return False
    except Exception as e:
        _mqtt_connected = False
        _mqtt_stats['connection_errors'] += 1
        print(f"[MQTT] Unexpected error: {e}")
        return False


def disconnect():
    """Disconnect from MQTT broker"""
    global _mqtt_client, _mqtt_connected
    
    if _mqtt_client is None or not _mqtt_connected:
        return
    
    try:
        # Publish offline status before disconnecting
        status_topic = f"{_mqtt_config['topic_prefix']}/status"
        _mqtt_client.publish(status_topic.encode(), b"offline", retain=True, qos=1)
        
        _mqtt_client.disconnect()
        _mqtt_connected = False
        print("[MQTT] Disconnected")
        
    except Exception as e:
        print(f"[MQTT] Disconnect error: {e}")
        _mqtt_connected = False


def publish(topic, payload, retain=False, qos=0):
    """Publish message to MQTT broker
    
    Args:
        topic (str): Topic to publish to (without prefix)
        payload (bytes or str): Message payload
        retain (bool): Retain message on broker
        qos (int): Quality of Service (0 or 1)
    
    Returns:
        bool: True if published successfully, False otherwise
    """
    global _mqtt_client, _mqtt_connected, _mqtt_stats
    
    if _mqtt_client is None or not _mqtt_connected:
        return False
    
    try:
        # Add topic prefix
        full_topic = f"{_mqtt_config['topic_prefix']}/{topic}"
        
        # Convert payload to bytes if needed
        if isinstance(payload, str):
            payload = payload.encode()
        
        _mqtt_client.publish(full_topic.encode(), payload, retain=retain, qos=qos)
        
        _mqtt_stats['messages_published'] += 1
        _mqtt_stats['last_publish_ms'] = time.ticks_ms()
        return True
        
    except OSError as e:
        # Network error - connection lost
        print(f"[MQTT] Publish failed (network error): {e}")
        _mqtt_connected = False
        return False
    except Exception as e:
        print(f"[MQTT] Publish failed (unexpected error): {e}")
        return False


def subscribe(topic, callback):
    """Subscribe to MQTT topic
    
    Args:
        topic (str): Topic to subscribe to (without prefix, supports wildcards)
        callback (function): Callback function(topic, msg)
    
    Returns:
        bool: True if subscribed successfully, False otherwise
    """
    global _mqtt_client, _mqtt_connected
    
    if _mqtt_client is None or not _mqtt_connected:
        return False
    
    try:
        # Add topic prefix
        full_topic = f"{_mqtt_config['topic_prefix']}/{topic}"
        
        # Set callback
        _mqtt_client.set_callback(callback)
        
        # Subscribe
        _mqtt_client.subscribe(full_topic.encode())
        
        print(f"[MQTT] Subscribed to: {full_topic}")
        return True
        
    except OSError as e:
        print(f"[MQTT] Subscribe failed (network error): {e}")
        _mqtt_connected = False
        return False
    except Exception as e:
        print(f"[MQTT] Subscribe failed (unexpected error): {e}")
        return False


def check_msg():
    """Check for incoming MQTT messages (non-blocking)
    
    Returns:
        bool: True if check successful, False if connection lost
    """
    global _mqtt_client, _mqtt_connected
    
    if _mqtt_client is None or not _mqtt_connected:
        return False
    
    try:
        _mqtt_client.check_msg()
        return True
    except OSError as e:
        # Network error - connection lost
        print(f"[MQTT] check_msg failed (network error): {e}")
        _mqtt_connected = False
        return False
    except Exception as e:
        print(f"[MQTT] check_msg failed (unexpected error): {e}")
        return False


def is_connected():
    """Check if MQTT client is connected
    
    Returns:
        bool: True if connected, False otherwise
    """
    return _mqtt_connected


def get_stats():
    """Get MQTT statistics
    
    Returns:
        dict: Statistics dictionary
    """
    return {
        'connected': _mqtt_connected,
        'messages_published': _mqtt_stats['messages_published'],
        'commands_received': _mqtt_stats['commands_received'],
        'last_publish_ms': _mqtt_stats['last_publish_ms'],
        'connection_errors': _mqtt_stats['connection_errors'],
        'server': _mqtt_config.get('server', ''),
        'port': _mqtt_config.get('port', 1883),
        'topic_prefix': _mqtt_config.get('topic_prefix', 'BE')
    }


def increment_commands_received():
    """Increment commands received counter (called by mqtt_commands module)"""
    global _mqtt_stats
    _mqtt_stats['commands_received'] += 1


def get_topic_prefix():
    """Get configured topic prefix
    
    Returns:
        str: Topic prefix (e.g., 'BE')
    """
    return _mqtt_config.get('topic_prefix', 'BE')
