import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBoat, deleteBoat, getJobsByBoat } from '../lib/db'
import { JOB_TYPES, JOB_STATUSES } from '../lib/constants'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function BoatDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [boat, setBoat] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    async function load() {
      const b = await getBoat(id)
      setBoat(b)
      if (b) {
        const j = await getJobsByBoat(id)
        setJobs(j.sort((a, b) => (b.date || '').localeCompare(a.date || '')))
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="text-center text-navy-400 py-12">Loading...</div>
  if (!boat) return <div className="text-center text-navy-400 py-12">Boat not found.</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">{boat.name}</h1>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-navy-500 mb-2">Vessel Info</h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <Row label="Class" value={boat.boatClass} />
          <Row label="Sail #" value={boat.sailNumber} />
          <Row label="HIN" value={boat.hullId} />
          <Row label="Rig" value={boat.rigType} />
          <Row label="Mast" value={boat.mastMaterial} />
          <Row label="LOA" value={boat.loa ? `${boat.loa} ft` : null} />
          <Row label="Owner" value={boat.ownerName} />
          <Row label="Phone" value={boat.ownerPhone} />
          <Row label="Email" value={boat.ownerEmail} />
          <Row label="Port" value={boat.homePort} />
        </div>
        {boat.notes && <p className="text-sm text-navy-600 mt-3 whitespace-pre-wrap">{boat.notes}</p>}
      </Card>

      {/* Jobs for this boat */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-900">Jobs</h2>
        <Link to={`/jobs/new?boatId=${id}`}><Button>+ New Job</Button></Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-navy-400 text-center py-6">No jobs yet for this boat</p>
      ) : (
        <div className="space-y-2">
          {jobs.map((j) => {
            const statusDef = JOB_STATUSES[j.status] || JOB_STATUSES.open
            return (
              <Card key={j.id} className="p-3" onClick={() => navigate(`/job/${j.id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-navy-900">{j.date}</div>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {(j.jobTypes || []).map((t) => (
                        <span key={t} className="text-xs text-navy-500">
                          {JOB_TYPES[t]?.icon} {JOB_TYPES[t]?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Badge status={statusDef.badge}>{statusDef.label}</Badge>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-navy-100">
        <Link to={`/boat/${id}/edit`} className="flex-1">
          <Button variant="secondary" className="w-full">Edit Boat</Button>
        </Link>
        <Button variant="danger" onClick={() => setShowDelete(true)}>Delete</Button>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">Delete Boat?</h3>
            <p className="text-sm text-navy-600 mb-4">This won't delete associated jobs or measurements.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={async () => { await deleteBoat(id); navigate('/boats') }}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <>
      <span className="text-navy-400">{label}</span>
      <span className="text-navy-900">{value}</span>
    </>
  )
}
