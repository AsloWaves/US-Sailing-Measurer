import { openDB } from 'idb'

const DB_NAME = 'us-sailing-measurer'
const DB_VERSION = 7

let dbPromise = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, transaction) {
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
        // v3: standing rigging
        if (oldVersion < 3) {
          const srStore = db.createObjectStore('standing_rigging', { keyPath: 'id' })
          srStore.createIndex('jobId', 'jobId')
          srStore.createIndex('boatId', 'boatId')
          srStore.createIndex('syncStatus', 'syncStatus')
        }
        // v4: running rigging
        if (oldVersion < 4) {
          const rrStore = db.createObjectStore('running_rigging', { keyPath: 'id' })
          rrStore.createIndex('jobId', 'jobId')
          rrStore.createIndex('boatId', 'boatId')
          rrStore.createIndex('syncStatus', 'syncStatus')
        }
        // v5: sail repairs
        if (oldVersion < 5) {
          const repStore = db.createObjectStore('sail_repairs', { keyPath: 'id' })
          repStore.createIndex('jobId', 'jobId')
          repStore.createIndex('boatId', 'boatId')
          repStore.createIndex('syncStatus', 'syncStatus')
        }
        // v6: photos
        if (oldVersion < 6) {
          const phStore = db.createObjectStore('photos', { keyPath: 'id' })
          phStore.createIndex('parentId', 'parentId')
          phStore.createIndex('parentType', 'parentType')
        }
        // v7: jobId index on measurements
        if (oldVersion < 7) {
          const mStore = transaction.objectStore('measurements')
          if (!mStore.indexNames.contains('jobId')) {
            mStore.createIndex('jobId', 'jobId')
          }
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

// ─── Standing Rigging CRUD ───

export const saveStandingRigging = (r) => saveRecord('standing_rigging', r)
export const getStandingRigging = (id) => getRecord('standing_rigging', id)
export const getAllStandingRigging = () => getAllRecords('standing_rigging', 'date')
export const deleteStandingRigging = (id) => deleteRecord('standing_rigging', id)
export const getStandingRiggingByJob = (jobId) => getByIndex('standing_rigging', 'jobId', jobId)

// ─── Running Rigging CRUD ───

export const saveRunningRigging = (r) => saveRecord('running_rigging', r)
export const getRunningRigging = (id) => getRecord('running_rigging', id)
export const getAllRunningRigging = () => getAllRecords('running_rigging', 'date')
export const deleteRunningRigging = (id) => deleteRecord('running_rigging', id)
export const getRunningRiggingByJob = (jobId) => getByIndex('running_rigging', 'jobId', jobId)

// ─── Sail Repair CRUD ───

export const saveSailRepair = (r) => saveRecord('sail_repairs', r)
export const getSailRepair = (id) => getRecord('sail_repairs', id)
export const getAllSailRepairs = () => getAllRecords('sail_repairs', 'date')
export const deleteSailRepair = (id) => deleteRecord('sail_repairs', id)
export const getSailRepairsByJob = (jobId) => getByIndex('sail_repairs', 'jobId', jobId)

// ─── Photo CRUD ───

export const savePhoto = (p) => saveRecord('photos', p)
export const getPhoto = (id) => getRecord('photos', id)
export const deletePhoto = (id) => deleteRecord('photos', id)
export const getPhotosByParent = (parentId) => getByIndex('photos', 'parentId', parentId)

// ─── Measurement by Job ───

export const getMeasurementsByJob = (jobId) => getByIndex('measurements', 'jobId', jobId)

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
