# UI plugin: Hello World

A ScriptO can serve its own web page from the board and ask Studio to show it in a window. This example registers an HTTP route and opens a page in a modal over Studio.

## How it works

1. The ScriptO registers an HTTP route (`/hello_ui`) on the board's web server.
2. It sends Studio a `display_ui` event with `events.notify`.
3. Studio opens a modal that loads the board's URL in an iframe.
4. The page is served by the board.

## Running it

Ask the agent on Home to make it, or put the code below in a file in the **Editor** and click **Run**. The page opens in a modal over Studio. To keep it on the board as a ScriptO, ask the agent to leave it there with `scripto_create`.

The code is the template below. Change `title` and the HTML to make your own.

## Template

```python
import json

import httpserver

from lib.sys import events
from lib.sys.utils import getDeviceURL


def my_ui_handler(uri, post_data=None, remote_addr=None):
    html = """<!DOCTYPE html>
<html>
<head>
    <title>My Custom UI</title>
    <style>
        body { font-family: sans-serif; padding: 24px; }
    </style>
</head>
<body>
    <h1>Hello from the board</h1>
    <script>
        // Your JavaScript here
    </script>
</body>
</html>"""
    httpserver.send(html)


httpserver.on('/my_ui', my_ui_handler, 'GET')

events.notify({
    "display_ui": {
        "url": getDeviceURL('/my_ui'),
        "title": "My Custom UI"
    }
})
```

## Key functions

| Function | Module | Purpose |
|----------|--------|---------|
| `httpserver.on(path, handler, method)` | `httpserver` | Register an HTTP route |
| `httpserver.send(content)` | `httpserver` | Send the HTTP response |
| `getDeviceURL(path)` | `lib.sys.utils` | The board's URL with the right protocol and its `.local` hostname |
| `events.notify(event)` | `lib.sys.events` | Send an event to every connected client |

## Trust the board's certificate

The board's HTTPS certificate is its own, so Chrome may show "Not Secure" in the address bar when the page loads. This is cosmetic. To clear it on a Mac:

1. In **Files**, open `/certs/` and download `servercert.pem`.
2. Double-click the file to add it to Keychain Access.
3. Find the certificate there, double-click it and expand **Trust**.
4. Set **When using this certificate** to **Always Trust**, and close the dialog.
5. Restart Chrome.

Each board has its own certificate, so repeat this for each one you want to trust.

## Related

- [Writing ScriptOs](writing-scriptos.md)
- [Writing Apps](../apps/writing-apps.md), for panels in Studio's menu
