"""
WebREPL Logging Helper
Provides easy setup for sending logs to ScriptO Studio's Log Sidebar.

Usage:

from webrepl_logging import log

log.info("Hello from my script!")
log.debug("Debug info")
log.warning("Something seems off")
log.error("Something went wrong!")

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""
import logging

_handler = None

def setup_logging(name=None, level=logging.INFO):
    """
    Setup logging to send to ScriptO Studio's Log Sidebar.
    
    Args:
        name: Logger name (defaults to root logger)
        level: Logging level (DEBUG, INFO, WARNING, ERROR)
    
    Returns:
        Logger instance
    
    Example:
        log = setup_logging("my_app", logging.DEBUG)
        log.info("Started")
    """
    global _handler
    
    # Try to get WebREPL module
    # NOTE: Import order matters! webrepl_binary handles WebSocket, webrepl_rtc handles WebRTC.
    # Try binary first since WebSocket is more common.
    webrepl = None
    for mod_name in ('webrepl_binary', 'webrepl_rtc'):
        try:
            webrepl = __import__(mod_name)
            break
        except ImportError:
            continue
    
    if webrepl is None or not hasattr(webrepl, 'logHandler'):
        print("Warning: WebREPL logging not available")
        return logging.getLogger(name)
    
    logger = logging.getLogger(name)
    logger.handlers.clear()
    logger.propagate = False
    
    _handler = webrepl.logHandler(level)
    logger.addHandler(_handler)
    logger.setLevel(logging.DEBUG)
    
    return logger

def get_handler():
    """Get the active WebREPL log handler, or None."""
    return _handler

# Pre-configured global logger for easy import
# Usage from any script: from webrepl_logging import log
log = setup_logging("app", logging.DEBUG)
