# DBE MQTT Setup Guide

Detailed guide for setting up MQTT integration with the DBE extension.

## Prerequisites

- DBE extension installed in Scripto Studio
- MQTT broker accessible from ESP32 device
- (Optional) Home Assistant for autodiscovery

## MQTT Broker Options

### Option 1: Mosquitto (Local)

Install Mosquitto on your local network:

```bash
# Ubuntu/Debian
sudo apt-get install mosquitto mosquitto-clients

# macOS
brew install mosquitto

# Start service
sudo systemctl start mosquitto
```

### Option 2: Home Assistant Add-on

If using Home Assistant, install the Mosquitto broker add-on:

1. Go to **Settings → Add-ons → Add-on Store**
2. Search for "Mosquitto broker"
3. Click **Install**
4. Configure and start

### Option 3: Cloud MQTT

Use a cloud MQTT service like:
- **HiveMQ Cloud** (free tier available)
- **CloudMQTT** (free tier available)
- **AWS IoT Core**

## Configuration Steps

### Step 1: Configure MQTT Broker (Global Settings)

**Configure in System → Networks → MQTT Panel**:

1. Open Scripto Studio
2. Go to **System → Networks**
3. Select **MQTT** panel
4. Enter broker details:
   - **Server**: `mqtt.example.com` or IP address
   - **Port**: `1883` (default) or `8883` (TLS)
   - **Username**: (if required)
   - **Password**: (if required)
   - **TLS**: Enable if using port 8883
5. Click **Save**

**Note**: These settings are shared across all extensions that use MQTT (not just DBE).

### Step 2: Enable MQTT in DBE (Extension-Specific Settings)

**Configure in DBE → MQTT Panel**:

1. Open **DBE** extension
2. Select **MQTT** panel
3. Configure DBE-specific settings:
   - Check **Enable MQTT Publishing**
   - Set **Topic Prefix** (default: `BE`)
   - Set **Publish Interval** (default: 5 seconds)
   - Check **Publish All Cell Voltages** (if needed)
   - Check **Home Assistant Autodiscovery** (if using HA)
4. Click **Save**

**Note**: The broker connection info (server, port, credentials) is read from the global MQTT settings configured in Step 1.

### Step 3: Test MQTT Connection

1. Click **Test Connection** button
2. Verify success message
3. Check **MQTT Status** section for:
   - **Connection**: Should show "Connected"
   - **Messages Published**: Should increment
   - **Last Publish**: Should show recent time

### Step 4: Start DBE Bridge

1. Go to **DBE → Configuration** panel
2. Configure battery and inverter settings
3. Click **Start**
4. Verify MQTT telemetry is publishing

## Verifying MQTT Messages

### Using mosquitto_sub

Subscribe to all DBE topics:

```bash
# Subscribe to all topics
mosquitto_sub -h mqtt.example.com -t 'BE/#' -v

# Subscribe to specific topic
mosquitto_sub -h mqtt.example.com -t 'BE/info' -v
```

Expected output:
```
BE/status online
BE/info {"SOC": 85.5, "battery_voltage": 385.4, "battery_current": 15.2, ...}
BE/spec_data {"cell_voltages": [4.125, 4.118, 4.112, ...]}
```

### Using MQTT Explorer

1. Download [MQTT Explorer](http://mqtt-explorer.com/)
2. Connect to your broker
3. Navigate to `BE/` topic
4. View real-time telemetry

## Home Assistant Integration

### Automatic Setup (Autodiscovery)

If **Home Assistant Autodiscovery** is enabled in DBE:

1. Home Assistant will automatically discover all sensors and buttons
2. Go to **Settings → Devices & Services → MQTT**
3. Find "Battery Emulator" device
4. All entities will be created automatically

### Manual Setup

If autodiscovery is disabled, add to `configuration.yaml`:

```yaml
mqtt: !include mqtt.yaml
```

Create `mqtt.yaml`:

```yaml
sensor:
  # State of Charge
  - name: "Battery SOC"
    state_topic: "BE/info"
    unit_of_measurement: "%"
    value_template: "{{ value_json.SOC }}"
    device_class: "battery"
    state_class: "measurement"
    
  # Voltage
  - name: "Battery Voltage"
    state_topic: "BE/info"
    unit_of_measurement: "V"
    value_template: "{{ value_json.battery_voltage }}"
    device_class: "voltage"
    state_class: "measurement"
    
  # Current
  - name: "Battery Current"
    state_topic: "BE/info"
    unit_of_measurement: "A"
    value_template: "{{ value_json.battery_current }}"
    device_class: "current"
    state_class: "measurement"
    
  # Power
  - name: "Battery Power"
    state_topic: "BE/info"
    unit_of_measurement: "W"
    value_template: "{{ value_json.stat_batt_power }}"
    device_class: "power"
    state_class: "measurement"
    
  # Temperature
  - name: "Battery Temperature Max"
    state_topic: "BE/info"
    unit_of_measurement: "°C"
    value_template: "{{ value_json.temperature_max }}"
    device_class: "temperature"
    state_class: "measurement"
    
  - name: "Battery Temperature Min"
    state_topic: "BE/info"
    unit_of_measurement: "°C"
    value_template: "{{ value_json.temperature_min }}"
    device_class: "temperature"
    state_class: "measurement"
    
  # Cell Voltages
  - name: "Cell Max Voltage"
    state_topic: "BE/info"
    unit_of_measurement: "V"
    value_template: "{{ value_json.cell_max_voltage }}"
    device_class: "voltage"
    state_class: "measurement"
    
  - name: "Cell Min Voltage"
    state_topic: "BE/info"
    unit_of_measurement: "V"
    value_template: "{{ value_json.cell_min_voltage }}"
    device_class: "voltage"
    state_class: "measurement"
    
  # Capacity
  - name: "Battery Remaining Capacity"
    state_topic: "BE/info"
    unit_of_measurement: "Wh"
    value_template: "{{ value_json.remaining_capacity }}"
    device_class: "energy"
    state_class: "total"
    
  # Status
  - name: "BMS Status"
    state_topic: "BE/info"
    value_template: "{{ value_json.bms_status }}"

button:
  - name: "Pause Battery"
    command_topic: "BE/command/PAUSE"
    
  - name: "Resume Battery"
    command_topic: "BE/command/RESUME"
    
  - name: "Restart Emulator"
    command_topic: "BE/command/RESTART"
```

Restart Home Assistant to apply changes.

## Remote Control

### Pause/Resume Battery

```bash
# Pause charge/discharge
mosquitto_pub -h mqtt.example.com -t BE/command/PAUSE -m ""

# Resume operation
mosquitto_pub -h mqtt.example.com -t BE/command/RESUME -m ""
```

### Set Temporary Limits

```bash
# Set max charge to 50A, max discharge to 100A for 30 seconds
mosquitto_pub -h mqtt.example.com -t BE/command/SET_LIMITS -m '{"max_charge": 50, "max_discharge": 100, "timeout": 30}'
```

### Restart/Stop Bridge

```bash
# Restart DBE bridge
mosquitto_pub -h mqtt.example.com -t BE/command/RESTART -m ""

# Stop DBE bridge
mosquitto_pub -h mqtt.example.com -t BE/command/STOP -m ""
```

## Troubleshooting

### MQTT Not Connecting

**Check broker accessibility**:
```bash
ping mqtt.example.com
telnet mqtt.example.com 1883
```

**Check credentials**:
- Verify username/password are correct
- Check broker logs for authentication errors

**Check firewall**:
- Ensure port 1883 (or 8883 for TLS) is open
- Check ESP32 network connectivity

### No Messages Published

**Check DBE status**:
1. Go to **DBE → Status** panel
2. Verify bridge is running
3. Check for errors

**Check MQTT status**:
1. Go to **DBE → MQTT** panel
2. Verify connection status
3. Check "Messages Published" counter

**Check logs**:
- Use WebREPL console to view MQTT debug messages
- Look for `[MQTT]` prefixed messages

### Home Assistant Not Discovering

**Verify autodiscovery is enabled**:
1. **DBE → MQTT** panel
2. Check **Home Assistant Autodiscovery** is enabled

**Check HA MQTT integration**:
1. **Settings → Devices & Services → MQTT**
2. Verify MQTT integration is configured
3. Check broker connection

**Manual discovery trigger**:
- Restart DBE bridge to re-publish discovery messages
- Or restart Home Assistant

### Cell Voltages Not Publishing

**Check setting**:
1. **DBE → MQTT** panel
2. Verify **Publish All Cell Voltages** is checked

**Check bandwidth**:
- 96 cells = ~400 bytes per message
- Reduce publish interval if network is slow

## Performance Tuning

### Reduce Bandwidth

**Disable cell voltages**:
- Uncheck **Publish All Cell Voltages**
- Reduces message size by ~400 bytes

**Increase publish interval**:
- Change from 5 seconds to 10-30 seconds
- Reduces network traffic

### Improve Reliability

**Use QoS 1**:
- Ensures message delivery
- Slight performance overhead

**Enable retain**:
- Status messages retained on broker
- Clients get last value immediately

## Security Considerations

### Use Authentication

Always configure username/password for MQTT broker:

```bash
# Mosquitto password file
mosquitto_passwd -c /etc/mosquitto/passwd username
```

### Use TLS/SSL

For production deployments, use encrypted connections:

1. Configure broker for TLS (port 8883)
2. Upload CA certificate to ESP32
3. Set **Port** to `8883` in DBE MQTT config
4. Enable **TLS** option (if available)

### Network Isolation

- Place MQTT broker on isolated VLAN
- Use firewall rules to restrict access
- Only allow necessary devices

## Advanced Usage

### Custom Topic Prefix

Change topic prefix to avoid conflicts:

1. **DBE → MQTT** panel
2. Set **Topic Prefix** to custom value (e.g., `battery1`)
3. Topics become: `battery1/info`, `battery1/command/PAUSE`, etc.

### Multiple Batteries

Run multiple DBE instances with different topic prefixes:

- Battery 1: Topic prefix `BE1`
- Battery 2: Topic prefix `BE2`
- Battery 3: Topic prefix `BE3`

### Integration with Other Systems

**Node-RED**:
- Subscribe to `BE/info` topic
- Process JSON data
- Trigger automations

**Grafana**:
- Use MQTT data source plugin
- Create real-time dashboards
- Historical data analysis

**InfluxDB**:
- Use Telegraf MQTT input plugin
- Store time-series data
- Long-term trending

## Support

For issues or questions:
- Check [DBE Extension Documentation](README.md)
- Open issue on GitHub
- Join Scripto Studio Discord

## Future Enhancements

Planned MQTT features:
- Native ESP-IDF MQTT client (better performance)
- QoS 2 support
- Persistent sessions
- TLS/SSL hardware acceleration
- Message queuing during disconnection

See [DBE MQTT Integration Plan](../../.cursor/plans/dbe_mqtt_integration_*.plan.md) for details.
