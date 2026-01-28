/**
 * Device Card Component
 * 
 * Renders a device card for the device selector list.
 * Shows device info, online status, and action buttons (edit name, delete).
 */

/**
 * Render a device card
 * 
 * @this {OpenInverterExtension}
 * @param {Object} device - Device object
 * @param {string} device.serial - Device serial number
 * @param {number} device.nodeId - CAN node ID
 * @param {string} [device.name] - Custom device name
 * @param {string} [device.firmware] - Firmware version
 * @param {boolean} [device.online] - Online status
 * @returns {TemplateResult} - Rendered device card
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
              ${renderIcon.call(this, 'edit', 16)}
            </button>
          ` : ''}
          <button 
            class="btn-danger"
            onclick=${(e) => { e.stopPropagation(); deleteDevice.call(this, device); }}
            onmousedown=${(e) => e.stopPropagation()}
            style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px; background: #dc3545; color: white; border: none; pointer-events: auto;"
            title="Delete"
          >
            ${renderIcon.call(this, 'trash', 16, 'white')}
          </button>
        `}
      </div>
    </div>
  `
}

/**
 * Helper: Render icon from static ICONS
 * @this {OpenInverterExtension}
 */
function renderIcon(name, size = 24, color = 'currentColor') {
  const iconMap = {
    'edit': OpenInverterExtension.ICONS.edit,
    'trash': OpenInverterExtension.ICONS.trash,
    'refresh': OpenInverterExtension.ICONS.refresh,
    'play': OpenInverterExtension.ICONS.playerPlay,
    'pause': OpenInverterExtension.ICONS.playerPause,
    'stop': OpenInverterExtension.ICONS.playerStop
  }
  
  const svg = iconMap[name] || ''
  // Create a data URL for the SVG
  const svgWithColor = svg.replace(/currentColor/g, color)
  return this.html`<span style="width: ${size}px; height: ${size}px; display: inline-flex;" dangerouslySetInnerHTML=${{ __html: svgWithColor }}></span>`
}

/**
 * Helper: Select device from card click
 * @this {OpenInverterExtension}
 */
function selectDeviceFromCard(device) {
  // This will be implemented in the main class or tab
  console.log('[DeviceCard] Select device:', device)
  // Emit event or call method
  if (typeof this.handleDeviceSelection === 'function') {
    this.handleDeviceSelection(device)
  }
}

/**
 * Helper: Start editing device name
 * @this {OpenInverterExtension}
 */
function startEditingDeviceName(device) {
  this.state.editingDeviceName = device.serial
  this.state.editingDeviceNameValue = device.name || ''
  this.emit('render')
}

/**
 * Helper: Save device name
 * @this {OpenInverterExtension}
 */
function saveDeviceName(device) {
  const newName = this.state.editingDeviceNameValue?.trim()
  if (newName) {
    // Update device name in saved devices
    const savedDevices = JSON.parse(localStorage.getItem('oi_saved_devices') || '[]')
    const deviceIndex = savedDevices.findIndex(d => d.serial === device.serial && d.nodeId === device.nodeId)
    if (deviceIndex !== -1) {
      savedDevices[deviceIndex].name = newName
      localStorage.setItem('oi_saved_devices', JSON.stringify(savedDevices))
      
      // Update in state
      const stateDevice = this.state.discoveredDevices.find(d => d.serial === device.serial && d.nodeId === device.nodeId)
      if (stateDevice) {
        stateDevice.name = newName
      }
    }
  }
  
  this.state.editingDeviceName = null
  this.state.editingDeviceNameValue = ''
  this.emit('render')
}

/**
 * Helper: Delete device
 * @this {OpenInverterExtension}
 */
function deleteDevice(device) {
  if (confirm(`Delete device "${device.name || device.serial}"?`)) {
    // Remove from saved devices
    const savedDevices = JSON.parse(localStorage.getItem('oi_saved_devices') || '[]')
    const filtered = savedDevices.filter(d => !(d.serial === device.serial && d.nodeId === device.nodeId))
    localStorage.setItem('oi_saved_devices', JSON.stringify(filtered))
    
    // Remove from state
    this.state.discoveredDevices = this.state.discoveredDevices.filter(d => !(d.serial === device.serial && d.nodeId === device.nodeId))
    
    this.emit('render')
  }
}
