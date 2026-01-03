"""
OVMS Helper Functions
=====================

This module provides OVMS v2 server client functionality for sending
OpenInverter metrics to an OVMS server.

Client-callable functions:
- getOVMSMetrics()          - Get current metrics store
- startOVMS()              - Start OVMS client
- stopOVMS()               - Stop OVMS client
- getOVMSStatus()          - Get connection status
- testOVMSConnectivity()   - Test connection to OVMS server without starting service
- listVehicles()           - List available vehicle types

Update behavior (matches OVMS v3):
- When apps connected (peers > 0): Updates every 60 seconds (configurable)
- When idle (peers == 0): Updates every 600 seconds (configurable)
- Immediate update sent when app first connects (bandwidth optimization)
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
    import webrepl_binary as webrepl
    # Import settings module for configuration management
    from lib import settings
    # Silent - module initialization should not produce output
except Exception as e:
    # Silent - import errors should fail fast, not produce output
    raise  # Re-raise to fail fast

# Import hmac module from local lib directory
import lib.hmac as hmac

# Create a logger for OVMS
logger = logging.getLogger("OVMS")
handler = webrepl.logHandler(logging.INFO)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

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


# Configuration is now managed entirely via settings module (no local cache needed)

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
_ovms_peers = 0  # Number of connected apps/peers
_poll_task = None
_reader_task = None  # Background task for reading server messages
_last_poll_time = 0
_stop_reader = False  # Flag to stop reader task

# Vehicle configuration will be loaded from vehicle.py module
# This allows support for multiple vehicle types (ZombieVerter, Tesla, etc.)


def _send_response(msg_type, data):
    """Internal helper to send notification to WebREPL client
    
    Uses webrepl.notify() to send structured data via INFO event.
    Message format: {"ovms": {"type": msg_type, "data": data}}
    """
    try:
        # Ensure data is JSON-serializable (recursively handle nested dicts/lists)
        def make_serializable(obj):
            if isinstance(obj, dict):
                return {k: make_serializable(v) for k, v in obj.items()}
            elif isinstance(obj, (list, tuple)):
                return [make_serializable(item) for item in obj]
            elif isinstance(obj, (str, int, float, bool, type(None))):
                return obj
            else:
                return str(obj)  # Convert to string as fallback
        
        data = make_serializable(data)
        
        # Send via notify (INFO event)
        if hasattr(webrepl, 'notify'):
            webrepl.notify(json.dumps({"ovms": {"type": msg_type, "data": data}}))
        else:
            # Fallback for older firmware - use log
            webrepl.log(f"[OVMS] {msg_type}: {json.dumps(data)}")
    except Exception as e:
        # Send error via log
        try:
            webrepl.log(f"[OVMS] Error sending response: {e}, type: {msg_type}", level=2)
        except:
            pass  # Silent failure


def _send_error(message, msg_type='error'):
    """Internal helper to send error response"""
    _send_response(msg_type, {'error': message})

def listVehicles():
    """List available vehicles (command handler for testing)"""
    try:
        from vehicle import list_vehicles
        vehicles = list_vehicles()
        _send_response('vehicles_list', vehicles)
    except Exception as e:
        _send_error(f'Failed to list vehicles: {e}')

def getOVMSConfig():
    """Get current OVMS configuration from settings"""
    config = {
        'enabled': settings.get('ovms.enabled', False),
        'server': settings.get('ovms.server', ''),
        'port': settings.get('ovms.port', 6867),
        'vehicleid': settings.get('ovms.vehicleid', ''),
        'password': settings.get('ovms.password', ''),
        'tls': settings.get('ovms.tls', False),
        'updatetime_connected': settings.get('ovms.updatetime_connected', 60),
        'updatetime_idle': settings.get('ovms.updatetime_idle', 600),
        'vehicle_type': settings.get('ovms.vehicle_type', 'zombie_vcu')
    }
    print(json.dumps(config))

def setOVMSConfig(config_dict):
    """Set OVMS configuration via settings module
    
    Args:
        config_dict: Dictionary with configuration values
    
    Returns:
        JSON response with success status
    """
    try:
        # Update settings
        for key, value in config_dict.items():
            settings.set(f'ovms.{key}', value)
        
        # Save to disk
        if settings.save():
            print(json.dumps({'success': True}))
        else:
            print(json.dumps({'success': False, 'error': 'Failed to save settings'}))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))

def getOVMSMetrics():
    """Get current metrics store"""
    print(json.dumps(_metrics.copy()))


def _load_vehicle_config():
    """Load vehicle configuration based on configured vehicle type"""
    global _vehicle_config
    
    if _vehicle_config is not None:
        return _vehicle_config
    
    try:
        from vehicle import get_vehicle_config, list_vehicles
        vehicle_type = settings.get('ovms.vehicle_type', 'zombie_vcu')
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
        import CAN as CAN_MODULE
        CAN = CAN_MODULE
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
    
    # Get CAN pin configuration from board API (hardware definition)
    try:
        from lib import board
        if not board.has("can"):
            # Board doesn't have CAN bus
            return False
        
        can_bus = board.can("twai")
        tx_pin = can_bus.tx
        rx_pin = can_bus.rx
    except Exception as e:
        # Board API not available or no CAN bus defined
        return False
    
    # Get CAN runtime configuration from settings (user preferences)
    bitrate = settings.get('can.bitrate', 500000)
    
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

    global _ovms_can_connected, _ovms_obd2_client, _vehicle_config
    global OBD2TimeoutError, OBD2AbortError
    
    # Load vehicle config
    if _vehicle_config is None:
        _vehicle_config = _load_vehicle_config()
        if _vehicle_config is None:
            return {}
    
    # Check protocol and dispatch accordingly
    protocol = _vehicle_config.get('protocol', 'obd2')
    
    # Real vehicle with OBD2 protocol - initialize CAN
    if not _init_can_for_ovms():
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
    
    if not settings.get('ovms.enabled', False):
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
        
        # Generate client digest (HMAC-MD5 of token with password)
        password = settings.get('ovms.password', '')
        h = hmac.new(password.encode('ascii'), 
                   _ovms_token.encode('ascii'), 
                   hashlib.md5)
        client_digest = base64.b64encode(h.digest()).decode('ascii')
        
        # Send login: MP-C 0 <token> <digest> <vehicleid>
        vehicleid = settings.get('ovms.vehicleid', '')
        login_msg = f"MP-C 0 {_ovms_token} {client_digest} {vehicleid}\r\n"
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
            line = line.strip()
            if not line:
                continue            
            if line.startswith('MP-S 0 '):
                # Server authentication response (plain text)
                parts = line[7:].split(' ', 1)
                if len(parts) == 2:
                    server_token = parts[0]
                    server_digest = parts[1]
                    
                    # Verify digest
                    # HMAC-MD5 of token with password
                    password = settings.get('ovms.password', '')
                    h = hmac.new(password.encode('ascii'), 
                               server_token.encode('ascii'), 
                               hashlib.md5)
                    expected_digest = base64.b64encode(h.digest()).decode('ascii')
                    
                    if expected_digest == server_digest:
                        # Setup encryption
                        # CRITICAL: Server token THEN client token (matches Perl demo line 179-180)
                        shared_key = server_token + _ovms_token
                        h = hmac.new(password.encode('ascii'),
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
                        
                        # Send initial status messages to make the app show as connected
                        _send_initial_messages()
                    else:
                        _ovms_state = 'error'
                        _ovms_status = 'Authentication failed'
                        
            else:
                # All other messages are encrypted (just base64, no MP-0 prefix on wire)
                if _ovms_crypto_rx:
                    try:
                        encrypted = base64.b64decode(line)
                        decrypted = _rc4_crypt(_ovms_crypto_rx, encrypted)
                        
                        # Try to decode as ASCII
                        try:
                            msg = decrypted.decode('ascii')
                            logger.debug(f"[OVMS] RX: {msg}")
                        except UnicodeError:
                            # Not valid ASCII - show hex dump
                            hex_dump = ' '.join(f'{b:02x}' for b in decrypted)
                            logger.debug(f"[OVMS] Decrypted bytes (hex): {hex_dump}")
                            logger.debug(f"[OVMS] Decrypted bytes (repr): {decrypted}")
                            # Don't process further if not valid ASCII
                            continue
                        
                        # Parse message: MP-0 <code><data>
                        if len(msg) >= 6 and msg.startswith('MP-0 '):
                            code = msg[5]
                            data = msg[6:] if len(msg) > 6 else ''
                            
                            # Handle ping message
                            if code == 'A':
                                # Server ping - respond with ping ack
                                logger.debug("Got ping from server, sending pong")
                                _transmit_encrypted('MP-0 a')
                            elif code == 'Z':
                                # App connection count notification
                                _handle_peer_count(data)
                            else:
                                logger.debug(f"[OVMS] Unhandled server message code: {code}, data: {data}")
                    except Exception as e:
                        logger.debug(f"[OVMS] Error decrypting server message: {e}")
  
    except Exception as e:
        logger.debug(f"[OVMS] Error handling server response: {e}")


def _handle_peer_count(count_str):
    """Handle peer connection count update from server
    
    When an app connects (peers goes from 0 to 1+), immediately send fresh status.
    This is bandwidth-efficient: only send frequent updates when someone is watching.
    """
    global _ovms_peers, _ovms_status, _last_poll_time
    
    try:
        new_count = int(count_str) if count_str else 0
        old_count = _ovms_peers
        _ovms_peers = new_count        
        # Update status to reflect app connection state
        if new_count > 0:
            _ovms_status = f'Connected to OVMS server ({new_count} app{"s" if new_count != 1 else ""} connected)'
            if old_count == 0:
                # App just connected - force immediate transmission of fresh status
                logger.debug("App connected - sending fresh status")
                _last_poll_time = 0  # Reset poll time to force immediate poll
                _send_initial_messages()
        else:
            _ovms_status = 'Connected to OVMS server (no apps connected)'
            if old_count > 0:
                logger.debug("All apps disconnected")
    except Exception as e:
        logger.debug(f"[OVMS] Error handling peer count: {e}")


def _send_initial_messages():
    """Send initial status messages after authentication to show device as connected"""
    global _ovms_socket, _ovms_crypto_tx, _metrics
    
    if not _ovms_connected or not _ovms_socket:
        return
    
    try:
        # CRITICAL: Poll fake_zombieverter FIRST to ensure we have fresh metrics
        _update_metrics_from_spot_values()
        
        # Get live metrics from fake_zombieverter (using uppercase key names)
        # Note: fake_zombieverter uses 'SOC', 'Veh_Speed', etc. (see fake_zombieverter.py line 110)
        # NO FALLBACKS - if metrics aren't present, we want it to fail loudly!
        soc = int(_metrics['SOC']['value'])
        speed_kph = int(_metrics['Veh_Speed']['value'])
        temp_motor = int(_metrics['tmpm']['value'])
        temp_inverter = int(_metrics['tmphs']['value'])
        temp_battery = int(_metrics['tmpaux']['value'])
        voltage = int(_metrics['udc']['value'])
        current = int(_metrics['idc']['value'])
        power_kw = _metrics['power']['value']
        voltage_12v = _metrics['U12V']['value']  # 12V battery voltage from ZombieVerter
        
        # Determine charge state from current/power
        if power_kw < -0.5:  # Charging (negative power)
            chargestate = 'charging'
        elif speed_kph > 5:
            chargestate = 'driving'
        else:
            chargestate = 'stopped'
        
        # Send Firmware message (F) - format: MP-0 F<version>,<vin>,<signal>,<canwrite>,<vtype>,<provider>,<service_range>,<service_time>,<hardware>,<mdm_mode>
        # Note: No space after F, and mp_encode for string fields
        msg = "MP-0 F,,,0,,,,,-1,-1,,"
        _transmit_encrypted(msg)
        
        # Send Environment message (D) - format: MP-0 D<doors1>,<doors2>,<lockunlock>,<temp_pem>,<temp_motor>,<temp_battery>,<trip>,<odometer>,<speed>,<park_time>,<ambient_temp>,<doors3>,<stale_temps>,<stale_ambient>,<vehicle12v>,<doors4>,<alarm_sounding>,<alarm_duration>,<tpms_health>,<tpms_alert>
        # Use real temps, speed, and 12V voltage from metrics
        msg = f"MP-0 D0,0,5,{temp_inverter},{temp_motor},{temp_battery},0,0,{speed_kph},0,25,0,0,0,{voltage_12v},0,0,0,0,0"
        _transmit_encrypted(msg)
        
        # Send Stats message (S) - format: MP-0 S<soc>,<units>,<linevoltage>,<chargecurrent>,<chargestate>,<chargemode>,<idealrange>,<estimrange>,<soh>,<cac>,...
        # Use live SoC and other metrics from fake_zombieverter
        # Units: K=kilometers, M=miles
        # Calculate range based on live SoC (assuming 350km max range like demo car)
        ideal_range = int((soc / 100.0) * 350)
        est_range = int(ideal_range * 0.9)  # Estimated range is typically 90% of ideal
        
        msg = f"MP-0 S{soc},K,{voltage},{abs(current)},{chargestate},standard,{ideal_range},{est_range},100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
        _transmit_encrypted(msg)
        
    except Exception as e:
        # Silent - errors handled by state/status
        pass


def _transmit_encrypted(msg):
    """Encrypt and transmit a message to OVMS server"""
    global _ovms_socket, _ovms_crypto_tx
    
    if not _ovms_connected or not _ovms_socket or not _ovms_crypto_tx:
        return False
    
    try:
        logger.debug(f"[OVMS] Sending: {msg}")
        
        # Encrypt message with RC4
        msg_bytes = msg.encode('ascii')
        encrypted = _rc4_crypt(_ovms_crypto_tx, msg_bytes)
        
        # Base64 encode
        encoded = base64.b64encode(encrypted).decode('ascii')        
        # Send with CRLF
        final_msg = encoded + '\r\n'
        _ovms_socket.send(final_msg.encode('ascii'))
        return True
    except Exception as e:
        logger.debug(f"[OVMS] Transmit error: {e}")
        return False


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
    """Check for incoming server messages (non-blocking)
    
    NOTE: This is now deprecated in favor of the background reader task.
    Kept for backwards compatibility but the reader task is preferred.
    """
    global _ovms_socket, _ovms_connected, _ovms_state, _ovms_status
    
    if not _ovms_connected or not _ovms_socket:
        return
    
    try:
        data = _ovms_socket.recv(4096)
        if not data:
            # Connection closed
            logger.debug("Server closed connection (recv returned empty)")
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
        
        logger.debug(f"[OVMS] Received {len(data)} bytes from server")
        _handle_server_response(data)
    except OSError as e:
        # Non-blocking socket would raise EAGAIN/EWOULDBLOCK when no data available
        # This is expected and not an error
        if e.errno != 11:  # EAGAIN/EWOULDBLOCK
            logger.debug(f"[OVMS] Socket error: {e}")
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
        logger.debug(f"[OVMS] Exception in checkServerMessages: {e}")
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


def _reader_loop():
    """Background task that continuously reads from OVMS server socket
    
    This runs in a loop checking for incoming messages.
    Handles line-based protocol (messages end with \r\n).
    """
    global _ovms_socket, _ovms_connected, _ovms_state, _ovms_status, _stop_reader
    
    logger.debug("Reader task started")
    
    # Buffer for incomplete lines
    line_buffer = b''
    
    while not _stop_reader:
        try:        
            # Check if socket exists (even if not fully connected yet - we need to process auth!)
            if not _ovms_socket:
                time.sleep(0.1)
                continue
            
            # Non-blocking receive
            try:
                data = _ovms_socket.recv(4096)
                if data:
                    logger.debug(f"[OVMS] Reader: Got {len(data)} bytes")
                    # Add to buffer
                    line_buffer += data
                    
                    # Process complete lines (ending with \r\n)
                    while b'\r\n' in line_buffer or b'\n' in line_buffer:
                        # Find line ending
                        if b'\r\n' in line_buffer:
                            line_end = line_buffer.index(b'\r\n')
                            line = line_buffer[:line_end]
                            line_buffer = line_buffer[line_end+2:]
                        else:
                            line_end = line_buffer.index(b'\n')
                            line = line_buffer[:line_end]
                            line_buffer = line_buffer[line_end+1:]
                        
                        if line:  # Skip empty lines
                            _handle_server_response(line + b'\n')  # Pass single line
                else:
                    # Empty data = connection closed
                    logger.debug("Reader: Server closed connection")
                    _ovms_connected = False
                    _ovms_state = 'disconnected'
                    _ovms_status = 'Connection closed by server'
                    if _ovms_socket:
                        try:
                            _ovms_socket.close()
                        except:
                            pass
                    _ovms_socket = None
                    break
            except OSError as e:
                # EAGAIN/EWOULDBLOCK (errno 11) = no data available, this is normal
                if e.errno != 11:
                    logger.debug(f"[OVMS] Reader: Socket error errno={e.errno}: {e}")
                    _ovms_connected = False
                    _ovms_state = 'disconnected'
                    _ovms_status = f'Connection error: {e}'
                    if _ovms_socket:
                        try:
                            _ovms_socket.close()
                        except:
                            pass
                    _ovms_socket = None
                    break
        except Exception as e:
            logger.debug(f"[OVMS] Reader: Unexpected error: {e}")
        
        # Check every 100ms for messages
        time.sleep(0.1)
    
    logger.debug("Reader task stopped")


def pollMetrics():
    """Manually trigger metrics polling and send to server"""
    global _poll_task
    
    if not settings.get('ovms.enabled', False):
        _send_error('OVMS is not enabled')
        return
    
    try:
        _poll_loop()
        _send_response('polled', {'success': True, 'metrics_count': len(_metrics)})
    except Exception as e:
        _send_error(f'Poll error: {e}')


def testOVMSConnectivity():
    """Test connectivity to OVMS server without starting the service
    
    Returns JSON with success status and message
    """
    global _ovms_socket, _ovms_connected, _ovms_state, _ovms_status
    
    # Save current state to restore after test
    saved_state = _ovms_state
    saved_status = _ovms_status
    saved_connected = _ovms_connected
    
    # If there's an existing connection from a previous test, clean it up
    if _ovms_socket:
        try:
            _ovms_socket.close()
        except:
            pass
        _ovms_socket = None
    
    # Reset connection state for test
    _ovms_connected = False
    _ovms_state = 'disconnected'
    _ovms_status = ''
    
    # Get config from settings
    server = settings.get('ovms.server', '')
    port = settings.get('ovms.port', 6867)
    vehicleid = settings.get('ovms.vehicleid', '')
    password = settings.get('ovms.password', '')
    
    if not server:
        print(json.dumps({'success': False, 'error': 'Server address not configured'}))
        # Restore state
        _ovms_state = saved_state
        _ovms_status = saved_status
        _ovms_connected = saved_connected
        return
    
    if not vehicleid:
        print(json.dumps({'success': False, 'error': 'Vehicle ID not configured'}))
        # Restore state
        _ovms_state = saved_state
        _ovms_status = saved_status
        _ovms_connected = saved_connected
        return
    
    if not password:
        print(json.dumps({'success': False, 'error': 'Password not configured'}))
        # Restore state
        _ovms_state = saved_state
        _ovms_status = saved_status
        _ovms_connected = saved_connected
        return
    
    test_socket = None
    try:
        # Resolve server address
        try:
            addr = socket.getaddrinfo(server, port)[0][-1]
        except Exception as e:
            print(json.dumps({'success': False, 'error': f'Failed to resolve server address: {e}'}))
            # Restore state
            _ovms_state = saved_state
            _ovms_status = saved_status
            _ovms_connected = saved_connected
            return
        
        # Create socket and connect
        test_socket = socket.socket()
        test_socket.settimeout(10.0)  # 10 second timeout for test
        
        # Debug: log connection attempt
        try:
            webrepl.log(f"[OVMS] Connecting to {addr[0]}:{addr[1]}", level=1)
        except:
            pass
            
        test_socket.connect(addr)
        
        # Debug: log successful connection
        try:
            webrepl.log(f"[OVMS] Connected successfully", level=1)
        except:
            pass
        
        # Generate test token
        import os
        token_bytes = os.urandom(22)
        test_token = base64.b64encode(token_bytes).decode('ascii')[:22]
        
        # Generate client digest (HMAC-MD5 of token with password)
        h = hmac.new(password.encode('ascii'), 
                   test_token.encode('ascii'), 
                   hashlib.md5)
        client_digest = base64.b64encode(h.digest()).decode('ascii')
        
        # Send login message: MP-C 0 <token> <digest> <vehicleid>
        login_msg = f"MP-C 0 {test_token} {client_digest} {vehicleid}\r\n"
        test_socket.send(login_msg.encode('ascii'))
        
        # Debug: log what we sent
        try:
            webrepl.log(f"[OVMS] Sent: {login_msg.strip()}", level=1)
        except:
            pass
        
        # Wait for server response
        try:
            data = test_socket.recv(4096)
            if data:
                # Debug: log what we received
                try:
                    webrepl.log(f"[OVMS] Received: {data[:100]}", level=1)
                except:
                    pass
                response = data.decode('ascii').strip()
                if response.startswith('MP-S 0 '):
                    # Server responded with authentication challenge
                    parts = response[7:].split(' ', 1)
                    if len(parts) == 2:
                        server_token = parts[0]
                        server_digest = parts[1]
                        
                        # Verify digest
                        h = hmac.new(password.encode('ascii'), 
                                   server_token.encode('ascii'), 
                                   hashlib.md5)
                        expected_digest = base64.b64encode(h.digest()).decode('ascii')
                        
                        if expected_digest == server_digest:
                            print(json.dumps({
                                'success': True, 
                                'message': f'Successfully connected to {server}:{port} and authenticated'
                            }))
                        else:
                            print(json.dumps({
                                'success': False, 
                                'error': 'Authentication failed - password may be incorrect'
                            }))
                    else:
                        print(json.dumps({
                            'success': False, 
                            'error': 'Invalid server response format'
                        }))
                else:
                    print(json.dumps({
                        'success': False, 
                        'error': f'Unexpected server response: {response[:100]}'
                    }))
            else:
                print(json.dumps({
                    'success': False, 
                    'error': 'No response from server'
                }))
        except socket.timeout:
            print(json.dumps({
                'success': False, 
                'error': 'Connection timeout - server did not respond'
            }))
        except Exception as e:
            print(json.dumps({
                'success': False, 
                'error': f'Error reading server response: {e}'
            }))
    
    except OSError as e:
        if e.errno == 113:  # EHOSTUNREACH
            print(json.dumps({
                'success': False, 
                'error': f'Cannot reach server {server}:{port} - check network connectivity'
            }))
        elif e.errno == 111:  # ECONNREFUSED
            print(json.dumps({
                'success': False, 
                'error': f'Connection refused by {server}:{port} - server may be down or port incorrect'
            }))
        else:
            print(json.dumps({
                'success': False, 
                'error': f'Connection error: {e}'
            }))
    except Exception as e:
        print(json.dumps({
            'success': False, 
            'error': f'Test failed: {e}'
        }))
    finally:
        # CRITICAL: Always close test socket and restore global state
        if test_socket:
            try:
                test_socket.close()
            except:
                pass
        
        # Restore original state (test should not affect main connection state)
        _ovms_state = saved_state
        _ovms_status = saved_status
        _ovms_connected = saved_connected


def startOVMS():
    """Start OVMS client connection"""
    global _ovms_socket, _ovms_connected, _ovms_state, _ovms_status, _poll_task, _reader_task, _stop_reader
    
    if _ovms_connected:
        print(json.dumps({'status': 'already_connected'}))
        return
    
    # Get config from settings
    enabled = settings.get('ovms.enabled', False)
    server = settings.get('ovms.server', '')
    port = settings.get('ovms.port', 6867)
    vehicleid = settings.get('ovms.vehicleid', '')
    password = settings.get('ovms.password', '')
    
    if not enabled:
        print(json.dumps({'success': False, 'error': 'OVMS is not enabled in configuration'}))
        return
    
    if not server or not vehicleid or not password:
        print(json.dumps({'success': False, 'error': 'Server, vehicle ID, and password must be configured'}))
        return
    
    try:
        _ovms_state = 'connecting'
        _ovms_status = f"Connecting to {server}:{port}..."
        _ovms_connected = False  # CRITICAL: Don't set connected until authenticated!
        
        # Create socket connection
        addr = socket.getaddrinfo(server, port)[0][-1]
        _ovms_socket = socket.socket()
        _ovms_socket.connect(addr)
        
        # Send login immediately (don't wait for server hello)
        _send_login()
        
        # Set non-blocking immediately - let reader thread handle ALL responses
        _ovms_socket.setblocking(False)
        
        # Start background reader task immediately for event-driven message handling
        # The reader will handle authentication response and all subsequent messages
        logger.debug("Starting background reader task")
        _stop_reader = False
        try:
            import _thread
            _reader_task = _thread.start_new_thread(_reader_loop, ())
            
            # Give reader a moment to start and process auth
            time.sleep(0.5)
            
        except Exception as e:
            logger.debug(f"[OVMS] Warning: Could not start reader task: {e}")
            _ovms_state = 'error'
            _ovms_status = 'Failed to start reader thread'
        
        # Report current state (reader thread will update _ovms_connected when auth succeeds)
        print(json.dumps({'status': _ovms_state, 'connected': _ovms_connected}))
    except Exception as e:
        _ovms_state = 'error'
        _ovms_status = f'Connection error: {e}'
        _ovms_connected = False
        if _ovms_socket:
            try:
                _ovms_socket.close()
            except:
                pass
            _ovms_socket = None
        print(json.dumps({'success': False, 'error': f'Failed to start: {e}'}))


def stopOVMS():
    """Stop OVMS client connection"""
    global _ovms_socket, _ovms_connected, _ovms_state, _ovms_status, _poll_task, _reader_task, _stop_reader
    global _ovms_can_dev, _ovms_sdo_client, _ovms_can_connected, _ovms_peers
    
    # Stop background reader task
    if _reader_task:
        logger.debug("Stopping background reader task")
        _stop_reader = True
        time.sleep(0.3)  # Give reader task time to exit
        _reader_task = None
    
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
    _ovms_peers = 0
    _stop_reader = False
    
    print(json.dumps({'status': 'stopped'}))


def getOVMSStatus():
    """Get OVMS connection status"""
    try:
        # Check for server messages if connected
        if _ovms_connected:
            checkServerMessages()
        
        # Trigger poll/transmission if enabled and connected
        # Use peer-based update intervals like OVMS v3:
        # - 60s when apps connected (peers > 0)
        # - 600s when idle (peers == 0)
        if settings.get('ovms.enabled', False) and _ovms_connected:
            current_time = time.time()
            # Choose interval based on peer count
            update_interval = settings.get('ovms.updatetime_connected', 60) if _ovms_peers > 0 else settings.get('ovms.updatetime_idle', 600)
            
            if _last_poll_time == 0 or (current_time - _last_poll_time) >= update_interval:
                _poll_loop()
        
        status = {
            'state': _ovms_state,
            'status': _ovms_status,
            'connected': _ovms_connected,
            'peers': _ovms_peers,
            'metrics_count': len(_metrics),
            'last_poll': _last_poll_time
        }
        print(json.dumps(status))
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


# Config is now loaded on-demand from settings module (no initialization needed)
