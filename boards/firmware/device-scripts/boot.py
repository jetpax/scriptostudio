"""
boot.py - Boot Initialization
==============================

Initializes hardware before main.py: status LED, display (CalmOS for EPD,
splash for LCD), and AXP2101 PMU (if present).

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

# Initialize display — EPD boards use CalmOS (full lifecycle), LCD boards show splash
try:
    from lib.sys import board
    if board.has("display"):
        _dev = board.device("display")
        if _dev and _dev.interface == "epd":
            # EPD: CalmOS owns display — hardware init + layout + first refresh (~3-4s)
            # This overlaps with network startup in main.py
            import lib.calmos as calmos
            calmos.init()
        else:
            # LCD: boot splash
            from lib.sys.display.display_manager import init_display
            init_display()
            print("Display initialized (splash)")
except Exception as e:
    print(f"Display init skipped: {e}")

# Initialize AXP2101 PMU — charging, ADC, fuel gauge, low-battery thresholds
# Without this, battery voltage/percentage reads return stale/zero values
# and charging uses silicon defaults. Ref: Waveshare axp_prot.cpp axp_init()
try:
    from lib.sys import board
    _pmu = board.device("pmu") if board.has("battery") else None
    if _pmu and _pmu.type == "AXP2101":
        from machine import Pin, I2C
        import time
        _i2c_cfg = board.i2c("i2c0")
        _i2c = I2C(0, scl=Pin(_i2c_cfg.scl), sda=Pin(_i2c_cfg.sda), freq=400000)
        _AXP = 0x34

        def _w8(reg, val):
            _i2c.writeto(_AXP, bytes([reg, val]))

        def _r8(reg):
            _i2c.writeto(_AXP, bytes([reg]))
            return _i2c.readfrom(_AXP, 1)[0]

        def _rmw(reg, mask, val):
            """Read-modify-write: clear bits in mask, set bits in val."""
            _w8(reg, (_r8(reg) & ~mask) | val)

        # Verify chip ID (AXP2101 = 0x4A)
        _chip = _r8(0x03)
        if _chip == 0x4A:
            # VBUS input limits: 4.36V voltage, 1.5A current
            _rmw(0x15, 0x07, 0x03)  # VBUS voltage limit 4.36V (bits [2:0])
            _rmw(0x16, 0x07, 0x05)  # VBUS current limit 1500mA (bits [2:0])

            # System power-down voltage: 2.6V
            _rmw(0x25, 0x07, 0x02)  # 2.6V (bits [2:0])

            # Enable ADC channels (reg 0x30)
            # bit 0 = bat voltage, bit 1 = bat current, bit 2 = VBUS, bit 3 = sys voltage, bit 4 = temp
            _w8(0x30, _r8(0x30) | 0x1F)

            # Enable battery detection (reg 0x68 bit 3)
            _w8(0x68, _r8(0x68) | 0x08)

            # Charging config
            _rmw(0x61, 0x0F, 0x01)  # Pre-charge current 50mA (bits [3:0])
            _rmw(0x62, 0x1F, 0x08)  # Constant current 200mA (bits [4:0])
            _rmw(0x63, 0x0F, 0x01)  # Termination current 25mA (bits [3:0])
            _rmw(0x64, 0x03, 0x02)  # Target voltage 4.2V (bits [1:0])

            # Charge LED off
            _rmw(0x69, 0x07, 0x00)

            # Power key: 4s off, 1s on
            _rmw(0x27, 0x0F, 0x04)  # bits [3:2]=off time, [1:0]=on time

            # RTC button battery: charge to 3.0V, enable
            _rmw(0x18, 0x07, 0x02)  # 3.0V target (bits [2:0])
            _w8(0x18, _r8(0x18) | 0x80)  # Enable RTC battery charging (bit 7)

            # Fuel gauge: enable learning + save to ROM
            _rmw(0xA2, 0x03, 0x03)  # bits [1:0] = learn + save

            # Low battery thresholds
            _rmw(0xA1, 0xF0, 0x10)  # Warn at 10% (bits [7:4])
            _rmw(0xA1, 0x0F, 0x05)  # Shutdown at 5% (bits [3:0])

            time.sleep_ms(50)  # Wait for first ADC conversion
            print("AXP2101 PMU initialized (charge=200mA, gauge=on)")
        else:
            print(f"AXP2101 not found (chip: 0x{_chip:02x})")

        # Clean up init-only locals
        del _w8, _r8, _rmw, _i2c, _i2c_cfg, _AXP, _chip
        gc.collect()
except Exception as e:
    print(f"PMU init skipped: {e}")

