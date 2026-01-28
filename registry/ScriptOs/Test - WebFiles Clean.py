
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'Test - WebFiles Clean',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = '''Clean test of webfiles with proper unregistration.''',
        author      = 'ScriptO Team',
    ),
    args = dict()
)

# === END_CONFIG_PARAMETERS ===

import network
import os
from esp32 import webfiles, httpserver

print("\n" + "="*60)
print("Clean WebFiles Test")
print("="*60)

# Get IP
sta = network.WLAN(network.STA_IF)
ip = sta.ifconfig()[0]
print(f"Device IP: {ip}")

# Create test directory and file
test_dir = '/test_webfiles'
test_file = f'{test_dir}/test.html'

print(f"\n[1] Creating {test_dir}...")
try:
    os.stat(test_dir)
    print("    ✓ Directory exists")
except OSError:
    os.mkdir(test_dir)
    print("    ✓ Created")

print(f"\n[2] Writing {test_file}...")
html = '<h1 style="color:green;">✓ WebFiles Works!</h1><p>MicroPython VFS integration successful!</p>'
with open(test_file, 'w') as f:
    f.write(html)
print(f"    ✓ Written")

print(f"\n[3] Unregistering old routes...")
for uri in ['/files', '/files*']:
    for method in ['GET', 'POST']:
        try:
            httpserver.off(uri, method)
            print(f"    ✓ Unregistered {method} {uri}")
        except:
            pass

print(f"\n[4] Serving via webfiles.serve('{test_dir}', '/files')...")
try:
    result = webfiles.serve(test_dir, '/files')
    print(f"    ✓ webfiles.serve() returned: {result}")
    
    if result:
        print(f"\n✅ SUCCESS! Browse to:")
        print(f"   http://{ip}/files/test.html")
    else:
        print(f"\n❌ webfiles.serve() returned False")
        
except Exception as e:
    print(f"    ✗ ERROR: {e}")
    import sys
    sys.print_exception(e)

print("\n" + "="*60 + "\n")

