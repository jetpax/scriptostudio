// === START_APP_CONFIG ===
// {
//   "name": "OpenInverter",
//   "id": "openinverter",
//   "version": [0, 2, 7],
//   "author": "JetPax",
//   "description": "OpenInverter debug and configuration tool for motor control parameters, spot values, CAN mapping, and live plotting",
//   "icon": "sliders",
//   "menu": [
//     { "id": "parameters", "label": "Parameters", "icon": "sliders" },
//     { "id": "spotvalues", "label": "Spot Values", "icon": "activity" },
//     { "id": "canmapping", "label": "CAN Mapping", "icon": "radio" },
//     { "id": "plot", "label": "Live Plot", "icon": "trending-up" }
//   ],
//   "styles": ".oi-compact-header { padding: 16px 20px !important; min-height: auto !important; display: flex; justify-content: space-between; align-items: center; } .oi-compact-header h2 { font-size: 18px !important; margin: 0 !important; } .oi-button-row { display: flex; flex-direction: row; gap: 8px; flex-wrap: wrap; align-items: center; } .oi-button-row .secondary-button, .oi-button-row .primary-button { padding: 6px 12px !important; font-size: 12px !important; font-weight: 600; text-transform: none; letter-spacing: normal; display: flex; align-items: center; gap: 6px; } .oi-button-row .secondary-button svg, .oi-button-row .primary-button svg { width: 14px; height: 14px; flex-shrink: 0; } .oi-parameters-container { padding: 20px; } .oi-category-section { margin-bottom: 32px; } .oi-category-title { font-size: 18px; font-weight: 600; color: var(--scheme-primary); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid var(--scheme-primary); } .oi-parameters-table { border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; } .oi-table-header, .oi-table-row { display: grid; grid-template-columns: 1.5fr 1fr 0.8fr 1.2fr 0.8fr; gap: 12px; padding: 6px 16px; align-items: center; } .oi-table-header { background: var(--scheme-primary); color: white; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; } .oi-table-row { border-bottom: 1px solid var(--border-color); transition: background 0.2s; padding: 3px 16px; } .oi-table-row:hover { background: var(--bg-tertiary); } .oi-table-row:last-child { border-bottom: none; } .oi-value-input, .oi-enum-select { width: 100%; padding: 6px 0px; border: 1px solid #34495e; border-radius: 4px; background: #2c3e50; color: #0fdb0f; font-size: 14px; font-family: 'Menlo', 'Monaco', 'Courier New', monospace; } .oi-value-input:focus, .oi-enum-select:focus { outline: none; border-color: var(--scheme-primary); box-shadow: 0 0 0 2px rgba(0, 129, 132, 0.2); } .oi-spotvalues-container { padding: 20px; } .oi-spotvalues-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; } .oi-spotvalue-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; transition: all 0.2s; } .oi-spotvalue-card:hover { border-color: var(--scheme-primary); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); } .oi-spotvalue-name { font-weight: 600; color: var(--scheme-primary); font-size: 13px; margin-bottom: 8px; } .oi-spotvalue-value { font-size: 24px; font-weight: 700; font-family: 'Menlo', Monaco, 'Courier New', monospace; color: white; } .oi-plot-container { display: flex; height: 500px; max-height: calc(100vh - 260px); gap: 20px; padding: 20px; overflow: hidden; } .oi-plot-sidebar { width: 280px; flex-shrink: 0; border-right: 1px solid var(--border-color); padding-right: 20px; overflow-y: auto; } .oi-plot-section-title { font-size: 14px; font-weight: 600; color: var(--scheme-primary); margin: 16px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; } .oi-plot-signal-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; } .oi-plot-signal { padding: 8px; border-radius: 4px; transition: background 0.2s; } .oi-plot-signal:hover { background: var(--bg-tertiary); } .oi-plot-signal label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; } .oi-plot-signal input[type=\"checkbox\"] { width: 16px; height: 16px; cursor: pointer; } .oi-plot-signal-name { font-weight: 600; color: var(--text-primary); } .oi-plot-signal-unit { color: var(--text-secondary); font-size: 12px; margin-left: auto; } .oi-plot-settings { display: flex; flex-direction: column; gap: 12px; } .oi-plot-settings label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text-secondary); } .oi-plot-settings input[type=\"number\"] { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-size: 13px; } .oi-plot-settings input[type=\"number\"]:focus { outline: none; border-color: var(--scheme-primary); box-shadow: 0 0 0 2px rgba(0, 129, 132, 0.2); } .oi-plot-chart-area { flex: 1; position: relative; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; min-height: 0; min-width: 0; display: flex; flex-direction: column; } .oi-plot-chart-area canvas { width: 100% !important; height: 100% !important; max-width: 100%; max-height: 100%; }"
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
          <div class="panel-actions oi-button-row">
            ${this.state.plotState.isPlotting ? this.html`
              <button 
                class="secondary-button" 
                onclick=${() => this.pauseResumePlot()}
                title="${this.state.plotState.isPaused ? 'Resume' : 'Pause'} plotting">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  ${this.state.plotState.isPaused ? this.html`
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  ` : this.html`
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  `}
                </svg>
                <span>${this.state.plotState.isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button 
                class="secondary-button" 
                onclick=${() => this.stopPlot()}
                title="Stop plotting">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="6" y="6" width="12" height="12"/>
                </svg>
                <span>Stop</span>
              </button>
            ` : this.html`
              <button 
                class="primary-button" 
                onclick=${() => this.startPlot()}
                disabled=${!this.state.isConnected || this.state.plotState.selectedVars.length === 0}
                title="Start plotting selected variables">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span>Start Plot</span>
              </button>
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

