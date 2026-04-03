"""
es8311.py - ES8311 audio codec driver.

Initializes the codec and handles volume configuration via I2C.

Usage:
    from machine import Pin, I2C
    from lib.sys import board
    from lib.sys.drivers.es8311 import ES8311

    # Initialize from board manifest
    i2c_cfg = board.i2c('i2c0')
    i2c = I2C(0, scl=Pin(i2c_cfg.scl), sda=Pin(i2c_cfg.sda), freq=400000)
    
    codec = board.device('audio_codec')
    addr = int(codec.i2c_address, 0)
    
    es8311 = ES8311(i2c, addr)
    es8311.init(sample_rate=44100, volume=75)
    es8311.set_volume(100)
"""

import time

_COEFF = {
    (11289600, 44100): (1, 0, 1, 1, 0, 0, 0xFF, 4, 0x10, 0x10),
    (5644800,  44100): (1, 1, 1, 1, 0, 0, 0xFF, 4, 0x10, 0x10),
}

class ES8311:
    def __init__(self, i2c, addr=0x18):
        self.i2c = i2c
        self.ADDR = addr

    def _wr(self, reg, val):
        self.i2c.writeto_mem(self.ADDR, reg, bytes([val]))

    def _rd(self, reg):
        return self.i2c.readfrom_mem(self.ADDR, reg, 1)[0]

    def init(self, sample_rate, volume):
        """
        Initializes the ES8311 hardware codec and starts output.
        """
        self._wr(0x00, 0x1F)
        time.sleep_ms(20)
        self._wr(0x00, 0x00)
        self._wr(0x00, 0x80)

        mclk_hz = sample_rate * 256
        coeff = _COEFF.get((mclk_hz, sample_rate))
        if coeff is None:
            raise ValueError('No coefficients for %d Hz' % sample_rate)

        pre_div, pre_multi, adc_div, dac_div, fs_mode, lrck_h, lrck_l, bclk_div, adc_osr, dac_osr = coeff

        self._wr(0x01, 0x3F)
        reg02 = (self._rd(0x02) & 0x07) | ((pre_div - 1) << 5) | (pre_multi << 3)
        self._wr(0x02, reg02)
        self._wr(0x03, (fs_mode << 6) | adc_osr)
        self._wr(0x04, dac_osr)
        self._wr(0x05, ((adc_div - 1) << 4) | (dac_div - 1))
        self._wr(0x06, (self._rd(0x06) & 0xE0) | ((bclk_div - 1) if bclk_div < 19 else bclk_div))
        self._wr(0x07, (self._rd(0x07) & 0xC0) | lrck_h)
        self._wr(0x08, lrck_l)
        
        self._wr(0x09, 0x0C)
        self._wr(0x0A, 0x0C)
        self._wr(0x0D, 0x01)
        self._wr(0x0E, 0x02)
        self._wr(0x12, 0x00)
        self._wr(0x13, 0x10)
        self._wr(0x14, 0x1A)
        self._wr(0x1C, 0x6A)
        self._wr(0x37, 0x08)
        self._wr(0x31, 0x00)

        self.set_volume(volume)
        print("[ES8311] Initialized codec at %d Hz" % sample_rate)

    def set_volume(self, volume):
        """
        Sets the perceptual volume (0-100%).
        0xBF (191) is 0 dB. Exceeding 191 applies digital gain, causing clipping distortion.
        """
        reg32 = 0 if volume <= 0 else (min(volume, 100) * 191 // 100)
        self._wr(0x32, reg32)
