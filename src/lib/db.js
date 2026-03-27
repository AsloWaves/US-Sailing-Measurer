import { openDB } from 'idb'

const DB_NAME = 'us-sailing-measurer'
const DB_VERSION = 1

let dbPromise = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('measurements')) {
          const store = db.createObjectStore('measurements', { keyPath: 'id' })
          store.createIndex('boatName', 'boatName')
          store.createIndex('sailType', 'sailType')
          store.createIndex('date', 'measurementDate')
          store.createIndex('syncStatus', 'syncStatus')
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      }
    })
  }
  return dbPromise
}

// ─── Measurement CRUD ───

export async function saveMeasurement(measurement) {
  const db = await getDB()
  measurement.updatedAt = new Date().toISOString()
  if (!measurement.createdAt) {
    measurement.createdAt = measurement.updatedAt
  }
  if (!measurement.syncStatus) {
    measurement.syncStatus = 'pending'
  }
  await db.put('measurements', measurement)
  return measurement
}

export async function getMeasurement(id) {
  const db = await getDB()
  return db.get('measurements', id)
}

export async function getAllMeasurements() {
  const db = await getDB()
  const all = await db.getAll('measurements')
  // Sort by date descending (most recent first)
  return all.sort((a, b) => (b.measurementDate || '').localeCompare(a.measurementDate || ''))
}

export async function deleteMeasurement(id) {
  const db = await getDB()
  await db.delete('measurements', id)
}

export async function getUnsyncedMeasurements() {
  const db = await getDB()
  return db.getAllFromIndex('measurements', 'syncStatus', 'pending')
}

export async function markSynced(id) {
  const db = await getDB()
  const measurement = await db.get('measurements', id)
  if (measurement) {
    measurement.syncStatus = 'synced'
    await db.put('measurements', measurement)
  }
}

export async function markSyncError(id) {
  const db = await getDB()
  const measurement = await db.get('measurements', id)
  if (measurement) {
    measurement.syncStatus = 'error'
    await db.put('measurements', measurement)
  }
}

// ─── Settings ───

export async function getSetting(key) {
  const db = await getDB()
  const row = await db.get('settings', key)
  return row?.value ?? null
}

export async function saveSetting(key, value) {
  const db = await getDB()
  await db.put('settings', { key, value })
}

// ─── Draft ───

export async function saveDraft(formData) {
  return saveSetting('draft', formData)
}

export async function getDraft() {
  return getSetting('draft')
}

export async function clearDraft() {
  const db = await getDB()
  await db.delete('settings', 'draft')
}
