"""
WiFi module - connection, monitoring, and reconnection.

Combines WiFi helper functions with async task management.

Usage:
    from lib.network import wifi
    
    wifi.init()
    await wifi.task()

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import network
import time
import logging
import asyncio
import webrepl_binary as webrepl

# Setup logger
logger = logging.getLogger("wifi")
logger.handlers.clear()
handler = webrepl.logHandler(logging.DEBUG)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

def _log(level, msg):
    """Safe logging helper - uses logger if WebREPL available, otherwise prints to console"""
    if webrepl.running() and logger:
        getattr(logger, level)(msg)
    else:
        print(f"[{level.upper()}] {msg}")

# Import network_ready from parent module
from lib.sys.network import network_ready, _set_network_ready

# Global STA reference
_sta = None


def get_hostname():
    """Get device hostname from settings or compute from MAC."""
    try:
        from lib.sys import settings
        
        # Prefer saved hostname (set during provisioning from base MAC)
        hostname = settings.get("device.hostname")
        if hostname:
            return hostname
        
        # Fallback: compute from WiFi STA MAC
        import ubinascii
        sta = network.WLAN(network.STA_IF)
        mac = ubinascii.hexlify(sta.config('mac'), ':').decode()
        mac_suffix = mac.replace(':', '')[-4:]
        
        prefix = settings.get("wifi.hostname_prefix", "pybot")
        return f"{prefix}-{mac_suffix}"
    except Exception as e:
        _log("warning", f"Failed to get hostname: {e}")
        return "pybot"


def init():
    """
    Initialize WiFi interface.
    
    Returns:
        network.WLAN object if successful, None otherwise
    """
    global _sta
    
    try:
        _sta = network.WLAN(network.STA_IF)
    except Exception as e:
        _log("warning", f"WiFi not available: {e}")
        return None
    
    # Must activate interface BEFORE setting hostname
    if not _sta.active():
        _sta.active(True)
        time.sleep_ms(100)
    
    # Set hostname (only works after interface is active)
    try:
        hostname = get_hostname()
        _sta.config(hostname=hostname)
        _log("debug", f"WiFi hostname: {hostname}")
    except Exception as e:
        _log("warning", f"Failed to set hostname: {e}")
    
    return _sta


def is_available():
    """Check if WiFi hardware is available."""
    try:
        sta = network.WLAN(network.STA_IF)
        return True
    except:
        return False


def is_connected():
    """Check if WiFi is connected."""
    global _sta
    if _sta is None:
        try:
            _sta = network.WLAN(network.STA_IF)
        except:
            return False
    
    try:
        return _sta.active() and _sta.isconnected()
    except:
        return False


def get_ip():
    """Get WiFi IP address if connected."""
    global _sta
    if not is_connected():
        return None
    
    try:
        ifconfig = _sta.ifconfig()
        ip = ifconfig[0]
        return ip if ip != '0.0.0.0' else None
    except:
        return None


def get_status():
    """
    Get comprehensive WiFi status.
    
    Returns:
        dict with status information
    """
    global _sta
    
    if not is_available():
        return {
            'available': False,
            'connected': False
        }
    
    if _sta is None:
        try:
            _sta = network.WLAN(network.STA_IF)
        except:
            return {
                'available': False,
                'connected': False
            }
    
    try:
        connected = _sta.active() and _sta.isconnected()
        ifconfig = _sta.ifconfig() if connected else ('0.0.0.0', '0.0.0.0', '0.0.0.0', '0.0.0.0')
        
        # Get MAC address
        try:
            import ubinascii
            mac = ubinascii.hexlify(_sta.config('mac'), ':').decode().upper()
        except:
            mac = None
        
        return {
            'available': True,
            'active': _sta.active(),
            'connected': connected,
            'ssid': _sta.config('ssid') if connected else None,
            'mac': mac,
            'ip': ifconfig[0],
            'mask': ifconfig[1],
            'gateway': ifconfig[2],
            'dns': ifconfig[3],
            'hostname': get_hostname()
        }
    except Exception as e:
        return {
            'available': True,
            'connected': False,
            'error': str(e)
        }


def connect(ssid=None, password=None, bssid=None, timeout_ms=15000):
    """
    Connect to WiFi network.
    
    Args:
        ssid: Network SSID (uses settings if None)
        password: Network password (uses settings if None)
        bssid: Optional BSSID to connect to specific AP
        timeout_ms: Connection timeout in milliseconds
        
    Returns:
        str: IP address if connected, None otherwise
    """
    global _sta
    
    # Initialize if needed
    if _sta is None:
        _sta = init()
        if _sta is None:
            return None
    
    # Get credentials from settings if not provided
    if ssid is None or password is None:
        try:
            from lib.sys import settings
            ssid = ssid or settings.get("wifi.ssid", "")
            password = password or settings.get("wifi.password", "")
        except Exception as e:
            _log("warning", f"Failed to load wifi settings: {e}")
            return None
    
    if not ssid:
        _log("warning", "No SSID configured")
        return None
    
    # Activate interface
    if not _sta.active():
        _sta.active(True)
        time.sleep_ms(100)
    
    # Check if already connected to this network
    if _sta.isconnected():
        try:
            current_ssid = _sta.config('ssid')
            if current_ssid == ssid:
                ip = _sta.ifconfig()[0]
                _log("info", f"Already connected to {ssid}: {ip}")
                return ip
        except:
            pass
    
    # Ensure driver is idle before connecting (clears IDF internal reconnect state)
    _reset_connection()
    
    _log("info", f"Connecting to {ssid}...")
    try:
        if bssid:
            _sta.connect(ssid, password, bssid=bssid)
        else:
            _sta.connect(ssid, password)
    except Exception as e:
        _log("warning", f"Connection failed: {e}")
        return None
    
    # Wait for connection
    start_ms = time.ticks_ms()
    while not _sta.isconnected():
        if time.ticks_diff(time.ticks_ms(), start_ms) > timeout_ms:
            _log("warning", "Connection timeout")
            return None
        time.sleep_ms(100)
    
    ip = _sta.ifconfig()[0]
    _log("info", f"Connected: {ip}")
    return ip


def scan_and_connect(ssid=None, password=None, timeout_ms=15000):
    """
    Scan for networks and connect to strongest matching AP.
    
    Args:
        ssid: Network SSID (uses settings if None)
        password: Network password (uses settings if None)
        timeout_ms: Connection timeout in milliseconds
        
    Returns:
        str: IP address if connected, None otherwise
    """
    global _sta
    
    # Initialize if needed
    if _sta is None:
        _sta = init()
        if _sta is None:
            return None
    
    # Get credentials from settings if not provided
    if ssid is None or password is None:
        try:
            from lib.sys import settings
            ssid = ssid or settings.get("wifi.ssid", "")
            password = password or settings.get("wifi.password", "")
        except Exception as e:
            _log("warning", f"Failed to load wifi settings: {e}")
            return None
    
    if not ssid:
        _log("warning", "No SSID configured")
        return None
    
    # Activate interface
    if not _sta.active():
        _sta.active(True)
        time.sleep_ms(100)
    
    # Ensure driver is idle so scan is allowed (clears IDF internal reconnect state)
    _reset_connection()
    
    # Scan for networks
    target_bssid = None
    try:
        networks = _sta.scan()
        if networks:
            # Filter networks matching our SSID
            matching_aps = [ap for ap in networks if ap[0].decode('utf-8') == ssid]
            
            if matching_aps:
                # Sort by RSSI (signal strength) - higher is better
                matching_aps.sort(key=lambda x: x[3], reverse=True)
                target_bssid = matching_aps[0][1]
                rssi = matching_aps[0][3]
                _log("debug", f"Found {len(matching_aps)} AP(s), best signal: {rssi} dBm")
    except Exception as e:
        _log("debug", f"Scan failed: {e}")
    
    # Connect (with BSSID if found)
    return connect(ssid, password, bssid=target_bssid, timeout_ms=timeout_ms)


def disconnect():
    """Disconnect from WiFi."""
    global _sta
    if _sta is not None:
        try:
            _sta.disconnect()
            _log("info", "Disconnected")
        except:
            pass


def _reset_connection():
    """Force WiFi driver back to idle state.
    
    After beacon timeout (reason 200), the IDF WiFi driver enters an internal
    reconnecting state that blocks scan() and connect() calls. Cycling the
    interface is the only reliable way to return it to idle.
    """
    global _sta
    if _sta is None:
        return
    try:
        _sta.disconnect()
    except:
        pass
    try:
        _sta.active(False)
        time.sleep_ms(100)
        _sta.active(True)
        time.sleep_ms(100)
    except:
        pass
    _log("debug", "WiFi driver reset to idle state")


async def task():
    """Async WiFi manager - connects, monitors, and handles reconnection"""
    # Check if WiFi hardware is available
    if not is_available():
        _log("debug", "WiFi hardware not available")
        return
    
    # Initialize WiFi
    sta = init()
    if sta is None:
        return
    
    hostname = get_hostname()
    
    # Load roaming threshold from settings
    roam_threshold = -80  # default
    try:
        from lib.sys import settings
        roam_threshold = settings.get("wifi.roam_rssi_threshold", -80)
    except:
        pass
    _log("info", f"RSSI roam threshold: {roam_threshold} dBm")
    
    # Cooldown: minimum seconds between roam attempts
    _ROAM_COOLDOWN_S = 30
    _last_roam_tick = 0
    
    # Check if already connected (soft reset)
    if is_connected():
        ip = get_ip()
        if ip:
            _log("info", f"WiFi already connected (soft reset): {ip}")
            _set_network_ready("WiFi", ip, hostname)
    
    # Main connection/monitoring loop
    while True:
        if not is_connected():
            # Clear network_ready so downstream services know we're offline
            network_ready.clear()
            # Try to connect (scan and connect to strongest AP)
            ip = scan_and_connect()
            if ip:
                _set_network_ready("WiFi", ip, hostname)
            else:
                await asyncio.sleep(5)  # Retry after delay
        else:
            # Connected - check if signal is weak enough to roam
            try:
                rssi = _sta.status('rssi')
                now = time.ticks_ms()
                since_last = time.ticks_diff(now, _last_roam_tick) // 1000
                if rssi < roam_threshold and since_last >= _ROAM_COOLDOWN_S:
                    _log("info", f"Signal weak ({rssi} dBm < {roam_threshold}), scanning for better AP...")
                    _last_roam_tick = now
                    ip = scan_and_connect()
                    if ip:
                        _log("info", f"Roamed to stronger AP: {ip}")
                        _set_network_ready("WiFi", ip, hostname)
            except:
                pass
            await asyncio.sleep(10)


# Expose API - maintain backward compatibility with old names
init_wifi = init

__all__ = ['init', 'init_wifi', 'is_available', 'is_connected', 'get_ip', 'get_hostname', 
           'scan_and_connect', 'connect', 'disconnect', 'get_status', 'task']
