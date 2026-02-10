"""
WWAN (4G Modem) module - initialization, PPP connection, and status monitoring.

Combines WWAN helper functions with async task management.

Usage:
    from lib.network import wwan
    
    wwan.init()
    await wwan.task()

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import json
import logging
import asyncio
import webrepl_binary as webrepl

# Setup logger
logger = logging.getLogger("wwan")
logger.handlers.clear()
handler = webrepl.logHandler(logging.DEBUG)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

def _log(level, msg):
    """Safe logging helper"""
    if webrepl.running() and logger:
        getattr(logger, level)(msg)
    else:
        print(f"[{level.upper()}] {msg}")

# Import network_ready from parent module
from lib.sys.network import network_ready, _set_network_ready

# Lazy import usbmodem to avoid import errors if not available
_usbmodem = None

def _get_usbmodem():
    """Lazy load usbmodem module."""
    global _usbmodem
    if _usbmodem is None:
        try:
            import usbmodem
            _usbmodem = usbmodem
        except ImportError:
            return None
    return _usbmodem


def is_available():
    """Check if WWAN hardware is available and board supports it."""
    if _get_usbmodem() is None:
        return False
    
    # Check if board has WWAN capability
    try:
        from lib.sys import board
        return board.has("wwan")
    except:
        return False


def init():
    """
    Initialize the USB modem using settings.
        
    Returns:
        True if initialized successfully, False otherwise
    """
    usbmodem = _get_usbmodem()
    if usbmodem is None:
        return False
    
    try:
        from lib.sys import settings
        
        # Get settings
        apn = settings.get("wwan.apn", "")
        username = settings.get("wwan.username", "")
        password = settings.get("wwan.password", "")
        auto_init = settings.get("wwan.auto_init", True)
        
        # Set runtime config values BEFORE init()
        usbmodem.set_config(
            apn=apn,
            sim_pin=password,
            username=username,
            auto_init_modem=auto_init
        )
        
        # Initialize modem
        if auto_init:
            usbmodem.init()
            _log("info", "USB Modem initialized")
            return True
        else:
            _log("debug", "Modem auto-init disabled")
            return False
            
    except Exception as e:
        _log("warning", f"Modem initialization failed: {e}")
        return False


def is_modem_connected():
    """Check if modem is connected (USB DTE)."""
    usbmodem = _get_usbmodem()
    if usbmodem is None:
        return False
    
    try:
        return usbmodem.connected()
    except Exception:
        return False


def is_ppp_connected():
    """Check if PPP connection is active."""
    usbmodem = _get_usbmodem()
    if usbmodem is None:
        return False
    
    try:
        status = usbmodem.ppp_status()
        return status.get('connected', False)
    except Exception:
        return False


def is_connected():
    """Check if WWAN has network connectivity."""
    return is_ppp_connected()


def get_ip():
    """Get PPP IP address if connected."""
    usbmodem = _get_usbmodem()
    if usbmodem is None:
        return None
    
    try:
        status = usbmodem.ppp_status()
        return status.get('ip')
    except Exception:
        return None


def ppp_connect():
    """Start PPP connection."""
    usbmodem = _get_usbmodem()
    if usbmodem is None:
        return False
    
    if not is_modem_connected():
        _log("debug", "Modem not connected")
        return False
    
    try:
        usbmodem.ppp_connect()
        _log("info", "PPP connecting...")
        return True
    except Exception as e:
        _log("warning", f"PPP connect failed: {e}")
        return False


def ppp_disconnect():
    """Disconnect PPP connection."""
    usbmodem = _get_usbmodem()
    if usbmodem is None:
        return
    
    try:
        usbmodem.ppp_disconnect()
        _log("info", "PPP disconnected")
    except Exception as e:
        _log("warning", f"PPP disconnect failed: {e}")


def get_status():
    """
    Get comprehensive modem status.
    
    Returns:
        dict with info, signal, firmware, ppp status
    """
    usbmodem = _get_usbmodem()
    if usbmodem is None:
        return {'available': False}
    
    if not is_modem_connected():
        return {'available': True, 'connected': False}
    
    status = {'available': True, 'connected': True}
    
    try:
        status['info'] = usbmodem.get_info()
    except Exception:
        status['info'] = {}
    
    try:
        status['signal'] = usbmodem.get_signal()
    except Exception:
        status['signal'] = {}
    
    try:
        status['firmware'] = usbmodem.get_firmware()
    except Exception:
        status['firmware'] = None
    
    try:
        status['ppp'] = usbmodem.ppp_status()
    except Exception:
        status['ppp'] = {'connected': False}
    
    return status


def check_internet(host="8.8.8.8", count=1, timeout=3000):
    """
    Check internet connectivity using ping.
    
    Args:
        host: Host to ping (default: Google DNS)
        count: Number of ping attempts
        timeout: Timeout in milliseconds
        
    Returns:
        True if host is reachable, False otherwise
    """
    usbmodem = _get_usbmodem()
    if usbmodem is None:
        return False
    
    if not is_modem_connected():
        return False
    
    try:
        result = usbmodem.ping(host, count=count, timeout=timeout)
        return result.get('success', False)
    except Exception as e:
        _log("debug", f"Ping failed: {e}")
        return False


def rssi_to_bars(dbm):
    """Convert dBm to signal bars (0-5)."""
    if dbm is None or dbm == -999:
        return 0
    elif dbm >= -70:
        return 5
    elif dbm >= -80:
        return 4
    elif dbm >= -90:
        return 3
    elif dbm >= -100:
        return 2
    elif dbm >= -110:
        return 1
    else:
        return 0


def rssi_to_quality(dbm):
    """Convert dBm to quality description."""
    if dbm is None or dbm == -999:
        return "Unknown"
    elif dbm >= -70:
        return "Excellent"
    elif dbm >= -80:
        return "Good"
    elif dbm >= -90:
        return "Fair"
    elif dbm >= -100:
        return "Poor"
    else:
        return "Very Poor"


def load_config():
    """
    Load WWAN configuration from settings.
    
    Returns:
        dict with WWAN configuration
    """
    try:
        from lib.sys import settings
        return {
            'apn': settings.get("wwan.apn", ""),
            'username': settings.get("wwan.username", ""),
            'password': settings.get("wwan.password", ""),
            'auto_init': settings.get("wwan.auto_init", True),
            'mobile_data_enabled': settings.get("wwan.mobile_data_enabled", False)
        }
    except Exception as e:
        _log("warning", f"Failed to load WWAN config: {e}")
        return {
            'apn': '',
            'username': '',
            'password': '',
            'auto_init': True,
            'mobile_data_enabled': False
        }


async def task():
    """WWAN manager - initializes modem, monitors PPP connection"""
    await asyncio.sleep_ms(200)  # Brief delay to let other tasks start
    
    # Check if WWAN hardware is available
    if not is_available():
        _log("debug", "WWAN hardware not available")
        return
    
    # Initialize modem
    if not init():
        _log("debug", "WWAN not enabled or init failed")
        return
    
    # Main monitoring loop
    while True:
        config = load_config()
        
        if config.get('mobile_data_enabled', False):
            # Check if connected
            if is_connected():
                ip = get_ip()
                if ip and not network_ready.is_set():
                    _set_network_ready("WWAN", ip)
        
        await asyncio.sleep(30)


# Expose API - maintain backward compatibility with old names
init_modem = init
load_wwan_config = load_config

__all__ = ['init', 'init_modem', 'is_available', 'is_modem_connected', 'is_ppp_connected', 
           'is_connected', 'get_ip', 'ppp_connect', 'ppp_disconnect', 'get_status', 
           'check_internet', 'rssi_to_bars', 'rssi_to_quality', 'load_config', 
           'load_wwan_config', 'task']
