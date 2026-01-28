# Test - WebFiles Speed Test
# Measures file serving performance

# === START_CONFIG_PARAMETERS ===

dict(
    info = dict(
        name = "WebFiles Speed Test",
        category = "Testing",
        description = "Measure file serving performance with various file sizes",
        author = "ScriptOMatic",
        version = [1, 0]
    ),
    
    args = dict(
        test_file_kb = dict(
            label = "Test File Size (KB)",
            type = int,
            value = 100
        )
    )
)

# === END_CONFIG_PARAMETERS ===

import os
import time
import network
from esp32 import webfiles, httpserver

# Get device IP address
sta = network.WLAN(network.STA_IF)
if not sta.isconnected():
    print("❌ Not connected to WiFi")
    raise SystemExit

ip = sta.ifconfig()[0]

print("=" * 60)
print("WebFiles Speed Test")
print("=" * 60)
print(f"Device IP: {ip}")
print(f"Test file size: {args.test_file_kb}KB")
print()

# Create test directory
test_dir = "/speed_test"
try:
    os.mkdir(test_dir)
    print(f"✓ Created directory: {test_dir}")
except OSError:
    print(f"✓ Directory exists: {test_dir}")

# Create test file
test_file = f"{test_dir}/test_{args.test_file_kb}kb.txt"
print(f"Creating {args.test_file_kb}KB test file...")

block = "X" * 1024  # 1KB block
with open(test_file, 'w') as f:
    for i in range(args.test_file_kb):
        line = f"Block {i:06d}: " + block[:1000] + "\n"
        f.write(line)

file_size = os.stat(test_file)[6]
print(f"✓ File created: {file_size} bytes ({file_size/1024:.1f}KB)")
print()

# Unregister old routes
print("[1] Unregistering old routes...")
try:
    httpserver.off('/speed', 'GET')
    print("    ✓ Unregistered /speed")
except:
    pass
try:
    httpserver.off('/speed*', 'GET')
    print("    ✓ Unregistered /speed*")
except:
    pass
print()

# Start file server
print(f"[2] Starting webfiles.serve('{test_dir}', '/speed')...")
result = webfiles.serve(test_dir, '/speed')
print(f"    ✓ Result: {result}")
print()

# Calculate expected transfer time
expected_time_ms = (file_size / 1024) * 1000 / 1500  # pessimistic estimate

print("=" * 60)
print("🚀 Speed Test Ready!")
print("=" * 60)
print()
print(f"Test URL: http://{ip}/speed/test_{args.test_file_kb}kb.txt")
print()
print("Instructions:")
print("1. Open the URL above in your browser")
print("2. Check browser's Network tab for transfer time")
print("3. Or use curl with timing:")
print(f"   curl -w '\\nTime: %{{time_total}}s\\n' -o /dev/null http://{ip}/speed/test_{args.test_file_kb}kb.txt")
print()
print(f"File size: {file_size} bytes ({file_size/1024:.1f}KB)")
print(f"Expected time: ~{expected_time_ms:.0f}ms (at 1.5MB/s)")
print()
print("Performance guidelines:")
print("  • 100KB in 100-200ms = Good (500-1000 KB/s)")
print("  • 100KB in 50-100ms  = Great (1-2 MB/s)")
print("  • 100KB in <50ms     = Excellent (>2 MB/s)")
print()
print("=" * 60)
