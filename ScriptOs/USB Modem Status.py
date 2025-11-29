
print("Initializing USB Modem Status Check...")

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 2,    # Delay in seconds before showing the interrupt button to the user.
                    # A value of 0 will never display the button.
                    # It is not mandatory, the default value is 5 seconds.    

    info    = dict(
        # ----------------------------------------------------------------------
        name        = 'USB Modem Status',                # Name is mandatory
        version     = [1, 0, 0],                                # Version is mandatory (list of 3 int)
        category    = 'Network',                              # Optional: category for organization
        description =                                           # Description is mandatory
                      ''' Check USB modem connection status, enumeration, and interface details.
                          Shows device information, interface classes, and tests AT command communication.
                          Useful for debugging USB modem connectivity issues.
                      ''',
        author      = 'ScriptO Studio',                             # Author is mandatory
        mail        = '', # Mail is not mandatory
        www         = ''            # Web link is not mandatory
        # ----------------------------------------------------------------------
    ),
    
    args    = dict(              # Label and type are mandatory
        # ----------------------------------------------------------------------
        vendor_id    = dict( label    = 'Vendor ID (hex):',
                                   type     = str,
                                   value    = "0x1E0E"),  # SIM7600G-H default
        # ----------------------------------------------------------------------
        product_id   = dict( label    = 'Product ID (hex):',
                                   type     = str,
                                   value    = "0x9001"),  # SIM7600G-H default
        # ----------------------------------------------------------------------
        test_at_cmd  = dict( label    = 'Test AT command if connected:',
                                   type     = bool,
                                   value    = True )
        # ----------------------------------------------------------------------
    )

)

# === END_CONFIG_PARAMETERS ===

# ==============================================================================
# USB Modem Status Check Script
# ==============================================================================

import usbmodem

# Convert hex strings to integers
try:
    vid = int(args.vendor_id, 16) if args.vendor_id.startswith('0x') else int(args.vendor_id, 16)
    pid = int(args.product_id, 16) if args.product_id.startswith('0x') else int(args.product_id, 16)
except ValueError:
    print(f"Error: Invalid hex format for VID/PID. Using defaults.")
    vid = 0x1E0E
    pid = 0x9001

print("\n" + "="*60)
print("USB Modem Status Check")
print("="*60)
print(f"Target Device: VID=0x{vid:04X}, PID=0x{pid:04X}")
print()

# Check if USB driver is initialized
try:
    # Check connection status
    connected = usbmodem.connected()
    print(f"✓ Connected: {connected}")
    
    # Check enumeration status
    enumerated = usbmodem.is_enumerated(vendor_id=vid, product_id=pid)
    print(f"✓ Enumerated: {enumerated}")
    
    # List all USB devices
    print("\n" + "-"*60)
    print("All USB Devices:")
    print("-"*60)
    devices = usbmodem.list_devices()
    if devices:
        for addr, dev_vid, dev_pid, dev_class in devices:
            vid_hex = f"0x{dev_vid:04X}"
            pid_hex = f"0x{dev_pid:04X}"
            match = " ← TARGET" if (dev_vid == vid and dev_pid == pid) else ""
            print(f"  Address {addr}: VID={vid_hex}, PID={pid_hex}, Class={dev_class}{match}")
    else:
        print("  No USB devices found")
    
    # List interfaces for target device
    print("\n" + "-"*60)
    print(f"Interfaces for VID=0x{vid:04X}, PID=0x{pid:04X}:")
    print("-"*60)
    interfaces = usbmodem.list_interfaces(vendor_id=vid, product_id=pid)
    if interfaces:
        # Interface class names mapping
        class_names = {
            0x01: "Audio",
            0x02: "CDC Control",
            0x03: "HID",
            0x08: "Mass Storage",
            0x0A: "CDC Data",
            0x0E: "Video",
            0xFF: "Vendor Specific"
        }
        
        for if_num, if_class, if_subclass, if_protocol, alt_setting in interfaces:
            class_name = class_names.get(if_class, f"Unknown (0x{if_class:02X})")
            print(f"  Interface {if_num}:")
            print(f"    Class: 0x{if_class:02X} ({class_name})")
            print(f"    SubClass: 0x{if_subclass:02X}")
            print(f"    Protocol: 0x{if_protocol:02X}")
            print(f"    Alt Setting: {alt_setting}")
            
            # Highlight the AT command interface (typically interface 2 for SIM7600)
            if if_class == 0x0A and if_num == 2:
                print(f"    → This is the AT command interface")
            print()
    else:
        print("  No interfaces found (device not enumerated or not found)")
    
    # Test AT command if connected
    if connected and args.test_at_cmd:
        print("-"*60)
        print("Testing AT Command:")
        print("-"*60)
        try:
            response = usbmodem.send_at("AT")
            print(f"Response: {response}")
            if "OK" in response:
                print("✓ Modem is responding correctly")
            else:
                print("⚠ Modem response unexpected")
        except Exception as e:
            print(f"✗ Error sending AT command: {e}")
    
    print("\n" + "="*60)
    print("Status Check Complete")
    print("="*60)
    
except Exception as e:
    print(f"\n✗ Error: {e}")
    import sys
    sys.print_exception(e)
