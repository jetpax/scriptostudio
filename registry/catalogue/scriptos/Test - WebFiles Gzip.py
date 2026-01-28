# Test - WebFiles Gzip Support
# Tests automatic .gz file serving when client supports gzip

# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,  # No interrupt button needed for this test

    info = dict(
        name        = 'Test - WebFiles Gzip',
        version     = [1, 0, 1],
        category    = 'Testing',
        description = '''Tests automatic gzip compression support in webfiles module.
                         Creates both regular and .gz versions of test files.
                         When client sends "Accept-Encoding: gzip", the .gz version is served automatically.
                         This tests the new direct GIL file serving with mp_vfs_stat() gzip resolution.
                      ''',
        author      = 'ScriptO Team',
        mail        = 'jep@alphabetiq.com',
        www         = 'https://github.com/jetpax'
    ),
    
    args = dict(
        test_path = dict(
            label = 'Test directory path',
            type  = str,
            value = '/test_gzip'
        ),
        
        test_content = dict(
            label = 'Test file content (repeated for compression)',
            type  = str,
            value = 'Hello World! This content will be repeated to test compression. '
        ),
        
        repeat_count = dict(
            label = 'Content repeat count',
            type  = int,
            value = 50
        ),
        
        uri_prefix = dict(
            label = 'HTTP URI prefix',
            type  = str,
            value = '/test_gzip'
        )
    )
)

# === END_CONFIG_PARAMETERS ===

import os
import network
from esp32 import webfiles, httpserver

print("="*60)
print("WebFiles Gzip Compression Test")
print("="*60)

# Get IP address
sta = network.WLAN(network.STA_IF)
if not sta.isconnected():
    print("ERROR: WiFi not connected!")
    print("Connect to WiFi first, then run this test.")
    raise SystemExit

ip = sta.ifconfig()[0]
print(f"Device IP: {ip}")

# Create test directory
print(f"\nCreating test directory: {args.test_path}")
try:
    os.mkdir(args.test_path)
    print("  ✓ Directory created")
except OSError:
    print("  ✓ Directory already exists")

# Create test content
content = args.test_content * args.repeat_count
print(f"\nTest content: {len(content)} bytes")

# Create regular HTML file
html_path = f"{args.test_path}/test.html"
print(f"\nCreating regular file: {html_path}")
with open(html_path, 'w') as f:
    f.write(content)
orig_size = os.stat(html_path)[6]
print(f"  ✓ Written: {orig_size} bytes")

# Create gzipped version manually (since MicroPython may not have gzip module)
print(f"\nNOTE: You need to manually create the .gz version!")
print(f"Steps:")
print(f"  1. Download {html_path} via WebREPL")
print(f"  2. Compress it: gzip -k test.html")
print(f"  3. Upload test.html.gz back to {args.test_path}/")
print(f"")
print(f"Or use this command on your computer:")
print(f"  echo '{args.test_content}' | python3 -c \"import sys, gzip; sys.stdout.buffer.write(gzip.compress(sys.stdin.read().encode() * {args.repeat_count}))\" > test.html.gz")

# Check if .gz version exists
gz_path = f"{args.test_path}/test.html.gz"
try:
    gz_size = os.stat(gz_path)[6]
    ratio = gz_size / orig_size * 100
    print(f"\n✓ Found gzipped version: {gz_path}")
    print(f"  Original: {orig_size} bytes")
    print(f"  Gzipped:  {gz_size} bytes")
    print(f"  Ratio:    {ratio:.1f}%")
    print(f"  Savings:  {orig_size - gz_size} bytes ({100-ratio:.1f}% smaller)")
    gz_exists = True
except OSError:
    print(f"\n✗ No gzipped version found yet")
    print(f"  Create {gz_path} to test compression")
    gz_exists = False

# Clean up old routes
print(f"\nSetting up HTTP routes...")
try:
    httpserver.off(f'{args.uri_prefix}*', 'GET')
    print("  ✓ Cleaned up old routes")
except:
    pass

# Serve files
result = webfiles.serve(args.test_path, args.uri_prefix)
print(f"  ✓ Serving {args.test_path} at {args.uri_prefix}")
print(f"  Result: {result}")

# Show test instructions
print("\n" + "="*60)
print("TEST INSTRUCTIONS")
print("="*60)

print(f"\n1. Test WITHOUT gzip (should serve regular file):")
print(f"   curl http://{ip}{args.uri_prefix}/test.html")
print(f"   Expected: {orig_size} bytes")

if gz_exists:
    print(f"\n2. Test WITH gzip (should serve .gz file automatically):")
    print(f"   curl -H 'Accept-Encoding: gzip' http://{ip}{args.uri_prefix}/test.html | gunzip")
    print(f"   Expected: Server sends {gz_size} bytes, gunzip expands to {orig_size} bytes")
    
    print(f"\n3. Check HTTP headers:")
    print(f"   curl -I http://{ip}{args.uri_prefix}/test.html")
    print(f"   curl -I -H 'Accept-Encoding: gzip' http://{ip}{args.uri_prefix}/test.html")
    print(f"   Second request should show 'Content-Encoding: gzip'")
    
    print(f"\n4. Check telnet logs (enable ESP log redirection first):")
    print(f"   Should see: 'Using gzip version: {gz_path}'")
else:
    print(f"\n2. Create .gz file first to test compression!")

print("\n" + "="*60)
print("Test setup complete!")
print("="*60)
