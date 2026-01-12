"""
Inverter Base Class
===================

Abstract base class for inverter protocol implementations.
"""

import machine
from lib import board, settings


class InverterBase:
    """Abstract base class for inverter protocols
    
    Handles RS485 communication to inverter.
    """
    
    def __init__(self, uart_port=2, baudrate=None):
        """Initialize inverter protocol
        
        Args:
            uart_port: UART port number (default: 2)
            baudrate: Baud rate (default: from settings or 9600)
        """
        # Get baudrate from settings if not provided
        if baudrate is None:
            baudrate = settings.get('dbe.rs485_baudrate', 9600)
        
        # Get RS485 pins from board API
        try:
            rs485 = board.uart("rs485")
            tx_pin = rs485.tx
            rx_pin = rs485.rx
        except Exception:
            # Fallback to default pins if board API not available
            tx_pin = 17
            rx_pin = 16
        
        # Initialize UART
        self.uart = machine.UART(
            uart_port,
            baudrate=baudrate,
            tx=tx_pin,
            rx=rx_pin,
            timeout=100  # 100ms timeout for reads
        )
        
        # Timing state
        self.last_transmit_ms = 0
        self.transmit_interval_ms = 1000  # Default: 1Hz
        
        # RX buffer for incoming messages
        self.rx_buffer = bytearray()
    
    def transmit(self, battery_data, current_time_ms):
        """Send battery data to inverter via RS485
        
        Args:
            battery_data: Dict of battery data from battery.get_data()
            current_time_ms: Current time from time.ticks_ms()
        """
        raise NotImplementedError("Subclass must implement transmit()")
    
    def receive(self):
        """Check for incoming messages from inverter
        
        Returns:
            dict: Parsed commands from inverter, or None if no messages
        """
        # Check if data available
        if self.uart.any():
            # Read available data
            data = self.uart.read()
            if data:
                self.rx_buffer.extend(data)
                
                # Try to parse messages from buffer
                return self._parse_rx_buffer()
        
        return None
    
    def _parse_rx_buffer(self):
        """Parse RX buffer for complete messages
        
        Override in subclass to implement protocol-specific parsing.
        
        Returns:
            dict: Parsed commands, or None
        """
        # Default: no parsing (override in subclass)
        return None
    
    def _transmit_uart(self, data):
        """Helper to transmit data via UART
        
        Args:
            data: Bytes to transmit
        """
        if isinstance(data, (list, tuple)):
            data = bytes(data)
        
        self.uart.write(data)
