/**
 * CAN Mappings Tab
 * 
 * Configure CAN message mappings for TX and RX.
 * Maps parameters to CAN message positions.
 */

import { getCanMappings, getAllParamsWithIds, addCanMapping, removeCanMapping } from '../utils/oiHelpers.js'

/**
 * Render the CAN Mappings tab
 * @this {OpenInverterExtension}
 * @returns {TemplateResult}
 */
function renderCanMappingsTab() {
  // Auto-load CAN mappings if device is connected but mappings aren't loaded yet
  if (!this.state.canMappings && !this.state.isLoadingCanMappings && this.state.oiDeviceConnected) {
    setTimeout(() => refreshCanMappings.call(this), 0)
  }

  // Auto-load all params with IDs (for dropdown) - includes both parameters and spot values
  if (!this.state.allParamsWithIds && !this.state.isLoadingAllParamsWithIds && this.state.oiDeviceConnected) {
    setTimeout(() => refreshAllParamsWithIds.call(this), 0)
  }

  if (!this.state.oiDeviceConnected) {
    return this.html`
      <div class="system-panel">
        <div class="panel-message">
          <p>Please connect to a device first</p>
        </div>
      </div>
    `
  }

  if (this.state.isLoadingCanMappings) {
    return this.html`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading CAN mappings...</p>
        </div>
      </div>
    `
  }

  const mappings = this.state.canMappings || { tx: [], rx: [] }
  const txMappings = flattenCanMappings.call(this, mappings.tx || [], false)
  const rxMappings = flattenCanMappings.call(this, mappings.rx || [], true)
  const showAddForm = this.state.showCanMappingForm || false
  const formData = this.state.canMappingFormData || {
    isrx: false,
    id: 0,
    paramid: 0,
    position: 0,
    length: 16,
    gain: 1.0,
    offset: 0,
  }

  // Combine all parameters and spot values into a single object (like reference code)
  // This matches the reference pattern where useParams() returns all params/spot values together
  const allParams = {}
  
  // Add parameters (isparam=True)
  const oiParams = this.state.oiParameters || {}
  Object.entries(oiParams).forEach(([key, param]) => {
    if (param) {
      allParams[key] = param
    }
  })
  
  // Add spot values (isparam=False)
  const oiSpotValues = this.state.oiSpotValues || {}
  Object.entries(oiSpotValues).forEach(([key, spotValue]) => {
    if (spotValue) {
      allParams[key] = spotValue
    }
  })
  
  // Prefer allParamsWithIds if available (has IDs from parameter database)
  // Otherwise use combined allParams (may not have IDs yet)
  const paramsForDropdown = Object.keys(this.state.allParamsWithIds || {}).length > 0
    ? this.state.allParamsWithIds
    : allParams
  
  // For display names in tables, use combined params
  const params = allParams

  return this.html`
    <div class="can-mappings-container system-panel" style="padding: 20px;">
      <h2 class="section-header">CAN Mappings</h2>
      
      ${this.state.canMappingError ? this.html`
        <div class="error-message" style="margin-bottom: 1.5rem;">
          <p>Error: ${this.state.canMappingError}</p>
        </div>
      ` : ''}
      
      ${renderMappingSection.call(this, 'TX Mappings', 'tx', txMappings, params)}
      ${renderMappingSection.call(this, 'RX Mappings', 'rx', rxMappings, params)}
      
      ${!showAddForm ? this.html`
        <button class="btn-add" onclick=${() => { 
          this.state.showCanMappingForm = true
          this.state.canMappingFormData = {
            isrx: false,
            id: 0,
            paramid: 0,
            position: 0,
            length: 16,
            gain: 1.0,
            offset: 0,
          }
          this.emit('render')
        }}>
          Add CAN Mapping
        </button>
      ` : renderAddMappingForm.call(this, formData, paramsForDropdown)}
    </div>
  `
}

/**
 * Render mapping section (TX or RX)
 * @this {OpenInverterExtension}
 */
function renderMappingSection(title, direction, flattenedMappings, params) {
  return this.html`
    <div class="mapping-section">
      <h3 style="margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-primary);">
        ${title} ${direction === 'tx' ? '(Transmit)' : '(Receive)'}
      </h3>
      ${flattenedMappings.length === 0 ? this.html`
        <p class="no-mappings">No ${direction.toUpperCase()} mappings configured</p>
      ` : this.html`
        <table class="mappings-table">
          <thead>
            <tr>
              <th>CAN ID</th>
              <th>Parameter</th>
              <th>Position</th>
              <th>Length</th>
              <th>Gain</th>
              <th>Offset</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${flattenedMappings.map((mapping, idx) => this.html`
              <tr>
                <td>0x${mapping.id.toString(16).toUpperCase()}</td>
                <td>${getParameterDisplayNameById.call(this, mapping.paramid, params)}</td>
                <td>${mapping.position}</td>
                <td>${mapping.length} bits</td>
                <td>${mapping.gain}</td>
                <td>${mapping.offset}</td>
                <td>
                  <button
                    class="btn-remove"
                    onclick=${() => handleRemoveCanMapping.call(this, mapping)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      `}
    </div>
  `
}

/**
 * Render add mapping form
 * @this {OpenInverterExtension}
 */
function renderAddMappingForm(formData, paramsForDropdown) {
  return this.html`
    <div class="add-mapping-form">
      <h3 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--text-primary);">
        Add New CAN Mapping
      </h3>
      <div class="form-row">
        <label>
          Direction:
          <select
            onchange=${(e) => {
              this.state.canMappingFormData = { ...formData, isrx: e.target.value === 'rx' }
              this.emit('render')
            }}
          >
            <option value="tx" ${!formData.isrx ? 'selected' : ''}>TX (Transmit)</option>
            <option value="rx" ${formData.isrx ? 'selected' : ''}>RX (Receive)</option>
          </select>
        </label>

        <label>
          CAN ID (hex):
          <input
            type="text"
            placeholder="0x180"
            value=${`0x${formData.id.toString(16).toUpperCase()}`}
            onchange=${(e) => {
              const value = e.target.value
              const parsed = parseInt(value, 16)
              if (!isNaN(parsed)) {
                this.state.canMappingFormData = { ...formData, id: parsed }
                this.emit('render')
              }
            }}
          />
        </label>
      </div>

      <div class="form-row">
        <label>
          Parameter:
          <select
            onchange=${(e) => {
              this.state.canMappingFormData = { ...formData, paramid: parseInt(e.target.value) || 0 }
              this.emit('render')
            }}
          >
            <option value="0" ${formData.paramid === 0 ? 'selected' : ''}>Select parameter...</option>
            ${(() => {
              // Show all params/spot values that have IDs (for CAN mapping)
              // Match reference code pattern: iterate over all params, show those with IDs
              const seenIds = new Set()
              const entries = Object.entries(paramsForDropdown)
                .filter(([key, param]) => {
                  // Only show entries that have an ID (required for CAN mapping)
                  if (!param) return false
                  if (!param.id) return false
                  if (seenIds.has(param.id)) return false
                  seenIds.add(param.id)
                  return true
                })
                .sort(([keyA, paramA], [keyB, paramB]) => {
                  // Sort by ID for consistent ordering
                  return (paramA.id || 0) - (paramB.id || 0)
                })
              
              if (entries.length === 0) {
                return this.html`
                  <option value="0" disabled>No parameters with IDs available</option>
                `
              }
              
              return entries.map(([key, param]) => this.html`
                <option value="${param.id}" ${formData.paramid === param.id ? 'selected' : ''}>
                  ${getParameterDisplayName.call(this, key, param)} (ID: ${param.id})
                </option>
              `)
            })()}
          </select>
        </label>

        <label>
          Bit Position:
          <input
            type="number"
            min="0"
            max="63"
            value=${formData.position}
            onchange=${(e) => {
              this.state.canMappingFormData = { ...formData, position: parseInt(e.target.value) || 0 }
              this.emit('render')
            }}
          />
        </label>

        <label>
          Bit Length:
          <input
            type="number"
            min="1"
            max="32"
            value=${formData.length}
            onchange=${(e) => {
              this.state.canMappingFormData = { ...formData, length: parseInt(e.target.value) || 16 }
              this.emit('render')
            }}
          />
        </label>
      </div>

      <div class="form-row">
        <label>
          Gain:
          <input
            type="number"
            step="0.001"
            value=${formData.gain}
            onchange=${(e) => {
              this.state.canMappingFormData = { ...formData, gain: parseFloat(e.target.value) || 1.0 }
              this.emit('render')
            }}
          />
        </label>

        <label>
          Offset:
          <input
            type="number"
            value=${formData.offset}
            onchange=${(e) => {
              this.state.canMappingFormData = { ...formData, offset: parseInt(e.target.value) || 0 }
              this.emit('render')
            }}
          />
        </label>
      </div>

      <div class="form-actions">
        <button class="btn-cancel" onclick=${() => {
          this.state.showCanMappingForm = false
          this.state.canMappingFormData = {
            isrx: false,
            id: 0,
            paramid: 0,
            position: 0,
            length: 16,
            gain: 1.0,
            offset: 0,
          }
          this.emit('render')
        }}>Cancel</button>
        <button class="btn-save" onclick=${() => handleAddCanMapping.call(this)}>Save</button>
      </div>
    </div>
  `
}

/**
 * Handle add CAN mapping
 * @this {OpenInverterExtension}
 */
async function handleAddCanMapping() {
  const formData = this.state.canMappingFormData || {}
  
  if (formData.paramid === 0) {
    alert('Please select a parameter')
    return
  }

  // Find parameter name by ID - search in both parameters and spot values
  // Use allParamsWithIds if available (has both), otherwise search both separately
  let paramName = null
  
  // Try allParamsWithIds first (most complete)
  const allParamsWithIds = this.state.allParamsWithIds || {}
  for (const [key, param] of Object.entries(allParamsWithIds)) {
    if (param && param.id === formData.paramid) {
      paramName = key
      break
    }
  }
  
  // Fallback: search in oiParameters
  if (!paramName) {
    const params = this.state.oiParameters || {}
    for (const [key, param] of Object.entries(params)) {
      if (param && param.id === formData.paramid) {
        paramName = key
        break
      }
    }
  }
  
  // Fallback: search in oiSpotValues
  if (!paramName) {
    const spotValues = this.state.oiSpotValues || {}
    for (const [key, spotValue] of Object.entries(spotValues)) {
      if (spotValue && spotValue.id === formData.paramid) {
        paramName = key
        break
      }
    }
  }

  if (!paramName) {
    alert('Parameter not found')
    return
  }

  this.state.canMappingError = null

  try {
    // Check if mock device (nodeId > 127) - handle locally
    const isMockDevice = this.state.selectedNodeId > 127
    
    if (isMockDevice) {
      // Mock device - store locally
      const direction = formData.isrx ? 'rx' : 'tx'
      if (!this.state.mockCanMappings) {
        this.state.mockCanMappings = { tx: [], rx: [] }
      }
      const msgList = this.state.mockCanMappings[direction] || []
      
      // Find or create message entry for this CAN ID
      let msgIndex = null
      for (let i = 0; i < msgList.length; i++) {
        if (msgList[i].canId === formData.id) {
          msgIndex = i
          break
        }
      }
      
      if (msgIndex === null) {
        // Create new message entry
        msgList.push({
          canId: formData.id,
          isExtended: false,
          params: []
        })
        msgIndex = msgList.length - 1
      }
      
      // Add parameter mapping to message
      msgList[msgIndex].params.push({
        paramId: formData.paramid,
        position: formData.position,
        length: formData.length,
        gain: formData.gain,
        offset: formData.offset
      })
      
      // Update state
      this.state.mockCanMappings[direction] = msgList
    } else {
      // Real device - call Python backend
      this.state.isLoadingCanMappings = true
      this.emit('render')
      
      await addCanMapping.call(this, {
        can_id: formData.id,
        param_name: paramName,
        position: formData.position,
        length: formData.length,
        gain: formData.gain,
        offset: formData.offset,
        is_tx: !formData.isrx,
        is_extended: false, // TODO: Add extended frame support
      })
      
      // Reset loading flag so refreshCanMappings can run
      this.state.isLoadingCanMappings = false
    }

    // Reset form and reload mappings
    this.state.showCanMappingForm = false
    this.state.canMappingFormData = {
      isrx: false,
      id: 0,
      paramid: 0,
      position: 0,
      length: 16,
      gain: 1.0,
      offset: 0,
    }
    
    // Refresh mappings (will handle loading state itself)
    await refreshCanMappings.call(this)
    alert('CAN mapping added successfully')
  } catch (error) {
    console.error('[OI] Failed to add CAN mapping:', error)
    this.state.isLoadingCanMappings = false
    this.state.canMappingError = error.message || 'Failed to add CAN mapping'
    this.emit('render')
    alert(`Failed to add CAN mapping: ${error.message}`)
  }
}

/**
 * Handle remove CAN mapping
 * @this {OpenInverterExtension}
 */
async function handleRemoveCanMapping(mapping) {
  const direction = mapping.isrx ? 'rx' : 'tx'
  const params = {}
  Object.assign(params, this.state.oiParameters || {})
  Object.assign(params, this.state.oiSpotValues || {})
  const paramName = getParameterDisplayNameById.call(this, mapping.paramid, params)
  const canId = `0x${mapping.id.toString(16).toUpperCase()}`

  if (!confirm(`Remove ${direction.toUpperCase()} mapping for ${paramName} (CAN ID ${canId})?`)) {
    return
  }

  this.state.canMappingError = null

  try {
    // Check if mock device (nodeId > 127) - handle locally
    const isMockDevice = this.state.selectedNodeId > 127
    
    if (isMockDevice) {
      // Mock device - remove from local storage
      const msgList = this.state.mockCanMappings[direction] || []
      if (mapping.msgIndex < msgList.length) {
        const msg = msgList[mapping.msgIndex]
        if (mapping.paramIndex < msg.params.length) {
          // Remove the parameter mapping
          msg.params.splice(mapping.paramIndex, 1)
          // If message has no more params, remove the message
          if (msg.params.length === 0) {
            msgList.splice(mapping.msgIndex, 1)
          }
        }
      }
    } else {
      // Real device - call Python backend
      this.state.isLoadingCanMappings = true
      this.emit('render')
      
      await removeCanMapping.call(this, direction, mapping.msgIndex, mapping.paramIndex)
      
      // Reset loading flag so refreshCanMappings can run
      this.state.isLoadingCanMappings = false
    }

    // Refresh mappings (will handle loading state itself)
    await refreshCanMappings.call(this)
    alert('CAN mapping removed successfully')
  } catch (error) {
    console.error('[OI] Failed to remove CAN mapping:', error)
    this.state.isLoadingCanMappings = false
    this.state.canMappingError = error.message || 'Failed to remove CAN mapping'
    this.emit('render')
    alert(`Failed to remove CAN mapping: ${error.message}`)
  }
}

/**
 * Flatten CAN mappings from nested structure to flat list
 * @this {OpenInverterExtension}
 */
function flattenCanMappings(messages, isrx) {
  if (!Array.isArray(messages)) {
    return []
  }
  const flattened = []
  messages.forEach((message, msgIndex) => {
    if (!message || !Array.isArray(message.params)) {
      return // Skip invalid messages
    }
    message.params.forEach((param, paramIndex) => {
      if (param && param.paramId !== undefined) {
        flattened.push({
          id: message.canId,
          paramid: param.paramId,
          position: param.position,
          length: param.length,
          gain: param.gain,
          offset: param.offset,
          isrx: isrx,
          msgIndex: msgIndex,
          paramIndex: paramIndex,
        })
      }
    })
  })
  return flattened
}

/**
 * Get parameter display name by key and param object
 * @this {OpenInverterExtension}
 */
function getParameterDisplayName(key, param) {
  if (!param) {
    return key || 'Unknown'
  }
  // Use param.name if available, otherwise use the key
  return param.name || key
}

/**
 * Get parameter display name by ID
 * @this {OpenInverterExtension}
 */
function getParameterDisplayNameById(paramId, params) {
  if (!params || paramId === 0) {
    return `Param ${paramId}`
  }

  for (const [key, param] of Object.entries(params)) {
    if (param.id === paramId) {
      return getParameterDisplayName.call(this, key, param)
    }
  }
  return `Param ${paramId}`
}

/**
 * Refresh all params with IDs (for CAN mapping dropdown)
 * @this {OpenInverterExtension}
 */
async function refreshAllParamsWithIds() {
  if (this.state.isLoadingAllParamsWithIds) {
    console.log('[OI] Already loading all params with IDs, skipping')
    return
  }

  this.state.isLoadingAllParamsWithIds = true
  this.emit('render')

  try {
    const allParams = await getAllParamsWithIds.call(this)
    this.state.allParamsWithIds = allParams
    this.state.isLoadingAllParamsWithIds = false
    this.emit('render')
  } catch (error) {
    console.error('[OI] Failed to load all params with IDs:', error)
    this.state.isLoadingAllParamsWithIds = false
    this.emit('render')
  }
}

/**
 * Refresh CAN mappings from device
 * @this {OpenInverterExtension}
 */
async function refreshCanMappings() {
  if (this.state.isLoadingCanMappings) {
    console.log('[OI] Already loading CAN mappings, skipping')
    return
  }

  this.state.isLoadingCanMappings = true
  this.state.canMappingError = null
  this.emit('render')

  try {
    // Check if mock device (nodeId > 127) - use mock storage
    const isMockDevice = this.state.selectedNodeId > 127
    
    if (isMockDevice) {
      // Mock device - use local storage
      this.state.canMappings = {
        tx: [...(this.state.mockCanMappings?.tx || [])],
        rx: [...(this.state.mockCanMappings?.rx || [])]
      }
      this.state.isLoadingCanMappings = false
      this.emit('render')
      return
    }
    
    // Real device - fetch from Python backend
    const mappings = await getCanMappings.call(this)
    console.log('[OI] Loaded CAN mappings:', mappings)
    // Ensure mappings has the expected structure
    if (mappings && (mappings.tx !== undefined || mappings.rx !== undefined)) {
      this.state.canMappings = {
        tx: mappings.tx || [],
        rx: mappings.rx || []
      }
    } else {
      // If response is not in expected format, initialize empty
      console.warn('[OI] Unexpected CAN mappings format:', mappings)
      this.state.canMappings = { tx: [], rx: [] }
    }
    this.state.isLoadingCanMappings = false
    this.emit('render')
  } catch (error) {
    console.error('[OI] Failed to load CAN mappings:', error)
    this.state.isLoadingCanMappings = false
    this.state.canMappingError = error.message || 'Failed to load CAN mappings'
    this.emit('render')
    alert(`Failed to load CAN mappings: ${error.message}`)
  }
}

export { renderCanMappingsTab }
