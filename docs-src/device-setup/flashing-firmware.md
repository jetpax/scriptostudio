# Flashing Firmware

Install pyDirect enabled firmware on your ESP32 device.

## Supported Hardware

| Board | Chip | Flash | PSRAM | Status |
|-------|------|-------|-------|--------|
| ESP32-S3-DevKitC-1 | ESP32-S3 | 16MB | 8MB | ✅ Recommended |
| ESP32-S3-WROOM-1 | ESP32-S3 | 8MB+ | 2MB+ | ✅ Supported |
| LilyGO T-Display-S3 | ESP32-S3 | 16MB | 8MB | ✅ Supported |
| Generic ESP32-S3 | ESP32-S3 | 4MB+ | Optional | ⚠️ Limited |

> [!IMPORTANT]
> ESP32-S3 with SPIRAM (PSRAM) is strongly recommended for reliable operation.

## Flashing via ScriptO Studio

1. Go to [scriptostudio.com](https://scriptostudio.com)
2. Click **Onboard New Device** from the home screen
3. Connect your device via USB and click **Connect Device**
4. Select **New Device** when the chip is detected
5. Firmware is automatically selected for your chip and flashed

> [!NOTE]
> Requires Chrome or Edge browser with WebSerial support.

## After Flashing

1. Device will reboot and create AP: `pybot-XXXX`
2. Connect to the AP network
3. Open ScriptO Studio at `http://192.168.4.1`
4. Configure WiFi in Settings
5. Device will reboot and connect to your network

## Troubleshooting

### "Failed to connect to ESP32-S3"

- Check USB cable supports data (not charge-only)
- Try a different USB port
- Install USB drivers (CP210x or CH340 depending on board)
- Put device in boot mode manually

### "A fatal error occurred: MD5 of file does not match"

- Download firmware again (file may be corrupted)
- Use a slower baud rate: `--baud 115200`

### Device doesn't boot after flash

- Verify correct firmware for your board
- Try erasing flash first
- Check PSRAM configuration matches your hardware

## Related

- [Board Configurations](../device-setup/board-configurations.md)
- [Network Setup](../device-setup/network-setup.md)
- [Provisioning](../device-setup/provisioning.md)
