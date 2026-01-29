# WebREPL Binary Protocol (WBP)

The WebREPL Binary Protocol is a custom binary protocol for efficient communication between ScriptO Studio and pyDirect devices.

## Overview

WBP provides:
- **Binary framing** for efficient data transfer
- **Multiple transports** (WebRTC primary, WebSocket fallback)
- **Message prioritization** for responsive UI
- **Bidirectional streaming** for logs and output

## Message Structure

```
┌─────────────┬──────────────┬─────────────┬─────────────┐
│ Magic (2B)  │ Length (2B)  │ Type (1B)   │ Payload     │
└─────────────┴──────────────┴─────────────┴─────────────┘
```

| Field | Size | Description |
|-------|------|-------------|
| Magic | 2 bytes | `0x57 0x42` ("WB") |
| Length | 2 bytes | Payload length (big-endian) |
| Type | 1 byte | Message type |
| Payload | Variable | JSON or binary data |

## Message Types

### Commands (Client → Device)

| Type | Name | Description |
|------|------|-------------|
| `0x01` | EXEC | Execute Python code |
| `0x02` | READ_FILE | Read file from device |
| `0x03` | WRITE_FILE | Write file to device |
| `0x04` | LIST_DIR | List directory contents |
| `0x05` | DELETE | Delete file or directory |
| `0x06` | MKDIR | Create directory |
| `0x10` | GET_STATUS | Get device status |
| `0x11` | INTERRUPT | Send keyboard interrupt |

### Responses (Device → Client)

| Type | Name | Description |
|------|------|-------------|
| `0x81` | RESULT | Command result |
| `0x82` | ERROR | Error response |
| `0x83` | OUTPUT | stdout/stderr stream |
| `0x84` | LOG | Syslog message |
| `0x90` | STATUS | Device status update |

## Authentication

Authentication uses a challenge-response mechanism:

```
Client                          Device
  │                               │
  ├──── AUTH_REQUEST ────────────►│
  │                               │
  │◄──── AUTH_CHALLENGE ──────────┤
  │      (nonce)                  │
  │                               │
  ├──── AUTH_RESPONSE ───────────►│
  │      (hash(password + nonce)) │
  │                               │
  │◄──── AUTH_RESULT ─────────────┤
  │      (success/fail)           │
```

## Transport Handover

WBP supports seamless transport switching:

1. **WebRTC preferred** - Lower latency, P2P
2. **WebSocket fallback** - NAT traversal, reliability

The protocol maintains session identity across transport changes.

## Message Prioritization

Three-tier processing model:

| Priority | Messages | Handling |
|----------|----------|----------|
| **High** | Interrupts, Auth | Immediate processing |
| **Normal** | File ops, Exec | FIFO queue |
| **Low** | Logs, Status | Coalesced (5ms delay) |

## Example: Execute Code

**Request:**
```json
{
  "id": 42,
  "code": "print('Hello')"
}
```

**Response:**
```json
{
  "id": 42,
  "result": null,
  "output": "Hello\n"
}
```

## Implementation

- **Device**: `webrepl_binary.py` in pyDirect firmware
- **Client**: `webrepl.js` in ScriptO Studio

## Related

- [WebRTC Transport](../protocol/webrtc-transport.md)
- [WebSocket Transport](../protocol/websocket-transport.md)
- [Message Types](../protocol/message-types.md)
