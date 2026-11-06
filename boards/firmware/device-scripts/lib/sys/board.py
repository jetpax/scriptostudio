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

What the person wires to the board is kept apart from the published manifest, in
/settings/wired.json, so a manifest update never loses it. Its devices and buses
read like the manifest's, through the same calls:

    board.add_wired("device", "door", {"type": "switch", "pin": 2, "description": "..."})
    board.pin("door")      # 2
    board.remove_wired("door")

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import json
import os

PATH = "/settings/board.json"
WIRED_PATH = "/settings/wired.json"

# What can be wired: a device, or a bus on pins of its own that devices then name
WIRED_KINDS = ("device", "i2c", "spi", "uart", "can")
WIRED_MAX = 16
WIRED_DESCRIPTION_MAX = 300
WIRED_ENTRY_MAX = 600
_NAME_MAX = 32

# Integer fields of a device or bus that aren't GPIO numbers
_NOT_PINS = (
    "id", "slot", "lanes", "bus_width", "channels", "count", "pins_used", "phy_addr", "spi_mode",
    "color_bits", "grayscale_bits", "width", "height", "offset_x", "offset_y",
    "clock_hz", "frequency_hz", "spi_speed_hz", "freq", "baudrate", "size_bytes", "fs_bytes",
)
# Numbered on a chip of their own, not this one's GPIOs
_NOT_GPIO = ("expander", "mipi")
# A manifest marks a bus "default" where it's only where that bus goes by convention, on pins
# that are free until something is wired to them
_DEFAULT_KINDS = ("i2c", "spi", "uart", "can")

# GPIOs each chip has, and those its flash and PSRAM hold. 33 to 37 are only octal PSRAM's,
# but refused on every S3, which costs little and needs no knowing which PSRAM it has.
_CHIPS = {
    "ESP32-S3": (tuple(range(0, 22)) + tuple(range(26, 49)), tuple(range(26, 38))),
    "ESP32-P4": (tuple(range(0, 55)), ()),
}

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


class I2S(_View):
    """View for I2S bus configuration."""
    pass


class QSPI(_View):
    """View for QSPI bus configuration."""
    pass


class Device(_View):
    """View for device configuration."""
    @property
    def type(self):
        return self._data.get("type")


def _pins_in(value, key=None):
    """The GPIO numbers in a device or bus, told apart from other numbers by their field names."""
    if isinstance(value, dict):
        for k, v in value.items():
            if k not in _NOT_GPIO and not k.endswith("_expander_pin"):
                yield from _pins_in(v, k)
    elif isinstance(value, list):
        for v in value:
            yield from _pins_in(v, key)
    elif isinstance(value, int) and not isinstance(value, bool) and key not in _NOT_PINS:
        yield value


def _is_buses(value):
    """Whether a resource holds named buses, like i2c, rather than one set of pins, like usb."""
    return isinstance(value, dict) and len(value) > 0 and all(isinstance(v, dict) for v in value.values())


def _names(kind, name, ref):
    """Whether a device's bus field, "i2c.i2c0" or just "spi1", names this bus."""
    return ref == kind + "." + name or ref == name


class Board:
    """Board hardware configuration class."""

    def __init__(self, data, wired=None, wired_error=None):
        self._data = data
        self.id = BoardIdentity(data.get("identity", {}))
        self._cap = data.get("capabilities", {})
        self._pub_res = data.get("resources", {})
        self._pub_dev = data.get("devices", {})
        self._wired = wired or {}
        self.wired_error = wired_error
        self._wired_dev = self._wired.get("devices", {})
        self._wired_res = self._wired.get("resources", {})
        # A default bus whose pin something is wired to is left out, so nothing drives it as that bus
        held = set(self._wired_pins())
        self.shadowed = [(k, n) for k, n, bus in self._free_defaults() if held & set(_pins_in(bus))]
        self._shown_res = {}
        for kind, value in self._pub_res.items():
            if _is_buses(value):
                value = {n: b for n, b in value.items() if (kind, n) not in self.shadowed}
            self._shown_res[kind] = value
        self._res = dict(self._shown_res)
        for kind, buses in self._wired_res.items():
            merged = dict(self._res.get(kind, {}))
            merged.update(buses)
            self._res[kind] = merged
        self._dev = dict(self._pub_dev)
        self._dev.update(self._wired_dev)

    def facts(self):
        """What this board's hardware is, in a form to hand to an agent."""
        facts = {
            "identity": self._data.get("identity", {}),
            "capabilities": [name for name, on in self._cap.items() if on],
            "resources": self._shown_res,
            "devices": self._pub_dev,
        }
        if self._wired:
            facts["wired"] = self._wired
        if self.wired_error:
            facts["wired_error"] = self.wired_error
        return facts

    # ---------- wired ----------

    def wired(self):
        """A copy of what's wired, in the shape of /settings/wired.json."""
        return json.loads(json.dumps(self._wired))

    def _wired_entries(self):
        for name, entry in self._wired_dev.items():
            yield "device", name, entry
        for kind, buses in self._wired_res.items():
            for name, entry in buses.items():
                yield kind, name, entry

    def _wired_pins(self, leaving=None):
        for kind, name, entry in self._wired_entries():
            if name != leaving:
                yield from _pins_in(entry)

    def _free_defaults(self, leaving=None):
        """Default buses no device uses, whose pins are free to wire other things to."""
        refs = [d.get("bus") for d in self._pub_dev.values() if isinstance(d, dict)]
        refs += [d.get("bus") for n, d in self._wired_dev.items() if n != leaving]
        for kind in _DEFAULT_KINDS:
            for name, bus in self._pub_res.get(kind, {}).items():
                if isinstance(bus, dict) and bus.get("default") and not any(_names(kind, name, r) for r in refs):
                    yield kind, name, bus

    def _owners(self, leaving=None):
        """Each GPIO already spoken for, and what by."""
        free = [(k, n) for k, n, b in self._free_defaults(leaving)]
        owners = {}
        for name, device in self._pub_dev.items():
            for p in _pins_in(device):
                owners.setdefault(p, name)
        for kind, value in self._pub_res.items():
            if kind in _NOT_GPIO:
                continue
            if kind in ("pins", "gpio") and isinstance(value, dict):
                for name, p in value.items():
                    if isinstance(p, int) and not isinstance(p, bool):
                        owners.setdefault(p, name)
            elif _is_buses(value):
                for name, bus in value.items():
                    if (kind, name) not in free:
                        for p in _pins_in(bus):
                            owners.setdefault(p, kind + "." + name)
            else:
                for p in _pins_in(value):
                    owners.setdefault(p, kind)
        for kind, name, entry in self._wired_entries():
            if name != leaving:
                for p in _pins_in(entry):
                    owners.setdefault(p, name)
        return owners

    def _published_names(self):
        names = set(self._pub_dev)
        for kind, value in self._pub_res.items():
            if isinstance(value, dict) and (kind in ("pins", "gpio") or _is_buses(value)):
                names.update(value)
        return names

    def _find_bus(self, ref, leaving=None):
        for kind, value in self._res.items():
            if _is_buses(value):
                for name, bus in value.items():
                    if name != leaving and _names(kind, name, ref):
                        return kind, name, bus
        return None

    def check_wired(self, kind, name, entry):
        """Raise ValueError saying why entry can't be wired as name. Otherwise return notes on the
        default buses it takes over."""
        if self.wired_error:
            raise ValueError(self.wired_error + ", so fix or remove it first")
        if kind not in WIRED_KINDS:
            raise ValueError("kind is one of " + ", ".join(WIRED_KINDS))
        if not (
            isinstance(name, str)
            and 0 < len(name) <= _NAME_MAX
            and "a" <= name[0] <= "z"
            and all("a" <= c <= "z" or "0" <= c <= "9" or c == "_" for c in name)
        ):
            raise ValueError("name is lowercase letters, digits and underscores, starting with a letter")
        if name in self._published_names():
            raise ValueError("%s is already this board's own hardware" % name)
        if not isinstance(entry, dict):
            raise ValueError("entry is an object")
        if kind == "device" and not (isinstance(entry.get("type"), str) and isinstance(entry.get("description"), str)):
            raise ValueError("A device needs a type and a description")
        if len(entry.get("description") or "") > WIRED_DESCRIPTION_MAX:
            raise ValueError("Keep the description under %d characters" % WIRED_DESCRIPTION_MAX)
        if len(json.dumps(entry)) > WIRED_ENTRY_MAX:
            raise ValueError("The entry is over %d characters" % WIRED_ENTRY_MAX)
        if len([n for k, n, e in self._wired_entries() if n != name]) >= WIRED_MAX:
            raise ValueError("%d things are wired already, so remove one first" % WIRED_MAX)
        pins = list(_pins_in(entry))
        if len(set(pins)) < len(pins):
            raise ValueError("The entry names one GPIO twice")
        ref = entry.get("bus")
        if ref is not None:
            if kind != "device":
                raise ValueError("Only a device names a bus")
            found = self._find_bus(ref, name)
            if not found:
                raise ValueError("There's no bus %s here. Name one from Resources or Wired, as kind.name" % ref)
            if set(pins) & set(_pins_in(found[2])):
                raise ValueError("%s already gives that bus's pins, so name only the bus" % ref)
        chip_name = self._data.get("identity", {}).get("chip")
        chip = _CHIPS.get(chip_name)
        owners = self._owners(name)
        for p in pins:
            if chip and p not in chip[0]:
                raise ValueError("GPIO %d doesn't exist on the %s" % (p, chip_name))
            if chip and p in chip[1]:
                raise ValueError("GPIO %d belongs to the %s's flash and PSRAM" % (p, chip_name))
            if p in owners:
                raise ValueError("GPIO %d is already used by %s" % (p, owners[p]))
        notes = []
        for k, n, bus in self._free_defaults(name):
            taken = sorted(set(pins) & set(_pins_in(bus)))
            if taken:
                notes.append(
                    "%s.%s was only this board's default for that bus, so it's left out while %s holds GPIO %s"
                    % (k, n, name, ", ".join(str(p) for p in taken))
                )
        return notes

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

    def pins(self):
        """Every GPIO this board names, wired ones too, for a choice of pin."""
        named = list(self._res.get("pins", {}).values()) + list(self._res.get("gpio", {}).values())
        named += [d.get("pin") for d in self._wired_dev.values()]
        return sorted(set(p for p in named if isinstance(p, int) and not isinstance(p, bool)))

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
            # A wired device on one pin is named by that pin
            pin = self._wired_dev.get(name, {}).get("pin")
            if isinstance(pin, int) and not isinstance(pin, bool):
                return pin
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

    def qspi(self, name):
        """Get QSPI bus configuration."""
        return QSPI(self._bus("qspi", name))

    def i2s(self, name):
        """Get I2S bus configuration."""
        return I2S(self._bus("i2s", name))

    def flash(self):
        """Flash info view (size_bytes, fs_bytes, ...). Empty if absent."""
        return _View(self._res.get("flash", {}))

    def psram(self):
        """PSRAM info view (size_bytes, cs, ...). Empty if absent."""
        return _View(self._res.get("psram", {}))

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


def _read_wired():
    """What's wired, and why it couldn't be read if it couldn't. A bad file mustn't stop the board
    module, since boot needs it."""
    try:
        with open(WIRED_PATH) as f:
            return json.load(f), None
    except OSError:
        return {}, None
    except ValueError:
        return {}, WIRED_PATH + " doesn't parse"


def _write_wired(wired):
    # Through a temporary file, so a power cut can't leave half of it
    tmp = WIRED_PATH + ".tmp"
    with open(tmp, "w") as f:
        json.dump(wired, f)
    os.rename(tmp, WIRED_PATH)


def _drop(wired, name):
    """Take name out of wired, and any section left empty. Whether it was there."""
    found = wired.get("devices", {}).pop(name, None) is not None
    for buses in wired.get("resources", {}).values():
        found = buses.pop(name, None) is not None or found
    resources = {k: v for k, v in wired.get("resources", {}).items() if v}
    if resources:
        wired["resources"] = resources
    else:
        wired.pop("resources", None)
    if not wired.get("devices"):
        wired.pop("devices", None)
    return found


def add_wired(kind, name, entry):
    """Record what the person wired, replacing anything wired under that name. Raises ValueError if
    it can't be wired, and returns notes on default buses it took over."""
    notes = _load().check_wired(kind, name, entry)
    wired = _board.wired()
    _drop(wired, name)
    if kind == "device":
        wired.setdefault("devices", {})[name] = entry
    else:
        wired.setdefault("resources", {}).setdefault(kind, {})[name] = entry
    _write_wired(wired)
    reload()
    return notes


def remove_wired(name):
    """Take out something wired. Raises ValueError if nothing by that name is, or a device uses it."""
    b = _load()
    if b.wired_error:
        raise ValueError(b.wired_error + ", so fix or remove it first")
    for kind, buses in b._wired_res.items():
        if name in buses:
            users = [n for n, d in b._wired_dev.items() if _names(kind, name, d.get("bus"))]
            if users:
                raise ValueError("%s uses %s, so remove that first" % (", ".join(users), name))
    wired = b.wired()
    if not _drop(wired, name):
        raise ValueError("Nothing named %s is wired" % name)
    _write_wired(wired)
    reload()


def _load():
    """Load board configuration from /settings/board.json, and what's wired from /settings/wired.json."""
    global _board
    if _board is None:
        try:
            with open(PATH, 'r') as f:
                data = json.load(f)
        except OSError:
            # File doesn't exist - create minimal generic board
            data = {
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
            }
        except Exception as e:
            print(f"[board] Error loading config: {e}")
            raise
        wired, error = _read_wired()
        _board = Board(data, wired, error)
    return _board


def reload():
    """Read /settings/board.json and /settings/wired.json again, after either has changed."""
    global _board
    _board = None
    return _load()


# Module-level attribute delegation to singleton
def __getattr__(name):
    """Delegate attribute access to the board singleton."""
    return getattr(_load(), name)
