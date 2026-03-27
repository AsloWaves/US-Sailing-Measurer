import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBoats } from '../hooks/useBoats'
import Card from './ui/Card'
import Button from './ui/Button'

export default function BoatsList() {
  const { boats, loading } = useBoats()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = boats.filter((b) => {
    if (!search) return true
    const q = search.toLowerCase()
    return b.name?.toLowerCase().includes(q) ||
      b.ownerName?.toLowerCase().includes(q) ||
      b.boatClass?.toLowerCase().includes(q) ||
      b.sailNumber?.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Boats</h1>
        <Link to="/boats/new"><Button>+ New Boat</Button></Link>
      </div>

      <input
        type="text"
        placeholder="Search boats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm
          placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-ocean-400"
      />

      {loading ? (
        <div className="text-center text-navy-400 py-12">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">&#9875;</div>
          <p className="text-navy-500">{boats.length === 0 ? 'No boats yet' : 'No matches'}</p>
          <p className="text-sm text-navy-400">
            {boats.length === 0 ? 'Add a boat to get started' : 'Try a different search'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Card key={b.id} className="p-4" onClick={() => navigate(`/boat/${b.id}`)}>
              <div className="font-semibold text-navy-900">{b.name}</div>
              <div className="flex items-center gap-3 text-xs text-navy-500 mt-1">
                {b.boatClass && <span>{b.boatClass}</span>}
                {b.rigType && <span>{b.rigType}</span>}
                {b.ownerName && <span>{b.ownerName}</span>}
                {b.sailNumber && <span>#{b.sailNumber}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
