# ScriptO Studio Registry

**The official registry of ScriptOs and Extensions for [ScriptO Studio](https://github.com/jetpax/scripto-studio)** - an embedded development environment for ESP32 devices running MicroPython.

## What is This?

This registry provides a curated collection of reusable code for ScriptO Studio, organized into two types:

### 🐍 ScriptOs (Python Scripts)

**ScriptOs** are Python scripts that run directly on your ESP32 device. They provide:
- Hardware drivers and protocol implementations
- Utility functions and helper libraries
- Converted third-party libraries optimized for MicroPython
- Ready-to-use device functionality

**Examples:**
- Display drivers (SSD1306, ST7789)
- Sensor libraries (BME280, MPU6050)
- Communication protocols (MQTT, HTTP clients)
- Utility libraries (logging, configuration management)

ScriptOs are installed directly to your device's filesystem and can be imported like any Python module.

### 🔌 Extensions (JavaScript + Python)

**Extensions** are full-featured applications that extend ScriptO Studio's capabilities. They consist of:
- **Frontend (JavaScript)**: Rich UI that runs in the ScriptO Studio interface
- **Backend (Python)**: Device-side libraries that run on your ESP32
- **Integration**: Seamless communication between browser and device

**Examples:**
- **GVRET**: High-performance CAN bus interface for SavvyCAN
- **OVMS**: Vehicle metrics monitoring and cloud connectivity
- **OpenInverter**: Electric vehicle inverter configuration and monitoring
- **DBE (Dala's Battery Emulator)**: Battery management system integration

Extensions provide complete workflows with configuration UIs, real-time monitoring, and device control.

## Key Differences

| Feature | ScriptOs | Extensions |
|---------|----------|------------|
| **Language** | Python only | JavaScript (UI) + Python (device) |
| **Interface** | Command-line / REPL | Rich graphical UI in ScriptO Studio |
| **Scope** | Single-purpose libraries | Full applications with workflows |
| **Installation** | Via URL or file upload | Through Extensions modal |
| **Updates** | Manual | Automatic version checking |

## Browse the Catalogues

Explore available ScriptOs and Extensions through our browsable catalogues:

### 📚 ScriptOs Catalogue
**[Browse ScriptOs →](https://jetpax.github.io/scripto-studio-registry/catalogue/)**

Search, filter, and discover Python libraries for your ESP32 device. Each entry includes:
- Detailed descriptions and documentation
- Version information and author details
- Installation instructions
- Tags for easy discovery

### 🔌 Extensions Catalogue
**[Browse Extensions →](https://jetpax.github.io/scripto-studio-registry/extensions-catalogue/)**

Discover full-featured applications for ScriptO Studio. Each entry includes:
- Screenshots and feature descriptions
- Version compatibility information
- Device-side library requirements
- Installation and usage guides

## Using the Registry

### From ScriptO Studio

**ScriptOs:**
1. Open ScriptO Studio in your browser
2. Use the install URL format: `?install=github:jetpax/scripto-studio-registry/ScriptOs/Name.py`
3. Or upload directly through the file manager

**Extensions:**
1. Open ScriptO Studio
2. Click the **Extensions** button (or the **+** next to EXTENSIONS in the sidebar)
3. Browse available extensions
4. Click **Install** on any extension
5. The extension will be downloaded and activated automatically

### Direct Access

**Registry Index:**
```
https://jetpax.github.io/scripto-studio-registry/index.json
```

The index contains metadata for all ScriptOs and Extensions, including versions, descriptions, and download URLs.

## Contributing

Want to add your own ScriptO or Extension to the registry? See our [Contributing Guide](docs/CONTRIBUTING.md) for detailed instructions.

**Quick Start:**
- **ScriptOs**: Add a `.py` file with metadata to `ScriptOs/`
- **Extensions**: Create a directory under `Extensions/` with your `.js` file and optional device libraries
- Submit a pull request - the registry auto-updates on merge!

## Repository Structure

```
scripto-studio-registry/
├── ScriptOs/              # Python scripts with metadata
├── Extensions/            # JavaScript extensions with device libraries
│   ├── GVRET/
│   ├── OVMS/
│   ├── OpenInverter/
│   └── DBE/
├── tools/                 # Build scripts for catalogues
├── docs/                  # Documentation
└── .github/workflows/     # Automatic publishing
```

## How It Works

1. **Content is added** to `ScriptOs/` or `Extensions/` directories
2. **GitHub Actions** automatically scans for changes on push
3. **Metadata is extracted** from config blocks in each file
4. **Catalogues are generated** - browsable HTML interfaces
5. **Everything is published** to GitHub Pages at `gh-pages` branch

The registry is always up-to-date with the latest versions!

## Requirements

- **ScriptO Studio**: Latest version recommended
- **ESP32 Device**: Running MicroPython 1.27+
- **WebREPL**: Enabled on your device for remote access

## License

Individual ScriptOs and Extensions maintain their own licenses (specified in their metadata). The registry infrastructure and build tools are MIT licensed.

## Links

- **ScriptO Studio**: [github.com/jetpax/scripto-studio](https://github.com/jetpax/scripto-studio)
- **ScriptOs Catalogue**: [jetpax.github.io/scripto-studio-registry/catalogue/](https://jetpax.github.io/scripto-studio-registry/catalogue/)
- **Extensions Catalogue**: [jetpax.github.io/scripto-studio-registry/extensions-catalogue/](https://jetpax.github.io/scripto-studio-registry/extensions-catalogue/)
- **Registry Index**: [jetpax.github.io/scripto-studio-registry/index.json](https://jetpax.github.io/scripto-studio-registry/index.json)
- **Contributing Guide**: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

---

**Made with ❤️ for the Embedded Python community**
