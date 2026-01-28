

# === START_CONFIG_PARAMETERS ===

dict(

    timeout         = 15,
    
    info = dict(
        name        = 'Memory Check',
        version     = [2, 0, 0],
        category    = 'System',
        description = 'WebREPL-safe memory test. Checks available RAM and tests it by allocating a specified size of memory.',
        author      = 'jetpax',
        mail        = 'jetpax@gmail.com',
        www         = 'https://github.com/jetpax'
    ),
    
    args = dict(
        test_size_kb = dict(
            label    = 'Test allocation size (KB):',
            type     = int,
            value    = 500
        )
    )

)

# === END_CONFIG_PARAMETERS ===

import gc

def _sizeToText(size, unity) :
    if size >= 1024*1024 :
        return '%s M%s' % (round(size/1024/1024*100)/100, unity[0])
    if size >= 1024 :
        return '%s K%s' % (round(size/1024*100)/100, unity[0])
    return '%s %s' % (size, unity)

def _memFree() :
    gc.collect()
    return _sizeToText(gc.mem_free(), 'bytes')

# WebREPL-safe memory test
gc.collect()
initial_free = gc.mem_free()
test_bytes = args.test_size_kb * 1024

print('=== Memory Check (WebREPL-safe) ===')
print()
print('Memory free:           %s' % _sizeToText(initial_free, 'bytes'))
print('Test allocation size:  %s' % _sizeToText(test_bytes, 'bytes'))
print()

# Try to allocate the test size
test_array = None
success = False

try :
    print('Attempting allocation...', end='')
    test_array = bytearray(test_bytes)
    success = True
    print(' OK')
except MemoryError :
    print(' FAILED (insufficient memory)')
except Exception as ex :
    print(' ERROR: %s' % str(ex))

if success :
    gc.collect()
    print('Memory free after alloc: %s' % _sizeToText(gc.mem_free(), 'bytes'))
    
    # Clean up
    del test_array
    gc.collect()
    
    print('Memory free after free:  %s' % _sizeToText(gc.mem_free(), 'bytes'))
    print()
    print('Test PASSED - allocation successful')
else :
    gc.collect()
    print('Memory free now:         %s' % _sizeToText(gc.mem_free(), 'bytes'))
    print()
    print('Test FAILED - try a smaller size')

print()
print('[DONE]')
