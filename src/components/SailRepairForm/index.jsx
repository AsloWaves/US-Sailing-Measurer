import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getSailRepair, saveSailRepair, getJob, getBoat } from '../../lib/db'
import { SAIL_TYPES, MATERIALS, CLOTH_TYPES, BATTEN_TYPES, CONDITION_RATINGS } from '../../lib/constants'
import Input, { Select, TextArea } from '../ui/Input'
import Button from '../ui/Button'
import RepairCard from './RepairCard'

const STEPS = ['Sail Info', 'Condition', 'Repairs', 'Review']

export default function SailRepairForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    sailType: '', sailNumber: '', sailMaker: '', sailModel: '',
    material: '', sailAge: '', overallCondition: 0,
    clothWeight: '', clothType: '', uvDamageNotes: '', recutHistory: '',
    recommendations: '', notes: '',
  })
  const [repairs, setRepairs] = useState([])
  const [jobData, setJobData] = useState(null)
  const [loaded, setLoaded] = useState(!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      if (id) {
        const existing = await getSailRepair(id)
        if (existing) {
          setData(existing)
          setRepairs(existing.repairs || [])
          setJobData({ jobId: existing.jobId, boatId: existing.boatId, boatName: existing.boatName })
        }
      }
      if (jobId) {
        const job = await getJob(jobId)
        if (job) {
          const boat = job.boatId ? await getBoat(job.boatId) : null
          setJobData({ jobId, boatId: job.boatId, boatName: job.boatName || boat?.name || '' })
        }
      }
      setLoaded(true)
    }
    load()
  }, [id, jobId])

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const addRepair = () => {
    setRepairs([...repairs, {
      id: uuidv4(), damageType: '', location: '', severity: 0,
      repairType: '', materialsUsed: '', timeSpent: '',
      beforeNotes: '', afterNotes: '', photoIds: [],
    }])
  }

  const handleSave = async () => {
    setSaving(true)
    const record = {
      ...data, id: id || uuidv4(), repairs,
      jobId: jobData?.jobId || '', boatId: jobData?.boatId || '',
      boatName: jobData?.boatName || '', date: new Date().toISOString().split('T')[0],
    }
    await saveSailRepair(record)
    navigate(jobData?.jobId ? `/job/${jobData.jobId}` : `/sail-repair/${record.id}`)
    setSaving(false)
  }

  if (!loaded) return <div className="text-center text-navy-400 py-12">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button onClick={() => i < step && setStep(i)} disabled={i > step}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors cursor-pointer
                ${i === step ? 'bg-navy-900 text-white' : i < step ? 'bg-ocean-500 text-white' : 'bg-navy-100 text-navy-400'}`}>
              {i < step ? '✓' : i + 1}
            </button>
            <span className={`text-xs hidden sm:inline ${i === step ? 'text-navy-900 font-medium' : 'text-navy-400'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`w-6 h-0.5 ${i < step ? 'bg-ocean-500' : 'bg-navy-200'}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Sail Identification</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Sail Type" value={data.sailType} onChange={set('sailType')}>
              <option value="">Select...</option>
              {Object.entries(SAIL_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
            <Input label="Sail Number" type="text" value={data.sailNumber} onChange={set('sailNumber')} />
            <Input label="Sail Maker" type="text" value={data.sailMaker} onChange={set('sailMaker')} />
            <Input label="Model" type="text" value={data.sailModel} onChange={set('sailModel')} />
            <Select label="Material" value={data.material} onChange={set('material')}>
              <option value="">Select...</option>
              {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
            <Input label="Sail Age" type="text" value={data.sailAge} onChange={set('sailAge')} placeholder="e.g., 5 years" />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Condition Assessment</h2>
          <div className="space-y-1">
            <label className="text-sm font-medium text-navy-700">Overall Condition</label>
            <div className="flex gap-1.5">
              {CONDITION_RATINGS.map(({ value, label, color }) => (
                <button key={value} onClick={() => setData({ ...data, overallCondition: value })}
                  className={`flex-1 py-3 rounded-lg text-xs font-medium transition-colors cursor-pointer
                    ${data.overallCondition === value
                      ? color === 'red' ? 'bg-red-500 text-white' : color === 'amber' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cloth Weight" type="text" value={data.clothWeight} onChange={set('clothWeight')} placeholder="e.g., 3.8 oz" />
            <Select label="Cloth Type" value={data.clothType} onChange={set('clothType')}>
              <option value="">Select...</option>
              {CLOTH_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <TextArea label="UV Damage Notes" value={data.uvDamageNotes} onChange={set('uvDamageNotes')} placeholder="UV degradation details..." />
          <TextArea label="Re-cut History" value={data.recutHistory} onChange={set('recutHistory')} placeholder="Previous re-cuts, modifications..." />
          <TextArea label="Notes" value={data.notes} onChange={set('notes')} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-900">Repairs ({repairs.length})</h2>
            <Button variant="secondary" onClick={addRepair}>+ Add Repair</Button>
          </div>
          {repairs.length === 0 && <p className="text-sm text-navy-400 text-center py-4">No repairs logged. Tap + to add damage/repair entries.</p>}
          {repairs.map((r, idx) => (
            <RepairCard key={r.id} repair={r}
              onChange={(u) => { const a = [...repairs]; a[idx] = u; setRepairs(a) }}
              onRemove={() => setRepairs(repairs.filter((_, i) => i !== idx))} />
          ))}
          <TextArea label="Recommendations" value={data.recommendations} onChange={set('recommendations')} placeholder="Recommended actions..." />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Review</h2>
          <p className="text-sm text-navy-500">
            {SAIL_TYPES[data.sailType]?.label || 'Sail'} — {data.sailMaker} {data.sailModel}
            {data.sailNumber ? ` #${data.sailNumber}` : ''}
          </p>
          <p className="text-sm text-navy-500">{repairs.length} repair{repairs.length !== 1 ? 's' : ''} logged</p>
          {repairs.map(r => (
            <div key={r.id} className="flex justify-between py-2 border-b border-navy-50">
              <span className="text-sm text-navy-900">{r.damageType || 'Untyped'} — {r.location || 'No location'}</span>
              <span className="text-xs text-navy-500">{r.repairType || 'No repair'}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-navy-100">
        {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)}>Next</Button>
        ) : (
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        )}
      </div>
    </div>
  )
}
