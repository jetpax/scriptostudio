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
1. Start network tasks and wait for IP address (Ethernet preferred, then WiFi, WWAN)
2. Quick NTP wall-clock sync (UDP only, ~1-3s) — required before any TLS work
3. Start CalmOS / mount storage / run extension autostart
4. Start HTTP/HTTPS server, WebREPL, WebRTC signaling
5. Start ntp_sync_task as bg task (TZ detection, ongoing re-sync, retry-on-fail)
6. Register connection callbacks for LED state management
7. Start async background tasks:
   - queue_pump: Processes WBP queues for both transports (10ms interval)
   - ntp:        Background TZ refresh + NTP retry if quick sync failed

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
        err_msg = str(e).lower()
        if "already running" in err_msg:
            # C-level WS handler survived soft reset — webrepl.running()
            # returned false (Python state re-imported) but the C state
            # is intact. Treat as success to avoid aborting server init.
            log("info", f"WebREPL already running (C state survived reset)", source="main")
        else:
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
        bg_tasks.feed("queue_pump")

async def system_root():
    """Main async entry point - starts all background tasks"""
    log("info", "Starting background tasks...", source="main")
    
    # Initialize task watchdog (C-native FreeRTOS monitor)
    try:
        import taskwatchdog

        def _watchdog_recovery(task_name):
            # Tier 1 callback — runs when any watched task misses its deadline.
            # The only watched task today is queue_pump (system), so the
            # system-task branch is the hot path.  If user tasks are ever
            # registered directly, the else branch handles them.
            info = bg_tasks._tasks.get(task_name, {})
            if info.get("system", False):
                # System task is the victim — user tasks hogging the event
                # loop are the cause.  stop_user_tasks() delivers
                # CancelledError at each user task's next await, which is
                # more surgical than Tier 2's KeyboardInterrupt (that one
                # hits whichever task is executing and can cause collateral).
                stopped = bg_tasks.stop_user_tasks()
                taskwatchdog.feed(task_name)
                if stopped:
                    log("warning", f"Watchdog: '{task_name}' starved — stopped {stopped}", source="taskwd")
            else:
                bg_tasks.stop(task_name)
                log("warning", f"Watchdog: stopped stalled task '{task_name}'", source="taskwd")

        taskwatchdog.set_recovery(_watchdog_recovery)
        log("info", "Task watchdog initialized", source="main")
    except ImportError:
        log("debug", "taskwatchdog not available", source="main")
    
    # Start system tasks (protected from Stop button)
    bg_tasks.start("queue_pump", queue_pump, is_system=True, watchdog_ms=5000)
    log("debug", "queue_pump started (system, watchdog=5s)", source="main")
    
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

def _quick_ntp():
    """One-shot synchronous NTP at boot. Sets the wall clock before any
    TLS-using service starts so cert validity windows pass.

    Skips TZ detection (slow HTTP) — that runs in ntp_sync_task() afterwards.
    No-op if the RTC is already valid (soft reset). Failure is non-fatal:
    ntp_sync_task() retries with backoff in the background.
    """
    try:
        from lib.sys.utils import sync_ntp, _is_time_synced
        if _is_time_synced():
            return True
        r = sync_ntp(auto_detect=False)
        if r and r.get('success'):
            log("info", "NTP wall clock set (TZ deferred to bg)", source="ntp")
            return True
        err = r.get('error') if r else 'unknown'
        log("warning", f"Quick NTP failed: {err} — bg retry will continue", source="ntp")
    except Exception as e:
        log("warning", f"Quick NTP error: {e} — bg retry will continue", source="ntp")
    return False


async def ntp_sync_task():
    """Background NTP/TZ task. Exits on first full success.

    If _quick_ntp() already set the wall clock, sync_ntp(force=False) skips
    the NTP step and only runs TZ detection — keeping the boot path fast.
    On retry it re-evaluates: if NTP wasn't set, it tries NTP first.
    """
    from lib.sys.utils import sync_ntp
    backoff = 5
    while True:
        try:
            r = sync_ntp()
            if r and r.get('success'):
                log("info", f"NTP synced ({r.get('timezone', 'UTC')})", source="ntp")
                return
            err = r.get('error') if r else 'unknown'
            log("debug", f"NTP not yet ready: {err}", source="ntp")
        except Exception as e:
            log("warning", f"NTP attempt error: {e}", source="ntp")
        await asyncio.sleep(backoff)
        backoff = min(backoff * 2, 300)  # cap at 5 min


async def main_async():
    """Async main entry point"""
    # Start network tasks and wait for the first interface to come up.
    await network.startup()

    # Resolve active interface from aggregated state (priority eth > wifi > wwan).
    ip, iface = network.get_active_ip()
    if not ip:
        # Defensive fallback — shouldn't happen since network.startup() awaited
        # network_ready, but keep the old per-interface query as a backstop.
        ip = network.eth.get_ip() or network.wifi.get_ip() or network.wwan.get_ip()
        iface = "unknown"
    log("info", f"Active interface: {iface} ({ip})", source="main")

    # Set LED to network connected state (yellow solid - waiting for client)
    if status_led:
        status_led.set_state(StatusLED.STATE_NETWORK_CONNECTED)

    # Quick synchronous NTP — sets the wall clock before any TLS-using
    # service (autostart extensions, HTTPS server) starts. Without this,
    # outbound HTTPS calls fail mbedtls cert validation (-0x2700) because
    # the RTC reads epoch and peer cert notBefore is "in the future".
    # Bounded by ntptime's UDP timeout (~1-5s); failure falls through to
    # the bg ntp_sync_task which retries.
    _quick_ntp()

    # Start CalmOS async tasks — only on e-paper display boards
    try:
        from lib.sys import board
        display = board.device("display")
        if display and display.interface == "epd":
            import lib.calmos as calmos
            calmos.start_tasks()
        else:
            log("debug", "CalmOS skipped (not an e-paper display)", source="main")
    except Exception as e:
        log("warning", f"CalmOS tasks skipped: {e}", source="main")

    # Mount SD card (mandatory if board supports it, silent fail if no card)
    try:
        from lib.sys.storage import mount_sdcard, init as storage_init
        mount_sdcard()
        storage_init()  # Resolve paths, migrate flash→SD if needed
    except Exception as e:
        log("warning", f"Storage init failed: {e}", source="main")

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

    # Start servers — client connectivity is no longer gated on NTP success.
    if not start_servers(ip):
        log("error", "Cannot continue without servers", source="main")
        return False

    # NTP runs in the background with retry, so a slow/failed sync doesn't
    # delay anything that depends on server start.
    bg_tasks.start("ntp", ntp_sync_task)

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
