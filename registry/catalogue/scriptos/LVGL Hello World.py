

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,

    info    = dict(
        name        = 'LVGL Hello World',
        version     = [1, 0, 0],
        category    = 'Display',
        description = '''Display "Hello World" in large red text using LVGL widgets.\
                         Display must be initialized at boot (display_manager).\
                         Do NOT reinitialize SPI or the display driver.''',
        author      = 'jetpax',
        www         = 'https://lvgl.io'
    ),

    args    = dict(
        text       = dict( label    = 'Text to display:',
                           type     = str,
                           value    = 'Hello World' ),
        color      = dict( label    = 'Text color (hex):',
                           type     = str,
                           value    = '0xFF0000' ),
    )

)

# === END_CONFIG_PARAMETERS ===

import lvgl as lv

# --- Widget-only pattern: display is already initialized at boot ---
# Do NOT create SPI, St7789, or call init_display() here.
# Just create LVGL widgets and load the screen.

# Parse color
try:
    color_val = int(args.color, 16) if isinstance(args.color, str) else int(args.color)
except:
    color_val = 0xFF0000  # default red

# Create new screen
scr = lv.obj()
scr.set_style_bg_color(lv.color_hex(0x000000), 0)  # Black background

# Title label
label = lv.label(scr)
label.set_text(args.text)
label.set_style_text_color(lv.color_hex(color_val), 0)
label.set_style_text_font(lv.font_montserrat_14, 0)
label.align(lv.ALIGN.CENTER, 0, 0)

# Load screen
lv.screen_load(scr)

print(f"✅ Display showing: '{args.text}'")
