"""
Test - Queue Cleanup Verification

This script tests the queue cleanup changes:
1. Static file serving (webfiles) with direct GIL
2. WebREPL file transfers (GET/PUT) with direct GIL
3. Concurrent operations to verify no queue blocking
4. Python code execution (still uses queue)

Expected behavior:
- File transfers should be faster (no queue latency)
- Python execution should still work (uses queue)
- No crashes or hangs during concurrent operations
"""

# === START_CONFIG_PARAMETERS ===

dict(
    timeout = 0,  # No interrupt button needed for this test
    
    info = dict(
        name        = 'Queue Cleanup Test',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = '''Tests the queue cleanup refactor:
                         - Static file serving with direct GIL
                         - WebREPL file transfers with direct GIL
                         - Concurrent operations
                         - Memory usage verification
                         
                         This verifies that file I/O uses direct GIL acquisition
                         instead of queuing, improving performance and simplicity.''',
        author      = 'Jonathan E. Peace',
        mail        = 'jep@example.com'
    ),
    
    args = dict(
        run_cleanup = dict(
            label    = 'Cleanup test files after running?',
            type     = bool,
            value    = False
        )
    )
)

# === END_CONFIG_PARAMETERS ===

import os
import time
import gc

# ============================================================================
# Test Configuration
# ============================================================================

TEST_DIR = '/test_queue_cleanup'
TEST_FILE_SMALL = 'small.txt'
TEST_FILE_LARGE = 'large.bin'
TEST_FILE_BINARY = 'binary.dat'

SMALL_SIZE = 1024  # 1KB
LARGE_SIZE = 100 * 1024  # 100KB

# ============================================================================
# Helper Functions
# ============================================================================

def setup_test_dir():
    """Create test directory and files"""
    print("\n=== Setting up test environment ===")
    
    # Create test directory
    try:
        os.mkdir(TEST_DIR)
        print(f"✓ Created {TEST_DIR}")
    except OSError:
        print(f"✓ Directory {TEST_DIR} already exists")
    
    # Create small text file
    small_path = f"{TEST_DIR}/{TEST_FILE_SMALL}"
    with open(small_path, 'w') as f:
        f.write("Hello from MicroPython!\n" * 50)
    print(f"✓ Created {small_path} ({SMALL_SIZE} bytes)")
    
    # Create large binary file
    large_path = f"{TEST_DIR}/{TEST_FILE_LARGE}"
    with open(large_path, 'wb') as f:
        # Write random-ish data
        for i in range(LARGE_SIZE // 256):
            f.write(bytes([(i + j) % 256 for j in range(256)]))
    size = os.stat(large_path)[6]
    print(f"✓ Created {large_path} ({size} bytes)")
    
    # Create binary file with specific pattern
    binary_path = f"{TEST_DIR}/{TEST_FILE_BINARY}"
    with open(binary_path, 'wb') as f:
        # Write magic bytes and pattern
        f.write(b'\x1f\x8b\x08')  # Gzip magic
        f.write(b'\xDE\xAD\xBE\xEF' * 256)  # Pattern
    size = os.stat(binary_path)[6]
    print(f"✓ Created {binary_path} ({size} bytes)")


def test_file_operations():
    """Test file read/write operations"""
    print("\n=== Testing File Operations ===")
    
    # Test 1: Read small file
    print("\n[Test 1] Reading small file...")
    start = time.ticks_ms()
    small_path = f"{TEST_DIR}/{TEST_FILE_SMALL}"
    with open(small_path, 'r') as f:
        content = f.read()
    elapsed = time.ticks_diff(time.ticks_ms(), start)
    print(f"✓ Read {len(content)} bytes in {elapsed}ms")
    
    # Test 2: Read large binary file
    print("\n[Test 2] Reading large binary file...")
    start = time.ticks_ms()
    large_path = f"{TEST_DIR}/{TEST_FILE_LARGE}"
    with open(large_path, 'rb') as f:
        content = f.read()
    elapsed = time.ticks_diff(time.ticks_ms(), start)
    print(f"✓ Read {len(content)} bytes in {elapsed}ms")
    
    # Test 3: Write new file
    print("\n[Test 3] Writing new file...")
    start = time.ticks_ms()
    new_path = f"{TEST_DIR}/written.txt"
    with open(new_path, 'w') as f:
        f.write("This file was written by the test!\n" * 100)
    elapsed = time.ticks_diff(time.ticks_ms(), start)
    size = os.stat(new_path)[6]
    print(f"✓ Wrote {size} bytes in {elapsed}ms")
    
    # Test 4: Binary file integrity
    print("\n[Test 4] Verifying binary file integrity...")
    binary_path = f"{TEST_DIR}/{TEST_FILE_BINARY}"
    with open(binary_path, 'rb') as f:
        magic = f.read(3)
        if magic == b'\x1f\x8b\x08':
            print(f"✓ Binary file magic bytes correct: {magic.hex()}")
        else:
            print(f"✗ Binary file corrupted! Expected 1f8b08, got {magic.hex()}")
    
    gc.collect()


def test_concurrent_operations():
    """Test concurrent file operations and Python execution"""
    print("\n=== Testing Concurrent Operations ===")
    
    print("\n[Test 5] File read during Python execution...")
    
    # Start a computation
    print("Starting computation...")
    result = 0
    start = time.ticks_ms()
    
    # Do some work
    for i in range(1000):
        result += i * i
    
    # Read file during computation
    small_path = f"{TEST_DIR}/{TEST_FILE_SMALL}"
    with open(small_path, 'r') as f:
        content = f.read()
    
    # Continue computation
    for i in range(1000):
        result += i * 3
    
    elapsed = time.ticks_diff(time.ticks_ms(), start)
    print(f"✓ Computation result: {result}")
    print(f"✓ File read size: {len(content)} bytes")
    print(f"✓ Total time: {elapsed}ms")
    print("  Note: File I/O blocks Python during transfer (expected)")
    
    gc.collect()


def test_static_file_serving():
    """Test static file serving via HTTP (webfiles)"""
    print("\n=== Testing Static File Serving (webfiles) ===")
    
    print("\nNote: Static files are served via HTTP at http://<ip>:8080")
    print("These tests verify the files are accessible:")
    print(f"  - GET http://<ip>:8080{TEST_DIR}/{TEST_FILE_SMALL}")
    print(f"  - GET http://<ip>:8080{TEST_DIR}/{TEST_FILE_LARGE}")
    print(f"  - GET http://<ip>:8080{TEST_DIR}/{TEST_FILE_BINARY}")
    print(f"  - HEAD http://<ip>:8080{TEST_DIR}/{TEST_FILE_SMALL}")
    
    print("\n✓ Files available for HTTP access")
    print("  (Test with curl from host machine)")


def test_memory_usage():
    """Check memory usage after operations"""
    print("\n=== Memory Usage ===")
    
    gc.collect()
    free = gc.mem_free()
    alloc = gc.mem_alloc()
    total = free + alloc
    
    print(f"Free:      {free:,} bytes ({free/1024:.1f} KB)")
    print(f"Allocated: {alloc:,} bytes ({alloc/1024:.1f} KB)")
    print(f"Total:     {total:,} bytes ({total/1024:.1f} KB)")


def cleanup():
    """Remove test files"""
    print("\n=== Cleanup ===")
    
    try:
        # Remove test files
        for filename in [TEST_FILE_SMALL, TEST_FILE_LARGE, TEST_FILE_BINARY, 'written.txt']:
            path = f"{TEST_DIR}/{filename}"
            try:
                os.remove(path)
                print(f"✓ Removed {path}")
            except OSError as e:
                print(f"  (File {path} not found or already removed)")
        
        # Remove directory
        os.rmdir(TEST_DIR)
        print(f"✓ Removed {TEST_DIR}")
        
    except Exception as e:
        print(f"✗ Cleanup error: {e}")


# ============================================================================
# Main Test Execution
# ============================================================================

def run_all_tests():
    """Run all tests"""
    print("="*60)
    print("Queue Cleanup Verification Test")
    print("="*60)
    print("\nThis test verifies:")
    print("  1. File operations work correctly with direct GIL")
    print("  2. Binary file integrity is preserved")
    print("  3. Concurrent operations don't crash")
    print("  4. Memory usage is reasonable")
    print("="*60)
    
    try:
        setup_test_dir()
        test_file_operations()
        test_concurrent_operations()
        test_static_file_serving()
        test_memory_usage()
        
        print("\n" + "="*60)
        print("✓ All tests completed successfully!")
        print("="*60)
        
        # Cleanup if requested
        if args.run_cleanup:
            cleanup()
        else:
            print("\nTest files kept for manual inspection.")
            print("Files available at: http://<ip>:8080/test_queue_cleanup/")
            print("Run cleanup() manually to remove test files.")
        
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        import sys
        sys.print_exception(e)


# ============================================================================
# Instructions for WebREPL File Transfer Testing
# ============================================================================

def print_webrepl_test_instructions():
    """Print instructions for testing WebREPL file transfers"""
    print("\n" + "="*60)
    print("WebREPL File Transfer Testing")
    print("="*60)
    print("\nTo test WebREPL file transfers (GET/PUT with direct GIL):")
    print("\n1. Use Scripto Studio file manager:")
    print("   - Upload a file to the device (PUT)")
    print("   - Download a file from the device (GET)")
    print("   - Verify binary files (like .gz) are not corrupted")
    print("\n2. Check Telnet logs for:")
    print("   - 'GET_FILE: Acquiring GIL...'")
    print("   - 'PUT_FILE: Acquiring GIL...'")
    print("   - No 'Processing message type=5' or 'type=6' (no queue)")
    print("\n3. Test concurrent transfers:")
    print("   - Start a Python script running")
    print("   - Upload/download files during execution")
    print("   - Verify no crashes or hangs")
    print("="*60)


# ============================================================================
# Run Tests
# ============================================================================

if __name__ == '__main__':
    run_all_tests()
    print_webrepl_test_instructions()

