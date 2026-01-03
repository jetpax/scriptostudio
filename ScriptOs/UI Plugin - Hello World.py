
# === START_CONFIG_PARAMETERS ===

dict(
    
    timeout = 0,  # No stop button needed - this is a quick setup script
    silent = True,  # Hide internal print statements (UI-based ScriptO)
    
    info = dict(
        name        = 'UI Plugin - Hello World',
        version     = [1, 1, 0],
        category    = 'UI Plugins',
        description = '''Minimal demonstration of the ScriptO UI Plugin Architecture.
                         
                         This ScriptO:
                         • Registers an HTTP route that serves a self-contained HTML page
                         • Sends a command to Studio to open the UI in a modal
                         • The UI is served directly from your ESP32 device
                         
                         This proves the end-to-end plugin flow where ScriptOs can provide 
                         their own web-based user interfaces without requiring any code changes 
                         in ScriptO Studio.
                         
                         The UI appears in an iframe modal and communicates directly with the device.
                      ''',
        author      = 'ScriptO Team',
        mail        = '',
        www         = 'https://github.com/jep-scriptomatic'
    ),

    args = dict(
        
        ui_title = dict(
            label = 'UI Window Title:',
            type  = str,
            value = 'Hello World from ScriptO'
        )
        
    )

)

# === END_CONFIG_PARAMETERS ===

import httpserver
import webrepl_binary as webrepl
import network

# Get device IP once at module level
_device_ip = str(network.WLAN(network.STA_IF).ifconfig()[0])

def hello_ui(uri, post_data=None):
    """
    HTTP handler that returns a self-contained HTML page.
    All CSS and JavaScript are embedded inline.
    """
    # Build HTML with device IP embedded
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World from ScriptO</title>
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
            padding: 48px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            text-align: center;
        }
        
        h1 {
            color: #2d3748;
            font-size: 2.5em;
            margin-bottom: 16px;
            font-weight: 700;
        }
        
        .emoji {
            font-size: 4em;
            margin-bottom: 24px;
            display: block;
            animation: wave 2s ease-in-out infinite;
        }
        
        @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
        }
        
        p {
            color: #4a5568;
            font-size: 1.1em;
            line-height: 1.8;
            margin-bottom: 12px;
        }
        
        .info-box {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 16px;
            margin-top: 24px;
            text-align: left;
            border-radius: 4px;
        }
        
        .info-box strong {
            color: #667eea;
        }
        
        .badge {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            margin-top: 16px;
        }
        
        code {
            background: #edf2f7;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #e53e3e;
        }
        
        .feature-list {
            text-align: left;
            margin-top: 20px;
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
        }
        
        .feature-list h3 {
            color: #667eea;
            font-size: 1.2em;
            margin-bottom: 12px;
        }
        
        .feature-list ul {
            list-style: none;
            padding: 0;
        }
        
        .feature-list li {
            padding: 8px 0;
            color: #4a5568;
        }
        
        .feature-list li:before {
            content: "\\2713 ";
            color: #48bb78;
            font-weight: bold;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <span class="emoji">👋</span>
        <h1>Hello World from ScriptO!</h1>
        <p>This UI is served directly from your ESP32 device.</p>
        <p>It demonstrates the plugin architecture where ScriptOs can provide their own web interfaces.</p>
        
        <div class="info-box">
            <p><strong>Device IP:</strong> <code>""" + _device_ip + """</code></p>
            <p><strong>Served via:</strong> HTTP/HTTPS Server on ESP32</p>
            <p><strong>Protocol:</strong> Iframe (auto-detects HTTP/HTTPS)</p>
        </div>
        
        <div class="feature-list">
            <h3>Plugin Architecture Features:</h3>
            <ul>
                <li>ScriptOs serve their own HTML/CSS/JS UIs</li>
                <li>Studio displays UIs in modals via iframe</li>
                <li>Direct device-to-UI communication</li>
                <li>No Studio code changes needed for new UIs</li>
                <li>Self-contained, modular design</li>
            </ul>
        </div>
        
        <div class="badge">✨ UI Plugin Demo</div>
        
        <script>
            // Simple interactivity demo
            console.log('Hello World UI loaded successfully!');
            console.log('Device IP:', '""" + _device_ip + """');
            
            // Add click interaction to emoji
            const emoji = document.querySelector('.emoji');
            emoji.style.cursor = 'pointer';
            emoji.addEventListener('click', () => {
                const emojis = ['👋', '🎉', '🚀', '⚡', '✨', '🎨', '💡', '🔧', '📱', '💻'];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.textContent = randomEmoji;
            });
            
            // Log that we're running in iframe
            if (window.self !== window.top) {
                console.log('Running in iframe (plugin mode)');
            } else {
                console.log('Running standalone');
            }
        </script>
    </div>
</body>
</html>"""
    
    return html


# Main execution
print("\n" + "="*60)
print("Hello World UI Plugin - Starting...")
print("="*60)

# Unregister any existing handler for this route, then register fresh
try:
    httpserver.off('/hello_ui', 'GET')
    print("✓ Unregistered old route: /hello_ui")
except:
    # Route wasn't registered - that's fine
    pass

# Register the HTTP route
try:
    result = httpserver.on('/hello_ui', hello_ui, 'GET')
    # httpserver.on() returns the handler slot number (0 or greater on success)
    if result is not None and result >= 0:
        print("✓ Registered HTTP route: /hello_ui")
    else:
        print("✗ Failed to register route: /hello_ui")
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
    url = getDeviceURL('/hello_ui')
    title = args.ui_title  # Use the user-configured title
    
    # Send notification with display_ui payload
    import json
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
print("Hello World UI Plugin - Complete!")
print("The UI should now be displayed in ScriptO Studio.")
print("="*60 + "\n")
