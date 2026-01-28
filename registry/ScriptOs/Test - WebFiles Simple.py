
# === START_CONFIG_PARAMETERS ===

dict(
    
    timeout = 0,
    
    info = dict(
        name        = 'Test - WebFiles Simple',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = '''Super simple webfiles test - no modal, just browse manually.
                         
                         Creates /test_simple/hello.html and tries to serve it.
                         Prints URLs to test in your browser.
                      ''',
        author      = 'ScriptO Team',
        mail        = '',
        www         = 'https://github.com/jep-scriptomatic'
    ),

    args = dict()

)

# === END_CONFIG_PARAMETERS ===

import network
import os

print("\n" + "="*60)
print("Simple WebFiles Test")
print("="*60)

# Get IP first
sta = network.WLAN(network.STA_IF)
if not sta.isconnected():
    print("ERROR: WiFi not connected")
    raise Exception("No WiFi")

ip = sta.ifconfig()[0]
print(f"Device IP: {ip}")

# Create test directory and file
test_dir = '/test_simple'
test_file = f'{test_dir}/hello.html'

print(f"\n[1] Creating {test_dir}...")
try:
    os.stat(test_dir)
    print("    Directory already exists")
except OSError:
    os.mkdir(test_dir)
    print("    ✓ Created")

print(f"\n[2] Writing {test_file}...")
html = """<!DOCTYPE html>
<html>
<head><title>WebFiles Test</title></head>
<body>
    <h1 style="color: green;">✓ WebFiles Works!</h1>
    <p>If you can see this, webfiles.serve() is working correctly.</p>
</body>
</html>"""

with open(test_file, 'w') as f:
    f.write(html)
print(f"    ✓ Written ({len(html)} bytes)")

print(f"\n[3] Verifying file exists...")
with open(test_file, 'r') as f:
    content = f.read()
print(f"    ✓ Read back ({len(content)} bytes)")

print(f"\n[4] Trying webfiles.serve() with different paths...")
from esp32 import webfiles

# Try different ESP-IDF VFS paths
paths_to_try = [
    ('/flash/test_simple', '/test1'),  # Most common
    ('/test_simple', '/test2'),         # Direct
    ('/spiflash/test_simple', '/test3'), # Alternative
    ('/flash', '/test4'),               # Serve flash root at /test4
]

print("\n" + "="*60)
print("RESULTS:")
print("="*60)

for fs_path, uri_prefix in paths_to_try:
    try:
        result = webfiles.serve(fs_path, uri_prefix)
        print(f"\n✓ SUCCESS: webfiles.serve('{fs_path}', '{uri_prefix}')")
        print(f"  Result: {result}")
        print(f"  Try in browser: http://{ip}{uri_prefix}/hello.html")
    except Exception as e:
        print(f"\n✗ FAILED: webfiles.serve('{fs_path}', '{uri_prefix}')")
        print(f"  Error: {e}")

print("\n" + "="*60)
print("Test complete - try the URLs above in your browser!")
print("="*60 + "\n")

