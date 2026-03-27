import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMeasurements } from '../hooks/useMeasurements'
import { useSettings } from '../context/SettingsContext'
import { SAIL_TYPES, RATING_SYSTEMS, MEASUREMENT_STATUSES } from '../lib/constants'
import { formatArea } from '../lib/calculations'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

const SORT_OPTIONS = [
  { key: 'date-desc', label: 'Newest first' },
  { key: 'date-asc', label: 'Oldest first' },
  { key: 'boat-asc', label: 'Boat A-Z' },
  { key: 'boat-desc', label: 'Boat Z-A' },
]

export default function Dashboard() {
  const { measurements, loading } = useMeasurements()
  const { units } = useSettings()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [sort, setSort] = useState('date-desc')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = measurements
    .filter((m) => {
      if (search) {
        const q = search.toLowerCase()
        const matchBoat = m.boatName?.toLowerCase().includes(q)
        const matchSailNum = m.sailNumber?.toLowerCase().includes(q)
        const matchClass = m.boatClass?.toLowerCase().includes(q)
        const matchOwner = m.ownerName?.toLowerCase().includes(q)
        if (!matchBoat && !matchSailNum && !matchClass && !matchOwner) return false
      }
      if (typeFilter && m.sailType !== typeFilter) return false
      if (statusFilter && (m.status || 'pending') !== statusFilter) return false
      if (ratingFilter && m.ratingSystem !== ratingFilter) return false
      return true
    })
    .sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return (a.measurementDate || '').localeCompare(b.measurementDate || '')
        case 'boat-asc':
          return (a.boatName || '').localeCompare(b.boatName || '')
        case 'boat-desc':
          return (b.boatName || '').localeCompare(a.boatName || '')
        default: // date-desc
          return (b.measurementDate || '').localeCompare(a.measurementDate || '')
      }
    })

  const activeFilterCount = [typeFilter, statusFilter, ratingFilter].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Measurements</h1>
        <Link to="/new">
          <Button>+ New</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search boat, owner, class, sail #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm
            placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-ocean-400"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer
            ${showFilters || activeFilterCount > 0
              ? 'bg-navy-900 text-white border-navy-900'
              : 'bg-white text-navy-600 border-navy-200 hover:bg-navy-50'}`}
        >
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <Card className="p-3 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-navy-200 bg-white px-2 py-2 text-xs
                focus:outline-none focus:ring-2 focus:ring-ocean-400"
            >
              <option value="">All sail types</option>
              {Object.entries(SAIL_TYPES).map(([key, sail]) => (
                <option key={key} value={key}>{sail.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-navy-200 bg-white px-2 py-2 text-xs
                focus:outline-none focus:ring-2 focus:ring-ocean-400"
            >
              <option value="">All statuses</option>
              {Object.entries(MEASUREMENT_STATUSES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="rounded-lg border border-navy-200 bg-white px-2 py-2 text-xs
                focus:outline-none focus:ring-2 focus:ring-ocean-400"
            >
              <option value="">All ratings</option>
              {RATING_SYSTEMS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-navy-200 bg-white px-2 py-2 text-xs
                focus:outline-none focus:ring-2 focus:ring-ocean-400"
            >
              {SORT_OPTIONS.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setTypeFilter(''); setStatusFilter(''); setRatingFilter('') }}
              className="text-xs text-ocean-500 hover:text-ocean-700 cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </Card>
      )}

      {/* Results count */}
      {!loading && measurements.length > 0 && (
        <p className="text-xs text-navy-400">
          {filtered.length} of {measurements.length} measurement{measurements.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center text-navy-400 py-12">Loading measurements...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">⛵</div>
          <p className="text-navy-500">
            {measurements.length === 0 ? 'No measurements yet' : 'No matches'}
          </p>
          <p className="text-sm text-navy-400">
            {measurements.length === 0
              ? 'Tap + New to record your first sail measurement'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const sailDef = SAIL_TYPES[m.sailType]
            const status = m.status || 'pending'
            const statusDef = MEASUREMENT_STATUSES[status]
            return (
              <Card
                key={m.id}
                className="p-4"
                onClick={() => navigate(`/measurement/${m.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-navy-900 truncate">{m.boatName || 'Untitled'}</span>
                      <Badge status={status}>
                        {statusDef?.label || 'Pending'}
                      </Badge>
                      {m.ratingSystem && (
                        <Badge status="info">{m.ratingSystem}</Badge>
                      )}
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
