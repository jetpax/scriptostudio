"""
pyDirect Orchestrator (lib/sys/app.py)
==================================================

Main orchestrator for the pyDirect device. main.py imports this module and
calls main() on boot to initialize servers and async background tasks.

It lives in a module rather than in main.py because REPL and MCP exec code
runs in __main__. Keeping these globals out of __main__ means client code
such as "import network" cannot rebind names the system tasks depend on.

Architecture:
    - Protocol: MCP, for agents and Studio alike (lib/sys/mcp.py)
    - Transports: held WSS and plain HTTP, both on /mcp

Boot Sequence:
1. Start network tasks and wait for IP address (Ethernet preferred, then WiFi, WWAN)
2. Quick NTP wall-clock sync (UDP only, ~1-3s) — required before any TLS work
3. Start CalmOS / mount storage / run extension autostart
4. Start HTTP/HTTPS server and MCP
5. Start ntp_sync_task as bg task (TZ detection, ongoing re-sync, retry-on-fail)
6. Start async background tasks:
   - queue_pump: Processes the HTTP and WebSocket queue (10ms interval)
   - ntp:        Background TZ refresh + NTP retry if quick sync failed

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import time
import httpserver
import asyncio

from lib.sys import apps, auth, bg_tasks, mcp

from lib.sys.status_led import status_led, StatusLED

# Also imported into __main__ by main.py.
from lib.sys.utils import (
    getSysInfo, getNetworksInfo, neofetch, getStatusInfo,
    getDeviceURL, getDeviceIP
)

# NOTE: Extension helper modules (e.g., in lib/) are imported lazily (on-demand)
# to avoid caching issues when extension dependencies are uploaded after boot.
# Clients can call extension functions directly - Python will import them
# automatically when they're first called via exec().

from lib.sys.log import log

# Server Configuration (from settings API)
DEFAULT_ORIGINS = ('https://scriptostudio.com', 'https://jetpax.github.io')

def _load_server_config():
    """Load server configuration from settings."""
    try:
        from lib.sys import settings
        return {
            'https_cert_file': settings.get('server.https_cert_file', '/certs/servercert.pem'),
            'https_key_file': settings.get('server.https_key_file', '/certs/prvtkey.pem'),
            'allowed_origins': settings.get('server.allowed_origins', [])
        }
    except Exception as e:
        log("warning", f"Failed to load server settings: {e}", source="main")

    return {
        'https_cert_file': '/certs/servercert.pem',
        'https_key_file': '/certs/prvtkey.pem',
        'allowed_origins': []
    }

_server_config = _load_server_config()

# Import network module (provides network_ready event and startup function)
from lib.sys import network


def _clients_changed(count):
    """Keep the LED in step with whether any client is connected."""
    if status_led:
        status_led.set_state(StatusLED.STATE_CLIENT_CONNECTED if count else StatusLED.STATE_NETWORK_CONNECTED)
    log("info", f"MCP clients connected: {count}", source="main")


def start_servers(ip):
    """Start HTTPS server and MCP.

    TLS-only: certs must be provisioned (typically via the PWA's flash
    flow) before the device can serve. Plain HTTP/WS would be blocked by
    browsers as mixed content from the HTTPS PWA anyway.
    """
    log("info", "Starting servers...", source="main")

    cert_file = _server_config.get('https_cert_file', '/certs/servercert.pem')
    key_file  = _server_config.get('https_key_file',  '/certs/prvtkey.pem')

    try:
        httpserver.start(cert_file=cert_file, key_file=key_file)
        log("info", "HTTPS server started on port 443", source="main")
    except Exception as e:
        log("error", f"Failed to start HTTPS server: {e}", source="main")
        log("error", f"  expected cert at {cert_file}, key at {key_file}", source="main")
        return False
    
    try:
        auth.apply()
        origins = list(DEFAULT_ORIGINS) + list(_server_config.get('allowed_origins', []))
        mcp.start(origins, _clients_changed)
        log("info", f"MCP serving on {mcp.PATH}", source="main")
    except Exception as e:
        log("error", f"Failed to start MCP: {e}", source="main")
        return False
    
    return True

# =============================================================================
# Async Background Tasks
# =============================================================================

async def queue_pump():
    """Process the HTTP and WebSocket queue - core task that keeps MCP responsive"""
    while True:
        # Nothing can queue until the servers start, and that takes a network
        if mcp.started():
            try:
                httpserver.process_queue()
            except Exception as e:
                log("warning", f"queue_pump: {e}", source="main")

            mcp.after_pump()
        await asyncio.sleep_ms(10)
        bg_tasks.feed("queue_pump")

def start_core_tasks():
    """The watchdog, and the task it watches. Before anything else runs, so that an app
    holding the event loop gets broken, even on a board that never gets a network."""
    log("info", "Starting background tasks...", source="main")
    
    # Initialize task watchdog (C-native FreeRTOS monitor)
    try:
        import taskwatchdog

        def _watchdog_recovery(task_name):
            # Tier 1 callback — runs when any watched task misses its deadline.
            # The only watched task today is queue_pump (system), so the
            # system-task branch is the hot path.  If user tasks are ever
            # registered directly, the else branch handles them.
            #
            # This runs inside whatever is holding the event loop, so that's
            # the cause, and every other task is a victim.
            info = bg_tasks._tasks.get(task_name, {})
            if info.get("system", False):
                if mcp.in_long_call():
                    # A person's script or panel, in the pump. It's allowed
                    # this long, and stopping anything else wouldn't help.
                    taskwatchdog.feed(task_name)
                else:
                    # Stalling once isn't fatal, so it can finish. No feed:
                    # if it hasn't yielded in 5 s, Tier 2's KeyboardInterrupt
                    # breaks it, and it's the one that gets hit.
                    hog = bg_tasks.running() or "an unnamed task"
                    log("warning", f"Watchdog: '{task_name}' starved by '{hog}'", source="taskwd")
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
    start_core_tasks()
    mcp.clear_old_streams()

    # A board in the field may never see a network, and what it's there to do can't wait
    apps.start_boot_apps()

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

    # Keep running forever. KeyboardInterrupt is intentionally NOT caught here:
    # main() owns the KI counter (single → stop user tasks; 3× consecutive → drop
    # to REPL). Catching locally would swallow KIs before main() sees them, and
    # the escape sequence (the only way to drop to REPL on chips with no
    # host-driven hardware reset, e.g. RP2350) would never fire.
    while True:
        await asyncio.sleep(3600)

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
    # Single Ctrl-C → stop user tasks + restart loop (existing UX).
    # 3 Ctrl-Cs within 60s of each other (sliding window) → drop to UART REPL.
    # Provisioning escape hatch for chips with no host-driven hardware reset
    # (e.g. RP2350: no DTR/RTS path).
    #
    # The window is between consecutive Ctrl-Cs, not relative to asyncio.run
    # start — the latter would falsely reset whenever network.startup() takes
    # >window between buffered KIs.
    kbi_count = 0
    last_kbi_ms = 0
    KBI_ESCAPE_THRESHOLD = 3
    KBI_INTER_WINDOW_MS = 60000
    while True:
        try:
            asyncio.run(main_async())
            break  # Normal exit (shouldn't happen)
        except KeyboardInterrupt:
            now = time.ticks_ms()
            if last_kbi_ms and time.ticks_diff(now, last_kbi_ms) < KBI_INTER_WINDOW_MS:
                kbi_count += 1
            else:
                kbi_count = 1
            last_kbi_ms = now

            if kbi_count >= KBI_ESCAPE_THRESHOLD:
                try:
                    log("info", f"Escape sequence (Ctrl-C x{kbi_count}) — dropping to REPL", source="main")
                except:
                    pass
                try:
                    bg_tasks.stop_all()
                except:
                    pass
                break  # Exit main(), drop to REPL

            # Default: stop user tasks and restart event loop
            try:
                bg_tasks.stop_user_tasks()
            except:
                pass
            bg_tasks._tasks.clear()
            network.network_ready.clear()
            # Loop continues, main_async will restart network tasks
        except SystemExit:
            # Soft reset from the reset tool - restart MicroPython VM
            # Network stays connected (C layer), just reinitialize Python state
            log("info", "Soft reset - restarting MicroPython...", source="main")
            try:
                bg_tasks.stop_all()
            except:
                pass
            bg_tasks._tasks.clear()
            network.network_ready.clear()
            kbi_count = 0  # Intentional restart resets escape counter
            # Loop continues, main_async will restart

    return True
