"""
AXP2101 PMU driver — MicroPython I2C interface.

Enables power rails (DC1, ALDO1-4), battery management, and shutdown
for boards using the AXP2101 power management unit (e.g. Waveshare ePaper 3.97").

Register map derived from XPowersAXP2101.tpp (Lewis He, MIT License).

Usage:
    import machine
    from lib.sys.drivers.axp2101 import AXP2101

    i2c = machine.SoftI2C(scl=machine.Pin(42), sda=machine.Pin(41), freq=400_000)
    pmu = AXP2101(i2c)
    pmu.init()           # Enable DC1 + ALDO1/2/3 at 3.3V, configure charging
    print(pmu.battery_percent())
    pmu.shutdown()       # Power off
"""

_ADDR = 0x34

# Status registers
_STATUS1        = 0x00
_STATUS2        = 0x01
_CHIP_ID        = 0x03

# Common config
_COMMON_CONFIG  = 0x10

# Input limits
_VBUS_VOL_LIMIT = 0x15
_VBUS_CUR_LIMIT = 0x16

# Gauge / watchdog
_GAUGE_WDT_CTRL = 0x18

# Low battery thresholds
_LOW_BAT_WARN   = 0x1A

# Power key timing
_IRQ_OFF_ON_LVL = 0x27

# ADC
_ADC_CHAN_CTRL   = 0x30

# Charging
_IPRECHG_SET     = 0x61
_ICC_CHG_SET     = 0x62
_ITERM_CHG_CTRL  = 0x63
_CV_CHG_VOL_SET  = 0x64

# Battery detection
_BAT_DET_CTRL    = 0x68
_CHGLED_CTRL     = 0x69

# Button battery
_BTN_BAT_CHG_VOL = 0x6A

# DCDC on/off + DVM
_DC_ONOFF_DVM    = 0x80
# DCDC voltage registers
_DC_VOL0         = 0x82  # DC1

# LDO on/off
_LDO_ONOFF0      = 0x90  # ALDO1-4 bits 0-3
_LDO_ONOFF1      = 0x91  # BLDO1-2, CPUSLDO, DLDO1-2

# LDO voltage registers (ALDO1=0x92, ALDO2=0x93, ALDO3=0x94, ALDO4=0x95)
_LDO_VOL0        = 0x92

# Fuel gauge
_FUEL_GAUGE_CTRL = 0xA2
_BAT_PERCENT     = 0xA4

# Shutdown voltage
_VOFF_SET        = 0x24


class AXP2101:
    """AXP2101 PMU driver for MicroPython."""

    def __init__(self, i2c, addr=_ADDR):
        self._i2c = i2c
        self._addr = addr
        self._buf1 = bytearray(1)

    def _read_reg(self, reg):
        self._i2c.readfrom_mem_into(self._addr, reg, self._buf1)
        return self._buf1[0]

    def _write_reg(self, reg, val):
        self._buf1[0] = val & 0xFF
        self._i2c.writeto_mem(self._addr, reg, self._buf1)

    def _set_bit(self, reg, bit):
        val = self._read_reg(reg)
        self._write_reg(reg, val | (1 << bit))

    def _clr_bit(self, reg, bit):
        val = self._read_reg(reg)
        self._write_reg(reg, val & ~(1 << bit))

    def _get_bit(self, reg, bit):
        return bool(self._read_reg(reg) & (1 << bit))

    # ── Identification ──

    def chip_id(self):
        """Read chip ID register. Should return 0x4A for AXP2101."""
        return self._read_reg(_CHIP_ID)

    # ── Full init (matches axp_prot.cpp sequence) ──

    def init(self):
        """Initialize AXP2101 with board-standard configuration.

        Enables DC1 + ALDO1/2/3 at 3.3V, configures battery charging,
        enables ADC channels, and sets up fuel gauge.
        """
        cid = self.chip_id()
        if cid != 0x4A:
            print(f"[AXP2101] WARNING: unexpected chip ID 0x{cid:02X} (expected 0x4A)")

        # VBUS input limits: 4.36V, 1500mA
        val = self._read_reg(_VBUS_VOL_LIMIT) & 0xF0
        self._write_reg(_VBUS_VOL_LIMIT, val | 0x06)  # 4.36V
        val = self._read_reg(_VBUS_CUR_LIMIT) & 0xF8
        self._write_reg(_VBUS_CUR_LIMIT, val | 0x05)  # 1500mA

        # System shutdown voltage: 2600mV
        # Reg 0x24: bits [2:0] = (mV - 2600) / 100
        self._write_reg(_VOFF_SET, 0x00)  # 2600mV

        # DC1 = 3300mV — main VCC rail
        self.set_dc1_voltage(3300)
        self.enable_dc1()

        # ALDO1 = 3300mV (ePaper VCC)
        self.set_aldo_voltage(1, 3300)
        self.enable_aldo(1)

        # ALDO2 = 3300mV (Audio VCC)
        self.set_aldo_voltage(2, 3300)
        self.enable_aldo(2)

        # ALDO3 = 3300mV
        self.set_aldo_voltage(3, 3300)
        self.enable_aldo(3)

        # Power key: 1s on, 4s off
        val = self._read_reg(_IRQ_OFF_ON_LVL)
        val = (val & 0xF3) | (0x00 << 2)  # POWEROFF_4S = 0
        val = (val & 0xFC) | 0x02          # POWERON_1S = 2
        self._write_reg(_IRQ_OFF_ON_LVL, val)

        # Enable ADC channels: temp, batt detect, VBUS, batt voltage, sys voltage
        self._write_reg(_ADC_CHAN_CTRL, 0x1F)

        # Disable charge LED
        val = self._read_reg(_CHGLED_CTRL) & 0xCF
        self._write_reg(_CHGLED_CTRL, val | (0x07 << 4))  # LED off

        # Charging config
        self._write_reg(_IPRECHG_SET, 0x02)     # Precharge 50mA
        self._write_reg(_ICC_CHG_SET, 0x04)      # Constant current 200mA
        val = self._read_reg(_ITERM_CHG_CTRL) & 0xF0
        self._write_reg(_ITERM_CHG_CTRL, val | 0x01)  # Termination 25mA

        # Charge target voltage: 4.2V
        val = self._read_reg(_CV_CHG_VOL_SET) & 0xFC
        self._write_reg(_CV_CHG_VOL_SET, val | 0x02)  # 4.2V

        # Enable battery detection
        self._set_bit(_BAT_DET_CTRL, 0)

        # RTC button battery charging: 3000mV
        val = self._read_reg(_BTN_BAT_CHG_VOL) & 0xF8
        val |= (3000 - 2600) // 100  # 4 = 3000mV
        self._write_reg(_BTN_BAT_CHG_VOL, val)
        self._set_bit(_GAUGE_WDT_CTRL, 2)  # Enable button battery charge

        # Low battery thresholds
        val = self._read_reg(_LOW_BAT_WARN) & 0x0F
        val |= ((10 - 5) << 4)  # Warn at 10%
        self._write_reg(_LOW_BAT_WARN, val)
        val = self._read_reg(_LOW_BAT_WARN) & 0xF0
        self._write_reg(_LOW_BAT_WARN, val | 5)  # Shutdown at 5%

        # Fuel gauge: enable learning + ROM save
        self._set_bit(_FUEL_GAUGE_CTRL, 7)  # Enable fuel gauge
        self._set_bit(_FUEL_GAUGE_CTRL, 6)  # Save to ROM

        print("[AXP2101] init OK — DC1 + ALDO1/2/3 at 3.3V")

    # ── DC1 control ──

    def enable_dc1(self):
        self._set_bit(_DC_ONOFF_DVM, 0)

    def disable_dc1(self):
        print("[AXP2101] WARNING: Disabling DC1 will cut main VCC!")
        self._clr_bit(_DC_ONOFF_DVM, 0)

    def is_dc1_enabled(self):
        return self._get_bit(_DC_ONOFF_DVM, 0)

    def set_dc1_voltage(self, mv):
        """Set DC1 voltage (1500-3400mV, 100mV steps)."""
        if mv < 1500 or mv > 3400:
            raise ValueError("DC1: 1500-3400mV")
        self._write_reg(_DC_VOL0, (mv - 1500) // 100)

    def get_dc1_voltage(self):
        return (self._read_reg(_DC_VOL0) & 0x1F) * 100 + 1500

    # ── ALDO control (1-4) ──

    def enable_aldo(self, n):
        """Enable ALDO n (1-4)."""
        if n < 1 or n > 4:
            raise ValueError("ALDO 1-4")
        self._set_bit(_LDO_ONOFF0, n - 1)

    def disable_aldo(self, n):
        if n < 1 or n > 4:
            raise ValueError("ALDO 1-4")
        self._clr_bit(_LDO_ONOFF0, n - 1)

    def is_aldo_enabled(self, n):
        if n < 1 or n > 4:
            raise ValueError("ALDO 1-4")
        return self._get_bit(_LDO_ONOFF0, n - 1)

    def set_aldo_voltage(self, n, mv):
        """Set ALDO n voltage (500-3500mV, 100mV steps)."""
        if n < 1 or n > 4:
            raise ValueError("ALDO 1-4")
        if mv < 500 or mv > 3500:
            raise ValueError("ALDO: 500-3500mV")
        reg = _LDO_VOL0 + (n - 1)
        val = self._read_reg(reg) & 0xE0
        val |= (mv - 500) // 100
        self._write_reg(reg, val)

    def get_aldo_voltage(self, n):
        if n < 1 or n > 4:
            raise ValueError("ALDO 1-4")
        reg = _LDO_VOL0 + (n - 1)
        return (self._read_reg(reg) & 0x1F) * 100 + 500

    # ── Battery status ──

    def battery_percent(self):
        """Battery level 0-100%, or -1 if no battery connected."""
        if not self._get_bit(_STATUS1, 3):  # Battery present bit
            return -1
        return self._read_reg(_BAT_PERCENT)

    def is_charging(self):
        return (self._read_reg(_STATUS2) >> 5) == 0x01

    def is_discharging(self):
        return (self._read_reg(_STATUS2) >> 5) == 0x02

    def is_usb_connected(self):
        """VBUS inserted and good."""
        vbus_good = self._get_bit(_STATUS1, 5)
        vbus_in = not self._get_bit(_STATUS2, 3)
        return vbus_good and vbus_in

    def battery_voltage(self):
        """Battery voltage in mV (from ADC, 14-bit)."""
        if not self._get_bit(_STATUS1, 3):
            return 0
        hi = self._read_reg(0x34)
        lo = self._read_reg(0x35)
        return ((hi & 0x1F) << 8) | lo

    def system_voltage(self):
        """System voltage in mV (from ADC)."""
        hi = self._read_reg(0x36)
        lo = self._read_reg(0x37)
        return ((hi & 0x1F) << 8) | lo

    def vbus_voltage(self):
        """VBUS voltage in mV (from ADC)."""
        hi = self._read_reg(0x38)
        lo = self._read_reg(0x39)
        return ((hi & 0x1F) << 8) | lo

    # ── Power control ──

    def shutdown(self):
        """Power off — turns off all channels except VRTC."""
        self._set_bit(_COMMON_CONFIG, 0)

    def reset(self):
        """Reset the SoC — POWOFF/POWON cycle."""
        self._set_bit(_COMMON_CONFIG, 1)

    # ── Status summary ──

    def status(self):
        """Return a dict with key PMU status fields."""
        return {
            'battery_pct': self.battery_percent(),
            'battery_mv': self.battery_voltage(),
            'charging': self.is_charging(),
            'usb': self.is_usb_connected(),
            'dc1_mv': self.get_dc1_voltage(),
            'aldo1_mv': self.get_aldo_voltage(1),
            'aldo2_mv': self.get_aldo_voltage(2),
            'aldo3_mv': self.get_aldo_voltage(3),
        }
