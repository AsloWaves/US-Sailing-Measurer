import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getStandingRigging, saveStandingRigging, getJob, getBoat } from '../../lib/db'
import { STANDING_RIGGING_COMPONENTS, CONDITION_RATINGS } from '../../lib/constants'
import { useSettings } from '../../context/SettingsContext'
import Button from '../ui/Button'
import { TextArea } from '../ui/Input'
import ComponentCard from './ComponentCard'

const STEPS = ['Select Components', 'Inspect', 'Assessment', 'Review']

export default function StandingRiggingForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')
  const navigate = useNavigate()
  const { measurerName } = useSettings()

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState([])
  const [components, setComponents] = useState([])
  const [overallCondition, setOverallCondition] = useState(0)
  const [recommendations, setRecommendations] = useState('')
  const [notes, setNotes] = useState('')
  const [jobData, setJobData] = useState(null)
  const [loaded, setLoaded] = useState(!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      if (id) {
        const existing = await getStandingRigging(id)
        if (existing) {
          setSelected(existing.components.map(c => c.componentType))
          setComponents(existing.components)
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

  const toggleComponent = (key) => {
    if (selected.includes(key)) {
      setSelected(selected.filter(k => k !== key))
    } else {
      setSelected([...selected, key])
    }
  }

  // Sync selected list to components array
  useEffect(() => {
    if (step === 1 && selected.length > 0) {
      const existing = Object.fromEntries(components.map(c => [c.componentType, c]))
      const updated = selected.map(key => existing[key] || {
        id: uuidv4(),
        componentType: key,
        label: STANDING_RIGGING_COMPONENTS[key]?.label || key,
        wireType: '', material: '', diameter: '', length: '',
        conditionRating: 0, tensionReading: '', notes: '',
        age: '', hardwareBrand: '', hardwareModel: '', turnbuckleType: '',
        photoIds: [],
      })
      setComponents(updated)
    }
  }, [step, selected])

  const updateComponent = (idx) => (updated) => {
    const arr = [...components]
    arr[idx] = updated
    setComponents(arr)
  }

  const handleSave = async () => {
    setSaving(true)
    const record = {
      id: id || uuidv4(),
      jobId: jobData?.jobId || '',
      boatId: jobData?.boatId || '',
      boatName: jobData?.boatName || '',
      date: new Date().toISOString().split('T')[0],
      inspectorName: measurerName,
      components,
      overallCondition,
      recommendations,
      notes,
    }
    await saveStandingRigging(record)
    navigate(jobData?.jobId ? `/job/${jobData.jobId}` : `/standing-rigging/${record.id}`)
    setSaving(false)
  }

  if (!loaded) return <div className="text-center text-navy-400 py-12">Loading...</div>

  // Group components by category for step 0
  const categories = {}
  Object.entries(STANDING_RIGGING_COMPONENTS).forEach(([key, def]) => {
    if (!categories[def.category]) categories[def.category] = []
    categories[def.category].push({ key, ...def })
  })

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors cursor-pointer
                ${i === step ? 'bg-navy-900 text-white' : i < step ? 'bg-ocean-500 text-white' : 'bg-navy-100 text-navy-400'}`}
            >
              {i < step ? '✓' : i + 1}
            </button>
            <span className={`text-xs hidden sm:inline ${i === step ? 'text-navy-900 font-medium' : 'text-navy-400'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`w-6 h-0.5 ${i < step ? 'bg-ocean-500' : 'bg-navy-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Select components */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Select Components to Inspect</h2>
          {Object.entries(categories).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="text-sm font-medium text-navy-500 mb-2">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleComponent(key)}
                    className={`px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer
                      ${selected.includes(key) ? 'bg-navy-900 text-white' : 'bg-white border border-navy-200 text-navy-700 hover:bg-navy-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Component details */}
      {step === 1 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-navy-900">Inspect Components ({components.length})</h2>
          {components.map((comp, idx) => (
            <ComponentCard key={comp.id} component={comp} onChange={updateComponent(idx)} />
          ))}
        </div>
      )}

      {/* Step 2: Overall assessment */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Overall Assessment</h2>
          <div className="space-y-1">
            <label className="text-sm font-medium text-navy-700">Overall Rig Condition</label>
            <div className="flex gap-1.5">
              {CONDITION_RATINGS.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setOverallCondition(value)}
                  className={`flex-1 py-3 rounded-lg text-xs font-medium transition-colors cursor-pointer
                    ${overallCondition === value
                      ? color === 'red' ? 'bg-red-500 text-white' : color === 'amber' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <TextArea label="Recommendations" value={recommendations} onChange={(e) => setRecommendations(e.target.value)} placeholder="Recommended actions, replacements, timeline..." />
          <TextArea label="Additional Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="General inspection notes..." />
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Review Inspection</h2>
          <p className="text-sm text-navy-500">{components.length} components inspected</p>
          {components.map((c) => {
            const cond = CONDITION_RATINGS.find(r => r.value === c.conditionRating)
            return (
              <div key={c.id} className="flex justify-between py-2 border-b border-navy-50">
                <span className="text-sm text-navy-900">{c.label}</span>
                <span className={`text-xs font-medium ${cond?.color === 'red' ? 'text-red-600' : cond?.color === 'amber' ? 'text-amber-600' : 'text-green-600'}`}>
                  {cond?.label || 'Not rated'}
                </span>
              </div>
            )
          })}
          {recommendations && <div className="text-sm text-navy-700"><strong>Recommendations:</strong> {recommendations}</div>}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4 border-t border-navy-100">
        {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 0 && selected.length === 0}>Next</Button>
        ) : (
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Inspection'}</Button>
        )}
      </div>
    </div>
  )
}
