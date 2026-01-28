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
