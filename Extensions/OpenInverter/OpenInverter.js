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
//   "devices": true,
//   "styles": ":root { --oi-blue: #1e88e5; --oi-blue-dark: #1565c0; --oi-blue-light: #e3f2fd; --oi-orange: #ff8c00; --oi-orange-light: #ffa726; --oi-beige: #fef8f0; --oi-yellow: #ffd54f; --oi-status-success: #4caf50; --oi-status-warning: #ff9800; --oi-status-error: #f44336; --oi-status-info: #1e88e5; --text-muted: #999; } .tabs-container { display: flex; flex-direction: column; height: 100%; } .tabs-header { border-bottom: 2px solid var(--border-color); background: var(--bg-secondary); } .tabs-nav { display: flex; gap: 0; overflow-x: auto; } .tab-button { background: transparent; border: none; border-radius: 0; padding: 16px 24px; font-size: 14px; font-weight: 600; color: var(--text-secondary); cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; white-space: nowrap; } .tab-button:hover:not(:disabled) { color: var(--oi-blue); background: var(--oi-blue-light); } .tab-button.active { border-bottom-color: var(--oi-blue); } .tab-button:disabled { opacity: 0.5; cursor: not-allowed; } .tabs-content { flex: 1; overflow-y: auto; } .system-panel { background: var(--bg-secondary); border-radius: 8px; overflow: hidden; margin-bottom: 24px; } .panel-header { background: var(--oi-blue); color: white; padding: 20px; border-bottom: 1px solid var(--border-color); } .panel-message { padding: 40px 20px; text-align: center; color: var(--text-secondary); } .btn-primary { background: var(--oi-blue); color: white; border: 2px solid var(--oi-blue); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .btn-primary:hover:not(:disabled) { background: var(--oi-blue-dark); border-color: var(--oi-blue-dark); } .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; } .btn-secondary { background: var(--oi-beige); color: var(--text-primary); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .btn-secondary:hover:not(:disabled) { background: #f0e4d0; border-color: var(--oi-blue); color: var(--oi-blue); } .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; } .secondary-button { background: var(--oi-beige); color: var(--text-secondary); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .secondary-button:hover:not(:disabled) { background: #f0e4d0; border-color: var(--oi-blue); color: var(--oi-blue); } .secondary-button:disabled { opacity: 0.5; cursor: not-allowed; } .primary-button { background: var(--oi-blue); color: white; border: 2px solid var(--oi-blue); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .primary-button:hover:not(:disabled) { background: var(--oi-blue-dark); border-color: var(--oi-blue-dark); } .primary-button:disabled { opacity: 0.5; cursor: not-allowed; } .refresh-button { background: var(--oi-beige); color: var(--text-primary); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; } .refresh-button:hover:not(:disabled) { background: #f0e4d0; border-color: var(--oi-blue); color: var(--oi-blue); } .spot-values-categories { display: flex; flex-direction: column; gap: 2rem; } .spot-values-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; } .oi-category-section { margin-bottom: 2rem; } .oi-category-title { font-size: 1.1rem; font-weight: 600; color: var(--oi-blue); margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--oi-blue); } .oi-spotvalues-container { padding: 20px; } .oi-spotvalue-card { background: var(--bg-secondary); border: 2px solid transparent; border-radius: 6px; padding: 0.75rem; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 0.75rem; } .oi-spotvalue-card:hover { border-color: var(--oi-blue); background: var(--oi-blue-light); } .oi-spotvalue-name { font-weight: 500; color: var(--text-primary); font-size: 0.9rem; margin-bottom: 0.25rem; } .oi-spotvalue-value { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); font-family: 'Monaco', 'Courier New', monospace; } #device-parameters { padding: 20px; } .parameters-grid { display: flex; flex-direction: column; gap: 1.5rem; } .parameter-category { border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; background: var(--bg-secondary); transition: padding 0.2s; } .parameter-category.collapsed { padding: 1.5rem; } .parameter-category.collapsed .category-title { margin-bottom: 0; padding-bottom: 0; border-bottom: none; } .category-title { font-size: 1.1rem; font-weight: 600; color: var(--oi-blue); margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--oi-beige); display: flex; align-items: center; gap: 0.75rem; user-select: none; transition: all 0.2s; cursor: pointer; } .category-title:hover { color: var(--oi-blue-dark); } .collapse-icon { display: inline-flex; align-items: center; justify-content: center; width: 20px; font-size: 0.8rem; color: var(--oi-blue); transition: transform 0.2s; } .param-count { margin-left: auto; font-size: 0.85rem; font-weight: normal; color: var(--text-muted); } .parameters-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; } .parameter-item { display: flex; flex-direction: column; gap: 0.5rem; } .parameter-header { display: flex; justify-content: space-between; align-items: baseline; } .parameter-label { font-weight: 500; color: var(--text-primary); font-size: 0.9rem; margin-bottom: 0; } .parameter-unit { color: var(--text-muted); font-weight: normal; font-size: 0.85rem; } .parameter-input-group { display: flex; flex-direction: column; gap: 0.25rem; } .parameter-input-group input[type=\"number\"], .parameter-input-group select { padding: 0.5rem 0.75rem; font-size: 0.95rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); width: 100%; } .parameter-input-group input[type=\"number\"]:focus, .parameter-input-group select:focus { outline: none; border-color: var(--oi-blue); } .parameter-hint { display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; line-height: 1.3; } .form-group { margin-bottom: 1.5rem; } .form-group label { display: block; font-weight: 500; color: var(--text-primary); font-size: 0.9rem; margin-bottom: 0.5rem; } .form-group input[type=\"text\"] { width: 100%; padding: 0.5rem 0.75rem; font-size: 0.95rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); } .form-group input[type=\"text\"]:focus { outline: none; border-color: var(--oi-blue); } .form-group .hint { display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; } .button-group { display: flex; gap: 0.75rem; flex-wrap: wrap; } .section-header { font-size: 1.5rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1.5rem; cursor: pointer; } .can-mappings-container { display: flex; flex-direction: column; gap: 2rem; } .mapping-section { margin-bottom: 1.5rem; } .mapping-section h3 { margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-primary); } .no-mappings { color: var(--text-secondary); font-style: italic; padding: 1rem; background: var(--bg-secondary); border-radius: 4px; } .mappings-table { width: 100%; border-collapse: collapse; background: var(--bg-primary); border-radius: 8px; overflow: hidden; } .mappings-table thead { background: var(--bg-secondary); } .mappings-table th { padding: 0.75rem; text-align: left; font-weight: 600; color: var(--text-primary); border-bottom: 2px solid var(--border-color); } .mappings-table td { padding: 0.75rem; border-bottom: 1px solid var(--border-color); color: var(--text-primary); } .mappings-table tbody tr:last-child td { border-bottom: none; } .mappings-table tbody tr:hover { background: var(--bg-secondary); } .btn-remove { background: var(--oi-status-error); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; } .btn-remove:hover { background: #c82333; } .add-mapping-section { margin-top: 2rem; } .btn-add { background: var(--oi-blue); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; transition: background 0.2s; } .btn-add:hover { background: var(--oi-blue-dark); } .add-mapping-form { background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; } .add-mapping-form h3 { margin-top: 0; margin-bottom: 1.5rem; color: var(--text-primary); } .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; } .form-row label { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-primary); font-weight: 500; } .form-row input, .form-row select { padding: 0.6rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary); font-size: 0.95rem; } .form-row input:focus, .form-row select:focus { outline: none; border-color: var(--oi-blue); } .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end; } .btn-cancel { background: #6c757d; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.95rem; transition: background 0.2s; } .btn-cancel:hover { background: #5a6268; } .btn-save { background: var(--oi-status-success); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: background 0.2s; } .btn-save:hover:not(:disabled) { background: #218838; } .btn-save:disabled { background: #ccc; cursor: not-allowed; opacity: 0.6; } .error-message { background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; border: 1px solid #f5c6cb; } .oi-compact-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color); } .oi-compact-header h2 { margin: 0; font-size: 24px; color: white; } .oi-button-row { display: flex; gap: 0.75rem; } .can-io-control { background: var(--bg-secondary, #f8f9fa); border-radius: 8px; padding: 20px; margin-bottom: 2rem; } .can-io-control h3 { margin: 0 0 20px 0; color: var(--text-primary); font-size: 18px; border-bottom: 2px solid var(--oi-blue); padding-bottom: 8px; } .can-io-section { margin-bottom: 20px; } .can-io-section h4 { margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px; font-weight: 600; } .can-io-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; } .can-io-row label { min-width: 140px; color: var(--text-secondary); font-size: 14px; } .can-io-row input[type=\"text\"], .can-io-row input[type=\"number\"] { padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; width: 100px; } .can-io-row input[type=\"range\"] { flex: 1; min-width: 200px; } .can-io-row .value { min-width: 50px; font-weight: 600; color: var(--oi-blue); } .can-io-row .hint { color: var(--text-muted); font-size: 12px; font-style: italic; } .can-io-flags { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; } .can-io-checkbox { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; transition: all 0.2s; } .can-io-checkbox:hover:not(:has(input:disabled)) { border-color: var(--oi-blue); background: var(--oi-blue-light); } .can-io-checkbox input[type=\"checkbox\"] { width: 18px; height: 18px; cursor: pointer; } .can-io-checkbox input[type=\"checkbox\"]:disabled { cursor: not-allowed; } .can-io-checkbox span { font-size: 14px; color: var(--text-primary); user-select: none; } .can-io-actions { display: flex; align-items: center; gap: 16px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color); } .can-io-actions button { padding: 10px 24px; font-size: 14px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; } .can-io-actions button:disabled { opacity: 0.5; cursor: not-allowed; } .can-io-actions .start-btn { background: #28a745; color: white; } .can-io-actions .start-btn:hover:not(:disabled) { background: #218838; } .can-io-actions .stop-btn { background: #dc3545; color: white; } .can-io-actions .stop-btn:hover:not(:disabled) { background: #c82333; } .can-io-status-indicator { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #d4edda; color: #155724; border-radius: 4px; font-size: 14px; font-weight: 500; } .can-io-status-indicator .pulse { width: 10px; height: 10px; background: #28a745; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite; } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } } #can-message-sender { padding: 1.5rem; } .message-section { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color); } .message-section:last-child { border-bottom: none; } .message-section h3 { margin-bottom: 0.5rem; color: var(--text-primary); } .section-description { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; } .message-form { background: var(--bg-primary); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; } .form-row { margin-bottom: 1rem; } .form-row:last-child { margin-bottom: 0; } .form-row label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary); } .form-row input { width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; font-family: 'Courier New', monospace; font-size: 0.95rem; } .input-hex { max-width: 200px; } .input-data { max-width: 400px; letter-spacing: 0.1em; } .input-hint { display: block; font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; font-family: system-ui, -apple-system, sans-serif; font-style: italic; } .form-actions { margin-top: 1rem; display: flex; gap: 0.5rem; } .btn-send, .btn-start, .btn-stop, .btn-add, .btn-save, .btn-cancel, .btn-remove { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s ease; } .btn-send { background-color: var(--oi-blue); color: white; } .btn-send:hover:not(:disabled) { background-color: var(--oi-blue-dark); } .btn-send:disabled { background-color: #ccc; cursor: not-allowed; } .btn-start { background-color: #28a745; color: white; } .btn-start:hover:not(:disabled) { background-color: #218838; } .btn-stop { background-color: #dc3545; color: white; } .btn-stop:hover:not(:disabled) { background-color: #c82333; } .btn-add { background-color: var(--oi-blue); color: white; margin-top: 1rem; } .btn-add:hover { background-color: var(--oi-blue-dark); } .btn-save { background-color: var(--oi-status-success); color: white; } .btn-save:hover { background-color: #218838; } .btn-cancel { background-color: #6c757d; color: white; } .btn-cancel:hover { background-color: #5a6268; } .btn-remove { background-color: #dc3545; color: white; } .btn-remove:hover:not(:disabled) { background-color: #c82333; } .btn-remove:disabled { background-color: #ccc; cursor: not-allowed; opacity: 0.6; } .no-messages { color: var(--text-muted); font-style: italic; padding: 1rem; text-align: center; } .messages-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; background: white; } .messages-table thead { background-color: var(--bg-secondary); } .messages-table th, .messages-table td { padding: 0.75rem; text-align: left; border: 1px solid var(--border-color); } .messages-table th { font-weight: 600; color: var(--text-primary); } .data-cell { font-family: 'Courier New', monospace; font-size: 0.9rem; } .status-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 500; } .status-active { background-color: #d4edda; color: #155724; } .status-inactive { background-color: #f8d7da; color: #721c24; } .action-buttons { display: flex; gap: 0.5rem; } .add-message-section { margin-top: 1rem; } .add-message-form { background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; } .add-message-form h4 { margin-bottom: 1rem; color: var(--text-primary); } .device-card { background: white; border: 2px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; gap: 1rem; position: relative; } .device-card:hover { border-color: var(--oi-blue); box-shadow: 0 4px 12px rgba(30, 136, 229, 0.2); transform: translateY(-2px); } .btn-danger { background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; } .btn-danger:hover { background: #c82333; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3); }"
// }
// === END_EXTENSION_CONFIG ===

// === BUILT FROM src/ ===
// This file is auto-generated from src/ modules
// DO NOT EDIT THIS FILE DIRECTLY - Edit files in src/ instead
// Built: 2026-01-09T17:34:52.295Z

// ============================================================================
// utils/formatting.js
// ============================================================================

/**
 * Formatting Utilities
 * 
 * Helper functions for parsing and formatting hex values, data bytes, and other data types.
 */

/**
 * Parse hex string to integer
 * Handles 0x prefix and whitespace
 * 
 * @param {string} hex - Hex string (e.g., "0x3F" or "3F")
 * @returns {number} - Parsed integer value
 */
function parseHex(hex) {
  const cleaned = hex.trim().replace(/^0x/i, '')
  return parseInt(cleaned, 16)
}

/**
 * Parse data bytes string to array
 * Converts space-separated hex bytes to array of integers
 * Automatically pads/truncates to 8 bytes for CAN messages
 * 
 * @param {string} data - Data bytes string (e.g., "00 11 22 33")
 * @returns {number[]} - Array of 8 bytes (0-255)
 */
function parseDataBytes(data) {
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
 * Validate CAN ID (11-bit standard)
 * 
 * @param {string} id - Hex string CAN ID
 * @returns {boolean} - True if valid (0x000 to 0x7FF)
 */
function validateCanId(id) {
  const parsed = parseHex(id)
  return !isNaN(parsed) && parsed >= 0 && parsed <= 0x7FF
}

/**
 * Validate data bytes
 * 
 * @param {string} data - Data bytes string
 * @returns {boolean} - True if all bytes are 0-255
 */
function validateDataBytes(data) {
  const bytes = parseDataBytes(data)
  return bytes.every(b => b >= 0 && b <= 0xFF)
}

/**
 * Format number to hex string with padding
 * 
 * @param {number} value - Integer value
 * @param {number} [padBytes=1] - Number of bytes to pad (2 hex chars per byte)
 * @returns {string} - Padded hex string (uppercase)
 */
function toHex(value, padBytes = 1) {
  const hex = value.toString(16).toUpperCase()
  return hex.padStart(padBytes * 2, '0')
}

/**
 * Format byte array to hex string
 * 
 * @param {number[]} bytes - Array of bytes
 * @param {string} [separator=' '] - Separator between bytes
 * @returns {string} - Formatted hex string (e.g., "00 11 22 33")
 */
function formatBytes(bytes, separator = ' ') {
  return bytes.map(b => toHex(b, 1)).join(separator)
}

/**
 * Format value with unit
 * 
 * @param {number} value - Numeric value
 * @param {string} [unit=''] - Unit string (e.g., "V", "A", "rpm")
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} - Formatted string with unit
 */
function formatValue(value, unit = '', decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '-'
  }
  
  const formatted = typeof value === 'number' ? value.toFixed(decimals) : value
  return unit ? `${formatted} ${unit}` : formatted
}


// ============================================================================
// utils/oiHelpers.js
// ============================================================================

/**
 * OpenInverter Helpers
 * 
 * Core utility functions for OpenInverter extension:
 * - Parameter descriptions (DOCSTRINGS from original OpenInverter web interface)
 * - Mock data for testing (when nodeId > 127)
 * - Device communication wrappers (parameters, spot values, CAN mappings)
 * - Description enrichment for parameters loaded from device
 * 
 * These wrap device-side Python functions from lib.OI_helpers and lib.canopen_sdo.
 */

/**
 * Parameter descriptions from OpenInverter reference implementation
 * Source: esp32-web-interface/data/docstrings.js (original OpenInverter web interface)
 * This is the canonical source of truth for parameter descriptions.
 */
const DOCSTRINGS = {
  // Spot values
  version: "Firmware version.",
  hwver: "Hardware version",
  opmode: "Operating mode. 0=Off, 1=Run, 2=Manual_run, 3=Boost, 4=Buck, 5=Sine, 6=2 Phase sine",
  lasterr: "Last error message",
  udc: "Voltage on the DC side of the inverter. a.k.a, battery voltage.",
  idc: "Current passing through the DC side of the inverter (calculated).",
  il1: "Current passing through the first current sensor on the AC side.",
  il2: "Current passing through the second current sensor on the AC side.",
  fstat: "Stator frequency",
  speed: "The speed (rpm) of the motor.",
  cruisespeed: "",
  turns: "Number of turns the motor has completed since startup.",
  amp: "Sine amplitude, 37813=max",
  angle: "Motor rotor angle, 0-360°. When using the SINE software, the slip is added to the rotor position.",
  pot: "Pot value, 4095=max",
  pot2: "Regen Pot value, 4095=max",
  potnom: "Scaled pot value, 0 accel",
  dir: "Rotation direction. -1=REV, 0=Neutral, 1=FWD",
  tmphs: "Inverter heatsink temperature",
  tmpm: "Motor temperature",
  uaux: "Auxiliary voltage (i.e. 12V system). Measured on pin 11 (mprot)",
  pwmio: "Raw state of PWM outputs at power up",
  canio: "Digital IO bits received via CAN",
  din_cruise: "Cruise Control. This pin activates the cruise control with the current speed. Pressing again updates the speed set point.",
  din_start: "State of digital input \"start\". This pin starts inverter operation",
  din_brake: "State of digital input \"brake\". This pin sets maximum regen torque (brknompedal). Cruise control is disabled.",
  din_mprot: "State of digital input \"motor protection switch\". Shuts down the inverter when = 0",
  din_forward: "Direction forward.",
  din_reverse: "Direction backward.",
  din_emcystop: "State of digital input \"emergency stop\". Shuts down the inverter when = 0",
  din_ocur: "Over current detected.",
  din_bms: "BMS over voltage/under voltage.",
  cpuload: "CPU load for everything except communication",
  // Parameters
  curkp: "Current controller proportional gain",
  curki: "Current controller integral gain",
  curkifrqgain: "Current controllers integral gain frequency coefficient",
  fwkp: "Cross comparison field weakening controller gain",
  dmargin: "Margin for residual torque producing current (so field weakening current doesn't use up the entire amplitude)",
  syncadv: "Shifts \"syncofs\" downwards/upwards with frequency",
  boost: "0 Hz Boost in digit. 1000 digit ~ 2.5%",
  fweak: "Frequency where V/Hz reaches its peak",
  fconst: "Frequency where slip frequency is derated to form a constant power region. Only has an effect when < fweak",
  udcnom: "Nominal voltage for fweak and boost. fweak and boost are scaled to the actual dc voltage. 0=don't scale",
  fslipmin: "Slip frequency at minimum throttle",
  fslipmax: "Slip frequency at maximum throttle",
  fslipconstmax: "Slip frequency at maximum throttle and fconst",
  fmin: "Below this frequency no voltage is generated",
  polepairs: "Pole pairs of motor (e.g. 4-pole motor: 2 pole pairs)",
  respolepairs: "Pole pairs of resolver (normally same as polepairs of motor, but sometimes 1)",
  encflt: "Filter constant between pulse encoder and speed calculation. Makes up for slightly uneven pulse distribution",
  encmode: "0=single channel encoder, 1=quadrature encoder, 2=quadrature /w index pulse, 3=SPI (deprecated), 4=Resolver, 5=sin/cos chip",
  fmax: "At this frequency rev limiting kicks in",
  numimp: "Pulse encoder pulses per turn",
  dirchrpm: "Motor speed at which direction change is allowed",
  dirmode: "0=button (momentary pulse selects forward/reverse), 1=switch (forward or reverse signal must be constantly high)",
  syncofs: "Phase shift of sine wave after receiving index pulse",
  snsm: "Motor temperature sensor. 12=KTY83, 13=KTY84, 14=Leaf, 15=KTY81",
  pwmfrq: "PWM frequency. 0=17.6kHz, 1=8.8kHz, 2=4.4kHz, 3=2.2kHz. Needs PWM restart",
  pwmpol: "PWM polarity. 0=active high, 1=active low. DO NOT PLAY WITH THIS! Needs PWM restart",
  deadtime: "Deadtime between highside and lowside pulse. 28=800ns, 56=1.5µs. Not always linear, consult STM32 manual. Needs PWM restart",
  ocurlim: "Hardware over current limit. RMS-current times sqrt(2) + some slack. Set negative if il1gain and il2gain are negative.",
  minpulse: "Narrowest or widest pulse, all other mapped to full off or full on, respectively",
  il1gain: "Digits per A of current sensor L1",
  il2gain: "Digits per A of current sensor L2",
  udcgain: "Digits per V of DC link",
  udcofs: "DC link 0V offset",
  udclim: "High voltage at which the PWM is shut down",
  snshs: "Heatsink temperature sensor. 0=JCurve, 1=Semikron, 2=MBB600, 3=KTY81, 4=PT1000, 5=NTCK45+2k2, 6=Leaf",
  pinswap: "Swap pins (only \"FOC\" software). Multiple bits can be set. 1=Swap Current Inputs, 2=Swap Resolver sin/cos, 4=Swap PWM output 1/3\n001 = 1 Swap Currents only\n010 = 2 Swap Resolver only\n011 = 3 Swap Resolver and Currents\n100 = 4 Swap PWM only\n101 = 5 Swap PWM and Currents\n110 = 6 Swap PWM and Resolve\n111 = 7 Swap PWM and Resolver and Currents",
  bmslimhigh: "Positive throttle limit on BMS under voltage",
  bmslimlow: "Regen limit on BMS over voltage",
  udcmin: "Minimum battery voltage",
  udcmax: "Maximum battery voltage",
  iacmax: "Maximum peak AC current",
  idcmax: "Maximum DC input current",
  idcmin: "Maximum DC output current (regen)",
  throtmax: "Throttle limit",
  throtmin: "Throttle regen limit",
  ifltrise: "Controls how quickly slip and amplitude recover. The greater the value, the slower",
  ifltfall: "Controls how quickly slip and amplitude are reduced on over current. The greater the value, the slower",
  chargemode: "0=Off, 3=Boost, 4=Buck",
  chargecur: "Charge current setpoint. Boost mode: charger INPUT current. Buck mode: charger output current",
  chargekp: "Charge controller gain. Lower if you have oscillation, raise if current set point is not met",
  chargeflt: "Charge current filtering. Raise if you have oscillations",
  chargemax: "Charge mode duty cycle limit. Especially in boost mode this makes sure you don't overvolt you IGBTs if there is no battery connected.",
  potmin: "Value of \"pot\" when pot isn't pressed at all",
  potmax: "Value of \"pot\" when pot is pushed all the way in",
  pot2min: "Value of \"pot2\" when regen pot is in 0 position",
  pot2max: "Value of \"pot2\" when regen pot is in full on position",
  potmode: "0=Pot 1 is throttle and pot 2 is regen strength preset. 1=Pot 2 is proportional to pot 1 (redundancy) 2=Throttle controlled via CAN",
  throtramp: "Max positive throttle slew rate",
  throtramprpm: "No throttle ramping above this speed",
  ampmin: "Minimum relative sine amplitude (only \"sine\" software)",
  slipstart: "% positive throttle travel at which slip is increased (only \"sine\" software)",
  throtcur: "Motor current per % of throttle travel (only \"FOC\" software)",
  brknompedal: "Foot on brake pedal regen torque",
  brkpedalramp: "Ramp speed when entering regen. E.g. when you set brkmax to 20% and brknompedal to -60% and brkpedalramp to 1, it will take 400ms to arrive at brake force of -60%",
  brknom: "Range of throttle pedal travel allocated to regen",
  brkmax: "Foot-off throttle regen torque",
  brkrampstr: "Below this frequency the regen torque is reduced linearly with the frequency",
  brkout: "Activate brake light output at this amount of braking force",
  idlespeed: "Motor idle speed. Set to -100 to disable idle function. When idle speed controller is enabled, brake pedal must be pressed on start.",
  idlethrotlim: "Throttle limit of idle speed controller",
  idlemode: "Motor idle speed mode. 0=always run idle speed controller, 1=only run it when brake pedal is released, 2=like 1 but only when cruise switch is on",
  speedkp: "Speed controller gain (Cruise and idle speed). Decrease if speed oscillates. Increase for faster load regulation",
  speedflt: "Filter before cruise controller",
  cruisemode: "0=button (set when button pressed, reset with brake pedal), 1=switch (set when switched on, reset when switched off or brake pedal)",
  cruisethrotlim: "Throttle limit when cruise control is active",
  hillholdkp: "Hill hold controller proportional gain",
  udcsw: "Voltage at which the DC contactor is allowed to close",
  udcswbuck: "Voltage at which the DC contactor is allowed to close in buck charge mode",
  tripmode: "What to do with relays at a shutdown event. 0=All off, 1=Keep DC switch closed, 2=close precharge relay",
  pwmfunc: "Quantity that controls the PWM output. 0=tmpm, 1=tmphs, 2=speed",
  pwmgain: "Gain of PWM output",
  pwmofs: "Offset of PWM output, 4096=full on",
  canspeed: "Baud rate of CAN interface 0=250k, 1=500k, 2=800k, 3=1M",
  canperiod: "0=send configured CAN messages every 100ms, 1=every 10ms",
  fslipspnt: "Slip setpoint in mode 2. Written by software in mode 1",
  ampnom: "Nominal amplitude in mode 2. Written by software in mode 1"
}

/**
 * Get description for a parameter/spot value name
 * @param {string} name - Parameter or spot value name
 * @returns {string} Description or empty string if not found
 */
function getDescription(name) {
  return DOCSTRINGS[name] || ''
}

/**
 * Enrich parameters/spot values with descriptions from DOCSTRINGS
 * Adds description field if missing and available in DOCSTRINGS
 * @param {Object} params - Parameters or spot values object
 * @returns {Object} Enriched parameters object
 */
function enrichWithDescriptions(params) {
  if (!params || typeof params !== 'object') {
    return params
  }
  
  const enriched = {}
  for (const [name, param] of Object.entries(params)) {
    enriched[name] = { ...param }
    // Add description if missing and available in DOCSTRINGS
    if (!enriched[name].description) {
      const desc = getDescription(name)
      if (desc) {
        enriched[name].description = desc
      }
    }
  }
  return enriched
}

/**
 * Mock data for OpenInverter Extension
 * Used when nodeId > 127 (mock device mode)
 */
const MOCK_PARAMETERS = {
  // Spot values (isparam=False)
  voltage: {
    value: 350.5,
    unit: 'V',
    isparam: false,
    category: 'Electrical',
    id: 0x1001,
    canId: 500,
    canPosition: 0,
    canBits: 16,
    canGain: 0.1,
    isTx: true
  },
  current: {
    value: 45.2,
    unit: 'A',
    isparam: false,
    category: 'Electrical',
    id: 0x1002
  },
  power: {
    value: 15850,
    unit: 'W',
    isparam: false,
    category: 'Electrical',
    id: 0x1003
  },
  rpm: {
    value: 3000,
    unit: 'rpm',
    isparam: false,
    category: 'Motor',
    id: 0x1004
  },
  temp: {
    value: 65,
    unit: '°C',
    isparam: false,
    category: 'Thermal',
    id: 0x1005,
    canId: 500,
    canPosition: 16,
    canBits: 8,
    canGain: 1.0,
    isTx: true
  },
  
  // Parameters (isparam=True)
  // Automation category
  cruisemode: {
    value: 0,
    unit: '',
    isparam: true,
    category: 'Automation',
    id: 0x2001,
    enums: { 0: 'Button', 1: 'Switch' },
    default: 0,
    description: getDescription('cruisemode')
  },
  cruisethrotlim: {
    value: 50,
    unit: '%',
    isparam: true,
    category: 'Automation',
    id: 0x2002,
    minimum: 0,
    maximum: 100,
    default: 50,
    description: getDescription('cruisethrotlim') || 'Throttle limit when cruise control is active'
  },
  hillholdkp: {
    value: -0.25,
    unit: '',
    isparam: true,
    category: 'Automation',
    id: 0x2003,
    minimum: -100,
    maximum: 0,
    default: -0.25,
    description: getDescription('hillholdkp') || 'Hill hold controller proportional gain'
  },
  idlemode: {
    value: 0,
    unit: '',
    isparam: true,
    category: 'Automation',
    id: 0x2004,
    enums: { 0: 'Always', 1: 'Brake released', 2: 'With cruise' },
    default: 0,
    description: getDescription('idlemode')
  },
  idlespeed: {
    value: -100,
    unit: 'rpm',
    isparam: true,
    category: 'Automation',
    id: 0x2005,
    minimum: -100,
    maximum: 10000,
    default: -100,
    description: getDescription('idlespeed')
  },
  idlethrotlim: {
    value: 50,
    unit: '%',
    isparam: true,
    category: 'Automation',
    id: 0x2006,
    minimum: 0,
    maximum: 100,
    default: 50,
    description: getDescription('idlethrotlim')
  },
  speedflt: {
    value: 5,
    unit: '',
    isparam: true,
    category: 'Automation',
    id: 0x2007,
    minimum: 0,
    maximum: 16,
    default: 5,
    description: getDescription('speedflt')
  },
  speedkp: {
    value: 0.25,
    unit: '',
    isparam: true,
    category: 'Automation',
    id: 0x2008,
    minimum: 0,
    maximum: 100,
    default: 0.25,
    description: getDescription('speedkp')
  },
  // Aux PWM category
  pwmfunc: {
    value: 0,
    unit: '',
    isparam: true,
    category: 'Aux PWM',
    id: 0x2009,
    enums: { 0: 'tmpm', 1: 'tmphs', 2: 'speed' },
    default: 0,
    description: getDescription('pwmfunc')
  },
  pwmgain: {
    value: 100,
    unit: '',
    isparam: true,
    category: 'Aux PWM',
    id: 0x200A,
    minimum: -100000,
    maximum: 100000,
    default: 100,
    description: getDescription('pwmgain')
  },
  pwmofs: {
    value: 0,
    unit: 'dig',
    isparam: true,
    category: 'Aux PWM',
    id: 0x200B,
    minimum: -65535,
    maximum: 65535,
    default: 0,
    description: getDescription('pwmofs')
  },
  // Legacy parameters (kept for compatibility)
  fslipspnt: {
    value: 2.0,
    unit: 'Hz',
    isparam: true,
    category: 'Motor',
    id: 0x2010,
    minimum: 0,
    maximum: 10,
    default: 1.5,
    description: getDescription('fslipspnt')
  },
  opmode: {
    value: 1,
    unit: '',
    isparam: true,
    category: 'Control',
    id: 0x2011,
    enums: { 0: 'Off', 1: 'Manual', 2: 'Auto' },
    default: 0,
    description: getDescription('opmode')
  },
  kp: {
    value: 100,
    unit: '',
    isparam: true,
    category: 'Control',
    id: 0x2012,
    minimum: 0,
    maximum: 1000,
    default: 150,
    description: 'Current controller proportional gain'
  },
  ki: {
    value: 50,
    unit: '',
    isparam: true,
    category: 'Control',
    id: 0x2013,
    minimum: 0,
    maximum: 500,
    default: 80,
    description: 'Current controller integral gain'
  }
}

/**
 * Get mock parameters (only isparam=true)
 * @returns {Object} Parameters object
 */
function getMockParameters() {
  const params = {}
  Object.entries(MOCK_PARAMETERS).forEach(([key, param]) => {
    if (param.isparam) {
      params[key] = { ...param }
    }
  })
  return params
}

/**
 * Get mock spot values (only isparam=false)
 * @returns {Object} Spot values object
 */
function getMockSpotValues() {
  const spots = {}
  Object.entries(MOCK_PARAMETERS).forEach(([key, spot]) => {
    if (!spot.isparam) {
      // Add slight random variation for realism
      const baseValue = spot.value
      const variation = baseValue * 0.02 // ±2% variation
      const randomValue = baseValue + (Math.random() * 2 - 1) * variation
      
      spots[key] = {
        ...spot,
        value: Math.round(randomValue * 100) / 100
      }
    }
  })
  return spots
}

/**
 * Get all mock parameters with IDs (for CAN mapping dropdowns)
 * @returns {Object} All parameters with IDs
 */
function getMockAllParamsWithIds() {
  const allParams = {}
  Object.entries(MOCK_PARAMETERS).forEach(([key, param]) => {
    if (param.id !== undefined) {
      allParams[key] = { ...param }
    }
  })
  return allParams
}

/**
 * Check if current device is a mock device (nodeId > 127)
 * @this {OpenInverterExtension}
 * @returns {boolean}
 */
function isMockDevice() {
  return this.state.selectedNodeId > 127
}

/**
 * Get OpenInverter parameters
 * Calls device-side getOiParams() which returns all configurable parameters
 * Returns mock data for mock devices (nodeId > 127)
 * 
 * @this {OpenInverterExtension}
 * @returns {Promise<Object>} - Parameters object with categories and values
 */
async function getOiParams() {
  if (isMockDevice.call(this)) {
    return getMockParameters()
  }
  
  const result = await this.device.execute('from lib.OI_helpers import getOiParams; getOiParams()')
  const parsed = this.device.parseJSON(result)
  // Enrich with descriptions from DOCSTRINGS
  return enrichWithDescriptions(parsed)
}

/**
 * Set a parameter value
 * Mock devices update local state only (no Python call)
 * 
 * @this {OpenInverterExtension}
 * @param {Object|string} args - Either an object with {NAME: string, VALUE: number|string} or parameter name
 * @param {number|string} [value] - New value (if args is a string)
 * @returns {Promise<Object>} - Result with success status
 */
async function setParameter(args, value) {
  // Support both signatures: setParameter({NAME, VALUE}) or setParameter(name, value)
  const paramObj = typeof args === 'object' ? args : { NAME: args, VALUE: value }
  
  if (isMockDevice.call(this)) {
    // Mock devices - update local state
    const paramName = paramObj.NAME
    const paramValue = paramObj.VALUE
    
    if (this.state.oiParameters && this.state.oiParameters[paramName]) {
      this.state.oiParameters[paramName].value = paramValue
      this.emit('render')
    }
    
    return { success: true }
  }
  
  const argsStr = JSON.stringify(paramObj)
  const result = await this.device.execute(`from lib.OI_helpers import setParameter; setParameter(${argsStr})`)
  const parsed = this.device.parseJSON(result)
  return parsed
}

/**
 * Get spot values (real-time measurements)
 * Returns mock data for mock devices (nodeId > 127)
 * 
 * @this {OpenInverterExtension}
 * @returns {Promise<Object>} - Spot values object with categories and current values
 */
async function getSpotValues() {
  if (isMockDevice.call(this)) {
    return getMockSpotValues()
  }
  
  const result = await this.device.execute('from lib.OI_helpers import getSpotValues; getSpotValues()')
  const parsed = this.device.parseJSON(result)
  // Enrich with descriptions from DOCSTRINGS
  return enrichWithDescriptions(parsed)
}

/**
 * Get CAN mappings (TX and RX)
 * Returns empty mappings for mock devices (handled in refreshCanMappings)
 * 
 * @this {OpenInverterExtension}
 * @returns {Promise<Object>} - Object with {tx: [...], rx: [...]}
 */
async function getCanMappings() {
  if (isMockDevice.call(this)) {
    // Mock devices use local storage - return empty (refreshCanMappings handles it)
    return { tx: [], rx: [] }
  }
  
  const result = await this.device.execute('from lib.OI_helpers import getCanMap; getCanMap()')
  console.log('[OI] getCanMappings raw result:', result)
  const parsed = this.device.parseJSON(result)
  console.log('[OI] getCanMappings parsed:', parsed)
  return parsed
}

/**
 * Get all parameters with their IDs
 * Used for populating parameter selection dropdowns
 * Returns mock data for mock devices (nodeId > 127)
 * 
 * @this {OpenInverterExtension}
 * @returns {Promise<Object>} - Parameters with numeric IDs
 */
async function getAllParamsWithIds() {
  if (isMockDevice.call(this)) {
    return getMockAllParamsWithIds()
  }
  
  const result = await this.device.execute('from lib.OI_helpers import getAllParamsWithIds; getAllParamsWithIds()')
  const parsed = this.device.parseJSON(result)
  // Enrich with descriptions from DOCSTRINGS
  return enrichWithDescriptions(parsed)
}

/**
 * Add a CAN mapping
 * Mock devices handle this locally (no Python call needed)
 * 
 * @this {OpenInverterExtension}
 * @param {Object} mapping - Mapping configuration
 * @param {string} mapping.direction - "tx" or "rx"
 * @param {number} mapping.canId - CAN message ID
 * @param {number} mapping.offset - Byte offset in message
 * @param {number} mapping.length - Data length in bytes
 * @param {string} mapping.param - Parameter name
 * @returns {Promise<Object>} - Result with success status
 */
async function addCanMapping(mapping) {
  if (isMockDevice.call(this)) {
    // Mock devices handle this in CanMappingsTab.js - just return success
    return { success: true }
  }
  
  const argsStr = JSON.stringify(mapping)
  const result = await this.device.execute(`from lib.OI_helpers import addCanMapping; import json; addCanMapping(json.loads('${argsStr.replace(/'/g, "\\'")}'))`)
  const parsed = this.device.parseJSON(result)
  return parsed
}

/**
 * Remove a CAN mapping
 * Mock devices handle this locally (no Python call needed)
 * 
 * @this {OpenInverterExtension}
 * @param {string} direction - "tx" or "rx"
 * @param {number} msgIndex - Message index
 * @param {number} paramIndex - Parameter index within message
 * @returns {Promise<Object>} - Result with success status
 */
async function removeCanMapping(direction, msgIndex, paramIndex) {
  if (isMockDevice.call(this)) {
    // Mock devices handle this in CanMappingsTab.js - just return success
    return { success: true }
  }
  
  const args = { direction, msg_index: msgIndex, param_index: paramIndex }
  const argsStr = JSON.stringify(args)
  const result = await this.device.execute(`from lib.OI_helpers import removeCanMapping; import json; removeCanMapping(json.loads('${argsStr.replace(/'/g, "\\'")}'))`)
  const parsed = this.device.parseJSON(result)
  return parsed
}

/**
 * Scan CAN bus for OpenInverter devices
 * 
 * @this {OpenInverterExtension}
 * @param {Object} [options={}] - Scan options
 * @param {number} [options.startNode=1] - Start node ID
 * @param {number} [options.endNode=127] - End node ID
 * @param {number} [options.timeout=100] - Timeout per node (ms)
 * @returns {Promise<Array>} - Array of discovered devices
 */
async function scanCanBus(options = {}) {
  const scanArgs = JSON.stringify(options)
  const result = await this.device.execute(`from lib.OI_helpers import scanCanBus; scanCanBus('${scanArgs}')`)
  const parsed = this.device.parseJSON(result)
  return parsed
}

/**
 * Get CAN bus configuration (pins, bitrate)
 * Reads from /config/can.json (config file must be present)
 * 
 * @this {OpenInverterExtension}
 * @returns {Promise<Object>} - Config object with {txPin, rxPin, bitrate}
 */
async function getCanConfig() {
  const pythonCode = `
import json

with open('/config/can.json', 'r') as f:
    config = json.load(f)

print(json.dumps({
    'txPin': config['txPin'],
    'rxPin': config['rxPin'],
    'bitrate': config['bitrate']
}))
`
  const result = await this.device.execute(pythonCode)
  return this.device.parseJSON(result)
}


// ============================================================================
// utils/spotValueManager.js
// ============================================================================

/**
 * Spot Value Manager
 * 
 * Manages spot value polling, history tracking, and chart data preparation.
 */

/**
 * Start spot value polling
 * Sets up interval to fetch spot values periodically
 * 
 * @this {OpenInverterExtension}
 * @param {number} [interval=1000] - Polling interval in milliseconds
 * @returns {number} - Interval ID (for clearInterval)
 */
function startSpotValuePolling(interval = 1000) {
  // Stop existing polling if any
  if (this.state.spotValuePollingInterval) {
    clearInterval(this.state.spotValuePollingInterval)
  }
  
  // Start new polling
  const intervalId = setInterval(async () => {
    try {
      const spotValues = await getSpotValues.call(this)
      updateSpotValueHistory.call(this, spotValues)
      this.emit('render')
    } catch (error) {
      console.error('[Spot Values] Polling error:', error)
    }
  }, interval)
  
  this.state.spotValuePollingInterval = intervalId
  return intervalId
}

/**
 * Stop spot value polling
 * 
 * @this {OpenInverterExtension}
 */
function stopSpotValuePolling() {
  if (this.state.spotValuePollingInterval) {
    clearInterval(this.state.spotValuePollingInterval)
    this.state.spotValuePollingInterval = null
  }
}

/**
 * Update spot value history
 * Maintains a rolling window of historical values for charting
 * 
 * @this {OpenInverterExtension}
 * @param {Object} spotValues - Current spot values
 * @param {number} [maxHistory=100] - Maximum history entries to keep
 */
function updateSpotValueHistory(spotValues, maxHistory = 100) {
  const timestamp = Date.now()
  
  // Initialize history if needed
  if (!this.state.spotValueHistory) {
    this.state.spotValueHistory = {}
  }
  
  // Update history for each parameter
  if (spotValues && typeof spotValues === 'object') {
    for (const category in spotValues) {
      if (typeof spotValues[category] === 'object') {
        for (const paramName in spotValues[category]) {
          const value = spotValues[category][paramName]
          
          // Skip non-numeric values
          if (typeof value !== 'number') continue
          
          // Initialize parameter history if needed
          if (!this.state.spotValueHistory[paramName]) {
            this.state.spotValueHistory[paramName] = []
          }
          
          // Add new data point
          this.state.spotValueHistory[paramName].push({
            timestamp,
            value
          })
          
          // Trim history to max length
          if (this.state.spotValueHistory[paramName].length > maxHistory) {
            this.state.spotValueHistory[paramName] = 
              this.state.spotValueHistory[paramName].slice(-maxHistory)
          }
        }
      }
    }
  }
}

/**
 * Get chart data for selected parameters
 * Prepares data in format suitable for Chart.js
 * 
 * @this {OpenInverterExtension}
 * @param {string[]} paramNames - Array of parameter names to include
 * @returns {Object} - Chart.js dataset configuration
 */
function getChartData(paramNames) {
  if (!this.state.spotValueHistory) {
    return { labels: [], datasets: [] }
  }
  
  // Generate colors for each parameter
  const colors = [
    'rgb(30, 136, 229)',   // --oi-blue
    'rgb(255, 140, 0)',    // --oi-orange
    'rgb(76, 175, 80)',    // --oi-status-success
    'rgb(244, 67, 54)',    // --oi-status-error
    'rgb(255, 152, 0)',    // --oi-status-warning
    'rgb(156, 39, 176)',   // purple
    'rgb(0, 150, 136)',    // teal
    'rgb(255, 193, 7)'     // yellow
  ]
  
  const datasets = []
  const allTimestamps = new Set()
  
  // Collect all timestamps and create datasets
  paramNames.forEach((paramName, index) => {
    const history = this.state.spotValueHistory[paramName]
    if (!history || history.length === 0) return
    
    // Add timestamps to set
    history.forEach(point => allTimestamps.add(point.timestamp))
    
    // Create dataset
    datasets.push({
      label: paramName,
      data: history.map(point => ({ x: point.timestamp, y: point.value })),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '33', // Add alpha
      fill: false,
      tension: 0.1
    })
  })
  
  // Sort timestamps
  const labels = Array.from(allTimestamps).sort((a, b) => a - b)
  
  return {
    labels: labels.map(ts => new Date(ts).toLocaleTimeString()),
    datasets
  }
}

/**
 * Clear spot value history
 * 
 * @this {OpenInverterExtension}
 * @param {string[]} [paramNames] - Optional array of specific parameters to clear (clears all if not provided)
 */
function clearSpotValueHistory(paramNames) {
  if (!this.state.spotValueHistory) return
  
  if (paramNames && Array.isArray(paramNames)) {
    // Clear specific parameters
    paramNames.forEach(paramName => {
      if (this.state.spotValueHistory[paramName]) {
        this.state.spotValueHistory[paramName] = []
      }
    })
  } else {
    // Clear all
    this.state.spotValueHistory = {}
  }
}

/**
 * Export spot value history as CSV
 * 
 * @this {OpenInverterExtension}
 * @param {string[]} [paramNames] - Optional array of parameters to export (exports all if not provided)
 * @returns {string} - CSV formatted string
 */
function exportSpotValueHistoryCSV(paramNames) {
  if (!this.state.spotValueHistory) return ''
  
  const paramsToExport = paramNames || Object.keys(this.state.spotValueHistory)
  
  // Collect all timestamps
  const allTimestamps = new Set()
  paramsToExport.forEach(paramName => {
    const history = this.state.spotValueHistory[paramName]
    if (history) {
      history.forEach(point => allTimestamps.add(point.timestamp))
    }
  })
  
  const timestamps = Array.from(allTimestamps).sort((a, b) => a - b)
  
  // Build CSV header
  let csv = 'Timestamp,' + paramsToExport.join(',') + '\n'
  
  // Build CSV rows
  timestamps.forEach(ts => {
    const row = [new Date(ts).toISOString()]
    
    paramsToExport.forEach(paramName => {
      const history = this.state.spotValueHistory[paramName]
      if (history) {
        const point = history.find(p => p.timestamp === ts)
        row.push(point ? point.value : '')
      } else {
        row.push('')
      }
    })
    
    csv += row.join(',') + '\n'
  })
  
  return csv
}


// ============================================================================
// components/DeviceCard.js
// ============================================================================

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


// ============================================================================
// components/TabsContainer.js
// ============================================================================

/**
 * Tabs Container Component
 * 
 * Generic reusable tabs component for rendering tab navigation.
 * Used by device detail views to switch between different sections.
 */

/**
 * Render tabs container
 * 
 * @this {OpenInverterExtension}
 * @param {Array<Object>} tabs - Array of tab definitions
 * @param {string} tabs[].id - Tab ID
 * @param {string} tabs[].label - Tab display label
 * @param {boolean} [tabs[].disabled] - Whether tab is disabled
 * @param {string} activeTabId - Currently active tab ID
 * @param {Function} onTabChange - Callback when tab is clicked: (tabId) => void
 * @returns {TemplateResult} - Rendered tabs
 */
function renderTabsContainer(tabs, activeTabId, onTabChange) {
  return this.html`
    <div class="tabs-container">
      <div class="tabs-header">
        <div class="tabs-nav">
          ${tabs.map(tab => this.html`
            <button
              class="tab-button ${tab.id === activeTabId ? 'active' : ''}"
              onclick=${() => onTabChange.call(this, tab.id)}
              disabled=${tab.disabled || false}
            >
              ${tab.label}
            </button>
          `)}
        </div>
      </div>
    </div>
  `
}


// ============================================================================
// components/DataTable.js
// ============================================================================

/**
 * Data Table Component
 * 
 * Generic reusable table component for displaying tabular data.
 * Used for CAN mappings, parameters list, etc.
 */

/**
 * Render data table
 * 
 * @this {OpenInverterExtension}
 * @param {Object} config - Table configuration
 * @param {Array<Object>} config.columns - Column definitions
 * @param {string} config.columns[].key - Data key
 * @param {string} config.columns[].label - Column header label
 * @param {Function} [config.columns[].render] - Optional custom render function
 * @param {Array<Object>} config.data - Table data rows
 * @param {Function} [config.onRowClick] - Optional row click handler
 * @param {Array<Object>} [config.actions] - Optional action buttons per row
 * @returns {TemplateResult} - Rendered table
 */
function renderDataTable(config) {
  const { columns, data, onRowClick, actions } = config
  
  if (!data || data.length === 0) {
    return this.html`
      <div class="no-mappings">
        No data available
      </div>
    `
  }
  
  return this.html`
    <table class="mappings-table">
      <thead>
        <tr>
          ${columns.map(col => this.html`
            <th>${col.label}</th>
          `)}
          ${actions && actions.length > 0 ? this.html`<th>Actions</th>` : ''}
        </tr>
      </thead>
      <tbody>
        ${data.map((row, rowIndex) => this.html`
          <tr onclick=${onRowClick ? () => onRowClick.call(this, row, rowIndex) : null}>
            ${columns.map(col => this.html`
              <td>
                ${col.render 
                  ? col.render.call(this, row[col.key], row, rowIndex)
                  : row[col.key]}
              </td>
            `)}
            ${actions && actions.length > 0 ? this.html`
              <td class="action-buttons">
                ${actions.map(action => this.html`
                  <button
                    class=${action.className || 'btn-secondary'}
                    onclick=${(e) => { e.stopPropagation(); action.onClick.call(this, row, rowIndex); }}
                    title=${action.label}
                    disabled=${action.disabled ? action.disabled(row) : false}
                  >
                    ${action.label}
                  </button>
                `)}
              </td>
            ` : ''}
          </tr>
        `)}
      </tbody>
    </table>
  `
}


// ============================================================================
// tabs/DeviceSelectorTab.js
// ============================================================================

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
from lib.OI_helpers import scanCanBus
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


// ============================================================================
// tabs/ParametersTab.js
// ============================================================================

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


// ============================================================================
// tabs/SpotValuesTab.js
// ============================================================================

/**
 * Spot Values Tab - Complete Implementation
 * 
 * Real-time monitoring of device spot values (measurements).
 * Displays current values organized by category with units and mini-charts.
 * 
 * Features:
 * - Auto-refresh with configurable interval
 * - Inline mini-charts for selected parameters
 * - Historical data tracking
 * - Click to toggle chart display
 */

/**
 * Render the Spot Values tab (Overview)
 * @this {OpenInverterExtension}
 */
function renderSpotValuesTab() {
  // Check if device is connected
  if (!this.state.oiDeviceConnected) {
    return this.html`
      <div style="padding: 60px 20px; text-align: center;">
        <p style="font-size: 18px; color: var(--text-primary); margin: 0 0 8px 0; font-weight: 600;">
          No Device Connected
        </p>
        <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">
          Use the Device Manager to scan and connect
        </p>
      </div>
    `
  }

  // autoRefreshInterval is initialized in constructor, no need to check here

  // Start auto-refresh if not already running and not editing interval
  if (!this.state.spotValueRefreshTimer && !this.state.isEditingInterval) {
    startSpotValueAutoRefresh.call(this)
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
    <section id="spot-values" class="card">
      <h2 class="section-header" onclick=${(e) => {
        const target = e.currentTarget.parentElement
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}>
        Spot Values
      </h2>

      <div style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); padding: 16px 20px; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
          <!-- Update interval input -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 14px; color: var(--text-secondary); white-space: nowrap;">
              Update Interval:
            </label>
            <input 
              type="number"
              value=${this.state.isEditingInterval ? (this.state.editingIntervalValue || this.state.autoRefreshInterval) : this.state.autoRefreshInterval}
              onfocus=${(e) => {
                // Store that we're editing and the current value
                this.state.isEditingInterval = true
                this.state.editingIntervalValue = e.target.value
                // Stop auto-refresh while editing to prevent re-renders
                if (this.state.spotValueRefreshTimer) {
                  stopSpotValueAutoRefresh.call(this)
                }
              }}
              oninput=${(e) => {
                // Update the editing value without triggering re-render
                this.state.editingIntervalValue = e.target.value
              }}
              onchange=${(e) => {
                const newValue = e.target.value
                // Update interval (this will restart timer and set isEditingInterval = false internally)
                updateRefreshInterval.call(this, newValue)
              }}
              onblur=${(e) => {
                const newValue = e.target.value
                // Update interval (this will restart timer and set isEditingInterval = false internally)
                updateRefreshInterval.call(this, newValue)
              }}
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
            onclick=${() => clearSpotValueHistory.call(this)}
            style="background: var(--oi-orange); padding: 8px 16px; margin-left: auto;">
            Clear Data
          </button>
        </div>
      </div>

      <div style="padding: 0 20px 20px;">
        <div class="spot-values-categories">
          ${Object.entries(categories).map(([category, spots]) => this.html`
            <div class="parameter-category">
              <h3 class="category-title">
                ${category}
                <span class="param-count">(${spots.length})</span>
              </h3>
              <div class="parameters-list">
                ${spots.map(spot => renderSpotValueCard.call(this, spot))}
              </div>
            </div>
          `)}
        </div>
      </div>
    </section>
  `
}

/**
 * Render spot value card with inline mini-chart
 * @this {OpenInverterExtension}
 */
function renderSpotValueCard(spot) {
  // Ensure selectedChartParams is initialized
  if (!this.state.selectedChartParams) {
    this.state.selectedChartParams = new Set()
  }
  
  const isSelected = this.state.selectedChartParams.has(spot.name)
  const converted = convertSpotValue(spot.value, spot.unit)
  const formatted = formatParameterValue.call(this, spot, converted.value)
  
  // Get historical data for this parameter
  const history = this.state.spotValueHistory[spot.name] || []
  
  // Create a safe ID for the card (replace special chars)
  const cardId = `spot-card-${spot.name.replace(/[^a-zA-Z0-9]/g, '-')}`
  
  // Create click handler function
  const handleClick = () => {
    console.log('[OI] Clicked spot value card:', spot.name)
    toggleChartForParam.call(this, spot.name)
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
        <div class="spot-value-display" style="
          font-size: 20px; 
          font-weight: 600; 
          font-family: 'Press Start 2P', 'Monaco', 'Courier New', monospace; 
          background-color: #c8e4b7;
          color: #3b5e2b;
          padding: 10px 15px;
          border: 2px solid #5a7d4a;
          border-radius: 5px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
          line-height: 1.2;
          image-rendering: pixelated;
          background-image: repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 3px);
          text-align: right;
          letter-spacing: 0.05em;
        ">
          ${formatted}
        </div>
      </div>
      
      <div class="mini-chart-container" style="pointer-events: none;">
        ${isSelected ? renderMiniChart.call(this, spot.name, history, converted.unit) : ''}
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
 * @this {OpenInverterExtension}
 */
function renderMiniChart(paramName, history, unit) {
  // Base dimensions for coordinate system
  const baseWidth = 500
  const height = 150
  const padding = { top: 10, right: 10, bottom: 40, left: 50 }
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

  // Scale functions
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

  // Color based on parameter name
  const color = getColorForParam(paramName)

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
            <!-- Grid line -->
            <line
              x1="${padding.left}"
              y1="${y}"
              x2="${baseWidth - padding.right}"
              y2="${y}"
              stroke="#e0e0e0"
              stroke-width="1"
              stroke-dasharray="2,2"
            />
            <!-- Y-axis label -->
            <text
              x="${padding.left - 8}"
              y="${y}"
              text-anchor="end"
              dominant-baseline="middle"
              style="font-size: 10px; fill: #666; font-family: 'Monaco', 'Courier New', monospace;">
              ${value.toFixed(1)}
            </text>
          </g>
        `
      })}

      <!-- X-axis ticks, labels, and grid lines -->
      ${xTickValues.map((timestamp, i) => {
        const x = scaleX(timestamp)
        const date = new Date(timestamp)
        const timeLabel = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
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
            <!-- Grid line -->
            <line
              x1="${x}"
              y1="${padding.top}"
              x2="${x}"
              y2="${height - padding.bottom}"
              stroke="#e0e0e0"
              stroke-width="1"
              stroke-dasharray="2,2"
            />
            <!-- X-axis label -->
            <text
              x="${x}"
              y="${height - padding.bottom + 15}"
              text-anchor="middle"
              style="font-size: 9px; fill: #666; font-family: 'Monaco', 'Courier New', monospace;">
              ${timeLabel}
            </text>
          </g>
        `
      })}

      <!-- Data line -->
      <path
        d="${linePath}"
        fill="none"
        stroke="${color}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Data points -->
      ${history.map((point) => {
        const x = scaleX(point.timestamp)
        const y = scaleY(point.value)
        return this.html`
          <circle
            cx="${x}"
            cy="${y}"
            r="3"
            fill="${color}"
            stroke="white"
            stroke-width="1"
          />
        `
      })}

      <!-- Unit label (top right) -->
      <text
        x="${baseWidth - padding.right - 5}"
        y="${padding.top + 10}"
        text-anchor="end"
        style="font-size: 11px; fill: #666; font-weight: 600;">
        ${unit}
      </text>
    </svg>
  `
}

/**
 * Start auto-refresh timer for spot values
 * @this {OpenInverterExtension}
 */
function startSpotValueAutoRefresh() {
  // Clear existing timer if any
  if (this.state.spotValueRefreshTimer) {
    clearInterval(this.state.spotValueRefreshTimer)
  }
  
  // Refresh immediately
  refreshSpotValues.call(this)
  
  // Set up interval
  this.state.spotValueRefreshTimer = setInterval(() => {
    refreshSpotValues.call(this)
  }, this.state.autoRefreshInterval)
}

/**
 * Stop auto-refresh timer
 * @this {OpenInverterExtension}
 */
function stopSpotValueAutoRefresh() {
  if (this.state.spotValueRefreshTimer) {
    clearInterval(this.state.spotValueRefreshTimer)
    this.state.spotValueRefreshTimer = null
  }
}

/**
 * Refresh spot values from device
 * @this {OpenInverterExtension}
 */
async function refreshSpotValues() {
  if (!this.state.oiDeviceConnected) {
    stopSpotValueAutoRefresh.call(this)
    return
  }
  
  try {
    this.state.isLoadingOiSpotValues = true
    const spotValues = await getSpotValues.call(this)
    
    if (spotValues) {
      this.state.oiSpotValues = spotValues
      
      // Update history for selected parameters
      const timestamp = Date.now()
      Object.entries(spotValues).forEach(([name, spot]) => {
        if (this.state.selectedChartParams && this.state.selectedChartParams.has(name)) {
          if (!this.state.spotValueHistory[name]) {
            this.state.spotValueHistory[name] = []
          }
          
          // Convert value before storing
          const converted = convertSpotValue(spot.value, spot.unit)
          
          // Add to history
          this.state.spotValueHistory[name].push({
            timestamp,
            value: converted.value
          })
          
          // Limit history length (keep last 100 points)
          if (this.state.spotValueHistory[name].length > 100) {
            this.state.spotValueHistory[name].shift()
          }
        }
      })
    }
    
    this.state.isLoadingOiSpotValues = false
    
    // Only emit render if telemetry tab is currently active AND not editing interval
    // This prevents unnecessary re-renders when tab is not visible or user is editing
    if (this.state.activeDeviceTab === 'telemetry' && !this.state.isEditingInterval) {
      this.emit('render')
    }
  } catch (error) {
    console.error('[OI] Failed to refresh spot values:', error)
    this.state.isLoadingOiSpotValues = false
  }
}

/**
 * Update refresh interval
 * @this {OpenInverterExtension}
 */
function updateRefreshInterval(value) {
  const interval = parseInt(value, 10)
  if (!isNaN(interval) && interval >= 100 && interval <= 10000) {
    // Stop editing flag BEFORE updating state
    const wasEditing = this.state.isEditingInterval
    this.state.isEditingInterval = false
    delete this.state.editingIntervalValue
    
    this.state.autoRefreshInterval = interval
    
    // Always restart timer with new interval (it may have been stopped during editing)
    stopSpotValueAutoRefresh.call(this)
    startSpotValueAutoRefresh.call(this)
    
    // Only emit render if we weren't editing (prevents render during input)
    if (!wasEditing) {
      this.emit('render')
    }
  }
}

/**
 * Clear spot value history
 * @this {OpenInverterExtension}
 */
function clearSpotValueHistory() {
  this.state.spotValueHistory = {}
  this.emit('render')
}

/**
 * Toggle chart display for a parameter
 * @this {OpenInverterExtension}
 */
function toggleChartForParam(paramName) {
  if (!this.state.selectedChartParams) {
    this.state.selectedChartParams = new Set()
  }
  
  if (this.state.selectedChartParams.has(paramName)) {
    this.state.selectedChartParams.delete(paramName)
    // Clear history for this parameter
    delete this.state.spotValueHistory[paramName]
  } else {
    this.state.selectedChartParams.add(paramName)
    // Initialize history for this parameter
    if (!this.state.spotValueHistory[paramName]) {
      this.state.spotValueHistory[paramName] = []
    }
    
    // Add current value immediately for instant visual feedback
    if (this.state.oiSpotValues && this.state.oiSpotValues[paramName]) {
      const spot = this.state.oiSpotValues[paramName]
      const converted = convertSpotValue(spot.value, spot.unit)
      this.state.spotValueHistory[paramName].push({
        timestamp: Date.now(),
        value: converted.value
      })
    }
  }
  
  this.emit('render')
}

/**
 * Get consistent color for parameter name
 */
function getColorForParam(paramName) {
  // Simple hash function for consistent colors
  let hash = 0
  for (let i = 0; i < paramName.length; i++) {
    hash = paramName.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // OpenInverter color palette
  const colors = [
    'var(--oi-blue)',
    'var(--oi-orange)',
    'var(--oi-green)',
    '#9333ea', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f59e0b', // amber
    '#ef4444'  // red
  ]
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Convert spot value with unit prefix (from spotValueConversions.ts)
 */
function convertSpotValue(rawValue, unit) {
  if (!unit) {
    return { value: rawValue, unit: '' }
  }
  
  // Extract numeric prefix from unit (e.g., "10ms" -> "10", "100us" -> "100")
  const match = unit.match(/^(\d+)(.*)$/)
  
  if (match) {
    const multiplier = parseInt(match[1], 10)
    const baseUnit = match[2]
    const convertedValue = rawValue * multiplier
    
    return {
      value: convertedValue,
      unit: baseUnit
    }
  }
  
  // No conversion needed
  return { value: rawValue, unit }
}

/**
 * Format parameter value for display
 * @this {OpenInverterExtension}
 */
function formatParameterValue(spot, value) {
  const converted = convertSpotValue(value, spot.unit)
  
  // Format number
  let formatted
  if (converted.value === 0) {
    formatted = '0'
  } else if (Math.abs(converted.value) < 0.01) {
    formatted = converted.value.toExponential(2)
  } else if (Math.abs(converted.value) < 100) {
    formatted = converted.value.toFixed(2)
  } else {
    formatted = converted.value.toFixed(0)
  }
  
  // Add unit
  return converted.unit ? `${formatted} ${converted.unit}` : formatted
}


// ============================================================================
// tabs/CanMappingsTab.js
// ============================================================================

/**
 * CAN Mappings Tab
 * 
 * Configure CAN message mappings for TX and RX.
 * Maps parameters to CAN message positions.
 */

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


// ============================================================================
// tabs/CanMessagesTab.js
// ============================================================================

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


// ============================================================================
// tabs/OtaUpdateTab.js
// ============================================================================

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
    const result = await this.device.execute(`from lib.OI_helpers import startFirmwareUpgrade; startFirmwareUpgrade(${argsStr})`)
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
    await this.device.execute(`from lib.OI_helpers import uploadFirmwareChunk; uploadFirmwareChunk(${args})`)

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


// ============================================================================
// main.js
// ============================================================================

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


