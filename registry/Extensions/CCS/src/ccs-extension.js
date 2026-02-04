/**
 * CCS Extension - CCS/NACS DC Fast Charging EVSE Emulator
 * 
 * Enables ESP32-P4 to act as a CCS/NACS charger to:
 * 1. Complete SLAC handshake with electric vehicle
 * 2. Perform V2G negotiation (DIN 70121)
 * 3. Simulate PreCharge to trigger contactor closure
 * 
 * Hardware: ESP32-P4 + TP-Link TL-PA4010P + CCS/NACS connector
 */

class CCSExtension {
  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI
    this.emit = emit
    this.state = state
    this.html = html

    // Initialize state
    if (!state.ccs) {
      state.ccs = {
        config: {
          cpPin: 4,
          autoStart: false,
        },
        status: {
          enabled: false,
          slacState: 'IDLE',
          v2gState: 'IDLE',
          carMac: null,
          sessionId: null,
        },
        v2g: {
          soc: null,
          targetVoltage: null,
          targetCurrent: null,
          evseVoltage: 0,
          contactorsClosed: false,
        },
        modem: null,
      }
    }

    // Status refresh interval
    this.statusInterval = null
  }

  /**
   * Install device files to the device.
   * Uses this.deviceFiles which is injected by the loader.
   */
  async onInstall() {
    if (!this.state.isConnected) return false
    
    console.log('[CCS] Installing device files...')
    
    try {
      // Create directories
      await this.device.mkdir('/lib/ext/ccs')
      
      // Write all device files from the bundle
      for (const [targetPath, content] of Object.entries(this.deviceFiles)) {
        const filename = targetPath.split('/').pop()
        console.log(`[CCS] Writing ${filename}...`)
        await this.device.saveFile(targetPath, content)
      }
      
      console.log('[CCS] Installation complete! Device may need restart to use extension.')
      return true
    } catch (e) {
      console.error('[CCS] Installation failed:', e)
      return false
    }
  }

  // ===== Device API Calls =====

  async getModemInfo() {
    try {
      const result = await this.device.exec('import plc; print(plc.get_modem_info())')
      if (result && result !== 'None') {
        const info = JSON.parse(result.replace(/'/g, '"'))
        this.state.ccs.modem = info
        return info
      }
      return null
    } catch (e) {
      console.error('getModemInfo error:', e)
      return null
    }
  }

  async getStatus() {
    try {
      const result = await this.device.exec('import plc; import json; print(json.dumps(plc.get_status()))')
      if (result) {
        const status = JSON.parse(result)
        this.state.ccs.status.enabled = status.enabled
        this.state.ccs.status.slacState = status.state
        this.state.ccs.status.carMac = status.car_mac || null
        return status
      }
    } catch (e) {
      console.error('getStatus error:', e)
    }
    return null
  }

  async startCCS() {
    try {
      // Start CP PWM
      const cpPin = this.state.ccs.config.cpPin
      await this.device.exec(`
from machine import PWM, Pin
import plc
import os

# Start CP PWM at 5%
cp = PWM(Pin(${cpPin}), freq=1000, duty_u16=int(65535 * 0.05))

# Generate NID/NMK
nid = os.urandom(7)
nmk = os.urandom(16)
plc.set_key(nid, nmk)

# Start EVSE mode
result = plc.start_evse()
print(result)
`)
      
      this.state.ccs.status.enabled = true
      this.emit('extensionEvent', { type: 'ccs_started' })
      return { success: true }
    } catch (e) {
      console.error('startCCS error:', e)
      return { success: false, error: e.message }
    }
  }

  async stopCCS() {
    try {
      await this.device.exec(`
import plc
from machine import PWM, Pin

# Stop SLAC
plc.stop()

# Stop CP PWM
try:
    cp = PWM(Pin(${this.state.ccs.config.cpPin}))
    cp.deinit()
except:
    pass

print('stopped')
`)
      
      this.state.ccs.status.enabled = false
      this.state.ccs.status.slacState = 'IDLE'
      this.emit('extensionEvent', { type: 'ccs_stopped' })
      return { success: true }
    } catch (e) {
      console.error('stopCCS error:', e)
      return { success: false, error: e.message }
    }
  }

  async getV2GSession() {
    try {
      const result = await this.device.exec(`
from lib.ext.ccs.CCS_helpers import getV2GSession
print(getV2GSession())
`)
      if (result) {
        return JSON.parse(result)
      }
    } catch (e) {
      console.error('getV2GSession error:', e)
    }
    return null
  }

  // ===== Rendering =====

  renderConfig() {
    const config = this.state.ccs.config
    const modem = this.state.ccs.modem

    return this.html`
      <div class="panel">
        <h3>⚡ CCS/NACS Configuration</h3>
        
        <div class="section">
          <h4>Modem Status</h4>
          ${modem ? this.html`
            <div class="info-row">
              <span class="label">MAC:</span>
              <span class="value">${modem.mac || 'Unknown'}</span>
            </div>
            <div class="info-row">
              <span class="label">Firmware:</span>
              <span class="value">${modem.firmware ? modem.firmware.substring(0, 32) + '...' : 'Unknown'}</span>
            </div>
          ` : this.html`
            <div class="warning">Modem not detected</div>
          `}
          <button onclick=${() => this.getModemInfo().then(() => this.emit('render'))}>
            🔄 Refresh Modem
          </button>
        </div>

        <div class="section">
          <h4>Hardware Settings</h4>
          <div class="form-row">
            <label>CP PWM GPIO Pin:</label>
            <input type="number" 
                   value=${config.cpPin} 
                   onchange=${(e) => {
                     this.state.ccs.config.cpPin = parseInt(e.target.value)
                   }}
                   min="0" max="48" />
          </div>
          <div class="form-row">
            <label>
              <input type="checkbox" 
                     checked=${config.autoStart}
                     onchange=${(e) => {
                       this.state.ccs.config.autoStart = e.target.checked
                     }} />
              Auto-start on boot
            </label>
          </div>
        </div>

        <div class="section">
          <h4>Control</h4>
          <div class="button-row">
            ${this.state.ccs.status.enabled ? this.html`
              <button class="danger" onclick=${() => this.stopCCS().then(() => this.emit('render'))}>
                ⏹️ Stop CCS
              </button>
            ` : this.html`
              <button class="primary" onclick=${() => this.startCCS().then(() => this.emit('render'))}>
                ▶️ Start CCS
              </button>
            `}
          </div>
        </div>
      </div>
    `
  }

  renderStatus() {
    const status = this.state.ccs.status
    const v2g = this.state.ccs.v2g

    const slacStateColors = {
      'IDLE': '#888',
      'WAIT_PARAM_REQ': '#ff9800',
      'WAIT_ATTEN_CHAR': '#ff9800',
      'WAIT_MATCH_REQ': '#ff9800',
      'MATCHED': '#4caf50',
      'ERROR': '#f44336',
    }

    return this.html`
      <div class="panel">
        <h3>📊 CCS Status</h3>

        <div class="status-grid">
          <div class="status-card">
            <div class="status-label">SLAC State</div>
            <div class="status-value" style="color: ${slacStateColors[status.slacState] || '#888'}">
              ${status.slacState}
            </div>
          </div>

          <div class="status-card">
            <div class="status-label">V2G State</div>
            <div class="status-value">${status.v2gState}</div>
          </div>

          <div class="status-card">
            <div class="status-label">Car MAC</div>
            <div class="status-value mono">${status.carMac || '—'}</div>
          </div>

          <div class="status-card">
            <div class="status-label">Contactors</div>
            <div class="status-value ${v2g.contactorsClosed ? 'success' : ''}">
              ${v2g.contactorsClosed ? '🟢 CLOSED' : '⚪ OPEN'}
            </div>
          </div>
        </div>

        ${status.slacState === 'MATCHED' ? this.html`
          <div class="section success-banner">
            <h4>🎉 SLAC Complete!</h4>
            <p>Vehicle connected. Ready for V2G session.</p>
          </div>
        ` : ''}

        ${v2g.contactorsClosed ? this.html`
          <div class="section success-banner highlight">
            <h4>⚡ Contactors Closed!</h4>
            <p>Battery voltage now available on CCS pins.</p>
          </div>
        ` : ''}

        <div class="section">
          <button onclick=${() => this.getStatus().then(() => this.emit('render'))}>
            🔄 Refresh Status
          </button>
        </div>
      </div>
    `
  }

  renderV2G() {
    const v2g = this.state.ccs.v2g
    const status = this.state.ccs.status

    return this.html`
      <div class="panel">
        <h3>🔌 V2G Session</h3>

        ${status.slacState !== 'MATCHED' ? this.html`
          <div class="section warning">
            <p>⏳ Waiting for SLAC to complete...</p>
            <p class="hint">Connect vehicle to CCS port and ensure CP is at 5% PWM.</p>
          </div>
        ` : this.html`
          <div class="v2g-grid">
            <div class="v2g-card">
              <div class="v2g-label">Session ID</div>
              <div class="v2g-value mono">${status.sessionId || '—'}</div>
            </div>

            <div class="v2g-card">
              <div class="v2g-label">Vehicle SOC</div>
              <div class="v2g-value">${v2g.soc !== null ? v2g.soc + '%' : '—'}</div>
            </div>

            <div class="v2g-card">
              <div class="v2g-label">Target Voltage</div>
              <div class="v2g-value">${v2g.targetVoltage !== null ? v2g.targetVoltage + 'V' : '—'}</div>
            </div>

            <div class="v2g-card">
              <div class="v2g-label">EVSE Voltage</div>
              <div class="v2g-value">${v2g.evseVoltage}V</div>
            </div>

            <div class="v2g-card">
              <div class="v2g-label">Target Current</div>
              <div class="v2g-value">${v2g.targetCurrent !== null ? v2g.targetCurrent + 'A' : '—'}</div>
            </div>

            <div class="v2g-card wide">
              <div class="v2g-label">V2G Protocol State</div>
              <div class="v2g-value">${status.v2gState}</div>
            </div>
          </div>

          <div class="section">
            <h4>PreCharge Simulation</h4>
            <p class="hint">Simulated EVSE voltage ramps toward target to trigger contactor closure.</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${v2g.targetVoltage ? (v2g.evseVoltage / v2g.targetVoltage * 100) : 0}%"></div>
            </div>
          </div>
        `}

        <div class="section">
          <button onclick=${() => this.getV2GSession().then(s => { 
            if (s) Object.assign(this.state.ccs.v2g, s)
            this.emit('render')
          })}>
            🔄 Refresh V2G
          </button>
        </div>
      </div>
    `
  }

  render(panelId) {
    // Start status polling when extension is active
    if (!this.statusInterval && this.state.ccs.status.enabled) {
      this.statusInterval = setInterval(() => {
        this.getStatus()
      }, 2000)
    }

    switch (panelId) {
      case 'config':
        return this.renderConfig()
      case 'status':
        return this.renderStatus()
      case 'v2g':
        return this.renderV2G()
      default:
        return this.renderConfig()
    }
  }
}

export default CCSExtension
