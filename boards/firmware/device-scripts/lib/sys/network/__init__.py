"""
Network module - unified interface for WiFi, Ethernet, and WWAN.

Provides network initialization, monitoring, and task management.

Usage:
    from lib import network
    
    # Start all network tasks and wait for connection
    await network.startup()
    
    # Or use individual interfaces
    network.wifi.init()
    network.eth.init()
    network.wwan.init()

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import asyncio

# Shared network ready event - set by any network task when IP obtained
network_ready = asyncio.Event()

def _set_network_ready(source, ip, hostname=None):
    """Helper to set network_ready event and log connection"""
    if not network_ready.is_set():
        network_ready.set()
        print(f"[INFO] Network ready via {source}: {ip}")
        if hostname:
            print(f"[INFO] mDNS hostname: {hostname}.local")

async def startup():
    """Start all network tasks and wait for any connection"""
    from lib.sys import bg_tasks, settings
    
    print("[INFO] Starting network tasks...")
    
    # Check which interfaces are enabled (default: all enabled)
    wifi_enabled = settings.get("network.wifi.enabled", True)
    eth_enabled = settings.get("network.ethernet.enabled", True)
    wwan_enabled = settings.get("network.wwan.enabled", True)
    
    # Safety check: ensure at least one interface is enabled
    if not (wifi_enabled or eth_enabled or wwan_enabled):
        print("[WARNING] All interfaces disabled - enabling WiFi as fallback")
        wifi_enabled = True
    
    # Start enabled network tasks
    if wifi_enabled:
        bg_tasks.start("wifi_task", wifi.task, is_system=True)
    else:
        print("[INFO] WiFi disabled by user preference")
        
    if eth_enabled:
        bg_tasks.start("eth_task", eth.task, is_system=True)
    else:
        print("[INFO] Ethernet disabled by user preference")
        
    if wwan_enabled:
        bg_tasks.start("wwan_task", wwan.task, is_system=True)
    else:
        print("[INFO] WWAN disabled by user preference")
    
    print("[INFO] Waiting for network connection...")
    
    # Wait for any network interface to get an IP
    await network_ready.wait()
    
    print("[INFO] Network connection established")

# Import submodules (after function definitions to avoid circular imports)
from lib.sys.network import wifi, eth, wwan

__all__ = ['wifi', 'eth', 'wwan', 'network_ready', 'startup', '_set_network_ready']
