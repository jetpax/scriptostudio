/**
 * OVMS Extension
 * Pushes vehicle metrics to an OVMS v2 server for remote monitoring.
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
        isLoading: false,
        configLoaded: false
      }
    }
  }

  /**
   * Install device files to the device.
   * Uses this.deviceFiles which is injected by the loader.
   */
  async onInstall() {
    if (!this.state.isConnected) return false
    
    console.log('[OVMS] Installing device files...')
    
    try {
      // Create /lib/ext package if it doesn't exist (enables lib.ext.X imports)
      await this.device.mkdir('/lib/ext')
      await this.device.saveFile('/lib/ext/__init__.py', '# Extension packages\n')
      
      // Create extension directories
      await this.device.mkdir('/lib/ext/ovms')
      await this.device.mkdir('/lib/ext/ovms/vehicles')
      await this.device.mkdir('/lib/ext/ovms/vehicles/zombie_vcu')
      await this.device.mkdir('/lib/ext/ovms/vehicles/obdii')
      await this.device.mkdir('/lib/ext/ovms/vehicles/tesla_model3')
      await this.device.mkdir('/lib/ext/ovms/vehicles/headless_zombie')
      
      // Write all device files from the bundle
      for (const [targetPath, content] of Object.entries(this.deviceFiles)) {
        const filename = targetPath.split('/').pop()
        console.log(`[OVMS] Writing ${filename}...`)
        await this.device.saveFile(targetPath, content)
      }
      
      console.log('[OVMS] Installation complete! Device may need restart to use extension.')
      return true
    } catch (e) {
      console.error('[OVMS] Installation failed:', e)
      return false
    }
  }

  // === Helper Methods for OVMS_helpers.py ===

  async getOVMSConfig() {
    // Prevent multiple simultaneous loads
    if (this.state.ovms.isLoading) {
      console.log('[OVMS] Config already loading, skipping')
      return this.state.ovms.config || {}
    }

    try {
      this.state.ovms.isLoading = true
      
      // Load config from settings module via helper function
      try {
        const result = await this.device.execute('from lib.ext.ovms.OVMS_helpers import getOVMSConfig; getOVMSConfig()')
        const parsed = this.device.parseJSON(result)
        if (parsed && typeof parsed === 'object') {
          this.state.ovms.config = parsed
        }
      } catch (e) {
        // Config not available yet, use defaults
        console.log('[OVMS] Config not available, using defaults')
      }
      
      // Get available vehicle types
      try {
        const result = await this.device.execute('from lib.ext.ovms.vehicle import list_vehicles; import json; print(json.dumps(list_vehicles()))')
        const vehicles = this.device.parseJSON(result)
        this.state.ovms.config.available_vehicles = vehicles
      } catch (e) {
        // Fallback if vehicle module not available
        this.state.ovms.config.available_vehicles = {'zombie_vcu': 'ZombieVerter VCU'}
      }
      
      this.state.ovms.configLoaded = true
      this.state.ovms.isLoading = false
      this.emit('render')
      return this.state.ovms.config || {}
    } catch (e) {
      console.error('[OVMS] Error getting config:', e)
      this.state.ovms.isLoading = false
      this.state.ovms.configLoaded = true
      return this.state.ovms.config || {}
    }
  }

  async setOVMSConfig(config) {
    try {
      // Use helper function to save via settings module
      const result = await this.device.execute(`from lib.ext.ovms.OVMS_helpers import setOVMSConfig; setOVMSConfig(${JSON.stringify(config)})`)
      const parsed = this.device.parseJSON(result)
      
      // Update local state
      this.state.ovms.config = config
      this.emit('render')
      return parsed || { success: true }
    } catch (e) {
      console.error('[OVMS] Error setting config:', e)
      return { error: e.message }
    }
  }

  async getOVMSMetrics() {
    try {
      const result = await this.device.execute('from lib.ext.ovms.OVMS_helpers import getOVMSMetrics; getOVMSMetrics()')
      const parsed = this.device.parseJSON(result)
      if (parsed && typeof parsed === 'object') {
        this.state.ovms.metrics = parsed
        this.emit('render')
      }
      return parsed || {}
    } catch (e) {
      console.error('[OVMS] Error getting metrics:', e)
      return {}
    }
  }

  async getOVMSStatus() {
    try {
      const result = await this.device.execute('from lib.ext.ovms.OVMS_helpers import getOVMSStatus; getOVMSStatus()')
      const parsed = this.device.parseJSON(result)
      if (parsed && typeof parsed === 'object') {
        this.state.ovms.status = parsed
        this.emit('render')
      }
      return parsed || {}
    } catch (e) {
      console.error('[OVMS] Error getting status:', e)
      return {}
    }
  }

  async startOVMS() {
    try {
      this.state.ovms.isLoading = true
      this.emit('render')
      const result = await this.device.execute('from lib.ext.ovms.OVMS_helpers import startOVMS; startOVMS()')
      const parsed = this.device.parseJSON(result)
      await this.getOVMSStatus()
      this.state.ovms.isLoading = false
      this.emit('render')
      return parsed || {}
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
      const result = await this.device.execute('from lib.ext.ovms.OVMS_helpers import stopOVMS; stopOVMS()')
      const parsed = this.device.parseJSON(result)
      await this.getOVMSStatus()
      this.state.ovms.isLoading = false
      this.emit('render')
      return parsed || {}
    } catch (e) {
      console.error('[OVMS] Error stopping:', e)
      this.state.ovms.isLoading = false
      this.emit('render')
      return { error: e.message }
    }
  }

  async testOVMSConnectivity() {
    try {
      this.state.ovms.isLoading = true
      this.emit('render')
      
      // Save config first to ensure server address is saved
      await this.setOVMSConfig(this.state.ovms.config)
      
      const result = await this.device.execute('from lib.ext.ovms.OVMS_helpers import testOVMSConnectivity; testOVMSConnectivity()')
      const parsed = this.device.parseJSON(result)
      
      this.state.ovms.isLoading = false
      this.emit('render')
      
      if (parsed && parsed.success) {
        alert(`✓ ${parsed.message || 'Connection test successful'}`)
      } else {
        alert(`✗ ${parsed.error || 'Connection test failed'}`)
      }
      
      return parsed || {}
    } catch (e) {
      console.error('[OVMS] Error testing connectivity:', e)
      this.state.ovms.isLoading = false
      this.emit('render')
      alert(`✗ Connection test error: ${e.message}`)
      return { error: e.message }
    }
  }

  // === Panel Renderers ===

  renderConfig() {
    // Load config if needed (config is empty or hasn't been loaded yet)
    const needsLoad = !this.state.ovms.config.server && !this.state.ovms.isLoading && this.state.isConnected
    
    if (needsLoad) {
      setTimeout(() => {
        this.getOVMSConfig().catch(err => {
          console.error('[OVMS] getOVMSConfig() error:', err);
        });
      }, 0)
    }
    
    // Auto-refresh status periodically
    if (this.state.isConnected && !this.state.ovms.isLoading) {
      const now = Date.now()
      if (!this.state.ovms.lastStatusRefresh || (now - this.state.ovms.lastStatusRefresh) > 2000) {
        setTimeout(() => {
          this.getOVMSStatus()
          this.state.ovms.lastStatusRefresh = Date.now()
        }, 0)
      }
    }

    const config = this.state.ovms.config
    const status = this.state.ovms.status || {}
    const isOVMSConnected = status.state === 'connected'

    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>OVMS Configuration</h2>
          <div style="display: flex; gap: 8px;">
            <button 
              class="ovms-button ${isOVMSConnected ? 'disconnect' : 'connect'}"
              onclick=${() => isOVMSConnected ? this.stopOVMS() : this.startOVMS()}
              disabled=${!this.state.isConnected || this.state.ovms.isLoading || !config.enabled}
              style="min-width: 120px;"
            >
              ${isOVMSConnected ? 'Disconnect' : 'Connect'}
            </button>
            <button 
              class="ovms-button"
              onclick=${() => this.saveConfig()}
              disabled=${!this.state.isConnected || this.state.ovms.isLoading}
              style="min-width: 120px;"
            >
              Save
            </button>
            <button 
              class="ovms-button secondary"
              onclick=${() => this.testOVMSConnectivity()}
              disabled=${!this.state.isConnected || this.state.ovms.isLoading || !config.server || !config.vehicleid || !config.password}
              title="Test connection to OVMS server"
            >
              Test Connection
            </button>
          </div>
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

          <div class="ovms-field">
            <label>Vehicle Type</label>
            <select 
              value="${config.vehicle_type || 'zombie_vcu'}"
              onchange=${(e) => this.handleConfigChange('vehicle_type', e.target.value)}
              disabled=${!this.state.isConnected}
            >
              ${config.available_vehicles ? Object.entries(config.available_vehicles).map(([id, name]) => this.html`
                <option value="${id}" ${config.vehicle_type === id ? 'selected' : ''}>${name}</option>
              `) : this.html`
                <option value="zombie_vcu" ${config.vehicle_type === 'zombie_vcu' ? 'selected' : ''}>ZombieVerter VCU</option>
              `}
            </select>
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
    try {
      this.state.ovms.isLoading = true
      this.emit('render')
      
      // If OVMS is being disabled, stop the service first
      if (!this.state.ovms.config.enabled) {
        try {
          await this.stopOVMS()
        } catch (e) {
          console.warn('[OVMS] Error stopping service:', e)
        }
      }
      
      const result = await this.setOVMSConfig(this.state.ovms.config)
      
      this.state.ovms.isLoading = false
      
      if (result.success) {
        // Show success message
        alert('✓ Configuration saved successfully!')
      } else {
        // Show error message
        alert('✗ Failed to save configuration: ' + (result.error || 'Unknown error'))
      }
      
      this.emit('render')
    } catch (e) {
      this.state.ovms.isLoading = false
      alert('✗ Failed to save configuration: ' + e.message)
      this.emit('render')
    }
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

export { OVMSExtension as default }
