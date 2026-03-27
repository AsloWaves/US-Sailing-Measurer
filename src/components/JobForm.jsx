import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getJob, saveJob, getAllBoats, getBoat } from '../lib/db'
import { JOB_TYPES } from '../lib/constants'
import Input, { Select, TextArea } from './ui/Input'
import Button from './ui/Button'

export default function JobForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [boats, setBoats] = useState([])
  const [data, setData] = useState({
    boatId: searchParams.get('boatId') || '',
    boatName: '',
    date: new Date().toISOString().split('T')[0],
    jobTypes: [],
    status: 'open',
    location: '',
    notes: '',
  })
  const [loaded, setLoaded] = useState(!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getAllBoats().then(setBoats)
    if (id) {
      getJob(id).then((j) => { if (j) setData(j); setLoaded(true) })
    }
  }, [id])

  // Pre-fill boat name when boatId is set
  useEffect(() => {
    if (data.boatId && !data.boatName) {
      getBoat(data.boatId).then((b) => {
        if (b) setData(d => ({ ...d, boatName: b.name }))
      })
    }
  }, [data.boatId, data.boatName])

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const toggleJobType = (type) => {
    const types = data.jobTypes.includes(type)
      ? data.jobTypes.filter(t => t !== type)
      : [...data.jobTypes, type]
    setData({ ...data, jobTypes: types })
  }

  const handleBoatChange = (e) => {
    const boatId = e.target.value
    const boat = boats.find(b => b.id === boatId)
    setData({ ...data, boatId, boatName: boat?.name || '' })
  }

  const handleSave = async () => {
    if (!data.boatId || !data.date) return
    setSaving(true)
    const job = { ...data, id: id || uuidv4() }
    await saveJob(job)
    navigate(`/job/${job.id}`)
    setSaving(false)
  }

  if (!loaded) return <div className="text-center text-navy-400 py-12">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">{id ? 'Edit Job' : 'New Job'}</h1>

      <div className="space-y-4">
        <Select label="Boat" value={data.boatId} onChange={handleBoatChange}>
          <option value="">Select a boat...</option>
          {boats.map(b => (
            <option key={b.id} value={b.id}>{b.name} {b.boatClass ? `(${b.boatClass})` : ''}</option>
          ))}
        </Select>

        {boats.length === 0 && (
          <p className="text-xs text-navy-400">
            No boats yet.{' '}
            <button onClick={() => navigate('/boats/new')} className="text-ocean-500 underline cursor-pointer">
              Create a boat first
            </button>
          </p>
        )}

        <Input label="Date" type="date" value={data.date} onChange={set('date')} />
        <Input label="Location" type="text" value={data.location} onChange={set('location')} placeholder="e.g., Marina del Rey" />

        {/* Job type multi-select */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy-700">Work Type(s)</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(JOB_TYPES).map(([key, { label, icon }]) => (
              <button
                key={key}
                onClick={() => toggleJobType(key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left
                  ${data.jobTypes.includes(key)
                    ? 'bg-navy-900 text-white'
                    : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <TextArea label="Notes" value={data.notes} onChange={set('notes')} placeholder="Job notes..." />
      </div>

      <div className="flex gap-3 pt-4 border-t border-navy-100">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <div className="flex-1" />
        <Button onClick={handleSave} disabled={!data.boatId || saving}>
          {saving ? 'Saving...' : 'Save Job'}
        </Button>
      </div>
    </div>
  )
}
