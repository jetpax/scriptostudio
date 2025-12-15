/**
 * DeviceAPI - Helper library for ScriptO UIs to communicate with ESP32 device
 * 
 * This library provides a clean async/await interface for executing commands
 * on the device via WebREPL. It uses postMessage to communicate with the parent
 * Studio window, which handles the actual WebREPL communication.
 * 
 * Usage:
 *   const api = new DeviceAPI();
 *   const params = await api.getOiParams();
 *   await api.setParameter(1, 100);
 */

class DeviceAPI {
  constructor() {
    this.pendingRequests = new Map(); // Track requests by ID
    this.requestId = 0;
    
    // Listen for responses from parent window
    window.addEventListener('message', (event) => {
      if (event.data.type === 'result') {
        const handler = this.pendingRequests.get(event.data.id);
        if (handler) {
          handler.resolve(event.data.data);
          this.pendingRequests.delete(event.data.id);
        }
      } else if (event.data.type === 'error') {
        const handler = this.pendingRequests.get(event.data.id);
        if (handler) {
          handler.reject(new Error(event.data.error));
          this.pendingRequests.delete(event.data.id);
        }
      }
    });
  }
  
  /**
   * Execute arbitrary Python code on the device
   * @param {string} code - Python code to execute
   * @returns {Promise<string>} - Raw output from device
   */
  async execute(code) {
    const id = ++this.requestId;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      // Ask parent window to execute code
      window.parent.postMessage({
        type: 'execute',
        id: id,
        code: code
      }, '*');
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Command timeout after 5 seconds'));
        }
      }, 5000);
    });
  }
  
  /**
   * Parse JSON response from helper functions
   * @param {string} output - Raw output containing JSON
   * @returns {object} - Parsed JSON object
   */
  _parseResponse(output) {
    try {
      // Try to parse as-is first
      return JSON.parse(output);
    } catch (e) {
      // Try to extract JSON object from output (handles extra text)
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse response: ' + output);
    }
  }
  
  // === OpenInverter Helper Methods ===
  
  /**
   * Get all OpenInverter parameters
   * @returns {Promise<object>} - Parameters object with id, name, value, etc.
   */
  async getOiParams() {
    const result = await this.execute('getOiParams()');
    return this._parseResponse(result);
  }
  
  /**
   * Set a parameter value
   * @param {number} id - Parameter ID
   * @param {number|string} value - New value
   * @returns {Promise<object>} - Response from device
   */
  async setParameter(id, value) {
    // Escape strings properly
    const valueStr = typeof value === 'string' ? `"${value}"` : value;
    const result = await this.execute(`setParameter({"id": ${id}, "value": ${valueStr}})`);
    return this._parseResponse(result);
  }
  
  /**
   * Save parameters to storage
   * @returns {Promise<object>} - Response from device
   */
  async saveParameters() {
    const result = await this.execute('saveParameters()');
    return this._parseResponse(result);
  }
  
  /**
   * Get spot values (live readings)
   * @returns {Promise<object>} - Spot values object
   */
  async getSpotValues() {
    const result = await this.execute('getSpotValues()');
    return this._parseResponse(result);
  }
  
  /**
   * Get plot data for real-time graphing
   * @param {Array<number>} paramIds - Array of parameter IDs to plot
   * @returns {Promise<object>} - Plot data object
   */
  async getPlotData(paramIds) {
    const idsStr = JSON.stringify(paramIds);
    const result = await this.execute(`getPlotData({"ids": ${idsStr}})`);
    return this._parseResponse(result);
  }
  
  /**
   * Get CAN mapping data
   * @returns {Promise<object>} - CAN mapping configuration
   */
  async getCanMap() {
    const result = await this.execute('getCanMappingData()');
    return this._parseResponse(result);
  }
  
  /**
   * Map a spot value to CAN bus
   * @param {object} mapping - Mapping configuration {spotValueId, canId, position, length, gain, offset}
   * @returns {Promise<object>} - Response from device
   */
  async mapCanSpotValue(mapping) {
    const mappingStr = JSON.stringify(mapping);
    const result = await this.execute(`mapCanSpotValue(${mappingStr})`);
    return this._parseResponse(result);
  }
  
  /**
   * Remove CAN mapping
   * @param {number} canId - CAN ID to unmap
   * @param {number} position - Position in CAN frame
   * @returns {Promise<object>} - Response from device
   */
  async unmapCanSpotValue(canId, position) {
    const result = await this.execute(`unmapCanSpotValue({"canId": ${canId}, "position": ${position}})`);
    return this._parseResponse(result);
  }
  
  /**
   * Get system information
   * @returns {Promise<object>} - System info object
   */
  async getSysInfo() {
    const result = await this.execute('getSysInfo()');
    return this._parseResponse(result);
  }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
  window.DeviceAPI = DeviceAPI;
}
