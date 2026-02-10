"""
UDS Server Implementation
=========================

UDS (Unified Diagnostic Services) server for ECU simulation.
Makes pyDirect devices diagnosable by external tools.

Based on ISO 14229 with transport over ISO 15765-2 (ISO-TP).

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import time
from .isotp import IsoTpTransport, IsoTpError
from .uds_services import (
    POSITIVE_RESPONSE_OFFSET,
    NEGATIVE_RESPONSE_SID,
    NRC_SERVICE_NOT_SUPPORTED,
    NRC_SUB_FUNCTION_NOT_SUPPORTED,
    NRC_INCORRECT_MESSAGE_LENGTH_OR_INVALID_FORMAT,
    NRC_CONDITIONS_NOT_CORRECT,
    NRC_REQUEST_OUT_OF_RANGE,
    NRC_SECURITY_ACCESS_DENIED,
    NRC_RESPONSE_PENDING,
    SID_DIAGNOSTIC_SESSION_CONTROL,
    SID_ECU_RESET,
    SID_SECURITY_ACCESS,
    SID_TESTER_PRESENT,
    SID_READ_DATA_BY_IDENTIFIER,
    SID_WRITE_DATA_BY_IDENTIFIER,
    SID_CLEAR_DIAGNOSTIC_INFORMATION,
    SID_READ_DTC_INFORMATION,
    SID_ROUTINE_CONTROL,
    SESSION_DEFAULT,
    SESSION_EXTENDED_DIAGNOSTIC,
    SESSION_PROGRAMMING,
)


class UDSServer:
    """
    UDS server (ECU simulation) for diagnostic communication.
    
    Usage:
        import twai
        twai.init(tx=5, rx=4, baudrate=500000)
        
        server = UDSServer(twai, rx_id=0x7E0, tx_id=0x7E8)
        
        # Register custom DID
        server.register_did(0xF190, lambda: b'VIN12345678901234')
        
        # Register custom service handler
        @server.handler(0x31)  # RoutineControl
        def handle_routine(data):
            return bytes([0x71]) + data  # Echo back
        
        # Run server
        server.run()
    """
    
    # Timing defaults (milliseconds)
    DEFAULT_P2_SERVER = 50          # Max time before response
    DEFAULT_P2_STAR_SERVER = 5000   # Max time with Response Pending
    DEFAULT_S3_SERVER = 5000        # Session timeout
    
    def __init__(self, can, rx_id=0x7E0, tx_id=0x7E8, padding=0xCC):
        """
        Initialize UDS server.
        
        Args:
            can: CAN interface
            rx_id: CAN ID for receiving requests (client's TX)
            tx_id: CAN ID for transmitting responses (client's RX)
            padding: Padding byte for CAN frames
        """
        self.transport = IsoTpTransport(can, tx_id, rx_id, padding=padding)
        self.rx_id = rx_id
        self.tx_id = tx_id
        
        # Session state
        self.session = SESSION_DEFAULT
        self.session_timeout = self.DEFAULT_S3_SERVER
        self.last_request_time = 0
        
        # Security state
        self.security_level = 0
        self.security_seed = None
        
        # Service handlers
        self._handlers = {}
        
        # DID storage
        self._did_read = {}   # DID -> read_func
        self._did_write = {}  # DID -> write_func
        
        # Routine storage
        self._routines = {}   # routine_id -> handler_func
        
        # Register built-in handlers
        self._register_builtins()
    
    def _register_builtins(self):
        """Register built-in service handlers."""
        self._handlers[SID_DIAGNOSTIC_SESSION_CONTROL] = self._handle_session_control
        self._handlers[SID_TESTER_PRESENT] = self._handle_tester_present
        self._handlers[SID_READ_DATA_BY_IDENTIFIER] = self._handle_read_did
        self._handlers[SID_WRITE_DATA_BY_IDENTIFIER] = self._handle_write_did
        self._handlers[SID_SECURITY_ACCESS] = self._handle_security_access
        self._handlers[SID_ROUTINE_CONTROL] = self._handle_routine_control
    
    def handler(self, sid):
        """Decorator to register a service handler."""
        def decorator(func):
            self._handlers[sid] = func
            return func
        return decorator
    
    def register_handler(self, sid, handler_func):
        """Register a service handler function."""
        self._handlers[sid] = handler_func
    
    def register_did(self, did, read_func=None, write_func=None):
        """
        Register a Data Identifier.
        
        Args:
            did: 16-bit Data Identifier
            read_func: Function returning bytes (for reading)
            write_func: Function accepting bytes (for writing)
        """
        if read_func:
            self._did_read[did] = read_func
        if write_func:
            self._did_write[did] = write_func
    
    def register_routine(self, routine_id, handler_func):
        """
        Register a routine handler.
        
        Args:
            routine_id: 16-bit Routine Identifier
            handler_func: Function(sub_function, data) -> response_data
        """
        self._routines[routine_id] = handler_func
    
    def run(self, stop_flag=None):
        """
        Run the server main loop.
        
        Args:
            stop_flag: Optional callable returning True to stop
        """
        while True:
            if stop_flag and stop_flag():
                break
            self.run_once(timeout_ms=100)
    
    def run_once(self, timeout_ms=100):
        """
        Process one request if available.
        
        Args:
            timeout_ms: Time to wait for a request
            
        Returns:
            True if a request was processed
        """
        try:
            request = self.transport.recv(timeout_ms=timeout_ms)
        except IsoTpError:
            return False
        
        if request is None or len(request) < 1:
            # Check session timeout
            self._check_session_timeout()
            return False
        
        request = bytes(request)
        self.last_request_time = self._get_time_ms()
        
        # Process request
        response = self._process_request(request)
        
        # Send response (unless suppressed)
        if response is not None:
            try:
                self.transport.send(response)
            except IsoTpError:
                pass
        
        return True
    
    def _process_request(self, request):
        """Process a request and return response."""
        sid = request[0]
        data = request[1:]
        
        # Check for suppress positive response
        suppress = False
        if len(data) >= 1:
            suppress = bool(data[0] & 0x80)
            # Clear suppress bit for handler
            data = bytes([data[0] & 0x7F]) + data[1:]
        
        # Find handler
        handler = self._handlers.get(sid)
        if handler is None:
            return self._negative_response(sid, NRC_SERVICE_NOT_SUPPORTED)
        
        # Execute handler
        try:
            response = handler(data)
            
            if response is None:
                return None
            
            # If handler returned NRC tuple, send negative response
            if isinstance(response, tuple) and len(response) == 2:
                return self._negative_response(sid, response[1])
            
            # Build positive response
            if suppress:
                return None
            return bytes([sid + POSITIVE_RESPONSE_OFFSET]) + bytes(response)
            
        except Exception as e:
            # Handler error
            return self._negative_response(sid, NRC_CONDITIONS_NOT_CORRECT)
    
    def _negative_response(self, sid, nrc):
        """Build a negative response."""
        return bytes([NEGATIVE_RESPONSE_SID, sid, nrc])
    
    def _check_session_timeout(self):
        """Check and handle session timeout."""
        if self.session != SESSION_DEFAULT:
            elapsed = self._get_time_ms() - self.last_request_time
            if elapsed > self.session_timeout:
                # Session timeout - return to default
                self.session = SESSION_DEFAULT
                self.security_level = 0
    
    # =========================================================================
    # Built-in Service Handlers
    # =========================================================================
    
    def _handle_session_control(self, data):
        """Handle DiagnosticSessionControl (0x10)."""
        if len(data) < 1:
            return (None, NRC_INCORRECT_MESSAGE_LENGTH_OR_INVALID_FORMAT)
        
        session = data[0]
        
        # Accept any session 1-3
        if session in (SESSION_DEFAULT, SESSION_PROGRAMMING, SESSION_EXTENDED_DIAGNOSTIC):
            old_session = self.session
            self.session = session
            
            # Reset security on session change
            if session != old_session:
                self.security_level = 0
            
            # Response: session + P2/P2* timing (in ms, big-endian)
            p2 = self.DEFAULT_P2_SERVER
            p2_star = self.DEFAULT_P2_STAR_SERVER // 10  # Resolution is 10ms
            return bytes([session, 
                         (p2 >> 8) & 0xFF, p2 & 0xFF,
                         (p2_star >> 8) & 0xFF, p2_star & 0xFF])
        
        return (None, NRC_SUB_FUNCTION_NOT_SUPPORTED)
    
    def _handle_tester_present(self, data):
        """Handle TesterPresent (0x3E)."""
        if len(data) < 1:
            return (None, NRC_INCORRECT_MESSAGE_LENGTH_OR_INVALID_FORMAT)
        
        sub_function = data[0]
        if sub_function != 0x00:
            return (None, NRC_SUB_FUNCTION_NOT_SUPPORTED)
        
        return bytes([0x00])
    
    def _handle_read_did(self, data):
        """Handle ReadDataByIdentifier (0x22)."""
        if len(data) < 2:
            return (None, NRC_INCORRECT_MESSAGE_LENGTH_OR_INVALID_FORMAT)
        
        response = bytearray()
        
        # Process each DID (2 bytes each)
        i = 0
        while i + 1 < len(data):
            did = (data[i] << 8) | data[i + 1]
            i += 2
            
            read_func = self._did_read.get(did)
            if read_func is None:
                return (None, NRC_REQUEST_OUT_OF_RANGE)
            
            try:
                value = read_func()
                response.append((did >> 8) & 0xFF)
                response.append(did & 0xFF)
                response.extend(value)
            except Exception:
                return (None, NRC_CONDITIONS_NOT_CORRECT)
        
        return bytes(response)
    
    def _handle_write_did(self, data):
        """Handle WriteDataByIdentifier (0x2E)."""
        if len(data) < 3:
            return (None, NRC_INCORRECT_MESSAGE_LENGTH_OR_INVALID_FORMAT)
        
        # Check security
        if self.security_level < 1:
            return (None, NRC_SECURITY_ACCESS_DENIED)
        
        did = (data[0] << 8) | data[1]
        value = data[2:]
        
        write_func = self._did_write.get(did)
        if write_func is None:
            return (None, NRC_REQUEST_OUT_OF_RANGE)
        
        try:
            write_func(value)
            return bytes([data[0], data[1]])  # Echo DID
        except Exception:
            return (None, NRC_CONDITIONS_NOT_CORRECT)
    
    def _handle_security_access(self, data):
        """Handle SecurityAccess (0x27)."""
        if len(data) < 1:
            return (None, NRC_INCORRECT_MESSAGE_LENGTH_OR_INVALID_FORMAT)
        
        sub_function = data[0]
        
        if sub_function & 0x01:
            # Odd = requestSeed
            # Generate a simple seed (override for real security)
            import random
            self.security_seed = bytes([random.getrandbits(8) for _ in range(4)])
            return bytes([sub_function]) + self.security_seed
        else:
            # Even = sendKey
            if self.security_seed is None:
                return (None, NRC_CONDITIONS_NOT_CORRECT)
            
            key = data[1:]
            # Simple key validation: XOR each byte with 0xFF
            expected_key = bytes([b ^ 0xFF for b in self.security_seed])
            
            if key == expected_key:
                self.security_level = sub_function // 2
                self.security_seed = None
                return bytes([sub_function])
            else:
                return (None, NRC_SECURITY_ACCESS_DENIED)
    
    def _handle_routine_control(self, data):
        """Handle RoutineControl (0x31)."""
        if len(data) < 3:
            return (None, NRC_INCORRECT_MESSAGE_LENGTH_OR_INVALID_FORMAT)
        
        sub_function = data[0]
        routine_id = (data[1] << 8) | data[2]
        routine_data = data[3:]
        
        handler = self._routines.get(routine_id)
        if handler is None:
            return (None, NRC_REQUEST_OUT_OF_RANGE)
        
        try:
            result = handler(sub_function, routine_data)
            return bytes([sub_function, data[1], data[2]]) + bytes(result or b'')
        except Exception:
            return (None, NRC_CONDITIONS_NOT_CORRECT)
    
    def _get_time_ms(self):
        """Get current time in milliseconds."""
        try:
            return time.ticks_ms()
        except AttributeError:
            return int(time.time() * 1000)
