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

## Compared with a bridge on your computer

Another way to give an agent a board is an MCP server on your computer that drives MicroPython's REPL, such as [mcp-micropython-bridge](https://github.com/SWITCHSCIENCE/mcp-micropython-bridge). Both give the agent general tools, so it writes code rather than picking from a menu. They differ in where MCP runs.

| | A bridge on your computer | ScriptO Studio |
|---|---|---|
| **MCP runs on** | Your computer, which types into the REPL | The board |
| **Firmware** | Standard MicroPython, on any port | ScriptO Studio's firmware |
| **On your computer** | Python and the bridge, and a USB cable or the REPL set up on Wi-Fi | A browser, or any MCP client |
| **Clients at once** | One, which holds the REPL | Several, so a person can watch while an agent works |
| **While the agent works** | The REPL is the agent's, so a program running on the board is stopped first | ScriptOs keep running, and `exec` shares the interpreter with them |
| **When code hangs** | Ctrl-C down the same line | The connection is held in C beneath MicroPython, so it stays up and `interrupt` breaks the call |
| **What the agent knows of the hardware** | A notes file it writes and reads itself | The board's manifest, and what you've wired once an agent has it working, given to every client when it connects |
| **More tools** | A fixed set | Apps add tools for their hardware |

A bridge suits any board running standard MicroPython, worked on from one computer. ScriptO Studio suits a board that keeps running on its own, that you reach from anywhere on your network with nothing installed, and that a person can watch while an agent works.
