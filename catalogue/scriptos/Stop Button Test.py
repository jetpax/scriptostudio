
# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 1,
    
    info = dict(
        name        = 'Stop Button Test',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = 'Simple infinite counter to test the Stop button. Counts up forever until stopped.',
        author      = 'ScriptO Studio'
    ),
    
    args = dict(
        
        interval = dict( label    = 'Count interval (seconds):',
                        type     = float,
                        value    = 1.0 )
    
    )

)

# === END_CONFIG_PARAMETERS ===


from time import sleep

print('Counter starting... Press Stop button to halt.')
print('Interval: %.1f seconds' % args.interval)
print('')

counter = 0

try:
    while True:
        counter += 1
        print('Count: %d' % counter)
        sleep(args.interval)

except KeyboardInterrupt:
    print('')
    print('Stopped at count: %d' % counter)
    print('Stop button works!')

