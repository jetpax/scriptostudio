"""
Device events and logs (lib/sys/events.py)
==========================================

Pushes to every client holding a socket, as MCP notifications. Clients on plain
HTTP have no socket to push to, so they don't get these.

Usage:
    from lib.sys import events
    events.notify({"eth_status": status})
    events.tell_people({"file_changed": {"path": path}}, skip=writer)

    logger.addHandler(events.LogHandler(logging.DEBUG))

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import json
import logging

import mcplink
import wsserver

_LEVELS = {
    "debug": 10,
    "info": 20,
    "notice": 25,
    "warning": 30,
    "error": 40,
    "critical": 50,
    "alert": 60,
    "emergency": 70,
}
_DEFAULT_MIN_LEVEL = _LEVELS["info"]

# client id -> lowest level it asked for with logging/setLevel
_min_levels = {}
# client id -> the name it gave itself
_names = {}


def running():
    """Is anyone connected to hear an event?"""
    return wsserver.count_clients() > 0


def set_level(client, name):
    level = _LEVELS.get(name)
    if level is None:
        return False
    _min_levels[client] = level
    return True


def forget(client):
    _min_levels.pop(client, None)
    _names.pop(client, None)


def set_name(client, name):
    _names[client] = name


def name_of(client):
    return _names.get(client) or "agent"


def people(skip=None):
    """The clients holding the human token, who watch what agents do."""
    return [c for c in wsserver.clients() if c != skip and wsserver.client_role(c) == mcplink.ROLE_HUMAN]


def _level_name(levelno):
    name = "debug"
    for n, v in _LEVELS.items():
        if v <= levelno and v >= _LEVELS[name]:
            name = n
    return name


def notify(event):
    """Send event, a dict, to every connected client."""
    text = json.dumps({"jsonrpc": "2.0", "method": "notifications/com.scriptostudio/event", "params": event})
    for client in wsserver.clients():
        wsserver.send(client, text)


def tell_people(event, skip=None):
    """Send event, a dict, to the people connected. Agents have no use for it."""
    clients = people(skip)
    if not clients:
        return
    text = json.dumps({"jsonrpc": "2.0", "method": "notifications/com.scriptostudio/event", "params": event})
    for client in clients:
        wsserver.send(client, text)


def file_changed(client, path, op="wrote"):
    """So everyone else can refresh their file list and any open tab."""
    tell_people({"file_changed": {"path": path, "op": op, "who": name_of(client)}}, skip=client)


def log(levelno, message, source=None):
    """Send a log line to every connected client that wants this level."""
    clients = [c for c in wsserver.clients() if levelno >= _min_levels.get(c, _DEFAULT_MIN_LEVEL)]
    if not clients:
        return
    params = {"level": _level_name(levelno), "data": message}
    if source:
        params["logger"] = source
    text = json.dumps({"jsonrpc": "2.0", "method": "notifications/message", "params": params})
    for client in clients:
        wsserver.send(client, text)


class LogHandler(logging.Handler):
    def emit(self, record):
        if record.levelno >= self.level:
            message = self.format(record) if self.formatter else record.message
            log(record.levelno, message, None if record.name == "root" else record.name)
