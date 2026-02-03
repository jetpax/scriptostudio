/**
 * Commands Tab - Device Control
 * 
 * CAN bus scanner, device connection, parameter storage, motor control.
 * Copied from original monolithic version (2871c08) lines 873-1072
 */

export function renderCommandsTab() {
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
  
  return this.html`
    <div class="oi-parameters-container">
      <h2 style="color: var(--scheme-primary); margin-bottom: 20px;">Device Control</h2>
      
      <!-- Device Connection Status & Control -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="font-size: 16px; margin-bottom: 16px;">OpenInverter Connection</h3>
        
        <!-- Connection Status -->
        ${this.state.oiDeviceConnected ? this.html`
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #4ade80;"></div>
            <span style="color: #4ade80; font-weight: 600;">Connected to Node ID ${this.state.selectedNodeId}</span>
          </div>
          
          <button 
            class="secondary-button" 
            onclick=${() => this.disconnectDevice()}>
            Disconnect
          </button>
        ` : this.html`
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></div>
            <span style="color: #ef4444; font-weight: 600;">Not Connected to OpenInverter Device</span>
          </div>
          
          <!-- CAN Bus Scanner -->
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h4 style="font-size: 14px; margin: 0; color: var(--text-secondary);">Scan CAN Bus for Devices</h4>
              <div style="display: flex; gap: 8px;">
                <button 
                  class="primary-button" 
                  onclick=${() => this.scanCanBus(false)}
                  disabled=${!this.state.isConnected || this.state.isScanning}
                  style="padding: 8px 16px; font-size: 13px;">
                  ${this.state.isScanning ? 'Scanning...' : 'Quick Scan'}
                </button>
                <button 
                  class="secondary-button" 
                  onclick=${() => this.scanCanBus(true)}
                  disabled=${!this.state.isConnected || this.state.isScanning}
                  style="padding: 8px 16px; font-size: 13px;">
                  Full Scan
                </button>
              </div>
            </div>
            
            ${!this.state.isConnected ? this.html`
              <div style="text-align: center; padding: 16px; color: #ef4444; font-size: 13px; background: rgba(239, 68, 68, 0.1); border-radius: 4px;">
                <p>⚠️ Please connect to ESP32 device via WebREPL first</p>
              </div>
            ` : this.state.isScanning ? this.html`
              <div style="padding: 16px;">
                <div style="margin-bottom: 12px; color: var(--text-secondary); font-size: 13px; text-align: center;">
                  <p>Scanning CAN bus for devices...</p>
                  <p style="font-size: 12px; margin-top: 8px;">This may take a few seconds</p>
                </div>
              </div>
            ` : this.state.scanMessage ? this.html`
              <div style="text-align: center; padding: 16px; color: var(--text-secondary); font-size: 13px; background: var(--bg-tertiary); border-radius: 4px;">
                <p>${this.state.scanMessage}</p>
              </div>
            ` : this.state.canScanResults.length === 0 ? this.html`
              <div style="text-align: center; padding: 16px; color: var(--text-secondary); font-size: 13px;">
                <p>Click "Quick Scan" to check node IDs 1-10, or "Full Scan" to check all 127 node IDs</p>
              </div>
            ` : this.html`
              <div style="border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; font-size: 13px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: var(--bg-tertiary);">
                      <th style="padding: 6px 8px; text-align: left;">Node</th>
                      <th style="padding: 6px 8px; text-align: left;">Serial</th>
                      <th style="padding: 6px 8px; text-align: left;">Type</th>
                      <th style="padding: 6px 8px; text-align: left;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.state.canScanResults.map(device => this.html`
                      <tr style="border-top: 1px solid var(--border-color);">
                        <td style="padding: 6px 8px;">${device.nodeId}</td>
                        <td style="padding: 6px 8px; font-family: monospace; font-size: 12px;">${device.serialNumber || '—'}</td>
                        <td style="padding: 6px 8px; font-size: 12px;">OI</td>
                        <td style="padding: 6px 8px; text-align: right;">
                          <button 
                            class="secondary-button" 
                            style="padding: 4px 8px; font-size: 11px;"
                            onclick=${() => this.connectToNode(device.nodeId)}>
                            Connect
                          </button>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            `}
          </div>
          
          <!-- Manual Connection -->
          <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
            <h4 style="font-size: 14px; margin-bottom: 12px; color: var(--text-secondary);">Or Connect Manually</h4>
            <div style="display: flex; gap: 12px; align-items: center;">
              <label style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-size: 13px; color: var(--text-secondary);">Node ID</span>
                <input 
                  type="number" 
                  min="1" 
                  max="127" 
                  value=${this.state.selectedNodeId}
                  style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); width: 100px;"
                  oninput=${(e) => this.state.selectedNodeId = parseInt(e.target.value)}
                />
              </label>
              
              <button 
                class="primary-button" 
                style="margin-top: 20px;"
                onclick=${() => this.connectToDevice()}
                disabled=${!this.state.isConnected}>
                Connect
              </button>
            </div>
          </div>
        `}
      </div>
      
      <!-- Parameter Storage -->
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 16px; margin-bottom: 12px;">Parameter Storage</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="primary-button" onclick=${() => this.deviceSave()} disabled=${!this.state.oiDeviceConnected}>
            Save to Flash
          </button>
          <button class="secondary-button" onclick=${() => this.deviceLoad()} disabled=${!this.state.oiDeviceConnected}>
            Load from Flash
          </button>
          <button class="secondary-button" onclick=${() => this.deviceLoadDefaults()} disabled=${!this.state.oiDeviceConnected}>
            Load Factory Defaults
          </button>
        </div>
        <p style="color: var(--text-secondary); font-size: 13px; margin-top: 8px;">
          Save parameters to persistent storage or restore defaults
        </p>
      </div>

      <!-- Motor Control -->
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 16px; margin-bottom: 12px;">Motor Control</h3>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <select id="oi-start-mode" style="padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);" disabled=${!this.state.oiDeviceConnected}>
            <option value="0">Off</option>
            <option value="1">Normal</option>
            <option value="2">Manual</option>
            <option value="3">Boost</option>
            <option value="4">Buck</option>
            <option value="5">Sine</option>
            <option value="6">ACHeat</option>
          </select>
          <button class="primary-button" onclick=${() => this.deviceStart()} disabled=${!this.state.oiDeviceConnected}>
            Start Motor
          </button>
          <button class="secondary-button" onclick=${() => this.deviceStop()} disabled=${!this.state.oiDeviceConnected}>
            Stop Motor
          </button>
        </div>
        <p style="color: var(--text-secondary); font-size: 13px; margin-top: 8px;">
          Start motor in selected mode or stop operation
        </p>
      </div>

      <!-- System Actions -->
      <div>
        <h3 style="font-size: 16px; margin-bottom: 12px;">System Actions</h3>
        <button class="secondary-button" style="background: #c0392b; color: white;" onclick=${() => this.deviceReset()} disabled=${!this.state.oiDeviceConnected}>
          Reset Device
        </button>
        <p style="color: var(--text-secondary); font-size: 13px; margin-top: 8px;">
          Perform a software reset of the device
        </p>
      </div>
    </div>
  `
}
