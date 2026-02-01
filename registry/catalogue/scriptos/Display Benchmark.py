


# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,

    info    = dict(
        name        = 'Display Benchmark',
        version     = [1, 0, 0],
        category    = 'Display',
        description = '''Benchmarks display performance. Measures FPS for various 
                         operations: full screen fills, partial updates, rectangles,
                         text rendering, and SPI throughput.''',
        author      = 'JetPax',
        mail        = 'jep@alphabetiq.com',
        www         = 'https://github.com/jetpax'
    ),
    
    args    = dict(
        iterations  = dict( label    = 'Iterations per test:',
                           type     = int,
                           value    = 20 ),
        spi_speed   = dict( label    = 'SPI Speed (MHz):',
                           type     = int,
                           value    = 40 )
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
# Minimal ST7789 Driver (same as Display Demo)
# ==============================================================================

class ST7789:
    """Minimal ST7789 display driver for benchmarking"""
    
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
    
    def __init__(self, spi, cs, dc, rst=None, width=240, height=280):
        self.spi = spi
        self.cs = Pin(cs, Pin.OUT)
        self.dc = Pin(dc, Pin.OUT)
        self.rst = Pin(rst, Pin.OUT) if rst else None
        self.width = width
        self.height = height
        self._x_offset = 0
        self._y_offset = 20 if height == 280 else 0
        
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
        self._write_cmd(self.CMD_MADCTL)
        self._write_data(0x00)
        self._write_cmd(self.CMD_COLMOD)
        self._write_data(0x55)
        time.sleep_ms(10)
        self._write_cmd(self.CMD_INVON)
        time.sleep_ms(10)
        self._write_cmd(self.CMD_NORON)
        time.sleep_ms(10)
        self._write_cmd(self.CMD_DISPON)
        time.sleep_ms(120)
    
    def set_window(self, x0, y0, x1, y1):
        x0 += self._x_offset
        x1 += self._x_offset
        y0 += self._y_offset
        y1 += self._y_offset
        
        self._write_cmd(self.CMD_CASET)
        self._write_data(bytes([x0 >> 8, x0 & 0xFF, x1 >> 8, x1 & 0xFF]))
        self._write_cmd(self.CMD_RASET)
        self._write_data(bytes([y0 >> 8, y0 & 0xFF, y1 >> 8, y1 & 0xFF]))
        self._write_cmd(self.CMD_RAMWR)
    
    def fill_rect(self, x, y, w, h, color):
        self.set_window(x, y, x + w - 1, y + h - 1)
        
        line_size = min(w, 64)
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
    
    def fill(self, color):
        self.fill_rect(0, 0, self.width, self.height, color)
    
    def raw_write(self, data):
        """Direct SPI write for bandwidth testing"""
        self.dc.value(1)
        self.cs.value(0)
        self.spi.write(data)
        self.cs.value(1)


# ==============================================================================
# Benchmark Functions
# ==============================================================================

def benchmark(name, func, iterations):
    """Run a benchmark and return stats"""
    gc.collect()
    times = []
    
    for i in range(iterations):
        start = time.ticks_us()
        func()
        end = time.ticks_us()
        times.append(time.ticks_diff(end, start))
    
    avg_us = sum(times) / len(times)
    min_us = min(times)
    max_us = max(times)
    fps = 1000000 / avg_us if avg_us > 0 else 0
    
    return {
        'name': name,
        'avg_ms': avg_us / 1000,
        'min_ms': min_us / 1000,
        'max_ms': max_us / 1000,
        'fps': fps
    }


def rgb565(r, g, b):
    return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3)


# ==============================================================================
# Main Execution
# ==============================================================================

print()
print("=" * 60)
print("  Display Performance Benchmark")
print("=" * 60)
print()

# Get display configuration
if USE_BOARD and board.has("display"):
    print("✅ Using board configuration")
    spi_cfg = board.spi("lcd")
    sck_pin = spi_cfg.sck
    mosi_pin = spi_cfg.mosi
    dc_pin = spi_cfg.dc
    cs_pin = spi_cfg.cs
    rst_pin = spi_cfg.rst
    disp = board.device("display")
    width = disp.width
    height = disp.height
    bl_pin = board._res.get("gpio", {}).get("bl_pwm")
else:
    print("⚠️  Using Waveshare LCD 1.69 defaults")
    sck_pin = 6
    mosi_pin = 7
    dc_pin = 4
    cs_pin = 5
    rst_pin = 8
    bl_pin = 15
    width = 240
    height = 280

# Calculate theoretical limits
total_pixels = width * height
bytes_per_frame = total_pixels * 2
spi_hz = args.spi_speed * 1000000
theoretical_fps = spi_hz / 8 / bytes_per_frame

print(f"  Display: {width}x{height} ({total_pixels} pixels)")
print(f"  Frame size: {bytes_per_frame:,} bytes ({bytes_per_frame/1024:.1f} KB)")
print(f"  SPI Speed: {args.spi_speed} MHz")
print(f"  Theoretical max FPS: {theoretical_fps:.1f}")
print()

# Initialize SPI and display
spi = SPI(1, baudrate=spi_hz, sck=Pin(sck_pin), mosi=Pin(mosi_pin))
display = ST7789(spi, cs_pin, dc_pin, rst_pin, width, height)

# Set backlight
if bl_pin:
    bl = PWM(Pin(bl_pin), freq=20000, duty=512)

print("Starting benchmarks...")
print("-" * 60)
print()

iterations = args.iterations
results = []

# ==============================================================================
# Benchmark 1: Full Screen Fill
# ==============================================================================
print("📊 Test 1: Full Screen Fill (worst case)")
result = benchmark(
    "Full Screen Fill",
    lambda: display.fill(rgb565(255, 0, 0)),
    iterations
)
results.append(result)
print(f"   Average: {result['avg_ms']:.1f} ms ({result['fps']:.1f} FPS)")
print(f"   Range: {result['min_ms']:.1f} - {result['max_ms']:.1f} ms")
print()

# ==============================================================================
# Benchmark 2: Small Rectangle (button-sized)
# ==============================================================================
print("📊 Test 2: Small Rectangle (80x40 - button size)")
result = benchmark(
    "Small Rect (80x40)",
    lambda: display.fill_rect(80, 120, 80, 40, rgb565(0, 255, 0)),
    iterations
)
results.append(result)
print(f"   Average: {result['avg_ms']:.2f} ms ({result['fps']:.1f} FPS)")
print(f"   Pixels: {80*40} ({80*40*2} bytes)")
print()

# ==============================================================================
# Benchmark 3: Very Small Rectangle (icon-sized)
# ==============================================================================
print("📊 Test 3: Tiny Rectangle (24x24 - icon size)")
result = benchmark(
    "Tiny Rect (24x24)",
    lambda: display.fill_rect(108, 128, 24, 24, rgb565(0, 0, 255)),
    iterations
)
results.append(result)
print(f"   Average: {result['avg_ms']:.2f} ms ({result['fps']:.1f} FPS)")
print(f"   Pixels: {24*24} ({24*24*2} bytes)")
print()

# ==============================================================================
# Benchmark 4: Horizontal Line (common UI element)
# ==============================================================================
print("📊 Test 4: Horizontal Line (full width, 2px)")
result = benchmark(
    "H-Line (240x2)",
    lambda: display.fill_rect(0, 140, width, 2, rgb565(255, 255, 255)),
    iterations
)
results.append(result)
print(f"   Average: {result['avg_ms']:.2f} ms ({result['fps']:.1f} FPS)")
print()

# ==============================================================================
# Benchmark 5: Multiple Small Updates (simulates UI refresh)
# ==============================================================================
print("📊 Test 5: Multiple Small Updates (10 elements)")
def multi_update():
    for i in range(10):
        display.fill_rect(20 + i*20, 50, 15, 15, rgb565(i*25, 100, 200))

result = benchmark(
    "10x Small Updates",
    multi_update,
    iterations
)
results.append(result)
print(f"   Average: {result['avg_ms']:.1f} ms ({result['fps']:.1f} FPS)")
print()

# ==============================================================================
# Benchmark 6: Raw SPI Throughput
# ==============================================================================
print("📊 Test 6: Raw SPI Throughput (64KB transfer)")
test_buf = bytes([0xFF, 0x00] * 32768)  # 64KB buffer

def raw_spi_test():
    display.set_window(0, 0, width-1, height-1)
    display.raw_write(test_buf)

result = benchmark(
    "Raw SPI 64KB",
    raw_spi_test,
    iterations
)
results.append(result)
actual_mbps = (64 * 1024 * 8) / (result['avg_ms'] / 1000) / 1000000
print(f"   Average: {result['avg_ms']:.1f} ms")
print(f"   Actual throughput: {actual_mbps:.1f} Mbps (of {args.spi_speed} MHz)")
print(f"   Efficiency: {actual_mbps / args.spi_speed * 100:.0f}%")
print()

# ==============================================================================
# Summary
# ==============================================================================
print("=" * 60)
print("  BENCHMARK SUMMARY")
print("=" * 60)
print()
print(f"{'Test':<25} {'Avg (ms)':<12} {'FPS':<10}")
print("-" * 47)
for r in results:
    if r['fps'] > 100:
        fps_str = f"{r['fps']:.0f}"
    else:
        fps_str = f"{r['fps']:.1f}"
    print(f"{r['name']:<25} {r['avg_ms']:<12.2f} {fps_str:<10}")

print()
print("-" * 60)
print("  KEY INSIGHTS")
print("-" * 60)
print()

full_fill = results[0]
small_rect = results[1]
speedup = full_fill['avg_ms'] / small_rect['avg_ms']

print(f"  • Full screen updates: {full_fill['fps']:.1f} FPS")
print(f"  • Button-sized updates: {small_rect['fps']:.0f} FPS ({speedup:.0f}x faster)")
print(f"  • Use partial updates for responsive UIs!")
print()

# Memory info
gc.collect()
free_mem = gc.mem_free()
print(f"  • Free RAM: {free_mem:,} bytes ({free_mem/1024:.0f} KB)")
print()
print("✅ Benchmark complete!")

# Leave a nice pattern on screen
display.fill(rgb565(20, 20, 40))
display.fill_rect(10, 10, width-20, 40, rgb565(40, 40, 80))

