"""
MQTT Commands Module for DBE
=============================

Handle incoming MQTT commands for remote control.

Command Topics (following Battery Emulator pattern):
- {prefix}/command/PAUSE       - Pause charge/discharge
- {prefix}/command/RESUME      - Resume operation
- {prefix}/command/RESTART     - Restart DBE bridge
- {prefix}/command/STOP        - Stop DBE bridge
- {prefix}/command/BMSRESET    - Reset BMS (if supported)
- {prefix}/command/SET_LIMITS  - Set temporary limits (JSON payload)

Integration with DBE_helpers.py:
- Commands call existing helper functions (startDBE(), stopDBE())
- Add new pause/resume state management
- Temporary limits stored in battery data structure
"""

import json
from lib.DBE import mqtt_client

# Global reference to DBE control functions (set by DBE_helpers.py)
_dbe_control = None


def set_dbe_control(control_functions):
    """Set DBE control functions reference
    
    Args:
        control_functions (dict): Dictionary of control functions
            - 'pause': pauseDBE()
            - 'resume': resumeDBE()
            - 'restart': restartDBE()
            - 'stop': stopDBE()
            - 'bms_reset': bmsResetDBE()
            - 'set_limits': setLimitsDBE(limits)
    """
    global _dbe_control
    _dbe_control = control_functions


def handle_command(topic, msg):
    """Main command dispatcher (called by MQTT client callback)
    
    Args:
        topic (bytes): Full MQTT topic (e.g., b'BE/command/PAUSE')
        msg (bytes): Message payload
    """
    global _dbe_control
    
    # Increment commands received counter
    mqtt_client.increment_commands_received()
    
    # Decode topic
    topic_str = topic.decode() if isinstance(topic, bytes) else topic
    msg_str = msg.decode() if isinstance(msg, bytes) else msg
    
    # Extract command from topic (last part after /)
    command = topic_str.split('/')[-1].upper()
    
    print(f"[MQTT Commands] Received command: {command}")
    
    if _dbe_control is None:
        print("[MQTT Commands] Error: DBE control functions not set")
        return
    
    # Dispatch command
    try:
        if command == 'PAUSE':
            cmd_pause()
        elif command == 'RESUME':
            cmd_resume()
        elif command == 'RESTART':
            cmd_restart()
        elif command == 'STOP':
            cmd_stop()
        elif command == 'BMSRESET':
            cmd_bms_reset()
        elif command == 'SET_LIMITS':
            cmd_set_limits(msg_str)
        else:
            print(f"[MQTT Commands] Unknown command: {command}")
    except Exception as e:
        print(f"[MQTT Commands] Error executing command {command}: {e}")


def cmd_pause():
    """Pause battery operation (stop CAN TX, keep monitoring)"""
    global _dbe_control
    
    if _dbe_control and 'pause' in _dbe_control:
        print("[MQTT Commands] Executing PAUSE")
        _dbe_control['pause']()
    else:
        print("[MQTT Commands] PAUSE not available")


def cmd_resume():
    """Resume battery operation"""
    global _dbe_control
    
    if _dbe_control and 'resume' in _dbe_control:
        print("[MQTT Commands] Executing RESUME")
        _dbe_control['resume']()
    else:
        print("[MQTT Commands] RESUME not available")


def cmd_restart():
    """Restart DBE bridge"""
    global _dbe_control
    
    if _dbe_control and 'restart' in _dbe_control:
        print("[MQTT Commands] Executing RESTART")
        _dbe_control['restart']()
    else:
        print("[MQTT Commands] RESTART not available")


def cmd_stop():
    """Stop DBE bridge"""
    global _dbe_control
    
    if _dbe_control and 'stop' in _dbe_control:
        print("[MQTT Commands] Executing STOP")
        _dbe_control['stop']()
    else:
        print("[MQTT Commands] STOP not available")


def cmd_bms_reset():
    """Reset BMS (if supported by battery protocol)"""
    global _dbe_control
    
    if _dbe_control and 'bms_reset' in _dbe_control:
        print("[MQTT Commands] Executing BMSRESET")
        _dbe_control['bms_reset']()
    else:
        print("[MQTT Commands] BMSRESET not available")


def cmd_set_limits(payload_str):
    """Set temporary charge/discharge limits
    
    Payload format (JSON):
    {
        "max_charge": 50,      // Max charge current (A)
        "max_discharge": 100,  // Max discharge current (A)
        "timeout": 30          // Timeout (seconds)
    }
    
    Args:
        payload_str (str): JSON payload
    """
    global _dbe_control
    
    if not _dbe_control or 'set_limits' not in _dbe_control:
        print("[MQTT Commands] SET_LIMITS not available")
        return
    
    try:
        # Parse JSON payload
        limits = json.loads(payload_str)
        
        # Validate limits
        max_charge = limits.get('max_charge')
        max_discharge = limits.get('max_discharge')
        timeout = limits.get('timeout', 30)
        
        if max_charge is None and max_discharge is None:
            print("[MQTT Commands] SET_LIMITS: No limits specified")
            return
        
        print(f"[MQTT Commands] Executing SET_LIMITS: charge={max_charge}A, discharge={max_discharge}A, timeout={timeout}s")
        
        # Call control function
        _dbe_control['set_limits'](limits)
        
    except json.JSONDecodeError as e:
        print(f"[MQTT Commands] SET_LIMITS: Invalid JSON: {e}")
    except Exception as e:
        print(f"[MQTT Commands] SET_LIMITS error: {e}")


def subscribe_to_commands():
    """Subscribe to all command topics
    
    Returns:
        bool: True if subscribed successfully
    """
    # Subscribe to all commands using wildcard
    return mqtt_client.subscribe("command/+", handle_command)
