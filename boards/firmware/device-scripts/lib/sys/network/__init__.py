"""
Network module - unified interface for WiFi, Ethernet, and WWAN.

Provides network initialization, monitoring, and task management.
Owns aggregate `network_ready` state across interfaces (OR-semantics) and
the global mDNS hostname.

Usage:
    from lib.sys import network

    await network.startup()              # start enabled interfaces, wait for any IP
    ip, iface = network.get_active_ip()  # priority eth > wifi > wwan

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import asyncio

# Aggregate state — set when ANY interface is up, cleared only when ALL are down.
# Interface tasks must report through _update() rather than touching this directly.
network_ready = asyncio.Event()

# Per-interface state: name -> {"up": bool, "ip": str|None}
_interface_state = {}

# Selection priority for get_active_ip()
_PRIORITY = ("ethernet", "wifi", "wwan")


def _update(iface, up, ip=None):
    """Report interface state; recompute aggregate network_ready event.

    Called by interface tasks when their connectivity changes. The aggregate
    event flips on the first interface that comes up and only clears once
    every interface is down — so a wifi drop with eth still up keeps the
    network_ready event set, which is what downstream services need.
    """
    prev = _interface_state.get(iface, {})
    _interface_state[iface] = {"up": up, "ip": ip}

    if prev.get("up") != up:
        if up:
            print(f"[INFO] {iface} up: {ip}")
        else:
            print(f"[INFO] {iface} down")

    any_up = any(s.get("up") for s in _interface_state.values())
    if any_up and not network_ready.is_set():
        network_ready.set()
    elif not any_up and network_ready.is_set():
        network_ready.clear()
        print("[INFO] All interfaces down — network_ready cleared")


def get_active_ip():
    """Return (ip, iface) of the highest-priority up interface, or (None, None)."""
    for iface in _PRIORITY:
        s = _interface_state.get(iface)
        if s and s.get("up") and s.get("ip"):
            return s["ip"], iface
    return None, None


def get_hostname():
    """Resolve device hostname from settings; fall back to WLAN STA MAC suffix.

    Read-only — does not require WiFi to be active. Safe to call from any
    interface module or before startup().
    """
    try:
        from lib.sys import settings
        hostname = settings.get("device.hostname")
        if hostname:
            return hostname
        prefix = settings.get("wifi.hostname_prefix", "pybot")
    except Exception:
        prefix = "pybot"

    try:
        import network as _net
        import ubinascii
        sta = _net.WLAN(_net.STA_IF)
        mac = ubinascii.hexlify(sta.config('mac'), ':').decode()
        suffix = mac.replace(':', '')[-4:]
        return f"{prefix}-{suffix}"
    except Exception:
        return prefix


def _set_global_hostname():
    """Register hostname with ESP-IDF mDNS service. Called once at startup."""
    try:
        import network as _net
        hostname = get_hostname()
        _net.hostname(hostname)
        return hostname
    except Exception as e:
        print(f"[WARNING] Failed to set global hostname: {e}")
        return None


async def startup():
    """Start all enabled network tasks and wait for any connection."""
    from lib.sys import bg_tasks, settings

    print("[INFO] Starting network tasks...")

    # Set the global mDNS hostname before any interface activates so the
    # ESP-IDF mDNS service picks it up on the first IP_EVENT_*_GOT_IP.
    hostname = _set_global_hostname()
    if hostname:
        print(f"[INFO] mDNS hostname: {hostname}.local")

    wifi_enabled = settings.get("network.wifi.enabled", True)
    eth_enabled = settings.get("network.ethernet.enabled", True)
    wwan_enabled = settings.get("network.wwan.enabled", True)

    if not (wifi_enabled or eth_enabled or wwan_enabled):
        print("[WARNING] All interfaces disabled - enabling WiFi as fallback")
        wifi_enabled = True

    # Start in priority order so eth gets a head-start when both are present.
    if eth_enabled:
        bg_tasks.start("eth_task", eth.task, is_system=True)
    else:
        print("[INFO] Ethernet disabled by user preference")

    if wifi_enabled:
        bg_tasks.start("wifi_task", wifi.task, is_system=True)
    else:
        print("[INFO] WiFi disabled by user preference")

    if wwan_enabled:
        bg_tasks.start("wwan_task", wwan.task, is_system=True)
    else:
        print("[INFO] WWAN disabled by user preference")

    print("[INFO] Waiting for network connection...")
    await network_ready.wait()
    ip, iface = get_active_ip()
    print(f"[INFO] Network ready via {iface}: {ip}")


# Backward-compat shim — old call sites used _set_network_ready("WiFi", ip, hostname).
# Kept so any out-of-tree code keeps working; new code should use _update().
def _set_network_ready(source, ip, hostname=None):
    iface = (source or "").lower()
    if iface in ("wifi", "ethernet", "wwan"):
        _update(iface, True, ip)


# Late import — submodules pull names from this module, so they must be imported
# after the public API is defined to avoid circular-import failures.
from lib.sys.network import wifi, eth, wwan

__all__ = ['wifi', 'eth', 'wwan', 'network_ready', 'startup',
           '_update', 'get_active_ip', 'get_hostname']
