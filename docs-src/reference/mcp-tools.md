# MCP Tools

A board is an MCP server at `/mcp`. It speaks the 2026-07-28 revision and the older `initialize` handshake, so a stock MCP client needs nothing specific to Studio.

## Tools

| Group | Tools | Notes |
|---|---|---|
| Run code | `exec` | Runs in `__main__`. Returns output and any traceback |
| Files | `fs_list`, `fs_stat`, `fs_read_text`, `fs_write_text`, `fs_rm`, `fs_mkdir`, `fs_hash` | Writes go to a temporary file and are renamed, so a half-written file never replaces the real one |
| Board | `device_info`, `logs_read`, `reset` | `reset` takes `soft` or `hard`. After changing files in `lib/sys`, use `hard`, since soft keeps loaded modules |
| ScriptOs | `scriptos_list`, `scripto_create`, `scripto_installed`, `scripto_run_at_boot`, `scripto_start`, `scripto_stop`, `scripto_remove` | See below |
| Jobs | `job_start`, `job_status`, `job_cancel` | For a ScriptO's long tools |
| Stopping | `interrupt`, `stop_user_tasks` | Separate, so an agent can end its own call without stopping anyone's ScriptOs |
| Built in, where the board has the hardware | `can_capture` | Finds a CAN signal from what changes |
| From what's installed | `<scripto>_<tool>` | Change as ScriptOs and Apps are installed |

`device_info` returns everything about the board's hardware, and the same facts arrive in the server's instructions. See [What a Board Tells an Agent](../agent/board-context.md).

### `scripto_create`

| Argument | Meaning |
|---|---|
| `id` | Required. Lowercase letters, digits and hyphens |
| `code` | Required. Has to define `async def run()` |
| `name`, `version` | For showing to people |
| `run_at_boot` | Start it at every boot |
| `start` | Start it now. On unless set to false |
| `tools` | Tool files to write, by name |

It compiles the code before it writes anything, then writes atomically, registers the ScriptO and starts it. It answers before the code has run, so look at `scriptos_list` and `logs_read` to see what became of it.

## Connecting

| | WebSocket, `wss` or `ws` | Plain HTTP POST |
|---|---|---|
| **Used by** | Studio, Studio's agent, `ss-relay` | Claude Code, other HTTP clients |
| **Streams and push notifications** | Yes | No |
| **A ScriptO's long tool** | Stays open, with progress | Returns a job id to poll |
| **The name a person sees** | The client's own | `agent` |
| **Breaking its own blocked `exec`** | Yes | No. The 4 second timer ends it |
| **Encryption** | With `wss` | None |

A board holds three WebSockets. A fourth client is refused with a close frame saying why, and nobody is pushed off.

## Tokens

There are two roles, and both come from the board's password. Each token is the first 32 hex characters of `sha256("ss-<role>:<password>")`, with the role `human` or `agent`.

An HTTP client sends `Authorization: Bearer <token>`. A WebSocket client offers the subprotocols `mcp` and `ss.<token>`.

| | Agent token | Human token |
|---|---|---|
| **`exec` limit** | 4 s | Up to 60 s |
| **Can break** | Its own call | Anyone's call |
| **Can arm CAN transmit** | No | Yes |
| **Receives the activity feed** | No | Yes |
| **Its calls are reported to people** | Yes | No |

This is authentication plus a person watching. It isn't a sandbox, because `exec` runs any Python.

## CAN transmit

`can.agent_tx_needs_arm` is off by default. With it set, an agent's transmits are refused until a person arms them.
