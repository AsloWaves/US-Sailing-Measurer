import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getJob, deleteJob, getBoat, getStandingRiggingByJob, getRunningRiggingByJob, getSailRepairsByJob, getMeasurementsByJob } from '../lib/db'
import { JOB_TYPES, JOB_STATUSES, CONDITION_RATINGS, SAIL_TYPES } from '../lib/constants'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [boat, setBoat] = useState(null)
  const [records, setRecords] = useState({ standing: [], running: [], sailRepairs: [], measurements: [] })
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    async function load() {
      const j = await getJob(id)
      setJob(j)
      if (j?.boatId) setBoat(await getBoat(j.boatId))
      setRecords({
        standing: await getStandingRiggingByJob(id),
        running: await getRunningRiggingByJob(id),
        sailRepairs: await getSailRepairsByJob(id),
        measurements: await getMeasurementsByJob(id),
      })
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
      <div>
        <h1 className="text-xl font-bold text-navy-900">{job.boatName || 'Job'}</h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-sm text-navy-500">{job.date}</span>
          {job.location && <span className="text-sm text-navy-400">- {job.location}</span>}
          <Badge status={statusDef.badge}>{statusDef.label}</Badge>
        </div>
      </div>

      {/* Status */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-navy-500 mb-2">Status</h3>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(JOB_STATUSES).map(([key, { label }]) => (
            <button key={key} onClick={() => handleStatusChange(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
                ${job.status === key ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}>
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

      {/* ─── Records Section ─── */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900">Records</h2>

        {/* Add record buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link to={`/standing-rigging/new?jobId=${id}`}>
            <Button variant="secondary" className="w-full text-xs">+ Standing Rigging</Button>
          </Link>
          <Link to={`/running-rigging/new?jobId=${id}`}>
            <Button variant="secondary" className="w-full text-xs">+ Running Rigging</Button>
          </Link>
          <Link to={`/sail-repair/new?jobId=${id}`}>
            <Button variant="secondary" className="w-full text-xs">+ Sail Repair</Button>
          </Link>
          <Link to={`/job/${id}/measurement/new`}>
            <Button variant="secondary" className="w-full text-xs">+ Sail Measurement</Button>
          </Link>
        </div>

        {/* Standing Rigging records */}
        {records.standing.map((r) => {
          const cond = CONDITION_RATINGS.find(c => c.value === r.overallCondition)
          return (
            <Card key={r.id} className="p-3" onClick={() => navigate(`/standing-rigging/${r.id}`)}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-navy-900">Standing Rigging Inspection</span>
                  <span className="text-xs text-navy-500 ml-2">{r.date}</span>
                </div>
                {cond && <Badge status={cond.color === 'red' ? 'error' : cond.color === 'amber' ? 'pending' : 'synced'}>{cond.label}</Badge>}
              </div>
              <p className="text-xs text-navy-500 mt-0.5">{r.components?.length || 0} components</p>
            </Card>
          )
        })}

        {/* Running Rigging records */}
        {records.running.map((r) => (
          <Card key={r.id} className="p-3" onClick={() => navigate(`/running-rigging/${r.id}`)}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-navy-900">Running Rigging Service</span>
                <span className="text-xs text-navy-500 ml-2">{r.date}</span>
              </div>
            </div>
            <p className="text-xs text-navy-500 mt-0.5">{r.lines?.length || 0} lines, {r.hardware?.length || 0} hardware</p>
          </Card>
        ))}

        {/* Sail Repair records */}
        {records.sailRepairs.map((r) => {
          const sailDef = SAIL_TYPES[r.sailType]
          return (
            <Card key={r.id} className="p-3" onClick={() => navigate(`/sail-repair/${r.id}`)}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-navy-900">Sail Repair</span>
                  {sailDef && <span className="text-xs text-navy-500 ml-2">{sailDef.label}</span>}
                  <span className="text-xs text-navy-500 ml-2">{r.date}</span>
                </div>
              </div>
              <p className="text-xs text-navy-500 mt-0.5">{r.repairs?.length || 0} repairs logged</p>
            </Card>
          )
        })}

        {/* Measurement records */}
        {records.measurements.map((m) => {
          const sailDef = SAIL_TYPES[m.sailType]
          return (
            <Card key={m.id} className="p-3" onClick={() => navigate(`/measurement/${m.id}`)}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-navy-900">Sail Measurement</span>
                  {sailDef && <span className="text-xs text-navy-500 ml-2">{sailDef.label}</span>}
                </div>
              </div>
            </Card>
          )
        })}

        {records.standing.length + records.running.length + records.sailRepairs.length + records.measurements.length === 0 && (
          <p className="text-sm text-navy-400 text-center py-4">No records yet. Use the buttons above to add inspections, repairs, or measurements.</p>
        )}
      </div>

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
            <p className="text-sm text-navy-600 mb-4">This will remove the job record. Linked records will not be deleted.</p>
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
