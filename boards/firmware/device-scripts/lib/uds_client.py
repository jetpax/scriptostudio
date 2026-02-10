"""
UDS Client Implementation
=========================

UDS (Unified Diagnostic Services) client for automotive diagnostics.
Supports both UDS services and OBD2 modes for compatibility.

Based on ISO 14229 with transport over ISO 15765-2 (ISO-TP).

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import time
from .isotp import IsoTpTransport, IsoTpError, IsoTpTimeoutError
from .uds_services import (
    POSITIVE_RESPONSE_OFFSET,
    NEGATIVE_RESPONSE_SID,
    NRC_RESPONSE_PENDING,
    NRC_SERVICE_NOT_SUPPORTED,
    NRC_SECURITY_ACCESS_DENIED,
    SID_DIAGNOSTIC_SESSION_CONTROL,
    SID_ECU_RESET,
    SID_SECURITY_ACCESS,
    SID_TESTER_PRESENT,
    SID_READ_DATA_BY_IDENTIFIER,
    SID_WRITE_DATA_BY_IDENTIFIER,
    SID_ROUTINE_CONTROL,
    SID_CLEAR_DIAGNOSTIC_INFORMATION,
    SID_READ_DTC_INFORMATION,
    SESSION_DEFAULT,
    SESSION_EXTENDED_DIAGNOSTIC,
    is_positive_response,
    is_negative_response,
    is_response_pending,
    get_nrc,
    get_nrc_name,
)


class UDSError(Exception):
    """Base exception for UDS errors"""
    pass


class UDSTimeoutError(UDSError):
    """Raised when UDS request times out"""
    pass


class UDSNegativeResponseError(UDSError):
    """Raised when ECU returns a negative response"""
    def __init__(self, sid, nrc, message=None):
        self.sid = sid
        self.nrc = nrc
        self.nrc_name = get_nrc_name(nrc)
        super().__init__(message or f"NRC 0x{nrc:02X} ({self.nrc_name}) for SID 0x{sid:02X}")


class UDSClient:
    """
    UDS client for diagnostic communication with ECUs.
    
    Usage:
        import twai
        twai.init(tx=5, rx=4, baudrate=500000)
        
        client = UDSClient(twai, tx_id=0x7E0, rx_id=0x7E8)
        
        # Read VIN
        vin = client.read_data_by_identifier(0xF190)
        
        # Enter extended session
        client.diagnostic_session_control(SESSION_EXTENDED_DIAGNOSTIC)
        
        # Keep session alive
        client.tester_present()
    """
    
    # Timing defaults (milliseconds)
    DEFAULT_P2_TIMEOUT = 1000       # Normal response timeout
    DEFAULT_P2_STAR_TIMEOUT = 5000  # Extended timeout after Response Pending
    MAX_RESPONSE_PENDING = 50       # Max consecutive Response Pending allowed
    
    def __init__(self, can, tx_id=0x7E0, rx_id=0x7E8, 
                 p2_timeout=DEFAULT_P2_TIMEOUT,
                 p2_star_timeout=DEFAULT_P2_STAR_TIMEOUT,
                 padding=0xCC):
        """
        Initialize UDS client.
        
        Args:
            can: CAN interface (must have send(), recv(), any() methods)
            tx_id: CAN ID for transmitting requests (default: 0x7E0 physical)
            rx_id: CAN ID for receiving responses (default: 0x7E8)
            p2_timeout: Timeout for normal responses (ms)
            p2_star_timeout: Timeout after Response Pending (ms)
            padding: Padding byte for CAN frames
        """
        self.transport = IsoTpTransport(can, tx_id, rx_id, padding=padding)
        self.tx_id = tx_id
        self.rx_id = rx_id
        self.p2_timeout = p2_timeout
        self.p2_star_timeout = p2_star_timeout
    
    def send_service(self, sid, data=b'', suppress_positive_response=False):
        """
        Send a UDS service request and receive response.
        
        Automatically handles:
        - Response Pending (NRC 0x78) with extended timeout
        - Suppress Positive Response bit
        
        Args:
            sid: Service ID
            data: Service data bytes (without SID)
            suppress_positive_response: If True, don't wait for response
            
        Returns:
            Response data (including response SID) or None if suppressed
            
        Raises:
            UDSTimeoutError: If no response within timeout
            UDSNegativeResponseError: If ECU returns negative response (except 0x78)
        """
        # Build request
        request = bytes([sid]) + bytes(data)
        
        # Handle suppress positive response
        if suppress_positive_response and len(request) >= 2:
            # Set suppress bit (bit 7 of sub-function)
            request = bytes([request[0], request[1] | 0x80]) + request[2:]
        
        # Send request
        try:
            self.transport.send(request)
        except IsoTpError as e:
            raise UDSError(f"Transport error: {e}")
        
        if suppress_positive_response:
            return None
        
        # Wait for response with Response Pending handling
        return self._receive_response(sid)
    
    def _receive_response(self, request_sid):
        """Receive response with Response Pending handling."""
        response_pending_count = 0
        timeout = self.p2_timeout
        
        while True:
            try:
                response = self.transport.recv(timeout_ms=timeout)
            except IsoTpTimeoutError:
                raise UDSTimeoutError(f"Timeout waiting for response to SID 0x{request_sid:02X}")
            
            if response is None:
                raise UDSTimeoutError(f"No response for SID 0x{request_sid:02X}")
            
            response = bytes(response)
            
            # Check for positive response
            if is_positive_response(request_sid, response):
                return response
            
            # Check for negative response
            if is_negative_response(response):
                nrc = get_nrc(response)
                
                # Handle Response Pending
                if nrc == NRC_RESPONSE_PENDING:
                    response_pending_count += 1
                    if response_pending_count > self.MAX_RESPONSE_PENDING:
                        raise UDSTimeoutError(f"Too many Response Pending for SID 0x{request_sid:02X}")
                    # Use extended timeout for subsequent responses
                    timeout = self.p2_star_timeout
                    continue
                
                # Other negative response - raise error
                raise UDSNegativeResponseError(request_sid, nrc)
            
            # Unexpected response format
            raise UDSError(f"Unexpected response format: {response.hex()}")
    
    # =========================================================================
    # Diagnostic and Communication Management Services
    # =========================================================================
    
    def diagnostic_session_control(self, session):
        """
        Change diagnostic session (SID 0x10).
        
        Args:
            session: Session type (1=default, 2=programming, 3=extended)
            
        Returns:
            Response data including timing parameters
        """
        return self.send_service(SID_DIAGNOSTIC_SESSION_CONTROL, bytes([session]))
    
    def ecu_reset(self, reset_type):
        """
        Reset ECU (SID 0x11).
        
        Args:
            reset_type: 1=hard, 2=keyOffOn, 3=soft
        """
        return self.send_service(SID_ECU_RESET, bytes([reset_type]))
    
    def security_access_request_seed(self, level=0x01):
        """
        Request security seed (SID 0x27, odd sub-function).
        
        Args:
            level: Security level (must be odd: 0x01, 0x03, etc.)
            
        Returns:
            Seed bytes from response
        """
        response = self.send_service(SID_SECURITY_ACCESS, bytes([level]))
        return response[2:] if len(response) > 2 else b''
    
    def security_access_send_key(self, level, key):
        """
        Send security key (SID 0x27, even sub-function).
        
        Args:
            level: Security level + 1 (must be even: 0x02, 0x04, etc.)
            key: Key bytes
        """
        return self.send_service(SID_SECURITY_ACCESS, bytes([level]) + bytes(key))
    
    def tester_present(self, suppress_positive_response=True):
        """
        Send Tester Present to keep session alive (SID 0x3E).
        
        Args:
            suppress_positive_response: Don't wait for response (default True)
        """
        return self.send_service(
            SID_TESTER_PRESENT, 
            bytes([0x00]),  # Sub-function 0x00
            suppress_positive_response=suppress_positive_response
        )
    
    # =========================================================================
    # Data Transmission Services
    # =========================================================================
    
    def read_data_by_identifier(self, *dids):
        """
        Read data by identifier (SID 0x22).
        
        Args:
            dids: One or more 16-bit Data Identifiers
            
        Returns:
            Response data (DID values)
        """
        data = bytearray()
        for did in dids:
            data.append((did >> 8) & 0xFF)
            data.append(did & 0xFF)
        return self.send_service(SID_READ_DATA_BY_IDENTIFIER, bytes(data))
    
    def write_data_by_identifier(self, did, value):
        """
        Write data by identifier (SID 0x2E).
        
        Args:
            did: 16-bit Data Identifier
            value: Value bytes to write
        """
        data = bytes([(did >> 8) & 0xFF, did & 0xFF]) + bytes(value)
        return self.send_service(SID_WRITE_DATA_BY_IDENTIFIER, data)
    
    # =========================================================================
    # Stored Data Transmission (DTC)
    # =========================================================================
    
    def clear_diagnostic_information(self, group=0xFFFFFF):
        """
        Clear DTCs (SID 0x14).
        
        Args:
            group: DTC group (0xFFFFFF = all)
        """
        data = bytes([
            (group >> 16) & 0xFF,
            (group >> 8) & 0xFF,
            group & 0xFF
        ])
        return self.send_service(SID_CLEAR_DIAGNOSTIC_INFORMATION, data)
    
    def read_dtc_information(self, sub_function, *args):
        """
        Read DTC information (SID 0x19).
        
        Args:
            sub_function: Report type (0x01=numByStatusMask, 0x02=byStatusMask, etc.)
            args: Additional parameters based on sub-function
        """
        data = bytes([sub_function]) + bytes(args)
        return self.send_service(SID_READ_DTC_INFORMATION, data)
    
    # =========================================================================
    # Routine Control
    # =========================================================================
    
    def routine_control(self, sub_function, routine_id, data=b''):
        """
        Execute routine control (SID 0x31).
        
        Args:
            sub_function: 1=start, 2=stop, 3=requestResults
            routine_id: 16-bit Routine Identifier
            data: Optional routine data
        """
        request_data = bytes([
            sub_function,
            (routine_id >> 8) & 0xFF,
            routine_id & 0xFF
        ]) + bytes(data)
        return self.send_service(SID_ROUTINE_CONTROL, request_data)
    
    # =========================================================================
    # OBD2 Compatibility
    # =========================================================================
    
    def read_obd2_pid(self, mode, pid):
        """
        Read OBD2 PID for backward compatibility.
        
        Args:
            mode: OBD2 mode (0x01, 0x02, 0x09, etc.)
            pid: Parameter ID (8-bit or 16-bit)
            
        Returns:
            Response data bytes
        """
        if pid > 0xFF:
            # 16-bit PID (OpenInverter style)
            data = bytes([(pid >> 8) & 0xFF, pid & 0xFF])
        else:
            # 8-bit PID (standard OBD2)
            data = bytes([pid])
        
        response = self.send_service(mode, data)
        # Skip response SID and PID echo
        if response and len(response) > 2:
            return response[2:] if pid <= 0xFF else response[3:]
        return response


# Compatibility aliases for migration from obd2_client
OBD2Client = UDSClient
OBD2TimeoutError = UDSTimeoutError
OBD2AbortError = UDSNegativeResponseError
