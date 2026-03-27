import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { savePhoto, getPhotosByParent, deletePhoto } from '../lib/db'
import Button from './ui/Button'

export default function PhotoCapture({ parentType, parentId, componentId }) {
  const [photos, setPhotos] = useState([])
  const [viewing, setViewing] = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    if (parentId) {
      getPhotosByParent(parentId).then(setPhotos)
    }
  }, [parentId])

  const handleCapture = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const photo = {
        id: uuidv4(),
        parentType,
        parentId,
        componentId: componentId || null,
        originalData: reader.result,
        annotatedData: null,
        caption: '',
        annotations: [],
        takenAt: new Date().toISOString(),
      }
      await savePhoto(photo)
      setPhotos([...photos, photo])
    }
    reader.readAsDataURL(file)
    e.target.value = '' // reset for re-capture
  }

  const handleDelete = async (photoId) => {
    await deletePhoto(photoId)
    setPhotos(photos.filter(p => p.id !== photoId))
    setViewing(null)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="px-3 py-2 rounded-lg bg-navy-100 text-navy-700 text-xs font-medium hover:bg-navy-200 transition-colors cursor-pointer"
        >
          + Photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="hidden"
        />
        {photos.length > 0 && (
          <span className="text-xs text-navy-400">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((p) => (
            <button key={p.id} onClick={() => setViewing(p)} className="shrink-0 cursor-pointer">
              <img
                src={p.annotatedData || p.originalData}
                alt={p.caption || 'Photo'}
                className="w-16 h-16 object-cover rounded-lg border border-navy-200"
              />
            </button>
          ))}
        </div>
      )}

      {/* Full-screen viewer */}
      {viewing && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4">
            <span className="text-white text-sm">{viewing.caption || 'Photo'}</span>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(viewing.id)} className="text-red-400 text-sm cursor-pointer">Delete</button>
              <button onClick={() => setViewing(null)} className="text-white text-sm cursor-pointer">Close</button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={viewing.annotatedData || viewing.originalData}
              alt={viewing.caption || 'Photo'}
              className="max-w-full max-h-full object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}
