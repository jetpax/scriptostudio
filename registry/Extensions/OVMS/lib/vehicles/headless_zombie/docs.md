# Headless ZombieVerter (Simulated)

A simulated ZombieVerter VCU for testing OVMS without CAN hardware.

## Overview

This vehicle type uses the `fake_zombieverter.py` simulator to provide realistic ZombieVerter metrics without requiring actual TWAI/CAN bus hardware. Perfect for:

- Development and testing of OVMS extensions
- Testing OVMS server connectivity
- Demonstrating the OpenInverter plotter
- Learning how OVMS works

## Features

The simulator provides realistic, time-varying metrics including:

- **Battery**: Voltage, current, SOC, power, kWh, Ah
- **Motion**: Speed (RPM & kph), torque, throttle
- **Temperatures**: Motor, inverter, battery (with realistic heating/cooling)
- **Status**: Operating mode, direction, 12V system

Metrics vary over time using sine waves to simulate realistic driving patterns:
- Speed cycles between 0-4000 RPM
- Power varies from 0-50kW
- Components heat up under load and cool down when idle
- Battery slowly discharges and resets

## Configuration

Select "Headless ZombieVerter (Simulated)" as your vehicle type in the OVMS configuration.

No additional configuration needed - the simulator runs automatically without requiring any CAN hardware setup.

