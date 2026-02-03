/**
 * OpenInverter Extension - Main Class
 * 
 * This is the main extension class that coordinates all tab render functions.
 * The actual rendering is delegated to specialized tab modules.
 */

class OpenInverterExtension {
  // Embedded Tabler Icons for self-contained extension (no dependency on SS sprite)
  static ICONS = {
    playerPlay: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>',
    playerPause: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /></svg>',
    playerStop: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>',
    refresh: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>'
  }

  constructor(deviceAPI, emit, state, html) {
    this.device = deviceAPI
    this.emit = emit
    this.state = state
    this.html = html
    
    // Initialize state for device list
    if (!this.state.discoveredDevices) {
      this.state.discoveredDevices = []
    }
    if (!this.state.selectedDeviceSerial) {
      this.state.selectedDeviceSerial = null
    }
    // Initialize mock CAN mappings storage (for mock devices, nodeId > 127)
    if (!this.state.mockCanMappings) {
      this.state.mockCanMappings = { tx: [], rx: [] }
    }
    if (!this.state.activeDeviceTab) {
      this.state.activeDeviceTab = 'telemetry'
    }
    
    // Initialize chart-related state
    if (!this.state.spotValueHistory) {
      this.state.spotValueHistory = {}
    }
    if (!this.state.selectedChartParams) {
      this.state.selectedChartParams = new Set()
    }
    if (this.state.autoRefreshInterval === undefined || this.state.autoRefreshInterval === null) {
      this.state.autoRefreshInterval = 1000 // 1 second default
    }
    if (this.state.isEditingInterval === undefined) {
      this.state.isEditingInterval = false
    }
    
    // Initialize CAN Messages state
    if (!this.state.canMessages) {
      this.state.canMessages = {
        canId: '3F',
        dataBytes: '00 00 00 00 00 00 00 00',
        periodicMessages: [],
        showAddPeriodicForm: false,
        periodicFormData: {
          canId: '',
          data: '',
          interval: 100
        }
      }
    }
    
    // Initialize CAN IO Control state
    if (!this.state.canIo) {
      this.state.canIo = {
        active: false,
        canId: '3F',
        interval: 100,
        cruise: false,
        start: false,
        brake: false,
        forward: false,
        reverse: false,
        bms: false,
        throttlePercent: 0,
        cruisespeed: 0,
        regenpreset: 0,
        useCrc: true
      }
    }
    
    // Initialize Parameters tab state
    if (!this.state.oiParameters) {
      this.state.oiParameters = null
    }
    if (this.state.isLoadingOiParameters === undefined) {
      this.state.isLoadingOiParameters = false
    }
    if (!this.state.collapsedCategories) {
      this.state.collapsedCategories = new Set()
    }
    if (this.state.nodeId === undefined) {
      this.state.nodeId = this.state.selectedNodeId?.toString() || '1'
    }
    if (this.state.isImporting === undefined) {
      this.state.isImporting = false
    }
    if (!this.state.importProgress) {
      this.state.importProgress = { current: 0, total: 0 }
    }
    
    // Initialize CAN Mappings tab state
    if (!this.state.canMappings) {
      this.state.canMappings = null
    }
    if (this.state.isLoadingCanMappings === undefined) {
      this.state.isLoadingCanMappings = false
    }
    if (!this.state.canMappingError) {
      this.state.canMappingError = null
    }
    if (!this.state.showCanMappingForm) {
      this.state.showCanMappingForm = false
    }
    if (!this.state.canMappingFormData) {
      this.state.canMappingFormData = {
        isrx: false,
        id: 0,
        paramid: 0,
        position: 0,
        length: 16,
        gain: 1.0,
        offset: 0,
      }
    }
    if (!this.state.allParamsWithIds) {
      this.state.allParamsWithIds = null
    }
    if (this.state.isLoadingAllParamsWithIds === undefined) {
      this.state.isLoadingAllParamsWithIds = false
    }
    
    // Set up dynamic render methods for device panels (must be last)
    this._setupDynamicDevicePanels()
  }

  // === Installation ===

  /**
   * Install device files to the device.
   * Uses this.deviceFiles which is injected by the loader.
   */
  async onInstall() {
    if (!this.state.isConnected) return false
    
    console.log('[OpenInverter] Installing device files...')
    
    try {
      // Create directory
      await this.device.mkdir('/lib/ext/openinverter')
      
      // Write OI_helpers.py from the bundle
      for (const [targetPath, content] of Object.entries(this.deviceFiles)) {
        const filename = targetPath.split('/').pop()
        console.log(`[OpenInverter] Writing ${filename}...`)
        await this.device.saveFile(targetPath, content)
      }
      
      console.log('[OpenInverter] Installation complete! Device may need restart to use extension.')
      return true
    } catch (e) {
      console.error('[OpenInverter] Installation failed:', e)
      return false
    }
  }
  
  /**
   * Set up dynamic render methods for device panels
   * Creates renderDevice-{serial}() methods that the extension container looks for
   */
  _setupDynamicDevicePanels() {
    const self = this
    
    // Create render methods for existing devices
    if (this.state.discoveredDevices) {
      this.state.discoveredDevices.forEach(device => {
        const methodName = `renderDevice-${device.serial}`
        if (!self[methodName]) {
          self[methodName] = function() {
            self.state.selectedDeviceSerial = device.serial
            return renderDevicePanel.call(self)
          }
        }
      })
    }
    
    // Monkey-patch array push to auto-create render methods for new devices
    const originalPush = this.state.discoveredDevices.push.bind(this.state.discoveredDevices)
    this.state.discoveredDevices.push = function(...items) {
      const result = originalPush(...items)
      items.forEach(device => {
        if (device && device.serial) {
          const methodName = `renderDevice-${device.serial}`
          if (!self[methodName]) {
            self[methodName] = function() {
              self.state.selectedDeviceSerial = device.serial
              return renderDevicePanel.call(self)
            }
          }
        }
      })
      return result
    }
  }

  /**
   * Get dynamic menu items (called by Scripto Studio to build extension submenu)
   * Returns discovered devices as submenu items
   */
  getMenuItems() {
    const baseMenu = [
      { "id": "deviceselector", "label": "Device Manager" }
    ]
    
    // Add discovered devices as submenu items
    if (this.state.discoveredDevices && this.state.discoveredDevices.length > 0) {
      // Add devices section header
      baseMenu.push({ id: 'devices-header', label: '--- DEVICES ---', disabled: true })
      
      const deviceMenuItems = this.state.discoveredDevices.map(device => ({
        id: `device-${device.serial}`,
        label: device.name || `Device ${device.nodeId}`,
        icon: device.online ? 'device' : 'device-off'
      }))
      
      return [...baseMenu, ...deviceMenuItems]
    }
    
    return baseMenu
  }

  /**
   * Render method: Device Selector
   * Shows device list and scanning tools
   */
  renderDeviceselector() {
    return renderDeviceSelectorTab.call(this)
  }

  /**
   * Handle dynamic device panel rendering
   * Called when a device submenu item is clicked
   */
  render(panelId) {
    // Check if this is a device panel
    if (panelId && panelId.startsWith('device-')) {
      const serial = panelId.replace('device-', '')
      this.state.selectedDeviceSerial = serial
      return renderDevicePanel.call(this)
    }
    
    // Fall back to standard panel rendering
    const methodName = `render${panelId.charAt(0).toUpperCase() + panelId.slice(1)}`
    if (typeof this[methodName] === 'function') {
      return this[methodName]()
    }
    
    return this.html`<div class="panel-message">Panel not found: ${panelId}</div>`
  }

  /**
   * Render method: Parameters Tab
   * Delegates to renderParametersTab() function (defined in tabs/ParametersTab.js)
   */
  renderParameters() {
    return renderParametersTab.call(this)
  }

  /**
   * Render method: Telemetry Tab
   * Delegates to renderSpotValuesTab() function (defined in tabs/SpotValuesTab.js)
   */
  renderSpotvalues() {
    return renderSpotValuesTab.call(this)
  }

  /**
   * Render method: CAN Mappings Tab
   * Delegates to renderCanMappingsTab() function (defined in tabs/CanMappingsTab.js)
   */
  renderCanmappings() {
    return renderCanMappingsTab.call(this)
  }

  /**
   * Render method: Charts Tab
   * NOTE: ChartsTab is removed - charting is integrated into SpotValuesTab
   */
  renderCharts() {
    // Redirect to spot values (where charting actually lives)
    return renderSpotValuesTab.call(this)
  }

  /**
   * Render method: CAN Messages Tab
   * Delegates to renderCanMessagesTab() function (defined in tabs/CanMessagesTab.js)
   */
  renderCanmessages() {
    return renderCanMessagesTab.call(this)
  }

  /**
   * Render an embedded Tabler icon as a data URI for use in img tags
   * @param {string} name - Icon name from ICONS
   * @param {number} size - Icon size in pixels (default 24)
   * @param {string} color - Stroke color (default '#333')
   * @returns {string} Data URI for use in img src
   */
  icon(name, size = 24, color = '#333') {
    const svg = OpenInverterExtension.ICONS[name]
    if (!svg) return ''
    const modifiedSvg = svg
      .replace(/width="24"/g, `width="${size}"`)
      .replace(/height="24"/g, `height="${size}"`)
      .replace(/stroke="currentColor"/g, `stroke="${color}"`)
    // encodeURIComponent properly handles # -> %23
    return `data:image/svg+xml,${encodeURIComponent(modifiedSvg)}`
  }

  /**
   * Render custom sidebar items (called by Scripto Studio for DEVICES section)
   * Shows list of discovered OpenInverter devices
   */
  renderSidebarDevices() {
    if (!this.state.discoveredDevices || this.state.discoveredDevices.length === 0) {
      return this.html`
        <div style="padding: 16px; text-align: center; color: var(--text-secondary); font-size: 12px;">
          <p style="margin: 0;">No devices found</p>
          <p style="margin: 8px 0 0; font-size: 11px;">Use Device Selector to scan</p>
        </div>
      `
    }

    return this.html`
      <div style="padding: 4px 0;">
        ${this.state.discoveredDevices.map(device => this.html`
          <div 
            onclick=${() => this.selectDeviceFromSidebar(device)}
            style="
              padding: 12px 16px;
              cursor: pointer;
              transition: background 0.2s;
              border-left: 3px solid ${this.state.selectedDeviceSerial === device.serial ? 'var(--oi-blue)' : 'transparent'};
              background: ${this.state.selectedDeviceSerial === device.serial ? 'var(--oi-blue-light)' : 'transparent'};
            "
            onmouseover=${(e) => { if (this.state.selectedDeviceSerial !== device.serial) e.currentTarget.style.background = 'var(--bg-tertiary)' }}
            onmouseout=${(e) => { if (this.state.selectedDeviceSerial !== device.serial) e.currentTarget.style.background = 'transparent' }}>
            
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: ${device.online ? '#4caf50' : '#999'};"></div>
              <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${device.name || `Device ${device.nodeId}`}
              </div>
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-left: 16px;">
              ${device.serial ? device.serial.substring(0, 12) + '...' : `Node ${device.nodeId}`}
            </div>
          </div>
        `)}
      </div>
    `
  }

  /**
   * Select a device from sidebar - switches to device view with tabs
   */
  selectDeviceFromSidebar(device) {
    this.state.selectedDeviceSerial = device.serial
    this.state.selectedNodeId = device.nodeId
    this.state.activeDeviceTab = 'telemetry'
    
    // Connect to device if not already connected
    if (!this.state.oiDeviceConnected || this.state.currentDeviceSerial !== device.serial) {
      // Ensure device is connected (for mock devices this is already set)
      if (device.nodeId > 127) {
        this.state.oiDeviceConnected = true
        this.state.currentDeviceSerial = device.serial
      }
    }
    
    this.emit('render')
  }

  /**
   * Render device panel with tabs when a device is selected
   * This is shown when clicking a device from the sidebar
   */
  renderDevicePanel() {
    const device = this.state.discoveredDevices.find(d => d.serial === this.state.selectedDeviceSerial)
    
    if (!device) {
      return this.html`
        <div class="panel-message">
          <p>Device not found</p>
        </div>
      `
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
              onclick=${() => this.switchDeviceTab('telemetry')}>
              Telemetry
            </button>
            <button 
              class="tab-button ${this.state.activeDeviceTab === 'parameters' ? 'active' : ''}"
              onclick=${() => this.switchDeviceTab('parameters')}>
              Parameters
            </button>
            <button 
              class="tab-button ${this.state.activeDeviceTab === 'canmapping' ? 'active' : ''}"
              onclick=${() => this.switchDeviceTab('canmapping')}>
              CAN Mappings
            </button>
            <button 
              class="tab-button ${this.state.activeDeviceTab === 'canmessages' ? 'active' : ''}"
              onclick=${() => this.switchDeviceTab('canmessages')}>
              CAN Messages
            </button>
            <button 
              class="tab-button ${this.state.activeDeviceTab === 'ota' ? 'active' : ''}"
              onclick=${() => this.switchDeviceTab('ota')}>
              OTA Update
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="tabs-content" style="flex: 1; overflow: auto; padding: 20px;">
          ${this.renderDeviceTabContent()}
        </div>
      </div>
    `
  }

  /**
   * Switch between device tabs
   */
  switchDeviceTab(tabId) {
    this.state.activeDeviceTab = tabId
    this.emit('render')
  }

  /**
   * Render the active tab content for the selected device
   */
  renderDeviceTabContent() {
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
}

export { OpenInverterExtension as default }
