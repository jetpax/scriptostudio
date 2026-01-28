
print("Initializing USB Modem Status Check...")

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 2,    # Delay in seconds before showing the interrupt button to the user.
                    # A value of 0 will never display the button.
                    # It is not mandatory, the default value is 5 seconds.    

    info    = dict(
        # ----------------------------------------------------------------------
        name        = 'USB Modem Status',                # Name is mandatory
        version     = [1, 0, 1],                                # Version is mandatory (list of 3 int)
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
    
    
    # Test AT command if connected
    if connected and args.test_at_cmd:
        print("\n"+"-"*60)
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
