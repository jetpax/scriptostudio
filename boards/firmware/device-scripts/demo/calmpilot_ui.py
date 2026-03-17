# CalmPilot UI — 480x800 portrait ePaper (ChiKareGo + Cozette + Tabler fonts)
import lvgl as lv
import time
from lib.sys.display.display_manager import get_display

epd = get_display()
epd.init()
epd.lvgl_init()

scr = lv.screen_active()
scr.clean()
scr.set_style_bg_color(lv.color_white(), 0)
scr.set_style_pad_all(0, 0)

import fs_driver
fs_drv = lv.fs_drv_t()
fs_driver.fs_register(fs_drv, 'A')

tabler48 = lv.binfont_create("A:/lib/fonts/tabler48.bin")
chicago24 = lv.binfont_create("A:/lib/fonts/chicago24.bin")
chicago36 = lv.binfont_create("A:/lib/fonts/chicago36.bin")
chicago48 = lv.binfont_create("A:/lib/fonts/chicago48.bin")
cozette36 = lv.binfont_create("A:/lib/fonts/cozette36.bin")
cozette48 = lv.binfont_create("A:/lib/fonts/cozette48.bin")

print("Fonts installed")

W, H, PAD = 480, 800, 10
STATUS_H = 80
NAV_H = 80

def _get_local_time():
    try:
        from lib.sys import settings
        tz = settings.get('ntp.tz_offset', 0.0)
    except:
        tz = 0.0
    return time.localtime(time.mktime(time.gmtime()) + int(tz * 3600))

def _fmt_time():
    t = _get_local_time()
    return f"{t[3]:02d}:{t[4]:02d}"

# ── STATUS BAR ──
status = lv.obj(scr)
status.set_size(W, STATUS_H)
status.set_pos(0, 0)
status.set_style_bg_opa(lv.OPA.TRANSP, 0)
status.set_style_border_width(0, 0)
status.set_style_radius(0, 0)
status.set_scrollbar_mode(lv.SCROLLBAR_MODE.OFF)

time_lbl = lv.label(status)
time_lbl.set_text(_fmt_time())
time_lbl.set_style_text_font(chicago48, 0)
time_lbl.set_style_text_color(lv.color_black(), 0)
time_lbl.align(lv.ALIGN.LEFT_MID, PAD, 4)

robot = lv.label(status)
robot.set_text("\uf00b")
robot.set_style_text_font(tabler48, 0)
robot.set_style_text_color(lv.color_black(), 0)
robot.align_to(time_lbl, lv.ALIGN.OUT_RIGHT_MID, 12, 0)

batt = lv.label(status)
batt.set_text("\uea32")
batt.set_style_text_font(tabler48, 0)
batt.set_style_text_color(lv.color_black(), 0)
batt.align(lv.ALIGN.RIGHT_MID, -PAD, 0)

wifi = lv.label(status)
wifi.set_text("\ueb52")
wifi.set_style_text_font(tabler48, 0)
wifi.set_style_text_color(lv.color_black(), 0)
wifi.align_to(batt, lv.ALIGN.OUT_LEFT_MID, -10, 0)

signal = lv.label(status)
signal.set_text("\ueccb")
signal.set_style_text_font(tabler48, 0)
signal.set_style_text_color(lv.color_black(), 0)
signal.align_to(wifi, lv.ALIGN.OUT_LEFT_MID, -10, 0)

sep = lv.obj(scr)
sep.set_size(W - 2 * PAD, 2)
sep.align(lv.ALIGN.TOP_MID, 0, STATUS_H)
sep.set_style_bg_color(lv.color_black(), 0)
sep.set_style_border_width(0, 0)
sep.set_style_radius(0, 0)

# ── NOTEPAD LINES ──
content_top = STATUS_H
content_bottom = H - NAV_H
line_spacing = 80

y = content_top + line_spacing
while y < content_bottom:
    ln = lv.line(scr)
    pts = [{"x": PAD, "y": 0}, {"x": W - PAD, "y": 0}]
    ln.set_points(pts, 2)
    ln.set_pos(0, y)
    ln.set_style_line_width(1, 0)
    ln.set_style_line_color(lv.color_black(), 0)
    ln.set_style_line_dash_width(4, 0)
    ln.set_style_line_dash_gap(4, 0)
    y += line_spacing

line_labels = []
for i in range(8):
    ly = content_top + i * line_spacing + 22
    lbl = lv.label(scr)
    lbl.set_text("")
    lbl.set_style_text_font(cozette36, 0)
    lbl.set_style_text_color(lv.color_black(), 0)
    lbl.set_pos(PAD + 10, ly+5)
    lbl.set_width(W - 2 * PAD - 8)
    line_labels.append(lbl)

icon_labels = []
for i in range(8):
    ly = content_top + i * line_spacing + 22
    ilbl = lv.label(scr)
    ilbl.set_text("")
    ilbl.set_style_text_font(cozette48, 0)
    ilbl.set_style_text_color(lv.color_black(), 0)
    ilbl.set_pos(PAD + 10, ly-5)
    icon_labels.append(ilbl)

# ── Demo content ──
line_labels[0].set_text("Temp & Humidity")
line_labels[0].set_style_text_font(chicago48, 0)
icon_labels[1].set_text("\uf2c9")
line_labels[1].set_text("  24.5\u00b0C")
icon_labels[2].set_text("\uf2dc")
line_labels[2].set_text("  62% Humidity")
icon_labels[4].set_text("\uf00c")
line_labels[4].set_text("  Sensor OK")
icon_labels[5].set_text("\uf013")
line_labels[5].set_text("  Updated " + _fmt_time())

# ── NAV BAR ──
nav_sep = lv.obj(scr)
nav_sep.set_size(W - 2 * PAD, 2)
nav_sep.align(lv.ALIGN.TOP_MID, 0, H - NAV_H)
nav_sep.set_style_bg_color(lv.color_black(), 0)
nav_sep.set_style_border_width(0, 0)
nav_sep.set_style_radius(0, 0)

nav = lv.obj(scr)
nav.set_size(W, NAV_H)
nav.set_pos(0, H - NAV_H)
nav.set_style_bg_opa(lv.OPA.TRANSP, 0)
nav.set_style_border_width(0, 0)
nav.set_style_radius(0, 0)
nav.set_scrollbar_mode(lv.SCROLLBAR_MODE.OFF)

icons = ["\uea6d", "\uea52", "\ueb05", "\ueae4", "\uec37"]
spacing = 80
for i, sym in enumerate(icons):
    ic = lv.label(nav)
    ic.set_text(sym)
    ic.set_style_text_font(tabler48, 0)
    ic.set_style_text_color(lv.color_black(), 0)
    ic.align(lv.ALIGN.CENTER, (i - 2) * spacing, 0)

# ── RENDER ──
print(f"[UI] Render, time: {_fmt_time()}")
epd.lv_refresh(full=True)

# ── CLOCK LOOP ──
import asyncio

async def clock_loop():
    last_time = _fmt_time()
    while True:
        await asyncio.sleep(10)
        now = _fmt_time()
        if now != last_time:
            time_lbl.set_text(now)
            t0 = time.ticks_ms()
            epd.lv_refresh()
            t1 = time.ticks_ms()
            print(f"[UI] {last_time} -> {now} ({time.ticks_diff(t1, t0)}ms)")
            last_time = now

asyncio.create_task(clock_loop())
