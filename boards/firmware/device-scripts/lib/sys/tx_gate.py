"""
Tasks an agent started (lib/sys/tx_gate.py)
===========================================

With the gate on (can.agent_tx_needs_arm), transmitting on an actuating bus takes a
person's arm if an agent started it. C knows when an agent's exec is running, since it
guards that call. Once the exec has returned, a task it left behind looks like any
other, so this keeps the list, and C's mcplink_tx_check asks agent_task().

A person's panels and scripts, and apps started at boot, aren't on the list, and
transmit freely. This guards against accidents, not a hostile agent.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import asyncio

_create_task = asyncio.create_task
_tasks = []


def mark(task):
    """Treat a task as started by an agent, until it ends."""
    global _tasks
    _tasks = [t for t in _tasks if not t.done()]
    _tasks.append(task)


def _create_agent_task(coro):
    task = _create_task(coro)
    mark(task)
    return task


def run_as_agent(fn):
    """Call fn, marking every task it creates through asyncio.create_task."""
    asyncio.create_task = _create_agent_task
    try:
        return fn()
    finally:
        asyncio.create_task = _create_task


def agent_task():
    """Is the running task one an agent started?"""
    if not _tasks:
        return False
    try:
        return asyncio.current_task() in _tasks
    except RuntimeError:
        return False


def leave():
    """The running task is no longer doing an agent's work."""
    task = asyncio.current_task()
    if task in _tasks:
        _tasks.remove(task)
