# FAQ

Frequently asked questions about ScriptO Studio and pyDirect.

## General

### What is ScriptO Studio?

ScriptO Studio is a browser-based IDE for developing MicroPython applications on ESP32 devices. It provides code editing, file management, terminal access, and an extension system for specialized functionality.

### What is pyDirect?

pyDirect is custom MicroPython firmware for ESP32-S3 that includes:
- WebREPL Binary Protocol for fast communication
- WebRTC support for low-latency connections
- Hardware abstraction for CAN, I2C, SPI, and more
- Pre-configured drivers for common peripherals

### Do I need to install anything?

No installation required! ScriptO Studio runs entirely in your browser. Just navigate to [scriptostudio.pydirect.com](https://scriptostudio.pydirect.com) and connect to your device.

### Which browsers are supported?

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Full support |
| Edge 90+ | ✅ Full support |
| Firefox 85+ | ✅ Full support |
| Safari 15+ | ⚠️ WebRTC may be limited |

### Is it open source?

Yes! Both projects are MIT licensed:
- [ScriptO Studio](https://github.com/jetpax/scriptostudio)
- [pyDirect](https://github.com/jetpax/pyDirect)

## Connection

### Why can't I connect to my device?

See [Troubleshooting Connection](../troubleshooting/connection.md) for detailed help. Quick checks:
1. Device and browser on same network
2. Correct IP address
3. WebREPL password correct
4. No other client connected

### What's the difference between WebRTC and WebSocket?

| Feature | WebRTC | WebSocket |
|---------|--------|-----------|
| Latency | Lower | Higher |
| Setup | Requires STUN | Simple |
| Reliability | P2P dependent | More reliable |
| NAT traversal | Sometimes fails | Always works |

ScriptO Studio tries WebRTC first, then falls back to WebSocket.

### Can I connect over the internet?

WebSocket works over the internet if your device has a public IP or you set up port forwarding. WebRTC requires TURN servers for NAT traversal (not included by default).

### Why is only one client allowed?

The WebREPL Binary Protocol uses a single-client model to:
- Avoid race conditions on file operations
- Ensure consistent stdout/stderr streaming
- Simplify authentication and session management

## Development

### How do I run code on the device?

1. Write code in the editor
2. Click **Run** (or press F5)
3. Output appears in the Terminal

The code is sent to the device and executed immediately.

### How do I save files to the device?

1. Open File Manager (sidebar)
2. Create or select a file
3. Edit in the editor
4. Press Ctrl+S to save

Files are saved directly to the device's flash filesystem.

### Can I use pip packages?

MicroPython uses `mip` for package management:

```python
import mip
mip.install("github:org/repo/package")
```

Many micropython-lib packages are available, but not all PyPI packages work on MicroPython.

## Extensions

### How do I install an extension?

1. Click **Extensions** in the sidebar (or the + icon)
2. Search for the extension
3. Click **Install**

Device-side libraries are installed automatically.

### Can I create my own extensions?

Yes! See [Writing Extensions](../extensions/writing-extensions.md) for a complete guide.

### Where are extensions stored?

- **UI code**: Loaded from the registry at runtime
- **Device libraries**: Installed to `/lib/` on the device

## Hardware

### Which ESP32 chip should I use?

**Recommended:** ESP32-S3 with 8MB PSRAM

Other variants may work but have limitations:
- ESP32-S2: No Bluetooth
- ESP32-C3: Limited RAM
- Original ESP32: Not officially supported

### How much RAM/Flash do I need?

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| Flash | 4MB | 16MB |
| PSRAM | None | 8MB |

More flash = more files and extensions.
PSRAM = larger scripts and data.

### Can I use this with Arduino?

No. pyDirect is MicroPython firmware, not compatible with Arduino. However, the concepts are similar and many Arduino libraries have MicroPython equivalents.

## More Questions?

- Check the [Wiki Home](../index.md) for documentation
- Search [existing issues](https://github.com/jetpax/scriptostudio/issues)
- [Open a new issue](https://github.com/jetpax/scriptostudio/issues/new) for bugs or questions
