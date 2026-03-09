"""
pyDirect Orchestrator (main.py)
==================================================

Main orchestrator script for the pyDirect device.
Auto-runs on boot to initialize servers and async background tasks.

Architecture:
    - Protocol: WebREPL Binary Protocol (WBP) - unified message format & authentication
    - Transports:
        - WebRTC DataChannel: Primary - works on all platforms
        - WebSocket (WSS): Fallback transport
    
    Both transports use WBP for message framing, authentication, and queue processing
    through the unified webrepl_binary module.

Boot Sequence:
1. Start network tasks and wait for IP address (WiFi, Ethernet, or WWAN)
2. Start HTTP/HTTPS server
3. Start WebREPL (WBP over WebSocket transport)
4. Start WebRTC signaling server (WBP over WebRTC transport)
5. Register connection callbacks for LED state management
6. Start async background tasks:
   - queue_pump: Processes WBP queues for both transports (10ms interval)

Helper Utilities (imported from lib.sys.utils):
    - getSysInfo()        - Comprehensive system info
    - getNetworksInfo()   - All network interfaces info
    - getStatusInfo()     - Status bar info (memory, temp, uptime, RSSI)
    - neofetch()          - Neofetch-style system banner with ANSI art

    Note: Small M2M scripts (< 10KB) are client-side inline scripts
    per the M2M sizing principle - not stored on device flash.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import time
import httpserver
import webrepl_binary as webrepl
import json
import asyncio

from lib.sys import bg_tasks

from lib.sys.status_led import status_led, StatusLED


from lib.sys.utils import (
    getSysInfo, getNetworksInfo, neofetch, getStatusInfo,
    getDeviceURL, getDeviceIP
)

# NOTE: Extension helper modules (e.g., in lib/) are imported lazily (on-demand)
# to avoid caching issues when extension dependencies are uploaded after boot.
# WebREPL clients can call extension functions directly - Python will import
# them automatically when they're first called via exec().

from lib.sys.log import log

# Server Configuration (from settings API)
def _load_server_config():
    """Load server configuration from settings."""
    try:
        from lib.sys import settings
        return {
            'webrepl_password': settings.get('server.webrepl_password', 'password'),
            'http_port': settings.get('server.http_port', 80),
            'https_enabled': settings.get('server.https_enabled', False),
            'https_cert_file': settings.get('server.https_cert_file', '/certs/servercert.pem'),
            'https_key_file': settings.get('server.https_key_file', '/certs/prvtkey.pem')
        }
    except Exception as e:
        log("warning", f"Failed to load server settings: {e}", source="main")
    
    return {
        'webrepl_password': 'password',
        'http_port': 80,
        'https_enabled': False,
        'https_cert_file': '/certs/servercert.pem',
        'https_key_file': '/certs/prvtkey.pem'
    }

_server_config = _load_server_config()

# Import network module (provides network_ready event and startup function)
from lib.sys import network


def start_servers(ip):
    """Start HTTP server (and optionally HTTPS) and WebREPL"""
    log("info", "Starting servers...", source="main")
    
    http_port = _server_config.get('http_port', 80)
    https_enabled = _server_config.get('https_enabled', False)
    webrepl_password = _server_config.get('webrepl_password', 'password')
    
    # Start HTTP server (and HTTPS if enabled)
    try:
        if https_enabled:
            cert_file = _server_config.get('https_cert_file')
            key_file = _server_config.get('https_key_file')
            httpserver.start(http_port, cert_file=cert_file, key_file=key_file)
            log("info", f"HTTP/HTTPS server started on ports {http_port}/443", source="main")
        else:
            httpserver.start(http_port)
            log("info", f"HTTP server started on port {http_port}", source="main")
    except Exception as e:
        log("error", f"Failed to start HTTP server: {e}", source="main")
        return False
    
    # Start WebREPL
    try:
        if webrepl.running():
            log("info", "WebREPL already running (Soft Reset detected)", source="main")
            # Recover previous session (re-attach dupterm)
            if hasattr(webrepl, 'recover'):
                if webrepl.recover():
                    log("info", "Session recovered (dupterm re-attached)", source="main")
                    if status_led:
                        status_led.set_state(StatusLED.STATE_CLIENT_CONNECTED)
                    # Send welcome notification after soft reset recovery
                    import os
                    import json
                    uname = os.uname()
                    tagline = f"MicroPython {uname.version}; {uname.machine}"
                    webrepl.notify(json.dumps({"welcome": {"banner": "", "tagline": tagline}}))
        else:
            webrepl.start(webrepl_password, "/webrepl")
            log("info", "WebREPL started", source="main")
    except Exception as e:
        log("error", f"Failed to start WebREPL: {e}", source="main")
        return False
    
    # Register WebSocket connect and disconnect callbacks
    try:
        import wsserver
        wsserver.on(wsserver.CONNECT, wsserver_connect_callback)
        wsserver.on(wsserver.DISCONNECT, wsserver_disconnect_callback)
        log("info", "WebSocket callbacks registered", source="main")
    except Exception as e:
        log("error", f"Failed to register callbacks: {e}", source="main")
    
    # Start WebRTC signaling server (optional)
    try:
        from lib.sys import webrtc_signaling
        if webrtc_signaling.start():
            log('info', '✓ WebRTC signaling server started', source='main')
        else:
            log('warning', 'WebRTC signaling server failed to start', source='main')
    except ImportError:
        log('debug', 'WebRTC signaling not available (module not found)', source='main')
    except Exception as e:
        log('error', f'Failed to start WebRTC signaling: {e}', source='main')
    
    # Register WebREPL authentication callback (fires after successful auth)
    try:
        if hasattr(webrepl, 'on_auth'):
            webrepl.on_auth(webrepl_auth_callback)
            log("info", "WebREPL auth callback registered", source="main")
        else:
            log("error", "webrepl.on_auth() not available - firmware may need update", source="main")
    except Exception as e:
        log("error", f"Failed to register WebREPL auth callback: {e}", source="main")
    
    return True

# =============================================================================
# Async Background Tasks
# =============================================================================

async def queue_pump():
    """Process webRTC, WebREPL and HTTP queues - core task that keeps REPL responsive"""
    while True:
        try:
            webrepl.process_queue()  # Handles both WebSocket and WebRTC transports
        except Exception as e:
            # "stream operation not supported" is a benign race during WS connect/auth cycle
            if "stream" not in str(e):
                log("warning", f"queue_pump(webrepl): {e}", source="main")
        try:
            httpserver.process_queue()
        except Exception as e:
            if "stream" not in str(e):
                log("warning", f"queue_pump(http): {e}", source="main")
        
        await asyncio.sleep_ms(10)

async def system_root():
    """Main async entry point - starts all background tasks"""
    log("info", "Starting background tasks...", source="main")
    
    # Start system tasks (protected from Stop button)
    bg_tasks.start("queue_pump", queue_pump, is_system=True)
    log("debug", "queue_pump started (system)", source="main")
    
    log("info", f"Active tasks: {list(bg_tasks.list_tasks().keys())}", source="main")
    
    # Keep running forever
    while True:
        try:
            await asyncio.sleep(3600)
        except KeyboardInterrupt:
            # Catch any stray KeyboardInterrupt at top level
            log("debug", "KeyboardInterrupt in system_root - stopping user tasks", source="main")
            bg_tasks.stop_user_tasks()


def wsserver_connect_callback(client_id, event_name):
    """
    Callback when a WebSocket client connects.
    Note: This fires BEFORE authentication. We handle welcome message in auth callback instead.
    """
    global _webrepl_client_connected
    # Note: Client is not authenticated yet, so we don't set LED or send welcome here
    log("info", f"   WebSocket client {client_id} connected (waiting for authentication)", source="main")

# WebREPL client ID constants
WEBREPL_CLIENT_WEBSOCKET = 0  # Client ID 0-3 for WebSocket connections
WEBREPL_CLIENT_WEBRTC = -2    # Special sentinel for WebRTC connections

def webrepl_auth_callback(client_id=WEBREPL_CLIENT_WEBRTC):
    """
    Callback when a client successfully connects (WebSocket auth or WebRTC connection).
    Just handles LED state - welcome banner is fetched by client via inline M2M script.
    
    Args:
        client_id: WebSocket client ID (0-3) or WEBREPL_CLIENT_WEBRTC (-2) for WebRTC
    """
    try:
        global _webrepl_client_connected
        # Set LED to client connected state
        if status_led:
            status_led.set_state(StatusLED.STATE_CLIENT_CONNECTED)
        _webrepl_client_connected = True
        log("info", f"✅ WebREPL client authenticated", source="main")
    
    except Exception as e:
        # Don't let callback exceptions break the connection
        log("error", f"   Error in auth callback: {e}", source="main")
        import sys
        sys.print_exception(e)


def wsserver_disconnect_callback(client_id, event_name):
    """
    Callback when a WebSocket client disconnects.
    Now safely called from MicroPython task context (queued event).
    Sets LED back to network connected state (yellow solid - waiting for client).
    """
    global _webrepl_client_connected
    if not _webrepl_client_connected:
        return  # Already disconnected, skip redundant callbacks
    log("info", f"🔴 Disconnect callback: client_id={client_id}", source="main")
    
    # Set LED back to network connected state (network still connected, waiting for client)
    if status_led:
        status_led.set_state(StatusLED.STATE_NETWORK_CONNECTED)
    _webrepl_client_connected = False

# Track client connection state for LED management
_webrepl_client_connected = False

async def main_async():
    """Async main entry point"""
    # Start network tasks and wait for connection
    await network.startup()
    
    # Get IP from whichever network connected (network.startup() already waited for connection)
    # Check interfaces in priority order - at least one must have an IP
    ip = network.eth.get_ip() or network.wifi.get_ip() or network.wwan.get_ip()
    
    # Set LED to network connected state (yellow solid - waiting for client)
    if status_led:
        status_led.set_state(StatusLED.STATE_NETWORK_CONNECTED)
    
    # Auto-sync NTP time if enabled (after network connection)
    try:
        from lib.sys.utils import sync_ntp
        sync_ntp()  # Syncs if enabled and not already synced
    except Exception as e:
        log("warning", f"NTP sync failed: {e}", source="main")
    
    
    # Display init moved to boot.py for earliest splash screen

    
    # Syslog is now auto-configured from settings by lib.sys.log
    log("info", "*******************************************************", source="main")
    log("info", "System initialized", source="main")
    log("info", "*******************************************************", source="main")
    
    # Auto-start registered extensions (after network + syslog ready)
    try:
        from lib.sys.autostart import run_autostart
        run_autostart()
    except ImportError:
        pass  # autostart module not available
    except Exception as e:
        log("warning", f"Extension autostart failed: {e}", source="main")
    
    # Start servers
    if not start_servers(ip):
        log("error", "Cannot continue without servers", source="main")
        return False
    
    # Enter system_root for other background tasks
    await system_root()
    
    return True


def main():
    """Main entry point - wraps async main"""
    
    # Check for setup mode (set during provisioning)
    # If set, run the setup server instead of normal startup
    try:
        from lib.sys import settings
        if settings.get("setup_mode"):
            print("[MAIN] Setup mode detected, starting setup server...")
            from lib.sys.setup_server import run_setup_server
            run_setup_server()
            # After setup completes (soft reset), this won't be reached
            # But if setup_server returns (error case), continue to normal boot
            print("[MAIN] Setup server returned, continuing to normal boot...")
    except Exception as e:
        print(f"[WARNING] Setup mode check failed: {e}")
    
    # Enter async event loop
    # Loop handles KeyboardInterrupt by stopping user tasks and restarting
    while True:
        try:
            asyncio.run(main_async())
            break  # Normal exit (shouldn't happen)
        except KeyboardInterrupt:
            # Stop user tasks and restart event loop
            # Wrap in try/except as logger may be unavailable after crash
            try:
                bg_tasks.stop_user_tasks()
            except:
                pass
            # Clear task registry and reset network_ready event
            bg_tasks._tasks.clear()
            network.network_ready.clear()
            # Loop continues, main_async will restart network tasks
        except SystemExit:
            # Soft reset from WebREPL - restart MicroPython VM
            # Network stays connected (C layer), just reinitialize Python state
            log("info", "Soft reset - restarting MicroPython...", source="main")
            try:
                bg_tasks.stop_all()
            except:
                pass
            bg_tasks._tasks.clear()
            network.network_ready.clear()
            # Loop continues, main_async will restart
    
    return True

# Auto-run if executed as main
if __name__ == "__main__":
    main()
