# pyDirect Device Scripts

This directory contains the device-side Python scripts bundled into pyDirect firmware. These scripts are baked into the VFS partition during the build process.

## Compatibility

The firmware is fully compatible with **Scripto Studio** - just connect and start coding!

- **Agent assisted coding**: Use AI to generate code
- **File Upload**: Drag & drop files to the device
- **Debugger**: Set breakpoints and step through code
- **Terminal**: Interactive Python REPL
- **Extension Manager**: Install additional modules


## What's Included

### Core Files
- `boot.py` - Boot configuration
- `main.py` - Server startup and module initialization

### Library Files (`lib/`)
- Helper modules for board, networking, and more

## Board Manifest

Each firmware build includes a board manifest at `/settings/board.json` that describes:
- Board identity (name, chip, vendor)
- Pin assignments (status LED, CAN, SPI, I2C)
- Capabilities (WiFi, BLE, Ethernet, CAN)
- Device configurations

Example usage in MicroPython:
```python
import json
with open('/settings/board.json') as f:
    board = json.load(f)

# Get status LED pin
led_pin = board['resources']['pins']['status_led']
```

## Customization

Edit `main.py` to customize:
- HTTP/HTTPS ports
- WebREPL password
- Certificate paths
- Module initialization

## Building

The device-scripts are automatically included when building firmware:

```bash
BOARD=ESP32_S3 MANIFEST=generic_esp32s3 ./build.sh
```

The build process:
1. Compiles MicroPython firmware
2. Creates VFS partition from `device-scripts/`
3. Copies board manifest to `settings/board.json`
4. Merges everything into a single flashable binary

