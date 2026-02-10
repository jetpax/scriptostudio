# ScriptOs

This section documents the built-in ScriptOs available in the ScriptO Studio registry.

![ScriptOs Panel](../assets/scripto.png)

## ScriptOs vs Extensions

Both ScriptOs and [Extensions](../extensions/index.md) expand ScriptO Studio functionality:

| Aspect | ScriptOs | Extensions |
|--------|----------|------------|
| **Language** | Python only | JavaScript (+ Python libs) |
| **UI Location** | Run from ScriptOs panel | Sidebar tabs |
| **Persistence** | Run on-demand | Always loaded |
| **Use Case** | Quick utilities, demos, automation | Complex tools with dedicated UI |

**Choose ScriptOs** for quick scripts, hardware testing, and simple UI plugins.  
**Choose Extensions** for persistent sidebar tools with complex UI.

## Categories

### UI Plugins

ScriptOs that provide their own web-based user interfaces, displayed in modal windows within ScriptO Studio.

- [UI Plugin - Hello World](ui-plugin-hello-world.md) - Minimal UI plugin demonstration

### Diagnostics & Testing

- **Memory Check** - Monitor device memory usage
- **CAN Loopback Test** - Test CAN bus hardware
- **Wi-Fi Scan** - Scan for available networks
- **I2C Slaves Scan** - Discover I2C devices
- **1-Wire Slaves Scan** - Discover 1-Wire devices

### Hardware Interfaces

- **GPIO Input** / **GPIO Output** - Digital I/O control
- **ADC Reader** - Analog input reading
- **DAC Output** - Analog output control
- **PWM & Lighting** / **PWM & Servo Motor** - PWM control

### Communication

- **UART Test** - Serial communication testing
- **BLE Scan** / **BLE iBeacon** - Bluetooth operations
- **USB Modem Status** - Cellular modem monitoring

### Automotive (UDS/CAN)

- **UDS Client Demo** - Unified Diagnostic Services client
- **UDS Server Demo** - Implement a UDS server
- **CANopen Bus Scanner** - Discover CANopen nodes

### LED Control

- **LEDs - NeoPixel Strip** - WS2812/SK6812 control
- **LEDs - DotStar Strip** - APA102 control
- **Status LED Color Control** - Device status LED

### Storage

- **SD Card Mount Test** - SD card operations
- **SD Card Complete** - Full SD card example

### Network

- **NTP Time Sync** - Synchronize device time
- **iperf3 Server** - Network speed testing

## Running ScriptOs

1. Open ScriptO Studio and connect to your device
2. Click the **ScriptOs** button in the sidebar
3. Select a category and choose a ScriptO
4. Configure any parameters (if available)
5. Click **Run** to execute on the device

> [!TIP]
> Most ScriptOs have configurable parameters. Check the configuration panel before running.

## Getting Started

- [Writing ScriptOs](writing-scriptos.md) - Create your own ScriptOs
- [VM Sharing & Async](vm-sharing.md) - How scripts share the MicroPython VM
- [UI Plugin - Hello World](ui-plugin-hello-world.md) - Example with custom UI
