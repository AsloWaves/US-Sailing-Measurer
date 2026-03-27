import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getSailRepair, deleteSailRepair } from '../lib/db'
import { SAIL_TYPES, CONDITION_RATINGS } from '../lib/constants'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function SailRepairDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => { getSailRepair(id).then(r => { setData(r); setLoading(false) }) }, [id])

  if (loading) return <div className="text-center text-navy-400 py-12">Loading...</div>
  if (!data) return <div className="text-center text-navy-400 py-12">Not found.</div>

  const overallCond = CONDITION_RATINGS.find(r => r.value === data.overallCondition)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Sail Repair / Condition</h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {data.boatName && <Badge status="info">{data.boatName}</Badge>}
          {data.sailType && <Badge status="info">{SAIL_TYPES[data.sailType]?.label}</Badge>}
          <span className="text-sm text-navy-500">{data.date}</span>
        </div>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-navy-500 mb-2">Sail Details</h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          {data.sailMaker && <><span className="text-navy-400">Maker</span><span className="text-navy-900">{data.sailMaker}</span></>}
          {data.sailModel && <><span className="text-navy-400">Model</span><span className="text-navy-900">{data.sailModel}</span></>}
          {data.sailNumber && <><span className="text-navy-400">Number</span><span className="text-navy-900">{data.sailNumber}</span></>}
          {data.material && <><span className="text-navy-400">Material</span><span className="text-navy-900">{data.material}</span></>}
          {data.sailAge && <><span className="text-navy-400">Age</span><span className="text-navy-900">{data.sailAge}</span></>}
          {data.clothWeight && <><span className="text-navy-400">Cloth</span><span className="text-navy-900">{data.clothWeight} {data.clothType}</span></>}
        </div>
        {overallCond && (
          <div className="mt-3">
            <Badge status={overallCond.color === 'red' ? 'error' : overallCond.color === 'amber' ? 'pending' : 'synced'}>
              Overall: {overallCond.label}
            </Badge>
          </div>
        )}
      </Card>

      {(data.repairs || []).length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-navy-500 mb-2">Repairs ({data.repairs.length})</h3>
          <div className="space-y-3">
            {data.repairs.map(r => {
              const sev = CONDITION_RATINGS.find(c => c.value === r.severity)
              return (
                <div key={r.id} className="border-b border-navy-50 pb-2 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-navy-900">{r.damageType || 'Damage'}</span>
                    {sev && <Badge status={sev.color === 'red' ? 'error' : sev.color === 'amber' ? 'pending' : 'synced'}>Severity: {sev.value}</Badge>}
                  </div>
                  <div className="text-xs text-navy-500 mt-0.5">
                    {r.location && <span>{r.location}</span>}
                    {r.repairType && <span> — {r.repairType}</span>}
                    {r.timeSpent && <span> ({r.timeSpent})</span>}
                  </div>
                  {r.materialsUsed && <p className="text-xs text-navy-600 mt-1">Materials: {r.materialsUsed}</p>}
                  {r.beforeNotes && <p className="text-xs text-navy-600">Before: {r.beforeNotes}</p>}
                  {r.afterNotes && <p className="text-xs text-navy-600">After: {r.afterNotes}</p>}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {data.uvDamageNotes && <Card className="p-4"><h3 className="text-sm font-medium text-navy-500 mb-1">UV Damage</h3><p className="text-sm text-navy-700">{data.uvDamageNotes}</p></Card>}
      {data.recommendations && <Card className="p-4"><h3 className="text-sm font-medium text-navy-500 mb-1">Recommendations</h3><p className="text-sm text-navy-700">{data.recommendations}</p></Card>}

      <div className="flex gap-3 pt-4 border-t border-navy-100">
        <Link to={`/sail-repair/${id}/edit`} className="flex-1">
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
              <Button variant="danger" className="flex-1" onClick={async () => { await deleteSailRepair(id); navigate(data.jobId ? `/job/${data.jobId}` : '/') }}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
