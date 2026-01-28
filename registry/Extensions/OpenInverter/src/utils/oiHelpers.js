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
