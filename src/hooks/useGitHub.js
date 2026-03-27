import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { createOctokitClient, saveMeasurementToGitHub, loadMeasurementsFromGitHub } from '../lib/github'
import { markSynced, markSyncError, getUnsyncedMeasurements, saveMeasurement } from '../lib/db'

export function useGitHub() {
  const { githubToken, owner, repo, isAuthenticated } = useAuth()
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)

  const syncMeasurement = useCallback(async (measurement) => {
    if (!isAuthenticated) return false
    setSyncing(true)
    setError(null)
    try {
      const octokit = createOctokitClient(githubToken)
      await saveMeasurementToGitHub(octokit, owner, repo, measurement)
      await markSynced(measurement.id)
      return true
    } catch (err) {
      console.error('Sync failed:', err)
      setError(err.message)
      await markSyncError(measurement.id)
      return false
    } finally {
      setSyncing(false)
    }
  }, [githubToken, owner, repo, isAuthenticated])

  const syncAll = useCallback(async () => {
    if (!isAuthenticated) return { synced: 0, failed: 0 }
    setSyncing(true)
    setError(null)
    let synced = 0
    let failed = 0
    try {
      const octokit = createOctokitClient(githubToken)
      const unsynced = await getUnsyncedMeasurements()
      for (const m of unsynced) {
        try {
          await saveMeasurementToGitHub(octokit, owner, repo, m)
          await markSynced(m.id)
          synced++
        } catch {
          await markSyncError(m.id)
          failed++
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSyncing(false)
    }
    return { synced, failed }
  }, [githubToken, owner, repo, isAuthenticated])

  const loadFromGitHub = useCallback(async () => {
    if (!isAuthenticated) return []
    setSyncing(true)
    setError(null)
    try {
      const octokit = createOctokitClient(githubToken)
      const remote = await loadMeasurementsFromGitHub(octokit, owner, repo)
      // Merge into local DB (local wins on conflict by ID)
      for (const m of remote) {
        m.syncStatus = 'synced'
        await saveMeasurement(m)
      }
      return remote
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setSyncing(false)
    }
  }, [githubToken, owner, repo, isAuthenticated])

  return { syncing, error, syncMeasurement, syncAll, loadFromGitHub, isAuthenticated }
}
