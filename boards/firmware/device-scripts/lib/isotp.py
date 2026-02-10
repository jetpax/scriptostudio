"""
ISO-TP Transport Layer (ISO 15765-2)
=====================================

Transport layer for UDS/OBD2 communication over CAN bus.
Handles message segmentation and reassembly for messages > 7 bytes.

Frame Types:
- Single Frame (SF):      Messages <= 7 bytes
- First Frame (FF):       First segment of multi-frame message
- Consecutive Frame (CF): Subsequent segments
- Flow Control (FC):      Flow control from receiver

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import time

# Frame type nibbles (upper nibble of first byte)
FRAME_TYPE_SF = 0x00  # Single Frame
FRAME_TYPE_FF = 0x10  # First Frame
FRAME_TYPE_CF = 0x20  # Consecutive Frame
FRAME_TYPE_FC = 0x30  # Flow Control

# Flow Status values
FS_CTS = 0x00         # Continue To Send
FS_WAIT = 0x01        # Wait
FS_OVERFLOW = 0x02    # Overflow

# Default values
DEFAULT_BLOCK_SIZE = 0       # 0 = no limit
DEFAULT_ST_MIN = 0           # Separation time minimum (ms)
DEFAULT_PADDING = 0xCC       # Padding byte


class IsoTpError(Exception):
    """Base exception for ISO-TP errors"""
    pass


class IsoTpTimeoutError(IsoTpError):
    """Raised when ISO-TP operation times out"""
    pass


class IsoTpOverflowError(IsoTpError):
    """Raised when receiver reports overflow"""
    pass


class IsoTpTransport:
    """
    ISO-TP transport layer for CAN bus communication.
    
    Usage:
        import twai
        twai.init(tx=5, rx=4, baudrate=500000)
        
        tp = IsoTpTransport(twai, tx_id=0x7E0, rx_id=0x7E8)
        
        # Send a message
        tp.send(bytes([0x22, 0xF1, 0x90]))  # ReadDataByID
        
        # Receive response
        response = tp.recv(timeout_ms=1000)
    """
    
    def __init__(self, can, tx_id, rx_id, padding=DEFAULT_PADDING,
                 block_size=DEFAULT_BLOCK_SIZE, st_min=DEFAULT_ST_MIN):
        """
        Initialize ISO-TP transport.
        
        Args:
            can: CAN interface (must have send(), recv(), any() methods)
            tx_id: CAN ID for transmitting
            rx_id: CAN ID for receiving
            padding: Padding byte for unused frame bytes (default 0xCC)
            block_size: Block size for flow control (0 = unlimited)
            st_min: Separation time minimum in ms
        """
        self.can = can
        self.tx_id = tx_id
        self.rx_id = rx_id
        self.padding = padding
        self.block_size = block_size
        self.st_min = st_min
    
    def send(self, data, timeout_ms=1000):
        """
        Send data using ISO-TP framing.
        
        Args:
            data: Bytes to send
            timeout_ms: Timeout for flow control (multi-frame only)
            
        Returns:
            True if sent successfully
            
        Raises:
            IsoTpTimeoutError: If flow control timeout
            IsoTpOverflowError: If receiver reports overflow
        """
        data = bytes(data)
        
        if len(data) <= 7:
            # Single Frame
            return self._send_single_frame(data)
        else:
            # Multi-frame
            return self._send_multi_frame(data, timeout_ms)
    
    def recv(self, timeout_ms=1000):
        """
        Receive data using ISO-TP framing.
        
        Args:
            timeout_ms: Maximum time to wait for complete message
            
        Returns:
            Received data as bytes, or None on timeout
            
        Raises:
            IsoTpTimeoutError: If timeout waiting for frames
        """
        deadline = self._get_deadline(timeout_ms)
        
        while self._time_remaining(deadline) > 0:
            frame = self._recv_frame(self._time_remaining(deadline))
            if frame is None:
                continue
                
            frame_type = frame[0] & 0xF0
            
            if frame_type == FRAME_TYPE_SF:
                # Single Frame
                length = frame[0] & 0x0F
                return bytes(frame[1:1+length])
                
            elif frame_type == FRAME_TYPE_FF:
                # First Frame - start multi-frame reception
                length = ((frame[0] & 0x0F) << 8) | frame[1]
                data = bytearray(frame[2:8])
                
                # Send Flow Control
                self._send_flow_control()
                
                # Receive Consecutive Frames
                seq = 1
                while len(data) < length:
                    remaining = self._time_remaining(deadline)
                    if remaining <= 0:
                        raise IsoTpTimeoutError("Timeout waiting for CF")
                    
                    cf = self._recv_frame(remaining)
                    if cf is None:
                        continue
                    
                    cf_type = cf[0] & 0xF0
                    cf_seq = cf[0] & 0x0F
                    
                    if cf_type != FRAME_TYPE_CF:
                        continue  # Ignore non-CF frames
                    
                    if cf_seq != (seq & 0x0F):
                        continue  # Wrong sequence, skip
                    
                    # Add data from CF
                    bytes_needed = length - len(data)
                    data.extend(cf[1:1+min(7, bytes_needed)])
                    seq += 1
                
                return bytes(data[:length])
        
        return None
    
    def _send_single_frame(self, data):
        """Send a single frame."""
        frame = bytearray(8)
        frame[0] = FRAME_TYPE_SF | len(data)
        frame[1:1+len(data)] = data
        # Fill rest with padding
        for i in range(1+len(data), 8):
            frame[i] = self.padding
        
        self.can.send(list(frame), self.tx_id)
        return True
    
    def _send_multi_frame(self, data, timeout_ms):
        """Send a multi-frame message."""
        deadline = self._get_deadline(timeout_ms)
        
        # Send First Frame
        ff = bytearray(8)
        ff[0] = FRAME_TYPE_FF | ((len(data) >> 8) & 0x0F)
        ff[1] = len(data) & 0xFF
        ff[2:8] = data[0:6]
        self.can.send(list(ff), self.tx_id)
        
        # Wait for Flow Control
        fc = self._wait_for_flow_control(deadline)
        if fc is None:
            raise IsoTpTimeoutError("Timeout waiting for FC")
        
        fs = fc[0] & 0x0F
        if fs == FS_OVERFLOW:
            raise IsoTpOverflowError("Receiver overflow")
        
        bs = fc[1]  # Block size
        st_min = fc[2]  # Separation time
        
        # Convert ST_min to milliseconds
        if st_min <= 127:
            st_delay_ms = st_min
        elif 0xF1 <= st_min <= 0xF9:
            st_delay_ms = (st_min - 0xF0) * 0.1  # 100-900 microseconds
        else:
            st_delay_ms = 1  # Default
        
        # Send Consecutive Frames
        offset = 6
        seq = 1
        block_count = 0
        
        while offset < len(data):
            cf = bytearray(8)
            cf[0] = FRAME_TYPE_CF | (seq & 0x0F)
            
            chunk = data[offset:offset+7]
            cf[1:1+len(chunk)] = chunk
            # Padding
            for i in range(1+len(chunk), 8):
                cf[i] = self.padding
            
            self.can.send(list(cf), self.tx_id)
            
            offset += 7
            seq += 1
            block_count += 1
            
            # Wait for next FC if block size reached
            if bs > 0 and block_count >= bs and offset < len(data):
                fc = self._wait_for_flow_control(deadline)
                if fc is None:
                    raise IsoTpTimeoutError("Timeout waiting for FC")
                fs = fc[0] & 0x0F
                if fs == FS_OVERFLOW:
                    raise IsoTpOverflowError("Receiver overflow")
                block_count = 0
            elif st_delay_ms > 0:
                self._sleep_ms(st_delay_ms)
        
        return True
    
    def _send_flow_control(self, fs=FS_CTS):
        """Send a flow control frame."""
        fc = bytearray(8)
        fc[0] = FRAME_TYPE_FC | fs
        fc[1] = self.block_size
        fc[2] = self.st_min
        for i in range(3, 8):
            fc[i] = self.padding
        self.can.send(list(fc), self.tx_id)
    
    def _wait_for_flow_control(self, deadline):
        """Wait for and return flow control frame."""
        while self._time_remaining(deadline) > 0:
            frame = self._recv_frame(self._time_remaining(deadline))
            if frame and (frame[0] & 0xF0) == FRAME_TYPE_FC:
                return frame
        return None
    
    def _recv_frame(self, timeout_ms):
        """Receive a single CAN frame for our rx_id."""
        deadline = self._get_deadline(timeout_ms)
        
        while self._time_remaining(deadline) > 0:
            if self.can.any():
                msg = self.can.recv()
                can_id = msg[0]
                # Handle different recv() return formats
                if len(msg) >= 4:
                    payload = msg[3] if isinstance(msg[3], (bytes, bytearray, list)) else msg[1]
                else:
                    payload = msg[1]
                
                if can_id == self.rx_id:
                    if isinstance(payload, (bytes, bytearray)):
                        return list(payload)
                    return list(payload)
            
            self._sleep_ms(1)
        
        return None
    
    def _get_deadline(self, timeout_ms):
        """Get deadline timestamp."""
        try:
            return time.ticks_add(time.ticks_ms(), timeout_ms)
        except AttributeError:
            return time.time() + timeout_ms / 1000
    
    def _time_remaining(self, deadline):
        """Get remaining time in ms."""
        try:
            return time.ticks_diff(deadline, time.ticks_ms())
        except AttributeError:
            return int((deadline - time.time()) * 1000)
    
    def _sleep_ms(self, ms):
        """Sleep for milliseconds."""
        try:
            time.sleep_ms(int(ms))
        except AttributeError:
            time.sleep(ms / 1000)
