# Network Setup

Configure WiFi on your pyDirect device.

## Using ScriptO Studio

1. Go to [scriptostudio.com](https://scriptostudio.com) or use the embedded IDE
2. Click **Onboard New Device** from the landing page
3. Connect your device via USB and click **Connect Device**
4. Select **Change WiFi** from the scenarios
5. A modal displays available networks with signal strength
6. Select your network and enter the password
7. Device connects and saves settings
8. You're returned to the scenarios screen

> [!NOTE]
> Changing WiFi only updates network settings. To generate new certificates, 
> use **Re-provision Device** afterward.

## Network Selection Modal

The network selection shows:

- **Network name (SSID)** - The name of the WiFi network
- **Signal strength in dBm** - e.g., -49 dBm is excellent, -70 dBm is fair, -90 dBm is weak
- **Lock icon** - Indicates the network requires a password

## After Changing WiFi

After WiFi is configured, you're returned to the scenarios screen where you can:

- **Disconnect** - If you just needed to update network settings
- **Re-provision Device** - If you need new HTTPS certificates

## Troubleshooting

### Network not appearing?

- Make sure the network is broadcasting its SSID (not hidden)
- Move device closer to the router
- Try rescanning by going back and selecting Change WiFi again

### Connection fails?

- Verify the password is correct
- Check if MAC filtering is enabled on your router
- Ensure you're connecting to a 2.4 GHz network (ESP32 doesn't support 5 GHz)

### Wrong network saved?

Simply run **Change WiFi** again to select a different network.

## Related

- [Provisioning](provisioning.md) - Generate HTTPS certificates
- [Flashing Firmware](flashing-firmware.md) - Install pyDirect firmware
- [Troubleshooting Connection](../troubleshooting/connection.md) - Connection issues
