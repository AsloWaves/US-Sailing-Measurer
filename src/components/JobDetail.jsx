import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getJob, deleteJob, getBoat } from '../lib/db'
import { JOB_TYPES, JOB_STATUSES } from '../lib/constants'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [boat, setBoat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    async function load() {
      const j = await getJob(id)
      setJob(j)
      if (j?.boatId) {
        setBoat(await getBoat(j.boatId))
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleStatusChange = async (newStatus) => {
    const { saveJob } = await import('../lib/db')
    const updated = { ...job, status: newStatus }
    await saveJob(updated)
    setJob(updated)
  }

  if (loading) return <div className="text-center text-navy-400 py-12">Loading...</div>
  if (!job) return <div className="text-center text-navy-400 py-12">Job not found.</div>

  const statusDef = JOB_STATUSES[job.status] || JOB_STATUSES.open

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy-900">{job.boatName || 'Job'}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-navy-500">{job.date}</span>
          {job.location && <span className="text-sm text-navy-400">- {job.location}</span>}
          <Badge status={statusDef.badge}>{statusDef.label}</Badge>
        </div>
      </div>

      {/* Status changer */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-navy-500 mb-2">Status</h3>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(JOB_STATUSES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => handleStatusChange(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
                ${job.status === key
                  ? 'bg-navy-900 text-white'
                  : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Boat info */}
      {boat && (
        <Card className="p-4" onClick={() => navigate(`/boat/${boat.id}`)}>
          <h3 className="text-sm font-medium text-navy-500 mb-1">Boat</h3>
          <div className="text-sm text-navy-900 font-medium">{boat.name}</div>
          <div className="flex gap-3 text-xs text-navy-500 mt-0.5">
            {boat.boatClass && <span>{boat.boatClass}</span>}
            {boat.rigType && <span>{boat.rigType}</span>}
            {boat.ownerName && <span>{boat.ownerName}</span>}
          </div>
        </Card>
      )}

      {/* Work types */}
      {(job.jobTypes || []).length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-navy-500 mb-2">Work Performed</h3>
          <div className="space-y-2">
            {job.jobTypes.map((t) => {
              const typeDef = JOB_TYPES[t]
              if (!typeDef) return null
              return (
                <div key={t} className="flex items-center justify-between py-2 border-b border-navy-50 last:border-0">
                  <span className="text-sm text-navy-900">{typeDef.icon} {typeDef.label}</span>
                  <span className="text-xs text-navy-400">Coming in next update</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Notes */}
      {job.notes && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-navy-500 mb-1">Notes</h3>
          <p className="text-sm text-navy-700 whitespace-pre-wrap">{job.notes}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-navy-100">
        <Link to={`/job/${id}/edit`} className="flex-1">
          <Button variant="secondary" className="w-full">Edit Job</Button>
        </Link>
        <Button variant="danger" onClick={() => setShowDelete(true)}>Delete</Button>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">Delete Job?</h3>
            <p className="text-sm text-navy-600 mb-4">This will remove the job record.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={async () => { await deleteJob(id); navigate('/') }}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
