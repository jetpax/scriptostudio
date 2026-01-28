
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'Test - Logging',
        version     = [1, 1, 0],
        category    = 'Testing',
        description = '''Test WebREPL logging functionality. This script demonstrates how to set up a logger with WebREPL handler to send log messages to ScriptO Studio's log sidebar. The logger automatically clears existing handlers to prevent duplicate messages.''',
        author      = 'ScriptO Team',
    ),
    args = dict()
)

# === END_CONFIG_PARAMETERS ===

import logging

print("\n" + "="*60)
print("WebREPL Logging Test")
print("="*60)

# Import webrepl_binary module
try:
    import webrepl_binary as webrepl
except ImportError as e:
    print(f"❌ Failed to import webrepl_binary: {e}")
    print("   Make sure the webrepl_binary module is available on the device.")
    raise

# Check if logHandler is available
if not hasattr(webrepl, 'logHandler'):
    print("❌ webrepl_binary module does not have 'logHandler' attribute")
    print("   Available attributes:", [attr for attr in dir(webrepl) if not attr.startswith('_')])
    raise AttributeError("'module' object has no attribute 'logHandler'. "
                        "The webrepl_binary module may not be properly initialized or "
                        "the firmware version may not support logging handlers.")

# Create a logger
logger = logging.getLogger("webrepl")

# Remove any existing handlers to prevent duplicates
logger.handlers.clear()

# Setup a handler to send logs to the WebREPL
try:
    handler = webrepl.logHandler(logging.INFO)
except Exception as e:
    print(f"❌ Failed to create logHandler: {e}")
    raise

logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

print("✓ Logger configured with WebREPL handler")
print("✓ Handler level: INFO")
print("✓ Logger level: DEBUG")
print("\nSending test log messages...\n")

# Send test messages
logger.info("Hello from MicroPython!")
logger.warning("This is a warning message")
logger.error("This is an error message")
logger.debug("This is a debug message (may not appear if handler level is INFO)")

print("\n✅ Check the Logs sidebar in ScriptO Studio to see the messages!")
print("="*60 + "\n")
