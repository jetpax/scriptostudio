"""
The board's buzzer.

    from lib.sys import buzzer
    buzzer.beep(200)

beep() returns at once and the tone stops by itself, so a loop can call it without waiting. A call
during a beep, or just after one, is ignored.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import asyncio

from machine import PWM, Pin

from lib.sys import board

# For a buzzer whose manifest doesn't give a frequency
_DEFAULT_HZ = 2000
_HALF_DUTY = 32768
# A tone pulls a RetroVMS Mini's accelerometer about 400 mg off, and it takes about 60 ms to come
# back. A loop that beeps on a reading has to get a good one before it can beep again, or the first
# beep sets off the next one for ever.
_SETTLE_MS = 80

_busy = False


def _pin_number():
    pin = getattr(board.device("buzzer"), "pin", None)
    return board.pin("buzzer") if pin is None else pin


async def _end_after(pwm, ms):
    global _busy
    await asyncio.sleep_ms(ms)
    pwm.deinit()
    # Low, because a magnetic buzzer held high has DC through its coil
    Pin(_pin_number(), Pin.OUT, value=0)
    await asyncio.sleep_ms(_SETTLE_MS)
    _busy = False


def beep(ms=200, hz=None):
    """Sound the buzzer for ms milliseconds, at hz or at the frequency it's made for."""
    global _busy
    if _busy:
        return
    _busy = True
    freq = hz or getattr(board.device("buzzer"), "frequency_hz", _DEFAULT_HZ)
    pwm = PWM(Pin(_pin_number()), freq=freq, duty_u16=_HALF_DUTY)
    asyncio.create_task(_end_after(pwm, ms))
