"""
Unified Logging for pyDirect/Scripto Platform
==============================================

Single function that outputs to all available destinations:
- Console (print)
- WebREPL (via logging module)
- Syslog UDP (RFC 3164, auto-configured from device settings)

Usage:
    from lib.sys.log import log
    log("info", "System started", source="main")      # console + WebREPL + syslog
    log("info", "Starting servers...")                  # console + WebREPL only
    log("error", f"Connection failed: {e}", source="pfc")

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import socket
import time

# --- Syslog UDP state (lazy-init from device settings) ---
_sock = None
_cfg = None  # None=not checked, False=disabled, dict=configured


def _syslog_send(msg, source, severity=6):
    """Best-effort syslog UDP send. Auto-configures from settings on first call."""
    global _sock, _cfg
    if _cfg is None:
        try:
            from lib.sys import settings
            host = settings.get('syslog.host', '')
            if not host:
                _cfg = False
                return
            hostname = 'esp32'
            try:
                import network as net
                sta = net.WLAN(net.STA_IF)
                if sta.active() and sta.isconnected():
                    hostname = sta.ifconfig()[0].replace('.', '-')
            except:
                pass
            _cfg = {
                'host': host,
                'port': settings.get('syslog.port', 514),
                'hostname': hostname,
                'tz_offset': settings.get('ntp.tz_offset', 0),
            }
        except:
            _cfg = False
            return
    if _cfg is False:
        return
    try:
        if _sock is None:
            _sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Apply timezone offset for local time display
        utc_secs = time.time()
        local_secs = utc_secs + int(_cfg.get('tz_offset', 0) * 3600)
        t = time.localtime(local_secs)
        ts = "{} {:2d} {:02d}:{:02d}:{:02d}".format(
            ('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec')[t[1]-1],
            t[2], t[3], t[4], t[5])
        pri = 128 + severity  # LOCAL0(16)*8 + severity
        _sock.sendto("<{}>{} {} {}: {}".format(pri, ts, _cfg['hostname'], source, msg)
                     .encode(), (_cfg['host'], _cfg['port']))
    except:
        _sock = None


# --- Unified log function ---
def log(level, msg, source=None):
    """
    Log to all available outputs: console, WebREPL, and syslog.

    Args:
        level: 'debug', 'info', 'warning', 'error'
        msg: Log message
        source: Syslog source tag (e.g. 'pfc', 'main'). If set, also sends via syslog UDP.
    """
    # Console + WebREPL (via logging module if available)
    try:
        import webrepl_binary as webrepl
        if webrepl.running():
            import logging
            logger = logging.getLogger(source or 'system')
            getattr(logger, level, logger.info)(msg)
        else:
            print("[{}] {}".format(level.upper(), msg))
    except:
        print("[{}] {}".format(level.upper(), msg))

    # Syslog UDP (only if source tag provided)
    if source:
        _sev = {'debug': 7, 'info': 6, 'warning': 4, 'error': 3}.get(level, 6)
        _syslog_send(msg, source, _sev)


def reset():
    """Re-read settings on next call (after settings change)."""
    global _cfg, _sock
    _cfg = None
    if _sock:
        try:
            _sock.close()
        except:
            pass
    _sock = None
