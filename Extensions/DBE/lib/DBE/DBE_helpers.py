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
"""

import json
import time
import CAN
from lib import settings

# Global state
_dbe_running = False
_dbe_can_handle = None
_dbe_battery = None
_dbe_inverter = None
_dbe_loop_task = None
_dbe_status = {
    'state': 'stopped',
    'running': False,
    'error': '',
    'battery_type': '',
    'inverter_protocol': '',
    'frames_rx': 0,
    'frames_tx': 0,
    'last_update_ms': 0
}


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
        _dbe_can_handle = CAN.can_register(needs_tx=True, force_listen_only=False)
        
        # Initialize battery protocol
        if battery_type == 'nissan_leaf':
            from lib.DBE.battery.nissan_leaf import NissanLeafBattery
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
        
        CAN.can_set_rx_callback(_dbe_can_handle, battery_rx_callback)
        
        # Stage 2: Activate client (bus starts in NORMAL mode)
        CAN.can_activate(_dbe_can_handle)
        
        # Initialize inverter protocol
        if inverter_protocol == 'pylon_can':
            from lib.DBE.inverter.pylon_can import PylonCANProtocol
            _dbe_inverter = PylonCANProtocol()
        else:
            raise ValueError(f"Unsupported inverter protocol: {inverter_protocol}")
        
        # Update status
        _dbe_status['state'] = 'running'
        _dbe_status['running'] = True
        _dbe_status['battery_type'] = battery_type
        _dbe_status['inverter_protocol'] = inverter_protocol
        _dbe_status['error'] = ''
        
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
                CAN.can_deactivate(_dbe_can_handle)
                CAN.can_unregister(_dbe_can_handle)
            except:
                pass
            _dbe_can_handle = None
        
        print(json.dumps({'success': False, 'error': str(e)}))


def _dbe_loop():
    """Main processing loop (runs in background thread)
    
    BIDIRECTIONAL BRIDGE:
    - Battery → Inverter: Forward battery data (voltage, SOC, limits, alarms)
    - Inverter → Battery: Forward control messages (enable charge/discharge, limits)
    
    NOTE: CAN RX handled by CAN manager callback (battery_rx_callback)
    """
    global _dbe_running, _dbe_battery, _dbe_inverter, _dbe_can_handle, _dbe_status
    
    while _dbe_running:
        try:
            current_time_ms = time.ticks_ms()
            
            # === Battery → Inverter Path ===
            
            # 1. CAN RX handled by CAN manager callback (no polling needed!)
            
            # 2. Send keep-alive to battery (if needed by protocol)
            #    Battery protocol uses CAN.can_transmit(handle, id, data)
            _dbe_battery.transmit_can(current_time_ms)
            
            # 3. Update derived values (power, etc.)
            _dbe_battery.update_values()
            
            # 4. Forward battery data to inverter via RS485
            battery_data = _dbe_battery.get_data()
            _dbe_inverter.transmit(battery_data, current_time_ms)
            
            # === Inverter → Battery Path ===
            
            # 5. Check for incoming RS485 messages from inverter
            inverter_commands = _dbe_inverter.receive()
            if inverter_commands:
                # Forward control messages to battery (if supported)
                _dbe_battery.handle_inverter_commands(inverter_commands)
            
            # Update status
            _dbe_status['last_update_ms'] = current_time_ms
            
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
    
    try:
        # Stop background loop
        if _dbe_loop_task:
            _dbe_running = False
            time.sleep(0.3)  # Give loop time to exit
            _dbe_loop_task = None
        
        # === CAN Manager Cleanup ===
        
        if _dbe_can_handle is not None:
            # Deactivate client (bus may go to LISTEN_ONLY or STOPPED)
            CAN.can_deactivate(_dbe_can_handle)
            
            # Unregister client (removes from manager)
            CAN.can_unregister(_dbe_can_handle)
            
            _dbe_can_handle = None
        
        # Clean up battery/inverter
        _dbe_battery = None
        _dbe_inverter = None
        
        # Update status
        _dbe_status['state'] = 'stopped'
        _dbe_status['running'] = False
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
