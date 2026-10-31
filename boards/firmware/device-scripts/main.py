"""
main.py - Boot Entry
====================

Runs the pyDirect orchestrator in lib/sys/app.py. REPL and WebREPL code
executes in __main__ (this file's namespace), so only client conveniences
belong here; system state stays in the app module where client code
cannot rebind it.

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

from lib.sys.utils import (
    getSysInfo, getNetworksInfo, neofetch, getStatusInfo,
    getDeviceURL, getDeviceIP
)

from lib.sys import app

app.main()
