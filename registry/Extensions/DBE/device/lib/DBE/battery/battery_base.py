"""
Battery Base Class
==================

Abstract base class for battery protocol implementations.

Uses CAN manager for transmission (not direct CAN device access).
"""

import CAN


class BatteryBase:
    """Abstract base class for battery protocols
    
    Uses CAN manager for transmission (not direct CAN device access).
    """
    
    def __init__(self, can_handle):
        """Initialize with CAN manager handle
        
        Args:
            can_handle: Handle from CAN.register()
        """
        self.can_handle = can_handle
        self.battery_data = {
            # Voltage and current
            'voltage_dV': 0,          # Battery voltage in decivolts (e.g., 3600 = 360.0V)
            'current_dA': 0,          # Battery current in deciamps (signed, e.g., 100 = 10.0A)
            'power_W': 0,             # Calculated power in watts
            
            # State of charge/health
            'soc_percent': 0,         # State of charge (0-100%)
            'soh_percent': 100,       # State of health (0-100%)
            
            # Temperature
            'temp_max_C': 0,          # Maximum cell temperature (°C)
            'temp_min_C': 0,          # Minimum cell temperature (°C)
            'temp_avg_C': 0,          # Average cell temperature (°C)
            
            # Cell voltages
            'cell_max_mV': 0,         # Maximum cell voltage (millivolts)
            'cell_min_mV': 0,         # Minimum cell voltage (millivolts)
            'cell_deviation_mV': 0,   # Cell voltage deviation (max - min)
            
            # Limits
            'max_charge_current_dA': 0,    # Maximum charge current (deciamps)
            'max_discharge_current_dA': 0, # Maximum discharge current (deciamps)
            'max_voltage_dV': 0,           # Maximum pack voltage (decivolts)
            'min_voltage_dV': 0,           # Minimum pack voltage (decivolts)
            
            # Status/alarms
            'alarms': 0,              # Alarm bitfield
            'warnings': 0,            # Warning bitfield
            'status': 'unknown',      # Status string
            'error': '',              # Error message (if any)
            
            # Metadata
            'last_update_ms': 0,      # Last update timestamp (time.ticks_ms())
            'frame_count': 0,         # Number of frames received
        }
    
    def setup(self):
        """Initialize battery protocol
        
        Called once during startDBE(). Override to set up protocol-specific state.
        """
        raise NotImplementedError("Subclass must implement setup()")
    
    def handle_incoming_can_frame(self, can_id, data):
        """Process incoming CAN frame (called by CAN manager RX callback)
        
        Args:
            can_id: CAN message ID (int)
            data: CAN data bytes (bytearray/bytes, 0-8 bytes)
        """
        raise NotImplementedError("Subclass must implement handle_incoming_can_frame()")
    
    def transmit_can(self, current_time_ms):
        """Send keep-alive/control messages via CAN manager
        
        Uses CAN.transmit(self.can_handle, {'id': can_id, 'data': data})
        
        Args:
            current_time_ms: Current time from time.ticks_ms()
        """
        raise NotImplementedError("Subclass must implement transmit_can()")
    
    def update_values(self):
        """Update derived values (power, averages, etc.)
        
        Called periodically in main loop after CAN frames processed.
        Override to calculate derived values from raw data.
        """
        # Calculate power from voltage and current
        voltage_V = self.battery_data['voltage_dV'] / 10.0
        current_A = self.battery_data['current_dA'] / 10.0
        self.battery_data['power_W'] = int(voltage_V * current_A)
        
        # Calculate cell deviation
        self.battery_data['cell_deviation_mV'] = (
            self.battery_data['cell_max_mV'] - self.battery_data['cell_min_mV']
        )
    
    def get_data(self):
        """Return current battery data dict
        
        Returns:
            dict: Copy of battery_data
        """
        return self.battery_data.copy()
    
    def handle_inverter_commands(self, commands):
        """Handle control commands from inverter (optional)
        
        Override if battery supports inverter commands (enable charge/discharge, limits).
        
        Args:
            commands: Dict of inverter commands (enable_charge, enable_discharge, etc.)
        """
        pass  # Default: no-op (most batteries don't support inverter commands)
    
    def _transmit_can_frame(self, can_id, data):
        """Helper to transmit CAN frame via CAN manager
        
        Args:
            can_id: CAN message ID (int)
            data: Data bytes (list/tuple/bytes, 0-8 bytes)
        """
        # Ensure data is bytes-like
        if isinstance(data, (list, tuple)):
            data = bytes(data)
        
        # Transmit via CAN manager
        CAN.transmit(self.can_handle, {'id': can_id, 'data': data})
