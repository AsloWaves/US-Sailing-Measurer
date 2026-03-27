import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { saveMeasurement, getMeasurement, saveDraft, getDraft, clearDraft } from '../../lib/db'
import { calculateArea } from '../../lib/calculations'
import Button from '../ui/Button'
import BoatInfo from './BoatInfo'
import SailTypeSelect from './SailTypeSelect'
import MeasurementInputs from './MeasurementInputs'
import ReviewSummary from './ReviewSummary'

const STEPS = ['Boat Info', 'Sail Type', 'Measurements', 'Review']

const emptyData = () => ({
  boatName: '',
  boatClass: '',
  sailNumber: '',
  ownerName: '',
  sailMaker: '',
  sailModel: '',
  material: '',
  ratingSystem: '',
  measurementDate: new Date().toISOString().split('T')[0],
  measurerName: '',
  measurerCert: '',
  notes: '',
  sailType: '',
  measurements: {},
})

export default function MeasurementForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState(emptyData)
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)

  // Load existing measurement for edit, or check for draft
  useEffect(() => {
    async function load() {
      if (id) {
        const existing = await getMeasurement(id)
        if (existing) {
          setData(existing)
          setLoaded(true)
          return
        }
      }
      // Check for draft
      const draft = await getDraft()
      if (draft && !id) {
        setData(draft)
      }
      setLoaded(true)
    }
    load()
  }, [id])

  // Auto-save draft (debounced)
  useEffect(() => {
    if (!loaded || id) return // don't overwrite draft when editing existing
    const timer = setTimeout(() => {
      saveDraft(data)
    }, 500)
    return () => clearTimeout(timer)
  }, [data, loaded, id])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const area = calculateArea(data.sailType, data.measurements)
      const measurement = {
        ...data,
        id: id || uuidv4(),
        calculatedArea: area,
        syncStatus: 'pending',
      }
      await saveMeasurement(measurement)
      await clearDraft()
      navigate(`/measurement/${measurement.id}`)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }, [data, id, navigate])

  const canNext = () => {
    switch (step) {
      case 0: return Boolean(data.boatName)
      case 1: return Boolean(data.sailType)
      case 2: return true
      default: return false
    }
  }

  if (!loaded) {
    return <div className="text-center text-navy-400 py-12">Loading...</div>
  }

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
                ${i === step
                  ? 'bg-navy-900 text-white'
                  : i < step
                    ? 'bg-ocean-500 text-white'
                    : 'bg-navy-100 text-navy-400'
                }`}
            >
              {i < step ? '✓' : i + 1}
            </button>
            <span className={`text-xs hidden sm:inline ${i === step ? 'text-navy-900 font-medium' : 'text-navy-400'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-0.5 ${i < step ? 'bg-ocean-500' : 'bg-navy-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 0 && (
        <BoatInfo data={data} onChange={setData} />
      )}
      {step === 1 && (
        <SailTypeSelect
          selected={data.sailType}
          onSelect={(type) => setData({ ...data, sailType: type })}
        />
      )}
      {step === 2 && (
        <MeasurementInputs
          sailType={data.sailType}
          measurements={data.measurements}
          onChange={(m) => setData({ ...data, measurements: m })}
        />
      )}
      {step === 3 && (
        <ReviewSummary data={data} />
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-4 border-t border-navy-100">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Measurement'}
          </Button>
        )}
      </div>
    </div>
  )
}
