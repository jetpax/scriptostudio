# Display drivers

The board manifest names a display, and `lib/sys/display/display_manager.py` picks the driver from it.

## Supported displays

| Interface | Driver | Display | Resolution | IC |
|-----------|--------|---------|------------|------|
| QSPI | `spd2010.py` | Round LCD | 412×412 | SPD2010 |
| QSPI | `co5300.py` | AMOLED | 466×466 and 280×456, by board | CO5300 |
| SPI | `st77xx.py` | Rectangular LCD | 240×320, and other sizes by board | ST7789 |
| EPD | `epd_3in97.py`, `epd_3in97_lvgl.py` | 3.97" e-paper | 800×480 | SSD1677 |

The manifest's `devices.display.interface` chooses the path: `qspi`, `spi` or `epd`. For QSPI, the `driver` field chooses between `spd2010` (the default) and `co5300`.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  display_manager.py                 │
│   init_display() reads the board manifest, then     │
│   qspi -> spd2010 or co5300                         │
│   spi  -> st77xx                                    │
│   epd  -> epd_3in97_lvgl                            │
├────────────┬───────────┬───────────┬────────────────┤
│ spd2010.py │ co5300.py │ st77xx.py │ epd_3in97.py   │
│            │           │           │ epd_3in97_lvgl │
├────────────┴───────────┼───────────┼────────────────┤
│ qspi_lcd.Bus (C module)│machine.SPI│  machine.SPI   │
├────────────────────────┴───────────┴────────────────┤
│                 ESP-IDF SPI driver                  │
└─────────────────────────────────────────────────────┘
```

## Boot Sequence

`boot.py` calls `init_display()` on boards with a QSPI or SPI display. On a board with an e-paper display, `boot.py` calls `lib.calmos.init()` instead, and that calls `init_display()`. For a QSPI or SPI display, `init_display()`:

1. Reads the manifest with `board.device("display")` to get the interface.
2. Resets the panel through the I2C GPIO expander, if it's wired that way (QSPI).
3. Creates the QSPI or SPI bus with the manifest's pins.
4. Runs the driver's register init sequence.
5. Clears the screen to black before turning the display on, to avoid a flash.
6. Draws the 128×128 boot logo from `splash.bin` in the centre.
7. Turns the display on and sets the brightness.

For e-paper, `init_display()` powers the panel through the AXP2101, creates the SPI bus, and initializes the EPD and its LVGL backend.

```python
from lib.sys.display.display_manager import init_display
lcd = init_display(brightness=80)
```

`init_display()` returns the existing instance if it has already run. `get_display()` returns it later, or `None` before init.

## QSPI Command Encoding

The SPD2010 and CO5300 use a 32-bit QSPI command format. Due to ESP-IDF's byte reversal
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

- **Bounce buffer**: pre-allocated in internal SRAM by the `qspi_lcd` C module (`BOUNCE_BUF_SIZE`). It sets the largest single DMA transfer.
- **Draw buffer factor**: `factor=32` splits the screen into chunks that fit in the bounce buffer. On a 412×412 panel a chunk is `412 × (412/32) × 2`, about 11 KB.
- **Double buffering**: off, to save PSRAM.

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

## File layout

```
lib/sys/display/
├── display_manager.py   # Init from the manifest, splash, singleton
├── spd2010.py           # SPD2010 QSPI LCD driver
├── co5300.py            # CO5300 QSPI AMOLED driver
├── st77xx.py            # ST7789 SPI LCD driver
├── epd_3in97.py         # 3.97" e-paper driver (SSD1677)
├── epd_3in97_lvgl.py    # LVGL backend for the e-paper display
├── lv_utils.py          # LVGL event loop helper
└── splash.bin           # 128×128 RGB565 boot logo
```
