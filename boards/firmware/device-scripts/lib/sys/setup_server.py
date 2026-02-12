"""
Setup Mode Server
=================

Minimal HTTPS server for password setup during provisioning.
Runs instead of main.py when setup_mode flag is set.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import network
import httpserver
import json
import machine
import time

from lib.sys import settings

# Embedded HTML for setup page (minified)
SETUP_HTML = '''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>pyBot Setup</title>
<style>
:root{--bg:#0f172a;--panel:#111827;--border:#1f2937;--text:#e5e7eb;--muted:#9ca3af;--accent:#38bdf8;--error:#f87171;--success:#10b981}
*{box-sizing:border-box}
body{margin:0;font-family:system-ui;background:var(--bg);color:var(--text);display:flex;align-items:center;justify-content:center;min-height:100vh}
.panel{width:100%;max-width:380px;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:24px}
h1{margin:0 0 4px;font-size:1.25rem}
.subtitle{font-size:.875rem;color:var(--muted);margin-bottom:20px}
.info{background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.3);border-radius:6px;padding:12px;margin-bottom:20px;font-size:.875rem}
label{display:block;font-size:.875rem;margin:12px 0 6px}
input{width:100%;padding:10px 12px;border-radius:6px;border:1px solid var(--border);background:#020617;color:var(--text);font-size:1rem}
input:focus{outline:none;border-color:var(--accent)}
button{margin-top:16px;width:100%;padding:12px;font-size:1rem;border-radius:6px;border:none;background:var(--accent);color:#020617;font-weight:600;cursor:pointer}
button:disabled{opacity:.5;cursor:default}
.hint{font-size:.75rem;color:var(--muted);margin-top:6px}
.status{margin-top:12px;padding:10px;border-radius:6px;display:none}
.status.error{display:block;background:#7f1d1d;color:#fecaca}
.status.ok{display:block;background:#14532d;color:#bbf7d0}
</style>
</head>
<body>
<div class="panel">
<h1>⚡ pyBot Setup</h1>
<div class="subtitle">Set your WebREPL password to complete setup</div>
<div class="info">
<strong>Device:</strong> HOSTNAME.local<br>
<strong>IP:</strong> IPADDR
</div>
<label>Password</label>
<input type="password" id="pw1" placeholder="Min 4 characters">
<label>Confirm Password</label>
<input type="password" id="pw2" placeholder="Confirm password">
<div class="hint">This password protects access to your device</div>
<button id="btn" disabled onclick="save()">Complete Setup</button>
<div id="status" class="status"></div>
</div>
<script>
const pw1=document.getElementById('pw1'),pw2=document.getElementById('pw2'),btn=document.getElementById('btn'),status=document.getElementById('status');
function check(){
  if(pw1.value.length>=4&&pw1.value===pw2.value){btn.disabled=false;status.className='status'}
  else{btn.disabled=true;if(pw2.value&&pw1.value!==pw2.value){status.className='status error';status.textContent='Passwords do not match'}else{status.className='status'}}
}
pw1.oninput=pw2.oninput=check;
async function save(){
  btn.disabled=true;btn.textContent='Saving...';
  try{
    const r=await fetch('/set-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw1.value})});
    const d=await r.json();
    if(d.success){status.className='status ok';status.textContent='✓ Setup complete! Redirecting...';setTimeout(()=>location.href=d.redirect,2000)}
    else throw new Error(d.error);
  }catch(e){status.className='status error';status.textContent=e.message;btn.disabled=false;btn.textContent='Complete Setup'}
}
</script>
</body>
</html>'''


def run_setup_server():
    """Run the setup mode server."""
    print("[SETUP] Starting setup mode...")
    
    # Get saved WiFi credentials
    ssid = settings.get("wifi.ssid")
    password = settings.get("wifi.password")
    hostname = settings.get("device.hostname", "pybot")
    
    if not ssid:
        print("[SETUP] ERROR: No WiFi credentials saved, cannot start setup mode")
        # Clear setup mode and let normal boot proceed
        settings.set("setup_mode", False)
        settings.save()
        return
    
    # Connect to WiFi
    print(f"[SETUP] Connecting to WiFi: {ssid}")
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    # Set hostname before connecting (for mDNS)
    try:
        wlan.config(hostname=hostname)
    except:
        pass
    
    wlan.connect(ssid, password)
    
    # Wait for connection (up to 30 seconds)
    for i in range(60):
        if wlan.isconnected():
            break
        time.sleep(0.5)
    
    if not wlan.isconnected():
        print("[SETUP] ERROR: WiFi connection failed")
        return
    
    ip = wlan.ifconfig()[0]
    print(f"[SETUP] Connected! IP: {ip}")
    
    # Prepare HTML with device info
    html = SETUP_HTML.replace('HOSTNAME', hostname).replace('IPADDR', ip)
    
    # Flag for triggering reset after successful password save
    setup_complete = [False]  # Use list for mutability in nested function
    
    # Setup request handlers
    def serve_setup_page(uri, post_data=None, remote_addr=None):
        httpserver.send(html)
    
    def handle_set_password(uri, post_data=None, remote_addr=None):
        try:
            data = json.loads(post_data) if post_data else {}
            pw = data.get("password", "")
            
            if len(pw) < 4:
                return json.dumps({"success": False, "error": "Password too short (min 4 chars)"})
            
            # Save password and clear setup mode
            settings.set("server.webrepl_password", pw)
            settings.set("setup_mode", False)
            settings.save()
            
            print(f"[SETUP] Password saved, setup complete!")
            
            # Build redirect URL to Scripto Studio with device hostname
            # TODO: Make studio URL configurable
            redirect = f"https://scriptostudio.com/app/?device={hostname}.local"
            
            # Signal main loop to perform reset
            setup_complete[0] = True
            
            return json.dumps({"success": True, "redirect": redirect})
            
        except Exception as e:
            print(f"[SETUP] Error: {e}")
            return json.dumps({"success": False, "error": str(e)})
    
    def redirect_to_setup(uri, post_data=None, remote_addr=None):
        # 302 redirect not supported by C module, use HTML refresh
        httpserver.send('<html><head><meta http-equiv="refresh" content="0;url=/setup"></head><body><a href="/setup">Redirecting...</a></body></html>')
    
    # Start HTTPS server FIRST (required before registering routes)
    cert_file = settings.get("server.https_cert_file", "/certs/servercert.pem")
    key_file = settings.get("server.https_key_file", "/certs/prvtkey.pem")
    
    print(f"[SETUP] Starting HTTPS server...")
    # Note: start() takes the HTTP port as first arg. HTTPS (443) is started automatically if certs are provided.
    httpserver.start(80, cert_file=cert_file, key_file=key_file)
    
    # Register handlers (must be after server started)
    print(f"[SETUP] Registering routes...")
    httpserver.on("/setup", serve_setup_page, "GET")
    httpserver.on("/set-password", handle_set_password, "POST")
    httpserver.on("/", redirect_to_setup, "GET")
    
    print(f"[SETUP] Setup server ready at https://{hostname}.local/setup")
    
    # Process HTTP requests in a loop until setup is complete
    while True:
        httpserver.process_queue()
        
        # Check if password was saved and we should reset
        if setup_complete[0]:
            print("[SETUP] Resetting device for normal boot...")
            time.sleep_ms(500)  # Allow response to complete
            machine.soft_reset()
        
        time.sleep_ms(10)

