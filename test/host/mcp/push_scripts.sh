#!/bin/bash
# Put this branch's device scripts on a board over serial.
#
#   push_scripts.sh /dev/tty.usbmodem1101
#
# Set MPREMOTE to use a particular mpremote.
#
# Needs a board at its REPL. A board freshly flashed with 2.x firmware that still
# has 1.x scripts stops there by itself, because main.py can't import webrepl_binary.
# Leaves /settings/board.json, your saved settings and /certs alone.
set -e
PORT="$1"
[ -n "$PORT" ] || { echo "usage: $0 <serial port>"; exit 2; }
cd "$(dirname "$0")/../../../boards/firmware/device-scripts"
M="${MPREMOTE:-mpremote} connect $PORT"
$M exec "
import os
for p in ('lib/binascii.py', 'lib/webrepl_logging.py'):
    try:
        os.remove(p)
        print('removed', p)
    except OSError:
        pass
"
$M fs cp main.py boot.py :
$M fs cp -r lib/sys :lib/
$M fs cp settings/default_settings.json :settings/
$M reset
