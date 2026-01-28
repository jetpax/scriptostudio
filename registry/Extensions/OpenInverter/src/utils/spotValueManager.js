/**
 * Spot Value Manager
 * 
 * Manages spot value polling, history tracking, and chart data preparation.
 */

/**
 * Start spot value polling
 * Sets up interval to fetch spot values periodically
 * 
 * @this {OpenInverterExtension}
 * @param {number} [interval=1000] - Polling interval in milliseconds
 * @returns {number} - Interval ID (for clearInterval)
 */
function startSpotValuePolling(interval = 1000) {
  // Stop existing polling if any
  if (this.state.spotValuePollingInterval) {
    clearInterval(this.state.spotValuePollingInterval)
  }
  
  // Start new polling
  const intervalId = setInterval(async () => {
    try {
      const spotValues = await getSpotValues.call(this)
      updateSpotValueHistory.call(this, spotValues)
      this.emit('render')
    } catch (error) {
      console.error('[Spot Values] Polling error:', error)
    }
  }, interval)
  
  this.state.spotValuePollingInterval = intervalId
  return intervalId
}

/**
 * Stop spot value polling
 * 
 * @this {OpenInverterExtension}
 */
function stopSpotValuePolling() {
  if (this.state.spotValuePollingInterval) {
    clearInterval(this.state.spotValuePollingInterval)
    this.state.spotValuePollingInterval = null
  }
}

/**
 * Update spot value history
 * Maintains a rolling window of historical values for charting
 * 
 * @this {OpenInverterExtension}
 * @param {Object} spotValues - Current spot values
 * @param {number} [maxHistory=100] - Maximum history entries to keep
 */
function updateSpotValueHistory(spotValues, maxHistory = 100) {
  const timestamp = Date.now()
  
  // Initialize history if needed
  if (!this.state.spotValueHistory) {
    this.state.spotValueHistory = {}
  }
  
  // Update history for each parameter
  if (spotValues && typeof spotValues === 'object') {
    for (const category in spotValues) {
      if (typeof spotValues[category] === 'object') {
        for (const paramName in spotValues[category]) {
          const value = spotValues[category][paramName]
          
          // Skip non-numeric values
          if (typeof value !== 'number') continue
          
          // Initialize parameter history if needed
          if (!this.state.spotValueHistory[paramName]) {
            this.state.spotValueHistory[paramName] = []
          }
          
          // Add new data point
          this.state.spotValueHistory[paramName].push({
            timestamp,
            value
          })
          
          // Trim history to max length
          if (this.state.spotValueHistory[paramName].length > maxHistory) {
            this.state.spotValueHistory[paramName] = 
              this.state.spotValueHistory[paramName].slice(-maxHistory)
          }
        }
      }
    }
  }
}

/**
 * Get chart data for selected parameters
 * Prepares data in format suitable for Chart.js
 * 
 * @this {OpenInverterExtension}
 * @param {string[]} paramNames - Array of parameter names to include
 * @returns {Object} - Chart.js dataset configuration
 */
function getChartData(paramNames) {
  if (!this.state.spotValueHistory) {
    return { labels: [], datasets: [] }
  }
  
  // Generate colors for each parameter
  const colors = [
    'rgb(30, 136, 229)',   // --oi-blue
    'rgb(255, 140, 0)',    // --oi-orange
    'rgb(76, 175, 80)',    // --oi-status-success
    'rgb(244, 67, 54)',    // --oi-status-error
    'rgb(255, 152, 0)',    // --oi-status-warning
    'rgb(156, 39, 176)',   // purple
    'rgb(0, 150, 136)',    // teal
    'rgb(255, 193, 7)'     // yellow
  ]
  
  const datasets = []
  const allTimestamps = new Set()
  
  // Collect all timestamps and create datasets
  paramNames.forEach((paramName, index) => {
    const history = this.state.spotValueHistory[paramName]
    if (!history || history.length === 0) return
    
    // Add timestamps to set
    history.forEach(point => allTimestamps.add(point.timestamp))
    
    // Create dataset
    datasets.push({
      label: paramName,
      data: history.map(point => ({ x: point.timestamp, y: point.value })),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '33', // Add alpha
      fill: false,
      tension: 0.1
    })
  })
  
  // Sort timestamps
  const labels = Array.from(allTimestamps).sort((a, b) => a - b)
  
  return {
    labels: labels.map(ts => new Date(ts).toLocaleTimeString()),
    datasets
  }
}

/**
 * Clear spot value history
 * 
 * @this {OpenInverterExtension}
 * @param {string[]} [paramNames] - Optional array of specific parameters to clear (clears all if not provided)
 */
function clearSpotValueHistory(paramNames) {
  if (!this.state.spotValueHistory) return
  
  if (paramNames && Array.isArray(paramNames)) {
    // Clear specific parameters
    paramNames.forEach(paramName => {
      if (this.state.spotValueHistory[paramName]) {
        this.state.spotValueHistory[paramName] = []
      }
    })
  } else {
    // Clear all
    this.state.spotValueHistory = {}
  }
}

/**
 * Export spot value history as CSV
 * 
 * @this {OpenInverterExtension}
 * @param {string[]} [paramNames] - Optional array of parameters to export (exports all if not provided)
 * @returns {string} - CSV formatted string
 */
function exportSpotValueHistoryCSV(paramNames) {
  if (!this.state.spotValueHistory) return ''
  
  const paramsToExport = paramNames || Object.keys(this.state.spotValueHistory)
  
  // Collect all timestamps
  const allTimestamps = new Set()
  paramsToExport.forEach(paramName => {
    const history = this.state.spotValueHistory[paramName]
    if (history) {
      history.forEach(point => allTimestamps.add(point.timestamp))
    }
  })
  
  const timestamps = Array.from(allTimestamps).sort((a, b) => a - b)
  
  // Build CSV header
  let csv = 'Timestamp,' + paramsToExport.join(',') + '\n'
  
  // Build CSV rows
  timestamps.forEach(ts => {
    const row = [new Date(ts).toISOString()]
    
    paramsToExport.forEach(paramName => {
      const history = this.state.spotValueHistory[paramName]
      if (history) {
        const point = history.find(p => p.timestamp === ts)
        row.push(point ? point.value : '')
      } else {
        row.push('')
      }
    })
    
    csv += row.join(',') + '\n'
  })
  
  return csv
}
