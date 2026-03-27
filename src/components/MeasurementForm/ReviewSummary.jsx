import { SAIL_TYPES, MEASUREMENT_DEFS } from '../../lib/constants'
import { useSettings } from '../../context/SettingsContext'
import { calculateArea, formatMeasurement, formatArea, unitLabel, areaUnitLabel } from '../../lib/calculations'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function ReviewSummary({ data }) {
  const { units } = useSettings()
  const sailDef = SAIL_TYPES[data.sailType]
  const area = calculateArea(data.sailType, data.measurements || {})

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-navy-900">Review & Save</h2>

      {/* Boat info summary */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-navy-500 mb-2">Boat Information</h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <InfoRow label="Boat" value={data.boatName} />
          <InfoRow label="Class" value={data.boatClass} />
          <InfoRow label="Sail #" value={data.sailNumber} />
          <InfoRow label="Owner" value={data.ownerName} />
          <InfoRow label="Maker" value={data.sailMaker} />
          <InfoRow label="Model" value={data.sailModel} />
          <InfoRow label="Material" value={data.material} />
          <InfoRow label="Rating" value={data.ratingSystem} />
          <InfoRow label="Date" value={data.measurementDate} />
          <InfoRow label="Measurer" value={data.measurerName} />
        </div>
      </Card>

      {/* Measurements */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-navy-500">
            {sailDef?.label} Measurements
          </h3>
          <Badge status="info">{unitLabel(units)}</Badge>
        </div>
        <div className="space-y-1">
          {sailDef?.measurements.map((abbr) => {
            const def = MEASUREMENT_DEFS[abbr]
            const val = data.measurements?.[abbr]
            return (
              <div key={abbr} className="flex justify-between py-1.5 border-b border-navy-50 last:border-0">
                <span className="text-sm text-navy-600">
                  <span className="font-bold text-navy-900">{abbr}</span>{' '}
                  {def?.label}
                </span>
                <span className="text-sm font-mono text-navy-900">
                  {formatMeasurement(val, units)} {unitLabel(units)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Calculated area */}
      {area != null && (
        <Card className="p-4 bg-ocean-50 border-ocean-200">
          <h3 className="text-sm font-medium text-navy-500 mb-1">Calculated Sail Area</h3>
          <div className="text-2xl font-bold text-navy-900">
            {formatArea(area, 'metric')} m{'\u00B2'}
          </div>
          <div className="text-sm text-navy-500 mt-1">
            {formatArea(area, 'imperial')} ft{'\u00B2'}
          </div>
        </Card>
      )}

      {/* Notes */}
      {data.notes && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-navy-500 mb-1">Notes</h3>
          <p className="text-sm text-navy-700 whitespace-pre-wrap">{data.notes}</p>
        </Card>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <>
      <span className="text-navy-400">{label}</span>
      <span className="text-navy-900 font-medium">{value}</span>
    </>
  )
}
