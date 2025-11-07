
# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    info = dict(
        name        = 'Test - VFS Diagnostics',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = '''Diagnose VFS mount points and filesystem structure.''',
        author      = 'ScriptO Team',
    ),
    args = dict()
)

# === END_CONFIG_PARAMETERS ===

import os
import sys

print("\n" + "="*60)
print("VFS Diagnostics")
print("="*60)

# Check MicroPython implementation
print(f"\nMicroPython: {sys.implementation}")
print(f"Platform: {sys.platform}")

# List root directory
print("\n[1] Root directory listing:")
try:
    items = os.listdir('/')
    for item in sorted(items):
        try:
            stat = os.stat(f'/{item}')
            if stat[0] & 0x4000:  # Directory
                print(f"  📁 /{item}/")
            else:
                print(f"  📄 /{item} ({stat[6]} bytes)")
        except:
            print(f"  ❓ /{item}")
except Exception as e:
    print(f"  ERROR: {e}")

# Create test file in root
print("\n[2] Creating test file /test.html...")
try:
    with open('/test.html', 'w') as f:
        f.write('<h1>Test File</h1>')
    print("  ✓ Created /test.html")
    
    stat = os.stat('/test.html')
    print(f"  File size: {stat[6]} bytes")
except Exception as e:
    print(f"  ERROR: {e}")
    import sys
    sys.print_exception(e)

# Try webfiles on root
print("\n[3] Testing webfiles.serve('/', '/files')...")
try:
    from esp32 import webfiles
    result = webfiles.serve('/', '/files')
    print(f"  ✓ webfiles.serve() returned: {result}")
    
    import network
    ip = network.WLAN(network.STA_IF).ifconfig()[0]
    print(f"\n  Try: http://{ip}/files/test.html")
    
except Exception as e:
    print(f"  ✗ ERROR: {e}")
    import sys
    sys.print_exception(e)

# Check if there's a /flash directory
print("\n[4] Checking for /flash directory...")
try:
    items = os.listdir('/flash')
    print(f"  ✓ /flash exists with {len(items)} items")
    for item in sorted(items)[:10]:  # Show first 10
        print(f"    - {item}")
except Exception as e:
    print(f"  ✗ /flash doesn't exist: {e}")

print("\n" + "="*60)
print("Diagnostics complete!")
print("="*60 + "\n")

