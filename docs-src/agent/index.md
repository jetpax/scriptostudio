# How Agents Work with a Board

An agent is a model with tools. A board gives it tools over MCP: run code, read and write files, make ScriptOs. There are three ways to run one, and they all use those same tools.

| | Studio's agent | An outside agent | PFC |
|---|---|---|---|
| **Runs in** | The browser page | Your computer | The board |
| **Install** | Nothing | The agent, such as Claude Code | An App |
| **Model** | Yours on OpenRouter | Whatever the agent uses | A provider you configure |
| **Reaches** | One board | Your repos, shell and other tools as well | Its own board |
| **Asks first** | In the chat | In its own prompts | |

Use [Studio's agent](studio-agent.md) to get something working on a board. Use an [outside agent](other-agents.md) when the work also needs your repos or a shell.

## What makes this work

**The board explains itself.** When an agent connects, the board tells it the rules and its hardware, built from its manifest, so the agent needs no setup. See [What a Board Tells an Agent](board-context.md).

**The agent can try things.** `exec` runs Python on the board and returns what it printed, so an agent can check a pin or a sensor instead of assuming. It stops after 4 seconds, and longer work belongs in a ScriptO.

**The work stays.** `scripto_create` leaves code on the board that keeps running with nobody connected. See [ScriptOs](../scriptos/index.md).

**A person can see it.** Studio stays connected beside the agent, and the board reports every agent call to it.

## What you see

| The agent | Where it shows |
|---|---|
| Runs `exec` | Code and output in the terminal, tagged with the client's name |
| Changes something on the board | A dim line in the terminal, or a red one if it failed |
| Finishes any call | A line in the Logs window, with its name and how long it took |
| Writes or removes a file | The file list refreshes, and an open tab reloads unless it has unsaved edits |
| Creates or changes a ScriptO | Its row in the sidebar updates |

## What keeps it safe

Connecting takes a password, and an agent gets less than a person does. Its `exec` stops after 4 seconds where a person's can run for 60, it can only break its own call, and it can't arm CAN transmit.

That protects against accidents. It isn't a sandbox, because `exec` runs any Python. Don't give an agent a board you wouldn't trust it with, and don't connect a board to anything it could damage without someone watching.

All the tools are listed in the [MCP tools reference](../reference/mcp-tools.md).
