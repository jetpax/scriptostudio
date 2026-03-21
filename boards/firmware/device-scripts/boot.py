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

# Check for PSRAM - firmware requires it for networking and WebREPL buffers
import gc
gc.collect()
total = gc.mem_alloc() + gc.mem_free()
if total < 1_000_000:  # Less than 1MB = no PSRAM
    print("\n" + "=" * 60)
    print("FATAL: PSRAM not detected")
    print("This firmware requires an ESP32-S3 with PSRAM (e.g. N16R8)")
    print(f"Total heap: {total:,} bytes (expected >4,000,000 with PSRAM)")
    print("=" * 60 + "\n")
    import sys
    sys.exit()

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
