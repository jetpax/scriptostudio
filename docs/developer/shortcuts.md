# Development Shortcut: Update Extensions Without Version Bump

During development, you can update extension JavaScript directly in the browser without going through the full registry/version bump cycle.

## Method 1: Load from Local File Server (Easiest)

1. **Start a simple HTTP server** in the registry directory:
   ```bash
   cd scripto-studio-registry
   python3 -m http.server 8000
   # or: npx http-server -p 8000
   ```

2. **Open browser DevTools** (F12) → Console tab

3. **Run this command:**
   ```javascript
   await updateExtensionDev('gvret-manager', 'http://localhost:8000/Extensions/GVRET/GVRET.js')
   ```

4. **Reload the extension panel** (close and reopen the extension menu item)

## Method 2: Use File Input (No Server Needed)

1. **Open browser DevTools** (F12) → Console tab

2. **Run this helper:**
   ```javascript
   // Create file input
   const input = document.createElement('input')
   input.type = 'file'
   input.accept = '.js'
   input.onchange = async (e) => {
     const file = e.target.files[0]
     const content = await file.text()
     await state.extensionRegistry.updateExtensionDev('gvret-manager', content)
     console.log('✅ Extension updated! Reload the extension panel.')
   }
   input.click()
   ```

3. **Select your `GVRET.js` file** from the file picker

4. **Reload the extension panel**

## Method 3: Direct IndexedDB Update (Advanced)

You can also directly update IndexedDB using browser DevTools:

1. Open DevTools → Application → IndexedDB
2. Navigate to `scripto-studio-extension-registry` → `extensions` store
3. Find your extension (e.g., `gvret-manager`)
4. Edit the `content` field with your new code
5. Save and reload

## Notes

- This only updates the cached extension in your browser
- Other users won't see changes until you bump version and push to registry
- The extension must be installed first (via normal registry flow)
- Changes persist until you uninstall/reinstall the extension
- Use this for rapid iteration during development

## Example: Updating GVRET.js

```javascript
// 1. Read your local file
const fs = require('fs')  // Node.js only
const content = fs.readFileSync('/path/to/GVRET.js', 'utf8')

// 2. Copy the content string

// 3. In browser console:
await state.extensionRegistry.updateExtensionDev('gvret-manager', content)

// 4. Reload extension panel
```
