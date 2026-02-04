// DTC Extension - Diagnostic Trouble Codes
// Read, display, and clear DTCs from vehicle ECUs via UDS/OBD2

class DTCExtension {
  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI
    this.emit = emit
    this.state = state
    this.html = html
    this.dtcDatabase = null  // Will be loaded on first use

    // Initialize state
    if (!state.dtc) {
      state.dtc = {
        // UDS addressing (OBD2 default)
        txId: '7DF',  // Functional broadcast
        rxId: '7E8',  // ECU response
        // CAN config is loaded from device /config/can.json
        canConfig: null,
        dtcs: [],
        readiness: [],
        liveData: {},
        expandedDtc: null,
        isLoading: false,
        lastError: '',
        liveDataRunning: false
      }
    }
  }

  // === DTC Database Loading ===

  async loadDtcDatabase() {
    if (this.dtcDatabase) return this.dtcDatabase

    try {
      // Load the JSON database (relative to extension)
      const response = await fetch('./Extensions/DTC/data/dtc_codes.json')
      this.dtcDatabase = await response.json()
      console.log(`[DTC] Loaded ${Object.keys(this.dtcDatabase).length} DTC definitions`)
      return this.dtcDatabase
    } catch (e) {
      console.error('[DTC] Failed to load DTC database:', e)
      this.dtcDatabase = {}
      return {}
    }
  }

  lookupDtc(code) {
    if (!this.dtcDatabase) return { description: 'Loading...', type: '?', manufacturer: null }
    const entry = this.dtcDatabase[code.toUpperCase()]
    if (!entry) return { description: 'Unknown DTC', type: code[0], manufacturer: null }
    return {
      description: entry.d || 'No description',
      type: entry.t || code[0],
      manufacturer: entry.m || null
    }
  }

  // === DTC Code Parsing ===

  parseDtcBytes(bytes) {
    // Parse 3-byte DTC format: [high, low, status]
    // Returns code like P0300, U0100, etc.
    const high = bytes[0]
    const low = bytes[1]
    const status = bytes[2]

    // First 2 bits determine category
    const category = (high >> 6) & 0x03
    const categoryChar = ['P', 'C', 'B', 'U'][category]

    // Remaining bits form the code number
    const codeNum = ((high & 0x3F) << 8) | low
    const code = `${categoryChar}${codeNum.toString(16).toUpperCase().padStart(4, '0')}`

    return { code, status, statusText: this.parseStatusByte(status) }
  }

  parseStatusByte(status) {
    const flags = []
    if (status & 0x01) flags.push('testFailed')
    if (status & 0x02) flags.push('testFailedThisOpCycle')
    if (status & 0x04) flags.push('pendingDTC')
    if (status & 0x08) flags.push('confirmedDTC')
    if (status & 0x10) flags.push('testNotCompleteSinceLastClear')
    if (status & 0x20) flags.push('testFailedSinceLastClear')
    if (status & 0x40) flags.push('testNotCompleteThisOpCycle')
    if (status & 0x80) flags.push('warningIndicatorRequested')
    return flags
  }

  getDtcStatusType(status) {
    if (status & 0x01) return 'active'  // testFailed
    if (status & 0x04) return 'pending' // pendingDTC
    if (status & 0x08) return 'history' // confirmedDTC (but not currently failing)
    return 'history'
  }

  // === Device Communication ===

  async readDtcs() {
    this.state.dtc.isLoading = true
    this.state.dtc.lastError = ''
    this.emit('render')

    try {
      await this.loadDtcDatabase()

      const { txId, rxId } = this.state.dtc

      // Execute on device - pins from board.json, bitrate from settings
      const code = `
from lib.sys import settings
from lib.sys import board
from lib.uds_client import UDSClient, UDSTimeoutError, UDSNegativeResponseError

# Hardware pins from board.json
try:
    can_bus = board.can("can0")
    tx_pin = can_bus.tx
    rx_pin = can_bus.rx
except:
    tx_pin = None
    rx_pin = None

bitrate = settings.get("can.bitrate", 500000)

if tx_pin is None or rx_pin is None:
    print('ERROR:CAN not configured in board.json')
else:
    import CAN
    can = CAN(0, tx=tx_pin, rx=rx_pin, mode=CAN.NORMAL, bitrate=bitrate)
    client = UDSClient(can, tx_id=0x${txId}, rx_id=0x${rxId}, p2_timeout=2000)

    try:
        # Read DTCs by status mask (0xFF = all)
        response = client.read_dtc_information(0x02, 0xFF)
        print(response.hex() if response else '')
    except UDSTimeoutError:
        print('TIMEOUT')
    except UDSNegativeResponseError as e:
        print(f'NRC:{e.nrc:02X}')
    except Exception as e:
        print(f'ERROR:{e}')
    finally:
        can.deinit()
`

      const result = await this.device.execute(code)
      const output = result.trim()

      if (output === 'TIMEOUT') {
        this.state.dtc.lastError = 'No response from ECU (timeout)'
        this.state.dtc.dtcs = []
      } else if (output.startsWith('NRC:')) {
        this.state.dtc.lastError = `ECU rejected request: NRC 0x${output.slice(4)}`
        this.state.dtc.dtcs = []
      } else if (output.startsWith('ERROR:')) {
        this.state.dtc.lastError = output.slice(6)
        this.state.dtc.dtcs = []
      } else if (output) {
        // Parse response bytes
        const bytes = []
        for (let i = 0; i < output.length; i += 2) {
          bytes.push(parseInt(output.slice(i, i + 2), 16))
        }

        // Response format: 59 02 [status_mask] [DTC1 3 bytes] [DTC2 3 bytes]...
        if (bytes[0] === 0x59 && bytes.length > 3) {
          const dtcs = []
          for (let i = 3; i < bytes.length; i += 3) {
            if (i + 2 < bytes.length) {
              const parsed = this.parseDtcBytes(bytes.slice(i, i + 3))
              const dbInfo = this.lookupDtc(parsed.code)
              dtcs.push({
                ...parsed,
                ...dbInfo,
                statusType: this.getDtcStatusType(parsed.status)
              })
            }
          }
          this.state.dtc.dtcs = dtcs
        } else {
          this.state.dtc.dtcs = []
        }
      } else {
        this.state.dtc.dtcs = []
      }
    } catch (e) {
      console.error('[DTC] Read error:', e)
      this.state.dtc.lastError = e.message
      this.state.dtc.dtcs = []
    }

    this.state.dtc.isLoading = false
    this.emit('render')
  }

  async clearDtcs() {
    if (!confirm('Are you sure you want to clear all DTCs?\n\nThis will also reset the Check Engine Light.')) {
      return
    }

    this.state.dtc.isLoading = true
    this.emit('render')

    try {
      const { txId, rxId } = this.state.dtc

      const code = `
from lib.sys import settings
from lib.sys import board
from lib.uds_client import UDSClient, UDSTimeoutError, UDSNegativeResponseError

# Hardware pins from board.json
try:
    can_bus = board.can("can0")
    tx_pin = can_bus.tx
    rx_pin = can_bus.rx
except:
    tx_pin = None
    rx_pin = None

bitrate = settings.get("can.bitrate", 500000)

if tx_pin is None or rx_pin is None:
    print('ERROR:CAN not configured in board.json')
else:
    import CAN
    can = CAN(0, tx=tx_pin, rx=rx_pin, mode=CAN.NORMAL, bitrate=bitrate)
    client = UDSClient(can, tx_id=0x${txId}, rx_id=0x${rxId}, p2_timeout=2000)

    try:
        response = client.clear_diagnostic_information(0xFFFFFF)
        print('OK')
    except UDSTimeoutError:
        print('TIMEOUT')
    except UDSNegativeResponseError as e:
        print(f'NRC:{e.nrc:02X}')
    except Exception as e:
        print(f'ERROR:{e}')
    finally:
        can.deinit()
`

      const result = await this.device.execute(code)
      const output = result.trim()

      if (output === 'OK') {
        this.state.dtc.dtcs = []
        this.state.dtc.lastError = ''
      } else if (output === 'TIMEOUT') {
        this.state.dtc.lastError = 'Clear DTCs timed out'
      } else if (output.startsWith('NRC:')) {
        this.state.dtc.lastError = `Clear failed: NRC 0x${output.slice(4)}`
      } else {
        this.state.dtc.lastError = output
      }
    } catch (e) {
      this.state.dtc.lastError = e.message
    }

    this.state.dtc.isLoading = false
    this.emit('render')
  }

  // === Panel Renderers ===

  async loadCanConfig() {
    try {
      // Pins come from board.json (immutable hardware), prefs from settings (user choice)
      const code = `
from lib.sys import settings
from lib.sys import board
import json

# Hardware pins from board.json
try:
    can_bus = board.can("can0")
    tx_pin = can_bus.tx
    rx_pin = can_bus.rx
except:
    tx_pin = None
    rx_pin = None

# User preferences from settings
config = {
    'txPin': tx_pin,
    'rxPin': rx_pin,
    'bitrate': settings.get("can.bitrate", 500000),
    'enabled': settings.get("can.enabled", False)
}
print(json.dumps(config))
`
      const config = await this.device.execute(code)
      if (config) {
        this.state.dtc.canConfig = config
        this.emit('render')
      }
    } catch (e) {
      console.error('[DTC] Failed to load CAN config:', e)
      // Set empty config so we don't keep retrying
      this.state.dtc.canConfig = { enabled: false, bitrate: 500000 }
    }
  }

  navigateToCan() {
    // Emit event to navigate to Networks > CAN panel
    // This works because Scripto Studio exposes emit() which forwards to the store emitter
    if (typeof window !== 'undefined' && window.app && window.app.emitter) {
      window.app.emitter.emit('change-network-panel', 'can')
    } else {
      // Fallback: try using the emit function
      this.emit('change-network-panel', 'can')
    }
  }

  renderConnection() {
    const { txId, rxId, canConfig } = this.state.dtc
    
    // Load CAN config if not already loaded
    if (!canConfig) {
      this.loadCanConfig()
    }

    const bitrateKbps = canConfig?.bitrate ? (canConfig.bitrate / 1000) : '?'
    const enabled = canConfig?.enabled ? '✅ Enabled' : '⚠️ Disabled'
    const hasPins = canConfig?.txPin != null && canConfig?.rxPin != null
    const pins = hasPins ? `TX:GPIO${canConfig.txPin} RX:GPIO${canConfig.rxPin}` : '⚠️ Pins not configured'

    return this.html`
      <div class="dtc-panel">
        <h3>UDS Addressing</h3>
        
        <div class="dtc-field">
          <label>TX CAN ID (hex)</label>
          <input type="text" value="${txId}" 
            onchange=${e => { this.state.dtc.txId = e.target.value; this.emit('render') }} />
        </div>

        <div class="dtc-field">
          <label>RX CAN ID (hex)</label>
          <input type="text" value="${rxId}"
            onchange=${e => { this.state.dtc.rxId = e.target.value; this.emit('render') }} />
        </div>

        <p style="font-size: 13px; color: var(--text-secondary); margin-top: 16px;">
          <strong>Common CAN IDs:</strong><br/>
          • OBD2 Broadcast: TX=7DF, RX=7E8<br/>
          • Physical ECU: TX=7E0, RX=7E8
        </p>

        <div style="margin-top: 24px; padding: 12px; background: var(--bg-secondary); border-radius: 8px; cursor: pointer; transition: background 0.2s;"
             onclick=${() => this.navigateToCan()}
             onmouseover=${e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
             onmouseout=${e => e.currentTarget.style.background = 'var(--bg-secondary)'}>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>CAN Bus Configuration</strong>
            <span style="font-size: 12px; color: var(--scheme-primary);">→ Open</span>
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 8px;">
            ${enabled} • ${bitrateKbps} kbps • ${pins}
          </div>
        </div>
      </div>
    `
  }

  renderDtcs() {
    const { dtcs, isLoading, lastError, expandedDtc } = this.state.dtc

    const activeCnt = dtcs.filter(d => d.statusType === 'active').length
    const historyCnt = dtcs.filter(d => d.statusType === 'history').length
    const pendingCnt = dtcs.filter(d => d.statusType === 'pending').length

    return this.html`
      <div class="dtc-panel">
        <div class="dtc-header">
          <h3>Diagnostic Trouble Codes</h3>
          <div style="display: flex; gap: 8px;">
            <button class="dtc-button primary" onclick=${() => this.readDtcs()} disabled=${isLoading}>
              ${isLoading ? '⏳ Reading...' : '⟳ Read DTCs'}
            </button>
            <button class="dtc-button danger" onclick=${() => this.clearDtcs()} disabled=${isLoading || dtcs.length === 0}>
              🗑 Clear All
            </button>
          </div>
        </div>

        ${lastError ? this.html`<div style="color: #ef4444; margin-bottom: 12px;">⚠️ ${lastError}</div>` : ''}

        ${dtcs.length > 0 ? this.html`
          <div class="dtc-summary">
            <span class="dtc-summary-item dtc-active">● ${activeCnt} Active</span>
            <span class="dtc-summary-item dtc-history">○ ${historyCnt} History</span>
            <span class="dtc-summary-item dtc-pending">◐ ${pendingCnt} Pending</span>
          </div>

          <table class="dtc-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Code</th>
                <th>System</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${dtcs.map(dtc => this.html`
                <tr class="${expandedDtc === dtc.code ? 'expanded' : ''}" 
                    onclick=${() => { this.state.dtc.expandedDtc = expandedDtc === dtc.code ? null : dtc.code; this.emit('render') }}>
                  <td>
                    <span class="dtc-status ${dtc.statusType}">
                      ${dtc.statusType === 'active' ? '●' : dtc.statusType === 'pending' ? '◐' : '○'}
                      ${dtc.statusType.charAt(0).toUpperCase() + dtc.statusType.slice(1)}
                    </span>
                  </td>
                  <td><strong>${dtc.code}</strong></td>
                  <td>${this.getSystemName(dtc.type)}</td>
                  <td>${dtc.description}</td>
                </tr>
                ${expandedDtc === dtc.code ? this.html`
                  <tr>
                    <td colspan="4">
                      <div class="dtc-details">
                        <div class="dtc-details-grid">
                          <span class="dtc-details-label">Code:</span>
                          <span>${dtc.code}</span>
                          <span class="dtc-details-label">Status Byte:</span>
                          <span>0x${dtc.status.toString(16).toUpperCase().padStart(2, '0')}</span>
                          <span class="dtc-details-label">Flags:</span>
                          <span>${dtc.statusText.join(' | ') || 'None'}</span>
                          <span class="dtc-details-label">Manufacturer:</span>
                          <span>${dtc.manufacturer || 'Generic OBD-II'}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ` : ''}
              `)}
            </tbody>
          </table>
        ` : this.html`
          <div class="dtc-empty">
            <div class="dtc-empty-icon">✅</div>
            <p>No DTCs stored</p>
            <p style="font-size: 13px;">Click "Read DTCs" to scan for trouble codes</p>
          </div>
        `}
      </div>
    `
  }

  getSystemName(type) {
    const systems = { P: 'Powertrain', B: 'Body', C: 'Chassis', U: 'Network' }
    return systems[type] || type
  }

  renderReadiness() {
    return this.html`
      <div class="dtc-panel">
        <div class="dtc-header">
          <h3>Emissions Readiness (I/M Monitors)</h3>
          <button class="dtc-button primary" onclick=${() => this.readReadiness()}>⟳ Refresh</button>
        </div>
        
        <div class="dtc-empty">
          <div class="dtc-empty-icon">📋</div>
          <p>Readiness monitor status</p>
          <p style="font-size: 13px;">Click Refresh to check emissions system readiness</p>
        </div>
      </div>
    `
  }

  renderLiveData() {
    const { liveData, liveDataRunning } = this.state.dtc

    return this.html`
      <div class="dtc-panel">
        <div class="dtc-header">
          <h3>Live Data</h3>
          <div style="display: flex; gap: 8px;">
            <button class="dtc-button primary" onclick=${() => this.toggleLiveData()}>
              ${liveDataRunning ? '⏹ Stop' : '▶ Start'}
            </button>
          </div>
        </div>

        <div class="dtc-live-grid">
          ${Object.keys(liveData).length > 0 ? Object.entries(liveData).map(([name, data]) => this.html`
            <div class="dtc-live-card">
              <div class="dtc-live-name">${name}</div>
              <div class="dtc-live-value">${data.value}</div>
              <div class="dtc-live-unit">${data.unit}</div>
            </div>
          `) : this.html`
            <div class="dtc-empty" style="grid-column: 1 / -1;">
              <div class="dtc-empty-icon">📊</div>
              <p>No live data yet</p>
              <p style="font-size: 13px;">Click Start to begin reading OBD2 PIDs</p>
            </div>
          `}
        </div>
      </div>
    `
  }

  renderService() {
    return this.html`
      <div class="dtc-panel">
        <h3>Service Builder (Advanced)</h3>
        
        <div class="dtc-field">
          <label>Service ID</label>
          <select id="dtc-service-select">
            <option value="22">0x22 - ReadDataByIdentifier</option>
            <option value="19">0x19 - ReadDTCInformation</option>
            <option value="14">0x14 - ClearDiagnosticInformation</option>
            <option value="10">0x10 - DiagnosticSessionControl</option>
            <option value="3E">0x3E - TesterPresent</option>
          </select>
        </div>

        <div class="dtc-field">
          <label>Request Data (hex)</label>
          <input type="text" id="dtc-request-input" placeholder="e.g., F1 90 for VIN" />
        </div>

        <button class="dtc-button primary" onclick=${() => this.sendRawService()}>Send Request</button>

        <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px; font-family: monospace; font-size: 13px;">
          <strong>Response:</strong><br/>
          <span id="dtc-response-output">—</span>
        </div>
      </div>
    `
  }

  // === Lifecycle ===

  async onMount(panelId) {
    // Load database on first panel mount
    await this.loadDtcDatabase()
  }

  render(panelId) {
    switch (panelId) {
      case 'connection': return this.renderConnection()
      case 'dtcs': return this.renderDtcs()
      case 'readiness': return this.renderReadiness()
      case 'livedata': return this.renderLivedata()
      case 'service': return this.renderService()
      default: return this.html`<div>Unknown panel: ${panelId}</div>`
    }
  }

  // Alias for livedata panel (Scripto Studio looks for renderLivedata)
  renderLivedata() {
    return this.renderLiveData()
  }
}

export default DTCExtension
