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
                         
                         IMPORTANT: rsyslog must be configured to accept remote UDP messages:
                         1. Edit /etc/rsyslog.conf
                         2. Uncomment: module(load="imudp") and input(type="imudp" port="514")
                         3. Restart: sudo systemctl restart rsyslog
                         
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
                               value    = True ),
        # ----------------------------------------------------------------------
        debug_mode = dict( label    = 'Enable Debug Output:',
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
    print(f"  Debug mode: {args.debug_mode}")
    print()
    print("NOTE: Make sure rsyslog is restarted after config changes:")
    print("  sudo systemctl restart rsyslog")
    print()
    
    # Configure syslog
    syslog.configure(
        host=args.syslog_host,
        port=args.syslog_port,
        facility=facility_code,
        debug=args.debug_mode
    )
    
    print("Syslog configured successfully!")
    print()
    
    # Test connection
    print("Testing connection...")
    success, error = syslog.test_connection()
    if success:
        print("✓ Connection test successful!")
    else:
        print(f"✗ Connection test failed: {error}")
        print()
        print("Troubleshooting:")
        print("  1. Verify rsyslog is running:")
        print("     sudo systemctl status rsyslog")
        print("  2. Restart rsyslog if needed:")
        print("     sudo systemctl restart rsyslog")
        print("  3. Verify syslog server is listening on UDP port 514:")
        print("     sudo netstat -ulnp | grep 514")
        print("     or: sudo ss -ulnp | grep 514")
        print("  4. Check firewall allows UDP port 514:")
        print("     sudo ufw status")
        print("  5. Test with netcat listener (on server):")
        print("     sudo nc -ul 514")
        print("  6. Check rsyslog logs for errors:")
        print("     sudo journalctl -u rsyslog -n 50")
        print()
        if args.debug_mode:
            errors = syslog.get_last_errors()
            if errors:
                print("Recent errors:")
                for err in errors:
                    print(f"  - {err}")
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
    print("Messages sent successfully!")
    print()
    print("If messages don't appear in /var/log/syslog, add this rule:")
    print("  Create /etc/rsyslog.d/30-remote-local0.conf:")
    print("  local0.*    /var/log/syslog")
    print()
    print("Then restart rsyslog:")
    print("  sudo systemctl restart rsyslog")
    print()
    print("Or test with netcat to verify UDP reception:")
    print("  sudo nc -ul 514")
    print()
    
else:
    print("ERROR: Cannot test syslog - module not available")
