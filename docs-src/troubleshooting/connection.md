# Connection Issues

## Can't connect to the board

Check these in order:

1. **The address.** It should look like `wss://pybot-6014.local/mcp`. Studio adds `/mcp` for you.
2. **The network.** The board and your computer need to be on the same network. If the `.local` name doesn't resolve, try the board's IP address.
3. **The certificate.** The board signs its own certificate, so your browser refuses it until you've accepted it once. Open `https://<host>/` in a tab, proceed past the warning, then try again. The connection dialog offers a link to this.
4. **The password.** It's the one you chose at setup.

## "This board doesn't accept connections from..."

The board only accepts WebSockets from Studio's own addresses. If you're running Studio from somewhere else, add that address to the board's `server.allowed_origins` setting.

## The board refuses another client

A board holds three WebSockets. A fourth client is refused with a message saying why, and nobody is pushed off. Studio holds one, and a second once its agent has run, until you press Stop or start a New chat. Close another client on your computer, or use plain HTTP for it, which holds none between calls.

## Forgot the password

Connect the board by USB and open **System > Firmware**. **Re-provision** gives the board new certificates and a new password, and keeps its WiFi settings. **Change WiFi** changes only the network. See [Provisioning](../device-setup/provisioning.md).

## Studio's agent

**It says it needs a key.** Click **Add an API key** under the message box.

**"Your OpenRouter account is out of credits."** Add credit at OpenRouter, or pick a free model.

**A free model stops with a rate limit.** Free models have daily limits. Wait, or choose another model.

**"Connect a board, and an agent can get to work on it."** Studio needs a board connected before the agent can start. A saved chat still shows while you're disconnected.

## An outside agent

**It can't reach the board.** Check that the address and token match **System > Agent**. They change if you change the board's password.

**A tool is missing or "Unknown tool".** A session can keep the tool list it started with. Start a new session.

**It connected to the wrong board.** Each `claude mcp add` line names one board. See what's configured with `claude mcp list`.
