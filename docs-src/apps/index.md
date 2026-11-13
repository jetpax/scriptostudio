# Apps

An App is a [ScriptO](../scriptos/index.md) with a browser side. The board half is MicroPython in `/lib/ext/<folder>/`, like any ScriptO. The browser half is JavaScript that adds panels to Studio's menu, under Apps, so you can configure the board and watch what it's doing.

## Apps and ScriptOs

| | ScriptO | App |
|---|---|---|
| Written in | MicroPython | MicroPython on the board, JavaScript in Studio |
| Made by | An agent, with `scripto_create` | A developer, published to ScriptoHub |
| Where you see it | In the sidebar's list of ScriptOs | As panels under Apps in the menu |
| Installed from | Nothing to install: it's on the board | ScriptoHub, from Studio |

Both live on the board. The panels only exist while Studio is open. If the App has a `main.py` or tools for agents, those keep working with no browser connected.

## Installing an App

Click the **+** beside **Apps** in the menu. The library lists what's available and what's installed, with Update and Uninstall for installed ones. You can also click **Browse apps** on Home to look through ScriptoHub at [scriptohub.ai/extensions](https://scriptohub.ai/extensions).

Studio keeps the downloaded bundle in your browser's IndexedDB. When the App has an `onInstall` hook, Studio runs it with the board connected, and the hook writes the App's device files. The board records the install in `/lib/ext/registry.json`, so any browser or agent connecting later sees the same list.

If you install while no board is connected, Studio saves the bundle and finishes the device install when you connect and open the App.

Uninstalling removes the App's code from the board. Its data stays.

## What an App can add

- Panels in the menu, drawn by a JavaScript class.
- MicroPython libraries, in `/lib/ext/<folder>/`.
- A `main.py` with `async def run()` that runs on the board, and can start at every boot.
- Tools for agents, as files in `tools/`. They appear as `<app>_<tool>`.

## Next

- [Writing Apps](writing-apps.md)
- [App API](app-api.md)
- [Device libraries](device-libraries.md)
- [Available Apps](available-apps.md)
- [Versioning](versioning.md)
