# Board Configurations

A **board configuration** (or "board manifest") is a JSON file that describes
the hardware of a specific ESP32 board — its display, pin assignments, buses,
sensors, and capabilities. The firmware uses this to set up peripherals
without hardcoded board-specific code, so the same firmware binary can drive
many different boards.

The IDE downloads the manifest for the board you pick during setup and writes
it to `/settings/board.json` on the device. Python code then reads it via
`lib.sys.board`:

```python
from lib.sys import board

if board.has("display"):
    disp = board.device("display")
    print(disp.width, disp.height, disp.interface)

led_pin = board.pin("status_led")
uart_cfg = board.uart("primary")
```

## When do I need a custom configuration?

Use an existing board config when:

- Your board is in the list shown during **Device Setup** — just pick it.

Create a custom config when:

- You have a board that isn't listed (custom PCB, an unsupported dev board,
  a variant with different wiring).
- You need to override pin assignments, bus frequencies, or device drivers
  for an existing board.

## Where configs live

All board manifests are JSON files in the repository at:

```
boards/manifests/
├── index.json                          # master list (required)
├── generic_esp32s3.json
├── waveshare_s3_lcd_1.47.json
├── waveshare_s3_amoled_1in75.json
└── ...
```

The `index.json` file is the registry the IDE reads to populate the board
dropdown. Every manifest file must have a matching entry in `index.json`.

## Adding a custom board — step by step

We'll walk through adding a fictional **"Acme ESP32-S3 Widget Board"** with
an ST7789 SPI display and a NeoPixel status LED.

### 1. Create the manifest file

Create `boards/manifests/acme_widget_s3.json`. The easiest approach is to
copy the closest existing board as a starting point. The **Waveshare ESP32-S3
LCD 1.47** ([`waveshare_s3_lcd_1.47.json`](https://github.com/jetpax/scriptostudio/blob/main/boards/manifests/waveshare_s3_lcd_1.47.json))
is a good template for an S3 + ST7789 SPI LCD board:

```json
{
  "identity": {
    "id": "acme_widget_s3",
    "name": "Acme ESP32-S3 Widget",
    "vendor": "acme",
    "chip": "ESP32-S3",
    "revision": "1.0.0",
    "description": "Acme Widget dev board with 1.3\" ST7789 SPI LCD and NeoPixel"
  },

  "network": {
    "mdns_enabled": true,
    "ap_password": null,
    "default_services": ["http", "webrepl"]
  },

  "capabilities": {
    "wifi": true,
    "bluetooth": true,
    "neopixel": true,
    "status_led": true,
    "usb_otg": false,
    "display": true,
    "touch": false,
    "sdcard": false
  },

  "resources": {
    "pins": {
      "status_led": 48,
      "boot": 0
    },

    "spi": {
      "lcd": {
        "sck": 12,
        "mosi": 11,
        "dc": 4,
        "cs": 10,
        "rst": 9
      }
    },

    "uart": {
      "primary": { "tx": 43, "rx": 44 }
    },

    "gpio": {
      "bl_pwm": 5
    }
  },

  "devices": {
    "display": {
      "type": "ST7789",
      "driver": "st7789",
      "bus": "spi.lcd",
      "interface": "spi",
      "width": 240,
      "height": 240,
      "offset_x": 0,
      "offset_y": 0,
      "color_bits": 16,
      "backlight": {
        "pin": 5,
        "active_high": true,
        "pwm_capable": true
      },
      "description": "1.3\" 240x240 IPS LCD"
    },

    "status_led": {
      "type": "neopixel",
      "pin": 48,
      "pixel_order": "GRB",
      "description": "Onboard NeoPixel on GPIO48"
    }
  },

  "memory": {
    "flash_size": "8MB",
    "psram_size": "2MB",
    "psram_mode": "quad"
  }
}
```

### 2. Register it in `index.json`

Add a short entry to `boards/manifests/index.json`:

```json
{
  "id": "acme_widget_s3",
  "name": "Acme ESP32-S3 Widget",
  "chip": "ESP32-S3",
  "vendor": "acme",
  "description": "Acme Widget dev board with 1.3\" ST7789 SPI LCD and NeoPixel"
}
```

The `id` **must** match the filename (without `.json`) and the `identity.id`
in the manifest itself.

### 3. Deploy the manifest

If you're running your own ScriptO Studio instance, the files only need to
be on the HTTP server that hosts `/boards/manifests/`. For the public
scriptostudio.com deployment, submit a pull request against
[jetpax/scriptostudio](https://github.com/jetpax/scriptostudio).

### 4. Pick it during Device Setup

After deployment (or a local refresh), the new board appears in the
**Board Configuration** dropdown on the firmware panel when a matching chip
is connected. Selecting it causes the IDE to write the manifest to
`/settings/board.json` on the device during provisioning.

## Manifest reference

### Top-level sections

| Section | Required | Purpose |
|---------|----------|---------|
| `identity` | yes | Board name, vendor, chip family |
| `network` | no | mDNS and AP defaults |
| `capabilities` | yes | Feature flags (display, wifi, touch, etc.) |
| `resources` | yes | Pin assignments and bus configurations |
| `devices` | yes | Connected peripherals and their drivers |
| `memory` | no | Flash/PSRAM descriptors (informational) |

### `identity`

```json
"identity": {
  "id": "acme_widget_s3",     // must match filename and index.json id
  "name": "Acme Widget",      // shown in the dropdown
  "vendor": "acme",
  "chip": "ESP32-S3",         // ESP32, ESP32-S3, ESP32-P4
  "revision": "1.0.0",
  "description": "One-line summary shown under the dropdown"
}
```

### `capabilities`

Boolean flags queried by firmware code via `board.has("name")`. Common keys:

| Key | Meaning |
|-----|---------|
| `wifi` | Has WiFi hardware |
| `bluetooth` | Has Bluetooth hardware |
| `ethernet` | Has wired Ethernet PHY |
| `usb_otg` | Has USB-OTG capable port |
| `display` | Has an attached display (see `devices.display`) |
| `touch` | Has touch input |
| `sdcard` | Has SD card slot |
| `neopixel` | Has one or more WS2812-style LEDs |
| `status_led` | Has a dedicated status LED (may be neopixel) |
| `battery` | Has battery input / fuel gauge |
| `imu` | Has accelerometer/gyro |
| `rtc` | Has battery-backed real-time clock |
| `audio` | Has audio I/O (codec, speaker, mic) |
| `gnss` | Has GNSS/GPS receiver |
| `gpio_expander` | Uses an I/O expander for board pins |

You can add custom flags — anything `board.has()` queries will work as long
as the key exists in this dict.

### `resources.pins`

Direct GPIO assignments, addressed by name:

```json
"pins": {
  "status_led": 48,
  "boot": 0,
  "sys_out": 3
}
```

Accessed as `board.pin("status_led")`.

### `resources` — buses

Each bus type is a dict of named bus instances. The instance name is what
firmware code looks up (e.g., `board.spi("lcd")` returns the `lcd` entry
under `spi`).

| Bus type | Fields |
|----------|--------|
| `uart` | `tx`, `rx`, optional `rts`, `cts` |
| `i2c` | `scl`, `sda` |
| `spi` | `sck`, `mosi`, `miso`, `cs`, `dc`, `rst` |
| `qspi` | `sck`, `data0..3`, `cs`, `te` |
| `i2s` | `mclk`, `bck`, `ws`, `din`, `dout` |
| `sdmmc` | `clk`, `cmd`, `d0..3` |
| `can` | `tx`, `rx` |

Example:

```json
"spi": {
  "lcd":      { "sck": 12, "mosi": 11, "miso": 13, "dc": 4, "cs": 10, "rst": 9 },
  "sdcard":   { "sck": 36, "mosi": 35, "miso": 37, "cs":  8 }
}
```

### `devices`

Higher-level peripherals. Each entry names a driver and references the bus
it's connected to. The most important device entries are shown below.

#### `display`

The `interface` field dispatches to the correct init path at boot — it must
be set or the display silently fails to initialize.

```json
"display": {
  "type": "ST7789",            // hardware marking
  "driver": "st7789",          // firmware driver module: st7789, spd2010, co5300, epd
  "bus": "spi.lcd",            // which bus instance from resources.*
  "interface": "spi",          // spi | qspi | epd  — REQUIRED, selects init path
  "width": 240,
  "height": 240,
  "offset_x": 0,               // origin offset in the controller's RAM
  "offset_y": 0,
  "color_bits": 16,
  "rst_pin": 9,                // reset GPIO (QSPI/AMOLED drivers)
  "te_pin": 13,                // tearing-effect sync (QSPI only)
  "backlight": {
    "pin": 5,
    "active_high": true,
    "pwm_capable": true
  },
  "description": "1.3\" 240x240 IPS LCD"
}
```

Driver values currently supported: `st7789` (SPI IPS LCDs), `spd2010` (QSPI
round LCDs with touch), `co5300` (1.75" QSPI AMOLED), `epd` (e-paper).

#### `status_led`

```json
"status_led": {
  "type": "neopixel",
  "pin": 48,
  "pixel_order": "GRB",
  "description": "Onboard RGB NeoPixel"
}
```

For a plain GPIO LED, use `"type": "gpio"` and add `"active_high": true`.

#### I²C devices (IMU, RTC, codec, PMU…)

All follow the same shape. `bus` points to a `resources.i2c.*` entry,
`i2c_address` is required (MicroPython won't probe), and `driver` names the
Python driver module:

```json
"imu": {
  "type": "QMI8658C",
  "driver": "qmi8658",
  "bus": "i2c.i2c0",
  "i2c_address": "0x6B",
  "int1_pin": 21,
  "description": "6-axis accelerometer/gyroscope"
},
"rtc": {
  "type": "PCF85063",
  "driver": "pcf85063",
  "bus": "i2c.i2c0",
  "i2c_address": "0x51",
  "int_pin": 9,
  "description": "Real-time clock"
}
```

#### `sdcard`

```json
"sdcard": {
  "mode": "SDMMC",             // SDMMC or SPI
  "bus": "sdmmc.sdcard",       // or "spi.sdcard"
  "bus_width": 4,              // SDMMC only: 1 or 4
  "description": "microSD (SDMMC 4-bit)"
}
```

### `memory`

Purely informational — the IDE uses this to pick the right firmware variant:

```json
"memory": {
  "flash_size": "16MB",
  "psram_size": "8MB",
  "psram_mode": "octal"       // quad | octal | none
}
```

## Validation tips

- **Pin conflicts** — the firmware doesn't check for conflicts between
  buses and devices; a wrong pin is usually a silent failure. Cross-check
  against the board's schematic.
- **Missing `interface`** — the display init path depends on this field
  being present; without it the boot splash is silently skipped (see
  [`lib/sys/display/display_manager.py`](https://github.com/jetpax/scriptostudio/blob/main/boards/firmware/device-scripts/lib/sys/display/display_manager.py)).
- **Testing locally** — you can drop a manifest straight into
  `/settings/board.json` on the device via WebREPL and reboot to try it
  without committing the file.
- **Boot log** — `boot.py` logs display and peripheral init errors. If
  something isn't working, connect to the REPL and check for
  `Display init skipped: …` or similar messages.

## Related

- [Flashing Firmware](flashing-firmware.md)
- [Provisioning](provisioning.md)
- [Display Drivers](../developer/display-drivers.md)
- [MicroPython Reference](../developer/micropython-reference.md)
