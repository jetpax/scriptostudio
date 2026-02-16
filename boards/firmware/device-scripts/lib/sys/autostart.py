"""
Extension Auto-Start — runs registered extension init functions on boot.

Follows pyDirect's Service Promotion Pattern (§4.1):
  - Config via settings cascade: extensions.autostart = [{id, module, function}]
  - Called from main.py post-network in the asyncio boot loop
  - No GUI needed — manual edit to /settings/user_settings.json

Example user_settings.json:
{
  "extensions": {
    "autostart": [
      {"id": "pfc", "module": "lib.ext.pfc.gateway", "function": "ensure_init"}
    ]
  }
}
"""

def run_autostart():
    """Auto-start registered extensions.
    
    Call after network is ready in main.py event loop.
    Reads extensions.autostart from settings and calls each
    registered init function.
    """
    try:
        from lib.sys import settings
    except ImportError:
        print("[autostart] settings module not available")
        return

    entries = settings.get('extensions.autostart', [])
    if not entries:
        return

    print(f"[autostart] starting {len(entries)} extension(s)")
    
    for entry in entries:
        ext_id = entry.get('id', '?')
        module_path = entry.get('module', '')
        fn_name = entry.get('function', 'ensure_init')
        
        if not module_path:
            print(f"[autostart] {ext_id}: no module specified, skipping")
            continue
        
        try:
            # Dynamic import — MicroPython __import__ uses positional args only
            parts = module_path.rsplit('.', 1)
            if len(parts) == 2:
                mod = __import__(module_path, None, None, [parts[1]])
            else:
                mod = __import__(module_path)
            
            fn = getattr(mod, fn_name, None)
            if fn is None:
                print(f"[autostart] {ext_id}: {fn_name} not found in {module_path}")
                continue
            
            fn()
            print(f"[autostart] {ext_id}: OK")
        except Exception as e:
            print(f"[autostart] {ext_id}: FAILED - {e}")
