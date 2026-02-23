# Display Drivers

ScriptO Studio supports two display interfaces, configured in the board manifest.

## Supported Displays

| Interface | Driver | Display | Resolution | IC |
|-----------|--------|---------|------------|------|
| QSPI | `spd2010.py` | Round AMOLED | 412×412 | SPD2010 |
| SPI | `st77xx.py` | Rectangular LCD | 240×320 | ST7789 |

## Architecture

```
┌────────────────────────────────────────────┐
│           display_manager.py               │
│   init_display() → reads board manifest    │
│   Dispatches: QSPI → spd2010, SPI → st77xx │
├────────────────┬───────────────────────────┤
│  spd2010.py    │       st77xx.py           │
│  (QSPI AMOLED) │       (SPI LCD)           │
│  Spd2010_hw    │                           │
│  Spd2010_lvgl  │                           │
├────────────────┼───────────────────────────┤
│  qspi_lcd.Bus  │     machine.SPI           │
│  (C module)    │     (MicroPython)         │
├────────────────┴───────────────────────────┤
│            ESP-IDF SPI Driver              │
│         (DMA, bounce buffering)            │
└────────────────────────────────────────────┘
```

## Boot Sequence

`display_manager.init_display()` is called at boot from `boot.py`:

1. **Read manifest** — `board.device("display")` determines interface type
2. **Hardware reset** — Toggle LCD RST via I2C GPIO expander (if wired)
3. **Create bus** — Initialize QSPI or SPI bus with correct pinout
4. **Init driver** — Run the full register init sequence (~600 writes)
5. **Clear to black** — Fill framebuffer before DISPON to prevent flash
6. **Blit splash** — Center 128×128 boot logo from `splash.bin`
7. **DISPON** — Turn on the AMOLED/LCD panel
8. **Backlight on** — Ramp up brightness

```python
# boot.py
from lib.sys.display.display_manager import init_display
lcd = init_display(brightness=80)
```

## QSPI Command Encoding

The SPD2010 uses a 32-bit QSPI command format. Due to ESP-IDF's byte reversal
in the SPI peripheral, commands must be pre-encoded:

```python
# On wire: PREFIX, 0x00, CMD, 0x00
# Encoding: (cmd << 8) | (prefix << 24)
def _qspi_cmd(cmd):
    return (cmd << 8) | (0x02 << 24)    # 0x02 = write command

def _qspi_color_cmd(cmd):
    return (cmd << 8) | (0x32 << 24)    # 0x32 = write color data
```

## DMA and Buffer Sizing

For QSPI displays with PSRAM-backed LVGL draw buffers:

- **Bounce buffer**: 12KB pre-allocated in internal SRAM (`modqspi_lcd.c`)
- **Draw buffer factor**: `factor=32` → chunks of ~11KB (fits in 12KB bounce)
- **Double buffering**: Disabled by default to conserve PSRAM

| Setting | Value | Effect |
|---------|-------|--------|
| `BOUNCE_BUF_SIZE` | 12KB | Max single DMA transfer |
| `factor` | 32 | `412 × (412/32) × 2 ≈ 11KB` per flush chunk |

## Custom Fonts (TinyTTF)

The build enables [TinyTTF](https://docs.lvgl.io/master/details/libs/tiny_ttf.html)
for runtime `.ttf` font loading:

```python
import lvgl as lv
import fs_driver

# Register MicroPython FS bridge (once)
fs_drv = lv.fs_drv_t()
fs_driver.fs_register(fs_drv, 'S')

# Load any TTF at any size
font = lv.tiny_ttf_create_file('S:/lib/fonts/MyFont.ttf', 48)
label.set_style_text_font(font, 0)
```

Built-in Montserrat sizes: 14, 16, 20, 24, 28, 32, 36, 48.

## Using from Scripts

LVGL scripts should **not** reinitialize the display. Use the boot-initialized
driver and just create widgets:

```python
import lvgl as lv

scr = lv.obj()
scr.set_style_bg_color(lv.color_hex(0x000000), 0)

label = lv.label(scr)
label.set_text("Hello World")
label.set_style_text_color(lv.color_hex(0xFFFFFF), 0)
label.set_style_text_font(lv.font_montserrat_36, 0)
label.align(lv.ALIGN.CENTER, 0, 0)

lv.screen_load(scr)
```

## File Layout

```
lib/sys/display/
├── display_manager.py   # Boot init + splash + singleton
├── spd2010.py           # SPD2010 QSPI AMOLED driver
├── st77xx.py            # ST7789 SPI LCD driver
├── lv_utils.py          # LVGL event loop helper
├── splash.bin           # 128×128 RGB565 boot logo
└── fs_driver.py         # LVGL ↔ MicroPython filesystem bridge
```
