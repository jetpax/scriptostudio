/**
 * Plot Tab - Real-time plotting
 * 
 * Live plotting of selected spot values with Chart.js
 * Copied from original monolithic version (2871c08) lines 552-867
 */

export function renderPlotTab() {
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
                ${this.state.plotState.isPaused ? '▶' : '⏸'}
              </button>
              <div class="label active">${this.state.plotState.isPaused ? 'Run' : 'Pause'}</div>
            </div>
            <div class="button">
              <button 
                onclick=${() => this.stopPlot()}
                title="Stop plotting">
                ⏹
              </button>
              <div class="label active">Stop</div>
            </div>
          ` : this.html`
            <div class="button">
              <button 
                disabled=${!this.state.isConnected || this.state.plotState.selectedVars.length === 0}
                onclick=${() => this.startPlot()}
                title="Start plotting selected variables">
                ▶
              </button>
              <div class="label ${(!this.state.isConnected || this.state.plotState.selectedVars.length === 0) ? 'inactive' : 'active'}">Start Plot</div>
            </div>
          `}
        </div>
      </div>

      ${renderPlotContent.call(this)}
    </div>
  `
}

function renderPlotContent() {
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
          ${Object.entries(this.state.oiSpotValues).map(([name, spot]) => renderPlotSignal.call(this, name, spot))}
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

function renderPlotSignal(name, spot) {
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
