/**
 * OTA Update Tab - Complete Implementation
 * 
 * Firmware upgrade interface for OpenInverter devices.
 * Supports both normal and recovery mode firmware updates.
 * 
 * Features:
 * - File selection (.bin files)
 * - Recovery mode for bricked devices
 * - Progress tracking during upgrade
 * - Serial number targeting for recovery mode
 */

/**
 * Render the OTA Update tab
 * @this {OpenInverterExtension}
 */
function renderOtaUpdateTab() {
  // Initialize firmware upgrade state
  if (!this.state.firmwareUpgrade) {
    this.state.firmwareUpgrade = {
      selectedFile: null,
      serialNumber: '',
      recoveryMode: false,
      inProgress: false,
      progress: 0,
      status: '',
      error: null
    }
  }

  const fw = this.state.firmwareUpgrade

  return this.html`
    <div style="padding: 20px;">
      <!-- Warning Notice -->
      <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px; color: #92400e;">
        <strong>⚠️ Warning:</strong> Firmware upgrades are potentially dangerous. 
        Do not interrupt the process once started. Ensure stable power supply.
      </div>
      
      <!-- File Selection -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="font-size: 16px; margin-bottom: 16px;">Firmware File</h3>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <input 
            type="file" 
            accept=".bin"
            onchange=${(e) => selectFirmwareFile.call(this, e)}
            disabled=${fw.inProgress}
            style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary);"
          />
          
          ${fw.selectedFile ? this.html`
            <div style="font-size: 13px; color: var(--text-secondary);">
              Selected: <span style="font-family: monospace; color: var(--text-primary);">${fw.selectedFile.name}</span>
              (${(fw.selectedFile.size / 1024).toFixed(1)} KB)
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Upgrade Options -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="font-size: 16px; margin-bottom: 16px;">Upgrade Options</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input 
              type="checkbox" 
              checked=${fw.recoveryMode}
              onchange=${(e) => { fw.recoveryMode = e.target.checked; this.emit('render'); }}
              disabled=${fw.inProgress}
              style="width: 16px; height: 16px;"
            />
            <span>Recovery Mode (for bricked devices)</span>
          </label>
          
          ${fw.recoveryMode ? this.html`
            <label style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 13px; color: var(--text-secondary);">
                Device Serial Number (8 hex digits, optional)
              </span>
              <input 
                type="text" 
                placeholder="e.g. 1A2B3C4D"
                maxlength="8"
                value=${fw.serialNumber}
                oninput=${(e) => { fw.serialNumber = e.target.value.toUpperCase(); this.emit('render'); }}
                disabled=${fw.inProgress}
                style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); font-family: monospace; width: 200px;"
              />
              <span style="font-size: 12px; color: var(--text-secondary);">
                Leave empty to upgrade the first device that boots
              </span>
            </label>
          ` : ''}
          
          ${!fw.recoveryMode && this.state.oiDeviceConnected ? this.html`
            <div style="font-size: 13px; color: var(--text-secondary);">
              Will upgrade device at Node ID ${this.state.selectedNodeId}. 
              ${this.state.currentDeviceSerial ? `Serial: ${this.state.currentDeviceSerial}` : ''}
            </div>
          ` : !fw.recoveryMode ? this.html`
            <div style="font-size: 13px; color: #ef4444;">
              Please connect to a device first (Device Manager)
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Start/Cancel Buttons -->
      <div style="display: flex; gap: 12px; margin-bottom: 24px;">
        <button 
          class="primary-button"
          onclick=${() => startFirmwareUpgrade.call(this)}
          disabled=${!fw.selectedFile || fw.inProgress || (!fw.recoveryMode && !this.state.oiDeviceConnected)}
          style="flex: 1;"
        >
          ${fw.inProgress ? 'Upgrading...' : 'Start Upgrade'}
        </button>
        
        ${fw.inProgress ? this.html`
          <button 
            class="secondary-button"
            onclick=${() => cancelFirmwareUpgrade.call(this)}
          >
            Cancel
          </button>
        ` : ''}
      </div>
      
      <!-- Progress/Status Display -->
      ${fw.inProgress || fw.status || fw.error ? this.html`
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px;">
          ${fw.inProgress ? this.html`
            <div>
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600;">Progress</span>
                  <span style="font-family: monospace;">${fw.progress.toFixed(1)}%</span>
                </div>
                <div style="width: 100%; height: 24px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden;">
                  <div style="height: 100%; background: linear-gradient(90deg, #4ade80, #22c55e); width: ${fw.progress}%; transition: width 0.3s;"></div>
                </div>
              </div>
              ${fw.status ? this.html`
                <div style="font-size: 13px; color: var(--text-secondary); margin-top: 8px;">
                  ${fw.status}
                </div>
              ` : ''}
            </div>
          ` : fw.error ? this.html`
            <div style="color: #ef4444;">
              <strong>Error:</strong> ${fw.error}
            </div>
          ` : fw.status ? this.html`
            <div style="color: #22c55e;">
              <strong>Success:</strong> ${fw.status}
            </div>
          ` : ''}
        </div>
      ` : ''}
      
      <!-- Help Text -->
      ${!fw.inProgress ? this.html`
        <div style="margin-top: 24px; padding: 16px; background: var(--bg-highlight); border: 1px solid var(--border-color); border-radius: 8px; font-size: 13px; color: var(--text-secondary);">
          <h4 style="margin: 0 0 8px 0; color: var(--text-primary);">How to use:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Select a .bin firmware file from your computer</li>
            <li>For normal upgrades: Connect to a device first, then click "Start Upgrade"</li>
            <li>For recovery: Check "Recovery Mode", optionally enter device serial, then power cycle the device and click "Start Upgrade" immediately</li>
            <li>Do NOT disconnect power or WebREPL during the upgrade</li>
          </ul>
        </div>
      ` : ''}
    </div>
  `
}

/**
 * Handle firmware file selection
 * @this {OpenInverterExtension}
 */
function selectFirmwareFile(event) {
  const file = event.target.files[0]
  if (file) {
    this.state.firmwareUpgrade.selectedFile = file
    this.state.firmwareUpgrade.error = null
    this.emit('render')
  }
}

/**
 * Start firmware upgrade process
 * @this {OpenInverterExtension}
 */
async function startFirmwareUpgrade() {
  const fw = this.state.firmwareUpgrade

  if (!fw.selectedFile) {
    alert('Please select a firmware file')
    return
  }

  // Validate file is binary
  if (!fw.selectedFile.name.endsWith('.bin')) {
    fw.error = 'Firmware must be a .bin file'
    this.emit('render')
    return
  }

  // Confirm upgrade
  if (!confirm('Are you sure you want to upgrade the firmware? This process cannot be interrupted.')) {
    return
  }

  fw.inProgress = true
  fw.progress = 0
  fw.status = 'Reading firmware file...'
  fw.error = null
  this.emit('render')

  try {
    // Read file as bytes
    const fileData = await readFileAsBytes.call(this, fw.selectedFile)

    fw.status = 'Uploading firmware to device...'
    this.emit('render')

    // Upload firmware data to device (in chunks if needed)
    await uploadFirmwareData.call(this, fileData)

    fw.status = 'Starting upgrade process...'
    this.emit('render')

    // Start the upgrade
    const args = {
      recovery_mode: fw.recoveryMode,
      serial_number: fw.recoveryMode && fw.serialNumber ? fw.serialNumber : null,
      node_id: !fw.recoveryMode ? this.state.selectedNodeId : null
    }

    const argsStr = JSON.stringify(args)
    const result = await this.device.execute(`from lib.ext.openinverter.OI_helpers import startFirmwareUpgrade; startFirmwareUpgrade(${argsStr})`)
    const parsed = this.device.parseJSON(result)

    if (parsed.error) {
      throw new Error(parsed.error)
    }

    // Poll for progress
    await pollFirmwareProgress.call(this)

  } catch (error) {
    console.error('[OI Firmware] Upgrade failed:', error)
    fw.error = error.message || 'Upgrade failed'
    fw.inProgress = false
    this.emit('render')
  }
}

/**
 * Cancel firmware upgrade
 * @this {OpenInverterExtension}
 */
function cancelFirmwareUpgrade() {
  if (!confirm('Cancel firmware upgrade? This may leave the device in an inconsistent state.')) {
    return
  }

  const fw = this.state.firmwareUpgrade
  fw.inProgress = false
  fw.status = 'Upgrade cancelled by user'
  fw.error = null
  this.emit('render')
}

/**
 * Read file as bytes array
 * @this {OpenInverterExtension}
 * @param {File} file - File object to read
 * @returns {Promise<Uint8Array>} File contents as bytes
 */
async function readFileAsBytes(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayBuffer = e.target.result
      const bytes = new Uint8Array(arrayBuffer)
      resolve(bytes)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Upload firmware data to device in chunks
 * @this {OpenInverterExtension}
 * @param {Uint8Array} bytes - Firmware bytes to upload
 */
async function uploadFirmwareData(bytes) {
  const fw = this.state.firmwareUpgrade
  const chunkSize = 4096 // Upload in 4KB chunks
  const totalChunks = Math.ceil(bytes.length / chunkSize)

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, bytes.length)
    const chunk = Array.from(bytes.slice(start, end))

    const args = JSON.stringify({ chunk, offset: start })
    await this.device.execute(`from lib.ext.openinverter.OI_helpers import uploadFirmwareChunk; uploadFirmwareChunk(${args})`)

    fw.progress = (i / totalChunks) * 30 // First 30% is upload
    fw.status = `Uploading firmware... ${fw.progress.toFixed(0)}%`
    this.emit('render')
  }
}

/**
 * Poll firmware upgrade progress
 * @this {OpenInverterExtension}
 */
async function pollFirmwareProgress() {
  const fw = this.state.firmwareUpgrade
  const maxPolls = 600 // 10 minutes max (600 * 1 second)
  let polls = 0

  while (polls < maxPolls) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const result = await this.device.execute('from lib.ext.openinverter.OI_helpers import getFirmwareUpgradeStatus; getFirmwareUpgradeStatus()')
      const parsed = this.device.parseJSON(result)
      const status = parsed

      if (status.error) {
        throw new Error(status.error)
      }

      fw.progress = 30 + (status.progress * 0.7) // Map 0-100% to 30-100%
      fw.status = status.message || 'Upgrading...'
      this.emit('render')

      if (status.complete) {
        fw.status = 'Upgrade completed successfully!'
        fw.progress = 100
        fw.inProgress = false
        this.emit('render')
        return
      }

    } catch (error) {
      console.error('[OI Firmware] Status poll error:', error)
      // Continue polling unless it's a critical error
    }

    polls++
  }

  throw new Error('Upgrade timeout')
}

export { renderOtaUpdateTab }
