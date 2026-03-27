import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMeasurements } from '../hooks/useMeasurements'
import { useSettings } from '../context/SettingsContext'
import { SAIL_TYPES } from '../lib/constants'
import { formatArea } from '../lib/calculations'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function Dashboard() {
  const { measurements, loading } = useMeasurements()
  const { units } = useSettings()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = measurements.filter((m) => {
    if (search && !m.boatName?.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter && m.sailType !== typeFilter) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Measurements</h1>
        <Link to="/new">
          <Button>+ New</Button>
        </Link>
      </div>

      {/* Search & filter */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search boat name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm
            placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-ocean-400"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-navy-200 bg-white px-2 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-ocean-400"
        >
          <option value="">All types</option>
          {Object.entries(SAIL_TYPES).map(([key, sail]) => (
            <option key={key} value={key}>{sail.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center text-navy-400 py-12">Loading measurements...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">⛵</div>
          <p className="text-navy-500">No measurements yet</p>
          <p className="text-sm text-navy-400">Tap + New to record your first sail measurement</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const sailDef = SAIL_TYPES[m.sailType]
            return (
              <Card
                key={m.id}
                className="p-4"
                onClick={() => navigate(`/measurement/${m.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-navy-900 truncate">{m.boatName || 'Untitled'}</span>
                      <Badge status={m.syncStatus || 'pending'}>
                        {m.syncStatus === 'synced' ? 'Synced' : m.syncStatus === 'error' ? 'Error' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-navy-500">
                      {sailDef && (
                        <span>{sailDef.icon} {sailDef.label}</span>
                      )}
                      {m.boatClass && <span>{m.boatClass}</span>}
                      {m.measurementDate && <span>{m.measurementDate}</span>}
                    </div>
                  </div>
                  {m.calculatedArea != null && (
                    <div className="text-right ml-3">
                      <div className="text-sm font-mono font-medium text-navy-900">
                        {formatArea(m.calculatedArea, units)}
                      </div>
                      <div className="text-xs text-navy-400">
                        {units === 'm' ? 'm\u00B2' : 'ft\u00B2'}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
