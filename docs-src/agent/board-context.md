# What a Board Tells an Agent

When a client connects, the board's MCP instructions tell it how to work and what hardware it has. An agent given nothing else, with no shell, files or notes, can make a working ScriptO from this alone.

## What's in it

**The rules.** Follow the hardware list exactly and use no other pins, because a wrong pin can fight whatever's wired to it. Try hardware with `exec` before relying on it, and see what it reads at rest. Say only what you saw, and ask the person to try what only they can see or hear.

**The hardware.** The board's identity, devices, resources and capabilities, built from its manifest at `/settings/board.json`. `device_info` returns the same facts.

**Tool descriptions.** A rule about one tool lives in that tool's description, such as how `can_capture` finds a signal, so every board with that tool gets it.

## Adding how-to text to a device

A device's `description` in the manifest is where its how-to goes:

```json
"imu": {
  "type": "LIS3DH",
  "bus": "i2c.i2c0",
  "i2c_address": "0x19",
  "description": "3-axis accelerometer. from lib.sys import imu, then imu.read() gives x, y and z in milli-g, and wakes it the first time."
}
```

Some things make a difference:

- **Write a helper as its literal import line.** "imu.read() from lib.sys.imu" reads like `from lib.sys.imu import imu`, and agents write that and crash.
- **Say what normal looks like.** "At rest, gravity reads about 1000 mg" tells an agent what to compare with.
- **Say when there's no driver.** "No MicroPython driver yet" stops an agent trying.
- **Keep the whole thing under about 4 KB.** Claude Code cuts server instructions at around 4,096 characters. Devices come before resources and capabilities, so they're the last to go, and `device_info` always has everything.

See [Board Configurations](../device-setup/board-configurations.md) for the rest of the manifest.

## Pins

The instructions say which pins are taken and tell an agent to use no others. Which pins are free depends on what you've wired, so say so in your request.
