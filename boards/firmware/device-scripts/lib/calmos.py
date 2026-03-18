# CalmOS — ePaper notepad shell for PFC agent display
import lvgl as lv
import time

_epd = None
_scr = None
_time_lbl = None
_date_lbl = None
_line_labels = None
_icon_labels = None
_sel_bar = None
_nav_sep = None
_nav_sel = 0
_nav_icons = None
_fonts = {}
_started = False

W, H, PAD = 480, 800, 5
STATUS_H = 80
NAV_H = 80
LINE_SPACING = 80
LINE_COUNT = 8
NAV_ICON_COUNT = 6
NAV_SPACING = 76
SEL_BAR_W = 48
SEL_BAR_H = 5

_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

def _get_local_time():
    try:
        from lib.sys import settings
        tz = settings.get('ntp.tz_offset', 0.0)
    except:
        tz = 0.0
    return time.localtime(time.mktime(time.gmtime()) + int(tz * 3600))

def _fmt_time():
    t = _get_local_time()
    return f"{t[3]}:{t[4]:02d}"

def _fmt_date():
    t = _get_local_time()
    return f"{_DAYS[t[6]]} {t[2]} {_MONTHS[t[1] - 1]}"

def _nav_icon_x(i):
    """Return the center x-offset from screen center for nav icon i."""
    return int((i - (NAV_ICON_COUNT - 1) / 2.0) * NAV_SPACING)

def start():
    """Initialize display, build layout, start clock loop."""
    global _epd, _scr, _time_lbl, _date_lbl, _line_labels, _icon_labels
    global _fonts, _started, _sel_bar, _nav_sel, _nav_icons
    if _started:
        return

    from lib.sys.display.display_manager import get_display
    _epd = get_display()
    _epd.init()
    _epd.lvgl_init()

    _scr = lv.screen_active()
    _scr.clean()
    _scr.set_style_bg_color(lv.color_white(), 0)
    _scr.set_style_pad_all(0, 0)

    import fs_driver
    fs_drv = lv.fs_drv_t()
    fs_driver.fs_register(fs_drv, 'A')

    _fonts['tabler48'] = lv.binfont_create("A:/lib/fonts/tabler48.bin")
    _fonts['chicago48'] = lv.binfont_create("A:/lib/fonts/chicago48.bin")
    _fonts['cozette36'] = lv.binfont_create("A:/lib/fonts/cozette36.bin")
    _fonts['cozette48'] = lv.binfont_create("A:/lib/fonts/cozette48.bin")

    _build_status_bar()
    _build_notepad()
    _build_nav_bar()
    _start_buttons()

    print(f"[CalmOS] Ready, time: {_fmt_time()} {_fmt_date()}")
    _epd.lv_refresh(full=True)

    import asyncio
    asyncio.create_task(_clock_loop())
    _started = True

def _build_status_bar():
    global _time_lbl, _date_lbl
    c48 = _fonts['chicago48']
    cz36 = _fonts['cozette36']
    t48 = _fonts['tabler48']

    bar = lv.obj(_scr)
    bar.set_size(W, STATUS_H)
    bar.set_pos(0, 0)
    bar.set_style_bg_opa(lv.OPA.TRANSP, 0)
    bar.set_style_border_width(0, 0)
    bar.set_style_radius(0, 0)
    bar.set_scrollbar_mode(lv.SCROLLBAR_MODE.OFF)
    #time
    _time_lbl = lv.label(bar)
    _time_lbl.set_text(_fmt_time())
    _time_lbl.set_style_text_font(c48, 0)
    _time_lbl.set_style_text_color(lv.color_black(), 0)
    _time_lbl.align(lv.ALIGN.LEFT_MID, 0, 4)
    # date
    _date_lbl = lv.label(bar)
    _date_lbl.set_text(_fmt_date())
    _date_lbl.set_style_text_font(cz36, 0)
    _date_lbl.set_style_text_color(lv.color_black(), 0)
    _date_lbl.align_to(_time_lbl, lv.ALIGN.OUT_RIGHT_MID, 10, 0)
    # cell signal
    batt = lv.label(bar)
    batt.set_text("\uea32")
    batt.set_style_text_font(t48, 0)
    batt.set_style_text_color(lv.color_black(), 0)
    batt.align(lv.ALIGN.RIGHT_MID, -PAD, 0)
    #wifi signal
    wifi = lv.label(bar)
    wifi.set_text("\ueb52")
    wifi.set_style_text_font(t48, 0)
    wifi.set_style_text_color(lv.color_black(), 0)
    wifi.align_to(batt, lv.ALIGN.OUT_LEFT_MID, -PAD, 0)
    # battery
    sig = lv.label(bar)
    sig.set_text("\ueccb")
    sig.set_style_text_font(t48, 0)
    sig.set_style_text_color(lv.color_black(), 0)
    sig.align_to(wifi, lv.ALIGN.OUT_LEFT_MID, -PAD, 0)
    #separator
    sep = lv.obj(_scr)
    sep.set_size(W - 2 * PAD, 2)
    sep.align(lv.ALIGN.TOP_MID, 0, STATUS_H)
    sep.set_style_bg_color(lv.color_black(), 0)
    sep.set_style_border_width(0, 0)
    sep.set_style_radius(0, 0)

def _build_notepad():
    global _line_labels, _icon_labels
    cz36 = _fonts['cozette36']
    cz48 = _fonts['cozette48']
    top = STATUS_H

    y = top + LINE_SPACING
    while y < H - NAV_H:
        ln = lv.line(_scr)
        pts = [{"x": PAD, "y": 0}, {"x": W - PAD, "y": 0}]
        ln.set_points(pts, 2)
        ln.set_pos(0, y)
        ln.set_style_line_width(1, 0)
        ln.set_style_line_color(lv.color_black(), 0)
        ln.set_style_line_dash_width(4, 0)
        ln.set_style_line_dash_gap(4, 0)
        y += LINE_SPACING

    _line_labels = []
    for i in range(LINE_COUNT):
        ly = top + i * LINE_SPACING + 22
        lbl = lv.label(_scr)
        lbl.set_text("")
        lbl.set_style_text_font(cz36, 0)
        lbl.set_style_text_color(lv.color_black(), 0)
        lbl.set_pos(PAD + 10, ly + 5)
        lbl.set_width(W - 2 * PAD - 8)
        _line_labels.append(lbl)

    _icon_labels = []
    for i in range(LINE_COUNT):
        ly = top + i * LINE_SPACING + 22
        ilbl = lv.label(_scr)
        ilbl.set_text("")
        ilbl.set_style_text_font(cz48, 0)
        ilbl.set_style_text_color(lv.color_black(), 0)
        ilbl.set_pos(PAD + 10, ly - 5)
        _icon_labels.append(ilbl)

def _build_nav_bar():
    global _sel_bar, _nav_sel, _nav_icons, _nav_sep
    t48 = _fonts['tabler48']

    nav = lv.obj(_scr)
    nav.set_size(W, NAV_H)
    nav.set_pos(0, H - NAV_H)
    nav.set_style_bg_opa(lv.OPA.TRANSP, 0)
    nav.set_style_border_width(0, 0)
    nav.set_style_radius(0, 0)
    nav.set_scrollbar_mode(lv.SCROLLBAR_MODE.OFF)

    # Robot first, then the original 5 nav icons
    icons = ["\uf00b", "\uea6d", "\uea52", "\ueb05", "\ueae4", "\uec37"]
    _nav_icons = []
    for i, sym in enumerate(icons):
        ic = lv.label(nav)
        ic.set_text(sym)
        ic.set_style_text_font(t48, 0)
        ic.set_style_text_color(lv.color_black(), 0)
        ic.align(lv.ALIGN.CENTER, _nav_icon_x(i), 0)
        _nav_icons.append(ic)

    # Selection bar — 3px thick, 1px gap below separator
    _nav_sel = 0
    _sel_bar = lv.obj(_scr)
    _sel_bar.set_size(SEL_BAR_W, SEL_BAR_H)
    _sel_bar.set_style_bg_color(lv.color_black(), 0)
    _sel_bar.set_style_border_width(0, 0)
    _sel_bar.set_style_radius(0, 0)
    _update_sel_bar()

    # Separator created LAST and stored globally for explicit invalidation
    _nav_sep = lv.obj(_scr)
    _nav_sep.set_size(W - 2 * PAD, 2)
    _nav_sep.align(lv.ALIGN.TOP_MID, 0, H - NAV_H)
    _nav_sep.set_style_bg_color(lv.color_black(), 0)
    _nav_sep.set_style_border_width(0, 0)
    _nav_sep.set_style_radius(0, 0)

def _update_sel_bar():
    """Position the selection bar below the nav separator."""
    if _sel_bar is None:
        return
    cx = W // 2 + _nav_icon_x(_nav_sel)
    # 1px gap after the 2px separator to avoid dirty-region overlap
    _sel_bar.set_pos(cx - SEL_BAR_W // 2, H - NAV_H )
    # Force separator redraw so ePaper partial refresh doesn't erase it
    if _nav_sep is not None:
        _nav_sep.invalidate()

def nav_select(idx):
    """Move the selection bar to nav icon idx (0–5)."""
    global _nav_sel
    idx = idx % NAV_ICON_COUNT
    _nav_sel = idx
    _update_sel_bar()
    if _epd:
        _epd.lv_refresh()

def _nav_move(delta):
    """Shift selection by delta (+1 = right, -1 = left), wrap around."""
    nav_select((_nav_sel + delta) % NAV_ICON_COUNT)

def _start_buttons():
    """IRQ-triggered Kuhn integrating debouncer for nav buttons.

    IRQs on falling edge start a 5ms polling timer. The timer runs the
    Kuhn integrator — action fires when integrator saturates at MAX.
    Timer stops itself once both buttons are fully released (idle).
    """
    try:
        import machine
        from lib.sys import board

        pin_up = board.pin("button_up")
        pin_dn = board.pin("button_down")

        btn_up = machine.Pin(pin_up, machine.Pin.IN, machine.Pin.PULL_UP)
        btn_dn = machine.Pin(pin_dn, machine.Pin.IN, machine.Pin.PULL_UP)

        MAX = 6  # ~30ms integration at 5ms poll
        # [integrator, output_state] per button
        _st = [[0, 0], [0, 0]]
        _pins = [btn_up, btn_dn]
        _deltas = [-1, 1]
        _tmr = machine.Timer(0)
        _active = [False]  # timer running flag

        def _poll(tim):
            idle = True
            for i in range(2):
                pressed = _pins[i].value() == 0
                if pressed:
                    if _st[i][0] < MAX:
                        _st[i][0] += 1
                else:
                    if _st[i][0] > 0:
                        _st[i][0] -= 1

                if _st[i][0] == 0:
                    _st[i][1] = 0
                elif _st[i][0] >= MAX:
                    _st[i][0] = MAX
                    if _st[i][1] == 0:
                        _st[i][1] = 1
                        _nav_move(_deltas[i])

                if _st[i][0] > 0:
                    idle = False

            if idle:
                tim.deinit()
                _active[0] = False

        def _on_press(pin):
            if not _active[0]:
                _active[0] = True
                _tmr.init(period=5, mode=machine.Timer.PERIODIC, callback=_poll)

        btn_up.irq(trigger=machine.Pin.IRQ_FALLING, handler=_on_press)
        btn_dn.irq(trigger=machine.Pin.IRQ_FALLING, handler=_on_press)
        # prevent GC
        global _btn_timer
        _btn_timer = _tmr
        print("[CalmOS] Nav buttons active")
    except Exception as e:
        print(f"[CalmOS] Buttons skipped: {e}")

async def _clock_loop():
    last_time = _fmt_time()
    last_date = _fmt_date()
    while True:
        await __import__('asyncio').sleep(10)
        now_time = _fmt_time()
        now_date = _fmt_date()
        changed = False
        if now_time != last_time:
            _time_lbl.set_text(now_time)
            last_time = now_time
            changed = True
        if now_date != last_date:
            _date_lbl.set_text(now_date)
            last_date = now_date
            changed = True
        if changed:
            _epd.lv_refresh()

# ── Public API ──

def set_title(text):
    if _line_labels:
        _line_labels[0].set_text(text)
        _line_labels[0].set_style_text_font(_fonts['chicago48'], 0)

def set_line(n, text, icon=None):
    if not _line_labels or n < 0 or n >= LINE_COUNT:
        return
    _line_labels[n].set_text(text)
    if icon and _icon_labels:
        _icon_labels[n].set_text(icon)

def clear():
    if _line_labels:
        for lbl in _line_labels:
            lbl.set_text("")
            lbl.set_style_text_font(_fonts['cozette36'], 0)
    if _icon_labels:
        for ilbl in _icon_labels:
            ilbl.set_text("")

def refresh(full=False):
    if _epd:
        _epd.lv_refresh(full=full)

def get_line_count():
    return LINE_COUNT
