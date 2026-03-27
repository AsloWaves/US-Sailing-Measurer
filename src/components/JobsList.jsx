import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useJobs } from '../hooks/useJobs'
import { JOB_TYPES, JOB_STATUSES } from '../lib/constants'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function JobsList() {
  const { jobs, loading } = useJobs()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = jobs.filter((j) => {
    if (search) {
      const q = search.toLowerCase()
      if (!j.boatName?.toLowerCase().includes(q) && !j.location?.toLowerCase().includes(q)) return false
    }
    if (statusFilter && j.status !== statusFilter) return false
    if (typeFilter && !(j.jobTypes || []).includes(typeFilter)) return false
    return true
  })

  const activeFilters = [statusFilter, typeFilter].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Jobs</h1>
        <Link to="/jobs/new"><Button>+ New Job</Button></Link>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search boat or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm
            placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-ocean-400"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer
            ${showFilters || activeFilters > 0
              ? 'bg-navy-900 text-white border-navy-900'
              : 'bg-white text-navy-600 border-navy-200 hover:bg-navy-50'}`}
        >
          Filters{activeFilters > 0 ? ` (${activeFilters})` : ''}
        </button>
      </div>

      {showFilters && (
        <Card className="p-3">
          <div className="grid grid-cols-2 gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-navy-200 bg-white px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ocean-400">
              <option value="">All statuses</option>
              {Object.entries(JOB_STATUSES).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-navy-200 bg-white px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ocean-400">
              <option value="">All work types</option>
              {Object.entries(JOB_TYPES).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
            </select>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => { setStatusFilter(''); setTypeFilter('') }}
              className="text-xs text-ocean-500 hover:text-ocean-700 cursor-pointer mt-2">
              Clear filters
            </button>
          )}
        </Card>
      )}

      {!loading && jobs.length > 0 && (
        <p className="text-xs text-navy-400">{filtered.length} of {jobs.length} job{jobs.length !== 1 ? 's' : ''}</p>
      )}

      {loading ? (
        <div className="text-center text-navy-400 py-12">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">&#128203;</div>
          <p className="text-navy-500">{jobs.length === 0 ? 'No jobs yet' : 'No matches'}</p>
          <p className="text-sm text-navy-400">
            {jobs.length === 0 ? 'Create a job to start recording work' : 'Try adjusting filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((j) => {
            const statusDef = JOB_STATUSES[j.status] || JOB_STATUSES.open
            return (
              <Card key={j.id} className="p-4" onClick={() => navigate(`/job/${j.id}`)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-navy-900 truncate">{j.boatName || 'No boat'}</span>
                      <Badge status={statusDef.badge}>{statusDef.label}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-navy-500">
                      <span>{j.date}</span>
                      {j.location && <span>{j.location}</span>}
                    </div>
                    {(j.jobTypes || []).length > 0 && (
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {j.jobTypes.map((t) => (
                          <Badge key={t} status="info">{JOB_TYPES[t]?.icon} {JOB_TYPES[t]?.label}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
