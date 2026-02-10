"""
Bus Broker Module

Singleton cache for shared I2C and SPI bus instances.
Prevents multiple extensions from reconfiguring the same hardware peripheral.

Usage:
    from lib.sys import bus

    # Board-manifest-aware (recommended)
    i2c = bus.get_i2c("sensors")

    # Explicit pins
    i2c = bus.get_i2c(0, scl=9, sda=8, freq=400000)

    # SPI
    spi = bus.get_spi("display")
    spi = bus.get_spi(1, sck=12, mosi=11, miso=13, baudrate=10000000)

    # Inspect / teardown
    bus.info()
    bus.release_i2c("sensors")

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

from machine import I2C as _I2C, SPI as _SPI, Pin as _Pin

# Cache: (type, bus_id, pin_a, pin_b) -> hardware instance
_cache = {}


def _resolve_i2c(name_or_id, scl=None, sda=None, freq=400000):
    """Resolve I2C config from a manifest name or explicit args."""
    if isinstance(name_or_id, str):
        from lib.sys import board
        cfg = board.i2c(name_or_id)
        bus_id = getattr(cfg, 'id', 0)
        scl = cfg.scl
        sda = cfg.sda
        freq = getattr(cfg, 'freq', freq)
    else:
        bus_id = name_or_id
    if scl is None or sda is None:
        raise ValueError("scl and sda pins required")
    return bus_id, scl, sda, freq


def _resolve_spi(name_or_id, sck=None, mosi=None, miso=None, baudrate=1000000):
    """Resolve SPI config from a manifest name or explicit args."""
    if isinstance(name_or_id, str):
        from lib.sys import board
        cfg = board.spi(name_or_id)
        bus_id = getattr(cfg, 'id', 1)
        sck = cfg.sck
        mosi = getattr(cfg, 'mosi', mosi)
        miso = getattr(cfg, 'miso', miso)
        baudrate = getattr(cfg, 'baudrate', baudrate)
    else:
        bus_id = name_or_id
    if sck is None:
        raise ValueError("sck pin required")
    return bus_id, sck, mosi, miso, baudrate


def get_i2c(name_or_id, *, scl=None, sda=None, freq=400000):
    """
    Get a shared I2C bus instance.

    Args:
        name_or_id: Board manifest bus name (str) or hardware bus id (int).
        scl:        SCL pin number (required if name_or_id is int).
        sda:        SDA pin number (required if name_or_id is int).
        freq:       Clock frequency in Hz (default 400kHz).

    Returns:
        machine.I2C: Cached singleton instance.
    """
    bus_id, scl, sda, freq = _resolve_i2c(name_or_id, scl, sda, freq)
    key = ("i2c", bus_id, scl, sda)
    if key not in _cache:
        _cache[key] = _I2C(bus_id, scl=_Pin(scl), sda=_Pin(sda), freq=freq)
    return _cache[key]


def get_spi(name_or_id, *, sck=None, mosi=None, miso=None, baudrate=1000000):
    """
    Get a shared SPI bus instance.

    Args:
        name_or_id: Board manifest bus name (str) or hardware bus id (int).
        sck:        SCK pin number (required if name_or_id is int).
        mosi:       MOSI pin number (optional).
        miso:       MISO pin number (optional).
        baudrate:   Clock rate in Hz (default 1MHz).

    Returns:
        machine.SPI: Cached singleton instance.
    """
    bus_id, sck, mosi, miso, baudrate = _resolve_spi(
        name_or_id, sck, mosi, miso, baudrate
    )
    key = ("spi", bus_id, sck, mosi or -1)
    if key not in _cache:
        kwargs = {"sck": _Pin(sck), "baudrate": baudrate}
        if mosi is not None:
            kwargs["mosi"] = _Pin(mosi)
        if miso is not None:
            kwargs["miso"] = _Pin(miso)
        _cache[key] = _SPI(bus_id, **kwargs)
    return _cache[key]


def release_i2c(name_or_id, *, scl=None, sda=None, freq=400000):
    """Remove an I2C bus from the cache (does not deinit hardware)."""
    bus_id, scl, sda, _ = _resolve_i2c(name_or_id, scl, sda, freq)
    _cache.pop(("i2c", bus_id, scl, sda), None)


def release_spi(name_or_id, *, sck=None, mosi=None, miso=None, baudrate=1000000):
    """Remove an SPI bus from the cache (does not deinit hardware)."""
    bus_id, sck, mosi, miso, _ = _resolve_spi(
        name_or_id, sck, mosi, miso, baudrate
    )
    _cache.pop(("spi", bus_id, sck, mosi or -1), None)


def info():
    """Print all cached bus instances."""
    if not _cache:
        print("[bus] No cached buses")
        return
    for key, obj in _cache.items():
        kind, bus_id = key[0], key[1]
        pins = key[2:]
        print(f"[bus] {kind.upper()}({bus_id}) pins={pins} -> {obj}")
