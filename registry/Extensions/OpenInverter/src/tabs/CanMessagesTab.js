/**
 * CAN Messages Tab
 * 
 * CAN I/O control and message sending interface.
 * Allows sending one-shot and periodic CAN messages, plus CAN I/O control.
 */

/**
 * Render the CAN Messages tab
 * @this {OpenInverterExtension}
 * @returns {TemplateResult}
 */
function renderCanMessagesTab() {
  if (!this.state.oiDeviceConnected) {
    return this.html`
      <div class="system-panel">
        <div class="panel-message">
          <p>Please connect to a device first</p>
        </div>
      </div>
    `
  }
  
  return this.html`
    <div id="can-message-sender" class="system-panel">
      ${renderCanIoControl.call(this)}
      ${renderOneShotSender.call(this)}
      ${renderPeriodicMessages.call(this)}
    </div>
  `
}

/**
 * Render CAN I/O Control section
 * @this {OpenInverterExtension}
 */
function renderCanIoControl() {
  const canIo = this.state.canIo || {}
  
  return this.html`
    <div class="can-io-control">
      <h3>CAN I/O Control</h3>
      
      <div class="can-io-section">
        <div class="can-io-row">
          <label>CAN ID (hex)</label>
          <input 
            type="text"
            value="${canIo.canId || '3F'}"
            oninput=${(e) => { this.state.canIo.canId = e.target.value }}
          />
        </div>
        <div class="can-io-row">
          <label>Interval (ms)</label>
          <input 
            type="number"
            value="${canIo.interval || 100}"
            min="10"
            max="1000"
            oninput=${(e) => { this.state.canIo.interval = parseInt(e.target.value) }}
          />
        </div>
      </div>

      <div class="can-io-section">
        <h4>Control Flags</h4>
        <div class="can-io-flags">
          ${['cruise', 'start', 'brake', 'forward', 'reverse', 'bms'].map(flag => this.html`
            <label class="can-io-checkbox">
              <input 
                type="checkbox"
                checked=${canIo[flag] || false}
                onchange=${(e) => { this.state.canIo[flag] = e.target.checked }}
              />
              <span>${flag.charAt(0).toUpperCase() + flag.slice(1)}</span>
            </label>
          `)}
        </div>
      </div>

      <div class="can-io-section">
        <div class="can-io-row">
          <label>Throttle (%)</label>
          <input 
            type="range"
            min="0"
            max="100"
            value="${canIo.throttlePercent || 0}"
            oninput=${(e) => { this.state.canIo.throttlePercent = parseInt(e.target.value); this.emit('render'); }}
          />
          <span class="value">${canIo.throttlePercent || 0}%</span>
        </div>
      </div>

      <div class="can-io-actions">
        ${canIo.active ? this.html`
          <button class="stop-btn" onclick=${() => handleStopCanIo.call(this)}>
            Stop CAN IO
          </button>
          <div class="can-io-status-indicator">
            <div class="pulse"></div>
            Active
          </div>
        ` : this.html`
          <button class="start-btn" onclick=${() => handleStartCanIo.call(this)}>
            Start CAN IO
          </button>
        `}
      </div>
    </div>
  `
}

/**
 * Render one-shot message sender
 * @this {OpenInverterExtension}
 */
function renderOneShotSender() {
  const canMessages = this.state.canMessages || {}
  
  return this.html`
    <div class="message-section">
      <h3>Send One-Shot Message</h3>
      <div class="message-form">
        <div class="form-row">
          <label>
            CAN ID (hex)
            <input 
              class="input-hex"
              type="text"
              value="${canMessages.canId || '3F'}"
              placeholder="3F"
              oninput=${(e) => { this.state.canMessages.canId = e.target.value }}
            />
            <span class="input-hint">Enter hex value (e.g., 3F for 0x3F)</span>
          </label>
        </div>
        <div class="form-row">
          <label>
            Data Bytes (hex, space-separated)
            <input 
              class="input-data"
              type="text"
              value="${canMessages.dataBytes || '00 00 00 00 00 00 00 00'}"
              placeholder="00 00 00 00 00 00 00 00"
              oninput=${(e) => { this.state.canMessages.dataBytes = e.target.value }}
            />
            <span class="input-hint">Enter 8 bytes in hex (e.g., 01 02 03 04 05 06 07 08)</span>
          </label>
        </div>
        <div class="form-actions">
          <button 
            class="btn-send"
            onclick=${() => handleSendOneShot.call(this)}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  `
}

/**
 * Render periodic messages section
 * @this {OpenInverterExtension}
 */
function renderPeriodicMessages() {
  const periodicMessages = this.state.canMessages?.periodicMessages || []
  
  return this.html`
    <div class="message-section">
      <h3>Periodic Messages</h3>
      ${periodicMessages.length > 0 ? 
        renderDataTable.call(this, {
          columns: [
            { key: 'canId', label: 'CAN ID', render: (val) => `0x${toHex(val, 2)}` },
            { key: 'data', label: 'Data', render: (val) => formatBytes(val) },
            { key: 'interval', label: 'Interval (ms)' },
            { key: 'active', label: 'Status', render: (val) => val ? 'Active' : 'Inactive' }
          ],
          data: periodicMessages,
          actions: [
            {
              label: 'Toggle',
              className: 'btn-secondary',
              onClick: (msg, index) => handleTogglePeriodicMessage.call(this, index)
            },
            {
              label: 'Delete',
              className: 'btn-remove',
              onClick: (msg, index) => handleDeletePeriodicMessage.call(this, index)
            }
          ]
        })
        : this.html`<div class="no-messages">No periodic messages configured</div>`
      }
      
      <button class="btn-add" onclick=${() => { this.state.canMessages.showAddPeriodicForm = true; this.emit('render'); }}>
        Add Periodic Message
      </button>
    </div>
  `
}

/**
 * Handle start CAN I/O
 * @this {OpenInverterExtension}
 */
async function handleStartCanIo() {
  console.log('[CanIO] Starting...')
  this.state.canIo.active = true
  this.emit('render')
  // TODO: Implement actual CAN I/O start
}

/**
 * Handle stop CAN I/O
 * @this {OpenInverterExtension}
 */
function handleStopCanIo() {
  console.log('[CanIO] Stopping...')
  this.state.canIo.active = false
  this.emit('render')
  // TODO: Implement actual CAN I/O stop
}

/**
 * Handle send one-shot message
 * Uses direct Python execution (not deprecated sendCanMessage)
 * @this {OpenInverterExtension}
 */
async function handleSendOneShot() {
  if (!this.state.oiDeviceConnected) {
    alert('Not connected to device')
    return
  }

  const canId = this.state.canMessages.canId || ''
  const dataBytes = this.state.canMessages.dataBytes || ''

  if (!validateCanId(canId)) {
    alert('Invalid CAN ID (must be 0x000 to 0x7FF)')
    return
  }

  if (!validateDataBytes(dataBytes)) {
    alert('Invalid data bytes')
    return
  }

  const parsedCanId = parseHex(canId)
  const parsedData = parseDataBytes(dataBytes)

  try {
    const canConfig = await getCanConfig.call(this)
    
    // Build Python code inline - send CAN message directly
    const pythonCode = `
import CAN
import json

# Get CAN config
tx_pin = ${canConfig.txPin}
rx_pin = ${canConfig.rxPin}
bitrate = ${canConfig.bitrate}

# Initialize CAN (reuse if exists, otherwise create new)
try:
    # Try to reuse existing CAN device
    if 'can_dev' in globals() and can_dev is not None:
        can = can_dev
    else:
        can = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, bitrate=bitrate, mode=CAN.NORMAL, auto_restart=False)
        can_dev = can
except Exception as e:
    # If reuse fails, create new
    can = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, bitrate=bitrate, mode=CAN.NORMAL, auto_restart=False)
    can_dev = can

# Send message
can.send(${JSON.stringify(parsedData)}, ${parsedCanId})

# Return success
print(json.dumps({'success': True, 'can_id': ${parsedCanId}}))
`
    
    const result = await this.device.execute(pythonCode)
    const parsed = this.device.parseJSON(result)
    
    if (parsed && parsed.error) {
      alert(`Failed to send CAN message: ${parsed.error}`)
    } else {
      alert(`CAN message sent: ID 0x${parsedCanId.toString(16).toUpperCase()}`)
    }
  } catch (error) {
    console.error('[CAN] Send error:', error)
    alert('Failed to send CAN message: ' + error.message)
  }
}

/**
 * Handle toggle periodic message
 * @this {OpenInverterExtension}
 */
function handleTogglePeriodicMessage(index) {
  const msg = this.state.canMessages.periodicMessages[index]
  msg.active = !msg.active
  this.emit('render')
  // TODO: Implement actual periodic message toggle
}

/**
 * Handle delete periodic message
 * @this {OpenInverterExtension}
 */
function handleDeletePeriodicMessage(index) {
  if (confirm('Delete this periodic message?')) {
    this.state.canMessages.periodicMessages.splice(index, 1)
    this.emit('render')
  }
}
