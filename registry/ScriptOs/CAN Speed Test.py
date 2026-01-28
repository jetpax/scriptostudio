

print("Initializing CAN Speed Test...")

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,    # No interrupt button needed for automated test

    info    = dict(
        # ----------------------------------------------------------------------
        name        = 'CAN Speed Test',
        version     = [1, 1, 0],
        category    = 'CAN/TWAI',
        description = '''Measures CAN bus throughput using loopback mode.
                         Tests transmission and reception speed with various frame sizes.
                         Useful for benchmarking CAN performance and validating hardware setup.
                      ''',
        author      = 'jetpax',
        mail        = 'jep@alphabetiq.com',
        www         = 'https://github.com/jetpax/mpDirect'
        # ----------------------------------------------------------------------
    ),
    
    args    = dict(
        # ----------------------------------------------------------------------
        test_mode        = dict( label    = 'Test mode:',
                                type     = dict,
                                items    = dict( mode_both = "TX + RX (loopback)",
                                                mode_tx   = "TX only (no callback)",
                                                mode_rx   = "RX only (listen)" ),
                                value    = 'mode_both' ),
        # ----------------------------------------------------------------------
        bitrate          = dict( label    = 'CAN bitrate:',
                                type     = dict,
                                items    = dict( rate_125k  = "125 kbps",
                                                rate_250k  = "250 kbps",
                                                rate_500k  = "500 kbps",
                                                rate_1000k = "1000 kbps (1 Mbps)" ),
                                value    = 'rate_500k' ),
        # ----------------------------------------------------------------------
        test_duration    = dict( label    = 'Test duration (seconds):',
                                type     = int,
                                value    = 5 ),
        # ----------------------------------------------------------------------
        frame_size       = dict( label    = 'Frame data size (bytes):',
                                type     = dict,
                                items    = dict( size_1 = "1 byte",
                                                size_4 = "4 bytes",
                                                size_8 = "8 bytes (max)" ),
                                value    = 'size_8' ),
        # ----------------------------------------------------------------------
        use_extended     = dict( label    = 'Use extended IDs (29-bit):',
                                type     = bool,
                                value    = False )
        # ----------------------------------------------------------------------
    )

)

# === END_CONFIG_PARAMETERS ===

import CAN
import time
from lib import board

# Parse configuration
bitrates = {'rate_125k': 125000, 'rate_250k': 250000, 'rate_500k': 500000, 'rate_1000k': 1000000}
bitrate = bitrates.get(args.bitrate, 500000)

frame_sizes = {'size_1': 1, 'size_4': 4, 'size_8': 8}
data_size = frame_sizes.get(args.frame_size, 8)

print("="*60)
print("CAN Speed Test - Loopback Mode")
print("="*60)
print(f"Configuration:")
print(f"  Test mode: {args.test_mode.replace('mode_', '').upper()}")
print(f"  Bitrate: {bitrate // 1000} kbps")
print(f"  Duration: {args.test_duration}s")
print(f"  Frame size: {data_size} bytes")
print(f"  Extended IDs: {args.use_extended}")
print("="*60)

# Get board CAN pins
try:
    can_bus = board.can("twai")
    tx_pin = can_bus.tx
    rx_pin = can_bus.rx
    print(f"Board CAN: TX=GPIO{tx_pin}, RX=GPIO{rx_pin}")
except:
    tx_pin = 4
    rx_pin = 5
    print(f"Using default: TX=GPIO{tx_pin}, RX=GPIO{rx_pin}")

# Initialize CAN in loopback mode with configured bitrate
can = CAN(0, tx=tx_pin, rx=rx_pin, bitrate=bitrate, mode=CAN.LOOPBACK, extframe=args.use_extended)
print(f"✓ CAN initialized ({bitrate // 1000} kbps, LOOPBACK mode)")

# Register manager client
handle = CAN.register(CAN.TX_ENABLED)
print(f"✓ Registered client: {handle}")

# Setup RX callback to count frames (only if testing RX)
rx_count = 0
rx_bytes = 0

def on_rx(frame):
    global rx_count, rx_bytes
    rx_count += 1
    rx_bytes += len(frame['data'])

# Set callback based on test mode
if args.test_mode in ['mode_both', 'mode_rx']:
    CAN.set_rx_callback(handle, on_rx)
    print("✓ RX callback enabled")
else:
    print("✓ RX callback disabled (TX-only test)")

CAN.activate(handle)
print(f"✓ Client activated")

# Prepare test frame
test_data = bytes([i & 0xFF for i in range(data_size)])
base_id = 0x100

print("\nStarting speed test...")
print("-"*60)

# Run test
start_time = time.ticks_ms()
tx_count = 0
tx_bytes = 0
errors = 0

end_time = start_time + (args.test_duration * 1000)

# TX test (if enabled)
if args.test_mode in ['mode_both', 'mode_tx']:
    while time.ticks_ms() < end_time:
        frame = {
            'id': base_id + (tx_count % 256),
            'data': test_data,
            'extended': args.use_extended
        }
        
        try:
            CAN.transmit(handle, frame)
            tx_count += 1
            tx_bytes += data_size
        except Exception as e:
            errors += 1
            if errors < 5:  # Only print first few errors
                print(f"TX error: {e}")
        
        # Small delay to prevent overwhelming the queue
        if tx_count % 100 == 0:
            time.sleep_ms(1)
else:
    # RX-only mode: just wait for the duration
    print("RX-only mode: waiting for incoming frames...")
    time.sleep_ms(args.test_duration * 1000)

# Wait for pending RX
time.sleep_ms(200)

# Calculate results
actual_duration = time.ticks_diff(time.ticks_ms(), start_time) / 1000.0
tx_rate = tx_count / actual_duration
rx_rate = rx_count / actual_duration
tx_throughput = (tx_bytes * 8) / actual_duration / 1000  # kbps
rx_throughput = (rx_bytes * 8) / actual_duration / 1000  # kbps
success_rate = (rx_count / tx_count * 100) if tx_count > 0 else 0

# Display results
print("-"*60)
print("Test Results:")
print("="*60)
print(f"Duration:        {actual_duration:.2f}s")
print(f"")
print(f"Transmitted:     {tx_count:,} frames ({tx_bytes:,} bytes)")
print(f"  Rate:          {tx_rate:.1f} frames/sec")
print(f"  Throughput:    {tx_throughput:.1f} kbps")
print(f"")
print(f"Received:        {rx_count:,} frames ({rx_bytes:,} bytes)")
print(f"  Rate:          {rx_rate:.1f} frames/sec")
print(f"  Throughput:    {rx_throughput:.1f} kbps")
print(f"")
print(f"Success Rate:    {success_rate:.1f}%")
print(f"Errors:          {errors}")
print("="*60)

# Theoretical maximum
# CAN 2.0 with configured bitrate and data size:
# Standard frame: ~44 bits overhead + data bits
# Extended frame: ~64 bits overhead + data bits
overhead = 64 if args.use_extended else 44
theoretical_max = bitrate / (overhead + (data_size * 8))
efficiency = (tx_rate / theoretical_max * 100) if theoretical_max > 0 else 0

print(f"\nEfficiency Analysis:")
print(f"  Theoretical max: {theoretical_max:.0f} frames/sec")
print(f"  Achieved:        {efficiency:.1f}% of theoretical")
print("="*60)

# Cleanup
CAN.deactivate(handle)
CAN.unregister(handle)
print("\n✓ Test complete - client cleaned up")
