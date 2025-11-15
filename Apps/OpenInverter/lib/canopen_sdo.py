"""
CANopen SDO Protocol Implementation
====================================

This module implements the CANopen Service Data Object (SDO) protocol
for reading and writing OpenInverter parameters over CAN bus.

SDO Protocol:
- Client TX: 0x600 + node_id
- Client RX: 0x580 + node_id
- Expedited transfer only (4 bytes or less)

OpenInverter Parameter Addressing:
- Index: 0x2100 + (param_id >> 8)
- Subindex: param_id & 0xFF
- Fixed-point format: value * 32
"""

import struct
import time


# SDO Command Specifiers
SDO_CMD_UPLOAD_INITIATE = 0x40  # Read from device
SDO_CMD_DOWNLOAD_INITIATE = 0x23  # Write to device (4 bytes, expedited)
SDO_CMD_UPLOAD_RESPONSE = 0x43  # Device response to upload (4 bytes)
SDO_CMD_DOWNLOAD_RESPONSE = 0x60  # Device response to download
SDO_CMD_ABORT = 0x80  # Abort transfer


# Common SDO Abort Codes
SDO_ABORT_CODES = {
    0x05030000: "Toggle bit not alternated",
    0x05040000: "SDO protocol timed out",
    0x05040001: "Command specifier not valid or unknown",
    0x05040002: "Invalid block size",
    0x05040003: "Invalid sequence number",
    0x05040004: "CRC error",
    0x05040005: "Out of memory",
    0x06010000: "Unsupported access to an object",
    0x06010001: "Attempt to read a write-only object",
    0x06010002: "Attempt to write a read-only object",
    0x06020000: "Object does not exist in the object dictionary",
    0x06040041: "Object cannot be mapped to the PDO",
    0x06040042: "Number and length of objects to be mapped exceeds PDO length",
    0x06040043: "General parameter incompatibility reason",
    0x06040047: "General internal incompatibility in device",
    0x06060000: "Access failed due to hardware error",
    0x06070010: "Data type does not match, length does not match",
    0x06070012: "Data type does not match, length too high",
    0x06070013: "Data type does not match, length too low",
    0x06090011: "Subindex does not exist",
    0x06090030: "Value range of parameter exceeded",
    0x06090031: "Value of parameter written too high",
    0x06090032: "Value of parameter written too low",
    0x06090036: "Maximum value is less than minimum value",
    0x08000000: "General error",
    0x08000020: "Data cannot be transferred or stored to the application",
    0x08000021: "Data cannot be transferred or stored because of local control",
    0x08000022: "Data cannot be transferred or stored because of device state",
    0x08000023: "Object dictionary dynamic generation fails or no object available",
}


class SDOTimeoutError(Exception):
    """Raised when SDO request times out"""
    pass


class SDOAbortError(Exception):
    """Raised when device aborts SDO transfer"""
    def __init__(self, abort_code):
        self.abort_code = abort_code
        self.message = SDO_ABORT_CODES.get(abort_code, f"Unknown abort code: 0x{abort_code:08X}")
        super().__init__(self.message)


class SDOClient:
    """
    CANopen SDO client for OpenInverter parameter access.
    
    Usage:
        sdo = SDOClient(can_device, node_id=1, timeout=1.0)
        value = sdo.read(0x2100, 0x01)  # Read parameter
        sdo.write(0x2100, 0x01, 0x1234)  # Write parameter
    """
    
    def __init__(self, can_device, node_id=1, timeout=1.0):
        """
        Initialize SDO client.
        
        Args:
            can_device: CAN device instance (from CAN module)
            node_id: CANopen node ID (1-127)
            timeout: Response timeout in seconds
        """
        self.can = can_device
        self.node_id = node_id
        self.timeout = timeout
        self.tx_cobid = 0x600 + node_id  # SDO client TX
        self.rx_cobid = 0x580 + node_id  # SDO client RX
    
    def read(self, index, subindex):
        """
        Read a value from the device (SDO upload).
        
        Args:
            index: Object dictionary index (0x0000-0xFFFF)
            subindex: Object dictionary subindex (0x00-0xFF)
        
        Returns:
            32-bit integer value
        
        Raises:
            SDOTimeoutError: If no response within timeout
            SDOAbortError: If device aborts the transfer
        """
        # Build upload initiate request
        request = struct.pack('<BBHB3x',
            SDO_CMD_UPLOAD_INITIATE,
            index & 0xFF,
            index >> 8,
            subindex
        )
        
        # Send SDO request
        self.can.send(list(request), self.tx_cobid)
        
        # Wait for response
        start_time = time.time()
        while True:
            if self.can.any():
                response = self.can.recv()
                can_id = response[0]
                data = response[3]  # Payload bytes
                
                # Check if it's our response
                if can_id == self.rx_cobid and len(data) == 8:
                    cmd = data[0]
                    
                    # Check for abort
                    if cmd == SDO_CMD_ABORT:
                        abort_code = struct.unpack('<I', data[4:8])[0]
                        raise SDOAbortError(abort_code)
                    
                    # Check for upload response
                    if cmd == SDO_CMD_UPLOAD_RESPONSE:
                        # Extract 4-byte value (little-endian)
                        value = struct.unpack('<I', data[4:8])[0]
                        # Convert to signed 32-bit
                        if value >= 0x80000000:
                            value -= 0x100000000
                        return value
            
            # Check timeout
            if time.time() - start_time > self.timeout:
                raise SDOTimeoutError(f"SDO read timeout (index=0x{index:04X}, subindex=0x{subindex:02X})")
            
            time.sleep(0.001)  # Small delay to avoid busy loop
    
    def write(self, index, subindex, value):
        """
        Write a value to the device (SDO download).
        
        Args:
            index: Object dictionary index (0x0000-0xFFFF)
            subindex: Object dictionary subindex (0x00-0xFF)
            value: 32-bit integer value (will be converted to signed)
        
        Raises:
            SDOTimeoutError: If no response within timeout
            SDOAbortError: If device aborts the transfer
        """
        # Convert to unsigned 32-bit for transmission
        if value < 0:
            value += 0x100000000
        
        # Build download initiate request (expedited, 4 bytes)
        request = struct.pack('<BBHBI',
            SDO_CMD_DOWNLOAD_INITIATE,
            index & 0xFF,
            index >> 8,
            subindex,
            value
        )
        
        # Send SDO request
        self.can.send(list(request), self.tx_cobid)
        
        # Wait for response
        start_time = time.time()
        while True:
            if self.can.any():
                response = self.can.recv()
                can_id = response[0]
                data = response[3]  # Payload bytes
                
                # Check if it's our response
                if can_id == self.rx_cobid and len(data) == 8:
                    cmd = data[0]
                    
                    # Check for abort
                    if cmd == SDO_CMD_ABORT:
                        abort_code = struct.unpack('<I', data[4:8])[0]
                        raise SDOAbortError(abort_code)
                    
                    # Check for download response
                    if cmd == SDO_CMD_DOWNLOAD_RESPONSE:
                        # Verify index and subindex match
                        resp_index = data[1] | (data[2] << 8)
                        resp_subindex = data[3]
                        if resp_index == index and resp_subindex == subindex:
                            return  # Success
            
            # Check timeout
            if time.time() - start_time > self.timeout:
                raise SDOTimeoutError(f"SDO write timeout (index=0x{index:04X}, subindex=0x{subindex:02X})")
            
            time.sleep(0.001)  # Small delay to avoid busy loop
    
    def abort_code_to_string(self, code):
        """Convert SDO abort code to human-readable string"""
        return SDO_ABORT_CODES.get(code, f"Unknown abort code: 0x{code:08X}")


# Helper functions for fixed-point conversion
def fixed_to_float(value):
    """Convert OpenInverter fixed-point (×32) to float"""
    return value / 32.0


def float_to_fixed(value):
    """Convert float to OpenInverter fixed-point (×32)"""
    return int(value * 32)


# Helper functions for parameter addressing
def param_id_to_sdo(param_id):
    """
    Convert OpenInverter parameter ID to SDO index/subindex.
    
    Args:
        param_id: Parameter ID (0-65535)
    
    Returns:
        Tuple of (index, subindex)
    """
    index = 0x2100 + (param_id >> 8)
    subindex = param_id & 0xFF
    return (index, subindex)


def sdo_to_param_id(index, subindex):
    """
    Convert SDO index/subindex to OpenInverter parameter ID.
    
    Args:
        index: SDO index
        subindex: SDO subindex
    
    Returns:
        Parameter ID
    """
    if index < 0x2100:
        return None
    param_id = ((index - 0x2100) << 8) | subindex
    return param_id

