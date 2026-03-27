import Input, { Select, TextArea } from '../ui/Input'
import { useSettings } from '../../context/SettingsContext'
import { RATING_SYSTEMS, MATERIALS } from '../../lib/constants'

export default function BoatInfo({ data, onChange }) {
  const { measurerName, measurerCert } = useSettings()

  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value })

  // Pre-fill measurer info from settings if not yet set
  if (!data.measurerName && measurerName) {
    onChange({ ...data, measurerName, measurerCert })
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-navy-900">Boat & Session Info</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Boat Name"
          type="text"
          value={data.boatName || ''}
          onChange={set('boatName')}
          placeholder="e.g., Windchaser"
          required
        />
        <Input
          label="Boat Class / Design"
          type="text"
          value={data.boatClass || ''}
          onChange={set('boatClass')}
          placeholder="e.g., J/105"
        />
        <Input
          label="Sail Number"
          type="text"
          value={data.sailNumber || ''}
          onChange={set('sailNumber')}
          placeholder="e.g., USA 12345"
        />
        <Input
          label="Owner Name"
          type="text"
          value={data.ownerName || ''}
          onChange={set('ownerName')}
        />
      </div>

      <div className="border-t border-navy-100 pt-4">
        <h3 className="text-sm font-medium text-navy-600 mb-3">Sail Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Sail Maker"
            type="text"
            value={data.sailMaker || ''}
            onChange={set('sailMaker')}
            placeholder="e.g., North Sails"
          />
          <Input
            label="Sail Model"
            type="text"
            value={data.sailModel || ''}
            onChange={set('sailModel')}
          />
          <Select
            label="Material"
            value={data.material || ''}
            onChange={set('material')}
          >
            <option value="">Select material...</option>
            {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select
            label="Rating System"
            value={data.ratingSystem || ''}
            onChange={set('ratingSystem')}
          >
            <option value="">Select rating system...</option>
            {RATING_SYSTEMS.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
        </div>
      </div>

      <div className="border-t border-navy-100 pt-4">
        <h3 className="text-sm font-medium text-navy-600 mb-3">Measurement Session</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={data.measurementDate || new Date().toISOString().split('T')[0]}
            onChange={set('measurementDate')}
          />
          <Input
            label="Measurer Name"
            type="text"
            value={data.measurerName || ''}
            onChange={set('measurerName')}
          />
          <Input
            label="Measurer Certification #"
            type="text"
            value={data.measurerCert || ''}
            onChange={set('measurerCert')}
          />
        </div>
      </div>

      <TextArea
        label="Notes"
        value={data.notes || ''}
        onChange={set('notes')}
        placeholder="Additional notes about this measurement session..."
      />
    </div>
  )
}
