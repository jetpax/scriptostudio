
# === START_CONFIG_PARAMETERS ===

dict(
    
    timeout = 0,  # No stop button needed - this is a UI plugin
    silent = True,  # Hide internal print statements (UI-based ScriptO)
    
    info = dict(
        name        = 'UI Plugin - LED Color Picker',
        version     = [1, 0, 0],
        category    = 'UI Plugins',
        description = '''Interactive LED Color Picker with RGB Sliders
                         
                         This ScriptO provides a beautiful UI to control the status LED:
                         • Real-time RGB color sliders (0-255)
                         • Live color preview
                         • Displays current RGB values
                         • Set LED to selected color instantly
                         • Predefined color buttons for quick selection
                         
                         The UI is served directly from your ESP32 device and communicates
                         with the device to change the LED color in real-time.
                      ''',
        author      = 'ScriptO Team',
        mail        = '',
        www         = 'https://github.com/jep-scriptomatic'
    ),

    args = dict(
        
        ui_title = dict(
            label = 'UI Window Title:',
            type  = str,
            value = 'LED Color Picker'
        ),
        
        initial_color = dict(
            label = 'Initial LED Color (R,G,B):',
            type  = str,
            value = '0,255,0'  # Start with green
        )
        
    )

)

# === END_CONFIG_PARAMETERS ===

import httpserver
import webrepl_binary as webrepl
import network
import json

# Get device IP once at module level
_device_ip = str(network.WLAN(network.STA_IF).ifconfig()[0])

# Current LED color state (global)
_current_color = [0, 255, 0]  # Default: green

def led_control_ui(uri, post_data=None):
    """
    HTTP handler for the LED Color Picker UI.
    
    Handles both GET (serve UI) and POST (update LED color) requests.
    """
    
    if post_data:
        # POST request - update LED color
        try:
            data = json.loads(post_data)
            r = int(data.get('r', 0))
            g = int(data.get('g', 0))
            b = int(data.get('b', 0))
            
            # Clamp values to 0-255
            r = max(0, min(255, r))
            g = max(0, min(255, g))
            b = max(0, min(255, b))
            
            # Update global color state
            global _current_color
            _current_color = [r, g, b]
            
            # Update the physical LED
            from lib.device_helpers import status_led
            if status_led:
                status_led.set_color((r, g, b))
            
            # Return success response
            response = json.dumps({
                'success': True,
                'color': {'r': r, 'g': g, 'b': b}
            })
            return response
            
        except Exception as e:
            # Return error response
            response = json.dumps({
                'success': False,
                'error': str(e)
            })
            return response
    
    # GET request - serve UI HTML
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LED Color Picker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                         'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
        }
        
        h1 {
            color: #2d3748;
            font-size: 2em;
            margin-bottom: 10px;
            font-weight: 700;
            text-align: center;
        }
        
        .subtitle {
            color: #718096;
            text-align: center;
            margin-bottom: 30px;
            font-size: 0.95em;
        }
        
        .color-preview {
            width: 100%;
            height: 150px;
            border-radius: 12px;
            margin-bottom: 25px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            transition: background-color 0.2s ease;
            border: 3px solid #e2e8f0;
        }
        
        .rgb-display {
            text-align: center;
            font-size: 1.4em;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 25px;
            font-family: 'Courier New', monospace;
            padding: 12px;
            background: #f7fafc;
            border-radius: 8px;
        }
        
        .slider-group {
            margin-bottom: 20px;
        }
        
        .slider-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .slider-name {
            font-weight: 600;
            font-size: 1em;
            color: #4a5568;
        }
        
        .slider-value {
            font-weight: 700;
            font-size: 1.1em;
            min-width: 45px;
            text-align: right;
            font-family: 'Courier New', monospace;
        }
        
        .red-label { color: #f56565; }
        .green-label { color: #48bb78; }
        .blue-label { color: #4299e1; }
        
        .slider {
            width: 100%;
            height: 8px;
            border-radius: 5px;
            outline: none;
            -webkit-appearance: none;
            cursor: pointer;
        }
        
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            border: 2px solid #cbd5e0;
        }
        
        .slider::-moz-range-thumb {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            border: 2px solid #cbd5e0;
        }
        
        #redSlider {
            background: linear-gradient(to right, #000 0%, #f56565 100%);
        }
        
        #greenSlider {
            background: linear-gradient(to right, #000 0%, #48bb78 100%);
        }
        
        #blueSlider {
            background: linear-gradient(to right, #000 0%, #4299e1 100%);
        }
        
        .preset-colors {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 25px;
            padding-top: 25px;
            border-top: 2px solid #e2e8f0;
        }
        
        .preset-btn {
            width: 100%;
            height: 50px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            transition: transform 0.1s ease;
            border: 2px solid white;
        }
        
        .preset-btn:hover {
            transform: scale(1.05);
        }
        
        .preset-btn:active {
            transform: scale(0.95);
        }
        
        .info-box {
            background: #f7fafc;
            border-left: 4px solid #4299e1;
            padding: 12px;
            margin-top: 20px;
            border-radius: 4px;
            font-size: 0.85em;
            color: #4a5568;
        }
        
        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #48bb78;
            margin-right: 6px;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 LED Color Picker</h1>
        <p class="subtitle">Control your ESP32 status LED</p>
        
        <div class="color-preview" id="colorPreview"></div>
        
        <div class="rgb-display" id="rgbDisplay">RGB(0, 255, 0)</div>
        
        <div class="slider-group">
            <div class="slider-label">
                <span class="slider-name">Red</span>
                <span class="slider-value red-label" id="redValue">0</span>
            </div>
            <input type="range" min="0" max="255" value="0" class="slider" id="redSlider">
        </div>
        
        <div class="slider-group">
            <div class="slider-label">
                <span class="slider-name">Green</span>
                <span class="slider-value green-label" id="greenValue">255</span>
            </div>
            <input type="range" min="0" max="255" value="255" class="slider" id="greenSlider">
        </div>
        
        <div class="slider-group">
            <div class="slider-label">
                <span class="slider-name">Blue</span>
                <span class="slider-value blue-label" id="blueValue">0</span>
            </div>
            <input type="range" min="0" max="255" value="0" class="slider" id="blueSlider">
        </div>
        
        <div class="preset-colors">
            <button class="preset-btn" style="background: rgb(255, 0, 0);" onclick="setPreset(255, 0, 0)"></button>
            <button class="preset-btn" style="background: rgb(0, 255, 0);" onclick="setPreset(0, 255, 0)"></button>
            <button class="preset-btn" style="background: rgb(0, 0, 255);" onclick="setPreset(0, 0, 255)"></button>
            <button class="preset-btn" style="background: rgb(255, 255, 0);" onclick="setPreset(255, 255, 0)"></button>
            <button class="preset-btn" style="background: rgb(255, 0, 255);" onclick="setPreset(255, 0, 255)"></button>
            <button class="preset-btn" style="background: rgb(0, 255, 255);" onclick="setPreset(0, 255, 255)"></button>
            <button class="preset-btn" style="background: rgb(255, 255, 255);" onclick="setPreset(255, 255, 255)"></button>
            <button class="preset-btn" style="background: rgb(0, 0, 0);" onclick="setPreset(0, 0, 0)"></button>
        </div>
        
        <div class="info-box">
            <span class="status-indicator"></span>
            Connected to ESP32 at <strong>""" + _device_ip + """</strong>
        </div>
    </div>
    
    <script>
        const redSlider = document.getElementById('redSlider');
        const greenSlider = document.getElementById('greenSlider');
        const blueSlider = document.getElementById('blueSlider');
        
        const redValue = document.getElementById('redValue');
        const greenValue = document.getElementById('greenValue');
        const blueValue = document.getElementById('blueValue');
        
        const colorPreview = document.getElementById('colorPreview');
        const rgbDisplay = document.getElementById('rgbDisplay');
        
        let debounceTimer = null;
        
        function updateColor() {
            const r = parseInt(redSlider.value);
            const g = parseInt(greenSlider.value);
            const b = parseInt(blueSlider.value);
            
            // Update UI
            redValue.textContent = r;
            greenValue.textContent = g;
            blueValue.textContent = b;
            
            const rgbColor = `rgb(${r}, ${g}, ${b})`;
            colorPreview.style.backgroundColor = rgbColor;
            rgbDisplay.textContent = `RGB(${r}, ${g}, ${b})`;
            
            // Debounce device update (send after 100ms of no changes)
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                sendColorToDevice(r, g, b);
            }, 100);
        }
        
        function sendColorToDevice(r, g, b) {
            // Send color to device via POST request
            fetch(window.location.href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ r: r, g: g, b: b })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error('Failed to update LED:', data.error);
                }
            })
            .catch(error => {
                console.error('Error sending color to device:', error);
            });
        }
        
        function setPreset(r, g, b) {
            redSlider.value = r;
            greenSlider.value = g;
            blueSlider.value = b;
            updateColor();
        }
        
        // Add event listeners
        redSlider.addEventListener('input', updateColor);
        greenSlider.addEventListener('input', updateColor);
        blueSlider.addEventListener('input', updateColor);
        
        // Initialize display
        updateColor();
        
        console.log('LED Color Picker loaded successfully!');
        console.log('Device IP:', '""" + _device_ip + """');
    </script>
</body>
</html>"""
    
    return html


# Main execution
print("\n" + "="*60)
print("LED Color Picker UI Plugin - Starting...")
print("="*60)

# Parse initial color from args
try:
    color_parts = args.initial_color.split(',')
    if len(color_parts) == 3:
        _current_color = [int(c.strip()) for c in color_parts]
        print(f"✓ Initial color: RGB({_current_color[0]}, {_current_color[1]}, {_current_color[2]})")
except:
    print("⚠ Using default initial color: RGB(0, 255, 0)")

# Set initial LED color
from lib.device_helpers import status_led
if status_led:
    status_led.set_color((_current_color[0], _current_color[1], _current_color[2]))

# Unregister any existing handler for this route, then register fresh
try:
    httpserver.off('/led_picker', 'GET')
    httpserver.off('/led_picker', 'POST')
    print("✓ Unregistered old routes: /led_picker")
except:
    # Route wasn't registered - that's fine
    pass

# Register the HTTP routes (GET and POST)
try:
    result_get = httpserver.on('/led_picker', led_control_ui, 'GET')
    result_post = httpserver.on('/led_picker', led_control_ui, 'POST')
    
    if result_get is not None and result_get >= 0 and result_post is not None and result_post >= 0:
        print("✓ Registered HTTP routes: /led_picker (GET, POST)")
    else:
        print("✗ Failed to register routes: /led_picker")
except Exception as e:
    print(f"✗ Route registration failed: {e}")
    import sys
    sys.print_exception(e)
    raise

# Get device IP
try:
    sta = network.WLAN(network.STA_IF)
    if not sta.isconnected():
        print("✗ WiFi not connected - cannot display UI")
        raise Exception("WiFi not connected")
    
    ip = sta.ifconfig()[0]
    print(f"✓ Device IP: {ip}")
except Exception as e:
    print(f"✗ Failed to get IP: {e}")
    raise

# Send DISPLAY-UI command to Studio via webrepl.notify
try:
    # Use helper to get URL with correct protocol (auto-detects HTTPS)
    from lib.client_helpers import getDeviceURL
    url = getDeviceURL('/led_picker')
    title = args.ui_title  # Use the user-configured title
    
    # Send notification with display_ui payload
    result = webrepl.notify(json.dumps({"display_ui": {"url": url, "title": title}}))
    if result:
        print(f"✓ UI display command sent to Studio")
        print(f"  URL: {url}")
        print(f"  Title: {title}")
    else:
        print("⚠ UI display command failed (no active Studio client)")
    
except Exception as e:
    print(f"✗ Failed to send display command: {e}")
    import sys
    sys.print_exception(e)
    raise

print("="*60)
print("LED Color Picker UI Plugin - Complete!")
print("The UI should now be displayed in ScriptO Studio.")
print("Use the RGB sliders to change the LED color in real-time.")
print("="*60 + "\n")
