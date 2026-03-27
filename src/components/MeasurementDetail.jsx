import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getMeasurement, deleteMeasurement } from '../lib/db'
import { useSettings } from '../context/SettingsContext'
import { useGitHub } from '../hooks/useGitHub'
import { SAIL_TYPES, MEASUREMENT_DEFS } from '../lib/constants'
import { formatMeasurement, formatArea, unitLabel, areaUnitLabel } from '../lib/calculations'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function MeasurementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { units } = useSettings()
  const { syncMeasurement, syncing, isAuthenticated } = useGitHub()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [syncMsg, setSyncMsg] = useState(null)

  useEffect(() => {
    getMeasurement(id).then((m) => {
      setData(m)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    await deleteMeasurement(id)
    navigate('/')
  }

  if (loading) return <div className="text-center text-navy-400 py-12">Loading...</div>
  if (!data) return <div className="text-center text-navy-400 py-12">Measurement not found.</div>

  const sailDef = SAIL_TYPES[data.sailType]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{data.boatName || 'Untitled'}</h1>
          <div className="flex items-center gap-2 mt-1">
            {sailDef && (
              <Badge status="info">{sailDef.icon} {sailDef.label}</Badge>
            )}
            <Badge status={data.syncStatus || 'pending'}>
              {data.syncStatus === 'synced' ? 'Synced' : data.syncStatus === 'error' ? 'Error' : 'Pending'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Boat info */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-navy-500 mb-2">Boat & Session</h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <DetailRow label="Class" value={data.boatClass} />
          <DetailRow label="Sail #" value={data.sailNumber} />
          <DetailRow label="Owner" value={data.ownerName} />
          <DetailRow label="Sail Maker" value={data.sailMaker} />
          <DetailRow label="Model" value={data.sailModel} />
          <DetailRow label="Material" value={data.material} />
          <DetailRow label="Rating" value={data.ratingSystem} />
          <DetailRow label="Date" value={data.measurementDate} />
          <DetailRow label="Measurer" value={data.measurerName} />
          <DetailRow label="Cert #" value={data.measurerCert} />
        </div>
      </Card>

      {/* Measurements */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-navy-500">Measurements</h3>
          <Badge status="info">{unitLabel(units)}</Badge>
        </div>
        <div className="space-y-1">
          {sailDef?.measurements.map((abbr) => {
            const def = MEASUREMENT_DEFS[abbr]
            const val = data.measurements?.[abbr]
            return (
              <div key={abbr} className="flex justify-between py-1.5 border-b border-navy-50 last:border-0">
                <span className="text-sm text-navy-600">
                  <span className="font-bold text-navy-900">{abbr}</span>{' '}
                  {def?.label}
                </span>
                <span className="text-sm font-mono text-navy-900">
                  {formatMeasurement(val, units)} {unitLabel(units)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Area */}
      {data.calculatedArea != null && (
        <Card className="p-4 bg-ocean-50 border-ocean-200">
          <h3 className="text-sm font-medium text-navy-500 mb-1">Calculated Sail Area</h3>
          <div className="text-2xl font-bold text-navy-900">
            {formatArea(data.calculatedArea, 'metric')} m{'\u00B2'}
          </div>
          <div className="text-sm text-navy-500 mt-1">
            {formatArea(data.calculatedArea, 'imperial')} ft{'\u00B2'}
          </div>
        </Card>
      )}

      {/* Notes */}
      {data.notes && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-navy-500 mb-1">Notes</h3>
          <p className="text-sm text-navy-700 whitespace-pre-wrap">{data.notes}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-navy-100">
        <Link to={`/measurement/${id}/edit`} className="flex-1">
          <Button variant="secondary" className="w-full">Edit</Button>
        </Link>
        {isAuthenticated && (
          <Button
            variant="secondary"
            disabled={syncing || data.syncStatus === 'synced'}
            onClick={async () => {
              const ok = await syncMeasurement(data)
              setSyncMsg(ok ? 'Synced!' : 'Sync failed')
              if (ok) setData({ ...data, syncStatus: 'synced' })
              setTimeout(() => setSyncMsg(null), 3000)
            }}
          >
            {syncing ? 'Syncing...' : data.syncStatus === 'synced' ? 'Synced' : 'Sync to GitHub'}
          </Button>
        )}
        <Button variant="danger" onClick={() => setShowDelete(true)}>
          Delete
        </Button>
      </div>
      {syncMsg && (
        <p className={`text-sm text-center ${syncMsg === 'Synced!' ? 'text-sync-green' : 'text-sync-red'}`}>
          {syncMsg}
        </p>
      )}

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">Delete Measurement?</h3>
            <p className="text-sm text-navy-600 mb-4">
              This will permanently remove this measurement from local storage.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowDelete(false)}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value }) {
  if (!value) return null
  return (
    <>
      <span className="text-navy-400">{label}</span>
      <span className="text-navy-900">{value}</span>
    </>
  )
}
