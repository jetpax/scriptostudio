
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

All device access is through hw accelerated TLS and WebRTC, so it's fast and secure. See [Connection](/docs/getting-started/connection/) for details.
![ScriptO Studio Connect](.github/images/connect.png)

### ✏️ Smart Python Editor

Agentic code editor for MicroPython with syntax highlighting, file management, and seamless deployment. You get real-time code execution and debugging with no firmware updates required. Just describe what you want, and the AI agent does the rest. See [Editor Features](/docs/user-guide/editor-features/) and [Using the Agent](/docs/agent/usage/).
![ScriptO Studio AI](.github/images/AI.png)

### 🧩 ScriptO Automations

Script Objects are the ultimate device customization tool. Create your own with the Smart Editor, or browse community-contributed scripts. See [Writing ScriptOs](/docs/user-guide/writing-scriptos/).
![ScriptO Studio ScriptO](.github/images/scripto.png)

### 📦 System Extensions

Add major new features at the touch of a button. Browse and install extensions from **[ScriptoHub](https://scriptohub.ai)** — including **PFC**, **OVMS**, **OpenInverter**, **GVRET**, and more. See [Extensions Overview](/docs/user-guide/extensions/).
![ScriptO Studio OI](.github/images/OI.png)

### ⚙️ Device Management

Connect and manage devices, configure board settings, manage files, and network settings. Access your devices from anywhere over a secure P2P VPN. See [File Manager](/docs/user-guide/file-manager/) and [System Information](/docs/user-guide/system-info/).
![ScriptO SysInfo](.github/images/sysinfo.png)

### 🐞 Visual Debugger
Advanced debugger with single-step execution and watchpoints. Live system monitoring and performance metrics. See [Debugger Overview](/docs/debugging/).

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

### 3. Install an Extension

Click **Extensions** → Browse → **Install**. Extensions are hosted on **[ScriptoHub](https://scriptohub.ai)**. Your device starts running the extension immediately. See [Extensions Overview](/docs/user-guide/extensions/).

### 4. Disconnect and Go

Your device keeps running the Extension autonomously. Access its web UI directly, or remotely via VPN.

---

## 🌐 The Ecosystem

| Component | Description |
|-----------|-------------|
| **[ScriptO Studio](https://scriptostudio.com/app/)** | Web IDE + Extension loader |
| **[ScriptoHub](https://scriptohub.ai)** | Extension & ScriptO marketplace |
| **[PycoClaw](https://pycoclaw.com)** | Open-source AI agent platform |
| **[Docs](https://scriptostudio.com/docs/)** | Documentation|
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

This repository hosts the deployment artefacts for ScriptO Studio:

| Path | Description | URL |
|------|-------------|-----|
| `/app/` | ScriptO Studio IDE | [scriptostudio.com/app/](https://scriptostudio.com/app/) |
| `/boards/` | Board manifests & firmware scripts | — |
| `/docs/` | Documentation | [scriptostudio.com/docs/](https://scriptostudio.com/docs/) |

Extensions and ScriptOs are now managed via **[ScriptoHub](https://scriptohub.ai)**.

---

## 🛠️ Development

### Contributing Extensions

Extensions are published via [ScriptoHub](https://scriptohub.ai). See the [Contributing Guide](/docs/developer/contributing/) for full details.

---

## 📄 License

MIT

---

**Made with ❤️ for the Embedded Python community**
