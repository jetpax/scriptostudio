# DBE Extension - Setup and Testing Guide

## Quick Start

### Prerequisites

1. **Hardware**:
   - ESP32 board with CAN and RS485 support
   - Nissan LEAF battery pack (or other supported battery)
   - Solar inverter with Pylon CAN protocol support
   - CAN transceiver connected to battery
   - RS485 transceiver connected to inverter

2. **Software**:
   - Scripto Studio installed and running
   - MicroPython firmware with mpDirect TWAI module
   - CAN manager integrated (from mpDirect)

### Installation

1. **Load Extension**:
   - Extension auto-loads in Scripto Studio
   - Device-side code auto-installs via mip package

2. **Configure CAN Bus** (if not already done):
   - Go to System panel in Scripto Studio
   - Set CAN bitrate (typically 500kbps for Nissan LEAF)
   - Configure CAN pins via board definition

3. **Configure DBE**:
   - Open DBE extension
   - Go to Configuration panel
   - Select battery type (e.g., "Nissan LEAF")
   - Select RS485 baudrate (typically 9600)
   - Select inverter protocol (e.g., "Pylon CAN")
   - Enable DBE bridge
   - Click "Save"

4. **Start Bridge**:
   - Click "Start" button
   - Check Status panel for connection state
   - Monitor Metrics panel for battery data

## Testing Checklist

### Phase 1: Device-Side Code Testing

**Test DBE_helpers.py functions via WebREPL**:

```python
# 1. Test configuration
from lib.ext.dbe.DBE_helpers import getDBEConfig, setDBEConfig
getDBEConfig()
# Should return: {"enabled": false, "battery_type": "nissan_leaf", ...}

# 2. Test configuration save
setDBEConfig({"enabled": True, "battery_type": "nissan_leaf", "rs485_baudrate": 9600})
# Should return: {"success": true}

# 3. Test start (with CAN hardware)
from lib.ext.dbe.DBE_helpers import startDBE
startDBE()
# Should return: {"success": true, "status": "started"}

# 4. Test status
from lib.ext.dbe.DBE_helpers import getDBEStatus
getDBEStatus()
# Should return: {"state": "running", "running": true, ...}

# 5. Test metrics
from lib.ext.dbe.DBE_helpers import getDBEMetrics
getDBEMetrics()
# Should return: {"voltage_dV": 3600, "current_dA": 0, "soc_percent": 80, ...}

# 6. Test stop
from lib.ext.dbe.DBE_helpers import stopDBE
stopDBE()
# Should return: {"success": true, "status": "stopped"}
```

### Phase 2: Battery Protocol Testing

**Test Nissan LEAF protocol** (CAN loopback mode):

```python
import CAN
import time

# Initialize CAN in loopback mode for testing
can_handle = CAN.register(CAN.TX_ENABLED)
CAN.activate(can_handle)

# Import battery protocol
from lib.ext.dbe.battery.nissan_leaf import NissanLeafBattery
battery = NissanLeafBattery(can_handle)
battery.setup()

# Set RX callback
def test_rx_callback(frame):
    print(f"RX: ID=0x{frame['id']:03X}, Data={frame['data'].hex()}")
    battery.handle_incoming_can_frame(frame['id'], frame['data'])

CAN.set_rx_callback(can_handle, test_rx_callback)

# Send test frame (0x1DB - voltage/current)
test_frame = bytes([0x00, 0x00, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00])
CAN.transmit(can_handle, {'id': 0x1DB, 'data': test_frame})

# Check parsed data
time.sleep(0.1)
data = battery.get_data()
print(f"Voltage: {data['voltage_dV'] / 10.0}V")
print(f"Current: {data['current_dA'] / 10.0}A")

# Test keep-alive transmission
current_time = time.ticks_ms()
battery.transmit_can(current_time)
# Should send 0x1F2 message

# Cleanup
CAN.deactivate(can_handle)
CAN.can_unregister(can_handle)
```

### Phase 3: Inverter Protocol Testing

**Test Pylon CAN protocol** (RS485 loopback):

```python
from lib.ext.dbe.inverter.pylon_can import PylonCANProtocol
import time

# Initialize inverter protocol
inverter = PylonCANProtocol(uart_port=2, baudrate=9600)

# Create test battery data
battery_data = {
    'voltage_dV': 3600,      # 360.0V
    'current_dA': 100,       # 10.0A
    'soc_percent': 80,
    'soh_percent': 95,
    'temp_max_C': 35,
    'temp_min_C': 25,
    'cell_max_mV': 3750,
    'cell_min_mV': 3700,
    'max_charge_current_dA': 500,   # 50A
    'max_discharge_current_dA': 1000 # 100A
}

# Transmit to inverter
current_time = time.ticks_ms()
inverter.transmit(battery_data, current_time)

# Check for inverter commands (if any)
commands = inverter.receive()
if commands:
    print(f"Inverter commands: {commands}")
```

### Phase 4: End-to-End Integration Testing

**Test full bridge** (with real hardware):

```python
# Start DBE bridge
from lib.ext.dbe.DBE_helpers import startDBE, getDBEStatus, getDBEMetrics
startDBE()

# Monitor status (run multiple times)
getDBEStatus()
# Check: state='running', running=True, frames_rx > 0

# Monitor metrics (run multiple times)
getDBEMetrics()
# Check: voltage_dV, current_dA, soc_percent updating

# Let it run for 30 seconds
import time
time.sleep(30)

# Check status again
getDBEStatus()
# Check: frames_rx increased, no errors

# Stop bridge
from lib.ext.dbe.DBE_helpers import stopDBE
stopDBE()
```

### Phase 5: UI Testing

**Test extension UI in Scripto Studio**:

1. **Config Panel**:
   - [ ] Battery type dropdown shows available batteries
   - [ ] RS485 baudrate dropdown works
   - [ ] Inverter protocol dropdown works
   - [ ] Enable checkbox toggles
   - [ ] Save button saves configuration
   - [ ] Start/Stop buttons work correctly

2. **Status Panel**:
   - [ ] Shows bridge state (stopped/running/error)
   - [ ] Shows battery type and inverter protocol
   - [ ] Shows frame counters (RX/TX)
   - [ ] Shows last update time
   - [ ] Shows errors if any
   - [ ] Refresh button updates status

3. **Metrics Panel**:
   - [ ] SOC gauge displays correctly
   - [ ] Voltage, current, power display
   - [ ] Temperature readings display
   - [ ] Cell voltage readings display
   - [ ] Alarms display when present
   - [ ] Metrics update every 2 seconds

### Phase 6: Coexistence Testing

**Test with other extensions**:

1. **DBE + OVMS**:
   ```python
   # Start both
   from lib.ext.dbe.DBE_helpers import startDBE
   from lib.OVMS_helpers import startOVMS
   
   startDBE()
   startOVMS()
   
   # Both should run without conflicts
   # CAN manager coordinates both clients
   ```

2. **DBE + OpenInverter**:
   - Start DBE bridge
   - Open OpenInverter extension
   - Both should work simultaneously
   - CAN manager handles coordination

3. **DBE + GVRET**:
   - Start DBE bridge
   - Start GVRET server
   - Connect GVRET client
   - Should see DBE CAN traffic in GVRET

## Troubleshooting

### Issue: "Battery not initialized" error

**Cause**: Battery type not supported or import failed

**Solution**:
```python
# Check if battery module exists
import os
os.listdir('/lib/DBE/battery')
# Should show: nissan_leaf.py, battery_base.py, __init__.py

# Try importing manually
from lib.ext.dbe.battery.nissan_leaf import NissanLeafBattery
# Should not raise ImportError
```

### Issue: "CAN manager not found" error

**Cause**: mpDirect TWAI module not installed or CAN manager not integrated

**Solution**:
```python
# Check if CAN module has manager functions
import CAN
dir(CAN)
# Should include: can_register, can_activate, can_deactivate, can_unregister
```

### Issue: No CAN frames received (frames_rx = 0)

**Cause**: CAN bus not connected or wrong bitrate

**Solution**:
1. Check CAN wiring (CANH, CANL, GND)
2. Verify CAN bitrate matches battery (500kbps for Nissan LEAF)
3. Check CAN termination resistors (120Ω)
4. Use GVRET to verify CAN traffic

### Issue: RS485 not transmitting

**Cause**: RS485 pins not configured or wrong baudrate

**Solution**:
```python
# Check RS485 configuration
from lib import board
rs485 = board.uart("rs485")
print(f"RS485 TX: {rs485.tx}, RX: {rs485.rx}")

# Test UART manually
import machine
uart = machine.UART(2, baudrate=9600, tx=rs485.tx, rx=rs485.rx)
uart.write(b"TEST")
```

### Issue: Bridge stops after a few seconds

**Cause**: Exception in background loop

**Solution**:
```python
# Check status for error
from lib.ext.dbe.DBE_helpers import getDBEStatus
getDBEStatus()
# Check 'error' field

# Enable debug logging
import webrepl_binary as webrepl
webrepl.set_log_level(1)  # DEBUG level
```

## Performance Benchmarks

### Expected Performance

- **CAN Frame Processing**: <1ms per frame
- **RS485 Transmission**: 1Hz (1000ms interval)
- **Battery Keep-Alive**: 10-100ms intervals
- **UI Update Latency**: <100ms
- **Memory Usage**: ~50KB (battery + inverter + control loop)

### Monitoring Performance

```python
import time
import gc

# Check memory before start
gc.collect()
mem_before = gc.mem_free()
print(f"Memory before: {mem_before} bytes")

# Start DBE
from lib.ext.dbe.DBE_helpers import startDBE
startDBE()

# Check memory after start
time.sleep(1)
gc.collect()
mem_after = gc.mem_free()
print(f"Memory after: {mem_after} bytes")
print(f"Memory used: {mem_before - mem_after} bytes")

# Monitor loop timing
from lib.ext.dbe.DBE_helpers import getDBEStatus
for i in range(10):
    start = time.ticks_ms()
    getDBEStatus()
    duration = time.ticks_diff(time.ticks_ms(), start)
    print(f"Status query {i}: {duration}ms")
    time.sleep(1)
```

## Next Steps

1. **Test with real hardware** (Nissan LEAF battery + Pylon inverter)
2. **Add more battery types** (Tesla Model 3, BMW i3, etc.)
3. **Add more inverter protocols** (SMA, Growatt, etc.)
4. **Implement charger support**
5. **Add data logging and export**
6. **Add advanced diagnostics** (cell balancing, DTC codes, etc.)

## Reference

- **Original Project**: [Battery Emulator by Dala The Great](https://github.com/dalathegreat/Battery-Emulator)
- **CAN Manager**: `mpDirect/twai/can-manager-with-reference-counting.plan.md`
- **OVMS Extension**: `scripto-studio-registry/Extensions/OVMS/` (reference implementation)
- **OpenInverter Extension**: `scripto-studio-registry/Extensions/OpenInverter/` (UI reference)
