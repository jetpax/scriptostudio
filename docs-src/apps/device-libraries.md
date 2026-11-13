# Device Libraries

An App can bundle MicroPython files that go on the board when it's installed.

## Structure

Device files live in the `device/` directory of your App:

```
MyApp/
├── extension.json
├── src/
│   └── index.js
└── device/
    └── helpers.py
```

## devicePaths Mapping

In `extension.json`, map files under `device/` to where they go on the board:

```json
{
  "devicePaths": {
    "helpers.py": "/lib/ext/my_app/helpers.py",
    "utils.py": "/lib/ext/my_app/utils.py",
    "submodule/__init__.py": "/lib/ext/my_app/submodule/__init__.py"
  }
}
```

Device files go to `/lib/ext/<folder>/`. Use underscores in the folder name, since a hyphen can't appear in a Python module name.

## Installation Flow

1. You click Install in the App library.
2. Studio downloads the bundle and stores it in the browser.
3. With a board connected, Studio calls `onInstall()` on the App.
4. The App writes the files in `this.deviceFiles` to the board.
5. Studio records the install on the board in `/lib/ext/registry.json`.

An agent or script that copies the files itself can record the install with the `scripto_installed` tool. It takes `id`, `version`, and optionally `name` and `folder` (the folder under `/lib/ext/`, when it differs from the id with hyphens turned into underscores). Call it once the files are in place.

## onInstall Implementation

```javascript
async onInstall() {
  if (!this.state.isConnected) return false
  
  try {
    // Create directories
    await this.device.mkdir('/lib/ext/my_app')
    await this.device.mkdir('/lib/ext/my_app/submodule')
    
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
from lib.ext.my_app.helpers import my_function
```

## Best Practices

1. **Keep files small** - Device flash is limited
2. **Avoid heavy dependencies** - Files should be self-contained
3. **Use lazy imports** - Import modules only when needed
4. **Don't verify imports in onInstall** - an import can fail if a file it needs isn't written yet

## Bundle Process

The bundler:
1. Reads `devicePaths` from `extension.json`
2. Reads each source file from `device/`
3. Base64-encodes the content
4. Embeds as `__DEVICE_FILES__` in the bundle

At runtime, the loader decodes `__DEVICE_FILES__` and injects it as `instance.deviceFiles`.
