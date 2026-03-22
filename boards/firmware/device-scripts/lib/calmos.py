# CalmOS — ePaper notepad shell for PFC agent display
import lvgl as lv
import time
import gc

try:
    from esp32 import mcu_temperature
    _TEMP_OK = True
except ImportError:
    _TEMP_OK = False

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

# ── Page buffers (6 pages × LINE_COUNT entries) ──
_pages = None      # list of lists: [[(text, icon), ...], ...]
_active_page = 0
SYSTEM_PAGE = 5
_PAGE_NAMES = ['alerts', 'todo', 'calendar', 'calls', 'messages', 'system']

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

def init():
    """Initialize display hardware, build layout, render first frame.

    Synchronous — safe to call from boot.py (no event loop needed).
    The 3-4s EPD full refresh happens here, overlapping with network startup.
    """
    global _epd, _scr, _time_lbl, _date_lbl, _line_labels, _icon_labels
    global _fonts, _started, _sel_bar, _nav_sel, _nav_icons
    if _started:
        return

    from lib.sys.display.display_manager import init_display
    _epd = init_display()

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

    _init_pages()
    _build_status_bar()
    _build_notepad()
    _build_nav_bar()
    _start_buttons()
    _update_system_page()
    _swap_page(0)

    print(f"[CalmOS] Ready, time: {_fmt_time()} {_fmt_date()}")
    _epd.lv_refresh(full=True)
    _started = True

def start_tasks():
    """Start async background tasks (clock loop).

    Must be called from an async context (after event loop is running).
    Safe to call multiple times — skips if already started.
    """
    import asyncio
    asyncio.create_task(_clock_loop())

def start():
    """Convenience wrapper — init + start_tasks in one call.

    For backward compat. Prefer calling init() from boot.py and
    start_tasks() from main_async() separately.
    """
    init()
    start_tasks()

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
    """Move the selection bar to nav icon idx (0–5) and show that page."""
    global _nav_sel
    idx = idx % NAV_ICON_COUNT
    _nav_sel = idx
    _update_sel_bar()
    _swap_page(idx)
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
    _sys_tick = 0
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
        # Refresh system page every ~30s (3 ticks × 10s)
        _sys_tick += 1
        if _sys_tick >= 3:
            _sys_tick = 0
            _update_system_page()
            if _active_page == SYSTEM_PAGE:
                _swap_page(SYSTEM_PAGE)
                changed = True
        if changed:
            _epd.lv_refresh()

# ── Page management ──

def _init_pages():
    global _pages
    _pages = [[("", "")] * LINE_COUNT for _ in range(NAV_ICON_COUNT)]

def _swap_page(idx):
    """Write page buffer idx to the visible labels."""
    global _active_page
    if _pages is None or _line_labels is None:
        return
    _active_page = idx
    buf = _pages[idx]
    cz36 = _fonts.get('cozette36')
    c48 = _fonts.get('chicago48')
    cz48 = _fonts.get('cozette48')
    for i in range(LINE_COUNT):
        text, icon = buf[i]
        _line_labels[i].set_text(text)
        # Line 0 uses title font if it has text
        if i == 0 and text and c48:
            _line_labels[i].set_style_text_font(c48, 0)
        elif cz36:
            _line_labels[i].set_style_text_font(cz36, 0)
        if _icon_labels:
            _icon_labels[i].set_text(icon)

def _fmt_bytes(b):
    """Human-readable byte count: 142K, 3.2M, etc."""
    if b >= 1048576:
        return f"{b / 1048576:.1f}M"
    if b >= 1024:
        return f"{b // 1024}K"
    return str(b)

def _update_system_page():
    """Populate the System page buffer with live data."""
    if _pages is None:
        return
    buf = _pages[SYSTEM_PAGE]

    # Nerd Font codepoints (Cozette binfont, confirmed in calmpilot demo)
    IC_WIFI  = "\uf1eb"   # nf-fa-wifi
    IC_NET   = "\uf0ac"   # nf-fa-globe
    IC_HOST  = "\uf108"   # nf-fa-desktop
    IC_MEM   = "\uf0a0"   # nf-fa-hdd_o
    IC_CLOCK = "\uf017"   # nf-fa-clock_o
    IC_TEMP  = "\uf2c9"   # nf-fa-thermometer_half

    # Title
    buf[0] = ("System", "")

    # WiFi signal
    try:
        import network
        sta = network.WLAN(network.STA_IF)
        if sta.active() and sta.isconnected():
            rssi = sta.status('rssi')
            buf[1] = (f"  WiFi: {rssi} dBm", IC_WIFI)
            ip = sta.ifconfig()[0]
            buf[2] = (f"  {ip}", IC_NET)
            hostname = network.hostname()
            buf[3] = (f"  {hostname}", IC_HOST)
        else:
            buf[1] = ("  WiFi: disconnected", IC_WIFI)
            buf[2] = ("  --", IC_NET)
            buf[3] = ("  --", IC_HOST)
    except Exception:
        buf[1] = ("  WiFi: n/a", IC_WIFI)
        buf[2] = ("", "")
        buf[3] = ("", "")

    # Memory: internal heap + PSRAM
    gc.collect()
    heap_free = gc.mem_free()
    mem_txt = f"  Heap: {_fmt_bytes(heap_free)}"
    try:
        import esp32
        psram = esp32.idf_heap_info(0x80)  # MALLOC_CAP_SPIRAM
        if psram and len(psram) > 0 and psram[0][0] > 0:
            # Each region: (total, free, largest_free, min_free)
            pf = sum(r[1] for r in psram if r[1] > 0)
            mem_txt += f" / PS: {_fmt_bytes(pf)}"
    except Exception:
        pass
    buf[4] = (mem_txt, IC_MEM)

    # Uptime
    ms = time.ticks_ms()
    s = ms // 1000
    d, s = divmod(s, 86400)
    h, s = divmod(s, 3600)
    m, s = divmod(s, 60)
    parts = []
    if d: parts.append(f"{d}d")
    if h: parts.append(f"{h}h")
    if m: parts.append(f"{m}m")
    parts.append(f"{s}s")
    buf[5] = (f"  Up: {' '.join(parts)}", IC_CLOCK)

    # CPU temperature
    if _TEMP_OK:
        try:
            t = mcu_temperature()
            buf[6] = (f"  CPU: {t:.1f}\u00b0C", IC_TEMP)
        except Exception:
            buf[6] = ("  CPU: n/a", IC_TEMP)
    else:
        buf[6] = ("", "")

    # Battery (AXP2101 PMU)
    IC_BAT = "\uf240"  # nf-fa-battery_full
    try:
        from lib.sys import board
        _pmu = board.device("pmu") if board.has("battery") else None
        if _pmu and _pmu.type == "AXP2101":
            from machine import Pin, I2C
            _i2c_cfg = board.i2c("i2c0")
            _i2c = I2C(0, scl=Pin(_i2c_cfg.scl), sda=Pin(_i2c_cfg.sda), freq=400000)
            _A = 0x34
            # Percentage (fuel gauge register 0xA4)
            _i2c.writeto(_A, bytes([0xA4]))
            pct = _i2c.readfrom(_A, 1)[0]
            # Voltage (14-bit: high byte 0x34, low byte 0x35)
            _i2c.writeto(_A, bytes([0x34]))
            vh = _i2c.readfrom(_A, 1)[0]
            _i2c.writeto(_A, bytes([0x35]))
            vl = _i2c.readfrom(_A, 1)[0]
            mv = ((vh << 8) | vl) & 0x3FFF
            # Charge status (reg 0x01 bits [2:0])
            _i2c.writeto(_A, bytes([0x01]))
            cs = _i2c.readfrom(_A, 1)[0] & 0x07
            state = ["Trickle", "Pre-chg", "CC", "CV", "Charged", ""][cs] if cs < 6 else f"0x{cs:02x}"
            buf[7] = (f"  Batt: {pct}% {mv}mV {state}", IC_BAT)
        else:
            buf[7] = ("", "")
    except Exception:
        buf[7] = ("  Bat: n/a", IC_BAT)

# ── Public API ──

def set_title(text):
    """Set line 0 of the active page as a title."""
    if _pages is None:
        return
    _pages[_active_page][0] = (text, "")
    if _line_labels:
        _line_labels[0].set_text(text)
        _line_labels[0].set_style_text_font(_fonts['chicago48'], 0)

def set_line(n, text, icon=None):
    """Set line n of the active page."""
    if _pages is None or n < 0 or n >= LINE_COUNT:
        return
    _pages[_active_page][n] = (text, icon or "")
    if _line_labels:
        _line_labels[n].set_text(text)
    if icon and _icon_labels:
        _icon_labels[n].set_text(icon)

def set_page_line(page, n, text, icon=None):
    """Write to a specific page buffer (by index or name)."""
    if _pages is None or n < 0 or n >= LINE_COUNT:
        return
    if isinstance(page, str):
        page = _PAGE_NAMES.index(page) if page in _PAGE_NAMES else -1
    if page < 0 or page >= NAV_ICON_COUNT:
        return
    _pages[page][n] = (text, icon or "")
    if page == _active_page and _line_labels:
        _line_labels[n].set_text(text)
        if icon and _icon_labels:
            _icon_labels[n].set_text(icon)

def clear_page(page):
    """Clear all lines of a page buffer."""
    if _pages is None:
        return
    if isinstance(page, str):
        page = _PAGE_NAMES.index(page) if page in _PAGE_NAMES else -1
    if page < 0 or page >= NAV_ICON_COUNT:
        return
    _pages[page] = [("", "")] * LINE_COUNT
    if page == _active_page:
        _swap_page(page)

def clear():
    """Clear the active page."""
    clear_page(_active_page)

def get_active_page():
    """Return the active page index (0–5)."""
    return _active_page

def refresh(full=False):
    if _epd:
        _epd.lv_refresh(full=full)

def get_line_count():
    return LINE_COUNT
