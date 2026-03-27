import { useState, useEffect, useCallback } from 'react'
import { getAllMeasurements, saveMeasurement, deleteMeasurement as dbDelete, getMeasurement } from '../lib/db'

export function useMeasurements() {
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const all = await getAllMeasurements()
    setMeasurements(all)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const save = useCallback(async (data) => {
    const saved = await saveMeasurement(data)
    await refresh()
    return saved
  }, [refresh])

  const remove = useCallback(async (id) => {
    await dbDelete(id)
    await refresh()
  }, [refresh])

  const get = useCallback(async (id) => {
    return getMeasurement(id)
  }, [])

  return { measurements, loading, save, remove, get, refresh }
}
