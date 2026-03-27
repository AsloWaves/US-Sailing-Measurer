import { SAIL_TYPES } from '../../lib/constants'
import Card from '../ui/Card'

export default function SailTypeSelect({ selected, onSelect }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-navy-900">Select Sail Type</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(SAIL_TYPES).map(([key, sail]) => (
          <Card
            key={key}
            onClick={() => onSelect(key)}
            className={`p-4 text-center transition-all ${
              selected === key
                ? 'ring-2 ring-ocean-500 border-ocean-500 bg-ocean-50'
                : ''
            }`}
          >
            <div className="text-3xl mb-2">{sail.icon}</div>
            <div className="text-sm font-medium text-navy-900">{sail.label}</div>
            <div className="text-xs text-navy-400 mt-1">
              {sail.measurements.length} measurements
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
