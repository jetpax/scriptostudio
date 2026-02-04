// GVRET Extension - High-performance CAN bus to SavvyCAN bridge
// Enables vehicle network analysis via TCP/IP

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
from lib.sys import board, settings
import gvret
import json
import twai

# Check if already running
try:
    bitrate = gvret.get_bitrate()
    if bitrate > 0:
        print(json.dumps({'success': True, 'status': 'already_running'}))
    else:
        raise ValueError('Not running')
except:
    # Not running, proceed with start
    # Get CAN pins from board configuration
    if not board.has('can'):
        print(json.dumps({'success': False, 'error': 'Board has no CAN capability'}))
    else:
        can_bus = board.can('twai')  # or 'can0' depending on board definition
        if can_bus is None:
            print(json.dumps({'success': False, 'error': 'CAN bus not defined in board.json'}))
        else:
            tx_pin = can_bus.tx
            rx_pin = can_bus.rx
            bitrate = settings.get('can.bitrate', 500000)
            
            def on_bitrate_change(new_bitrate):
                twai.deinit()
                twai.init(tx=tx_pin, rx=rx_pin, baudrate=new_bitrate)
            
            gvret.set_bitrate_change_callback(on_bitrate_change)
            
            if gvret.start(tx_pin, rx_pin, bitrate):
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

  // === Lifecycle ===
  render(panelId) {
    switch (panelId) {
      case 'connection': return this.renderConnection()
      case 'filters': return this.renderFilters()
      default: return this.html`<div>Unknown panel: ${panelId}</div>`
    }
  }
}

export default GVRETExtension
