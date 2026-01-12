# OpenInverter Extension - Modular Architecture

This extension uses a **split source → concatenated distribution** architecture for maintainability while preserving compatibility with the Scripto Studio registry system.

## Directory Structure

```
Extensions/OpenInverter/
├── OpenInverter.js              ← Distribution file (concatenated, served to clients)
├── OpenInverter.build.js        ← Build script (concatenates src/ → OpenInverter.js)
├── OpenInverter.js.backup       ← Backup of original monolithic file
├── src/                         ← Source modules (edit these)
│   ├── main.js                  ← Main extension class
│   ├── tabs/                    ← Tab render functions
│   │   ├── DeviceSelectorTab.js
│   │   ├── ParametersTab.js
│   │   ├── SpotValuesTab.js
│   │   ├── CanMappingsTab.js
│   │   ├── ChartsTab.js
│   │   └── CanMessagesTab.js
│   ├── components/              ← Reusable UI components
│   │   ├── DeviceCard.js
│   │   ├── TabsContainer.js
│   │   └── DataTable.js
│   └── utils/                   ← Helper utilities
│       ├── formatting.js
│       ├── oiHelpers.js
│       └── spotValueManager.js
├── lib/                         ← Python device-side libraries (unchanged)
│   ├── canopen_sdo.py
│   ├── OI_helpers.py
│   └── package.json
└── README.md                    ← This file
```

## Development Workflow

### 1. Edit Source Files

Edit the appropriate file in `src/`:

```bash
cd Extensions/OpenInverter
vim src/tabs/ParametersTab.js  # Make your changes
```

### 2. Build Distribution File

Run the build script to concatenate all modules:

```bash
node OpenInverter.build.js
# Output: ✓ Built OpenInverter.js from src/ modules
```

### 3. Test in Scripto Studio

Load the extension via browser console:

```javascript
// Open Scripto Studio in browser, press F12 for console
await updateExtensionDevFromFilePicker('openinverter')
// Select: /path/to/scripto-studio-registry/Extensions/OpenInverter/OpenInverter.js
```

The extension will reload with your changes.

### 4. Verify & Commit

1. Test the modified tab/feature
2. Check console for errors
3. Verify state management works
4. Commit both `src/` files and built `OpenInverter.js`

## Module Organization

### src/main.js

The main `OpenInverterExtension` class. Handles:
- Constructor & state initialization
- Delegating to tab render functions
- Icon definitions

### src/tabs/*.js

Tab-specific render functions. Each file exports functions like:
- `renderParametersTab()` - Called by `renderParameters()`
- `renderSpotValuesTab()` - Called by `renderSpotvalues()`

**Pattern:**
```javascript
/**
 * Renders the Parameters tab
 * @this {OpenInverterExtension} - Extension instance
 * @returns {TemplateResult} - Rendered HTML
 */
function renderParametersTab() {
  // Access extension context via this.*
  const devices = this.state.discoveredDevices
  
  return this.html`
    <div class="parameters-container">
      ${/* ... */}
    </div>
  `
}
```

### src/components/*.js

Reusable UI components that can be called from multiple tabs:
- `renderDeviceCard(device)` - Device selector card
- `renderTabs(tabs, activeTab)` - Generic tabs component
- `renderDataTable(data, columns)` - Generic table

### src/utils/*.js

Helper utilities for data processing, formatting, protocol handling:
- `formatValue(value, unit)` - Format numbers with units
- `sdoRead(nodeId, index, subindex)` - CANopen SDO read
- `calculateCrc8(data)` - CRC calculation

## Code Organization Principles

1. **No imports**: All code is concatenated into single scope
2. **Context via `this`**: Tab functions access extension instance via `this.state`, `this.device`, etc.
3. **Dependency order**: Build script concatenates in order (utils → components → tabs → main)
4. **Comments preserved**: JSDoc comments help with navigation

## Build Script Details

`OpenInverter.build.js` performs these steps:

1. Read config block from existing `OpenInverter.js`
2. Concatenate source files in dependency order
3. Add build timestamp and markers
4. Write result back to `OpenInverter.js`

The script skips missing files (for incremental extraction) and reports:
- Files processed
- Files skipped
- Output size

## CI/CD Integration

GitHub Actions will auto-build on push to `src/`:

```yaml
# .github/workflows/build_extensions.yml
on:
  push:
    paths:
      - 'Extensions/**/src/**'
jobs:
  build:
    steps:
      - run: cd Extensions/OpenInverter && node OpenInverter.build.js
      - run: git add OpenInverter.js && git commit -m "Build: Update extension"
```
