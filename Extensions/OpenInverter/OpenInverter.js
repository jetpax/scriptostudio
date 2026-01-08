// === START_EXTENSION_CONFIG ===
// {
//   "name": "OpenInverter",
//   "id": "openinverter",
//   "version": [1, 99, 0],
//   "author": "JetPax",
//   "description": "Complete OpenInverter suite. Configure parameters, map CAN messages, view spot values, and plot real-time signals from OpenInverter motor controllers.",
//   "icon": "sliders",
//   "iconSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon icon-tabler icon-tabler-bolt\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" stroke-width=\"2\" stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11\" /></svg>",
//   "mipPackage": "github:jetpax/scripto-studio-registry/Extensions/OpenInverter/lib",
//   "menu": [
//     { "id": "deviceselector", "label": "Device Manager" }
//   ],
//   "styles": ":root { --oi-blue: #1e88e5; --oi-blue-dark: #1565c0; --oi-blue-light: #e3f2fd; --oi-orange: #ff8c00; --oi-orange-light: #ffa726; --oi-beige: #fef8f0; --oi-yellow: #ffd54f; --oi-status-success: #4caf50; --oi-status-warning: #ff9800; --oi-status-error: #f44336; --oi-status-info: #1e88e5; --text-muted: #999; } .tabs-container { display: flex; flex-direction: column; height: 100%; } .tabs-header { border-bottom: 2px solid var(--border-color); background: var(--bg-secondary); } .tabs-nav { display: flex; gap: 0; overflow-x: auto; } .tab-button { background: transparent; border: none; padding: 16px 24px; font-size: 14px; font-weight: 600; color: var(--text-secondary); cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; white-space: nowrap; } .tab-button:hover:not(:disabled) { color: var(--oi-blue); background: var(--oi-blue-light); } border-bottom-color: var(--oi-blue); } .tab-button:disabled { opacity: 0.5; cursor: not-allowed; } .tabs-content { flex: 1; overflow-y: auto; } .system-panel { background: var(--bg-secondary); border-radius: 8px; overflow: hidden; margin-bottom: 24px; } .panel-header { background: var(--oi-blue); color: white; padding: 20px; border-bottom: 1px solid var(--border-color); } .panel-message { padding: 40px 20px; text-align: center; color: var(--text-secondary); } .btn-primary { background: var(--oi-blue); color: white; border: 2px solid var(--oi-blue); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .btn-primary:hover:not(:disabled) { background: var(--oi-blue-dark); border-color: var(--oi-blue-dark); } .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; } .btn-secondary { background: var(--oi-beige); color: var(--text-primary); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .btn-secondary:hover:not(:disabled) { background: #f0e4d0; border-color: var(--oi-blue); color: var(--oi-blue); } .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; } .secondary-button { background: var(--oi-beige); color: var(--text-primary); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .secondary-button:hover:not(:disabled) { background: #f0e4d0; border-color: var(--oi-blue); color: var(--oi-blue); } .secondary-button:disabled { opacity: 0.5; cursor: not-allowed; } .primary-button { background: var(--oi-blue); color: white; border: 2px solid var(--oi-blue); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .primary-button:hover:not(:disabled) { background: var(--oi-blue-dark); border-color: var(--oi-blue-dark); } .primary-button:disabled { opacity: 0.5; cursor: not-allowed; } .refresh-button { background: var(--oi-beige); color: var(--text-primary); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .refresh-button:hover:not(:disabled) { background: #f0e4d0; border-color: var(--oi-blue); color: var(--oi-blue); } .spot-values-categories { display: flex; flex-direction: column; gap: 2rem; } .spot-values-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; } .oi-category-section { margin-bottom: 2rem; } .oi-category-title { font-size: 1.1rem; font-weight: 600; color: var(--oi-blue); margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--oi-blue); } .oi-spotvalues-container { padding: 20px; } .oi-spotvalue-card { background: var(--bg-secondary); border: 2px solid transparent; border-radius: 6px; padding: 0.75rem; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 0.75rem; } .oi-spotvalue-card:hover { border-color: var(--oi-blue); background: var(--oi-blue-light); } .oi-spotvalue-name { font-weight: 500; color: var(--text-primary); font-size: 0.9rem; margin-bottom: 0.25rem; } .oi-spotvalue-value { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); font-family: 'Monaco', 'Courier New', monospace; } #device-parameters { padding: 20px; } .parameters-grid { display: flex; flex-direction: column; gap: 1.5rem; } .parameter-category { border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; background: var(--bg-secondary); transition: padding 0.2s; } .parameter-category.collapsed { padding: 1.5rem; } .parameter-category.collapsed .category-title { margin-bottom: 0; padding-bottom: 0; border-bottom: none; } .category-title { font-size: 1.1rem; font-weight: 600; color: var(--oi-blue); margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--oi-beige); display: flex; align-items: center; gap: 0.75rem; user-select: none; transition: all 0.2s; cursor: pointer; } .category-title:hover { color: var(--oi-blue-dark); } .collapse-icon { display: inline-flex; align-items: center; justify-content: center; width: 20px; font-size: 0.8rem; color: var(--oi-blue); transition: transform 0.2s; } .param-count { margin-left: auto; font-size: 0.85rem; font-weight: normal; color: var(--text-muted); } .parameters-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; } .parameter-item { display: flex; flex-direction: column; gap: 0.5rem; } .parameter-header { display: flex; justify-content: space-between; align-items: baseline; } .parameter-label { font-weight: 500; color: var(--text-primary); font-size: 0.9rem; margin-bottom: 0; } .parameter-unit { color: var(--text-muted); font-weight: normal; font-size: 0.85rem; } .parameter-input-group { display: flex; flex-direction: column; gap: 0.25rem; } .parameter-input-group input[type=\"number\"], .parameter-input-group select { padding: 0.5rem 0.75rem; font-size: 0.95rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); width: 100%; } .parameter-input-group input[type=\"number\"]:focus, .parameter-input-group select:focus { outline: none; border-color: var(--oi-blue); } .parameter-hint { display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; line-height: 1.3; } .form-group { margin-bottom: 1.5rem; } .form-group label { display: block; font-weight: 500; color: var(--text-primary); font-size: 0.9rem; margin-bottom: 0.5rem; } .form-group input[type=\"text\"] { width: 100%; padding: 0.5rem 0.75rem; font-size: 0.95rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); } .form-group input[type=\"text\"]:focus { outline: none; border-color: var(--oi-blue); } .form-group .hint { display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; } .button-group { display: flex; gap: 0.75rem; flex-wrap: wrap; } .section-header { font-size: 1.5rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1.5rem; cursor: pointer; } .can-mappings-container { display: flex; flex-direction: column; gap: 2rem; } .mapping-section { margin-bottom: 1.5rem; } .mapping-section h3 { margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-primary); } .no-mappings { color: var(--text-secondary); font-style: italic; padding: 1rem; background: var(--bg-secondary); border-radius: 4px; } .mappings-table { width: 100%; border-collapse: collapse; background: var(--bg-primary); border-radius: 8px; overflow: hidden; } .mappings-table thead { background: var(--bg-secondary); } .mappings-table th { padding: 0.75rem; text-align: left; font-weight: 600; color: var(--text-primary); border-bottom: 2px solid var(--border-color); } .mappings-table td { padding: 0.75rem; border-bottom: 1px solid var(--border-color); color: var(--text-primary); } .mappings-table tbody tr:last-child td { border-bottom: none; } .mappings-table tbody tr:hover { background: var(--bg-secondary); } .btn-remove { background: var(--oi-status-error); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; } .btn-remove:hover { background: #c82333; } .add-mapping-section { margin-top: 2rem; } .btn-add { background: var(--oi-blue); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; transition: background 0.2s; } .btn-add:hover { background: var(--oi-blue-dark); } .add-mapping-form { background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; } .add-mapping-form h3 { margin-top: 0; margin-bottom: 1.5rem; color: var(--text-primary); } .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; } .form-row label { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-primary); font-weight: 500; } .form-row input, .form-row select { padding: 0.6rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); font-size: 0.95rem; } .form-row input:focus, .form-row select:focus { outline: none; border-color: var(--oi-blue); } .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end; } .btn-cancel { background: #6c757d; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.95rem; transition: background 0.2s; } .btn-cancel:hover { background: #5a6268; } .btn-save { background: var(--oi-status-success); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: background 0.2s; } .btn-save:hover:not(:disabled) { background: #218838; } .btn-save:disabled { background: #ccc; cursor: not-allowed; opacity: 0.6; } .error-message { background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; border: 1px solid #f5c6cb; } .oi-compact-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color); } .oi-compact-header h2 { margin: 0; font-size: 24px; color: white; } .oi-button-row { display: flex; gap: 0.75rem; } .can-io-control { background: var(--bg-secondary, #f8f9fa); border-radius: 8px; padding: 20px; margin-bottom: 2rem; } .can-io-control h3 { margin: 0 0 20px 0; color: var(--text-primary); font-size: 18px; border-bottom: 2px solid var(--oi-blue); padding-bottom: 8px; } .can-io-section { margin-bottom: 20px; } .can-io-section h4 { margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px; font-weight: 600; } .can-io-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; } .can-io-row label { min-width: 140px; color: var(--text-secondary); font-size: 14px; } .can-io-row input[type=\"text\"], .can-io-row input[type=\"number\"] { padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; width: 100px; } .can-io-row input[type=\"range\"] { flex: 1; min-width: 200px; } .can-io-row .value { min-width: 50px; font-weight: 600; color: var(--oi-blue); } .can-io-row .hint { color: var(--text-muted); font-size: 12px; font-style: italic; } .can-io-flags { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; } .can-io-checkbox { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: white; border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; transition: all 0.2s; } .can-io-checkbox:hover:not(:has(input:disabled)) { border-color: var(--oi-blue); background: var(--oi-blue-light); } .can-io-checkbox input[type=\"checkbox\"] { width: 18px; height: 18px; cursor: pointer; } .can-io-checkbox input[type=\"checkbox\"]:disabled { cursor: not-allowed; } .can-io-checkbox span { font-size: 14px; color: var(--text-primary); user-select: none; } .can-io-actions { display: flex; align-items: center; gap: 16px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color); } .can-io-actions button { padding: 10px 24px; font-size: 14px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; } .can-io-actions button:disabled { opacity: 0.5; cursor: not-allowed; } .can-io-actions .start-btn { background: #28a745; color: white; } .can-io-actions .start-btn:hover:not(:disabled) { background: #218838; } .can-io-actions .stop-btn { background: #dc3545; color: white; } .can-io-actions .stop-btn:hover:not(:disabled) { background: #c82333; } .can-io-status-indicator { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #d4edda; color: #155724; border-radius: 4px; font-size: 14px; font-weight: 500; } .can-io-status-indicator .pulse { width: 10px; height: 10px; background: #28a745; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite; } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } } #can-message-sender { padding: 1.5rem; } .message-section { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color); } .message-section:last-child { border-bottom: none; } .message-section h3 { margin-bottom: 0.5rem; color: var(--text-primary); } .section-description { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; } .message-form { background: var(--bg-primary); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; } .form-row { margin-bottom: 1rem; } .form-row:last-child { margin-bottom: 0; } .form-row label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary); } .form-row input { width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; font-family: 'Courier New', monospace; font-size: 0.95rem; } .input-hex { max-width: 200px; } .input-data { max-width: 400px; letter-spacing: 0.1em; } .input-hint { display: block; font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; font-family: system-ui, -apple-system, sans-serif; font-style: italic; } .form-actions { margin-top: 1rem; display: flex; gap: 0.5rem; } .btn-send, .btn-start, .btn-stop, .btn-add, .btn-save, .btn-cancel, .btn-remove { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s ease; } .btn-send { background-color: var(--oi-blue); color: white; } .btn-send:hover:not(:disabled) { background-color: var(--oi-blue-dark); } .btn-send:disabled { background-color: #ccc; cursor: not-allowed; } .btn-start { background-color: #28a745; color: white; } .btn-start:hover:not(:disabled) { background-color: #218838; } .btn-stop { background-color: #dc3545; color: white; } .btn-stop:hover:not(:disabled) { background-color: #c82333; } .btn-add { background-color: var(--oi-blue); color: white; margin-top: 1rem; } .btn-add:hover { background-color: var(--oi-blue-dark); } .btn-save { background-color: var(--oi-status-success); color: white; } .btn-save:hover { background-color: #218838; } .btn-cancel { background-color: #6c757d; color: white; } .btn-cancel:hover { background-color: #5a6268; } .btn-remove { background-color: #dc3545; color: white; } .btn-remove:hover:not(:disabled) { background-color: #c82333; } .btn-remove:disabled { background-color: #ccc; cursor: not-allowed; opacity: 0.6; } .no-messages { color: var(--text-muted); font-style: italic; padding: 1rem; text-align: center; } .messages-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; background: white; } .messages-table thead { background-color: var(--bg-secondary); } .messages-table th, .messages-table td { padding: 0.75rem; text-align: left; border: 1px solid var(--border-color); } .messages-table th { font-weight: 600; color: var(--text-primary); } .data-cell { font-family: 'Courier New', monospace; font-size: 0.9rem; } .status-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 500; } .status-active { background-color: #d4edda; color: #155724; } .status-inactive { background-color: #f8d7da; color: #721c24; } .action-buttons { display: flex; gap: 0.5rem; } .add-message-section { margin-top: 1rem; } .add-message-form { background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; } .add-message-form h4 { margin-bottom: 1rem; color: var(--text-primary); } .device-card { background: white; border: 2px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; gap: 1rem; position: relative; } .device-card:hover { border-color: var(--oi-blue); box-shadow: 0 4px 12px rgba(30, 136, 229, 0.2); transform: translateY(-2px); } .btn-danger { background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; } .btn-danger:hover { background: #c82333; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3); }"
// }
// === END_EXTENSION_CONFIG ===

/**
 * OpenInverter Extension - Motor control and debugging interface
 * 
 * This extension provides a complete interface for configuring and monitoring
 * OpenInverter motor controllers.
 */

class OpenInverterExtension {
  // Embedded Tabler Icons for self-contained extension (no dependency on SS sprite)
  static ICONS = {
    playerPlay: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>',
    playerPause: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /></svg>',
    playerStop: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>',
    refresh: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>'
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
      this.state.activeDeviceTab = 'overview'
    }
    
    // Initialize chart-related state
    if (!this.state.spotValueHistory) {
      this.state.spotValueHistory = {}
    }
    if (!this.state.selectedChartParams) {
      this.state.selectedChartParams = new Set()
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
    this.state.activeDeviceTab = 'overview'
    
    // Connect to device if not already connected
    if (!this.state.oiDeviceConnected || this.state.currentDeviceSerial !== device.serial) {
      this.connectToDevice(device.nodeId, device.serial)
    }
    
    this.emit('render')
  }

  /**
   * Render device panel with tabs when a device is selected
   * This replaces the individual panel renders when viewing a specific device
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
        <div style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); padding: 20px;">
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
              class="tab-button ${this.state.activeDeviceTab === 'overview' ? 'active' : ''}"
              onclick=${() => this.switchDeviceTab('overview')}>
              Overview
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
        <div class="tabs-content">
          ${this.renderDeviceTabContent()}
        </div>
      </div>
    `
  }

  /**
   * Switch between device tabs
   */
  switchDeviceTab(tabId) {
    // Stop auto-refresh if switching away from overview
    if (this.state.activeDeviceTab === 'overview' && tabId !== 'overview' && this.autoRefreshTimer) {
      console.log('[OI Overview] Stopping auto-refresh (switching away from overview)')
      clearInterval(this.autoRefreshTimer)
      this.autoRefreshTimer = null
    }
    
    this.state.activeDeviceTab = tabId
    this.emit('render')
  }

  /**
   * Render the active tab content for the selected device
   */
  renderDeviceTabContent() {
    switch (this.state.activeDeviceTab) {
      case 'overview':
        return this.renderOverviewContent()
      case 'parameters':
        return this.renderParametersContent()
      case 'canmapping':
        return this.renderCanmappingContent()
      case 'canmessages':
        return this.renderCanmessagesContent()
      case 'ota':
        return this.renderFirmwareContent()
      default:
        return this.html`<div class="panel-message">Unknown tab</div>`
    }
  }

  /**
   * Add mock/test devices for development/testing
   */
  addMockDevices() {
    this.state.discoveredDevices = [
      {
        nodeId: 1,
        serial: 'ABC123456789ABCD',
        name: 'Test Inverter 1',
        firmware: 'v4.2.0',
        online: true
      },
      {
        nodeId: 2,
        serial: 'DEF456789ABC1234',
        name: 'Test Inverter 2',
        firmware: 'v4.1.5',
        online: true
      }
    ]
    
    // Also populate canScanResults for backward compatibility
    this.state.canScanResults = this.state.discoveredDevices.map(d => ({
      nodeId: d.nodeId,
      serial: d.serial,
      deviceType: 0,
      deviceTypeHex: '0x00000000'
    }))
    
    this.state.scanMessage = 'Mock devices added for testing'
    this.emit('render')
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

  // === Utility Functions ===

  /**
   * Formats a parameter value for display based on its type
   * Ported from openinverter-web-interface/web/src/utils/parameterDisplay.ts
   * 
   * @param {Object} param - The parameter object containing enums, unit, etc.
   * @param {number|string|null|undefined} value - The raw value to format
   * @returns {string} Formatted string for display, or empty string if value is null/undefined
   */
  formatParameterValue(param, value) {
    // Handle null/undefined - show nothing
    if (value === null || value === undefined) {
      return ''
    }

    // Handle enum values - show the mapped label
    if (param.enums && Object.keys(param.enums).length > 0) {
      const enumValue = String(Math.round(Number(value)))
      const label = param.enums[enumValue]
      return label || String(value)
    }

    // Handle numeric values with units
    if (typeof value === 'number') {
      const formattedValue = value.toFixed(2)
      return param.unit ? `${formattedValue} ${param.unit}` : formattedValue
    }

    // Fallback to string value
    return String(value)
  }

  /**
   * Gets the enum label for a numeric value
   * 
   * @param {Object} param - The parameter object containing enums
   * @param {number|string} value - The numeric value to convert
   * @returns {string} The enum label or the original value as string
   */
  getEnumLabel(param, value) {
    if (!param.enums || Object.keys(param.enums).length === 0) {
      return String(value)
    }

    const enumValue = String(Math.round(Number(value)))
    return param.enums[enumValue] || String(value)
  }

  /**
   * Converts a parameter value to a string suitable for dropdown selection
   * Rounds numeric values and converts to string to match enum keys
   * 
   * @param {number|string|null|undefined} value - The value to convert
   * @returns {string} String representation suitable for dropdown value
   */
  normalizeEnumValue(value) {
    if (value === null || value === undefined) {
      return '0'
    }
    return String(Math.round(Number(value)))
  }

  /**
   * Parse a unit string that may contain a numeric prefix
   * Examples: "10ms" -> { multiplier: 10, baseUnit: "ms" }
   *           "ms" -> { multiplier: 1, baseUnit: "ms" }
   *           "100us" -> { multiplier: 100, baseUnit: "us" }
   * 
   * @param {string} unit - The unit string to parse
   * @returns {Object|null} Object with multiplier and baseUnit, or null if invalid
   */
  parseUnit(unit) {
    if (!unit) return null

    // Try to match a number at the start of the unit string
    const match = unit.match(/^(\d+(?:\.\d+)?)(.+)$/)

    if (match) {
      // Has numeric prefix (e.g., "10ms")
      return {
        multiplier: parseFloat(match[1]),
        baseUnit: match[2]
      }
    }

    // No numeric prefix, treat as base unit with multiplier 1
    return {
      multiplier: 1,
      baseUnit: unit
    }
  }

  /**
   * Apply conversion to a spot value based on its unit
   * Ported from openinverter-web-interface/web/src/utils/spotValueConversions.ts
   * 
   * For units with numeric prefixes (e.g., "10ms", "100us"), converts the value
   * by applying the multiplier and normalizes the unit to remove the prefix.
   * Example: rawValue=12345 with unit="10ms" → value=123450 with unit="ms"
   * 
   * @param {number} rawValue - The raw numeric value from the device
   * @param {string} unit - The unit string from the parameter definition
   * @returns {Object} Object with converted value and display unit
   */
  convertSpotValue(rawValue, unit) {
    if (!unit) {
      return { value: rawValue, unit: '' }
    }

    const parsed = this.parseUnit(unit)
    if (!parsed) {
      return { value: rawValue, unit }
    }

    const { multiplier, baseUnit } = parsed

    // Recognized time units
    const TIME_UNITS = new Set(['s', 'ms', 'us', 'μs', 'ns', 'min', 'h', 'd'])

    // Check if it's a recognized unit type and has a numeric prefix
    if (multiplier !== 1 && TIME_UNITS.has(baseUnit)) {
      // Apply the multiplier to normalize to the base unit
      // Example: 12345 in "10ms" → 12345 × 10 = 123450 "ms"
      return {
        value: rawValue * multiplier,
        unit: baseUnit
      }
    }

    // No conversion needed, return as-is
    return { value: rawValue, unit }
  }

  /**
   * Check if a unit can be converted
   * 
   * @param {string} unit - The unit string to check
   * @returns {boolean} True if the unit has a conversion
   */
  hasConversion(unit) {
    if (!unit) return false

    const parsed = this.parseUnit(unit)
    if (!parsed) return false

    const TIME_UNITS = new Set(['s', 'ms', 'us', 'μs', 'ns', 'min', 'h', 'd'])
    
    // Check if it's a recognized unit with a non-1 multiplier
    return parsed.multiplier !== 1 && TIME_UNITS.has(parsed.baseUnit)
  }

  // === Helper Methods for OI_helpers.py ===

  async getOiParams() {
    const result = await this.device.execute('from lib.OI_helpers import getOiParams; getOiParams()')
    const parsed = this.device.parseJSON(result)
    // WebREPL Binary Protocol: Response is direct data, no CMD/ARG wrapper
    return parsed
  }

  async setParameter(args) {
    const argsStr = JSON.stringify(args)
    const result = await this.device.execute(`from lib.OI_helpers import setParameter; setParameter(${argsStr})`)
    const parsed = this.device.parseJSON(result)
    return parsed
  }

  async getSpotValues() {
    const result = await this.device.execute('from lib.OI_helpers import getSpotValues; getSpotValues()')
    const parsed = this.device.parseJSON(result)
    return parsed
  }

  async getCanMappings() {
    const result = await this.device.execute('from lib.OI_helpers import getCanMap; getCanMap()')
    console.log('[OI] getCanMappings raw result:', result)
    const parsed = this.device.parseJSON(result)
    console.log('[OI] getCanMappings parsed:', parsed)
    return parsed
  }

  async getAllParamsWithIds() {
    const result = await this.device.execute('from lib.OI_helpers import getAllParamsWithIds; getAllParamsWithIds()')
    const parsed = this.device.parseJSON(result)
    return parsed
  }

  /**
   * Get CAN bus configuration (pins, bitrate)
   * Tries to get from device config, falls back to defaults
   */
  async getCanConfig() {
    try {
      // Try to get from device config
      const pythonCode = `
import json
import os

config = {}
config_dir = '/config'
if not os.path.exists(config_dir):
    config_dir = '/store/config'
config_file = config_dir + '/can.json'

if os.path.exists(config_file):
    with open(config_file, 'r') as f:
        config = json.load(f)
else:
    # Fallback to main.py
    try:
        import sys
        sys.path.insert(0, '/device scripts')
        from main import CAN_TX_PIN, CAN_RX_PIN, CAN_BITRATE
        config = {
            'txPin': CAN_TX_PIN,
            'rxPin': CAN_RX_PIN,
            'bitrate': CAN_BITRATE
        }
    except:
        pass

# Use defaults if not found
result = {
    'txPin': config.get('txPin', 5),
    'rxPin': config.get('rxPin', 4),
    'bitrate': config.get('bitrate', 500000)
}
print(json.dumps(result))
`
      const result = await this.device.execute(pythonCode)
      return this.device.parseJSON(result)
    } catch (error) {
      console.warn('[CAN] Failed to get config, using defaults:', error)
      // Fallback to defaults
      return { txPin: 5, rxPin: 4, bitrate: 500000 }
    }
  }

  // === CAN Message Helper Methods ===

  /**
   * Format hex input to hex byte mask (XX XX XX XX XX XX XX XX)
   */
  formatHexBytes(input) {
    // Remove all non-hex characters
    const cleaned = input.replace(/[^0-9A-Fa-f]/g, '').toUpperCase()

    // Split into pairs and join with spaces
    const pairs = []
    for (let i = 0; i < cleaned.length && i < 16; i += 2) {
      if (i + 1 < cleaned.length) {
        pairs.push(cleaned.substring(i, i + 2))
      } else {
        pairs.push(cleaned.substring(i, i + 1))
      }
    }

    return pairs.join(' ')
  }

  /**
   * Parse hex string to number
   */
  parseHex(hex) {
    const cleaned = hex.trim().replace(/^0x/i, '')
    return parseInt(cleaned, 16)
  }

  /**
   * Parse data bytes string to array
   */
  parseDataBytes(data) {
    const bytes = data
      .trim()
      .split(/\s+/)
      .map(b => {
        const cleaned = b.replace(/^0x/i, '')
        return parseInt(cleaned, 16)
      })
      .filter(b => !isNaN(b))

    // Pad or truncate to 8 bytes
    while (bytes.length < 8) bytes.push(0)
    return bytes.slice(0, 8)
  }

  /**
   * Validate CAN ID
   */
  validateCanId(id) {
    const parsed = this.parseHex(id)
    return !isNaN(parsed) && parsed >= 0 && parsed <= 0x7FF
  }

  /**
   * Validate data bytes
   */
  validateDataBytes(data) {
    const bytes = this.parseDataBytes(data)
    return bytes.every(b => b >= 0 && b <= 0xFF)
  }

  /**
   * Send one-shot CAN message
   */
  async handleSendOneShot() {
    if (!this.state.oiDeviceConnected) {
      alert('Not connected to device')
      return
    }

    const canId = this.state.canMessages.canId || ''
    const dataBytes = this.state.canMessages.dataBytes || ''

    if (!this.validateCanId(canId)) {
      alert('Invalid CAN ID (must be 0x000 to 0x7FF)')
      return
    }

    if (!this.validateDataBytes(dataBytes)) {
      alert('Invalid data bytes')
      return
    }

    const parsedCanId = this.parseHex(canId)
    const parsedData = this.parseDataBytes(dataBytes)

    try {
      const canConfig = await this.getCanConfig()
      
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
   * Add periodic message
   */
  handleAddPeriodic() {
    const formData = this.state.canMessages.periodicFormData || {}

    if (!this.validateCanId(formData.canId)) {
      alert('Invalid CAN ID (must be 0x000 to 0x7FF)')
      return
    }

    if (!this.validateDataBytes(formData.data)) {
      alert('Invalid data bytes')
      return
    }

    if (formData.interval < 10 || formData.interval > 10000) {
      alert('Interval must be between 10ms and 10000ms')
      return
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      canId: this.parseHex(formData.canId),
      data: this.parseDataBytes(formData.data),
      interval: formData.interval,
      active: false
    }

    if (!this.state.canMessages.periodicMessages) {
      this.state.canMessages.periodicMessages = []
    }
    this.state.canMessages.periodicMessages.push(newMessage)
    this.state.canMessages.showAddPeriodicForm = false
    this.state.canMessages.periodicFormData = { canId: '', data: '', interval: 100 }
    this.emit('render')
  }

  /**
   * Toggle periodic message (start/stop)
   */
  async handleTogglePeriodic(message) {
    if (!this.state.oiDeviceConnected) {
      alert('Not connected to device')
      return
    }

    const newActive = !message.active

    try {
      if (newActive) {
        // Start interval - create timer that sends periodic messages
        const canConfig = await this.getCanConfig()
        
        const pythonCode = `
import CAN
import json
from machine import Timer

# Store intervals globally
if 'can_intervals' not in globals():
    can_intervals = {}

interval_id = '${message.id}'
can_id = ${message.canId}
data = ${JSON.stringify(message.data)}
interval_ms = ${message.interval}

# Get CAN config
tx_pin = ${canConfig.txPin}
rx_pin = ${canConfig.rxPin}
bitrate = ${canConfig.bitrate}

# Initialize CAN (reuse if exists)
try:
    if 'can_dev' in globals() and can_dev is not None:
        can = can_dev
    else:
        can = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, bitrate=bitrate, mode=CAN.NORMAL, auto_restart=False)
        can_dev = can
except Exception as e:
    can = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, bitrate=bitrate, mode=CAN.NORMAL, auto_restart=False)
    can_dev = can

# Stop existing interval if running
if interval_id in can_intervals:
    try:
        timer = can_intervals[interval_id]['timer']
        timer.deinit()
    except:
        pass
    del can_intervals[interval_id]

# Timer callback
def send_periodic(timer):
    try:
        can_dev.send(data, can_id)
    except Exception as e:
        # Silently fail - timer will continue
        pass

# Create and start timer (use Timer 0-3, find available one)
timer_num = 0
for i in range(4):
    try:
        timer = Timer(i)
        timer.init(period=interval_ms, mode=Timer.PERIODIC, callback=send_periodic)
        timer_num = i
        break
    except:
        continue
else:
    raise Exception('No available timer')

# Store timer
can_intervals[interval_id] = {'timer': timer, 'active': True, 'can_id': can_id, 'data': data, 'interval': interval_ms}

print(json.dumps({'success': True, 'interval_id': interval_id}))
`
        
        await this.device.execute(pythonCode)
      } else {
        // Stop interval
        const pythonCode = `
import json

interval_id = '${message.id}'

if 'can_intervals' in globals() and interval_id in can_intervals:
    try:
        timer = can_intervals[interval_id]['timer']
        timer.deinit()
    except:
        pass
    del can_intervals[interval_id]
    print(json.dumps({'success': True, 'interval_id': interval_id}))
else:
    print(json.dumps({'error': 'Interval not found'}))
`
        
        await this.device.execute(pythonCode)
      }

      // Update UI
      const msg = this.state.canMessages.periodicMessages.find(m => m.id === message.id)
      if (msg) {
        msg.active = newActive
        this.emit('render')
      }
    } catch (error) {
      console.error('[CAN] Toggle periodic error:', error)
      alert('Failed to ' + (newActive ? 'start' : 'stop') + ' periodic message: ' + error.message)
    }
  }

  /**
   * Remove periodic message
   */
  async handleRemovePeriodic(messageId) {
    const message = this.state.canMessages.periodicMessages.find(m => m.id === messageId)
    
    if (message && message.active) {
      // Stop it first
      try {
        const pythonCode = `
import json

interval_id = '${messageId}'

if 'can_intervals' in globals() and interval_id in can_intervals:
    try:
        timer = can_intervals[interval_id]['timer']
        timer.deinit()
    except:
        pass
    del can_intervals[interval_id]
    print(json.dumps({'success': True}))
else:
    print(json.dumps({'success': True}))
`
        await this.device.execute(pythonCode)
      } catch (error) {
        console.error('[CAN] Stop before remove error:', error)
      }
    }

    this.state.canMessages.periodicMessages = this.state.canMessages.periodicMessages.filter(m => m.id !== messageId)
    this.emit('render')
  }

  /**
   * Toggle CAN IO (start/stop)
   */
  async toggleCanIo() {
    if (!this.state.oiDeviceConnected) {
      alert('Not connected to device')
      return
    }

    const canIo = this.state.canIo || {}
    const isActive = canIo.active || false

    try {
      if (isActive) {
        // Stop CAN IO - deinit timer
        const pythonCode = `
import json

if 'can_io_timer' in globals():
    try:
        can_io_timer.deinit()
    except:
        pass
    del can_io_timer
    print(json.dumps({'success': True}))
else:
    print(json.dumps({'success': True}))
`
        await this.device.execute(pythonCode)
        this.state.canIo.active = false
        this.emit('render')
        alert('CAN IO stopped')
      } else {
        // Start CAN IO
        const parsedCanId = this.parseHex(canIo.canId || '3F')
        if (isNaN(parsedCanId) || parsedCanId < 0 || parsedCanId > 0x7FF) {
          alert('Invalid CAN ID (must be 0x000 to 0x7FF)')
          return
        }

        // Calculate canio flags
        let canio = 0
        if (canIo.cruise) canio |= 0x01
        if (canIo.start) canio |= 0x02
        if (canIo.brake) canio |= 0x04
        if (canIo.forward) canio |= 0x08
        if (canIo.reverse) canio |= 0x10
        if (canIo.bms) canio |= 0x20

        // Scale throttle percent (assuming pot1min=0, pot1max=4095 for now)
        // TODO: Get actual pot min/max from parameters
        const pot = Math.round(0 + (canIo.throttlePercent / 100) * (4095 - 0))
        const pot2 = pot // Use same value for pot2

        const canConfig = await this.getCanConfig()
        const interval = canIo.interval || 100
        const useCrc = canIo.useCrc !== false
        
        const pythonCode = `
import CAN
import json
from machine import Timer

# Stop existing timer if running
if 'can_io_timer' in globals():
    try:
        can_io_timer.deinit()
    except:
        pass

can_id = ${parsedCanId}
pot = ${pot}
pot2 = ${pot2}
canio = ${canio}
cruisespeed = ${canIo.cruisespeed || 0}
regenpreset = ${canIo.regenpreset || 0}
use_crc = ${useCrc}
interval_ms = ${interval}

# Get CAN config
tx_pin = ${canConfig.txPin}
rx_pin = ${canConfig.rxPin}
bitrate = ${canConfig.bitrate}

# Initialize CAN (reuse if exists)
try:
    if 'can_dev' in globals() and can_dev is not None:
        can = can_dev
    else:
        can = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, bitrate=bitrate, mode=CAN.NORMAL, auto_restart=False)
        can_dev = can
except Exception as e:
    can = CAN(0, extframe=False, tx=tx_pin, rx=rx_pin, bitrate=bitrate, mode=CAN.NORMAL, auto_restart=False)
    can_dev = can

# Store config globally for update function
can_io_config = {
    'can_id': can_id,
    'pot': pot,
    'pot2': pot2,
    'canio': canio,
    'cruisespeed': cruisespeed,
    'regenpreset': regenpreset,
    'use_crc': use_crc
}

# CAN IO message construction
def send_can_io(timer):
    try:
        pot_val = can_io_config['pot'] & 0xFFFF
        pot2_val = can_io_config['pot2'] & 0xFFFF
        canio_val = can_io_config['canio'] & 0xFF
        cruisespeed_val = can_io_config['cruisespeed'] & 0x3FFF
        regenpreset_val = can_io_config['regenpreset'] & 0xFF
        
        data = [
            pot_val & 0xFF,
            (pot_val >> 8) & 0xFF,
            pot2_val & 0xFF,
            (pot2_val >> 8) & 0xFF,
            canio_val,
            cruisespeed_val & 0xFF,
            (cruisespeed_val >> 8) & 0xFF,
            regenpreset_val
        ]
        
        # If CRC enabled, calculate simple checksum
        if can_io_config['use_crc']:
            crc = sum(data[:7]) & 0xFF
            data[7] = crc
        
        can_dev.send(data, can_io_config['can_id'])
    except Exception as e:
        # Silently fail - timer will continue
        pass

# Create timer (use Timer 1 for CAN IO)
try:
    can_io_timer = Timer(1)
    can_io_timer.init(period=interval_ms, mode=Timer.PERIODIC, callback=send_can_io)
except Exception as e:
    # Try Timer 2 if Timer 1 is busy
    can_io_timer = Timer(2)
    can_io_timer.init(period=interval_ms, mode=Timer.PERIODIC, callback=send_can_io)

# Send initial message immediately
send_can_io(None)

print(json.dumps({'success': True, 'interval_ms': interval_ms}))
`
        
        await this.device.execute(pythonCode)
        this.state.canIo.active = true
        this.emit('render')
        alert(`CAN IO started (${interval}ms interval)`)
      }
    } catch (error) {
      console.error('[CAN IO] Toggle error:', error)
      alert('Failed to ' + (isActive ? 'stop' : 'start') + ' CAN IO: ' + error.message)
    }
  }

  /**
   * Update CAN IO flags while running
   */
  async updateCanIoFlags() {
    if (!this.state.oiDeviceConnected || !this.state.canIo.active) {
      return
    }

    const canIo = this.state.canIo || {}

    try {
      // Calculate canio flags
      let canio = 0
      if (canIo.cruise) canio |= 0x01
      if (canIo.start) canio |= 0x02
      if (canIo.brake) canio |= 0x04
      if (canIo.forward) canio |= 0x08
      if (canIo.reverse) canio |= 0x10
      if (canIo.bms) canio |= 0x20

      // Scale throttle percent
      const pot = Math.round(0 + (canIo.throttlePercent / 100) * (4095 - 0))
      const pot2 = pot

      // Update the global config that the timer callback uses
      const pythonCode = `
import json

# Update global config
if 'can_io_config' in globals():
    can_io_config['pot'] = ${pot}
    can_io_config['pot2'] = ${pot2}
    can_io_config['canio'] = ${canio}
    can_io_config['cruisespeed'] = ${canIo.cruisespeed || 0}
    can_io_config['regenpreset'] = ${canIo.regenpreset || 0}
    
    # Send updated message immediately
    try:
        pot_val = can_io_config['pot'] & 0xFFFF
        pot2_val = can_io_config['pot2'] & 0xFFFF
        canio_val = can_io_config['canio'] & 0xFF
        cruisespeed_val = can_io_config['cruisespeed'] & 0x3FFF
        regenpreset_val = can_io_config['regenpreset'] & 0xFF
        
        data = [
            pot_val & 0xFF,
            (pot_val >> 8) & 0xFF,
            pot2_val & 0xFF,
            (pot2_val >> 8) & 0xFF,
            canio_val,
            cruisespeed_val & 0xFF,
            (cruisespeed_val >> 8) & 0xFF,
            regenpreset_val
        ]
        
        if can_io_config['use_crc']:
            crc = sum(data[:7]) & 0xFF
            data[7] = crc
        
        can_dev.send(data, can_io_config['can_id'])
    except:
        pass
    
    print(json.dumps({'success': True}))
else:
    print(json.dumps({'error': 'CAN IO not running'}))
`
      
      await this.device.execute(pythonCode)
    } catch (error) {
      console.error('[CAN IO] Update flags error:', error)
    }
  }

  async addCanMapping(args) {
    // Pass as JSON string so Python can parse it (handles true/false -> True/False conversion)
    const argsStr = JSON.stringify(args)
    const result = await this.device.execute(`from lib.OI_helpers import addCanMapping; import json; addCanMapping(json.loads('${argsStr.replace(/'/g, "\\'")}'))`)
    const parsed = this.device.parseJSON(result)
    
    // Check for error response
    if (parsed && parsed.error) {
      throw new Error(parsed.error)
    }
    
    // Check for success response (now returned for mock devices)
    if (parsed && parsed.success) {
      return parsed
    }
    
    // Fallback: assume success if no error
    return { success: true }
  }

  async removeCanMapping(args) {
    const argsStr = JSON.stringify(args)
    const result = await this.device.execute(`from lib.OI_helpers import removeCanMapping; removeCanMapping(${argsStr})`)
    const parsed = this.device.parseJSON(result)
    // These functions only return errors, not success responses
    if (parsed && parsed.error) {
      throw new Error(parsed.error)
    }
    return { success: true }
  }

  // === Render Methods ===

  /**
   * Render Overview - System-level overview or device panel if device selected
   */
  /**
   * Catch-all render methods for device panels
   * These handle device0, device1, device2, etc.
   */
  renderDevice0() { return this.renderDeviceByIndex(0) }
  renderDevice1() { return this.renderDeviceByIndex(1) }
  renderDevice2() { return this.renderDeviceByIndex(2) }
  renderDevice3() { return this.renderDeviceByIndex(3) }
  renderDevice4() { return this.renderDeviceByIndex(4) }
  renderDevice5() { return this.renderDeviceByIndex(5) }
  renderDevice6() { return this.renderDeviceByIndex(6) }
  renderDevice7() { return this.renderDeviceByIndex(7) }
  renderDevice8() { return this.renderDeviceByIndex(8) }
  renderDevice9() { return this.renderDeviceByIndex(9) }

  /**
   * Render a device panel by its index in discoveredDevices array
   */
  renderDeviceByIndex(index) {
    if (!this.state.discoveredDevices || !this.state.discoveredDevices[index]) {
      return this.html`
        <div class="panel-message">
          <p>Device not found (index: ${index})</p>
        </div>
      `
    }

    const device = this.state.discoveredDevices[index]
    this.state.selectedDeviceSerial = device.serial
    this.state.selectedNodeId = device.nodeId
    
    // Connect to device if not already connected
    if (!this.state.oiDeviceConnected || this.state.currentDeviceSerial !== device.serial) {
      // Set connected state for mock devices
      if (device.nodeId > 127) {
        this.state.oiDeviceConnected = true
        this.state.currentDeviceSerial = device.serial
        
        // Auto-fetch spot values from ESP32 (OI_helpers.py has demo data)
        if (!this.state.oiSpotValues && !this.state.isLoadingOiSpotValues) {
          setTimeout(() => this.refreshSpotValues(), 0)
        }
      }
    }
    
    return this.renderDevicePanel()
  }

  /**
   * Render Device Selector panel
   * Modern device connection and selection interface
   */
  renderDeviceselector() {
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
          <h2 style="margin: 0; font-size: 24px;">Device Manager</h2>
          <p style="margin: 8px 0 0; font-size: 14px;">
            Scan and manage Open Inverter devices via CAN bus
          </p>
        </div>
        


          <!-- Saved Devices List -->
          ${this.state.discoveredDevices.length > 0 ? this.html`
            <div style="margin-bottom: 24px;">
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                ${this.state.discoveredDevices.map(device => this.renderDeviceCard(device))}
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
                  onclick=${() => this.scanCanBus(false)}
                  disabled=${!this.state.isConnected || this.state.isScanning}
                  style="padding: 8px 16px; font-size: 13px;">
                  ${this.state.isScanning ? 'Scanning...' : 'Quick Scan (1-10)'}
                </button>
                <button 
                  class="secondary-button" 
                  onclick=${() => this.scanCanBus(true)}
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
                              onclick=${(e) => { e.stopPropagation(); this.addDeviceFromScan(device); }}
                              style="padding: 6px 12px; font-size: 13px;">
                              Add
                            </button>
                            <button 
                              class="primary-button" 
                              onclick=${(e) => { e.stopPropagation(); this.connectToDevice(device.nodeId, device.serialNumber); }}
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
                  onclick=${() => this.addDeviceManually()}
                  disabled=${this.state.selectedNodeId <= 127 && !this.state.isConnected}
                  style="min-width: 100px;">
                  Add Device
                </button>
                <button 
                  class="primary-button" 
                  onclick=${() => this.connectToDevice(this.state.selectedNodeId, this.state.manualSerial)}
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
   * Render a device card for the saved devices list
   */
  renderDeviceCard(device) {
    const isConnected = this.state.oiDeviceConnected && 
                       this.state.currentDeviceSerial === device.serial &&
                       this.state.selectedNodeId === device.nodeId
    const isEditing = this.state.editingDeviceName === device.serial

    return this.html`
      <div 
        class="device-card"
        style="
          background: white;
          border: 2px solid ${isConnected ? 'var(--oi-blue)' : '#e0e0e0'};
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
        "
        onclick=${() => this.selectDeviceFromCard(device)}
        onmouseover=${(e) => { if (!isConnected) e.currentTarget.style.borderColor = 'var(--oi-blue)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 136, 229, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onmouseout=${(e) => { if (!isConnected) e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
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
                    this.saveDeviceName(device)
                  } else if (e.key === 'Escape') {
                    this.state.editingDeviceName = null
                    this.emit('render')
                  }
                }}
                onclick=${(e) => e.stopPropagation()}
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

        <div style="position: absolute; bottom: 0.75rem; right: 0.75rem; display: flex; gap: 0.5rem; z-index: 1;">
          ${isEditing ? this.html`
            <button 
              class="secondary-button"
              onclick=${(e) => { e.stopPropagation(); this.saveDeviceName(device); }}
              style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px;"
              title="Save"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button 
              class="secondary-button"
              onclick=${(e) => { e.stopPropagation(); this.state.editingDeviceName = null; this.emit('render'); }}
              style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px;"
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
                onclick=${(e) => { e.stopPropagation(); this.startEditingDeviceName(device); }}
                style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px;"
                title="Edit"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            ` : ''}
            <button 
              class="btn-danger"
              onclick=${(e) => { e.stopPropagation(); this.deleteDevice(device); }}
              style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px; background: #dc3545; color: white; border: none;"
              title="Delete"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          `}
        </div>
      </div>
    `
  }

  /**
   * Render Parameters panel
   * Displays editable motor control parameters with load/save functionality
   */
  renderParameters() {
    // Load parameters if not already loaded
    // Only auto-load when OpenInverter device is connected, not just WebREPL
    if (!this.state.oiParameters && !this.state.isLoadingOiParameters && this.state.oiDeviceConnected) {
      // Use setTimeout to avoid blocking render
      setTimeout(() => this.refreshParameters(), 0)
    }

    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Parameters</h2>
          <div class="panel-actions oi-button-row">
            <button 
              class="refresh-button" 
              onclick=${() => this.loadParametersFromFile()}
              title="Load parameters from local JSON file"
            >
              Load from File
            </button>
            <button 
              class="refresh-button" 
              onclick=${() => this.refreshParameters()}
              disabled=${!this.state.isConnected}
              title="Load parameters from connected device"
            >
              Load from Device
            </button>
            <button 
              class="refresh-button" 
              onclick=${() => this.saveParametersToFile()}
              disabled=${!this.state.oiParameters}
              title="Save parameters to local JSON file"
            >
              Save to File
            </button>
          </div>
        </div>
        
        ${this.renderParametersContent()}
      </div>
    `
  }

  renderParametersContent() {
    // Auto-load parameters if OpenInverter device is connected but parameters aren't loaded yet
    if (this.state.oiDeviceConnected && !this.state.oiParameters && !this.state.isLoadingOiParameters) {
      // Use setTimeout to avoid blocking render
      setTimeout(() => this.refreshParameters(), 0)
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

        <div class="parameters-grid">
          ${sortedCategories.map(([category, categoryParams]) => {
            const isCollapsed = this.state.collapsedCategories.has(category)
            return this.html`
              <div class="parameter-category ${isCollapsed ? 'collapsed' : ''}">
                <h3 class="category-title" onclick=${() => this.toggleCategory(category)}>
                  <span class="collapse-icon">${isCollapsed ? '▶' : '▼'}</span>
                  ${category}
                  <span class="param-count">(${categoryParams.length})</span>
                </h3>
                ${!isCollapsed ? this.html`
                  <div class="parameters-list">
                    ${categoryParams.map(([key, param]) => this.renderParameterInput(key, param))}
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
          <button class="btn-primary" onclick=${() => this.saveNodeId()} disabled=${!this.state.oiDeviceConnected}>
            Save Node ID
          </button>
          <button class="btn-secondary" onclick=${() => this.saveParametersToFlash()} disabled=${!this.state.oiDeviceConnected}>
            Save All to Flash
          </button>
        </div>

        <div class="form-group" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
          <label style="margin-bottom: 1rem;">Import/Export Parameters</label>
          <div class="button-group" style="margin-top: 0;">
            <button class="btn-secondary" onclick=${() => this.exportParametersToJSON()} disabled=${!this.state.oiParameters || this.state.isImporting}>
              Export to JSON
            </button>
            <button class="btn-secondary" onclick=${() => this.importParametersFromJSON()} disabled=${!this.state.oiParameters || this.state.isImporting}>
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
            onchange=${(e) => this.handleFileSelected(e)}
          />
        </div>
      </section>
    `
  }

  /**
   * Render a single parameter input matching the ParameterInput component structure
   */
  renderParameterInput(paramKey, param) {
    const hasEnum = param.enums && Object.keys(param.enums).length > 0
    const displayName = this.getDisplayName ? this.getDisplayName(paramKey) : paramKey
    const normalizedValue = hasEnum ? this.normalizeEnumValue(param.value) : param.value

    return this.html`
      <div class="parameter-item">
        <div class="parameter-header">
          <label class="parameter-label" title="${param.description || ''}">
            ${displayName}
            ${param.unit ? this.html`<span class="parameter-unit"> (${param.unit})</span>` : ''}
          </label>
        </div>

        <div class="parameter-input-group">
          ${hasEnum ? this.html`
            <select
              value="${normalizedValue}"
              onchange=${(e) => this.handleParameterChange(paramKey, param, parseFloat(e.target.value))}
              disabled=${!this.state.oiDeviceConnected}
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
              onblur=${(e) => this.handleParameterBlur(paramKey, param, e)}
              disabled=${!this.state.oiDeviceConnected}
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
   */
  handleParameterChange(paramKey, param, newValue) {
    this.updateParameter(paramKey, newValue)
  }

  /**
   * Handle parameter blur for number inputs (validates before updating)
   */
  handleParameterBlur(paramKey, param, e) {
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
      this.updateParameter(paramKey, newValue)
    }
  }

  toggleCategory(category) {
    if (this.state.collapsedCategories.has(category)) {
      this.state.collapsedCategories.delete(category)
    } else {
      this.state.collapsedCategories.add(category)
    }
    this.emit('render')
  }

  async updateParameter(name, value) {
    try {
      await this.setParameter({ NAME: name, VALUE: value })
      // Update local state immediately for better UX
      if (this.state.oiParameters && this.state.oiParameters[name]) {
        this.state.oiParameters[name].value = value
        this.emit('render')
      }
    } catch (error) {
      console.error('[OI App] Failed to update parameter:', error)
      alert(`Failed to update parameter: ${error.message}`)
      // Refresh to show correct value
      await this.refreshParameters()
    }
  }

  async refreshParameters() {
    if (this.state.isLoadingOiParameters) {
      console.log('[OI App] Already loading parameters, skipping')
      return
    }

    this.state.isLoadingOiParameters = true
    this.emit('render')

    try {
      const params = await this.getOiParams()
      this.state.oiParameters = params
      this.state.isLoadingOiParameters = false
      this.emit('render')
    } catch (error) {
      console.error('[OI App] Failed to load parameters:', error)
      this.state.isLoadingOiParameters = false
      this.emit('render')
      alert(`Failed to load parameters: ${error.message}`)
    }
  }

  exportParametersToJSON() {
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
    const serial = this.state.selectedDeviceSerial || 'device'
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

  importParametersFromJSON() {
    // Trigger file input click
    if (this.fileInputRef) {
      this.fileInputRef.click()
    } else {
      // Fallback: create temporary input if ref not available
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = (e) => this.handleFileSelected(e)
      input.click()
    }
  }

  async handleFileSelected(e) {
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
            await this.setParameter({ NAME: key, VALUE: value })
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

  async saveNodeId() {
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
      const device = this.state.discoveredDevices.find(d => d.serial === this.state.selectedDeviceSerial)
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
   * Get display name for a parameter key (converts snake_case to Title Case)
   */
  getDisplayName(key) {
    if (!key) return ''
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  async saveParametersToFlash() {
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

  loadParametersFromFile() {
    // Alias to importParametersFromJSON for backward compatibility
    this.importParametersFromJSON()
  }

  saveParametersToFile() {
    // Alias to exportParametersToJSON for backward compatibility
    this.exportParametersToJSON()
  }

  /**
   * Render Overview content (used in device tabs)
   * Modern spot values display with inline charts
   */
  renderOverviewContent() {
    // Initialize auto-refresh state if needed
    if (typeof this.state.autoRefreshInterval === 'undefined') {
      this.state.autoRefreshInterval = 1000 // Default 1000ms
    }
    
    // Ensure selectedChartParams is initialized
    if (!this.state.selectedChartParams) {
      this.state.selectedChartParams = new Set()
    }

    // Auto-start refresh when connected and tab is active
    if (this.state.oiDeviceConnected && this.state.activeDeviceTab === 'overview') {
      // Auto-load spot values when connected (but not already loading)
      if (!this.state.oiSpotValues && !this.state.isLoadingOiSpotValues) {
        setTimeout(() => this.refreshSpotValues(), 0)
      }
      
      // Start auto-refresh if not already running
      if (!this.autoRefreshTimer) {
        this.autoRefreshTimer = setInterval(() => {
          if (this.state.oiDeviceConnected && this.state.activeDeviceTab === 'overview' && !this.state.isLoadingOiSpotValues) {
            this.refreshSpotValues()
          }
        }, this.state.autoRefreshInterval)
      }
    } else if (this.autoRefreshTimer) {
      // Stop auto-refresh if tab changed or device disconnected
      clearInterval(this.autoRefreshTimer)
      this.autoRefreshTimer = null
    }

    if (!this.state.oiDeviceConnected) {
      return this.html`
        <div style="padding: 60px 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">📊</div>
          <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
            Connect to a device to view spot values
          </p>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 0;">
            Use the Device Connection panel to scan and connect
          </p>
        </div>
      `
    }

    if (this.state.isLoadingOiSpotValues) {
      return this.html`
        <div style="padding: 60px 20px; text-align: center;">
          <p style="font-size: 16px; color: var(--text-secondary);">Loading spot values...</p>
        </div>
      `
    }

    if (!this.state.oiSpotValues || Object.keys(this.state.oiSpotValues).length === 0) {
      return this.html`
        <div style="padding: 60px 20px; text-align: center;">
          <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
            No spot values available
          </p>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 0;">
            Refreshing automatically every ${this.state.autoRefreshInterval}ms...
          </p>
        </div>
      `
    }

    // Group spot values by category
    const categories = {}
    Object.entries(this.state.oiSpotValues).forEach(([name, spot]) => {
      const cat = spot.category || 'Uncategorized'
      if (!categories[cat]) categories[cat] = []
      categories[cat].push({ name, ...spot })
    })

    return this.html`
      <div style="display: flex; flex-direction: column; height: 100%;">
        <!-- Controls Header -->
        <div style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); padding: 16px 20px;">
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
            <!-- Update interval input -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: 14px; color: var(--text-secondary); white-space: nowrap;">
                Update Interval:
              </label>
              <input 
                type="number"
                value=${this.state.autoRefreshInterval}
                onchange=${(e) => this.updateRefreshInterval(e.target.value)}
                min="100"
                max="10000"
                step="100"
                style="
                  width: 80px;
                  padding: 8px;
                  border: 1px solid var(--border-color);
                  border-radius: 4px;
                  font-size: 14px;
                  font-family: 'Monaco', 'Courier New', monospace;
                "
              />
              <span style="font-size: 14px; color: var(--text-secondary);">ms</span>
            </div>
            
            <!-- Clear data button -->
            <button 
              class="secondary-button"
              onclick=${() => this.clearSpotValueHistory()}
              style="background: var(--oi-orange); padding: 8px 16px; margin-left: auto;">
              Clear Data
            </button>
          </div>
        </div>

        <!-- Spot Values Content -->
        <div style="flex: 1; overflow-y: auto; padding: 20px;">
          <div class="spot-values-categories">
            ${Object.entries(categories).map(([category, spots]) => this.html`
              <div class="parameter-category">
                <h3 class="category-title">
                  ${category}
                  <span class="param-count">(${spots.length})</span>
                </h3>
                <div class="parameters-list">
                  ${spots.map(spot => this.renderSpotValueCard(spot))}
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `
  }

  renderSpotValueCard(spot) {
    // Ensure selectedChartParams is initialized
    if (!this.state.selectedChartParams) {
      this.state.selectedChartParams = new Set()
    }
    
    const isSelected = this.state.selectedChartParams.has(spot.name)
    const converted = this.convertSpotValue(spot.value, spot.unit)
    const formatted = this.formatParameterValue(spot, converted.value)
    
    // Get historical data for this parameter
    const history = this.state.spotValueHistory[spot.name] || []
    
    // Create a safe ID for the card (replace special chars)
    const cardId = `spot-card-${spot.name.replace(/[^a-zA-Z0-9]/g, '-')}`
    
    // Create click handler function
    const handleClick = () => {
      console.log('[OI] Clicked spot value card:', spot.name)
      this.toggleChartForParam(spot.name)
    }
    
    return this.html`
      <div 
        id="${cardId}"
        data-param-name="${spot.name}"
        role="button"
        tabindex="0"
        onclick=${handleClick}
        onkeydown=${(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        style="
          background: ${isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'};
          border: 2px solid ${isSelected ? 'var(--scheme-primary)' : 'var(--border-color)'};
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          user-select: none;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 12px;
        "
        onmouseover=${(e) => { 
          e.currentTarget.style.cursor = 'pointer'
          if (!isSelected) e.currentTarget.style.borderColor = 'var(--scheme-primary)' 
        }}
        onmouseout=${(e) => { 
          e.currentTarget.style.cursor = 'pointer'
          if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)' 
        }}>
        
        <!-- Spot Value Header -->
        <div style="pointer-events: none;">
          <div style="font-size: 13px; font-weight: 600; color: var(--scheme-primary); margin-bottom: 8px;">
            ${spot.name}
          </div>
          <div class="spot-value-display" style="font-size: 20px; font-weight: 600; font-family: 'Monaco', 'Courier New', monospace; color: var(--text-primary);">
            ${formatted}
          </div>
        </div>
        
        <!-- Mini Chart (if selected and has history) -->
        <div class="mini-chart-container" style="pointer-events: none;">
          ${isSelected && history.length > 1 ? this.renderMiniChart(spot.name, history, converted.unit) : ''}
        </div>
        
        <!-- Click hint -->
        <div style="font-size: 11px; color: var(--text-secondary); text-align: center; opacity: 0.7; pointer-events: none;">
          ${isSelected ? 'Click to hide chart' : 'Click to show chart'}
        </div>
      </div>
    `
  }

  /**
   * Render inline mini-chart using SVG
   * Ported from MultiLineChart.tsx with full axis labels and grid lines
   */
  renderMiniChart(paramName, history, unit) {
    // Base dimensions for coordinate system (will scale responsively)
    // Using larger base width to better fill card width when scaled
    const baseWidth = 500
    const height = 150
    const padding = { top: 10, right: 10, bottom: 40, left: 35 }
    const chartWidth = baseWidth - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    if (history.length < 2) {
      return this.html`
        <div style="width: 100%; height: ${height}px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 12px;">
          Collecting data...
        </div>
      `
    }

    // Extract values and timestamps
    const values = history.map(d => d.value)
    const timestamps = history.map(d => d.timestamp)

    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const minTime = Math.min(...timestamps)
    const maxTime = Math.max(...timestamps)

    const valueRange = maxValue - minValue || 1
    const timeRange = maxTime - minTime || 1

    // Scale functions (use baseWidth for coordinate calculations)
    const scaleX = (timestamp) => {
      return padding.left + ((timestamp - minTime) / timeRange) * chartWidth
    }

    const scaleY = (value) => {
      return padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight
    }

    // Generate Y-axis ticks (5 ticks)
    const yTicks = 5
    const yTickValues = Array.from({ length: yTicks }, (_, i) => {
      return minValue + (valueRange * i) / (yTicks - 1)
    })

    // Generate X-axis ticks (6 ticks)
    const xTicks = 6
    const xTickValues = Array.from({ length: xTicks }, (_, i) => {
      return minTime + (timeRange * i) / (xTicks - 1)
    })

    // Generate SVG path
    const linePath = history.map((point, index) => {
      const x = scaleX(point.timestamp)
      const y = scaleY(point.value)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    // Color based on parameter name (consistent hashing)
    const color = this.getColorForParam(paramName)

    return this.html`
      <svg width="100%" height="${height}" viewBox="0 0 ${baseWidth} ${height}" preserveAspectRatio="none" style="display: block; width: 100%;">
        <!-- Y-axis line -->
        <line
          x1="${padding.left}"
          y1="${padding.top}"
          x2="${padding.left}"
          y2="${height - padding.bottom}"
          stroke="#ccc"
          stroke-width="1"
        />

        <!-- X-axis line -->
        <line
          x1="${padding.left}"
          y1="${height - padding.bottom}"
          x2="${baseWidth - padding.right}"
          y2="${height - padding.bottom}"
          stroke="#ccc"
          stroke-width="1"
        />

        <!-- Y-axis ticks, labels, and grid lines -->
        ${yTickValues.map((value, i) => {
          const y = scaleY(value)
          return this.html`
            <g>
              <!-- Tick mark -->
              <line
                x1="${padding.left - 5}"
                y1="${y}"
                x2="${padding.left}"
                y2="${y}"
                stroke="#ccc"
                stroke-width="1"
              />
              <!-- Grid line (horizontal, dashed) -->
              <line
                x1="${padding.left}"
                y1="${y}"
                x2="${baseWidth - padding.right}"
                y2="${y}"
                stroke="#eee"
                stroke-width="1"
                stroke-dasharray="2,2"
              />
              <!-- Y-axis label -->
              <text
                x="${padding.left - 10}"
                y="${y}"
                text-anchor="end"
                dominant-baseline="middle"
                font-size="12"
                fill="#666"
              >
                ${this.formatValue(value)}
              </text>
            </g>
          `
        })}

        <!-- X-axis ticks and labels -->
        ${xTickValues.map((timestamp, i) => {
          const x = scaleX(timestamp)
          return this.html`
            <g>
              <!-- Tick mark -->
              <line
                x1="${x}"
                y1="${height - padding.bottom}"
                x2="${x}"
                y2="${height - padding.bottom + 5}"
                stroke="#ccc"
                stroke-width="1"
              />
              <!-- X-axis label -->
              <text
                x="${x}"
                y="${height - padding.bottom + 20}"
                text-anchor="middle"
                font-size="12"
                fill="#666"
              >
                ${this.formatTime(timestamp)}
              </text>
            </g>
          `
        })}

        <!-- Data line -->
        <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2" opacity="0.8"/>
        
        <!-- Data points -->
        ${history.map(point => {
          const cx = scaleX(point.timestamp)
          const cy = scaleY(point.value)
          return this.html`<circle cx="${cx}" cy="${cy}" r="3" fill="${color}"/>`
        })}
      </svg>
    `
  }

  /**
   * Format a numeric value for display in chart labels
   * Handles edge cases with scientific notation
   * 
   * @param {number} value - The value to format
   * @returns {string} Formatted value string
   */
  formatValue(value) {
    if (Math.abs(value) < 0.01 && value !== 0) return value.toExponential(2)
    if (Math.abs(value) > 10000) return value.toExponential(2)
    return value.toFixed(2)
  }

  /**
   * Format a timestamp for display in chart labels
   * Converts milliseconds to seconds
   * 
   * @param {number} timestamp - Timestamp in milliseconds
   * @returns {string} Formatted time string (e.g., "5s")
   */
  formatTime(timestamp) {
    const seconds = Math.floor(timestamp / 1000)
    return `${seconds}s`
  }

  /**
   * Generate consistent color for a parameter name
   */
  getColorForParam(key) {
    // Simple hash function to generate consistent RGB color
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i)
      hash = hash & hash // Convert to 32-bit integer
    }

    // Generate RGB values from hash
    const r = (hash & 0xFF0000) >>> 16
    const g = (hash & 0x00FF00) >>> 8
    const b = hash & 0x0000FF

    // Map values to range 60-200 to avoid too light or too dark colors
    const normalize = (val) => 60 + (val / 255) * 140

    const values = [normalize(r), normalize(g), normalize(b)]

    // If all values are too high (too light), darken the lowest one
    if (values.every(v => v > 150)) {
      const minIndex = values.indexOf(Math.min(...values))
      values[minIndex] = Math.max(60, values[minIndex] - 80)
    }

    return `rgb(${Math.round(values[0])}, ${Math.round(values[1])}, ${Math.round(values[2])})`
  }

  /**
   * Toggle chart visibility for a parameter
   */
  toggleChartForParam(paramName) {
    // Ensure selectedChartParams is initialized
    if (!this.state.selectedChartParams) {
      this.state.selectedChartParams = new Set()
    }
    
    console.log('[OI Overview] toggleChartForParam called for:', paramName)
    console.log('[OI Overview] Current selectedChartParams:', Array.from(this.state.selectedChartParams))
    
    if (this.state.selectedChartParams.has(paramName)) {
      this.state.selectedChartParams.delete(paramName)
      console.log('[OI Overview] Hiding chart for:', paramName)
    } else {
      this.state.selectedChartParams.add(paramName)
      const history = this.state.spotValueHistory[paramName] || []
      console.log('[OI Overview] Showing chart for:', paramName, '- data points:', history.length)
    }
    
    console.log('[OI Overview] Updated selectedChartParams:', Array.from(this.state.selectedChartParams))
    this.emit('render')
  }

  /**
   * Toggle spot value streaming on/off
   */
  toggleSpotValueStreaming() {
    if (this.state.isStreamingSpotValues) {
      // Stop streaming
      if (this.state.spotValueStreamTimer) {
        clearInterval(this.state.spotValueStreamTimer)
        this.state.spotValueStreamTimer = null
      }
      this.state.isStreamingSpotValues = false
    } else {
      // Start streaming
      this.state.isStreamingSpotValues = true
      this.streamSpotValues()
      this.state.spotValueStreamTimer = setInterval(() => {
        this.streamSpotValues()
      }, this.state.spotValueInterval)
    }
    this.emit('render')
  }

  /**
   * Stream spot values (called by interval timer)
   */
  async streamSpotValues() {
    if (!this.state.oiDeviceConnected || !this.state.isStreamingSpotValues) {
      return
    }

    try {
      const spots = await this.getSpotValues()
      if (spots) {
        this.state.oiSpotValues = spots
        
        // Update historical data
        const timestamp = Date.now()
        Object.entries(spots).forEach(([name, spot]) => {
          if (!this.state.spotValueHistory[name]) {
            this.state.spotValueHistory[name] = []
          }
          
          // Convert value if needed
          const converted = this.convertSpotValue(spot.value, spot.unit)
          
          // Add data point
          this.state.spotValueHistory[name].push({
            timestamp,
            value: converted.value
          })
          
          // Limit history to 100 points
          if (this.state.spotValueHistory[name].length > 100) {
            this.state.spotValueHistory[name] = this.state.spotValueHistory[name].slice(-100)
          }
        })
        
        this.emit('render')
      }
    } catch (error) {
      console.error('[OI Overview] Stream error:', error)
    }
  }

  /**
   * Render Spot Values panel (legacy)
   * Displays read-only live values from the controller
   */
  renderSpotvalues() {
    // Only auto-load when OpenInverter device is connected, not just WebREPL
    if (!this.state.oiSpotValues && !this.state.isLoadingOiSpotValues && this.state.oiDeviceConnected) {
      // Use setTimeout to avoid blocking render
      setTimeout(() => this.refreshSpotValues(), 0)
    }

    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Spot Values</h2>
          <div class="panel-actions oi-button-row">
            <button 
              class="refresh-button" 
              onclick=${() => this.refreshSpotValues()}
              disabled=${!this.state.isConnected}
            >
              Refresh
            </button>
          </div>
        </div>
        
        ${this.renderSpotValuesContent()}
      </div>
    `
  }

  renderSpotValuesContent() {
    console.log('[OI App] renderSpotValuesContent - state:', {
      isConnected: this.state.isConnected,
      isLoading: this.state.isLoadingOiSpotValues,
      hasSpotValues: !!this.state.oiSpotValues,
      spotValuesKeys: this.state.oiSpotValues ? Object.keys(this.state.oiSpotValues) : []
    })

    if (!this.state.isConnected) {
      return this.html`
        <div class="panel-message">
          <p>Connect to device to view spot values</p>
        </div>
      `
    }

    if (this.state.isLoadingOiSpotValues) {
      return this.html`
        <div class="panel-message">
          <p>Loading spot values...</p>
        </div>
      `
    }

    if (!this.state.oiSpotValues || Object.keys(this.state.oiSpotValues).length === 0) {
      return this.html`
        <div class="panel-message">
          <p>No spot values available. Click "Refresh" to fetch values.</p>
        </div>
      `
    }

    // Group by category
    const categories = {}
    Object.entries(this.state.oiSpotValues).forEach(([name, spot]) => {
      const cat = spot.category || 'Uncategorized'
      if (!categories[cat]) categories[cat] = []
      categories[cat].push({ name, ...spot })
    })

    return this.html`
      <div class="oi-spotvalues-container">
        ${Object.entries(categories).map(([category, spots]) => this.renderSpotValueCategory(category, spots))}
      </div>
    `
  }

  renderSpotValueCategory(category, spots) {
    return this.html`
      <div class="oi-category-section">
        <h3 class="oi-category-title">${category}</h3>
        <div class="oi-spotvalues-grid">
          ${spots.map(spot => this.renderSpotValueCard(spot))}
        </div>
      </div>
    `
  }

  renderSpotValueCard(spot) {
    // Ensure selectedChartParams is initialized
    if (!this.state.selectedChartParams) {
      this.state.selectedChartParams = new Set()
    }
    
    const isSelected = this.state.selectedChartParams.has(spot.name)
    const converted = this.convertSpotValue(spot.value, spot.unit)
    const formatted = this.formatParameterValue(spot, converted.value)
    
    // Get historical data for this parameter
    const history = this.state.spotValueHistory[spot.name] || []
    
    // Create click handler function
    const handleClick = () => {
      console.log('[OI] Clicked spot value card:', spot.name)
      this.toggleChartForParam(spot.name)
    }
    
    return this.html`
      <div 
        class="oi-spotvalue-card parameter-item"
        role="button"
        tabindex="0"
        onclick=${handleClick}
        onkeydown=${(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        style="
          background: ${isSelected ? 'var(--bg-secondary)' : 'transparent'};
          padding: 0.75rem;
          border-radius: 6px;
          border: 2px solid ${isSelected ? 'var(--oi-blue)' : 'transparent'};
          cursor: pointer;
          user-select: none;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        "
        onmouseover=${(e) => { 
          if (!isSelected) {
            e.currentTarget.style.borderColor = 'var(--oi-blue)'
            e.currentTarget.style.background = 'var(--oi-blue-light)'
          }
        }}
        onmouseout=${(e) => { 
          if (!isSelected) {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.background = 'transparent'
          }
        }}>
        <div class="parameter-header">
          <label class="parameter-label oi-spotvalue-name" style="font-size: 0.9rem; font-weight: 500;">
            ${spot.name}
          </label>
        </div>
        <div class="parameter-value oi-spotvalue-value" style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); font-family: 'Monaco', 'Courier New', monospace;">
          ${formatted}
        </div>
        ${isSelected && history.length > 1 ? this.html`
          <div style="width: 100%; margin-top: 0.5rem; overflow: visible; pointer-events: none;">
            ${this.renderMiniChart(spot.name, history, converted.unit)}
          </div>
        ` : ''}
        <div style="font-size: 11px; color: var(--text-secondary); text-align: center; opacity: 0.7; margin-top: 4px; pointer-events: none;">
          ${isSelected ? 'Click to hide chart' : 'Click to show chart'}
        </div>
      </div>
    `
  }

  async refreshSpotValues() {
    if (this.state.isLoadingOiSpotValues) {
      console.log('[OI App] Already loading spot values, skipping')
      return
    }

    this.state.isLoadingOiSpotValues = true

    try {
      const spots = await this.getSpotValues()
      
      // Update historical data for charts
      const timestamp = Date.now()
      if (!this.state.spotValueHistory) {
        this.state.spotValueHistory = {}
      }
      
      Object.entries(spots).forEach(([name, spot]) => {
        // Add to history for charts
        if (!this.state.spotValueHistory[name]) {
          this.state.spotValueHistory[name] = []
        }
        
        this.state.spotValueHistory[name].push({
          timestamp: timestamp,
          value: spot.value
        })
        
        // Keep only last 100 points
        if (this.state.spotValueHistory[name].length > 100) {
          this.state.spotValueHistory[name] = this.state.spotValueHistory[name].slice(-100)
        }
      })
      
      this.state.oiSpotValues = spots
      this.state.isLoadingOiSpotValues = false
      
      // Always re-render (nanohtml is efficient with DOM diffing)
      this.emit('render')
    } catch (error) {
      console.error('[OI App] Failed to load spot values:', error)
      this.state.isLoadingOiSpotValues = false
      this.emit('render')
      alert(`Failed to load spot values: ${error.message}`)
    }
  }

  /**
   * Update spot values in the DOM without full re-render (for smooth auto-refresh)
   */
  /**
   * Update the refresh interval and restart auto-refresh if needed
   */
  updateRefreshInterval(value) {
    const interval = parseInt(value)
    if (isNaN(interval) || interval < 100) {
      console.warn('[OI Overview] Invalid interval, using minimum 100ms')
      this.state.autoRefreshInterval = 100
    } else if (interval > 10000) {
      console.warn('[OI Overview] Invalid interval, using maximum 10000ms')
      this.state.autoRefreshInterval = 10000
    } else {
      this.state.autoRefreshInterval = interval
    }
    
    console.log('[OI Overview] Update interval changed to:', this.state.autoRefreshInterval, 'ms')
    
    // Restart auto-refresh with new interval
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer)
      this.autoRefreshTimer = null
      // The render cycle will restart it automatically
    }
    
    this.emit('render')
  }

  /**
   * Clear spot value history (for charts)
   */
  clearSpotValueHistory() {
    console.log('[OI Overview] Clearing spot value history')
    this.state.spotValueHistory = {}
    this.emit('render')
  }

  /**
   * Render CAN Mapping panel
   * Configure CAN bus mapping for parameters
   */
  renderCanmapping() {
    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>CAN Mappings</h2>
          <div class="panel-actions oi-button-row">
            <button 
              class="refresh-button" 
              onclick=${() => this.refreshCanMappings()}
              disabled=${!this.state.oiDeviceConnected}
              title="Refresh CAN mappings from device"
            >
              Refresh
            </button>
          </div>
        </div>
        
        ${this.renderCanmappingContent()}
      </div>
    `
  }

  /**
   * Flatten CAN mappings structure from device format to table format
   * Device format: { tx: [{ canId, params: [...] }], rx: [...] }
   * Table format: [{ id, paramid, position, length, gain, offset, isrx, msgIndex, paramIndex }]
   */
  flattenCanMappings(messages, isrx) {
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
   * Matches the reference implementation from openinverter-web-interface
   */
  getParameterDisplayName(key, param) {
    if (!param) {
      return key || 'Unknown'
    }
    // Use param.name if available, otherwise use the key
    return param.name || key
  }

  /**
   * Get parameter display name by ID (for backwards compatibility)
   */
  getParameterDisplayNameById(paramId, params) {
    if (!params || paramId === 0) {
      return `Param ${paramId}`
    }

    for (const [key, param] of Object.entries(params)) {
      if (param.id === paramId) {
        return this.getParameterDisplayName(key, param)
      }
    }
    return `Param ${paramId}`
  }

  /**
   * Refresh all params with IDs (for CAN mapping dropdown)
   */
  async refreshAllParamsWithIds() {
    if (this.state.isLoadingAllParamsWithIds) {
      console.log('[OI] Already loading all params with IDs, skipping')
      return
    }

    this.state.isLoadingAllParamsWithIds = true
    this.emit('render')

    try {
      const allParams = await this.getAllParamsWithIds()
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
   */
  async refreshCanMappings() {
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
      const mappings = await this.getCanMappings()
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

  /**
   * Handle adding a CAN mapping
   */
  async handleAddCanMapping() {
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
        
        await this.addCanMapping({
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
      await this.refreshCanMappings()
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
   * Handle removing a CAN mapping
   */
  async handleRemoveCanMapping(mapping) {
    const direction = mapping.isrx ? 'rx' : 'tx'
    const paramName = this.getParameterDisplayName(mapping.paramid, this.state.oiParameters || {})
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
        
        await this.removeCanMapping({
          direction: direction,
          msg_index: mapping.msgIndex,
          param_index: mapping.paramIndex,
        })
        
        // Reset loading flag so refreshCanMappings can run
        this.state.isLoadingCanMappings = false
      }

      // Refresh mappings (will handle loading state itself)
      await this.refreshCanMappings()
      alert('CAN mapping removed successfully')
    } catch (error) {
      console.error('[OI] Failed to remove CAN mapping:', error)
      this.state.isLoadingCanMappings = false
      this.state.canMappingError = error.message || 'Failed to remove CAN mapping'
      this.emit('render')
      alert(`Failed to remove CAN mapping: ${error.message}`)
    }
  }

  renderCanmappingContent() {
    // Auto-load CAN mappings if device is connected but mappings aren't loaded yet
    if (!this.state.canMappings && !this.state.isLoadingCanMappings && this.state.oiDeviceConnected) {
      setTimeout(() => this.refreshCanMappings(), 0)
    }

    // Auto-load all params with IDs (for dropdown) - includes both parameters and spot values
    if (!this.state.allParamsWithIds && !this.state.isLoadingAllParamsWithIds && this.state.oiDeviceConnected) {
      setTimeout(() => this.refreshAllParamsWithIds(), 0)
    }

    if (!this.state.oiDeviceConnected) {
      return this.html`
        <div style="padding: 60px 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">📡</div>
          <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
            Connect to a device to view CAN mappings
          </p>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 0;">
            Use the Device Selector to scan and connect
          </p>
        </div>
      `
    }

    if (this.state.isLoadingCanMappings) {
      return this.html`
        <div style="padding: 60px 20px; text-align: center;">
          <p style="font-size: 16px; color: var(--text-secondary);">Loading CAN mappings...</p>
        </div>
      `
    }

    const mappings = this.state.canMappings || { tx: [], rx: [] }
    const txMappings = this.flattenCanMappings(mappings.tx || [], false)
    const rxMappings = this.flattenCanMappings(mappings.rx || [], true)
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
      <div style="padding: 20px;">
        <h2 class="section-header" style="margin-bottom: 1.5rem;">CAN Mappings</h2>

        ${this.state.canMappingError ? this.html`
          <div class="error-message" style="margin-bottom: 1.5rem;">
            <p>Error: ${this.state.canMappingError}</p>
          </div>
        ` : ''}

        <div class="can-mappings-container">
          <!-- TX Mappings -->
          <div class="mapping-section">
            <h3 style="margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-primary);">
              TX Mappings (Transmit)
            </h3>
            ${txMappings.length === 0 ? this.html`
              <p class="no-mappings">No TX mappings configured</p>
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
                  ${txMappings.map((mapping, idx) => this.html`
                    <tr>
                      <td>0x${mapping.id.toString(16).toUpperCase()}</td>
                      <td>${this.getParameterDisplayNameById(mapping.paramid, params)}</td>
                      <td>${mapping.position}</td>
                      <td>${mapping.length} bits</td>
                      <td>${mapping.gain}</td>
                      <td>${mapping.offset}</td>
                      <td>
                        <button
                          class="btn-remove"
                          onclick=${() => this.handleRemoveCanMapping(mapping)}
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

          <!-- RX Mappings -->
          <div class="mapping-section">
            <h3 style="margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-primary);">
              RX Mappings (Receive)
            </h3>
            ${rxMappings.length === 0 ? this.html`
              <p class="no-mappings">No RX mappings configured</p>
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
                  ${rxMappings.map((mapping, idx) => this.html`
                    <tr>
                      <td>0x${mapping.id.toString(16).toUpperCase()}</td>
                      <td>${this.getParameterDisplayNameById(mapping.paramid, params)}</td>
                      <td>${mapping.position}</td>
                      <td>${mapping.length} bits</td>
                      <td>${mapping.gain}</td>
                      <td>${mapping.offset}</td>
                      <td>
                        <button
                          class="btn-remove"
                          onclick=${() => this.handleRemoveCanMapping(mapping)}
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

          <!-- Add Mapping Section -->
          <div class="add-mapping-section">
            ${!showAddForm ? this.html`
              <button class="btn-add" onclick=${() => { this.state.showCanMappingForm = true; this.emit('render') }}>
                Add CAN Mapping
              </button>
            ` : this.html`
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
                            ${this.getParameterDisplayName(key, param)} (ID: ${param.id})
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
                  }}>
                    Cancel
                  </button>
                  <button
                    class="btn-save"
                    onclick=${() => this.handleAddCanMapping()}
                    disabled=${formData.paramid === 0}
                  >
                    Add Mapping
                  </button>
                </div>
              </div>
            `}
          </div>
        </div>
      </div>
    `
  }

  /**
   * Render CAN Messages panel
   * Send and monitor CAN bus messages
   */
  renderCanmessages() {
    return this.html`
      <div class="system-panel">
        <div class="panel-header" style="padding: 20px; border-bottom: 1px solid var(--border-color);">
          <h2 style="margin: 0; font-size: 24px; color: white;">CAN Messages</h2>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
            Send and monitor CAN bus traffic
          </p>
        </div>
        
        <div style="padding: 60px 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">📨</div>
          <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
            CAN Message interface coming soon
          </p>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 0;">
            This panel will allow you to send arbitrary CAN messages and monitor CAN bus traffic
          </p>
        </div>
      </div>
    `
  }

  renderCanmessagesContent() {
    if (!this.state.oiDeviceConnected) {
      return this.html`
        <section id="can-messages" class="card">
          <h2 class="section-header">CAN Messages</h2>
          <div style="padding: 60px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">📨</div>
            <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
              Connect to a device to send CAN messages
            </p>
            <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 0;">
              Use the Device Selector to scan and connect
            </p>
          </div>
        </section>
      `
    }

    return this.html`
      <section id="can-messages" style="padding: 1.5rem;">
        <h2 class="section-header" style="margin-bottom: 1.5rem; color: var(--text-primary);">CAN Messages</h2>

        <!-- CAN IO Control Section -->
        ${this.renderCanIoControl()}

        <!-- CAN Message Sender Section -->
        ${this.renderCanMessageSender()}
      </section>
    `
  }

  /**
   * Render CAN IO Control section (Inverter control)
   */
  renderCanIoControl() {
    const canIo = this.state.canIo || {}
    const isActive = canIo.active || false
    const isConnected = this.state.oiDeviceConnected || false

    return this.html`
      <div class="can-io-control" style="background: var(--bg-secondary, #f8f9fa); border-radius: 8px; padding: 20px; margin-bottom: 2rem;">
        <h3 style="margin: 0 0 20px 0; color: var(--text-primary); font-size: 18px; border-bottom: 2px solid var(--oi-blue); padding-bottom: 8px;">
          CAN IO Control (Inverter)
        </h3>

        <!-- Configuration -->
        <div class="can-io-section" style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px; font-weight: 600;">Configuration</h4>
          
          <div class="can-io-row" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <label style="min-width: 140px; color: var(--text-secondary); font-size: 14px;">CAN ID (hex):</label>
            <input
              type="text"
              value=${canIo.canId || '3F'}
              oninput=${(e) => {
                this.state.canIo.canId = e.target.value.toUpperCase()
                this.emit('render')
              }}
              disabled=${isActive}
              placeholder="3F"
              maxlength="3"
              style="padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; width: 100px; font-family: 'Courier New', monospace;"
            />
          </div>

          <div class="can-io-row" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <label style="min-width: 140px; color: var(--text-secondary); font-size: 14px;">Interval (ms):</label>
            <input
              type="number"
              value=${canIo.interval || 100}
              oninput=${(e) => {
                this.state.canIo.interval = parseInt(e.target.value) || 100
                this.emit('render')
              }}
              disabled=${isActive}
              min="10"
              max="500"
              style="padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; width: 100px;"
            />
            <span class="hint" style="color: var(--text-muted); font-size: 12px; font-style: italic;">10-500ms (recommended: 50-100ms)</span>
          </div>

          <div class="can-io-row" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input
                type="checkbox"
                checked=${canIo.useCrc !== false}
                onchange=${(e) => {
                  this.state.canIo.useCrc = e.target.checked
                  this.emit('render')
                }}
                disabled=${isActive}
                style="width: 18px; height: 18px; cursor: pointer;"
              />
              <span style="font-size: 14px; color: var(--text-primary);">Use CRC-32 (controlcheck=1)</span>
            </label>
            <span class="hint" style="color: var(--text-muted); font-size: 12px; font-style: italic;">Disable for counter-only mode (controlcheck=0)</span>
          </div>
        </div>

        <!-- Control Flags -->
        <div class="can-io-section" style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px; font-weight: 600;">Control Flags</h4>
          <div class="can-io-flags" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
            ${['cruise', 'start', 'brake', 'forward', 'reverse', 'bms'].map(flag => {
              const flagLabels = {
                cruise: { label: 'Cruise (0x01)', bit: 0x01 },
                start: { label: 'Start (0x02)', bit: 0x02 },
                brake: { label: 'Brake (0x04)', bit: 0x04 },
                forward: { label: 'Forward (0x08)', bit: 0x08 },
                reverse: { label: 'Reverse (0x10)', bit: 0x10 },
                bms: { label: 'BMS (0x20)', bit: 0x20 }
              }
              const info = flagLabels[flag]
              return this.html`
                <label class="can-io-checkbox" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: white; border: 1px solid var(--border-color); border-radius: 4px; cursor: ${isActive ? 'pointer' : 'not-allowed'}; transition: all 0.2s;">
                  <input
                    type="checkbox"
                    checked=${canIo[flag] || false}
                    onchange=${(e) => {
                      this.state.canIo[flag] = e.target.checked
                      this.emit('render')
                      if (isActive) {
                        this.updateCanIoFlags()
                      }
                    }}
                    disabled=${!isActive}
                    style="width: 18px; height: 18px; cursor: ${isActive ? 'pointer' : 'not-allowed'};"
                  />
                  <span style="font-size: 14px; color: var(--text-primary); user-select: none;">${info.label}</span>
                </label>
              `
            })}
          </div>
        </div>

        <!-- Throttle & Parameters -->
        <div class="can-io-section" style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px; font-weight: 600;">Throttle & Parameters</h4>
          
          <div class="can-io-row" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <label style="min-width: 140px; color: var(--text-secondary); font-size: 14px;">Throttle (%):</label>
            <input
              type="range"
              value=${canIo.throttlePercent || 0}
              oninput=${(e) => {
                this.state.canIo.throttlePercent = parseInt(e.target.value) || 0
                this.emit('render')
                if (isActive) {
                  this.updateCanIoFlags()
                }
              }}
              disabled=${!isActive}
              min="0"
              max="100"
              style="flex: 1; min-width: 200px;"
            />
            <span class="value" style="min-width: 50px; font-weight: 600; color: var(--oi-blue);">${canIo.throttlePercent || 0}%</span>
          </div>

          <div class="can-io-row" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <label style="min-width: 140px; color: var(--text-secondary); font-size: 14px;">Cruise Speed:</label>
            <input
              type="number"
              value=${canIo.cruisespeed || 0}
              oninput=${(e) => {
                this.state.canIo.cruisespeed = parseInt(e.target.value) || 0
                this.emit('render')
                if (isActive) {
                  this.updateCanIoFlags()
                }
              }}
              disabled=${!isActive}
              min="0"
              max="16383"
              style="padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; width: 100px;"
            />
            <span class="hint" style="color: var(--text-muted); font-size: 12px; font-style: italic;">0-16383</span>
          </div>

          <div class="can-io-row" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <label style="min-width: 140px; color: var(--text-secondary); font-size: 14px;">Regen Preset:</label>
            <input
              type="number"
              value=${canIo.regenpreset || 0}
              oninput=${(e) => {
                this.state.canIo.regenpreset = parseInt(e.target.value) || 0
                this.emit('render')
                if (isActive) {
                  this.updateCanIoFlags()
                }
              }}
              disabled=${!isActive}
              min="0"
              max="255"
              style="padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; width: 100px;"
            />
            <span class="hint" style="color: var(--text-muted); font-size: 12px; font-style: italic;">0-255</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="can-io-actions" style="display: flex; align-items: center; gap: 16px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);">
          <button
            onclick=${() => this.toggleCanIo()}
            disabled=${!isConnected}
            class="${isActive ? 'stop-btn' : 'start-btn'}"
            style="padding: 10px 24px; font-size: 14px; font-weight: 600; border: none; border-radius: 6px; cursor: ${isConnected ? 'pointer' : 'not-allowed'}; transition: all 0.2s; background: ${isActive ? '#dc3545' : '#28a745'}; color: white; opacity: ${isConnected ? '1' : '0.5'};"
          >
            ${isActive ? 'Stop CAN IO' : 'Start CAN IO'}
          </button>
          ${isActive ? this.html`
            <div class="can-io-status-indicator" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #d4edda; color: #155724; border-radius: 4px; font-size: 14px; font-weight: 500;">
              <span class="pulse" style="width: 10px; height: 10px; background: #28a745; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite;"></span>
              Active (${canIo.interval || 100}ms interval)
            </div>
          ` : ''}
        </div>
      </div>
    `
  }

  /**
   * Render CAN Message Sender section
   */
  renderCanMessageSender() {
    const canMessages = this.state.canMessages || {}
    const isConnected = this.state.oiDeviceConnected || false

    return this.html`
      <div id="can-message-sender" style="padding: 1.5rem; background: var(--bg-secondary, #f8f9fa); border-radius: 8px;">
        <h2 class="section-header" style="margin-bottom: 1.5rem; color: var(--text-primary);">CAN Message Sender</h2>

        <!-- One-Shot Messages -->
        <div class="message-section" style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">One-Shot Message</h3>
          <p class="section-description" style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
            Send a single CAN message immediately
          </p>

          <div class="message-form" style="background: var(--bg-primary); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
            <div class="form-row" style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary);">
                CAN ID (hex):
                <input
                  type="text"
                  placeholder="0x180"
                  value=${canMessages.canId || ''}
                  oninput=${(e) => {
                    this.state.canMessages.canId = e.target.value.toUpperCase()
                    this.emit('render')
                  }}
                  class="input-hex"
                  style="width: 100%; max-width: 200px; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; font-family: 'Courier New', monospace; font-size: 0.95rem; margin-top: 0.5rem;"
                />
              </label>
            </div>

            <div class="form-row" style="margin-bottom: 1rem;">
              <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary);">
                Data Bytes (hex):
                <input
                  type="text"
                  placeholder="00 00 00 00 00 00 00 00"
                  value=${canMessages.dataBytes || ''}
                  oninput=${(e) => {
                    const formatted = this.formatHexBytes(e.target.value)
                    this.state.canMessages.dataBytes = formatted
                    this.emit('render')
                  }}
                  class="input-data"
                  maxlength="23"
                  style="width: 100%; max-width: 400px; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; font-family: 'Courier New', monospace; font-size: 0.95rem; letter-spacing: 0.1em; margin-top: 0.5rem;"
                />
              </label>
            </div>

            <div class="form-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
              <button
                class="btn-send"
                onclick=${() => this.handleSendOneShot()}
                disabled=${!isConnected}
                style="padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: ${isConnected ? 'pointer' : 'not-allowed'}; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; background-color: var(--oi-blue); color: white; opacity: ${isConnected ? '1' : '0.5'};"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>

        <!-- Periodic Messages -->
        <div class="message-section">
          <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">Periodic Messages</h3>
          <p class="section-description" style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
            Configure messages to be sent at regular intervals
          </p>

          ${canMessages.periodicMessages && canMessages.periodicMessages.length > 0 ? this.html`
            <table class="messages-table" style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; background: white;">
              <thead style="background-color: var(--bg-secondary);">
                <tr>
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: var(--text-primary); border-bottom: 2px solid var(--border-color);">CAN ID</th>
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: var(--text-primary); border-bottom: 2px solid var(--border-color);">Data</th>
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: var(--text-primary); border-bottom: 2px solid var(--border-color);">Interval (ms)</th>
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: var(--text-primary); border-bottom: 2px solid var(--border-color);">Status</th>
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: var(--text-primary); border-bottom: 2px solid var(--border-color);">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${canMessages.periodicMessages.map((message) => this.html`
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 0.75rem; color: var(--text-primary); font-family: 'Courier New', monospace;">0x${message.canId.toString(16).toUpperCase().padStart(3, '0')}</td>
                    <td class="data-cell" style="padding: 0.75rem; font-family: 'Courier New', monospace; font-size: 0.9rem;">${message.data.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ')}</td>
                    <td style="padding: 0.75rem; color: var(--text-primary);">${message.interval}</td>
                    <td style="padding: 0.75rem;">
                      <span class="status-badge" style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 500; background-color: ${message.active ? '#d4edda' : '#f8d7da'}; color: ${message.active ? '#155724' : '#721c24'};">
                        ${message.active ? 'Active' : 'Stopped'}
                      </span>
                    </td>
                    <td style="padding: 0.75rem;">
                      <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                        <button
                          class="${message.active ? 'btn-stop' : 'btn-start'}"
                          onclick=${() => this.handleTogglePeriodic(message)}
                          disabled=${!isConnected}
                          style="padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: ${isConnected ? 'pointer' : 'not-allowed'}; font-size: 0.9rem; transition: background 0.2s; background-color: ${message.active ? '#dc3545' : '#28a745'}; color: white; opacity: ${isConnected ? '1' : '0.5'};"
                        >
                          ${message.active ? 'Stop' : 'Start'}
                        </button>
                        <button
                          class="btn-remove"
                          onclick=${() => this.handleRemovePeriodic(message.id)}
                          disabled=${message.active}
                          style="padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: ${message.active ? 'not-allowed' : 'pointer'}; font-size: 0.9rem; transition: background 0.2s; background-color: ${message.active ? '#ccc' : '#dc3545'}; color: white; opacity: ${message.active ? '0.6' : '1'};"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          ` : this.html`
            <p class="no-messages" style="color: var(--text-muted); font-style: italic; padding: 1rem; text-align: center;">
              No periodic messages configured
            </p>
          `}

          <!-- Add Periodic Message Form -->
          <div class="add-message-section" style="margin-top: 1rem;">
            ${!canMessages.showAddPeriodicForm ? this.html`
              <button
                class="btn-add"
                onclick=${() => {
                  this.state.canMessages.showAddPeriodicForm = true
                  this.emit('render')
                }}
                style="padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; transition: background 0.2s; background-color: var(--oi-blue); color: white; margin-top: 1rem;"
              >
                Add Periodic Message
              </button>
            ` : this.html`
              <div class="add-message-form" style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; margin-top: 1rem;">
                <h4 style="margin-bottom: 1rem; color: var(--text-primary);">Add New Periodic Message</h4>

                <div class="form-row" style="margin-bottom: 1rem;">
                  <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary);">
                    CAN ID (hex):
                    <input
                      type="text"
                      placeholder="0x180"
                      value=${canMessages.periodicFormData.canId || ''}
                      oninput=${(e) => {
                        this.state.canMessages.periodicFormData.canId = e.target.value.toUpperCase()
                        this.emit('render')
                      }}
                      class="input-hex"
                      style="width: 100%; max-width: 200px; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; font-family: 'Courier New', monospace; font-size: 0.95rem; margin-top: 0.5rem;"
                    />
                  </label>
                </div>

                <div class="form-row" style="margin-bottom: 1rem;">
                  <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary);">
                    Data Bytes (hex):
                    <input
                      type="text"
                      placeholder="00 00 00 00 00 00 00 00"
                      value=${canMessages.periodicFormData.data || ''}
                      oninput=${(e) => {
                        const formatted = this.formatHexBytes(e.target.value)
                        this.state.canMessages.periodicFormData.data = formatted
                        this.emit('render')
                      }}
                      class="input-data"
                      maxlength="23"
                      style="width: 100%; max-width: 400px; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; font-family: 'Courier New', monospace; font-size: 0.95rem; letter-spacing: 0.1em; margin-top: 0.5rem;"
                    />
                  </label>
                </div>

                <div class="form-row" style="margin-bottom: 1rem;">
                  <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary);">
                    Interval (ms):
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      step="10"
                      value=${canMessages.periodicFormData.interval || 100}
                      oninput=${(e) => {
                        this.state.canMessages.periodicFormData.interval = parseInt(e.target.value) || 100
                        this.emit('render')
                      }}
                      style="width: 100%; max-width: 200px; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.95rem; margin-top: 0.5rem;"
                    />
                  </label>
                </div>

                <div class="form-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end;">
                  <button
                    class="btn-cancel"
                    onclick=${() => {
                      this.state.canMessages.showAddPeriodicForm = false
                      this.state.canMessages.periodicFormData = { canId: '', data: '', interval: 100 }
                      this.emit('render')
                    }}
                    style="padding: 0.6rem 1.2rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.95rem; transition: background 0.2s; background: #6c757d; color: white;"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn-save"
                    onclick=${() => this.handleAddPeriodic()}
                    style="padding: 0.6rem 1.2rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: background 0.2s; background: var(--oi-status-success); color: white;"
                  >
                    Add Message
                  </button>
                </div>
              </div>
            `}
          </div>
        </div>
      </div>
    `
  }

  /**
   * Render Firmware Upgrade panel
   * Upload new firmware to an OpenInverter device
   */
  renderFirmware() {
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
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Firmware Upgrade</h2>
        </div>
        
        <div class="oi-parameters-container">
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
                onchange=${(e) => this.selectFirmwareFile(e)}
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
              <!-- Recovery Mode -->
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
              
              <!-- Serial Number (for recovery mode) -->
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
              
              <!-- Normal Mode Info -->
              ${!fw.recoveryMode && this.state.oiDeviceConnected ? this.html`
                <div style="font-size: 13px; color: var(--text-secondary);">
                  Will upgrade device at Node ID ${this.state.selectedNodeId}. 
                  The device will be automatically reset.
                </div>
              ` : !fw.recoveryMode ? this.html`
                <div style="font-size: 13px; color: #ef4444;">
                  Please connect to a device first (Device Control panel)
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Upgrade Progress -->
          ${fw.inProgress || fw.error || fw.status ? this.html`
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="font-size: 16px; margin-bottom: 16px;">Progress</h3>
              
              ${fw.error ? this.html`
                <div style="padding: 12px; background: #fee2e2; border: 1px solid #ef4444; border-radius: 4px; color: #991b1b; margin-bottom: 12px;">
                  <strong>Error:</strong> ${fw.error}
                </div>
              ` : ''}
              
              <div style="margin-bottom: 8px;">
                <div style="font-size: 14px; color: var(--text-primary); margin-bottom: 8px;">
                  ${fw.status}
                </div>
                <div style="width: 100%; height: 24px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden;">
                  <div style="height: 100%; background: var(--scheme-primary); transition: width 0.3s; width: ${fw.progress}%;"></div>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px; text-align: right;">
                  ${fw.progress.toFixed(1)}%
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Start Upgrade Button -->
          <div style="display: flex; justify-content: center;">
            <button 
              class="primary-button" 
              onclick=${() => this.startFirmwareUpgrade()}
              disabled=${!fw.selectedFile || fw.inProgress || !this.state.isConnected || (!fw.recoveryMode && !this.state.oiDeviceConnected)}
              style="padding: 12px 32px; font-size: 16px;">
              ${fw.inProgress ? 'Upgrading...' : 'Start Firmware Upgrade'}
            </button>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Render Plot panel
   * Real-time plotting of selected parameters
   */
  renderPlot() {
    // Initialize plot state if needed
    if (!this.state.plotState) {
      this.state.plotState = {
        isPlotting: false,
        isPaused: false,
        selectedVars: [],
        chart: null,
        maxDataPoints: 100,
        updateInterval: 100 // ms
      }
    }

    return this.html`
      <div class="system-panel">
        <div class="panel-header oi-compact-header">
          <h2>Live Plot</h2>
          <div class="panel-actions oi-plot-controls">
            ${this.state.plotState.isPlotting ? this.html`
              <div class="button">
                <button 
                  class="${this.state.plotState.isPaused ? '' : 'active'}"
                  onclick=${() => this.pauseResumePlot()}
                  title="${this.state.plotState.isPaused ? 'Resume' : 'Pause'} plotting">
                  ${this.state.plotState.isPaused ? this.html`
                    <img class="icon" src=${this.icon('playerPlay', 20)} />
                  ` : this.html`
                    <img class="icon" src=${this.icon('playerPause', 20)} />
                  `}
                </button>
                <div class="label active">${this.state.plotState.isPaused ? 'Run' : 'Pause'}</div>
              </div>
              <div class="button">
                <button 
                  onclick=${() => this.stopPlot()}
                  title="Stop plotting">
                  <img class="icon" src=${this.icon('playerStop', 20)} />
                </button>
                <div class="label active">Stop</div>
              </div>
            ` : this.html`
              <div class="button">
                <button 
                  disabled=${!this.state.isConnected || this.state.plotState.selectedVars.length === 0}
                  onclick=${() => this.startPlot()}
                  title="Start plotting selected variables">
                  <img class="icon" src=${this.icon('playerPlay', 20)} />
                </button>
                <div class="label ${(!this.state.isConnected || this.state.plotState.selectedVars.length === 0) ? 'inactive' : 'active'}">Start Plot</div>
              </div>
            `}
          </div>
        </div>

        ${this.renderPlotContent()}
      </div>
    `
  }

  renderPlotContent() {
    if (!this.state.isConnected) {
      return this.html`
        <div class="panel-message">
          <p>Connect to device to use live plotting</p>
        </div>
      `
    }

    if (!this.state.oiSpotValues) {
      // Auto-load spot values if not already loaded
      if (!this.state.isLoadingOiSpotValues) {
        setTimeout(() => this.refreshSpotValues(), 0)
      }
      return this.html`
        <div class="panel-message">
          <p>Loading spot values...</p>
          <p>Please wait while we fetch available signals.</p>
        </div>
      `
    }

    return this.html`
      <div class="oi-plot-container">
        <div class="oi-plot-sidebar">
          <h3 class="oi-plot-section-title">Select Signals</h3>
          <div class="oi-plot-signal-list">
            ${Object.entries(this.state.oiSpotValues).map(([name, spot]) => this.renderPlotSignal(name, spot))}
          </div>
          
          <h3 class="oi-plot-section-title">Plot Settings</h3>
          <div class="oi-plot-settings">
            <label>
              Max Data Points:
              <input 
                type="number" 
                value="${this.state.plotState.maxDataPoints}" 
                min="50" 
                max="1000" 
                step="50"
                onchange=${(e) => { this.state.plotState.maxDataPoints = parseInt(e.target.value) }}
              />
            </label>
            <label>
              Update Interval (ms):
              <input 
                type="number" 
                value="${this.state.plotState.updateInterval}" 
                min="50" 
                max="1000" 
                step="50"
                onchange=${(e) => { this.state.plotState.updateInterval = parseInt(e.target.value) }}
              />
            </label>
          </div>
        </div>
        
        <div class="oi-plot-chart-area">
          <canvas id="oi-plot-canvas"></canvas>
        </div>
      </div>
    `
  }

  renderPlotSignal(name, spot) {
    const isSelected = this.state.plotState.selectedVars.includes(name)

    return this.html`
      <div class="oi-plot-signal">
        <label>
          <input 
            type="checkbox" 
            checked=${isSelected}
            onchange=${(e) => this.togglePlotVariable(name, e.target.checked)}
            disabled=${this.state.plotState.isPlotting}
          />
          <span class="oi-plot-signal-name">${name}</span>
          <span class="oi-plot-signal-unit">${spot.unit || ''}</span>
        </label>
      </div>
    `
  }

  togglePlotVariable(varName, isChecked) {
    if (isChecked) {
      if (!this.state.plotState.selectedVars.includes(varName)) {
        this.state.plotState.selectedVars.push(varName)
      }
    } else {
      this.state.plotState.selectedVars = this.state.plotState.selectedVars.filter(v => v !== varName)
    }
    this.emit('render')
  }

  async startPlot() {
    if (this.state.plotState.selectedVars.length === 0) {
      alert('Please select at least one variable to plot')
      return
    }

    this.state.plotState.isPlotting = true
    this.state.plotState.isPaused = false
    this.emit('render')

    // Wait for render to complete and canvas to be available
    setTimeout(() => this.initializeChart(), 100)
  }

  initializeChart() {
    const canvas = document.getElementById('oi-plot-canvas')
    if (!canvas) {
      console.error('[OI Plot] Canvas not found')
      return
    }

    // Destroy existing chart if any
    if (this.state.plotState.chart) {
      try {
        this.state.plotState.chart.destroy()
      } catch (e) {
        console.warn('[OI Plot] Error destroying old chart:', e)
      }
    }

    // Don't set explicit canvas dimensions - let Chart.js handle it with responsive mode
    // Setting explicit dimensions conflicts with Chart.js responsive sizing
    const ctx = canvas.getContext('2d')
    const colors = [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 159, 64)',
      'rgb(153, 102, 255)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)'
    ]

    const datasets = this.state.plotState.selectedVars.map((varName, idx) => ({
      label: varName,
      data: [],
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length],
      fill: false,
      pointRadius: 0,
      borderWidth: 2
    }))

    this.state.plotState.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time (s)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        onResize: null  // Disable automatic resize handler - Chart.js responsive mode handles it automatically
      }
    })

    // Start data acquisition
    this.state.plotState.dataTime = 0
    this.acquirePlotData()
  }

  async acquirePlotData() {
    if (!this.state.plotState.isPlotting || this.state.plotState.isPaused) {
      return
    }

    try {
      const varNames = this.state.plotState.selectedVars

      if (!varNames || varNames.length === 0) {
        console.error('[OI Plot] No variables selected!')
        this.stopPlot()
        return
      }

      const argsStr = JSON.stringify(varNames)
      const result = await this.device.execute(`from lib.OI_helpers import getPlotData; getPlotData(${argsStr})`)
      const parsed = this.device.parseJSON(result)
      const data = parsed

      if (data && data.values) {
        // Check if chart still exists
        if (!this.state.plotState.chart) {
          // Chart missing - re-initialize if plotting
          const canvas = document.getElementById('oi-plot-canvas')
          if (this.state.plotState.isPlotting && canvas) {
            console.warn('[OI Plot] Chart missing, re-initializing...')
            this.initializeChart()
          }
          return
        }
        
        // Try to update the chart - if it fails, then re-initialize
        // Don't check canvas references because they change on re-render
        // Chart.js will handle its own canvas management
        try {
          // Test if chart is still functional by checking if we can access its data
          if (!this.state.plotState.chart.data || !this.state.plotState.chart.data.datasets) {
            throw new Error('Chart data structure invalid')
          }
        } catch (e) {
          // Chart is broken - re-initialize
          const canvas = document.getElementById('oi-plot-canvas')
          if (this.state.plotState.isPlotting && canvas) {
            console.warn('[OI Plot] Chart broken, re-initializing...', e)
            this.initializeChart()
          }
          return
        }

        // Add new data point
        this.state.plotState.dataTime++
        this.state.plotState.chart.data.labels.push(this.state.plotState.dataTime)

        // Update each dataset
        for (const varName of varNames) {
          const dataset = this.state.plotState.chart.data.datasets.find(d => d.label === varName)
          if (dataset && data.values[varName] !== undefined) {
            dataset.data.push(data.values[varName])
          }
        }

        // Trim old data
        const maxPoints = this.state.plotState.maxDataPoints
        if (this.state.plotState.chart.data.labels.length > maxPoints) {
          this.state.plotState.chart.data.labels.shift()
          this.state.plotState.chart.data.datasets.forEach(dataset => dataset.data.shift())
        }

        this.state.plotState.chart.update('none') // Update without animation
      }

      // Schedule next acquisition
      setTimeout(() => this.acquirePlotData(), this.state.plotState.updateInterval)
    } catch (error) {
      console.error('[OI Plot] Failed to acquire data:', error)
      this.stopPlot()
    }
  }

  pauseResumePlot() {
    this.state.plotState.isPaused = !this.state.plotState.isPaused
    this.emit('render')

    if (this.state.plotState.isPaused) {
      // When pausing, force chart update to recalculate scales based on all current data
      // Use setTimeout to ensure render completes and DOM is stable before updating chart
      setTimeout(() => {
        if (this.state.plotState.chart && this.state.plotState.isPaused) {
          try {
            const chart = this.state.plotState.chart
            const canvas = document.getElementById('oi-plot-canvas')
            
            if (!canvas) {
              console.warn('[OI Plot] Canvas not found during pause')
              return
            }
            
            // CRITICAL: Force Chart.js to recalculate container size before updating
            // This fixes the DOM dimension issue where chart reads wrong container size
            chart.resize()
            
            // Reset scale to auto-scale from all data
            const yScale = chart.scales.y
            if (yScale) {
              yScale.options.min = undefined
              yScale.options.max = undefined
            }
            
            // Update chart - this will recalculate scales from all data with correct container size
            chart.update('none')
          } catch (e) {
            console.warn('[OI Plot] Chart update failed during pause:', e)
          }
        }
      }, 100) // Increased timeout to ensure DOM is fully stable
    } else {
      // When resuming, reset scale to auto and continue data acquisition
      setTimeout(() => {
        if (!this.state.plotState.isPaused && this.state.plotState.chart) {
          try {
            // Force resize to ensure correct dimensions
            this.state.plotState.chart.resize()
            // Reset to auto-scaling when resuming
            const yScale = this.state.plotState.chart.scales.y
            if (yScale) {
              yScale.options.min = undefined
              yScale.options.max = undefined
            }
          } catch (e) {
            // Ignore errors when resetting scale
          }
          this.acquirePlotData()
        }
      }, 0)
    }
  }

  stopPlot() {
    this.state.plotState.isPlotting = false
    this.state.plotState.isPaused = false

    if (this.state.plotState.chart) {
      this.state.plotState.chart.destroy()
      this.state.plotState.chart = null
    }

    this.emit('render')
  }

  renderFirmwareContent() {
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
              onchange=${(e) => this.selectFirmwareFile(e)}
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
            ` : ''}
          </div>
        </div>
        
        <!-- Start/Cancel Buttons -->
        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <button 
            class="primary-button"
            onclick=${() => this.startFirmwareUpgrade()}
            disabled=${!fw.selectedFile || fw.inProgress || (!fw.recoveryMode && !this.state.oiDeviceConnected)}
            style="flex: 1;"
          >
            ${fw.inProgress ? 'Upgrading...' : 'Start Upgrade'}
          </button>
          
          ${fw.inProgress ? this.html`
            <button 
              class="secondary-button"
              onclick=${() => this.cancelFirmwareUpgrade()}
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
                    <span style="font-family: monospace;">${fw.progress}%</span>
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
   * Render Commands panel
   * Device control commands: save/load parameters, start/stop, reset
   */
  renderCommands() {
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
                    class="refresh-button" 
                    onclick=${() => this.scanCanBus(false)}
                    disabled=${!this.state.isConnected || this.state.isScanning}
                    style="padding: 8px 16px; font-size: 13px;">
                    ${this.state.isScanning ? 'Scanning...' : 'Quick Scan'}
                  </button>
                  <button 
                    class="refresh-button" 
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
            
            <!-- Manual Connection (alternative to scanning) -->
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
                  class="refresh-button" 
                  style="margin-top: 20px; color: green;"
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

  async deviceSave() {
    try {
      await this.device.execute('from lib.OI_helpers import deviceSave; deviceSave()')
      alert('Parameters saved to flash')
    } catch (error) {
      alert('Failed to save parameters: ' + error.message)
    }
  }

  async deviceLoad() {
    try {
      await this.device.execute('from lib.OI_helpers import deviceLoad; deviceLoad()')
      alert('Parameters loaded from flash')
    } catch (error) {
      alert('Failed to load parameters: ' + error.message)
    }
  }

  async deviceLoadDefaults() {
    if (!confirm('Load factory defaults? This will overwrite all current parameters.')) return
    try {
      await this.device.execute('from lib.OI_helpers import deviceLoadDefaults; deviceLoadDefaults()')
      alert('Factory defaults loaded')
    } catch (error) {
      alert('Failed to load defaults: ' + error.message)
    }
  }

  async deviceStart() {
    const mode = document.getElementById('oi-start-mode')?.value || '1'
    try {
      await this.device.execute(`from lib.OI_helpers import deviceStart; deviceStart({'mode': ${mode}})`)
      alert('Device started in mode ' + mode)
    } catch (error) {
      alert('Failed to start device: ' + error.message)
    }
  }

  async deviceStop() {
    try {
      await this.device.execute('from lib.OI_helpers import deviceStop; deviceStop()')
      alert('Device stopped')
    } catch (error) {
      alert('Failed to stop device: ' + error.message)
    }
  }

  async deviceReset() {
    if (!confirm('Reset device? This will restart the controller.')) return
    try {
      await this.device.execute('from lib.OI_helpers import deviceReset; deviceReset()')
      alert('Device reset command sent')
    } catch (error) {
      alert('Failed to reset device: ' + error.message)
    }
  }

  /**
   * Render Errors panel
   * Display device info and error log
   */
  renderErrors() {
    // Load device info if not already loaded
    // Only auto-load when OpenInverter device is connected, not just WebREPL
    if (!this.state.oiDeviceInfo && !this.state.isLoadingDeviceInfo && this.state.oiDeviceConnected) {
      setTimeout(() => this.loadDeviceInfo(), 0)
    }

    return this.html`
      <div class="oi-parameters-container">
        <h2 style="color: var(--scheme-primary); margin-bottom: 20px;">Device Information & Error Log</h2>
        
        ${this.renderDeviceInfoContent()}
      </div>
    `
  }

  renderDeviceInfoContent() {
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

  // === Connection Management Methods ===

  async scanCanBus(fullScan = false) {
    this.state.isScanning = true
    this.state.canScanResults = []
    this.state.scanProgress = null
    this.emit('render')

    try {
      const scanArgs = JSON.stringify({ quick: !fullScan })
      const result = await this.device.execute(`from lib.OI_helpers import scanCanBus; scanCanBus('${scanArgs}')`) // Pass as JSON string, function will parse it
      const parsed = this.device.parseJSON(result)

      // Check if we got an error response
      if (parsed.error) {
        this.state.scanMessage = `Error: ${parsed.error}`
        this.state.canScanResults = []
      } else if (parsed.devices) {
        this.state.canScanResults = parsed.devices

        // Update discovered devices list for sidebar
        this.state.discoveredDevices = parsed.devices.map(device => ({
          nodeId: device.nodeId,
          serial: device.serial || `Node_${device.nodeId}`,
          name: device.name || `OpenInverter ${device.nodeId}`,
          firmware: device.firmware || 'Unknown',
          online: true // Devices from scan are considered online
        }))

        // Update extension menu with discovered devices
        this.updateExtensionMenu()

        if (this.state.canScanResults.length === 0) {
          // Show helpful message when no devices found
          this.state.scanMessage = fullScan
            ? `No devices found (scanned all 127 node IDs)`
            : `No devices found (scanned node IDs 1-10). Try "Full Scan" to check all 127 node IDs.`
        } else {
          this.state.scanMessage = null
        }
      } else {
        this.state.scanMessage = 'Scan completed but received unexpected response format'
      }
    } catch (error) {
      console.error('[OI Connection] Scan failed:', error)
      this.state.scanMessage = `Scan failed: ${error.message}`
      this.state.canScanResults = []
    } finally {
      this.state.isScanning = false
      this.state.scanProgress = null
      this.emit('render')
    }
  }

  async connectToDevice(nodeId, serial) {
    try {
      // Update selected node ID if provided
      if (nodeId !== undefined) {
        this.state.selectedNodeId = nodeId
      }
      
      // Handle mock device mode (node ID > 127)
      if (this.state.selectedNodeId > 127) {
        // Create/update mock device for this node ID
        const mockSerial = serial || `MOCK-${String(this.state.selectedNodeId).padStart(3, '0')}-${Date.now().toString(36).slice(-4).toUpperCase()}`
        const mockDevice = {
          nodeId: this.state.selectedNodeId,
          serial: mockSerial,
          name: `Test Inverter ${this.state.selectedNodeId}`,
          firmware: 'v4.2.0-mock',
          online: true
        }
        
        // Add to discovered devices if not already there
        if (!this.state.discoveredDevices) {
          this.state.discoveredDevices = []
        }
        
        // Check if device with this nodeId already exists
        const existingIndex = this.state.discoveredDevices.findIndex(d => d.nodeId === this.state.selectedNodeId)
        if (existingIndex >= 0) {
          // Update existing device
          this.state.discoveredDevices[existingIndex] = mockDevice
        } else {
          // Add new device
          this.state.discoveredDevices.push(mockDevice)
        }
        
        // Update extension menu to include this device
        this.updateExtensionMenu()
        
        // Initialize mock device in Python backend (sets device_connected = True)
        const mockArgs = JSON.stringify({ node_id: this.state.selectedNodeId })
        const mockResult = await this.device.execute(`from lib.OI_helpers import initializeDevice; initializeDevice(${mockArgs})`)
        const mockParsed = this.device.parseJSON(mockResult)
        
        if (mockParsed && mockParsed.success) {
          this.state.oiDeviceConnected = true
          this.state.currentDeviceSerial = mockSerial
          // Initialize mock CAN mappings storage if not already initialized
          if (!this.state.mockCanMappings) {
            this.state.mockCanMappings = { tx: [], rx: [] }
          }
          console.log('[OI Connection] Mock device initialized:', mockDevice)
        } else {
          console.error('[OI Connection] Mock device initialization failed:', mockParsed)
        }
        
        this.emit('render')
        return
      }
      
      // Store serial if provided
      const deviceSerial = serial || `NODE-${this.state.selectedNodeId}-${Date.now().toString(36).slice(-4).toUpperCase()}`
      this.state.currentDeviceSerial = deviceSerial
      
      const args = JSON.stringify({ node_id: this.state.selectedNodeId })
      const result = await this.device.execute(`from lib.OI_helpers import initializeDevice; initializeDevice(${args})`)
      const parsed = this.device.parseJSON(result)

      if (parsed.success) {
        this.state.oiDeviceConnected = true
        
        // Add/update device in discovered devices list
        if (!this.state.discoveredDevices) {
          this.state.discoveredDevices = []
        }
        
        const existingIndex = this.state.discoveredDevices.findIndex(
          d => d.serial === deviceSerial || d.nodeId === this.state.selectedNodeId
        )
        
        const realDevice = {
          nodeId: this.state.selectedNodeId,
          serial: deviceSerial,
          name: null, // Will be set by user later
          firmware: parsed.firmware || 'Unknown',
          online: true
        }
        
        if (existingIndex >= 0) {
          // Update existing device
          this.state.discoveredDevices[existingIndex] = {
            ...this.state.discoveredDevices[existingIndex],
            ...realDevice,
            name: this.state.discoveredDevices[existingIndex].name || null
          }
        } else {
          // Add new device
          this.state.discoveredDevices.push(realDevice)
        }
        
        // Update extension menu
        this.updateExtensionMenu()
        
        console.log('[OI Connection] Connected to device:', {
          nodeId: this.state.selectedNodeId,
          serial: deviceSerial
        })
      } else {
        console.error('[OI Connection] Connection failed:', parsed)
        alert('Failed to connect to device. Check console for details.')
      }
    } catch (error) {
      console.error('[OI Connection] Connection error:', error)
      alert('Failed to connect: ' + error.message)
    }

    this.emit('render')
  }

  /**
   * Update the extension menu to include discovered devices
   * This modifies the menu in Scripto Studio's state to show devices as submenu items
   */
  updateExtensionMenu() {
    // Find this extension in installed extensions
    const extensions = this.state.installedExtensions || []
    const thisExtension = extensions.find(ext => ext.id === 'openinverter')
    
    if (!thisExtension) return
    
    // Start with base menu items
    const baseMenu = [
      { id: 'deviceselector', label: 'Device Manager' }
    ]
    
    // Add devices section header if we have devices
    if (this.state.discoveredDevices && this.state.discoveredDevices.length > 0) {
      baseMenu.push({ id: 'devices-header', label: '--- DEVICES ---', disabled: true })
      
      // Add each device as a menu item with normalized ID
      this.state.discoveredDevices.forEach((device, index) => {
        baseMenu.push({
          id: `device${index}`,  // Normalized ID: device0, device1, device2, etc.
          label: `${device.name || device.serial}`,
          deviceSerial: device.serial,  // Store serial for routing
          deviceIndex: index  // Store index for easy lookup
        })
      })
    }
    
    // Update the extension's menu
    thisExtension.menu = baseMenu
    
    // Force a re-render of the entire app to update the sidebar
    this.emit('render')
  }

  async connectToNode(nodeId) {
    this.state.selectedNodeId = nodeId
    await this.connectToDevice()
  }

  async disconnectDevice() {
    try {
      await this.device.execute('from lib.OI_helpers import disconnectDevice; disconnectDevice()')
      this.state.oiDeviceConnected = false
      this.state.currentDeviceSerial = null
    } catch (error) {
      console.error('[OI Connection] Disconnect error:', error)
    }

    this.emit('render')
  }

  /**
   * Add a device from scan results to the saved devices list
   */
  addDeviceFromScan(scanDevice) {
    if (!this.state.discoveredDevices) {
      this.state.discoveredDevices = []
    }

    // Check if device already exists
    const existingIndex = this.state.discoveredDevices.findIndex(
      d => d.serial === scanDevice.serialNumber || 
           (d.nodeId === scanDevice.nodeId && !scanDevice.serialNumber)
    )

    const deviceToAdd = {
      nodeId: scanDevice.nodeId,
      serial: scanDevice.serialNumber || `NODE-${scanDevice.nodeId}-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      name: null, // Will prompt for name when connecting
      firmware: scanDevice.firmware || 'Unknown',
      online: true
    }

    if (existingIndex >= 0) {
      // Update existing device
      this.state.discoveredDevices[existingIndex] = {
        ...this.state.discoveredDevices[existingIndex],
        ...deviceToAdd,
        name: this.state.discoveredDevices[existingIndex].name || null
      }
    } else {
      // Add new device
      this.state.discoveredDevices.push(deviceToAdd)
    }

    this.updateExtensionMenu()
    this.emit('render')
  }

  /**
   * Add a device manually from manual connection form
   */
  addDeviceManually() {
    if (!this.state.discoveredDevices) {
      this.state.discoveredDevices = []
    }

    const serial = this.state.manualSerial || 
                   (this.state.selectedNodeId > 127 
                     ? `MOCK-${String(this.state.selectedNodeId).padStart(3, '0')}-${Date.now().toString(36).slice(-4).toUpperCase()}`
                     : `NODE-${this.state.selectedNodeId}-${Date.now().toString(36).slice(-4).toUpperCase()}`)

    // Check if device already exists
    const existingIndex = this.state.discoveredDevices.findIndex(
      d => d.nodeId === this.state.selectedNodeId
    )

    const deviceToAdd = {
      nodeId: this.state.selectedNodeId,
      serial: serial,
      name: this.state.selectedNodeId > 127 ? `Test Inverter ${this.state.selectedNodeId}` : null,
      firmware: this.state.selectedNodeId > 127 ? 'v4.2.0-mock' : 'Unknown',
      online: false
    }

    if (existingIndex >= 0) {
      // Update existing device
      this.state.discoveredDevices[existingIndex] = {
        ...this.state.discoveredDevices[existingIndex],
        ...deviceToAdd,
        name: this.state.discoveredDevices[existingIndex].name || deviceToAdd.name
      }
    } else {
      // Add new device
      this.state.discoveredDevices.push(deviceToAdd)
    }

    this.updateExtensionMenu()
    this.emit('render')
  }

  /**
   * Select a device from a device card
   */
  selectDeviceFromCard(device) {
    // If clicking on edit/delete buttons, don't select
    if (this.state.editingDeviceName === device.serial) {
      return
    }

    this.state.selectedDeviceSerial = device.serial
    this.state.selectedNodeId = device.nodeId
    this.state.activeDeviceTab = 'overview'
    
    // Connect to device if not already connected
    if (!this.state.oiDeviceConnected || this.state.currentDeviceSerial !== device.serial) {
      this.connectToDevice(device.nodeId, device.serial)
    }
    
    this.emit('render')
  }

  /**
   * Start editing a device name
   */
  startEditingDeviceName(device) {
    this.state.editingDeviceName = device.serial
    this.state.editingDeviceNameValue = device.name || ''
    this.emit('render')
  }

  /**
   * Save device name after editing
   */
  saveDeviceName(device) {
    const newName = this.state.editingDeviceNameValue || null
    
    if (!this.state.discoveredDevices) {
      this.state.discoveredDevices = []
    }

    const deviceIndex = this.state.discoveredDevices.findIndex(d => d.serial === device.serial)
    if (deviceIndex >= 0) {
      this.state.discoveredDevices[deviceIndex] = {
        ...this.state.discoveredDevices[deviceIndex],
        name: newName
      }
    }

    this.state.editingDeviceName = null
    this.updateExtensionMenu()
    this.emit('render')
  }

  /**
   * Delete a device from the saved devices list
   */
  deleteDevice(device) {
    if (!confirm(`Delete device "${device.name || device.serial}"?`)) {
      return
    }

    if (!this.state.discoveredDevices) {
      this.state.discoveredDevices = []
    }

    // Remove device from list
    this.state.discoveredDevices = this.state.discoveredDevices.filter(d => d.serial !== device.serial)

    // If this was the connected device, disconnect
    if (this.state.currentDeviceSerial === device.serial) {
      this.disconnectDevice()
    }

    // Clear selection if this was selected
    if (this.state.selectedDeviceSerial === device.serial) {
      this.state.selectedDeviceSerial = null
    }

    this.updateExtensionMenu()
    this.emit('render')
  }

  // === Firmware Upgrade Methods ===

  selectFirmwareFile(event) {
    const file = event.target.files[0]
    if (file) {
      this.state.firmwareUpgrade.selectedFile = file
      this.state.firmwareUpgrade.error = null
      this.emit('render')
    }
  }

  async startFirmwareUpgrade() {
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
      const fileData = await this.readFileAsBytes(fw.selectedFile)

      fw.status = 'Uploading firmware to device...'
      this.emit('render')

      // Upload firmware data to device (in chunks if needed)
      await this.uploadFirmwareData(fileData)

      fw.status = 'Starting upgrade process...'
      this.emit('render')

      // Start the upgrade
      const args = {
        recovery_mode: fw.recoveryMode,
        serial_number: fw.recoveryMode && fw.serialNumber ? fw.serialNumber : null,
        node_id: !fw.recoveryMode ? this.state.selectedNodeId : null
      }

      const argsStr = JSON.stringify(args)
      const result = await this.device.execute(`from lib.OI_helpers import startFirmwareUpgrade; startFirmwareUpgrade(${argsStr})`)
      const parsed = this.device.parseJSON(result)

      if (parsed.error) {
        throw new Error(parsed.error)
      }

      // Poll for progress
      await this.pollFirmwareProgress()

    } catch (error) {
      console.error('[OI Firmware] Upgrade failed:', error)
      fw.error = error.message || 'Upgrade failed'
      fw.inProgress = false
      this.emit('render')
    }
  }

  async readFileAsBytes(file) {
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

  async uploadFirmwareData(bytes) {
    const fw = this.state.firmwareUpgrade
    const chunkSize = 4096 // Upload in 4KB chunks
    const totalChunks = Math.ceil(bytes.length / chunkSize)

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, bytes.length)
      const chunk = Array.from(bytes.slice(start, end))

      const args = JSON.stringify({ chunk, offset: start })
      await this.device.execute(`from lib.OI_helpers import uploadFirmwareChunk; uploadFirmwareChunk(${args})`)

      fw.progress = (i / totalChunks) * 30 // First 30% is upload
      fw.status = `Uploading firmware... ${fw.progress.toFixed(0)}%`
      this.emit('render')
    }
  }

  async pollFirmwareProgress() {
    const fw = this.state.firmwareUpgrade
    const maxPolls = 600 // 10 minutes max (600 * 1 second)
    let polls = 0

    while (polls < maxPolls) {
      await new Promise(resolve => setTimeout(resolve, 1000))

      try {
        const result = await this.device.execute('from lib.OI_helpers import getFirmwareUpgradeStatus; getFirmwareUpgradeStatus()')
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

  async loadDeviceInfo() {
    this.state.isLoadingDeviceInfo = true
    this.emit('render')

    try {
      const infoResult = await this.device.execute('from lib.OI_helpers import getDeviceInfo; getDeviceInfo()')
      const info = this.device.parseJSON(infoResult)
      this.state.oiDeviceInfo = info

      const errorResult = await this.device.execute('from lib.OI_helpers import getErrorLog; getErrorLog()')
      const errors = this.device.parseJSON(errorResult)
      const errorList = errors
      // Ensure errorLog is always an array
      this.state.oiErrorLog = Array.isArray(errorList) ? errorList : []
    } catch (error) {
      console.error('[OI App] Failed to load device info:', error)
      this.state.oiDeviceInfo = null
      this.state.oiErrorLog = []
    } finally {
      this.state.isLoadingDeviceInfo = false
      this.emit('render')
    }
  }
}
