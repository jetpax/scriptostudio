// === START_EXTENSION_CONFIG ===
// {
//   "name": "OVMS",
//   "id": "ovms",
//   "version": [0, 1, 2],
//   "author": "JetPax",
//   "description": "Send OpenInverter metrics to OVMS v2 server",
//   "icon": "cloud",
//   "mipPackage": "github:jetpax/scripto-studio-registry/Extensions/OVMS/lib",
//   "menu": [
//     { "id": "config", "label": "Configuration", "icon": "settings" },
//     { "id": "metrics", "label": "Metrics", "icon": "activity" },
//     { "id": "status", "label": "Status", "icon": "info-circle" }
//   ],
//   "styles": ".ovms-section { margin-bottom: 24px; } .ovms-section h3 { font-size: 18px; font-weight: 600; color: var(--scheme-primary); margin-bottom: 12px; } .ovms-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; } .ovms-field label { font-size: 14px; font-weight: 600; color: var(--text-primary); } .ovms-field input, .ovms-field select { padding: 10px 12px; border: 2px solid var(--border-color); border-radius: 6px; background: var(--input-bg); color: var(--text-primary); font-size: 14px; } .ovms-field input:focus, .ovms-field select:focus { outline: none; border-color: var(--scheme-primary); box-shadow: 0 0 0 3px rgba(0, 129, 132, 0.2); } .ovms-button { padding: 10px 20px; border: none; border-radius: 6px; background: var(--scheme-primary); color: white; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .ovms-button:hover { opacity: 0.9; transform: translateY(-1px); } .ovms-button:disabled { opacity: 0.5; cursor: not-allowed; } .ovms-button.secondary { background: var(--bg-tertiary); color: var(--text-primary); } .ovms-metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; padding: 20px; } .ovms-metric-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; } .ovms-metric-name { font-weight: 600; color: var(--scheme-primary); font-size: 13px; margin-bottom: 8px; } .ovms-metric-value { font-size: 24px; font-weight: 700; font-family: 'Menlo', Monaco, 'Courier New', monospace; color: var(--text-primary); } .ovms-metric-unit { font-size: 12px; color: var(--text-secondary); margin-top: 4px; } .ovms-status-panel { padding: 20px; } .ovms-status-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-color); } .ovms-status-item:last-child { border-bottom: none; } .ovms-status-label { font-weight: 600; color: var(--text-primary); } .ovms-status-value { color: var(--text-secondary); } .ovms-status-value.connected { color: #4caf50; } .ovms-status-value.error { color: #f44336; }"
// }
// === END_EXTENSION_CONFIG ===

/**
 * OVMS Extension - Send OpenInverter metrics to OVMS v2 server
 * 
 * This extension queries OpenInverter modules via CAN, stores metrics,
 * and sends them to an OVMS v2 server.
 */

class OVMSExtension {
  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI
    this.emit = emit
    this.state = state
    this.html = html
    
    // Initialize state
    if (!state.ovms) {
      state.ovms = {
        config: {
          enabled: false,
          server: '',
          port: 6867,
          vehicleid: '',
          password: '',
          tls: false,
          pollinterval: 5
        },
        metrics: {},
        status: {
          state: 'disconnected',
          status: '',
          connected: false,
          metrics_count: 0,
          last_poll: 0
        },
        isLoading: false
      }
    }
  }

  // === Helper Methods for OVMS_helpers.py ===

  async getOVMSConfig() {
    try {
      const result = await this.device.execute('from lib.OVMS_helpers import getOVMSConfig; getOVMSConfig()')
      const parsed = this.device.parseJSON(result)
      if (parsed.CMD === 'OVMS-CONFIG') {
        this.state.ovms.config = parsed.ARG
        this.emit('render')
      }
      return parsed.ARG || {}
    } catch (e) {
      console.error('[OVMS] Error getting config:', e)
      return {}
    }
  }

  async setOVMSConfig(config) {
    try {
      const configStr = JSON.stringify(config)
      const result = await this.device.execute(`from lib.OVMS_helpers import setOVMSConfig; setOVMSConfig(${configStr})`)
      const parsed = this.device.parseJSON(result)
      if (parsed.CMD === 'OVMS-CONFIG-UPDATED') {
        await this.getOVMSConfig()
      }
      return parsed.ARG || {}
    } catch (e) {
      console.error('[OVMS] Error setting config:', e)
      return { error: e.message }
    }
  }

  async getOVMSMetrics() {
    try {
      const result = await this.device.execute('from lib.OVMS_helpers import getOVMSMetrics; getOVMSMetrics()')
      const parsed = this.device.parseJSON(result)
      if (parsed.CMD === 'OVMS-METRICS') {
        this.state.ovms.metrics = parsed.ARG
        this.emit('render')
      }
      return parsed.ARG || {}
    } catch (e) {
      console.error('[OVMS] Error getting metrics:', e)
      return {}
    }
  }

  async getOVMSStatus() {
    try {
      const result = await this.device.execute('from lib.OVMS_helpers import getOVMSStatus; getOVMSStatus()')
      const parsed = this.device.parseJSON(result)
      if (parsed.CMD === 'OVMS-STATUS') {
        this.state.ovms.status = parsed.ARG
        this.emit('render')
      }
      return parsed.ARG || {}
    } catch (e) {
      console.error('[OVMS] Error getting status:', e)
      return {}
    }
  }

  async startOVMS() {
    try {
      this.state.ovms.isLoading = true
      this.emit('render')
      const result = await this.device.execute('from lib.OVMS_helpers import startOVMS; startOVMS()')
      const parsed = this.device.parseJSON(result)
      await this.getOVMSStatus()
      this.state.ovms.isLoading = false
      this.emit('render')
      return parsed.ARG || {}
    } catch (e) {
      console.error('[OVMS] Error starting:', e)
      this.state.ovms.isLoading = false
      this.emit('render')
      return { error: e.message }
    }
  }

  async stopOVMS() {
    try {
      this.state.ovms.isLoading = true
      this.emit('render')
      const result = await this.device.execute('from lib.OVMS_helpers import stopOVMS; stopOVMS()')
      const parsed = this.device.parseJSON(result)
      await this.getOVMSStatus()
      this.state.ovms.isLoading = false
      this.emit('render')
      return parsed.ARG || {}
    } catch (e) {
      console.error('[OVMS] Error stopping:', e)
      this.state.ovms.isLoading = false
      this.emit('render')
      return { error: e.message }
    }
  }

  // === Panel Renderers ===

  renderConfig() {
    // Load config if not loaded
    if (!this.state.ovms.config.server && this.state.isConnected && !this.state.ovms.isLoading) {
      setTimeout(() => this.getOVMSConfig(), 0)
    }

    const config = this.state.ovms.config

    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>OVMS Configuration</h2>
        </div>
        <div class="ovms-section" style="padding: 20px;">
          <div class="ovms-field">
            <label>
              <input 
                type="checkbox" 
                checked=${config.enabled}
                onchange=${(e) => this.handleConfigChange('enabled', e.target.checked)}
              />
              Enable OVMS
            </label>
          </div>

          <div class="ovms-field">
            <label>Server Address</label>
            <input 
              type="text" 
              value="${config.server || ''}"
              placeholder="ovms.example.com"
              oninput=${(e) => this.handleConfigChange('server', e.target.value)}
              disabled=${!this.state.isConnected}
            />
          </div>

          <div class="ovms-field">
            <label>Port</label>
            <input 
              type="number" 
              value="${config.port || 6867}"
              placeholder="6867"
              oninput=${(e) => this.handleConfigChange('port', parseInt(e.target.value) || 6867)}
              disabled=${!this.state.isConnected}
            />
          </div>

          <div class="ovms-field">
            <label>Vehicle ID</label>
            <input 
              type="text" 
              value="${config.vehicleid || ''}"
              placeholder="MYVEHICLE"
              oninput=${(e) => this.handleConfigChange('vehicleid', e.target.value)}
              disabled=${!this.state.isConnected}
            />
          </div>

          <div class="ovms-field">
            <label>Password</label>
            <input 
              type="password" 
              value="${config.password || ''}"
              placeholder="Server password"
              oninput=${(e) => this.handleConfigChange('password', e.target.value)}
              disabled=${!this.state.isConnected}
            />
          </div>

          <div class="ovms-field">
            <label>
              <input 
                type="checkbox" 
                checked=${config.tls || false}
                onchange=${(e) => this.handleConfigChange('tls', e.target.checked)}
                disabled=${!this.state.isConnected}
              />
              Use TLS/SSL
            </label>
          </div>

          <div class="ovms-field">
            <label>Poll Interval (seconds)</label>
            <input 
              type="number" 
              value="${config.pollinterval || 5}"
              placeholder="5"
              min="1"
              max="60"
              oninput=${(e) => this.handleConfigChange('pollinterval', parseInt(e.target.value) || 5)}
              disabled=${!this.state.isConnected}
            />
          </div>

          <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button 
              class="ovms-button"
              onclick=${() => this.saveConfig()}
              disabled=${!this.state.isConnected || this.state.ovms.isLoading}
            >
              Save Configuration
            </button>
            <button 
              class="ovms-button secondary"
              onclick=${() => this.getOVMSConfig()}
              disabled=${!this.state.isConnected || this.state.ovms.isLoading}
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    `
  }

  renderMetrics() {
    // Refresh metrics periodically
    if (this.state.isConnected && !this.state.ovms.isLoading) {
      const now = Date.now()
      if (!this.state.ovms.lastMetricsRefresh || (now - this.state.ovms.lastMetricsRefresh) > 2000) {
        setTimeout(() => {
          this.getOVMSMetrics()
          this.state.ovms.lastMetricsRefresh = Date.now()
        }, 0)
      }
    }

    const metrics = this.state.ovms.metrics || {}

    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>Metrics</h2>
        </div>
        <div class="ovms-metrics-grid">
          ${Object.keys(metrics).length === 0 ? this.html`
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
              ${this.state.isConnected ? 'No metrics available yet. Make sure OpenInverter is connected and OVMS is started.' : 'Not connected to device.'}
            </div>
          ` : Object.entries(metrics).map(([name, data]) => this.html`
            <div class="ovms-metric-card">
              <div class="ovms-metric-name">${name}</div>
              <div class="ovms-metric-value">${typeof data.value === 'number' ? data.value.toFixed(2) : data.value}</div>
              ${data.unit ? this.html`<div class="ovms-metric-unit">${data.unit}</div>` : ''}
            </div>
          `)}
        </div>
      </div>
    `
  }

  renderStatus() {
    // Refresh status periodically
    if (this.state.isConnected && !this.state.ovms.isLoading) {
      const now = Date.now()
      if (!this.state.ovms.lastStatusRefresh || (now - this.state.ovms.lastStatusRefresh) > 2000) {
        setTimeout(() => {
          this.getOVMSStatus()
          this.state.ovms.lastStatusRefresh = Date.now()
        }, 0)
      }
    }

    const status = this.state.ovms.status || {}
    const config = this.state.ovms.config || {}

    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>Status</h2>
        </div>
        <div class="ovms-status-panel">
          <div class="ovms-status-item">
            <span class="ovms-status-label">Connection State</span>
            <span class="ovms-status-value ${status.connected ? 'connected' : status.state === 'error' ? 'error' : ''}">
              ${status.state || 'disconnected'}
            </span>
          </div>

          <div class="ovms-status-item">
            <span class="ovms-status-label">Status Message</span>
            <span class="ovms-status-value">${status.status || '-'}</span>
          </div>

          <div class="ovms-status-item">
            <span class="ovms-status-label">Metrics Count</span>
            <span class="ovms-status-value">${status.metrics_count || 0}</span>
          </div>

          <div class="ovms-status-item">
            <span class="ovms-status-label">Last Poll</span>
            <span class="ovms-status-value">
              ${status.last_poll ? new Date(status.last_poll * 1000).toLocaleTimeString() : 'Never'}
            </span>
          </div>

          <div style="margin-top: 24px; display: flex; gap: 12px;">
            <button 
              class="ovms-button"
              onclick=${() => this.startOVMS()}
              disabled=${!this.state.isConnected || !config.enabled || status.connected || this.state.ovms.isLoading}
            >
              Start OVMS
            </button>
            <button 
              class="ovms-button secondary"
              onclick=${() => this.stopOVMS()}
              disabled=${!this.state.isConnected || !status.connected || this.state.ovms.isLoading}
            >
              Stop OVMS
            </button>
            <button 
              class="ovms-button secondary"
              onclick=${() => this.getOVMSStatus()}
              disabled=${!this.state.isConnected || this.state.ovms.isLoading}
            >
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    `
  }

  // === Event Handlers ===

  handleConfigChange(key, value) {
    this.state.ovms.config[key] = value
    this.emit('render')
  }

  async saveConfig() {
    await this.setOVMSConfig(this.state.ovms.config)
  }

  // === Main Render Method ===

  render(panelId) {
    switch (panelId) {
      case 'config':
        return this.renderConfig()
      case 'metrics':
        return this.renderMetrics()
      case 'status':
        return this.renderStatus()
      default:
        return this.renderConfig()
    }
  }
}

