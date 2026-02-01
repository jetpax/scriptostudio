# Provisioning

Generate HTTPS certificates and configure device security.

## What is Provisioning?

Provisioning (also called "blessing") generates:

- A unique **self-signed HTTPS certificate** for secure connections
- Enables the device's **web interface** at `https://pydirect-xxxx.local`

## When to Re-provision

Use **Re-provision Device** when:

- Setting up a new device after flashing firmware and configuring WiFi
- Renewing expired certificates
- After changing the device hostname
- Troubleshooting connection issues
- You want a fresh start with new credentials

## Provisioning Steps

1. Connect device via USB in ScriptO Studio
2. Click **Connect Device** and wait for detection
3. Select **Re-provision Device** from the scenarios
4. The IDE generates a new certificate and installs it
5. Device resets and connects to WiFi
6. A modal explains you'll see a security warning
7. Click **Connect to [hostname]** to open the device
8. **Accept the browser security warning** (Advanced → Proceed)
9. Set your device password on the web interface

> [!TIP]
> The security warning is expected! It appears because the certificate 
> is self-signed. You only need to accept it once per browser.

## The Security Warning Modal

After provisioning completes, a styled modal appears explaining:

- Device is restarting and connecting to WiFi (~10 seconds)
- You'll see a browser security warning - this is expected
- Click **"Advanced"** → **"Proceed"** to trust the certificate

Click the **Connect** button to open your device's web interface in a new tab.

## Two-Step Onboarding Flow

The onboarding flow is now two separate steps:

| Step | Scenario | Purpose |
|------|----------|---------|
| 1 | **Change WiFi** | Configure network settings only |
| 2 | **Re-provision** | Generate certificates and enable HTTPS |

This separation allows you to:

- ✅ Update WiFi without regenerating certificates
- ✅ Re-provision without reconfiguring WiFi
- ✅ Choose when to generate new certificates

## Troubleshooting

### Device doesn't appear after reset?

- Wait 10-15 seconds for WiFi connection
- Try accessing device via IP address if `.local` doesn't resolve
- Check your router's connected devices list

### Certificate warning keeps appearing?

- Make sure you clicked "Proceed" to trust the certificate
- Try clearing browser cache for the device hostname
- Re-provision to generate a fresh certificate

### Can't access device after provisioning?

- Verify device is on the same network as your computer
- Check that WiFi was configured before provisioning
- Try the device's IP address instead of hostname

## Related

- [Network Setup](network-setup.md) - Configure WiFi settings
- [Flashing Firmware](flashing-firmware.md) - Install pyDirect firmware
- [Connection Guide](../getting-started/connection.md) - Connect to your device
