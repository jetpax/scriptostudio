/**
 * Spot Values Tab - Complete Implementation
 * 
 * Real-time monitoring of device spot values (measurements).
 * Displays current values organized by category with units and mini-charts.
 * 
 * Features:
 * - Auto-refresh with configurable interval
 * - Inline mini-charts for selected parameters
 * - Historical data tracking
 * - Click to toggle chart display
 */

import { getSpotValues } from '../utils/oiHelpers.js'

/**
 * Render the Spot Values tab (Overview)
 * @this {OpenInverterExtension}
 */
function renderSpotValuesTab() {
  // Check if device is connected
  if (!this.state.oiDeviceConnected) {
    return this.html`
      <div style="padding: 60px 20px; text-align: center;">
        <p style="font-size: 18px; color: var(--text-primary); margin: 0 0 8px 0; font-weight: 600;">
          No Device Connected
        </p>
        <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">
          Use the Device Manager to scan and connect
        </p>
      </div>
    `
  }

  // autoRefreshInterval is initialized in constructor, no need to check here

  // Start auto-refresh if not already running
  if (!this.state.spotValueRefreshTimer) {
    startSpotValueAutoRefresh.call(this)
  }

  if (this.state.isLoadingOiSpotValues) {
    return this.html`
      <div style="padding: 60px 20px; text-align: center;">
        <p style="font-size: 16px; color: var(--text-secondary);">Loading spot values...</p>
      </div>
    `
  }

  if (!this.state.oiSpotValues || Object.keys(this.state.oiSpotValues).length === 0) {
    return this.html`
      <div style="padding: 60px 20px; text-align: center;">
        <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
          No spot values available
        </p>
        <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 0;">
          Refreshing automatically every ${this.state.autoRefreshInterval}ms...
        </p>
      </div>
    `
  }

  // Group spot values by category
  const categories = {}
  Object.entries(this.state.oiSpotValues).forEach(([name, spot]) => {
    const cat = spot.category || 'Uncategorized'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push({ name, ...spot })
  })

  return this.html`
    <section id="spot-values" class="card">
      <h2 class="section-header" onclick=${(e) => {
        const target = e.currentTarget.parentElement
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}>
        Spot Values
      </h2>

      <div style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); padding: 16px 20px; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
          <!-- Update interval input -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 14px; color: var(--text-secondary); white-space: nowrap;">
              Update Interval:
            </label>
            <input 
              type="number"
              value=${this.state.autoRefreshInterval}
              onfocus=${(e) => {
                // Stop auto-refresh while editing to prevent unnecessary polling
                if (this.state.spotValueRefreshTimer) {
                  stopSpotValueAutoRefresh.call(this)
                }
              }}
              onchange=${(e) => {
                updateRefreshInterval.call(this, e.target.value)
              }}
              onblur=${(e) => {
                updateRefreshInterval.call(this, e.target.value)
              }}
              min="100"
              max="10000"
              step="100"
              style="
                width: 80px;
                padding: 8px;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                font-size: 14px;
                font-family: 'Monaco', 'Courier New', monospace;
              "
            />
            <span style="font-size: 14px; color: var(--text-secondary);">ms</span>
          </div>
          
          <!-- Clear data button -->
          <button 
            class="secondary-button"
            onclick=${() => clearSpotValueHistory.call(this)}
            style="background: var(--oi-orange); padding: 8px 16px; margin-left: auto;">
            Clear Data
          </button>
        </div>
      </div>

      <div style="padding: 0 20px 20px;">
        <div class="spot-values-categories">
          ${Object.entries(categories).map(([category, spots]) => this.html`
            <div class="parameter-category">
              <h3 class="category-title">
                ${category}
                <span class="param-count">(${spots.length})</span>
              </h3>
              <div class="parameters-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
                ${spots.map(spot => renderSpotValueCard.call(this, spot))}
              </div>
            </div>
          `)}
        </div>
      </div>
    </section>
  `
}

/**
 * Render spot value card with inline mini-chart
 * @this {OpenInverterExtension}
 */
function renderSpotValueCard(spot) {
  // Ensure selectedChartParams is initialized
  if (!this.state.selectedChartParams) {
    this.state.selectedChartParams = new Set()
  }
  
  const isSelected = this.state.selectedChartParams.has(spot.name)
  const converted = convertSpotValue(spot.value, spot.unit)
  const formatted = formatParameterValue.call(this, spot, converted.value)
  
  // Get historical data for this parameter
  const history = this.state.spotValueHistory[spot.name] || []
  
  // Create a safe ID for the card (replace special chars)
  const cardId = `spot-card-${spot.name.replace(/[^a-zA-Z0-9]/g, '-')}`
  
  // Create click handler function
  const handleClick = () => {
    console.log('[OI] Clicked spot value card:', spot.name)
    toggleChartForParam.call(this, spot.name)
  }
  
  return this.html`
    <div 
      id="${cardId}"
      data-param-name="${spot.name}"
      role="button"
      tabindex="0"
      onclick=${handleClick}
      onkeydown=${(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      style="
        background: ${isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'};
        border: 2px solid ${isSelected ? 'var(--scheme-primary)' : 'var(--border-color)'};
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        gap: 12px;
      "
      onmouseover=${(e) => { 
        e.currentTarget.style.cursor = 'pointer'
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--scheme-primary)' 
      }}
      onmouseout=${(e) => { 
        e.currentTarget.style.cursor = 'pointer'
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)' 
      }}>
      
      <!-- Spot Value Header -->
      <div style="pointer-events: none;">
        <div style="font-size: 13px; font-weight: 600; color: var(--scheme-primary); margin-bottom: 8px;">
          ${spot.name}
        </div>
        <div class="spot-value-display" style="
          font-size: 20px; 
          font-weight: 600; 
          font-family: 'Press Start 2P', 'Monaco', 'Courier New', monospace; 
          background-color: #c8e4b7;
          color: #3b5e2b;
          padding: 10px 15px;
          border: 2px solid #5a7d4a;
          border-radius: 5px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
          line-height: 1.2;
          image-rendering: pixelated;
          background-image: repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 3px);
          text-align: right;
          letter-spacing: 0.05em;
        ">
          ${formatted}
        </div>
      </div>
      
      <div class="mini-chart-container" style="pointer-events: none;">
        ${isSelected ? renderMiniChart.call(this, spot.name, history, converted.unit) : ''}
      </div>
      
      <!-- Click hint -->
      <div style="font-size: 11px; color: var(--text-secondary); text-align: center; opacity: 0.7; pointer-events: none;">
        ${isSelected ? 'Click to hide chart' : 'Click to show chart'}
      </div>
    </div>
  `
}

/**
 * Render inline mini-chart using SVG
 * @this {OpenInverterExtension}
 */
function renderMiniChart(paramName, history, unit) {
  // Base dimensions for coordinate system
  const baseWidth = 500
  const height = 150
  const padding = { top: 10, right: 10, bottom: 40, left: 50 }
  const chartWidth = baseWidth - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  if (history.length < 2) {
    return this.html`
      <div style="width: 100%; height: ${height}px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 12px;">
        Collecting data...
      </div>
    `
  }

  // Extract values and timestamps
  const values = history.map(d => d.value)
  const timestamps = history.map(d => d.timestamp)

  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const minTime = Math.min(...timestamps)
  const maxTime = Math.max(...timestamps)

  const valueRange = maxValue - minValue || 1
  const timeRange = maxTime - minTime || 1

  // Scale functions
  const scaleX = (timestamp) => {
    return padding.left + ((timestamp - minTime) / timeRange) * chartWidth
  }

  const scaleY = (value) => {
    return padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight
  }

  // Generate Y-axis ticks (5 ticks)
  const yTicks = 5
  const yTickValues = Array.from({ length: yTicks }, (_, i) => {
    return minValue + (valueRange * i) / (yTicks - 1)
  })

  // Generate X-axis ticks (6 ticks)
  const xTicks = 6
  const xTickValues = Array.from({ length: xTicks }, (_, i) => {
    return minTime + (timeRange * i) / (xTicks - 1)
  })

  // Generate SVG path
  const linePath = history.map((point, index) => {
    const x = scaleX(point.timestamp)
    const y = scaleY(point.value)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  // Color based on parameter name
  const color = getColorForParam(paramName)

  return this.html`
    <svg width="100%" height="${height}" viewBox="0 0 ${baseWidth} ${height}" preserveAspectRatio="none" style="display: block; width: 100%;">
      <!-- Y-axis line -->
      <line
        x1="${padding.left}"
        y1="${padding.top}"
        x2="${padding.left}"
        y2="${height - padding.bottom}"
        stroke="#ccc"
        stroke-width="1"
      />

      <!-- X-axis line -->
      <line
        x1="${padding.left}"
        y1="${height - padding.bottom}"
        x2="${baseWidth - padding.right}"
        y2="${height - padding.bottom}"
        stroke="#ccc"
        stroke-width="1"
      />

      <!-- Y-axis ticks, labels, and grid lines -->
      ${yTickValues.map((value, i) => {
        const y = scaleY(value)
        return this.html`
          <g>
            <!-- Tick mark -->
            <line
              x1="${padding.left - 5}"
              y1="${y}"
              x2="${padding.left}"
              y2="${y}"
              stroke="#ccc"
              stroke-width="1"
            />
            <!-- Grid line -->
            <line
              x1="${padding.left}"
              y1="${y}"
              x2="${baseWidth - padding.right}"
              y2="${y}"
              stroke="#e0e0e0"
              stroke-width="1"
              stroke-dasharray="2,2"
            />
            <!-- Y-axis label -->
            <text
              x="${padding.left - 8}"
              y="${y}"
              text-anchor="end"
              dominant-baseline="middle"
              style="font-size: 10px; fill: #666; font-family: 'Monaco', 'Courier New', monospace;">
              ${value.toFixed(1)}
            </text>
          </g>
        `
      })}

      <!-- X-axis ticks, labels, and grid lines -->
      ${xTickValues.map((timestamp, i) => {
        const x = scaleX(timestamp)
        const date = new Date(timestamp)
        const timeLabel = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
        return this.html`
          <g>
            <!-- Tick mark -->
            <line
              x1="${x}"
              y1="${height - padding.bottom}"
              x2="${x}"
              y2="${height - padding.bottom + 5}"
              stroke="#ccc"
              stroke-width="1"
            />
            <!-- Grid line -->
            <line
              x1="${x}"
              y1="${padding.top}"
              x2="${x}"
              y2="${height - padding.bottom}"
              stroke="#e0e0e0"
              stroke-width="1"
              stroke-dasharray="2,2"
            />
            <!-- X-axis label -->
            <text
              x="${x}"
              y="${height - padding.bottom + 15}"
              text-anchor="middle"
              style="font-size: 9px; fill: #666; font-family: 'Monaco', 'Courier New', monospace;">
              ${timeLabel}
            </text>
          </g>
        `
      })}

      <!-- Data line -->
      <path
        d="${linePath}"
        fill="none"
        stroke="${color}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Data points -->
      ${history.map((point) => {
        const x = scaleX(point.timestamp)
        const y = scaleY(point.value)
        return this.html`
          <circle
            cx="${x}"
            cy="${y}"
            r="3"
            fill="${color}"
            stroke="white"
            stroke-width="1"
          />
        `
      })}

      <!-- Unit label (top right) -->
      <text
        x="${baseWidth - padding.right - 5}"
        y="${padding.top + 10}"
        text-anchor="end"
        style="font-size: 11px; fill: #666; font-weight: 600;">
        ${unit}
      </text>
    </svg>
  `
}

/**
 * Start auto-refresh timer for spot values
 * @this {OpenInverterExtension}
 */
function startSpotValueAutoRefresh() {
  // Clear existing timer if any
  if (this.state.spotValueRefreshTimer) {
    clearInterval(this.state.spotValueRefreshTimer)
  }
  
  // Refresh immediately
  refreshSpotValues.call(this)
  
  // Set up interval
  this.state.spotValueRefreshTimer = setInterval(() => {
    refreshSpotValues.call(this)
  }, this.state.autoRefreshInterval)
}

/**
 * Stop auto-refresh timer
 * @this {OpenInverterExtension}
 */
function stopSpotValueAutoRefresh() {
  if (this.state.spotValueRefreshTimer) {
    clearInterval(this.state.spotValueRefreshTimer)
    this.state.spotValueRefreshTimer = null
  }
}

/**
 * Refresh spot values from device
 * @this {OpenInverterExtension}
 */
async function refreshSpotValues() {
  if (!this.state.oiDeviceConnected) {
    stopSpotValueAutoRefresh.call(this)
    return
  }
  
  try {
    this.state.isLoadingOiSpotValues = true
    const spotValues = await getSpotValues.call(this)
    
    if (spotValues) {
      this.state.oiSpotValues = spotValues
      
      // Update history for selected parameters
      const timestamp = Date.now()
      Object.entries(spotValues).forEach(([name, spot]) => {
        if (this.state.selectedChartParams && this.state.selectedChartParams.has(name)) {
          if (!this.state.spotValueHistory[name]) {
            this.state.spotValueHistory[name] = []
          }
          
          // Convert value before storing
          const converted = convertSpotValue(spot.value, spot.unit)
          
          // Add to history
          this.state.spotValueHistory[name].push({
            timestamp,
            value: converted.value
          })
          
          // Limit history length (keep last 100 points)
          if (this.state.spotValueHistory[name].length > 100) {
            this.state.spotValueHistory[name].shift()
          }
        }
      })
    }
    
    this.state.isLoadingOiSpotValues = false
    
    // Only emit render if telemetry tab is currently active
    if (this.state.activeDeviceTab === 'telemetry') {
      this.emit('render')
    }
  } catch (error) {
    console.error('[OI] Failed to refresh spot values:', error)
    this.state.isLoadingOiSpotValues = false
  }
}

/**
 * Update refresh interval
 * @this {OpenInverterExtension}
 */
function updateRefreshInterval(value) {
  const interval = parseInt(value, 10)
  if (!isNaN(interval) && interval >= 100 && interval <= 10000) {
    this.state.autoRefreshInterval = interval
    
    // Restart timer with new interval (it may have been stopped during editing)
    stopSpotValueAutoRefresh.call(this)
    startSpotValueAutoRefresh.call(this)
  }
}

/**
 * Clear spot value history
 * @this {OpenInverterExtension}
 */
function clearSpotValueHistory() {
  this.state.spotValueHistory = {}
  this.emit('render')
}

/**
 * Toggle chart display for a parameter
 * @this {OpenInverterExtension}
 */
function toggleChartForParam(paramName) {
  if (!this.state.selectedChartParams) {
    this.state.selectedChartParams = new Set()
  }
  
  if (this.state.selectedChartParams.has(paramName)) {
    this.state.selectedChartParams.delete(paramName)
    // Clear history for this parameter
    delete this.state.spotValueHistory[paramName]
  } else {
    this.state.selectedChartParams.add(paramName)
    // Initialize history for this parameter
    if (!this.state.spotValueHistory[paramName]) {
      this.state.spotValueHistory[paramName] = []
    }
    
    // Add current value immediately for instant visual feedback
    if (this.state.oiSpotValues && this.state.oiSpotValues[paramName]) {
      const spot = this.state.oiSpotValues[paramName]
      const converted = convertSpotValue(spot.value, spot.unit)
      this.state.spotValueHistory[paramName].push({
        timestamp: Date.now(),
        value: converted.value
      })
    }
  }
  
  this.emit('render')
}

/**
 * Get consistent color for parameter name
 */
function getColorForParam(paramName) {
  // Simple hash function for consistent colors
  let hash = 0
  for (let i = 0; i < paramName.length; i++) {
    hash = paramName.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // OpenInverter color palette
  const colors = [
    'var(--oi-blue)',
    'var(--oi-orange)',
    'var(--oi-green)',
    '#9333ea', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f59e0b', // amber
    '#ef4444'  // red
  ]
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Convert spot value with unit prefix (from spotValueConversions.ts)
 */
function convertSpotValue(rawValue, unit) {
  if (!unit) {
    return { value: rawValue, unit: '' }
  }
  
  // Extract numeric prefix from unit (e.g., "10ms" -> "10", "100us" -> "100")
  const match = unit.match(/^(\d+)(.*)$/)
  
  if (match) {
    const multiplier = parseInt(match[1], 10)
    const baseUnit = match[2]
    const convertedValue = rawValue * multiplier
    
    return {
      value: convertedValue,
      unit: baseUnit
    }
  }
  
  // No conversion needed
  return { value: rawValue, unit }
}

/**
 * Format parameter value for display
 * @this {OpenInverterExtension}
 */
function formatParameterValue(spot, value) {
  const converted = convertSpotValue(value, spot.unit)
  
  // Format number
  let formatted
  if (converted.value === 0) {
    formatted = '0'
  } else if (Math.abs(converted.value) < 0.01) {
    formatted = converted.value.toExponential(2)
  } else if (Math.abs(converted.value) < 100) {
    formatted = converted.value.toFixed(2)
  } else {
    formatted = converted.value.toFixed(0)
  }
  
  // Add unit
  return converted.unit ? `${formatted} ${converted.unit}` : formatted
}

export { renderSpotValuesTab }
