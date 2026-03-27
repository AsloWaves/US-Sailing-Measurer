import { useState } from 'react'
import Input, { Select, TextArea } from '../ui/Input'
import { HARDWARE_TYPES, CONDITION_RATINGS } from '../../lib/constants'

export default function HardwareCard({ item, onChange, onRemove }) {
  const [open, setOpen] = useState(true)
  const set = (field) => (e) => onChange({ ...item, [field]: e.target.value })

  return (
    <div className="border border-navy-100 rounded-lg bg-white overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-navy-50 transition-colors">
        <span className="text-sm font-medium text-navy-900">
          {item.brand || item.hardwareType || 'Hardware Item'}
          {item.model ? ` ${item.model}` : ''}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove() }} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">Remove</button>
          <span className="text-navy-400 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-navy-50">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Select label="Type" value={item.hardwareType || ''} onChange={set('hardwareType')}>
              <option value="">Select...</option>
              {HARDWARE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Input label="Location" type="text" value={item.location || ''} onChange={set('location')} placeholder="e.g., masthead" />
            <Input label="Brand" type="text" value={item.brand || ''} onChange={set('brand')} placeholder="e.g., Harken" />
            <Input label="Model" type="text" value={item.model || ''} onChange={set('model')} />
            <Input label="Size" type="text" value={item.size || ''} onChange={set('size')} placeholder="e.g., 57mm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-navy-700">Condition</label>
            <div className="flex gap-1">
              {CONDITION_RATINGS.map(({ value, label, color }) => (
                <button key={value} onClick={() => onChange({ ...item, conditionRating: value })}
                  className={`flex-1 py-2 rounded text-xs font-medium transition-colors cursor-pointer
                    ${item.conditionRating === value
                      ? color === 'red' ? 'bg-red-500 text-white' : color === 'amber' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}>
                  {value}
                </button>
              ))}
            </div>
          </div>
          <TextArea label="Notes" value={item.notes || ''} onChange={set('notes')} placeholder="Service notes..." />
        </div>
      )}
    </div>
  )
}
