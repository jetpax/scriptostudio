"""
Status LED Helper Functions
=======================

Singletons:
- status_led              - StatusLED instance for controlling onboard LED (or None if not available)

Color Constants:
- RED, GREEN, BLUE, YELLOW, CYAN, MAGENTA, WHITE, BLACK, etc.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import time
import _thread
from machine import Pin

# ============================================================================
# Color Constants (based on experimental colors)
# ============================================================================

AMBER = (225, 175, 0)
AQUA = (50, 255, 255)
BLACK = (0, 0, 0)
BLUE = (0, 0, 255)
CYAN = (0, 175, 150)
GOLD = (218, 206, 30)
GREEN = (0, 255, 0)
JADE = (0, 200, 150)
MAGENTA = (200, 0, 200)
ORANGE = (200, 150, 0)
PINK = (225, 175, 200)
PURPLE = (150, 0, 200)
RED = (255, 0, 0)
TEAL = (0, 200, 175)
WHITE = (255, 255, 255)
YELLOW = (240, 200, 0)  # Full yellow (R=255, G=255, B=0)

# RAINBOW is a list of colors for cycling through
RAINBOW = ((255, 0, 0), (255, 40, 0), (255, 150, 0), (0, 255, 0), (0, 0, 255), (180, 0, 255))

# RGBW white variants (for RGBW strips)
RGBW_WHITE_RGB = (255, 255, 255, 0)
RGBW_WHITE_RGBW = (255, 255, 255, 255)
RGBW_WHITE_W = (0, 0, 0, 255)


# ============================================================================
# LED Implementation
# ============================================================================

def calculate_intensity(color, intensity=1.0):
    """
    Scale color brightness by intensity factor with gamma correction.
    
    Applies gamma correction (gamma=2.5) for perceptually linear brightness.
    Human vision perceives brightness logarithmically, so this makes
    intensity=0.5 look like "half brightness" to the eye.
    
    Args:
        color: RGB tuple (r, g, b) where each value is 0-255
        intensity: Brightness scale factor 0.0-1.0
    
    Returns:
        Scaled RGB tuple with gamma correction
    """
    # Clamp intensity to valid range
    intensity = max(0.0, min(1.0, intensity))
    
    # Apply gamma correction (gamma = 2.5)
    # Formula: output = (input/255)^gamma * intensity * 255
    gamma = 2.5
    return tuple(
        int((c / 255.0) ** gamma * intensity * 255)
        for c in color
    )


def get_neopixel_order(pixel_order):
    """
    Convert pixel order string to NeoPixel ORDER tuple and bpp.
    
    Args:
        pixel_order: String like "BRG", "GRB", "RGB", "RGBW", "RBGW"
    
    Returns:
        Tuple of (order_tuple, bpp) where:
        - order_tuple: Tuple of (r_idx, g_idx, b_idx, w_idx) indices
        - bpp: Bytes per pixel (3 for RGB, 4 for RGBW)
    """
    order_map = {
        "BRG": ((2, 0, 1, 3), 3),  # Blue, Red, Green (ESP32-S3 default)
        "GRB": ((1, 0, 2, 3), 3),  # Green, Red, Blue (most common)
        "RGB": ((0, 1, 2, 3), 3),  # Red, Green, Blue
        "RGBW": ((0, 1, 2, 3), 4), # Red, Green, Blue, White
        "RBGW": ((0, 2, 1, 3), 4), # Red, Blue, Green, White
    }
    
    if pixel_order in order_map:
        return order_map[pixel_order]
    else:
        # Default to BRG if unknown
        return ((2, 1, 0, 3), 3)


class StatusLED:
    """
    NeoPixel status LED driver with animation support.
    
    Provides simple control methods for solid colors, flashing, and
    smooth throbbing/fading animations.
    """
    
    # Animation modes
    MODE_SOLID = 0
    MODE_FLASHING = 1
    MODE_THROBBING = 2
    
    # LED System States
    STATE_BOOT = "boot"                    # Yellow flashing - searching for network
    STATE_NETWORK_CONNECTED = "network"    # Yellow solid - network ready, waiting for client
    STATE_CLIENT_CONNECTED = "client"      # Green solid - WebREPL client connected
    
    # State table mapping states to (color, mode, interval_ms)
    _STATE_TABLE = {
        STATE_BOOT: (PINK, MODE_FLASHING, 300),
        STATE_NETWORK_CONNECTED: (PINK, MODE_SOLID, None),
        STATE_CLIENT_CONNECTED: (CYAN, MODE_SOLID, None),
    }
    
    def __init__(self, pin, num_pixels=1, pixel_index=0, global_brightness=1.0, pixel_order="BRG"):
        """
        Initialize status LED.
        
        Args:
            pin: GPIO pin number for NeoPixel data line
            num_pixels: Total number of pixels in the string (default 1)
            pixel_index: Index/position of this LED in the string (default 0 = first LED)
            global_brightness: Global brightness multiplier 0.0-1.0 (default 1.0)
            pixel_order: Color order string - "BRG" (default), "GRB", "RGB", "RGBW", "RBGW"
        """
        self.np = None
        self.pin_num = pin
        self.num_pixels = num_pixels
        self.pixel_index = pixel_index
        
        # Global brightness (affects all operations)
        self.global_brightness = max(0.0, min(1.0, global_brightness))
        
        # Animation state
        self.mode = self.MODE_SOLID
        self.base_color = BLACK
        self.intensity = 1.0
        self.interval_ms = 500
        self.throb_speed = 10
        self.last_update = time.ticks_ms()
        self.throb_phase = 0.0
        self.flash_state = False
        
        # Get NeoPixel ORDER tuple and bpp from pixel_order string
        order_tuple, bpp = get_neopixel_order(pixel_order)
        
        # Initialize NeoPixel hardware
        from neopixel import NeoPixel
        # Set color order before creating NeoPixel instance
        NeoPixel.ORDER = order_tuple
        self.np = NeoPixel(Pin(pin), num_pixels, bpp=bpp)
    
    def _write(self, color):
        """Write color to NeoPixel hardware (internal method)"""
        if self.np:
            # Apply global brightness to final color
            final_color = calculate_intensity(color, self.global_brightness)
            self.np[self.pixel_index] = final_color
            self.np.write()
    
    def set_color(self, color, intensity=1.0):
        """
        Set LED to solid color.
        
        Args:
            color: RGB tuple (r, g, b) or color constant
            intensity: Brightness 0.0-1.0 (default 1.0)
        """
        self.mode = self.MODE_SOLID
        self.base_color = color
        self.intensity = intensity
        final_color = calculate_intensity(color, intensity)
        self._write(final_color)
    
    def set_flashing(self, color, interval_ms=500, intensity=1.0):
        """
        Set LED to flashing pattern.
        
        Args:
            color: RGB tuple (r, g, b) or color constant
            interval_ms: Flash interval in milliseconds (default 500)
            intensity: Brightness 0.0-1.0 (default 1.0)
        """
        self.mode = self.MODE_FLASHING
        self.base_color = color
        self.interval_ms = interval_ms
        self.intensity = intensity
        self.flash_state = True
        self.last_update = time.ticks_ms()
        # Write initial state immediately
        self._write(calculate_intensity(color, intensity))
    
    def set_throbbing(self, color, speed=10, intensity=1.0):
        """
        Set LED to smooth throbbing/fading pattern.
        
        Args:
            color: RGB tuple (r, g, b) or color constant
            speed: Throb speed 1-100 (higher = faster, default 10)
            intensity: Maximum brightness 0.0-1.0 (default 1.0)
        """
        self.mode = self.MODE_THROBBING
        self.base_color = color
        self.throb_speed = speed
        self.intensity = intensity
        self.throb_phase = 0.0
        self.last_update = time.ticks_ms()
        # Write initial state immediately
        import math
        brightness = (math.sin(self.throb_phase) + 1.0) / 2.0
        current_intensity = brightness * intensity
        self._write(calculate_intensity(color, current_intensity))
    
    def off(self):
        """Turn off LED"""
        self.set_color(BLACK)
    
    def set_state(self, state):
        """
        Set LED to a system state.
        
        Args:
            state: One of STATE_BOOT, STATE_NETWORK_CONNECTED, STATE_CLIENT_CONNECTED
        """
        if state not in self._STATE_TABLE:
            return
        
        color, mode, interval_ms = self._STATE_TABLE[state]
        
        if mode == self.MODE_FLASHING:
            self.set_flashing(color, interval_ms)
        elif mode == self.MODE_SOLID:
            self.set_color(color)
    
    def set_brightness(self, brightness):
        """
        Set global brightness multiplier.
        
        This affects all LED operations (solid, flashing, throbbing).
        Useful for dimming the LED without changing individual intensities.
        
        Args:
            brightness: Global brightness 0.0-1.0
        
        Example:
            status_led.set_brightness(0.5)  # Dim to 50%
            status_led.set_brightness(0.1)  # Very dim (10%)
            status_led.set_brightness(1.0)  # Full brightness
        """
        self.global_brightness = max(0.0, min(1.0, brightness))
    
    def get_brightness(self):
        """
        Get current global brightness multiplier.
        
        Returns:
            Current brightness value (0.0-1.0)
        """
        return self.global_brightness
    
    def blink_off(self, duration_ms=100):
        """
        Temporarily turn off LED for specified duration, then restore previous state.
        
        This is useful for visual feedback when sending messages or events occur.
        The LED will blink off and then return to its previous color/mode.
        
        Args:
            duration_ms: Duration to keep LED off in milliseconds (default 100)
        """
        # Save current state
        saved_mode = self.mode
        saved_color = self.base_color
        saved_intensity = self.intensity
        
        # Turn off LED
        self._write(BLACK)
        
        # Wait for duration
        time.sleep_ms(duration_ms)
        
        # Restore previous state
        if saved_mode == self.MODE_SOLID:
            self.set_color(saved_color, saved_intensity)
        elif saved_mode == self.MODE_FLASHING:
            self.set_flashing(saved_color, self.interval_ms, saved_intensity)
        elif saved_mode == self.MODE_THROBBING:
            self.set_throbbing(saved_color, self.throb_speed, saved_intensity)
    
    def update(self):
        """
        Update animation state (called periodically by background thread).
        Handles flashing and throbbing animations.
        """
        now = time.ticks_ms()
        elapsed = time.ticks_diff(now, self.last_update)
        
        if self.mode == self.MODE_FLASHING:
            # Toggle between on and off at interval
            if elapsed >= self.interval_ms:
                self.flash_state = not self.flash_state
                self.last_update = now
                
                if self.flash_state:
                    color = calculate_intensity(self.base_color, self.intensity)
                else:
                    color = BLACK
                self._write(color)
        
        elif self.mode == self.MODE_THROBBING:
            # Smooth sine wave fade
            # Speed scales from 0.001 to 0.1 radians per ms
            speed_factor = self.throb_speed / 1000.0
            self.throb_phase += elapsed * speed_factor
            
            # Keep phase in reasonable range
            if self.throb_phase > 100.0:
                self.throb_phase = self.throb_phase % (2 * 3.14159)
            
            # Calculate brightness using sine wave (0.0 to 1.0)
            import math
            brightness = (math.sin(self.throb_phase) + 1.0) / 2.0
            
            # Apply to base color
            current_intensity = brightness * self.intensity
            color = calculate_intensity(self.base_color, current_intensity)
            self._write(color)
            
            self.last_update = now

def _animation_thread():
    """Background thread that updates LED animations"""
    while True:
        if status_led:
            status_led.update()
        time.sleep_ms(50)  # Update every 50ms

# Global status LED instance (singleton - initialized by init_status_led())
status_led = None

def init_status_led():
    """
    Initialize the status LED singleton.
    
    This should be called once at boot time by boot.py.
    Calling it multiple times is safe (it will only initialize once).
    
    Returns:
        The status_led singleton instance
    """
    global status_led
    
    # Only initialize once (singleton pattern)
    if status_led is not None:
        return status_led
    
    # Global brightness setting (0.0-1.0) - adjust this to change overall LED brightness
    # Note: Uses gamma correction for perceptually linear brightness
    # With gamma=2.5: 0.5 looks like "half brightness", 0.2 is quite dim, 0.05 is very subtle
    GLOBAL_LED_BRIGHTNESS = 0.2  # Recommended starting point for indoor use (adjust to taste)
    
    # Check if board has status LED capability
    from lib.sys import board
    
    if not board.has("status_led"):
        return None
    
    # Get status LED configuration
    try:
        status_led_pin = board.pin("status_led")
        led_device = board.device("status_led")
        status_led_pixel_order = getattr(led_device, 'pixel_order', 'BRG')  # Default: BRG order
    except KeyError:
        # status_led device not configured in board.json
        return None
    
    # Status LED is always at position 0 (first LED in string)
    # num_pixels defaults to 1 (status LED always implies at least 1 LED)
    # Users can extend the string later, but board config only defines the status LED
    
    # Create LED instance
    status_led = StatusLED(
        pin=status_led_pin,
        num_pixels=1,
        pixel_index=0,
        global_brightness=GLOBAL_LED_BRIGHTNESS,
        pixel_order=status_led_pixel_order
    )
    
    # Start animation thread
    _thread.start_new_thread(_animation_thread, ())
    
    # Set initial boot state (yellow flashing - searching for network)
    status_led.set_state(StatusLED.STATE_BOOT)
    
    return status_led
