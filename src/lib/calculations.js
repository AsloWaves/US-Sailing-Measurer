import { METERS_TO_FEET, SQ_METERS_TO_SQ_FEET } from './constants'

// Unit conversion functions
export function metersToFeet(m) {
  if (m == null || isNaN(m)) return null
  return m * METERS_TO_FEET
}

export function feetToMeters(ft) {
  if (ft == null || isNaN(ft)) return null
  return ft / METERS_TO_FEET
}

export function sqMetersToSqFeet(sqm) {
  if (sqm == null || isNaN(sqm)) return null
  return sqm * SQ_METERS_TO_SQ_FEET
}

/**
 * Convert a value for display based on the user's unit preference.
 * Stored values are always in meters.
 */
export function convertForDisplay(meters, unit) {
  if (meters == null || isNaN(meters)) return ''
  if (unit === 'imperial') return metersToFeet(meters)
  return meters
}

/**
 * Convert a user-entered value to meters for storage.
 */
export function convertForStorage(value, unit) {
  if (value == null || value === '' || isNaN(Number(value))) return null
  const num = Number(value)
  if (unit === 'imperial') return feetToMeters(num)
  return num
}

/**
 * Format a measurement value for display with appropriate precision.
 */
export function formatMeasurement(meters, unit) {
  const val = convertForDisplay(meters, unit)
  if (val === '' || val == null) return '—'
  return val.toFixed(3)
}

/**
 * Format an area value for display.
 */
export function formatArea(sqMeters, unit) {
  if (sqMeters == null || isNaN(sqMeters)) return '—'
  if (unit === 'imperial') return sqMetersToSqFeet(sqMeters).toFixed(2)
  return sqMeters.toFixed(2)
}

/**
 * Get the unit label for display.
 */
export function unitLabel(unit) {
  return unit === 'imperial' ? 'ft' : 'm'
}

export function areaUnitLabel(unit) {
  return unit === 'imperial' ? 'ft\u00B2' : 'm\u00B2'
}

// ─── Sail Area Calculations (ORC Formulas) ───

/**
 * Mainsail area using ORC trapezoid rule.
 * Area = (P/8) * (E + 2*MQW + 2*MHW + 1.5*MTW + MUW + 0.5*MHB)
 */
export function mainsailArea(m) {
  const { P, E, MQW, MHW, MTW, MUW, MHB } = m
  if (!P || !E) return null
  // Use 0 for optional width measurements
  const mqw = MQW || 0
  const mhw = MHW || 0
  const mtw = MTW || 0
  const muw = MUW || 0
  const mhb = MHB || 0
  return (P / 8) * (E + 2 * mqw + 2 * mhw + 1.5 * mtw + muw + 0.5 * mhb)
}

/**
 * Simple mainsail area (triangle approximation for PHRF).
 * Area = (P * E) / 2
 */
export function mainsailAreaSimple(m) {
  const { P, E } = m
  if (!P || !E) return null
  return (P * E) / 2
}

/**
 * Mizzen area using same formula as mainsail with Y-suffix fields.
 */
export function mizzenArea(m) {
  return mainsailArea({
    P: m.PY,
    E: m.EY,
    MHB: m.MHBY,
    MQW: m.MQWY,
    MHW: m.MHWY,
    MTW: m.MTWY,
    MUW: m.MUWY,
  })
}

/**
 * Foretriangle area.
 * Area = (I * J) / 2
 */
export function foretriangleArea(m) {
  const { I, J } = m
  if (!I || !J) return null
  return (I * J) / 2
}

/**
 * Headsail area (ORC formula).
 * Area = (HLU/8) * (1.4444*HLP + 2*HQW + 2*HHW + 1.5*HTW + HUW + 0.5*HHB)
 */
export function headsailArea(m) {
  const { HLU, HLP } = m
  if (!HLU || !HLP) return null
  const hqw = m.HQW || 0
  const hhw = m.HHW || 0
  const htw = m.HTW || 0
  const huw = m.HUW || 0
  const hhb = m.HHB || 0
  return (HLU / 8) * (1.4444 * HLP + 2 * hqw + 2 * hhw + 1.5 * htw + huw + 0.5 * hhb)
}

/**
 * Spinnaker area (ORC formula).
 * Area = ((SLU + SLE) / 2) * ((SFL + 4 * SHW) / 5) * 0.83
 */
export function spinnakerArea(m) {
  const { SLU, SLE, SHW, SFL } = m
  if (!SLU || !SLE || !SHW || !SFL) return null
  return ((SLU + SLE) / 2) * ((SFL + 4 * SHW) / 5) * 0.83
}

/**
 * Calculate the appropriate area for a given sail type.
 */
export function calculateArea(sailType, measurements) {
  switch (sailType) {
    case 'mainsail':
      return mainsailArea(measurements)
    case 'headsail':
      return headsailArea(measurements)
    case 'spinnaker_sym':
    case 'spinnaker_asym':
      return spinnakerArea(measurements)
    case 'rig':
      return foretriangleArea(measurements)
    case 'mizzen':
      return mizzenArea(measurements)
    default:
      return null
  }
}
