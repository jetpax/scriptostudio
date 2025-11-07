
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'Test - Handler Direct',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = '''Test httpserver.on() directly to diagnose routing.''',
        author      = 'ScriptO Team',
    ),
    args = dict()
)

# === END_CONFIG_PARAMETERS ===

import network
from esp32 import httpserver

print("\n" + "="*60)
print("Direct Handler Test")
print("="*60)

# Get IP
sta = network.WLAN(network.STA_IF)
ip = sta.ifconfig()[0]
print(f"Device IP: {ip}")

# Simple handler that just returns text
def test_handler(uri, post_data=None):
    print(f"✅ Handler called for: {uri}")
    return "SUCCESS! Handler is working!"

# Unregister old handler
print("\n[1] Unregistering old /test route...")
try:
    httpserver.off('/test', 'GET')
    print("    ✓ Unregistered")
except:
    print("    (No old handler)")

# Register handler
print("\n[2] Registering /test route...")
try:
    result = httpserver.on('/test', test_handler, 'GET')
    if result:
        print("    ✓ Registered successfully")
    else:
        print("    ✗ Registration failed")
except Exception as e:
    print(f"    ✗ Exception: {e}")
    raise

print("\n✅ Test URL:")
print(f"   http://{ip}/test")
print("\nBrowse to this URL and watch telnet for logs!")
print("="*60 + "\n")

