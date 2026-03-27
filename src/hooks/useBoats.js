import { useState, useEffect, useCallback } from 'react'
import { getAllBoats, saveBoat, deleteBoat as dbDelete, getBoat } from '../lib/db'

export function useBoats() {
  const [boats, setBoats] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setBoats(await getAllBoats())
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const save = useCallback(async (data) => {
    const saved = await saveBoat(data)
    await refresh()
    return saved
  }, [refresh])

  const remove = useCallback(async (id) => {
    await dbDelete(id)
    await refresh()
  }, [refresh])

  const get = useCallback((id) => getBoat(id), [])

  return { boats, loading, save, remove, get, refresh }
}
