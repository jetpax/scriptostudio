

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,

    info    = dict(
        name        = 'LVGL Smoke Test',
        version     = [1, 0, 0],
        category    = 'Display',
        description = '''Verifies LVGL v9.x graphics library is working with ST7789 display.\
                         Reads SPI pins and backlight from board manifest. Shows a simple UI with labels and a button.\
                         Requires: st77xx.py and lv_utils.py on device (from lv_binding_micropython).\
                         IMPORTANT: Hard reset device before running (LVGL C state does not survive soft resets cleanly).''',
        author      = 'jetpax',
        www         = 'https://lvgl.io'
    ),

    args    = dict(
        brightness     = dict( label    = 'Backlight brightness (0-100):',
                               type     = int,
                               value    = 80 ),
    )

)

# === END_CONFIG_PARAMETERS ===

import machine
import time
import gc

# --- Board manifest config ---
try:
    from lib.sys import board
    USE_BOARD = True
except:
    USE_BOARD = False

if USE_BOARD and board.has("display"):
    print("✅ Using board manifest")
    spi_cfg = board.spi("lcd")
    disp = board.device("display")
    
    sck_pin  = spi_cfg.sck
    mosi_pin = spi_cfg.mosi
    dc_pin   = spi_cfg.dc
    cs_pin   = spi_cfg.cs
    rst_pin  = spi_cfg.rst
    
    # Backlight from manifest
    bl_pin = None
    try:
        bl_pin = disp.backlight['pin']
    except (AttributeError, KeyError, TypeError):
        bl_pin = board._res.get("gpio", {}).get("bl_pwm")
    
    disp_w = disp.width
    disp_h = disp.height
    print(f"  Display: {disp.type} {disp_w}x{disp_h}")
    print(f"  SPI: SCK={sck_pin}, MOSI={mosi_pin}")
    print(f"  Pins: DC={dc_pin}, CS={cs_pin}, RST={rst_pin}, BL={bl_pin}")
else:
    print("⚠️  No board manifest, using 1.69\" defaults")
    sck_pin, mosi_pin = 6, 7
    dc_pin, cs_pin, rst_pin = 4, 5, 8
    bl_pin = 15
    disp_w, disp_h = 240, 280

# --- LVGL import ---
print()
print("📦 Importing LVGL...")
import lvgl as lv
print(f"✅ LVGL v{lv.version_major()}.{lv.version_minor()}.{lv.version_patch()}")

# --- SPI & Display driver ---
print("🔧 Setting up SPI...")
spi = machine.SPI(
    1,
    baudrate=40_000_000,
    polarity=0,
    phase=0,
    sck=machine.Pin(sck_pin, machine.Pin.OUT),
    mosi=machine.Pin(mosi_pin, machine.Pin.OUT),
)

print("🖥️  Initializing ST7789 LVGL driver...")
gc.collect()
from lib.sys.display.st77xx import St7789

# ST7789 controller is always 240x320 internally
# The driver handles offset mapping via MADCTL rotation tables
lcd = St7789(
    rot=0,
    res=(240, 320),
    spi=spi,
    cs=cs_pin,
    dc=dc_pin,
    rst=rst_pin,
    bl=bl_pin,
    doublebuffer=False,
    factor=16,
)

# Set backlight
lcd.set_backlight(args.brightness)
print(f"✅ Display ready ({lcd.width}x{lcd.height})")

# --- Build LVGL UI ---
print()
print("🎨 Building LVGL UI...")

scr = lv.obj()
scr.set_style_bg_color(lv.color_hex(0x1a1a2e), 0)

# Title label
title = lv.label(scr)
title.set_text("pyBot LVGL")
title.set_style_text_color(lv.color_hex(0x00d4ff), 0)
title.set_style_text_font(lv.font_montserrat_14, 0)
title.align(lv.ALIGN.TOP_MID, 0, 20)

# Version label
ver = lv.label(scr)
ver.set_text(f"v{lv.version_major()}.{lv.version_minor()}.{lv.version_patch()}")
ver.set_style_text_color(lv.color_hex(0x888888), 0)
ver.align_to(title, lv.ALIGN.OUT_BOTTOM_MID, 0, 5)

# Status label
status = lv.label(scr)
status.set_text("Ready")
status.set_style_text_color(lv.color_hex(0x00ff88), 0)
status.align(lv.ALIGN.CENTER, 0, -10)

# Button (visual only — no touch driver for input)
btn = lv.button(scr)
btn.set_size(140, 45)
btn.align(lv.ALIGN.CENTER, 0, 40)
btn.set_style_bg_color(lv.color_hex(0x0066cc), 0)
btn.set_style_radius(10, 0)

btn_lbl = lv.label(btn)
btn_lbl.set_text("LVGL OK!")
btn_lbl.center()

# Info bar at bottom
if USE_BOARD:
    info = lv.label(scr)
    info.set_text(f"{board.id.id} | {board.id.chip}")
    info.set_style_text_color(lv.color_hex(0x555555), 0)
    info.align(lv.ALIGN.BOTTOM_MID, 0, -10)

# Load screen
lv.screen_load(scr)
print("✅ LVGL UI loaded!")
print()
print("🎉 Smoke test passed! LVGL is working.")
