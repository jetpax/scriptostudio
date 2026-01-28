
# === START_CONFIG_PARAMETERS ===

dict(
    
    timeout = 0,
    
    info = dict(
        name        = 'Test - WebFiles Serving',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = '''Test script to verify webfiles.serve() works correctly.
                         
                         This ScriptO:
                         1. Creates /test_webfiles/ directory via Python VFS
                         2. Creates a simple test.html file via Python VFS
                         3. Finds correct ESP-IDF VFS mount point
                         4. Serves it via webfiles.serve() (READ-ONLY)
                         5. Opens it in Studio modal
                         
                         IMPORTANT: webfiles uses ESP-IDF VFS directly,
                         while Python uses MicroPython VFS. The actual
                         filesystem is usually mounted at /flash in ESP-IDF.
                         
                         webfiles should ONLY READ files, never write,
                         to avoid corrupting MicroPython VFS metadata.
                      ''',
        author      = 'ScriptO Team',
        mail        = '',
        www         = 'https://github.com/jep-scriptomatic'
    ),

    args = dict(
        
        ui_title = dict(
            label = 'UI Window Title:',
            type  = str,
            value = 'WebFiles Test'
        )
        
    )

)

# === END_CONFIG_PARAMETERS ===

import webrepl_binary as webrepl
import network
import os

print("\n" + "="*60)
print("WebFiles Serving Test - Starting...")
print("="*60)

# Step 1: Create test directory
test_dir = '/test_webfiles'
print(f"\n[1/5] Creating test directory: {test_dir}")
try:
    try:
        os.stat(test_dir)
        print(f"      Directory already exists")
    except OSError:
        os.mkdir(test_dir)
        print(f"      ✓ Directory created")
except Exception as e:
    print(f"      ✗ Failed to create directory: {e}")
    raise

# Step 2: Create test HTML file
test_html = f'{test_dir}/test.html'
print(f"\n[2/5] Creating test HTML file: {test_html}")
try:
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebFiles Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            text-align: center;
        }
        h1 {
            color: #2d3748;
            margin-bottom: 20px;
        }
        .status {
            background: #48bb78;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: bold;
        }
        .info {
            background: #edf2f7;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: left;
        }
        code {
            background: #2d3748;
            color: #48bb78;
            padding: 2px 6px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 WebFiles Serving Test</h1>
        
        <div class="status">
            ✅ Static File Serving Works!
        </div>
        
        <p>This HTML file was served from the ESP32's filesystem using <code>webfiles.serve()</code>.</p>
        
        <div class="info">
            <h3>Test Details:</h3>
            <p><strong>File Location:</strong> <code>/test_webfiles/test.html</code></p>
            <p><strong>Served Via:</strong> <code>webfiles.serve('/test_webfiles', '/test')</code></p>
            <p><strong>Access Path:</strong> <code>/test/test.html</code></p>
        </div>
        
        <p style="margin-top: 30px; color: #718096; font-size: 14px;">
            If you can see this page, webfiles is working correctly!
        </p>
    </div>
    
    <script>
        console.log('WebFiles test page loaded successfully!');
        console.log('Static file serving is working correctly.');
    </script>
</body>
</html>"""
    
    with open(test_html, 'w') as f:
        f.write(html_content)
    print(f"      ✓ HTML file created ({len(html_content)} bytes)")
except Exception as e:
    print(f"      ✗ Failed to create HTML file: {e}")
    raise

# Step 3: Verify file exists and is readable
print(f"\n[3/5] Verifying file is readable")
try:
    with open(test_html, 'r') as f:
        content = f.read()
    print(f"      ✓ File is readable ({len(content)} bytes)")
except Exception as e:
    print(f"      ✗ Failed to read file: {e}")
    raise

# Step 4: Serve via webfiles (try different ESP-IDF VFS mount points)
print(f"\n[4/5] Serving files via webfiles.serve()")
print(f"      NOTE: webfiles uses ESP-IDF VFS, Python VFS uses MicroPython paths")
print(f"      Common ESP-IDF mount points: /flash, /spiflash, /")

try:
    from esp32 import webfiles
    
    # Try different possible ESP-IDF VFS mount points
    test_paths = [
        '/flash/test_webfiles',  # Common littlefs mount
        '/test_webfiles',         # Root mount
        '/spiflash/test_webfiles' # Alternative mount
    ]
    
    served = False
    for esp_idf_path in test_paths:
        print(f"\n      Trying: webfiles.serve('{esp_idf_path}', '/test')")
        try:
            result = webfiles.serve(esp_idf_path, '/test')
            print(f"      ✓ SUCCESS! webfiles.serve() returned: {result}")
            print(f"      ESP-IDF VFS path: {esp_idf_path}")
            print(f"      URI prefix: /test/")
            served = True
            break
        except Exception as e:
            print(f"      ✗ Failed: {e}")
    
    if not served:
        print(f"\n      ✗ All paths failed. Trying root '/' as last resort...")
        result = webfiles.serve('/', '/test')
        print(f"      ✓ Served from root: {result}")
    
except Exception as e:
    print(f"\n      ✗ Fatal error with webfiles: {e}")
    import sys
    sys.print_exception(e)
    raise

# Step 5: Get device IP and open UI
print(f"\n[5/5] Opening test page in Studio")
try:
    sta = network.WLAN(network.STA_IF)
    if not sta.isconnected():
        print("      ✗ WiFi not connected")
        raise Exception("WiFi not connected")
    
    ip = sta.ifconfig()[0]
    print(f"      Device IP: {ip}")
    
    # Send DISPLAY-UI command
    url = f'http://{ip}/test/test.html'
    title = args.ui_title
    
    result = webrepl.display_ui(url, title)
    if result:
        print(f"      ✓ UI display command sent to Studio")
        print(f"      URL: {url}")
    else:
        print("      ⚠ UI display command failed (no active Studio client)")
    
except Exception as e:
    print(f"      ✗ Failed: {e}")
    import sys
    sys.print_exception(e)
    raise

print("\n" + "="*60)
print("WebFiles Serving Test - Complete!")
print("")
print("If the page displays correctly in the Studio modal,")
print("then webfiles.serve() is working as expected.")
print("")
print(f"Manual test: http://{ip}/test/test.html")
print("="*60 + "\n")
