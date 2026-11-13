# Writing Apps

An App is a JavaScript class that provides panels in Studio, plus the MicroPython files that go on the board. See [Apps](index.md) for what that means for users.

## Structure

An App's source is bundled into one file for distribution:

```
MyApp/
├── extension.json          # Metadata and configuration
├── src/
│   └── index.js           # Entry point (exports class)
└── device/                 # Files that go on the board (optional)
    ├── my_helpers.py
    ├── main.py            # Runs on the board (optional)
    └── tools/
        └── read_status.py # A tool for agents (optional)
```

## extension.json

The manifest defines your App:

```json
{
  "name": "My App",
  "id": "my-app",
  "version": [1, 0, 0],
  "author": "Your Name",
  "description": "What your App does",
  "icon": "settings",
  "menu": [
    { "id": "config", "label": "Configuration" },
    { "id": "status", "label": "Status" }
  ],
  "styles": ".my-class { color: blue; }",
  "devicePaths": {
    "my_helpers.py": "/lib/ext/my_app/my_helpers.py"
  }
}
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✓ | Display name |
| `id` | ✓ | Unique identifier (lowercase, hyphens) |
| `version` | ✓ | Semver array `[major, minor, patch]` |
| `author` | ✓ | Your name or organization |
| `description` | ✓ | Brief description |
| `icon` | | Tabler icon name (e.g., `bolt`, `battery-charging`) |
| `iconSvg` | | Custom SVG icon (overrides `icon`) |
| `menu` | | Array of menu items with `id` and `label` |
| `styles` | | CSS injected when the App loads |
| `devicePaths` | | Map of source → device paths for bundler |

## The class

Create `src/index.js` with a class that is the default export:

```javascript
class MyApp {
  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI  // Device communication
    this.emit = emit         // Trigger re-render
    this.state = state       // Shared state object
    this.html = html         // Tagged template literal for rendering
    
    // Initialize your App's state
    if (!this.state.myApp) {
      this.state.myApp = {
        config: {},
        status: 'idle'
      }
    }
  }

  // Render each menu tab
  renderConfig() {
    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>Configuration</h2>
        </div>
        <div style="padding: 20px;">
          <p>Your configuration UI here</p>
        </div>
      </div>
    `
  }

  renderStatus() {
    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>Status</h2>
        </div>
        <div style="padding: 20px;">
          <p>Status: ${this.state.myApp.status}</p>
        </div>
      </div>
    `
  }
}

export { MyApp as default }
```

### Render Methods

For each menu item with `id: "foo"`, implement `renderFoo()` (capitalized). The method should return a template literal using `this.html`.

### State Management

- Use `this.state` for persistent data shared across renders
- Call `this.emit('render')` to trigger a re-render after state changes
- State persists across panel switches

## Device Files

Device-side Python files live in `device/` and get deployed during installation.

### devicePaths mapping

In `extension.json`, map source files under `device/` to board paths:

```json
{
  "devicePaths": {
    "helpers.py": "/lib/ext/my_app/helpers.py",
    "main.py": "/lib/ext/my_app/main.py",
    "tools/read_status.py": "/lib/ext/my_app/tools/read_status.py"
  }
}
```

Device files go to `/lib/ext/<folder>/`. Use underscores in the folder name, because Python can't import a name with a hyphen. Without `devicePaths`, the bundler puts everything under `device/` in `/lib/ext/<id>/`.

### main.py

`/lib/ext/<folder>/main.py` with an `async def run()` works as it does for a [ScriptO](../scriptos/writing-scriptos.md). It loops and awaits often, because one interpreter runs everything. It can start at every boot.

### tools/

Each file in `/lib/ext/<folder>/tools/` becomes a tool that agents can call, named `<app>_<file>`. Files starting with `_` aren't tools. A tool has a configuration block that gives its name, description and arguments, and an `async def run(args, job)`:

```python
# === START_CONFIG_PARAMETERS ===
dict(
    info = dict(
        name = "Read status",
        description = "What an agent reads to decide to use this.",
        effects = dict(readOnly=True, destructive=False, openWorld=False),
    ),
    args = dict(
        name = dict(label="Parameter name", type=str),
    ),
)
# === END_CONFIG_PARAMETERS ===

async def run(args, job):
    job.progress(1, 2, "halfway")
    return {"value": 1}
```

Effects you leave out take the conservative defaults.

### onInstall hook

Implement `onInstall()` to write the device files:

```javascript
async onInstall() {
  if (!this.state.isConnected) return false
  
  try {
    // Create directories
    await this.device.mkdir('/lib/ext/my_app')
    
    // Write all device files (injected by loader)
    for (const [path, content] of Object.entries(this.deviceFiles)) {
      await this.device.saveFile(path, content)
    }
    
    return true
  } catch (e) {
    console.error('Installation failed:', e)
    return false
  }
}
```

The `this.deviceFiles` object is injected by the loader and contains base64-decoded file contents keyed by target path.

## Device API

Use `this.device` to talk to the connected board. The full list is in the [App API](app-api.md).

| Method | Description |
|--------|-------------|
| `device.execute(code)` | Run Python code, returns output |
| `device.saveFile(path, content)` | Write file to device |
| `device.mkdir(path)` | Create directory |

```javascript
// Example: Get config from device
async getConfig() {
  const result = await this.device.execute(`
    from lib.ext.my_app.helpers import get_config
    import json
    print(json.dumps(get_config()))
  `)
  return JSON.parse(result)
}
```

## Bundling

`tools/bundle_extensions.js` in the PFC repository builds a bundle. It needs esbuild (`npm install` in that repository):

```bash
# Writes each bundle into its App's directory
node tools/bundle_extensions.js --extensions-dir /path/to/your/apps

# Or collect the bundles in one place
node tools/bundle_extensions.js \
  --extensions-dir /path/to/your/apps \
  --output-dir /path/to/bundles
```

Add `--mpy` to cross-compile the `.py` files to `.mpy` (it needs `mpy-cross`).

The bundler:
1. Reads `extension.json` for metadata
2. Bundles JS from `src/index.js` using esbuild
3. Base64-encodes device files from `device/`
4. Produces a single `{id}.bundle.js` file

### Publishing

Publish the bundle to [ScriptoHub](https://scriptohub.ai). Bump the version first, as [Versioning](versioning.md) describes.

## Best Practices

1. **State initialization** - Always check if state exists before accessing
2. **Error handling** - Wrap device calls in try/catch
3. **Responsive UI** - Use async/await, show loading states
4. **Minimal device code** - Keep Python files focused and small
5. **Don't verify imports in onInstall** - Device files may depend on others that aren't there yet; just write the files

## Examples

Look at the Apps on ScriptoHub for patterns. DBE has multiple panels, and OpenInverter discovers devices and builds its menu from them. See [Available Apps](available-apps.md).

## Next Steps

- [App API](app-api.md)
- [Device libraries](device-libraries.md)
- [Available Apps](available-apps.md)
