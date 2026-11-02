"""
Jobs (lib/sys/jobs.py)
======================

An app's tool runs as a background task, so it can take as long as it needs without
holding up the pump. On a held socket, tools/call simply stays open until the task
finishes: progress arrives as notifications/progress, and notifications/cancelled
stops it, so a stock MCP client needs nothing special. Plain HTTP can't hold a reply
open, so there it returns a job id to poll with job_status.

A tool that blocks the event loop instead of awaiting gets named by the watchdog, and
broken if it stays stuck. Its caller is told.

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import asyncio
import io
import json
import sys
import time

import mcplink
import wsserver

from lib.sys import apps, bg_tasks, tx_gate

FINISHED_KEPT = 8
OUTPUT_MAX = 4096
PROGRESS_EVERY_MS = 200

on_finish = None
_jobs = {}
_next_id = 1


class _Args:
    def __init__(self, values):
        for name, value in values.items():
            setattr(self, name, value)


def _bind(specs, given):
    values = {}
    for name, spec in specs.items():
        if name in given:
            value = given[name]
            kind = spec.get("type")
            if kind is dict and value not in spec.get("items", {}):
                raise ValueError("%s must be one of %s" % (name, list(spec.get("items", {}))))
            values[name] = value
        elif "value" in spec:
            values[name] = spec["value"]
        elif spec.get("optional"):
            values[name] = None
        else:
            raise ValueError("Missing argument: %s" % name)
    return _Args(values)


def _send(client, message):
    if client in wsserver.clients():
        wsserver.send(client, json.dumps(message))


class Job:
    def __init__(self, job_id, tool, client, mid, token):
        self.id = job_id
        self.tool = tool
        self.task_name = "job_%d" % job_id
        self.client = client
        self.mid = mid
        self.token = token
        self.state = "running"
        self.done = 0
        self.total = None
        self.message = None
        self.output = ""
        self.result = None
        self.error = None
        self.quiet = False
        self.activity = None
        self.started = time.ticks_ms()
        self.seconds = None
        self._last_sent = None

    def progress(self, done, total=None, message=None):
        """Report how far along it is. Often is fine: it's rate-limited."""
        self.done = done
        self.total = total
        self.message = message
        if self.token is None:
            return
        now = time.ticks_ms()
        if self._last_sent is not None and time.ticks_diff(now, self._last_sent) < PROGRESS_EVERY_MS and done != total:
            return
        self._last_sent = now
        params = {"progressToken": self.token, "progress": done}
        if total is not None:
            params["total"] = total
        if message is not None:
            params["message"] = message
        _send(self.client, {"jsonrpc": "2.0", "method": "notifications/progress", "params": params})

    def print(self, *values, sep=" ", end="\n"):
        """A tool's print goes here, not to the terminal: dupterm is global, and this isn't."""
        self.output = (self.output + sep.join(str(v) for v in values) + end)[-OUTPUT_MAX:]

    def status(self):
        row = {"job": self.id, "tool": self.tool, "state": self.state, "done": self.done}
        if self.total is not None:
            row["total"] = self.total
        if self.message is not None:
            row["message"] = self.message
        if self.output:
            row["output"] = self.output
        if self.result is not None:
            row["result"] = self.result
        if self.error is not None:
            row["error"] = self.error
        row["seconds"] = self.seconds if self.seconds is not None else time.ticks_diff(time.ticks_ms(), self.started) // 1000
        return row

    def reply(self):
        """The result of tools/call, for a client that waited for it."""
        parts = []
        if self.error is not None:
            parts.append(self.error)
        elif isinstance(self.result, str):
            parts.append(self.result)
        elif self.result is not None:
            parts.append(json.dumps(self.result))
        if self.output:
            parts.append(self.output)
        return {"content": [{"type": "text", "text": "\n".join(parts)}], "isError": self.state != "done", "resultType": "complete"}


def _finish(job, state, error=None):
    job.state = state
    job.error = error
    job.seconds = time.ticks_diff(time.ticks_ms(), job.started) // 1000
    if job.mid is not None and not job.quiet:
        _send(job.client, {"jsonrpc": "2.0", "id": job.mid, "result": job.reply()})
    if on_finish:
        on_finish(job)
    _prune()


def _in_order():
    # A dict here doesn't keep insertion order
    return sorted(_jobs.values(), key=lambda j: j.id)


def _prune():
    finished = [j for j in _in_order() if j.state != "running"]
    for job in finished[:-FINISHED_KEPT]:
        del _jobs[job.id]
        bg_tasks._tasks.pop(job.task_name, None)


async def _run(job, path, args):
    try:
        with open(path) as f:
            source = f.read()
        namespace = {"__name__": job.tool, "print": job.print}
        exec(source, namespace)
        job.result = await namespace["run"](args, job)
    except asyncio.CancelledError:
        _finish(job, "cancelled", "Cancelled")
        raise
    except KeyboardInterrupt:
        _finish(job, "failed", "Stopped: this tool held the event loop too long. Long work has to await.")
    except Exception as e:
        trace = io.StringIO()
        sys.print_exception(e, trace)
        _finish(job, "failed", trace.getvalue())
    else:
        _finish(job, "done")


def start(tool_name, given, client=-1, mid=None, token=None):
    """Start a tool. mid, if set, is a request to answer when it finishes."""
    global _next_id
    entry = apps.tools().get(tool_name)
    if entry is None:
        raise ValueError("Unknown tool: %s" % tool_name)
    args = _bind(entry["args"], given)
    job = Job(_next_id, tool_name, client, mid, token)
    _next_id += 1
    _jobs[job.id] = job
    bg_tasks.start(job.task_name, _run, job, entry["path"], args)
    # A read-only tool has said it changes nothing, though a CAN read can take a transmit
    if wsserver.client_role(client) != mcplink.ROLE_HUMAN and not entry["def"]["annotations"]["readOnlyHint"]:
        tx_gate.mark(bg_tasks._tasks[job.task_name]["task"])
    return job


def get(job_id):
    job = _jobs.get(job_id)
    if job is None:
        raise ValueError("No such job: %s" % job_id)
    return job


def list_all():
    return [j.status() for j in _in_order()]


def cancel(job_id):
    job = get(job_id)
    if job.state == "running":
        bg_tasks.stop(job.task_name)
    return job


def cancel_request(client, mid):
    """notifications/cancelled. The client has stopped listening, so it gets no reply."""
    for job in _jobs.values():
        if job.state == "running" and job.client == client and job.mid == mid and mid is not None:
            job.quiet = True
            bg_tasks.stop(job.task_name)


def on_disconnect(client):
    """A call nobody is waiting for any more stops. A job started on purpose carries on."""
    for job in _jobs.values():
        if job.state == "running" and job.client == client and job.mid is not None:
            job.quiet = True
            bg_tasks.stop(job.task_name)
