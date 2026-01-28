
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'Test - Manual File Handler',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = '''Manually implement file serving with httpserver.on().''',
        author      = 'ScriptO Team',
    ),
    args = dict()
)

# === END_CONFIG_PARAMETERS ===

import network
import os
from esp32 import httpserver

print("\n" + "="*60)
print("Manual File Handler Test")
print("="*60)

# Get IP
sta = network.WLAN(network.STA_IF)
ip = sta.ifconfig()[0]
print(f"Device IP: {ip}")

# Create test file
test_dir = '/test_manual'
test_file = f'{test_dir}/test.txt'

print(f"\n[1] Creating {test_dir}...")
try:
    os.stat(test_dir)
except OSError:
    os.mkdir(test_dir)
print("    ✓ Ready")

print(f"\n[2] Writing {test_file}...")
with open(test_file, 'w') as f:
    f.write("Manual file serving works!")
print("    ✓ Written")

# Manual file serving handler
def serve_file(uri, post_data=None):
    print(f"[MANUAL] Handler called for: {uri}")
    
    # Map URI to file path
    # URI like /files/test.txt -> /test_manual/test.txt
    if uri.startswith('/files/'):
        filepath = test_dir + uri[6:]  # Remove '/files' prefix
    else:
        return "ERROR: Invalid URI"
    
    print(f"[MANUAL] Trying to read: {filepath}")
    
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        print(f"[MANUAL] Read {len(content)} bytes")
        return content
    except Exception as e:
        print(f"[MANUAL] Error: {e}")
        return f"ERROR: {e}"

# Unregister old route
print("\n[3] Unregistering old route...")
try:
    httpserver.off('/files/*', 'GET')
    print("    ✓ Unregistered")
except:
    pass

# Register manual handler with wildcard
print("\n[4] Registering /files/* route...")
try:
    result = httpserver.on('/files/*', serve_file, 'GET')
    if result:
        print("    ✓ Registered")
    else:
        print("    ✗ Failed")
except Exception as e:
    print(f"    ✗ Exception: {e}")
    raise

print("\n✅ Test URL:")
print(f"   http://{ip}/files/test.txt")
print("\nBrowse to this URL - watch WebREPL terminal for [MANUAL] logs")
print("="*60 + "\n")

