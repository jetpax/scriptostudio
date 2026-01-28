
# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,    # No interrupt button during scan

    info    = dict(
        # ----------------------------------------------------------------------
        name        = 'CANopen Bus Scanner',
        version     = [1, 0, 2],
        category    = 'CAN/TWAI',
        description = 'Scan CANopen network for devices by sending SDO (Service Data Object) requests. This tool discovers CANopen nodes on the bus by attempting to read the device type (object 0x1000) from each possible node ID. Useful for identifying OpenInverter devices and other CANopen-compatible equipment.',
        author      = 'Scriptomatic Team',
        mail        = 'support@scriptomatic.io',
        www         = 'https://github.com/straga/micropython-esp32-twai'
        # ----------------------------------------------------------------------
    ),
    
    args    = dict(
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
        can_mode       = dict( label    = 'CAN Mode:',
                              type     = dict,
                              items    = dict( 
                                  normal   = "NORMAL - Requires ACK from other devices",
                                  silent   = "SILENT - No ACK required (recommended for scanning)"
                              ),
                              value    = 'silent' ),
        # ----------------------------------------------------------------------
        scan_range     = dict( label    = 'Scan Range:',
                              type     = dict,
                              items    = dict(
                                  quick = "Quick scan (nodes 1-10)",
                                  full  = "Full scan (nodes 1-127)"
                              ),
                              value    = 'quick' ),
        # ----------------------------------------------------------------------
        node_start     = dict( label    = 'Start Node ID:',
                              type     = int,
                              value    = 1 ),
        # ----------------------------------------------------------------------
        node_end       = dict( label    = 'End Node ID:',
                              type     = int,
                              value    = 127 ),
        # ----------------------------------------------------------------------
        timeout_ms     = dict( label    = 'Timeout per node (ms):',
                              type     = int,
                              value    = 100 ),
        # ----------------------------------------------------------------------
        rate_limit_ms  = dict( label    = 'Delay between requests (ms):',
                              type     = int,
                              value    = 10 ),
        # ----------------------------------------------------------------------
        wait_time      = dict( label    = 'Final wait time (seconds):',
                              type     = float,
                              value    = 0.5 )
        # ----------------------------------------------------------------------
    )

)

# === END_CONFIG_PARAMETERS ===


import CAN
import time
import struct

# Try to import SDO library, fall back to manual implementation if not available
try:
    from lib.canopen_sdo import SDOClient, SDOTimeoutError, SDOAbortError
    SDO_LIBRARY_AVAILABLE = True
except ImportError:
    # Fallback: define minimal SDO client inline
    SDO_LIBRARY_AVAILABLE = False
    class SDOTimeoutError(Exception):
        pass
    class SDOAbortError(Exception):
        def __init__(self, abort_code):
            self.abort_code = abort_code

termWidth = 50

print("=" * termWidth)
print("CANopen Bus Scanner")
print("=" * termWidth)

# Map bitrate IDs to actual values
bitrate_map = {
    'b125k': 125000,
    'b250k': 250000,
    'b500k': 500000,
    'b1000k': 1000000
}

# Map mode IDs to CAN constants
mode_map = {
    'normal': CAN.NORMAL,
    'silent': CAN.SILENT
}

# Get configuration values
selected_bitrate = bitrate_map[args.bitrate]
selected_mode = mode_map[args.can_mode]
mode_name = args.can_mode.upper()

# Determine scan range
if args.scan_range == 'quick':
    start_node = 1
    end_node = 10
    print(f"\nQuick scan mode: nodes {start_node}-{end_node}")
else:
    start_node = args.node_start
    end_node = args.node_end
    print(f"\nCustom scan mode: nodes {start_node}-{end_node}")

print(f"TX Pin: GPIO{args.tx_pin}")
print(f"RX Pin: GPIO{args.rx_pin}")
print(f"Bitrate: {selected_bitrate} bps")
print(f"Mode: {mode_name}")
print(f"Timeout: {args.timeout_ms} ms per node")
print(f"Rate limit: {args.rate_limit_ms} ms between requests")
print(f"Final wait: {args.wait_time} seconds")

if args.can_mode == 'silent':
    print("  Note: SILENT mode - no acknowledgment required (recommended for scanning)")
    print("        Messages are sent but bus won't go BUS_OFF if no devices respond")
elif args.can_mode == 'normal':
    print("  Note: NORMAL mode - requires other devices to ACK messages")
    print("        If no devices respond, bus may go BUS_OFF due to error accumulation")

# Initialize CAN
print("\nInitializing CAN...")
try:
    can = CAN(
        0,                      # CAN bus 0
        extframe=False,         # Standard 11-bit IDs
        tx=args.tx_pin,         # TX pin from config
        rx=args.rx_pin,         # RX pin from config
        mode=selected_mode,     # Mode from config
        bitrate=selected_bitrate,
        auto_restart=False
    )
    print("✓ CAN initialized\n")
except Exception as e:
    print(f"❌ Failed to initialize CAN: {e}")
    print("\nTroubleshooting:")
    print("  • Check TX/RX pin configuration")
    print("  • Verify CAN transceiver is connected")
    print("  • Ensure bitrate matches other devices on bus")
    raise

# SDO Protocol Constants
# Object to read: 0x1000 (Device Type) - standard CANopen object
SDO_INDEX_DEVICE_TYPE = 0x1000
SDO_SUBINDEX = 0x00

print("Starting scan...")
print("-" * termWidth)

# Clear any pending messages
while can.any():
    can.recv()

# Collect found nodes
found_nodes = []
scan_errors = 0

# Convert timeout from ms to seconds for SDO client
sdo_timeout = args.timeout_ms / 1000.0 if args.timeout_ms > 0 else 0.1

# Scan each node using SDO library if available
if SDO_LIBRARY_AVAILABLE:
    print(f"Using SDO library to scan nodes {start_node}-{end_node}...")
    
    bus_off_detected = False
    for node_id in range(start_node, end_node + 1):
        try:
            # Create SDO client for this node
            sdo_client = SDOClient(can, node_id=node_id, timeout=sdo_timeout)
            
            # Try to read device type (standard CANopen object 0x1000)
            device_type = sdo_client.read(SDO_INDEX_DEVICE_TYPE, SDO_SUBINDEX)
            
            # Node responded successfully
            found_nodes.append({
                'nodeId': node_id,
                'deviceType': device_type,
                'deviceTypeHex': f"0x{device_type:08X}"
            })
            print(f"  ✓ Node {node_id}: Device Type = 0x{device_type:08X}")
            bus_off_detected = False  # Reset flag on success
            
        except SDOTimeoutError:
            # Node didn't respond - this is normal for non-existent nodes
            pass
        except SDOAbortError as e:
            # Node responded but aborted the request
            # This might indicate the object doesn't exist, but node is present
            scan_errors += 1
            if scan_errors <= 3:
                print(f"  ⚠ Node {node_id}: SDO abort (code: 0x{e.abort_code:08X})")
        except OSError as e:
            # Check if this is a BUS_OFF error
            error_msg = str(e)
            if 'BUS_OFF' in error_msg or 'bus is BUS_OFF' in error_msg:
                if not bus_off_detected:
                    print(f"\n  ⚠ Bus went BUS_OFF")
                    if args.can_mode == 'normal':
                        print(f"     In NORMAL mode, this happens when no devices ACK messages")
                        print(f"     Even with transceiver & termination, BUS_OFF occurs without ACKs")
                        print(f"     Consider using SILENT mode for scanning (no ACK required)")
                    elif args.can_mode == 'silent':
                        print(f"     BUS_OFF in SILENT mode suggests a hardware issue:")
                        print(f"     • CANH/CANL may be shorted or swapped")
                        print(f"     • Transceiver may be faulty")
                        print(f"     • Bus termination may be incorrect")
                    print(f"     Driver will automatically recover. Waiting...")
                    bus_off_detected = True
                
                # Wait for bus recovery (driver handles this automatically)
                # The driver waits 3 seconds + recovery time (needs 128 bus-free signals)
                # So wait ~4-5 seconds total
                recovery_wait_ms = 5000  # Wait 5 seconds for recovery
                elapsed = 0
                chunk_ms = 500
                while elapsed < recovery_wait_ms:
                    time.sleep_ms(chunk_ms)
                    elapsed += chunk_ms
                    remaining = (recovery_wait_ms - elapsed) // 1000
                    if remaining > 0:
                        print(f"     Recovery in progress... ({remaining}s remaining)")
                
                # After recovery, explicitly restart the driver to ensure it's ready
                try:
                    print(f"     ↻ Restarting driver...")
                    can.restart()
                    print(f"     ✓ Driver restarted, continuing scan...")
                except Exception as restart_err:
                    print(f"     ⚠ Restart failed: {restart_err}")
                    print(f"     Continuing anyway...")
                
                scan_errors += 1
                
                # Skip remaining nodes if bus keeps going BUS_OFF
                # This prevents endless BUS_OFF loops
                if scan_errors > 5:
                    print(f"\n  ⚠ Bus keeps going BUS_OFF. Possible causes:")
                    if args.can_mode == 'normal':
                        print(f"     • NORMAL mode requires devices to ACK (use SILENT mode for scanning)")
                    print(f"     • Missing bus termination (need 120Ω at both ends)")
                    print(f"     • Bus wiring issues (CANH/CANL swapped or shorted)")
                    print(f"     • Transceiver not powered or faulty")
                    print(f"\n  Stopping scan to prevent bus errors.")
                    break
            else:
                # Other OSError (timeout, etc.)
                error_msg = str(e)
                if 'Device is not ready' in error_msg:
                    # Driver might be in wrong state after BUS_OFF recovery
                    if bus_off_detected:
                        try:
                            print(f"     ↻ Attempting driver restart...")
                            can.restart()
                            print(f"     ✓ Driver restarted")
                        except Exception as restart_err:
                            print(f"     ⚠ Restart failed: {restart_err}")
                    else:
                        scan_errors += 1
                        if scan_errors <= 3:
                            print(f"  ⚠ Node {node_id}: Error - {e}")
                else:
                    scan_errors += 1
                    if scan_errors <= 3:
                        print(f"  ⚠ Node {node_id}: Error - {e}")
        except Exception as e:
            error_msg = str(e)
            if 'Device is not ready' in error_msg:
                # Driver might be in wrong state after BUS_OFF recovery
                if bus_off_detected:
                    try:
                        print(f"     ↻ Attempting driver restart...")
                        can.restart()
                        print(f"     ✓ Driver restarted")
                    except Exception as restart_err:
                        print(f"     ⚠ Restart failed: {restart_err}")
                else:
                    scan_errors += 1
                    if scan_errors <= 3:
                        print(f"  ⚠ Node {node_id}: Error - {e}")
            else:
                scan_errors += 1
                if scan_errors <= 3:
                    print(f"  ⚠ Node {node_id}: Error - {e}")
            
            # If too many errors, might be bus issues
            if scan_errors > 10:
                print(f"\n❌ Too many scan errors. Stopping scan.")
                print(f"   Possible causes:")
                print(f"   • CAN transceiver not connected or powered")
                print(f"   • Bus termination missing (need 120Ω at both ends)")
                print(f"   • Bus in BUS_OFF state")
                print(f"   • Try using SILENT mode if no transceiver is connected")
                break
        
        # Rate limiting between requests
        if args.rate_limit_ms > 0:
            time.sleep_ms(args.rate_limit_ms)
else:
    # Fallback: Manual SDO implementation (original code)
    print(f"Using manual SDO implementation to scan nodes {start_node}-{end_node}...")
    print("  (SDO library not available - using fallback)")
    
    SDO_CMD_UPLOAD_INITIATE = 0x40
    SDO_TX_BASE = 0x600
    SDO_RX_BASE = 0x580
    
    sdo_request = [
        SDO_CMD_UPLOAD_INITIATE,
        SDO_INDEX_DEVICE_TYPE & 0xFF,
        (SDO_INDEX_DEVICE_TYPE >> 8) & 0xFF,
        SDO_SUBINDEX,
        0x00, 0x00, 0x00, 0x00
    ]
    
    def process_responses():
        """Process any available CAN messages and add found nodes to found_nodes list."""
        global response_count
        while can.any():
            try:
                msg_id, extended, rtr, payload = can.recv()
                
                if msg_id >= SDO_RX_BASE and msg_id < SDO_RX_BASE + 128:
                    node_id = msg_id - SDO_RX_BASE
                    
                    if len(payload) >= 8:
                        if isinstance(payload, list):
                            payload_bytes = bytes(payload)
                        else:
                            payload_bytes = payload
                        
                        cmd = payload_bytes[0]
                        if (cmd & 0xE0) == 0x40:  # Upload response
                            try:
                                device_type = struct.unpack('<I', payload_bytes[4:8])[0]
                                
                                node_found = False
                                for found in found_nodes:
                                    if found['nodeId'] == node_id:
                                        node_found = True
                                        break
                                
                                if not node_found:
                                    found_nodes.append({
                                        'nodeId': node_id,
                                        'deviceType': device_type,
                                        'deviceTypeHex': f"0x{device_type:08X}"
                                    })
                            except:
                                pass
            except:
                pass
    
    send_errors = 0
    for node_id in range(start_node, end_node + 1):
        tx_cobid = SDO_TX_BASE + node_id
        try:
            can.send(sdo_request, tx_cobid, timeout=100)
        except Exception as e:
            send_errors += 1
            if send_errors > 10:
                print(f"\n❌ Too many send errors. Stopping scan.")
                break
        
        process_responses()
        
        if args.rate_limit_ms > 0:
            time.sleep_ms(args.rate_limit_ms)
    
    # Wait for remaining responses
    wait_time_ms = int(args.wait_time * 1000)
    chunk_ms = 50
    elapsed_ms = 0
    
    while elapsed_ms < wait_time_ms:
        process_responses()
        sleep_ms = min(chunk_ms, wait_time_ms - elapsed_ms)
        if sleep_ms > 0:
            time.sleep_ms(sleep_ms)
        elapsed_ms += chunk_ms
    
    process_responses()

# Sort by node ID
found_nodes.sort(key=lambda x: x['nodeId'])

# Display results
print("\n" + "=" * termWidth)
print("Scan Results")
print("=" * termWidth)

if found_nodes:
    print(f"\n✓ Found {len(found_nodes)} device(s):\n")
    print(f"{'Node ID':<10} {'Device Type (hex)':<20} {'Device Type (dec)':<20}")
    print("-" * termWidth)
    
    for node in found_nodes:
        print(f"{node['nodeId']:<10} {node['deviceTypeHex']:<20} {node['deviceType']:<20}")
    
    print("\n" + "-" * termWidth)
    print(f"Total: {len(found_nodes)} device(s) found")
else:
    print("\n⚠ No devices found on the CAN bus")
    print("\nTroubleshooting:")
    print("  • Verify CAN transceiver is connected and powered")
    print("  • Check CANH/CANL wiring")
    print("  • Ensure 120Ω termination resistors are present")
    print("  • Verify bitrate matches other devices (typically 500kbps)")
    print("  • Try increasing timeout or wait time")
    print("  • Check that devices are powered and operational")
    print("  • For OpenInverter: ensure it's configured for CANopen mode")

print("\n" + "=" * termWidth)
print("Scan complete!")
print("=" * termWidth)

