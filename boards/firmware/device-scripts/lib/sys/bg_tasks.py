"""
Background Task Manager (MicroPython)
=====================================
Simple async task registry using only documented MicroPython asyncio functions.

Documented functions used:
- asyncio.create_task(coro)
- asyncio.sleep(), asyncio.sleep_ms()
- asyncio.CancelledError
- Task.cancel()

Usage:
    from lib import bg_tasks
    
    # System tasks (protected from Stop button)
    bg_tasks.start("queue_pump", queue_pump, is_system=True)
    
    # User tasks (stopped by Stop button)
    async def my_task():
        while True:
            print("working...")
            await asyncio.sleep(1)
    
    bg_tasks.start("my_task", my_task)
    bg_tasks.list_tasks()  # -> {"my_task": {"state": "running", "system": False}}
    bg_tasks.stop("my_task")
    bg_tasks.stop_user_tasks()  # Stop all non-system tasks

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import asyncio
import logging
import webrepl_binary as webrepl

# Setup logger for bg_tasks
logger = logging.getLogger("bg_tasks")
logger.handlers.clear()
handler = webrepl.logHandler(logging.DEBUG)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

def _log(level, msg):
    """Safe logging helper - silently fails if logger unavailable"""
    try:
        if logger:
            getattr(logger, level)(msg)
    except:
        pass

# name -> {"task": Task, "state": "running"|"stopped"|"crashed", "system": bool}
_tasks = {}


def start(name, coro_func, *args, restart=False, is_system=False):
    """
    Start a named background task.
    
    - name: unique task name
    - coro_func: async function (NOT a coroutine - the function itself)
    - args: arguments to pass to coro_func
    - restart: if True, cancel existing task first
    - is_system: if True, task is protected from stop_user_tasks()
    
    Returns True if started, False if already running (and restart=False)
    """
    if name in _tasks:
        if _tasks[name]["state"] == "running":
            if restart:
                stop(name)
            else:
                return False
    
    # Store task info before creating task (so _runner can access is_system)
    _tasks[name] = {"task": None, "state": "running", "system": is_system}
    task = asyncio.create_task(_runner(name, coro_func, *args))
    _tasks[name]["task"] = task
    return True


def stop(name):
    """Stop a named task via cancel()"""
    if name not in _tasks:
        return False
    if _tasks[name]["task"] is not None:
        _tasks[name]["task"].cancel()
    _tasks[name]["state"] = "stopped"
    return True


def stop_all():
    """Stop all tasks (including system tasks)"""
    for name in list(_tasks.keys()):
        stop(name)


def stop_user_tasks():
    """Stop all non-system tasks (called on KeyboardInterrupt or directly from client)"""
    stopped = []
    for name, info in list(_tasks.items()):
        if not info.get("system", False) and info["state"] == "running":
            stop(name)
            stopped.append(name)
    if stopped:
        _log("info", f"Stopped user tasks: {stopped}")
    return stopped


def list_tasks():
    """Return dict of task names with state and system flag"""
    return {
        name: {"state": info["state"], "system": info.get("system", False)}
        for name, info in _tasks.items()
    }


def is_running(name):
    """Check if a task is running"""
    return name in _tasks and _tasks[name]["state"] == "running"


async def _runner(name, coro_func, *args):
    """
    Wrapper that:
    - Catches CancelledError (normal stop)
    - Catches KeyboardInterrupt and routes to stop_user_tasks()
    - Catches exceptions and marks task as crashed
    - Auto-restarts crashed tasks after backoff
    """
    info = _tasks.get(name, {})
    is_system = info.get("system", False)
    
    while True:
        try:
            await coro_func(*args)
            # Task returned normally - unexpected for forever tasks
            break
        except asyncio.CancelledError:
            # Normal cancellation via stop()
            break
        except KeyboardInterrupt:
            # KeyboardInterrupt raised by mp_sched_keyboard_interrupt()
            if is_system:
                # System task caught it - stop user tasks, keep running
                _log("debug", f"KeyboardInterrupt in {name} - stopping user tasks")
                stop_user_tasks()
                # Continue the system task's while loop
                continue
            else:
                # User task - just stop
                _log("debug", f"{name} interrupted")
                break
        except Exception as e:
            # Task crashed - mark state and retry after backoff
            if name in _tasks:
                _tasks[name]["state"] = "crashed"
            _log("warning", f"{name} crashed: {e}")
            await asyncio.sleep(1)  # backoff before restart
            if name in _tasks:
                _tasks[name]["state"] = "running"
