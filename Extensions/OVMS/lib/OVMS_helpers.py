"""
OVMS Helper Functions
=====================

This module provides OVMS v2 server client functionality for sending
OpenInverter metrics to an OVMS server.

Client-callable functions:
- getOVMSConfig()          - Get current OVMS configuration
- setOVMSConfig(args)      - Set OVMS configuration
- getOVMSMetrics()          - Get current metrics store
- startOVMS()              - Start OVMS client
- stopOVMS()               - Stop OVMS client
- getOVMSStatus()          - Get connection status
"""

try:
    # Silent - module initialization should not produce output
    import json
    import time
    import socket
    import struct
    import hashlib
    import base64
    import sys
    # Silent - module initialization should not produce output
    from esp32 import webrepl
    # Silent - module initialization should not produce output
except Exception as e:
    # Silent - import errors should fail fast, not produce output
    raise  # Re-raise to fail fast

# Import hmac module from local lib directory
import lib.hmac as hmac

# CAN and OBD2 imports - will be imported when needed
CAN_AVAILABLE = None
CAN = None
OBD2Client = None
OBD2TimeoutError = None
OBD2AbortError = None

# OVMS CAN connection state
_ovms_can_dev = None
_ovms_obd2_client = None
_ovms_can_connected = False
_vehicle_config = None  # Loaded from vehicle.py

# Configuration storage
_config = {
    'enabled': False,
    'server': '',
    'port': 6867,
    'vehicleid': '',
    'password': '',
    'tls': False,
    'pollinterval': 5,
    'vehicle_type': 'zombie_vcu'  # Default vehicle type
}

# Metrics store
_metrics = {}

# OVMS client state
_ovms_socket = None
_ovms_connected = False
_ovms_state = 'disconnected'  # disconnected, connecting, connected, error
_ovms_status = ''
_ovms_token = ''
_ovms_crypto_rx = None
_ovms_crypto_tx = None
_poll_task = None
_last_poll_time = 0

# Vehicle configuration will be loaded from vehicle.py module
# This allows support for multiple vehicle types (ZombieVerter, Tesla, etc.)


def _send_response(cmd, arg):
    """Internal helper to send JSON response to WebREPL client"""
    try:
        # Ensure arg is JSON-serializable (recursively handle nested dicts/lists)
        def make_serializable(obj):
            if isinstance(obj, dict):
                return {k: make_serializable(v) for k, v in obj.items()}
            elif isinstance(obj, (list, tuple)):
                return [make_serializable(item) for item in obj]
            elif isinstance(obj, (str, int, float, bool, type(None))):
                return obj
            else:
                return str(obj)  # Convert to string as fallback
        
        arg = make_serializable(arg)
        
        response = json.dumps({'CMD': cmd, 'ARG': arg})
        
        # Send via WM binary protocol (M2M_RESP opcode 0x01)
        webrepl.send_m2m(response)
    except Exception as e:
        # Send error via M2M_LOG (opcode 0x03) instead of print()
        try:
            error_msg = f"[OVMS] Error sending response: {e}, CMD: {cmd}"
            webrepl.send_m2m(error_msg, 0x03)  # M2M_LOG opcode
        except:
            pass  # Silent failure


def _send_error(message, cmd='OVMS-ERROR'):
    """Internal helper to send error response"""
    _send_response(cmd, {'error': message})


def _load_config():
    """Load configuration from file or use defaults"""
    global _config
    try:
        with open('/ovms_config.json', 'r') as f:
            saved_config = json.loads(f.read())
            _config.update(saved_config)
    except Exception as e:
        pass  # Use defaults


def _save_config():
    """Save configuration to file"""
    try:
        with open('/ovms_config.json', 'w') as f:
            f.write(json.dumps(_config))
    except Exception as e:
        pass  # Silent - errors handled by return

def listVehicles():
    """List available vehicles (command handler for testing)"""
    try:
        from vehicle import list_vehicles
        vehicles = list_vehicles()
        _send_response('VEHICLES-LIST', vehicles)
    except Exception as e:
        _send_error(f'Failed to list vehicles: {e}')

def getOVMSConfig():
    """Get current OVMS configuration"""
    _load_config()
    try:
        from vehicle import list_vehicles
        available_vehicles = list_vehicles()
    except ImportError as e:
        # Fallback if vehicle module can't be imported
        # Send error via M2M_LOG (opcode 0x03) instead of print()
        try:
            webrepl.send_m2m(f"[OVMS] Failed to import vehicle module: {e}", 0x03)
        except:
            pass
        available_vehicles = {'zombie_vcu': 'ZombieVerter VCU'}
    except Exception as e:
        # Log error but provide fallback
        # Send error via M2M_LOG (opcode 0x03) instead of print()
        try:
            webrepl.send_m2m(f"[OVMS] Error loading vehicle config: {e}", 0x03)
        except:
            pass
        available_vehicles = {'zombie_vcu': 'ZombieVerter VCU'}
    
    config_with_vehicles = _config.copy()
    config_with_vehicles['available_vehicles'] = available_vehicles
    _send_response('OVMS-CONFIG', config_with_vehicles)


def setOVMSConfig(args):
    """Set OVMS configuration
    
    Args:
        args: Dictionary with config keys:
            - enabled (bool)
            - server (string)
            - port (int)
            - vehicleid (string)
            - password (string)
            - tls (bool)
            - pollinterval (int)
    """
    global _config
    
    if not isinstance(args, dict):
        _send_error('Config must be a dictionary')
        return
    
    # Update config with provided values
    for key in ['enabled', 'server', 'port', 'vehicleid', 'password', 'tls', 'pollinterval', 'vehicle_type']:
        if key in args:
            _config[key] = args[key]
    
    # Reload vehicle config if vehicle type changed
    if 'vehicle_type' in args:
        global _vehicle_config
        _vehicle_config = None  # Force reload
    
    _save_config()
    
    # Restart if enabled and was running
    if _config['enabled'] and _ovms_connected:
        stopOVMS()
        time.sleep(1)
        startOVMS()
    elif not _config['enabled']:
        stopOVMS()
    
    _send_response('OVMS-CONFIG-UPDATED', {'success': True})


def getOVMSMetrics():
    """Get current metrics store"""
    _send_response('OVMS-METRICS', _metrics.copy())


def _load_vehicle_config():
    """Load vehicle configuration based on configured vehicle type"""
    global _vehicle_config
    
    if _vehicle_config is not None:
        return _vehicle_config
    
    try:
        from vehicle import get_vehicle_config, list_vehicles
        vehicle_type = _config.get('vehicle_type', 'zombie_vcu')
        _vehicle_config = get_vehicle_config(vehicle_type)
        if _vehicle_config is None:
                        _vehicle_config = get_vehicle_config('zombie_vcu')
        return _vehicle_config
    except ImportError as e:
        # Silent - errors handled by return None
        return None


def _init_can_for_ovms():
    """Initialize CAN bus for OVMS based on vehicle configuration"""
    global _ovms_can_dev, _ovms_obd2_client, _ovms_can_connected, CAN, CAN_AVAILABLE
    global OBD2Client, OBD2TimeoutError, OBD2AbortError, _vehicle_config
    
    if _ovms_can_connected:
        return True
    
    # Load vehicle configuration
    _vehicle_config = _load_vehicle_config()
    if _vehicle_config is None:
        # Silent - errors handled by return False
        return False
    
    # Import CAN module
    try:
        import CAN
        CAN_AVAILABLE = True
    except ImportError:
        # Silent - errors handled by return False
        CAN_AVAILABLE = False
        return False
    
    # Import OBD2 client
    try:
        from obd2_client import OBD2Client, OBD2TimeoutError, OBD2AbortError
    except ImportError:
        # Silent - errors handled by return False
        return False
    
    # Note: GVRET and CAN module now use unified CAN manager - no need to stop GVRET
    # The manager handles coordination between multiple CAN clients
    
    # Read CAN configuration from /config/can.json (with fallback to main.py)
    try:
        import os
        config_dir = '/config'
        if not os.path.exists(config_dir):
            config_dir = '/store/config'
        config_file = config_dir + '/can.json'
        
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                can_config = json.load(f)
            tx_pin = can_config.get('txPin', 5)
            rx_pin = can_config.get('rxPin', 4)
            bitrate = can_config.get('bitrate', 500000)
        else:
            # Fallback to main.py
            import sys
            sys.path.insert(0, '/device scripts')
            from main import CAN_TX_PIN, CAN_RX_PIN, CAN_BITRATE
            tx_pin = CAN_TX_PIN
            rx_pin = CAN_RX_PIN
            bitrate = CAN_BITRATE
    except Exception as e:
        # Silent - errors handled by return False
        tx_pin = 5
        rx_pin = 4
        bitrate = 500000
    
    # Initialize CAN device
    try:
        _ovms_can_dev = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, mode=CAN.NORMAL, bitrate=bitrate, auto_restart=False)
        
        # Initialize OBD2 client based on vehicle config
        tx_id = _vehicle_config.get('can_tx_id', 0x7DF)
        rx_id = _vehicle_config.get('can_rx_id', 0x7E8)
        _ovms_obd2_client = OBD2Client(_ovms_can_dev, tx_id=tx_id, rx_id=rx_id, timeout=1.0)
        
        _ovms_can_connected = True
        return True
    except Exception as e:
        # Silent - errors handled by return False
        _ovms_can_connected = False
        return False


def _get_spot_values_direct():
    """Get spot values directly from vehicle via OBD2 (independent of OpenInverter extension)"""
    global _ovms_can_connected, _ovms_obd2_client, _vehicle_config
    global OBD2TimeoutError, OBD2AbortError
    
    # Initialize CAN if not already done
    if not _init_can_for_ovms():
        return {}
    
    # Load vehicle config if not loaded
    if _vehicle_config is None:
        _vehicle_config = _load_vehicle_config()
        if _vehicle_config is None:
            return {}
    
    spot_list = {}
    protocol = _vehicle_config.get('protocol', 'obd2')
    metrics = _vehicle_config.get('metrics', {})
    poll_type = _vehicle_config.get('poll_type', 0x2A)
    
    try:
        # Import parse functions from vehicles module
        from vehicle import PARSE_FUNCTIONS
        
        # Read each metric via OBD2
        for name, metric_config in metrics.items():
            pid = metric_config.get('pid')
            parse_func_name = metric_config.get('parse_func')
            
            if pid is not None and parse_func_name is not None:
                parse_func = PARSE_FUNCTIONS.get(parse_func_name)
                if parse_func is None:
                    continue
                
                try:
                    # Send OBD2 request
                    response_data = _ovms_obd2_client.read_parameter(poll_type, pid)
                    
                    # Parse response using vehicle-specific parse function
                    value = parse_func(response_data)
                    
                    spot_list[name] = {
                        'value': value,
                        'unit': metric_config.get('unit', ''),
                        'timestamp': time.time()
                    }
                except (OBD2TimeoutError, OBD2AbortError) as e:
                    # Skip this value
                    pass
                except Exception as e:
                    # Skip this value
                    pass
    
    except Exception as e:
        # Silent - errors handled by return empty dict
        pass
    
    return spot_list


def _update_metrics_from_spot_values():
    """Update metrics store from OpenInverter spot values"""
    global _metrics, _last_poll_time
    
    try:
        spot_values = _get_spot_values_direct()
        current_time = time.time()
        _last_poll_time = current_time
        
        # Map OpenInverter spot values to metrics
        for name, value_data in spot_values.items():
            if isinstance(value_data, dict) and 'value' in value_data:
                _metrics[name] = {
                    'value': value_data['value'],
                    'unit': value_data.get('unit', ''),
                    'timestamp': current_time
                }
    except Exception as e:
        # Silent - errors handled by return empty dict
        pass


def _poll_loop():
    """Periodic polling loop for metrics - called periodically"""
    global _poll_task
    
    if not _config['enabled']:
        _poll_task = None
        return
    
    try:
        _update_metrics_from_spot_values()
        
        # Send metrics to server if connected
        if _ovms_connected:
            _send_metrics_to_server()
    except Exception as e:
        # Silent - errors handled by return
        pass
    
    # Note: In a real implementation, this would be called by a timer or async task
    # For now, the frontend can trigger polling by calling getOVMSMetrics()


class RC4:
    """Simple RC4 cipher implementation"""
    def __init__(self, key):
        self.S = list(range(256))
        j = 0
        for i in range(256):
            j = (j + self.S[i] + key[i % len(key)]) % 256
            self.S[i], self.S[j] = self.S[j], self.S[i]
        self.i = 0
        self.j = 0
    
    def crypt(self, data):
        """Encrypt/decrypt data"""
        result = bytearray()
        for byte in data:
            self.i = (self.i + 1) % 256
            self.j = (self.j + self.S[self.i]) % 256
            self.S[self.i], self.S[self.j] = self.S[self.j], self.S[self.i]
            K = self.S[(self.S[self.i] + self.S[self.j]) % 256]
            result.append(byte ^ K)
        return bytes(result)


def _rc4_setup(key):
    """Setup RC4 cipher state"""
    return RC4(key)


def _rc4_crypt(state, data):
    """Encrypt/decrypt data with RC4"""
    if isinstance(state, RC4):
        return state.crypt(data)
    return data


def _send_login():
    """Send login message to OVMS server"""
    global _ovms_token, _ovms_state, _ovms_status
    
    if not _ovms_socket:
        return
    
    try:
        # Generate random token
        import os
        token_bytes = os.urandom(22)
        _ovms_token = base64.b64encode(token_bytes).decode('ascii')[:22]
        
        # Send login: MP-0 L <vehicleid> <token>
        login_msg = f"MP-0 L {_config['vehicleid']} {_ovms_token}\n"
        _ovms_socket.send(login_msg.encode('ascii'))
        
        _ovms_state = 'connecting'
        _ovms_status = 'Sending login...'
    except Exception as e:
        _ovms_state = 'error'
        _ovms_status = f'Login error: {e}'
        # Silent - errors handled by state/status


def _handle_server_response(data):
    """Handle response from OVMS server"""
    global _ovms_connected, _ovms_state, _ovms_status, _ovms_crypto_rx, _ovms_crypto_tx
    
    try:
        lines = data.decode('ascii').strip().split('\n')
        for line in lines:
            if line.startswith('MP-S 0 '):
                # Server authentication response
                parts = line[7:].split(' ', 1)
                if len(parts) == 2:
                    server_token = parts[0]
                    server_digest = parts[1]
                    
                    # Verify digest
                    # HMAC-MD5 of token with password
                    h = hmac.new(_config['password'].encode('ascii'), 
                               server_token.encode('ascii'), 
                               hashlib.md5)
                    expected_digest = base64.b64encode(h.digest()).decode('ascii')
                    
                    if expected_digest == server_digest:
                        # Setup encryption
                        shared_key = _ovms_token + server_token
                        h = hmac.new(_config['password'].encode('ascii'),
                                   shared_key.encode('ascii'),
                                   hashlib.md5)
                        crypto_key = h.digest()
                        
                        _ovms_crypto_rx = _rc4_setup(crypto_key)
                        _ovms_crypto_tx = _rc4_setup(crypto_key)
                        
                        # Skip 1024 bytes (RC4 key scheduling)
                        for _ in range(1024):
                            _rc4_crypt(_ovms_crypto_rx, b'\x00')
                            _rc4_crypt(_ovms_crypto_tx, b'\x00')
                        
                        _ovms_connected = True
                        _ovms_state = 'connected'
                        _ovms_status = 'Connected to OVMS server'
                    else:
                        _ovms_state = 'error'
                        _ovms_status = 'Authentication failed'
            elif line.startswith('MP-0 '):
                # Encrypted server message
                if _ovms_crypto_rx:
                    encrypted = base64.b64decode(line[5:])
                    decrypted = _rc4_crypt(_ovms_crypto_rx, encrypted)
                    # Process decrypted message
    except Exception as e:
        # Silent - errors handled by state/status
        pass


def _send_metrics_to_server():
    """Format and send metrics to OVMS server"""
    global _ovms_socket, _ovms_crypto_tx
    
    if not _ovms_connected or not _ovms_socket:
        return
    
    try:
        # Format metrics as OVMS v2 data message
        # Format: MP-0 D <metric1>=<value1>,<metric2>=<value2>,...
        # For OpenInverter, we'll send key metrics
        metric_parts = []
        
        # Map common OpenInverter metrics to OVMS format
        # udc = DC voltage, idc = DC current, tmpm = motor temp, fout = frequency
        for name, data in _metrics.items():
            value = data.get('value', 0)
            # Format value appropriately
            if isinstance(value, float):
                value_str = f"{value:.2f}"
            else:
                value_str = str(value)
            metric_parts.append(f"{name}={value_str}")
        
        if metric_parts:
            msg = "MP-0 D " + ",".join(metric_parts) + "\n"
            
            # Encrypt message if crypto is set up
            if _ovms_crypto_tx:
                encrypted = _rc4_crypt(_ovms_crypto_tx, msg.encode('ascii'))
                encoded = base64.b64encode(encrypted).decode('ascii')
                final_msg = "MP-0 " + encoded + "\n"
            else:
                # Not encrypted yet (shouldn't happen when connected, but handle gracefully)
                final_msg = msg
            
            _ovms_socket.send(final_msg.encode('ascii'))
    except Exception as e:
        # Silent - errors handled by state/status
        pass


def checkServerMessages():
    """Check for incoming server messages (non-blocking)"""
    global _ovms_socket, _ovms_connected, _ovms_state, _ovms_status
    
    if not _ovms_connected or not _ovms_socket:
        return
    
    try:
        data = _ovms_socket.recv(4096)
        if not data:
            # Connection closed
            _ovms_connected = False
            _ovms_state = 'disconnected'
            _ovms_status = 'Connection closed'
            if _ovms_socket:
                try:
                    _ovms_socket.close()
                except:
                    pass
            _ovms_socket = None
            return
        
        _handle_server_response(data)
    except OSError as e:
        # Non-blocking socket would raise EAGAIN/EWOULDBLOCK when no data available
        # This is expected and not an error
        if e.errno != 11:  # EAGAIN/EWOULDBLOCK
            if _ovms_connected:
                # Silent - errors handled by state/status
                _ovms_connected = False
                _ovms_state = 'disconnected'
                _ovms_status = f'Connection error: {e}'
            if _ovms_socket:
                try:
                    _ovms_socket.close()
                except:
                    pass
                _ovms_socket = None
    except Exception as e:
        if _ovms_connected:
            # Silent - errors handled by state/status
            _ovms_connected = False
            _ovms_state = 'disconnected'
            _ovms_status = f'Connection error: {e}'
        if _ovms_socket:
            try:
                _ovms_socket.close()
            except:
                pass
            _ovms_socket = None


def pollMetrics():
    """Manually trigger metrics polling and send to server"""
    global _poll_task
    
    if not _config['enabled']:
        _send_error('OVMS is not enabled')
        return
    
    try:
        _poll_loop()
        _send_response('OVMS-POLLED', {'success': True, 'metrics_count': len(_metrics)})
    except Exception as e:
        _send_error(f'Poll error: {e}')


def startOVMS():
    """Start OVMS client connection"""
    global _ovms_socket, _ovms_connected, _ovms_state, _ovms_status, _poll_task
    
    if _ovms_connected:
        _send_response('OVMS-STATUS', {'status': 'already_connected'})
        return
    
    _load_config()
    
    if not _config['enabled']:
        _send_error('OVMS is not enabled in configuration')
        return
    
    if not _config['server'] or not _config['vehicleid'] or not _config['password']:
        _send_error('Server, vehicle ID, and password must be configured')
        return
    
    try:
        _ovms_state = 'connecting'
        _ovms_status = f"Connecting to {_config['server']}:{_config['port']}..."
        
        # Create socket connection
        addr = socket.getaddrinfo(_config['server'], _config['port'])[0][-1]
        _ovms_socket = socket.socket()
        _ovms_socket.connect(addr)
        _ovms_socket.setblocking(True)  # Use blocking for now
        
        # Send login
        _send_login()
        
        # Try to read initial response (with timeout)
        try:
            _ovms_socket.settimeout(5.0)
            data = _ovms_socket.recv(4096)
            if data:
                _handle_server_response(data)
        except socket.timeout:
            # No immediate response, continue
            pass
        except Exception as e:
            # Silent - errors handled by state/status
            pass
        
        # Set non-blocking for subsequent reads
        _ovms_socket.setblocking(False)
        
        # Do initial poll
        _poll_loop()
        
        _send_response('OVMS-STARTED', {'status': _ovms_state})
    except Exception as e:
        _ovms_state = 'error'
        _ovms_status = f'Connection error: {e}'
        if _ovms_socket:
            try:
                _ovms_socket.close()
            except:
                pass
            _ovms_socket = None
        _send_error(f'Failed to start: {e}')


def stopOVMS():
    """Stop OVMS client connection"""
    global _ovms_socket, _ovms_connected, _ovms_state, _ovms_status, _poll_task
    global _ovms_can_dev, _ovms_sdo_client, _ovms_can_connected
    
    if _poll_task:
        # Stop polling task if running
        _poll_task = None
    
    if _ovms_socket:
        try:
            _ovms_socket.close()
        except:
            pass
        _ovms_socket = None
    
    # Clean up CAN connection
    if _ovms_can_dev:
        try:
            _ovms_can_dev.deinit()
        except:
            pass
        _ovms_can_dev = None
        _ovms_obd2_client = None
        _ovms_can_connected = False
    
    _ovms_connected = False
    _ovms_state = 'disconnected'
    _ovms_status = 'Disconnected'
    _ovms_token = ''
    _ovms_crypto_rx = None
    _ovms_crypto_tx = None
    
    _send_response('OVMS-STOPPED', {'status': 'stopped'})


def getOVMSStatus():
    """Get OVMS connection status"""
    try:
        # Check for server messages if connected
        if _ovms_connected:
            checkServerMessages()
        
        # Trigger poll if enabled and connected
        if _config['enabled'] and _ovms_connected:
            current_time = time.time()
            if _last_poll_time == 0 or (current_time - _last_poll_time) >= _config['pollinterval']:
                _poll_loop()
        
        status = {
            'state': _ovms_state,
            'status': _ovms_status,
            'connected': _ovms_connected,
            'metrics_count': len(_metrics),
            'last_poll': _last_poll_time
        }
        _send_response('OVMS-STATUS', status)
    except Exception as e:
        # Catch any unexpected exceptions and send error response
        # Send error via M2M_LOG (opcode 0x03) instead of print()
        try:
            webrepl.send_m2m(f"[OVMS] ERROR in getOVMSStatus: {type(e).__name__}: {e}", 0x03)
        except:
            pass
        try:
            _send_error(f'Status error: {e}')
        except Exception as send_err:
            # Silent - error already occurred
            pass


# Initialize config on module load
try:
    # Silent - module initialization should not produce output
    _load_config()
    # Silent - module initialization should not produce output
except Exception as e:
    # Silent - module load errors fail silently
    pass
