import { useState } from 'react'
import Input, { FtInInput } from '../ui/Input'
import { useSettings } from '../../context/SettingsContext'
import { SAIL_TYPES, MEASUREMENT_DEFS } from '../../lib/constants'
import { convertForDisplay, convertForStorage, unitLabel, metersToFeetInches } from '../../lib/calculations'
import SailDiagram from '../SailDiagram'

export default function MeasurementInputs({ sailType, measurements, onChange }) {
  const { units } = useSettings()
  const [focused, setFocused] = useState(null)

  const sailDef = SAIL_TYPES[sailType]
  if (!sailDef) return null

  const handleChange = (abbr) => (valOrEvent) => {
    if (units === 'ftin') {
      // valOrEvent is { feet, inches } from FtInInput
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

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-navy-900">
        {sailDef.label} Measurements
        <span className="text-sm font-normal text-navy-400 ml-2">({unitLabel(units)})</span>
      </h2>

      <SailDiagram sailType={sailType} highlighted={focused} />

      <div className={`grid grid-cols-1 ${units !== 'ftin' ? 'sm:grid-cols-2' : ''} gap-4`}>
        {sailDef.measurements.map((abbr) => {
          const def = MEASUREMENT_DEFS[abbr]
          if (!def) return null

          if (units === 'ftin') {
            return (
              <FtInInput
                key={abbr}
                abbr={abbr}
                label={def.label}
                description={def.description}
                value={getDisplayValue(abbr)}
                onChange={handleChange(abbr)}
                onFocus={() => setFocused(abbr)}
                onBlur={() => setFocused(null)}
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
            />
          )
        })}
      </div>
    </div>
  )
}
