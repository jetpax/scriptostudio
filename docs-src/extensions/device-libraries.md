# Device Libraries

Extensions can bundle Python libraries that are deployed to the device during installation.

## Structure

Device files live in the `device/` directory of your extension:

```
MyExtension/
├── extension.json
├── src/
│   └── index.js
└── device/
    └── lib/
        └── helpers.py
```

## devicePaths Mapping

In `extension.json`, map source files to device destinations:

```json
{
  "devicePaths": {
    "lib/helpers.py": "/lib/ext/my-extension/helpers.py",
    "lib/utils.py": "/lib/ext/my-extension/utils.py",
    "lib/submodule/__init__.py": "/lib/ext/my-extension/submodule/__init__.py"
  }
}
```

**Convention:** Device files should go to `/lib/ext/<extension-id>/`

## Installation Flow

1. User clicks Install in the extension marketplace
2. ScriptO Studio downloads the bundle
3. If connected, calls `onInstall()` on the extension instance
4. Extension writes files from `this.deviceFiles` to device

## onInstall Implementation

```javascript
async onInstall() {
  if (!this.state.isConnected) return false
  
  try {
    // Create directories
    await this.device.mkdir('/lib/ext/my-extension')
    await this.device.mkdir('/lib/ext/my-extension/submodule')
    
    // Write all device files
    for (const [path, content] of Object.entries(this.deviceFiles)) {
      console.log(`Writing ${path}...`)
      await this.device.saveFile(path, content)
    }
    
    return true
  } catch (e) {
    console.error('Installation failed:', e)
    return false
  }
}
```

## Import Paths

Device code imports from the installed path:

```python
# In your device code
from lib.ext.my_extension.helpers import my_function
```

## Best Practices

1. **Keep files small** - Device flash is limited
2. **Avoid heavy dependencies** - Files should be self-contained
3. **Use lazy imports** - Import modules only when needed
4. **Skip verification in onInstall** - Python imports may fail if dependencies aren't available yet

## Bundle Process

The bundler:
1. Reads `devicePaths` from `extension.json`
2. Reads each source file from `device/`
3. Base64-encodes the content
4. Embeds as `__DEVICE_FILES__` in the bundle

At runtime, the loader decodes `__DEVICE_FILES__` and injects it as `instance.deviceFiles`.
