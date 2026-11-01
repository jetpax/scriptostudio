"""
Device authentication (lib/sys/auth.py)
=======================================

One password, chosen at setup, and two tokens derived from it: a human token and
an agent token. A person types the password into Studio. An agent is handed only
its token, which doesn't reveal the password or the human token.

Only the SHA-256 of each token is stored, so a client that can read settings
can't recover a token from them. Host tools derive the same tokens:

    token = sha256("ss-<role>:<password>") as hex, first 32 chars

Copyright (c) 2026 Jonathan Elliot Peace
SPDX-License-Identifier: MIT
"""

import binascii
import hashlib

import mcplink

from lib.sys import settings

_KEY_HUMAN = "server.auth_human"
_KEY_AGENT = "server.auth_agent"
_KEY_LEGACY_PASSWORD = "server.webrepl_password"


def _sha256_hex(text):
    return binascii.hexlify(hashlib.sha256(text.encode()).digest()).decode()


def token(password, role):
    return _sha256_hex("ss-%s:%s" % (role, password))[:32]


def set_password(password):
    """Replace both tokens, and apply them to connections made from now on."""
    human = _sha256_hex(token(password, "human"))
    agent = _sha256_hex(token(password, "agent"))
    settings.set(_KEY_HUMAN, human)
    settings.set(_KEY_AGENT, agent)
    settings.save()
    mcplink.set_auth(human, agent)


def apply():
    """Load the stored tokens into the C layer. Called at server start."""
    # A board updated from 1.x still has its password in the clear. Keep the
    # password working, and stop storing it.
    legacy = settings.get(_KEY_LEGACY_PASSWORD)
    if legacy:
        settings.set(_KEY_LEGACY_PASSWORD, "")
        set_password(legacy)
        return
    mcplink.set_auth(settings.get(_KEY_HUMAN), settings.get(_KEY_AGENT))
