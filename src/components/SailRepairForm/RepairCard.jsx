import { useState } from 'react'
import Input, { Select, TextArea } from '../ui/Input'
import { DAMAGE_TYPES, REPAIR_TYPES, CONDITION_RATINGS } from '../../lib/constants'

export default function RepairCard({ repair, onChange, onRemove }) {
  const [open, setOpen] = useState(true)
  const set = (field) => (e) => onChange({ ...repair, [field]: e.target.value })

  return (
    <div className="border border-navy-100 rounded-lg bg-white overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-navy-50 transition-colors">
        <span className="text-sm font-medium text-navy-900">
          {repair.damageType || 'New Repair Entry'}
          {repair.location ? ` — ${repair.location}` : ''}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove() }} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">Remove</button>
          <span className="text-navy-400 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-navy-50">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Select label="Damage Type" value={repair.damageType || ''} onChange={set('damageType')}>
              <option value="">Select...</option>
              {DAMAGE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select label="Repair Type" value={repair.repairType || ''} onChange={set('repairType')}>
              <option value="">Select...</option>
              {REPAIR_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
          </div>
          <Input label="Location on Sail" type="text" value={repair.location || ''} onChange={set('location')} placeholder="e.g., Panel 3, leech, upper third" />

          <div className="space-y-1">
            <label className="text-sm font-medium text-navy-700">Severity</label>
            <div className="flex gap-1">
              {CONDITION_RATINGS.map(({ value, label, color }) => (
                <button key={value} onClick={() => onChange({ ...repair, severity: value })}
                  className={`flex-1 py-2 rounded text-xs font-medium transition-colors cursor-pointer
                    ${repair.severity === value
                      ? color === 'red' ? 'bg-red-500 text-white' : color === 'amber' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}>
                  {value}
                </button>
              ))}
            </div>
          </div>

          <Input label="Materials Used" type="text" value={repair.materialsUsed || ''} onChange={set('materialsUsed')} placeholder="e.g., Dacron tape, Bostik 5050" />
          <Input label="Time Spent" type="text" value={repair.timeSpent || ''} onChange={set('timeSpent')} placeholder="e.g., 2 hours" />
          <TextArea label="Before Notes" value={repair.beforeNotes || ''} onChange={set('beforeNotes')} placeholder="Describe the damage..." />
          <TextArea label="After Notes" value={repair.afterNotes || ''} onChange={set('afterNotes')} placeholder="Describe the repair result..." />
        </div>
      )}
    </div>
  )
}
