

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,    # No interrupt button

    info    = dict(
        # ----------------------------------------------------------------------
        name        = 'UDS Server Demo',
        version     = [1, 0, 0],
        category    = 'CAN/TWAI',
        description = '''Demonstrates UDS (Unified Diagnostic Services) server to make your device diagnosable.
                         
                         Turns your ESP32/pyDirect device into a diagnosable ECU that responds to UDS requests.
                         Useful for:
                         • Custom ECU simulation
                         • BMS/EVSE diagnostics
                         • Development and testing
                         • Learning UDS protocol
                         
                         Supports DiagnosticSessionControl (0x10), TesterPresent (0x3E),
                         ReadDataByIdentifier (0x22), WriteDataByIdentifier (0x2E), 
                         SecurityAccess (0x27), and RoutineControl (0x31).
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
                                  bus1 = "CAN 1 (ESP32-P4 only)"
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
        rx_id          = dict( label    = 'RX CAN ID (client TX):',
                              type     = str,
                              value    = '7E0' ),
        # ----------------------------------------------------------------------
        tx_id          = dict( label    = 'TX CAN ID (client RX):',
                              type     = str,
                              value    = '7E8' ),
        # ----------------------------------------------------------------------
        run_duration   = dict( label    = 'Run duration (seconds):',
                              type     = int,
                              value    = 30 ),
        # ----------------------------------------------------------------------
        device_name    = dict( label    = 'Device Name (for VIN DID):',
                              type     = str,
                              value    = 'PYDIRECT12345678' )
        # ----------------------------------------------------------------------
    )

)

# === END_CONFIG_PARAMETERS ===


import CAN
import time
from lib.sys import board
from lib.uds_server import UDSServer
from lib.uds_services import SESSION_DEFAULT, SESSION_EXTENDED_DIAGNOSTIC

termWidth = 50

print("=" * termWidth)
print("UDS Server Demo - ECU Simulator")
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

can_bus_config = None
bus_label = args.can_bus
for name in bus_names.get(bus_label, ["twai"]):
    try:
        can_bus_config = board.can(name)
        break
    except KeyError:
        continue

if can_bus_config is None:
    print(f"❌ ERROR: No CAN bus '{bus_label}' defined in board configuration")
    raise RuntimeError(f"Board has no CAN bus for '{bus_label}'")

# Get hardware config
tx_pin = can_bus_config.tx
rx_pin = can_bus_config.rx
bus_id = {'bus0': 0, 'bus1': 1, 'bus2': 2}.get(bus_label, 0)

# Parse CAN IDs from hex strings
# Note: Server RX = Client TX, Server TX = Client RX
rx_id = int(args.rx_id, 16)  # What we receive on (client sends to)
tx_id = int(args.tx_id, 16)  # What we transmit on (client listens to)

# Bitrate mapping
bitrate_map = {
    'b250k': 250000,
    'b500k': 500000,
    'b1000k': 1000000
}
selected_bitrate = bitrate_map[args.bitrate]

print("\nConfiguration:")
print(f"  Bus: CAN{bus_id} (TX=GPIO{tx_pin}, RX=GPIO{rx_pin})")
print(f"  Bitrate: {selected_bitrate} bps")
print(f"  RX ID (listen for requests): 0x{rx_id:03X}")
print(f"  TX ID (send responses): 0x{tx_id:03X}")
print(f"  Run duration: {args.run_duration} seconds")

# Initialize CAN in NORMAL mode
print("\nInitializing CAN...")
can = CAN(
    bus_id,
    extframe=False,
    tx=tx_pin,
    rx=rx_pin,
    mode=CAN.NORMAL,
    bitrate=selected_bitrate,
    auto_restart=True
)
print("✓ CAN initialized")

# Create UDS server
print("Creating UDS server...")
server = UDSServer(can, rx_id=rx_id, tx_id=tx_id)
print("✓ UDS server created")

# Register custom DIDs
print("\nRegistering Data Identifiers (DIDs)...")

# DID 0xF190 - VIN (Vehicle Identification Number)
device_name = args.device_name[:17].ljust(17)  # Pad to 17 chars
server.register_did(0xF190, lambda: device_name.encode('ascii'))
print("  0xF190: VIN -> " + device_name)

# DID 0xF195 - Software Version
sw_version = "SCRIPTO-1.0.0"
server.register_did(0xF195, lambda: sw_version.encode('ascii'))
print("  0xF195: SW Version -> " + sw_version)

# DID 0xF19E - ECU Name
ecu_name = "pyDirect UDS Demo"
server.register_did(0xF19E, lambda: ecu_name.encode('ascii'))
print("  0xF19E: ECU Name -> " + ecu_name)

# DID 0x1000 - Uptime (dynamic value)
start_time = time.ticks_ms()
def get_uptime():
    uptime_ms = time.ticks_diff(time.ticks_ms(), start_time)
    uptime_s = uptime_ms // 1000
    return uptime_s.to_bytes(4, 'big')
server.register_did(0x1000, get_uptime)
print("  0x1000: Uptime (seconds, dynamic)")

# DID 0x1001 - Request counter (dynamic value)
request_count = [0]
def get_request_count():
    request_count[0] += 1
    return request_count[0].to_bytes(2, 'big')
server.register_did(0x1001, get_request_count)
print("  0x1001: Request Counter (dynamic)")

# Register a custom routine
print("\nRegistering Routines...")

def echo_routine(sub_function, data):
    """Simple echo routine - returns input data reversed"""
    if sub_function == 1:  # Start
        return bytes(reversed(data)) if data else b'\x00'
    return b'\x00'

server.register_routine(0xFF00, echo_routine)
print("  0xFF00: Echo routine (reverses input data)")

# Run server
print("\n" + "=" * termWidth)
print("Server running! Listening for UDS requests...")
print("=" * termWidth)
print("\nSupported services:")
print("  0x10 - DiagnosticSessionControl")
print("  0x3E - TesterPresent")
print("  0x22 - ReadDataByIdentifier")
print("  0x2E - WriteDataByIdentifier (requires security)")
print("  0x27 - SecurityAccess")
print("  0x31 - RoutineControl")
print("\nPress Ctrl+C or wait for timeout to stop.\n")

end_time = time.ticks_add(time.ticks_ms(), args.run_duration * 1000)
requests_handled = 0

try:
    while time.ticks_diff(end_time, time.ticks_ms()) > 0:
        if server.run_once(timeout_ms=100):
            requests_handled += 1
            remaining = time.ticks_diff(end_time, time.ticks_ms()) // 1000
            print(f"  Handled request #{requests_handled} ({remaining}s remaining)")

except KeyboardInterrupt:
    print("\n\nInterrupted by user")

print("\n" + "=" * termWidth)
print(f"Server stopped. Handled {requests_handled} requests.")
print("=" * termWidth)

print("\nTo test this server:")
print("  1. Connect another device running UDS Client Demo")
print("  2. Or use a commercial diagnostic tool")
print("  3. Request DIDs: 0xF190 (VIN), 0xF195 (SW), 0x1000 (uptime)")
print("  4. Start routine 0xFF00 with data to see it reversed")
