"""
CCS Helper Functions
====================

Device-side helpers for CCS/NACS charging extension.

Client-callable functions:
- getCCSConfig()       - Get current configuration
- setCCSConfig(config) - Set configuration
- startCCS()           - Start EVSE emulation
- stopCCS()            - Stop EVSE emulation
- getCCSStatus()       - Get SLAC/V2G status
- getV2GSession()      - Get current V2G session data

Internal functions:
- _on_slac_complete()  - Callback when SLAC finishes
- _v2g_server_task()   - V2G TCP server
- _handle_v2g_message() - Process V2G messages
"""

import json
import plc
from machine import PWM, Pin

# ============================================================================
# Global State
# ============================================================================

_state = {
    'enabled': False,
    'cp_pwm': None,
    'cp_pin': 4,
    'slac_complete': False,
    'car_mac': None,
    'v2g_state': 'IDLE',
    'session_id': None,
    'soc': None,
    'target_voltage': None,
    'target_current': None,
    'evse_voltage': 0,
    'contactors_closed': False,
}

# ============================================================================
# Configuration
# ============================================================================

def getCCSConfig():
    """Get current CCS configuration from settings"""
    try:
        from lib import settings
        return json.dumps({
            'success': True,
            'config': {
                'cpPin': settings.get('ccs_cp_pin', 4),
                'autoStart': settings.get('ccs_auto_start', False),
            }
        })
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

def setCCSConfig(config_dict):
    """Set CCS configuration via settings module"""
    try:
        from lib import settings
        
        if 'cpPin' in config_dict:
            settings.set('ccs_cp_pin', config_dict['cpPin'])
            _state['cp_pin'] = config_dict['cpPin']
        
        if 'autoStart' in config_dict:
            settings.set('ccs_auto_start', config_dict['autoStart'])
        
        settings.save()
        return json.dumps({'success': True})
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

# ============================================================================
# Start/Stop
# ============================================================================

def startCCS():
    """Start CCS EVSE emulation"""
    global _state
    
    try:
        # Check if already running
        if _state['enabled']:
            return json.dumps({'success': True, 'message': 'Already running'})
        
        # Start CP PWM at 5%
        cp_pin = _state['cp_pin']
        _state['cp_pwm'] = PWM(Pin(cp_pin), freq=1000, duty_u16=int(65535 * 0.05))
        
        # Generate NID/NMK
        import os
        nid = os.urandom(7)
        nmk = os.urandom(16)
        plc.set_key(nid, nmk)
        
        # Set SLAC callback
        plc.set_callback(_on_slac_complete)
        
        # Start EVSE mode
        result = plc.start_evse()
        
        if result:
            _state['enabled'] = True
            _state['slac_complete'] = False
            _state['v2g_state'] = 'IDLE'
            return json.dumps({'success': True})
        else:
            # Clean up on failure
            _state['cp_pwm'].deinit()
            _state['cp_pwm'] = None
            return json.dumps({'success': False, 'error': 'Failed to start SLAC'})
            
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

def stopCCS():
    """Stop CCS EVSE emulation"""
    global _state
    
    try:
        # Stop SLAC
        plc.stop()
        
        # Stop CP PWM
        if _state['cp_pwm']:
            _state['cp_pwm'].deinit()
            _state['cp_pwm'] = None
        
        # Reset state
        _state['enabled'] = False
        _state['slac_complete'] = False
        _state['car_mac'] = None
        _state['v2g_state'] = 'IDLE'
        _state['session_id'] = None
        _state['contactors_closed'] = False
        
        return json.dumps({'success': True})
        
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

# ============================================================================
# Status
# ============================================================================

def getCCSStatus():
    """Get current CCS status"""
    try:
        plc_status = plc.get_status()
        
        return json.dumps({
            'success': True,
            'status': {
                'enabled': _state['enabled'],
                'slacState': plc_status.get('state', 'UNKNOWN'),
                'v2gState': _state['v2g_state'],
                'carMac': plc_status.get('car_mac', _state['car_mac']),
                'sessionId': _state['session_id'],
                'contactorsClosed': _state['contactors_closed'],
                'rxCount': plc_status.get('rx_count', 0),
                'txCount': plc_status.get('tx_count', 0),
            }
        })
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

def getV2GSession():
    """Get current V2G session data"""
    return json.dumps({
        'success': True,
        'session': {
            'state': _state['v2g_state'],
            'sessionId': _state['session_id'],
            'soc': _state['soc'],
            'targetVoltage': _state['target_voltage'],
            'targetCurrent': _state['target_current'],
            'evseVoltage': _state['evse_voltage'],
            'contactorsClosed': _state['contactors_closed'],
        }
    })

# ============================================================================
# SLAC Callback
# ============================================================================

def _on_slac_complete(car_mac):
    """Called by C module when SLAC completes"""
    global _state
    
    print(f"[CCS] SLAC complete! Car MAC: {car_mac}")
    _state['slac_complete'] = True
    _state['car_mac'] = car_mac
    
    # Start V2G server
    import _thread
    _thread.start_new_thread(_v2g_server_task, ())

# ============================================================================
# V2G Server (TCP)
# ============================================================================

def _v2g_server_task():
    """V2G TCP server task - runs in background thread"""
    global _state
    import socket
    
    try:
        # Create IPv6 socket for V2G
        s = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind(('::', 15118))
        s.listen(1)
        
        print("[CCS] V2G server listening on port 15118")
        _state['v2g_state'] = 'WAITING_CONNECTION'
        
        while _state['enabled']:
            s.settimeout(1.0)
            try:
                conn, addr = s.accept()
                print(f"[CCS] V2G connection from {addr}")
                _handle_v2g_session(conn)
            except OSError as e:
                if e.errno == 110:  # ETIMEDOUT
                    continue
                raise
                
    except Exception as e:
        print(f"[CCS] V2G server error: {e}")
    finally:
        try:
            s.close()
        except:
            pass
        _state['v2g_state'] = 'IDLE'

def _handle_v2g_session(conn):
    """Handle a single V2G session"""
    global _state
    import os
    
    try:
        _state['v2g_state'] = 'SESSION_SETUP'
        _state['session_id'] = os.urandom(8).hex()
        _state['evse_voltage'] = 0
        
        while _state['enabled']:
            conn.settimeout(5.0)
            try:
                data = conn.recv(4096)
                if not data:
                    break
                
                # Process V2G message
                response = _process_v2g_message(data)
                if response:
                    conn.send(response)
                    
            except OSError as e:
                if e.errno == 110:  # ETIMEDOUT
                    continue
                raise
                
    except Exception as e:
        print(f"[CCS] V2G session error: {e}")
    finally:
        try:
            conn.close()
        except:
            pass
        _state['v2g_state'] = 'IDLE'

def _process_v2g_message(data):
    """Process incoming V2G message and generate response"""
    global _state
    
    # TODO: Implement EXI decoding via C module
    # For now, this is a placeholder
    
    # The actual implementation will:
    # 1. Decode EXI message: msg = plc.exi_decode(data)
    # 2. Handle based on message type
    # 3. Encode response: resp = plc.exi_encode(type, params)
    
    print(f"[CCS] V2G message received: {len(data)} bytes")
    
    # Placeholder - when EXI is implemented:
    # if msg['type'] == 'PreChargeReq':
    #     target = msg['EVTargetVoltage']
    #     _state['target_voltage'] = target
    #     if _state['evse_voltage'] < target - 20:
    #         _state['evse_voltage'] += 20
    #     else:
    #         _state['evse_voltage'] = target
    #     _state['v2g_state'] = 'PRECHARGE'
    #     return plc.exi_encode('PreChargeRes', {'EVSEPresentVoltage': _state['evse_voltage']})
    
    # if msg['type'] == 'PowerDeliveryReq' and msg['ChargeProgress'] == 'Start':
    #     _state['contactors_closed'] = True
    #     _state['v2g_state'] = 'POWER_DELIVERY'
    
    return None

# ============================================================================
# Initialization
# ============================================================================

def _init():
    """Initialize CCS module on boot"""
    try:
        from lib import settings
        
        # Load saved config
        _state['cp_pin'] = settings.get('ccs_cp_pin', 4)
        
        # Auto-start if enabled
        if settings.get('ccs_auto_start', False):
            startCCS()
            
    except Exception as e:
        print(f"[CCS] Init error: {e}")
