"""
DBE Helper Functions
====================

Main control functions for DBE (Dala The Great's Battery Emulator) extension.

Client-callable functions:
- getDBEConfig()          - Get current configuration
- setDBEConfig(config)    - Set configuration
- startDBE()              - Start CAN-to-RS485 bridge
- stopDBE()               - Stop bridge
- getDBEStatus()          - Get connection status
- getDBEMetrics()         - Get current battery metrics
- getMqttConfig()         - Get MQTT configuration
- setMqttConfig(config)   - Set MQTT configuration
- getMqttStatus()         - Get MQTT connection status
- testMqtt()              - Test MQTT connection
"""

import json
import time
import CAN
from lib.sys import settings

# Global state
_dbe_running = False
_dbe_paused = False
_dbe_can_handle = None
_dbe_battery = None
_dbe_inverter = None
_dbe_loop_task = None
_dbe_status = {
    'state': 'stopped',
    'running': False,
    'paused': False,
    'error': '',
    'battery_type': '',
    'inverter_protocol': '',
    'frames_rx': 0,
    'frames_tx': 0,
    'last_update_ms': 0
}

# MQTT state
_mqtt_enabled = False
_mqtt_last_publish_ms = 0
_mqtt_publish_interval_ms = 5000
_mqtt_reconnect_last_attempt_ms = 0
_mqtt_reconnect_interval_ms = 5000


def getDBEConfig():
    """Get current DBE configuration from settings
    
    Returns JSON string with configuration
    """
    config = {
        'enabled': settings.get('dbe.enabled', False),
        'battery_type': settings.get('dbe.battery_type', 'nissan_leaf'),
        'rs485_baudrate': settings.get('dbe.rs485_baudrate', 9600),
        'inverter_protocol': settings.get('dbe.inverter_protocol', 'pylon_can'),
        'poll_interval': settings.get('dbe.poll_interval', 1000),
        'available_batteries': {
            'nissan_leaf': 'Nissan LEAF (ZE0/AZE0/ZE1)',
            # Future batteries will be added here
        },
        'available_inverters': {
            'pylon_can': 'Pylon CAN Protocol',
            # Future inverter protocols will be added here
        }
    }
    print(json.dumps(config))


def setDBEConfig(config_dict):
    """Set DBE configuration via settings module
    
    Args:
        config_dict: Dictionary with configuration values
    
    Returns JSON string with success status
    """
    try:
        # Update settings
        for key, value in config_dict.items():
            settings.set(f'dbe.{key}', value)
        
        # Save to disk
        if settings.save():
            print(json.dumps({'success': True}))
        else:
            print(json.dumps({'success': False, 'error': 'Failed to save settings'}))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))


def startDBE():
    """Start DBE bridge using CAN manager
    
    Returns JSON string with success status
    """
    global _dbe_running, _dbe_can_handle, _dbe_battery, _dbe_inverter, _dbe_loop_task, _dbe_status
    
    if _dbe_running:
        print(json.dumps({'success': False, 'error': 'Already running'}))
        return
    
    try:
        # Get configuration
        battery_type = settings.get('dbe.battery_type', 'nissan_leaf')
        inverter_protocol = settings.get('dbe.inverter_protocol', 'pylon_can')
        
        # === CAN Manager Integration ===
        
        # Stage 1: Register with CAN manager (bus stays STOPPED)
        _dbe_can_handle = CAN.register(CAN.TX_ENABLED)
        
        # Initialize battery protocol
        if battery_type == 'nissan_leaf':
            from lib.ext.dbe.battery.nissan_leaf import NissanLeafBattery
            _dbe_battery = NissanLeafBattery(_dbe_can_handle)
        else:
            raise ValueError(f"Unsupported battery type: {battery_type}")
        
        _dbe_battery.setup()
        
        # Set RX callback for battery frames
        def battery_rx_callback(frame):
            """CAN manager RX callback - dispatches to battery protocol"""
            try:
                can_id = frame['id']
                data = frame['data']
                _dbe_battery.handle_incoming_can_frame(can_id, data)
                _dbe_status['frames_rx'] += 1
            except Exception as e:
                _dbe_status['error'] = f"RX error: {e}"
        
        CAN.set_rx_callback(_dbe_can_handle, battery_rx_callback)
        
        # Stage 2: Activate client (bus starts in NORMAL mode)
        CAN.activate(_dbe_can_handle)
        
        # Initialize inverter protocol
        if inverter_protocol == 'pylon_can':
            from lib.ext.dbe.inverter.pylon_can import PylonCANProtocol
            _dbe_inverter = PylonCANProtocol()
        else:
            raise ValueError(f"Unsupported inverter protocol: {inverter_protocol}")
        
        # Update status
        _dbe_status['state'] = 'running'
        _dbe_status['running'] = True
        _dbe_status['battery_type'] = battery_type
        _dbe_status['inverter_protocol'] = inverter_protocol
        _dbe_status['error'] = ''
        
        # Initialize MQTT command handlers
        _init_mqtt_commands()
        
        # Initialize MQTT if enabled
        global _mqtt_enabled, _mqtt_publish_interval_ms
        _mqtt_enabled = settings.get('dbe.mqtt_enabled', False)
        _mqtt_publish_interval_ms = settings.get('dbe.mqtt_publish_interval', 5) * 1000
        
        if _mqtt_enabled:
            try:
                from lib.ext.dbe import mqtt_client, mqtt_commands, mqtt_ha_discovery
                
                if mqtt_client.init_mqtt():
                    if mqtt_client.connect():
                        print("[DBE] MQTT connected")
                        
                        # Subscribe to commands
                        mqtt_commands.subscribe_to_commands()
                        
                        # Publish Home Assistant discovery (if enabled)
                        if settings.get('dbe.mqtt_ha_autodiscovery', True):
                            num_cells = 0
                            if _dbe_battery:
                                battery_data = _dbe_battery.get_data()
                                cell_voltages = battery_data.get('cell_voltages_mV', [])
                                num_cells = len(cell_voltages)
                            
                            mqtt_ha_discovery.publish_discovery(
                                num_cells=num_cells,
                                publish_cell_voltages=settings.get('dbe.mqtt_publish_cell_voltages', True)
                            )
                    else:
                        print("[DBE] MQTT connection failed, will retry in background")
                else:
                    print("[DBE] MQTT initialization failed")
            except Exception as e:
                print(f"[DBE] MQTT setup error: {e}")
        
        # Start background loop
        _dbe_running = True
        import _thread
        _dbe_loop_task = _thread.start_new_thread(_dbe_loop, ())
        
        print(json.dumps({'success': True, 'status': 'started'}))
        
    except Exception as e:
        # Cleanup on error
        _dbe_status['state'] = 'error'
        _dbe_status['error'] = str(e)
        _dbe_running = False
        
        if _dbe_can_handle is not None:
            try:
                CAN.deactivate(_dbe_can_handle)
                CAN.unregister(_dbe_can_handle)
            except:
                pass
            _dbe_can_handle = None
        
        print(json.dumps({'success': False, 'error': str(e)}))


def _dbe_loop():
    """Main processing loop (runs in background thread)
    
    BIDIRECTIONAL BRIDGE:
    - Battery → Inverter: Forward battery data (voltage, SOC, limits, alarms)
    - Inverter → Battery: Forward control messages (enable charge/discharge, limits)
    - MQTT: Publish telemetry and handle commands
    
    NOTE: CAN RX handled by CAN manager callback (battery_rx_callback)
    """
    global _dbe_running, _dbe_paused, _dbe_battery, _dbe_inverter, _dbe_can_handle, _dbe_status
    global _mqtt_enabled, _mqtt_last_publish_ms, _mqtt_publish_interval_ms
    global _mqtt_reconnect_last_attempt_ms, _mqtt_reconnect_interval_ms
    
    while _dbe_running:
        try:
            current_time_ms = time.ticks_ms()
            
            # === MQTT Connection Management ===
            
            if _mqtt_enabled:
                from lib.ext.dbe import mqtt_client
                
                # Check if connected, attempt reconnect if needed
                if not mqtt_client.is_connected():
                    # Only attempt reconnect every 5 seconds
                    if time.ticks_diff(current_time_ms, _mqtt_reconnect_last_attempt_ms) > _mqtt_reconnect_interval_ms:
                        _mqtt_reconnect_last_attempt_ms = current_time_ms
                        mqtt_client.connect()
                else:
                    # Check for incoming MQTT commands (non-blocking)
                    mqtt_client.check_msg()
            
            # === Battery → Inverter Path ===
            
            # 1. CAN RX handled by CAN manager callback (no polling needed!)
            
            # 2. Send keep-alive to battery (if needed by protocol and not paused)
            #    Battery protocol uses CAN.transmit(handle, frame_dict)
            if not _dbe_paused:
                _dbe_battery.transmit_can(current_time_ms)
            
            # 3. Update derived values (power, etc.)
            _dbe_battery.update_values()
            
            # 4. Forward battery data to inverter via RS485 (if not paused)
            battery_data = _dbe_battery.get_data()
            if not _dbe_paused:
                _dbe_inverter.transmit(battery_data, current_time_ms)
            
            # === Inverter → Battery Path ===
            
            # 5. Check for incoming RS485 messages from inverter (if not paused)
            if not _dbe_paused:
                inverter_commands = _dbe_inverter.receive()
                if inverter_commands:
                    # Forward control messages to battery (if supported)
                    _dbe_battery.handle_inverter_commands(inverter_commands)
            
            # === MQTT Publishing ===
            
            if _mqtt_enabled and mqtt_client.is_connected():
                # Publish telemetry at configured interval
                if time.ticks_diff(current_time_ms, _mqtt_last_publish_ms) > _mqtt_publish_interval_ms:
                    from lib.ext.dbe import mqtt_publisher
                    
                    # Get publish settings
                    publish_cell_voltages = settings.get('dbe.mqtt_publish_cell_voltages', True)
                    publish_balancing = settings.get('dbe.mqtt_publish_balancing', True)
                    
                    # Publish all data
                    mqtt_publisher.publish_all(battery_data, publish_cell_voltages, publish_balancing)
                    
                    _mqtt_last_publish_ms = current_time_ms
            
            # Update status
            _dbe_status['last_update_ms'] = current_time_ms
            _dbe_status['paused'] = _dbe_paused
            
            # Sleep to avoid busy-wait
            time.sleep_ms(10)
            
        except Exception as e:
            _dbe_status['error'] = f"Loop error: {e}"
            # Continue running despite errors


def stopDBE():
    """Stop DBE bridge and clean up CAN manager registration
    
    Returns JSON string with success status
    """
    global _dbe_running, _dbe_can_handle, _dbe_battery, _dbe_inverter, _dbe_loop_task, _dbe_status
    global _mqtt_enabled
    
    try:
        # Stop background loop
        if _dbe_loop_task:
            _dbe_running = False
            time.sleep(0.3)  # Give loop time to exit
            _dbe_loop_task = None
        
        # === MQTT Cleanup ===
        
        if _mqtt_enabled:
            try:
                from lib.ext.dbe import mqtt_client
                mqtt_client.disconnect()
                print("[DBE] MQTT disconnected")
            except Exception as e:
                print(f"[DBE] MQTT disconnect error: {e}")
        
        # === CAN Manager Cleanup ===
        
        if _dbe_can_handle is not None:
            # Deactivate client (bus may go to LISTEN_ONLY or STOPPED)
            CAN.deactivate(_dbe_can_handle)
            
            # Unregister client (removes from manager)
            CAN.unregister(_dbe_can_handle)
            
            _dbe_can_handle = None
        
        # Clean up battery/inverter
        _dbe_battery = None
        _dbe_inverter = None
        
        # Update status
        _dbe_status['state'] = 'stopped'
        _dbe_status['running'] = False
        _dbe_status['paused'] = False
        _dbe_status['error'] = ''
        
        print(json.dumps({'success': True, 'status': 'stopped'}))
        
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))


def getDBEStatus():
    """Get DBE connection status
    
    Returns JSON string with status information
    """
    global _dbe_status, _dbe_battery
    
    try:
        # Add battery-specific status if available
        if _dbe_battery:
            battery_data = _dbe_battery.get_data()
            _dbe_status['battery_voltage_V'] = battery_data.get('voltage_dV', 0) / 10.0
            _dbe_status['battery_soc_percent'] = battery_data.get('soc_percent', 0)
        
        print(json.dumps(_dbe_status))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}))


def getDBEMetrics():
    """Get current battery metrics
    
    Returns JSON string with battery data
    """
    global _dbe_battery
    
    try:
        if _dbe_battery:
            battery_data = _dbe_battery.get_data()
            print(json.dumps(battery_data))
        else:
            print(json.dumps({'error': 'Battery not initialized'}))
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))


# ============================================================================
# MQTT Functions
# ============================================================================

def getMqttConfig():
    """Get MQTT configuration from settings
    
    Returns JSON string with DBE-specific MQTT configuration.
    Note: Broker settings (server, port, credentials) are managed globally
    in System → Networks → MQTT panel.
    """
    config = {
        'enabled': settings.get('dbe.mqtt_enabled', False),
        'topic_prefix': settings.get('mqtt.topic_prefix', 'BE'),
        'publish_interval': settings.get('dbe.mqtt_publish_interval', 5),
        'publish_cell_voltages': settings.get('dbe.mqtt_publish_cell_voltages', True),
        'publish_balancing': settings.get('dbe.mqtt_publish_balancing', True),
        'ha_autodiscovery': settings.get('dbe.mqtt_ha_autodiscovery', True)
    }
    print(json.dumps(config))


def setMqttConfig(config_dict):
    """Set MQTT configuration via settings module
    
    Args:
        config_dict: Dictionary with DBE-specific configuration values
    
    Returns JSON string with success status
    
    Note: Broker settings (server, port, credentials) are managed globally
    in System → Networks → MQTT panel and should not be set here.
    """
    try:
        # Update DBE MQTT settings
        if 'enabled' in config_dict:
            settings.set('dbe.mqtt_enabled', config_dict['enabled'])
        if 'publish_interval' in config_dict:
            settings.set('dbe.mqtt_publish_interval', config_dict['publish_interval'])
        if 'publish_cell_voltages' in config_dict:
            settings.set('dbe.mqtt_publish_cell_voltages', config_dict['publish_cell_voltages'])
        if 'publish_balancing' in config_dict:
            settings.set('dbe.mqtt_publish_balancing', config_dict['publish_balancing'])
        if 'ha_autodiscovery' in config_dict:
            settings.set('dbe.mqtt_ha_autodiscovery', config_dict['ha_autodiscovery'])
        
        # Update topic prefix (shared setting, but configurable per extension)
        if 'topic_prefix' in config_dict:
            settings.set('mqtt.topic_prefix', config_dict['topic_prefix'])
        
        # Save to disk
        if settings.save():
            # Update runtime variables
            global _mqtt_enabled, _mqtt_publish_interval_ms
            _mqtt_enabled = config_dict.get('enabled', False)
            _mqtt_publish_interval_ms = config_dict.get('publish_interval', 5) * 1000
            
            # If MQTT is being enabled, initialize it
            if _mqtt_enabled and _dbe_running:
                from lib.ext.dbe import mqtt_client, mqtt_commands, mqtt_ha_discovery
                
                if mqtt_client.init_mqtt():
                    if mqtt_client.connect():
                        # Subscribe to commands
                        mqtt_commands.subscribe_to_commands()
                        
                        # Publish Home Assistant discovery (if enabled)
                        if config_dict.get('ha_autodiscovery', True):
                            num_cells = 0
                            if _dbe_battery:
                                battery_data = _dbe_battery.get_data()
                                cell_voltages = battery_data.get('cell_voltages_mV', [])
                                num_cells = len(cell_voltages)
                            
                            mqtt_ha_discovery.publish_discovery(
                                num_cells=num_cells,
                                publish_cell_voltages=config_dict.get('publish_cell_voltages', True)
                            )
            
            print(json.dumps({'success': True}))
        else:
            print(json.dumps({'success': False, 'error': 'Failed to save settings'}))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))


def getMqttStatus():
    """Get MQTT connection status
    
    Returns JSON string with status information
    """
    try:
        from lib.ext.dbe import mqtt_client
        stats = mqtt_client.get_stats()
        print(json.dumps(stats))
    except Exception as e:
        print(json.dumps({'error': str(e), 'connected': False}))


def testMqtt():
    """Test MQTT connection
    
    Returns JSON string with test result
    """
    try:
        from lib.ext.dbe import mqtt_client
        
        # Initialize if needed
        if not mqtt_client.init_mqtt():
            print(json.dumps({'success': False, 'error': 'Failed to initialize MQTT client'}))
            return
        
        # Attempt connection
        if mqtt_client.connect():
            # Publish test message
            if mqtt_client.publish("test", "Connection test successful", retain=False, qos=0):
                print(json.dumps({'success': True, 'message': 'MQTT connection successful'}))
            else:
                print(json.dumps({'success': False, 'error': 'Failed to publish test message'}))
            
            # Disconnect
            mqtt_client.disconnect()
        else:
            print(json.dumps({'success': False, 'error': 'Failed to connect to MQTT broker'}))
            
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))


# ============================================================================
# Pause/Resume Functions (for MQTT commands)
# ============================================================================

def pauseDBE():
    """Pause battery operation (stop CAN TX, keep monitoring)"""
    global _dbe_paused
    _dbe_paused = True
    print("[DBE] Paused - CAN TX stopped, monitoring continues")


def resumeDBE():
    """Resume battery operation"""
    global _dbe_paused
    _dbe_paused = False
    print("[DBE] Resumed - CAN TX restarted")


def restartDBE():
    """Restart DBE bridge"""
    print("[DBE] Restarting...")
    stopDBE()
    time.sleep(1)
    startDBE()


def bmsResetDBE():
    """Reset BMS (if supported by battery protocol)"""
    global _dbe_battery
    if _dbe_battery and hasattr(_dbe_battery, 'reset_bms'):
        _dbe_battery.reset_bms()
        print("[DBE] BMS reset triggered")
    else:
        print("[DBE] BMS reset not supported by current battery protocol")


def setLimitsDBE(limits):
    """Set temporary charge/discharge limits
    
    Args:
        limits (dict): Dictionary with 'max_charge', 'max_discharge', 'timeout'
    """
    global _dbe_battery
    if _dbe_battery and hasattr(_dbe_battery, 'set_limits'):
        _dbe_battery.set_limits(limits)
        print(f"[DBE] Limits set: {limits}")
    else:
        print("[DBE] Set limits not supported by current battery protocol")


# Initialize MQTT command handlers
def _init_mqtt_commands():
    """Initialize MQTT command handlers (called by startDBE)"""
    try:
        from lib.ext.dbe import mqtt_commands
        
        # Set control functions for MQTT commands
        control_functions = {
            'pause': pauseDBE,
            'resume': resumeDBE,
            'restart': restartDBE,
            'stop': stopDBE,
            'bms_reset': bmsResetDBE,
            'set_limits': setLimitsDBE
        }
        
        mqtt_commands.set_dbe_control(control_functions)
    except Exception as e:
        print(f"[DBE] Failed to initialize MQTT commands: {e}")
