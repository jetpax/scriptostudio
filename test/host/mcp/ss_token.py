#!/usr/bin/env python3
"""Print the agent and human tokens for a device password. Give agents only the agent token."""

import argparse

from mcp_client import token

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument("password")
a = ap.parse_args()
print("agent", token(a.password, "agent"))
print("human", token(a.password, "human"))
