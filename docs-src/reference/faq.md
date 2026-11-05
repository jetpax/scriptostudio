# FAQ

## General

**What boards does it run on?**
ESP32 boards running Studio's firmware. **System > Firmware** lists what can be flashed, and [Board Configurations](../device-setup/board-configurations.md) describes the board manifests.

**Which browser do I need?**
Any modern browser can connect to a board. Flashing firmware over USB needs Chrome or Edge, because it uses Web Serial.

**Does a board need Studio to keep running?**
No. A ScriptO keeps running with nobody connected, and one set to start at boot runs even with no network.

## Agents

**Do I need an API key?**
For Studio's agent, yes, an OpenRouter key. For an outside agent like Claude Code, no: it uses its own account.

**What does it cost?**
Studio's agent is billed to your OpenRouter account. OpenRouter has free models with daily limits. Every round of tool calls sends the chat so far, so long chats cost more, and Studio summarises them to keep that down.

**Which model should I use?**
Any model that supports tools can work. They vary in how well they use tools, so try another if one struggles.

**Can an agent damage my board?**
`exec` runs any Python, so it could erase files or drive a pin. Studio's agent asks before what's plainly hard to undo, and you can Stop it at any moment, but that guards against accidents and isn't a sandbox. Follow what's wired to the board, and don't leave an agent alone with anything that could cause harm.

**Where does my chat go?**
To the model you chose, through OpenRouter. It's stored in this browser, one chat per board, until you click **New chat**. It includes whatever the board printed.

**Can I use my key on another computer?**
The key stays in the browser you entered it in, so add it again there.

## ScriptOs and Apps

**What's the difference?**
A ScriptO is MicroPython on the board. An App has a browser side as well. See [Apps](../apps/index.md).

**Where is a ScriptO's code?**
In `/lib/ext/<folder>/main.py`. **Code** on its row opens it.

**I changed the code and nothing happened.**
A running ScriptO keeps running the old code. Stop it and Start it.

## Connecting

See [Connection Issues](../troubleshooting/connection.md).
