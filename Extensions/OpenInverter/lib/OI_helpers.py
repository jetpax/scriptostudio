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

# Import webrepl to send responses directly to client
from esp32 import webrepl

# Try to import CAN and SDO modules (may not be available on all platforms)
try:
    import CAN
    from lib.canopen_sdo import SDOClient, fixed_to_float, float_to_fixed, param_id_to_sdo
    from lib.canopen_sdo import SDOTimeoutError, SDOAbortError
    CAN_AVAILABLE = True
except ImportError as e:
    print(f"[OI] Warning: CAN/SDO modules not available - {e}")
    print("[OI] Using demo data only. To enable device support, upload lib/canopen_sdo.py")
    CAN_AVAILABLE = False
    # Define dummy exception classes so code doesn't break
    class SDOTimeoutError(Exception):
        pass
    class SDOAbortError(Exception):
        pass
    # Define dummy classes/functions
    SDOClient = None
    fixed_to_float = lambda x: x
    float_to_fixed = lambda x: int(x)
    param_id_to_sdo = lambda x: (0, 0)

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
parameters = {
    'udc': {
        'value': 350.5, 'unit': 'V', 'isparam': False, 'category': 'Inputs',
        'canId': 500, 'canPosition': 0, 'canBits': 16, 'canGain': 0.1, 'isTx': True
    },
    'fslipspnt': {
        'value': 2.0, 'unit': 'Hz', 'isparam': True, 'category': 'Motor',
        'minimum': 0, 'maximum': 10, 'default': 1.5
    },
    'opmode': {
        'value': 1, 'unit': '', 'isparam': True, 'category': 'Control',
        'enums': {0: 'Off', 1: 'Manual', 2: 'Auto'}, 'default': 0
    },
    'fout': {
        'value': 50.1, 'unit': 'Hz', 'isparam': False, 'category': 'Outputs'
    },
    'id': {
        'value': 10.0, 'unit': 'A', 'isparam': False, 'category': 'Outputs',
        'canId': 501, 'canPosition': 0, 'canBits': 16, 'canGain': 1.0, 'isTx': False
    },
    'iq': {
        'value': 25.0, 'unit': 'A', 'isparam': False, 'category': 'Outputs'
    },
    'tmpm': {
        'value': 45, 'unit': 'C', 'isparam': False, 'category': 'Temps',
        'canId': 500, 'canPosition': 16, 'canBits': 8, 'canGain': 1.0, 'isTx': True
    },
    'kp': {
        'value': 100, 'unit': '', 'isparam': True, 'category': 'Control',
        'minimum': 0, 'maximum': 1000, 'default': 150
    },
    'ki': {
        'value': 50, 'unit': '', 'isparam': True, 'category': 'Control',
        'minimum': 0, 'maximum': 500, 'default': 80
    }
}


def _send_response(cmd, arg):
    """Internal helper to send JSON response to WebREPL client"""
    response = json.dumps({'CMD': cmd, 'ARG': arg})
    webrepl.send(response)


def _send_error(message, cmd):
    """Internal helper to send error response"""
    response = json.dumps({'CMD': cmd, 'ARG': {'error': message}})
    webrepl.send(response)


def _send_success(message, cmd):
    """Internal helper to send success response"""
    response = json.dumps({'CMD': cmd, 'ARG': {'success': True, 'message': message}})
    webrepl.send(response)


# ============================================================================
# CAN Device Initialization and Management
# ============================================================================

def initializeDevice(args=None):
    """
    Initialize CAN bus and connect to OpenInverter device.
    
    Args (dict, optional):
        node_id: CANopen node ID (default: 1)
        bitrate: CAN bus bitrate (default: 500000)
        tx_pin: TX GPIO pin (default: 5)
        rx_pin: RX GPIO pin (default: 4)
        mode: CAN mode (default: CAN.NORMAL)
    
    Returns:
        Connection status and device info
    """
    global can_dev, sdo_client, device_connected, device_node_id, device_bitrate
    
    if not CAN_AVAILABLE:
        _send_error("CAN module not available on this platform", 'INIT-DEVICE-ERROR')
        return
    
    # Parse arguments
    if args is None:
        args = {}
    
    node_id = args.get('node_id', 1)
    bitrate = args.get('bitrate', 500000)
    tx_pin = args.get('tx_pin', 5)
    rx_pin = args.get('rx_pin', 4)
    mode = args.get('mode', CAN.NORMAL)
    
    try:
        print(f"[OI] Initializing CAN: node_id={node_id}, bitrate={bitrate}, tx={tx_pin}, rx={rx_pin}")
        
        # Initialize CAN device
        can_dev = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, mode=mode, bitrate=bitrate, auto_restart=False)
        
        # Create SDO client
        sdo_client = SDOClient(can_dev, node_id=node_id, timeout=1.0)
        
        device_connected = True
        device_node_id = node_id
        device_bitrate = bitrate
        
        print(f"[OI] CAN initialized successfully")
        
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
            print(f"[OI] Warning: Device connection test failed: {e}")
            _send_response('DEVICE-INITIALIZED', {
                'success': True,
                'node_id': node_id,
                'bitrate': bitrate,
                'connected': False,
                'warning': 'CAN initialized but device not responding'
            })
            
    except Exception as e:
        print(f"[OI] Error initializing CAN: {e}")
        device_connected = False
        _send_error(f"Failed to initialize CAN: {str(e)}", 'INIT-DEVICE-ERROR')


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
    
    _send_success("Device disconnected", 'DEVICE-DISCONNECTED')


def getDeviceStatus():
    """
    Get current device connection status.
    """
    status = {
        'connected': device_connected,
        'can_available': CAN_AVAILABLE,
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
        _send_error("Device not connected", 'FETCH-PARAM-DB-ERROR')
        return
    
    try:
        print("[OI] Fetching parameter database from device...")
        
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
        print(f"[OI] Timeout fetching parameter database: {e}")
        _send_error(str(e), 'FETCH-PARAM-DB-ERROR')
    except SDOAbortError as e:
        print(f"[OI] SDO abort fetching parameter database: {e}")
        _send_error(str(e), 'FETCH-PARAM-DB-ERROR')
    except Exception as e:
        print(f"[OI] Error fetching parameter database: {e}")
        _send_error(str(e), 'FETCH-PARAM-DB-ERROR')


def loadParameterDatabase(json_db):
    """
    Load parameter database from JSON structure.
    
    Args:
        json_db: Dictionary containing parameter definitions
    
    Converts OpenInverter parameter database format to our internal format.
    """
    global parameters, param_db_cache
    
    try:
        parameters = {}
        
        for param_name, param_def in json_db.items():
            # Convert OpenInverter format to our format
            param = {
                'unit': param_def.get('unit', ''),
                'isparam': param_def.get('isparam', False),
                'category': param_def.get('category', 'Uncategorized'),
                'id': param_def.get('id')
            }
            
            # For parameters, add min/max/default
            if param['isparam']:
                param['minimum'] = param_def.get('minimum', 0)
                param['maximum'] = param_def.get('maximum', 0)
                param['default'] = param_def.get('default', 0)
            
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
                    param['enums'] = enums
            
            parameters[param_name] = param
        
        param_db_cache = json_db
        print(f"[OI] Loaded {len(parameters)} parameters from database")
        _send_success(f"Loaded {len(parameters)} parameters", 'PARAM-DB-LOADED')
        
    except Exception as e:
        print(f"[OI] Error loading parameter database: {e}")
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
    if device_connected and sdo_client and CAN_AVAILABLE:
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
                            print(f"[OI] Warning: Failed to read {key}: {e}")
                            # Keep existing value
                    
                    param_list[key] = item
        except Exception as e:
            print(f"[OI] Error reading parameters: {e}")
            # Fall back to cached values
            for key, item in parameters.items():
                if item.get('isparam') == True:
                    param_list[key] = item
    else:
        # Use demo/cached data
        for key, item in parameters.items():
            if item.get('isparam') == True:
                param_list[key] = item
    
    _send_response('PARAMETERS-LIST', param_list)


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
        
        print(f"[OI] Setting parameter: {param_name} to {param_value}")
        
        # If connected to device, write via SDO
        if device_connected and sdo_client and CAN_AVAILABLE:
            param_id = param_def.get('id')
            if param_id is not None:
                try:
                    index, subindex = param_id_to_sdo(param_id)
                    fixed_value = float_to_fixed(param_value)
                    sdo_client.write(index, subindex, fixed_value)
                    print(f"[OI] Successfully wrote {param_name} to device")
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
    print("[OI] STUB: Handling SAVE-PARAMETERS")
    # TODO: Implement actual saving logic
    # Example:
    # import json
    # with open('/flash/oi_params.json', 'w') as f:
    #     json.dump({k: v for k, v in parameters.items() if v.get('isparam')}, f)
    
    _send_success("Parameters saved (stub).", 'PARAMETERS-SAVED')


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
    Otherwise, returns demo data.
    """
    spot_list = {}
    
    # If connected to device, read actual values
    if device_connected and sdo_client and CAN_AVAILABLE:
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
                            print(f"[OI] Warning: Failed to read {key}: {e}")
                            # Keep existing value
                    
                    spot_list[key] = item
        except Exception as e:
            print(f"[OI] Error reading spot values: {e}")
            # Fall back to cached values
            for key, item in parameters.items():
                if item.get('isparam') != True:
                    spot_list[key] = item
    else:
        # Use demo/cached data
        for key, item in parameters.items():
            if item.get('isparam') != True:
                spot_list[key] = item
    
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
        if device_connected and sdo_client and CAN_AVAILABLE:
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
            # Use demo/cached data
            for var_name in args:
                if var_name in parameters:
                    item = parameters[var_name]
                    value = item['value']
                    
                    # Make sure it's a number that can be plotted
                    if isinstance(value, (int, float)):
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
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'CAN-MAP-ERROR')
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
        print(f"[OI] Error reading CAN mappings: {e}")
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
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'CAN-MAP-ADD-ERROR')
        return
    
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
    
    try:
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
        
        print(f"[OI] Added CAN mapping: {param_name} to CAN ID {can_id}")
        _send_success(f"Mapping added successfully", 'CAN-MAP-ADDED')
        
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
    if not device_connected or sdo_client is None:
        _send_error("Device not connected", 'CAN-MAP-REMOVE-ERROR')
        return
    
    direction = args.get('direction')
    msg_index = args.get('msg_index')
    param_index = args.get('param_index')
    
    if direction is None or msg_index is None or param_index is None:
        _send_error("Missing direction, msg_index, or param_index", 'CAN-MAP-REMOVE-ERROR')
        return
    
    try:
        base_index = 0x3000 if direction == 'tx' else 0x3100
        target_index = base_index + msg_index
        # Write 0 to the parameter subindex to remove it
        # Device will automatically shift remaining params
        target_subindex = 1 + (param_index * 2)
        sdo_client.write(target_index, target_subindex, 0)
        
        _send_success("Mapping removed successfully", 'CAN-MAP-REMOVED')
        
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
        
        _send_success(f"{direction} mappings cleared", 'CAN-MAP-CLEARED')
        
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
    print("[OI] Warning: mapCanSpotValue is deprecated, use addCanMapping")
    addCanMapping(args)


def unmapCanSpotValue(args):
    """DEPRECATED: Use removeCanMapping instead"""
    print("[OI] Warning: unmapCanSpotValue is deprecated, use removeCanMapping")
    removeCanMapping(args)


def getCanMappingData():
    """DEPRECATED: Use getCanMap instead"""
    print("[OI] Warning: getCanMappingData is deprecated, use getCanMap")
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
        print("[OI] Sent save command to device")
        _send_success("Parameters saved to flash", 'DEVICE-SAVED')
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
        print("[OI] Sent load command to device")
        _send_success("Parameters loaded from flash", 'DEVICE-LOADED')
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
        print("[OI] Sent reset command to device")
        _send_success("Device reset initiated", 'DEVICE-RESET')
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
        print("[OI] Sent load defaults command to device")
        _send_success("Default parameters loaded", 'DEVICE-DEFAULTS-LOADED')
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
        print(f"[OI] Sent start command to device (mode: {mode_name})")
        _send_success(f"Device started in {mode_name} mode", 'DEVICE-STARTED')
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
        print("[OI] Sent stop command to device")
        _send_success("Device stopped", 'DEVICE-STOPPED')
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
        print(f"[OI] Device serial number: {serial_number}")
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
        
        print(f"[OI] Retrieved {len(errors)} error entries")
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
    
    if not CAN_AVAILABLE or can_dev is None:
        _send_error("CAN not available", 'STREAMING-START-ERROR')
        return
    
    try:
        # Configure hardware filters
        can_dev.set_filter(can_ids)
        
        # Start streaming
        can_dev.stream_start()
        
        streaming_active = True
        print(f"[OI] Started streaming for CAN IDs: {can_ids}")
        _send_success("Streaming started", 'STREAMING-STARTED')
    except Exception as e:
        _send_error(str(e), 'STREAMING-START-ERROR')


def stopLiveStreaming():
    """
    Stop C streaming mode and return to configuration mode.
    """
    global streaming_active
    
    if not CAN_AVAILABLE or can_dev is None:
        _send_error("CAN not available", 'STREAMING-STOP-ERROR')
        return
    
    try:
        # Stop streaming
        can_dev.stream_stop()
        
        streaming_active = False
        print("[OI] Stopped streaming")
        _send_success("Streaming stopped", 'STREAMING-STOPPED')
    except Exception as e:
        _send_error(str(e), 'STREAMING-STOP-ERROR')


# ============================================================================
# Legacy/Deprecated Functions
# ============================================================================

def getSysInfo():
    """DEPRECATED: Use getDeviceInfo instead"""
    print("[OI] Warning: getSysInfo is deprecated, use getDeviceInfo")
    getDeviceInfo()


def actionButton(args):
    """DEPRECATED: Use device command functions instead"""
    print(f"[OI] STUB: Handling ACTION-BUTTON: {args}")
    _send_error("Action button not implemented, use deviceStart/deviceStop instead", "ACTION_BUTTON_ERROR")


def termCmd(args):
    """DEPRECATED: Direct terminal commands not supported"""
    print(f"[OI] STUB: Handling TERM-CMD: {args}")
    _send_error("Terminal command not implemented", "TERM_CMD_ERROR")


# Legacy saveParameters - now uses deviceSave
def saveParameters():
    """DEPRECATED: Use deviceSave instead"""
    print("[OI] Warning: saveParameters is deprecated, use deviceSave")
    deviceSave()


# ============================================================================
# CAN Bus Scanning
# ============================================================================

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
    
    print(f"[OI Firmware] Uploaded chunk at offset {offset}, size {len(chunk)}")
    _send_success("Chunk uploaded", 'FIRMWARE-CHUNK-UPLOADED')


def startFirmwareUpgrade(args):
    """
    Start the firmware upgrade process.
    
    Args:
        recovery_mode: bool - If True, wait for any device to boot
        serial_number: str - 8 hex digit serial (optional, for recovery mode)
        node_id: int - Node ID to upgrade (for normal mode)
    """
    if not CAN_AVAILABLE or can_dev is None:
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
            print("[OI Firmware] Device reset sent")
        except Exception as e:
            print(f"[OI Firmware] Failed to reset device: {e}")
    
    # Set up CAN filter for upgrade messages (0x7DE)
    # TODO: Configure CAN filter for DEVICE_CAN_ID
    
    print(f"[OI Firmware] Upgrade started: {len(pages)} pages, recovery={recovery_mode}")
    _send_success({
        'started': True,
        'pages': len(pages),
        'size': len(firmware_data)
    }, 'FIRMWARE-UPGRADE-STARTED')


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
            print(f"[OI Firmware] Wrong device, ignoring")
            return
        
        print(f"[OI Firmware] Device HELLO received, serial: {device_serial.hex()}")
        
        # Reply with device identifier (serial number)
        can_dev.send(list(data[4:8]), UPGRADER_CAN_ID)
        
        firmware_upgrade_state['state'] = 'waiting_start'
        firmware_upgrade_state['message'] = 'Device identified, waiting for START...'
    
    # Handle START packet
    elif len(data) == 1 and data[0] == PACKET_START:
        if state != 'waiting_start':
            return
        
        print(f"[OI Firmware] Device START received")
        
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
            print(f"[OI Firmware] Page {page_idx} uploaded, waiting for CRC check")
    
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
        
        print(f"[OI Firmware] Sent CRC for page {page_idx}: 0x{crc:08X}")
        
        # Move to next page
        firmware_upgrade_state['current_page'] += 1
        firmware_upgrade_state['progress'] = (firmware_upgrade_state['current_page'] * 100.0) / len(firmware_upgrade_state['pages'])
        
        # Check if all pages done
        if firmware_upgrade_state['current_page'] >= len(firmware_upgrade_state['pages']):
            firmware_upgrade_state['state'] = 'waiting_done'
            firmware_upgrade_state['message'] = 'Waiting for device to finalize...'
            print(f"[OI Firmware] All pages uploaded, waiting for DONE")
        else:
            firmware_upgrade_state['state'] = 'uploading'
    
    # Handle DONE packet
    elif len(data) == 1 and data[0] == PACKET_DONE:
        if state != 'waiting_done':
            return
        
        print(f"[OI Firmware] Upgrade COMPLETE!")
        firmware_upgrade_state['active'] = False
        firmware_upgrade_state['state'] = 'done'
        firmware_upgrade_state['progress'] = 100.0
        firmware_upgrade_state['message'] = 'Upgrade completed successfully!'
    
    # Handle ERROR packet
    elif len(data) == 1 and data[0] == PACKET_ERROR:
        print(f"[OI Firmware] Device reported CRC ERROR")
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
    Scan CAN bus for OpenInverter devices.
    
    Args (dict, optional):
        node_ids: List of node IDs to scan (default: 1-10 for quick scan, or 1-127 for full)
        timeout: Timeout per node in milliseconds (default: 100ms)
        quick: If True, only scan common node IDs 1-10 (default: True)
        tx_pin: CAN TX pin (default: 5)
        rx_pin: CAN RX pin (default: 4)
        bitrate: CAN bitrate (default: 500000)
    
    Returns list of detected nodes with their SDO responses.
    """
    global can_dev
    
    if not CAN_AVAILABLE:
        _send_error("CAN module not available", 'CAN-SCAN-ERROR')
        return
    
    # Initialize CAN if not already initialized
    if can_dev is None:
        if args is None:
            args = {}
        tx_pin = args.get('tx_pin', 5)
        rx_pin = args.get('rx_pin', 4)
        bitrate = args.get('bitrate', 500000)
        
        try:
            print(f"[OI] Auto-initializing CAN for scan: tx={tx_pin}, rx={rx_pin}, bitrate={bitrate}")
            can_dev = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, mode=CAN.NORMAL, bitrate=bitrate, auto_restart=False)
            print("[OI] CAN initialized successfully")
        except Exception as e:
            print(f"[OI] Failed to initialize CAN: {e}")
            _send_error(f"Failed to initialize CAN: {e}", 'CAN-SCAN-ERROR')
            return
    
    # Default to quick scan (nodes 1-10) for better UX
    quick_scan = args.get('quick', True) if args else True
    default_range = range(1, 11) if quick_scan else range(1, 128)
    node_ids = args.get('node_ids', list(default_range)) if args else list(default_range)
    timeout = args.get('timeout', 0.1) if args else 0.1
    
    total_nodes = len(node_ids)
    print(f"[OI] Scanning CAN bus for {total_nodes} node IDs (timeout: {timeout*1000}ms per node)")
    
    found_nodes = []
    
    for index, node_id in enumerate(node_ids):
        # Send progress update every 10 nodes or when a device is found
        if index % 10 == 0 or index == 0:
            progress = int((index / total_nodes) * 100)
            _send_response('CAN-SCAN-PROGRESS', {
                'progress': progress,
                'current': node_id,
                'total': total_nodes,
                'found': len(found_nodes)
            })
        
        try:
            # Create temporary SDO client for this node
            temp_sdo = SDOClient(can_dev, node_id=node_id, timeout=timeout)
            
            # Try to read a standard parameter (e.g., index 0x1000 - device type)
            # This is a CANopen standard object that should exist
            try:
                device_type = temp_sdo.read(0x1000, 0)
                
                # Try to read serial number too
                serial_number = None
                try:
                    # Try reading from OpenInverter serial number location
                    serial_raw = temp_sdo.read(0x5000, 0)
                    serial_number = f"{serial_raw:08X}"
                except:
                    pass
                
                # Node responded, add to list
                found_nodes.append({
                    'nodeId': node_id,
                    'serialNumber': serial_number,
                    'deviceType': device_type,
                    'responding': True
                })
                
                print(f"[OI] Found node {node_id} (device type: 0x{device_type:08X}, serial: {serial_number})")
                
                # Send immediate progress update when device found
                progress = int(((index + 1) / total_nodes) * 100)
                _send_response('CAN-SCAN-PROGRESS', {
                    'progress': progress,
                    'current': node_id,
                    'total': total_nodes,
                    'found': len(found_nodes),
                    'lastFound': node_id
                })
                
            except (SDOTimeoutError, SDOAbortError):
                # Node didn't respond or doesn't have this object
                pass
                
        except Exception as e:
            print(f"[OI] Error scanning node {node_id}: {e}")
    
    # Send final result
    scan_type = "quick" if quick_scan else "full"
    print(f"[OI] {scan_type.capitalize()} scan complete. Found {len(found_nodes)} device(s).")
    _send_response('CAN-SCAN-RESULT', {
        'devices': found_nodes,
        'scanned': total_nodes,
        'scanType': scan_type
    })

