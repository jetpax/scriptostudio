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
      # For parameters only:
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

# --- Global Parameters/Spot Values Store (Demo Data) ---
# This would typically be loaded from persistent storage (NVS, JSON file, etc.)
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


def getOiParams():
    """
    Get list of all parameters (isparam=True).
    Sends the result directly to the WebREPL client as JSON.
    """
    param_list = {}
    
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
    """
    spot_list = {}
    
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
    """
    # Note: Avoid print() here as it interferes with JSON response in WebREPL
    
    response_values = {}
    current_time = int(time.time())  # Unix timestamp
    
    if isinstance(args, list) and len(args) > 0:
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


def mapCanSpotValue(args):
    """
    Map a spot value to CAN bus.
    
    Args (dict):
        NAME: Spot value name
        CANID: CAN message ID
        POS: Position in CAN message (bits)
        BITS: Number of bits
        GAIN: Scaling factor
        ISTX: True if transmitted, False if received
    """
    name = args.get('NAME')
    can_id = args.get('CANID')
    pos = args.get('POS')
    bits = args.get('BITS')
    gain = args.get('GAIN')
    is_tx = args.get('ISTX')
    
    if name is None:
        _send_error("Missing NAME for MAP-CAN-SPOT-VALUE", "MAP_CAN_ERROR")
        return
    
    if can_id is None or pos is None or bits is None or gain is None or is_tx is None:
        _send_error(f"Missing CAN mapping details (ID, POS, BITS, GAIN, ISTX) for {name}", "MAP_CAN_ERROR")
        return
    
    if name in parameters:
        item = parameters[name]
        
        # Ensure it's a spot value (not a parameter)
        if item.get('isparam') != True:
            item['canId'] = can_id
            item['canPosition'] = pos
            item['canBits'] = bits
            item['canGain'] = gain
            item['isTx'] = is_tx
            
            print(f"[OI] {name} mapped to CAN: ID={can_id}, Pos={pos}, Bits={bits}, Gain={gain}, Tx={is_tx}")
            _send_success(f"{name} mapped successfully.", "MAP_CAN_SPOT_VALUE_RESULT")
        else:
            _send_error(f"Cannot map parameter '{name}' using spot value command.", "MAP_CAN_ERROR")
    else:
        _send_error(f"Spot value '{name}' not found.", "MAP_CAN_ERROR")


def unmapCanSpotValue(args):
    """
    Remove CAN mapping from a spot value.
    
    Args (dict):
        NAME: Spot value name
    """
    name = args.get('NAME')
    
    if name is None:
        _send_error("Missing NAME for UNMAP-CAN-SPOT-VALUE", "UNMAP_CAN_ERROR")
        return
    
    if name in parameters:
        item = parameters[name]
        
        # Ensure it's a spot value (not a parameter)
        if item.get('isparam') != True:
            # Remove CAN mapping fields
            item.pop('canId', None)
            item.pop('canPosition', None)
            item.pop('canBits', None)
            item.pop('canGain', None)
            item.pop('isTx', None)
            
            print(f"[OI] {name} unmapped from CAN.")
            _send_success(f"{name} unmapped successfully.", "UNMAP_CAN_SPOT_VALUE_RESULT")
        else:
            _send_error(f"Cannot unmap parameter '{name}' using spot value command.", "UNMAP_CAN_ERROR")
    else:
        _send_error(f"Spot value '{name}' not found for unmapping.", "UNMAP_CAN_ERROR")


def getCanMappingData():
    """
    Get all parameters with CAN mapping information.
    Sends the entire parameters dictionary.
    """
    return _send_response("CAN-MAPPING-DATA-LIST", parameters)


def getSysInfo():
    """
    Get OpenInverter system information.
    
    TODO: Implement actual OpenInverter system info retrieval
    """
    print("[OI] STUB: Handling GET-SYS-INFO")
    
    # TODO: Implement actual system info retrieval
    # This would typically query the OpenInverter controller via CAN bus
    # or serial connection to get:
    # - Controller type/version
    # - Firmware version
    # - Operating state
    # - Error codes
    # - etc.
    
    _send_error("System info not implemented", "SYS_INFO_ERROR")


def actionButton(args):
    """
    Handle action button press.
    
    Args (dict):
        ACTION: Button action identifier
    
    TODO: Implement actual button action handling
    """
    print(f"[OI] STUB: Handling ACTION-BUTTON: {args}")
    _send_error("Action button not implemented", "ACTION_BUTTON_ERROR")


def termCmd(args):
    """
    Handle terminal command.
    
    Args (dict):
        CMD: Terminal command string
    
    TODO: Implement actual terminal command handling
    """
    print(f"[OI] STUB: Handling TERM-CMD: {args}")
    _send_error("Terminal command not implemented", "TERM_CMD_ERROR")

