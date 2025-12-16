# Board Configurations

Board definition files for MicroPython boards running ScriptoStudio firmware.

## Structure

Each board configuration file contains:

```json
{
  "board_id": "board_identifier",
  "board_name": "Human Readable Name",
  "chip": "ESP32-P4",
  "version": "1.0",
  "description": "Board description",
  
  "hardware": {
    "peripheral_name": {
      "type": "HardwareType",
      "pin": 48,              // For single-pin hardware
      "pins": {               // For multi-pin hardware
        "signal1": 10,
        "signal2": 11
      },
      "description": "What this hardware does"
    }
  }
}
```

## Common Hardware Types

### Single-Pin Hardware

```json
"status_led": {
  "type": "neopixel",
  "pin": 48,
  "description": "Onboard status LED"
}
```

### Multi-Pin Hardware

```json
"ethernet": {
  "type": "IP101",
  "phy_addr": 1,
  "pins": {
    "mdc": 31,
    "mdio": 52,
    "reset": 51
  },
  "description": "Ethernet PHY"
}
```

### Communication Buses

```json
"i2c0": {
  "pins": {
    "sda": 8,
    "scl": 9
  },
  "description": "Primary I2C bus"
},
"can": {
  "pins": {
    "tx": 20,
    "rx": 21,
    "standby": 22
  },
  "description": "CAN bus"
}

```

## Usage

Board configs are:
1. Stored in the registry (GitHub)
2. Fetched by ScriptoStudio on first connect
3. Uploaded to device at `/lib/boards/config.json`
4. Loaded by device-side `hw_config` module

## Adding New Boards

1. Create `your_board_id.json` in this directory
2. Follow the structure above
3. Push to GitHub - the workflow will include it in `index.json`
4. ScriptoStudio will auto-detect and fetch it for matching boards
