"""
UDS Service Definitions (ISO 14229)
====================================

Constants for UDS (Unified Diagnostic Services) protocol.
Includes Service IDs (SID), Sub-functions, and Negative Response Codes (NRC).

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

# =============================================================================
# Service Identifiers (SID) - Request
# =============================================================================

# Diagnostic and Communication Management
SID_DIAGNOSTIC_SESSION_CONTROL = 0x10
SID_ECU_RESET = 0x11
SID_SECURITY_ACCESS = 0x27
SID_COMMUNICATION_CONTROL = 0x28
SID_TESTER_PRESENT = 0x3E
SID_ACCESS_TIMING_PARAMETER = 0x83
SID_SECURED_DATA_TRANSMISSION = 0x84
SID_CONTROL_DTC_SETTING = 0x85
SID_RESPONSE_ON_EVENT = 0x86
SID_LINK_CONTROL = 0x87

# Data Transmission
SID_READ_DATA_BY_IDENTIFIER = 0x22
SID_READ_MEMORY_BY_ADDRESS = 0x23
SID_READ_SCALING_DATA_BY_IDENTIFIER = 0x24
SID_READ_DATA_BY_PERIODIC_IDENTIFIER = 0x2A
SID_DYNAMICALLY_DEFINE_DATA_IDENTIFIER = 0x2C
SID_WRITE_DATA_BY_IDENTIFIER = 0x2E
SID_WRITE_MEMORY_BY_ADDRESS = 0x3D

# Stored Data Transmission (DTC)
SID_CLEAR_DIAGNOSTIC_INFORMATION = 0x14
SID_READ_DTC_INFORMATION = 0x19

# I/O Control
SID_INPUT_OUTPUT_CONTROL_BY_IDENTIFIER = 0x2F

# Routine Control
SID_ROUTINE_CONTROL = 0x31

# Upload/Download
SID_REQUEST_DOWNLOAD = 0x34
SID_REQUEST_UPLOAD = 0x35
SID_TRANSFER_DATA = 0x36
SID_REQUEST_TRANSFER_EXIT = 0x37
SID_REQUEST_FILE_TRANSFER = 0x38

# OBD2 Modes (for compatibility)
SID_OBD_REQUEST_CURRENT_POWERTRAIN_DATA = 0x01
SID_OBD_REQUEST_FREEZE_FRAME_DATA = 0x02
SID_OBD_REQUEST_EMISSION_DTC = 0x03
SID_OBD_CLEAR_EMISSION_DTC = 0x04
SID_OBD_REQUEST_O2_SENSOR = 0x05
SID_OBD_REQUEST_OBD_MONITORING = 0x06
SID_OBD_REQUEST_PENDING_DTC = 0x07
SID_OBD_REQUEST_CONTROL_OPERATION = 0x08
SID_OBD_REQUEST_VEHICLE_INFO = 0x09
SID_OBD_REQUEST_PERMANENT_DTC = 0x0A

# =============================================================================
# Response SID offset
# =============================================================================

POSITIVE_RESPONSE_OFFSET = 0x40  # Positive response = SID + 0x40
NEGATIVE_RESPONSE_SID = 0x7F     # Negative response indicator

# =============================================================================
# Negative Response Codes (NRC) - ISO 14229-1
# =============================================================================

NRC_POSITIVE_RESPONSE = 0x00                        # Not an error
NRC_GENERAL_REJECT = 0x10
NRC_SERVICE_NOT_SUPPORTED = 0x11
NRC_SUB_FUNCTION_NOT_SUPPORTED = 0x12
NRC_INCORRECT_MESSAGE_LENGTH_OR_INVALID_FORMAT = 0x13
NRC_RESPONSE_TOO_LONG = 0x14
NRC_BUSY_REPEAT_REQUEST = 0x21
NRC_CONDITIONS_NOT_CORRECT = 0x22
NRC_REQUEST_SEQUENCE_ERROR = 0x24
NRC_NO_RESPONSE_FROM_SUBNET_COMPONENT = 0x25
NRC_FAILURE_PREVENTS_EXECUTION = 0x26
NRC_REQUEST_OUT_OF_RANGE = 0x31
NRC_SECURITY_ACCESS_DENIED = 0x33
NRC_INVALID_KEY = 0x35
NRC_EXCEEDED_NUMBER_OF_ATTEMPTS = 0x36
NRC_REQUIRED_TIME_DELAY_NOT_EXPIRED = 0x37
NRC_UPLOAD_DOWNLOAD_NOT_ACCEPTED = 0x70
NRC_TRANSFER_DATA_SUSPENDED = 0x71
NRC_GENERAL_PROGRAMMING_FAILURE = 0x72
NRC_WRONG_BLOCK_SEQUENCE_COUNTER = 0x73
NRC_RESPONSE_PENDING = 0x78                         # Server needs more time
NRC_SUB_FUNCTION_NOT_SUPPORTED_IN_ACTIVE_SESSION = 0x7E
NRC_SERVICE_NOT_SUPPORTED_IN_ACTIVE_SESSION = 0x7F
NRC_RPM_TOO_HIGH = 0x81
NRC_RPM_TOO_LOW = 0x82
NRC_ENGINE_IS_RUNNING = 0x83
NRC_ENGINE_IS_NOT_RUNNING = 0x84
NRC_ENGINE_RUN_TIME_TOO_LOW = 0x85
NRC_TEMPERATURE_TOO_HIGH = 0x86
NRC_TEMPERATURE_TOO_LOW = 0x87
NRC_VEHICLE_SPEED_TOO_HIGH = 0x88
NRC_VEHICLE_SPEED_TOO_LOW = 0x89
NRC_THROTTLE_PEDAL_TOO_HIGH = 0x8A
NRC_THROTTLE_PEDAL_TOO_LOW = 0x8B
NRC_TRANSMISSION_RANGE_NOT_IN_NEUTRAL = 0x8C
NRC_TRANSMISSION_RANGE_NOT_IN_GEAR = 0x8D
NRC_BRAKE_SWITCH_NOT_CLOSED = 0x8F
NRC_SHIFTER_LEVER_NOT_IN_PARK = 0x90
NRC_TORQUE_CONVERTER_CLUTCH_LOCKED = 0x91
NRC_VOLTAGE_TOO_HIGH = 0x92
NRC_VOLTAGE_TOO_LOW = 0x93

# NRC name lookup
NRC_NAMES = {
    NRC_GENERAL_REJECT: "generalReject",
    NRC_SERVICE_NOT_SUPPORTED: "serviceNotSupported",
    NRC_SUB_FUNCTION_NOT_SUPPORTED: "subFunctionNotSupported",
    NRC_INCORRECT_MESSAGE_LENGTH_OR_INVALID_FORMAT: "incorrectMessageLengthOrInvalidFormat",
    NRC_RESPONSE_TOO_LONG: "responseTooLong",
    NRC_BUSY_REPEAT_REQUEST: "busyRepeatRequest",
    NRC_CONDITIONS_NOT_CORRECT: "conditionsNotCorrect",
    NRC_REQUEST_SEQUENCE_ERROR: "requestSequenceError",
    NRC_REQUEST_OUT_OF_RANGE: "requestOutOfRange",
    NRC_SECURITY_ACCESS_DENIED: "securityAccessDenied",
    NRC_INVALID_KEY: "invalidKey",
    NRC_EXCEEDED_NUMBER_OF_ATTEMPTS: "exceededNumberOfAttempts",
    NRC_REQUIRED_TIME_DELAY_NOT_EXPIRED: "requiredTimeDelayNotExpired",
    NRC_RESPONSE_PENDING: "responsePending",
    NRC_SERVICE_NOT_SUPPORTED_IN_ACTIVE_SESSION: "serviceNotSupportedInActiveSession",
}

# =============================================================================
# Diagnostic Session Types
# =============================================================================

SESSION_DEFAULT = 0x01
SESSION_PROGRAMMING = 0x02
SESSION_EXTENDED_DIAGNOSTIC = 0x03
SESSION_SAFETY_SYSTEM = 0x04

# =============================================================================
# ECU Reset Types
# =============================================================================

RESET_HARD = 0x01
RESET_KEY_OFF_ON = 0x02
RESET_SOFT = 0x03
RESET_ENABLE_RAPID_POWER_SHUTDOWN = 0x04
RESET_DISABLE_RAPID_POWER_SHUTDOWN = 0x05

# =============================================================================
# Security Access Sub-functions
# =============================================================================

SECURITY_REQUEST_SEED = 0x01      # Odd numbers = request seed
SECURITY_SEND_KEY = 0x02          # Even numbers = send key

# =============================================================================
# Routine Control Sub-functions
# =============================================================================

ROUTINE_START = 0x01
ROUTINE_STOP = 0x02
ROUTINE_REQUEST_RESULTS = 0x03

# =============================================================================
# Helper Functions
# =============================================================================

def is_positive_response(request_sid, response):
    """Check if response is a positive response to the given request SID."""
    if not response or len(response) < 1:
        return False
    return response[0] == (request_sid + POSITIVE_RESPONSE_OFFSET)


def is_negative_response(response):
    """Check if response is a negative response."""
    if not response or len(response) < 1:
        return False
    return response[0] == NEGATIVE_RESPONSE_SID


def get_nrc(response):
    """Extract NRC from a negative response. Returns None if not negative."""
    if is_negative_response(response) and len(response) >= 3:
        return response[2]
    return None


def get_nrc_name(nrc):
    """Get human-readable name for NRC code."""
    return NRC_NAMES.get(nrc, f"unknownNrc_0x{nrc:02X}")


def is_response_pending(response):
    """Check if response is 'Response Pending' (NRC 0x78)."""
    return is_negative_response(response) and get_nrc(response) == NRC_RESPONSE_PENDING
