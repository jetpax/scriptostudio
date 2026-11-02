"""
Installed apps (lib/sys/apps.py)
================================

The board is the record of what's installed, in /lib/ext/registry.json, so any browser
or agent gets the same answer from it. An app's code lives in /lib/ext/<folder>/. Its
data, anywhere else, is its own and stays when it's removed.

An app gives agents tools by shipping files at /lib/ext/<folder>/tools/<name>.py:

    # === START_CONFIG_PARAMETERS ===
    dict(
        info = dict(
            name = "Read parameter",
            description = "What an agent reads to decide to use this.",
            effects = dict(readOnly=True, destructive=False, openWorld=False),
        ),
        args = dict(
            name = dict(label="Parameter name", type=str),
            pin = dict(label="Pin", type=list, optional=True),
            mode = dict(label="Mode", type=dict, items=dict(a="First", b="Second"), value="a"),
        ),
    )
    # === END_CONFIG_PARAMETERS ===

    async def run(args, job):
        job.progress(1, 2, "halfway")
        return {"value": 1}

The block maps to the tool's schema. type=list means a GPIO, with its enum from
board.json. Effects left out mean the conservative defaults. Tools are named
<app>_<file>, and files starting with _ aren't tools.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import json
import os
import sys
import time

from lib.sys import bg_tasks, board

ROOT = "/lib/ext"
BUILTIN_TOOLS = "/lib/sys/tools"
# A tool the board provides itself, and what the board needs for it
_BUILTIN_NEEDS = {"can_capture": "can"}
REGISTRY = ROOT + "/registry.json"
TOOLS_FOLDER = "tools"
CONFIG_START = "# === START_CONFIG_PARAMETERS ==="
CONFIG_END = "# === END_CONFIG_PARAMETERS ==="
_DIR_FLAG = 0x4000
_TYPES = {str: "string", int: "integer", float: "number", bool: "boolean"}
# MCP's defaults, for a tool that doesn't say
_EFFECT_HINTS = (("readOnly", "readOnlyHint", False), ("destructive", "destructiveHint", True), ("openWorld", "openWorldHint", True))

on_change = None
_tools = None
_errors = {}


def read():
    try:
        with open(REGISTRY) as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def _write(registry):
    tmp = REGISTRY + ".tmp"
    with open(tmp, "w") as f:
        json.dump(registry, f)
    os.rename(tmp, REGISTRY)


def folder_of(app_id, entry=None):
    """A module's name can't contain a hyphen, so smart-gbw lives in smart_gbw."""
    return (entry or {}).get("dir") or app_id.replace("-", "_")


def _exists(path):
    try:
        os.stat(path)
        return True
    except OSError:
        return False


def _changed():
    global _tools
    _tools = None
    if on_change:
        on_change()


def register(app_id, version, name=None, folder=None):
    """Record an app as installed. Writes nothing if that's already what it says."""
    if not _exists(ROOT):
        os.mkdir(ROOT)
    marker = ROOT + "/__init__.py"
    if not _exists(marker):
        with open(marker, "w") as f:
            f.write("# Extension package marker\n")
    registry = read()
    old = registry.get(app_id) or {}
    new = {"version": version, "installedAt": old.get("installedAt") or int(time.time() * 1000)}
    if name or old.get("name"):
        new["name"] = name or old["name"]
    if folder or old.get("dir"):
        new["dir"] = folder or old["dir"]
    if new == old:
        return new
    registry[app_id] = new
    _write(registry)
    _changed()
    return new


def _remove_tree(path):
    count = 0
    for name in os.listdir(path):
        child = path + "/" + name
        if os.stat(child)[0] & _DIR_FLAG:
            count += _remove_tree(child)
        else:
            os.remove(child)
            count += 1
        bg_tasks.feed("queue_pump")
    os.rmdir(path)
    return count


def _forget_autostart(app_id):
    from lib.sys import settings

    entries = settings.get("extensions.autostart", [])
    kept = [e for e in entries if e.get("id") != app_id]
    if len(kept) != len(entries):
        settings.set("extensions.autostart", kept)
        settings.save()


def remove(app_id):
    """Remove an app's code and its record. Its data stays. What it has running stops at the next reset."""
    registry = read()
    if app_id not in registry:
        raise ValueError("No such app: %s" % app_id)
    folder = folder_of(app_id, registry[app_id])
    if not folder or "/" in folder or folder.startswith("."):
        raise ValueError("Bad folder for %s: %s" % (app_id, folder))
    path = ROOT + "/" + folder
    files = _remove_tree(path) if _exists(path) else 0
    prefix = "lib.ext." + folder
    loaded = [m for m in sys.modules if m == prefix or m.startswith(prefix + ".")]
    for module in loaded:
        del sys.modules[module]
    _forget_autostart(app_id)
    del registry[app_id]
    _write(registry)
    _changed()
    return {"removed": app_id, "files": files, "was_loaded": bool(loaded)}


def _config_block(path):
    with open(path) as f:
        text = f.read()
    start = text.find(CONFIG_START)
    end = text.find(CONFIG_END)
    # Without a block it's just a module the app keeps here
    if start < 0 or end < 0:
        return None
    return eval(text[start + len(CONFIG_START) : end].strip())


def _arg_schema(spec):
    kind = spec.get("type", str)
    schema = {}
    if kind is list:
        schema = {"type": "integer", "enum": board.pins()}
    elif kind is dict:
        items = spec.get("items", {})
        schema = {"type": "string", "enum": list(items.keys())}
        if items:
            schema["description"] = "; ".join("%s: %s" % (k, v) for k, v in items.items())
    else:
        schema = {"type": _TYPES.get(kind, "string")}
    if spec.get("label"):
        label = spec["label"].rstrip(":")
        schema["description"] = label + (". " + schema["description"] if "description" in schema else "")
    if "value" in spec:
        schema["default"] = spec["value"]
    return schema


def _tool_def(tool_name, config):
    info = config.get("info", {})
    args = config.get("args", {})
    effects = info.get("effects", {})
    annotations = {hint: effects.get(key, default) for key, hint, default in _EFFECT_HINTS}
    if info.get("name"):
        annotations["title"] = info["name"]
    return {
        "name": tool_name,
        "description": info.get("description", ""),
        "inputSchema": {
            "type": "object",
            "properties": {name: _arg_schema(spec) for name, spec in args.items()},
            "required": [name for name, spec in args.items() if "value" not in spec and not spec.get("optional")],
        },
        "annotations": annotations,
    }


def _add_tool(tool_name, path, app_id):
    try:
        config = _config_block(path)
        if config is not None:
            _tools[tool_name] = {"def": _tool_def(tool_name, config), "path": path, "args": config.get("args", {}), "app": app_id}
    except Exception as e:
        _errors[tool_name] = str(e)


def _scan():
    global _tools
    _tools = {}
    _errors.clear()
    for tool_name, needs in _BUILTIN_NEEDS.items():
        if board.has(needs):
            _add_tool(tool_name, "%s/%s.py" % (BUILTIN_TOOLS, tool_name), None)
    for app_id, entry in read().items():
        folder = ROOT + "/" + folder_of(app_id, entry) + "/" + TOOLS_FOLDER
        try:
            names = os.listdir(folder)
        except OSError:
            continue
        prefix = app_id.replace("-", "_")
        for name in names:
            if not name.endswith(".py") or name.startswith("_"):
                continue
            _add_tool("%s_%s" % (prefix, name[:-3]), folder + "/" + name, app_id)


def tools():
    """Tool name to its entry. Cached until an app is installed or removed."""
    if _tools is None:
        _scan()
    return _tools


def tool_defs():
    return [t["def"] for t in tools().values()]


def describe():
    """What's installed, for anyone who asks."""
    all_tools = tools()
    out = []
    for app_id, entry in read().items():
        row = {"id": app_id, "version": entry.get("version"), "folder": folder_of(app_id, entry)}
        if entry.get("name"):
            row["name"] = entry["name"]
        row["tools"] = [name for name, t in all_tools.items() if t["app"] == app_id]
        out.append(row)
    return {"apps": out, "tool_errors": dict(_errors)}
