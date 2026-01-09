/**
 * Parameters Tab
 * 
 * Device parameter configuration interface.
 * Displays all configurable parameters organized by category with edit capabilities.
 */

/**
 * Render the Parameters tab
 * @this {OpenInverterExtension}
 * @returns {TemplateResult}
 */
function renderParametersTab() {
  // Load parameters if not already loaded
  // Only auto-load when OpenInverter device is connected, not just WebREPL
  if (!this.state.oiParameters && !this.state.isLoadingOiParameters && this.state.oiDeviceConnected) {
    // Use setTimeout to avoid blocking render
    setTimeout(() => refreshParameters.call(this), 0)
  }

  return this.html`
    <div class="system-panel">      
      ${renderParametersContent.call(this)}
    </div>
  `
}

/**
 * Render the Parameters content
 * @this {OpenInverterExtension}
 * @returns {TemplateResult}
 */
function renderParametersContent() {
  // Auto-load parameters if OpenInverter device is connected but parameters aren't loaded yet
  if (this.state.oiDeviceConnected && !this.state.oiParameters && !this.state.isLoadingOiParameters) {
    // Use setTimeout to avoid blocking render
    setTimeout(() => refreshParameters.call(this), 0)
  }

  if (!this.state.oiDeviceConnected) {
    return this.html`
      <section id="device-parameters" class="card">
        <h2 class="section-header">Device Parameters</h2>
        <div style="padding: 60px 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">⚙️</div>
          <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
            Connect to a device to view parameters
          </p>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 0;">
            Use the Device Selector to scan and connect
          </p>
        </div>
      </section>
    `
  }

  if (this.state.isLoadingOiParameters) {
    return this.html`
      <section id="device-parameters" class="card">
        <h2 class="section-header">Device Parameters</h2>
        <div style="padding: 60px 20px; text-align: center;">
          <p style="font-size: 16px; color: var(--text-secondary);">Loading parameters...</p>
        </div>
      </section>
    `
  }

  if (!this.state.oiParameters || Object.keys(this.state.oiParameters).length === 0) {
    return this.html`
      <section id="device-parameters" class="card">
        <h2 class="section-header">Device Parameters</h2>
        <div style="padding: 60px 20px; text-align: center;">
          <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
            No parameters available
          </p>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 0;">
            Parameters will load automatically when connected
          </p>
        </div>
      </section>
    `
  }

  // Initialize collapsed categories state
  if (!this.state.collapsedCategories) {
    this.state.collapsedCategories = new Set()
  }

  // Initialize Node ID state if not present
  if (this.state.nodeId === undefined) {
    this.state.nodeId = this.state.selectedNodeId?.toString() || '1'
  }

  // Group parameters by category and sort
  const categories = {}
  Object.entries(this.state.oiParameters).forEach(([name, param]) => {
    // Only include actual parameters (isparam = true)
    if (param.isparam) {
      const cat = param.category || 'Spot Values'
      if (!categories[cat]) categories[cat] = []
      categories[cat].push([name, param])
    }
  })

  // Sort categories and parameters within categories
  const sortedCategories = Object.entries(categories).sort((a, b) => a[0].localeCompare(b[0]))
  sortedCategories.forEach(([_, params]) => {
    params.sort((a, b) => a[0].localeCompare(b[0]))
  })

  return this.html`
    <section id="device-parameters" class="card">
      <h2 class="section-header" onclick=${(e) => {
        const target = e.currentTarget.parentElement
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}>
        Device Parameters
      </h2>

      <div class="parameters-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
        ${sortedCategories.map(([category, categoryParams]) => {
          const isCollapsed = this.state.collapsedCategories.has(category)
          return this.html`
            <div class="parameter-category ${isCollapsed ? 'collapsed' : ''}" style="grid-column: 1 / -1;">
              <h3 class="category-title" onclick=${() => toggleCategory.call(this, category)}>
                <span class="collapse-icon">${isCollapsed ? '▶' : '▼'}</span>
                ${category}
                <span class="param-count">(${categoryParams.length})</span>
              </h3>
              ${!isCollapsed ? this.html`
                <div class="parameters-list" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 0.5rem;">
                  ${categoryParams.map(([key, param]) => renderParameterInput.call(this, key, param))}
                </div>
              ` : ''}
            </div>
          `
        })}
      </div>

      <div class="form-group" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
        <label>Node ID</label>
        <input
          type="text"
          value="${this.state.nodeId || '1'}"
          oninput=${(e) => {
            this.state.nodeId = e.target.value
            this.emit('render')
          }}
          placeholder="Enter Node ID"
        />
        <small class="hint">CAN Node ID for this device (typically 1)</small>
      </div>

      <div class="button-group">
        <button class="btn-primary" onclick=${() => saveNodeId.call(this)} disabled=${!this.state.oiDeviceConnected}>
          Save Node ID
        </button>
        <button class="btn-secondary" onclick=${() => saveParametersToFlash.call(this)} disabled=${!this.state.oiDeviceConnected}>
          Save All to Flash
        </button>
      </div>

      <div class="form-group" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
        <label style="margin-bottom: 1rem;">Import/Export Parameters</label>
        <div class="button-group" style="margin-top: 0;">
          <button class="btn-secondary" onclick=${() => exportParametersToJSON.call(this)} disabled=${!this.state.oiParameters || this.state.isImporting}>
            Export to JSON
          </button>
          <button class="btn-secondary" onclick=${() => importParametersFromJSON.call(this)} disabled=${!this.state.oiParameters || this.state.isImporting}>
            ${this.state.isImporting ? `Importing... (${this.state.importProgress?.current || 0}/${this.state.importProgress?.total || 0})` : 'Import from JSON'}
          </button>
        </div>
        <small class="hint" style="display: block; margin-top: 0.5rem;">
          Export parameters to a JSON file or import from a previously exported file
        </small>
        <input
          ref=${(el) => { this.fileInputRef = el }}
          type="file"
          accept=".json"
          style="display: none;"
          onchange=${(e) => handleFileSelected.call(this, e)}
        />
      </div>
    </section>
  `
}

/**
 * Render a single parameter input matching the ParameterInput component structure
 * @this {OpenInverterExtension}
 */
function renderParameterInput(paramKey, param) {
  const hasEnum = param.enums && Object.keys(param.enums).length > 0
  const displayName = getDisplayName.call(this, paramKey)
  const normalizedValue = hasEnum ? normalizeEnumValue.call(this, param.value) : param.value

  return this.html`
    <div class="parameter-item" style="display: flex; flex-direction: column; gap: 0.25rem;">
      <div class="parameter-header">
        <label class="parameter-label" title="${param.description || ''}" style="cursor: ${param.description ? 'help' : 'default'}; display: block; margin-bottom: 0.25rem;">
          ${displayName}
          ${param.unit ? this.html`<span class="parameter-unit"> (${param.unit})</span>` : ''}
          ${param.description ? this.html`<span style="margin-left: 4px; opacity: 0.6; font-size: 0.9em;" title="${param.description}">ℹ️</span>` : ''}
        </label>
      </div>

      <div class="parameter-input-group" style="display: flex; flex-direction: column; gap: 0.25rem;">
        ${hasEnum ? this.html`
          <select
            value="${normalizedValue}"
            onchange=${(e) => handleParameterChange.call(this, paramKey, param, parseFloat(e.target.value))}
            disabled=${!this.state.oiDeviceConnected}
            style="width: 100%; max-width: 200px;"
          >
            ${Object.entries(param.enums).map(([value, label]) => this.html`
              <option value="${value}" ${normalizedValue === value ? 'selected' : ''}>
                ${String(label)}
              </option>
            `)}
          </select>
        ` : this.html`
          <input
            type="number"
            value="${param.value}"
            min="${param.minimum !== undefined ? param.minimum : ''}"
            max="${param.maximum !== undefined ? param.maximum : ''}"
            step="${param.unit === 'Hz' || param.unit === 'A' ? '0.1' : '1'}"
            onblur=${(e) => handleParameterBlur.call(this, paramKey, param, e)}
            disabled=${!this.state.oiDeviceConnected}
            style="width: 100%; max-width: 150px;"
          />
        `}

        ${param.minimum !== undefined && param.maximum !== undefined && !hasEnum ? this.html`
          <small class="parameter-hint">
            Range: ${param.minimum} - ${param.maximum}
            ${param.default !== undefined ? ` (Default: ${param.default})` : ''}
          </small>
        ` : ''}
      </div>
    </div>
  `
}

/**
 * Handle parameter change for enum selects
 * @this {OpenInverterExtension}
 */
function handleParameterChange(paramKey, param, newValue) {
  updateParameter.call(this, paramKey, newValue)
}

/**
 * Handle parameter blur for number inputs (validates before updating)
 * @this {OpenInverterExtension}
 */
function handleParameterBlur(paramKey, param, e) {
  const target = e.target
  const newValue = parseFloat(target.value)

  if (isNaN(newValue)) {
    target.value = param.value
    return
  }

  // Validate range
  if (param.minimum !== undefined && newValue < param.minimum) {
    alert(`Value must be at least ${param.minimum}`)
    target.value = param.value
    return
  }
  if (param.maximum !== undefined && newValue > param.maximum) {
    alert(`Value must be at most ${param.maximum}`)
    target.value = param.value
    return
  }

  if (newValue !== param.value) {
    updateParameter.call(this, paramKey, newValue)
  }
}

/**
 * Toggle category collapsed state
 * @this {OpenInverterExtension}
 */
function toggleCategory(category) {
  if (!this.state.collapsedCategories) {
    this.state.collapsedCategories = new Set()
  }
  if (this.state.collapsedCategories.has(category)) {
    this.state.collapsedCategories.delete(category)
  } else {
    this.state.collapsedCategories.add(category)
  }
  this.emit('render')
}

/**
 * Update a parameter value
 * @this {OpenInverterExtension}
 */
async function updateParameter(name, value) {
  try {
    await setParameter.call(this, { NAME: name, VALUE: value })
    // Update local state immediately for better UX
    if (this.state.oiParameters && this.state.oiParameters[name]) {
      this.state.oiParameters[name].value = value
      this.emit('render')
    }
  } catch (error) {
    console.error('[OI Parameters] Failed to update parameter:', error)
    alert(`Failed to update parameter: ${error.message}`)
    // Refresh to show correct value
    await refreshParameters.call(this)
  }
}

/**
 * Refresh parameters from device
 * @this {OpenInverterExtension}
 */
async function refreshParameters() {
  if (this.state.isLoadingOiParameters) {
    console.log('[OI Parameters] Already loading parameters, skipping')
    return
  }

  this.state.isLoadingOiParameters = true
  this.emit('render')

  try {
    const params = await getOiParams.call(this)
    this.state.oiParameters = params
    this.state.isLoadingOiParameters = false
    this.emit('render')
  } catch (error) {
    console.error('[OI Parameters] Failed to load parameters:', error)
    this.state.isLoadingOiParameters = false
    this.emit('render')
    alert(`Failed to load parameters: ${error.message}`)
  }
}

/**
 * Export parameters to JSON file
 * @this {OpenInverterExtension}
 */
function exportParametersToJSON() {
  if (!this.state.oiParameters) {
    alert('No parameters to export')
    return
  }

  // Create export object with only parameter values (isparam = true)
  const exportData = {}
  Object.entries(this.state.oiParameters).forEach(([key, param]) => {
    if (param.isparam) {
      exportData[key] = param.value
    }
  })

  // Get device serial for filename
  const serial = this.state.selectedDeviceSerial || this.state.currentDeviceSerial || 'device'
  const dateStr = new Date().toISOString().split('T')[0]

  // Create blob and download
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `parameters_${serial}_${dateStr}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  console.log('[OI Parameters] Exported', Object.keys(exportData).length, 'parameters')
  alert(`Exported ${Object.keys(exportData).length} parameters`)
}

/**
 * Import parameters from JSON file
 * @this {OpenInverterExtension}
 */
function importParametersFromJSON() {
  // Trigger file input click
  if (this.fileInputRef) {
    this.fileInputRef.click()
  } else {
    // Fallback: create temporary input if ref not available
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => handleFileSelected.call(this, e)
    input.click()
  }
}

/**
 * Handle file selection for import
 * @this {OpenInverterExtension}
 */
async function handleFileSelected(e) {
  const target = e.target
  const file = target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const importedData = JSON.parse(text)

    if (!this.state.oiParameters) {
      alert('No parameter definitions loaded')
      return
    }

    let validCount = 0
    let invalidCount = 0
    const errors = []
    const updates = []

    // Validate all parameters first
    for (const [key, value] of Object.entries(importedData)) {
      if (typeof value !== 'number') {
        invalidCount++
        errors.push(`${key}: value must be a number`)
        continue
      }

      const param = this.state.oiParameters[key]
      if (!param) {
        invalidCount++
        errors.push(`${key}: parameter not found`)
        continue
      }

      if (!param.isparam) {
        invalidCount++
        errors.push(`${key}: not a settable parameter`)
        continue
      }

      if (param.id === undefined) {
        invalidCount++
        errors.push(`${key}: parameter ID not defined`)
        continue
      }

      // Validate range
      if (param.minimum !== undefined && value < param.minimum) {
        invalidCount++
        errors.push(`${key}: value ${value} below minimum ${param.minimum}`)
        continue
      }

      if (param.maximum !== undefined && value > param.maximum) {
        invalidCount++
        errors.push(`${key}: value ${value} above maximum ${param.maximum}`)
        continue
      }

      // Add to updates list
      validCount++
      updates.push({ key, value, paramId: param.id })
    }

    // Clear file input
    target.value = ''

    // If we have valid updates, apply them with progress tracking
    if (updates.length > 0) {
      this.state.isImporting = true
      this.state.importProgress = { current: 0, total: updates.length }
      this.emit('render')

      // Update local state first
      updates.forEach(({ key, value }) => {
        if (this.state.oiParameters && this.state.oiParameters[key]) {
          this.state.oiParameters[key].value = value
        }
      })

      // Send updates to device with rate limiting
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      for (let i = 0; i < updates.length; i++) {
        const { key, value, paramId } = updates[i]
        try {
          await setParameter.call(this, { NAME: key, VALUE: value })
          this.state.importProgress.current = i + 1
          this.emit('render')
          // Wait 50ms between each update to avoid overwhelming the ESP32
          await delay(50)
        } catch (error) {
          console.error(`[OI Parameters] Failed to update ${key}:`, error)
          errors.push(`${key}: ${error.message}`)
        }
      }

      this.state.isImporting = false
      this.emit('render')

      let message = `Import complete: ${validCount} parameter${validCount === 1 ? '' : 's'} updated`
      if (invalidCount > 0) {
        const errorList = errors.slice(0, 5).join('\n') + (errors.length > 5 ? `\n...and ${errors.length - 5} more` : '')
        message += `\n\n${invalidCount} error${invalidCount === 1 ? '' : 's'}:\n${errorList}`
      }
      alert(message)
    }

    if (invalidCount > 0 && validCount === 0) {
      const errorList = errors.slice(0, 5).join('\n') + (errors.length > 5 ? `\n...and ${errors.length - 5} more` : '')
      alert(`Import failed: ${invalidCount} error${invalidCount === 1 ? '' : 's'}:\n${errorList}`)
    }

    if (validCount === 0 && invalidCount === 0) {
      alert('No valid parameters found in file')
    }
  } catch (error) {
    console.error('[OI Parameters] Import error:', error)
    alert(`Failed to import: ${error.message}`)
    target.value = ''
    this.state.isImporting = false
    this.emit('render')
  }
}

/**
 * Save Node ID
 * @this {OpenInverterExtension}
 */
async function saveNodeId() {
  if (!this.state.oiDeviceConnected) {
    alert('Not connected to device')
    return
  }

  const nodeId = parseInt(this.state.nodeId)
  if (isNaN(nodeId) || nodeId < 1 || nodeId > 127) {
    alert('Node ID must be a number between 1 and 127')
    return
  }

  try {
    // Update the selected device's node ID
    const device = this.state.discoveredDevices?.find(d => d.serial === this.state.selectedDeviceSerial)
    if (device) {
      device.nodeId = nodeId
      this.state.selectedNodeId = nodeId
    }

    // Note: Node ID is typically set during device connection/scanning
    // This method mainly updates the UI state
    alert(`Node ID set to ${nodeId}`)
    this.emit('render')
  } catch (error) {
    console.error('[OI Parameters] Save Node ID error:', error)
    alert(`Failed to save Node ID: ${error.message}`)
  }
}

/**
 * Save parameters to flash
 * @this {OpenInverterExtension}
 */
async function saveParametersToFlash() {
  if (!this.state.oiDeviceConnected) {
    alert('Not connected to device')
    return
  }

  try {
    const result = await this.device.execute('from lib.OI_helpers import saveToFlash; saveToFlash()')
    const parsed = this.device.parseJSON(result)
    
    if (parsed && parsed.success) {
      alert('Parameters saved to flash successfully')
    } else {
      alert('Failed to save parameters to flash')
    }
  } catch (error) {
    console.error('[OI Parameters] Save to flash error:', error)
    alert(`Failed to save to flash: ${error.message}`)
  }
}

/**
 * Get display name for a parameter key (converts snake_case to Title Case)
 * @this {OpenInverterExtension}
 */
function getDisplayName(key) {
  if (!key) return ''
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Normalize enum value to string
 * @this {OpenInverterExtension}
 */
function normalizeEnumValue(value) {
  if (value === null || value === undefined) {
    return '0'
  }
  return String(Math.round(Number(value)))
}
