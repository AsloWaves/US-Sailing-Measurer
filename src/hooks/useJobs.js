import { useState, useEffect, useCallback } from 'react'
import { getAllJobs, saveJob, deleteJob as dbDelete, getJob, getJobsByBoat } from '../lib/db'

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setJobs(await getAllJobs())
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const save = useCallback(async (data) => {
    const saved = await saveJob(data)
    await refresh()
    return saved
  }, [refresh])

  const remove = useCallback(async (id) => {
    await dbDelete(id)
    await refresh()
  }, [refresh])

  const get = useCallback((id) => getJob(id), [])
  const getByBoat = useCallback((boatId) => getJobsByBoat(boatId), [])

  return { jobs, loading, save, remove, get, getByBoat, refresh }
}
