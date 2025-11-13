// === START_APP_CONFIG ===
// {
//   "name": "OpenInverter",
//   "id": "openinverter",
//   "version": [0, 1, 2],
//   "author": "JetPax",
//   "description": "OpenInverter debug and configuration tool for motor control parameters, spot values, CAN mapping, and live plotting",
//   "icon": "sliders",
//   "menu": [
//     { "id": "parameters", "label": "Parameters", "icon": "sliders" },
//     { "id": "spotvalues", "label": "Spot Values", "icon": "activity" },
//     { "id": "canmapping", "label": "CAN Mapping", "icon": "radio" },
//     { "id": "plot", "label": "Live Plot", "icon": "trending-up" }
//   ],
//   "styles": ".oi-compact-header { padding: 12px 20px !important; min-height: auto !important; } .oi-compact-header h2 { font-size: 18px !important; margin: 0 !important; } .oi-button-row { display: flex; gap: 8px; flex-wrap: wrap; } .oi-compact-button { padding: 8px 16px !important; font-size: 13px !important; } .oi-parameters-container { padding: 20px; } .oi-category-section { margin-bottom: 32px; } .oi-category-title { font-size: 18px; font-weight: 600; color: var(--scheme-primary); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid var(--scheme-primary); } .oi-parameters-table { border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; } .oi-table-header, .oi-table-row { display: grid; grid-template-columns: 1.5fr 1fr 0.8fr 1.2fr 0.8fr; gap: 12px; padding: 8px 16px; align-items: center; } .oi-table-header { background: var(--scheme-primary); color: white; font-weight: 600; font-size: 13px; } .oi-table-row { border-bottom: 1px solid var(--border-color); transition: background 0.2s; } .oi-table-row:hover { background: var(--bg-tertiary); } .oi-table-row:last-child { border-bottom: none; } .oi-col-name { font-weight: 600; color: var(--text-primary); } .oi-col-unit, .oi-col-range, .oi-col-default { color: var(--text-secondary); font-size: 13px; } .oi-col-value input, .oi-col-value select { width: 100%; padding: 6px 8px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-primary); font-family: 'Menlo', Monaco, 'Courier New', monospace; font-size: 13px; } .oi-col-value input:focus, .oi-col-value select:focus { outline: none; border-color: var(--scheme-primary); box-shadow: 0 0 0 2px rgba(0, 129, 132, 0.2); } .oi-spotvalues-container { padding: 20px; } .oi-spotvalues-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; } .oi-spotvalue-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; transition: all 0.2s; } .oi-spotvalue-card:hover { border-color: var(--scheme-primary); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); } .oi-spotvalue-name { font-weight: 600; color: var(--scheme-primary); font-size: 13px; margin-bottom: 8px; } .oi-spotvalue-value { font-size: 24px; font-weight: 700; font-family: 'Menlo', Monaco, 'Courier New', monospace; color: white; }"
// }
// === END_APP_CONFIG ===

/**
 * OpenInverter App - Motor control and debugging interface
 * 
 * This app provides a complete interface for configuring and monitoring
 * OpenInverter motor controllers.
 */

class OpenInverterApp {
  constructor(deviceAPI, emit, state) {
    this.device = deviceAPI
    this.emit = emit
    this.state = state
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
    const result = await this.device.execute('from lib.OI_helpers import getSpotValues; getSpotValues()')
    const parsed = this.device.parseJSON(result)
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

    return html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Parameters</h2>
          <div class="panel-actions oi-button-row">
            <button 
              class="secondary-button oi-compact-button" 
              onclick=${() => this.loadParametersFromFile()}
              title="Load parameters from local JSON file"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Load from File
            </button>
            <button 
              class="secondary-button oi-compact-button" 
              onclick=${() => this.refreshParameters()}
              disabled=${!this.state.isConnected}
              title="Load parameters from connected device"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Load from Device
            </button>
            <button 
              class="primary-button oi-compact-button" 
              onclick=${() => this.saveParametersToFile()}
              disabled=${!this.state.oiParameters}
              title="Save parameters to local JSON file"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 10 12 15 7 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
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
      return html`
        <div class="panel-message">
          <p>Connect to device to view parameters</p>
        </div>
      `
    }
    
    if (this.state.isLoadingOiParameters) {
      return html`
        <div class="panel-message">
          <p>Loading parameters...</p>
        </div>
      `
    }
    
    if (!this.state.oiParameters || Object.keys(this.state.oiParameters).length === 0) {
      return html`
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
    
    return html`
      <div class="oi-parameters-container">
        ${Object.entries(categories).map(([category, params]) => html`
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
    
    return html`
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
    return html`
      <input 
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
    return html`
      <select 
        value="${param.value}"
        onchange=${(e) => this.updateParameter(param.name, parseInt(e.target.value))}
      >
        ${Object.entries(param.enums).map(([value, label]) => html`
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

    return html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Spot Values</h2>
          <div class="panel-actions oi-button-row">
            <button 
              class="secondary-button oi-compact-button" 
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
    if (!this.state.isConnected) {
      return html`
        <div class="panel-message">
          <p>Connect to device to view spot values</p>
        </div>
      `
    }
    
    if (this.state.isLoadingOiSpotValues) {
      return html`
        <div class="panel-message">
          <p>Loading spot values...</p>
        </div>
      `
    }
    
    if (!this.state.oiSpotValues || Object.keys(this.state.oiSpotValues).length === 0) {
      return html`
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
    
    return html`
      <div class="oi-spotvalues-container">
        ${Object.entries(categories).map(([category, spots]) => html`
          <div class="oi-category-section">
            <h3 class="oi-category-title">${category}</h3>
            <div class="oi-spotvalues-grid">
              ${spots.map(spot => html`
                <div class="oi-spotvalue-card">
                  <div class="oi-spotvalue-name">${spot.name}</div>
                  <div class="oi-spotvalue-value">
                    ${spot.value} ${spot.unit || ''}
                  </div>
                </div>
              `)}
            </div>
          </div>
        `)}
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
    return html`
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
   * Render Plot panel
   * Real-time plotting of selected parameters
   */
  renderPlot() {
    return html`
      <div class="system-panel">
        <div class="panel-header">
          <h2>Live Plot</h2>
        </div>
        
        <div class="panel-message">
          <p>Live plotting interface coming soon...</p>
          <p>This panel will display real-time graphs of motor parameters.</p>
        </div>
      </div>
    `
  }
}

