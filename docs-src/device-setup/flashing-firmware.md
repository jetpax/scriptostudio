# Flashing Firmware

Put ScriptO Studio's firmware on a board over USB. You do this from **Set up a new board** on Home, which opens **System > Firmware**.

## Supported chips

The Firmware panel flashes boards with an ESP32-S3 or an ESP32-P4. It reads the chip, the flash size and, on the S3, the in-package PSRAM, then picks the build for you:

| Chip | Builds |
|------|--------|
| ESP32-S3 | `ESP32_S3_8` (quad PSRAM), `ESP32_S3_8_OCT` (octal PSRAM), `ESP32_S3_16`, `ESP32_S3_32` |
| ESP32-P4 | `ESP32_P4_16`, `ESP32_P4_32` |

The 16 MB and 32 MB S3 builds need octal PSRAM. A quad PSRAM part gets `ESP32_S3_8`, even on larger flash.

After you pick the build, a **Board Configuration** menu lists the board manifests for your chip, with the generic board for that chip selected. Choose your board if it's listed. These are the boards offered:

| Chip | Boards |
|------|--------|
| ESP32-S3 | Generic ESP32-S3, RetroVMS Mini, Seeed XIAO ESP32-S3, Waveshare ESP32-S3 Touch LCD 1.46, Touch LCD 1.69, LCD 1.47, ESP32-S3-RLCD-4.2, ePaper 3.97, Touch AMOLED 1.64, 1.75 and 1.75C |
| ESP32-P4 | Generic ESP32-P4, Scripto P4+C6, Waveshare ESP32-P4-WIFI6, ESP32-P4-WIFI6-POE-ETH |

See [Board Configurations](board-configurations.md) for what a manifest holds.

## Flash a board

You need Chrome or Edge, which provide Web Serial.

1. On Home, click **Set up a new board**. This opens **System > Firmware**.
2. Plug the board in over USB and click **Connect Device**. Pick the port in the browser's chooser.
3. Studio shows the chip, MAC address and flash size under **Device Information**, then offers four options:
    - **Flash Device**: flash fresh firmware onto a blank ESP32.
    - **Forgot Credentials**: see the saved hostname and WiFi network. See [Provisioning](provisioning.md).
    - **Change WiFi**: update network settings on a board that's already set up. See [Network Setup](network-setup.md).
    - **Re-provision**: fresh start with new certificates. See [Provisioning](provisioning.md).
4. Click **Flash Device**. Check the firmware and board shown, then click **Flash Firmware** and confirm. The flash erases everything on the board.
5. When **Flash Complete** appears, click **Configure WiFi**. Pick your network and enter its password.

Studio then generates a certificate and restarts the board into setup mode. The rest is in [Provisioning](provisioning.md).

## Troubleshooting

**The board doesn't connect**

- Use a USB cable that carries data, not a charge-only cable.
- Try another USB port.

**The board doesn't boot after a flash**

- Check that you picked the right build and board.
- Flash again. The flash erases the board first.
- Check that the PSRAM type matches the build.

## Related

- [Provisioning](provisioning.md)
- [Network Setup](network-setup.md)
- [Board Configurations](board-configurations.md)
