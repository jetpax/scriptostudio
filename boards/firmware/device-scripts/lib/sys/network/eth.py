"""
Ethernet module - initialization and monitoring.

Combines Ethernet helper functions with async task management.

Usage:
    from lib.sys.network import eth
    
    eth.init()
    await eth.task()

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import network
import logging
import asyncio
import webrepl_binary as webrepl

# Setup logger
logger = logging.getLogger("ethernet")
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

# Global LAN reference (prevent garbage collection)
_eth_lan = None

# Track last status for change detection
_last_eth_status = None

# PHY type mapping
PHY_TYPES = {
    'IP101': network.PHY_IP101 if hasattr(network, 'PHY_IP101') else None,
    'LAN8720': network.PHY_LAN8720 if hasattr(network, 'PHY_LAN8720') else None,
    'RTL8201': network.PHY_RTL8201 if hasattr(network, 'PHY_RTL8201') else None,
    'DP83848': network.PHY_DP83848 if hasattr(network, 'PHY_DP83848') else None,
    'KSZ8081': network.PHY_KSZ8081 if hasattr(network, 'PHY_KSZ8081') else None,
}


def is_available():
    """Check if Ethernet hardware is available."""
    if not hasattr(network, 'LAN'):
        return False
    
    # Check if board has ethernet capability
    try:
        from lib.sys import board
        return board.has("ethernet")
    except:
        return False


def init():
    """
    Initialize Ethernet interface using board and settings configuration.
        
    Returns:
        network.LAN object if successful, None otherwise
    """
    global _eth_lan
    
    # Check if LAN is available
    if not hasattr(network, 'LAN'):
        return None
    
    # Check if board has ethernet
    try:
        from lib.sys import board, settings
        
        if not board.has("ethernet"):
            _log("debug", "Board does not have ethernet capability")
            return None
        
        # Get hardware configuration from board
        eth_device = board.device("ethernet")
        phy_type_str = eth_device.phy
        phy_addr = eth_device.phy_addr
        eth_pins = eth_device.pins
        
        # Get user settings
        dhcp = settings.get("ethernet.dhcp", True)
        static_ip = settings.get("ethernet.static_ip", None)
        
    except Exception as e:
        _log("warning", f"Failed to load ethernet configuration: {e}")
        return None
    
    try:
        # Get chip type
        chip = board.id.chip
        
        # Get PHY type constant
        phy_type = PHY_TYPES.get(phy_type_str)
        if phy_type is None:
            _log("warning", f"Unknown PHY type: {phy_type_str}, using LAN8720")
            phy_type = PHY_TYPES.get('LAN8720', 0)
        
        # Initialize based on chip type
        if chip == "ESP32-P4" and eth_pins:
            # P4 needs explicit pin configuration
            # eth_pins is a Device view object, use attribute access
            _eth_lan = network.LAN(
                id=0,
                mdc=getattr(eth_pins, 'mdc', 31),
                mdio=getattr(eth_pins, 'mdio', 52),
                phy_type=phy_type,
                phy_addr=phy_addr
            )
        else:
            # ESP32 classic - may work with no params or minimal params
            try:
                _eth_lan = network.LAN()
            except TypeError:
                # Some builds need phy_type
                _eth_lan = network.LAN(phy_type=phy_type, phy_addr=phy_addr)
        
        # Set global hostname for mDNS BEFORE activating interface
        # mDNS init happens in C on IP_EVENT_ETH_GOT_IP and reads mod_network_hostname_data
        try:
            from lib.sys.network import wifi
            hostname = wifi.get_hostname()
            network.hostname(hostname)
            _log("debug", f"Ethernet hostname: {hostname}")
        except Exception as e:
            _log("warning", f"Failed to set Ethernet hostname: {e}")
        
        # Activate the interface (this triggers IP acquisition and mDNS init)
        _eth_lan.active(True)
        
        # Configure static IP if not using DHCP
        if not dhcp and static_ip:
            if all(k in static_ip for k in ['ip', 'mask', 'gateway', 'dns']):
                _eth_lan.ifconfig((
                    static_ip['ip'],
                    static_ip['mask'],
                    static_ip['gateway'],
                    static_ip['dns']
                ))
                _log("info", f"Ethernet static IP: {static_ip['ip']}")
        
        _log("info", "Ethernet initialized")
        return _eth_lan
        
    except Exception as e:
        _log("warning", f"Ethernet initialization failed: {e}")
        _eth_lan = None
        return None


def is_link_up():
    """Check if Ethernet link is up."""
    global _eth_lan
    if _eth_lan is None:
        return False
    try:
        status = _eth_lan.status()
        # 3=ETH_CONNECTED (link up), 5=ETH_GOT_IP
        return status in (3, 5)
    except:
        return False


def is_connected():
    """Check if Ethernet has obtained an IP address."""
    global _eth_lan
    if _eth_lan is None:
        return False
    try:
        status = _eth_lan.status()
        return status == 5  # GOT_IP
    except:
        return False


def get_ip():
    """Get Ethernet IP address if available."""
    global _eth_lan
    if _eth_lan is None:
        return None
    try:
        if is_connected():
            ifconfig = _eth_lan.ifconfig()
            return ifconfig[0] if ifconfig[0] != '0.0.0.0' else None
    except:
        pass
    return None


def get_lan():
    """Get the LAN interface object."""
    global _eth_lan
    return _eth_lan


def get_status():
    """
    Get comprehensive Ethernet status.
    
    Returns:
        dict with status information
    """
    global _eth_lan
    
    if _eth_lan is None:
        return {
            'available': is_available(),
            'initialized': False,
            'enabled': False
        }
    
    try:
        status_code = _eth_lan.status()
        ifconfig = _eth_lan.ifconfig()
        mac = _eth_lan.config('mac')
        
        # Format MAC address
        try:
            import ubinascii
            mac_str = ubinascii.hexlify(mac, ':').decode().upper()
        except:
            mac_str = ':'.join('{:02X}'.format(b) for b in mac)
        
        return {
            'available': True,
            'initialized': True,
            'enabled': True,
            'linkup': status_code in (3, 5),
            'connected': status_code == 5,
            'status_code': status_code,
            'mac': mac_str,
            'ip': ifconfig[0],
            'mask': ifconfig[1],
            'gateway': ifconfig[2],
            'dns': ifconfig[3]
        }
    except Exception as e:
        return {
            'available': True,
            'initialized': True,
            'enabled': True,
            'error': str(e)
        }


def send_status_event():
    """Send Ethernet status notification to the client."""
    try:
        import webrepl_binary as webrepl
        import json
        if hasattr(webrepl, 'notify'):
            status = get_status()
            webrepl.notify(json.dumps({"eth_status": status}))
            return True
    except ImportError:
        pass
    except Exception as e:
        _log("warning", f"Failed to send eth_status notification: {e}")
    return False


def check_status_change():
    """
    Check if Ethernet status has changed and send event if so.
    
    Returns:
        bool: True if status changed
    """
    global _eth_lan, _last_eth_status
    
    # Get current status
    current_status = None
    try:
        if _eth_lan is not None:
            status_code = _eth_lan.status()
            current_status = {
                'linkup': status_code in (3, 5),
                'connected': status_code == 5,
                'status_code': status_code
            }
    except:
        pass
    
    # Check if status changed
    status_changed = False
    if _last_eth_status is None:
        status_changed = current_status is not None
    elif current_status is None:
        status_changed = True
    else:
        if (_last_eth_status.get('linkup') != current_status.get('linkup') or
            _last_eth_status.get('connected') != current_status.get('connected')):
            status_changed = True
    
    # Send event if status changed
    if status_changed:
        _last_eth_status = current_status
        send_status_event()
    
    return status_changed


async def task():
    """Ethernet manager - initializes, monitors, and handles failover"""
    await asyncio.sleep_ms(100)  # Brief delay to let other tasks start
    
    # Check if Ethernet hardware is available
    if not is_available():
        _log("debug", "Ethernet hardware not available")
        return
    
    # Get hostname for mDNS
    try:
        from lib.sys.network import wifi
        hostname = wifi.get_hostname()
    except:
        hostname = None
    
    # Check if already initialized (soft reset)
    if is_connected():
        ip = get_ip()
        if ip:
            _log("info", f"Ethernet already connected (soft reset): {ip}")
            _set_network_ready("Ethernet", ip, hostname)
    else:
        # Initialize Ethernet
        lan = init()
        if lan is None:
            _log("debug", "Ethernet not enabled or init failed")
            return
    
    # Main monitoring loop
    while True:
        if is_connected():
            ip = get_ip()
            if ip and not network_ready.is_set():
                _set_network_ready("Ethernet", ip, hostname)
            # Check for status changes and send events
            check_status_change()
        elif is_link_up():
            _log("debug", "Ethernet link up, waiting for DHCP...")
        
        await asyncio.sleep(5)


# Expose API - maintain backward compatibility with old names
init_ethernet = init

__all__ = ['init', 'init_ethernet', 'is_available', 'is_link_up', 'is_connected', 'get_ip', 
           'get_lan', 'get_status', 'send_status_event', 'check_status_change', 'task']
