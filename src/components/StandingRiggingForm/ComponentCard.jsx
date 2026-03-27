import { useState } from 'react'
import Input, { Select, TextArea } from '../ui/Input'
import Badge from '../ui/Badge'
import { WIRE_TYPES, WIRE_MATERIALS, TURNBUCKLE_TYPES, CONDITION_RATINGS } from '../../lib/constants'

export default function ComponentCard({ component, onChange }) {
  const [open, setOpen] = useState(false)
  const condLabel = CONDITION_RATINGS.find(r => r.value === component.conditionRating)

  const set = (field) => (e) => onChange({ ...component, [field]: e.target.value })
  const setNum = (field) => (e) => onChange({ ...component, [field]: Number(e.target.value) || 0 })

  return (
    <div className="border border-navy-100 rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-navy-50 transition-colors"
      >
        <div>
          <span className="text-sm font-medium text-navy-900">{component.label}</span>
          {component.conditionRating > 0 && (
            <Badge status={condLabel?.color === 'red' ? 'error' : condLabel?.color === 'amber' ? 'pending' : 'synced'} className="ml-2">
              {condLabel?.label}
            </Badge>
          )}
        </div>
        <span className="text-navy-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-navy-50">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Select label="Wire/Rod Type" value={component.wireType || ''} onChange={set('wireType')}>
              <option value="">Select...</option>
              {WIRE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select label="Material" value={component.material || ''} onChange={set('material')}>
              <option value="">Select...</option>
              {WIRE_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
            <Input label="Diameter" type="text" value={component.diameter || ''} onChange={set('diameter')} placeholder='e.g., 5/16" or 8mm' />
            <Input label="Length" type="text" value={component.length || ''} onChange={set('length')} placeholder="ft or m" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-navy-700">Condition</label>
            <div className="flex gap-1">
              {CONDITION_RATINGS.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => onChange({ ...component, conditionRating: value })}
                  className={`flex-1 py-2 rounded text-xs font-medium transition-colors cursor-pointer
                    ${component.conditionRating === value
                      ? color === 'red' ? 'bg-red-500 text-white' : color === 'amber' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="text-xs text-navy-400">{condLabel?.label || 'Tap 1-5 to rate'}</p>
          </div>

          <Input label="Tension Reading" type="text" value={component.tensionReading || ''} onChange={set('tensionReading')} placeholder="e.g., 28 on Loos gauge" />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Age / Install Date" type="text" value={component.age || ''} onChange={set('age')} placeholder="e.g., ~8 years" />
            <Select label="Turnbuckle Type" value={component.turnbuckleType || ''} onChange={set('turnbuckleType')}>
              <option value="">Select...</option>
              {TURNBUCKLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Input label="Hardware Brand" type="text" value={component.hardwareBrand || ''} onChange={set('hardwareBrand')} placeholder="e.g., Sta-Lok" />
            <Input label="Hardware Model" type="text" value={component.hardwareModel || ''} onChange={set('hardwareModel')} />
          </div>

          <TextArea label="Corrosion / Notes" value={component.notes || ''} onChange={set('notes')} placeholder="Condition details, corrosion, wear..." />
        </div>
      )}
    </div>
  )
}
