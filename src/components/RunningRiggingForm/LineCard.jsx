import { useState } from 'react'
import Input, { Select, TextArea } from '../ui/Input'
import Badge from '../ui/Badge'
import { LINE_MATERIALS, LINE_CONSTRUCTIONS, SPLICE_TYPES, CONDITION_RATINGS, REPLACEMENT_RECS } from '../../lib/constants'

export default function LineCard({ line, onChange }) {
  const [open, setOpen] = useState(false)
  const condLabel = CONDITION_RATINGS.find(r => r.value === line.conditionRating)
  const replLabel = REPLACEMENT_RECS.find(r => r.value === line.replacementRec)

  const set = (field) => (e) => onChange({ ...line, [field]: e.target.value })

  return (
    <div className="border border-navy-100 rounded-lg bg-white overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-navy-50 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-navy-900">{line.label}</span>
          {condLabel && (
            <Badge status={condLabel.color === 'red' ? 'error' : condLabel.color === 'amber' ? 'pending' : 'synced'}>
              {condLabel.label}
            </Badge>
          )}
          {replLabel && replLabel.value !== 'ok' && (
            <Badge status={replLabel.color === 'red' ? 'error' : 'pending'}>{replLabel.label}</Badge>
          )}
        </div>
        <span className="text-navy-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-navy-50">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Select label="Material" value={line.material || ''} onChange={set('material')}>
              <option value="">Select...</option>
              {LINE_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
            <Select label="Construction" value={line.construction || ''} onChange={set('construction')}>
              <option value="">Select...</option>
              {LINE_CONSTRUCTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Input label="Diameter" type="text" value={line.diameter || ''} onChange={set('diameter')} placeholder='e.g., 3/8"' />
            <Input label="Length" type="text" value={line.length || ''} onChange={set('length')} placeholder="ft or m" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-navy-700">Condition</label>
            <div className="flex gap-1">
              {CONDITION_RATINGS.map(({ value, label, color }) => (
                <button key={value} onClick={() => onChange({ ...line, conditionRating: value })}
                  className={`flex-1 py-2 rounded text-xs font-medium transition-colors cursor-pointer
                    ${line.conditionRating === value
                      ? color === 'red' ? 'bg-red-500 text-white' : color === 'amber' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}>
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Age" type="text" value={line.age || ''} onChange={set('age')} placeholder="e.g., 3 years" />
            <Select label="Splice Type" value={line.spliceType || ''} onChange={set('spliceType')}>
              <option value="">Select...</option>
              {SPLICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-navy-700">Replacement Recommendation</label>
            <div className="flex gap-1.5 flex-wrap">
              {REPLACEMENT_RECS.map(({ value, label, color }) => (
                <button key={value} onClick={() => onChange({ ...line, replacementRec: value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
                    ${line.replacementRec === value
                      ? color === 'red' ? 'bg-red-500 text-white' : color === 'amber' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <TextArea label="Notes" value={line.notes || ''} onChange={set('notes')} placeholder="Condition details, wear points..." />
        </div>
      )}
    </div>
  )
}
