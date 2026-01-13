# Battery Porting Guide

Guide for porting additional battery types from Battery Emulator C++ to DBE MicroPython.

## Overview

The Battery Emulator supports 45+ battery types. This guide explains how to port them to the DBE extension.

## Porting Process

### Step 1: Choose Battery to Port

**Priority Batteries**:
1. **Tesla Model 3/Y** - Popular, moderate complexity
2. **BMW i3** - Common in conversions
3. **Chevy Bolt/Ampera** - Well-documented
4. **Renault Zoe** - European market
5. **VW MEB** - Modern platform

**Reference Location**: `Battery-Emulator/Software/src/battery/`

### Step 2: Analyze C++ Implementation

**Key Files to Review**:
- `{BATTERY}-BATTERY.h` - Header with class definition
- `{BATTERY}-BATTERY.cpp` - Implementation

**Key Sections**:
1. **Class Definition**: Member variables, constants
2. **setup()**: Initialization code
3. **handle_incoming_can_frame()**: CAN RX parsing
4. **update_values()**: Derived value calculations
5. **transmit_can()**: Keep-alive message transmission

### Step 3: Create MicroPython File

**File Location**: `Extensions/DBE/lib/DBE/battery/{battery_name}.py`

**Template**:

```python
"""
{Battery Name} Battery Protocol
================================

MicroPython port of {Battery Name} battery protocol from Battery Emulator.

Supports: {list of variants/generations}

Reference: Battery-Emulator/Software/src/battery/{BATTERY}-BATTERY.cpp
"""

import time
from lib.DBE.battery.battery_base import BatteryBase

# Constants (from C++ header)
CONSTANT_1 = 0x123
CONSTANT_2 = 0x456

class {BatteryName}Battery(BatteryBase):
    """Battery protocol implementation"""
    
    def __init__(self, can_handle):
        super().__init__(can_handle)
        
        # Raw battery data (from C++ member variables)
        self.raw_variable_1 = 0
        self.raw_variable_2 = 0
        # ... etc
        
        # Timing for transmit
        self.last_10ms = 0
        self.last_100ms = 0
        # ... etc
        
        # CAN message templates
        self.MSG_1 = None
        self.MSG_2 = None
        # ... etc
    
    def setup(self):
        """Initialize battery protocol"""
        # Initialize CAN message templates (from C++ header)
        self.MSG_1 = bytearray([0x00, 0x00, ...])
        self.MSG_2 = bytearray([0x00, 0x00, ...])
        # ... etc
    
    def handle_incoming_can_frame(self, can_id, data):
        """Process incoming CAN frame"""
        if can_id == 0xABC:
            # Parse frame (from C++ switch case)
            self.raw_variable_1 = (data[0] << 8) | data[1]
            # ... etc
        elif can_id == 0xDEF:
            # Parse another frame
            self.raw_variable_2 = data[2]
            # ... etc
    
    def transmit_can(self, current_time_ms):
        """Send keep-alive messages"""
        # Send 10ms message
        if time.ticks_diff(current_time_ms, self.last_10ms) >= 10:
            self.last_10ms = current_time_ms
            self._transmit_can_frame(0x123, self.MSG_1)
        
        # Send 100ms message
        if time.ticks_diff(current_time_ms, self.last_100ms) >= 100:
            self.last_100ms = current_time_ms
            self._transmit_can_frame(0x456, self.MSG_2)
    
    def update_values(self):
        """Update derived values"""
        super().update_values()
        
        # Map raw values to battery_data (from C++ update_values())
        self.battery_data['voltage_dV'] = self.raw_variable_1 * 5
        self.battery_data['current_dA'] = self.raw_variable_2 * 10
        # ... etc
```

### Step 4: Migration Patterns

#### Pattern 1: CAN Frame Parsing

**C++ Original**:
```cpp
case 0x1DB:
  battery_Current2 = (rx_frame.data.u8[0] << 3) | (rx_frame.data.u8[1] & 0xe0) >> 5;
  if (battery_Current2 & 0x0400) {
    battery_Current2 |= 0xf800;  // Sign extend
  }
  battery_Total_Voltage2 = ((rx_frame.data.u8[2] << 2) | (rx_frame.data.u8[3] & 0xc0) >> 6);
  break;
```

**MicroPython Port**:
```python
if can_id == 0x1DB:
    self.battery_current = (data[0] << 3) | ((data[1] & 0xE0) >> 5)
    if self.battery_current & 0x0400:
        # Negative (2's complement)
        self.battery_current |= 0xF800
        self.battery_current = -(0x10000 - self.battery_current)
    
    self.battery_total_voltage = (data[2] << 2) | ((data[3] & 0xC0) >> 6)
```

#### Pattern 2: CAN Frame Transmission

**C++ Original**:
```cpp
CAN_frame LEAF_1F2 = {
  .FD = false,
  .ext_ID = false,
  .DLC = 8,
  .ID = 0x1F2,
  .data = {0x10, 0x64, 0x00, 0xB0, 0x00, 0x1E, 0x00, 0x8F}
};

transmit_can_frame(&LEAF_1F2);
```

**MicroPython Port**:
```python
self.LEAF_1F2 = bytearray([0x10, 0x64, 0x00, 0xB0, 0x00, 0x1E, 0x00, 0x8F])

self._transmit_can_frame(0x1F2, self.LEAF_1F2)
```

#### Pattern 3: Timing and Intervals

**C++ Original**:
```cpp
unsigned long previousMillis10 = 0;
const unsigned long INTERVAL_10_MS = 10;

if (currentMillis - previousMillis10 >= INTERVAL_10_MS) {
  previousMillis10 = currentMillis;
  transmit_can_frame(&MSG);
}
```

**MicroPython Port**:
```python
self.last_10ms = 0
INTERVAL_10_MS = 10

if time.ticks_diff(current_time_ms, self.last_10ms) >= INTERVAL_10_MS:
    self.last_10ms = current_time_ms
    self._transmit_can_frame(0x123, self.MSG)
```

#### Pattern 4: Signed Integer Handling

**C++ Original**:
```cpp
int16_t current = (data[0] << 8) | data[1];
// Automatically handles sign
```

**MicroPython Port**:
```python
current = (data[0] << 8) | data[1]
if current >= 0x8000:  # Check sign bit
    current -= 0x10000  # Convert to negative
```

### Step 5: Update Configuration

**Add to `DBE_helpers.py`**:

```python
def getDBEConfig():
    config = {
        # ... existing config ...
        'available_batteries': {
            'nissan_leaf': 'Nissan LEAF (ZE0/AZE0/ZE1)',
            'tesla_model3': 'Tesla Model 3/Y',  # ADD THIS
            # ... etc
        }
    }
```

**Add to `startDBE()`**:

```python
def startDBE():
    # ... existing code ...
    
    if battery_type == 'nissan_leaf':
        from lib.DBE.battery.nissan_leaf import NissanLeafBattery
        _dbe_battery = NissanLeafBattery(_dbe_can_handle)
    elif battery_type == 'tesla_model3':  # ADD THIS
        from lib.DBE.battery.tesla_model3 import TeslaModel3Battery
        _dbe_battery = TeslaModel3Battery(_dbe_can_handle)
    # ... etc
```

**Add to `lib/package.json`**:

```json
{
  "urls": [
    // ... existing files ...
    ["DBE/battery/tesla_model3.py", "github:jetpax/scripto-studio-registry/Extensions/DBE/lib/DBE/battery/tesla_model3.py"]
  ]
}
```

### Step 6: Testing

**Unit Test** (CAN loopback):

```python
import CAN
import time

# Setup
can_handle = CAN.register(CAN.TX_ENABLED)
from lib.DBE.battery.{battery_name} import {BatteryName}Battery
battery = {BatteryName}Battery(can_handle)
battery.setup()

def test_rx(frame):
    battery.handle_incoming_can_frame(frame['id'], frame['data'])

CAN.set_rx_callback(can_handle, test_rx)
CAN.activate(can_handle)

# Send test frames (from C++ test data or real captures)
test_frames = [
    (0xABC, bytes([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77])),
    (0xDEF, bytes([0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF])),
]

for can_id, data in test_frames:
    CAN.transmit(can_handle, {'id': can_id, 'data': data})
    time.sleep(0.01)

# Check parsed data
time.sleep(0.1)
data = battery.get_data()
print(json.dumps(data, indent=2))

# Test keep-alive
current_time = time.ticks_ms()
battery.transmit_can(current_time)

# Cleanup
CAN.deactivate(can_handle)
CAN.unregister(can_handle)
```

**Integration Test** (real hardware):

```python
# Start full bridge
from lib.DBE.DBE_helpers import startDBE, getDBEMetrics
startDBE()

# Monitor for 30 seconds
import time
for i in range(30):
    getDBEMetrics()
    time.sleep(1)

# Stop
from lib.DBE.DBE_helpers import stopDBE
stopDBE()
```

## Common Issues

### Issue: Sign Extension Not Working

**Problem**: Negative currents showing as large positive values

**Solution**: Check sign bit and convert properly:

```python
# Wrong
current = (data[0] << 8) | data[1]

# Right
current = (data[0] << 8) | data[1]
if current >= 0x8000:
    current -= 0x10000
```

### Issue: Bit Masks Not Working

**Problem**: Extracted values incorrect

**Solution**: Check bit shift order and mask application:

```python
# Wrong
value = (data[0] & 0xF0 >> 4)  # Precedence issue!

# Right
value = (data[0] & 0xF0) >> 4  # Parentheses matter!
```

### Issue: Message Sequence Not Working

**Problem**: Battery not responding to keep-alive

**Solution**: Check message sequence and timing:

```python
# Some batteries require specific message sequences
# Follow C++ code exactly, including counter updates

self.counter = (self.counter + 1) % 4  # Modulo for rollover
```

## Reference Examples

### Simple Battery (Single CAN Message)

See: `PYLON-BATTERY.cpp` - Simple BMS with minimal CAN messages

### Complex Battery (Multiple Messages, Sequences)

See: `NISSAN-LEAF-BATTERY.cpp` - Complex protocol with 20-step sequence

### Multi-Generation Battery (Variants)

See: `TESLA-BATTERY.cpp` - Handles Model S/X/3/Y variants

## Validation Checklist

Before submitting a new battery implementation:

- [ ] All CAN messages documented (RX and TX)
- [ ] Frame parsing tested with real CAN captures
- [ ] Keep-alive messages verified (battery stays awake)
- [ ] Derived values calculated correctly (power, limits, etc.)
- [ ] Status flags handled properly (alarms, warnings)
- [ ] Temperature conversion verified (if applicable)
- [ ] Sign extension tested for signed values
- [ ] Battery type variants handled (if applicable)
- [ ] Code follows MicroPython compatibility rules
- [ ] Imports at module level (not in functions)
- [ ] No blocking delays in frame handlers
- [ ] Added to `getDBEConfig()` available_batteries
- [ ] Added to `startDBE()` battery type switch
- [ ] Added to `lib/package.json` for mip installation

## Getting Help

- **Original C++ Code**: `Battery-Emulator/Software/src/battery/`
- **Nissan LEAF Reference**: `lib/DBE/battery/nissan_leaf.py`
- **Base Class**: `lib/DBE/battery/battery_base.py`
- **CAN Manager Docs**: `mpDirect/twai/can-manager-with-reference-counting.plan.md`

## Contributing

When you've ported a new battery:

1. Test thoroughly with real hardware
2. Document CAN message IDs and formats
3. Add to available_batteries list
4. Update README.md with supported battery
5. Submit PR to scripto-studio-registry

## Battery Complexity Reference

### Simple (1-2 hours)
- Pylon BMS
- DALY BMS
- Relion Battery

### Moderate (3-6 hours)
- BMW i3
- Renault Zoe
- Chevy Bolt

### Complex (6-12 hours)
- Tesla Model 3/Y (chemistry variants)
- Nissan LEAF (3 generations)
- VW MEB (complex protocol)

### Very Complex (12+ hours)
- BMW iX (encrypted)
- Jaguar I-PACE (proprietary)
- Rivian (undocumented)
