# Interruptible version of NeoPixel LED script
# This version properly handles Stop button and disconnect

# === START_CONFIG_PARAMETERS ===

dict(

    timeout         = 1,

    info = dict(
        name        = 'LEDs - NeoPixel RGB(+W/Y) Strip (Interruptible)',
        version     = [1, 2, 0],
        category    = 'Hardware',
        description = 'NeoPixel RGB LEDs demo, compatible with strips WS2812(B), SK6812, ADAxxxx, APA106, FLORA and more. ' \
                    + 'You can choose rainbow fade animation or static white, as well as the number and type of LEDs, ' \
                    + 'brightness, fade speed, RGB protocol and LED frequency. ' \
                    + 'The NeoPixel library was coded by Damien P. George.',
        author      = 'jetPax from code by JC`zic',
    ),

    args = dict(

        ledsCount  = dict( label = 'Number of LEDs:',
                           type  = int,
                           value = 1 ),

        pin        = dict( label = 'GPIO:',
                           type  = list, 
                           value = 1 ),

        pixel_order = dict(
                            label = 'Pixel color order:',
                            type  = dict,
                            items = {
                                'BRG': 'BRG - Blue, Red, Green (3 bytes)',
                                'GRB': 'GRB - Green, Red, Blue (3 bytes, most common)',
                                'RGB': 'RGB - Red, Green, Blue (3 bytes)',
                                'RGBW': 'RGBW - Red, Green, Blue, White (4 bytes)',
                                'RBGW': 'RBGW - Red, Blue, Green, White (4 bytes)'
                            },
                            value = 'GRB' ),

        brightness = dict( label = 'Max brightness (%):',
                           type  = int,
                           value = 25 ),

        fadeSpeed  = dict( label = 'Fade speed (1-100):',
                           type  = int,
                           value = 1 ),

        frequency  = dict( label = 'Protocol frequency:',
                           type  = dict,
                           items = { '0' : '400 KHz > v1 (APA106, FLORA)',
                                     '1' : '800 KHz > v2' },
                           value = '1' ),

        staticWhite = dict( label = 'Static white light (no animation):',
                           type  = bool ) )

)

# === END_CONFIG_PARAMETERS ===


# ----------------------------------------------------------------------------

from machine import Pin
from time    import sleep_ms
import sys

def get_neopixel_order(pixel_order):
    """
    Convert pixel_order string to NeoPixel ORDER tuple and bpp.
    
    Args:
        pixel_order: String like "BRG", "GRB", "RGB", "RGBW", "RBGW"
    
    Returns:
        tuple: (ORDER tuple, bpp)
        ORDER tuple maps (R, G, B, W) positions to byte buffer positions
    """
    pixel_order = pixel_order.upper()
    
    # Map pixel_order strings to (ORDER tuple, bpp)
    # ORDER maps color position in tuple (R=0, G=1, B=2, W=3) to byte buffer position
    order_map = {
        "BRG": ((2, 1, 0, 3), 3),  # Blue, Red, Green
        "GRB": ((1, 0, 2, 3), 3),  # Green, Red, Blue (most common)
        "RGB": ((0, 1, 2, 3), 3),  # Red, Green, Blue
        "RGBW": ((0, 1, 2, 3), 4), # Red, Green, Blue, White
        "RBGW": ((0, 2, 1, 3), 4), # Red, Blue, Green, White
    }
    
    if pixel_order in order_map:
        return order_map[pixel_order]
    else:
        # Default to GRB if unknown
        print(f"⚠️  Unknown pixel_order '{pixel_order}', defaulting to GRB")
        return ((1, 0, 2, 3), 3)

def setColor(red, green, blue, white=0, fading=False) :
    global np, r, g, b, w, brightness_mult, fade_steps, bpp
    # Apply brightness scaling to target colors
    red = int(red * brightness_mult)
    green = int(green * brightness_mult)
    blue = int(blue * brightness_mult)
    white = int(white * brightness_mult)
    rStep = (red-r)   / fade_steps
    gStep = (green-g) / fade_steps
    bStep = (blue-b)  / fade_steps
    wStep = (white-w) / fade_steps
    
    iterations = 0
    max_iterations = max(250, int(fade_steps * 1.5))  # Safety limit, allow for slower fades
    
    while (r != red or g != green or b != blue or w != white or not fading) and iterations < max_iterations:
        iterations += 1
        
        # Check for interrupt every few iterations
        if iterations % 10 == 0:
            # Small sleep to allow interrupt processing
            sleep_ms(1)
        
        if not fading :
            r = red
            g = green
            b = blue
            w = white
        else :
            if (r < red and rStep > 0) or (r > red and rStep < 0) :
                r += rStep
                if r < 0 or r > 255 :
                    r = red
            else :
                r = red
            if (g < green and gStep > 0) or (g > green and gStep < 0) :
                g += gStep
                if g < 0 or g > 255 :
                    g = green
            else :
                g = green
            if (b < blue and bStep > 0) or (b > blue and bStep < 0) :
                b += bStep
                if b < 0 or b > 255 :
                    b = blue
            else :
                b = blue
            if (w < white and wStep > 0) or (w > white and wStep < 0) :
                w += wStep
                if w < 0 or w > 255 :
                    w = white
            else :
                w = white
        for n in range(len(np)) :
            c = (round(r), round(g), round(b), round(w)) \
                if bpp == 4 else                          \
                (round(r), round(g), round(b))
            np[n] = c
        np.write()
        if not fading :
            break

# ------------------------------------------------------------------------------

if args.ledsCount < 1 or args.ledsCount > 1000 :
    print('The number of LEDs must be between 1 and 1000.')
    sys.exit()

if args.brightness < 0 or args.brightness > 100 :
    print('Brightness must be between 0 and 100.')
    sys.exit()

if args.fadeSpeed < 1 or args.fadeSpeed > 100 :
    print('Fade speed must be between 1 and 100.')
    sys.exit()

# Calculate brightness multiplier with gamma correction for better perceived brightness
# Gamma correction makes lower brightness values more usable
brightness_raw = args.brightness / 100.0
# Apply gamma correction (2.2 is standard, but 2.5 works better for bright LEDs)
brightness_mult = brightness_raw ** 2.5

# Convert fade speed (1-100) to transition steps
# Higher fade speed = fewer steps = faster transitions
# Uses exponential curve: 1 (slowest) -> 200 steps, 50 (medium) -> 70 steps, 100 (fastest) -> 10 steps
# Formula: steps = 10 + 190 * ((100 - fadeSpeed) / 99) ^ 1.5
fade_speed_normalized = (100 - args.fadeSpeed) / 99.0
fade_steps = int(10 + 190 * (fade_speed_normalized ** 1.5))

try :
    from neopixel import NeoPixel
    print('NeoPixel initialized. Click Stop button to halt animation.')
except :
    print('Unable to load the "neopixel" library. You must install it.')
    sys.exit()

# Get NeoPixel ORDER tuple and bpp from pixel_order string
order_tuple, bpp = get_neopixel_order(args.pixel_order)
NeoPixel.ORDER = order_tuple
np             = NeoPixel( pin    = Pin(args.pin),
                           n      = args.ledsCount,
                           bpp    = bpp,
                           timing = int(args.frequency) )
(r, g, b, w)   = (0.0, 0.0, 0.0, 0.0)

try :

    if args.staticWhite :
        setColor(255, 255, 255, 255)
        print('LEDs set to static white light. Press Stop to turn off.')
        while True :
            sleep_ms(100)  # Sleep allows interrupt processing
    else :
        print('Starting rainbow fade animation...')
        while True :
            setColor(255, 0, 0, 0, True)
            setColor(0, 255, 0, 50, True)
            setColor(0, 0, 255, 100, True)
            setColor(255, 255, 0, 150, True)
            setColor(80, 0, 80, 100, True)
            setColor(0, 255, 255, 50, True)
            # Small sleep between cycles to allow interrupts
            sleep_ms(10)

except KeyboardInterrupt :
    print('\nStopping LEDs...')
    c = (0, 0, 0, 0) if bpp == 4 else (0, 0, 0)
    np.fill(c)
    np.write()
    print('LEDs turned off.')
