"""Moving files by host path, so no file bytes ever pass through a model."""

import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile
import time

from .device import DeviceError, ToolError

IGNORED_NAMES = {"__pycache__", ".DS_Store", ".git"}
LISTED_PATHS_MAX = 50
C_MODULES = ("mcplink", "wsserver", "httpserver", "taskwatchdog")
C_ATTRIBUTE = re.compile(r"\b(" + "|".join(C_MODULES) + r")\.([A-Za-z_]\w*)")
MANIFEST = "extension.json"
# They describe this board or hold its state. A host's copies are only templates.
BOARD_FILES = ("/firmware-version.json", "/settings/board.json", "/settings/user_settings.json")
BOARD_FOLDERS = ("/certs/",)


async def push(device, local, remote):
    with open(local, "rb") as f:
        data = f.read()
    start = time.monotonic()
    parent = remote.rsplit("/", 1)[0]
    if parent:
        await device.tool("fs_mkdir", path=parent)
    await device.write_file(remote, data)
    return {"path": remote, "bytes": len(data), "seconds": round(time.monotonic() - start, 2)}


async def pull(device, remote, local):
    start = time.monotonic()
    data = await device.read_file(remote)
    parent = os.path.dirname(os.path.abspath(local))
    os.makedirs(parent, exist_ok=True)
    with open(local, "wb") as f:
        f.write(data)
    return {"path": local, "bytes": len(data), "seconds": round(time.monotonic() - start, 2)}


def _walk(root):
    for folder, names, files in os.walk(root):
        names[:] = sorted(n for n in names if n not in IGNORED_NAMES)
        for name in sorted(files):
            if name not in IGNORED_NAMES:
                yield os.path.join(folder, name)


def _plain_files(local, remote):
    remote = remote.rstrip("/")
    return [(path, f"{remote}/{os.path.relpath(path, local).replace(os.sep, '/')}") for path in _walk(local)]


def _manifest_files(local):
    """An app's files and where they go, as its extension.json declares."""
    with open(os.path.join(local, MANIFEST)) as f:
        meta = json.load(f)
    device_dir = os.path.join(local, "device")
    paths = meta.get("devicePaths")
    if not paths:
        return [(path, f"/lib/ext/{meta['id']}/{os.path.relpath(path, device_dir).replace(os.sep, '/')}") for path in _walk(device_dir)]
    files = []
    for source, target in paths.items():
        path = os.path.normpath(os.path.join(device_dir, source))
        if os.path.exists(path):
            files.append((path, target))
    return files


def _find_mpy_cross(given):
    found = given or os.environ.get("MPY_CROSS") or shutil.which("mpy-cross")
    if not found or not shutil.which(found):
        raise DeviceError("mpy-cross not found. Pass mpy_cross, or set MPY_CROSS.")
    return found


async def _check_mpy_cross(device, tool):
    """Bytecode from a different version won't import, and nothing says so until it runs."""
    output = subprocess.run([tool, "--version"], capture_output=True, text=True).stdout
    match = re.search(r"mpy v(\d+)\.(\d+)", output)
    code = "import sys\nprint(getattr(sys.implementation, '_mpy', 0))"
    mpy = int((await device.tool("exec", code=code)).strip())
    if match and mpy and (int(match[1]), int(match[2])) != (mpy & 0xFF, (mpy >> 8) & 3):
        raise DeviceError(f"{tool} makes mpy v{match[1]}.{match[2]}, and this board needs v{mpy & 0xFF}.{(mpy >> 8) & 3}.")


def _compile(tool, source, name, folder):
    """The source name goes in the bytecode, so it mustn't depend on where the host keeps it."""
    out = os.path.join(folder, hashlib.sha256(name.encode()).hexdigest() + ".mpy")
    done = subprocess.run([tool, "-O2", "-s", name, "-o", out, source], capture_output=True, text=True)
    if done.returncode:
        raise DeviceError(f"mpy-cross failed on {source}: {done.stderr.strip()}")
    return out


async def _check_firmware(device, files):
    """Scripts that call into C the firmware doesn't have fail at import, leaving a board with no
    network to fix itself over. So look before copying them."""
    wanted = {}
    for path, _ in files:
        if path.endswith(".py"):
            with open(path, encoding="utf-8", errors="replace") as f:
                for module, attribute in C_ATTRIBUTE.findall(f.read()):
                    wanted.setdefault(module, set()).add(attribute)
    if not wanted:
        return
    query = {module: sorted(names) for module, names in wanted.items()}
    code = (
        "import json\nout = {}\n"
        f"for m, names in {query!r}.items():\n"
        "    try:\n"
        "        mod = __import__(m)\n"
        "    except ImportError:\n"
        "        out[m] = names\n"
        "        continue\n"
        "    gone = [n for n in names if not hasattr(mod, n)]\n"
        "    if gone:\n"
        "        out[m] = gone\n"
        "print(json.dumps(out))"
    )
    missing = json.loads(await device.tool("exec", code=code))
    if missing:
        detail = "; ".join(f"{m}: {', '.join(names)}" for m, names in sorted(missing.items()))
        raise DeviceError(f"These scripts need firmware this board doesn't have ({detail}). Flash newer firmware first, or pass force.")


async def _device_hash(device, path):
    try:
        return (await device.tool_json("fs_hash", path=path))["sha256"]
    except ToolError:
        return None


def _is_board_file(target):
    return target in BOARD_FILES or target.startswith(BOARD_FOLDERS)


def _is_app_data(target):
    """An app's files outside /lib hold what it has learned and been told. The host only has seeds."""
    return not target.startswith("/lib/")


def _is_compiled(path, target):
    """Same rule as the bundler: library code, not boot or settings files."""
    return path.endswith(".py") and "/lib/" in target


async def sync(device, local, remote="/", prune=False, mpy_cross=None, compile_py=None, force=False, dry_run=False, progress=None):
    """Copy only what differs. A directory with an extension.json goes where that says.

    Never overwrites a board's own files, or an app's data once it exists.
    """
    start = time.monotonic()
    if not os.path.isdir(local):
        raise DeviceError(f"{local} isn't a directory")
    is_app = os.path.exists(os.path.join(local, MANIFEST))
    files = _manifest_files(local) if is_app else _plain_files(local, remote)
    if not files:
        raise DeviceError(f"Nothing to copy from {local}")
    if not force:
        await _check_firmware(device, files)

    compile_py = is_app if compile_py is None else compile_py
    tool = None
    if compile_py and any(_is_compiled(path, target) for path, target in files):
        tool = _find_mpy_cross(mpy_cross)
        await _check_mpy_cross(device, tool)

    changed = []
    kept = []
    unchanged = 0
    copied_bytes = 0
    made = set()
    with tempfile.TemporaryDirectory() as folder:
        for index, (path, target) in enumerate(files):
            source = path
            if tool and _is_compiled(path, target):
                source = _compile(tool, path, target.removeprefix("/lib/ext/"), folder)
                target = target[:-3] + ".mpy"
            with open(source, "rb") as f:
                data = f.read()
            on_device = None if _is_board_file(target) else await _device_hash(device, target)
            if _is_board_file(target) or (is_app and _is_app_data(target) and on_device is not None):
                kept.append(target)
            elif on_device == hashlib.sha256(data).hexdigest():
                unchanged += 1
            else:
                if not dry_run:
                    parent = target.rsplit("/", 1)[0]
                    if parent and parent not in made:
                        await device.tool("fs_mkdir", path=parent)
                        made.add(parent)
                    await device.write_file(target, data)
                changed.append(target)
                copied_bytes += len(data)
            if progress:
                await progress(index + 1, len(files), target)

    removed = await _prune(device, files, remote) if prune and not is_app and not dry_run else []
    return {
        "dry_run": dry_run,
        "copied": len(changed),
        "unchanged": unchanged,
        "kept": kept,
        "removed": len(removed),
        "bytes": copied_bytes,
        "seconds": round(time.monotonic() - start, 2),
        "changed": changed[:LISTED_PATHS_MAX],
    }


async def _prune(device, files, remote):
    """Remove what's on the device under remote that the host doesn't have."""
    keep = {target for _, target in files}
    keep.update(BOARD_FILES)
    removed = []
    pending = [remote.rstrip("/") or "/"]
    while pending:
        folder = pending.pop()
        for row in await device.tool_json("fs_list", path=folder):
            path = f"{folder.rstrip('/')}/{row['name']}"
            if row["type"] == "dir":
                pending.append(path)
            elif path not in keep and not path.startswith(BOARD_FOLDERS):
                await device.tool("fs_rm", path=path)
                removed.append(path)
    return removed
