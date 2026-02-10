"""
Board Hardware Definition Module

Provides singleton access to board hardware configuration.
Loads from /settings/board.json with identity/capabilities/resources/devices structure.

Usage:
    from lib.sys import board
    
    # Identity
    board.id.name          # "Scripto P4+C6"
    board.id.chip          # "ESP32-P4"
    
    # Capabilities
    board.has("ethernet")  # True
    
    # Pins
    led_pin = board.pin("status_led")
    
    # Buses
    can_bus = board.can("twai")
    tx = can_bus.tx
    
    # Devices
    eth = board.device("ethernet")
    phy = eth.phy

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import json

_board = None


class _View:
    """Base view class for accessing nested dict data as attributes."""
    def __init__(self, data):
        self._data = data

    def __getattr__(self, name):
        try:
            return self._data[name]
        except KeyError:
            raise AttributeError(f"'{type(self).__name__}' object has no attribute '{name}'")


class BoardIdentity(_View):
    """View for board identity information."""
    pass


class UART(_View):
    """View for UART bus configuration."""
    pass


class I2C(_View):
    """View for I2C bus configuration."""
    pass


class CAN(_View):
    """View for CAN bus configuration."""
    pass


class SDMMC(_View):
    """View for SDMMC bus configuration."""
    pass


class SPI(_View):
    """View for SPI bus configuration."""
    pass


class Device(_View):
    """View for device configuration."""
    @property
    def type(self):
        return self._data.get("type")


class Board:
    """Board hardware configuration class."""
    
    def __init__(self, data):
        self._data = data
        self.id = BoardIdentity(data.get("identity", {}))
        self._cap = data.get("capabilities", {})
        self._res = data.get("resources", {})
        self._dev = data.get("devices", {})

    # ---------- capabilities ----------

    def has(self, name):
        """
        Check if board has a capability.
        
        Args:
            name: Capability name, supports nested paths with dots (e.g., "uart.primary")
            
        Returns:
            bool: True if capability exists
            
        Examples:
            board.has("ethernet")      # True if board has ethernet
            board.has("uart.primary")  # True if board has primary UART
        """
        parts = name.split(".")
        cur = self._cap
        
        # First check capabilities dict
        for p in parts:
            if not isinstance(cur, dict) or p not in cur:
                # If not in capabilities, check resources
                return self._has_resource(name)
            cur = cur[p]
        return bool(cur)
    
    def _has_resource(self, name):
        """Check if resource exists (for nested has() checks)."""
        parts = name.split(".")
        if len(parts) < 2:
            return False
        
        # Check resources (e.g., "uart.primary")
        resource_type = parts[0]
        resource_name = parts[1]
        
        if resource_type in self._res:
            return resource_name in self._res[resource_type]
        
        return False

    # ---------- pins ----------

    def pin(self, name):
        """
        Get a pin number by name.
        
        Args:
            name: Pin name (e.g., "status_led", "boot")
            
        Returns:
            int: Pin number
            
        Raises:
            KeyError: If pin not found
        """
        try:
            return self._res["pins"][name]
        except KeyError:
            raise KeyError(f"Unknown pin '{name}'")

    # ---------- buses ----------

    def uart(self, name):
        """Get UART bus configuration."""
        return UART(self._bus("uart", name))

    def i2c(self, name):
        """Get I2C bus configuration."""
        return I2C(self._bus("i2c", name))

    def can(self, name):
        """Get CAN bus configuration."""
        return CAN(self._bus("can", name))

    def sdmmc(self, name):
        """Get SDMMC bus configuration."""
        return SDMMC(self._bus("sdmmc", name))
    
    def spi(self, name):
        """Get SPI bus configuration."""
        return SPI(self._bus("spi", name))

    def _bus(self, kind, name):
        """Internal: get bus configuration."""
        try:
            return self._res[kind][name]
        except KeyError:
            raise KeyError(f"Unknown {kind} bus '{name}'")

    # ---------- devices ----------

    def device(self, name):
        """
        Get device configuration.
        
        Args:
            name: Device name (e.g., "ethernet", "status_led")
            
        Returns:
            Device: Device configuration view
            
        Raises:
            KeyError: If device not found
        """
        try:
            return Device(self._dev[name])
        except KeyError:
            raise KeyError(f"Unknown device '{name}'")


def _load():
    """Load board configuration from /settings/board.json."""
    global _board
    if _board is None:
        try:
            with open('/settings/board.json', 'r') as f:
                data = json.load(f)
            _board = Board(data)
        except OSError as e:
            # File doesn't exist - create minimal generic board
            _board = Board({
                "identity": {
                    "id": "generic",
                    "name": "Generic Board",
                    "vendor": "generic",
                    "chip": "ESP32",
                    "revision": "1.0"
                },
                "capabilities": {},
                "resources": {"pins": {}},
                "devices": {}
            })
        except Exception as e:
            print(f"[board] Error loading config: {e}")
            raise
    return _board


# Module-level attribute delegation to singleton
def __getattr__(name):
    """Delegate attribute access to the board singleton."""
    return getattr(_load(), name)
