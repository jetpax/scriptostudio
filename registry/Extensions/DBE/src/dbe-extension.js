class DBEExtension {
  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI
    this.emit = emit
    this.state = state
    this.html = html

    // Initialize state
    if (!state.dbe) {
      state.dbe = {
        config: {
          enabled: false,
          battery_type: 'nissan_leaf',
          rs485_baudrate: 9600,
          inverter_protocol: 'pylon_can',
          poll_interval: 1000,
          available_batteries: {},
          available_inverters: {}
        },
        mqttConfig: {
          enabled: false,
          topic_prefix: 'BE',
          publish_interval: 5,
          publish_cell_voltages: true,
          publish_balancing: true,
          ha_autodiscovery: true
        },
        mqttStatus: {
          connected: false,
          messages_published: 0,
          commands_received: 0,
          last_publish_ms: 0
        },
        metrics: {},
        status: {
          state: 'stopped',
          running: false,
          error: '',
          battery_type: '',
          inverter_protocol: '',
          frames_rx: 0,
          frames_tx: 0,
          last_update_ms: 0
        },
        isLoading: false,
        configLoaded: false,
        mqttConfigLoaded: false
      }
    }
  }

  // === Installation ===

  /**
   * Install device files to the device.
   * Uses this.deviceFiles which is injected by the loader.
   */
  async onInstall() {
    if (!this.state.isConnected) return false
    
    console.log('[DBE] Installing device files...')
    
    try {
      // Create directories
      await this.device.mkdir('/lib/ext/dbe')
      await this.device.mkdir('/lib/ext/dbe/battery')
      await this.device.mkdir('/lib/ext/dbe/charger')
      await this.device.mkdir('/lib/ext/dbe/inverter')
      
      // Write all device files from the bundle
      for (const [targetPath, content] of Object.entries(this.deviceFiles)) {
        const filename = targetPath.split('/').pop()
        console.log(`[DBE] Writing ${filename}...`)
        await this.device.saveFile(targetPath, content)
      }
      
      console.log('[DBE] Installation complete! Device may need restart to use extension.')
      return true
    } catch (e) {
      console.error('[DBE] Installation failed:', e)
      return false
    }
  }

  // === Helper Methods for DBE_helpers.py ===

  async getDBEConfig() {
    // Prevent multiple simultaneous loads
    if (this.state.dbe.isLoading) {
      console.log('[DBE] Config already loading, skipping')
      return this.state.dbe.config || {}
    }

    try {
      this.state.dbe.isLoading = true
      
      const result = await this.device.execute('from lib.DBE.DBE_helpers import getDBEConfig; getDBEConfig()')
      const parsed = this.device.parseJSON(result)
      if (parsed && typeof parsed === 'object') {
        this.state.dbe.config = parsed
      }
      
      this.state.dbe.configLoaded = true
      this.state.dbe.isLoading = false
      this.emit('render')
      return this.state.dbe.config || {}
    } catch (e) {
      console.error('[DBE] Error getting config:', e)
      this.state.dbe.isLoading = false
      this.state.dbe.configLoaded = true
      return this.state.dbe.config || {}
    }
  }

  async setDBEConfig(config) {
    try {
      const result = await this.device.execute(`from lib.DBE.DBE_helpers import setDBEConfig; setDBEConfig(${JSON.stringify(config)})`)
      const parsed = this.device.parseJSON(result)
      
      // Update local state
      this.state.dbe.config = config
      this.emit('render')
      return parsed || { success: true }
    } catch (e) {
      console.error('[DBE] Error setting config:', e)
      return { error: e.message }
    }
  }

  async getDBEMetrics() {
    try {
      const result = await this.device.execute('from lib.DBE.DBE_helpers import getDBEMetrics; getDBEMetrics()')
      const parsed = this.device.parseJSON(result)
      if (parsed && typeof parsed === 'object') {
        this.state.dbe.metrics = parsed
        this.emit('render')
      }
      return parsed || {}
    } catch (e) {
      console.error('[DBE] Error getting metrics:', e)
      return {}
    }
  }

  async getDBEStatus() {
    try {
      const result = await this.device.execute('from lib.DBE.DBE_helpers import getDBEStatus; getDBEStatus()')
      const parsed = this.device.parseJSON(result)
      if (parsed && typeof parsed === 'object') {
        this.state.dbe.status = parsed
        this.emit('render')
      }
      return parsed || {}
    } catch (e) {
      console.error('[DBE] Error getting status:', e)
      return {}
    }
  }

  async startDBE() {
    try {
      this.state.dbe.isLoading = true
      this.emit('render')
      const result = await this.device.execute('from lib.DBE.DBE_helpers import startDBE; startDBE()')
      const parsed = this.device.parseJSON(result)
      await this.getDBEStatus()
      this.state.dbe.isLoading = false
      this.emit('render')
      return parsed || {}
    } catch (e) {
      console.error('[DBE] Error starting:', e)
      this.state.dbe.isLoading = false
      this.emit('render')
      return { error: e.message }
    }
  }

  async stopDBE() {
    try {
      this.state.dbe.isLoading = true
      this.emit('render')
      const result = await this.device.execute('from lib.DBE.DBE_helpers import stopDBE; stopDBE()')
      const parsed = this.device.parseJSON(result)
      await this.getDBEStatus()
      this.state.dbe.isLoading = false
      this.emit('render')
      return parsed || {}
    } catch (e) {
      console.error('[DBE] Error stopping:', e)
      this.state.dbe.isLoading = false
      this.emit('render')
      return { error: e.message }
    }
  }

  // === MQTT Helper Methods ===

  async getMqttConfig() {
    if (this.state.dbe.isLoading) {
      console.log('[DBE MQTT] Config already loading, skipping')
      return this.state.dbe.mqttConfig || {}
    }

    try {
      this.state.dbe.isLoading = true
      const result = await this.device.execute('from lib.DBE.DBE_helpers import getMqttConfig; getMqttConfig()')
      const parsed = this.device.parseJSON(result)
      if (parsed && typeof parsed === 'object') {
        this.state.dbe.mqttConfig = parsed
      }
      this.state.dbe.mqttConfigLoaded = true
      this.state.dbe.isLoading = false
      this.emit('render')
      return this.state.dbe.mqttConfig || {}
    } catch (e) {
      console.error('[DBE MQTT] Error getting config:', e)
      this.state.dbe.isLoading = false
      this.state.dbe.mqttConfigLoaded = true
      return this.state.dbe.mqttConfig || {}
    }
  }

  async saveMqttConfig() {
    try {
      this.state.dbe.isLoading = true
      this.emit('render')
      
      const config = this.state.dbe.mqttConfig
      const result = await this.device.execute(`from lib.DBE.DBE_helpers import setMqttConfig; setMqttConfig(${JSON.stringify(config)})`)
      const parsed = this.device.parseJSON(result)
      
      this.state.dbe.isLoading = false
      
      if (parsed && parsed.success) {
        alert('✓ MQTT configuration saved successfully!')
      } else {
        alert('✗ Failed to save MQTT configuration: ' + (parsed?.error || 'Unknown error'))
      }
      
      this.emit('render')
    } catch (e) {
      this.state.dbe.isLoading = false
      alert('✗ Failed to save MQTT configuration: ' + e.message)
      this.emit('render')
    }
  }

  async testMqttConnection() {
    try {
      this.state.dbe.isLoading = true
      this.emit('render')
      
      const result = await this.device.execute('from lib.DBE.DBE_helpers import testMqtt; testMqtt()')
      const parsed = this.device.parseJSON(result)
      
      this.state.dbe.isLoading = false
      
      if (parsed && parsed.success) {
        alert('✓ MQTT connection successful!')
      } else {
        alert('✗ MQTT connection failed: ' + (parsed?.error || 'Unknown error'))
      }
      
      this.emit('render')
    } catch (e) {
      this.state.dbe.isLoading = false
      alert('✗ MQTT test failed: ' + e.message)
      this.emit('render')
    }
  }

  async refreshMqttStatus() {
    try {
      const result = await this.device.execute('from lib.DBE.DBE_helpers import getMqttStatus; getMqttStatus()')
      const parsed = this.device.parseJSON(result)
      if (parsed && typeof parsed === 'object') {
        this.state.dbe.mqttStatus = parsed
        this.emit('render')
      }
    } catch (e) {
      console.error('[DBE MQTT] Error getting status:', e)
    }
  }

  handleMqttConfigChange(key, value) {
    this.state.dbe.mqttConfig[key] = value
    this.emit('render')
  }

  // === Panel Renderers ===

  renderConfig() {
    // Load config if needed
    const needsLoad = !this.state.dbe.configLoaded && !this.state.dbe.isLoading && this.state.isConnected
    
    if (needsLoad) {
      setTimeout(() => {
        this.getDBEConfig().catch(err => {
          console.error('[DBE] getDBEConfig() error:', err);
        });
      }, 0)
    }
    
    // Auto-refresh status periodically
    if (this.state.isConnected && !this.state.dbe.isLoading) {
      const now = Date.now()
      if (!this.state.dbe.lastStatusRefresh || (now - this.state.dbe.lastStatusRefresh) > 2000) {
        setTimeout(() => {
          this.getDBEStatus()
          this.state.dbe.lastStatusRefresh = Date.now()
        }, 0)
      }
    }

    const config = this.state.dbe.config
    const status = this.state.dbe.status || {}
    const isRunning = status.running

    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>DBE Configuration</h2>
          <div style="display: flex; gap: 8px;">
            <button 
              class="dbe-button ${isRunning ? 'stop' : 'start'}"
              onclick=${() => isRunning ? this.stopDBE() : this.startDBE()}
              disabled=${!this.state.isConnected || this.state.dbe.isLoading || !config.enabled}
              style="min-width: 120px;"
            >
              ${isRunning ? 'Stop' : 'Start'}
            </button>
            <button 
              class="dbe-button"
              onclick=${() => this.saveConfig()}
              disabled=${!this.state.isConnected || this.state.dbe.isLoading}
              style="min-width: 120px;"
            >
              Save
            </button>
          </div>
        </div>
        <div class="dbe-section" style="padding: 20px;">
          <div class="dbe-field">
            <label>
              <input 
                type="checkbox" 
                checked=${config.enabled}
                onchange=${(e) => this.handleConfigChange('enabled', e.target.checked)}
              />
              Enable DBE Bridge
            </label>
          </div>

          <div class="dbe-field">
            <label>Battery Type</label>
            <select 
              value="${config.battery_type || 'nissan_leaf'}"
              onchange=${(e) => this.handleConfigChange('battery_type', e.target.value)}
              disabled=${!this.state.isConnected}
            >
              ${config.available_batteries && Object.keys(config.available_batteries).length > 0 ? 
                Object.entries(config.available_batteries).map(([id, name]) => this.html`
                  <option value="${id}" ${config.battery_type === id ? 'selected' : ''}>${name}</option>
                `) : this.html`
                  <option value="nissan_leaf" ${config.battery_type === 'nissan_leaf' ? 'selected' : ''}>Nissan LEAF (ZE0/AZE0/ZE1)</option>
                `}
            </select>
          </div>

          <div class="dbe-field">
            <label>RS485 Baudrate</label>
            <select 
              value="${config.rs485_baudrate || 9600}"
              onchange=${(e) => this.handleConfigChange('rs485_baudrate', parseInt(e.target.value))}
              disabled=${!this.state.isConnected}
            >
              <option value="9600">9600</option>
              <option value="19200">19200</option>
              <option value="38400">38400</option>
              <option value="57600">57600</option>
              <option value="115200">115200</option>
            </select>
          </div>

          <div class="dbe-field">
            <label>Inverter Protocol</label>
            <select 
              value="${config.inverter_protocol || 'pylon_can'}"
              onchange=${(e) => this.handleConfigChange('inverter_protocol', e.target.value)}
              disabled=${!this.state.isConnected}
            >
              ${config.available_inverters && Object.keys(config.available_inverters).length > 0 ?
                Object.entries(config.available_inverters).map(([id, name]) => this.html`
                  <option value="${id}" ${config.inverter_protocol === id ? 'selected' : ''}>${name}</option>
                `) : this.html`
                  <option value="pylon_can" ${config.inverter_protocol === 'pylon_can' ? 'selected' : ''}>Pylon CAN Protocol</option>
                `}
            </select>
          </div>

          <div class="dbe-field">
            <label>Poll Interval (ms)</label>
            <input 
              type="number" 
              value="${config.poll_interval || 1000}"
              placeholder="1000"
              min="100"
              max="10000"
              step="100"
              oninput=${(e) => this.handleConfigChange('poll_interval', parseInt(e.target.value) || 1000)}
              disabled=${!this.state.isConnected}
            />
          </div>

          <div style="margin-top: 20px; padding: 16px; background: var(--dbe-blue-light); border-radius: 8px; border-left: 4px solid var(--dbe-blue);">
            <p style="margin: 0; font-size: 14px; color: var(--text-primary);">
              <strong>Note:</strong> CAN bus settings are configured in the System panel. 
              DBE uses the existing CAN configuration automatically.
            </p>
          </div>
        </div>
      </div>
    `
  }

  renderStatus() {
    // Refresh status periodically
    if (this.state.isConnected && !this.state.dbe.isLoading) {
      const now = Date.now()
      if (!this.state.dbe.lastStatusRefresh || (now - this.state.dbe.lastStatusRefresh) > 2000) {
        setTimeout(() => {
          this.getDBEStatus()
          this.state.dbe.lastStatusRefresh = Date.now()
        }, 0)
      }
    }

    const status = this.state.dbe.status || {}
    const config = this.state.dbe.config || {}

    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>Status</h2>
        </div>
        <div class="dbe-status-panel">
          <div class="dbe-status-item">
            <span class="dbe-status-label">Bridge State</span>
            <span class="dbe-status-value ${status.running ? 'running' : status.state === 'error' ? 'error' : ''}">
              ${status.state || 'stopped'}
            </span>
          </div>

          <div class="dbe-status-item">
            <span class="dbe-status-label">Battery Type</span>
            <span class="dbe-status-value">${status.battery_type || config.battery_type || '-'}</span>
          </div>

          <div class="dbe-status-item">
            <span class="dbe-status-label">Inverter Protocol</span>
            <span class="dbe-status-value">${status.inverter_protocol || config.inverter_protocol || '-'}</span>
          </div>

          <div class="dbe-status-item">
            <span class="dbe-status-label">CAN Frames Received</span>
            <span class="dbe-status-value">${status.frames_rx || 0}</span>
          </div>

          <div class="dbe-status-item">
            <span class="dbe-status-label">CAN Frames Transmitted</span>
            <span class="dbe-status-value">${status.frames_tx || 0}</span>
          </div>

          <div class="dbe-status-item">
            <span class="dbe-status-label">Last Update</span>
            <span class="dbe-status-value">
              ${status.last_update_ms ? new Date(status.last_update_ms).toLocaleTimeString() : 'Never'}
            </span>
          </div>

          ${status.error ? this.html`
            <div class="dbe-status-item">
              <span class="dbe-status-label">Error</span>
              <span class="dbe-status-value error">${status.error}</span>
            </div>
          ` : ''}

          <div style="margin-top: 24px; display: flex; gap: 12px;">
            <button 
              class="dbe-button start"
              onclick=${() => this.startDBE()}
              disabled=${!this.state.isConnected || !config.enabled || status.running || this.state.dbe.isLoading}
            >
              Start Bridge
            </button>
            <button 
              class="dbe-button stop"
              onclick=${() => this.stopDBE()}
              disabled=${!this.state.isConnected || !status.running || this.state.dbe.isLoading}
            >
              Stop Bridge
            </button>
            <button 
              class="dbe-button secondary"
              onclick=${() => this.getDBEStatus()}
              disabled=${!this.state.isConnected || this.state.dbe.isLoading}
            >
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    `
  }

  renderMetrics() {
    // Refresh metrics periodically
    if (this.state.isConnected && !this.state.dbe.isLoading) {
      const now = Date.now()
      if (!this.state.dbe.lastMetricsRefresh || (now - this.state.dbe.lastMetricsRefresh) > 2000) {
        setTimeout(() => {
          this.getDBEMetrics()
          this.state.dbe.lastMetricsRefresh = Date.now()
        }, 0)
      }
    }

    const metrics = this.state.dbe.metrics || {}
    const status = this.state.dbe.status || {}

    // Extract key metrics
    const voltage_V = (metrics.voltage_dV || 0) / 10
    const current_A = (metrics.current_dA || 0) / 10
    const power_W = metrics.power_W || 0
    const soc = metrics.soc_percent || 0
    const soh = metrics.soh_percent || 100
    const temp_max = metrics.temp_max_C || 0
    const temp_min = metrics.temp_min_C || 0
    const cell_max_V = (metrics.cell_max_mV || 0) / 1000
    const cell_min_V = (metrics.cell_min_mV || 0) / 1000
    const cell_deviation_mV = metrics.cell_deviation_mV || 0
    const alarms = metrics.alarms || 0

    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>Battery Metrics</h2>
        </div>
        
        ${!status.running ? this.html`
          <div style="padding: 40px 20px; text-align: center; color: var(--text-secondary);">
            ${this.state.isConnected ? 'Bridge not running. Start the bridge to see metrics.' : 'Not connected to device.'}
          </div>
        ` : this.html`
          <div style="padding: 20px;">
            <!-- SOC Gauge -->
            <div style="margin-bottom: 24px;">
              <h3 style="margin-bottom: 8px; color: var(--text-primary);">State of Charge</h3>
              <div class="dbe-soc-gauge">
                <div class="dbe-soc-fill" style="width: ${soc}%">
                  ${soc.toFixed(1)}%
                </div>
              </div>
            </div>

            <!-- Alarms -->
            ${alarms > 0 ? this.html`
              <div style="margin-bottom: 24px;">
                <h3 style="margin-bottom: 8px; color: var(--dbe-red);">Alarms</h3>
                <div>
                  ${alarms & 0x01 ? this.html`<span class="dbe-alarm-badge error">Relay Cut Request</span>` : ''}
                  ${alarms & 0x02 ? this.html`<span class="dbe-alarm-badge error">Failsafe Active</span>` : ''}
                  ${alarms & 0x04 ? this.html`<span class="dbe-alarm-badge warning">Interlock Open</span>` : ''}
                  ${alarms & 0x08 ? this.html`<span class="dbe-alarm-badge error">Battery Empty</span>` : ''}
                </div>
              </div>
            ` : ''}

            <!-- Metrics Grid -->
            <div class="dbe-metrics-grid">
              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Voltage</div>
                <div class="dbe-metric-value">${voltage_V.toFixed(1)}</div>
                <div class="dbe-metric-unit">V</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Current</div>
                <div class="dbe-metric-value">${current_A.toFixed(1)}</div>
                <div class="dbe-metric-unit">A</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Power</div>
                <div class="dbe-metric-value">${(power_W / 1000).toFixed(2)}</div>
                <div class="dbe-metric-unit">kW</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">State of Health</div>
                <div class="dbe-metric-value">${soh}</div>
                <div class="dbe-metric-unit">%</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Temperature Max</div>
                <div class="dbe-metric-value">${temp_max.toFixed(1)}</div>
                <div class="dbe-metric-unit">°C</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Temperature Min</div>
                <div class="dbe-metric-value">${temp_min.toFixed(1)}</div>
                <div class="dbe-metric-unit">°C</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Cell Voltage Max</div>
                <div class="dbe-metric-value">${cell_max_V.toFixed(3)}</div>
                <div class="dbe-metric-unit">V</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Cell Voltage Min</div>
                <div class="dbe-metric-value">${cell_min_V.toFixed(3)}</div>
                <div class="dbe-metric-unit">V</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Cell Deviation</div>
                <div class="dbe-metric-value">${cell_deviation_mV}</div>
                <div class="dbe-metric-unit">mV</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Max Charge Current</div>
                <div class="dbe-metric-value">${((metrics.max_charge_current_dA || 0) / 10).toFixed(1)}</div>
                <div class="dbe-metric-unit">A</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Max Discharge Current</div>
                <div class="dbe-metric-value">${((metrics.max_discharge_current_dA || 0) / 10).toFixed(1)}</div>
                <div class="dbe-metric-unit">A</div>
              </div>

              <div class="dbe-metric-card">
                <div class="dbe-metric-name">Status</div>
                <div class="dbe-metric-value" style="font-size: 16px;">${metrics.status || 'unknown'}</div>
              </div>
            </div>
          </div>
        `}
      </div>
    `
  }

  renderMqtt() {
    // Load MQTT config if needed
    const needsLoad = !this.state.dbe.mqttConfigLoaded && !this.state.dbe.isLoading && this.state.isConnected
    
    if (needsLoad) {
      setTimeout(() => {
        this.getMqttConfig().catch(err => {
          console.error('[DBE MQTT] getMqttConfig() error:', err);
        });
      }, 0)
    }
    
    // Auto-refresh MQTT status periodically
    if (this.state.isConnected && !this.state.dbe.isLoading) {
      const now = Date.now()
      if (!this.state.dbe.lastMqttStatusRefresh || (now - this.state.dbe.lastMqttStatusRefresh) > 3000) {
        setTimeout(() => {
          this.refreshMqttStatus()
          this.state.dbe.lastMqttStatusRefresh = Date.now()
        }, 0)
      }
    }

    const mqttConfig = this.state.dbe.mqttConfig || {}
    const mqttStatus = this.state.dbe.mqttStatus || {}

    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>MQTT Configuration</h2>
          <button 
            class="dbe-button"
            onclick=${() => this.saveMqttConfig()}
            disabled=${!this.state.isConnected || this.state.dbe.isLoading}
            style="min-width: 120px;"
          >
            Save
          </button>
        </div>
        
        <div class="dbe-section" style="padding: 20px;">
          <div style="margin-bottom: 20px; padding: 16px; background: var(--bg-secondary); border-radius: 8px; border-left: 4px solid var(--scheme-primary);">
            <p style="margin: 0; font-size: 14px; color: var(--text-primary);">
              <strong>Note:</strong> MQTT broker settings (server, port, credentials) are configured in <strong>Networks → MQTT</strong> panel. 
              This panel configures DBE-specific MQTT settings only.
            </p>
          </div>

          <div class="dbe-field">
            <label>
              <input 
                type="checkbox" 
                checked=${mqttConfig.enabled}
                onchange=${(e) => this.handleMqttConfigChange('enabled', e.target.checked)}
              />
              Enable MQTT Publishing
            </label>
          </div>

          <div class="dbe-field">
            <label>Topic Prefix</label>
            <input 
              type="text" 
              value="${mqttConfig.topic_prefix || 'BE'}"
              placeholder="BE"
              oninput=${(e) => this.handleMqttConfigChange('topic_prefix', e.target.value)}
              disabled=${!this.state.isConnected}
            />
            <small style="color: var(--text-secondary); font-size: 12px;">
              MQTT topics will be: ${mqttConfig.topic_prefix || 'BE'}/info, ${mqttConfig.topic_prefix || 'BE'}/command/*, etc.
            </small>
          </div>

          <div class="dbe-field">
            <label>Publish Interval (seconds)</label>
            <input 
              type="number" 
              value="${mqttConfig.publish_interval || 5}"
              min="1" max="60"
              oninput=${(e) => this.handleMqttConfigChange('publish_interval', parseInt(e.target.value))}
              disabled=${!this.state.isConnected}
            />
            <small style="color: var(--text-secondary); font-size: 12px;">
              How often to publish battery telemetry (default: 5 seconds)
            </small>
          </div>

          <div class="dbe-field">
            <label>
              <input 
                type="checkbox" 
                checked=${mqttConfig.publish_cell_voltages}
                onchange=${(e) => this.handleMqttConfigChange('publish_cell_voltages', e.target.checked)}
              />
              Publish All Cell Voltages
            </label>
            <small style="color: var(--text-secondary); font-size: 12px;">
              Publishes individual cell voltages (96+ cells for Nissan LEAF). Disable to reduce bandwidth.
            </small>
          </div>

          <div class="dbe-field">
            <label>
              <input 
                type="checkbox" 
                checked=${mqttConfig.ha_autodiscovery}
                onchange=${(e) => this.handleMqttConfigChange('ha_autodiscovery', e.target.checked)}
              />
              Home Assistant Autodiscovery
            </label>
            <small style="color: var(--text-secondary); font-size: 12px;">
              Automatically creates sensors and buttons in Home Assistant
            </small>
          </div>
        </div>

        <!-- MQTT Status Section -->
        <div class="dbe-section" style="padding: 20px;">
          <h3>MQTT Status</h3>
          <div class="dbe-status-item">
            <span class="dbe-status-label">Connection</span>
            <span class="dbe-status-value ${mqttStatus.connected ? 'running' : ''}">
              ${mqttStatus.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div class="dbe-status-item">
            <span class="dbe-status-label">Broker</span>
            <span class="dbe-status-value">${mqttStatus.server || 'Not configured'}:${mqttStatus.port || 1883}</span>
          </div>
          <div class="dbe-status-item">
            <span class="dbe-status-label">Topic Prefix</span>
            <span class="dbe-status-value">${mqttStatus.topic_prefix || 'BE'}</span>
          </div>
          <div class="dbe-status-item">
            <span class="dbe-status-label">Messages Published</span>
            <span class="dbe-status-value">${mqttStatus.messages_published || 0}</span>
          </div>
          <div class="dbe-status-item">
            <span class="dbe-status-label">Commands Received</span>
            <span class="dbe-status-value">${mqttStatus.commands_received || 0}</span>
          </div>
          <div class="dbe-status-item">
            <span class="dbe-status-label">Last Publish</span>
            <span class="dbe-status-value">
              ${mqttStatus.last_publish_ms ? new Date(mqttStatus.last_publish_ms).toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </div>

        <!-- Test Buttons -->
        <div style="padding: 20px; display: flex; gap: 12px;">
          <button 
            class="dbe-button start" 
            onclick=${() => this.testMqttConnection()}
            disabled=${!this.state.isConnected || this.state.dbe.isLoading}
          >
            Test Connection
          </button>
          <button 
            class="dbe-button secondary" 
            onclick=${() => this.refreshMqttStatus()}
            disabled=${!this.state.isConnected || this.state.dbe.isLoading}
          >
            Refresh Status
          </button>
        </div>
      </div>
    `
  }

  // === Event Handlers ===

  handleConfigChange(key, value) {
    this.state.dbe.config[key] = value
    this.emit('render')
  }

  async saveConfig() {
    try {
      this.state.dbe.isLoading = true
      this.emit('render')
      
      // If DBE is being disabled, stop the service first
      if (!this.state.dbe.config.enabled) {
        try {
          await this.stopDBE()
        } catch (e) {
          console.warn('[DBE] Error stopping service:', e)
        }
      }
      
      const result = await this.setDBEConfig(this.state.dbe.config)
      
      this.state.dbe.isLoading = false
      
      if (result.success) {
        alert('✓ Configuration saved successfully!')
      } else {
        alert('✗ Failed to save configuration: ' + (result.error || 'Unknown error'))
      }
      
      this.emit('render')
    } catch (e) {
      this.state.dbe.isLoading = false
      alert('✗ Failed to save configuration: ' + e.message)
      this.emit('render')
    }
  }

  // === Main Render Method ===

  render(panelId) {
    switch (panelId) {
      case 'config':
        return this.renderConfig()
      case 'status':
        return this.renderStatus()
      case 'metrics':
        return this.renderMetrics()
      case 'mqtt':
        return this.renderMqtt()
      default:
        return this.renderConfig()
    }
  }
}
export { DBEExtension as default }
