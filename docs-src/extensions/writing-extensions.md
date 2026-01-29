# Writing Extensions

Extensions add new functionality to ScriptO Studio through the **JS Configurator** pattern - a JavaScript module that provides UI tabs and device-side Python libraries.

## Extension Structure

```
Extensions/
└── MyExtension/
    ├── MyExtension.js      # Main extension module
    ├── package.json        # Extension metadata
    ├── README.md           # Documentation
    └── lib/                # Device-side Python libraries
        └── MyExtension/
            ├── __init__.py
            └── helpers.py
```

## Minimal Extension

Create `MyExtension.js`:

```javascript
export default {
  // Required: Extension metadata
  id: 'my-extension',
  name: 'My Extension',
  version: [1, 0, 0],
  author: 'Your Name',
  description: 'A simple extension example',

  // Optional: Menu tabs to add
  menu: [
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'status', label: 'Status', icon: '📊' }
  ],

  // Required: Initialize the extension
  async init(studio) {
    console.log('My Extension initialized');
  },

  // Required: Render a tab's content
  async renderTab(tabId, container, studio) {
    if (tabId === 'config') {
      container.innerHTML = `
        <h2>Configuration</h2>
        <p>Configure your extension here.</p>
      `;
    } else if (tabId === 'status') {
      container.innerHTML = `
        <h2>Status</h2>
        <p>Extension status display.</p>
      `;
    }
  },

  // Optional: Cleanup when extension is unloaded
  async destroy() {
    console.log('My Extension destroyed');
  }
};
```

## Package Metadata

Create `package.json`:

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "description": "A simple extension example"
}
```

## Device-Side Libraries

If your extension needs Python code on the device, create a `lib/` directory with MIP-compatible packages:

```python
# lib/MyExtension/__init__.py
from .helpers import my_helper_function

__version__ = '1.0.0'
```

Reference the library in the registry's `index.json`:

```json
{
  "id": "my-extension",
  "mipPackage": "github:jetpax/scripto-studio-registry/Extensions/MyExtension/lib"
}
```

## Studio API

Extensions receive a `studio` object with these methods:

| Method | Description |
|--------|-------------|
| `studio.device.run(code)` | Execute Python code on device |
| `studio.device.readFile(path)` | Read file from device |
| `studio.device.writeFile(path, content)` | Write file to device |
| `studio.showNotification(msg, type)` | Show UI notification |
| `studio.getSettings(key)` | Read user settings |
| `studio.setSettings(key, value)` | Save user settings |

## Best Practices

1. **Keep UI responsive** - Use async/await for device operations
2. **Handle disconnection** - Check `studio.device.connected` before operations
3. **Minimal device code** - Keep scripts under 10KB (Client-Provided Script pattern)
4. **Error handling** - Wrap device calls in try/catch

## Examples

See these built-in extensions for reference:
- **[DBE](https://github.com/jetpax/scriptostudio/tree/main/registry/Extensions/DBE)** - Battery emulator with MQTT
- **[OVMS](https://github.com/jetpax/scriptostudio/tree/main/registry/Extensions/OVMS)** - Vehicle monitoring
- **[OpenInverter](https://github.com/jetpax/scriptostudio/tree/main/registry/Extensions/OpenInverter)** - Motor controller interface

## Next Steps

- [Extension API](../extensions/extension-api.md) - Full API reference
- [Device Libraries](../extensions/device-libraries.md) - Creating MIP packages
- [Built-in Extensions](../extensions/built-in-extensions.md) - Extension examples
