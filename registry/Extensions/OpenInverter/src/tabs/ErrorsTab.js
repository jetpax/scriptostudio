/**
 * Errors Tab - Device Info and Error Log
 * 
 * Display device information and error log
 * Copied from original monolithic version (2871c08) lines 1135-1231
 */

export function renderErrorsTab() {
  // Load device info if not already loaded
  if (!this.state.oiDeviceInfo && !this.state.isLoadingDeviceInfo && this.state.isConnected) {
    setTimeout(() => this.loadDeviceInfo(), 0)
  }

  return this.html`
    <div class="oi-parameters-container">
      <h2 style="color: var(--scheme-primary); margin-bottom: 20px;">Device Information & Error Log</h2>
      
      ${renderDeviceInfoContent.call(this)}
    </div>
  `
}

function renderDeviceInfoContent() {
  if (this.state.isLoadingDeviceInfo) {
    return this.html`
      <div style="text-align: center; padding: 40px;">
        <p style="color: var(--text-secondary);">Loading device information...</p>
      </div>
    `
  }

  if (!this.state.oiDeviceInfo) {
    return this.html`
      <div style="text-align: center; padding: 40px;">
        <p style="color: var(--text-secondary);">No device information available</p>
        <button class="primary-button" style="margin-top: 16px;" onclick=${() => this.loadDeviceInfo()}>
          Load Device Info
        </button>
      </div>
    `
  }

  const info = this.state.oiDeviceInfo
  const errors = this.state.oiErrorLog || []

  return this.html`
    <div>
      <!-- Device Info -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="font-size: 16px; margin-bottom: 12px;">Device Info</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 8px; font-size: 14px;">
          <span style="color: var(--text-secondary);">Serial Number:</span>
          <span style="font-family: monospace;">${info.serialNumber || 'N/A'}</span>
          
          <span style="color: var(--text-secondary);">Node ID:</span>
          <span>${info.nodeId || 'N/A'}</span>
          
          <span style="color: var(--text-secondary);">Bitrate:</span>
          <span>${info.bitrate ? (info.bitrate / 1000) + ' kbps' : 'N/A'}</span>
          
          <span style="color: var(--text-secondary);">Uptime:</span>
          <span>${info.uptime ? Math.floor(info.uptime / 1000) + ' seconds' : 'N/A'}</span>
        </div>
      </div>

      <!-- Error Log -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="font-size: 16px; margin: 0;">Error Log</h3>
          <button class="secondary-button" onclick=${() => this.loadDeviceInfo()}>
            Refresh
          </button>
        </div>
        
        ${errors.length === 0 ? this.html`
          <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
            No errors logged
          </p>
        ` : this.html`
          <div style="border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: var(--scheme-primary); color: white;">
                  <th style="padding: 8px; text-align: left;">Timestamp</th>
                  <th style="padding: 8px; text-align: left;">Error Code</th>
                  <th style="padding: 8px; text-align: left;">Description</th>
                </tr>
              </thead>
              <tbody>
                ${errors.map(err => this.html`
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px; font-family: monospace; font-size: 13px;">${err.timestamp || 'N/A'}</td>
                    <td style="padding: 8px; font-family: monospace; font-weight: 600;">${err.code || 'N/A'}</td>
                    <td style="padding: 8px;">${err.description || 'N/A'}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `
}
