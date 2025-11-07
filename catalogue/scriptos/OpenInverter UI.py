
# === START_CONFIG_PARAMETERS ===

dict(
    
    timeout = 0,  # No stop button - quick initialization
    silent = True,  # Hide internal print statements (UI-based ScriptO)
    
    info = dict(
        name        = 'OpenInverter UI',
        version     = [1, 0, 0],
        category    = 'UI Plugins',
        description = '''Full OpenInverter web interface with WebREPL communication.
                         
                         This ScriptO provides:
                         • Full parameter display and editing
                         • Real-time data visualization
                         • CAN mapping management
                         • Direct integration with OpenInverter via CAN bus
                         
                         The UI is served from /oi_ui/ directory and opens in a
                         Studio modal. Communication happens via WebREPL using the
                         existing OI_helpers functions - no REST API needed!
                         
                         Currently uses demo data from OI_helpers.py.
                         For live hardware: enable CAN bus initialization below.
                      ''',
        author      = 'ScriptO Team',
        mail        = '',
        www         = 'https://github.com/jep-scriptomatic'
    ),

    args = dict(
        
        ui_title = dict(
            label = 'UI Window Title:',
            type  = str,
            value = 'OpenInverter Control'
        ),
        
        enable_can = dict(
            label = 'Enable CAN Bus:',
            type  = bool,
            value = False
        ),
        
        can_tx = dict(
            label = 'CAN TX Pin:',
            type  = int,
            value = 5
        ),
        
        can_rx = dict(
            label = 'CAN RX Pin:',
            type  = int,
            value = 4
        )
        
    )

)

# === END_CONFIG_PARAMETERS ===

from esp32 import webfiles, webrepl
import network

# Import OI helper functions - these are callable via WebREPL from the UI
# No need to wrap them in HTTP handlers!
from lib.OI_helpers import (
    getOiParams, setParameter, saveParameters,
    getSpotValues, getPlotData,
    mapCanSpotValue, unmapCanSpotValue, getCanMappingData
)

# Optional CAN bus integration
if args.enable_can:
    try:
        from lib.can_helpers import init_can, sdo_read, sdo_write
        print("[OI UI] Initializing CAN bus...")
        init_can(tx=args.can_tx, rx=args.can_rx, bitrate=500000)
        print("[OI UI] CAN bus initialized")
    except Exception as e:
        print(f"[OI UI] CAN initialization failed: {e}")
        print("[OI UI] Continuing with demo data...")


# ============================================================================
# Placeholder UI - Demonstrates WebREPL Communication
# (Until actual OI UI files are uploaded, this shows a working demo)
# ============================================================================

def serve_placeholder_ui(uri, post_data=None):
    """Temporary placeholder that demonstrates WebREPL communication"""
    
    ip = network.WLAN(network.STA_IF).ifconfig()[0]
    
    # Inline device-api.js for demonstration
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenInverter UI - WebREPL Demo</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            margin: 0;
        }}
        .container {{
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            margin: 20px auto;
        }}
        h1 {{
            color: #2d3748;
            margin-bottom: 10px;
        }}
        .status {{
            background: #48bb78;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        .button {{
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s;
        }}
        .button:hover {{
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }}
        .button:disabled {{
            background: #cbd5e0;
            cursor: not-allowed;
            transform: none;
        }}
        .output {{
            background: #2d3748;
            color: #48bb78;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            max-height: 400px;
            overflow-y: auto;
            white-space: pre-wrap;
        }}
        .info {{
            background: #edf2f7;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }}
        .info h3 {{
            margin-top: 0;
            color: #667eea;
        }}
        code {{
            background: #2d3748;
            color: #48bb78;
            padding: 2px 6px;
            border-radius: 3px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 OpenInverter UI</h1>
        <p style="color: #718096; margin-top: 0;">WebREPL Communication Demo</p>
        
        <div class="status">
            <span id="status-icon">✅</span>
            <span id="status-text">Connected via WebREPL</span>
        </div>
        
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="button" onclick="testGetParams()">Get Parameters</button>
            <button class="button" onclick="testGetSpotValues()">Get Spot Values</button>
            <button class="button" onclick="testGetCanMap()">Get CAN Map</button>
            <button class="button" onclick="clearOutput()">Clear Output</button>
        </div>
        
        <div class="output" id="output">Ready. Click a button to test WebREPL communication...</div>
        
        <div class="info">
            <h3>How It Works</h3>
            <p>This UI demonstrates the <strong>WebREPL communication pattern</strong>:</p>
            <ol>
                <li>UI calls <code>api.getOiParams()</code> (async/await)</li>
                <li>DeviceAPI posts message to parent Studio window</li>
                <li>Studio executes <code>getOiParams()</code> via WebREPL</li>
                <li>Device returns JSON response</li>
                <li>Studio forwards response back to UI</li>
                <li>UI displays the data</li>
            </ol>
            
            <p><strong>No REST API needed!</strong> All communication uses existing OI_helpers functions via WebREPL.</p>
            
            <h3>Next Steps</h3>
            <p>To see the full OpenInverter UI:</p>
            <ul>
                <li>Upload OpenInverter web files to <code>/oi_ui/</code> directory</li>
                <li>Include device-api.js in your HTML</li>
                <li>Use async/await for all device calls</li>
            </ul>
        </div>
    </div>
    
    <script>
        // Inline DeviceAPI for demonstration
        class DeviceAPI {{
          constructor() {{
            this.pendingRequests = new Map();
            this.requestId = 0;
            
            window.addEventListener('message', (event) => {{
              if (event.data.type === 'result') {{
                const handler = this.pendingRequests.get(event.data.id);
                if (handler) {{
                  handler.resolve(event.data.data);
                  this.pendingRequests.delete(event.data.id);
                }}
              }} else if (event.data.type === 'error') {{
                const handler = this.pendingRequests.get(event.data.id);
                if (handler) {{
                  handler.reject(new Error(event.data.error));
                  this.pendingRequests.delete(event.data.id);
                }}
              }}
            }});
          }}
          
          async execute(code) {{
            const id = ++this.requestId;
            
            return new Promise((resolve, reject) => {{
              this.pendingRequests.set(id, {{ resolve, reject }});
              
              window.parent.postMessage({{
                type: 'execute',
                id: id,
                code: code
              }}, '*');
              
              setTimeout(() => {{
                if (this.pendingRequests.has(id)) {{
                  this.pendingRequests.delete(id);
                  reject(new Error('Command timeout'));
                }}
              }}, 5000);
            }});
          }}
          
          _parseResponse(output) {{
            try {{
              return JSON.parse(output);
            }} catch (e) {{
              const jsonMatch = output.match(/\\{{[^}}]*"CMD"[^}}]*\\}}/);
              if (jsonMatch) {{
                return JSON.parse(jsonMatch[0]);
              }}
              throw new Error('Failed to parse response');
            }}
          }}
          
          async getOiParams() {{
            const result = await this.execute('getOiParams()');
            const parsed = this._parseResponse(result);
            return parsed.ARG || parsed;
          }}
          
          async getSpotValues() {{
            const result = await this.execute('getSpotValues()');
            const parsed = this._parseResponse(result);
            return parsed.ARG || parsed;
          }}
          
          async getCanMap() {{
            const result = await this.execute('getCanMappingData()');
            const parsed = this._parseResponse(result);
            return parsed.ARG || parsed;
          }}
        }}
        
        const api = new DeviceAPI();
        const output = document.getElementById('output');
        
        function log(message, type = 'info') {{
          const timestamp = new Date().toLocaleTimeString();
          const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '📝';
          output.textContent += `[$${{timestamp}}] $${{prefix}} $${{message}}\\n`;
          output.scrollTop = output.scrollHeight;
        }}
        
        function clearOutput() {{
          output.textContent = 'Output cleared.\\n';
        }}
        
        async function testGetParams() {{
          try {{
            log('Calling getOiParams()...');
            const params = await api.getOiParams();
            log('Received parameters:', 'success');
            output.textContent += JSON.stringify(params, null, 2) + '\\n\\n';
            output.scrollTop = output.scrollHeight;
          }} catch (error) {{
            log('Error: ' + error.message, 'error');
          }}
        }}
        
        async function testGetSpotValues() {{
          try {{
            log('Calling getSpotValues()...');
            const spotValues = await api.getSpotValues();
            log('Received spot values:', 'success');
            output.textContent += JSON.stringify(spotValues, null, 2) + '\\n\\n';
            output.scrollTop = output.scrollHeight;
          }} catch (error) {{
            log('Error: ' + error.message, 'error');
          }}
        }}
        
        async function testGetCanMap() {{
          try {{
            log('Calling getCanMappingData()...');
            const canMap = await api.getCanMap();
            log('Received CAN mapping data:', 'success');
            output.textContent += JSON.stringify(canMap, null, 2) + '\\n\\n';
            output.scrollTop = output.scrollHeight;
          }} catch (error) {{
            log('Error: ' + error.message, 'error');
          }}
        }}
        
        console.log('OpenInverter UI - WebREPL Communication Demo');
        console.log('Device IP:', '{ip}');
        console.log('Test with buttons or: await api.getOiParams()');
    </script>
</body>
</html>"""
    
    return html


# ============================================================================
# Main Execution
# ============================================================================

print("\n" + "="*60)
print("OpenInverter UI ScriptO - Initializing...")
print("="*60)

# Clean up any existing routes
print("[OI UI] Cleaning up old routes...")
try:
    from esp32 import httpserver
    httpserver.off('/oi_ui/index.html', 'GET')
except:
    pass

# Serve UI files (or placeholder if files not uploaded yet)
print("[OI UI] Setting up UI serving...")
try:
    # Try to serve actual UI files if they exist
    import os
    os.stat('/oi_ui/index.html')
    webfiles.serve('/oi_ui', '/oi_ui')
    print("[OI UI] ✓ Serving UI files from /oi_ui/")
except:
    # Fallback to placeholder demo
    print("[OI UI] ⚠ UI files not found, using WebREPL demo")
    from esp32 import httpserver
    httpserver.on('/oi_ui/index.html', serve_placeholder_ui, 'GET')

# Get device IP
try:
    sta = network.WLAN(network.STA_IF)
    if not sta.isconnected():
        print("[OI UI] ✗ WiFi not connected")
        raise Exception("WiFi not connected")
    
    ip = sta.ifconfig()[0]
    print(f"[OI UI] ✓ Device IP: {ip}")
except Exception as e:
    print(f"[OI UI] ✗ Failed to get IP: {e}")
    raise

# Trigger Studio modal
try:
    url = f'http://{ip}/oi_ui/index.html'
    title = args.ui_title
    
    result = webrepl.display_ui(url, title)
    if result:
        print(f"[OI UI] ✓ UI display command sent to Studio")
        print(f"[OI UI]   URL: {url}")
        print(f"[OI UI]   Title: {title}")
    else:
        print("[OI UI] ⚠ UI display command failed (no active Studio client)")
    
except Exception as e:
    print(f"[OI UI] ✗ Failed to send display command: {e}")
    import sys
    sys.print_exception(e)
    raise

print("="*60)
print("OpenInverter UI ScriptO - Ready!")
print("")
print("Communication: WebREPL (no REST API needed!)")
print("  • UI calls: api.getOiParams(), api.setParameter(), etc.")
print("  • Studio forwards commands via WebREPL")
print("  • Reuses existing OI_helpers functions")
print("")
print("CAN Bus: " + ("Enabled" if args.enable_can else "Disabled (using demo data)"))
print("="*60 + "\n")

