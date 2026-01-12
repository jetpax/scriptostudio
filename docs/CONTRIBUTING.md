# Contributing to ScriptO Studio Registry

Thank you for your interest in contributing to the ScriptO Studio Registry! This guide will help you add ScriptOs and Extensions to the registry.

## Table of Contents

- [Overview](#overview)
- [How the Registry Works](#how-the-registry-works)
- [Adding ScriptOs](#adding-scriptos)
- [Adding Extensions](#adding-extensions)
- [Local Development](#local-development)
- [Tag System](#tag-system)
- [Submission Guidelines](#submission-guidelines)

## Overview

The registry automatically builds and publishes when you push to the `main` branch. You don't need to manually update any index files - just add your content with proper metadata and the build system handles the rest.

## How the Registry Works

### Build Process

When you push to `main`, GitHub Actions automatically:

1. **Scans directories**: Looks through `ScriptOs/` and `Extensions/`
2. **Parses metadata**: Extracts config blocks from each file
3. **Generates index**: Creates `index.json` with all metadata
4. **Builds catalogues**: Creates browsable HTML interfaces for both ScriptOs and Extensions
5. **Publishes**: Deploys everything to the `gh-pages` branch

### Index Format

The generated `index.json` follows this structure:

```json
{
  "v": 1,
  "updated": 1234567890,
  "scriptos": [
    {
      "name": "ScriptO Name",
      "filename": "scripto.py",
      "version": [1, 0, 0],
      "author": "Author Name",
      "description": "Description text",
      "tags": ["Category"],
      "license": "MIT",
      "docs": "https://...",
      "url": "https://raw.githubusercontent.com/..."
    }
  ],
  "extensions": [
    {
      "name": "Extension Name",
      "id": "extension-id",
      "version": [1, 0, 0],
      "author": "Author Name",
      "description": "Description text",
      "icon": "icon-name",
      "iconSvg": "<svg>...</svg>",
      "mipPackage": "github:user/repo/path",
      "url": "https://raw.githubusercontent.com/..."
    }
  ]
}
```

## Adding ScriptOs

ScriptOs are Python scripts that run on the ESP32 device. They should be self-contained or have minimal dependencies.

### Step 1: Create Your ScriptO

Create a `.py` file in the `ScriptOs/` directory with the following structure:

```python
# === START_CONFIG_PARAMETERS ===
dict(
    info = dict(
        name = 'Your ScriptO Name',
        version = [1, 0, 0],
        description = 'A clear description of what this ScriptO does',
        category = 'Category',  # e.g., 'Display', 'Sensor', 'Network'
        author = 'Your Name',
        www = 'https://github.com/yourname/yourrepo',  # Optional
        tags = ['tag1', 'tag2'],  # Optional, for better discovery
        license = 'MIT',  # Optional, defaults to MIT
        
        # For converted libraries:
        source_url = 'https://github.com/original/repo',  # Optional
        source_repo = 'owner/repo',  # Optional
        upstream_version = '1.2.3'  # Optional
    ),
    
    # Configuration parameters (if any)
    params = [
        dict(
            id = 'param_name',
            label = 'Parameter Label',
            type = 'text',  # or 'number', 'select', 'checkbox'
            default = 'default_value',
            help = 'Help text for this parameter'
        )
    ]
)
# === END_CONFIG_PARAMETERS ===

# Your Python code here
def main():
    print("Hello from ScriptO!")

if __name__ == '__main__':
    main()
```

### Step 2: Test Your ScriptO

Before submitting:

1. Test on actual ESP32 hardware with MicroPython
2. Verify all imports work (MicroPython has limited stdlib)
3. Check memory usage (`gc.mem_free()` before/after)
4. Ensure it doesn't conflict with common libraries

### Step 3: Submit

1. Fork this repository
2. Add your `.py` file to `ScriptOs/`
3. Create a pull request with:
   - Clear description of what the ScriptO does
   - Testing notes (device tested on, MicroPython version)
   - Any dependencies or requirements

## Adding Extensions

Extensions are more complex - they include both JavaScript (frontend) and Python (device-side) code.

### Step 1: Create Extension Directory

Create a directory structure:

```
Extensions/
└── YourExtension/
    ├── YourExtension.js       # Main extension file (required)
    ├── README.md              # Documentation (recommended)
    ├── lib/                   # Device-side Python libraries (optional)
    │   ├── package.json       # mip package metadata
    │   └── your_module.py     # Python code
    └── src/                   # Additional JS modules (optional)
```

### Step 2: Create the Extension File

Your main `.js` file should follow this structure:

```javascript
// === START_EXTENSION_CONFIG ===
// {
//   "name": "Extension Name",
//   "id": "extension-id",  // Unique identifier (lowercase, hyphens)
//   "version": [1, 0, 0],  // [major, minor, patch]
//   "author": "Your Name",
//   "description": "Clear description of what this extension does",
//   "icon": "icon-name",  // Tabler icon name
//   "iconSvg": "<svg>...</svg>",  // Optional: custom SVG icon
//   "mipPackage": "github:user/repo/Extensions/YourExtension/lib",  // Optional
//   "menu": [
//     { "id": "config", "label": "Configuration" },
//     { "id": "monitor", "label": "Monitor" }
//   ],
//   "styles": ".my-class { color: var(--text-primary); }"  // Optional CSS
// }
// === END_EXTENSION_CONFIG ===

class YourExtension {
  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI  // Device communication API
    this.emit = emit          // State update emitter
    this.state = state        // Global state object
    this.html = html          // HTML template function
    
    // Initialize extension state
    if (!this.state.yourExtension) {
      this.state.yourExtension = {
        // Your state here
      }
    }
  }
  
  // Render method for each menu tab
  renderConfig() {
    return this.html`
      <div class="extension-panel">
        <h2>Configuration</h2>
        <!-- Your UI here -->
      </div>
    `
  }
  
  renderMonitor() {
    return this.html`
      <div class="extension-panel">
        <h2>Monitor</h2>
        <!-- Your monitoring UI here -->
      </div>
    `
  }
  
  // Action methods
  async startOperation() {
    try {
      const result = await this.device.execute(`
import your_module
import json

result = your_module.do_something()
print(json.dumps({'success': True, 'data': result}))
      `)
      
      if (result && result.success) {
        this.state.yourExtension.data = result.data
        this.emit('render')
      }
    } catch (error) {
      console.error('Operation failed:', error)
      alert('Operation failed: ' + error.message)
    }
  }
}
```

### Step 3: Add Device-Side Libraries (Optional)

If your extension needs Python code on the device:

1. Create `lib/` directory
2. Add your Python modules
3. Create `package.json` for mip:

```json
{
  "urls": [
    ["your_module.py", "github:user/repo/Extensions/YourExtension/lib/your_module.py"]
  ],
  "version": "1.0.0"
}
```

### Step 4: Test Your Extension

1. Load it in ScriptO Studio using the extension loader
2. Test all menu tabs render correctly
3. Verify device communication works
4. Test error handling (disconnect device, invalid input, etc.)
5. Check CSS doesn't conflict with other extensions

### Step 5: Submit

1. Fork this repository
2. Add your extension directory to `Extensions/`
3. Create a pull request with:
   - Clear description and screenshots
   - Testing notes
   - Any special requirements or dependencies

## Local Development

### Testing the Build Process

To test how your contribution will be built:

```bash
# Install dependencies (if needed)
pip3 install -r requirements.txt  # If requirements.txt exists

# Build index.json
python3 tools/build_index.py \
  --scriptos-dir ScriptOs \
  --extensions-dir Extensions \
  --output index.json \
  --repo-url https://github.com/jetpax/scripto-studio-registry \
  --branch main

# Generate ScriptOs catalogue
python3 tools/generate_catalogue.py \
  --index index.json \
  --output catalogue \
  --scriptos-dir ScriptOs

# Generate Extensions catalogue
python3 tools/generate_extensions_catalogue.py \
  --index index.json \
  --output extensions-catalogue \
  --extensions-dir Extensions
```

Or use the test script:

```bash
./tools/test_build.sh
```

### Checking for Updates (Converted Libraries)

If you've converted a library from another source:

```bash
python3 tools/check_updates.py  # Check all converted libraries
python3 tools/check_updates.py --update-available  # Show only outdated
```

## Tag System

Tags help users discover your content. Use these guidelines:

### ScriptO Tags

**Category Tags** (choose one primary):
- `display` - Display drivers and graphics
- `sensor` - Sensor libraries
- `communications` - Network protocols, serial, I2C, SPI
- `storage` - File systems, databases
- `utility` - Helper functions, tools
- `iot` - IoT platforms and services

**Status Tags**:
- `untested` - Not yet tested on hardware
- `experimental` - Early development, API may change
- `stable` - Production-ready

**Feature Tags**:
- `async` - Uses asyncio
- `hardware` - Requires specific hardware
- `converted` - Converted from another library

### Extension Tags

Extensions don't use tags in the same way - their categories are implied by their functionality and described in their metadata.

## Submission Guidelines

### General Requirements

✅ **DO:**
- Test thoroughly on real hardware
- Include clear documentation
- Follow existing code style
- Use descriptive names and comments
- Handle errors gracefully
- Provide usage examples

❌ **DON'T:**
- Submit untested code
- Include large binary files
- Use non-standard dependencies without noting them
- Copy code without proper attribution
- Submit malicious or obfuscated code

### Code Quality

**For ScriptOs:**
- Compatible with MicroPython 1.27+
- Minimal memory footprint
- No blocking operations (use async where appropriate)
- Clear error messages
- Documented public API

**For Extensions:**
- Clean, readable JavaScript
- Responsive UI that works on mobile
- Proper error handling and user feedback
- No external dependencies (bundle if needed)
- CSS uses CSS variables for theming

### Documentation

Include a README.md with:
- **Purpose**: What does it do?
- **Requirements**: Hardware, dependencies, versions
- **Installation**: How to install and configure
- **Usage**: Code examples
- **API Reference**: Public functions/classes
- **License**: Clearly stated

### Versioning

Follow semantic versioning `[major, minor, patch]`:
- **Major**: Breaking changes
- **Minor**: New features, backwards compatible
- **Patch**: Bug fixes, no API changes

### License

- Clearly state your license in metadata
- MIT is recommended for maximum compatibility
- If converting existing libraries, respect original licenses
- Include license headers in source files

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Chat**: Join our community (link in main README)

## Review Process

1. **Automated checks**: Linting, metadata validation
2. **Manual review**: Code quality, security, functionality
3. **Testing**: We may test on our hardware
4. **Feedback**: We'll provide constructive feedback
5. **Merge**: Once approved, auto-publishes to registry

Thank you for contributing to ScriptO Studio! 🎉
