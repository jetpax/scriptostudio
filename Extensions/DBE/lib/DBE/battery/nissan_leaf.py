"""
Nissan LEAF Battery Protocol
=============================

MicroPython port of Nissan LEAF battery protocol from Battery Emulator.

Supports ZE0 (2011-2013), AZE0 (2013-2017), and ZE1 (2018+) battery packs.

Reference: Battery-Emulator/Software/src/battery/NISSAN-LEAF-BATTERY.cpp
"""

import time
from lib.DBE.battery.battery_base import BatteryBase

# Constants
WH_PER_GID = 80  # Wh per GID (Nissan's internal capacity unit)

# Battery types
ZE0_BATTERY = 0   # 2011-2013 24kWh
AZE0_BATTERY = 1  # 2013-2017 24/30kWh
ZE1_BATTERY = 2   # 2018+ 40/62kWh

# Timing intervals (milliseconds)
INTERVAL_10_MS = 10
INTERVAL_40_MS = 40
INTERVAL_100_MS = 100
INTERVAL_500_MS = 500
INTERVAL_10_S = 10000


class NissanLeafBattery(BatteryBase):
    """Nissan LEAF battery protocol implementation
    
    Handles CAN communication with Nissan LEAF battery packs (ZE0, AZE0, ZE1).
    """
    
    def __init__(self, can_handle):
        """Initialize Nissan LEAF battery protocol
        
        Args:
            can_handle: CAN manager handle from CAN.can_register()
        """
        super().__init__(can_handle)
        
        # Battery type detection (will be auto-detected from CAN messages)
        self.battery_type = ZE0_BATTERY
        
        # Raw battery data from CAN
        self.battery_soc = 0          # State of charge (0-1023, 0.1% per bit)
        self.battery_soh = 100        # State of health (0-100%)
        self.battery_gids = 0         # Current GIDS
        self.battery_max_gids = 281   # Maximum GIDS (default for 24kWh)
        self.battery_wh_remaining = 0 # Wh remaining
        self.battery_total_voltage = 0  # Pack voltage (0.5V per bit)
        self.battery_current = 0      # Pack current (0.5A per bit, signed)
        self.battery_avg_temp = 0     # Average temperature (°C)
        self.battery_temp_min = 0     # Min temperature (°C)
        self.battery_temp_max = 0     # Max temperature (°C)
        self.battery_charge_power_limit = 0   # kW
        self.battery_discharge_power_limit = 0  # kW
        self.battery_max_power_for_charger = 0  # kW
        
        # Status flags
        self.battery_relay_cut_request = 0
        self.battery_failsafe_status = 0
        self.battery_main_relay_on = False
        self.battery_full_charge_flag = False
        self.battery_capacity_empty = False
        self.battery_interlock = False
        self.battery_can_alive = False
        
        # Heating system
        self.battery_heat_exist = False
        self.battery_heating_stop = False
        self.battery_heating_start = False
        self.battery_heater_mail_send_request = False
        
        # Timing for transmit
        self.last_10ms = 0
        self.last_40ms = 0
        self.last_100ms = 0
        self.last_500ms = 0
        self.last_10s = 0
        
        # Counters for message sequencing
        self.mprun10r = 0  # 0-19 counter for 0x1F2
        self.mprun10 = 0   # 0-3 counter
        self.mprun100 = 0  # 0-3 counter
        self.counter_3B8 = 0  # 0-14 counter for ZE1
        self.flip_3B8 = False  # Flip flag for ZE1
        
        # CAN message templates (will be populated in setup())
        self.LEAF_1F2 = None
        self.LEAF_50B = None
        self.LEAF_50C = None
        self.LEAF_355 = None
        self.LEAF_3B8 = None
        self.LEAF_5C5 = None
        self.LEAF_626 = None
    
    def setup(self):
        """Initialize Nissan LEAF battery protocol
        
        Sets up CAN message templates for keep-alive messages.
        """
        # Initialize CAN message templates
        self.LEAF_1F2 = bytearray([0x10, 0x64, 0x00, 0xB0, 0x00, 0x1E, 0x00, 0x8F])
        self.LEAF_50B = bytearray([0x00, 0x00, 0x06, 0xC0, 0x00, 0x00, 0x00])
        self.LEAF_50C = bytearray([0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        self.LEAF_355 = bytearray([0x14, 0x0A, 0x13, 0x97, 0x10, 0x00, 0x40, 0x00])
        self.LEAF_3B8 = bytearray([0x40, 0xC8, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])
        self.LEAF_5C5 = bytearray([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        self.LEAF_626 = bytearray([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    
    def handle_incoming_can_frame(self, can_id, data):
        """Process incoming CAN frame from battery
        
        Args:
            can_id: CAN message ID (int)
            data: CAN data bytes (bytearray/bytes, 0-8 bytes)
        """
        if can_id == 0x1DB:
            # Battery voltage, current, and status
            self.battery_current = (data[0] << 3) | ((data[1] & 0xE0) >> 5)
            if self.battery_current & 0x0400:
                # Negative (2's complement)
                self.battery_current |= 0xF800
                self.battery_current = -(0x10000 - self.battery_current)
            
            voltage_raw = (data[2] << 2) | ((data[3] & 0xC0) >> 6)
            if voltage_raw != 0x3FF:  # 0x3FF = unavailable
                self.battery_total_voltage = voltage_raw
            
            self.battery_relay_cut_request = (data[1] & 0x18) >> 3
            self.battery_failsafe_status = data[1] & 0x07
            self.battery_main_relay_on = bool((data[3] & 0x20) >> 5)
            self.battery_full_charge_flag = bool((data[3] & 0x10) >> 4)
            self.battery_interlock = bool((data[3] & 0x08) >> 3)
            
        elif can_id == 0x1DC:
            # Power limits
            self.battery_discharge_power_limit = ((data[0] << 2) | (data[1] >> 6)) / 4.0
            self.battery_charge_power_limit = (((data[1] & 0x3F) << 4) | (data[2] >> 4)) / 4.0
            self.battery_max_power_for_charger = ((((data[2] & 0x0F) << 6) | (data[3] >> 2)) / 10.0) - 10
            
        elif can_id == 0x55B:
            # State of charge
            soc_raw = (data[0] << 2) | (data[1] >> 6)
            if soc_raw != 0x3FF:  # 0x3FF = unavailable
                self.battery_soc = soc_raw
            self.battery_capacity_empty = bool((data[6] & 0x80) >> 7)
            
        elif can_id == 0x5BC:
            # GIDS, SOH, temperature
            self.battery_can_alive = True
            
            is_max_gids = bool((data[5] & 0x10) >> 4)
            gids_value = (data[0] << 2) | ((data[1] & 0xC0) >> 6)
            
            if is_max_gids:
                self.battery_max_gids = gids_value
            else:
                self.battery_gids = gids_value
                self.battery_wh_remaining = self.battery_gids * WH_PER_GID
            
            # Temperature (ZE0 only)
            if self.battery_type == ZE0_BATTERY:
                self.battery_avg_temp = data[3] - 40  # -40 to +55°C
            
            # State of health
            soh_raw = data[4] >> 1
            if soh_raw != 0:
                self.battery_soh = soh_raw
                
        elif can_id == 0x5C0:
            # Temperature (AZE0) and heating system
            if self.battery_type == AZE0_BATTERY:
                mux = data[0] >> 6
                if mux == 1:  # MAX temperature
                    self.battery_temp_max = (data[2] / 2) - 40
                elif mux == 3:  # MIN temperature
                    self.battery_temp_min = (data[2] / 2) - 40
            
            self.battery_heat_exist = bool(data[4] & 0x01)
            self.battery_heating_stop = bool((data[0] & 0x10) >> 4)
            self.battery_heating_start = bool((data[0] & 0x20) >> 5)
            self.battery_heater_mail_send_request = bool(data[1] & 0x01)
            
        elif can_id == 0x59E:
            # Battery type detection (AZE0 or ZE1)
            # If we receive this message, it's not a ZE0
            if self.battery_type == ZE0_BATTERY:
                # Detect AZE0 vs ZE1 based on other criteria
                # For now, assume AZE0 (will be refined with more messages)
                self.battery_type = AZE0_BATTERY
    
    def transmit_can(self, current_time_ms):
        """Send keep-alive messages to battery
        
        Args:
            current_time_ms: Current time from time.ticks_ms()
        """
        # Send 10ms message (0x1F2)
        if time.ticks_diff(current_time_ms, self.last_10ms) >= INTERVAL_10_MS:
            self.last_10ms = current_time_ms
            self._transmit_1F2()
            
        # Send 40ms message (0x355 for ZE1 only)
        if time.ticks_diff(current_time_ms, self.last_40ms) >= INTERVAL_40_MS:
            self.last_40ms = current_time_ms
            if self.battery_type == ZE1_BATTERY:
                self._transmit_can_frame(0x355, self.LEAF_355)
        
        # Send 100ms messages
        if time.ticks_diff(current_time_ms, self.last_100ms) >= INTERVAL_100_MS:
            self.last_100ms = current_time_ms
            self._transmit_100ms_messages()
    
    def _transmit_1F2(self):
        """Transmit 0x1F2 keep-alive message (10ms interval)
        
        This message has a complex 20-step sequence pattern.
        """
        # Update message based on counter (simplified version)
        # Full pattern from C++ code is complex, implementing key parts
        
        if self.mprun10r == 0:
            self.LEAF_1F2[3] = 0xB0
            self.LEAF_1F2[6] = 0x00
            self.LEAF_1F2[7] = 0x8F
        elif self.mprun10r == 5:
            self.LEAF_1F2[3] = 0xB4
            self.LEAF_1F2[6] = 0x01
            self.LEAF_1F2[7] = 0x84
        elif self.mprun10r == 10:
            self.LEAF_1F2[3] = 0xB0
            self.LEAF_1F2[6] = 0x02
            self.LEAF_1F2[7] = 0x81
        elif self.mprun10r == 15:
            self.LEAF_1F2[3] = 0xB4
            self.LEAF_1F2[6] = 0x03
            self.LEAF_1F2[7] = 0x86
        
        # Transmit message
        self._transmit_can_frame(0x1F2, self.LEAF_1F2)
        
        # Update counters
        self.mprun10r = (self.mprun10r + 1) % 20
        self.mprun10 = (self.mprun10 + 1) % 4
    
    def _transmit_100ms_messages(self):
        """Transmit 100ms keep-alive messages"""
        # Ack heater request if needed
        if self.battery_heater_mail_send_request:
            self.LEAF_50B[6] = 0x20  # Batt_Heater_Mail_Send_OK
        else:
            self.LEAF_50B[6] = 0x00  # Batt_Heater_Mail_Send_NG
        
        # ZE1-specific messages
        if self.battery_type == ZE1_BATTERY:
            self.counter_3B8 = (self.counter_3B8 + 1) % 15
            self.LEAF_3B8[2] = self.counter_3B8
            self._transmit_can_frame(0x3B8, self.LEAF_3B8)
            self._transmit_can_frame(0x5C5, self.LEAF_5C5)
            self._transmit_can_frame(0x626, self.LEAF_626)
            
            # Flip bit in 0x3B8
            if self.flip_3B8:
                self.flip_3B8 = False
                self.LEAF_3B8[1] = 0xC8
            else:
                self.flip_3B8 = True
                self.LEAF_3B8[1] = 0xE8
        
        # VCM wake/sleep message
        self._transmit_can_frame(0x50B, self.LEAF_50B)
        
        # 0x50C message with counter
        self.LEAF_50C[3] = self.mprun100
        if self.mprun100 == 0:
            self.LEAF_50C[4] = 0x5D
            self.LEAF_50C[5] = 0xC8
        elif self.mprun100 == 1:
            self.LEAF_50C[4] = 0xB2
            self.LEAF_50C[5] = 0x31
        elif self.mprun100 == 2:
            self.LEAF_50C[4] = 0x5D
            self.LEAF_50C[5] = 0x63
        elif self.mprun100 == 3:
            self.LEAF_50C[4] = 0xB2
            self.LEAF_50C[5] = 0x9C
        
        self._transmit_can_frame(0x50C, self.LEAF_50C)
        
        # Update counter
        self.mprun100 = (self.mprun100 + 1) % 4
    
    def update_values(self):
        """Update derived values and map to battery_data dict"""
        # Call parent to calculate power
        super().update_values()
        
        # Map raw values to battery_data
        self.battery_data['voltage_dV'] = self.battery_total_voltage * 5  # 0.5V/bit -> decivolts
        self.battery_data['current_dA'] = self.battery_current * 5  # 0.5A/bit -> deciamps
        self.battery_data['soc_percent'] = int((self.battery_soc / 10.23))  # 0-1023 -> 0-100%
        self.battery_data['soh_percent'] = self.battery_soh
        
        # Temperature
        if self.battery_type == ZE0_BATTERY:
            self.battery_data['temp_avg_C'] = self.battery_avg_temp
            self.battery_data['temp_min_C'] = self.battery_avg_temp - 1
            self.battery_data['temp_max_C'] = self.battery_avg_temp
        elif self.battery_type == AZE0_BATTERY:
            self.battery_data['temp_min_C'] = self.battery_temp_min
            self.battery_data['temp_max_C'] = self.battery_temp_max
            self.battery_data['temp_avg_C'] = (self.battery_temp_min + self.battery_temp_max) / 2
        
        # Power limits (kW -> deciamps approximation)
        # Assume nominal voltage for conversion
        nominal_voltage_V = self.battery_data['voltage_dV'] / 10.0
        if nominal_voltage_V > 0:
            self.battery_data['max_charge_current_dA'] = int((self.battery_charge_power_limit * 1000 / nominal_voltage_V) * 10)
            self.battery_data['max_discharge_current_dA'] = int((self.battery_discharge_power_limit * 1000 / nominal_voltage_V) * 10)
        
        # Status
        if self.battery_failsafe_status > 0:
            self.battery_data['status'] = f'failsafe_{self.battery_failsafe_status}'
        elif self.battery_full_charge_flag:
            self.battery_data['status'] = 'full'
        elif self.battery_capacity_empty:
            self.battery_data['status'] = 'empty'
        elif self.battery_can_alive:
            self.battery_data['status'] = 'ok'
        else:
            self.battery_data['status'] = 'unknown'
        
        # Alarms/warnings
        alarms = 0
        if self.battery_relay_cut_request:
            alarms |= 0x01
        if self.battery_failsafe_status > 0:
            alarms |= 0x02
        if not self.battery_interlock:
            alarms |= 0x04
        if self.battery_gids < 10:
            alarms |= 0x08
        
        self.battery_data['alarms'] = alarms
        self.battery_data['last_update_ms'] = time.ticks_ms()
        self.battery_data['frame_count'] += 1
