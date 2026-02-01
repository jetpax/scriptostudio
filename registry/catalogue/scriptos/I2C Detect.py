


# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,

    info    = dict(
        name        = 'I2C Detect',
        version     = [1, 0, 0],
        category    = 'Hardware',
        description = 'Scan the I2C bus and display detected devices in Linux i2cdetect format. Shows a grid of all addresses 0x00-0x77 with -- for no device and the address for detected devices.',
        author      = 'JetPax',
        mail        = 'jep@alphabetiq.com',
        www         = 'https://github.com/jetpax'
    ),
    
    args    = dict(
        i2c_bus    = dict( label    = 'I2C Bus:',
                          type     = dict,
                          items    = dict( 
                              sensors = "Sensors bus (from board.json)",
                              bus0    = "I2C(0) - Default pins",
                              bus1    = "I2C(1) - Alternate pins"
                          ),
                          value    = 'sensors' ),
        scl_pin    = dict( label    = 'SCL Pin (if not using board config):',
                          type     = list,
                          optional = True ),
        sda_pin    = dict( label    = 'SDA Pin (if not using board config):',
                          type     = list,
                          optional = True ),
        freq       = dict( label    = 'I2C Frequency (Hz):',
                          type     = dict,
                          items    = dict(
                              f100k  = "100000 - Standard mode",
                              f400k  = "400000 - Fast mode",
                              f1m    = "1000000 - Fast mode plus"
                          ),
                          value    = 'f400k' )
    )

)

# === END_CONFIG_PARAMETERS ===


from machine import Pin, I2C
from lib.sys import board

# Frequency mapping
freq_map = {
    'f100k': 100000,
    'f400k': 400000,
    'f1m': 1000000
}

freq = freq_map[args.freq]

# Determine I2C configuration
if args.i2c_bus == 'sensors' and board.has("i2c.sensors"):
    i2c_cfg = board.i2c("sensors")
    scl = i2c_cfg.scl
    sda = i2c_cfg.sda
    bus_id = 0
    print(f"Using board sensors bus: SCL=GPIO{scl}, SDA=GPIO{sda}")
elif args.scl_pin is not None and args.sda_pin is not None:
    scl = args.scl_pin
    sda = args.sda_pin
    bus_id = 0 if args.i2c_bus == 'bus0' else 1
    print(f"Using custom pins: SCL=GPIO{scl}, SDA=GPIO{sda}")
else:
    # ESP32-S3 defaults
    scl = 10
    sda = 11
    bus_id = 0
    print(f"Using default pins: SCL=GPIO{scl}, SDA=GPIO{sda}")

# Initialize I2C
i2c = I2C(bus_id, scl=Pin(scl), sda=Pin(sda), freq=freq)

# Scan the bus
devices = i2c.scan()

# Print header (i2cdetect format)
print()
print(f"     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f")

# Print each row (0x00-0x77)
for row in range(8):
    base = row * 16
    line = f"{row:02x}: "
    
    for col in range(16):
        addr = base + col
        
        # Skip reserved addresses (i2cdetect convention)
        # 0x00-0x02: Reserved for I2C protocol
        # 0x78-0x7F: Reserved for 10-bit addressing
        if addr < 0x03 or addr > 0x77:
            line += "   "
        elif addr in devices:
            line += f"{addr:02x} "
        else:
            line += "-- "
    
    print(line)

# Summary
print()
print(f"Found {len(devices)} device(s):")
for addr in devices:
    print(f"  0x{addr:02x} ({addr})")
