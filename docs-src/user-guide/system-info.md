# System Information

**System > About** shows what Studio, the firmware and the board report about themselves. Without a board connected, it shows only the Studio section.

## Studio

| Field | Meaning |
|-------|---------|
| **Studio Version** | The version of Studio you're running. |
| **Build** | The commit it was built from. |
| **Build Date** | When it was built. |

## Firmware

| Field | Meaning |
|-------|---------|
| **Firmware Version** | The firmware release on the board. |
| **Built** | When the firmware was built. |
| **Origin** | `gha` for a CI build, `local` for one built by hand. |

## Board

| Field | Meaning |
|-------|---------|
| **Board Name** | The board's name, from its manifest. |
| **Board ID** | The manifest's identifier, for example `generic_esp32s3`. |
| **Chip** | The chip family. |
| **Hardware Revision** | The board's revision. Hidden when the manifest has none. |
| **Description** | What the board has on it. |

See [Board Configurations](../device-setup/board-configurations.md).

## MCU & MicroPython

| Field | Meaning |
|-------|---------|
| **Unique ID** | The chip's unique ID. |
| **Frequency** | CPU clock, in MHz. |
| **Flash Size** | Total flash. |
| **Platform** | The MicroPython platform, for example `esp32`. |
| **System** | The system name. |
| **Release** | The MicroPython release. |
| **Version** | The detailed MicroPython version string. |
| **Implementation** | The firmware variant. |
| **SPIRAM** | Whether the board has PSRAM. |
| **MPY Version** | The bytecode version. |

## Flash Partitions

A table of the flash partitions, with each one's **Name**, **Type**, **Offset** and **Size**. The `vfs` partition holds the board's files.

## Status bar

The bar at the bottom of Studio shows live readings:

| Indicator | Meaning |
|-----------|---------|
| **RAM** | Memory used and total. PSRAM counts toward the total. |
| **TEMP** | Chip temperature. Set the unit in [Settings](settings.md). |
| **UPTIME** | Time since boot. |
| **RSSI** | WiFi signal strength. |

## Related

- [Board Configurations](../device-setup/board-configurations.md)
- [Settings](settings.md)
