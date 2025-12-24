
# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 1,
    
    info = dict(
        name        = 'Stop Button Test',
        version     = [1, 2, 1],
        category    = 'Testing',
        description = 'Simple infinite counter to test the Stop button. Counts up forever until stopped. Also demonstrates logging if enabled',
        author      = 'ScriptO Studio'
    ),
    
    args = dict(
        
        interval = dict( label    = 'Count interval (seconds):',
                        type     = float,
                        value    = 1.0 ),
        
        enable_logging = dict( label    = 'Enable WebREPL logging:',
                              type     = bool,
                              value    = False ),
        
        log_level = dict( label    = 'Logging level:',
                         type     = dict,
                         items    = dict( DEBUG = 'DEBUG - Detailed information',
                                         INFO = 'INFO - General information',
                                         WARNING = 'WARNING - Warning messages',
                                         ERROR = 'ERROR - Error messages' ),
                         value    = 'INFO',
                         optional = True )
    
    )

)

# === END_CONFIG_PARAMETERS ===


from time import sleep

# Setup logging if enabled
logger = None
if args.enable_logging:
    import logging
    import webrepl_binary as webrepl
    
    # Get log level
    log_level_map = {
        'DEBUG': logging.DEBUG,
        'INFO': logging.INFO,
        'WARNING': logging.WARNING,
        'ERROR': logging.ERROR
    }
    level = log_level_map.get(args.log_level, logging.INFO)
    
    # Setup logger
    logger = logging.getLogger("stop_button_test")
    logger.handlers.clear()
    logger.propagate = False
    handler = webrepl.logHandler(level)
    logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)

# Always print to terminal
print('Counter starting... Press Stop button to halt.')
if logger:
    logger.info('Counter starting... Press Stop button to halt.')
    logger.info('Interval: %.1f seconds' % args.interval)
print('')

counter = 0

try:
    while True:
        counter += 1
        print('Count: %d' % counter)
        if logger:
            logger.info('Count: %d' % counter)
        sleep(args.interval)

except KeyboardInterrupt:
    print('')

    if logger:
        logger.info('Stopped at count: %d' % counter)
        logger.info('Stop button works!')
