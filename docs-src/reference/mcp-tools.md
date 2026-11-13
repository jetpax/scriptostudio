# MCP Tools

A board is an MCP server at `/mcp`. It speaks the 2026-07-28 revision and the older `initialize` handshake, so a stock MCP client needs nothing specific to Studio.

## Tools

| Group | Tools | Notes |
|---|---|---|
| Run code | `exec` | Runs in `__main__`. Returns output and any traceback |
| Files | `fs_list`, `fs_stat`, `fs_read_text`, `fs_write_text`, `fs_rm`, `fs_mkdir`, `fs_hash` | Writes go to a temporary file and are renamed, so a half-written file never replaces the real one |
| Board | `device_info`, `logs_read`, `reset` | `reset` takes `soft` or `hard`. After changing files in `lib/sys`, use `hard`, since soft keeps loaded modules |
| What's wired | `wired_add`, `wired_remove` | See below |
| ScriptOs | `scriptos_list`, `scripto_create`, `scripto_installed`, `scripto_run_at_boot`, `scripto_start`, `scripto_stop`, `scripto_remove` | See below |
| Jobs | `job_start`, `job_status`, `job_cancel` | For a ScriptO's long tools |
| Stopping | `interrupt`, `stop_user_tasks` | Separate, so an agent can end its own call without stopping anyone's ScriptOs |
| Updates | `update_check`, `update_start`, `update_status`, `update_cancel` | The platform, from ScriptoHub. See below |
| Wi-Fi, a person's only | `wifi_status`, `wifi_scan`, `wifi_join`, `wifi_forget` | Put a board on another network, over any carrier. See below |
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

### `wired_add`

| Argument | Meaning |
|---|---|
| `name` | Required. Lowercase letters, digits and underscores. The same name replaces what's there |
| `entry` | Required. Like a manifest device: `type`, `description`, and its GPIOs as `pin` or `<role>_pin`, or `bus` and `i2c_address` to share a bus |
| `kind` | `device`, the default, or `i2c`, `spi`, `uart` or `can` for a bus on pins of its own, which devices then name |

It writes `/settings/wired.json` and reloads the board module, so `board.pin()` and `board.device()` find the entry at once, and the next client to connect sees it. It refuses a pin the board or something already wired uses, and on an ESP32-S3 GPIO 26 to 37, which flash and PSRAM hold. A description is at most 300 characters, and at most 16 things can be wired. Its notes say which default bus, if any, it took a pin from. See [What a Board Tells an Agent](../agent/board-context.md#what-you-wire).

`wired_remove` takes out one entry by name, but not a bus a wired device still names. Helper files stay.

### Updates

These update the platform, the firmware and botIQ, from a ScriptoHub platform release. Studio and CaffiPod both use them. The code is `lib/sys/update.py`.

| Tool | What it does |
|---|---|
| `update_check` | What a release would change, writing nothing: newer or not, whether the firmware changes or needs USB, and what apps say against updating now. A job, since it fetches and hashes |
| `update_start` | Starts the update in the background, the newest of the board's major or `version`. Refused while an app says now isn't safe |
| `update_status` | State, bytes done, what it waits on, how the last update ended, the installed release |
| `update_cancel` | Stops a download. Starting the same release again resumes it |

The board takes a release only when a key built into its firmware signed the release's file list, and checks every file and the image against their sha256 as they lie in flash. The image goes into the spare app slot, and changed files go into place with the old ones kept in `/update/backup`. The board then restarts on trial: once the MCP core answers and the apps that ran at boot run again, the release is kept. Otherwise the next restart goes back to the old slot, and the firmware puts the old files back before botIQ loads: that step is frozen into pyDirect's firmware, so no file on the board can break it. A board with one app slot (8 MB) takes framework files only, and its firmware needs USB.

An app says when an update may write flash or restart:

```python
from lib.sys import update
update.ask_before("myapp", lambda: None if idle() else "a run is going")
```

The function returns `None` when now is safe, or why not. It's asked before the update starts, before every flash write and before the restart, and the update waits while any app says no.

A release may write only botIQ's files: `main.py` and `lib/`, except `lib/ext/` (apps) and `lib/wired/`. Settings, certificates and data are never touched.

### Wi-Fi

These put a board on a new network: after a move, or a new router. CaffiPod uses them over Bluetooth, so a board with no Wi-Fi at all can be given some, and Studio can use them over any carrier. The code is `lib/sys/network/wifi.py`.

| Tool | What it does |
|---|---|
| `wifi_status` | `connected`; while connected, the network's name `ssid`, `ip` and `rssi` (dBm); `saved`, the network it joins at boot; `joining`, a join under way; `last_join`, how the last one ended: `{ssid, ok, ip}` or `{ssid, ok, reason}` |
| `wifi_scan` | `networks` the board can see: one row per name at its strongest, strongest first, each `{ssid, rssi, secured, channel}`. A few seconds |
| `wifi_join` | `ssid` and `password` (empty or left out for an open network). Answers `{ssid, ip}` once the board has an address there, and only then saves the network. Within about 30 s |
| `wifi_forget` | Forgets the saved network, password and all, and leaves it: `{forgot}`, the name or null |

- **A person's only.** An agent's call is refused, and an agent doesn't see these tools listed. They're marked for an app's screens, not a model.
- **A refusal is the tool failing with the bare reason**, for a client to match: `wrong password`, `no such network` (not in sight and nothing answered), `timeout`, `refused` (the driver gave up for another reason), `busy` (a join is under way), `not saved`, `stopped`, or `bad request: …`. A failed join leaves the saved network as it was, and the board goes back to it.
- **The password goes to the Wi-Fi driver and to settings only**: never into a result, a log line, a notification or the terminal.
- **They answer when they're done.** The call runs as a task, and the pump moves on meanwhile, so a board's apps keep running. That needs a held connection: WebSocket, WebRTC or Bluetooth. Over plain HTTP they refuse, except `wifi_status`.
- **While a call uses the radio, the Wi-Fi task waits**, giving up any attempt it was making. A scan stops an attempt that's under way, since the driver can't scan while it connects.
- **Over Wi-Fi itself**, a join drops the connection as the board leaves its network. The join carries on; read its outcome with `wifi_status` once back.

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
