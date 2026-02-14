"""
boot.py - Boot Initialization
==============================

Initializes the status LED at boot time.

This file runs automatically on boot.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

print("System booting...")
import esp
esp.osdebug(esp.LOG_INFO)  # or esp.LOG_DEBUG for more verbose

# Initialize status LED (singleton - safe to call multiple times)
from lib.sys.status_led import init_status_led, status_led

init_status_led()

# Initialize display + show boot splash ASAP (before network)
try:
    from lib.sys import board
    if board.has("display"):
        from lib.sys.display.display_manager import init_display
        init_display()
        print("Display initialized (splash)")
except Exception as e:
    print(f"Display init skipped: {e}")
