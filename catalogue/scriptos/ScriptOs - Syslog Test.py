# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 5,    # Delay in seconds before showing the interrupt button

    info    = dict(
        # ----------------------------------------------------------------------
        name        = 'Syslog Test',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = 
                      '''Test syslog functionality by sending messages at different severity levels.
                         
                         Configure your syslog server address and port, then send test messages.
                         Messages will be sent via UDP to the syslog server (RFC 3164 format).
                         
                         If syslog is not configured, messages will be silently ignored (no-op).
                      ''',
        author      = 'jetpax',
        mail        = 'jep@alphabetiq.com',
        www         = 'https://github.com/jetpax/scripto-studio'
        # ----------------------------------------------------------------------
    ),
    
    args    = dict(
        # ----------------------------------------------------------------------
        syslog_host = dict( label    = 'Syslog Server IP Address:',
                           type     = str,
                           value    = "192.168.1.100" ),
        # ----------------------------------------------------------------------
        syslog_port = dict( label    = 'Syslog Server Port:',
                           type     = int,
                           value    = 514 ),
        # ----------------------------------------------------------------------
        facility    = dict( label    = 'Syslog Facility:',
                           type     = dict,
                           items    = dict( 
                               local0 = "LOCAL0 (16)",
                               local1 = "LOCAL1 (17)",
                               local2 = "LOCAL2 (18)",
                               local3 = "LOCAL3 (19)",
                               local4 = "LOCAL4 (20)",
                               local5 = "LOCAL5 (21)",
                               local6 = "LOCAL6 (22)",
                               local7 = "LOCAL7 (23)"
                           ),
                           value    = 'local0' ),
        # ----------------------------------------------------------------------
        test_message = dict( label    = 'Test Message:',
                            type     = str,
                            value    = "Hello from ScriptO Syslog Test!" ),
        # ----------------------------------------------------------------------
        send_all_levels = dict( label    = 'Send All Severity Levels:',
                               type     = bool,
                               value    = True )
        # ----------------------------------------------------------------------
    )

)

# === END_CONFIG_PARAMETERS ===

# Import syslog helper
try:
    from lib.syslog_helper import syslog, FACILITY_LOCAL0, FACILITY_LOCAL1, FACILITY_LOCAL2
    from lib.syslog_helper import FACILITY_LOCAL3, FACILITY_LOCAL4, FACILITY_LOCAL5
    from lib.syslog_helper import FACILITY_LOCAL6, FACILITY_LOCAL7
    SYSLOG_AVAILABLE = True
except ImportError:
    print("ERROR: syslog_helper module not found!")
    print("Make sure lib/syslog_helper.py exists on the device.")
    SYSLOG_AVAILABLE = False

if SYSLOG_AVAILABLE:
    # Map facility names to constants
    facility_map = {
        'local0': FACILITY_LOCAL0,
        'local1': FACILITY_LOCAL1,
        'local2': FACILITY_LOCAL2,
        'local3': FACILITY_LOCAL3,
        'local4': FACILITY_LOCAL4,
        'local5': FACILITY_LOCAL5,
        'local6': FACILITY_LOCAL6,
        'local7': FACILITY_LOCAL7
    }
    
    facility_code = facility_map.get(args.facility, FACILITY_LOCAL0)
    
    print("=" * 60)
    print("Syslog Test Script")
    print("=" * 60)
    print()
    print(f"Configuring syslog:")
    print(f"  Server: {args.syslog_host}:{args.syslog_port}")
    print(f"  Facility: {args.facility} ({facility_code})")
    print()
    
    # Configure syslog
    syslog.configure(
        host=args.syslog_host,
        port=args.syslog_port,
        facility=facility_code
    )
    
    print("Syslog configured successfully!")
    print()
    
    if args.send_all_levels:
        print("Sending test messages at all severity levels...")
        print()
        
        # Send messages at all severity levels
        syslog.emerg(f"{args.test_message} [EMERGENCY]", source="scripto-test")
        print("✓ Sent EMERGENCY message")
        
        syslog.alert(f"{args.test_message} [ALERT]", source="scripto-test")
        print("✓ Sent ALERT message")
        
        syslog.crit(f"{args.test_message} [CRITICAL]", source="scripto-test")
        print("✓ Sent CRITICAL message")
        
        syslog.error(f"{args.test_message} [ERROR]", source="scripto-test")
        print("✓ Sent ERROR message")
        
        syslog.warning(f"{args.test_message} [WARNING]", source="scripto-test")
        print("✓ Sent WARNING message")
        
        syslog.notice(f"{args.test_message} [NOTICE]", source="scripto-test")
        print("✓ Sent NOTICE message")
        
        syslog.info(f"{args.test_message} [INFO]", source="scripto-test")
        print("✓ Sent INFO message")
        
        syslog.debug(f"{args.test_message} [DEBUG]", source="scripto-test")
        print("✓ Sent DEBUG message")
        
    else:
        print(f"Sending single test message: {args.test_message}")
        syslog.info(args.test_message, source="scripto-test")
        print("✓ Message sent")
    
    print()
    print("=" * 60)
    print("Test complete!")
    print("=" * 60)
    print()
    print("Check your syslog server to verify messages were received.")
    print(f"Look for messages from source 'scripto-test' on port {args.syslog_port}")
    print()
    
else:
    print("ERROR: Cannot test syslog - module not available")
