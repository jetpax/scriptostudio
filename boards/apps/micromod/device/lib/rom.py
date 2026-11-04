"""
An STM32F4's ROM bootloader over its UART, as ST's AN3155 describes it.

The module enters it when ~BOOT is low through a reset. A board's socket shares both with
its ESP32, so the ESP32 can't do that alone: ss-relay does, through the ESP-PROG.

This UART shares its pins with the board's I2C, so I2C stops answering from when the module
enters its bootloader until it leaves.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import asyncio
import time

from machine import Pin, UART

from lib.sys import board

ACK = 0x79
NACK = 0x1F
SYNC = 0x7F
GET_ID = 0x02
READ = 0x11
GO = 0x21
WRITE = 0x31
ERASE = 0x44

FLASH_BASE = 0x08000000
BLOCK = 256
SECTORS_KB = (16, 16, 16, 16, 64, 128, 128, 128, 128, 128, 128, 128)
LAST_BLOCK = FLASH_BASE + sum(SECTORS_KB) * 1024 - BLOCK

SYNC_TRIES = 3
REPLY_MS = 200
WRITE_MS = 1000
SECTOR_ERASE_MS = 10000
MASS_ERASE_MS = 60000

NOT_IN_BOOTLOADER = (
    "The STM32 didn't answer, so it isn't in its bootloader. On the computer with the ESP-PROG "
    "attached, run: ss-relay stm32-boot <port>, or ss-relay stm32 <image> <port> to program it"
)


def _xor(data, start=0):
    for byte in data:
        start ^= byte
    return start


def sectors_for(size):
    """How many sectors, counting from the first, an image of this size needs."""
    kb = 0
    for count, sector in enumerate(SECTORS_KB, 1):
        kb += sector
        if size <= kb * 1024:
            return count
    raise ValueError("%d bytes is more than the flash holds" % size)


class Rom:
    def __init__(self):
        socket = board.device("micromod")
        self._pins = (socket.boot_uart_tx, socket.boot_uart_rx)
        self._uart = UART(1, baudrate=115200, bits=8, parity=0, stop=1, tx=self._pins[0], rx=self._pins[1], timeout=0, rxbuf=1024)

    def close(self):
        """Hand the pins back. The module stays in its bootloader until it's reset or told to go."""
        self._uart.deinit()
        for pin in self._pins:
            Pin(pin, Pin.IN)

    async def _read(self, count, wait_ms):
        data = bytearray(count)
        view = memoryview(data)
        got = 0
        start = time.ticks_ms()
        while got < count:
            n = self._uart.readinto(view[got:])
            if n:
                got += n
            elif time.ticks_diff(time.ticks_ms(), start) > wait_ms:
                raise OSError("The STM32 stopped answering")
            else:
                await asyncio.sleep_ms(1)
        return data

    async def _ack(self, wait_ms=REPLY_MS):
        reply = (await self._read(1, wait_ms))[0]
        if reply != ACK:
            raise OSError("The STM32 refused that (0x%02x)" % reply)

    async def sync(self):
        """Its first 0x7F sets the baud rate. Later it's half a command, so a second one gets a
        refusal, which says it's there just as well."""
        self._uart.read()
        for _ in range(SYNC_TRIES):
            self._uart.write(bytes([SYNC]))
            try:
                if (await self._read(1, REPLY_MS))[0] in (ACK, NACK):
                    return
            except OSError:
                pass
        raise OSError(NOT_IN_BOOTLOADER)

    async def _command(self, code):
        self._uart.write(bytes([code, code ^ 0xFF]))
        await self._ack()

    async def _address(self, address):
        data = address.to_bytes(4, "big")
        self._uart.write(data + bytes([_xor(data)]))
        await self._ack()

    async def chip_id(self):
        await self._command(GET_ID)
        count = (await self._read(1, REPLY_MS))[0] + 1
        data = await self._read(count, REPLY_MS)
        await self._ack()
        return int.from_bytes(data, "big")

    async def read(self, address, count):
        await self._command(READ)
        await self._address(address)
        self._uart.write(bytes([count - 1, (count - 1) ^ 0xFF]))
        await self._ack()
        return await self._read(count, REPLY_MS)

    async def write(self, address, data):
        """Up to a block, in whole words."""
        await self._command(WRITE)
        await self._address(address)
        length = len(data) - 1
        self._uart.write(bytes([length]))
        self._uart.write(data)
        self._uart.write(bytes([_xor(data, length)]))
        await self._ack(WRITE_MS)

    async def erase_sector(self, sector):
        await self._command(ERASE)
        data = bytes([0, 0, 0, sector])
        self._uart.write(data + bytes([_xor(data)]))
        await self._ack(SECTOR_ERASE_MS)
        await self._forget()

    async def erase_all(self):
        await self._command(ERASE)
        self._uart.write(bytes([0xFF, 0xFF, 0x00]))
        await self._ack(MASS_ERASE_MS)
        await self._forget()

    async def _forget(self):
        """The bootloader erases without clearing the flash's data cache, so what was read just
        before still reads the same afterwards, until enough has been read from elsewhere."""
        await self.read(LAST_BLOCK, BLOCK)

    async def go(self, address=FLASH_BASE):
        await self._command(GO)
        await self._address(address)
