
<h1 align="center">
 ⚡ ScriptO Studio
</h1>

<h4 align="center">
Program embedded devices with natural language. No firmware updates required.
</h4>
<p align="center">
  <a href="https://scriptostudio.com/app/">
    <img src="https://img.shields.io/badge/🚀_Launch_App-scriptostudio.com/app-6366f1?style=for-the-badge" alt="Launch ScriptO Studio" />
  </a>
</p>

ScriptO Studio is a next-generation Integrated Development and Execution Environment (IDEE) for embedded devices running MicroPython.

Describe in natural language what you want your device to do — and watch it happen instantly. Add a temperature sensor, configure CAN bus logging, or build a custom vehicle monitoring system, all without compiling code or flashing firmware. Your changes take effect immediately, and when you disconnect, your device keeps running autonomously.

Delivered as a PWA that runs in any modern browser, ScriptO Studio communicates over a secure link to the device, providing a rich extensible UI that takes no processing power or resources on the device.

---

## ✨ Key Features

### 🛡️ Fast, Secure Development

All device acces is through hw accelerated TLS and WebRTC, so it's fast and secure. See [Connection](/docs/getting-started/connection/) for details.
![ScriptO Studio Connect](.github/images/connect.png)

### ✏️ Smart Python Editor

Agentic code editor for MicroPython with syntax highlighting, file management, and seamless deployment. You get real-time code execution and debugging with no firmware updates required. Just describe what you want, and the AI agent does the rest. See [Editor Features](/docs/user-guide/editor-features/) and [Using the Agent](/docs/agent/usage/).
![ScriptO Studio AI](.github/images/AI.png)

### 🧩 ScriptO Automations

Script Objects are the ultimate device customization tool. Choose from a [library of ScriptOs](https://scriptostudio.com/registry/catalogue/) to get started, or create your own with the Smart Editor. See [Writing ScriptOs](/docs/user-guide/writing-scriptos/).
![ScriptO Studio ScriptO](.github/images/scripto.png)

### 📦 System Extensions

Add major new features at the touch of a button. Load [Extensions](https://scriptostudio.com/registry/extensions-catalogue/) like **OVMS**, **OpenInverter**, **GVRET**, or **Dala's Battery Emulator**. See [Extensions Overview](/docs/user-guide/extensions/).
![ScriptO Studio OI](.github/images/OI.png)

### ⚙️ Device Management

Connect and manage devices, configure board settings, manage files, and network settings. Access your devices from anywhere over a secure P2P VPN. See [File Manager](/docs/user-guide/file-manager/) and [System Information](/docs/user-guide/system-info/).
![ScriptO SysInfo](.github/images/sysinfo.png)

### 🐞 Visual Debugger
Advanced debugger with single-step execution and watchpoints. Live system monitoring and performance metrics. See [Debugger Overview](/docs/debugging/).

---

## 📦 Registry

The registry provides a curated collection of reusable code:

### 🐍 ScriptOs (Python Scripts)
Python scripts that run directly on your ESP32 device — hardware drivers, protocol implementations, and utility libraries.

**Browse:** [scriptostudio.com/registry/catalogue/](https://scriptostudio.com/registry/catalogue/)

### 🔌 Extensions (JavaScript + Python)
Full-featured applications with rich UIs that extend ScriptO Studio's capabilities.

| Extension | Based On | Status |
|-----------|----------|--------|
| **GVRET** | [collin80/GVRET](https://github.com/collin80/GVRET) | ✅ Working |
| **OVMS** | [Open Vehicle Monitoring System](https://docs.openvehicles.com/) | 🚧 In development |
| **OpenInverter** | [openinverter.org](https://openinverter.org/) | 🚧 In development |
| **Battery Emulator** | [Dala's Battery Emulator](https://github.com/dalathegreat/Battery-Emulator) | 🚧 In development |

**Browse:** [scriptostudio.com/registry/extensions-catalogue/](https://scriptostudio.com/registry/extensions-catalogue/)

---

## 🚀 Quick Start

ScriptO Studio runs on any device that runs MicroPython with **[pyDirect](https://github.com/jetpax/pyDirect)** extensions installed. Currently ESP32-S3 and ESP32-P4 are supported, but MicroPython on ZephyrOS is in the pipeline, opening up a world of new devices, such as Raspberry Pi RP2350.

> 📖 **New to ScriptO Studio?** Check out the **[Getting Started Guide](/docs/getting-started/)** for step-by-step instructions.

### 1. Flash pyDirect Firmware

<p align="center">
  <a href="https://jetpax.github.io/pyDirect/">
    <img src="https://img.shields.io/badge/⚡_Flash_Now-No_Tools_Required-22c55e?style=for-the-badge" alt="Flash pyDirect" />
  </a>
</p>

Works directly in your browser. No software to install. See the [Flashing Firmware](/docs/device-setup/flashing-firmware/) page for details.

### 2. Open ScriptO Studio

Visit **[scriptostudio.com/app/](https://scriptostudio.com/app/)** — works on desktop, tablet, or phone.

### 3. Load an Extension

Click **Extensions** → Browse → **Install**. Your device is now running that application. See [Extensions Overview](/docs/user-guide/extensions/).

### 4. Disconnect and Go

Your device keeps running the Extension autonomously. Access its web UI directly, or remotely via VPN.

---

## 🌐 The Ecosystem

| Component | Description |
|-----------|-------------|
| **[ScriptO Studio](https://scriptostudio.com/app/)** | Web IDE + Extension loader |
| **[Registry](https://scriptostudio.com/registry/)** | Catalogue of Extensions and ScriptOs |
| **[pyDirect](https://github.com/jetpax/pyDirect)** | MicroPython fast-path C modules |
| **[WebREPL Binary Protocol](https://jetpax.github.io/webrepl/webrepl_binary_protocol_rfc.md)** | IANA-registered sub-protocol |
| **[MicroPython](https://micropython.org)** | Python for microcontrollers |

---

## 📱 Platform Support

**ScriptO Studio** runs in any modern browser:
- ✅ Chrome / Edge / Firefox / Safari
- ✅ iPad / iPhone / Android (installable PWA)

**Devices** running pyDirect:
- ✅ ESP32-S3 (primary)
- ✅ ESP32-P4
- 🔜 RP2350 / Zephyr

---
## 🏗️ Repository Structure

This repository hosts:

| Path | Description | URL |
|------|-------------|-----|
| `/app/` | ScriptO Studio IDE | [scriptostudio.com/app/](https://scriptostudio.com/app/) |
| `/registry/` | ScriptOs & Extensions catalogue | [scriptostudio.com/registry/](https://scriptostudio.com/registry/) |
| `/docs/` | Documentation | [scriptostudio.com/docs/](https://scriptostudio.com/docs/) |

---

## 🛠️ Development

### Contributing ScriptOs

ScriptOs are Python scripts with embedded metadata. To add one:

1. Create a `.py` file with a config block:
```python
# === START_CONFIG_PARAMETERS ===
dict(
    info = dict(
        name = 'My ScriptO',
        version = [1, 0, 0],
        author = 'Your Name',
        description = 'What it does',
        category = 'Sensors'
    )
)
# === END_CONFIG_PARAMETERS ===
```

2. Add to `registry/ScriptOs/`
3. Run `python3 tools/build_index.py` to regenerate the index

### Contributing Extensions

Extensions are JavaScript apps with optional device-side Python libraries:

```
registry/Extensions/MyExtension/
├── MyExtension.js      # UI code with config block
└── lib/                # Optional Python libraries for device
    └── my_module.py
```

See the [Contributing Guide](/docs/developer/contributing/) for full details.

---

## 📄 License

MIT

---

**Made with ❤️ for the Embedded Python community**
