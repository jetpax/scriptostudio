// === START_EXTENSION_CONFIG ===
// {
//   "name": "GVRET",
//   "id": "gvret-manager",
//   "version": [1, 2, 0],
//   "author": "JetPax",
//   "description": "Manage GVRET on MicroPython with mpDirect (CAN over TCP)",
//   "icon": "radio",
//   "menu": [
//     { "id": "connection", "label": "Connection", "icon": "radio" },
//     { "id": "filters", "label": "Filters", "icon": "filter" }
//   ],
//   "styles": ".gvret-container { padding: 20px; } .gvret-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 20px; } .gvret-card h3 { margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; } .gvret-form-row { display: flex; gap: 16px; margin-bottom: 12px; align-items: center; } .gvret-form-row label { width: 100px; } .gvret-input { padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); } .gvret-btn { padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; } .gvret-btn-primary { background: var(--scheme-primary); color: white; } .gvret-btn-danger { background: #ef4444; color: white; } .gvret-filter-list { display: flex; flex-direction: column; gap: 8px; } .gvret-filter-item { display: flex; gap: 12px; padding: 8px; background: var(--bg-primary); border-radius: 4px; align-items: center; } .gvret-stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; } .gvret-stat-card { background: var(--bg-primary); padding: 12px; border-radius: 4px; text-align: center; } .gvret-stat-value { font-size: 24px; font-weight: bold; color: var(--scheme-primary); } .gvret-stat-label { font-size: 12px; color: var(--text-secondary); }"
// }
// === END_EXTENSION_CONFIG ===

class GVRETExtension {
  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI
    this.emit = emit
    this.state = state
    this.html = html
    
    // Initialize state
    if (!this.state.gvret) {
      this.state.gvret = {
        isRunning: false,
        filters: [],
        stats: { rx: 0, tx: 0, dropped: 0 }
      }
    }
  }

  // === Connection Panel (Combined with Statistics) ===
  renderConnection() {
    const s = this.state.gvret
    
    return this.html`
      <div class="gvret-container">
        <div class="gvret-card">
          <h3>GVRET Configuration</h3>
          
          <div class="gvret-form-row" style="margin-top: 20px;">
            ${!s.isRunning ? this.html`
              <button class="gvret-btn gvret-btn-primary" onclick=${() => this.startGVRET()}>
                Start GVRET
              </button>
            ` : this.html`
              <button class="gvret-btn gvret-btn-danger" onclick=${() => this.stopGVRET()}>
                Stop GVRET
              </button>
            `}
          </div>
          
          <div style="margin-top: 16px; font-size: 14px; color: var(--text-secondary);">
            <p>Status: <strong>${s.isRunning ? 'Running (Port 23)' : 'Stopped'}</strong></p>
            ${s.isRunning ? this.html`<p>Connect SavvyCAN to IP: <strong>${this.device.ip || 'Device IP'}</strong> Port: <strong>23</strong></p>` : ''}
            <p style="margin-top: 8px; font-size: 12px;">Using system CAN configuration (pins and bitrate configured in Networks → CAN)</p>
          </div>
        </div>

        <div class="gvret-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
             <h3>Statistics</h3>
             <button class="gvret-btn" onclick=${() => this.refreshStats()}>Refresh</button>
          </div>
         
          <div class="gvret-stat-grid">
            <div class="gvret-stat-card">
              <div class="gvret-stat-value">${s.stats.rx}</div>
              <div class="gvret-stat-label">RX Frames</div>
            </div>
            <div class="gvret-stat-card">
              <div class="gvret-stat-value">${s.stats.tx}</div>
              <div class="gvret-stat-label">TX Frames</div>
            </div>
            <div class="gvret-stat-card">
              <div class="gvret-stat-value">${s.stats.dropped}</div>
              <div class="gvret-stat-label">Dropped</div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  // === Filters Panel ===
  renderFilters() {
    const s = this.state.gvret
    
    return this.html`
      <div class="gvret-container">
        <div class="gvret-card">
          <h3>Add Filter</h3>
          <div class="gvret-form-row">
            <input type="text" class="gvret-input" placeholder="ID (hex)" id="filter-id-input" />
            <input type="text" class="gvret-input" placeholder="Mask (hex)" value="7FF" id="filter-mask-input" />
            <label style="width: auto;">
              <input type="checkbox" id="filter-ext-input" /> Ext
            </label>
            <button class="gvret-btn gvret-btn-primary" onclick=${() => this.addFilterUI()}>Add</button>
          </div>
        </div>

        <div class="gvret-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; border: none;">Active Filters</h3>
            <button class="gvret-btn gvret-btn-danger" style="padding: 4px 8px; font-size: 12px;" onclick=${() => this.clearFilters()}>Clear All</button>
          </div>
          
          <div class="gvret-filter-list">
            ${s.filters.length === 0 ? this.html`<div style="color: var(--text-secondary); font-style: italic;">No filters active (Accept All)</div>` : ''}
            ${s.filters.map((f, idx) => this.html`
              <div class="gvret-filter-item">
                <div style="font-family: monospace; font-weight: bold;">ID: 0x${f.id.toString(16).toUpperCase()}</div>
                <div style="font-family: monospace; color: var(--text-secondary);">Mask: 0x${f.mask.toString(16).toUpperCase()}</div>
                <div style="font-size: 12px; background: ${f.extended ? '#3b82f6' : '#10b981'}; color: white; padding: 2px 6px; border-radius: 4px;">${f.extended ? 'EXT' : 'STD'}</div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `
  }


  // === Actions ===

  async startGVRET() {
    const s = this.state.gvret
    try {
      // Ensure CAN is initialized using generic helper functions
      const result = await this.device.execute(`
from lib.can_helpers import ensure_can_initialized, check_can_available, get_can_device
import gvret

# Check if CAN is available
available, reason = check_can_available()
if not available:
    raise RuntimeError(reason)

# Ensure CAN is initialized (auto-enables if needed)
can_dev = ensure_can_initialized()
if can_dev is None:
    raise RuntimeError('CAN device is None after initialization')

# Get CAN config for GVRET start
import json
import os
config_dir = '/config'
if not os.path.exists(config_dir):
    config_dir = '/store/config'
config_file = config_dir + '/can.json'

try:
    with open(config_file, 'r') as f:
        config = json.load(f)
    tx_pin = config.get('txPin', 5)
    rx_pin = config.get('rxPin', 4)
    bitrate = config.get('bitrate', 500000)
except:
    # Fallback to main.py or defaults
    try:
        import sys
        sys.path.insert(0, '/device scripts')
        from main import CAN_TX_PIN, CAN_RX_PIN, CAN_BITRATE
        tx_pin = CAN_TX_PIN
        rx_pin = CAN_RX_PIN
        bitrate = CAN_BITRATE
    except:
        tx_pin = 5
        rx_pin = 4
        bitrate = 500000

# Register callback for bitrate changes from SavvyCAN
def on_bitrate_change(new_bitrate):
    from lib.can_helpers import reconfigure_can_bitrate
    reconfigure_can_bitrate(new_bitrate)

gvret.set_bitrate_change_callback(on_bitrate_change)

# Start GVRET
if not gvret.start(tx_pin, rx_pin, bitrate):
    raise RuntimeError('GVRET start failed')
      `)
      
      // Check for errors in result (RuntimeError will be in traceback)
      if (result.includes('RuntimeError') || result.includes('Traceback')) {
        const errorMatch = result.match(/RuntimeError: (.+)/) || result.match(/Error: (.+)/)
        const errorMsg = errorMatch ? errorMatch[1] : 'Failed to start GVRET'
        alert(`Failed to start GVRET: ${errorMsg}`)
        return
      }
      
      s.isRunning = true
      this.emit('render')
      
      // Re-apply filters if any
      if (s.filters.length > 0) {
        await this.applyFilters()
      }
    } catch (e) {
      alert('Failed to start GVRET: ' + e.message)
    }
  }

  async stopGVRET() {
    try {
      await this.device.execute(`
import gvret
gvret.stop()
      `)
      this.state.gvret.isRunning = false
      this.emit('render')
    } catch (e) {
      alert('Failed to stop GVRET: ' + e.message)
    }
  }

  addFilterUI() {
    const idInput = document.getElementById('filter-id-input')
    const maskInput = document.getElementById('filter-mask-input')
    const extInput = document.getElementById('filter-ext-input')
    
    if (!idInput || !maskInput) return

    const id = parseInt(idInput.value, 16)
    const mask = parseInt(maskInput.value, 16)
    const extended = extInput.checked

    if (isNaN(id) || isNaN(mask)) {
      alert('Invalid ID or Mask (Hex required)')
      return
    }

    this.state.gvret.filters.push({ id, mask, extended })
    this.applyFilters() // Apply immediately
    
    idInput.value = ''
    this.emit('render')
  }

  async clearFilters() {
    this.state.gvret.filters = []
    try {
      await this.device.execute('import gvret; gvret.clear_filters()')
      this.emit('render')
    } catch (e) {
      console.error('Failed to clear filters', e)
    }
  }

  async applyFilters() {
    const s = this.state.gvret
    if (!s.isRunning) return

    try {
      let code = 'import gvret\ngvret.clear_filters()\n'
      for (const f of s.filters) {
        code += `gvret.add_filter(${f.id}, ${f.mask}, ${f.extended ? 'True' : 'False'})\n`
      }
      await this.device.execute(code)
    } catch (e) {
      console.error('Failed to apply filters', e)
    }
  }

  async refreshStats() {
    // TODO: Implement stats reading when C module supports it
    // For now, just mock or read if available
    /*
    const res = await this.device.execute('import gvret; return gvret.get_stats()')
    */
    alert('Stats not yet implemented in firmware')
  }
}
