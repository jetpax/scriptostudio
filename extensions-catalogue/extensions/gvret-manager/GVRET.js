// === START_EXTENSION_CONFIG ===
// {
//   "name": "GVRET",
//   "id": "gvret-manager",
//   "version": [1, 3, 0],
//   "author": "JetPax",
//   "description": "High-performance GVRET implementation for MicroPython. Enables SavvyCAN connection over TCP/IP (mpDirect) for vehicle network analysis.",
//   "icon": "radio",
//   "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon icon-tabler icon-tabler-topology-bus\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" stroke-width=\"2\" stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M14 10a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /><path d=\"M6 10a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /><path d=\"M22 10a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /><path d=\"M2 16h20\" /><path d=\"M4 12v4\" /><path d=\"M12 12v4\" /><path d=\"M20 12v4\" /></svg>",
//   "menu": [
//     { "id": "connection", "label": "Connection" },
//     { "id": "filters", "label": "Filters" }
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
    this.statsInterval = null  // For auto-refreshing stats
    
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
      const result = await this.device.execute(`
from lib.can_helpers import ensure_can_initialized, check_can_available, get_can_config, reconfigure_can_bitrate
import gvret
import json

# Check if already running
try:
    bitrate = gvret.get_bitrate()
    if bitrate > 0:
        print(json.dumps({'success': True, 'status': 'already_running'}))
    else:
        raise ValueError('Not running')
except:
    # Not running, proceed with start
    available, reason = check_can_available()
    if not available:
        print(json.dumps({'success': False, 'error': f'CAN not available: {reason}'}))
    else:
        can_dev = ensure_can_initialized()
        if can_dev is None:
            print(json.dumps({'success': False, 'error': 'Failed to initialize CAN'}))
        else:
            config = get_can_config()
            
            def on_bitrate_change(new_bitrate):
                reconfigure_can_bitrate(new_bitrate)
            
            gvret.set_bitrate_change_callback(on_bitrate_change)
            
            if gvret.start(config['txPin'], config['rxPin'], config['bitrate']):
                print(json.dumps({'success': True, 'status': 'started'}))
            else:
                print(json.dumps({'success': False, 'error': 'gvret.start() returned False'}))
      `)
      
      if (!result || !result.success) {
        const errorMsg = result?.error || 'Unknown error'
        console.error('[GVRET] Start failed:', result)
        alert(`Failed to start GVRET: ${errorMsg}`)
        return
      }
      
      s.isRunning = true
      s.stats = { rx: 0, tx: 0, dropped: 0 }
      this.emit('render')
      
      if (s.filters.length > 0) {
        await this.applyFilters()
      }
      
      this.startStatsRefresh()
    } catch (e) {
      console.error('[GVRET] Exception:', e)
      alert('Failed to start GVRET: ' + e.message)
    }
  }

  async stopGVRET() {
    try {
      const result = await this.device.execute(`
import gvret
import json
gvret.stop()
print(json.dumps({'success': True, 'status': 'stopped'}))
      `)
      
      if (result && result.success) {
        this.state.gvret.isRunning = false
        this.stopStatsRefresh()
        this.state.gvret.stats = { rx: 0, tx: 0, dropped: 0 }
        this.emit('render')
      }
    } catch (e) {
      console.error('[GVRET] Stop exception:', e)
    }
  }
  
  startStatsRefresh() {
    // Clear any existing interval
    this.stopStatsRefresh()
    // Refresh stats every 2 seconds
    this.statsInterval = setInterval(() => {
      if (this.state.gvret.isRunning) {
        this.refreshStats()
      }
    }, 2000)
    // Also refresh immediately
    this.refreshStats()
  }
  
  stopStatsRefresh() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval)
      this.statsInterval = null
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
      await this.device.execute(`
import gvret
import json
gvret.clear_filters()
print(json.dumps({'success': True}))
      `)
      this.emit('render')
    } catch (e) {
      console.error('[GVRET] Clear filters exception:', e)
    }
  }

  async applyFilters() {
    const s = this.state.gvret
    if (!s.isRunning) return

    try {
      let code = 'import gvret\nimport json\ngvret.clear_filters()\n'
      for (const f of s.filters) {
        code += `gvret.add_filter(${f.id}, ${f.mask}, ${f.extended ? 'True' : 'False'})\n`
      }
      code += 'print(json.dumps({"success": True}))\n'
      
      await this.device.execute(code)
    } catch (e) {
      console.error('[GVRET] Apply filters exception:', e)
    }
  }

  async refreshStats() {
    const s = this.state.gvret
    if (!s.isRunning) {
      s.stats = { rx: 0, tx: 0, dropped: 0 }
      this.emit('render')
      return
    }
    
    try {
      const result = await this.device.execute(`
import gvret
import json
stats = gvret.get_stats()
print(json.dumps({'success': True, 'rx': stats[0], 'tx': stats[1], 'dropped': stats[2]}))
      `)
      
      if (result && result.success) {
        s.stats.rx = result.rx || 0
        s.stats.tx = result.tx || 0
        s.stats.dropped = result.dropped || 0
        this.emit('render')
      }
    } catch (e) {
      const errorMsg = e.message ? e.message.toLowerCase() : String(e).toLowerCase()
      if (errorMsg.includes('not connected') || 
          errorMsg.includes('connection') && errorMsg.includes('closed') ||
          errorMsg.includes('timeout')) {
        this.stopStatsRefresh()
        return
      }
      console.error('[GVRET] Stats exception:', e)
    }
  }
}
