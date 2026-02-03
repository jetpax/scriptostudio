# Writing Extensions

Extensions add new functionality to ScriptO Studio through the **JS Configurator** pattern - a JavaScript class that provides UI tabs and device-side Python libraries.

## Extension Structure

Extensions use a modular source structure that gets bundled for distribution:

```
MyExtension/
├── extension.json          # Metadata and configuration
├── src/
│   └── index.js           # Entry point (exports class)
└── device/                 # Device-side files (optional)
    └── lib/
        └── my_helpers.py
```

## extension.json

The manifest file defines your extension:

```json
{
  "name": "My Extension",
  "id": "my-extension",
  "version": [1, 0, 0],
  "author": "Your Name",
  "description": "What your extension does",
  "icon": "settings",
  "menu": [
    { "id": "config", "label": "Configuration" },
    { "id": "status", "label": "Status" }
  ],
  "styles": ".my-class { color: blue; }",
  "devicePaths": {
    "lib/my_helpers.py": "/lib/ext/my-extension/my_helpers.py"
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
| `styles` | | CSS styles injected when extension loads |
| `devicePaths` | | Map of source → device paths for bundler |

## Extension Class

Create `src/index.js` with a class that extends the base pattern:

```javascript
class MyExtension {
  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI  // Device communication
    this.emit = emit         // Trigger re-render
    this.state = state       // Shared state object
    this.html = html         // Tagged template literal for rendering
    
    // Initialize your extension's state
    if (!this.state.myExtension) {
      this.state.myExtension = {
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
          <p>Status: ${this.state.myExtension.status}</p>
        </div>
      </div>
    `
  }
}

export { MyExtension as default }
```

### Render Methods

For each menu item with `id: "foo"`, implement `renderFoo()` (capitalized). The method should return a template literal using `this.html`.

### State Management

- Use `this.state` for persistent data shared across renders
- Call `this.emit('render')` to trigger a re-render after state changes
- State persists across panel switches

## Device Files

Device-side Python files live in `device/` and get deployed during installation.

### devicePaths Mapping

In `extension.json`, map source files to device destinations:

```json
{
  "devicePaths": {
    "lib/helpers.py": "/lib/ext/my-extension/helpers.py",
    "lib/utils.py": "/lib/ext/my-extension/utils.py"
  }
}
```

**Convention:** Device files go to `/lib/ext/<extension-id>/`

### onInstall Hook

Implement `onInstall()` to deploy device files:

```javascript
async onInstall() {
  if (!this.state.isConnected) return false
  
  try {
    // Create directories
    await this.device.mkdir('/lib/ext/my-extension')
    
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

Use `this.device` to communicate with the connected device:

| Method | Description |
|--------|-------------|
| `device.execute(code)` | Run Python code, returns output |
| `device.saveFile(path, content)` | Write file to device |
| `device.readFile(path)` | Read file from device |
| `device.mkdir(path)` | Create directory |
| `device.listDir(path)` | List directory contents |

```javascript
// Example: Get config from device
async getConfig() {
  const result = await this.device.execute(`
    from lib.ext.my_extension.helpers import get_config
    import json
    print(json.dumps(get_config()))
  `)
  return JSON.parse(result)
}
```

## Bundling

Use the bundler tool to create a distributable bundle:

```bash
# In-place mode (default) - writes bundle to extension directory
node tools/bundle_extensions.js --extensions-dir /path/to/your/extensions

# Or central output mode
node tools/bundle_extensions.js \
  --extensions-dir /path/to/extensions \
  --output-dir /path/to/bundles
```

The bundler:
1. Reads `extension.json` for metadata
2. Bundles JS from `src/index.js` using esbuild
3. Base64-encodes device files from `device/`
4. Produces a single `{id}.bundle.js` file

### Registry Structure

For distribution, place bundles in the extension directory:

```
registry/Extensions/DBE/
├── dbe.bundle.js    # Bundled extension
├── package.json     # Minimal metadata
└── README.md        # Documentation
```

## Best Practices

1. **State initialization** - Always check if state exists before accessing
2. **Error handling** - Wrap device calls in try/catch
3. **Responsive UI** - Use async/await, show loading states
4. **Minimal device code** - Keep Python files focused and small
5. **Avoid import verification** - Device files may have dependencies; just write files in onInstall

## Examples

See these extensions for reference patterns:

- **[DBE](../../DBE/)** - Battery emulator with multiple panels
- **[PFC](../../picoClaw/)** - Agent orchestrator with workspace files
- **[OpenInverter](../../OpenInverter/)** - Device discovery with dynamic menus

## Next Steps

- [Extension API](extension-api.md) - Full API reference
- [Device Libraries](device-libraries.md) - Python library patterns
- [Built-in Extensions](built-in-extensions.md) - More examples
