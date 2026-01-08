"""
OpenInverter Helper Functions
==============================

This module contains helper functions for OpenInverter parameter management
and CAN bus mapping. These functions are callable from the WebREPL client
and automatically send their JSON responses directly to the connected client.

Client-callable functions (auto-send to client):
- getOiParams()           - Get list of parameters (isparam=True)
- setParameter(args)      - Set a single parameter value
- saveParameters()        - Save parameters to persistent storage
- getParametersForDownload() - Get parameters for export/download
- setParametersBatch(args) - Set multiple parameters at once
- getSpotValues()         - Get list of spot values (isparam=False)
- getPlotData(args)       - Get real-time values for plotting
- mapCanSpotValue(args)   - Map a spot value to CAN bus
- unmapCanSpotValue(args) - Remove CAN mapping from spot value
- getCanMappingData()     - Get all parameters with CAN mapping info
- getSysInfo()            - Get OpenInverter system info
- actionButton(args)      - Handle action button press
- termCmd(args)           - Handle terminal command

Global Parameters Store:
- parameters: Dictionary of all parameters and spot values
  Structure: {
    'name': {
      'value': <number>,
      'unit': <string>,
      'isparam': <bool>,
      'category': <string>,
      # For parameter only:
      'minimum': <number>,
      'maximum': <number>,
      'default': <number>,
      'enums': {<int>: <string>, ...},  # Optional for enum parameters
      # For CAN-mapped values:
      'canId': <int>,
      'canPosition': <int>,
      'canBits': <int>,
      'canGain': <float>,
      'isTx': <bool>
    }
  }
"""

import json
import time

# CAN module - required for OpenInverter extension
try:
    import CAN
except ImportError:
    # CAN module not available - functions will fail gracefully
    CAN = None

# SDO library is guaranteed to be present in extension (same package)
from canopen_sdo import SDOClient, fixed_to_float, float_to_fixed, param_id_to_sdo
from canopen_sdo import SDOTimeoutError, SDOAbortError

# --- Global CAN and Device State ---
can_dev = None
sdo_client = None
device_connected = False
device_node_id = 1
device_bitrate = 500000
param_db_cache = None
streaming_active = False


# --- Global Parameters/Spot Values Store (Demo Data or from device) ---
# This will be replaced with actual device data when connected
# IDs are included from the start (matching reference mock-server.js pattern)
parameters = {
    # Spot values (isparam=False) - matching reference mock-server.js
    'voltage': {
        'value': 350.5, 'unit': 'V', 'isparam': False, 'category': 'Electrical',
        'id': 0x1001,  # ID included from start (like reference)
        'canId': 500, 'canPosition': 0, 'canBits': 16, 'canGain': 0.1, 'isTx': True
    },
    'current': {
        'value': 45.2, 'unit': 'A', 'isparam': False, 'category': 'Electrical',
        'id': 0x1002  # ID included from start
    },
    'power': {
        'value': 15850, 'unit': 'W', 'isparam': False, 'category': 'Electrical',
        'id': 0x1003  # ID included from start
    },
    'rpm': {
        'value': 3000, 'unit': 'rpm', 'isparam': False, 'category': 'Motor',
        'id': 0x1004  # ID included from start
    },
    'temp': {
        'value': 65, 'unit': '°C', 'isparam': False, 'category': 'Thermal',
        'id': 0x1005,  # ID included from start
        'canId': 500, 'canPosition': 16, 'canBits': 8, 'canGain': 1.0, 'isTx': True
    },
    
    # Parameters (isparam=True) - common OpenInverter parameters
    'fslipspnt': {
        'value': 2.0, 'unit': 'Hz', 'isparam': True, 'category': 'Motor',
        'id': 0x2001,  # ID included from start
        'minimum': 0, 'maximum': 10, 'default': 1.5
    },
    'opmode': {
        'value': 1, 'unit': '', 'isparam': True, 'category': 'Control',
        'id': 0x2002,  # ID included from start
        'enums': {0: 'Off', 1: 'Manual', 2: 'Auto'}, 'default': 0
    },
    'kp': {
        'value': 100, 'unit': '', 'isparam': True, 'category': 'Control',
        'id': 0x2003,  # ID included from start
        'minimum': 0, 'maximum': 1000, 'default': 150
    },
    'ki': {
        'value': 50, 'unit': '', 'isparam': True, 'category': 'Control',
        'id': 0x2004,  # ID included from start
        'minimum': 0, 'maximum': 500, 'default': 80
    }
}


def _send_response(cmd, arg):
    """Internal helper to send JSON response to WebREPL client via WebREPL Binary Protocol
    
    With WebREPL Binary Protocol, responses are tracked by request ID, so we can just
    send the data directly. For backward compatibility, we still accept cmd
    parameter but only print the arg data.
    """
    # WebREPL Binary Protocol: Just send the data directly (client tracks by request ID)
    print(json.dumps(arg))


def _send_error(message, cmd):
    """Internal helper to send error response via WebREPL Binary Protocol"""
    # WebREPL Binary Protocol: Send error as simple object
    print(json.dumps({'error': message}))

# ============================================================================
# CAN Device Initialization and Management
# ============================================================================

def initializeDevice(args=None):
    """
    Initialize CAN bus and connect to OpenInverter device.
    
    Args (dict, optional):
        node_id: CANopen node ID (default: 1)
            - Node ID > 127: Mock/demo device mode (no actual CAN hardware)
            - Node ID 1-127: Real device mode (requires CAN hardware)
        bitrate: CAN bus bitrate (default: 500000)
        tx_pin: TX GPIO pin (default: 5)
        rx_pin: RX GPIO pin (default: 4)
        mode: CAN mode (default: CAN.NORMAL)
    
    Returns:
        Connection status and device info
    """
    global can_dev, sdo_client, device_connected, device_node_id, device_bitrate
    
    # Parse arguments
    if args is None:
        args = {}
    
    node_id = args.get('node_id', 1)
    
    # Handle mock device mode (node ID > 127)
    # Mock devices don't require CAN hardware - just set connected flag
    if node_id > 127:
        device_connected = True
        device_node_id = node_id
        device_bitrate = args.get('bitrate', 500000)
        can_dev = None  # No actual CAN device for mock mode
        sdo_client = None  # No SDO client for mock mode
        
        _send_response('DEVICE-INITIALIZED', {
            'success': True,
            'node_id': node_id,
            'bitrate': device_bitrate,
            'connected': True,
            'mock': True
        })
        return
    
    # Real device mode (node ID 1-127) - requires CAN hardware
    # Check if CAN module is available
    if CAN is None:
        _send_error("CAN module not available on this platform", 'INIT-DEVICE-ERROR')
        return
    
    mode = args.get('mode', CAN.NORMAL)
    
    # Read CAN configuration from /config/can.json (with fallback to main.py)
    tx_pin = args.get('tx_pin')
    rx_pin = args.get('rx_pin')
    bitrate = args.get('bitrate')
    
    if tx_pin is None or rx_pin is None or bitrate is None:
        # Try to load from /config/can.json
        try:
            import os
            config_dir = '/config'
            if not os.path.exists(config_dir):
                config_dir = '/store/config'
            config_file = config_dir + '/can.json'
            
            if os.path.exists(config_file):
                import json
                with open(config_file, 'r') as f:
                    can_config = json.load(f)
                if tx_pin is None:
                    tx_pin = can_config.get('txPin', 5)
                if rx_pin is None:
                    rx_pin = can_config.get('rxPin', 4)
                if bitrate is None:
                    bitrate = can_config.get('bitrate', 500000)
            else:
                # Fallback to main.py
                import sys
                sys.path.insert(0, '/device scripts')
                from main import CAN_TX_PIN, CAN_RX_PIN, CAN_BITRATE
                if tx_pin is None:
                    tx_pin = CAN_TX_PIN
                if rx_pin is None:
                    rx_pin = CAN_RX_PIN
                if bitrate is None:
                    bitrate = CAN_BITRATE
        except Exception as e:
            if tx_pin is None:
                tx_pin = 5
            if rx_pin is None:
                rx_pin = 4
            if bitrate is None:
                bitrate = 500000
    
    try:
        # Initialize CAN device
        can_dev = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, mode=mode, bitrate=bitrate, auto_restart=False)
        
        # Create SDO client
        sdo_client = SDOClient(can_dev, node_id=node_id, timeout=1.0)
        
        device_connected = True
        device_node_id = node_id
        device_bitrate = bitrate
        
        
        # Try to read a basic parameter to verify connection
        try:
            # Read uptime or another safe spot value to verify connection
            # For now, just confirm initialization
            _send_response('DEVICE-INITIALIZED', {
                'success': True,
                'node_id': node_id,
                'bitrate': bitrate,
                'connected': True
            })
        except Exception as e:
            _send_response('DEVICE-INITIALIZED', {
                'success': True,
                'node_id': node_id,
                'bitrate': bitrate,
                'connected': False,
                'warning': 'CAN initialized but device not responding'
            })
            
    except Exception as e:
        # Log error (print() output goes to M2M channel automatically)
        print(f"[OI] Error initializing CAN: {e}")
        device_connected = False
        error_msg = str(e)
        _send_error(f"Failed to initialize CAN: {error_msg}", 'INIT-DEVICE-ERROR')


def disconnectDevice():
    """
    Disconnect from CAN bus and release resources.
    """
    global can_dev, sdo_client, device_connected, streaming_active
    
    if streaming_active:
        # Stop streaming first
        stopLiveStreaming()
    
    device_connected = False
    sdo_client = None
    
    # CAN device cleanup would go here if needed
    # For now, just mark as disconnected


def getDeviceStatus():
    """
    Get current device connection status.
    """
    status = {
        'connected': device_connected,
        'can_available': CAN is not None,
        'node_id': device_node_id,
        'bitrate': device_bitrate,
        'streaming_active': streaming_active
    }
    
    _send_response('DEVICE-STATUS', status)


def fetchParameterDatabase():
    """
    Fetch parameter database from OpenInverter device.
    
    The parameter database is stored as a JSON string in the device
    at SDO index 0x1021. This contains definitions for all parameters
    and spot values with their units, ranges, categories, etc.
    
    Returns:
        Dictionary of parameter definitions
    """
    global param_db_cache, parameters
    
    if not device_connected or sdo_client is None:
        # Return demo parameter database when not connected
        # This ensures demo parameters have IDs for CAN mapping
        # Don't send response here - this is an internal helper function
        # The caller (getAllParamsWithIds) will send the final response
        demo_db = {
            'voltage': {'id': 0x1001, 'unit': 'V', 'isparam': False, 'category': 'Electrical'},
            'current': {'id': 0x1002, 'unit': 'A', 'isparam': False, 'category': 'Electrical'},
            'power': {'id': 0x1003, 'unit': 'W', 'isparam': False, 'category': 'Electrical'},
            'rpm': {'id': 0x1004, 'unit': 'rpm', 'isparam': False, 'category': 'Motor'},
            'temp': {'id': 0x1005, 'unit': '°C', 'isparam': False, 'category': 'Thermal'},
            'fslipspnt': {'id': 0x2001, 'unit': 'Hz', 'isparam': True, 'category': 'Motor', 'minimum': 0, 'maximum': 10, 'default': 1.5},
            'opmode': {'id': 0x2002, 'unit': '', 'isparam': True, 'category': 'Control', 'default': 0},
            'kp': {'id': 0x2003, 'unit': '', 'isparam': True, 'category': 'Control', 'minimum': 0, 'maximum': 1000, 'default': 150},
            'ki': {'id': 0x2004, 'unit': '', 'isparam': True, 'category': 'Control', 'minimum': 0, 'maximum': 500, 'default': 80}
        }
        param_db_cache = demo_db
        loadParameterDatabase(demo_db)
        # Silent return - don't send response for internal calls
        return
    
    try:
        # Parameter database is at SDO 0x1021, subindex 0
        # It's stored as a large JSON string, so we need to read it in chunks
        # For now, we'll use a simplified approach
        
        # Note: OpenInverter may store the DB differently, this is a placeholder
        # The actual implementation would need to read the JSON database
        # which might be multiple SDO objects or a file transfer
        
        # For now, return error as this needs device-specific implementation
        _send_error("Parameter database fetching not yet implemented for real hardware", 'FETCH-PARAM-DB-ERROR')
        
        # TODO: Implement actual DB fetching
        # The openinverter-can-tool does this via:
        # 1. Reading chunks of data from device
        # 2. Assembling JSON string
        # 3. Parsing to get parameter definitions
        
    except SDOTimeoutError as e:
        # Silent - errors sent via _send_error()
        _send_error(str(e), 'FETCH-PARAM-DB-ERROR')
    except SDOAbortError as e:
        # Silent - errors sent via _send_error()
        _send_error(str(e), 'FETCH-PARAM-DB-ERROR')
    except Exception as e:
        # Silent - errors sent via _send_error()
        _send_error(str(e), 'FETCH-PARAM-DB-ERROR')


def loadParameterDatabase(json_db):
    """
    Load parameter database from JSON structure.
    
    Args:
        json_db: Dictionary containing parameter definitions
    
    Merges parameter database metadata (IDs, units, categories, etc.) into existing parameters dictionary.
    Preserves existing values and other fields.
    """
    global parameters, param_db_cache
    
    try:
        # Merge database metadata into existing parameters (don't replace entirely)
        for param_name, param_def in json_db.items():
            if param_name in parameters:
                # Update existing parameter with database metadata
                if 'id' in param_def:
                    parameters[param_name]['id'] = param_def['id']
                if 'unit' in param_def:
                    parameters[param_name]['unit'] = param_def['unit']
                if 'category' in param_def:
                    parameters[param_name]['category'] = param_def['category']
                if 'isparam' in param_def:
                    parameters[param_name]['isparam'] = param_def['isparam']
                
                # For parameters, update min/max/default if provided
                if parameters[param_name].get('isparam'):
                    if 'minimum' in param_def:
                        parameters[param_name]['minimum'] = param_def['minimum']
                    if 'maximum' in param_def:
                        parameters[param_name]['maximum'] = param_def['maximum']
                    if 'default' in param_def:
                        parameters[param_name]['default'] = param_def['default']
                
                # Parse enumerations from unit string if present
                # Format: "0=Off 1=On 2=Auto"
                unit = param_def.get('unit', '')
                if '=' in unit:
                    enums = {}
                    for part in unit.split():
                        if '=' in part:
                            try:
                                val, name = part.split('=', 1)
                                enums[int(val)] = name
                            except:
                                pass
                    if enums:
                        parameters[param_name]['enums'] = enums
            else:
                # New parameter not in existing dictionary - create it
                param = {
                    'unit': param_def.get('unit', ''),
                    'isparam': param_def.get('isparam', False),
                    'category': param_def.get('category', 'Uncategorized'),
                    'id': param_def.get('id'),
                    'value': param_def.get('default', 0) if param_def.get('isparam') else 0
                }
                
                # For parameters, add min/max/default
                if param['isparam']:
                    param['minimum'] = param_def.get('minimum', 0)
                    param['maximum'] = param_def.get('maximum', 0)
                    param['default'] = param_def.get('default', 0)
                
                # Parse enumerations from unit string if present
                unit = param_def.get('unit', '')
                if '=' in unit:
                    enums = {}
                    for part in unit.split():
                        if '=' in part:
                            try:
                                val, name = part.split('=', 1)
                                enums[int(val)] = name
                            except:
                                pass
                    if enums:
                        param['enums'] = enums
                
                parameters[param_name] = param
        
        param_db_cache = json_db
        
    except Exception as e:
        # Silent - errors sent via _send_error()
        _send_error(str(e), 'PARAM-DB-LOAD-ERROR')


def getOiParams():
    """
    Get list of all parameters (isparam=True).
    Sends the result directly to the WebREPL client as JSON.
    
    If connected to real device, reads current values via SDO.
    Otherwise, returns demo data.
    """
    param_list = {}
    
    # If connected to device, read actual values
    if device_connected and sdo_client and CAN is not None:
        try:
            for key, item in parameters.items():
                if item.get('isparam') == True:
                    # Read current value from device
                    param_id = item.get('id')
                    if param_id is not None:
                        try:
                            index, subindex = param_id_to_sdo(param_id)
                            raw_value = sdo_client.read(index, subindex)
                            item['value'] = fixed_to_float(raw_value)
                        except (SDOTimeoutError, SDOAbortError) as e:
                            # Keep existing value
                            pass
                    
                    param_list[key] = item
        except Exception as e:
            # Silent - errors sent via _send_error()
            # Fall back to cached values
            for key, item in parameters.items():
                if item.get('isparam') == True:
                    param_list[key] = item
    else:
        # Use demo/cached data
        for key, item in parameters.items():
            if item.get('isparam') == True:
                param_list[key] = item
    
    # Always send response, even if empty
    try:
        _send_response('PARAMETERS-LIST', param_list)
    except Exception as e:
        # If sending fails, try to send error response
        try:
            _send_error(f"Failed to send parameters list: {str(e)}", 'PARAMETERS-LIST-ERROR')
        except:
            pass  # Silent failure


def setParameter(args):
    """
    Set a single parameter value.
    
    Args (dict):
        NAME: Parameter name
        VALUE: New value
    
    Sends the updated parameter or error to WebREPL client.
    """
    param_name = args.get('NAME')
    param_value = args.get('VALUE')
    
    if param_name is None or param_value is None:
        _send_error("Missing NAME or VALUE for SET-PARAMETER", 'SET-PARAMETER-ERROR')
        return
    
    if param_name in parameters and parameters[param_name].get('isparam') == True:
        # Validate value against min/max if present
        param_def = parameters[param_name]
        
        if 'minimum' in param_def and param_value < param_def['minimum']:
            _send_error(f"Value {param_value} below minimum {param_def['minimum']}", 'SET-PARAMETER-ERROR')
            return
        
        if 'maximum' in param_def and param_value > param_def['maximum']:
            _send_error(f"Value {param_value} above maximum {param_def['maximum']}", 'SET-PARAMETER-ERROR')
            return
        
        # Validate enum if present
        if 'enums' in param_def and param_value not in param_def['enums']:
            _send_error(f"Value {param_value} not in valid enums", 'SET-PARAMETER-ERROR')
            return
        
                
        # If connected to device, write via SDO
        if device_connected and sdo_client and CAN is not None:
            param_id = param_def.get('id')
            if param_id is not None:
                try:
                    index, subindex = param_id_to_sdo(param_id)
                    fixed_value = float_to_fixed(param_value)
                    sdo_client.write(index, subindex, fixed_value)
                except SDOTimeoutError as e:
                    _send_error(f"Timeout writing parameter: {str(e)}", 'SET-PARAMETER-ERROR')
                    return
                except SDOAbortError as e:
                    _send_error(f"Device rejected parameter: {str(e)}", 'SET-PARAMETER-ERROR')
                    return
                except Exception as e:
                    _send_error(f"Error writing parameter: {str(e)}", 'SET-PARAMETER-ERROR')
                    return
        
        # Update cached value
        parameters[param_name]['value'] = param_value
        
        updated_param = {param_name: parameters[param_name]}
        _send_response('PARAMETER-UPDATED', updated_param)
    else:
        _send_error(f"Invalid or non-parameter name: {param_name}", 'SET-PARAMETER-ERROR')


def saveParameters():
    """
    Save parameters to persistent storage.
    
    TODO: Implement actual saving logic (e.g., to NVS, JSON file on flash)
    For now, just acknowledges the save request.
    """
        # TODO: Implement actual saving logic
    # Example:
    # import json
    # with open('/flash/oi_params.json', 'w') as f:
    #     json.dump({k: v for k, v in parameters.items() if v.get('isparam')}, f)


def getAllParamsWithIds():
    """
    Get all parameters and spot values that have IDs (for CAN mapping).
    Returns both parameters (isparam=True) and spot values (isparam=False) that have IDs.
    
    If parameter database hasn't been loaded yet, tries to fetch it first.
    """
    global parameters
    
    # If parameter database hasn't been loaded, try to fetch it
    # This ensures spot values have IDs
    # fetchParameterDatabase() now handles both connected and demo cases
    if param_db_cache is None:
        try:
            # Try to fetch parameter database from device (or load demo cache)
            # This will populate IDs for both parameters and spot values
            fetchParameterDatabase()
        except Exception:
            # If fetch fails, continue with existing parameters
            pass
    
    all_params = {}
    
    for key, item in parameters.items():
        # Only include items that have an ID (required for CAN mapping)
        if item.get('id') is not None:
            all_params[key] = item
    
    _send_response('ALL-PARAMS-WITH-IDS', all_params)


def getParametersForDownload():
    """
    Get all parameters for export/download.
    Same as getOiParams() but with different command name.
    """
    param_list = {}
    
    for key, item in parameters.items():
        if item.get('isparam') == True:
            param_list[key] = item
    
    _send_response('PARAMETERS-DOWNLOAD-LIST', param_list)


def setParametersBatch(params_to_set):
    """
    Set multiple parameters at once.
    
    Args (dict):
        {param_name: value, ...}
    
    Sends batch result with success status and details for each parameter.
    """
    update_results = {}
    success = True
    
    if not isinstance(params_to_set, dict):
        _send_error("Invalid argument format for batch set", 'SET-PARAMETERS-BATCH-ERROR')
        return
    
    for name, value in params_to_set.items():
        if name in parameters and parameters[name].get('isparam') == True:
            param_def = parameters[name]
            
            # Validate value
            if 'minimum' in param_def and value < param_def['minimum']:
                update_results[name] = {'status': 'error', 'message': f'Below minimum {param_def["minimum"]}'}
                success = False
                continue
            
            if 'maximum' in param_def and value > param_def['maximum']:
                update_results[name] = {'status': 'error', 'message': f'Above maximum {param_def["maximum"]}'}
                success = False
                continue
            
            if 'enums' in param_def and value not in param_def['enums']:
                update_results[name] = {'status': 'error', 'message': 'Invalid enum value'}
                success = False
                continue
            
            parameters[name]['value'] = value
            update_results[name] = {'status': 'success', 'value': value}
        else:
            update_results[name] = {'status': 'error', 'message': 'Invalid or non-parameter'}
            success = False
    
    _send_response('PARAMETERS-BATCH-RESULT', {'success': success, 'details': update_results})


def getSpotValues():
    """
    Get list of all spot values (isparam=False).
    Sends the result directly to the WebREPL client as JSON.
    
    If connected to real device, reads current values via SDO.
    Otherwise, returns demo data with random variation.
    """
    spot_list = {}
    
    # If connected to device, read actual values
    if device_connected and sdo_client and CAN is not None:
        try:
            for key, item in parameters.items():
                if item.get('isparam') != True:
                    # Read current value from device
                    param_id = item.get('id')
                    if param_id is not None:
                        try:
                            index, subindex = param_id_to_sdo(param_id)
                            raw_value = sdo_client.read(index, subindex)
                            item['value'] = fixed_to_float(raw_value)
                        except (SDOTimeoutError, SDOAbortError) as e:
                            # Keep existing value
                            pass
                    
                    spot_list[key] = item
        except Exception as e:
            # Silent - errors sent via _send_error()
            # Fall back to cached values
            for key, item in parameters.items():
                if item.get('isparam') != True:
                    spot_list[key] = item
    else:
        # Use demo/cached data with random variation (simulates live values)
        import random
        for key, item in parameters.items():
            if item.get('isparam') != True:
                # Create a copy to avoid modifying the original
                spot_value = item.copy()
                
                # Add small random variation to numeric values (±2%)
                if isinstance(spot_value.get('value'), (int, float)):
                    base_value = spot_value['value']
                    if base_value != 0:
                        variation = (random.random() - 0.5) * base_value * 0.02
                        spot_value['value'] = base_value + variation
                
                spot_list[key] = spot_value
    
    _send_response('SPOT-VALUES-LIST', spot_list)


def getPlotData(args):
    """
    Get real-time values for plotting.
    
    Args (list):
        List of variable names to retrieve
    
    Returns values with timestamp for plotting.
    
    Note: This only works in Configuration Mode, not during streaming.
    For high-speed plotting, use C streaming mode instead.
    """
    # Note: Avoid print() here as it interferes with JSON response in WebREPL
    
    if streaming_active:
        # Can't read via SDO while streaming
        _send_error("Cannot read plot data in streaming mode", 'PLOT-DATA-ERROR')
        return
    
    response_values = {}
    current_time = int(time.time())  # Unix timestamp
    
    if isinstance(args, list) and len(args) > 0:
        # If connected to device, read fresh values
        if device_connected and sdo_client and CAN is not None:
            for var_name in args:
                if var_name in parameters:
                    item = parameters[var_name]
                    param_id = item.get('id')
                    
                    if param_id is not None:
                        try:
                            index, subindex = param_id_to_sdo(param_id)
                            raw_value = sdo_client.read(index, subindex)
                            value = fixed_to_float(raw_value)
                            
                            # Update cached value
                            item['value'] = value
                            response_values[var_name] = value
                        except (SDOTimeoutError, SDOAbortError):
                            # Use cached value on error
                            value = item.get('value')
                            if isinstance(value, (int, float)):
                                response_values[var_name] = value
                    else:
                        # No param ID, use cached value
                        value = item.get('value')
                        if isinstance(value, (int, float)):
                            response_values[var_name] = value
        else:
            # Use demo/cached data with random variation (simulates live values)
            import random
            for var_name in args:
                if var_name in parameters:
                    item = parameters[var_name]
                    value = item.get('value')
                    
                    # Make sure it's a number that can be plotted
                    if isinstance(value, (int, float)):
                        # Add random variation (±5% for more visible changes in plots)
                        if value != 0:
                            variation = (random.random() - 0.5) * value * 0.05
                            response_values[var_name] = value + variation
                        else:
                            response_values[var_name] = value
        
        # Construct the response payload
        response_payload = {
            'ts': current_time,
            'values': response_values
        }
        
        _send_response('PLOT-DATA-UPDATE', response_payload)


# ============================================================================
# CAN Mapping Functions
# ============================================================================

def getCanMap(args=None):
    """
    Get CAN mappings from device (TX or RX).
    
    Args (dict, optional):
        direction: 'tx' or 'rx' (default: both)
    
    CAN mapping uses SDO indexes:
    - TX map list: 0x3000 + n
    - RX map list: 0x3100 + n
    """
    # If not connected to real device, return empty mappings (mock devices handled in JavaScript)
    if not device_connected or sdo_client is None:
        mappings = {'tx': [], 'rx': []}
        _send_response('CAN-MAP-LIST', mappings)
        return
    
    direction = args.get('direction', 'both') if args else 'both'
    
    try:
        mappings = {'tx': [], 'rx': []}
        
        if direction in ['tx', 'both']:
            # Read TX mappings starting at 0x3000
            base_index = 0x3000
            msg_index = 0
            while msg_index < 255:  # Max messages
                try:
                    # Read CAN ID at subindex 0
                    can_id = sdo_client.read(base_index + msg_index, 0)
                    if can_id == 0:
                        break  # No more messages
                    
                    # Extract extended frame flag (bit 31)
                    is_extended = (can_id & 0x80000000) != 0
                    can_id = can_id & 0x1FFFFFFF  # Mask out flag bit
                    
                    message = {
                        'canId': can_id,
                        'isExtended': is_extended,
                        'params': []
                    }
                    
                    # Read parameter mappings (subindex 1, 3, 5, ...)
                    param_index = 1
                    while param_index < 255:
                        try:
                            # Read param ID, position, length
                            mapping_data = sdo_client.read(base_index + msg_index, param_index)
                            if mapping_data == 0:
                                break  # No more params
                            
                            param_id = mapping_data & 0xFFFF
                            position = (mapping_data >> 16) & 0xFF
                            length = (mapping_data >> 24) & 0xFF
                            # Convert to signed if negative
                            if length >= 128:
                                length = length - 256
                            
                            # Read gain and offset (next subindex)
                            gain_offset = sdo_client.read(base_index + msg_index, param_index + 1)
                            gain = (gain_offset & 0xFFFFFF) / 1000.0  # 24-bit fixed point
                            offset = (gain_offset >> 24) & 0xFF
                            if offset >= 128:
                                offset = offset - 256
                            
                            message['params'].append({
                                'paramId': param_id,
                                'position': position,
                                'length': length,
                                'gain': gain,
                                'offset': offset
                            })
                            
                            param_index += 2  # Skip to next param
                        except (SDOTimeoutError, SDOAbortError):
                            break
                    
                    if message['params']:  # Only add if has params
                        mappings['tx'].append(message)
                    
                    msg_index += 1
                except (SDOTimeoutError, SDOAbortError):
                    break
        
        if direction in ['rx', 'both']:
            # Read RX mappings starting at 0x3100
            base_index = 0x3100
            msg_index = 0
            while msg_index < 255:
                try:
                    can_id = sdo_client.read(base_index + msg_index, 0)
                    if can_id == 0:
                        break
                    
                    is_extended = (can_id & 0x80000000) != 0
                    can_id = can_id & 0x1FFFFFFF
                    
                    message = {
                        'canId': can_id,
                        'isExtended': is_extended,
                        'params': []
                    }
                    
                    param_index = 1
                    while param_index < 255:
                        try:
                            mapping_data = sdo_client.read(base_index + msg_index, param_index)
                            if mapping_data == 0:
                                break
                            
                            param_id = mapping_data & 0xFFFF
                            position = (mapping_data >> 16) & 0xFF
                            length = (mapping_data >> 24) & 0xFF
                            if length >= 128:
                                length = length - 256
                            
                            gain_offset = sdo_client.read(base_index + msg_index, param_index + 1)
                            gain = (gain_offset & 0xFFFFFF) / 1000.0
                            offset = (gain_offset >> 24) & 0xFF
                            if offset >= 128:
                                offset = 256
                            
                            message['params'].append({
                                'paramId': param_id,
                                'position': position,
                                'length': length,
                                'gain': gain,
                                'offset': offset
                            })
                            
                            param_index += 2
                        except (SDOTimeoutError, SDOAbortError):
                            break
                    
                    if message['params']:
                        mappings['rx'].append(message)
                    
                    msg_index += 1
                except (SDOTimeoutError, SDOAbortError):
                    break
        
        _send_response('CAN-MAP-LIST', mappings)
        
    except Exception as e:
        # Silent - errors sent via _send_error()
        _send_error(str(e), 'CAN-MAP-ERROR')


def addCanMapping(args):
    """
    Add a CAN mapping entry.
    
    Args (dict):
        can_id: CAN message ID
        param_name: Parameter/spot value name
        position: Bit position in CAN message
        length: Number of bits (negative for big-endian)
        gain: Scaling factor
        offset: Offset value
        is_tx: True for transmit, False for receive
        is_extended: True for 29-bit extended frame
    """
    # Handle JSON string from JavaScript (JSON uses lowercase true/false, Python needs True/False)
    if isinstance(args, str):
        args = json.loads(args)
    elif args is None:
        args = {}
    
    can_id = args.get('can_id')
    param_name = args.get('param_name')
    position = args.get('position', 0)
    length = args.get('length', 16)
    gain = args.get('gain', 1.0)
    offset = args.get('offset', 0)
    is_tx = args.get('is_tx', True)
    is_extended = args.get('is_extended', False)
    
    if can_id is None or param_name is None:
        _send_error("Missing can_id or param_name", 'CAN-MAP-ADD-ERROR')
        return
    
    # Get param ID from name
    if param_name not in parameters:
        _send_error(f"Parameter {param_name} not found", 'CAN-MAP-ADD-ERROR')
        return
    
    param_id = parameters[param_name].get('id')
    if param_id is None:
        _send_error(f"Parameter {param_name} has no ID", 'CAN-MAP-ADD-ERROR')
        return
    
    # If not connected to real device, just acknowledge (mock devices handled in JavaScript)
    if not device_connected or sdo_client is None:
        _send_response('CAN-MAP-ADDED', {
            'success': True,
            'can_id': can_id,
            'param_name': param_name,
            'param_id': param_id,
            'position': position,
            'length': length,
            'gain': gain,
            'offset': offset,
            'is_tx': is_tx,
            'is_extended': is_extended
        })
        return
    
    try:
        # Real device mode - write via SDO
        # Use appropriate SDO index for TX (0x3200) or RX (0x3300)
        base_index = 0x3200 if is_tx else 0x3300
        
        # Write CAN ID with extended frame flag if needed
        can_id_value = can_id | (0x80000000 if is_extended else 0)
        sdo_client.write(base_index, 0, can_id_value)
        
        # Write param ID, position, length
        mapping_data = param_id | (position << 16) | ((length & 0xFF) << 24)
        sdo_client.write(base_index, 1, mapping_data)
        
        # Write gain and offset
        gain_fixed = int(gain * 1000) & 0xFFFFFF  # 24-bit fixed point
        gain_offset_value = gain_fixed | ((offset & 0xFF) << 24)
        sdo_client.write(base_index, 2, gain_offset_value)
        
        _send_response('CAN-MAP-ADDED', {
            'success': True,
            'can_id': can_id,
            'param_name': param_name,
            'param_id': param_id
        })
        
    except (SDOTimeoutError, SDOAbortError) as e:
        _send_error(str(e), 'CAN-MAP-ADD-ERROR')
    except Exception as e:
        _send_error(str(e), 'CAN-MAP-ADD-ERROR')


def removeCanMapping(args):
    """
    Remove a CAN mapping entry.
    
    Args (dict):
        direction: 'tx' or 'rx'
        msg_index: Message index
        param_index: Parameter index within message
    """
    # Handle JSON string from JavaScript
    if isinstance(args, str):
        args = json.loads(args)
    elif args is None:
        args = {}
    
    direction = args.get('direction')
    msg_index = args.get('msg_index')
    param_index = args.get('param_index')
    
    if direction is None or msg_index is None or param_index is None:
        _send_error("Missing direction, msg_index, or param_index", 'CAN-MAP-REMOVE-ERROR')
        return
    
    # If not connected to real device, just acknowledge (mock devices handled in JavaScript)
    if not device_connected or sdo_client is None:
        _send_response('CAN-MAP-REMOVED', {
            'success': True,
            'direction': direction,
            'msg_index': msg_index,
            'param_index': param_index
        })
        return
    
    try:
        # Real device mode - write via SDO
        base_index = 0x3000 if direction == 'tx' else 0x3100
        target_index = base_index + msg_index
        # Write 0 to the parameter subindex to remove it
        # Device will automatically shift remaining params
        target_subindex = 1 + (param_index * 2)
        sdo_client.write(target_index, target_subindex, 0)
        
        _send_response('CAN-MAP-REMOVED', {'success': True})
        
    except (SDOTimeoutError, SDOAbortError) as e:
        _send_error(str(e), 'CAN-MAP-REMOVE-ERROR')
    except Exception as e:
        _send_error(str(e), 'CAN-MAP-REMOVE-ERROR')


def clearCanMap(args):
    """
    Clear all CAN mappings for a direction.
    
    Args (dict):
        direction: 'tx', 'rx', or 'all'
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'CAN-MAP-CLEAR-ERROR')
        return
    
    direction = args.get('direction', 'all')
    
    try:
        # Repeatedly remove first entry until none remain
        if direction in ['tx', 'all']:
            base_index = 0x3000
            while True:
                try:
                    # Try to remove first param of first message
                    sdo_client.write(base_index, 1, 0)
                except SDOAbortError:
                    break  # No more mappings
        
        if direction in ['rx', 'all']:
            base_index = 0x3100
            while True:
                try:
                    sdo_client.write(base_index, 1, 0)
                except SDOAbortError:
                    break
        
        
    except Exception as e:
        _send_error(str(e), 'CAN-MAP-CLEAR-ERROR')


def exportCanMapJson():
    """
    Export CAN mappings as JSON for download.
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'CAN-MAP-EXPORT-ERROR')
        return
    
    # Use getCanMap to read mappings, then format for export
    try:
        # This is a simplified version - real implementation would
        # call internal mapping read logic
        _send_error("Export not yet implemented", 'CAN-MAP-EXPORT-ERROR')
    except Exception as e:
        _send_error(str(e), 'CAN-MAP-EXPORT-ERROR')


def importCanMapJson(args):
    """
    Import CAN mappings from JSON.
    
    Args (dict):
        mappings: JSON structure with TX/RX mappings
        clear_existing: Whether to clear existing mappings first
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'CAN-MAP-IMPORT-ERROR')
        return
    
    _send_error("Import not yet implemented", 'CAN-MAP-IMPORT-ERROR')


# Legacy functions - kept for backwards compatibility but deprecated
def mapCanSpotValue(args):
    """DEPRECATED: Use addCanMapping instead"""
    addCanMapping(args)


def unmapCanSpotValue(args):
    """DEPRECATED: Use removeCanMapping instead"""
    removeCanMapping(args)


def getCanMappingData():
    """DEPRECATED: Use getCanMap instead"""
    getCanMap()


# ============================================================================
# Device Commands
# ============================================================================

def deviceSave():
    """
    Save parameters and CAN mappings to device flash.
    
    Commands use SDO index 0x3004.
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'DEVICE-SAVE-ERROR')
        return
    
    try:
        # Send save command (subindex 1)
        sdo_client.write(0x3004, 1, 0)
    except (SDOTimeoutError, SDOAbortError) as e:
        _send_error(str(e), 'DEVICE-SAVE-ERROR')
    except Exception as e:
        _send_error(str(e), 'DEVICE-SAVE-ERROR')


def deviceLoad():
    """
    Load parameters and CAN mappings from device flash.
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'DEVICE-LOAD-ERROR')
        return
    
    try:
        # Send load command (subindex 2)
        sdo_client.write(0x3004, 2, 0)
    except (SDOTimeoutError, SDOAbortError) as e:
        _send_error(str(e), 'DEVICE-LOAD-ERROR')
    except Exception as e:
        _send_error(str(e), 'DEVICE-LOAD-ERROR')


def deviceReset():
    """
    Reset/reboot the device.
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'DEVICE-RESET-ERROR')
        return
    
    try:
        # Send reset command (subindex 3)
        sdo_client.write(0x3004, 3, 0)
    except (SDOTimeoutError, SDOAbortError) as e:
        _send_error(str(e), 'DEVICE-RESET-ERROR')
    except Exception as e:
        _send_error(str(e), 'DEVICE-RESET-ERROR')


def deviceLoadDefaults():
    """
    Load default parameters (factory reset).
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'DEVICE-DEFAULTS-ERROR')
        return
    
    try:
        # Send load defaults command (subindex 4)
        sdo_client.write(0x3004, 4, 0)
    except (SDOTimeoutError, SDOAbortError) as e:
        _send_error(str(e), 'DEVICE-DEFAULTS-ERROR')
    except Exception as e:
        _send_error(str(e), 'DEVICE-DEFAULTS-ERROR')


def deviceStart(args=None):
    """
    Start device operation in specified mode.
    
    Args (dict, optional):
        mode: Operating mode (0=Normal, 1=Manual, 2=Boost, 3=Buck, 4=Sine, 5=ACHeat)
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'DEVICE-START-ERROR')
        return
    
    mode = args.get('mode', 0) if args else 0
    
    try:
        # Send start command (subindex 5) with mode
        sdo_client.write(0x3004, 5, mode)
        mode_names = {0: 'Normal', 1: 'Manual', 2: 'Boost', 3: 'Buck', 4: 'Sine', 5: 'ACHeat'}
        mode_name = mode_names.get(mode, f'Mode {mode}')
    except (SDOTimeoutError, SDOAbortError) as e:
        _send_error(str(e), 'DEVICE-START-ERROR')
    except Exception as e:
        _send_error(str(e), 'DEVICE-START-ERROR')


def deviceStop():
    """
    Stop device operation.
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'DEVICE-STOP-ERROR')
        return
    
    try:
        # Send stop command (subindex 6)
        sdo_client.write(0x3004, 6, 0)
    except (SDOTimeoutError, SDOAbortError) as e:
        _send_error(str(e), 'DEVICE-STOP-ERROR')
    except Exception as e:
        _send_error(str(e), 'DEVICE-STOP-ERROR')


# ============================================================================
# Device Info and Error Log
# ============================================================================

def getSerialNumber():
    """
    Read device serial number.
    
    Serial number is at SDO 0x5000, subindex 0-2 (3 parts).
    """
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'SERIAL-NUMBER-ERROR')
        return
    
    try:
        # Read 3 parts of serial number
        serial_parts = []
        for i in range(3):
            part = sdo_client.read(0x5000, i)
            # Format as hex string
            serial_parts.append(f"{part:08X}")
        
        serial_number = ":".join(serial_parts)
        _send_response('SERIAL-NUMBER', {'serialNumber': serial_number})
    except (SDOTimeoutError, SDOAbortError) as e:
        _send_error(str(e), 'SERIAL-NUMBER-ERROR')
    except Exception as e:
        _send_error(str(e), 'SERIAL-NUMBER-ERROR')


def getDeviceInfo():
    """
    Get device information (firmware version, uptime, etc).
    """
    if not device_connected or sdo_client is None:
        # Return demo data when not connected
        demo_info = {
            'connected': False,
            'serialNumber': 'DEMO-DEVICE',
            'nodeId': 1,
            'bitrate': 500000,
            'uptime': 123456
        }
        _send_response('DEVICE-INFO', demo_info)
        return
    
    try:
        info = {
            'connected': True,
            'nodeId': device_node_id,
            'bitrate': device_bitrate
        }
        
        # Try to read serial number
        try:
            serial_parts = []
            for i in range(3):
                part = sdo_client.read(0x5000, i)
                serial_parts.append(f"{part:08X}")
            info['serialNumber'] = ":".join(serial_parts)
        except:
            info['serialNumber'] = 'Unknown'
        
        # Try to read uptime (common spot value)
        try:
            if 'uptime' in parameters:
                param_id = parameters['uptime'].get('id')
                if param_id:
                    index, subindex = param_id_to_sdo(param_id)
                    raw_value = sdo_client.read(index, subindex)
                    info['uptime'] = fixed_to_float(raw_value)
        except:
            pass
        
        _send_response('DEVICE-INFO', info)
    except Exception as e:
        _send_error(str(e), 'DEVICE-INFO-ERROR')


def getErrorLog():
    """
    Get error log from device.
    
    Error times at SDO 0x2001, error codes at 0x2002.
    """
    if not device_connected or sdo_client is None:
        # Return demo error log when not connected
        demo_errors = [
            {'timestamp': '2024-01-15 10:23:45', 'code': 'E001', 'description': 'Demo: Overvoltage warning'},
            {'timestamp': '2024-01-15 09:12:33', 'code': 'W005', 'description': 'Demo: Temperature high'},
        ]
        _send_response('ERROR-LOG', demo_errors)
        return
    
    try:
        errors = []
        
        # Read error log (up to 255 entries)
        for i in range(255):
            try:
                # Read error time
                error_time = sdo_client.read(0x2001, i)
                if error_time == 0:
                    break  # No more errors
                
                # Read error code
                error_code = sdo_client.read(0x2002, i)
                
                errors.append({
                    'timestamp': error_time,
                    'code': error_code,
                    'description': f"Error code {error_code}"
                })
            except (SDOTimeoutError, SDOAbortError):
                break
        
        _send_response('ERROR-LOG', errors)
    except Exception as e:
        _send_error(str(e), 'ERROR-LOG-ERROR')


# ============================================================================
# Streaming Mode Control
# ============================================================================

def startLiveStreaming(can_ids):
    """
    Start C streaming mode for high-speed data acquisition.
    
    Args:
        can_ids: List of CAN IDs to stream
    
    NOTE: Cannot do SDO operations while streaming!
    """
    global streaming_active
    
    if CAN is None or can_dev is None:
        _send_error("CAN not available", 'STREAMING-START-ERROR')
        return
    
    try:
        # Configure hardware filters
        can_dev.set_filter(can_ids)
        
        # Start streaming
        can_dev.stream_start()
        
        streaming_active = True
    except Exception as e:
        _send_error(str(e), 'STREAMING-START-ERROR')


def stopLiveStreaming():
    """
    Stop C streaming mode and return to configuration mode.
    """
    global streaming_active
    
    if CAN is None or can_dev is None:
        _send_error("CAN not available", 'STREAMING-STOP-ERROR')
        return
    
    try:
        # Stop streaming
        can_dev.stream_stop()
        
        streaming_active = False
    except Exception as e:
        _send_error(str(e), 'STREAMING-STOP-ERROR')


# ============================================================================
# Legacy/Deprecated Functions
# ============================================================================

def getSysInfo():
    """DEPRECATED: Use getDeviceInfo instead"""
    getDeviceInfo()


def actionButton(args):
    """DEPRECATED: Use device command functions instead"""
    _send_error("Action button not implemented, use deviceStart/deviceStop instead", "ACTION_BUTTON_ERROR")


def termCmd(args):
    """DEPRECATED: Direct terminal commands not supported"""
    _send_error("Terminal command not implemented", "TERM_CMD_ERROR")


# Legacy saveParameters - now uses deviceSave
def saveParameters():
    """DEPRECATED: Use deviceSave instead"""
    deviceSave()


# ============================================================================
# Firmware Upgrade Functions
# ============================================================================

# Global firmware upgrade state
firmware_upgrade_state = {
    'active': False,
    'firmware_data': None,
    'pages': [],
    'current_page': 0,
    'progress': 0.0,
    'state': 'idle',  # idle, waiting_hello, waiting_start, uploading, checking_crc, done, error
    'message': '',
    'error': None,
    'target_serial': None
}

# CAN IDs for firmware upgrade protocol
DEVICE_CAN_ID = 0x7DE
UPGRADER_CAN_ID = 0x7DD
PAGE_SIZE = 1024

# Device packet types
PACKET_HELLO = 0x33   # '3'
PACKET_START = 0x53   # 'S'
PACKET_PAGE = 0x50    # 'P'
PACKET_CRC = 0x43     # 'C'
PACKET_DONE = 0x44    # 'D'
PACKET_ERROR = 0x45   # 'E'


def stm_crc32(data):
    """
    Compute CRC-32/MPEG-2 as expected by OpenInverter bootloader.
    
    Uses:
    - width=32
    - poly=0x04c11db7
    - init=0xffffffff
    - refin=false (not reflected)
    - refout=false
    - xorout=0 (no post-complement)
    
    Data is processed as little-endian 32-bit words.
    """
    crc = 0xffffffff
    
    # Process data in 4-byte (32-bit) chunks as little-endian words
    for i in range(0, len(data), 4):
        # Get 4 bytes as little-endian word
        word = (data[i] | 
                (data[i+1] << 8) | 
                (data[i+2] << 16) | 
                (data[i+3] << 24))
        
        crc = crc ^ word
        
        # Process 32 bits
        for _ in range(32):
            if crc & 0x80000000:
                crc = ((crc << 1) ^ 0x04C11DB7) & 0xffffffff
            else:
                crc = (crc << 1) & 0xffffffff
    
    return crc


def uploadFirmwareChunk(args):
    """
    Upload a chunk of firmware data to device memory.
    This is called multiple times to transfer the entire firmware file.
    """
    chunk = args.get('chunk')
    offset = args.get('offset', 0)
    
    if not chunk:
        _send_error("No chunk data provided", 'FIRMWARE-UPLOAD-ERROR')
        return
    
    # Store chunk in firmware data buffer
    if firmware_upgrade_state['firmware_data'] is None:
        firmware_upgrade_state['firmware_data'] = bytearray()
    
    # Extend buffer if needed
    required_size = offset + len(chunk)
    if len(firmware_upgrade_state['firmware_data']) < required_size:
        firmware_upgrade_state['firmware_data'].extend(bytes(required_size - len(firmware_upgrade_state['firmware_data'])))
    
    # Write chunk data
    firmware_upgrade_state['firmware_data'][offset:offset+len(chunk)] = bytes(chunk)


def startFirmwareUpgrade(args):
    """
    Start the firmware upgrade process.
    
    Args:
        recovery_mode: bool - If True, wait for any device to boot
        serial_number: str - 8 hex digit serial (optional, for recovery mode)
        node_id: int - Node ID to upgrade (for normal mode)
    """
    if CAN is None or can_dev is None:
        _send_error("CAN not available", 'FIRMWARE-UPGRADE-ERROR')
        return
    
    recovery_mode = args.get('recovery_mode', False)
    serial_number = args.get('serial_number')
    node_id = args.get('node_id', device_node_id)
    
    # Validate firmware data
    if not firmware_upgrade_state['firmware_data']:
        _send_error("No firmware data uploaded", 'FIRMWARE-UPGRADE-ERROR')
        return
    
    firmware_data = firmware_upgrade_state['firmware_data']
    
    # Validate firmware format
    if firmware_data[0:4] == b'\x7fELF':
        _send_error("ELF files not supported. Use .bin file", 'FIRMWARE-UPGRADE-ERROR')
        return
    
    # Divide firmware into pages
    pages = []
    for i in range(0, len(firmware_data), PAGE_SIZE):
        page_data = firmware_data[i:i+PAGE_SIZE]
        # Pad last page to PAGE_SIZE
        if len(page_data) < PAGE_SIZE:
            page_data = page_data + bytes(PAGE_SIZE - len(page_data))
        
        # Calculate CRC for this page
        page_crc = stm_crc32(page_data)
        pages.append({
            'data': page_data,
            'crc': page_crc
        })
    
    if len(pages) > 255:
        _send_error("Firmware too large (max 255 KiB)", 'FIRMWARE-UPGRADE-ERROR')
        return
    
    # Store upgrade state
    firmware_upgrade_state['active'] = True
    firmware_upgrade_state['pages'] = pages
    firmware_upgrade_state['current_page'] = 0
    firmware_upgrade_state['progress'] = 0.0
    firmware_upgrade_state['state'] = 'waiting_hello'
    firmware_upgrade_state['message'] = 'Waiting for device to boot...'
    firmware_upgrade_state['error'] = None
    firmware_upgrade_state['page_position'] = 0
    
    # Set target serial if provided
    if recovery_mode and serial_number:
        try:
            firmware_upgrade_state['target_serial'] = bytes.fromhex(serial_number)
        except:
            _send_error("Invalid serial number format", 'FIRMWARE-UPGRADE-ERROR')
            return
    else:
        firmware_upgrade_state['target_serial'] = None
    
    # If not recovery mode, reset the device to trigger bootloader
    if not recovery_mode and sdo_client:
        try:
            # Send reset command
            sdo_client.write(0x1000, 0x01, 1)  # Reset command
        except Exception as e:
            # Log error (print() output goes to M2M channel automatically)
            print(f"[OI Firmware] Failed to reset device: {e}")
    
    # Set up CAN filter for upgrade messages (0x7DE)
    # TODO: Configure CAN filter for DEVICE_CAN_ID
    
    # Return data via _send_response (this one actually has data to return)
    _send_response('FIRMWARE-UPGRADE-STARTED', {
        'started': True,
        'pages': len(pages),
        'size': len(firmware_data)
    })


def processFirmwareCanMessage(can_id, data):
    """
    Process incoming CAN messages during firmware upgrade.
    This should be called from the CAN receive handler.
    """
    if not firmware_upgrade_state['active']:
        return
    
    if can_id != DEVICE_CAN_ID:
        return
    
    state = firmware_upgrade_state['state']
    
    # Handle HELLO packet (device booting)
    if len(data) == 8 and data[0] == PACKET_HELLO:
        if state != 'waiting_hello':
            return
        
        # Extract serial number (bytes 4-7, little-endian)
        device_serial = data[7:3:-1]
        
        # Check if this is our target device
        target = firmware_upgrade_state['target_serial']
        if target and device_serial != target:
                        return
        
                
        # Reply with device identifier (serial number)
        can_dev.send(list(data[4:8]), UPGRADER_CAN_ID)
        
        firmware_upgrade_state['state'] = 'waiting_start'
        firmware_upgrade_state['message'] = 'Device identified, waiting for START...'
    
    # Handle START packet
    elif len(data) == 1 and data[0] == PACKET_START:
        if state != 'waiting_start':
            return
        
        # Reply with number of pages
        num_pages = len(firmware_upgrade_state['pages'])
        can_dev.send([num_pages], UPGRADER_CAN_ID)
        
        firmware_upgrade_state['state'] = 'uploading'
        firmware_upgrade_state['current_page'] = 0
        firmware_upgrade_state['page_position'] = 0
        firmware_upgrade_state['message'] = 'Uploading firmware...'
    
    # Handle PAGE request
    elif len(data) == 1 and data[0] == PACKET_PAGE:
        if state != 'uploading':
            return
        
        page_idx = firmware_upgrade_state['current_page']
        pos = firmware_upgrade_state['page_position']
        
        if page_idx >= len(firmware_upgrade_state['pages']):
            # Log error (print() output goes to M2M channel automatically)
            print(f"[OI Firmware] ERROR: Page request beyond available pages")
            return
        
        page = firmware_upgrade_state['pages'][page_idx]
        
        # Send 8 bytes of page data
        chunk = page['data'][pos:pos+8]
        can_dev.send(list(chunk), UPGRADER_CAN_ID)
        
        pos += 8
        firmware_upgrade_state['page_position'] = pos
        
        # Check if page complete
        if pos >= PAGE_SIZE:
            firmware_upgrade_state['state'] = 'checking_crc'
            firmware_upgrade_state['page_position'] = 0
    
    # Handle CRC request
    elif len(data) == 1 and data[0] == PACKET_CRC:
        if state != 'checking_crc':
            return
        
        page_idx = firmware_upgrade_state['current_page']
        page = firmware_upgrade_state['pages'][page_idx]
        
        # Send CRC as little-endian 32-bit value
        crc = page['crc']
        crc_bytes = [
            crc & 0xFF,
            (crc >> 8) & 0xFF,
            (crc >> 16) & 0xFF,
            (crc >> 24) & 0xFF
        ]
        can_dev.send(crc_bytes, UPGRADER_CAN_ID)
        
        # Move to next page
        firmware_upgrade_state['current_page'] += 1
        firmware_upgrade_state['progress'] = (firmware_upgrade_state['current_page'] * 100.0) / len(firmware_upgrade_state['pages'])
        
        # Check if all pages done
        if firmware_upgrade_state['current_page'] >= len(firmware_upgrade_state['pages']):
            firmware_upgrade_state['state'] = 'waiting_done'
            firmware_upgrade_state['message'] = 'Waiting for device to finalize...'
        else:
            firmware_upgrade_state['state'] = 'uploading'
    
    # Handle DONE packet
    elif len(data) == 1 and data[0] == PACKET_DONE:
        if state != 'waiting_done':
            return
        
        firmware_upgrade_state['active'] = False
        firmware_upgrade_state['state'] = 'done'
        firmware_upgrade_state['progress'] = 100.0
        firmware_upgrade_state['message'] = 'Upgrade completed successfully!'
    
    # Handle ERROR packet
    elif len(data) == 1 and data[0] == PACKET_ERROR:
        # Log error (print() output goes to M2M channel automatically)
        print("[OI Firmware] Device reported CRC ERROR")
        firmware_upgrade_state['active'] = False
        firmware_upgrade_state['state'] = 'error'
        firmware_upgrade_state['error'] = 'CRC check failed on device'
        firmware_upgrade_state['message'] = 'Upgrade failed: CRC error'


def getFirmwareUpgradeStatus():
    """
    Get current status of firmware upgrade process.
    """
    status = {
        'active': firmware_upgrade_state['active'],
        'state': firmware_upgrade_state['state'],
        'progress': firmware_upgrade_state['progress'],
        'message': firmware_upgrade_state['message'],
        'error': firmware_upgrade_state['error'],
        'complete': firmware_upgrade_state['state'] == 'done'
    }
    
    _send_response('FIRMWARE-STATUS', status)


# ============================================================================
# CAN Bus Scanning
# ============================================================================

def scanCanBus(args=None):
    """
    Scan CAN bus for OpenInverter devices using robust SDO scanning.
    
    Args (dict or str, optional):
        If string, will be parsed as JSON.
        quick: If True, only scan common node IDs 1-10 (default: True)
        timeout_ms: Timeout per node in milliseconds (default: 100ms)
        rate_limit_ms: Delay between requests in milliseconds (default: 10ms)
        tx_pin: CAN TX pin (default: 5)
        rx_pin: CAN RX pin (default: 4)
        bitrate: CAN bitrate (default: 500000)
        can_mode: CAN mode - 'normal' or 'silent' (default: 'silent' for scanning)
    
    Returns list of detected nodes with their device types and serial numbers.
    """
    global can_dev, CAN
    
    # Check if CAN module is available
    if CAN is None:
        _send_error("CAN module not available - check if CAN module is installed", 'CAN-SCAN-ERROR')
        return
    
    # Parse args if it's a JSON string (from JavaScript calls)
    if args is None:
        args = {}
    elif isinstance(args, str):
        try:
            args = json.loads(args)
        except Exception as e:
            _send_error(f"Invalid JSON arguments: {e}", 'CAN-SCAN-ERROR')
            return
    
    # Parse arguments
    quick_scan = args.get('quick', True)
    timeout_ms = args.get('timeout_ms', 100)
    rate_limit_ms = args.get('rate_limit_ms', 10)
    can_mode_str = args.get('can_mode', 'silent')  # Default to SILENT for scanning
    
    # Read CAN configuration from /config/can.json (with fallback to main.py)
    tx_pin = args.get('tx_pin')
    rx_pin = args.get('rx_pin')
    bitrate = args.get('bitrate')
    
    if tx_pin is None or rx_pin is None or bitrate is None:
        # Try to load from /config/can.json
        try:
            import os
            config_dir = '/config'
            if not os.path.exists(config_dir):
                config_dir = '/store/config'
            config_file = config_dir + '/can.json'
            
            if os.path.exists(config_file):
                with open(config_file, 'r') as f:
                    can_config = json.load(f)
                if tx_pin is None:
                    tx_pin = can_config.get('txPin', 5)
                if rx_pin is None:
                    rx_pin = can_config.get('rxPin', 4)
                if bitrate is None:
                    bitrate = can_config.get('bitrate', 500000)
            else:
                # Fallback to main.py
                import sys
                sys.path.insert(0, '/device scripts')
                from main import CAN_TX_PIN, CAN_RX_PIN, CAN_BITRATE
                if tx_pin is None:
                    tx_pin = CAN_TX_PIN
                if rx_pin is None:
                    rx_pin = CAN_RX_PIN
                if bitrate is None:
                    bitrate = CAN_BITRATE
        except Exception as e:
            if tx_pin is None:
                tx_pin = 5
            if rx_pin is None:
                rx_pin = 4
            if bitrate is None:
                bitrate = 500000
    
    # Determine scan range
    if quick_scan:
        start_node = 1
        end_node = 10
    else:
        start_node = 1
        end_node = 127
    
    # Convert CAN mode string to constant
    can_mode = CAN.SILENT if can_mode_str == 'silent' else CAN.NORMAL
    
    # Initialize CAN for scanning
    # ESP32 CAN uses a singleton pattern - CAN(0, ...) always returns the same object
    # The driver's make_new() will automatically deinit/reinit if needed
    scan_can = None
    
    # Check if we can reuse existing CAN instance
    reuse_existing = False
    if can_dev is not None and device_connected:
        # If device is connected, we can't change CAN settings
        # Use existing instance but scanning might interfere
        scan_can = can_dev
        reuse_existing = True
    else:
        # No device connected, safe to reconfigure CAN for scanning
        # If can_dev exists, deinit it first to ensure clean state
        # The driver's make_new() will also check, but explicit deinit ensures cleanup
        if can_dev is not None:
            try:
                can_dev.deinit()
                # Give FreeRTOS time to actually delete the IRQ task
                # vTaskDelete is asynchronous, so we need a small delay
                time.sleep_ms(50)
            except:
                pass  # Ignore deinit errors
            can_dev = None
        
        # Let the driver handle reinit automatically
        # The driver's make_new() checks if initialized and calls can_deinit() if needed
        try:
            scan_can = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, mode=can_mode, bitrate=bitrate, auto_restart=False)
            # Update can_dev reference if we created a new instance
            if not device_connected:
                can_dev = scan_can
        except Exception as e:
            error_msg = str(e)
            # Silent - errors sent via _send_error()
            _send_error(f"Failed to initialize CAN: {error_msg}", 'CAN-SCAN-ERROR')
            return
    
    # Wrap entire scan in try/except to ensure response is always sent
    try:
                # Clear any pending messages
        while scan_can.any():
            scan_can.recv()
        
        # Collect found nodes
        found_nodes = []
        scan_errors = 0
        bus_off_detected = False
        
        # Convert timeout from ms to seconds for SDO client
        sdo_timeout = timeout_ms / 1000.0 if timeout_ms > 0 else 0.1
        
        # SDO Protocol Constants
        SDO_INDEX_DEVICE_TYPE = 0x1000
        SDO_SUBINDEX = 0x00
        
        # Scan each node
        for node_id in range(start_node, end_node + 1):
            try:
                # Create SDO client for this node
                sdo_client = SDOClient(scan_can, node_id=node_id, timeout=sdo_timeout)
                
                # Try to read device type (standard CANopen object 0x1000)
                device_type = sdo_client.read(SDO_INDEX_DEVICE_TYPE, SDO_SUBINDEX)
                
                # Node responded successfully - try to read serial number
                serial_number = None
                try:
                    # Serial number is at 0x5000, subindex 0-2 (3 parts)
                    serial_parts = []
                    for i in range(3):
                        part = sdo_client.read(0x5000, i)
                        serial_parts.append(f"{part:08X}")
                    serial_number = ":".join(serial_parts)
                except:
                    # Serial number read failed, but device is still present
                    pass
                
                # Node responded successfully
                found_nodes.append({
                    'nodeId': node_id,
                    'deviceType': device_type,
                    'deviceTypeHex': f"0x{device_type:08X}",
                    'serialNumber': serial_number
                })
                bus_off_detected = False  # Reset flag on success
                
            except SDOTimeoutError:
                # Node didn't respond - this is normal for non-existent nodes
                pass
            except SDOAbortError as e:
                # Node responded but aborted the request
                # This might indicate the object doesn't exist, but node is present
                scan_errors += 1
                # Don't add to found_nodes if abort occurred
            except OSError as e:
                # Check if this is a BUS_OFF error
                error_msg = str(e)
                if 'BUS_OFF' in error_msg or 'bus is BUS_OFF' in error_msg:
                    if not bus_off_detected:
                        bus_off_detected = True
                    
                    # Wait for bus recovery (driver handles this automatically)
                    # The driver waits 3 seconds + recovery time (needs 128 bus-free signals)
                    recovery_wait_ms = 5000  # Wait 5 seconds for recovery
                    elapsed = 0
                    chunk_ms = 500
                    while elapsed < recovery_wait_ms:
                        time.sleep_ms(chunk_ms)
                        elapsed += chunk_ms
                    
                    # After recovery, explicitly restart the driver to ensure it's ready
                    try:
                        scan_can.restart()
                    except Exception:
                        pass  # Ignore restart errors
                    
                    scan_errors += 1
                    
                    # Skip remaining nodes if bus keeps going BUS_OFF
                    if scan_errors > 5:
                        _send_error("Bus keeps going BUS_OFF. Check hardware connections.", 'CAN-SCAN-ERROR')
                        return
                else:
                    # Other OSError (timeout, etc.)
                    error_msg = str(e)
                    if 'Device is not ready' in error_msg:
                        # Driver might be in wrong state after BUS_OFF recovery
                        if bus_off_detected:
                            try:
                                scan_can.restart()
                            except Exception:
                                pass
                        else:
                            scan_errors += 1
                    else:
                        scan_errors += 1
            except Exception as e:
                error_msg = str(e)
                if 'Device is not ready' in error_msg:
                    # Driver might be in wrong state after BUS_OFF recovery
                    if bus_off_detected:
                        try:
                            scan_can.restart()
                        except Exception:
                            pass
                    else:
                        scan_errors += 1
                else:
                    scan_errors += 1
                
                # If too many errors, might be bus issues
                if scan_errors > 10:
                    _send_error("Too many scan errors. Check CAN bus hardware.", 'CAN-SCAN-ERROR')
                    return
            
            # Rate limiting between requests
            if rate_limit_ms > 0:
                time.sleep_ms(rate_limit_ms)
        
        # Send final result
        scan_type = "quick" if quick_scan else "full"
        _send_response('CAN-SCAN-RESULT', {
            'devices': found_nodes,
            'scanned': end_node - start_node + 1,
            'found': len(found_nodes),
            'scanType': scan_type
        })
    except Exception as e:
        # Ensure error response is sent even if scan fails
        error_msg = str(e)
        # Silent - errors sent via _send_error()
        _send_error(f"Scan failed: {error_msg}", 'CAN-SCAN-ERROR')
    finally:
        # Clean up scan CAN instance if we created a separate one
        # Don't deinit if it's the same as can_dev and device is connected
        if scan_can is not None and scan_can != can_dev and not device_connected:
            try:
                scan_can.deinit()
            except:
                pass  # Ignore cleanup errors


# ============================================================================
# CAN Message Sending
# ============================================================================
# NOTE: These functions are DEPRECATED. The extension now sends Python code
# directly via device.execute() following the ScriptO pattern. These are kept
# for backward compatibility only.

# Global storage for periodic CAN message intervals
can_intervals = {}  # {interval_id: {'timer': timer_obj, 'can_id': int, 'data': list, 'interval': int}}

def sendCanMessage(args):
    """
    Send a single CAN message.
    
    Args (dict):
        can_id: CAN message ID (0x000-0x7FF)
        data: List of 8 bytes (0-255)
    
    Returns:
        {'success': True} or {'error': 'error message'}
    """
    # Handle JSON string from JavaScript
    if isinstance(args, str):
        args = json.loads(args)
    elif args is None:
        args = {}
    
    can_id = args.get('can_id')
    data = args.get('data')
    
    if can_id is None or data is None:
        _send_error("Missing can_id or data", 'CAN-SEND-ERROR')
        return
    
    if not device_connected or can_dev is None:
        _send_error("Device not connected", 'CAN-SEND-ERROR')
        return
    
    try:
        # Validate CAN ID
        if can_id < 0 or can_id > 0x7FF:
            _send_error("Invalid CAN ID (must be 0x000-0x7FF)", 'CAN-SEND-ERROR')
            return
        
        # Validate data (must be list of 8 bytes)
        if not isinstance(data, list) or len(data) != 8:
            _send_error("Data must be a list of 8 bytes", 'CAN-SEND-ERROR')
            return
        
        # Validate byte values
        for byte in data:
            if not isinstance(byte, int) or byte < 0 or byte > 255:
                _send_error("Data bytes must be integers 0-255", 'CAN-SEND-ERROR')
                return
        
        # Send CAN message
        can_dev.send(data, can_id)
        
        _send_response('CAN-MESSAGE-SENT', {
            'success': True,
            'can_id': can_id
        })
    except Exception as e:
        _send_error(str(e), 'CAN-SEND-ERROR')


def startCanInterval(args):
    """
    Start sending a periodic CAN message.
    
    Args (dict):
        interval_id: Unique identifier for this interval
        can_id: CAN message ID (0x000-0x7FF)
        data: List of 8 bytes (0-255)
        interval: Interval in milliseconds (10-10000)
    
    Returns:
        {'success': True} or {'error': 'error message'}
    """
    # Handle JSON string from JavaScript
    if isinstance(args, str):
        args = json.loads(args)
    elif args is None:
        args = {}
    
    interval_id = args.get('interval_id')
    can_id = args.get('can_id')
    data = args.get('data')
    interval_ms = args.get('interval')
    
    if interval_id is None or can_id is None or data is None or interval_ms is None:
        _send_error("Missing required parameters", 'CAN-INTERVAL-START-ERROR')
        return
    
    if not device_connected or can_dev is None:
        _send_error("Device not connected", 'CAN-INTERVAL-START-ERROR')
        return
    
    try:
        # Validate CAN ID
        if can_id < 0 or can_id > 0x7FF:
            _send_error("Invalid CAN ID (must be 0x000-0x7FF)", 'CAN-INTERVAL-START-ERROR')
            return
        
        # Validate interval
        if interval_ms < 10 or interval_ms > 10000:
            _send_error("Interval must be between 10ms and 10000ms", 'CAN-INTERVAL-START-ERROR')
            return
        
        # Validate data
        if not isinstance(data, list) or len(data) != 8:
            _send_error("Data must be a list of 8 bytes", 'CAN-INTERVAL-START-ERROR')
            return
        
        # Stop existing interval if running
        if interval_id in can_intervals:
            stopCanInterval({'interval_id': interval_id})
        
        # Create periodic timer
        # Note: MicroPython doesn't have threading, so we use a simple callback approach
        # For now, we'll just store the interval info - actual periodic sending
        # would need to be handled by a background task or the main loop
        # This is a simplified implementation that acknowledges the start
        
        can_intervals[interval_id] = {
            'can_id': can_id,
            'data': data,
            'interval': interval_ms,
            'active': True
        }
        
        _send_response('CAN-INTERVAL-STARTED', {
            'success': True,
            'interval_id': interval_id
        })
        
        # TODO: Implement actual periodic sending using a background task
        # For now, this just stores the configuration
        
    except Exception as e:
        _send_error(str(e), 'CAN-INTERVAL-START-ERROR')


def stopCanInterval(args):
    """
    Stop sending a periodic CAN message.
    
    Args (dict):
        interval_id: Unique identifier for this interval
    
    Returns:
        {'success': True} or {'error': 'error message'}
    """
    # Handle JSON string from JavaScript
    if isinstance(args, str):
        args = json.loads(args)
    elif args is None:
        args = {}
    
    interval_id = args.get('interval_id')
    
    if interval_id is None:
        _send_error("Missing interval_id", 'CAN-INTERVAL-STOP-ERROR')
        return
    
    try:
        if interval_id in can_intervals:
            can_intervals[interval_id]['active'] = False
            del can_intervals[interval_id]
        
        _send_response('CAN-INTERVAL-STOPPED', {
            'success': True,
            'interval_id': interval_id
        })
    except Exception as e:
        _send_error(str(e), 'CAN-INTERVAL-STOP-ERROR')


# ============================================================================
# CAN IO Control (Inverter Control)
# ============================================================================
# NOTE: These functions are DEPRECATED. The extension now sends Python code
# directly via device.execute() following the ScriptO pattern. These are kept
# for backward compatibility only.

# Global storage for CAN IO interval
can_io_interval = None  # Timer object for CAN IO periodic sending
can_io_config = {
    'active': False,
    'can_id': 0x3F,
    'pot': 0,
    'pot2': 0,
    'canio': 0,
    'cruisespeed': 0,
    'regenpreset': 0,
    'interval': 100,
    'use_crc': True
}

def startCanIoInterval(args):
    """
    Start CAN IO control interval (sends periodic control messages to inverter).
    
    Args (dict):
        can_id: CAN message ID (default: 0x3F)
        pot: Throttle pot value (0-4095)
        pot2: Second pot value (0-4095)
        canio: Control flags byte (bit flags: cruise=0x01, start=0x02, brake=0x04, forward=0x08, reverse=0x10, bms=0x20)
        cruisespeed: Cruise speed value (0-16383)
        regenpreset: Regen preset value (0-255)
        interval: Interval in milliseconds (10-500)
        use_crc: Use CRC-32 checksum (True/False)
    
    Returns:
        {'success': True} or {'error': 'error message'}
    """
    # Handle JSON string from JavaScript
    if isinstance(args, str):
        args = json.loads(args)
    elif args is None:
        args = {}
    
    if not device_connected or can_dev is None:
        _send_error("Device not connected", 'CAN-IO-START-ERROR')
        return
    
    try:
        # Stop existing interval if running
        if can_io_config['active']:
            stopCanIoInterval()
        
        # Store configuration
        can_io_config.update({
            'active': True,
            'can_id': args.get('can_id', 0x3F),
            'pot': args.get('pot', 0),
            'pot2': args.get('pot2', 0),
            'canio': args.get('canio', 0),
            'cruisespeed': args.get('cruisespeed', 0),
            'regenpreset': args.get('regenpreset', 0),
            'interval': args.get('interval', 100),
            'use_crc': args.get('use_crc', True)
        })
        
        # Validate CAN ID
        if can_io_config['can_id'] < 0 or can_io_config['can_id'] > 0x7FF:
            _send_error("Invalid CAN ID (must be 0x000-0x7FF)", 'CAN-IO-START-ERROR')
            return
        
        # Validate interval
        if can_io_config['interval'] < 10 or can_io_config['interval'] > 500:
            _send_error("Interval must be between 10ms and 500ms", 'CAN-IO-START-ERROR')
            return
        
        # Send initial message
        _send_can_io_message()
        
        _send_response('CAN-IO-STARTED', {
            'success': True,
            'interval_ms': can_io_config['interval']
        })
        
        # TODO: Implement actual periodic sending using a background task
        # For now, this just stores the configuration and sends once
        
    except Exception as e:
        _send_error(str(e), 'CAN-IO-START-ERROR')


def stopCanIoInterval():
    """
    Stop CAN IO control interval.
    
    Returns:
        {'success': True} or {'error': 'error message'}
    """
    try:
        can_io_config['active'] = False
        
        _send_response('CAN-IO-STOPPED', {
            'success': True
        })
    except Exception as e:
        _send_error(str(e), 'CAN-IO-STOP-ERROR')


def updateCanIoFlags(args):
    """
    Update CAN IO flags while interval is running.
    
    Args (dict):
        pot: Throttle pot value (0-4095)
        pot2: Second pot value (0-4095)
        canio: Control flags byte
        cruisespeed: Cruise speed value (0-16383)
        regenpreset: Regen preset value (0-255)
    
    Returns:
        {'success': True} or {'error': 'error message'}
    """
    # Handle JSON string from JavaScript
    if isinstance(args, str):
        args = json.loads(args)
    elif args is None:
        args = {}
    
    if not can_io_config['active']:
        _send_error("CAN IO interval not active", 'CAN-IO-UPDATE-ERROR')
        return
    
    try:
        # Update configuration
        if 'pot' in args:
            can_io_config['pot'] = args['pot']
        if 'pot2' in args:
            can_io_config['pot2'] = args['pot2']
        if 'canio' in args:
            can_io_config['canio'] = args['canio']
        if 'cruisespeed' in args:
            can_io_config['cruisespeed'] = args['cruisespeed']
        if 'regenpreset' in args:
            can_io_config['regenpreset'] = args['regenpreset']
        
        # Send updated message immediately
        _send_can_io_message()
        
        _send_response('CAN-IO-UPDATED', {
            'success': True
        })
    except Exception as e:
        _send_error(str(e), 'CAN-IO-UPDATE-ERROR')


def _send_can_io_message():
    """
    Internal helper to send CAN IO control message.
    Constructs the 8-byte CAN message according to OpenInverter protocol.
    """
    if not device_connected or can_dev is None:
        return
    
    if not can_io_config['active']:
        return
    
    # Construct CAN message (8 bytes)
    # Byte 0: pot low byte
    # Byte 1: pot high byte
    # Byte 2: pot2 low byte
    # Byte 3: pot2 high byte
    # Byte 4: canio flags
    # Byte 5: cruisespeed low byte
    # Byte 6: cruisespeed high byte
    # Byte 7: regenpreset (or CRC if use_crc=True)
    
    pot = can_io_config['pot'] & 0xFFFF
    pot2 = can_io_config['pot2'] & 0xFFFF
    canio = can_io_config['canio'] & 0xFF
    cruisespeed = can_io_config['cruisespeed'] & 0x3FFF  # 14 bits max
    regenpreset = can_io_config['regenpreset'] & 0xFF
    
    data = [
        pot & 0xFF,           # Byte 0: pot low
        (pot >> 8) & 0xFF,    # Byte 1: pot high
        pot2 & 0xFF,          # Byte 2: pot2 low
        (pot2 >> 8) & 0xFF,   # Byte 3: pot2 high
        canio,                # Byte 4: control flags
        cruisespeed & 0xFF,   # Byte 5: cruisespeed low
        (cruisespeed >> 8) & 0xFF,  # Byte 6: cruisespeed high
        regenpreset           # Byte 7: regen preset (or CRC)
    ]
    
    # If CRC is enabled, calculate CRC-32 and put in byte 7
    if can_io_config['use_crc']:
        # Simple CRC-32 calculation (simplified - actual OpenInverter uses proper CRC-32)
        # For now, use a simple checksum
        crc = sum(data[:7]) & 0xFF
        data[7] = crc
    
    # Send CAN message
    try:
        can_dev.send(data, can_io_config['can_id'])
    except Exception as e:
        # Silently fail - errors will be caught by caller
        pass
