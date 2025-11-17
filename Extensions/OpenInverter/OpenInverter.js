// === START_EXTENSION_CONFIG ===
// {
//   "name": "OpenInverter",
//   "id": "openinverter",
//   "version": [0, 6, 6],
//   "author": "JetPax",
//   "description": "OpenInverter debug and configuration tool for motor control parameters, spot values, CAN mapping, and live plotting",
//   "icon": "sliders",
//   "mipPackage": "github:jetpax/scripto-studio-registry/Extensions/OpenInverter/lib",
//   "menu": [
//     { "id": "parameters", "label": "Parameters", "icon": "sliders" },
//     { "id": "spotvalues", "label": "Spot Values", "icon": "activity" },
//     { "id": "canmapping", "label": "CAN Mapping", "icon": "radio" },
//     { "id": "commands", "label": "Device Control", "icon": "zap" },
//     { "id": "errors", "label": "Error Log", "icon": "alert-triangle" },
//     { "id": "plot", "label": "Live Plot", "icon": "trending-up" },
//     { "id": "firmware", "label": "Firmware Upgrade", "icon": "download" }
//   ],
//   "styles": ".oi-compact-header { padding: 16px 20px !important; min-height: auto !important; display: flex; justify-content: space-between; align-items: center; } .oi-compact-header h2 { font-size: 18px !important; margin: 0 !important; } .oi-button-row { display: flex; flex-direction: row; gap: 8px; flex-wrap: wrap; align-items: center; } .oi-button-row .secondary-button, .oi-button-row .primary-button { padding: 6px 12px !important; font-size: 12px !important; font-weight: 600; text-transform: none; letter-spacing: normal; display: flex; align-items: center; gap: 6px; } .oi-button-row .secondary-button svg, .oi-button-row .primary-button svg { width: 14px; height: 14px; flex-shrink: 0; } .oi-plot-controls { display: flex; gap: 20px; align-items: center; } .oi-plot-controls .button { display: flex; flex-direction: column; align-items: center; } .oi-plot-controls .codicon { font-size: 20px; } .oi-parameters-container { padding: 20px; } .oi-category-section { margin-bottom: 32px; } .oi-category-title { font-size: 18px; font-weight: 400; color: var(--scheme-primary); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid var(--scheme-primary); } .oi-parameters-table { border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; } .oi-table-header, .oi-table-row { display: grid; grid-template-columns: 1.5fr 1fr 0.8fr 1.2fr 0.8fr; gap: 12px; padding: 6px 16px; align-items: center; } .oi-table-header { background: var(--scheme-primary); color: white; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; } .oi-table-row { border-bottom: 1px solid var(--border-color); transition: background 0.2s; padding: 3px 16px; } .oi-table-row:hover { background: var(--bg-tertiary); } .oi-table-row:last-child { border-bottom: none; } .oi-value-input, .oi-enum-select { width: 100%; padding: 6px 0px; border: 1px solid #34495e; border-radius: 4px; background: #121212; color: #0fdb0f; font-size: 14px; font-family: 'Menlo', 'Monaco', 'Courier New', monospace; } .oi-value-input:focus, .oi-enum-select:focus { outline: none; border-color: var(--scheme-primary); box-shadow: 0 0 0 2px rgba(0, 129, 132, 0.2); } .oi-spotvalues-container { padding: 20px; } .oi-spotvalues-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; } .oi-spotvalue-card { background: var(#121212); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; transition: all 0.2s; } .oi-spotvalue-card:hover { border-color: var(--scheme-primary); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); } .oi-spotvalue-name { font-weight: 600; color: var(--scheme-primary); font-size: 13px; margin-bottom: 8px; } .oi-spotvalue-value { font-size: 24px; font-weight: 700; font-family: 'Menlo', Monaco, 'Courier New', monospace; color: white; } .oi-plot-container { display: flex; height: 500px; max-height: calc(100vh - 260px); gap: 20px; padding: 20px; overflow: hidden; } .oi-plot-sidebar { width: 140px; flex-shrink: 0; border-right: 1px solid var(--border-color); padding-right: 20px; overflow-y: auto; } .oi-plot-section-title { font-size: 14px; font-weight: 600; color: var(--scheme-primary); margin: 16px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; } .oi-plot-signal-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; } .oi-plot-signal { padding: 8px; border-radius: 4px; transition: background 0.2s; } .oi-plot-signal:hover { background: var(--bg-tertiary); } .oi-plot-signal label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; } .oi-plot-signal input[type=\"checkbox\"] { width: 16px; height: 16px; cursor: pointer; } .oi-plot-signal-name { font-weight: 600; color: var(--text-primary); } .oi-plot-signal-unit { color: var(--text-secondary); font-size: 12px; margin-left: auto; } .oi-plot-settings { display: flex; flex-direction: column; gap: 12px; } .oi-plot-settings label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text-secondary); } .oi-plot-settings input[type=\"number\"] { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-size: 13px; } .oi-plot-settings input[type=\"number\"]:focus { outline: none; border-color: var(--scheme-primary); box-shadow: 0 0 0 2px rgba(0, 129, 132, 0.2); } .oi-plot-chart-area { flex: 1; position: relative; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; min-height: 0; min-width: 0; display: flex; flex-direction: column; } .oi-plot-chart-area canvas { width: 100% !important; height: 100% !important; max-width: 100%; max-height: 100%; }"
// }
// === END_EXTENSION_CONFIG ===

/**
 * OpenInverter Extension - Motor control and debugging interface
 * 
 * This extension provides a complete interface for configuring and monitoring
 * OpenInverter motor controllers.
 */

class OpenInverterExtension {
  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI
    this.emit = emit
    this.state = state
    this.html = html
  }

  // === Helper Methods for OI_helpers.py ===

  async getOiParams() {
    const result = await this.device.execute('from lib.OI_helpers import getOiParams; getOiParams()')
    const parsed = this.device.parseJSON(result)
    return parsed.ARG || parsed
  }

  async setParameter(args) {
    const argsStr = JSON.stringify(args)
    const result = await this.device.execute(`from lib.OI_helpers import setParameter; setParameter(${argsStr})`)
    const parsed = this.device.parseJSON(result)
    return parsed.ARG || parsed
  }

  async getSpotValues() {
    console.log('[OI App] Fetching spot values...')
    const result = await this.device.execute('from lib.OI_helpers import getSpotValues; getSpotValues()')
    console.log('[OI App] Raw spot values result:', result)
    const parsed = this.device.parseJSON(result)
    console.log('[OI App] Parsed spot values:', parsed)
    return parsed.ARG || parsed
  }

  /**
   * Render Parameters panel
   * Displays editable motor control parameters with load/save functionality
   */
  renderParameters() {
    // Load parameters if not already loaded
    if (!this.state.oiParameters && !this.state.isLoadingOiParameters && this.state.isConnected) {
      // Use setTimeout to avoid blocking render
      setTimeout(() => this.refreshParameters(), 0)
    }

    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Parameters</h2>
          <div class="panel-actions oi-button-row">
            <button 
              class="refresh-button" 
              onclick=${() => this.loadParametersFromFile()}
              title="Load parameters from local JSON file"
            >
              Load from File
            </button>
            <button 
              class="refresh-button" 
              onclick=${() => this.refreshParameters()}
              disabled=${!this.state.isConnected}
              title="Load parameters from connected device"
            >
              Load from Device
            </button>
            <button 
              class="refresh-button" 
              onclick=${() => this.saveParametersToFile()}
              disabled=${!this.state.oiParameters}
              title="Save parameters to local JSON file"
            >
              Save to File
            </button>
          </div>
        </div>
        
        ${this.renderParametersContent()}
      </div>
    `
  }

  renderParametersContent() {
    if (!this.state.isConnected) {
      return this.html`
        <div class="panel-message">
          <p>Connect to device to view parameters</p>
        </div>
      `
    }
    
    if (this.state.isLoadingOiParameters) {
      return this.html`
        <div class="panel-message">
          <p>Loading parameters...</p>
        </div>
      `
    }
    
    if (!this.state.oiParameters || Object.keys(this.state.oiParameters).length === 0) {
      return this.html`
        <div class="panel-message">
          <p>No parameters available. Click "Load from Device" to fetch parameters.</p>
        </div>
      `
    }
    
    // Group parameters by category
    const categories = {}
    Object.entries(this.state.oiParameters).forEach(([name, param]) => {
      const cat = param.category || 'Uncategorized'
      if (!categories[cat]) categories[cat] = []
      categories[cat].push({ name, ...param })
    })
    
    return this.html`
      <div class="oi-parameters-container">
        ${Object.entries(categories).map(([category, params]) => this.html`
          <div class="oi-category-section">
            <h3 class="oi-category-title">${category}</h3>
            <div class="oi-parameters-table">
              <div class="oi-table-header">
                <div class="oi-col-name">Parameter</div>
                <div class="oi-col-value">Value</div>
                <div class="oi-col-unit">Unit</div>
                <div class="oi-col-range">Range</div>
                <div class="oi-col-default">Default</div>
              </div>
              ${params.map(param => this.renderParameter(param))}
            </div>
          </div>
        `)}
      </div>
    `
  }

  renderParameter(param) {
    const hasEnum = param.enums && Object.keys(param.enums).length > 0
    const hasRange = param.minimum !== undefined || param.maximum !== undefined
    
    return this.html`
      <div class="oi-table-row" data-param="${param.name}">
        <div class="oi-col-name">
          <strong>${param.name}</strong>
        </div>
        <div class="oi-col-value">
          ${hasEnum ? this.renderEnumSelect(param) : this.renderValueInput(param)}
        </div>
        <div class="oi-col-unit">${param.unit || '-'}</div>
        <div class="oi-col-range">
          ${hasRange ? `${param.minimum ?? '?'} - ${param.maximum ?? '?'}` : '-'}
        </div>
        <div class="oi-col-default">${param.default !== undefined ? param.default : '-'}</div>
      </div>
    `
  }

  renderValueInput(param) {
    return this.html`
      <input 
        class="oi-value-input"
        type="number" 
        value="${param.value}"
        step="0.1"
        min="${param.minimum}"
        max="${param.maximum}"
        onchange=${(e) => this.updateParameter(param.name, parseFloat(e.target.value))}
      />
    `
  }

  renderEnumSelect(param) {
    return this.html`
      <select 
        class="oi-enum-select"
        value="${param.value}"
        onchange=${(e) => this.updateParameter(param.name, parseInt(e.target.value))}
      >
        ${Object.entries(param.enums).map(([value, label]) => this.html`
          <option value="${value}" ${param.value == value ? 'selected' : ''}>
            ${label}
          </option>
        `)}
      </select>
    `
  }

  async updateParameter(name, value) {
    try {
      await this.setParameter({ NAME: name, VALUE: value })
      // Refresh parameters to show updated value
      await this.refreshParameters()
    } catch (error) {
      console.error('[OI App] Failed to update parameter:', error)
      alert(`Failed to update parameter: ${error.message}`)
    }
  }

  async refreshParameters() {
    if (this.state.isLoadingOiParameters) {
      console.log('[OI App] Already loading parameters, skipping')
      return
    }
    
    this.state.isLoadingOiParameters = true
    this.emit('render')
    
    try {
      const params = await this.getOiParams()
      this.state.oiParameters = params
      this.state.isLoadingOiParameters = false
      this.emit('render')
    } catch (error) {
      console.error('[OI App] Failed to load parameters:', error)
      this.state.isLoadingOiParameters = false
      this.emit('render')
      alert(`Failed to load parameters: ${error.message}`)
    }
  }

  loadParametersFromFile() {
    // TODO: Implement file loading
    alert('Load from file not yet implemented')
  }

  saveParametersToFile() {
    // TODO: Implement file saving
    alert('Save to file not yet implemented')
  }

  /**
   * Render Spot Values panel
   * Displays read-only live values from the controller
   */
  renderSpotvalues() {
    if (!this.state.oiSpotValues && !this.state.isLoadingOiSpotValues && this.state.isConnected) {
      // Use setTimeout to avoid blocking render
      setTimeout(() => this.refreshSpotValues(), 0)
    }

    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Spot Values</h2>
          <div class="panel-actions oi-button-row">
            <button 
              class="refresh-button" 
              onclick=${() => this.refreshSpotValues()}
              disabled=${!this.state.isConnected}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        ${this.renderSpotValuesContent()}
      </div>
    `
  }

  renderSpotValuesContent() {
    console.log('[OI App] renderSpotValuesContent - state:', {
      isConnected: this.state.isConnected,
      isLoading: this.state.isLoadingOiSpotValues,
      hasSpotValues: !!this.state.oiSpotValues,
      spotValuesKeys: this.state.oiSpotValues ? Object.keys(this.state.oiSpotValues) : []
    })
    
    if (!this.state.isConnected) {
      return this.html`
        <div class="panel-message">
          <p>Connect to device to view spot values</p>
        </div>
      `
    }
    
    if (this.state.isLoadingOiSpotValues) {
      return this.html`
        <div class="panel-message">
          <p>Loading spot values...</p>
        </div>
      `
    }
    
    if (!this.state.oiSpotValues || Object.keys(this.state.oiSpotValues).length === 0) {
      return this.html`
        <div class="panel-message">
          <p>No spot values available. Click "Refresh" to fetch values.</p>
        </div>
      `
    }
    
    // Group by category
    const categories = {}
    Object.entries(this.state.oiSpotValues).forEach(([name, spot]) => {
      const cat = spot.category || 'Uncategorized'
      if (!categories[cat]) categories[cat] = []
      categories[cat].push({ name, ...spot })
    })
    
    return this.html`
      <div class="oi-spotvalues-container">
        ${Object.entries(categories).map(([category, spots]) => this.renderSpotValueCategory(category, spots))}
      </div>
    `
  }
  
  renderSpotValueCategory(category, spots) {
    return this.html`
      <div class="oi-category-section">
        <h3 class="oi-category-title">${category}</h3>
        <div class="oi-spotvalues-grid">
          ${spots.map(spot => this.renderSpotValueCard(spot))}
        </div>
      </div>
    `
  }
  
  renderSpotValueCard(spot) {
    return this.html`
      <div class="oi-spotvalue-card">
        <div class="oi-spotvalue-name">${spot.name}</div>
        <div class="oi-spotvalue-value">
          ${spot.value} ${spot.unit || ''}
        </div>
      </div>
    `
  }

  async refreshSpotValues() {
    if (this.state.isLoadingOiSpotValues) {
      console.log('[OI App] Already loading spot values, skipping')
      return
    }
    
    this.state.isLoadingOiSpotValues = true
    this.emit('render')
    
    try {
      const spots = await this.getSpotValues()
      this.state.oiSpotValues = spots
      this.state.isLoadingOiSpotValues = false
      this.emit('render')
    } catch (error) {
      console.error('[OI App] Failed to load spot values:', error)
      this.state.isLoadingOiSpotValues = false
      this.emit('render')
      alert(`Failed to load spot values: ${error.message}`)
    }
  }

  /**
   * Render CAN Mapping panel
   * Configure CAN bus mapping for parameters
   */
  renderCanmapping() {
    return this.html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>CAN Mapping</h2>
        </div>
        
        <div class="panel-message">
          <p>CAN Mapping interface coming soon...</p>
          <p>This panel will allow you to configure CAN bus message mapping.</p>
        </div>
      </div>
    `
  }

  /**
   * Render Firmware Upgrade panel
   * Upload new firmware to an OpenInverter device
   */
  renderFirmware() {
    if (!this.state.firmwareUpgrade) {
      this.state.firmwareUpgrade = {
        selectedFile: null,
        serialNumber: '',
        recoveryMode: false,
        inProgress: false,
        progress: 0,
        status: '',
        error: null
      }
    }

    const fw = this.state.firmwareUpgrade

    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Firmware Upgrade</h2>
        </div>
        
        <div class="oi-parameters-container">
          <!-- Warning Notice -->
          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px; color: #92400e;">
            <strong>⚠️ Warning:</strong> Firmware upgrades are potentially dangerous. 
            Do not interrupt the process once started. Ensure stable power supply.
          </div>
          
          <!-- File Selection -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; margin-bottom: 16px;">Firmware File</h3>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <input 
                type="file" 
                accept=".bin"
                onchange=${(e) => this.selectFirmwareFile(e)}
                disabled=${fw.inProgress}
                style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary);"
              />
              
              ${fw.selectedFile ? this.html`
                <div style="font-size: 13px; color: var(--text-secondary);">
                  Selected: <span style="font-family: monospace; color: var(--text-primary);">${fw.selectedFile.name}</span>
                  (${(fw.selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Upgrade Options -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; margin-bottom: 16px;">Upgrade Options</h3>
            
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <!-- Recovery Mode -->
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input 
                  type="checkbox" 
                  checked=${fw.recoveryMode}
                  onchange=${(e) => { fw.recoveryMode = e.target.checked; this.emit('render'); }}
                  disabled=${fw.inProgress}
                  style="width: 16px; height: 16px;"
                />
                <span>Recovery Mode (for bricked devices)</span>
              </label>
              
              <!-- Serial Number (for recovery mode) -->
              ${fw.recoveryMode ? this.html`
                <label style="display: flex; flex-direction: column; gap: 4px;">
                  <span style="font-size: 13px; color: var(--text-secondary);">
                    Device Serial Number (8 hex digits, optional)
                  </span>
                  <input 
                    type="text" 
                    placeholder="e.g. 1A2B3C4D"
                    maxlength="8"
                    value=${fw.serialNumber}
                    oninput=${(e) => { fw.serialNumber = e.target.value.toUpperCase(); this.emit('render'); }}
                    disabled=${fw.inProgress}
                    style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); font-family: monospace; width: 200px;"
                  />
                  <span style="font-size: 12px; color: var(--text-secondary);">
                    Leave empty to upgrade the first device that boots
                  </span>
                </label>
              ` : ''}
              
              <!-- Normal Mode Info -->
              ${!fw.recoveryMode && this.state.oiDeviceConnected ? this.html`
                <div style="font-size: 13px; color: var(--text-secondary);">
                  Will upgrade device at Node ID ${this.state.selectedNodeId}. 
                  The device will be automatically reset.
                </div>
              ` : !fw.recoveryMode ? this.html`
                <div style="font-size: 13px; color: #ef4444;">
                  Please connect to a device first (Connection tab)
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Upgrade Progress -->
          ${fw.inProgress || fw.error || fw.status ? this.html`
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="font-size: 16px; margin-bottom: 16px;">Progress</h3>
              
              ${fw.error ? this.html`
                <div style="padding: 12px; background: #fee2e2; border: 1px solid #ef4444; border-radius: 4px; color: #991b1b; margin-bottom: 12px;">
                  <strong>Error:</strong> ${fw.error}
                </div>
              ` : ''}
              
              <div style="margin-bottom: 8px;">
                <div style="font-size: 14px; color: var(--text-primary); margin-bottom: 8px;">
                  ${fw.status}
                </div>
                <div style="width: 100%; height: 24px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden;">
                  <div style="height: 100%; background: var(--scheme-primary); transition: width 0.3s; width: ${fw.progress}%;"></div>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px; text-align: right;">
                  ${fw.progress.toFixed(1)}%
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Start Upgrade Button -->
          <div style="display: flex; justify-content: center;">
            <button 
              class="primary-button" 
              onclick=${() => this.startFirmwareUpgrade()}
              disabled=${!fw.selectedFile || fw.inProgress || !this.state.isConnected || (!fw.recoveryMode && !this.state.oiDeviceConnected)}
              style="padding: 12px 32px; font-size: 16px;">
              ${fw.inProgress ? 'Upgrading...' : 'Start Firmware Upgrade'}
            </button>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Render Plot panel
   * Real-time plotting of selected parameters
   */
  renderPlot() {
    // Initialize plot state if needed
    if (!this.state.plotState) {
      this.state.plotState = {
        isPlotting: false,
        isPaused: false,
        selectedVars: [],
        chart: null,
        maxDataPoints: 100,
        updateInterval: 100 // ms
      }
    }

    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Live Plot</h2>
          <div class="panel-actions oi-plot-controls">
            ${this.state.plotState.isPlotting ? this.html`
              <div class="button">
                <button 
                  class="${this.state.plotState.isPaused ? '' : 'active'}"
                  onclick=${() => this.pauseResumePlot()}
                  title="${this.state.plotState.isPaused ? 'Resume' : 'Pause'} plotting">
                  ${this.state.plotState.isPaused ? this.html`
                    <img class="icon" src="media/run.svg" />
                  ` : this.html`
                    <i class="codicon codicon-debug-pause"></i>
                  `}
                </button>
                <div class="label active">${this.state.plotState.isPaused ? 'Run' : 'Pause'}</div>
              </div>
              <div class="button">
                <button 
                  onclick=${() => this.stopPlot()}
                  title="Stop plotting">
                  <img class="icon" src="media/stop.svg" />
                </button>
                <div class="label active">Stop</div>
              </div>
            ` : this.html`
              <div class="button">
                <button 
                  disabled=${!this.state.isConnected || this.state.plotState.selectedVars.length === 0}
                  onclick=${() => this.startPlot()}
                  title="Start plotting selected variables">
                  <img class="icon" src="media/run.svg" />
                </button>
                <div class="label ${(!this.state.isConnected || this.state.plotState.selectedVars.length === 0) ? 'inactive' : 'active'}">Start Plot</div>
              </div>
            `}
          </div>
        </div>

        ${this.renderPlotContent()}
      </div>
    `
  }

  renderPlotContent() {
    if (!this.state.isConnected) {
      return this.html`
        <div class="panel-message">
          <p>Connect to device to use live plotting</p>
        </div>
      `
    }

    if (!this.state.oiSpotValues) {
      // Auto-load spot values if not already loaded
      if (!this.state.isLoadingOiSpotValues) {
        setTimeout(() => this.refreshSpotValues(), 0)
      }
      return this.html`
        <div class="panel-message">
          <p>Loading spot values...</p>
          <p>Please wait while we fetch available signals.</p>
        </div>
      `
    }

    return this.html`
      <div class="oi-plot-container">
        <div class="oi-plot-sidebar">
          <h3 class="oi-plot-section-title">Select Signals</h3>
          <div class="oi-plot-signal-list">
            ${Object.entries(this.state.oiSpotValues).map(([name, spot]) => this.renderPlotSignal(name, spot))}
          </div>
          
          <h3 class="oi-plot-section-title">Plot Settings</h3>
          <div class="oi-plot-settings">
            <label>
              Max Data Points:
              <input 
                type="number" 
                value="${this.state.plotState.maxDataPoints}" 
                min="50" 
                max="1000" 
                step="50"
                onchange=${(e) => { this.state.plotState.maxDataPoints = parseInt(e.target.value) }}
              />
            </label>
            <label>
              Update Interval (ms):
              <input 
                type="number" 
                value="${this.state.plotState.updateInterval}" 
                min="50" 
                max="1000" 
                step="50"
                onchange=${(e) => { this.state.plotState.updateInterval = parseInt(e.target.value) }}
              />
            </label>
          </div>
        </div>
        
        <div class="oi-plot-chart-area">
          <canvas id="oi-plot-canvas"></canvas>
        </div>
      </div>
    `
  }

  renderPlotSignal(name, spot) {
    const isSelected = this.state.plotState.selectedVars.includes(name)
    
    return this.html`
      <div class="oi-plot-signal">
        <label>
          <input 
            type="checkbox" 
            checked=${isSelected}
            onchange=${(e) => this.togglePlotVariable(name, e.target.checked)}
            disabled=${this.state.plotState.isPlotting}
          />
          <span class="oi-plot-signal-name">${name}</span>
          <span class="oi-plot-signal-unit">${spot.unit || ''}</span>
        </label>
      </div>
    `
  }

  togglePlotVariable(varName, isChecked) {
    if (isChecked) {
      if (!this.state.plotState.selectedVars.includes(varName)) {
        this.state.plotState.selectedVars.push(varName)
      }
    } else {
      this.state.plotState.selectedVars = this.state.plotState.selectedVars.filter(v => v !== varName)
    }
    this.emit('render')
  }

  async startPlot() {
    if (this.state.plotState.selectedVars.length === 0) {
      alert('Please select at least one variable to plot')
      return
    }

    this.state.plotState.isPlotting = true
    this.state.plotState.isPaused = false
    this.emit('render')

    // Wait for render to complete and canvas to be available
    setTimeout(() => this.initializeChart(), 100)
  }

  initializeChart() {
    const canvas = document.getElementById('oi-plot-canvas')
    if (!canvas) {
      console.error('[OI Plot] Canvas not found')
      return
    }

    // Destroy existing chart if any
    if (this.state.plotState.chart) {
      this.state.plotState.chart.destroy()
    }

    const ctx = canvas.getContext('2d')
    const colors = [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)', 
      'rgb(255, 159, 64)',
      'rgb(153, 102, 255)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)'
    ]

    const datasets = this.state.plotState.selectedVars.map((varName, idx) => ({
      label: varName,
      data: [],
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length],
      fill: false,
      pointRadius: 0,
      borderWidth: 2
    }))

    this.state.plotState.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time (s)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    })

    // Start data acquisition
    this.state.plotState.dataTime = 0
    this.acquirePlotData()
  }

  async acquirePlotData() {
    if (!this.state.plotState.isPlotting || this.state.plotState.isPaused) {
      return
    }

    try {
      const varNames = this.state.plotState.selectedVars
      
      if (!varNames || varNames.length === 0) {
        console.error('[OI Plot] No variables selected!')
        this.stopPlot()
        return
      }
      
      const argsStr = JSON.stringify(varNames)
      const result = await this.device.execute(`from lib.OI_helpers import getPlotData; getPlotData(${argsStr})`)
      const parsed = this.device.parseJSON(result)
      const data = parsed.ARG || parsed

      if (data && data.values) {
        // Check if chart still exists (canvas might have been destroyed during re-render)
        if (!this.state.plotState.chart || !this.state.plotState.chart.canvas || !document.body.contains(this.state.plotState.chart.canvas)) {
          console.warn('[OI Plot] Chart canvas destroyed, re-initializing...')
          this.initializeChart()
          return // Let next cycle update the data
        }

        // Add new data point
        this.state.plotState.dataTime++
        this.state.plotState.chart.data.labels.push(this.state.plotState.dataTime)

        // Update each dataset
        for (const varName of varNames) {
          const dataset = this.state.plotState.chart.data.datasets.find(d => d.label === varName)
          if (dataset && data.values[varName] !== undefined) {
            dataset.data.push(data.values[varName])
          }
        }

        // Trim old data
        const maxPoints = this.state.plotState.maxDataPoints
        if (this.state.plotState.chart.data.labels.length > maxPoints) {
          this.state.plotState.chart.data.labels.shift()
          this.state.plotState.chart.data.datasets.forEach(dataset => dataset.data.shift())
        }

        this.state.plotState.chart.update('none') // Update without animation
      }

      // Schedule next acquisition
      setTimeout(() => this.acquirePlotData(), this.state.plotState.updateInterval)
    } catch (error) {
      console.error('[OI Plot] Failed to acquire data:', error)
      this.stopPlot()
    }
  }

  pauseResumePlot() {
    this.state.plotState.isPaused = !this.state.plotState.isPaused
    this.emit('render')
    
    if (!this.state.plotState.isPaused) {
      this.acquirePlotData()
    }
  }

  stopPlot() {
    this.state.plotState.isPlotting = false
    this.state.plotState.isPaused = false
    
    if (this.state.plotState.chart) {
      this.state.plotState.chart.destroy()
      this.state.plotState.chart = null
    }
    
    this.emit('render')
  }

  /**
   * Render Commands panel
   * Device control commands: save/load parameters, start/stop, reset
   */
  renderCommands() {
    // Initialize state
    if (!this.state.canScanResults) {
      this.state.canScanResults = []
    }
    if (!this.state.selectedNodeId) {
      this.state.selectedNodeId = 1
    }
    if (this.state.oiDeviceConnected === undefined) {
      this.state.oiDeviceConnected = false
    }
    if (this.state.isScanning === undefined) {
      this.state.isScanning = false
    }
    
    return this.html`
      <div class="oi-parameters-container">
        <h2 style="color: var(--scheme-primary); margin-bottom: 20px;">Device Control</h2>
        
        <!-- Device Connection Status & Control -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 16px; margin-bottom: 16px;">OpenInverter Connection</h3>
          
          <!-- Connection Status -->
          ${this.state.oiDeviceConnected ? this.html`
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #4ade80;"></div>
              <span style="color: #4ade80; font-weight: 600;">Connected to Node ID ${this.state.selectedNodeId}</span>
            </div>
            
            <button 
              class="secondary-button" 
              onclick=${() => this.disconnectDevice()}>
              Disconnect
            </button>
          ` : this.html`
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></div>
              <span style="color: #ef4444; font-weight: 600;">Not Connected to OpenInverter Device</span>
            </div>
            
            <!-- CAN Bus Scanner -->
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 style="font-size: 14px; margin: 0; color: var(--text-secondary);">Scan CAN Bus for Devices</h4>
                <div style="display: flex; gap: 8px;">
                  <button 
                    class="primary-button" 
                    onclick=${() => this.scanCanBus(false)}
                    disabled=${!this.state.isConnected || this.state.isScanning}
                    style="padding: 8px 16px; font-size: 13px;">
                    ${this.state.isScanning ? 'Scanning...' : 'Quick Scan'}
                  </button>
                  <button 
                    class="secondary-button" 
                    onclick=${() => this.scanCanBus(true)}
                    disabled=${!this.state.isConnected || this.state.isScanning}
                    style="padding: 8px 16px; font-size: 13px;">
                    Full Scan
                  </button>
                </div>
              </div>
              
              ${!this.state.isConnected ? this.html`
                <div style="text-align: center; padding: 16px; color: #ef4444; font-size: 13px; background: rgba(239, 68, 68, 0.1); border-radius: 4px;">
                  <p>⚠️ Please connect to ESP32 device via WebREPL first</p>
                </div>
              ` : this.state.isScanning ? this.html`
                <div style="padding: 16px;">
                  <div style="margin-bottom: 12px; color: var(--text-secondary); font-size: 13px; text-align: center;">
                    <p>Scanning CAN bus for devices...</p>
                    <p style="font-size: 12px; margin-top: 8px;">This may take a few seconds</p>
                  </div>
                </div>
              ` : this.state.scanMessage ? this.html`
                <div style="text-align: center; padding: 16px; color: var(--text-secondary); font-size: 13px; background: var(--bg-tertiary); border-radius: 4px;">
                  <p>${this.state.scanMessage}</p>
                </div>
              ` : this.state.canScanResults.length === 0 ? this.html`
                <div style="text-align: center; padding: 16px; color: var(--text-secondary); font-size: 13px;">
                  <p>Click "Quick Scan" to check node IDs 1-10, or "Full Scan" to check all 127 node IDs</p>
                </div>
              ` : this.html`
                <div style="border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; font-size: 13px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background: var(--bg-tertiary);">
                        <th style="padding: 6px 8px; text-align: left;">Node</th>
                        <th style="padding: 6px 8px; text-align: left;">Serial</th>
                        <th style="padding: 6px 8px; text-align: left;">Type</th>
                        <th style="padding: 6px 8px; text-align: left;"></th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.state.canScanResults.map(device => this.html`
                        <tr style="border-top: 1px solid var(--border-color);">
                          <td style="padding: 6px 8px;">${device.nodeId}</td>
                          <td style="padding: 6px 8px; font-family: monospace; font-size: 12px;">${device.serialNumber || '—'}</td>
                          <td style="padding: 6px 8px; font-size: 12px;">OI</td>
                          <td style="padding: 6px 8px; text-align: right;">
                            <button 
                              class="secondary-button" 
                              style="padding: 4px 8px; font-size: 11px;"
                              onclick=${() => this.connectToNode(device.nodeId)}>
                              Connect
                            </button>
                          </td>
                        </tr>
                      `)}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
            
            <!-- Manual Connection (alternative to scanning) -->
            <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
              <h4 style="font-size: 14px; margin-bottom: 12px; color: var(--text-secondary);">Or Connect Manually</h4>
              <div style="display: flex; gap: 12px; align-items: center;">
                <label style="display: flex; flex-direction: column; gap: 4px;">
                  <span style="font-size: 13px; color: var(--text-secondary);">Node ID</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="127" 
                    value=${this.state.selectedNodeId}
                    style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); width: 100px;"
                    oninput=${(e) => this.state.selectedNodeId = parseInt(e.target.value)}
                  />
                </label>
                
                <button 
                  class="primary-button" 
                  style="margin-top: 20px;"
                  onclick=${() => this.connectToDevice()}
                  disabled=${!this.state.isConnected}>
                  Connect
                </button>
              </div>
            </div>
          `}
        </div>
        
        <!-- Parameter Storage -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 16px; margin-bottom: 12px;">Parameter Storage</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="primary-button" onclick=${() => this.deviceSave()} disabled=${!this.state.oiDeviceConnected}>
              Save to Flash
            </button>
            <button class="secondary-button" onclick=${() => this.deviceLoad()} disabled=${!this.state.oiDeviceConnected}>
              Load from Flash
            </button>
            <button class="secondary-button" onclick=${() => this.deviceLoadDefaults()} disabled=${!this.state.oiDeviceConnected}>
              Load Factory Defaults
            </button>
          </div>
          <p style="color: var(--text-secondary); font-size: 13px; margin-top: 8px;">
            Save parameters to persistent storage or restore defaults
          </p>
        </div>

        <!-- Motor Control -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 16px; margin-bottom: 12px;">Motor Control</h3>
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <select id="oi-start-mode" style="padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);" disabled=${!this.state.oiDeviceConnected}>
              <option value="0">Off</option>
              <option value="1">Normal</option>
              <option value="2">Manual</option>
              <option value="3">Boost</option>
              <option value="4">Buck</option>
              <option value="5">Sine</option>
              <option value="6">ACHeat</option>
            </select>
            <button class="primary-button" onclick=${() => this.deviceStart()} disabled=${!this.state.oiDeviceConnected}>
              Start Motor
            </button>
            <button class="secondary-button" onclick=${() => this.deviceStop()} disabled=${!this.state.oiDeviceConnected}>
              Stop Motor
            </button>
          </div>
          <p style="color: var(--text-secondary); font-size: 13px; margin-top: 8px;">
            Start motor in selected mode or stop operation
          </p>
        </div>

        <!-- System Actions -->
        <div>
          <h3 style="font-size: 16px; margin-bottom: 12px;">System Actions</h3>
          <button class="secondary-button" style="background: #c0392b; color: white;" onclick=${() => this.deviceReset()} disabled=${!this.state.oiDeviceConnected}>
            Reset Device
          </button>
          <p style="color: var(--text-secondary); font-size: 13px; margin-top: 8px;">
            Perform a software reset of the device
          </p>
        </div>
      </div>
    `
  }

  async deviceSave() {
    try {
      await this.device.execute('from lib.OI_helpers import deviceSave; deviceSave()')
      alert('Parameters saved to flash')
    } catch (error) {
      alert('Failed to save parameters: ' + error.message)
    }
  }

  async deviceLoad() {
    try {
      await this.device.execute('from lib.OI_helpers import deviceLoad; deviceLoad()')
      alert('Parameters loaded from flash')
    } catch (error) {
      alert('Failed to load parameters: ' + error.message)
    }
  }

  async deviceLoadDefaults() {
    if (!confirm('Load factory defaults? This will overwrite all current parameters.')) return
    try {
      await this.device.execute('from lib.OI_helpers import deviceLoadDefaults; deviceLoadDefaults()')
      alert('Factory defaults loaded')
    } catch (error) {
      alert('Failed to load defaults: ' + error.message)
    }
  }

  async deviceStart() {
    const mode = document.getElementById('oi-start-mode')?.value || '1'
    try {
      await this.device.execute(`from lib.OI_helpers import deviceStart; deviceStart({'mode': ${mode}})`)
      alert('Device started in mode ' + mode)
    } catch (error) {
      alert('Failed to start device: ' + error.message)
    }
  }

  async deviceStop() {
    try {
      await this.device.execute('from lib.OI_helpers import deviceStop; deviceStop()')
      alert('Device stopped')
    } catch (error) {
      alert('Failed to stop device: ' + error.message)
    }
  }

  async deviceReset() {
    if (!confirm('Reset device? This will restart the controller.')) return
    try {
      await this.device.execute('from lib.OI_helpers import deviceReset; deviceReset()')
      alert('Device reset command sent')
    } catch (error) {
      alert('Failed to reset device: ' + error.message)
    }
  }

  /**
   * Render Errors panel
   * Display device info and error log
   */
  renderErrors() {
    // Load device info if not already loaded
    if (!this.state.oiDeviceInfo && !this.state.isLoadingDeviceInfo && this.state.isConnected) {
      setTimeout(() => this.loadDeviceInfo(), 0)
    }

    return this.html`
      <div class="oi-parameters-container">
        <h2 style="color: var(--scheme-primary); margin-bottom: 20px;">Device Information & Error Log</h2>
        
        ${this.renderDeviceInfoContent()}
      </div>
    `
  }

  renderDeviceInfoContent() {
    if (this.state.isLoadingDeviceInfo) {
      return this.html`
        <div style="text-align: center; padding: 40px;">
          <p style="color: var(--text-secondary);">Loading device information...</p>
        </div>
      `
    }

    if (!this.state.oiDeviceInfo) {
      return this.html`
        <div style="text-align: center; padding: 40px;">
          <p style="color: var(--text-secondary);">No device information available</p>
          <button class="primary-button" style="margin-top: 16px;" onclick=${() => this.loadDeviceInfo()}>
            Load Device Info
          </button>
        </div>
      `
    }

    const info = this.state.oiDeviceInfo
    const errors = this.state.oiErrorLog || []

    return this.html`
      <div>
        <!-- Device Info -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h3 style="font-size: 16px; margin-bottom: 12px;">Device Info</h3>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 8px; font-size: 14px;">
            <span style="color: var(--text-secondary);">Serial Number:</span>
            <span style="font-family: monospace;">${info.serialNumber || 'N/A'}</span>
            
            <span style="color: var(--text-secondary);">Node ID:</span>
            <span>${info.nodeId || 'N/A'}</span>
            
            <span style="color: var(--text-secondary);">Bitrate:</span>
            <span>${info.bitrate ? (info.bitrate / 1000) + ' kbps' : 'N/A'}</span>
            
            <span style="color: var(--text-secondary);">Uptime:</span>
            <span>${info.uptime ? Math.floor(info.uptime / 1000) + ' seconds' : 'N/A'}</span>
          </div>
        </div>

        <!-- Error Log -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 16px; margin: 0;">Error Log</h3>
            <button class="secondary-button" onclick=${() => this.loadDeviceInfo()}>
              Refresh
            </button>
          </div>
          
          ${errors.length === 0 ? this.html`
            <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
              No errors logged
            </p>
          ` : this.html`
            <div style="border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: var(--scheme-primary); color: white;">
                    <th style="padding: 8px; text-align: left;">Timestamp</th>
                    <th style="padding: 8px; text-align: left;">Error Code</th>
                    <th style="padding: 8px; text-align: left;">Description</th>
                  </tr>
                </thead>
                <tbody>
                  ${errors.map(err => this.html`
                    <tr style="border-bottom: 1px solid var(--border-color);">
                      <td style="padding: 8px; font-family: monospace; font-size: 13px;">${err.timestamp || 'N/A'}</td>
                      <td style="padding: 8px; font-family: monospace; font-weight: 600;">${err.code || 'N/A'}</td>
                      <td style="padding: 8px;">${err.description || 'N/A'}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `
  }

  // === Connection Management Methods ===

  async scanCanBus(fullScan = false) {
    this.state.isScanning = true
    this.state.canScanResults = []
    this.state.scanProgress = null
    this.emit('render')

    try {
      const scanArgs = JSON.stringify({ quick: !fullScan })
      const result = await this.device.execute(`from lib.OI_helpers import scanCanBus; scanCanBus('${scanArgs}')`) // Pass as JSON string, function will parse it
      const parsed = this.device.parseJSON(result)
      
      // Check if we got an error response
      if (parsed.ARG && parsed.ARG.error) {
        this.state.scanMessage = `Error: ${parsed.ARG.error}`
        this.state.canScanResults = []
      } else if (parsed.ARG && parsed.ARG.devices) {
        this.state.canScanResults = parsed.ARG.devices
        
        if (this.state.canScanResults.length === 0) {
          // Show helpful message when no devices found
          this.state.scanMessage = fullScan 
            ? `No devices found (scanned all 127 node IDs)`
            : `No devices found (scanned node IDs 1-10). Try "Full Scan" to check all 127 node IDs.`
        } else {
          this.state.scanMessage = null
        }
      } else {
        this.state.scanMessage = 'Scan completed but received unexpected response format'
      }
    } catch (error) {
      console.error('[OI Connection] Scan failed:', error)
      this.state.scanMessage = `Scan failed: ${error.message}`
      this.state.canScanResults = []
    } finally {
      this.state.isScanning = false
      this.state.scanProgress = null
      this.emit('render')
    }
  }

  async connectToDevice() {
    try {
      const args = JSON.stringify({ node_id: this.state.selectedNodeId })
      const result = await this.device.execute(`from lib.OI_helpers import initializeDevice; initializeDevice(${args})`)
      const parsed = this.device.parseJSON(result)
      
      if (parsed.success || (parsed.ARG && parsed.ARG.success)) {
        this.state.oiDeviceConnected = true
      } else {
        console.error('[OI Connection] Connection failed:', parsed)
        alert('Failed to connect to device. Check console for details.')
      }
    } catch (error) {
      console.error('[OI Connection] Connection error:', error)
      alert('Failed to connect: ' + error.message)
    }
    
    this.emit('render')
  }

  async connectToNode(nodeId) {
    this.state.selectedNodeId = nodeId
    await this.connectToDevice()
  }

  async disconnectDevice() {
    try {
      await this.device.execute('from lib.OI_helpers import disconnectDevice; disconnectDevice()')
      this.state.oiDeviceConnected = false
    } catch (error) {
      console.error('[OI Connection] Disconnect error:', error)
    }
    
    this.emit('render')
  }

  // === Firmware Upgrade Methods ===

  selectFirmwareFile(event) {
    const file = event.target.files[0]
    if (file) {
      this.state.firmwareUpgrade.selectedFile = file
      this.state.firmwareUpgrade.error = null
      this.emit('render')
    }
  }

  async startFirmwareUpgrade() {
    const fw = this.state.firmwareUpgrade
    
    if (!fw.selectedFile) {
      alert('Please select a firmware file')
      return
    }

    // Validate file is binary
    if (!fw.selectedFile.name.endsWith('.bin')) {
      fw.error = 'Firmware must be a .bin file'
      this.emit('render')
      return
    }

    // Confirm upgrade
    if (!confirm('Are you sure you want to upgrade the firmware? This process cannot be interrupted.')) {
      return
    }

    fw.inProgress = true
    fw.progress = 0
    fw.status = 'Reading firmware file...'
    fw.error = null
    this.emit('render')

    try {
      // Read file as bytes
      const fileData = await this.readFileAsBytes(fw.selectedFile)
      
      fw.status = 'Uploading firmware to device...'
      this.emit('render')

      // Upload firmware data to device (in chunks if needed)
      await this.uploadFirmwareData(fileData)

      fw.status = 'Starting upgrade process...'
      this.emit('render')

      // Start the upgrade
      const args = {
        recovery_mode: fw.recoveryMode,
        serial_number: fw.recoveryMode && fw.serialNumber ? fw.serialNumber : null,
        node_id: !fw.recoveryMode ? this.state.selectedNodeId : null
      }

      const argsStr = JSON.stringify(args)
      const result = await this.device.execute(`from lib.OI_helpers import startFirmwareUpgrade; startFirmwareUpgrade(${argsStr})`)
      const parsed = this.device.parseJSON(result)

      if (parsed.error || (parsed.ARG && parsed.ARG.error)) {
        throw new Error(parsed.error || parsed.ARG.error)
      }

      // Poll for progress
      await this.pollFirmwareProgress()

    } catch (error) {
      console.error('[OI Firmware] Upgrade failed:', error)
      fw.error = error.message || 'Upgrade failed'
      fw.inProgress = false
      this.emit('render')
    }
  }

  async readFileAsBytes(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const arrayBuffer = e.target.result
        const bytes = new Uint8Array(arrayBuffer)
        resolve(bytes)
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  async uploadFirmwareData(bytes) {
    const fw = this.state.firmwareUpgrade
    const chunkSize = 4096 // Upload in 4KB chunks
    const totalChunks = Math.ceil(bytes.length / chunkSize)

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, bytes.length)
      const chunk = Array.from(bytes.slice(start, end))
      
      const args = JSON.stringify({ chunk, offset: start })
      await this.device.execute(`from lib.OI_helpers import uploadFirmwareChunk; uploadFirmwareChunk(${args})`)
      
      fw.progress = (i / totalChunks) * 30 // First 30% is upload
      fw.status = `Uploading firmware... ${fw.progress.toFixed(0)}%`
      this.emit('render')
    }
  }

  async pollFirmwareProgress() {
    const fw = this.state.firmwareUpgrade
    const maxPolls = 600 // 10 minutes max (600 * 1 second)
    let polls = 0

    while (polls < maxPolls) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      try {
        const result = await this.device.execute('from lib.OI_helpers import getFirmwareUpgradeStatus; getFirmwareUpgradeStatus()')
        const parsed = this.device.parseJSON(result)
        const status = parsed.ARG || parsed

        if (status.error) {
          throw new Error(status.error)
        }

        fw.progress = 30 + (status.progress * 0.7) // Map 0-100% to 30-100%
        fw.status = status.message || 'Upgrading...'
        this.emit('render')

        if (status.complete) {
          fw.status = 'Upgrade completed successfully!'
          fw.progress = 100
          fw.inProgress = false
          this.emit('render')
          return
        }

      } catch (error) {
        console.error('[OI Firmware] Status poll error:', error)
        // Continue polling unless it's a critical error
      }

      polls++
    }

    throw new Error('Upgrade timeout')
  }

  async loadDeviceInfo() {
    this.state.isLoadingDeviceInfo = true
    this.emit('render')

    try {
      const infoResult = await this.device.execute('from lib.OI_helpers import getDeviceInfo; getDeviceInfo()')
      const info = this.device.parseJSON(infoResult)
      this.state.oiDeviceInfo = info.ARG || info

      const errorResult = await this.device.execute('from lib.OI_helpers import getErrorLog; getErrorLog()')
      const errors = this.device.parseJSON(errorResult)
      const errorList = errors.ARG || errors
      // Ensure errorLog is always an array
      this.state.oiErrorLog = Array.isArray(errorList) ? errorList : []
    } catch (error) {
      console.error('[OI App] Failed to load device info:', error)
      this.state.oiDeviceInfo = null
      this.state.oiErrorLog = []
    } finally {
      this.state.isLoadingDeviceInfo = false
      this.emit('render')
    }
  }
}

