"""
User Settings Module

Provides runtime configuration with defaults and user overrides.
Implements COFU (Construct On First Use) caching pattern.

File structure:
    /settings/default_settings.json - Defaults (shipped with firmware)
    /settings/user_settings.json    - User overrides (runtime)

Usage:
    from lib import settings
    
    # Get values (user override, else default, else computed)
    ssid = settings.get("wifi.ssid")
    password = settings.get("wifi.password")
    
    # Set user preferences
    settings.set("wifi.ssid", "MyNetwork")
    settings.set("wifi.password", "secret")
    settings.save()

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import json


class Settings:
    """Settings manager with defaults and user overrides."""
    
    def __init__(self, board=None, defaults=None, user=None):
        """
        Initialize settings.
        
        Args:
            board: Board instance for computed defaults (optional)
            defaults: Default settings dict
            user: User settings dict
        """
        self._board = board
        self._defaults = defaults or {}
        self._user = user or {}
        self._cache = {}  # COFU cache for resolved values

    def get(self, key, default=None):
        """
        Get a setting value with COFU caching.
        
        Resolution order:
        1. Check cache
        2. Check user settings
        3. Check default settings
        4. Check computed defaults
        5. Return provided default
        
        Args:
            key: Dot-separated key path (e.g., "wifi.ssid")
            default: Default value if not found
            
        Returns:
            Resolved value
        """
        # Check cache first
        if key in self._cache:
            return self._cache[key]

        # Try user settings
        parts = key.split(".")
        value = self._user
        for p in parts:
            if not isinstance(value, dict):
                value = None
                break
            value = value.get(p, None)
            if value is None:
                break

        # Try default settings
        if value is None:
            value = self._resolve_default(parts)

        # Use provided default if still None
        if value is None:
            value = default

        # Cache the resolved value
        self._cache[key] = value
        return value

    def _resolve_default(self, parts):
        """
        Resolve default value from static defaults.
        
        Args:
            parts: Key path parts list
            
        Returns:
            Default value or None
        """
        # Try static defaults
        d = self._defaults
        for p in parts:
            if not isinstance(d, dict):
                return None
            d = d.get(p, None)
            if d is None:
                break
        
        return d

    def set(self, key, value):
        """
        Set a user preference.
        
        Args:
            key: Dot-separated key path
            value: Value to set
        """
        parts = key.split(".")
        d = self._user
        
        # Navigate to parent dict, creating intermediate dicts as needed
        for p in parts[:-1]:
            d = d.setdefault(p, {})
        
        # Set the value
        d[parts[-1]] = value
        
        # Invalidate cache for this key
        if key in self._cache:
            del self._cache[key]

    def save(self):
        """Persist user settings to /settings/user_settings.json."""
        try:
            # Ensure directory exists
            import os
            try:
                os.mkdir('/settings')
            except OSError:
                pass  # Directory already exists
            
            # Write user settings
            with open('/settings/user_settings.json', 'w') as f:
                json.dump(self._user, f)
            return True
        except Exception as e:
            print(f"[settings] Error saving: {e}")
            return False
    
    def reload(self):
        """Reload settings from disk and clear cache."""
        self._cache.clear()
        
        # Reload defaults
        try:
            with open('/settings/default_settings.json', 'r') as f:
                self._defaults = json.load(f)
        except OSError:
            pass  # File doesn't exist, keep existing defaults
        except Exception as e:
            print(f"[settings] Error loading defaults: {e}")
        
        # Reload user settings
        try:
            with open('/settings/user_settings.json', 'r') as f:
                self._user = json.load(f)
        except OSError:
            self._user = {}  # File doesn't exist yet
        except Exception as e:
            print(f"[settings] Error loading user settings: {e}")


# Singleton instance
_settings = None


def _load():
    """Load settings singleton."""
    global _settings
    if _settings is None:
        # Load default settings
        defaults = {}
        try:
            with open('/settings/default_settings.json', 'r') as f:
                defaults = json.load(f)
        except OSError:
            # Default settings file doesn't exist yet
            # This is okay during initial setup
            pass
        except Exception as e:
            print(f"[settings] Error loading defaults: {e}")
        
        # Load user settings
        user = {}
        try:
            with open('/settings/user_settings.json', 'r') as f:
                user = json.load(f)
        except OSError:
            # User settings don't exist yet - normal for first run
            pass
        except Exception as e:
            print(f"[settings] Error loading user settings: {e}")
        
        # Try to get board reference for computed defaults
        board = None
        try:
            from lib.sys import board as board_module
            board = board_module._load()
        except:
            # Board not available yet or error loading
            pass
        
        _settings = Settings(board, defaults, user)
    
    return _settings


# Module-level delegation
def get(key, default=None):
    """Get a setting value."""
    return _load().get(key, default)


def set(key, value):
    """Set a user preference."""
    return _load().set(key, value)


def save():
    """Save user settings."""
    return _load().save()


def reload():
    """Reload settings from disk."""
    return _load().reload()
