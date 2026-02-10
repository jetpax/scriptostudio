"""
Syslog Helper for MicroPython ESP32
====================================

Sends syslog messages via UDP (RFC 3164 format).
Requires a syslog server (e.g., rsyslog, syslog-ng) listening on UDP port 514.

Usage:
    from lib.syslog_helper import syslog
    
    # Configure syslog server
    syslog.configure(host='192.168.1.100', port=514)
    
    # Send messages
    syslog.info("System started")
    syslog.error("Connection failed", source="webrtc")
    syslog.debug("Debug message", source="network")

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import socket
import time
import network

# Syslog facility codes (RFC 3164)
FACILITY_USER = 1
FACILITY_LOCAL0 = 16
FACILITY_LOCAL1 = 17
FACILITY_LOCAL2 = 18
FACILITY_LOCAL3 = 19
FACILITY_LOCAL4 = 20
FACILITY_LOCAL5 = 21
FACILITY_LOCAL6 = 22
FACILITY_LOCAL7 = 23

# Severity levels
SEVERITY_EMERG = 0
SEVERITY_ALERT = 1
SEVERITY_CRIT = 2
SEVERITY_ERR = 3
SEVERITY_WARNING = 4
SEVERITY_NOTICE = 5
SEVERITY_INFO = 6
SEVERITY_DEBUG = 7

# Default configuration
_config = {
    'host': None,
    'port': 514,
    'facility': FACILITY_LOCAL0,
    'hostname': None,
    'enabled': False,
    'debug': False  # Enable debug output
}

_syslog_socket = None
_send_errors = []  # Track recent send errors for debugging


class NullSyslog:
    """No-op syslog object - all methods do nothing"""
    def emerg(self, message, source=None):
        pass
    def alert(self, message, source=None):
        pass
    def crit(self, message, source=None):
        pass
    def error(self, message, source=None):
        pass
    def warning(self, message, source=None):
        pass
    def notice(self, message, source=None):
        pass
    def info(self, message, source=None):
        pass
    def debug(self, message, source=None):
        pass
    def configure(self, host, port=514, facility=FACILITY_LOCAL0, hostname=None, debug=False):
        # Replace global syslog instance with real Syslog
        global syslog
        syslog = Syslog()
        syslog.configure(host, port, facility, hostname, debug)
    def test_connection(self):
        return False, "Syslog not configured"
    def get_last_errors(self, count=5):
        return []

# Default no-op instance
syslog = NullSyslog()


class Syslog:
    """Syslog client class"""
    def configure(self, host, port=514, facility=FACILITY_LOCAL0, hostname=None, debug=False):
        """
        Configure syslog server.
        
        Args:
            host: Syslog server IP address or hostname
            port: Syslog server port (default: 514)
            facility: Syslog facility code (default: LOCAL0)
            hostname: Hostname to use in syslog messages (default: auto-detect)
            debug: Enable debug output (default: False)
        """
        global _config, _syslog_socket
        _config['host'] = host
        _config['port'] = port
        _config['facility'] = facility
        _config['hostname'] = hostname or _get_hostname()
        _config['enabled'] = True
        _config['debug'] = debug
        # Reset socket to force recreation
        if _syslog_socket:
            try:
                _syslog_socket.close()
            except:
                pass
            _syslog_socket = None
    
    def test_connection(self):
        """
        Test syslog connection by sending a test message.
        
        Returns:
            tuple: (success: bool, error_message: str or None)
        """
        if not _config['enabled'] or not _config['host']:
            return False, "Syslog not configured"
        
        try:
            sock = _get_socket()
            if sock is None:
                return False, "Failed to create UDP socket"
            
            # Format proper RFC 3164 test message
            try:
                t = time.localtime()
                month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                month = month_names[t[1] - 1]
                day = t[2]
                hour = t[3]
                minute = t[4]
                second = t[5]
                timestamp = f"{month} {day:2d} {hour:02d}:{minute:02d}:{second:02d}"
            except:
                timestamp = "Jan  1 00:00:00"
            
            hostname = _config['hostname'] or 'esp32'
            priority = (_config['facility'] * 8) + SEVERITY_INFO
            test_msg = f"<{priority}>{timestamp} {hostname} syslog-test: Test connection message"
            
            try:
                bytes_sent = sock.sendto(test_msg.encode('utf-8'), (_config['host'], _config['port']))
                if _config.get('debug', False):
                    print(f"[SYSLOG] Test message sent: {bytes_sent} bytes to {_config['host']}:{_config['port']}")
                    print(f"[SYSLOG] Message: {test_msg}")
                return True, None
            except Exception as e:
                error_msg = f"Send failed: {type(e).__name__}: {e}"
                if _config.get('debug', False):
                    print(f"[SYSLOG] {error_msg}")
                return False, error_msg
        
        except Exception as e:
            error_msg = f"Connection test failed: {type(e).__name__}: {e}"
            if _config.get('debug', False):
                print(f"[SYSLOG] {error_msg}")
            return False, error_msg
    
    def get_last_errors(self, count=5):
        """Get recent send errors for debugging"""
        global _send_errors
        return _send_errors[-count:] if _send_errors else []
    
    def emerg(self, message, source=None):
        """Emergency message"""
        _send_syslog(SEVERITY_EMERG, message, source)
    
    def alert(self, message, source=None):
        """Alert message"""
        _send_syslog(SEVERITY_ALERT, message, source)
    
    def crit(self, message, source=None):
        """Critical message"""
        _send_syslog(SEVERITY_CRIT, message, source)
    
    def error(self, message, source=None):
        """Error message"""
        _send_syslog(SEVERITY_ERR, message, source)
    
    def warning(self, message, source=None):
        """Warning message"""
        _send_syslog(SEVERITY_WARNING, message, source)
    
    def notice(self, message, source=None):
        """Notice message"""
        _send_syslog(SEVERITY_NOTICE, message, source)
    
    def info(self, message, source=None):
        """Info message"""
        _send_syslog(SEVERITY_INFO, message, source)
    
    def debug(self, message, source=None):
        """Debug message"""
        _send_syslog(SEVERITY_DEBUG, message, source)


def configure(host, port=514, facility=FACILITY_LOCAL0, hostname=None, debug=False):
    """Configure syslog and replace the global syslog instance"""
    global syslog
    syslog = Syslog()
    syslog.configure(host, port, facility, hostname, debug)


def _get_hostname():
    """Get device hostname from network interface"""
    try:
        sta = network.WLAN(network.STA_IF)
        if sta.active() and sta.isconnected():
            # Try to get hostname from mDNS or use IP
            try:
                import socket
                hostname = socket.gethostname()
                if hostname and hostname != 'MicroPython':
                    return hostname
            except:
                pass
            # Fallback to IP address
            ip = sta.ifconfig()[0]
            if ip != '0.0.0.0':
                return ip.replace('.', '-')
    except:
        pass
    return 'esp32'


def _get_socket():
    """Get or create UDP socket for syslog"""
    global _syslog_socket
    if _syslog_socket is None:
        try:
            _syslog_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            _syslog_socket.settimeout(0.1)  # Non-blocking send
            if _config.get('debug', False):
                print(f"[SYSLOG] Socket created successfully")
        except Exception as e:
            if _config.get('debug', False):
                print(f"[SYSLOG] Failed to create socket: {e}")
            _syslog_socket = None
    return _syslog_socket


def _send_syslog(severity, message, source=None):
    """
    Send syslog message (RFC 3164 format).
    
    Format: <PRI>TIMESTAMP HOSTNAME TAG: MESSAGE
    
    PRI = (facility * 8) + severity
    """
    if not _config['enabled'] or not _config['host']:
        return
    
    try:
        sock = _get_socket()
        if sock is None:
            if _config.get('debug', False):
                print(f"[SYSLOG] Cannot send - socket is None")
            return
        
        # Calculate priority
        priority = (_config['facility'] * 8) + severity
        
        # Format timestamp (RFC 3164: MMM DD HH:MM:SS)
        # Apply timezone offset from NTP settings for local time display
        try:
            tz_offset = 0
            try:
                from lib.sys import settings
                tz_offset = settings.get('ntp.tz_offset', 0)
            except:
                pass
            utc_secs = time.time()
            local_secs = utc_secs + int(tz_offset * 3600)
            t = time.localtime(local_secs)
            month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            month = month_names[t[1] - 1]
            day = t[2]
            hour = t[3]
            minute = t[4]
            second = t[5]
            timestamp = f"{month} {day:2d} {hour:02d}:{minute:02d}:{second:02d}"
        except:
            timestamp = "Jan  1 00:00:00"
        
        # Build tag (source or default)
        tag = source or "webrtc"
        if len(tag) > 32:
            tag = tag[:32]
        
        # Build message
        hostname = _config['hostname'] or 'esp32'
        syslog_msg = f"<{priority}>{timestamp} {hostname} {tag}: {message}"
        
        if _config.get('debug', False):
            print(f"[SYSLOG] Sending to {_config['host']}:{_config['port']}: {syslog_msg[:100]}")
        
        # Send via UDP
        try:
            bytes_sent = sock.sendto(syslog_msg.encode('utf-8'), (_config['host'], _config['port']))
            if _config.get('debug', False):
                print(f"[SYSLOG] ✓ Sent {bytes_sent} bytes successfully")
        except Exception as e:
            # Track error for debugging
            global _send_errors
            error_msg = f"{type(e).__name__}: {e}"
            _send_errors.append(error_msg)
            if len(_send_errors) > 10:
                _send_errors.pop(0)
            
            if _config.get('debug', False):
                print(f"[SYSLOG] Send error: {error_msg}")
            
            # Socket error - reset socket for next attempt
            global _syslog_socket
            try:
                _syslog_socket.close()
            except:
                pass
            _syslog_socket = None
    
    except Exception as e:
        # Track error for debugging
        global _send_errors
        error_msg = f"{type(e).__name__}: {e}"
        _send_errors.append(error_msg)
        if len(_send_errors) > 10:
            _send_errors.pop(0)
        
        if _config.get('debug', False):
            print(f"[SYSLOG] Error: {error_msg}")
