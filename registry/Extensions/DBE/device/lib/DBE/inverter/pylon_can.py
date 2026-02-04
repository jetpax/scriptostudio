"""
Pylon CAN Protocol
==================

MicroPython port of Pylon CAN inverter protocol from Battery Emulator.

The Pylon protocol is used by many inverters (Growatt, Goodwe, Deye, etc.)
to communicate with battery systems.

NOTE: This implementation sends Pylon CAN frames via RS485 (CAN-over-RS485).
The frames are standard CAN format but transmitted over RS485 physical layer.

Reference: Battery-Emulator/Software/src/inverter/PYLON-CAN.cpp
"""

import struct
from lib.ext.dbe.inverter.inverter_base import InverterBase
from lib import settings


class PylonCANProtocol(InverterBase):
    """Pylon CAN protocol implementation
    
    Sends battery data to inverter using Pylon CAN message format.
    """
    
    def __init__(self, uart_port=2, baudrate=None):
        """Initialize Pylon CAN protocol
        
        Args:
            uart_port: UART port number (default: 2)
            baudrate: Baud rate (default: from settings or 9600)
        """
        super().__init__(uart_port, baudrate)
        
        # Configuration options (from settings)
        self.pylon_send = settings.get('dbe.pylon_send', 0)  # 0 or 1 (battery ID)
        self.pylon_30k_offset = settings.get('dbe.pylon_30k_offset', False)
        self.pylon_invert_byteorder = settings.get('dbe.pylon_invert_byteorder', False)
        
        # User-configurable battery parameters
        self.inverter_cells = settings.get('dbe.inverter_cells', 96)
        self.inverter_modules = settings.get('dbe.inverter_modules', 1)
        self.inverter_cells_per_module = settings.get('dbe.inverter_cells_per_module', 96)
        self.inverter_voltage_level = settings.get('dbe.inverter_voltage_level', 350)
        self.inverter_ah_capacity = settings.get('dbe.inverter_ah_capacity', 100)
        
        # Voltage offset for cutoff voltages (decivolts)
        self.voltage_offset_dV = 50  # 5.0V offset
        
        # CAN message IDs (will be set based on pylon_send)
        self._setup_can_ids()
        
        # CAN message buffers
        self.PYLON_731X = bytearray(8)  # Ensemble info
        self.PYLON_732X = bytearray(8)  # Battery parameters
        self.PYLON_421X = bytearray(8)  # Voltage, current, SOC, SOH
        self.PYLON_422X = bytearray(8)  # Voltage/current limits
        self.PYLON_423X = bytearray(8)  # Cell voltages
        self.PYLON_424X = bytearray(8)  # Cell temperatures
        self.PYLON_425X = bytearray(8)  # Status
        self.PYLON_426X = bytearray(8)  # Alarms
        self.PYLON_427X = bytearray(8)  # Module temperatures
        self.PYLON_428X = bytearray(8)  # Charge/discharge enable
        self.PYLON_429X = bytearray(8)  # Reserved
        
        # Initialize static messages
        self._init_static_messages()
        
        # Last request from inverter
        self.last_inverter_request = 0
    
    def _setup_can_ids(self):
        """Setup CAN message IDs based on pylon_send setting"""
        if self.pylon_send == 0:
            # Battery ID 0
            self.ID_731X = 0x7310
            self.ID_732X = 0x7320
            self.ID_421X = 0x4210
            self.ID_422X = 0x4220
            self.ID_423X = 0x4230
            self.ID_424X = 0x4240
            self.ID_425X = 0x4250
            self.ID_426X = 0x4260
            self.ID_427X = 0x4270
            self.ID_428X = 0x4280
            self.ID_429X = 0x4290
        else:
            # Battery ID 1
            self.ID_731X = 0x7311
            self.ID_732X = 0x7321
            self.ID_421X = 0x4211
            self.ID_422X = 0x4221
            self.ID_423X = 0x4231
            self.ID_424X = 0x4241
            self.ID_425X = 0x4251
            self.ID_426X = 0x4261
            self.ID_427X = 0x4271
            self.ID_428X = 0x4281
            self.ID_429X = 0x4291
    
    def _init_static_messages(self):
        """Initialize static Pylon messages (ensemble info, battery params)"""
        # 0x7310/0x7311: Ensemble info (manufacturer, model, etc.)
        # "PYLON" in ASCII
        self.PYLON_731X[0] = ord('P')
        self.PYLON_731X[1] = ord('Y')
        self.PYLON_731X[2] = ord('L')
        self.PYLON_731X[3] = ord('O')
        self.PYLON_731X[4] = ord('N')
        self.PYLON_731X[5] = 0x00
        self.PYLON_731X[6] = 0x00
        self.PYLON_731X[7] = 0x00
        
        # 0x7320/0x7321: Battery parameters
        self.PYLON_732X[0] = self.inverter_cells & 0xFF
        self.PYLON_732X[1] = (self.inverter_cells >> 8) & 0xFF
        self.PYLON_732X[2] = self.inverter_modules
        self.PYLON_732X[3] = self.inverter_cells_per_module
        self.PYLON_732X[4] = self.inverter_voltage_level & 0xFF
        self.PYLON_732X[5] = (self.inverter_voltage_level >> 8) & 0xFF
        self.PYLON_732X[6] = self.inverter_ah_capacity & 0xFF
        self.PYLON_732X[7] = (self.inverter_ah_capacity >> 8) & 0xFF
    
    def transmit(self, battery_data, current_time_ms):
        """Send battery data to inverter via RS485 (Pylon CAN frames)
        
        Args:
            battery_data: Dict of battery data from battery.get_data()
            current_time_ms: Current time from time.ticks_ms()
        """
        # Pylon protocol is request-response based
        # We only send data when inverter requests it
        # For now, send periodically at 1Hz (simplified)
        
        if current_time_ms - self.last_transmit_ms >= self.transmit_interval_ms:
            self.last_transmit_ms = current_time_ms
            
            # Update messages with current battery data
            self._update_messages(battery_data)
            
            # Send system data (most common request)
            self._send_system_data()
    
    def _update_messages(self, battery_data):
        """Update Pylon CAN messages with current battery data
        
        Args:
            battery_data: Dict of battery data
        """
        # Extract values from battery_data
        voltage_dV = battery_data.get('voltage_dV', 0)
        current_dA = battery_data.get('current_dA', 0)
        soc_percent = battery_data.get('soc_percent', 0)
        soh_percent = battery_data.get('soh_percent', 100)
        temp_max_dC = battery_data.get('temp_max_C', 25) * 10  # C to deciC
        temp_min_dC = battery_data.get('temp_min_C', 25) * 10
        cell_max_mV = battery_data.get('cell_max_mV', 3700)
        cell_min_mV = battery_data.get('cell_min_mV', 3700)
        max_charge_current_dA = battery_data.get('max_charge_current_dA', 0)
        max_discharge_current_dA = battery_data.get('max_discharge_current_dA', 0)
        
        # Calculate cutoff voltages (simplified - using fixed offsets)
        charge_cutoff_voltage_dV = voltage_dV + self.voltage_offset_dV
        discharge_cutoff_voltage_dV = voltage_dV - self.voltage_offset_dV
        
        # 0x4210/0x4211: Voltage, current, SOC, SOH
        self._set_u16(self.PYLON_421X, 0, voltage_dV)
        self._set_u16(self.PYLON_421X, 2, current_dA)
        self._set_u16(self.PYLON_421X, 4, temp_max_dC + 1000)  # Add 1000 offset
        self.PYLON_421X[6] = soc_percent
        self.PYLON_421X[7] = soh_percent
        
        # 0x4220/0x4221: Voltage/current limits
        self._set_u16(self.PYLON_422X, 0, charge_cutoff_voltage_dV)
        self._set_u16(self.PYLON_422X, 2, discharge_cutoff_voltage_dV)
        self._set_u16(self.PYLON_422X, 4, max_charge_current_dA)
        self._set_u16(self.PYLON_422X, 6, max_discharge_current_dA)
        
        # 0x4230/0x4231: Cell voltages
        self._set_u16(self.PYLON_423X, 0, cell_max_mV)
        self._set_u16(self.PYLON_423X, 2, cell_min_mV)
        
        # 0x4240/0x4241: Cell temperatures
        self._set_u16(self.PYLON_424X, 0, temp_max_dC)
        self._set_u16(self.PYLON_424X, 2, temp_min_dC)
        
        # 0x4250/0x4251: Status (0=Sleep, 1=Charge, 2=Discharge, 3=Idle)
        if current_dA < 0:
            self.PYLON_425X[0] = 0x01  # Charging
        elif current_dA > 0:
            self.PYLON_425X[0] = 0x02  # Discharging
        else:
            self.PYLON_425X[0] = 0x03  # Idle
        
        # 0x4260/0x4261: Alarms (not implemented yet)
        self.PYLON_426X[0] = 0x00
        
        # 0x4270/0x4271: Module temperatures
        self._set_u16(self.PYLON_427X, 0, temp_max_dC)
        self._set_u16(self.PYLON_427X, 2, temp_min_dC)
        
        # 0x4280/0x4281: Charge/discharge enable
        if max_charge_current_dA == 0:
            self.PYLON_428X[0] = 0xAA  # Charge forbidden
        else:
            self.PYLON_428X[0] = 0x00  # Charge allowed
        
        if max_discharge_current_dA == 0:
            self.PYLON_428X[1] = 0xAA  # Discharge forbidden
        else:
            self.PYLON_428X[1] = 0x00  # Discharge allowed
        
        # Apply 30k offset if enabled
        if self.pylon_30k_offset:
            self._apply_30k_offset(self.PYLON_421X, 2)  # Current
            self._apply_30k_offset(self.PYLON_422X, 4)  # Max charge current
            self._apply_30k_offset(self.PYLON_422X, 6)  # Max discharge current
        
        # Invert byte order if enabled
        if self.pylon_invert_byteorder:
            self._swap_bytes(self.PYLON_421X, 0)  # Voltage
            self._swap_bytes(self.PYLON_421X, 2)  # Current
            self._swap_bytes(self.PYLON_421X, 4)  # Temperature
            self._swap_bytes(self.PYLON_422X, 0)  # Max voltage
            self._swap_bytes(self.PYLON_422X, 2)  # Min voltage
            self._swap_bytes(self.PYLON_422X, 4)  # Max charge current
            self._swap_bytes(self.PYLON_422X, 6)  # Max discharge current
            self._swap_bytes(self.PYLON_423X, 0)  # Max cell voltage
            self._swap_bytes(self.PYLON_423X, 2)  # Min cell voltage
            self._swap_bytes(self.PYLON_424X, 0)  # Max cell temp
            self._swap_bytes(self.PYLON_424X, 2)  # Min cell temp
            self._swap_bytes(self.PYLON_427X, 0)  # Max module temp
            self._swap_bytes(self.PYLON_427X, 2)  # Min module temp
    
    def _send_setup_info(self):
        """Send ensemble information (manufacturer, battery params)"""
        self._transmit_can_frame(self.ID_731X, self.PYLON_731X)
        self._transmit_can_frame(self.ID_732X, self.PYLON_732X)
    
    def _send_system_data(self):
        """Send system equipment information (battery data)"""
        self._transmit_can_frame(self.ID_421X, self.PYLON_421X)
        self._transmit_can_frame(self.ID_422X, self.PYLON_422X)
        self._transmit_can_frame(self.ID_423X, self.PYLON_423X)
        self._transmit_can_frame(self.ID_424X, self.PYLON_424X)
        self._transmit_can_frame(self.ID_425X, self.PYLON_425X)
        self._transmit_can_frame(self.ID_426X, self.PYLON_426X)
        self._transmit_can_frame(self.ID_427X, self.PYLON_427X)
        self._transmit_can_frame(self.ID_428X, self.PYLON_428X)
        self._transmit_can_frame(self.ID_429X, self.PYLON_429X)
    
    def _transmit_can_frame(self, can_id, data):
        """Transmit CAN frame via RS485 (CAN-over-RS485)
        
        Frame format: [CAN_ID (2 bytes, big-endian)] [DLC (1 byte)] [Data (0-8 bytes)]
        
        Args:
            can_id: CAN message ID (int)
            data: CAN data bytes (bytearray, 8 bytes)
        """
        # Build CAN-over-RS485 frame
        frame = bytearray(11)  # 2 (ID) + 1 (DLC) + 8 (data)
        
        # CAN ID (big-endian)
        frame[0] = (can_id >> 8) & 0xFF
        frame[1] = can_id & 0xFF
        
        # DLC (always 8 for Pylon)
        frame[2] = 8
        
        # Data
        frame[3:11] = data
        
        # Transmit via UART
        self._transmit_uart(frame)
    
    def _set_u16(self, buffer, offset, value):
        """Set 16-bit unsigned value in buffer (big-endian)
        
        Args:
            buffer: Bytearray to write to
            offset: Byte offset
            value: 16-bit value
        """
        buffer[offset] = (value >> 8) & 0xFF
        buffer[offset + 1] = value & 0xFF
    
    def _apply_30k_offset(self, buffer, offset):
        """Apply 30000 offset to 16-bit value in buffer
        
        Args:
            buffer: Bytearray to modify
            offset: Byte offset of 16-bit value
        """
        value = (buffer[offset] << 8) | buffer[offset + 1]
        value += 30000
        buffer[offset] = (value >> 8) & 0xFF
        buffer[offset + 1] = value & 0xFF
    
    def _swap_bytes(self, buffer, offset):
        """Swap byte order of 16-bit value in buffer
        
        Args:
            buffer: Bytearray to modify
            offset: Byte offset of 16-bit value
        """
        buffer[offset], buffer[offset + 1] = buffer[offset + 1], buffer[offset]
