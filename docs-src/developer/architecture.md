# Architecture

The board is the server, and everything else is a client of it. Studio, Studio's agent and outside agents all use the same dispatcher and the same tools.

## The pieces

| Repository | Holds |
|---|---|
| `pyDirect` | Firmware: C modules on MicroPython v1.29 and ESP-IDF 5.5.1 |
| `botiq` | botIQ: the device scripts (`lib/sys`), the board manifests, their tests, `ss-relay`, and the workflow that signs and publishes platform releases |
| `scriptostudio` | This site and the built app |
| `scripto-studio` | Studio, the browser app |
| `PFC` | The agent that runs on the board |
| `scriptohub` | The App catalogue, and every release a board installs: firmware builds, platform releases with their board manifests, and product releases |

## The board

Every message lands in one dispatcher, `lib/sys/mcp.py`, whichever carrier brought it. See the [MCP tools reference](../reference/mcp-tools.md) for the tools, carriers and tokens.

All Python runs on one interpreter thread, and that shapes the rest. A blocking call holds up every client and ScriptO, so anything that must work while Python is blocked is in C (`mcplink`, `wsserver`, `httpserver`): token checks, breaking a call, the output rings and CAN capture. Tools, ScriptOs and policy are Python, so they update without a reflash.

`events.py` tells sockets holding a human token about every agent call and file write, and that's how Studio shows what an agent is doing. Its Stop button sends a control frame that C acts on at once.

## Studio

Studio is a browser app with no server of its own, written in strict ES modules on choo and nanohtml and built with Vite. It holds its own socket to the board with the human token.

## Studio's agent

The agent is a tool loop in the page. It lists the board's tools, sends them to the model with the board's own instructions, runs each call on its own socket with the agent token, and repeats until the model stops calling tools.

**The key is kept apart.** Model calls go through an iframe on another origin, which holds the OpenRouter key, because Apps run in Studio's page and could read anything stored there. Studio can ask that frame for a reply, but can't read the key or choose where it's sent.

**Everything is an event.** Each request, reply, call, result, answer and note is appended to a log in IndexedDB, with one chat per board. One function applies an event both as it happens and when a reload replays it. A tab holds a Web Lock on a board's log, so two tabs can't interleave their events.

**History only grows.** On recent Claude models, each block of reasoning is bound to the system prompt, the tools and every message before it, so changing any of them makes later reasoning invalid. So:

- Tool output is cut once, as it arrives, and never edited afterwards.
- A long chat is replaced whole by a summary and the latest request, with no tail of tool calls kept.
- All reasoning is dropped when the model, system prompt or tool list changes, and after a reload. Dropping all of it is valid, and dropping some from the middle isn't.

If the API still says the chat is too long or its reasoning is stale, the agent recovers and retries once.

## ScriptOs

`/lib/ext/registry.json` is the record of what's installed, and it's on the board so that any client gets the same answer. See [ScriptOs](../scriptos/index.md). Every way a ScriptO ends is recorded and shown on its row.

## Limits to design around

- A board holds three WebSockets, and nothing is evicted.
- Plain HTTP has no encryption or live progress.
- A board is reached on its own network. There's no remote path from Studio.
- An agent's `exec` stops after 4 seconds.
- Studio's crash check only sees the first two seconds after a ScriptO starts. Later failures show on its row.
