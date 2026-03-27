import { openDB } from 'idb'

const DB_NAME = 'us-sailing-measurer'
const DB_VERSION = 2

let dbPromise = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // v1: measurements + settings
        if (oldVersion < 1) {
          const mStore = db.createObjectStore('measurements', { keyPath: 'id' })
          mStore.createIndex('boatName', 'boatName')
          mStore.createIndex('sailType', 'sailType')
          mStore.createIndex('date', 'measurementDate')
          mStore.createIndex('syncStatus', 'syncStatus')

          db.createObjectStore('settings', { keyPath: 'key' })
        }
        // v2: boats + jobs
        if (oldVersion < 2) {
          const bStore = db.createObjectStore('boats', { keyPath: 'id' })
          bStore.createIndex('name', 'name')

          const jStore = db.createObjectStore('jobs', { keyPath: 'id' })
          jStore.createIndex('boatId', 'boatId')
          jStore.createIndex('date', 'date')
          jStore.createIndex('status', 'status')
          jStore.createIndex('syncStatus', 'syncStatus')
        }
      }
    })
  }
  return dbPromise
}

// ─── Generic helpers ───

async function saveRecord(store, record) {
  const db = await getDB()
  record.updatedAt = new Date().toISOString()
  if (!record.createdAt) record.createdAt = record.updatedAt
  if (!record.syncStatus) record.syncStatus = 'pending'
  await db.put(store, record)
  return record
}

async function getRecord(store, id) {
  const db = await getDB()
  return db.get(store, id)
}

async function getAllRecords(store, sortField, desc = true) {
  const db = await getDB()
  const all = await db.getAll(store)
  if (sortField) {
    all.sort((a, b) => {
      const av = a[sortField] || ''
      const bv = b[sortField] || ''
      return desc ? bv.localeCompare(av) : av.localeCompare(bv)
    })
  }
  return all
}

async function deleteRecord(store, id) {
  const db = await getDB()
  await db.delete(store, id)
}

async function getByIndex(store, indexName, value) {
  const db = await getDB()
  return db.getAllFromIndex(store, indexName, value)
}

// ─── Measurement CRUD ───

export const saveMeasurement = (m) => saveRecord('measurements', m)
export const getMeasurement = (id) => getRecord('measurements', id)
export const getAllMeasurements = () => getAllRecords('measurements', 'measurementDate')
export const deleteMeasurement = (id) => deleteRecord('measurements', id)
export const getUnsyncedMeasurements = () => getByIndex('measurements', 'syncStatus', 'pending')

export async function markSynced(id) {
  const db = await getDB()
  const record = await db.get('measurements', id)
  if (record) {
    record.syncStatus = 'synced'
    await db.put('measurements', record)
  }
}

export async function markSyncError(id) {
  const db = await getDB()
  const record = await db.get('measurements', id)
  if (record) {
    record.syncStatus = 'error'
    await db.put('measurements', record)
  }
}

// ─── Boat CRUD ───

export const saveBoat = (b) => saveRecord('boats', b)
export const getBoat = (id) => getRecord('boats', id)
export const getAllBoats = () => getAllRecords('boats', 'name', false)
export const deleteBoat = (id) => deleteRecord('boats', id)

// ─── Job CRUD ───

export const saveJob = (j) => saveRecord('jobs', j)
export const getJob = (id) => getRecord('jobs', id)
export const getAllJobs = () => getAllRecords('jobs', 'date')
export const deleteJob = (id) => deleteRecord('jobs', id)
export const getJobsByBoat = (boatId) => getByIndex('jobs', 'boatId', boatId)
export const getUnsyncedJobs = () => getByIndex('jobs', 'syncStatus', 'pending')

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

export const saveDraft = (formData) => saveSetting('draft', formData)
export const getDraft = () => getSetting('draft')

export async function clearDraft() {
  const db = await getDB()
  await db.delete('settings', 'draft')
}
