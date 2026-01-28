# Minimal WebFiles Test
# Just create a file and serve it - nothing fancy

# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,
    
    info = dict(
        name        = 'Test - WebFiles Minimal',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = '''Minimal test - create one file and serve it.''',
        author      = 'ScriptO Team',
    ),
    args = dict()
)

# === END_CONFIG_PARAMETERS ===

import os
import network
from esp32 import webfiles, httpserver

# Get IP
sta = network.WLAN(network.STA_IF)
ip = sta.ifconfig()[0]

# Create directory
try:
    os.mkdir("/test_minimal")
except:
    pass

# Create small test file
with open("/test_minimal/hello.txt", 'w') as f:
    f.write("Hello World!\n")

print("File created")

# Clean up old routes
try:
    httpserver.off('/test_minimal*', 'GET')
except:
    pass

# Serve files
result = webfiles.serve('/test_minimal', '/test_minimal')
print(f"Serve result: {result}")

# Show URL
print(f"\nTest URL: http://{ip}/test_minimal/hello.txt")
print("\nTry it with: curl http://{}/test_minimal/hello.txt".format(ip))



