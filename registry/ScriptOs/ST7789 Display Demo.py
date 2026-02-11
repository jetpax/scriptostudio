


# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,

    info    = dict(
        name        = 'ST7789 Display Demo',
        version     = [1, 0, 0],
        category    = 'Display',
        description = '''Display demo for ST7789-based LCD screens. Shows colorful graphics, 
                         text, and animations. Reads pin configuration from board.json 
                         for maximum portability across different boards.''',
        author      = 'JetPax',
        mail        = 'jep@alphabetiq.com',
        www         = 'https://github.com/jetpax'
    ),
    
    args    = dict(
        demo_mode   = dict( label    = 'Demo Mode:',
                           type     = dict,
                           items    = dict( 
                               all       = "All demos (cycle through)",
                               rainbow   = "Rainbow gradient",
                               squares   = "Animated squares",
                               text      = "Text demo",
                               pylogo    = "pyDirect logo"
                           ),
                           value    = 'all' ),
        duration    = dict( label    = 'Duration per demo (seconds):',
                           type     = int,
                           value    = 5 ),
        brightness  = dict( label    = 'Backlight brightness (%):',
                           type     = int,
                           value    = 80 )
    )

)

# === END_CONFIG_PARAMETERS ===


from machine import Pin, SPI, PWM
import time
import gc

# Try to import board configuration
try:
    from lib.sys import board
    USE_BOARD = True
except:
    USE_BOARD = False


# ==============================================================================
# ST7789 Driver (minimal, self-contained)
# ==============================================================================

class ST7789:
    """Minimal ST7789 display driver for RGB565"""
    
    # ST7789 Commands
    CMD_NOP       = 0x00
    CMD_SWRESET   = 0x01
    CMD_SLPOUT    = 0x11
    CMD_NORON     = 0x13
    CMD_INVON     = 0x21
    CMD_DISPON    = 0x29
    CMD_CASET     = 0x2A
    CMD_RASET     = 0x2B
    CMD_RAMWR     = 0x2C
    CMD_MADCTL    = 0x36
    CMD_COLMOD    = 0x3A
    
    def __init__(self, spi, cs, dc, rst=None, width=240, height=280, offset_x=0, offset_y=0, rotation=0):
        self.spi = spi
        self.cs = Pin(cs, Pin.OUT)
        self.dc = Pin(dc, Pin.OUT)
        self.rst = Pin(rst, Pin.OUT) if rst else None
        self.width = width
        self.height = height
        self.rotation = rotation
        
        # Offsets from board manifest (ST7789 internal buffer is larger than visible area)
        self._x_offset = offset_x
        self._y_offset = offset_y
        
        self.cs.value(1)
        self.dc.value(1)
        
        self.init()
    
    def _write_cmd(self, cmd):
        self.dc.value(0)
        self.cs.value(0)
        self.spi.write(bytes([cmd]))
        self.cs.value(1)
    
    def _write_data(self, data):
        self.dc.value(1)
        self.cs.value(0)
        if isinstance(data, int):
            self.spi.write(bytes([data]))
        else:
            self.spi.write(data)
        self.cs.value(1)
    
    def reset(self):
        if self.rst:
            self.rst.value(1)
            time.sleep_ms(10)
            self.rst.value(0)
            time.sleep_ms(10)
            self.rst.value(1)
            time.sleep_ms(120)
    
    def init(self):
        self.reset()
        
        self._write_cmd(self.CMD_SWRESET)
        time.sleep_ms(150)
        
        self._write_cmd(self.CMD_SLPOUT)
        time.sleep_ms(120)
        
        # Memory data access control (rotation)
        self._write_cmd(self.CMD_MADCTL)
        madctl = 0x00
        if self.rotation == 0:
            madctl = 0x00
        elif self.rotation == 1:
            madctl = 0x60
            self.width, self.height = self.height, self.width
        elif self.rotation == 2:
            madctl = 0xC0
        elif self.rotation == 3:
            madctl = 0xA0
            self.width, self.height = self.height, self.width
        self._write_data(madctl)
        
        # Color mode - 16-bit RGB565
        self._write_cmd(self.CMD_COLMOD)
        self._write_data(0x55)
        time.sleep_ms(10)
        
        # Invert display colors (needed for most ST7789 displays)
        self._write_cmd(self.CMD_INVON)
        time.sleep_ms(10)
        
        # Normal display mode
        self._write_cmd(self.CMD_NORON)
        time.sleep_ms(10)
        
        # Display on
        self._write_cmd(self.CMD_DISPON)
        time.sleep_ms(120)
        
        print(f"✅ Display initialized: {self.width}x{self.height}")
    
    def set_window(self, x0, y0, x1, y1):
        """Set the drawing window"""
        x0 += self._x_offset
        x1 += self._x_offset
        y0 += self._y_offset
        y1 += self._y_offset
        
        self._write_cmd(self.CMD_CASET)
        self._write_data(bytes([x0 >> 8, x0 & 0xFF, x1 >> 8, x1 & 0xFF]))
        
        self._write_cmd(self.CMD_RASET)
        self._write_data(bytes([y0 >> 8, y0 & 0xFF, y1 >> 8, y1 & 0xFF]))
        
        self._write_cmd(self.CMD_RAMWR)
    
    def fill(self, color):
        """Fill entire screen with a color (RGB565)"""
        self.fill_rect(0, 0, self.width, self.height, color)
    
    def fill_rect(self, x, y, w, h, color):
        """Fill a rectangle with a color"""
        self.set_window(x, y, x + w - 1, y + h - 1)
        
        # Create a line buffer for efficiency
        line_size = min(w, 64)  # Limit buffer size
        buf = bytes([color >> 8, color & 0xFF]) * line_size
        
        self.dc.value(1)
        self.cs.value(0)
        
        total_pixels = w * h
        pixels_written = 0
        
        while pixels_written < total_pixels:
            chunk = min(line_size, total_pixels - pixels_written)
            if chunk == line_size:
                self.spi.write(buf)
            else:
                self.spi.write(buf[:chunk * 2])
            pixels_written += chunk
        
        self.cs.value(1)
    
    def pixel(self, x, y, color):
        """Draw a single pixel"""
        if 0 <= x < self.width and 0 <= y < self.height:
            self.set_window(x, y, x, y)
            self._write_data(bytes([color >> 8, color & 0xFF]))
    
    def hline(self, x, y, w, color):
        """Draw horizontal line"""
        self.fill_rect(x, y, w, 1, color)
    
    def vline(self, x, y, h, color):
        """Draw vertical line"""
        self.fill_rect(x, y, 1, h, color)
    
    def rect(self, x, y, w, h, color):
        """Draw rectangle outline"""
        self.hline(x, y, w, color)
        self.hline(x, y + h - 1, w, color)
        self.vline(x, y, h, color)
        self.vline(x + w - 1, y, h, color)
    
    def text(self, text, x, y, color, scale=1, bg=None):
        """Draw text using built-in 8x8 font"""
        # Simple 8x8 font bitmap (subset of printable ASCII)
        FONT = {
            ' ': [0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00],
            '!': [0x18,0x18,0x18,0x18,0x18,0x00,0x18,0x00],
            'A': [0x3C,0x66,0x66,0x7E,0x66,0x66,0x66,0x00],
            'B': [0x7C,0x66,0x66,0x7C,0x66,0x66,0x7C,0x00],
            'C': [0x3C,0x66,0x60,0x60,0x60,0x66,0x3C,0x00],
            'D': [0x78,0x6C,0x66,0x66,0x66,0x6C,0x78,0x00],
            'E': [0x7E,0x60,0x60,0x7C,0x60,0x60,0x7E,0x00],
            'F': [0x7E,0x60,0x60,0x7C,0x60,0x60,0x60,0x00],
            'G': [0x3C,0x66,0x60,0x6E,0x66,0x66,0x3E,0x00],
            'H': [0x66,0x66,0x66,0x7E,0x66,0x66,0x66,0x00],
            'I': [0x3C,0x18,0x18,0x18,0x18,0x18,0x3C,0x00],
            'J': [0x1E,0x0C,0x0C,0x0C,0x0C,0x6C,0x38,0x00],
            'K': [0x66,0x6C,0x78,0x70,0x78,0x6C,0x66,0x00],
            'L': [0x60,0x60,0x60,0x60,0x60,0x60,0x7E,0x00],
            'M': [0x63,0x77,0x7F,0x6B,0x63,0x63,0x63,0x00],
            'N': [0x66,0x76,0x7E,0x7E,0x6E,0x66,0x66,0x00],
            'O': [0x3C,0x66,0x66,0x66,0x66,0x66,0x3C,0x00],
            'P': [0x7C,0x66,0x66,0x7C,0x60,0x60,0x60,0x00],
            'Q': [0x3C,0x66,0x66,0x66,0x6E,0x3C,0x0E,0x00],
            'R': [0x7C,0x66,0x66,0x7C,0x78,0x6C,0x66,0x00],
            'S': [0x3C,0x66,0x60,0x3C,0x06,0x66,0x3C,0x00],
            'T': [0x7E,0x18,0x18,0x18,0x18,0x18,0x18,0x00],
            'U': [0x66,0x66,0x66,0x66,0x66,0x66,0x3C,0x00],
            'V': [0x66,0x66,0x66,0x66,0x66,0x3C,0x18,0x00],
            'W': [0x63,0x63,0x63,0x6B,0x7F,0x77,0x63,0x00],
            'X': [0x66,0x66,0x3C,0x18,0x3C,0x66,0x66,0x00],
            'Y': [0x66,0x66,0x66,0x3C,0x18,0x18,0x18,0x00],
            'Z': [0x7E,0x06,0x0C,0x18,0x30,0x60,0x7E,0x00],
            '0': [0x3C,0x66,0x6E,0x76,0x66,0x66,0x3C,0x00],
            '1': [0x18,0x38,0x18,0x18,0x18,0x18,0x7E,0x00],
            '2': [0x3C,0x66,0x06,0x0C,0x18,0x30,0x7E,0x00],
            '3': [0x3C,0x66,0x06,0x1C,0x06,0x66,0x3C,0x00],
            '4': [0x0C,0x1C,0x3C,0x6C,0x7E,0x0C,0x0C,0x00],
            '5': [0x7E,0x60,0x7C,0x06,0x06,0x66,0x3C,0x00],
            '6': [0x1C,0x30,0x60,0x7C,0x66,0x66,0x3C,0x00],
            '7': [0x7E,0x06,0x0C,0x18,0x30,0x30,0x30,0x00],
            '8': [0x3C,0x66,0x66,0x3C,0x66,0x66,0x3C,0x00],
            '9': [0x3C,0x66,0x66,0x3E,0x06,0x0C,0x38,0x00],
            '.': [0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x00],
            ':': [0x00,0x18,0x18,0x00,0x18,0x18,0x00,0x00],
            '-': [0x00,0x00,0x00,0x7E,0x00,0x00,0x00,0x00],
            '+': [0x00,0x18,0x18,0x7E,0x18,0x18,0x00,0x00],
            'a': [0x00,0x00,0x3C,0x06,0x3E,0x66,0x3E,0x00],
            'b': [0x60,0x60,0x7C,0x66,0x66,0x66,0x7C,0x00],
            'c': [0x00,0x00,0x3C,0x66,0x60,0x66,0x3C,0x00],
            'd': [0x06,0x06,0x3E,0x66,0x66,0x66,0x3E,0x00],
            'e': [0x00,0x00,0x3C,0x66,0x7E,0x60,0x3C,0x00],
            'f': [0x1C,0x30,0x7C,0x30,0x30,0x30,0x30,0x00],
            'g': [0x00,0x00,0x3E,0x66,0x66,0x3E,0x06,0x3C],
            'h': [0x60,0x60,0x7C,0x66,0x66,0x66,0x66,0x00],
            'i': [0x18,0x00,0x38,0x18,0x18,0x18,0x3C,0x00],
            'j': [0x0C,0x00,0x1C,0x0C,0x0C,0x0C,0x6C,0x38],
            'k': [0x60,0x60,0x66,0x6C,0x78,0x6C,0x66,0x00],
            'l': [0x38,0x18,0x18,0x18,0x18,0x18,0x3C,0x00],
            'm': [0x00,0x00,0x66,0x7F,0x6B,0x63,0x63,0x00],
            'n': [0x00,0x00,0x7C,0x66,0x66,0x66,0x66,0x00],
            'o': [0x00,0x00,0x3C,0x66,0x66,0x66,0x3C,0x00],
            'p': [0x00,0x00,0x7C,0x66,0x66,0x7C,0x60,0x60],
            'q': [0x00,0x00,0x3E,0x66,0x66,0x3E,0x06,0x06],
            'r': [0x00,0x00,0x7C,0x66,0x60,0x60,0x60,0x00],
            's': [0x00,0x00,0x3E,0x60,0x3C,0x06,0x7C,0x00],
            't': [0x30,0x30,0x7C,0x30,0x30,0x30,0x1C,0x00],
            'u': [0x00,0x00,0x66,0x66,0x66,0x66,0x3E,0x00],
            'v': [0x00,0x00,0x66,0x66,0x66,0x3C,0x18,0x00],
            'w': [0x00,0x00,0x63,0x63,0x6B,0x7F,0x36,0x00],
            'x': [0x00,0x00,0x66,0x3C,0x18,0x3C,0x66,0x00],
            'y': [0x00,0x00,0x66,0x66,0x66,0x3E,0x06,0x3C],
            'z': [0x00,0x00,0x7E,0x0C,0x18,0x30,0x7E,0x00],
        }
        
        for i, char in enumerate(text):
            if char.upper() in FONT:
                bitmap = FONT.get(char, FONT.get(char.upper(), FONT[' ']))
            else:
                bitmap = FONT[' ']
            
            char_x = x + i * 8 * scale
            for row in range(8):
                for col in range(8):
                    if bitmap[row] & (0x80 >> col):
                        if scale == 1:
                            self.pixel(char_x + col, y + row, color)
                        else:
                            self.fill_rect(char_x + col * scale, y + row * scale, 
                                          scale, scale, color)
                    elif bg is not None:
                        if scale == 1:
                            self.pixel(char_x + col, y + row, bg)
                        else:
                            self.fill_rect(char_x + col * scale, y + row * scale,
                                          scale, scale, bg)


# ==============================================================================
# Color helpers (RGB565)
# ==============================================================================

def rgb565(r, g, b):
    """Convert RGB888 to RGB565"""
    return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3)

def hsv_to_rgb565(h, s, v):
    """Convert HSV (0-360, 0-100, 0-100) to RGB565"""
    if s == 0:
        r = g = b = int(v * 2.55)
    else:
        h = h % 360
        h /= 60
        s /= 100
        v /= 100
        i = int(h)
        f = h - i
        p = v * (1 - s)
        q = v * (1 - s * f)
        t = v * (1 - s * (1 - f))
        if i == 0: r, g, b = v, t, p
        elif i == 1: r, g, b = q, v, p
        elif i == 2: r, g, b = p, v, t
        elif i == 3: r, g, b = p, q, v
        elif i == 4: r, g, b = t, p, v
        else: r, g, b = v, p, q
        r, g, b = int(r * 255), int(g * 255), int(b * 255)
    return rgb565(r, g, b)

# Standard colors
BLACK   = 0x0000
WHITE   = 0xFFFF
RED     = rgb565(255, 0, 0)
GREEN   = rgb565(0, 255, 0)
BLUE    = rgb565(0, 0, 255)
CYAN    = rgb565(0, 255, 255)
MAGENTA = rgb565(255, 0, 255)
YELLOW  = rgb565(255, 255, 0)
ORANGE  = rgb565(255, 165, 0)
PURPLE  = rgb565(128, 0, 128)


# ==============================================================================
# Demo functions
# ==============================================================================

def demo_rainbow(display, duration):
    """Rainbow gradient demo"""
    print("🌈 Rainbow gradient...")
    start = time.ticks_ms()
    hue = 0
    
    while time.ticks_diff(time.ticks_ms(), start) < duration * 1000:
        for y in range(0, display.height, 10):
            color = hsv_to_rgb565((hue + y) % 360, 100, 100)
            display.fill_rect(0, y, display.width, 10, color)
        hue = (hue + 5) % 360
        gc.collect()


def demo_squares(display, duration):
    """Animated bouncing squares"""
    print("⬛ Animated squares...")
    
    # Square state: [x, y, size, dx, dy, color]
    squares = [
        [20, 30, 40, 3, 2, RED],
        [100, 80, 30, -2, 3, GREEN],
        [60, 120, 50, 2, -2, BLUE],
        [150, 50, 25, -3, 2, YELLOW],
    ]
    
    start = time.ticks_ms()
    
    while time.ticks_diff(time.ticks_ms(), start) < duration * 1000:
        display.fill(BLACK)
        
        for sq in squares:
            x, y, size, dx, dy, color = sq
            display.fill_rect(int(x), int(y), size, size, color)
            
            # Move and bounce
            sq[0] = x + dx
            sq[1] = y + dy
            if sq[0] <= 0 or sq[0] + size >= display.width:
                sq[3] = -dx
            if sq[1] <= 0 or sq[1] + size >= display.height:
                sq[4] = -dy
        
        time.sleep_ms(30)
        gc.collect()


def demo_text(display, duration):
    """Text demo with different sizes"""
    print("📝 Text demo...")
    display.fill(rgb565(20, 20, 40))  # Dark blue background
    
    # Title - "pyDirect" = 8 chars × 8px × 3 = 192px, center = (240-192)/2 = 24
    display.text("pyBot", 24, 20, CYAN, scale=3)
    
    # Subtitle - "Display Demo" = 12 chars × 8px × 2 = 192px, center = 24
    display.text("Display", 24, 60, WHITE, scale=2)
    display.text("Demo", 24, 80, WHITE, scale=2)
    
    # Info
    display.text(f"Size: {display.width}x{display.height}", 20, 100, GREEN)
    
    if USE_BOARD:
        display.text(f"Board: {board.id.id}", 20, 135, GREEN)
        display.text(f"Chip: {board.id.chip}", 20, 150, GREEN)
    
    # Fun message - "MicroPython" = 11 chars × 8px × 2 = 176px, center = 32
    display.text("MicroPython", 0, 190, YELLOW, scale=2)
    # "Rocks!" = 6 chars × 8px × 2 = 96px, center = 72
    display.text("Rocks!", 36, 220, MAGENTA, scale=2)
    
    # Border
    display.rect(5, 5, display.width - 10, display.height - 10, CYAN)
    display.rect(8, 8, display.width - 16, display.height - 16, PURPLE)
    
    time.sleep_ms(duration * 1000)


def demo_pylogo(display, duration):
    """pyBot logo demo"""
    print("🐍 pyBot logo...")
    display.fill(rgb565(10, 10, 20))
    
    cx, cy = display.width // 2, display.height // 2
    
    # Draw concentric circles (approximated with rectangles)
    for r in range(80, 20, -10):
        color = hsv_to_rgb565((r * 3) % 360, 100, 80)
        for angle in range(0, 360, 5):
            import math
            x = int(cx + r * 0.8 * (angle % 90) / 90 - r * 0.4)
            y = int(cy + r * 0.8 * (angle % 90) / 90 - r * 0.4)
        display.rect(cx - r, cy - r, r * 2, r * 2, color)
    
    # Center text
    display.fill_rect(cx - 60, cy - 12, 120, 24, rgb565(20, 20, 50))
    display.text("pyBot", cx - 32, cy - 8, WHITE, scale=2)
    
    # Version
    display.text("v1.0", cx - 16, cy + 20, CYAN)
    
    time.sleep_ms(duration * 1000)


# ==============================================================================
# Main execution
# ==============================================================================

print()
print("=" * 50)
print("  ST7789 Display Demo")
print("=" * 50)
print()

# Get display configuration from board.json or use defaults
if USE_BOARD and board.has("display"):
    print("✅ Using board configuration")
    spi_cfg = board.spi("lcd")
    
    # Get pins from board config
    sck_pin = spi_cfg.sck
    mosi_pin = spi_cfg.mosi
    dc_pin = spi_cfg.dc
    cs_pin = spi_cfg.cs
    rst_pin = spi_cfg.rst
    
    # Get display device definition from manifest
    disp = board.device("display")
    width = disp.width
    height = disp.height
    
    # Get display offsets from manifest (defaults to 0 if not specified)
    offset_x = getattr(disp, 'offset_x', 0)
    offset_y = getattr(disp, 'offset_y', 0)
    
    # Backlight: prefer devices.display.backlight.pin, fall back to resources.gpio.bl_pwm
    bl_pin = None
    try:
        bl_pin = disp.backlight['pin']
    except (AttributeError, KeyError, TypeError):
        bl_pin = board._res.get("gpio", {}).get("bl_pwm")
    
    print(f"  Display: {disp.type} {width}x{height}")
    print(f"  Offsets: x={offset_x}, y={offset_y}")
    print(f"  SPI: SCK={sck_pin}, MOSI={mosi_pin}")
    print(f"  Control: DC={dc_pin}, CS={cs_pin}, RST={rst_pin}")
    if bl_pin:
        print(f"  Backlight: GPIO{bl_pin}")
else:
    print("⚠️  No board config, using Waveshare LCD 1.69 defaults")
    sck_pin = 6
    mosi_pin = 7
    dc_pin = 4
    cs_pin = 5
    rst_pin = 8
    bl_pin = 15
    width = 240
    height = 280
    offset_x = 0
    offset_y = 20

print()

# Initialize SPI
spi = SPI(1, baudrate=40000000, sck=Pin(sck_pin), mosi=Pin(mosi_pin))
print(f"✅ SPI initialized @ 40MHz")

# Initialize display with offsets from manifest
display = ST7789(spi, cs_pin, dc_pin, rst_pin, width, height, offset_x, offset_y)

# Set backlight
if bl_pin:
    bl = PWM(Pin(bl_pin), freq=20000)
    duty = int(args.brightness * 10.23)  # 0-1023
    bl.duty(duty)
    print(f"✅ Backlight set to {args.brightness}%")

print()

# Run demos
duration = args.duration

if args.demo_mode == 'all':
    print("🎬 Running all demos...")
    print("-" * 30)
    demo_rainbow(display, duration)
    demo_squares(display, duration)
    demo_text(display, duration)
    demo_pylogo(display, duration)
elif args.demo_mode == 'rainbow':
    demo_rainbow(display, duration)
elif args.demo_mode == 'squares':
    demo_squares(display, duration)
elif args.demo_mode == 'text':
    demo_text(display, duration)
elif args.demo_mode == 'pylogo':
    demo_pylogo(display, duration)

print()
print("🎉 Demo complete!")

# Keep text demo on screen at end
demo_text(display, 0)