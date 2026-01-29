# Flashing Firmware

Install pyDirect firmware on your ESP32-S3 device.

## Supported Hardware

| Board | Chip | Flash | PSRAM | Status |
|-------|------|-------|-------|--------|
| ESP32-S3-DevKitC-1 | ESP32-S3 | 16MB | 8MB | ✅ Recommended |
| ESP32-S3-WROOM-1 | ESP32-S3 | 8MB+ | 2MB+ | ✅ Supported |
| LilyGO T-Display-S3 | ESP32-S3 | 16MB | 8MB | ✅ Supported |
| Generic ESP32-S3 | ESP32-S3 | 4MB+ | Optional | ⚠️ Limited |

> [!IMPORTANT]
> ESP32-S3 with SPIRAM (PSRAM) is strongly recommended for reliable operation.

## Method 1: Web Installer (Easiest)

1. Visit [pydirect.com/flash](https://pydirect.com/flash)
2. Connect your device via USB
3. Click **Connect** and select the serial port
4. Choose your board type
5. Click **Flash**

> [!NOTE]
> Requires Chrome or Edge browser with WebSerial support.

## Method 2: esptool.py

### Prerequisites

```bash
pip install esptool
```

### Download Firmware

Get the latest firmware from [Releases](https://github.com/jetpax/pyDirect/releases):

- `pydirect-esp32s3-vX.X.X.bin` - Combined binary

### Flash Commands

**Erase and flash (recommended for first install):**

```bash
# Erase flash
esptool.py --chip esp32s3 --port /dev/ttyUSB0 erase_flash

# Flash firmware
esptool.py --chip esp32s3 --port /dev/ttyUSB0 \
  --baud 921600 \
  write_flash -z 0x0 pydirect-esp32s3-vX.X.X.bin
```

**macOS port:** `/dev/cu.usbserial-*` or `/dev/cu.SLAB_USBtoUART`

**Windows port:** `COM3` (check Device Manager)

### Boot Mode

If device doesn't flash:

1. Hold **BOOT** button
2. Press and release **RESET** button
3. Release **BOOT** button
4. Device is now in flash mode

## Method 3: Build from Source

For developers who want to customize the firmware.

### Prerequisites

- ESP-IDF v5.5.1
- Python 3.10+
- Git

### Build Steps

```bash
# Clone repository
git clone --recursive https://github.com/jetpax/pyDirect.git
cd pyDirect

# Set up ESP-IDF
source ~/esp/esp-idf-v5.5.1/export.sh

# Configure for your board
cp boards/ESP32_S3_16MB/sdkconfig.board sdkconfig

# Build
make submodules
make mpy-cross
make

# Flash
make deploy PORT=/dev/ttyUSB0
```

See [BUILD_GUIDE.md](https://github.com/jetpax/pyDirect/blob/main/docs/BUILD_GUIDE.md) for detailed instructions.

## After Flashing

1. Device will reboot and create AP: `pyDirect-XXXX`
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
