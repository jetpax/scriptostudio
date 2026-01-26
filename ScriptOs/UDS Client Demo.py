

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,    # No interrupt button for this test

    info    = dict(
        # ----------------------------------------------------------------------
        name        = 'UDS Client Demo',
        version     = [1, 0, 0],
        category    = 'CAN/TWAI',
        description = '''Demonstrates UDS (Unified Diagnostic Services) client for reading data from ECUs.
                         
                         Uses ISO 15765-2 (ISO-TP) for transport and ISO 14229 (UDS) for services.
                         Supports ReadDataByIdentifier (0x22), DiagnosticSessionControl (0x10),
                         TesterPresent (0x3E), and OBD2 modes for compatibility.
                         
                         Configure TX/RX CAN IDs for your ECU. Common configurations:
                         • Standard OBD2: TX=0x7DF (broadcast), RX=0x7E8
                         • Physical addressing: TX=0x7E0, RX=0x7E8
                         • OpenInverter: TX=0x7E0, RX=0x7E8
                      ''',
        author      = 'JetPax',
        mail        = 'jep@alphabetiq.com',
        www         = 'https://github.com/jetpax'
        # ----------------------------------------------------------------------
    ),
    
    args    = dict(
        # ----------------------------------------------------------------------
        can_bus        = dict( label    = 'CAN Bus:',
                              type     = dict,
                              items    = dict( 
                                  bus0 = "CAN 0 (default)",
                                  bus1 = "CAN 1 (ESP32-P4 only)",
                                  bus2 = "CAN 2 (ESP32-P4 only)"
                              ),
                              value    = 'bus0' ),
        # ----------------------------------------------------------------------
        bitrate        = dict( label    = 'Bitrate (bps):',
                              type     = dict,
                              items    = dict(
                                  b250k  = "250000 - 250 kbps",
                                  b500k  = "500000 - 500 kbps (CANopen standard)",
                                  b1000k = "1000000 - 1 Mbps"
                              ),
                              value    = 'b500k' ),
        # ----------------------------------------------------------------------
        tx_id          = dict( label    = 'TX CAN ID (hex):',
                              type     = str,
                              value    = '7E0' ),
        # ----------------------------------------------------------------------
        rx_id          = dict( label    = 'RX CAN ID (hex):',
                              type     = str,
                              value    = '7E8' ),
        # ----------------------------------------------------------------------
        test_mode      = dict( label    = 'Test Mode:',
                              type     = dict,
                              items    = dict(
                                  loopback = "Loopback (no hardware needed)",
                                  normal   = "Normal (requires ECU connection)"
                              ),
                              value    = 'loopback' ),
        # ----------------------------------------------------------------------
        service_test   = dict( label    = 'Service to Test:',
                              type     = dict,
                              items    = dict(
                                  tester_present = "TesterPresent (0x3E) - Session keep-alive",
                                  read_vin       = "ReadDataByIdentifier (0x22) - Read VIN",
                                  session_ctrl   = "DiagnosticSessionControl (0x10) - Change session",
                                  obd2_rpm       = "OBD2 Mode 0x01 - Read Engine RPM"
                              ),
                              value    = 'tester_present' )
        # ----------------------------------------------------------------------
    )

)

# === END_CONFIG_PARAMETERS ===


import CAN
import time
from lib.sys import board
from lib.uds_client import UDSClient, UDSTimeoutError, UDSNegativeResponseError
from lib.uds_services import SESSION_DEFAULT, SESSION_EXTENDED_DIAGNOSTIC

termWidth = 50

print("=" * termWidth)
print("UDS Client Demo")
print("=" * termWidth)

# Check CAN capability
if not board.has("can"):
    print("❌ ERROR: This board does not have CAN capability")
    raise RuntimeError("Board does not have CAN capability")

# Find CAN bus from board config
bus_names = {
    'bus0': ["twai", "can0"],
    'bus1': ["can1"],
    'bus2': ["can2"]
}

can_bus = None
bus_label = args.can_bus
for name in bus_names.get(bus_label, ["twai"]):
    try:
        can_bus = board.can(name)
        break
    except KeyError:
        continue

if can_bus is None:
    print(f"❌ ERROR: No CAN bus '{bus_label}' defined in board configuration")
    raise RuntimeError(f"Board has no CAN bus for '{bus_label}'")

# Get hardware config
tx_pin = can_bus.tx
rx_pin = can_bus.rx
bus_id = {'bus0': 0, 'bus1': 1, 'bus2': 2}.get(bus_label, 0)

# Parse CAN IDs from hex strings
tx_id = int(args.tx_id, 16)
rx_id = int(args.rx_id, 16)

# Bitrate mapping
bitrate_map = {
    'b250k': 250000,
    'b500k': 500000,
    'b1000k': 1000000
}
selected_bitrate = bitrate_map[args.bitrate]

# Mode mapping
mode_map = {
    'loopback': CAN.LOOPBACK,
    'normal': CAN.NORMAL
}
selected_mode = mode_map[args.test_mode]

print("\nConfiguration:")
print(f"  Bus: CAN{bus_id} (TX=GPIO{tx_pin}, RX=GPIO{rx_pin})")
print(f"  Bitrate: {selected_bitrate} bps")
print(f"  Mode: {args.test_mode.upper()}")
print(f"  TX ID: 0x{tx_id:03X}")
print(f"  RX ID: 0x{rx_id:03X}")

# Initialize CAN
print("\nInitializing CAN...")
can = CAN(
    bus_id,
    extframe=False,
    tx=tx_pin,
    rx=rx_pin,
    mode=selected_mode,
    bitrate=selected_bitrate,
    auto_restart=False
)
print("✓ CAN initialized")

# Create UDS client
print("Creating UDS client...")
client = UDSClient(can, tx_id=tx_id, rx_id=rx_id, p2_timeout=1000)
print("✓ UDS client created")

# Run selected test
print("\n" + "-" * termWidth)
print(f"Testing: {args.service_test}")
print("-" * termWidth)

try:
    if args.service_test == 'tester_present':
        # TesterPresent (0x3E) - Used to keep a diagnostic session alive
        print("\nSending TesterPresent (SID 0x3E)...")
        if args.test_mode == 'loopback':
            print("  Note: In loopback mode, we'll just verify the request is sent")
            # In loopback, we can't get a real response but we can test framing
            client.tester_present(suppress_positive_response=True)
            print("✅ TesterPresent sent (suppressed response)")
        else:
            response = client.tester_present(suppress_positive_response=False)
            print(f"✅ TesterPresent response: {response.hex() if response else 'None'}")
    
    elif args.service_test == 'read_vin':
        # ReadDataByIdentifier (0x22) - Read VIN (DID 0xF190)
        print("\nSending ReadDataByIdentifier (SID 0x22, DID 0xF190)...")
        if args.test_mode == 'loopback':
            print("  Note: Loopback mode cannot simulate ECU responses")
            print("  Switch to 'normal' mode with a real ECU connected")
        else:
            response = client.read_data_by_identifier(0xF190)
            if response and len(response) > 3:
                vin_bytes = response[3:]  # Skip SID + DID echo
                vin = vin_bytes.decode('ascii', errors='replace')
                print(f"✅ VIN: {vin}")
            else:
                print(f"Response: {response.hex() if response else 'None'}")
    
    elif args.service_test == 'session_ctrl':
        # DiagnosticSessionControl (0x10) - Change to extended session
        print("\nSending DiagnosticSessionControl (SID 0x10, session=0x03)...")
        if args.test_mode == 'loopback':
            print("  Note: Loopback mode cannot simulate ECU responses")
        else:
            response = client.diagnostic_session_control(SESSION_EXTENDED_DIAGNOSTIC)
            if response:
                session = response[1] if len(response) > 1 else 0
                print(f"✅ Session changed to: 0x{session:02X}")
                if len(response) >= 5:
                    p2 = (response[2] << 8) | response[3]
                    p2_star = ((response[4] << 8) | response[5]) * 10 if len(response) >= 6 else 0
                    print(f"   P2 timeout: {p2} ms")
                    print(f"   P2* timeout: {p2_star} ms")
    
    elif args.service_test == 'obd2_rpm':
        # OBD2 Mode 0x01, PID 0x0C - Engine RPM
        print("\nSending OBD2 Mode 0x01, PID 0x0C (Engine RPM)...")
        if args.test_mode == 'loopback':
            print("  Note: Loopback mode cannot simulate ECU responses")
        else:
            response = client.read_obd2_pid(0x01, 0x0C)
            if response and len(response) >= 2:
                rpm = ((response[0] << 8) | response[1]) / 4
                print(f"✅ Engine RPM: {rpm}")
            else:
                print(f"Response: {response.hex() if response else 'None'}")

except UDSTimeoutError as e:
    print(f"⏱️ Timeout: {e}")
    if args.test_mode == 'loopback':
        print("   This is expected in loopback mode for request/response services")
    else:
        print("   Check ECU connection and CAN IDs")

except UDSNegativeResponseError as e:
    print(f"❌ Negative Response: NRC 0x{e.nrc:02X} ({e.nrc_name})")
    print("   The ECU rejected the request")

except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * termWidth)
print("UDS Client Demo Complete")
print("=" * termWidth)

print("\nTips:")
print("  • Use 'loopback' mode to test without hardware")
print("  • Use 'normal' mode with a real ECU on the bus")
print("  • Common OBD2 broadcast ID: 0x7DF")
print("  • Import UDSClient from lib.uds_client for your own scripts")
