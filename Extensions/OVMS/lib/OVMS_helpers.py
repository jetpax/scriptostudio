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

import json
import time
import socket
import struct
import hashlib
import hmac
import base64
from esp32 import webrepl

# Import OpenInverter helpers to reuse spot value queries
try:
    from lib.OI_helpers import getSpotValues
    OI_AVAILABLE = True
except ImportError:
    OI_AVAILABLE = False
    print("[OVMS] Warning: OpenInverter helpers not available")

# Configuration storage
_config = {
    'enabled': False,
    'server': '',
    'port': 6867,
    'vehicleid': '',
    'password': '',
    'tls': False,
    'pollinterval': 5
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


def _send_response(cmd, arg):
    """Internal helper to send JSON response to WebREPL client"""
    response = json.dumps({'CMD': cmd, 'ARG': arg})
    webrepl.send(response)


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
    except:
        pass  # Use defaults


def _save_config():
    """Save configuration to file"""
    try:
        with open('/ovms_config.json', 'w') as f:
            f.write(json.dumps(_config))
    except Exception as e:
        print(f"[OVMS] Error saving config: {e}")


def getOVMSConfig():
    """Get current OVMS configuration"""
    _load_config()
    _send_response('OVMS-CONFIG', _config.copy())


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
    for key in ['enabled', 'server', 'port', 'vehicleid', 'password', 'tls', 'pollinterval']:
        if key in args:
            _config[key] = args[key]
    
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


def _get_spot_values_direct():
    """Get spot values directly from OpenInverter without WebREPL response"""
    global OI_AVAILABLE
    
    if not OI_AVAILABLE:
        return {}
    
    try:
        # Import OI_helpers to access parameters directly
        from lib.OI_helpers import parameters, device_connected, sdo_client, _check_can_available
        from lib.OI_helpers import param_id_to_sdo, fixed_to_float
        from canopen_sdo import SDOTimeoutError, SDOAbortError
        
        spot_list = {}
        
        # If connected to device, read actual values
        if device_connected and sdo_client and _check_can_available():
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
                                print(f"[OVMS] Warning: Failed to read {key}: {e}")
                                # Keep existing value
                        
                        spot_list[key] = item
            except Exception as e:
                print(f"[OVMS] Error reading spot values: {e}")
                # Fall back to cached values
                for key, item in parameters.items():
                    if item.get('isparam') != True:
                        spot_list[key] = item
        else:
            # Use demo/cached data
            for key, item in parameters.items():
                if item.get('isparam') != True:
                    spot_list[key] = item
        
        return spot_list
    except ImportError:
        print("[OVMS] OpenInverter helpers not available")
        return {}
    except Exception as e:
        print(f"[OVMS] Error getting spot values: {e}")
        return {}


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
        print(f"[OVMS] Error updating metrics: {e}")


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
        print(f"[OVMS] Poll error: {e}")
    
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
        print(f"[OVMS] Login error: {e}")


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
                        print("[OVMS] Connected to server")
                    else:
                        _ovms_state = 'error'
                        _ovms_status = 'Authentication failed'
            elif line.startswith('MP-0 '):
                # Encrypted server message
                if _ovms_crypto_rx:
                    encrypted = base64.b64decode(line[5:])
                    decrypted = _rc4_crypt(_ovms_crypto_rx, encrypted)
                    # Process decrypted message
                    print(f"[OVMS] Server message: {decrypted.decode('ascii', errors='ignore')}")
    except Exception as e:
        print(f"[OVMS] Error handling server response: {e}")


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
        print(f"[OVMS] Error sending metrics: {e}")


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
                print(f"[OVMS] Socket read error: {e}")
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
            print(f"[OVMS] Error checking messages: {e}")
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
            print(f"[OVMS] Error reading initial response: {e}")
        
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
    
    if _ovms_socket:
        try:
            _ovms_socket.close()
        except:
            pass
        _ovms_socket = None
    
    _ovms_connected = False
    _ovms_state = 'disconnected'
    _ovms_status = 'Disconnected'
    _poll_task = None
    
    _send_response('OVMS-STOPPED', {'status': 'disconnected'})


def getOVMSStatus():
    """Get OVMS connection status"""
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


# Initialize config on module load
_load_config()

