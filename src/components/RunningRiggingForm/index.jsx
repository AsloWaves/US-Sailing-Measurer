import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getRunningRigging, saveRunningRigging, getJob, getBoat } from '../../lib/db'
import { RUNNING_RIGGING_LINES, CONDITION_RATINGS } from '../../lib/constants'
import { useSettings } from '../../context/SettingsContext'
import Button from '../ui/Button'
import { TextArea } from '../ui/Input'
import LineCard from './LineCard'
import HardwareCard from './HardwareCard'

const STEPS = ['Select Lines', 'Line Details', 'Hardware', 'Review']

export default function RunningRiggingForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState([])
  const [lines, setLines] = useState([])
  const [hardware, setHardware] = useState([])
  const [overallCondition, setOverallCondition] = useState(0)
  const [recommendations, setRecommendations] = useState('')
  const [notes, setNotes] = useState('')
  const [jobData, setJobData] = useState(null)
  const [loaded, setLoaded] = useState(!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      if (id) {
        const existing = await getRunningRigging(id)
        if (existing) {
          setSelected(existing.lines.map(l => l.lineType))
          setLines(existing.lines)
          setHardware(existing.hardware || [])
          setOverallCondition(existing.overallCondition || 0)
          setRecommendations(existing.recommendations || '')
          setNotes(existing.notes || '')
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

  const toggleLine = (key) => {
    setSelected(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key])
  }

  useEffect(() => {
    if (step === 1 && selected.length > 0) {
      const existing = Object.fromEntries(lines.map(l => [l.lineType, l]))
      setLines(selected.map(key => existing[key] || {
        id: uuidv4(), lineType: key, label: RUNNING_RIGGING_LINES[key]?.label || key,
        material: '', construction: '', diameter: '', length: '',
        conditionRating: 0, age: '', spliceType: '', spliceLength: '',
        replacementRec: '', notes: '', photoIds: [],
      }))
    }
  }, [step, selected])

  const addHardware = () => {
    setHardware([...hardware, { id: uuidv4(), hardwareType: '', location: '', brand: '', model: '', size: '', conditionRating: 0, notes: '', photoIds: [] }])
  }

  const handleSave = async () => {
    setSaving(true)
    const record = {
      id: id || uuidv4(), jobId: jobData?.jobId || '', boatId: jobData?.boatId || '',
      boatName: jobData?.boatName || '', date: new Date().toISOString().split('T')[0],
      lines, hardware, overallCondition, recommendations, notes,
    }
    await saveRunningRigging(record)
    navigate(jobData?.jobId ? `/job/${jobData.jobId}` : `/running-rigging/${record.id}`)
    setSaving(false)
  }

  if (!loaded) return <div className="text-center text-navy-400 py-12">Loading...</div>

  const categories = {}
  Object.entries(RUNNING_RIGGING_LINES).forEach(([key, def]) => {
    if (!categories[def.category]) categories[def.category] = []
    categories[def.category].push({ key, ...def })
  })

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
          <h2 className="text-lg font-semibold text-navy-900">Select Lines to Document</h2>
          {Object.entries(categories).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="text-sm font-medium text-navy-500 mb-2">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map(({ key, label }) => (
                  <button key={key} onClick={() => toggleLine(key)}
                    className={`px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer
                      ${selected.includes(key) ? 'bg-navy-900 text-white' : 'bg-white border border-navy-200 text-navy-700 hover:bg-navy-50'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-navy-900">Line Details ({lines.length})</h2>
          {lines.map((line, idx) => (
            <LineCard key={line.id} line={line} onChange={(u) => { const a = [...lines]; a[idx] = u; setLines(a) }} />
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-900">Hardware ({hardware.length})</h2>
            <Button variant="secondary" onClick={addHardware}>+ Add Hardware</Button>
          </div>
          {hardware.length === 0 && <p className="text-sm text-navy-400 text-center py-4">No hardware items added. Tap + to add blocks, winches, clutches, etc.</p>}
          {hardware.map((item, idx) => (
            <HardwareCard key={item.id} item={item}
              onChange={(u) => { const a = [...hardware]; a[idx] = u; setHardware(a) }}
              onRemove={() => setHardware(hardware.filter((_, i) => i !== idx))} />
          ))}
          <div className="space-y-1 pt-4">
            <label className="text-sm font-medium text-navy-700">Overall Condition</label>
            <div className="flex gap-1.5">
              {CONDITION_RATINGS.map(({ value, label, color }) => (
                <button key={value} onClick={() => setOverallCondition(value)}
                  className={`flex-1 py-3 rounded-lg text-xs font-medium transition-colors cursor-pointer
                    ${overallCondition === value
                      ? color === 'red' ? 'bg-red-500 text-white' : color === 'amber' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <TextArea label="Recommendations" value={recommendations} onChange={(e) => setRecommendations(e.target.value)} />
          <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Review</h2>
          <p className="text-sm text-navy-500">{lines.length} lines, {hardware.length} hardware items</p>
          {lines.map(l => {
            const cond = CONDITION_RATINGS.find(r => r.value === l.conditionRating)
            return (
              <div key={l.id} className="flex justify-between py-2 border-b border-navy-50">
                <span className="text-sm text-navy-900">{l.label}</span>
                <span className={`text-xs font-medium ${cond?.color === 'red' ? 'text-red-600' : cond?.color === 'amber' ? 'text-amber-600' : 'text-green-600'}`}>
                  {cond?.label || 'Not rated'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-navy-100">
        {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 0 && selected.length === 0}>Next</Button>
        ) : (
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        )}
      </div>
    </div>
  )
}
