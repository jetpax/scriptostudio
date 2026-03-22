# Cozette Font — Glyph Catalog

Reference for all useful glyphs available in the Cozette bitmap font.
Render with `cozette36` or `cozette48` binfont via `lv.binfont_create()`.

> **Important**: The `.bin` files are generated subsets. If a glyph renders blank,
> add its codepoint to the `lv_font_conv -r` list and regenerate.
> See [ADDING_ICONS.md](./ADDING_ICONS.md) for the pipeline.

---

## Nerd Font Icons (BMP PUA — `F0xx`)

Confirmed working in `calmpilot_ui.py` demo. Rendered via `cozette48`.

| Glyph | Name | Hex | Python |
|-------|------|-----|--------|
|  | check | F00C | `"\uf00c"` |
|  | gear / cog | F013 | `"\uf013"` |
|  | clock | F017 | `"\uf017"` |
|  | home | F015 | `"\uf015"` |
|  | hdd (memory) | F0A0 | `"\uf0a0"` |
|  | globe | F0AC | `"\uf0ac"` |
|  | desktop | F108 | `"\uf108"` |
|  | wifi | F1EB | `"\uf1eb"` |
|  | thermometer | F2C9 | `"\uf2c9"` |
|  | snowflake | F2DC | `"\uf2dc"` |
|  | microchip | F2DB | `"\uf2db"` |
|  | bell | F0F3 | `"\uf0f3"` |
|  | envelope | F0E0 | `"\uf0e0"` |
|  | lock | F023 | `"\uf023"` |
|  | unlock | F09C | `"\uf09c"` |
|  | bolt / lightning | F0E7 | `"\uf0e7"` |
|  | wrench | F0AD | `"\uf0ad"` |
|  | exclamation-triangle | F071 | `"\uf071"` |
|  | info-circle | F05A | `"\uf05a"` |
|  | question-circle | F059 | `"\uf059"` |
|  | times / close | F00D | `"\uf00d"` |
|  | plus | F067 | `"\uf067"` |
|  | minus | F068 | `"\uf068"` |
|  | search | F002 | `"\uf002"` |
|  | user | F007 | `"\uf007"` |
|  | calendar | F073 | `"\uf073"` |
|  | folder | F07B | `"\uf07b"` |
|  | file | F15B | `"\uf15b"` |
|  | download | F019 | `"\uf019"` |
|  | upload | F093 | `"\uf093"` |
|  | refresh / sync | F021 | `"\uf021"` |
|  | power-off | F011 | `"\uf011"` |
|  | play | F04B | `"\uf04b"` |
|  | pause | F04C | `"\uf04c"` |
|  | stop | F04D | `"\uf04d"` |
|  | forward | F04E | `"\uf04e"` |
|  | backward | F04A | `"\uf04a"` |
|  | terminal | F120 | `"\uf120"` |
|  | code | F121 | `"\uf121"` |
|  | database | F1C0 | `"\uf1c0"` |
|  | bluetooth | F293 | `"\uf293"` |
|  | usb | F287 | `"\uf287"` |
|  | plug | F1E6 | `"\uf1e6"` |
|  | battery-full | F240 | `"\uf240"` |
|  | battery-half | F242 | `"\uf242"` |
|  | battery-empty | F244 | `"\uf244"` |
|  | signal | F012 | `"\uf012"` |
|  | map-marker | F041 | `"\uf041"` |
|  | heart | F004 | `"\uf004"` |
|  | star | F005 | `"\uf005"` |
|  | flag | F024 | `"\uf024"` |

---

## Weather Icons

Consolidated from Nerd Font, Misc Symbols, Dingbats, and Emoji planes.
Useful for calendar view weather display.

### Conditions

| Glyph | Condition | Hex | Python | Source |
|-------|-----------|-----|--------|--------|
| ☼ | sunny / clear | 263C | `"\u263c"` | Misc |
| ☁ | cloudy | 2601 | `"\u2601"` | Misc |
| ☂ | rain (umbrella) | 2602 | `"\u2602"` | Misc |
| ☔ | heavy rain | 2614 | `"\u2614"` | Misc |
| ❄ | snow | 2744 | `"\u2744"` | Ding |
| ☃ | snowman (heavy snow) | 2603 | `"\u2603"` | Misc |
| ⛄ | snowman (light snow) | 26C4 | `"\u26c4"` | Misc |
| ⚡ | thunderstorm | 26A1 | `"\u26a1"` | Misc |
|  | cloud (NF) | F0C2 | `"\uf0c2"` | NF |
|  | sun (NF) | F185 | `"\uf185"` | NF |
|  | moon (NF) | F186 | `"\uf186"` | NF |
|  | bolt (NF) | F0E7 | `"\uf0e7"` | NF |
|  | tint / raindrop (NF) | F043 | `"\uf043"` | NF |
|  | snowflake (NF) | F2DC | `"\uf2dc"` | NF |

### Temperature

| Glyph | Level | Hex | Python | Source |
|-------|-------|-----|--------|--------|
|  | thermometer-full | F2C7 | `"\uf2c7"` | NF |
|  | thermometer-¾ | F2C8 | `"\uf2c8"` | NF |
|  | thermometer-½ ✓ | F2C9 | `"\uf2c9"` | NF |
|  | thermometer-¼ | F2CA | `"\uf2ca"` | NF |
|  | thermometer-empty | F2CB | `"\uf2cb"` | NF |
| 🌡 | thermometer (emoji) | 1F321 | `"\U0001f321"` | Emoji |

### Moon Phases

| Glyph | Phase | Hex | Python | Source |
|-------|-------|-----|--------|--------|
| ☽ | first quarter | 263D | `"\u263d"` | Misc |
| ☾ | last quarter | 263E | `"\u263e"` | Misc |
| 🌑 | new moon | 1F311 | `"\U0001f311"` | Emoji |
| 🌕 | full moon | 1F315 | `"\U0001f315"` | Emoji |
| 🌙 | crescent moon | 1F319 | `"\U0001f319"` | Emoji |

### Wind / Misc

| Glyph | Name | Hex | Python | Source |
|-------|------|-----|--------|--------|
|  | flag (wind dir) | F024 | `"\uf024"` | NF |
| ☕ | hot beverage | 2615 | `"\u2615"` | Misc |
| 🌞 | sun w/ face | 1F31E | `"\U0001f31e"` | Emoji |
| 🌟 | glowing star | 1F31F | `"\U0001f31f"` | Emoji |
| ♨ | hot springs (humidity) | 2668 | `"\u2668"` | Misc |

### Calendar View Usage Example

```python
# Map weather conditions to Cozette glyphs
WEATHER_ICONS = {
    'clear':   '\u263c',   # ☼
    'cloudy':  '\u2601',   # ☁
    'rain':    '\u2602',   # ☂
    'snow':    '\u2744',   # ❄
    'storm':   '\u26a1',   # ⚡
    'fog':     '\u2601',   # ☁ (reuse cloud)
}

# Temperature icon by range
def temp_icon(celsius):
    if celsius >= 35: return '\uf2c7'   # full
    if celsius >= 25: return '\uf2c8'   # ¾
    if celsius >= 15: return '\uf2c9'   # ½
    if celsius >= 5:  return '\uf2ca'   # ¼
    return '\uf2cb'                      # empty
```

---

## Circled Numbers & Letters (`2460–24FF`)

| Glyph | Name | Hex | Python |
|-------|------|-----|--------|
| ① | circled 1 | 2460 | `"\u2460"` |
| ② | circled 2 | 2461 | `"\u2461"` |
| ③ | circled 3 | 2462 | `"\u2462"` |
| ④ | circled 4 | 2463 | `"\u2463"` |
| ⑤ | circled 5 | 2464 | `"\u2464"` |
| ⑥ | circled 6 | 2465 | `"\u2465"` |
| ⑦ | circled 7 | 2466 | `"\u2466"` |
| ⑧ | circled 8 | 2467 | `"\u2467"` |
| ⑨ | circled 9 | 2468 | `"\u2468"` |
| ⑩ | circled 10 | 2469 | `"\u2469"` |
| ⑪–⑳ | circled 11–20 | 246A–2473 | `"\u246a"`–`"\u2473"` |
| Ⓐ–Ⓩ | circled A–Z | 24B6–24CF | `"\u24b6"`–`"\u24cf"` |
| ⓐ–ⓩ | circled a–z | 24D0–24E9 | `"\u24d0"`–`"\u24e9"` |
| ⓪ | circled 0 | 24EA | `"\u24ea"` |
| ⓵–⓾ | dbl-circled 1–10 | 24F5–24FE | `"\u24f5"`–`"\u24fe"` |
| ⓿ | neg-circled 0 | 24FF | `"\u24ff"` |
| ❶–❿ | neg-circled 1–10 | 2776–277F | `"\u2776"`–`"\u277f"` |
| ➀–➉ | solid-circled 1–10 | 2780–2789 | `"\u2780"`–`"\u2789"` |
| ➊–➓ | neg-sans 1–10 | 278A–2793 | `"\u278a"`–`"\u2793"` |

---

## Geometric Shapes (`25A0–25FF`)

| Glyph | Name | Hex | Python |
|-------|------|-----|--------|
| ■ | black square | 25A0 | `"\u25a0"` |
| □ | white square | 25A1 | `"\u25a1"` |
| ▢ | rounded square | 25A2 | `"\u25a2"` |
| ▣ | square w/ fill | 25A3 | `"\u25a3"` |
| ▤–▩ | patterned squares | 25A4–25A9 | `"\u25a4"`–`"\u25a9"` |
| ▪ | sm black square | 25AA | `"\u25aa"` |
| ▫ | sm white square | 25AB | `"\u25ab"` |
| ▬ | black rect | 25AC | `"\u25ac"` |
| ▮ | black vert rect | 25AE | `"\u25ae"` |
| ▰ | black parallelogram | 25B0 | `"\u25b0"` |
| ▲ | black up triangle | 25B2 | `"\u25b2"` |
| △ | white up triangle | 25B3 | `"\u25b3"` |
| ▶ | black right triangle | 25B6 | `"\u25b6"` |
| ▷ | white right triangle | 25B7 | `"\u25b7"` |
| ▼ | black down triangle | 25BC | `"\u25bc"` |
| ▽ | white down triangle | 25BD | `"\u25bd"` |
| ◀ | black left triangle | 25C0 | `"\u25c0"` |
| ◁ | white left triangle | 25C1 | `"\u25c1"` |
| ◆ | black diamond | 25C6 | `"\u25c6"` |
| ◇ | white diamond | 25C7 | `"\u25c7"` |
| ◉ | fisheye | 25C9 | `"\u25c9"` |
| ○ | white circle | 25CB | `"\u25cb"` |
| ● | black circle | 25CF | `"\u25cf"` |
| ◐–◕ | half/quarter circles | 25D0–25D5 | `"\u25d0"`–`"\u25d5"` |
| ◦ | white bullet | 25E6 | `"\u25e6"` |
| ◯ | large circle | 25EF | `"\u25ef"` |
| ◻ | wh med square | 25FB | `"\u25fb"` |
| ◼ | blk med square | 25FC | `"\u25fc"` |

---

## Block Elements (`2580–259F`)

| Glyph | Name | Hex | Python |
|-------|------|-----|--------|
| ▀ | upper half | 2580 | `"\u2580"` |
| ▄ | lower half | 2584 | `"\u2584"` |
| █ | full block | 2588 | `"\u2588"` |
| ▌ | left half | 258C | `"\u258c"` |
| ▐ | right half | 2590 | `"\u2590"` |
| ░ | light shade | 2591 | `"\u2591"` |
| ▒ | medium shade | 2592 | `"\u2592"` |
| ▓ | dark shade | 2593 | `"\u2593"` |
| ▁–▇ | eighths (⅛–⅞) | 2581–2587 | `"\u2581"`–`"\u2587"` |

---

## Miscellaneous Symbols (`2600–26FF`)

| Glyph | Name | Hex | Python |
|-------|------|-----|--------|
| ☁ | cloud | 2601 | `"\u2601"` |
| ☂ | umbrella | 2602 | `"\u2602"` |
| ☃ | snowman | 2603 | `"\u2603"` |
| ★ | black star | 2605 | `"\u2605"` |
| ☆ | white star | 2606 | `"\u2606"` |
| ☎ | telephone | 260E | `"\u260e"` |
| ☐ | ballot box | 2610 | `"\u2610"` |
| ☑ | ballot check | 2611 | `"\u2611"` |
| ☒ | ballot X | 2612 | `"\u2612"` |
| ☔ | umbrella rain | 2614 | `"\u2614"` |
| ☕ | hot beverage | 2615 | `"\u2615"` |
| ☘ | shamrock | 2618 | `"\u2618"` |
| ☠ | skull crossbones | 2620 | `"\u2620"` |
| ☢ | radioactive | 2622 | `"\u2622"` |
| ☣ | biohazard | 2623 | `"\u2623"` |
| ☮ | peace | 262E | `"\u262e"` |
| ☯ | yin yang | 262F | `"\u262f"` |
| ☰ | trigram heaven | 2630 | `"\u2630"` |
| ☹ | frowning | 2639 | `"\u2639"` |
| ☺ | smiling | 263A | `"\u263a"` |
| ☻ | blk smiling | 263B | `"\u263b"` |
| ☼ | sun | 263C | `"\u263c"` |
| ☽ | first quarter moon | 263D | `"\u263d"` |
| ☾ | last quarter moon | 263E | `"\u263e"` |
| ♠ | spade | 2660 | `"\u2660"` |
| ♡ | white heart | 2661 | `"\u2661"` |
| ♣ | club | 2663 | `"\u2663"` |
| ♥ | black heart | 2665 | `"\u2665"` |
| ♦ | black diamond | 2666 | `"\u2666"` |
| ♨ | hot springs | 2668 | `"\u2668"` |
| ♩ | quarter note | 2669 | `"\u2669"` |
| ♪ | eighth note | 266A | `"\u266a"` |
| ♫ | beamed notes | 266B | `"\u266b"` |
| ♬ | beamed 16ths | 266C | `"\u266c"` |
| ♻ | recycling | 267B | `"\u267b"` |
| ⚀–⚅ | die faces 1–6 | 2680–2685 | `"\u2680"`–`"\u2685"` |
| ⚐ | white flag | 2690 | `"\u2690"` |
| ⚑ | black flag | 2691 | `"\u2691"` |
| ⚓ | anchor | 2693 | `"\u2693"` |
| ⚙ | gear | 2699 | `"\u2699"` |
| ⚠ | warning | 26A0 | `"\u26a0"` |
| ⚡ | high voltage | 26A1 | `"\u26a1"` |
| ⚽ | soccer | 26BD | `"\u26bd"` |
| ⛄ | snowman (no snow) | 26C4 | `"\u26c4"` |
| ⛔ | no entry | 26D4 | `"\u26d4"` |
| ⛩ | shinto shrine | 26E9 | `"\u26e9"` |

---

## Dingbats (`2700–27BF`)

| Glyph | Name | Hex | Python |
|-------|------|-----|--------|
| ✅ | check mark box | 2705 | `"\u2705"` |
| ✈ | airplane | 2708 | `"\u2708"` |
| ✉ | envelope | 2709 | `"\u2709"` |
| ✓ | check mark | 2713 | `"\u2713"` |
| ✔ | heavy check | 2714 | `"\u2714"` |
| ✕ | multiplication X | 2715 | `"\u2715"` |
| ✖ | heavy mult X | 2716 | `"\u2716"` |
| ✗ | ballot X | 2717 | `"\u2717"` |
| ✘ | heavy ballot X | 2718 | `"\u2718"` |
| ✝ | latin cross | 271D | `"\u271d"` |
| ✦ | 4-pointed star | 2726 | `"\u2726"` |
| ✧ | wh 4-pt star | 2727 | `"\u2727"` |
| ✨ | sparkles | 2728 | `"\u2728"` |
| ✱ | heavy asterisk | 2731 | `"\u2731"` |
| ✳ | 8-spoked asterisk | 2733 | `"\u2733"` |
| ✴ | 8-pt star | 2734 | `"\u2734"` |
| ❄ | snowflake | 2744 | `"\u2744"` |
| ❇ | sparkle | 2747 | `"\u2747"` |
| ❌ | cross mark | 274C | `"\u274c"` |
| ❎ | neg sq cross | 274E | `"\u274e"` |
| ❓ | question ornament | 2753 | `"\u2753"` |
| ❕ | exclamation orn | 2755 | `"\u2755"` |
| ❖ | 4-diamond | 2756 | `"\u2756"` |
| ❗ | heavy exclamation | 2757 | `"\u2757"` |
| ❤ | heavy heart | 2764 | `"\u2764"` |
| ❮ | heavy lt angle | 276E | `"\u276e"` |
| ❯ | heavy rt angle | 276F | `"\u276f"` |
| ➔ | heavy wide arrow | 2794 | `"\u2794"` |
| ➕ | heavy plus | 2795 | `"\u2795"` |
| ➖ | heavy minus | 2796 | `"\u2796"` |
| ➗ | heavy division | 2797 | `"\u2797"` |
| ➜ | heavy rt arrow | 279C | `"\u279c"` |
| ➡ | black rt arrow | 27A1 | `"\u27a1"` |
| ➤ | triangle rt arrow | 27A4 | `"\u27a4"` |

---

## Emoji (Supplementary Plane — `1F3xx`)

Cozette includes a subset of standard emoji in the `U+1F300+` range.
These require `\U` escape (8-digit) in MicroPython: `"\U0001f4a1"`.

| Glyph | Name | Hex | Python |
|-------|------|-----|--------|
| 🌍 | earth europe | 1F30D | `"\U0001f30d"` |
| 🌎 | earth americas | 1F30E | `"\U0001f30e"` |
| 🌏 | earth asia | 1F30F | `"\U0001f30f"` |
| 🌐 | globe meridians | 1F310 | `"\U0001f310"` |
| 🌑 | new moon | 1F311 | `"\U0001f311"` |
| 🌕 | full moon | 1F315 | `"\U0001f315"` |
| 🌙 | crescent moon | 1F319 | `"\U0001f319"` |
| 🌞 | sun w/ face | 1F31E | `"\U0001f31e"` |
| 🌟 | glowing star | 1F31F | `"\U0001f31f"` |
| 🌡 | thermometer | 1F321 | `"\U0001f321"` |
| 🌲 | evergreen | 1F332 | `"\U0001f332"` |
| 🌵 | cactus | 1F335 | `"\U0001f335"` |
| 🌶 | hot pepper | 1F336 | `"\U0001f336"` |
| 🌷 | tulip | 1F337 | `"\U0001f337"` |
| 🌸 | cherry blossom | 1F338 | `"\U0001f338"` |
| 🌻 | sunflower | 1F33B | `"\U0001f33b"` |
| 🌼 | blossom | 1F33C | `"\U0001f33c"` |
| 🌽 | corn | 1F33D | `"\U0001f33d"` |
| 🌿 | herb | 1F33F | `"\U0001f33f"` |
| 🍀 | four leaf clover | 1F340 | `"\U0001f340"` |
| 🍁 | maple leaf | 1F341 | `"\U0001f341"` |
| 🍄 | mushroom | 1F344 | `"\U0001f344"` |
| 🍎 | red apple | 1F34E | `"\U0001f34e"` |
| 🍔 | hamburger | 1F354 | `"\U0001f354"` |
| 🍕 | pizza | 1F355 | `"\U0001f355"` |
| 🍺 | beer mug | 1F37A | `"\U0001f37a"` |
| 🍿 | popcorn | 1F37F | `"\U0001f37f"` |
| 🎂 | birthday cake | 1F382 | `"\U0001f382"` |
| 🎃 | jack-o-lantern | 1F383 | `"\U0001f383"` |
| 🎄 | christmas tree | 1F384 | `"\U0001f384"` |
| 🎈 | balloon | 1F388 | `"\U0001f388"` |
| 🎉 | party popper | 1F389 | `"\U0001f389"` |
| 🎓 | graduation | 1F393 | `"\U0001f393"` |
| 🎠 | carousel | 1F3A0 | `"\U0001f3a0"` |
| 🎡 | ferris wheel | 1F3A1 | `"\U0001f3a1"` |
| 🎤 | microphone | 1F3A4 | `"\U0001f3a4"` |
| 🎥 | movie camera | 1F3A5 | `"\U0001f3a5"` |
| 🎧 | headphone | 1F3A7 | `"\U0001f3a7"` |
| 🎨 | art palette | 1F3A8 | `"\U0001f3a8"` |
| 🎪 | circus tent | 1F3AA | `"\U0001f3aa"` |
| 🎬 | clapper board | 1F3AC | `"\U0001f3ac"` |
| 🎭 | performing arts | 1F3AD | `"\U0001f3ad"` |
| 🎮 | video game | 1F3AE | `"\U0001f3ae"` |
| 🎯 | dartboard | 1F3AF | `"\U0001f3af"` |
| 🎱 | pool 8-ball | 1F3B1 | `"\U0001f3b1"` |
| 🎵 | music note | 1F3B5 | `"\U0001f3b5"` |
| 🎶 | music notes | 1F3B6 | `"\U0001f3b6"` |
| 🎹 | piano keys | 1F3B9 | `"\U0001f3b9"` |
| 🎻 | violin | 1F3BB | `"\U0001f3bb"` |
| 🏀 | basketball | 1F3C0 | `"\U0001f3c0"` |
| 🏆 | trophy | 1F3C6 | `"\U0001f3c6"` |
| 🏈 | football | 1F3C8 | `"\U0001f3c8"` |
| 🏐 | volleyball | 1F3D0 | `"\U0001f3d0"` |
| 🏗 | building constr | 1F3D7 | `"\U0001f3d7"` |
| 🏘 | house buildings | 1F3D8 | `"\U0001f3d8"` |
| 🏠 | house | 1F3E0 | `"\U0001f3e0"` |
| 🏡 | garden house | 1F3E1 | `"\U0001f3e1"` |
| 🏢 | office building | 1F3E2 | `"\U0001f3e2"` |
| 🏣 | post office | 1F3E3 | `"\U0001f3e3"` |
| 🏥 | hospital | 1F3E5 | `"\U0001f3e5"` |
| 🏦 | bank | 1F3E6 | `"\U0001f3e6"` |
| 🏧 | ATM sign | 1F3E7 | `"\U0001f3e7"` |
| 🏩 | love hotel | 1F3E9 | `"\U0001f3e9"` |
| 🏪 | convenience store | 1F3EA | `"\U0001f3ea"` |
| 🏫 | school | 1F3EB | `"\U0001f3eb"` |
| 🏬 | dept store | 1F3EC | `"\U0001f3ec"` |
| 🏭 | factory | 1F3ED | `"\U0001f3ed"` |
| 🏯 | japanese castle | 1F3EF | `"\U0001f3ef"` |
| 🏰 | castle | 1F3F0 | `"\U0001f3f0"` |

---

## Quick-Reference: Best Icons by Use Case

| Use Case | Recommended | Python | Source |
|----------|------------|--------|--------|
| WiFi / wireless | | `"\uf1eb"` | NF |
| Globe / internet | | `"\uf0ac"` | NF |
| Computer / host | | `"\uf108"` | NF |
| Memory / storage | | `"\uf0a0"` | NF |
| Microchip | | `"\uf2db"` | NF |
| Clock / time | | `"\uf017"` | NF |
| Temperature | | `"\uf2c9"` | NF |
| Battery | | `"\uf240"` | NF |
| Warning | ⚠ | `"\u26a0"` | Misc |
| Lightning / power | ⚡ | `"\u26a1"` | Misc |
| Gear / settings | ⚙ | `"\u2699"` | Misc |
| Check mark | ✔ | `"\u2714"` | Ding |
| Cross / error | ✗ | `"\u2717"` | Ding |
| Star | ★ | `"\u2605"` | Misc |
| Heart | ❤ | `"\u2764"` | Ding |
| Music note | ♪ | `"\u266a"` | Misc |
| Sun / clear | ☼ | `"\u263c"` | Misc |
| Cloud | ☁ | `"\u2601"` | Misc |
| Rain | ☂ | `"\u2602"` | Misc |
| Snow | ❄ | `"\u2744"` | Ding |
| Storm | ⚡ | `"\u26a1"` | Misc |
| Raindrop |  | `"\uf043"` | NF |
| Temp (hot) |  | `"\uf2c7"` | NF |
| Temp (cold) |  | `"\uf2cb"` | NF |
| Moon phase | ☽ | `"\u263d"` | Misc |
| Snowflake |  | `"\uf2dc"` | NF |
| Envelope | ✉ | `"\u2709"` | Ding |
| Telephone | ☎ | `"\u260e"` | Misc |
| Checkbox empty | ☐ | `"\u2610"` | Misc |
| Checkbox done | ☑ | `"\u2611"` | Misc |
| Arrow right | ➤ | `"\u27a4"` | Ding |
| Arrow up | ▲ | `"\u25b2"` | Geo |
| Arrow down | ▼ | `"\u25bc"` | Geo |
| Bullet | ● | `"\u25cf"` | Geo |
| Diamond | ◆ | `"\u25c6"` | Geo |
| List number 1 | ① | `"\u2460"` | Circ |
| Progress bar fill | █ | `"\u2588"` | Block |
| Progress bar empty | ░ | `"\u2591"` | Block |

> **Source key**: NF = Nerd Font PUA, Misc = Misc Symbols, Ding = Dingbats,
> Geo = Geometric, Circ = Circled, Block = Block Elements
