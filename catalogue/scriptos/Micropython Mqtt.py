
# === START_CONFIG_PARAMETERS ===

dict(
    
    timeout = 0,  # No interrupt button by default for libraries
    
    info    = dict(
        name        = 'Micropython Mqtt',
        version     = [1, 0, 0],  # Initial ScriptO version
        category    = 'Communications',
        description = '''MQTT is an easily used networking protocol designed for IOT (internet of things) applications. It is well suited for controlling hardware devices and''',
        author      = 'peterhinch',
        tags        = ['untested', 'awesome-micropython', 'communications'],
        source_url  = 'https://github.com/peterhinch/micropython-mqtt',
        source_repo = 'peterhinch/micropython-mqtt',
        upstream_version = 'master',
        license     = 'MIT'
    ),
    
    args    = dict(
        # Add library-specific arguments here if needed
    )
)

# === END_CONFIG_PARAMETERS ===

# Converted from: https://github.com/peterhinch/micropython-mqtt
# Original author: peterhinch
# Original license: MIT
# 
# This library has been converted to ScriptO format for use with Scripto Studio.
# Tagged as "untested" - please test and report issues at:
# https://github.com/jetpax/scripto-studio-registry/issues


# mqtt_local.py Local configuration for mqtt_as demo programs.
from sys import platform, implementation
from mqtt_as import config

config["server"] = "192.168.0.10"  # Change to suit
#  config['server'] = 'test.mosquitto.org'

# Not needed if you're only using ESP8266
config["ssid"] = "your_network_name"
config["wifi_pw"] = "your_password"

# For demos ensure same calling convention for LED's on all platforms.
# ESP8266 Feather Huzzah reference board has active low LED's on pins 0 and 2.
# ESP32 is assumed to have user supplied active low LED's on same pins.
# Call with blue_led(True) to light

if platform == "esp8266" or platform == "esp32":
    from machine import Pin

    def ledfunc(pin, active=0):
        pin = pin

        def func(v):
            pin(not v)  # Active low on ESP8266

        return pin if active else func

    wifi_led = ledfunc(Pin(0, Pin.OUT, value=0))  # Red LED for WiFi fail/not ready yet
    blue_led = ledfunc(Pin(2, Pin.OUT, value=1))  # Message received
    # Example of active high LED on UM Feather S3
    # blue_led = ledfunc(Pin(13, Pin.OUT, value = 0), 1)  # Message received ESP32-S3
elif platform == "pyboard":
    from pyb import LED

    def ledfunc(led, init):
        led = led
        led.on() if init else led.off()

        def func(v):
            led.on() if v else led.off()

        return func

    wifi_led = ledfunc(LED(1), 1)
    blue_led = ledfunc(LED(3), 0)
elif (platform == "rp2") and ("Pico" in implementation._machine):
    from machine import Pin

    def ledfunc(pin):
        pin = pin

        def func(v):
            pin(v)

        return func

    wifi_led = lambda _: None  # Only one LED
    LED = "LED" if "W" in implementation._machine else 25
    blue_led = ledfunc(Pin(LED, Pin.OUT, value=0))  # Message received
else:  # Assume no LEDs
    wifi_led = lambda _: None
    blue_led = wifi_led
