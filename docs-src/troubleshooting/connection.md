# Troubleshooting Connection

Common connection issues and their solutions.

## Quick Checks

Before diving into detailed troubleshooting:

- [ ] Device is powered on
- [ ] Device and browser on same network
- [ ] Correct IP address entered
- [ ] WebREPL password is correct
- [ ] No other client connected (single-client model)

## Connection Errors

### "Connection refused" or timeout

**Cause**: Device unreachable or WebREPL not running

**Solutions**:
1. Ping the device: `ping <device-ip>`
2. Check device is on WiFi (status LED should be solid)
3. Verify WebREPL is enabled in `boot.py`
4. Try connecting via serial to verify device is running

### "Authentication failed"

**Cause**: Wrong password

**Solutions**:
1. Default password is `micropython`
2. Check `settings/wifi.json` on device for custom password
3. Reset password via serial REPL if forgotten

### "WebRTC connection failed"

**Cause**: NAT/firewall blocking P2P

**Solutions**:
1. Try WebSocket fallback (automatic after WebRTC timeout)
2. Ensure devices are on same subnet
3. Check router doesn't block P2P connections
4. Disable VPN if active

### "Another client is connected"

**Cause**: Only one WebREPL client allowed at a time

**Solutions**:
1. Close other browser tabs with ScriptO Studio
2. Wait 30 seconds for stale connection to timeout
3. Power cycle device to force disconnect

## Network Issues

### Device in AP Mode

When device can't connect to WiFi, it creates its own access point:

1. Look for WiFi network: `pyDirect-XXXX`
2. Connect your computer to that network
3. Access ScriptO Studio at `http://192.168.4.1`
4. Configure WiFi credentials in Settings

### Wrong IP Address

Find your device's IP:

**From serial REPL:**
```python
import network
sta = network.WLAN(network.STA_IF)
print(sta.ifconfig()[0])
```

**From router:**
Check your router's DHCP client list for the device.

## Performance Issues

### Slow Response

**Causes & Solutions**:

| Symptom | Cause | Solution |
|---------|-------|----------|
| Commands take 4-6s | Memory pressure | Reboot device |
| Gradual slowdown | Memory leak | Check for unclosed files/sockets |
| Intermittent lag | WiFi interference | Move device closer to router |

### Memory Warnings

If device shows low memory:

```python
import gc
gc.collect()
print(gc.mem_free())
```

Target: >50KB free for stable operation.

## Debug Logging

Enable verbose logging for diagnosis:

**In ScriptO Studio:**
1. Open browser DevTools (F12)
2. Check Console tab for connection logs
3. Look for `[WebRTC]` or `[WebSocket]` prefixed messages

**On Device:**
Check UART output for `ESP_LOGD` messages.

## Still Stuck?

1. Check [FAQ](../reference/faq.md) for known issues
2. Review device serial output for errors
3. [Open an issue](https://github.com/jetpax/scriptostudio/issues) with:
   - Browser and version
   - Device board type
   - Error messages from console
   - Network configuration
