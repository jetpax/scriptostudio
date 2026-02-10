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
