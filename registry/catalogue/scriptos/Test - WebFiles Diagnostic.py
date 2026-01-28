
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'Test - WebFiles Diagnostic',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = '''Check if webfiles handler gets called at all.''',
        author      = 'ScriptO Team',
    ),
    args = dict()
)

# === END_CONFIG_PARAMETERS ===

import network
import os
from esp32 import webfiles, httpserver

print("\n" + "="*60)
print("WebFiles Diagnostic Test")
print("="*60)

# Get IP
sta = network.WLAN(network.STA_IF)
ip = sta.ifconfig()[0]
print(f"Device IP: {ip}")

# Create test file
test_dir = '/test_diag'
test_file = f'{test_dir}/test.txt'

print(f"\n[1] Creating {test_dir}...")
try:
    os.stat(test_dir)
    print("    ✓ Exists")
except OSError:
    os.mkdir(test_dir)
    print("    ✓ Created")

print(f"\n[2] Writing {test_file}...")
with open(test_file, 'w') as f:
    f.write("Hello from WebFiles!")
print("    ✓ Written (20 bytes)")

# Check file exists
with open(test_file, 'r') as f:
    content = f.read()
    print(f"    ✓ Verified: '{content}'")

# Unregister old routes
print("\n[3] Unregistering old routes...")
for route in ['/diag', '/diag*']:
    try:
        httpserver.off(route, 'GET')
        print(f"    ✓ Unregistered {route}")
    except:
        pass

# Try webfiles.serve()
print(f"\n[4] Calling webfiles.serve('{test_dir}', '/diag')...")
try:
    result = webfiles.serve(test_dir, '/diag')
    print(f"    ✓ Result: {result}")
except Exception as e:
    print(f"    ✗ Exception: {e}")
    import sys
    sys.print_exception(e)
    raise

print("\n✅ Test URLs:")
print(f"   http://{ip}/diag/test.txt")
print("\nBrowse to this URL - if you see 'Hello from WebFiles!' it works!")
print("Watch the WebREPL terminal (not telnet) for [WEBFILES] logs")
print("="*60 + "\n")

