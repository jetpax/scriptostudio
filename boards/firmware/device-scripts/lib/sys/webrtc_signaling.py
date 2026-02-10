"""
WebRTC Signaling Server for Scripto Studio
===========================================

Provides HTTP endpoints for WebRTC signaling to establish DataChannel
connections between browser clients and the ESP32 device.

This module:
- Manages a WebRTC peer connection (controlled/server role)
- Exposes REST endpoints for SDP exchange and ICE candidate negotiation
- Handles WebRTC callbacks (answer, ICE, data, state)
- Provides connection status for debugging

Usage:
    from lib.sys import webrtc_signaling
    webrtc_signaling.start()
    
    # Later...
    webrtc_signaling.stop()

HTTP Endpoints:
    POST /webrtc/offer  - Accept SDP offer, return SDP answer
    GET /webrtc/status  - Get connection status (debugging)

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import webrtc
import httpserver
import json
import time
import network

# WBP protocol handler (C module)
import webrepl_binary as webrepl

# Syslog helper (always available - no-op if not configured)
from lib.sys.syslog_helper import syslog

# Module state
_peer = None
_state = {
    'connected': False,
    'state': webrtc.STATE_CLOSED,
    'state_name': 'STATE_CLOSED',
    'sdp_answer': None,
    'ice_candidates': [],
    'last_error': None,
    'started': False,
    'last_offer_time': 0
}

# Handler IDs for cleanup
_handler_ids = []


# State name mapping
_STATE_NAMES = {
    webrtc.STATE_CLOSED: 'STATE_CLOSED',
    webrtc.STATE_DISCONNECTED: 'STATE_DISCONNECTED',
    webrtc.STATE_NEW_CONNECTION: 'STATE_NEW_CONNECTION',
    webrtc.STATE_PAIRING: 'STATE_PAIRING',
    webrtc.STATE_PAIRED: 'STATE_PAIRED',
    webrtc.STATE_CONNECTING: 'STATE_CONNECTING',
    webrtc.STATE_CONNECTED: 'STATE_CONNECTED',
    webrtc.STATE_CONNECT_FAILED: 'STATE_CONNECT_FAILED',
    webrtc.STATE_DATA_CHANNEL_CONNECTED: 'STATE_DATA_CHANNEL_CONNECTED',
    webrtc.STATE_DATA_CHANNEL_OPENED: 'STATE_DATA_CHANNEL_OPENED',
    webrtc.STATE_DATA_CHANNEL_CLOSED: 'STATE_DATA_CHANNEL_CLOSED',
    webrtc.STATE_DATA_CHANNEL_DISCONNECTED: 'STATE_DATA_CHANNEL_DISCONNECTED'
}

#=============================================================================
# WebRTC Callbacks
#=============================================================================

def _on_answer(sdp):
    """Called when SDP answer is generated (we're in controlled role)"""
    global _state
    if _state['sdp_answer'] is not None:
        return  # Ignore stale answer
    _state['sdp_answer'] = sdp
    _state['last_error'] = None


def _on_ice_candidate(candidate):
    """Called when ICE candidate is discovered"""
    global _state
    _state['ice_candidates'].append(candidate)
    _state['last_error'] = None


def _on_data(data):
    """Called when data is received via DataChannel - routes to WBP handler"""
    global _peer, _state
    try:
        if _peer is None or not _peer.is_connected():
            return
        
        # Route to WBP handler
        webrepl.on_data(data)
            
    except KeyboardInterrupt:
        # Ignore KeyboardInterrupt in system callbacks - it should only affect user tasks
        # The interrupt is handled by bg_tasks._runner() for async tasks
        pass

    except Exception as e:
        syslog.error(f"Error handling data: {e}", source="webrtc")
        _state['last_error'] = str(e)


def _on_state(state_code):
    """Called when connection state changes"""
    global _state, _peer
    state_name = _STATE_NAMES.get(state_code, f'UNKNOWN_{state_code}')
    
    syslog.info(f"State changed: {state_code} ({state_name})", source="webrtc")
    
    _state['state'] = state_code
    _state['state_name'] = state_name
    _state['connected'] = (state_code == webrtc.STATE_DATA_CHANNEL_OPENED)
    
    if state_code == webrtc.STATE_DATA_CHANNEL_OPENED:
        syslog.info("DataChannel OPENED - starting WBP handler", source="webrtc")
        _state['last_error'] = None
        
        if _peer is None:
            syslog.warning("_peer is None", source="webrtc")
        else:
            try:
                webrepl.update_channel_state(True)
                webrepl.start_rtc(_peer)
                syslog.info("WBP handler started on DataChannel", source="webrtc")
                
                # Note: No auth callback for WebRTC - already secured by HTTPS signaling + DTLS
                # LED state can be handled by client if needed (banner() or explicit call)
            except Exception as e:
                syslog.error(f"Failed to start WBP handler: {e}", source="webrtc")
                _state['last_error'] = str(e)
    elif state_code == webrtc.STATE_DATA_CHANNEL_CLOSED:
        # Stop WBP handler
        webrepl.update_channel_state(False)
        webrepl.stop()
    elif state_code == webrtc.STATE_CONNECT_FAILED:
        _state['last_error'] = 'Connection failed'
        syslog.error("Connection failed", source="webrtc")


#=============================================================================
# ICE Candidate Generation
#=============================================================================

def _extract_port_from_sdp(sdp):
    """Extract port number from SDP answer"""
    try:
        for line in sdp.split('\r\n'):
            if line.startswith('m=application'):
                parts = line.split()
                if len(parts) >= 2:
                    return int(parts[1])
    except Exception:
        pass
    return None


def _generate_host_candidates(sdp_answer=None):
    """
    Generate host ICE candidates manually using ESP32's IP address.
    
    This is a fallback when STUN server isn't available or working.
    Host candidates work for local network connections.
    
    Args:
        sdp_answer: Optional SDP answer to extract port from
    
    Returns:
        list: List of ICE candidate strings
    """
    candidates = []
    
    try:
        # Get ESP32's IP address
        sta = network.WLAN(network.STA_IF)
        if not sta.active() or not sta.isconnected():
            return candidates
        
        ip_address = sta.ifconfig()[0]
        if ip_address == '0.0.0.0':
            return candidates
        
        port = _extract_port_from_sdp(sdp_answer) if sdp_answer else None
        ports = [port, port + 1, port + 2] if port else [50000, 50001, 50002]
        
        for port in ports:
            candidate = f"candidate:1 1 udp 2113667327 {ip_address} {port} typ host"
            candidates.append(candidate)
        
        return candidates
        
    except Exception:
        return candidates


#=============================================================================
# HTTP Handlers
#=============================================================================

def _handle_offer(uri, data, remote_addr=None):
    """
    Handle POST /webrtc/offer
    
    Receives SDP offer from browser, configures peer, and returns SDP answer.
    """
    global _peer, _state
    
    if remote_addr and remote_addr.upper().startswith("::FFFF:"):
        remote_addr = remote_addr[7:]
    
    try:
        req = json.loads(data)
        sdp_offer = req.get('sdp')
        if not sdp_offer:
            return json.dumps({'error': 'Missing SDP offer'})
        
        # Clean up old peer and create fresh one (peer reuse is broken in esp_peer)
        global _peer
        
        if _peer is not None:
            try:
                _peer.close_sync()
            except Exception as e:
                syslog.warning(f"Close error: {e}", source="webrtc")
            
            _peer = None
            
            # Regenerate DTLS cert to reset library state (workaround for esp_peer bug)
            try:
                webrtc.pre_generate_cert()
            except Exception:
                pass
        
        # Create fresh peer
        _peer = webrtc.Peer(role='controlled')
        _peer.on_answer(_on_answer)
        _peer.on_ice(_on_ice_candidate)
        _peer.on_data(_on_data)
        _peer.on_state(_on_state)
        _peer.start_connection()
        _peer.process_queue()
        
        # Reset state
        _state['started'] = True
        _state['state'] = webrtc.STATE_NEW_CONNECTION
        _state['state_name'] = 'STATE_NEW_CONNECTION'
        _state['sdp_answer'] = None
        _state['ice_candidates'] = []
        _state['last_error'] = None
        _state['connected'] = False
        
        # Set remote SDP
        _peer.set_remote_sdp(sdp_offer)
        _peer.process_queue()
        
        # Extract and add remote ICE candidates
        all_candidates = []
        for line in sdp_offer.split('\r\n'):
            if line.startswith('a=candidate:'):
                all_candidates.append(line[2:])
        
        added_count = 0
        for candidate in all_candidates:
            try:
                if 'typ ' not in candidate:
                    continue
                
                # Patch mDNS hostnames (.local) with actual IP
                if '.local' in candidate and remote_addr:
                    parts = candidate.split()
                    if len(parts) >= 5 and '.local' in parts[4]:
                        parts[4] = remote_addr
                        candidate = " ".join(parts)
                    else:
                        continue
                elif '.local' in candidate:
                    continue  # Skip mDNS candidates without remote_addr
                
                _peer.add_ice_candidate(candidate)
                added_count += 1
                _peer.process_queue()
                
            except Exception as e:
                syslog.debug(f"Error adding candidate: {e}", source="webrtc")
        
        if added_count == 0:
            # Inject dummy candidate to keep listener alive
            _peer.add_ice_candidate("candidate:1 1 udp 2113667327 0.0.0.0 9 typ host generation 0")
        
        # Wait for SDP answer (generated automatically by esp_peer)
        timeout = 2.0
        start_time = time.time()
        current_peer_ref = _peer
        
        while _state['sdp_answer'] is None and (time.time() - start_time) < timeout:
            if _peer is not current_peer_ref:
                return json.dumps({
                    'error': 'Peer connection interrupted',
                    'status': 'error',
                    'state': _state['state_name']
                })
            
            try:
                _peer.process_queue()
            except Exception:
                pass
            
            time.sleep(0.01)
        
        if _state['sdp_answer'] is None:
            return json.dumps({
                'error': 'Timeout waiting for SDP answer',
                'status': 'error',
                'state': _state['state_name']
            })
        
        _peer.process_queue()
        
        # Provide host candidates if none found
        if not _state['ice_candidates']:
            try:
                manual_candidates = _generate_host_candidates(_state['sdp_answer'])
                if manual_candidates:
                    _state['ice_candidates'] = manual_candidates
            except Exception:
                pass
        
        # Build response
        response = {
            'status': _state['state_name'],
            'sdp': _state['sdp_answer'],
            'ice_candidates': _state['ice_candidates'],
            'connected': _state['connected']
        }
        
        return json.dumps(response)
        
    except ValueError:
        return json.dumps({'error': 'Invalid JSON'})
    except Exception as e:
        syslog.error(f"Offer handler error: {e}", source="webrtc")
        return json.dumps({'error': str(e)})

def _handle_status(uri, data, remote_addr=None):
    """Handle GET /webrtc/status - returns current connection status"""
    global _state
    try:
        status = {
            'status': _state['state_name'],
            'connected': _state['state'] == webrtc.STATE_CONNECTED,
            'started': _state['started'],
            'ice_candidates': len(_state['ice_candidates']) if _state['ice_candidates'] else 0
        }
        return json.dumps(status)
    except Exception:
        return json.dumps({'error': 'Status error'})


#=============================================================================
# Public API
#=============================================================================

def start():
    """
    Start WebRTC signaling server.
    
    Registers HTTP endpoints and initializes peer.
    """
    global _state, _handler_ids
    
    if _state['started']:
        return True
    
    try:
        handler_id = httpserver.on('/webrtc/offer', _handle_offer, 'POST')
        _handler_ids.append(handler_id)
        
        handler_id = httpserver.on('/webrtc/status', _handle_status, 'GET')
        _handler_ids.append(handler_id)
        
        # Pre-generate DTLS certificates to speed up connections
        try:
            webrtc.pre_generate_cert()
        except Exception:
            pass
        
        _state['started'] = True
        return True
        
    except Exception as e:
        syslog.error(f"Failed to start: {e}", source="webrtc")
        _state['last_error'] = str(e)
        return False


def stop():
    """
    Stop WebRTC signaling server.
    
    Unregisters HTTP endpoints and closes peer.
    """
    global _peer, _state, _handler_ids
    
    if not _state['started']:
        syslog.debug("Signaling server not started", source="webrtc")
        return
    
    try:
        for handler_id in _handler_ids:
            try:
                httpserver.off(handler_id)
            except Exception:
                pass
        
        _handler_ids.clear()
        
        if _peer is not None:
            try:
                _peer.close()
            except Exception:
                pass
            _peer = None
        
        _state['started'] = False
        _state['connected'] = False
        _state['state'] = webrtc.STATE_CLOSED
        _state['state_name'] = 'STATE_CLOSED'
        _state['sdp_answer'] = None
        _state['ice_candidates'] = []
        
    except Exception as e:
        syslog.error(f"Error stopping: {e}", source="webrtc")


def get_status():
    """
    Get current connection status.
    
    Returns:
        dict: Status information including connection state, peer status, etc.
    """
    return {
        'connected': _state['connected'],
        'state': _state['state'],
        'state_name': _state['state_name'],
        'peer_active': _peer is not None,
        'ice_candidates_count': len(_state['ice_candidates']),
        'has_answer': _state['sdp_answer'] is not None,
        'last_error': _state['last_error'],
        'started': _state['started']
    }


def send(data):
    """Send data via WebRTC DataChannel"""
    global _peer
    
    if _peer is None or not _peer.is_connected():
        return False
    
    try:
        _peer.send(data)
        return True
    except Exception as e:
        _state['last_error'] = str(e)
        return False
