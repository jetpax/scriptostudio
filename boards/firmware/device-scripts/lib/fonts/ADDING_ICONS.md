# Adding Tabler Icons to LVGL (ePaper)

This documents how to add custom [Tabler Icons](https://tabler.io/icons) to the LVGL ePaper display as a binary font.

## Prerequisites

- `npx` (Node.js)
- `fonttools` (Python — use a venv)

## Overview

LVGL can load binary fonts at runtime via `lv.binfont_create()`. The pipeline:

1. Download the Tabler Icons TTF webfont
2. **Strip the GSUB/GPOS tables** — the font has a Coverage format that crashes `lv_font_conv`
3. Run `lv_font_conv` to generate a `.bin` file with only the glyphs you need
4. Upload the `.bin` to the device at `/lib/fonts/`
5. Load in LVGL with the filesystem driver bridge

## Step-by-step

### 1. Download the TTF

```bash
curl -sL -o tabler-icons.ttf \
  "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/fonts/tabler-icons.ttf"
```

### 2. Look up codepoints

Download the CSS and grep for the icon names you need:

```bash
curl -sL "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.css" \
  | grep -A1 '\.ti-YOUR_ICON_NAME:before' | grep content
```

This gives you the Unicode codepoint, e.g. `content: "\ea6d"` → `0xea6d`.

Browse all icons at https://tabler.io/icons

### 3. Strip GSUB table (required!)

The Tabler Icons TTF has a GSUB Coverage format that `lv_font_conv` cannot parse. You **must** strip it first:

```bash
python3 -m venv .venv && .venv/bin/pip install fonttools
.venv/bin/python3 -c "
from fontTools.ttLib import TTFont
font = TTFont('tabler-icons.ttf')
for t in ['GSUB', 'GPOS']:
    if t in font: del font[t]
font.save('tabler-clean.ttf')
"
```

### 4. Generate LVGL binary font

```bash
npx -y lv_font_conv \
  --font tabler-clean.ttf \
  -r 0xea6d,0xea52,0xeb05 \
  --size 48 \
  --format bin \
  --bpp 1 \
  --no-compress \
  -o tabler48.bin
```

**Key flags:**
- `-r` — comma-separated list of codepoints (use `-r`, NOT `--symbols`)
- `--bpp 1` — 1-bit per pixel (monochrome, matches I1 color format)
- `--no-compress` — required for `binfont_create` compatibility

### 5. Use in MicroPython LVGL

```python
import lvgl as lv
import fs_driver

# Register LVGL filesystem driver (once)
fs_drv = lv.fs_drv_t()
fs_driver.fs_register(fs_drv, 'A')

# Load font
tabler48 = lv.binfont_create("A:/lib/fonts/tabler48.bin")

# Use in a label
icon = lv.label(parent)
icon.set_text("\uea6d")  # clipboard-list
icon.set_style_text_font(tabler48, 0)
```

## Currently included icons

### tabler36.bin (status bar, 36px)

| Icon | Name | Codepoint | Python |
|------|------|-----------|--------|
| 📋 | clipboard-list | `EA6D` | `"\uea6d"` |
| 📅 | calendar-event | `EA52` | `"\uea52"` |
| 📞 | phone-call | `EB05` | `"\ueb05"` |
| 📧 | mail-opened | `EAE4` | `"\ueae4"` |
| ⚙️ | adjustments-alt | `EC37` | `"\uec37"` |
| 🤖 | robot | `F00B` | `"\uf00b"` |
| 📶 | wifi | `EB52` | `"\ueb52"` |
| 📡 | antenna-bars-5 | `ECCB` | `"\ueccb"` |
| 🔋 | battery (empty) | `EA34` | `"\uea34"` |
| 🔋 | battery-1 (25%) | `EA2F` | `"\uea2f"` |
| 🔋 | battery-2 (50%) | `EA30` | `"\uea30"` |
| 🔋 | battery-3 (75%) | `EA31` | `"\uea31"` |
| 🔋 | battery-4 (100%) | `EA32` | `"\uea32"` |
| ⚡ | battery-charging | `EA33` | `"\uea33"` |
| ❌ | battery-off | `ED1C` | `"\ued1c"` |

### tabler48.bin (nav bar, 48px)

Same glyphs as above, at 48px.

## Adding new icons

1. Find the icon name at https://tabler.io/icons
2. Look up its codepoint (step 2 above)
3. Add the codepoint to the `-r` list
4. Re-run `lv_font_conv` for each size you need
5. Upload the new `.bin` files to the device
