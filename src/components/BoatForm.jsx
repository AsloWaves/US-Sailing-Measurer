import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getBoat, saveBoat } from '../lib/db'
import { RIG_TYPES, MAST_MATERIALS } from '../lib/constants'
import Input, { Select, TextArea } from './ui/Input'
import Button from './ui/Button'

export default function BoatForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: '', boatClass: '', sailNumber: '', hullId: '',
    ownerName: '', ownerPhone: '', ownerEmail: '', homePort: '',
    rigType: '', mastMaterial: '', loa: '', notes: '',
  })
  const [loaded, setLoaded] = useState(!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      getBoat(id).then((b) => { if (b) setData(b); setLoaded(true) })
    }
  }, [id])

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const handleSave = async () => {
    if (!data.name) return
    setSaving(true)
    const boat = { ...data, id: id || uuidv4() }
    await saveBoat(boat)
    navigate(`/boat/${boat.id}`)
    setSaving(false)
  }

  if (!loaded) return <div className="text-center text-navy-400 py-12">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">{id ? 'Edit Boat' : 'New Boat'}</h1>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Boat Name" type="text" value={data.name} onChange={set('name')} placeholder="e.g., Windchaser" required />
          <Input label="Class / Design" type="text" value={data.boatClass} onChange={set('boatClass')} placeholder="e.g., J/105" />
          <Input label="Sail Number" type="text" value={data.sailNumber} onChange={set('sailNumber')} placeholder="e.g., USA 12345" />
          <Input label="Hull ID (HIN)" type="text" value={data.hullId} onChange={set('hullId')} />
        </div>

        <div className="border-t border-navy-100 pt-4">
          <h3 className="text-sm font-medium text-navy-600 mb-3">Owner</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Owner Name" type="text" value={data.ownerName} onChange={set('ownerName')} />
            <Input label="Phone" type="tel" value={data.ownerPhone} onChange={set('ownerPhone')} />
            <Input label="Email" type="email" value={data.ownerEmail} onChange={set('ownerEmail')} />
            <Input label="Home Port" type="text" value={data.homePort} onChange={set('homePort')} />
          </div>
        </div>

        <div className="border-t border-navy-100 pt-4">
          <h3 className="text-sm font-medium text-navy-600 mb-3">Vessel Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Rig Type" value={data.rigType} onChange={set('rigType')}>
              <option value="">Select...</option>
              {RIG_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
            <Select label="Mast Material" value={data.mastMaterial} onChange={set('mastMaterial')}>
              <option value="">Select...</option>
              {MAST_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
            <Input label="LOA (ft)" type="number" value={data.loa} onChange={set('loa')} placeholder="0" />
          </div>
        </div>

        <TextArea label="Notes" value={data.notes} onChange={set('notes')} placeholder="General notes about this vessel..." />
      </div>

      <div className="flex gap-3 pt-4 border-t border-navy-100">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <div className="flex-1" />
        <Button onClick={handleSave} disabled={!data.name || saving}>
          {saving ? 'Saving...' : 'Save Boat'}
        </Button>
      </div>
    </div>
  )
}
