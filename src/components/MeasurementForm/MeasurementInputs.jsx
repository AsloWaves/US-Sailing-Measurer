import { useState } from 'react'
import Input, { FtInInput } from '../ui/Input'
import { useSettings } from '../../context/SettingsContext'
import { SAIL_TYPES, MEASUREMENT_DEFS } from '../../lib/constants'
import { convertForDisplay, convertForStorage, unitLabel, metersToFeetInches } from '../../lib/calculations'
import SailDiagram from '../SailDiagram'

const UNIT_OPTIONS = [
  { key: 'ftin', label: 'FT/IN' },
  { key: 'ft', label: 'FT' },
  { key: 'm', label: 'M' },
]

export default function MeasurementInputs({ sailType, measurements, onChange }) {
  const { units, setUnits } = useSettings()
  const [focused, setFocused] = useState(null)

  const sailDef = SAIL_TYPES[sailType]
  if (!sailDef) return null

  const handleChange = (abbr) => (valOrEvent) => {
    if (units === 'ftin') {
      const stored = convertForStorage(valOrEvent, 'ftin')
      onChange({ ...measurements, [abbr]: stored })
    } else {
      const val = valOrEvent.target.value
      const stored = val === '' ? null : convertForStorage(val, units)
      onChange({ ...measurements, [abbr]: stored })
    }
  }

  const getDisplayValue = (abbr) => {
    const stored = measurements[abbr]
    if (stored == null) {
      return units === 'ftin' ? { feet: '', inches: '' } : ''
    }
    if (units === 'ftin') {
      const { feet, inches } = metersToFeetInches(stored)
      return { feet: String(feet), inches: String(Math.round(inches * 10) / 10) }
    }
    const display = convertForDisplay(stored, units)
    if (display === '' || display == null) return ''
    return String(Math.round(display * 1000) / 1000)
  }

  const getMetersHint = (abbr) => {
    if (units === 'm') return null
    const stored = measurements[abbr]
    if (stored == null || stored === 0) return null
    return `= ${stored.toFixed(3)} m`
  }

  return (
    <div className="space-y-4">
      {/* Header with inline unit switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-navy-900">
          {sailDef.label} Measurements
        </h2>
        <div className="flex bg-navy-100 rounded-lg p-0.5 gap-0.5">
          {UNIT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setUnits(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer
                ${units === key
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-navy-600 hover:text-navy-900'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <SailDiagram sailType={sailType} highlighted={focused} />

      <div className={`grid grid-cols-1 ${units !== 'ftin' ? 'sm:grid-cols-2' : ''} gap-4`}>
        {sailDef.measurements.map((abbr) => {
          const def = MEASUREMENT_DEFS[abbr]
          if (!def) return null
          const metersHint = getMetersHint(abbr)

          if (units === 'ftin') {
            return (
              <FtInInput
                key={abbr}
                abbr={abbr}
                label={def.label}
                description={metersHint || def.description}
                value={getDisplayValue(abbr)}
                onChange={handleChange(abbr)}
                onFocus={() => setFocused(abbr)}
                onBlur={() => setFocused(null)}
                metersHint={metersHint}
                originalDescription={def.description}
              />
            )
          }

          return (
            <Input
              key={abbr}
              abbr={abbr}
              label={def.label}
              description={def.description}
              showUnit
              value={getDisplayValue(abbr)}
              onChange={handleChange(abbr)}
              onFocus={() => setFocused(abbr)}
              onBlur={() => setFocused(null)}
              placeholder="0.000"
              metersHint={metersHint}
            />
          )
        })}
      </div>
    </div>
  )
}
