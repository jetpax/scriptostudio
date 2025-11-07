

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,    # No interrupt button for this test

    info    = dict(
        # ----------------------------------------------------------------------
        name        = 'CAN/TWAI Loopback Test',
        version     = [1, 0, 0],
        category    = 'CAN/TWAI',
        description = 'Test the CAN/TWAI module with internal loopback mode. This test verifies that the CAN module is properly integrated and working. No external hardware is required - the test uses internal loopback mode within the ESP32\'s TWAI controller. For real CAN bus communication with OpenInverter, you\'ll need: A CAN transceiver (SN65HVD230 recommended for 3.3V), 120Ω termination resistors at both ends of the bus, and use mode=NORMAL instead of LOOPBACK.',
        author      = 'Scriptomatic Team',
        mail        = 'support@scriptomatic.io',
        www         = 'https://github.com/straga/micropython-esp32-twai'
        # ----------------------------------------------------------------------
    ),
    
    args    = dict(
        # ----------------------------------------------------------------------
        can_mode       = dict( label    = 'CAN Mode:',
                              type     = dict,
                              items    = dict( 
                                  loopback = "LOOPBACK - Internal test (no hardware)",
                                  normal   = "NORMAL - Real CAN bus (requires transceiver)",
                                  silent   = "SILENT - Listen-only mode (monitor bus)"
                              ),
                              value    = 'loopback' ),
        # ----------------------------------------------------------------------
        tx_pin         = dict( label    = 'TX Pin (GPIO):',
                              type     = int,
                              value    = 5 ),
        # ----------------------------------------------------------------------
        rx_pin         = dict( label    = 'RX Pin (GPIO):',
                              type     = int,
                              value    = 4 ),
        # ----------------------------------------------------------------------
        bitrate        = dict( label    = 'Bitrate (bps):',
                              type     = dict,
                              items    = dict(
                                  b125k  = "125000 - 125 kbps",
                                  b250k  = "250000 - 250 kbps",
                                  b500k  = "500000 - 500 kbps (CANopen standard)",
                                  b1000k = "1000000 - 1 Mbps"
                              ),
                              value    = 'b500k' ),
        # ----------------------------------------------------------------------
        num_messages   = dict( label    = 'Number of test messages:',
                              type     = int,
                              value    = 5 ),
        # ----------------------------------------------------------------------
        show_modes     = dict( label    = 'Show available CAN modes?',
                              type     = bool,
                              value    = False )
        # ----------------------------------------------------------------------
    )

)

# === END_CONFIG_PARAMETERS ===


import CAN
import time

termWidth=40

print("="*termWidth)
print("CAN/TWAI Loopback Test")
print("="*termWidth)

# Map bitrate IDs to actual values
bitrate_map = {
    'b125k': 125000,
    'b250k': 250000,
    'b500k': 500000,
    'b1000k': 1000000
}

# Map mode IDs to CAN constants
mode_map = {
    'loopback': CAN.LOOPBACK,
    'normal': CAN.NORMAL,
    'silent': CAN.SILENT
}

# Get configuration values
selected_mode = mode_map[args.can_mode]
selected_bitrate = bitrate_map[args.bitrate]
mode_name = args.can_mode.upper()

# Show available CAN modes if requested
if args.show_modes:
    print("\nAvailable CAN modes and constants:")
    print("-" * termWidth)
    for attr in dir(CAN):
        if not attr.startswith('_') and attr.isupper():
            print(f"  CAN.{attr} = {getattr(CAN, attr)}")
    print()

# Initialize CAN
print("\nInitializing CAN...")
print(f"  TX Pin: GPIO{args.tx_pin}")
print(f"  RX Pin: GPIO{args.rx_pin}")
print(f"  Bitrate: {selected_bitrate} bps")
print(f"  Mode: {mode_name}")

if args.can_mode == 'loopback':
    print("  Note: Internal loopback - no hardware needed")
elif args.can_mode == 'normal':
    print("  Note: Requires CAN transceiver and other devices on bus")
elif args.can_mode == 'silent':
    print("  Note: Listen-only mode - will not transmit")

can = CAN(
    0,                      # CAN bus 0
    extframe=False,         # Standard 11-bit IDs
    tx=args.tx_pin,         # TX pin from config
    rx=args.rx_pin,         # RX pin from config
    mode=selected_mode,     # Mode from config
    bitrate=selected_bitrate,  # Bitrate from config
    auto_restart=False
)

print("✓ CAN initialized\n")

# Test 1: Single message
print("Test 1: Single message")
print("-" * termWidth)

test_id = 0x123
test_data = [0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88]

print(f"Sending: ID=0x{test_id:03X}, Data={[hex(b) for b in test_data]}")
can.send(test_data, test_id)

# Wait a bit for message
time.sleep_ms(10)

# Check for received message
if can.any():
    msg_id, extended, rtr, payload = can.recv()
    print(f"Received: ID=0x{msg_id:03X}, Data={[hex(b) for b in payload]}")
    
    # Verify
    if msg_id == test_id and list(payload) == test_data:
        print("✅ Test 1 PASSED - Data matches!\n")
    else:
        print("❌ Test 1 FAILED - Data mismatch!\n")
else:
    print("❌ Test 1 FAILED - No message received")
    if args.can_mode == 'silent':
        print("   (Silent mode cannot receive own transmissions)\n")
    else:
        print("   (Check mode and hardware setup)\n")

# Test 2: Multiple messages
print("Test 2: Multiple messages")
print("-" * termWidth)

success = 0
total = args.num_messages

for i in range(total):
    test_id = 0x100 + i
    test_data = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7]
    
    can.send(test_data, test_id)
    time.sleep_ms(5)
    
    if can.any():
        msg_id, extended, rtr, payload = can.recv()
        if msg_id == test_id and list(payload) == test_data:
            print(f"  Message {i+1}: ✅ (ID=0x{msg_id:03X})")
            success += 1
        else:
            print(f"  Message {i+1}: ❌ (Data mismatch)")
    else:
        print(f"  Message {i+1}: ❌ (No response)")

print(f"\nResult: {success}/{total} messages successful")

# Final result
if success == total:
    print("\n" + "="*termWidth)
    print("🎉 ALL TESTS PASSED - CAN/TWAI is working!")
    print("="*termWidth)
else:
    print("\n" + "="*termWidth)
    print("⚠️  SOME TESTS FAILED")
    print("="*termWidth)
    print("\nTroubleshooting:")
    print(f"  • Mode: {mode_name}")
    
    if args.can_mode == 'loopback':
        print("  • Loopback uses internal ESP32 feedback (no hardware needed)")
        print("  • Check firmware includes CAN module (rebuild if needed)")
    elif args.can_mode == 'normal':
        print("  • Normal mode requires CAN transceiver and other devices")
        print("  • Verify transceiver is powered and connected")
        print("  • Check for 120Ω termination at both ends of bus")
        print("  • Verify CANH/CANL wiring")
    elif args.can_mode == 'silent':
        print("  • Silent mode is listen-only (cannot receive own messages)")
        print("  • Need another device transmitting on the bus")
    
    print("\nFor OpenInverter communication:")
    print("  1. Get CAN transceiver (SN65HVD230 for 3.3V)")
    print("  2. Wire: ESP32 GPIO5→TX, GPIO4←RX, 3.3V→VCC, GND→GND")
    print("  3. Connect CANH/CANL to OpenInverter")
    print("  4. Add 120Ω termination resistors")
    print("  5. Use mode=NORMAL")
    print("  6. See can_helpers.py for SDO functions")

print("\nTest complete!")
