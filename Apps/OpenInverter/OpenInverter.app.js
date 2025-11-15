// === START_APP_CONFIG ===
// {
//   "name": "OpenInverter",
//   "id": "openinverter",
//   "version": [0, 4, 0],
//   "author": "JetPax",
//   "description": "OpenInverter debug and configuration tool for motor control parameters, spot values, CAN mapping, and live plotting",
//   "icon": "sliders",
//   "dependencies": [
//     {
//       "file": "lib/OI_helpers.py",
//       "destination": "/lib/OI_helpers.py",
//       "description": "OpenInverter parameter and CAN mapping helpers"
//     }
//   ],
//   "menu": [
//     { "id": "parameters", "label": "Parameters", "icon": "sliders" },
//     { "id": "spotvalues", "label": "Spot Values", "icon": "activity" },
//     { "id": "canmapping", "label": "CAN Mapping", "icon": "radio" },
//     { "id": "commands", "label": "Commands", "icon": "zap" },
//     { "id": "errors", "label": "Error Log", "icon": "alert-triangle" },
//     { "id": "plot", "label": "Live Plot", "icon": "trending-up" }
//   ],
//   "styles": ".oi-compact-header { padding: 16px 20px !important; min-height: auto !important; display: flex; justify-content: space-between; align-items: center; } .oi-compact-header h2 { font-size: 18px !important; margin: 0 !important; } .oi-button-row { display: flex; flex-direction: row; gap: 8px; flex-wrap: wrap; align-items: center; } .oi-button-row .secondary-button, .oi-button-row .primary-button { padding: 6px 12px !important; font-size: 12px !important; font-weight: 600; text-transform: none; letter-spacing: normal; display: flex; align-items: center; gap: 6px; } .oi-button-row .secondary-button svg, .oi-button-row .primary-button svg { width: 14px; height: 14px; flex-shrink: 0; } .oi-plot-controls { display: flex; gap: 20px; align-items: center; } .oi-plot-controls .button { display: flex; flex-direction: column; align-items: center; } .oi-plot-controls .codicon { font-size: 20px; } .oi-parameters-container { padding: 20px; } .oi-category-section { margin-bottom: 32px; } .oi-category-title { font-size: 18px; font-weight: 600; color: var(--scheme-primary); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid var(--scheme-primary); } .oi-parameters-table { border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; } .oi-table-header, .oi-table-row { display: grid; grid-template-columns: 1.5fr 1fr 0.8fr 1.2fr 0.8fr; gap: 12px; padding: 6px 16px; align-items: center; } .oi-table-header { background: var(--scheme-primary); color: white; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; } .oi-table-row { border-bottom: 1px solid var(--border-color); transition: background 0.2s; padding: 3px 16px; } .oi-table-row:hover { background: var(--bg-tertiary); } .oi-table-row:last-child { border-bottom: none; } .oi-value-input, .oi-enum-select { width: 100%; padding: 6px 0px; border: 1px solid #34495e; border-radius: 4px; background: #2c3e50; color: #0fdb0f; font-size: 14px; font-family: 'Menlo', 'Monaco', 'Courier New', monospace; } .oi-value-input:focus, .oi-enum-select:focus { outline: none; border-color: var(--scheme-primary); box-shadow: 0 0 0 2px rgba(0, 129, 132, 0.2); } .oi-spotvalues-container { padding: 20px; } .oi-spotvalues-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; } .oi-spotvalue-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; transition: all 0.2s; } .oi-spotvalue-card:hover { border-color: var(--scheme-primary); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); } .oi-spotvalue-name { font-weight: 600; color: var(--scheme-primary); font-size: 13px; margin-bottom: 8px; } .oi-spotvalue-value { font-size: 24px; font-weight: 700; font-family: 'Menlo', Monaco, 'Courier New', monospace; color: white; } .oi-plot-container { display: flex; height: 500px; max-height: calc(100vh - 260px); gap: 20px; padding: 20px; overflow: hidden; } .oi-plot-sidebar { width: 280px; flex-shrink: 0; border-right: 1px solid var(--border-color); padding-right: 20px; overflow-y: auto; } .oi-plot-section-title { font-size: 14px; font-weight: 600; color: var(--scheme-primary); margin: 16px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; } .oi-plot-signal-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; } .oi-plot-signal { padding: 8px; border-radius: 4px; transition: background 0.2s; } .oi-plot-signal:hover { background: var(--bg-tertiary); } .oi-plot-signal label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; } .oi-plot-signal input[type=\"checkbox\"] { width: 16px; height: 16px; cursor: pointer; } .oi-plot-signal-name { font-weight: 600; color: var(--text-primary); } .oi-plot-signal-unit { color: var(--text-secondary); font-size: 12px; margin-left: auto; } .oi-plot-settings { display: flex; flex-direction: column; gap: 12px; } .oi-plot-settings label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text-secondary); } .oi-plot-settings input[type=\"number\"] { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-size: 13px; } .oi-plot-settings input[type=\"number\"]:focus { outline: none; border-color: var(--scheme-primary); box-shadow: 0 0 0 2px rgba(0, 129, 132, 0.2); } .oi-plot-chart-area { flex: 1; position: relative; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; min-height: 0; min-width: 0; display: flex; flex-direction: column; } .oi-plot-chart-area canvas { width: 100% !important; height: 100% !important; max-width: 100%; max-height: 100%; }"
// }
// === END_APP_CONFIG ===

/**
 * OpenInverter App - Motor control and debugging interface
 * 
 * This app provides a complete interface for configuring and monitoring
 * OpenInverter motor controllers.
 */

class OpenInverterApp {
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
    // Create file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        
        // Validate it's a parameters file
        if (!data || typeof data !== 'object') {
          alert('Invalid parameter file format')
          return
        }
        
        // Set as current parameters (won't write to device yet)
        this.state.oiParameters = data
        this.emit('render')
        
        alert(`Loaded ${Object.keys(data).length} parameters from file`)
      } catch (error) {
        console.error('[OI App] Failed to load file:', error)
        alert(`Failed to load file: ${error.message}`)
      }
    }
    
    input.click()
  }

  saveParametersToFile() {
    if (!this.state.oiParameters) {
      alert('No parameters to save')
      return
    }
    
    // Create JSON blob
    const json = JSON.stringify(this.state.oiParameters, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `oi_parameters_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    
    URL.revokeObjectURL(url)
  }

  async scanCanBus() {
    if (!confirm('Scan CAN bus for OpenInverter devices? This will take a few seconds.')) return
    
    try {
      const result = await this.device.execute('from lib.OI_helpers import scanCanBus; scanCanBus()')
      const parsed = this.device.parseJSON(result)
      const data = parsed.ARG || parsed
      
      if (data.nodes && data.nodes.length > 0) {
        const nodeList = data.nodes.map(n => `Node ${n.node_id}`).join(', ')
        alert(`Found ${data.nodes.length} device(s):\n${nodeList}\n\nScanned ${data.scanned} addresses.`)
      } else {
        alert(`No devices found. Scanned ${data.scanned} addresses.`)
      }
    } catch (error) {
      console.error('[OI App] Scan failed:', error)
      alert(`Scan failed: ${error.message}`)
    }
  }

  async initializeCanDevice(nodeId = 1, bitrate = 500000) {
    try {
      const args = JSON.stringify({ node_id: nodeId, bitrate: bitrate })
      await this.device.execute(`from lib.OI_helpers import initializeDevice; initializeDevice(${args})`)
      alert(`CAN initialized (Node ${nodeId}, ${bitrate} bps)`)
    } catch (error) {
      console.error('[OI App] CAN initialization failed:', error)
      alert(`CAN initialization failed: ${error.message}`)
    }
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
    // Initialize CAN mapping state if needed
    if (!this.state.canMappingState) {
      this.state.canMappingState = {
        direction: 'tx',  // 'tx' or 'rx'
        mappings: null,
        isLoading: false,
        showAddForm: false
      }
    }

    // Load mappings if not already loaded and connected
    if (!this.state.canMappingState.mappings && !this.state.canMappingState.isLoading && this.state.isConnected) {
      setTimeout(() => this.refreshCanMappings(), 0)
    }

    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>CAN Mapping</h2>
          <div class="panel-actions oi-button-row">
            <button 
              class="secondary-button" 
              onclick=${() => this.refreshCanMappings()}
              disabled=${!this.state.isConnected || this.state.canMappingState.isLoading}
              title="Refresh mappings from device"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Refresh
            </button>
            <button 
              class="secondary-button" 
              onclick=${() => { this.state.canMappingState.showAddForm = !this.state.canMappingState.showAddForm; this.emit('render'); }}
              disabled=${!this.state.isConnected}
              title="Add new CAN mapping"
            >
              ${this.state.canMappingState.showAddForm ? 'Cancel' : '+ Add Mapping'}
            </button>
            <button 
              class="secondary-button" 
              onclick=${() => this.clearCanMappings()}
              disabled=${!this.state.isConnected}
              title="Clear all mappings"
            >
              Clear All
            </button>
          </div>
        </div>
        
        ${this.renderCanMappingContent()}
      </div>
    `
  }

  renderCanMappingContent() {
    if (!this.state.isConnected) {
      return this.html`
        <div class="panel-message">
          <p>Connect to device to view/configure CAN mappings</p>
        </div>
      `
    }

    if (this.state.canMappingState.isLoading) {
      return this.html`
        <div class="panel-message">
          <p>Loading CAN mappings...</p>
        </div>
      `
    }

    return this.html`
      <div class="oi-parameters-container">
        ${this.state.canMappingState.showAddForm ? this.renderAddMappingForm() : ''}
        
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <button 
            class="${this.state.canMappingState.direction === 'tx' ? 'primary-button' : 'secondary-button'}"
            onclick=${() => { this.state.canMappingState.direction = 'tx'; this.emit('render'); }}
          >
            TX (Transmit)
          </button>
          <button 
            class="${this.state.canMappingState.direction === 'rx' ? 'primary-button' : 'secondary-button'}"
            onclick=${() => { this.state.canMappingState.direction = 'rx'; this.emit('render'); }}
          >
            RX (Receive)
          </button>
        </div>

        ${this.renderCanMappingList()}
      </div>
    `
  }

  renderAddMappingForm() {
    if (!this.state.addMappingForm) {
      this.state.addMappingForm = {
        canId: '0x500',
        paramName: '',
        position: 0,
        length: 16,
        gain: 1.0,
        offset: 0,
        isExtended: false
      }
    }

    const paramNames = this.state.oiParameters ? Object.keys(this.state.oiParameters) : []
    const spotNames = this.state.oiSpotValues ? Object.keys(this.state.oiSpotValues) : []
    const allNames = [...paramNames, ...spotNames].sort()

    return this.html`
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 16px 0; font-size: 16px; color: var(--scheme-primary);">Add CAN Mapping</h3>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: var(--text-secondary);">CAN ID</label>
            <input 
              type="text" 
              class="oi-value-input"
              value="${this.state.addMappingForm.canId}"
              onchange=${(e) => { this.state.addMappingForm.canId = e.target.value; }}
              placeholder="0x500"
            />
          </div>

          <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: var(--text-secondary);">Parameter</label>
            <select 
              class="oi-enum-select"
              onchange=${(e) => { this.state.addMappingForm.paramName = e.target.value; }}
            >
              <option value="">Select parameter...</option>
              ${allNames.map(name => this.html`
                <option value="${name}" ${this.state.addMappingForm.paramName === name ? 'selected' : ''}>
                  ${name}
                </option>
              `)}
            </select>
          </div>

          <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: var(--text-secondary);">Position (bits)</label>
            <input 
              type="number" 
              class="oi-value-input"
              value="${this.state.addMappingForm.position}"
              onchange=${(e) => { this.state.addMappingForm.position = parseInt(e.target.value); }}
              min="0"
              max="63"
            />
          </div>

          <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: var(--text-secondary);">Length (bits)</label>
            <input 
              type="number" 
              class="oi-value-input"
              value="${this.state.addMappingForm.length}"
              onchange=${(e) => { this.state.addMappingForm.length = parseInt(e.target.value); }}
              min="-32"
              max="32"
            />
            <span style="font-size: 11px; color: var(--text-secondary);">Negative = big-endian</span>
          </div>

          <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: var(--text-secondary);">Gain</label>
            <input 
              type="number" 
              class="oi-value-input"
              value="${this.state.addMappingForm.gain}"
              onchange=${(e) => { this.state.addMappingForm.gain = parseFloat(e.target.value); }}
              step="0.1"
            />
          </div>

          <div>
            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: var(--text-secondary);">Offset</label>
            <input 
              type="number" 
              class="oi-value-input"
              value="${this.state.addMappingForm.offset}"
              onchange=${(e) => { this.state.addMappingForm.offset = parseInt(e.target.value); }}
              min="-128"
              max="127"
            />
          </div>
        </div>

        <div style="margin-top: 16px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input 
              type="checkbox"
              checked=${this.state.addMappingForm.isExtended}
              onchange=${(e) => { this.state.addMappingForm.isExtended = e.target.checked; }}
            />
            Extended Frame (29-bit CAN ID)
          </label>
        </div>

        <div style="margin-top: 16px; display: flex; gap: 8px;">
          <button 
            class="primary-button"
            onclick=${() => this.addCanMapping()}
            disabled=${!this.state.addMappingForm.paramName}
          >
            Add Mapping
          </button>
          <button 
            class="secondary-button"
            onclick=${() => { this.state.canMappingState.showAddForm = false; this.emit('render'); }}
          >
            Cancel
          </button>
        </div>
      </div>
    `
  }

  renderCanMappingList() {
    const mappings = this.state.canMappingState.mappings
    if (!mappings) {
      return this.html`
        <div class="panel-message">
          <p>No mappings loaded. Click Refresh to load from device.</p>
        </div>
      `
    }

    const direction = this.state.canMappingState.direction
    const directionMappings = mappings[direction] || []

    if (directionMappings.length === 0) {
      return this.html`
        <div class="panel-message">
          <p>No ${direction.toUpperCase()} mappings configured.</p>
        </div>
      `
    }

    return this.html`
      <div>
        ${directionMappings.map((msg, msgIdx) => this.renderCanMessage(msg, msgIdx))}
      </div>
    `
  }

  renderCanMessage(msg, msgIdx) {
    const canIdStr = msg.isExtended ? `0x${msg.canId.toString(16).padStart(8, '0')}` : `0x${msg.canId.toString(16).padStart(3, '0')}`
    
    return this.html`
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="margin: 0; font-size: 15px; color: var(--scheme-primary);">
            CAN ID: ${canIdStr} ${msg.isExtended ? '(Extended)' : ''}
          </h4>
        </div>

        <div class="oi-parameters-table">
          <div class="oi-table-header" style="grid-template-columns: 2fr 1fr 1fr 1fr 1fr 0.5fr;">
            <div>Parameter</div>
            <div>Position</div>
            <div>Length</div>
            <div>Gain</div>
            <div>Offset</div>
            <div>Action</div>
          </div>
          ${msg.params.map((param, paramIdx) => this.renderCanParameter(param, msgIdx, paramIdx))}
        </div>
      </div>
    `
  }

  renderCanParameter(param, msgIdx, paramIdx) {
    // Find parameter name from ID
    const paramName = this.getParameterNameById(param.paramId) || `ID ${param.paramId}`
    
    return this.html`
      <div class="oi-table-row" style="grid-template-columns: 2fr 1fr 1fr 1fr 1fr 0.5fr;">
        <div><strong>${paramName}</strong></div>
        <div>${param.position}</div>
        <div>${param.length}</div>
        <div>${param.gain}</div>
        <div>${param.offset}</div>
        <div>
          <button 
            class="secondary-button"
            onclick=${() => this.removeCanMapping(msgIdx, paramIdx)}
            title="Remove mapping"
            style="padding: 4px 8px; font-size: 11px;"
          >
            Remove
          </button>
        </div>
      </div>
    `
  }

  getParameterNameById(paramId) {
    // Search in parameters
    if (this.state.oiParameters) {
      for (const [name, param] of Object.entries(this.state.oiParameters)) {
        if (param.id === paramId) return name
      }
    }
    // Search in spot values
    if (this.state.oiSpotValues) {
      for (const [name, spot] of Object.entries(this.state.oiSpotValues)) {
        if (spot.id === paramId) return name
      }
    }
    return null
  }

  async refreshCanMappings() {
    if (this.state.canMappingState.isLoading) return

    this.state.canMappingState.isLoading = true
    this.emit('render')

    try {
      const result = await this.device.execute('from lib.OI_helpers import getCanMap; getCanMap()')
      const parsed = this.device.parseJSON(result)
      this.state.canMappingState.mappings = parsed.ARG || parsed
      this.state.canMappingState.isLoading = false
      this.emit('render')
    } catch (error) {
      console.error('[OI App] Failed to load CAN mappings:', error)
      this.state.canMappingState.isLoading = false
      this.emit('render')
      alert(`Failed to load CAN mappings: ${error.message}`)
    }
  }

  async addCanMapping() {
    const form = this.state.addMappingForm
    
    // Parse CAN ID (supports hex or decimal)
    let canId
    try {
      canId = form.canId.startsWith('0x') ? parseInt(form.canId, 16) : parseInt(form.canId)
    } catch {
      alert('Invalid CAN ID format')
      return
    }

    const args = {
      can_id: canId,
      param_name: form.paramName,
      position: form.position,
      length: form.length,
      gain: form.gain,
      offset: form.offset,
      is_tx: this.state.canMappingState.direction === 'tx',
      is_extended: form.isExtended
    }

    try {
      const argsStr = JSON.stringify(args)
      await this.device.execute(`from lib.OI_helpers import addCanMapping; addCanMapping(${argsStr})`)
      
      // Refresh mappings and hide form
      this.state.canMappingState.showAddForm = false
      await this.refreshCanMappings()
    } catch (error) {
      console.error('[OI App] Failed to add CAN mapping:', error)
      alert(`Failed to add mapping: ${error.message}`)
    }
  }

  async removeCanMapping(msgIdx, paramIdx) {
    if (!confirm('Remove this CAN mapping?')) return

    const args = {
      direction: this.state.canMappingState.direction,
      msg_index: msgIdx,
      param_index: paramIdx
    }

    try {
      const argsStr = JSON.stringify(args)
      await this.device.execute(`from lib.OI_helpers import removeCanMapping; removeCanMapping(${argsStr})`)
      await this.refreshCanMappings()
    } catch (error) {
      console.error('[OI App] Failed to remove CAN mapping:', error)
      alert(`Failed to remove mapping: ${error.message}`)
    }
  }

  async clearCanMappings() {
    const direction = this.state.canMappingState.direction
    if (!confirm(`Clear all ${direction.toUpperCase()} CAN mappings?`)) return

    const args = { direction }

    try {
      const argsStr = JSON.stringify(args)
      await this.device.execute(`from lib.OI_helpers import clearCanMap; clearCanMap(${argsStr})`)
      await this.refreshCanMappings()
    } catch (error) {
      console.error('[OI App] Failed to clear CAN mappings:', error)
      alert(`Failed to clear mappings: ${error.message}`)
    }
  }

  /**
   * Render Commands panel
   * Device control commands
   */
  renderCommands() {
    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Device Commands</h2>
        </div>
        
        ${this.renderCommandsContent()}
      </div>
    `
  }

  renderCommandsContent() {
    if (!this.state.isConnected) {
      return this.html`
        <div class="panel-message">
          <p>Connect to device to use commands</p>
        </div>
      `
    }

    return this.html`
      <div class="oi-parameters-container">
        <div class="oi-category-section">
          <h3 class="oi-category-title">Parameter Storage</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button 
              class="secondary-button"
              onclick=${() => this.deviceSave()}
              style="padding: 12px 24px; font-size: 14px;"
            >
              💾 Save to Flash
            </button>
            <button 
              class="secondary-button"
              onclick=${() => this.deviceLoad()}
              style="padding: 12px 24px; font-size: 14px;"
            >
              📂 Load from Flash
            </button>
            <button 
              class="secondary-button"
              onclick=${() => this.deviceLoadDefaults()}
              style="padding: 12px 24px; font-size: 14px; color: #ff6b6b;"
            >
              ⚠️ Load Defaults
            </button>
          </div>
        </div>

        <div class="oi-category-section">
          <h3 class="oi-category-title">Device Control</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <select 
              id="start-mode-select"
              class="oi-enum-select"
              style="width: 200px;"
            >
              <option value="0">Normal</option>
              <option value="1">Manual</option>
              <option value="2">Boost</option>
              <option value="3">Buck</option>
              <option value="4">Sine</option>
              <option value="5">ACHeat</option>
            </select>
            <button 
              class="primary-button"
              onclick=${() => {
                const modeSelect = document.getElementById('start-mode-select')
                const mode = parseInt(modeSelect.value)
                this.deviceStart(mode)
              }}
              style="padding: 12px 24px; font-size: 14px; background: #51cf66;"
            >
              ▶️ Start Device
            </button>
            <button 
              class="secondary-button"
              onclick=${() => this.deviceStop()}
              style="padding: 12px 24px; font-size: 14px; background: #ff6b6b; color: white;"
            >
              ⏹️ Stop Device
            </button>
          </div>
        </div>

        <div class="oi-category-section">
          <h3 class="oi-category-title">System</h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button 
              class="secondary-button"
              onclick=${() => this.deviceReset()}
              style="padding: 12px 24px; font-size: 14px;"
            >
              🔄 Reset Device
            </button>
          </div>
        </div>
      </div>
    `
  }

  async deviceSave() {
    try {
      await this.device.execute('from lib.OI_helpers import deviceSave; deviceSave()')
      alert('Parameters saved to device flash')
    } catch (error) {
      console.error('[OI App] Failed to save:', error)
      alert(`Failed to save: ${error.message}`)
    }
  }

  async deviceLoad() {
    if (!confirm('Load parameters from flash? This will overwrite current values.')) return
    
    try {
      await this.device.execute('from lib.OI_helpers import deviceLoad; deviceLoad()')
      alert('Parameters loaded from device flash')
      // Refresh parameters
      await this.refreshParameters()
    } catch (error) {
      console.error('[OI App] Failed to load:', error)
      alert(`Failed to load: ${error.message}`)
    }
  }

  async deviceLoadDefaults() {
    if (!confirm('Load factory defaults? This will reset all parameters!')) return
    if (!confirm('Are you SURE? This cannot be undone!')) return
    
    try {
      await this.device.execute('from lib.OI_helpers import deviceLoadDefaults; deviceLoadDefaults()')
      alert('Default parameters loaded')
      // Refresh parameters
      await this.refreshParameters()
    } catch (error) {
      console.error('[OI App] Failed to load defaults:', error)
      alert(`Failed to load defaults: ${error.message}`)
    }
  }

  async deviceStart(mode) {
    const modeNames = ['Normal', 'Manual', 'Boost', 'Buck', 'Sine', 'ACHeat']
    const modeName = modeNames[mode] || `Mode ${mode}`
    
    if (!confirm(`Start device in ${modeName} mode?`)) return
    
    try {
      const args = JSON.stringify({ mode })
      await this.device.execute(`from lib.OI_helpers import deviceStart; deviceStart(${args})`)
      alert(`Device started in ${modeName} mode`)
    } catch (error) {
      console.error('[OI App] Failed to start:', error)
      alert(`Failed to start: ${error.message}`)
    }
  }

  async deviceStop() {
    if (!confirm('Stop device operation?')) return
    
    try {
      await this.device.execute('from lib.OI_helpers import deviceStop; deviceStop()')
      alert('Device stopped')
    } catch (error) {
      console.error('[OI App] Failed to stop:', error)
      alert(`Failed to stop: ${error.message}`)
    }
  }

  async deviceReset() {
    if (!confirm('Reset device? This will reboot the controller.')) return
    
    try {
      await this.device.execute('from lib.OI_helpers import deviceReset; deviceReset()')
      alert('Device reset command sent')
    } catch (error) {
      console.error('[OI App] Failed to reset:', error)
      alert(`Failed to reset: ${error.message}`)
    }
  }

  /**
   * Render Error Log panel
   * Display device errors
   */
  renderErrors() {
    // Initialize error log state if needed
    if (!this.state.errorLogState) {
      this.state.errorLogState = {
        errors: null,
        isLoading: false,
        deviceInfo: null
      }
    }

    // Auto-load errors if not loaded
    if (!this.state.errorLogState.errors && !this.state.errorLogState.isLoading && this.state.isConnected) {
      setTimeout(() => this.refreshErrorLog(), 0)
    }

    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Error Log & Device Info</h2>
          <div class="panel-actions oi-button-row">
            <button 
              class="secondary-button" 
              onclick=${() => this.refreshErrorLog()}
              disabled=${!this.state.isConnected || this.state.errorLogState.isLoading}
              title="Refresh error log"
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
        
        ${this.renderErrorLogContent()}
      </div>
    `
  }

  renderErrorLogContent() {
    if (!this.state.isConnected) {
      return this.html`
        <div class="panel-message">
          <p>Connect to device to view errors</p>
        </div>
      `
    }

    if (this.state.errorLogState.isLoading) {
      return this.html`
        <div class="panel-message">
          <p>Loading error log...</p>
        </div>
      `
    }

    return this.html`
      <div class="oi-parameters-container">
        ${this.renderDeviceInfo()}
        ${this.renderErrorLogList()}
      </div>
    `
  }

  renderDeviceInfo() {
    const info = this.state.errorLogState.deviceInfo
    if (!info) return ''

    return this.html`
      <div class="oi-category-section">
        <h3 class="oi-category-title">Device Information</h3>
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            ${info.serialNumber ? this.html`
              <div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Serial Number</div>
                <div style="font-weight: 600; font-family: monospace;">${info.serialNumber}</div>
              </div>
            ` : ''}
            ${info.node_id !== undefined ? this.html`
              <div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Node ID</div>
                <div style="font-weight: 600;">${info.node_id}</div>
              </div>
            ` : ''}
            ${info.bitrate ? this.html`
              <div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">CAN Bitrate</div>
                <div style="font-weight: 600;">${info.bitrate} bps</div>
              </div>
            ` : ''}
            ${info.uptime !== undefined ? this.html`
              <div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Uptime</div>
                <div style="font-weight: 600;">${info.uptime} seconds</div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `
  }

  renderErrorLogList() {
    const errors = this.state.errorLogState.errors
    if (!errors) {
      return this.html`
        <div class="oi-category-section">
          <h3 class="oi-category-title">Error Log</h3>
          <div class="panel-message">
            <p>Click Refresh to load error log</p>
          </div>
        </div>
      `
    }

    if (errors.length === 0) {
      return this.html`
        <div class="oi-category-section">
          <h3 class="oi-category-title">Error Log</h3>
          <div class="panel-message">
            <p>No errors logged ✓</p>
          </div>
        </div>
      `
    }

    return this.html`
      <div class="oi-category-section">
        <h3 class="oi-category-title">Error Log (${errors.length} entries)</h3>
        <div class="oi-parameters-table">
          <div class="oi-table-header" style="grid-template-columns: 1fr 1fr 2fr;">
            <div>Timestamp</div>
            <div>Code</div>
            <div>Description</div>
          </div>
          ${errors.map(error => this.html`
            <div class="oi-table-row" style="grid-template-columns: 1fr 1fr 2fr;">
              <div>${error.timestamp}</div>
              <div>${error.code}</div>
              <div>${error.description}</div>
            </div>
          `)}
        </div>
      </div>
    `
  }

  async refreshErrorLog() {
    if (this.state.errorLogState.isLoading) return

    this.state.errorLogState.isLoading = true
    this.emit('render')

    try {
      // Get device info
      const infoResult = await this.device.execute('from lib.OI_helpers import getDeviceInfo; getDeviceInfo()')
      const infoParsed = this.device.parseJSON(infoResult)
      this.state.errorLogState.deviceInfo = infoParsed.ARG || infoParsed

      // Try to get serial number
      try {
        const serialResult = await this.device.execute('from lib.OI_helpers import getSerialNumber; getSerialNumber()')
        const serialParsed = this.device.parseJSON(serialResult)
        const serialData = serialParsed.ARG || serialParsed
        if (serialData.serialNumber) {
          this.state.errorLogState.deviceInfo.serialNumber = serialData.serialNumber
        }
      } catch (e) {
        console.log('[OI App] Could not read serial number:', e)
      }

      // Get error log
      const errorResult = await this.device.execute('from lib.OI_helpers import getErrorLog; getErrorLog()')
      const errorParsed = this.device.parseJSON(errorResult)
      const errorData = errorParsed.ARG || errorParsed
      this.state.errorLogState.errors = errorData.errors || []

      this.state.errorLogState.isLoading = false
      this.emit('render')
    } catch (error) {
      console.error('[OI App] Failed to load error log:', error)
      this.state.errorLogState.isLoading = false
      this.emit('render')
      alert(`Failed to load error log: ${error.message}`)
    }
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
}

