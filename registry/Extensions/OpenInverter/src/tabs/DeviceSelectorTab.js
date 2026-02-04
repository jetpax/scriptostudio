/**
 * Device Selector Tab - Complete Implementation
 * 
 * Handles:
 * - CAN bus scanning for OpenInverter devices
 * - Device management (add/edit/delete)
 * - Device connection
 * - Manual device entry
 * - Saved devices display
 */

// Import other tabs for renderDeviceTabContent
import { renderParametersTab } from './ParametersTab.js'
import { renderSpotValuesTab } from './SpotValuesTab.js'
import { renderCanMappingsTab } from './CanMappingsTab.js'
import { renderCanMessagesTab } from './CanMessagesTab.js'
import { renderOtaUpdateTab } from './OtaUpdateTab.js'

/**
 * Render the Device Selector tab
 * @this {OpenInverterExtension}
 */
function renderDeviceSelectorTab() {
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
  if (!this.state.discoveredDevices) {
    this.state.discoveredDevices = []
  }
  if (!this.state.editingDeviceName) {
    this.state.editingDeviceName = null
  }

  return this.html`
    <div class="system-panel">
      <div class="panel-header" style="padding: 20px; border-bottom: 1px solid var(--border-color);">
        <h2 style="margin: 0; font-size: 24px;">
          Device Manager
        </h2>
        <p style="margin: 8px 0 0; font-size: 14px;">
          Scan and manage Open Inverter devices via CAN bus
        </p>
      </div>
      

        <!-- Saved Devices List -->
        ${this.state.discoveredDevices.length > 0 ? this.html`
          <div style="margin-bottom: 24px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
              ${this.state.discoveredDevices.map(device => renderDeviceCard.call(this, device))}
            </div>
          </div>
        ` : ''}

        <!-- CAN Bus Scanner -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 16px; margin: 0; color: var(--text-primary);">Scan for Devices</h3>
            <div style="display: flex; gap: 8px;">
              <button 
                class="secondary-button" 
                onclick=${() => handleScanDevices.call(this, false)}
                disabled=${!this.state.isConnected || this.state.isScanning}
                style="padding: 8px 16px; font-size: 13px;">
                ${this.state.isScanning ? 'Scanning...' : 'Quick Scan (1-10)'}
              </button>
              <button 
                class="secondary-button" 
                onclick=${() => handleScanDevices.call(this, true)}
                disabled=${!this.state.isConnected || this.state.isScanning}
                style="padding: 8px 16px; font-size: 13px;">
                Full Scan (1-127)
              </button>
            </div>
          </div>
          
          ${!this.state.isConnected ? this.html`
            <div style="text-align: center; padding: 24px; color: #ef4444; font-size: 14px; background: rgba(239, 68, 68, 0.1); border-radius: 4px;">
              <p style="margin: 0;">⚠️ Please connect to ESP32 device via WebREPL first</p>
              <p style="margin: 8px 0 0; font-size: 12px; color: var(--text-secondary);">
                Use the Connection panel to connect to your ESP32
              </p>
            </div>
          ` : this.state.isScanning ? this.html`
            <div style="padding: 24px;">
              <div style="text-align: center; color: var(--text-secondary); font-size: 14px;">
                <p style="margin: 0;">Scanning CAN bus for devices...</p>
                <p style="font-size: 12px; margin: 8px 0 0;">This may take a few seconds</p>
              </div>
            </div>
          ` : this.state.scanMessage ? this.html`
            <div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 14px; background: var(--bg-tertiary); border-radius: 4px;">
              <p style="margin: 0;">${this.state.scanMessage}</p>
            </div>
          ` : this.state.canScanResults.length === 0 ? this.html`
            <div style="text-align: center; padding: 24px; color: var(--text-secondary); font-size: 14px;">
              <p style="margin: 0;">No scan results yet</p>
              <p style="font-size: 12px; margin: 8px 0 0;">Click Quick Scan or Full Scan to find devices</p>
            </div>
          ` : this.html`
            <div style="border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: var(--scheme-primary); color: white;">
                    <th style="padding: 10px 12px; text-align: left; font-weight: 600;">Node ID</th>
                    <th style="padding: 10px 12px; text-align: left; font-weight: 600;">Serial Number</th>
                    <th style="padding: 10px 12px; text-align: right; font-weight: 600;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.state.canScanResults.map(device => this.html`
                    <tr style="border-top: 1px solid var(--border-color); transition: background 0.2s;" onmouseover=${(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'} onmouseout=${(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style="padding: 12px;">${device.nodeId}</td>
                      <td style="padding: 12px; font-family: monospace; font-size: 12px;">${device.serialNumber || '—'}</td>
                      <td style="padding: 12px; text-align: right;">
                        <div style="display: flex; gap: 8px; justify-content: flex-end;">
                          <button 
                            class="secondary-button" 
                            onclick=${(e) => { e.stopPropagation(); addDeviceFromScan.call(this, device); }}
                            style="padding: 6px 12px; font-size: 13px;">
                            Add
                          </button>
                          <button 
                            class="primary-button" 
                            onclick=${(e) => { e.stopPropagation(); selectDeviceFromScan.call(this, device); }}
                            style="padding: 6px 16px; font-size: 13px;">
                            Connect
                          </button>
                        </div>
                      </td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Manual Connection -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px;">
          <h3 style="font-size: 16px; margin: 0 0 16px 0; color: var(--text-primary);">Manual Connection</h3>
          <div style="display: flex; gap: 12px; align-items: flex-end;">
            <div style="flex: 1;">
              <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">
                Node ID
              </label>
              <input 
                type="number" 
                min="1" 
                max="255"
                value="${this.state.selectedNodeId || 1}"
                oninput=${(e) => { this.state.selectedNodeId = parseInt(e.target.value) || 1 }}
                style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); font-size: 14px;"
              />
            </div>
            <div style="flex: 2;">
              <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">
                Serial Number (optional)
              </label>
              <input 
                type="text" 
                placeholder="e.g., ABC123..."
                value="${this.state.manualSerial || ''}"
                oninput=${(e) => { this.state.manualSerial = e.target.value }}
                style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); font-size: 14px;"
              />
            </div>
            <div style="display: flex; gap: 8px;">
              <button 
                class="secondary-button" 
                onclick=${() => addDeviceManually.call(this)}
                disabled=${this.state.selectedNodeId <= 127 && !this.state.isConnected}
                style="min-width: 100px;">
                Add Device
              </button>
              <button 
                class="primary-button" 
                onclick=${() => selectDeviceManually.call(this)}
                disabled=${this.state.selectedNodeId <= 127 && !this.state.isConnected}
                style="min-width: 120px;">
                Connect
              </button>
            </div>
          </div>
          <p style="font-size: 12px; color: var(--text-secondary); margin: 12px 0 0;">
            Enter a Node ID (1-127) to connect to a real device, or >127 (e.g., 200, 201) for mock/demo devices.
          </p>
        </div>
      </div>
    </div>
  `
}

/**
 * Render device panel - shown when a device submenu item is clicked
 * @this {OpenInverterExtension}
 */
function renderDevicePanel() {
  const device = this.state.discoveredDevices.find(d => d.serial === this.state.selectedDeviceSerial)
  
  if (!device) {
    return this.html`
      <div class="panel-message">
        <p>Device not found</p>
      </div>
    `
  }

  // Initialize activeDeviceTab if not set
  if (!this.state.activeDeviceTab) {
    this.state.activeDeviceTab = 'telemetry'
  }

  return this.html`
    <div style="display: flex; flex-direction: column; height: 100%;">
      <!-- Device Header -->
      <div style="border-bottom: 1px solid var(--border-color); padding: 20px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${device.online ? '#4caf50' : '#999'};"></div>
          <h1 style="margin: 0; font-size: 24px; color: var(--text-primary);">
            ${device.name || `Device ${device.nodeId}`}
          </h1>
          <span style="background: var(--oi-beige); padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; color: var(--text-secondary);">
            ${device.online ? 'Connected' : 'Offline'}
          </span>
        </div>
        <div style="display: flex; gap: 16px; color: var(--text-secondary); font-size: 13px;">
          <span>Serial: ${device.serial || 'Unknown'}</span>
          <span>Node ID: ${device.nodeId}</span>
          <span>Firmware: ${device.firmware || 'Unknown'}</span>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tabs-header">
        <div class="tabs-nav">
          <button 
            class="tab-button ${this.state.activeDeviceTab === 'telemetry' ? 'active' : ''}"
            onclick=${() => switchDeviceTab.call(this, 'telemetry')}>
            Telemetry
          </button>
          <button 
            class="tab-button ${this.state.activeDeviceTab === 'parameters' ? 'active' : ''}"
            onclick=${() => switchDeviceTab.call(this, 'parameters')}>
            Parameters
          </button>
          <button 
            class="tab-button ${this.state.activeDeviceTab === 'canmapping' ? 'active' : ''}"
            onclick=${() => switchDeviceTab.call(this, 'canmapping')}>
            CAN Mappings
          </button>
          <button 
            class="tab-button ${this.state.activeDeviceTab === 'canmessages' ? 'active' : ''}"
            onclick=${() => switchDeviceTab.call(this, 'canmessages')}>
            CAN Messages
          </button>
          <button 
            class="tab-button ${this.state.activeDeviceTab === 'ota' ? 'active' : ''}"
            onclick=${() => switchDeviceTab.call(this, 'ota')}>
            OTA Update
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tabs-content" style="flex: 1; overflow: auto; padding: 20px;">
        ${renderDeviceTabContent.call(this)}
      </div>
    </div>
  `
}

/**
 * Switch between device tabs
 * @this {OpenInverterExtension}
 */
function switchDeviceTab(tabId) {
  this.state.activeDeviceTab = tabId
  this.emit('render')
}

/**
 * Render the active tab content for the selected device
 * @this {OpenInverterExtension}
 */
function renderDeviceTabContent() {
  switch (this.state.activeDeviceTab) {
    case 'telemetry':
      return renderSpotValuesTab.call(this)
    case 'parameters':
      return renderParametersTab.call(this)
    case 'canmapping':
      return renderCanMappingsTab.call(this)
    case 'canmessages':
      return renderCanMessagesTab.call(this)
    case 'ota':
      return renderOtaUpdateTab.call(this)
    default:
      return this.html`<div class="panel-message">Unknown tab</div>`
  }
}

/**
 * Render a device card for the saved devices list
 * @this {OpenInverterExtension}
 */
function renderDeviceCard(device) {
  const isConnected = this.state.oiDeviceConnected && 
                     this.state.currentDeviceSerial === device.serial &&
                     this.state.selectedNodeId === device.nodeId
  const isEditing = this.state.editingDeviceName === device.serial

  return this.html`
    <div 
      class="device-card"
      style="
        background: var(--oi-beige);
        border: 2px solid ${isConnected ? 'var(--oi-blue)' : '#e0e0e0'};
        border-radius: 8px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: relative;
        pointer-events: auto;
        user-select: none;
      "
      onmouseover=${(e) => { if (!isConnected) e.currentTarget.style.borderColor = 'var(--oi-blue)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 136, 229, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onmouseout=${(e) => { if (!isConnected) e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      <div 
        style="flex: 1; cursor: pointer;"
        onclick=${(e) => {
          // Don't select if clicking on buttons, input fields, or their containers
          const target = e.target
          if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') {
            return
          }
          let parent = target.parentElement
          while (parent && parent !== e.currentTarget) {
            if (parent.tagName === 'BUTTON' || parent.classList.contains('secondary-button') || parent.classList.contains('btn-danger')) {
              return
            }
            parent = parent.parentElement
          }
          selectDeviceFromCard.call(this, device)
        }}
      >
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${device.online !== false ? '#4caf50' : '#999'};"></div>
        <div style="font-size: 1.2rem; font-weight: 600; color: #333; flex: 1;">
          ${isEditing ? this.html`
            <input 
              type="text"
              value="${device.name || ''}"
              oninput=${(e) => { this.state.editingDeviceNameValue = e.target.value }}
              onkeydown=${(e) => {
                if (e.key === 'Enter') {
                  saveDeviceName.call(this, device)
                } else if (e.key === 'Escape') {
                  this.state.editingDeviceName = null
                  this.emit('render')
                }
              }}
              onclick=${(e) => e.stopPropagation()}
              onmousedown=${(e) => e.stopPropagation()}
              style="width: 100%; padding: 4px 8px; border: 1px solid var(--oi-blue); border-radius: 4px; font-size: 1rem;"
              autofocus
            />
          ` : device.name || `Device ${device.nodeId}`}
        </div>
        ${isConnected ? this.html`
          <span style="background: var(--oi-orange); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 500; text-transform: uppercase;">
            Connected
          </span>
        ` : ''}
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
        <div style="color: var(--text-secondary);">
          Serial: <span style="font-family: monospace;">${device.serial || 'Unknown'}</span>
        </div>
        <div style="color: var(--text-secondary);">
          Node ID: ${device.nodeId}
        </div>
        ${device.firmware ? this.html`
          <div style="color: var(--text-secondary);">
            Firmware: ${device.firmware}
          </div>
        ` : ''}
        <div style="color: ${device.online !== false ? '#4caf50' : '#999'}; font-weight: 500;">
          ${device.online !== false ? 'Online' : 'Offline'}
        </div>
      </div>
      </div>

      <div style="position: absolute; bottom: 0.75rem; right: 0.75rem; display: flex; gap: 0.5rem; z-index: 1; pointer-events: none;">
        ${isEditing ? this.html`
          <button 
            class="secondary-button"
            onclick=${(e) => { e.stopPropagation(); saveDeviceName.call(this, device); }}
            onmousedown=${(e) => e.stopPropagation()}
            style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px; pointer-events: auto;"
            title="Save"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <button 
            class="secondary-button"
            onclick=${(e) => { e.stopPropagation(); this.state.editingDeviceName = null; this.emit('render'); }}
            onmousedown=${(e) => e.stopPropagation()}
            style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px; pointer-events: auto;"
            title="Cancel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        ` : this.html`
          ${device.name ? this.html`
            <button 
              class="secondary-button"
              onclick=${(e) => { e.stopPropagation(); startEditingDeviceName.call(this, device); }}
              onmousedown=${(e) => e.stopPropagation()}
              style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px; pointer-events: auto;"
              title="Edit"
            >
              <img src=${this.icon('edit', 16)} style="width: 16px; height: 16px;" />
            </button>
          ` : ''}
          <button 
            class="btn-danger"
            onclick=${(e) => { e.stopPropagation(); deleteDevice.call(this, device); }}
            onmousedown=${(e) => e.stopPropagation()}
            style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px; background: #dc3545; color: white; border: none; pointer-events: auto;"
            title="Delete"
          >
            <img src=${this.icon('trash', 16, 'white')} style="width: 16px; height: 16px;" />
          </button>
        `}
      </div>
    </div>
  `
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Handle CAN bus scanning
 * @this {OpenInverterExtension}
 */
async function handleScanDevices(fullScan) {
  this.state.isScanning = true
  this.state.scanMessage = null
  this.emit('render')

  try {
    const result = await this.device.execute(`
from lib.ext.openinverter.OI_helpers import scanCanBus
import json
results = scanCanBus(${fullScan ? 'True' : 'False'})
print(json.dumps(results))
    `)

    const parsed = this.device.parseJSON(result)
    if (parsed && Array.isArray(parsed)) {
      this.state.canScanResults = parsed
      this.state.scanMessage = `Found ${parsed.length} device${parsed.length !== 1 ? 's' : ''}`
    } else {
      this.state.canScanResults = []
      this.state.scanMessage = 'No devices found'
    }
  } catch (error) {
    console.error('[OI] Scan error:', error)
    this.state.scanMessage = 'Scan failed: ' + error.message
    this.state.canScanResults = []
  }

  this.state.isScanning = false
  this.emit('render')
}

/**
 * Add a device from scan results
 * @this {OpenInverterExtension}
 */
function addDeviceFromScan(device) {
  const existing = this.state.discoveredDevices.find(d => 
    d.nodeId === device.nodeId || d.serial === device.serialNumber
  )
  
  if (existing) {
    alert(`Device already added: ${existing.name || `Node ${existing.nodeId}`}`)
    return
  }

  this.state.discoveredDevices.push({
    nodeId: device.nodeId,
    serial: device.serialNumber,
    name: `Device ${device.nodeId}`,
    online: true,
    firmware: null
  })

  this.emit('render')
}

/**
 * Select a device from scan results (connect and navigate to device panel)
 * @this {OpenInverterExtension}
 */
function selectDeviceFromScan(device) {
  // Add device if not already added
  const existing = this.state.discoveredDevices.find(d => 
    d.nodeId === device.nodeId || d.serial === device.serialNumber
  )
  
  if (!existing) {
    this.state.discoveredDevices.push({
      nodeId: device.nodeId,
      serial: device.serialNumber,
      name: `Device ${device.nodeId}`,
      online: true,
      firmware: null
    })
  }
  
  // Connect to device
  connectToDevice.call(this, device.nodeId, device.serialNumber)
  
  // Navigate to device panel via menu system
  const serial = device.serialNumber || `NODE_${device.nodeId}`
  this.emit('change-extension-panel', { 
    extensionId: 'openinverter', 
    panelId: `device-${serial}` 
  })
}

/**
 * Add a device manually
 * @this {OpenInverterExtension}
 */
function addDeviceManually() {
  const nodeId = this.state.selectedNodeId
  
  // For mock devices (>127), generate a mock serial if not provided
  let serial = this.state.manualSerial
  if (!serial) {
    if (nodeId > 127) {
      serial = `MOCK-${String(nodeId).padStart(3, '0')}-${Date.now().toString(36).slice(-4).toUpperCase()}`
    } else {
      serial = `MANUAL_${nodeId}`
    }
  }

  const existing = this.state.discoveredDevices.find(d => 
    d.nodeId === nodeId || d.serial === serial
  )
  
  if (existing) {
    alert(`Device already added: ${existing.name || `Node ${existing.nodeId}`}`)
    return
  }

  // Create device with appropriate defaults
  const device = {
    nodeId: nodeId,
    serial: serial,
    name: nodeId > 127 ? `Test Inverter ${nodeId}` : `Device ${nodeId}`,
    online: true,
    firmware: nodeId > 127 ? 'v4.2.0-mock' : null
  }

  this.state.discoveredDevices.push(device)

  this.state.manualSerial = ''
  this.emit('render')
  
  console.log('[OI] Device added manually:', device)
}

/**
 * Select device manually (connect and navigate to device panel)
 * @this {OpenInverterExtension}
 */
function selectDeviceManually() {
  addDeviceManually.call(this)
  
  // Now connect to the device
  const nodeId = this.state.selectedNodeId
  const device = this.state.discoveredDevices.find(d => d.nodeId === nodeId)
  if (device) {
    connectToDevice.call(this, device.nodeId, device.serial)
    
    // Navigate to device panel via menu system
    this.emit('change-extension-panel', { 
      extensionId: 'openinverter', 
      panelId: `device-${device.serial}` 
    })
  }
}

/**
 * Connect to a device (sets state but doesn't navigate)
 * @this {OpenInverterExtension}
 */
async function connectToDevice(nodeId, serial) {
  console.log('[OI] Connecting to device:', { nodeId, serial })
  
  this.state.selectedNodeId = nodeId
  
  // Handle mock device mode (node ID > 127) - entirely in JavaScript
  if (nodeId > 127) {
    const mockSerial = serial || `MOCK-${String(nodeId).padStart(3, '0')}-${Date.now().toString(36).slice(-4).toUpperCase()}`
    
    // Initialize discoveredDevices if needed
    if (!this.state.discoveredDevices) {
      this.state.discoveredDevices = []
    }
    
    // Create mock device object
    const mockDevice = {
      nodeId: nodeId,
      serial: mockSerial,
      name: `Test Inverter ${nodeId}`,
      firmware: 'v4.2.0-mock',
      online: true
    }
    
    // Add to discovered devices if not already there
    const existingIndex = this.state.discoveredDevices.findIndex(d => 
      d.nodeId === nodeId || d.serial === mockSerial
    )
    
    if (existingIndex >= 0) {
      // Update existing device
      this.state.discoveredDevices[existingIndex] = mockDevice
    } else {
      // Add new device
      this.state.discoveredDevices.push(mockDevice)
    }
    
    // Set mock device as connected
    this.state.oiDeviceConnected = true
    this.state.currentDeviceSerial = mockSerial
    this.state.oiParameters = null // Will load mock parameters
    
    console.log('[OI] Mock device connected:', mockDevice)
    
    // Update menu to include this device
    if (this.getMenuItems) {
      this.emit('update-extension-menu')
    }
    
    return
  }
  
  // Real device connection
  this.state.currentDeviceSerial = serial
  this.state.oiDeviceConnected = true
  this.state.oiParameters = null // Clear old parameters
  
  // Update menu to include this device
  if (this.getMenuItems) {
    this.emit('update-extension-menu')
  }
}

/**
 * Select a device from the card (navigate to device panel via menu)
 * @this {OpenInverterExtension}
 */
function selectDeviceFromCard(device) {
  connectToDevice.call(this, device.nodeId, device.serial)
  
  // Navigate to device panel via menu system  
  this.emit('change-extension-panel', { 
    extensionId: 'openinverter', 
    panelId: `device-${device.serial}` 
  })
}

/**
 * Start editing device name
 * @this {OpenInverterExtension}
 */
function startEditingDeviceName(device) {
  this.state.editingDeviceName = device.serial
  this.state.editingDeviceNameValue = device.name || ''
  this.emit('render')
}

/**
 * Save device name
 * @this {OpenInverterExtension}
 */
function saveDeviceName(device) {
  const newName = this.state.editingDeviceNameValue?.trim()
  if (newName) {
    device.name = newName
  }
  this.state.editingDeviceName = null
  this.emit('render')
}

/**
 * Delete a device
 * @this {OpenInverterExtension}
 */
function deleteDevice(device) {
  if (!confirm(`Delete ${device.name || `Device ${device.nodeId}`}?`)) {
    return
  }

  const index = this.state.discoveredDevices.findIndex(d => d.serial === device.serial)
  if (index !== -1) {
    this.state.discoveredDevices.splice(index, 1)
    
    // If this was the connected device, disconnect
    if (this.state.currentDeviceSerial === device.serial) {
      this.state.oiDeviceConnected = false
      this.state.currentDeviceSerial = null
      this.state.oiParameters = null
    }
    
    // Update menu
    if (this.getMenuItems) {
      this.emit('update-extension-menu')
    }
  }

  this.emit('render')
}

export { renderDeviceSelectorTab, renderDevicePanel }
