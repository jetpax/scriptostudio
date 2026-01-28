

print("ES8311 Audio Codec - Play Sound")
print("=" * 40)

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 5,    # Show interrupt button after 5 seconds

    info    = dict(
        name        = 'ES8311 Play Sound',
        version     = [1, 0, 0],
        category    = 'Audio',
        description = '''Plays a test tone through the ES8311 mono audio codec.
                        Generates a sine wave at the specified frequency and plays it for the specified duration.
                        Requires ES8311 hardware connected via I2C (control) and I2S (audio data).''',
        author      = 'jetpax',
        mail        = 'jep@alphabetiq.com'
    ),
    
    args    = dict(
        frequency   = dict( label    = 'Frequency (Hz):',
                           type     = int,
                           value    = 440 ),      # A4 note
        duration    = dict( label    = 'Duration (seconds):',
                           type     = float,
                           value    = 2.0 ),
        volume      = dict( label    = 'Volume (0-100%):',
                           type     = int,
                           value    = 50 )
    )

)

# === END_CONFIG_PARAMETERS ===

import machine
import math
import time
from lib import hw_config

# Load board configuration
config = hw_config.init()
es8311_hw = hw_config.get_hardware('es8311')

if not es8311_hw:
    print("ERROR: ES8311 hardware not found in board configuration!")
    print("This script requires an ES8311 audio codec.")
    raise SystemExit

print(f"Board: {config.get('board_name', 'Unknown')}")
print(f"ES8311 found in configuration")

# Get ES8311 pin configuration
i2c_bus_name = es8311_hw.get('i2c', 'i2c0')
i2c_addr = int(es8311_hw.get('i2c_address', '0x18'), 16)
pins = es8311_hw['pins']

# Get I2C bus configuration
i2c_hw = hw_config.get_hardware(i2c_bus_name)
if not i2c_hw:
    print(f"ERROR: I2C bus '{i2c_bus_name}' not found!")
    raise SystemExit

i2c_pins = i2c_hw['pins']
print(f"I2C: SDA={i2c_pins['sda']}, SCL={i2c_pins['scl']}")
print(f"ES8311 I2C address: 0x{i2c_addr:02x}")
print(f"I2S pins: DSDIN={pins['dsdin']}, LRCK={pins['lrck']}, ASDOUT={pins['asdout']}, SCLK={pins['sclk']}, MCLK={pins['mclk']}")

# Initialize I2C for ES8311 control
i2c = machine.I2C(0, sda=machine.Pin(i2c_pins['sda']), scl=machine.Pin(i2c_pins['scl']), freq=400000)

# === CRITICAL: Match ESP32-P4 example initialization order ===
# C example order: gpio_init() -> i2s_driver_init() -> es8311_codec_init()
# This means I2S clocks must be running BEFORE configuring ES8311!
# The C example uses: 16kHz sample rate, 384x MCLK multiple (MCLK = 6.144MHz)

# ES8311 register addresses (from datasheet)
ES8311_REG_00 = 0x00  # Chip reset/control
ES8311_REG_01 = 0x01  # Clock manager
ES8311_REG_02 = 0x02  # Clock divider/multiplier
ES8311_REG_03 = 0x03  # ADC speed mode / OSR
ES8311_REG_04 = 0x04  # DAC OSR
ES8311_REG_05 = 0x05  # ADC/DAC clock divider
ES8311_REG_06 = 0x06  # BCLK divider
ES8311_REG_07 = 0x07  # LRCK divider high
ES8311_REG_08 = 0x08  # LRCK divider low
ES8311_REG_09 = 0x09  # SDP input format
ES8311_REG_0A = 0x0A  # SDP output format
ES8311_REG_0B = 0x0B  # System control
ES8311_REG_0C = 0x0C  # System control
ES8311_REG_0D = 0x0D  # Power management
ES8311_REG_0E = 0x0E  # ADC/PGA power
ES8311_REG_0F = 0x0F  # Low power control
ES8311_REG_10 = 0x10  # System control
ES8311_REG_11 = 0x11  # System control
ES8311_REG_12 = 0x12  # System control
ES8311_REG_13 = 0x13  # System control
ES8311_REG_14 = 0x14  # System control / Input select
ES8311_REG_15 = 0x15  # ADC control
ES8311_REG_16 = 0x16  # ADC control
ES8311_REG_17 = 0x17  # ADC volume
ES8311_REG_1B = 0x1B  # ADC HPF stage1 coeff
ES8311_REG_1C = 0x1C  # ADC HPF stage2 coeff
ES8311_REG_31 = 0x31  # DAC mute control
ES8311_REG_32 = 0x32  # DAC volume
ES8311_REG_33 = 0x33  # DAC control
ES8311_REG_34 = 0x34  # DRC enable
ES8311_REG_35 = 0x35  # DRC levels
ES8311_REG_36 = 0x36  # DAC Control 1 (output mode)
ES8311_REG_37 = 0x37  # DAC ramp rate / EQ bypass / DAC Control 2
ES8311_REG_44 = 0x44  # GPIO / Data source selection
ES8311_REG_45 = 0x45  # GPIO control

def es8311_write(reg, value):
    """Write a byte to ES8311 register"""
    try:
        i2c.writeto_mem(i2c_addr, reg, bytes([value]))
        return True
    except Exception as e:
        print(f"Error writing register 0x{reg:02x}: {e}")
        return False

def es8311_read(reg):
    """Read a byte from ES8311 register"""
    try:
        data = i2c.readfrom_mem(i2c_addr, reg, 1)
        return data[0]
    except Exception as e:
        print(f"Error reading register 0x{reg:02x}: {e}")
        return None

print("\nConfiguring ES8311...")

# Check if ES8311 is present
try:
    test_reg = es8311_read(ES8311_REG_00)
    if test_reg is None:
        print("ERROR: Cannot communicate with ES8311 via I2C!")
        print("Check I2C connections and address.")
        raise SystemExit
    print(f"ES8311 detected (REG_00 = 0x{test_reg:02x})")
except Exception as e:
    print(f"ERROR: I2C communication failed: {e}")
    raise SystemExit

# Software reset sequence (from datasheet section 9.1 and ESP-ADF)
print("Performing software reset...")
es8311_write(ES8311_REG_00, 0x1F)  # Set all reset bits, CSM_ON=0
time.sleep_ms(10)
es8311_write(ES8311_REG_00, 0x00)  # Clear reset bits, CSM_ON=0
time.sleep_ms(10)
es8311_write(ES8311_REG_00, 0x80)  # CSM_ON=1, start state machine (slave mode, MSC=0)

# Additional initialization from ESP-ADF es8311_codec_init()
print("Initializing ES8311 registers...")
es8311_write(ES8311_REG_13, 0x10)  # System control
es8311_write(ES8311_REG_1B, 0x0A)  # ADC HPF stage1 coeff
es8311_write(ES8311_REG_1C, 0x6A)  # ADC HPF stage2 coeff, dynamic HPF

# Power up analog circuits - will be done in es8311_start() sequence
# Skip here, will be set properly when enabling DAC

# === MATCHING ESP32-P4 EXAMPLE INITIALIZATION ORDER ===
# Step 1: Enable power amplifier (gpio_init in C example)
print("\n=== Step 1: Enable PA (matching C example gpio_init) ===")
pa_enable_pin = machine.Pin(53, machine.Pin.OUT)
pa_enable_pin.value(1)  # Set HIGH to enable PA
print("Power amplifier enabled (GPIO53 = HIGH)")
time.sleep_ms(50)

# Step 2: Start I2S clocks BEFORE configuring ES8311!
# The C example uses: 16kHz sample rate, 384x MCLK multiple
# MCLK = 16000 * 384 = 6.144MHz
print("\n=== Step 2: Initialize I2S FIRST (matching C example i2s_driver_init) ===")
print("  C example uses: 16kHz, 384x MCLK = 6.144MHz")
print("  We'll try similar parameters...")

# Use 16kHz like the C example for best compatibility
sample_rate = 16000
bits_per_sample = 16
mclk_multiple = 384  # Match C example
mclk_freq = sample_rate * mclk_multiple  # 6.144MHz

# Generate MCLK using PWM BEFORE I2S init
print(f"Starting MCLK at {mclk_freq}Hz ({mclk_multiple}x ratio)...")
mclk_pwm = machine.PWM(machine.Pin(pins['mclk']), freq=mclk_freq, duty_u16=32768)
actual_mclk_freq = mclk_pwm.freq()
print(f"MCLK target: {mclk_freq}Hz, actual: {actual_mclk_freq}Hz")
time.sleep_ms(50)

# Initialize I2S to start BCLK/LRCK clocks
print("Initializing I2S (to start BCLK/LRCK)...")
i2s = machine.I2S(
    0,
    sck=machine.Pin(pins['sclk']),
    ws=machine.Pin(pins['lrck']),
    sd=machine.Pin(pins['dsdin']),
    mode=machine.I2S.TX,
    bits=bits_per_sample,
    format=machine.I2S.STEREO,
    rate=sample_rate,
    ibuf=40000
)

# Send dummy data to ensure I2S clocks are actually running
print("Starting I2S clocks with dummy data...")
dummy_buffer = bytearray(4096)
i2s.write(dummy_buffer)
time.sleep_ms(100)  # Let clocks stabilize
print("I2S clocks should now be running (BCLK, LRCK)")

# NOW configure ES8311 (after clocks are running!)
print("\n=== Step 3: Configure ES8311 (matching C example es8311_codec_init) ===")
print("  CRITICAL: I2S clocks must be running for ES8311 to configure properly!")

# Configure ES8311 clocks for 16kHz sample rate with 384x MCLK multiple
# (matching C example parameters)
print("Configuring ES8311 clocks...")
print(f"Using {sample_rate}Hz sample rate with {mclk_multiple}x MCLK multiple")
print(f"MCLK frequency: {actual_mclk_freq}Hz")

es8311_write(ES8311_REG_01, 0x3C)  # MCLK_SEL=0 (from MCLK pin), MCLK_ON=1, BCLK_ON=1, CLKDAC_ON=1
es8311_write(ES8311_REG_02, 0x00)  # DIV_PRE=0, MULT_PRE=0 (no division/multiplication)
es8311_write(ES8311_REG_03, 0x10)  # ADC FSMODE and OSR (required for 48kHz)
es8311_write(ES8311_REG_04, 0x10)  # DAC OSR (required for 48kHz)
es8311_write(ES8311_REG_05, 0x00)  # ADC/DAC divider = 0 (divide by 1)
time.sleep_ms(10)  # Let clocks stabilize

# Configure I2S format (slave mode, I2S format, 16-bit)
print("Configuring I2S format...")
# Register 0x09: SDP Input Format
# Bit 7: SDP_IN_SEL=0 (left channel to DAC)
# Bit 6: SDP_IN_MUTE=1 (muted initially, will unmute later)
# Bits 5:3: SDP_IN_WL=011 (16-bit word length)
# Bits 2:0: SDP_IN_FMT=000 (I2S format)
# 0x4C = 0100 1100 = left channel, muted, 16-bit, I2S
es8311_write(ES8311_REG_09, 0x4C)  # I2S format, 16-bit, left channel, MUTED initially
# Register 0x0A: SDP Output Format (for ADC, not used for DAC playback)
es8311_write(ES8311_REG_0A, 0x4C)  # I2S format, 16-bit output, MUTED initially

# Enable DAC - following ESP-ADF es8311_start() sequence for DAC mode
print("Enabling DAC...")
# Following ESP-ADF es8311_start() sequence exactly
# Unmute SDP input/output for DAC (read-modify-write as ESP-ADF does)
reg_09 = es8311_read(ES8311_REG_09)
reg_0A = es8311_read(ES8311_REG_0A)
# Clear SDP_IN_MUTE and SDP_OUT_MUTE bits (bit 6)
dac_iface = reg_09 & 0xBF  # Clear bit 6 (SDP_IN_MUTE)
adc_iface = reg_0A & 0xBF  # Clear bit 6 (SDP_OUT_MUTE)
# For DAC mode, unmute DAC input
dac_iface &= ~(1 << 6)  # Clear SDP_IN_MUTE (unmute)
es8311_write(ES8311_REG_09, dac_iface)
es8311_write(ES8311_REG_0A, adc_iface)

es8311_write(ES8311_REG_17, 0xBF)  # ADC volume (set to 0dB)
es8311_write(ES8311_REG_0E, 0x02)  # System control (from ESP-ADF)
# REG_12: System control / Enable DAC
# According to ESP-ADF header: "system, Enable DAC"
# ESP-ADF sets this to 0x00, but let's verify it's correct
es8311_write(ES8311_REG_12, 0x00)  # Enable DAC (as per ESP-ADF)
es8311_write(ES8311_REG_14, 0x1A)  # System control / Input select (no DMIC)

# REG_0D: Set VMIDSEL=01 (normal speed charge) as per ESP-ADF
es8311_write(ES8311_REG_0D, 0x01)  # VMIDSEL=01 (normal speed charge), all powered
es8311_write(ES8311_REG_15, 0x40)  # ADC control

# Configure DAC output for differential mode (OUTP/OUTN push-pull)
# REG_33: DAC offset control - may affect differential output
# REG_36: DAC Control 1 - ensure normal differential output mode
# REG_37: DAC Control 2 - DAC_EQBYPASS=1 (bypass EQ), ensure differential output
print("Configuring DAC output for differential mode (OUTP/OUTN push-pull)...")
# REG_33: DAC offset - try setting to ensure proper differential output
# Default is usually 0x00, but let's verify
es8311_write(ES8311_REG_33, 0x00)  # DAC offset = 0 (default)
es8311_write(ES8311_REG_36, 0x00)  # Normal DAC output mode (differential)
es8311_write(ES8311_REG_37, 0x08)  # DAC_EQBYPASS=1 (bypass EQ, as per ESP-ADF)
# Note: REG_37 bits 7:6 control DAC mixer selection - should be 00 for differential
reg_37_val = es8311_read(ES8311_REG_37)
if (reg_37_val & 0xC0) != 0x00:
    print(f"  WARNING: REG_37 = 0x{reg_37_val:02x}, clearing DAC mixer bits for differential mode")
    es8311_write(ES8311_REG_37, reg_37_val & 0x3F)  # Clear bits 7:6 (DACMIXSEL)

# Read back to verify
reg_33_val = es8311_read(ES8311_REG_33)
reg_36_val = es8311_read(ES8311_REG_36)
print(f"  REG_33 (DAC Offset): 0x{reg_33_val:02x}")
print(f"  REG_36 (DAC Control 1): 0x{reg_36_val:02x}")
print(f"  REG_37 (DAC Control 2): 0x{reg_37_val:02x}")
print(f"  Note: Schematic shows NS4150B Class D amp with differential inputs/outputs")
print(f"  If both NS4150B outputs (OUT+/OUT-) are synchronized:")
print(f"    1. Check ES8311 OUTP vs OUTN directly - should be inverted (differential)")
print(f"    2. If ES8311 outputs are same, ES8311 may not be outputting differential")
print(f"    3. NS4150B might be in fault/protection mode")
print(f"    4. Measure NS4150B OUT+ vs OUT- differentially (not to ground)")
print(f"  NS4150B CTRL (GPIO53) should be HIGH for normal operation")

es8311_write(ES8311_REG_45, 0x00)  # GPIO control

# REG_44: Set data routing for DAC-only playback
# Bit 7: ADC2DAC_SEL=0 (DAC from SDP input, not ADC loopback)
# Bits 6:4: ADCDAT_SEL - not used for DAC-only
# For DAC-only playback, use 0x00 (ADC2DAC_SEL=0, clear other bits)
# ESP-ADF uses 0x58 for ADC+DAC mode, but for DAC-only try 0x00
es8311_write(ES8311_REG_44, 0x00)  # DAC from SDP, no ADC routing

# REG_31: Unmute DAC completely
es8311_write(ES8311_REG_31, 0x00)  # DAC_DSMMUTE=0, DAC_DEMMUTE=0 (unmuted)

time.sleep_ms(100)  # Allow DAC to stabilize

# Verify configuration
print("Verifying ES8311 configuration...")
reg_01 = es8311_read(ES8311_REG_01)
reg_0D = es8311_read(ES8311_REG_0D)
reg_09 = es8311_read(ES8311_REG_09)
reg_31 = es8311_read(ES8311_REG_31)
reg_32 = es8311_read(ES8311_REG_32)
reg_36 = es8311_read(ES8311_REG_36)
reg_37 = es8311_read(ES8311_REG_37)
reg_44 = es8311_read(ES8311_REG_44)
reg_12 = es8311_read(ES8311_REG_12)
print(f"  REG_01 (Clock): 0x{reg_01:02x} (MCLK_ON={(reg_01&0x20)>>5}, BCLK_ON={(reg_01&0x10)>>4}, CLKDAC_ON={(reg_01&0x04)>>2})")
print(f"  REG_0D (Power): 0x{reg_0D:02x} (VMIDSEL={reg_0D&0x03}, should be 1)")
print(f"  REG_09 (SDP In): 0x{reg_09:02x} (MUTE={(reg_09&0x40)>>6}, WL={(reg_09&0x1C)>>2}, FMT={reg_09&0x03}, SDP_IN_SEL={(reg_09&0x80)>>7})")
print(f"  REG_12 (Enable DAC): 0x{reg_12:02x}")
print(f"  REG_31 (DAC Mute): 0x{reg_31:02x} (DSMMUTE={(reg_31&0x40)>>6}, DEMMUTE={(reg_31&0x20)>>5})")
print(f"  REG_32 (DAC Volume): 0x{reg_32:02x} (0xBF = 0dB)")
print(f"  REG_36 (DAC Control 1): 0x{reg_36:02x} (should be 0x00 for differential)")
print(f"  REG_37 (DAC Control 2): 0x{reg_37:02x} (EQBYPASS={(reg_37&0x08)>>3}, DAC mixer bits 7:6={(reg_37&0xC0)>>6}, should be 00)")
print(f"  REG_44 (Data Source): 0x{reg_44:02x} (ADC2DAC_SEL={(reg_44&0x80)>>7}, should be 0)")

# I2S was already initialized in Step 2 above (before ES8311 config)
# Print current configuration
print(f"\nI2S Configuration Summary:")
print(f"  Sample rate: {sample_rate}Hz")
print(f"  Bits per sample: {bits_per_sample}")
print(f"  MCLK frequency: {actual_mclk_freq}Hz ({mclk_multiple}x ratio)")
print(f"  Frequency to play: {args.frequency}Hz")
print(f"  Duration: {args.duration}s")

# Set DAC volume AFTER everything is enabled and clocks are running
# Note: ES8311 volume register: 0x00 = -95.5dB (mute), 0xBF = 0dB, 0xFF = +32dB
# For Class D amps, we may need higher volume
print("Setting DAC volume...")
# Try maximum volume first to ensure signal is strong enough for Class D amp
volume_reg = 0xFF  # Maximum volume (+32dB) - we'll reduce if needed
# volume_reg = 0xBF + int((args.volume - 50) * 2)  # Original calculation
# volume_reg = max(0x00, min(0xFF, volume_reg))  # Clamp to valid range
es8311_write(ES8311_REG_32, volume_reg)
print(f"Volume set to MAXIMUM (register 0x{volume_reg:02x} = +32dB)")
print(f"  (Original setting was {args.volume}%, but using max for Class D amp)")
time.sleep_ms(50)  # Let volume register settle

# Final verification before playback
print("\nFinal register check before playback...")
final_reg_01 = es8311_read(ES8311_REG_01)
final_reg_09 = es8311_read(ES8311_REG_09)
final_reg_0A = es8311_read(ES8311_REG_0A)
final_reg_0D = es8311_read(ES8311_REG_0D)
final_reg_31 = es8311_read(ES8311_REG_31)
final_reg_32 = es8311_read(ES8311_REG_32)
final_reg_44 = es8311_read(ES8311_REG_44)
print(f"  REG_01 (Clock): 0x{final_reg_01:02x} (MCLK_ON={(final_reg_01&0x20)>>5}, BCLK_ON={(final_reg_01&0x10)>>4}, CLKDAC_ON={(final_reg_01&0x04)>>2})")
print(f"  REG_0D (Power): 0x{final_reg_0D:02x} (VMIDSEL={final_reg_0D&0x03})")
print(f"  REG_09 (SDP In): 0x{final_reg_09:02x} (MUTE={(final_reg_09&0x40)>>6}, should be 0)")
print(f"  REG_0A (SDP Out): 0x{final_reg_0A:02x} (MUTE={(final_reg_0A&0x40)>>6}, should be 0)")
print(f"  REG_31 (DAC Mute): 0x{final_reg_31:02x} (DSMMUTE={(final_reg_31&0x40)>>6}, DEMMUTE={(final_reg_31&0x20)>>5}, should both be 0)")
print(f"  REG_32 (DAC Volume): 0x{final_reg_32:02x}")
print(f"  REG_44 (Data Source): 0x{final_reg_44:02x} (ADC2DAC_SEL={(final_reg_44&0x80)>>7}, should be 0)")

# Force unmute if still muted
if (final_reg_09 & 0x40):
    print("  FIXING: SDP_IN_MUTE is still set, unmuting...")
    es8311_write(ES8311_REG_09, final_reg_09 & 0xBF)
    time.sleep_ms(10)

if (final_reg_0A & 0x40):
    print("  FIXING: SDP_OUT_MUTE is still set, unmuting...")
    es8311_write(ES8311_REG_0A, final_reg_0A & 0xBF)
    time.sleep_ms(10)

if (final_reg_31 & 0x60):
    print("  FIXING: DAC is muted, unmuting...")
    es8311_write(ES8311_REG_31, 0x00)
    time.sleep_ms(10)

# Verify clocks are enabled
if not (final_reg_01 & 0x20):
    print("  ERROR: MCLK_ON is not set!")
if not (final_reg_01 & 0x10):
    print("  ERROR: BCLK_ON is not set!")
if not (final_reg_01 & 0x04):
    print("  ERROR: CLKDAC_ON is not set!")

# Debug: Check ES8311 output configuration
print("\n=== ES8311 Output Debug ===")
print("  On scope, check ES8311 OUTP vs OUTN directly (before NS4150B):")
print("  - Should see differential signals (inverted relative to each other)")
print("  - If both are same, ES8311 may not be outputting differential")
print("  - NS4150B OUT+ vs OUT- should be push-pull (out of phase)")
print("  - If NS4150B outputs synchronized, check NS4150B CTRL (GPIO53) is HIGH")
print("  - NS4150B might be in fault mode if inputs not differential")

print("\nPlaying sound...")
print(f"Using {sample_rate}Hz sample rate with {mclk_multiple}x MCLK multiple")
print("Note: Matching ESP32-P4 C example initialization order and parameters")

# Debug: Send very low frequency tone (1Hz) that's easy to see on scope
# This will help verify audio is actually being output
print("\n=== DEBUG: Low frequency test (1Hz for 2 seconds) ===")
print("  On scope, you should see PWM duty cycle varying slowly")
print("  If duty cycle changes, audio is working (speaker may be broken)")
print("  If duty cycle is constant, ES8311 isn't outputting audio properly")
low_freq = 1  # 1Hz - very slow, easy to see on scope
low_freq_samples = sample_rate * 2  # 2 seconds
low_freq_buffer = bytearray(low_freq_samples * 4)
samples_per_period_lf = sample_rate // low_freq
max_amp = 0x7FFF  # Maximum amplitude for visibility
for i in range(low_freq_samples):
    phase = (i % samples_per_period_lf) / samples_per_period_lf * 2 * math.pi
    sample = int(max_amp * math.sin(phase))
    sample_16bit = max(-32768, min(32767, sample))
    idx = i * 4
    low_freq_buffer[idx] = sample_16bit & 0xFF
    low_freq_buffer[idx + 1] = (sample_16bit >> 8) & 0xFF
    low_freq_buffer[idx + 2] = sample_16bit & 0xFF
    low_freq_buffer[idx + 3] = (sample_16bit >> 8) & 0xFF

print("Playing 1Hz tone - watch scope for PWM duty cycle variation...")
for i in range(0, len(low_freq_buffer), 4096):
    chunk = low_freq_buffer[i:i+4096]
    i2s.write(chunk)
print("1Hz test complete - did you see PWM duty cycle vary on scope?")
time.sleep_ms(500)

# DC test tone (constant value)
print("\n=== DC test tone (0.5 seconds) ===")
print("  Constant value - PWM duty cycle should be constant")
dc_test_samples = sample_rate // 2  # 0.5 second
dc_test_buffer = bytearray(dc_test_samples * 4)
dc_test_value = 0x6000  # ~37.5% of full scale
for i in range(dc_test_samples):
    idx = i * 4
    dc_test_buffer[idx] = dc_test_value & 0xFF
    dc_test_buffer[idx + 1] = (dc_test_value >> 8) & 0xFF
    dc_test_buffer[idx + 2] = dc_test_value & 0xFF
    dc_test_buffer[idx + 3] = (dc_test_value >> 8) & 0xFF

bytes_written = 0
for i in range(0, len(dc_test_buffer), 4096):
    chunk = dc_test_buffer[i:i+4096]
    written = i2s.write(chunk)
    bytes_written += written
print(f"DC test: wrote {bytes_written} bytes to I2S")
time.sleep_ms(200)

print("\nNow playing sine wave...")

# Generate sine wave samples
samples_per_period = sample_rate // args.frequency
num_samples = int(sample_rate * args.duration)
samples_per_period = max(1, samples_per_period)  # Avoid division by zero

# Generate audio buffer - I2S STEREO format: L R L R L R ...
# Each sample is 16-bit, so 4 bytes per stereo frame (2 bytes left + 2 bytes right)
audio_buffer = bytearray(num_samples * 2 * (bits_per_sample // 8))  # 2x for stereo
max_amplitude = (1 << (bits_per_sample - 1)) - 1

for i in range(num_samples):
    # Generate sine wave
    phase = (i % samples_per_period) / samples_per_period * 2 * math.pi
    sample = int(max_amplitude * math.sin(phase))
    
    # Convert to 16-bit signed integer
    sample_16bit = max(-32768, min(32767, sample))
    
    # I2S STEREO format: Left channel first, then Right channel
    # Each frame: [Left_LSB, Left_MSB, Right_LSB, Right_MSB]
    idx = i * 4  # 4 bytes per stereo frame
    
    # Left channel (ES8311 will use this via SDP_IN_SEL=0)
    # I2S transmits MSB-first, but MicroPython buffer is little-endian
    # So we put LSB first in buffer, which gets transmitted MSB-first
    audio_buffer[idx] = sample_16bit & 0xFF  # LSB
    audio_buffer[idx + 1] = (sample_16bit >> 8) & 0xFF  # MSB
    
    # Right channel - send same data to both channels for mono output
    audio_buffer[idx + 2] = sample_16bit & 0xFF  # LSB
    audio_buffer[idx + 3] = (sample_16bit >> 8) & 0xFF  # MSB

# Play audio - stream in chunks to ensure continuous playback
try:
    chunk_size = 4096  # 4KB chunks
    total_written = 0
    
    print(f"Streaming {len(audio_buffer)} bytes in {len(audio_buffer) // chunk_size + 1} chunks...")
    for i in range(0, len(audio_buffer), chunk_size):
        chunk = audio_buffer[i:i+chunk_size]
        bytes_written = i2s.write(chunk)
        total_written += bytes_written
        if i == 0:
            print(f"First chunk written: {bytes_written} bytes")
            # Print first few bytes for debugging
            print(f"First 16 bytes: {[hex(b) for b in chunk[:16]]}")
    
    print(f"Sound playback complete! ({total_written} bytes total)")
    
    # Wait longer for audio buffer to drain completely
    time.sleep_ms(500)
except Exception as e:
    print(f"Error during playback: {e}")
    import sys
    sys.print_exception(e)

# Cleanup
print("\nCleaning up...")
i2s.deinit()
mclk_pwm.deinit()  # Stop MCLK generation
pa_enable_pin.value(0)  # Disable PA
print("Power amplifier disabled (GPIO53 = LOW)")
print("MCLK stopped")
print("Done!")
