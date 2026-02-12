"""
WebREPL Client Helper Functions
================================

This module contains helper functions that are callable from the WebREPL client.
These functions automatically send their JSON responses directly to the connected 
WebREPL client without returning values (to avoid REPL echo).

Client-callable functions (auto-send to client):
- getSysInfo()            - Get comprehensive system info, send as JSON (SYS-INFO command)
- getStatusInfo()         - Get status info (memory, temp, uptime, WiFi RSSI) for status bar updates
- neofetch()              - Display neofetch-style system banner with ANSI art

Note: Functions under 10kB are now inlined client-side via ss-helpers.js:
- getListDir, fileExists, deleteFolder - sent as scripts on-demand


Device URL helpers (return values directly):
- getDeviceURL(path)      - Get device URL with correct protocol (http/https), returns string
- getDeviceIP()           - Get device IP address, returns string


Internal helper functions:
- format_uptime()         - Format uptime in human-readable format

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import json
import os
import machine
import network
import time
import gc
import binascii

try:
    from esp32 import mcu_temperature
    ESP32_TEMP_AVAILABLE = True
except ImportError:
    ESP32_TEMP_AVAILABLE = False


# --- Neofetch Configuration ---
NEOFETCH_LOGO_HEIGHT = 13
NEOFETCH_LOGO_WIDTH = 29
NEOFETCH_FW_NAME = "RetroVMS-MINI"
NEOFETCH_TERMINAL = "xterm.js"
NEOFETCH_COMMAND_PARSER = "webREPL"
NEOFETCH_AUTHOR = "jetpax"
NEOFETCH_OS = "MicroPython with \033[3mpyBot\033[23m"  # \033[3m = italic on, \033[23m = italic off

# Neofetch logo with ANSI color codes
NEOFETCH_LOGO = (
    "\r\n\033[38;5;135;1m"
    "        -+#%@@@%#+-      \r\n"
    "      %@@@@@@@@@@@@@%    \r\n"
    "    =@@@%* -@@@- *%@@@=  \r\n"
    "   *@@@     @@@     @@@% \r\n"
    "  +@@%      @@@      %@@+\r\n"
    "  @@@     .#@@@#.     @@@\r\n"
    "  @@@    @@@@@@@@@    @@@\r\n"
    "  *@@# .@@* @@@ *@@. #@@*\r\n"
    "   #@@@@@   @@@   @@@@@# \r\n"
    "    *@@@@_ _@@@_ _@@@@*  \r\n"
    "      #@@@@@@@@@@@@@#    \r\n"
    "        *+%@@@@@%+*      \r\n"
    "\r\n"
    "\033[0;37m"
)


def format_uptime():
    """Format uptime in human-readable format"""
    try:
        uptime_ms = time.ticks_ms()
        uptime_sec = uptime_ms // 1000
        
        days = uptime_sec // 86400
        hours = (uptime_sec % 86400) // 3600
        minutes = (uptime_sec % 3600) // 60
        seconds = uptime_sec % 60
        
        parts = []
        if days > 0:
            parts.append(f"{days}d")
        if hours > 0:
            parts.append(f"{hours}h")
        if minutes > 0:
            parts.append(f"{minutes}m")
        if seconds > 0 or not parts:
            parts.append(f"{seconds}s")
        
        return " ".join(parts)
    except:
        return "Unknown"

# ---------------------------------------------------
# Client-Callable Helper Functions (called via M2M)
# ---------------------------------------------------
# ============================================================================
# Network Information Functions
# ============================================================================

def getSysInfo():
    """
    Get comprehensive system information.
    Prints JSON result for M2M exec() calls via WebREPL Binary Protocol.
    """
    sys_info = {}
    
    # --- Unique ID ---
    try:
        uid_bytes = machine.unique_id()
        uid = binascii.hexlify(uid_bytes).decode().upper()
        sys_info['uid'] = uid
    except Exception as e:
        sys_info['uid'] = 'Unknown-ID'
        # Silent error - M2M commands should not produce output
    
    # --- CPU Frequency ---
    try:
        freq_hz = machine.freq()
        sys_info['freq'] = freq_hz // 1000000  # Convert to MHz
    except Exception as e:
        sys_info['freq'] = 240  # Default for ESP32
        # Silent error - M2M commands should not produce output
    
    # --- Flash Size ---
    try:
        from esp import flash_size
        sys_info['flashSize'] = flash_size()  # Size in bytes
    except Exception as e:
        sys_info['flashSize'] = 4 * 1024 * 1024  # Default 4MB
        # Silent error - M2M commands should not produce output
    
    # --- Platform/OS Info ---
    try:
        import sys as _sys
        import os as _os
        uname = _os.uname()
        
        # Check if SPIRAM is available
        spiram_available = False
        try:
            import esp32
            # Method 1: Check for PSRAM/SPIRAM in heap
            if hasattr(esp32, 'idf_heap_info'):
                try:
                    # Try to get PSRAM heap info (capability 0x80 = MALLOC_CAP_SPIRAM)
                    psram_info = esp32.idf_heap_info(0x80)
                    if psram_info[0] > 0:  # If total PSRAM > 0
                        spiram_available = True
                except:
                    pass
            
            # Method 2: Check if we can allocate from external RAM
            if not spiram_available and hasattr(esp32, 'Partition'):
                try:
                    # Large heap usually indicates SPIRAM
                    gc.collect()
                    if gc.mem_free() > 2000000:  # > 2MB free suggests SPIRAM
                        spiram_available = True
                except:
                    pass
        except:
            pass
        
        # Get MicroPython version
        try:
            mpy_ver = _sys.implementation._mpy if hasattr(_sys.implementation, '_mpy') else getattr(_sys.implementation, 'mpy', 0)
            mpyver = f"{mpy_ver & 0xff}.{(mpy_ver >> 8) & 3}"
        except:
            mpyver = 'Unknown'
        
        sys_info['os'] = {
            'platform': uname.sysname,
            'system': uname.sysname,
            'release': uname.release,
            'version': uname.version,
            'implem': uname.machine,
            'spiram': spiram_available or ('SPIRAM' in uname.machine.upper()),
            'mpyver': mpyver
        }
    except Exception as e:
        sys_info['os'] = {
            'platform': 'ESP32',
            'system': 'MicroPython',
            'release': 'Unknown',
            'version': 'Unknown',
            'implem': 'Unknown',
            'spiram': False,
            'mpyver': 'Unknown'
        }
        # Silent error - M2M commands should not produce output
    
    # --- Memory Info ---
    try:
        gc.collect()
        mem_alloc = gc.mem_alloc()
        mem_free = gc.mem_free()
        
        sys_info['memory'] = {
            'heap': {
                'free': mem_free,
                'alloc': mem_alloc,
                'total': mem_alloc + mem_free
            },
            'flash': {
                'total': sys_info.get('flashSize', 0),
                'real': sys_info.get('flashSize', 0)
            }
        }
    except Exception as e:
        sys_info['memory'] = {
            'heap': {'free': 0, 'alloc': 0, 'total': 0},
            'flash': {'total': 0, 'real': 0}
        }
        # Silent error - M2M commands should not produce output
    
    # --- Network Info ---
    try:
        sta = network.WLAN(network.STA_IF)
        sta_active = sta.active()
        sta_connected = sta.isconnected() if sta_active else False
        
        wifi_info = {
            'connected': sta_connected
        }
        
        if sta_active:
            try:
                wifi_info['mac'] = binascii.hexlify(sta.config('mac'), ':').decode().upper()
            except:
                wifi_info['mac'] = 'Unknown'
            
            if sta_connected:
                try:
                    ifconfig = sta.ifconfig()
                    wifi_info['ip'] = ifconfig[0]
                    wifi_info['netmask'] = ifconfig[1]
                    wifi_info['gateway'] = ifconfig[2]
                    wifi_info['dns'] = ifconfig[3]
                except:
                    wifi_info['ip'] = 'Unknown'
                
                try:
                    wifi_info['rssi'] = sta.status('rssi')
                except:
                    wifi_info['rssi'] = 0
                
                try:
                    wifi_info['ssid'] = sta.config('ssid')
                except:
                    try:
                        wifi_info['ssid'] = sta.config('essid')
                    except:
                        wifi_info['ssid'] = 'Unknown'
        else:
            wifi_info['mac'] = 'Unknown'
            wifi_info['ip'] = 'Unknown'
            wifi_info['rssi'] = 0
        
        sys_info['network'] = {
            'wifi': wifi_info
        }
    except Exception as e:
        sys_info['network'] = {
            'wifi': {
                'mac': 'Unknown',
                'ip': 'Unknown',
                'rssi': 0,
                'connected': False
            }
        }
        # Silent error - M2M commands should not produce output
    
    # --- Time/Uptime Info ---
    try:
        uptime_ms = time.ticks_ms()
        uptime_seconds = uptime_ms // 1000
        
        # Try to get RTC time
        try:
            rtc_time = machine.RTC().datetime()
            # RTC datetime is (year, month, day, weekday, hour, minute, second, subsecond)
            utc_timestamp = 0  # Would need proper conversion
        except:
            utc_timestamp = 0
        
        sys_info['time'] = {
            'uptime_seconds': uptime_seconds,
            'uptime_minutes': uptime_seconds // 60,
            'utc': utc_timestamp,
            'local': utc_timestamp
        }
    except Exception as e:
        sys_info['time'] = {
            'uptime_seconds': 0,
            'uptime_minutes': 0,
            'utc': 0,
            'local': 0
        }
        # Silent error - M2M commands should not produce output
    
    # --- Partitions Info ---
    try:
        from esp32 import Partition
        partitions = []
        
        # Get APP partitions
        for p in Partition.find(Partition.TYPE_APP):
            partitions.append(p.info())
        
        # Get DATA partitions
        for p in Partition.find(Partition.TYPE_DATA):
            partitions.append(p.info())
        
        sys_info['partitions'] = partitions
    except Exception as e:
        sys_info['partitions'] = []
        # Silent error - M2M commands should not produce output
    
    # --- Pins State ---
    try:
        from machine import Pin
        pins = {}
        
        # Try common ESP32 pins (0-39 for ESP32, more for S2/S3/C3)
        for pin_num in range(50):
            try:
                pin = Pin(pin_num)
                pins[pin_num] = pin.value()
            except:
                pass  # Pin not available or not configured
        
        sys_info['pins'] = pins
    except Exception as e:
        sys_info['pins'] = {}
        # Silent error - M2M commands should not produce output
    
    # --- Boot Config ---
    # For MicroPython, we don't have the same NVS-based boot config as Tasmota
    # This would need to be implemented based on your specific config storage
    sys_info['bootcfg'] = []
    
    # --- Temperature (if available) ---
    if ESP32_TEMP_AVAILABLE:
        try:
            temp_celsius = mcu_temperature()
            if temp_celsius is not None:
                sys_info['temperature'] = {
                    'celsius': round(temp_celsius * 10) / 10
                }
        except:
            pass
    
    # Print JSON result (for M2M exec() calls via WebREPL Binary Protocol)
    print(json.dumps(sys_info))

def getStatusInfo():
    """
    Get status info (memory, temperature, uptime, WiFi RSSI) for status bar updates.
    Prints JSON result for M2M exec() calls via WebREPL Binary Protocol.
    This is called periodically by the client to update the status bar.
    """
    mem_alloc = gc.mem_alloc()
    mem_free = gc.mem_free()
    
    temp_data = None
    try:
        if ESP32_TEMP_AVAILABLE:
            temp_c = mcu_temperature()
            if temp_c is not None:
                temp_data = round(temp_c * 10) / 10
    except:
        pass
    
    uptime_ms = time.ticks_ms()
    uptime_min = round(uptime_ms / 1000 / 60)
    
    wifi_rssi = None
    try:
        sta = network.WLAN(network.STA_IF)
        if sta.active() and sta.isconnected():
            wifi_rssi = sta.status('rssi')
    except:
        pass
    
    result = {
        'mem': {'alloc': mem_alloc, 'free': mem_free},
        'temp': temp_data,
        'uptime': uptime_min,
        'wifi_rssi': wifi_rssi
    }
    print(json.dumps(result))

def getNetworksInfo():
    """
    Get comprehensive network information for all interfaces and send to WebREPL client.
    Returns information about WiFi STA, WiFi AP, Ethernet, BLE, VPN, and internet connectivity.
    Sends the result directly to the WebREPL client as JSON.
    
    Returns a dictionary with the following structure:
    {
        'wifiSTA': {active, mac, ssid, ip, mask, gateway, dns},
        'wifiAP': {active, mac, ssid, ip, mask, gateway, dns},
        'eth': {mac, enable, linkup, gotip, ip, mask, gateway, dns} or None,
        'ble': {active, mac},
        'vpn': {available, active, ip, hostname, peers},
        'internetOK': boolean
    }
    """
    networks_info = {}
    
    # --- WiFi STA Info ---
    try:
        sta = network.WLAN(network.STA_IF)
        sta_active = sta.active()
        
        wifi_sta = {
            'active': sta_active,
            'mac': '',
            'ssid': '',
            'ip': '0.0.0.0',
            'mask': '0.0.0.0',
            'gateway': '0.0.0.0',
            'dns': '0.0.0.0'
        }
        
        if sta_active:
            try:
                wifi_sta['mac'] = binascii.hexlify(sta.config('mac'), ':').decode().upper()
            except:
                wifi_sta['mac'] = 'Unknown'
            
            try:
                # Try 'ssid' first, fall back to 'essid'
                try:
                    wifi_sta['ssid'] = sta.config('ssid')
                except:
                    wifi_sta['ssid'] = sta.config('essid')
            except:
                wifi_sta['ssid'] = ''
            
            try:
                ifconfig = sta.ifconfig()
                wifi_sta['ip'] = ifconfig[0]
                wifi_sta['mask'] = ifconfig[1]
                wifi_sta['gateway'] = ifconfig[2]
                wifi_sta['dns'] = ifconfig[3]
            except:
                pass
        
        networks_info['wifiSTA'] = wifi_sta
    except Exception as e:
        # Silent error - M2M commands should not produce output
        networks_info['wifiSTA'] = {
            'active': False,
            'mac': '',
            'ssid': '',
            'ip': '0.0.0.0',
            'mask': '0.0.0.0',
            'gateway': '0.0.0.0',
            'dns': '0.0.0.0'
        }
    
    # --- WiFi AP Info ---
    try:
        ap = network.WLAN(network.AP_IF)
        ap_active = ap.active()
        
        wifi_ap = {
            'active': ap_active,
            'mac': '',
            'ssid': '',
            'ip': '0.0.0.0',
            'mask': '0.0.0.0',
            'gateway': '0.0.0.0',
            'dns': '0.0.0.0'
        }
        
        if ap_active:
            try:
                wifi_ap['mac'] = binascii.hexlify(ap.config('mac'), ':').decode().upper()
            except:
                wifi_ap['mac'] = 'Unknown'
            
            try:
                # Try 'ssid' first, fall back to 'essid'
                try:
                    wifi_ap['ssid'] = ap.config('ssid')
                except:
                    wifi_ap['ssid'] = ap.config('essid')
            except:
                wifi_ap['ssid'] = ''
            
            try:
                ifconfig = ap.ifconfig()
                wifi_ap['ip'] = ifconfig[0]
                wifi_ap['mask'] = ifconfig[1]
                wifi_ap['gateway'] = ifconfig[2]
                wifi_ap['dns'] = ifconfig[3]
            except:
                pass
        
        networks_info['wifiAP'] = wifi_ap
    except Exception as e:
        # Silent error - M2M commands should not produce output
        networks_info['wifiAP'] = {
            'active': False,
            'mac': '',
            'ssid': '',
            'ip': '0.0.0.0',
            'mask': '0.0.0.0',
            'gateway': '0.0.0.0',
            'dns': '0.0.0.0'
        }
    
    # --- Ethernet Info ---
    try:
        # Check if Ethernet is available on this device
        if hasattr(network, 'LAN'):
            try:
                lan = network.LAN()
                lan_mac = lan.config('mac')
                lan_status = lan.status()
                
                eth_info = {
                    'mac': binascii.hexlify(lan_mac, ':').decode().upper(),
                    'enable': (lan_status != 0 and lan_status != 2),  # 0=down, 2=connecting
                    'linkup': (lan_status == 3 or lan_status == 5),   # 3=up, 5=got_ip
                    'gotip': (lan_status == 5),                       # 5=got_ip
                    'ip': '0.0.0.0',
                    'mask': '0.0.0.0',
                    'gateway': '0.0.0.0',
                    'dns': '0.0.0.0'
                }
                
                try:
                    ifconfig = lan.ifconfig()
                    eth_info['ip'] = ifconfig[0]
                    eth_info['mask'] = ifconfig[1]
                    eth_info['gateway'] = ifconfig[2]
                    eth_info['dns'] = ifconfig[3]
                except:
                    pass
                
                networks_info['eth'] = eth_info
            except:
                # LAN exists but not initialized/configured
                networks_info['eth'] = {}
        else:
            # Ethernet not supported on this device
            networks_info['eth'] = None
    except Exception as e:
        # Silent error - M2M commands should not produce output
        networks_info['eth'] = None
    
    # --- BLE Info ---
    # Note: We don't try to activate BLE here to avoid crashes when other
    # components (WiFi, USB modem) are using shared radio resources.
    # Just report current state without forcing activation.
    try:
        import bluetooth
        ble = bluetooth.BLE()
        ble_active = ble.active()
        
        ble_info = {
            'active': ble_active,
            'mac': ''
        }
        
        if ble_active:
            try:
                # BLE config returns (addr_type, addr)
                ble_mac = ble.config('mac')
                if isinstance(ble_mac, tuple) and len(ble_mac) >= 2:
                    ble_info['mac'] = binascii.hexlify(ble_mac[1], ':').decode().upper()
                else:
                    ble_info['mac'] = binascii.hexlify(ble_mac, ':').decode().upper()
            except:
                ble_info['mac'] = 'Unknown'
        else:
            # Don't try to activate BLE just to get MAC - it can crash when
            # WiFi or other radio components are active
            ble_info['mac'] = 'Activate BLE to see MAC'
        
        networks_info['ble'] = ble_info
    except Exception as e:
        # Silent error - M2M commands should not produce output
        networks_info['ble'] = {
            'active': False,
            'mac': 'Not available'
        }
    
    # --- VPN (Husarnet) Info ---
    try:
        vpn_info = {
            'available': False,
            'active': False,
            'ip': None,
            'hostname': '',
            'peers': []
        }
        
        try:
            import husarnet
            vpn_info['available'] = True
            
            status = husarnet.status()
            vpn_info['active'] = status.get('joined', False)
            vpn_info['ip'] = status.get('ip', None)
            
            # Get hostname from config
            try:
                config_file = '/settings/vpn.json'
                with open(config_file, 'r') as f:
                    config = json.load(f)
                    vpn_info['hostname'] = config.get('hostname', '')
            except:
                pass
            
            # Get peer list if active
            if vpn_info['active']:
                try:
                    peers_raw = husarnet.list_peers()
                    vpn_info['peers'] = [
                        {'hostname': p[0], 'ip': p[1]} 
                        for p in peers_raw
                    ] if peers_raw else []
                except:
                    vpn_info['peers'] = []
                    
        except ImportError:
            # Husarnet module not available (not compiled in firmware)
            pass
        
        networks_info['vpn'] = vpn_info
    except Exception as e:
        # Silent error - M2M commands should not produce output
        networks_info['vpn'] = {
            'available': False,
            'active': False,
            'ip': None,
            'hostname': '',
            'peers': []
        }
    
    # --- Internet Connectivity Check ---
    try:
        import socket
        
        internet_ok = False
        
        # Check if we have a network connection (WiFi STA, Ethernet, or VPN)
        sta_connected = networks_info['wifiSTA']['active'] and networks_info['wifiSTA']['ip'] != '0.0.0.0'
        eth_connected = (networks_info['eth'] and 
                        networks_info['eth'].get('gotip', False))
        
        if sta_connected or eth_connected:
            try:
                # Try to resolve and connect to a well-known server
                s = socket.socket()
                s.settimeout(5)  # 5 second timeout
                addr_info = socket.getaddrinfo('google.com', 80)[0][-1]
                s.connect(addr_info)
                s.close()
                internet_ok = True
            except:
                internet_ok = False
        
        networks_info['internetOK'] = internet_ok
    except Exception as e:
        # Silent error - M2M commands should not produce output
        networks_info['internetOK'] = False
    
    # Print JSON result (for M2M exec() calls via WebREPL Binary Protocol)
    print(json.dumps(networks_info))

def getDeviceIP():
    """
    Get the device's IP address.
    
    Returns:
        str: IP address (e.g., '192.168.1.32') or '0.0.0.0' if not connected
    
    Example:
        >>> ip = getDeviceIP()
        >>> print(f"Device IP: {ip}")
    """
    try:
        sta = network.WLAN(network.STA_IF)
        if sta.active() and sta.isconnected():
            return sta.ifconfig()[0]
        return '0.0.0.0'
    except:
        return '0.0.0.0'

def getDeviceURL(path='/'):
    """
    Get a full device URL with the correct protocol (http:// or https://).
    
    This function automatically detects if HTTPS is available by checking if
    the HTTPS server is actually running. This prevents Mixed Content errors
    when ScriptO Studio is served over HTTPS.
    
    Uses the mDNS hostname (e.g., pydirect-xxxx.local) instead of IP address
    to ensure browser certificate trust works correctly in iframes.
    
    Args:
        path (str): URL path to append (default: '/')
                   Should start with '/' (e.g., '/hello_ui', '/api/data')
    
    Returns:
        str: Complete URL with protocol, hostname, and path
             Examples: 'https://pydirect-2b88.local/hello_ui'
                      'http://pydirect-2b88.local/api/data'
    
    Example:
        >>> url = getDeviceURL('/my_app/index.html')
        >>> webrepl.display_ui(url, 'My Application')
    
    Note:
        - Uses mDNS hostname for certificate trust in iframes
        - Checks if httpserver module has HTTPS server running
        - Falls back to HTTP if HTTPS not available
        - This ensures URL protocol matches server configuration
    """
    # Use hostname with .local suffix for mDNS - required for iframe cert trust
    try:
        hostname = network.hostname()
        if hostname and not hostname.endswith('.local'):
            hostname = f'{hostname}.local'
    except:
        # Fallback to IP if hostname not available
        hostname = getDeviceIP()
    
    # Detect HTTPS support by checking if HTTPS server is running
    protocol = 'http'
    try:
        from esp32 import httpserver
        # Check if HTTPS server handle exists and is not None
        if httpserver.https_running():
            protocol = 'https'
    except:
        # If import fails or https_running() doesn't exist, fallback to cert check
        try:
            os.stat('/certs/servercert.pem')
            protocol = 'https'
        except:
            pass
    
    # Ensure path starts with '/'
    if not path.startswith('/'):
        path = '/' + path
    
    return f'{protocol}://{hostname}{path}'

def neofetch():
    """
    Display neofetch-style system information banner with ANSI art.
    This function prints directly to the console (not JSON formatted).
    
    Shows:
    - Hostname
    - Local IP address
    - Platform (ESP32 variant)
    - OS (MicroPython version)
    - Version string
    - Uptime
    - CPU type and frequency
    - Terminal type
    - Command parser
    - Author
    - ANSI color bar
    """
    try:
        # Get hostname
        hostname = network.hostname()
    except:
        hostname = "Unknown"
    
    # Get IP address
    try:
        sta = network.WLAN(network.STA_IF)
        if sta.active() and sta.isconnected():
            ip_address = sta.ifconfig()[0]
        else:
            ip_address = "Not connected"
    except:
        ip_address = "Unknown"
    
    # Get system information
    try:
        version = os.uname().version
        platform = os.uname().machine
    except:
        version = "Unknown"
        platform = "ESP32"
    
    # Get uptime
    uptime = format_uptime()
    
    # Get CPU type and frequency
    try:
        cpu_freq = machine.freq() / 1000000
        # Platform format: "BOARD_NAME with MCU_NAME" (BOARD_NAME must not contain "with")
        # e.g., "Scripto P4+C6 with ESP32P4" -> MCU = "ESP32P4" -> "ESP32-P4"
        parts = platform.split(" with ")
        mcu_raw = parts[-1].upper().replace("-", "") if len(parts) > 1 else "ESP32"
        # Format nicely: ESP32P4 -> ESP32-P4, ESP32S3 -> ESP32-S3
        if mcu_raw.startswith("ESP32") and len(mcu_raw) > 5:
            mcu = f"ESP32-{mcu_raw[5:]}"
        else:
            mcu = mcu_raw
        cpu_type = f"{mcu} @ {cpu_freq:.0f} MHz"
    except:
        cpu_type = "Unknown"
    
    # Build the neofetch output string
    output = NEOFETCH_LOGO
    
    # Move cursor up and right to position text next to logo
    output += f"\033[{NEOFETCH_LOGO_HEIGHT}A\033[{NEOFETCH_LOGO_WIDTH}C"
    
    # Host Name
    output += f"\033[1;31mHostname\033[0;37m: {hostname}\r\n\033[{NEOFETCH_LOGO_WIDTH}C"
    
    # IP address
    output += f"\033[1;31mLocal IP\033[0;37m: {ip_address}\r\n\033[{NEOFETCH_LOGO_WIDTH}C"
   
    # Platform
    output += f"\033[1;31mPlatform\033[0;37m: {platform}\r\n\033[{NEOFETCH_LOGO_WIDTH}C"
    
    # OS
    output += f"\033[1;31mOS\033[0;37m: {NEOFETCH_OS}\r\n\033[{NEOFETCH_LOGO_WIDTH}C"   
    
    # Version
    output += f"\033[1;31mVersion\033[0;37m: {version}\r\n\033[{NEOFETCH_LOGO_WIDTH}C"
    
    # Uptime
    output += f"\033[1;31mUptime\033[0;37m: {uptime}\r\n\033[{NEOFETCH_LOGO_WIDTH}C"
    
    # CPU Type
    output += f"\033[1;31mCPU\033[0;37m: {cpu_type}\r\n\033[{NEOFETCH_LOGO_WIDTH}C"
    
    # Terminal
    output += f"\033[1;31mTerminal\033[0;37m: {NEOFETCH_TERMINAL}\r\n\033[{NEOFETCH_LOGO_WIDTH}C"
    
    # Command Parser
    output += f"\033[1;31mCMD Parser\033[0;37m: {NEOFETCH_COMMAND_PARSER}\r\n\033[{NEOFETCH_LOGO_WIDTH}C"
    
    # Author
    output += f"\033[1;31mAuthor\033[0;37m: {NEOFETCH_AUTHOR}\r\n\r\n\033[{NEOFETCH_LOGO_WIDTH}C"
    
    # Color bar
    output += "\033[40m   "  # Black background
    output += "\033[41m   "  # Red background
    output += "\033[42m   "  # Green background
    output += "\033[43m   "  # Yellow background
    output += "\033[44m   "  # Blue background
    output += "\033[45m   "  # Magenta background
    output += "\033[46m   "  # Cyan background
    output += "\033[47m   "  # White background
    output += "\033[0m"       # Reset
    
    # Move cursor down
    output += f"\033[{2}B"
    
    # Print the output
    print(output)


# ============================================================================
# NTP Time Sync Functions
# ============================================================================

def _is_time_synced():
    """Check if RTC time is already synced (year >= 2023)."""
    try:
        from time import gmtime
        return gmtime()[0] >= 2023
    except:
        return False


def _detect_timezone():
    """
    Detect timezone offset using IP geolocation API.
    Returns (offset_hours, timezone_name) or (None, None) on failure.
    """
    try:
        import urequests as requests
    except ImportError:
        import requests
    
    # Try multiple APIs in case one fails
    apis = [
        {
            'url': 'http://ip-api.com/json/?fields=offset,timezone',
            'parse': lambda d: (d.get('offset', 0) / 3600.0, d.get('timezone', 'Unknown'))
        },
        {
            'url': 'http://worldtimeapi.org/api/ip',
            'parse': lambda d: ((d.get('raw_offset', 0) + d.get('dst_offset', 0)) / 3600.0, d.get('timezone', 'Unknown'))
        }
    ]
    
    for api in apis:
        try:
            response = requests.get(api['url'], timeout=5)
            if response.status_code == 200:
                data = response.json()
                offset_hours, timezone = api['parse'](data)
                response.close()
                return (offset_hours, timezone)
            response.close()
        except:
            continue
    
    return (None, None)


def sync_ntp(server=None, tz_offset=None, auto_detect=None, force=False):
    """
    Sync time from NTP server if enabled and not already synced.
    
    Args:
        server: NTP server hostname (uses settings default: pool.ntp.org)
        tz_offset: Timezone offset in hours (uses settings default)
        auto_detect: Auto-detect timezone from IP (uses settings default: True)
        force: Force re-sync even if already synced
    
    Returns:
        dict: {'success': bool, 'utc': {...}, 'local': {...}, 'tz_offset': float, ...}
    """
    from lib.sys import settings
    
    # NTP is always-on — no enable/disable toggle.
    # If unreachable (isolated LAN), sync fails gracefully and RTC keeps its time.
    
    # Get settings with defaults
    server = server or settings.get('ntp.server', 'pool.ntp.org')
    auto_detect = auto_detect if auto_detect is not None else settings.get('ntp.auto_detect_tz', True)
    tz_offset = tz_offset if tz_offset is not None else settings.get('ntp.tz_offset', 0.0)
    timezone_name = settings.get('ntp.timezone', 'UTC')
    
    # Auto-detect timezone if enabled and not already detected
    if auto_detect and tz_offset == 0.0:
        detected_offset, detected_tz = _detect_timezone()
        if detected_offset is not None:
            tz_offset = detected_offset
            timezone_name = detected_tz
            # Save detected timezone to settings for next time
            settings.set('ntp.tz_offset', tz_offset)
            settings.set('ntp.timezone', timezone_name)
            settings.save()
    
    # Sync time from NTP server
    try:
        import ntptime
        ntptime.host = server
        ntptime.settime()
    except Exception as e:
        return {'success': False, 'error': f'NTP sync failed: {e}'}
    
    # Get UTC time
    from time import gmtime, localtime, mktime
    utc = gmtime()
    if utc[0] < 2023:
        return {'success': False, 'error': 'Sync failed - invalid time'}
    
    # Calculate local time
    utc_timestamp = mktime(utc)
    local_timestamp = utc_timestamp + int(tz_offset * 3600)
    local = localtime(local_timestamp)
    
    result = {
        'success': True,
        'utc': {
            'year': utc[0], 'month': utc[1], 'day': utc[2],
            'hour': utc[3], 'minute': utc[4], 'second': utc[5]
        },
        'local': {
            'year': local[0], 'month': local[1], 'day': local[2],
            'hour': local[3], 'minute': local[4], 'second': local[5]
        },
        'tz_offset': tz_offset,
        'timezone': timezone_name,
        'timestamp': utc_timestamp
    }
    
    # Print result for M2M calls
    print(json.dumps(result))
    return result

