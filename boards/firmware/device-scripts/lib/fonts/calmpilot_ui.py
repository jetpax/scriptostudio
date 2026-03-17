"""CalmPilot UI — LVGL layout for 480x800 portrait ePaper.

Uses custom Tabler Icons font for nav bar and status bar icons.
Font files generated with lv_font_conv from Tabler Icons TTF.

Icon codepoint reference:
  clipboard-list  \\uea6d
  calendar-event  \\uea52
  phone-call      \\ueb05
  mail-opened     \\ueae4
  adjustments-alt \\uec37
  robot           \\uf00b
  wifi            \\ueb52
  antenna-bars-5  \\ueccb
  battery (empty) \\uea34
  battery-1 (25%) \\uea2f
  battery-2 (50%) \\uea30
  battery-3 (75%) \\uea31
  battery-4 (100%)\\uea32
  battery-charging\\uea33
  battery-off     \\ued1c

"""
import lvgl as lv
import time
from lib.sys.display.display_manager import get_display

# ── Display init ──
epd = get_display()
epd.init()
epd.lvgl_init()

scr = lv.screen_active()
scr.clean()
scr.set_style_bg_color(lv.color_white(), 0)
scr.set_style_pad_all(0, 0)

# ── Register LVGL filesystem driver (bridges MicroPython FS to LVGL) ──
import fs_driver
fs_drv = lv.fs_drv_t()
fs_driver.fs_register(fs_drv, 'A')

# ── Load custom fonts ──
tabler48 = lv.binfont_create("A:/lib/fonts/tabler48.bin")
gillsans28 = lv.binfont_create("A:/lib/fonts/gillsans28.bin")
gillsans36 = lv.binfont_create("A:/lib/fonts/gillsans36.bin")

# ── Layout constants ──
W = 480
H = 800
PAD = 20
STATUS_H = 80
NAV_H = 80

# ── Time helper ──
def _get_local_time():
    """Get local time tuple, applying timezone offset from settings."""
    try:
        from lib.sys import settings
        tz = settings.get('ntp.tz_offset', 0.0)
    except:
        tz = 0.0
    utc_secs = time.mktime(time.gmtime())
    local_secs = utc_secs + int(tz * 3600)
    return time.localtime(local_secs)

def _fmt_time():
    """Return 'HH:MM' string in local time."""
    t = _get_local_time()
    return f"{t[3]:02d}:{t[4]:02d}"

# ═══════════════════════════════════════
# STATUS BAR
# ═══════════════════════════════════════
status = lv.obj(scr)
status.set_size(W, STATUS_H)
status.set_pos(0, 0)
status.set_style_bg_opa(lv.OPA.TRANSP, 0)
status.set_style_border_width(0, 0)
status.set_style_radius(0, 0)
status.set_scrollbar_mode(lv.SCROLLBAR_MODE.OFF)

# Time (left) — wired to real clock, replaces carrier
time_lbl = lv.label(status)
time_lbl.set_text(_fmt_time())
time_lbl.set_style_text_font(gillsans36, 0)
time_lbl.set_style_text_color(lv.color_black(), 0)
time_lbl.align(lv.ALIGN.LEFT_MID, PAD, 0)

# Robot icon (Tabler)
robot = lv.label(status)
robot.set_text("\uf00b")
robot.set_style_text_font(tabler48, 0)
robot.set_style_text_color(lv.color_black(), 0)
robot.align_to(time_lbl, lv.ALIGN.OUT_RIGHT_MID, 12, 0)

# Battery icon (Tabler, far right) — battery-4 (nearly full)
batt = lv.label(status)
batt.set_text("\uea32")  # battery-4 (100%)
batt.set_style_text_font(tabler48, 0)
batt.set_style_text_color(lv.color_black(), 0)
batt.align(lv.ALIGN.RIGHT_MID, -PAD, 0)

# WiFi icon (Tabler, left of battery)
wifi = lv.label(status)
wifi.set_text("\ueb52")
wifi.set_style_text_font(tabler48, 0)
wifi.set_style_text_color(lv.color_black(), 0)
wifi.align_to(batt, lv.ALIGN.OUT_LEFT_MID, -10, 0)

# Signal bars (Tabler, left of WiFi)
signal = lv.label(status)
signal.set_text("\ueccb")
signal.set_style_text_font(tabler48, 0)
signal.set_style_text_color(lv.color_black(), 0)
signal.align_to(wifi, lv.ALIGN.OUT_LEFT_MID, -10, 0)

# ── Solid separator line ──
sep = lv.obj(scr)
sep.set_size(W - 2 * PAD, 2)
sep.align(lv.ALIGN.TOP_MID, 0, STATUS_H)
sep.set_style_bg_color(lv.color_black(), 0)
sep.set_style_border_width(0, 0)
sep.set_style_radius(0, 0)

# ═══════════════════════════════════════
# CONTENT: LINED NOTEPAD
# ═══════════════════════════════════════
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

# ═══════════════════════════════════════
# BOTTOM NAV BAR
# ═══════════════════════════════════════
# ── Solid separator above nav ──
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

# Nav icons — Tabler Icons at 48px
icons = [
    "\uea6d",  # clipboard-list (Tasks)
    "\uea52",  # calendar-event (Calendar)
    "\ueb05",  # phone-call     (Phone)
    "\ueae4",  # mail-opened    (Mail)
    "\uec37",  # adjustments-alt(Settings)
]
spacing = 80
for i, sym in enumerate(icons):
    ic = lv.label(nav)
    ic.set_text(sym)
    ic.set_style_text_font(tabler48, 0)
    ic.set_style_text_color(lv.color_black(), 0)
    ic.align(lv.ALIGN.CENTER, (i - 2) * spacing, 0)

# ═══════════════════════════════════════
# INITIAL FULL REFRESH
# ═══════════════════════════════════════
print(f"[UI] Initial render, time: {_fmt_time()}")
epd.lv_refresh(full=True)

# ═══════════════════════════════════════
# CLOCK UPDATE LOOP (partial refresh)
# ═══════════════════════════════════════
print("[UI] Starting clock loop (Ctrl-C to stop)")
last_time = _fmt_time()
try:
    while True:
        time.sleep(10)  # Check every 10s
        now = _fmt_time()
        if now != last_time:
            time_lbl.set_text(now)
            t0 = time.ticks_ms()
            epd.lv_refresh()  # partial — only the time label area
            t1 = time.ticks_ms()
            print(f"[UI] {last_time} -> {now} ({time.ticks_diff(t1, t0)}ms)")
            last_time = now
except KeyboardInterrupt:
    print("[UI] Clock stopped")
