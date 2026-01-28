
# === START_CONFIG_PARAMETERS ===

dict(
    
    timeout = 0,  # No stop button needed - this is a UI-based ScriptO
    silent = True,  # Hide internal print statements
    
    info = dict(
        name        = 'Status LED Color Control',
        version     = [1, 0, 0],
        category    = 'UI Plugins',
        description = '''Control the status LED color with a visual color picker.
                         
                         This ScriptO provides:
                         • Color picker UI to select LED color
                         • Real-time RGB value display
                         • Direct control of status LED
                         • Preview of selected color
                      ''',
        author      = 'ScriptO Team',
        mail        = '',
        www         = 'https://github.com/jep-scriptomatic'
    ),
    
    args = dict(
        
        ui_title = dict(
            label = 'UI Window Title:',
            type  = str,
            value = 'Status LED Color Control'
        )
        
    )
    
)

# === END_CONFIG_PARAMETERS ===

import httpserver
import webrepl_binary as webrepl
import network
import json

# Get device IP once at module level
try:
    sta = network.WLAN(network.STA_IF)
    if sta.isconnected():
        _device_ip = str(sta.ifconfig()[0])
    else:
        # Try other network interfaces
        from lib.network_helpers import getNetworksInfo
        net_info = getNetworksInfo()
        _device_ip = net_info.get('ip', '0.0.0.0')
except:
    _device_ip = '0.0.0.0'

def led_control_ui(uri, post_data=None):
    """
    HTTP handler that returns a self-contained HTML page with color picker.
    """
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status LED Color Control</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                         'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
        }
        
        h1 {
            color: #2d3748;
            font-size: 2em;
            margin-bottom: 8px;
            font-weight: 700;
            text-align: center;
        }
        
        .subtitle {
            color: #718096;
            text-align: center;
            margin-bottom: 32px;
            font-size: 0.9em;
        }
        
        .color-picker-section {
            margin-bottom: 24px;
        }
        
        .color-picker-label {
            display: block;
            color: #4a5568;
            font-weight: 600;
            margin-bottom: 12px;
            font-size: 1em;
        }
        
        .color-input-wrapper {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        input[type="color"] {
            width: 80px;
            height: 80px;
            border: 3px solid #e2e8f0;
            border-radius: 12px;
            cursor: pointer;
            padding: 0;
            background: none;
        }
        
        input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 0;
        }
        
        input[type="color"]::-webkit-color-swatch {
            border: none;
            border-radius: 8px;
        }
        
        .rgb-display {
            flex: 1;
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
        }
        
        .rgb-value {
            font-family: 'Courier New', monospace;
            font-size: 1.1em;
            color: #2d3748;
            margin-bottom: 8px;
        }
        
        .rgb-value:last-child {
            margin-bottom: 0;
        }
        
        .rgb-value strong {
            color: #667eea;
            margin-right: 8px;
        }
        
        .preview-box {
            width: 100%;
            height: 80px;
            border-radius: 8px;
            border: 2px solid #e2e8f0;
            margin-bottom: 24px;
            background: #000;
            transition: background-color 0.2s;
        }
        
        .button-group {
            display: flex;
            gap: 12px;
        }
        
        button {
            flex: 1;
            padding: 14px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5568d3;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .btn-primary:active {
            transform: translateY(0);
        }
        
        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }
        
        .btn-secondary:hover {
            background: #cbd5e0;
        }
        
        .status {
            margin-top: 20px;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            font-size: 0.9em;
            display: none;
        }
        
        .status.success {
            background: #c6f6d5;
            color: #22543d;
            border: 1px solid #9ae6b4;
        }
        
        .status.error {
            background: #fed7d7;
            color: #742a2a;
            border: 1px solid #fc8181;
        }
        
        .status.loading {
            background: #bee3f8;
            color: #2c5282;
            border: 1px solid #90cdf4;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💡 Status LED Control</h1>
        <p class="subtitle">Select a color to set the status LED</p>
        
        <div class="color-picker-section">
            <label class="color-picker-label">Color Picker:</label>
            <div class="color-input-wrapper">
                <input type="color" id="colorPicker" value="#ffff00">
                <div class="rgb-display">
                    <div class="rgb-value"><strong>R:</strong> <span id="rValue">255</span></div>
                    <div class="rgb-value"><strong>G:</strong> <span id="gValue">255</span></div>
                    <div class="rgb-value"><strong>B:</strong> <span id="bValue">0</span></div>
                </div>
            </div>
        </div>
        
        <div class="preview-box" id="preview"></div>
        
        <div class="button-group">
            <button class="btn-primary" id="setColorBtn">Set LED Color</button>
            <button class="btn-secondary" id="getCurrentBtn">Get Current</button>
        </div>
        
        <div class="status" id="status"></div>
    </div>
    
    <script>
        // Simple DeviceAPI implementation
        class DeviceAPI {
            constructor() {
                this.pendingRequests = new Map();
                this.requestId = 0;
                
                window.addEventListener('message', (event) => {
                    if (event.data.type === 'result') {
                        const handler = this.pendingRequests.get(event.data.id);
                        if (handler) {
                            handler.resolve(event.data.data);
                            this.pendingRequests.delete(event.data.id);
                        }
                    } else if (event.data.type === 'error') {
                        const handler = this.pendingRequests.get(event.data.id);
                        if (handler) {
                            handler.reject(new Error(event.data.error));
                            this.pendingRequests.delete(event.data.id);
                        }
                    }
                });
            }
            
            async execute(code) {
                const id = ++this.requestId;
                
                return new Promise((resolve, reject) => {
                    this.pendingRequests.set(id, { resolve, reject });
                    
                    window.parent.postMessage({
                        type: 'execute',
                        id: id,
                        code: code
                    }, '*');
                    
                    setTimeout(() => {
                        if (this.pendingRequests.has(id)) {
                            this.pendingRequests.delete(id);
                            reject(new Error('Command timeout after 10 seconds'));
                        }
                    }, 10000);
                });
            }
        }
        
        const api = new DeviceAPI();
        const colorPicker = document.getElementById('colorPicker');
        const rValue = document.getElementById('rValue');
        const gValue = document.getElementById('gValue');
        const bValue = document.getElementById('bValue');
        const preview = document.getElementById('preview');
        const setColorBtn = document.getElementById('setColorBtn');
        const getCurrentBtn = document.getElementById('getCurrentBtn');
        const status = document.getElementById('status');
        
        // Update RGB display and preview when color changes
        function updateDisplay() {
            const hex = colorPicker.value;
            const r = parseInt(hex.substr(1, 2), 16);
            const g = parseInt(hex.substr(3, 2), 16);
            const b = parseInt(hex.substr(5, 2), 16);
            
            rValue.textContent = r;
            gValue.textContent = g;
            bValue.textContent = b;
            
            preview.style.backgroundColor = hex;
        }
        
        // Show status message
        function showStatus(message, type) {
            status.textContent = message;
            status.className = 'status ' + type;
            status.style.display = 'block';
            
            if (type !== 'loading') {
                setTimeout(() => {
                    status.style.display = 'none';
                }, 3000);
            }
        }
        
        // Set LED color
        async function setLEDColor(r, g, b) {
            showStatus('Setting LED color...', 'loading');
            setColorBtn.disabled = true;
            
            try {
                // Use setLedColor helper function which is already available
                const code = `from lib.device_helpers import setLedColor; setLedColor(${r}, ${g}, ${b}); print("OK")`;
                
                const result = await api.execute(code);
                
                // Accept any result - if it executed, it worked
                showStatus(`✓ LED set to RGB(${r}, ${g}, ${b})`, 'success');
            } catch (error) {
                showStatus('✗ Error: ' + error.message, 'error');
            } finally {
                setColorBtn.disabled = false;
            }
        }
        
        // Get current LED color (if possible)
        async function getCurrentColor() {
            showStatus('Getting current color...', 'loading');
            getCurrentBtn.disabled = true;
            
            try {
                // Get color from status_led singleton
                const code = `from lib.device_helpers import status_led; c = status_led.base_color if status_led else (0,0,0); print(c[0], c[1], c[2], sep=',')`;
                
                const result = await api.execute(code);
                
                // Parse result - should be "r,g,b" format
                const trimmed = result.trim();
                const parts = trimmed.split(',');
                if (parts.length >= 3) {
                    const r = parseInt(parts[0]);
                    const g = parseInt(parts[1]);
                    const b = parseInt(parts[2]);
                    
                    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                        // Convert RGB to hex
                        const hex = '#' + [r, g, b].map(x => {
                            const hex = x.toString(16);
                            return hex.length === 1 ? '0' + hex : hex;
                        }).join('');
                        
                        colorPicker.value = hex;
                        updateDisplay();
                        showStatus(`✓ Current color: RGB(${r}, ${g}, ${b})`, 'success');
                    } else {
                        showStatus('✗ Could not parse color values', 'error');
                    }
                } else {
                    showStatus('✗ Could not get current color', 'error');
                }
            } catch (error) {
                showStatus('✗ Error: ' + error.message, 'error');
            } finally {
                getCurrentBtn.disabled = false;
            }
        }
        
        // Event listeners
        colorPicker.addEventListener('input', updateDisplay);
        
        setColorBtn.addEventListener('click', () => {
            const r = parseInt(rValue.textContent);
            const g = parseInt(gValue.textContent);
            const b = parseInt(bValue.textContent);
            setLEDColor(r, g, b);
        });
        
        getCurrentBtn.addEventListener('click', getCurrentColor);
        
        // Initialize display
        updateDisplay();
    </script>
</body>
</html>"""
    
    return html


# Main execution
print("\n" + "="*60)
print("Status LED Color Control - Starting...")
print("="*60)

# Unregister any existing handler for this route, then register fresh
try:
    httpserver.off('/led_control', 'GET')
    print("✓ Unregistered old route: /led_control")
except:
    # Route wasn't registered - that's fine
    pass

# Register the HTTP route
try:
    result = httpserver.on('/led_control', led_control_ui, 'GET')
    if result is not None and result >= 0:
        print("✓ Registered HTTP route: /led_control")
    else:
        print("✗ Failed to register route: /led_control")
except Exception as e:
    print(f"✗ Route registration failed: {e}")
    import sys
    sys.print_exception(e)
    raise

# Get device IP
try:
    sta = network.WLAN(network.STA_IF)
    if not sta.isconnected():
        # Try other network interfaces
        from lib.network_helpers import getNetworksInfo
        net_info = getNetworksInfo()
        ip = net_info.get('ip', '0.0.0.0')
        if ip == '0.0.0.0':
            print("✗ No network connection - cannot display UI")
            raise Exception("No network connection")
    else:
        ip = sta.ifconfig()[0]
    print(f"✓ Device IP: {ip}")
except Exception as e:
    print(f"✗ Failed to get IP: {e}")
    raise

# Send DISPLAY-UI command to Studio via webrepl.notify
try:
    # Use helper to get URL with correct protocol (auto-detects HTTPS)
    from lib.client_helpers import getDeviceURL
    url = getDeviceURL('/led_control')
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
print("Status LED Color Control - Complete!")
print("The UI should now be displayed in ScriptO Studio.")
print("="*60 + "\n")
