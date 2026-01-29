# Connection

Connect to your pyDirect device from ScriptO Studio.

## Connect Dialog

![Connect Dialog](https://raw.githubusercontent.com/jetpax/scriptostudio/main/.github/images/Connect.png)

When you open ScriptO Studio or click **Connect**, the connection dialog appears.

## Connection Details

| Field | Description | Example |
|-------|-------------|---------|
| **Device URL** | Full URL to your device's WebREPL endpoint | `https://pydirect-2b88.local/webrepl` |
| **Password** | Access password set during provisioning | `******` |

### Device URL Format

```
https://{hostname}.local/webrepl
```

Where `{hostname}` is your device's mDNS hostname, typically:
- `pydirect-XXXX` (XXXX = last 4 chars of MAC address)
- Custom hostname if you changed it

### Alternative URLs

You can also use:
- **IP address**: `https://192.168.1.100/webrepl`
- **Custom hostname**: `https://mydevice.local/webrepl`

## Connecting

1. Enter your **Device URL**
2. Enter your **Password**
3. Click **CONNECT** or press Enter

The connection sequence:
1. Establishes HTTPS connection
2. Upgrades to WebSocket
3. Authenticates with password (challenge-response)
4. Negotiates WebRTC if available
5. Shows connected status in sidebar and status bar

## Connection Status

When connected:
- **Green indicator** in status bar
- Device info appears (RAM, TEMP, UPTIME, RSSI)
- File Manager shows device files
- Terminal becomes interactive

## First-Time Connection

On first connection to a new device:

1. **Certificate warning** - Browser shows security warning
   - Click **Advanced** → **Proceed to [hostname]**
   - The device uses a self-signed certificate

2. **Password prompt** - Enter the password you set during provisioning

## Connection Methods

ScriptO Studio uses two transport methods:

| Method | When Used | Characteristics |
|--------|-----------|-----------------|
| **WebRTC** | Same local network | Fast, low latency, P2P |
| **WebSocket** | Fallback | More reliable, higher latency |

The connection automatically negotiates the best method.

## Quick Tips

### Remember Your Password
The password is stored on the device during initial provisioning. If you forget it:
- Connect via USB serial
- Check or reset in `/settings/wifi.json`

### Use .local Hostnames
Using `hostname.local` (mDNS) means you don't need to track IP addresses. The hostname is shown during provisioning.

### Bookmark Your Device
Save the Device URL in your browser bookmarks for quick access.

## Troubleshooting

**"Connection refused"**
- Device not powered or on different network
- Try pinging the IP address

**"Certificate error"**
- Accept the self-signed certificate
- Clear browser HSTS settings if stuck

**"Authentication failed"**
- Wrong password
- Password is case-sensitive

**"WebRTC failed"**
- Falls back to WebSocket automatically
- Check if devices are on same subnet

See [Troubleshooting Connection](../troubleshooting/connection.md) for more help.

## Related

- [Getting Started](../getting-started/index.md) - Initial setup
- [Network Setup](../device-setup/network-setup.md) - WiFi configuration
- [Troubleshooting Connection](../troubleshooting/connection.md) - Connection issues
