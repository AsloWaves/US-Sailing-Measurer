import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getRunningRigging, deleteRunningRigging } from '../lib/db'
import { CONDITION_RATINGS, REPLACEMENT_RECS } from '../lib/constants'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function RunningRiggingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => { getRunningRigging(id).then(r => { setData(r); setLoading(false) }) }, [id])

  if (loading) return <div className="text-center text-navy-400 py-12">Loading...</div>
  if (!data) return <div className="text-center text-navy-400 py-12">Not found.</div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Running Rigging Service</h1>
        <div className="flex items-center gap-2 mt-1">
          {data.boatName && <Badge status="info">{data.boatName}</Badge>}
          <span className="text-sm text-navy-500">{data.date}</span>
        </div>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-navy-500 mb-2">Lines ({data.lines?.length || 0})</h3>
        <div className="space-y-2">
          {(data.lines || []).map(l => {
            const cond = CONDITION_RATINGS.find(r => r.value === l.conditionRating)
            const repl = REPLACEMENT_RECS.find(r => r.value === l.replacementRec)
            return (
              <div key={l.id} className="border-b border-navy-50 pb-2 last:border-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-navy-900">{l.label}</span>
                  <div className="flex gap-1">
                    {cond && <Badge status={cond.color === 'red' ? 'error' : cond.color === 'amber' ? 'pending' : 'synced'}>{cond.label}</Badge>}
                    {repl && repl.value !== 'ok' && <Badge status={repl.color === 'red' ? 'error' : 'pending'}>{repl.label}</Badge>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 text-xs text-navy-500 mt-1">
                  {l.material && <span>{l.material}</span>}
                  {l.diameter && <span>{l.diameter}</span>}
                  {l.construction && <span>{l.construction}</span>}
                  {l.age && <span>Age: {l.age}</span>}
                  {l.spliceType && <span>Splice: {l.spliceType}</span>}
                </div>
                {l.notes && <p className="text-xs text-navy-600 mt-1">{l.notes}</p>}
              </div>
            )
          })}
        </div>
      </Card>

      {(data.hardware || []).length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-navy-500 mb-2">Hardware ({data.hardware.length})</h3>
          <div className="space-y-2">
            {data.hardware.map(h => (
              <div key={h.id} className="border-b border-navy-50 pb-2 last:border-0">
                <div className="text-sm font-medium text-navy-900">{h.hardwareType} {h.brand ? `- ${h.brand} ${h.model || ''}` : ''}</div>
                <div className="flex flex-wrap gap-x-4 text-xs text-navy-500 mt-0.5">
                  {h.location && <span>{h.location}</span>}
                  {h.size && <span>{h.size}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {data.recommendations && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-navy-500 mb-1">Recommendations</h3>
          <p className="text-sm text-navy-700 whitespace-pre-wrap">{data.recommendations}</p>
        </Card>
      )}

      <div className="flex gap-3 pt-4 border-t border-navy-100">
        <Link to={`/running-rigging/${id}/edit`} className="flex-1">
          <Button variant="secondary" className="w-full">Edit</Button>
        </Link>
        <Button variant="danger" onClick={() => setShowDelete(true)}>Delete</Button>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">Delete Record?</h3>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={async () => { await deleteRunningRigging(id); navigate(data.jobId ? `/job/${data.jobId}` : '/') }}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
