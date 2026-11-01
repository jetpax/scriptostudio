# ss-relay

A stdio MCP server that holds one connection to a Scripto Studio device. It passes the device's own tools through, and adds tools that need the host: moving files by path, syncing by hash, finding devices on the network and flashing firmware.

## Install

```bash
uvx ss-relay --device wss://pybot-6014.local/mcp
```

Or with pip:

```bash
pip install ss-relay
```

Set the device password in `SS_RELAY_PASSWORD`, or pass an agent token with `--token`.

To add it to Claude Code:

```bash
claude mcp add pybot -e SS_RELAY_PASSWORD=<password> -- uvx ss-relay --device wss://pybot-6014.local/mcp
```
