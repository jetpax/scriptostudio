# What a Board Tells an Agent

When a client connects, the board's MCP instructions tell it how to work and what hardware it has. An agent given nothing else, with no shell, files or notes, can make a working ScriptO from this alone.

## What's in it

**The rules.** Use only pins in the hardware list or ones the person says they've wired, because a wrong pin can fight what's on it, and record what they've wired once it works. Try hardware with `exec` before relying on it, and see what it reads at rest. Say only what you saw, and ask the person to try what only they can see or hear.

**The hardware.** The board's identity, devices, resources and capabilities, built from its manifest at `/settings/board.json`, and what's been wired to it, from `/settings/wired.json`. `device_info` returns the same facts.

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

## What you wire

The manifest knows what's on the board, not what you've added to it. Tell the agent once what you've wired and to which pins. When it has it working, it records it with `wired_add`, and every later session sees it with the board's own hardware:

```json
"door": {
  "type": "switch",
  "pin": 2,
  "description": "Reed switch to GND. from lib.wired.door import door, then door.shut() is True when the door is shut."
}
```

- **Code uses names.** `board.pin("door")` returns 2, and a device on a bus is `board.device("bme280")`, so moving a wire means updating the record, not the code.
- **Helpers stay.** The agent puts a helper in `/lib/wired/` and names it in the description, so the next agent uses it rather than starting again.
- **Pins are checked.** `wired_add` refuses a pin the board already uses, one the chip's flash or PSRAM holds, or one something else is wired to.
- **Default buses give way.** On a bare dev board the manifest's I2C, SPI and CAN pins are only where those buses go by default. Wire a switch to one, and that bus is left out while the switch is recorded. A sensor on the default I2C bus names the bus instead, as `i2c.i2c0`, and shares it.

`wired_remove` takes something out when you disconnect it. What's wired lives apart from the manifest, so Studio's manifest updates never touch it.
