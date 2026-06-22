import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getInstagramImages, updateInstagramImages } from '../../firebase/instagram'
import { uploadToCloudinary } from '../../firebase/cloudinary'

const defaultImages = Array.from({ length: 6 }, (_, i) => ({
  url: '',
  link: 'https://instagram.com/hiddenpicks.co_',
}))

export default function AdminInstagram() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [images, setImages] = useState(defaultImages)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [uploading, setUploading] = useState(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/admin/login'); return }
    getInstagramImages().then(data => {
      if (data?.images) {
        setImages(data.images.map((img, i) => ({
          ...defaultImages[i],
          ...img,
        })))
      }
    }).catch(() => {})
  }, [user, authLoading, navigate])

  function handleChange(index, field, value) {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, [field]: value } : img))
  }

  async function handleFileUpload(index, file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Only image files are allowed.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File must be under 5MB.' })
      return
    }
    setUploading(index)
    setMessage({ type: '', text: '' })
    try {
      const url = await uploadToCloudinary(file)
      handleChange(index, 'url', url)
      setMessage({ type: 'success', text: `Image ${index + 1} uploaded successfully! Save to apply.` })
    } catch {
      setMessage({ type: 'error', text: 'Upload failed. Check your Cloudinary preset.' })
    } finally {
      setUploading(null)
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      await updateInstagramImages({ images })
      setMessage({ type: 'success', text: 'Instagram grid saved successfully!' })
    } catch {
      setMessage({ type: 'error', text: 'Error saving Instagram grid.' })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return <div className="p-8 text-center text-[#555]">Loading...</div>

  return (
    <div className="px-6 py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">Instagram Grid</h1>
      <p className="text-[#999] text-sm mb-8">Manage the 6 images shown at the bottom of the homepage. Upload images (max 5MB each).</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {images.map((img, i) => (
          <div key={i} className="bg-[#111] border border-[#222] rounded-lg p-4">
            <p className="text-xs text-[#999] font-semibold mb-2">Image {i + 1}</p>

            <div className="aspect-square bg-[#0A0A0A] rounded-lg mb-3 overflow-hidden relative">
              {img.url ? (
                <img src={img.url} alt={`grid ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#555]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>

            <label className="cursor-pointer block text-center bg-[#0A0A0A] border border-[#222] text-[#999] px-3 py-1.5 text-xs rounded hover:text-white hover:border-[#FF2D78] transition mb-2">
              {uploading === i ? 'Uploading...' : 'Choose image'}
              <input type="file" accept="image/*" className="hidden" disabled={uploading !== null} onChange={e => handleFileUpload(i, e.target.files[0])} />
            </label>

            <input
              value={img.link}
              onChange={e => handleChange(i, 'link', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full bg-[#0A0A0A] border border-[#222] text-white px-2 py-1.5 text-xs rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || uploading !== null}
        className="bg-[#FF2D78] text-white px-8 py-3 text-sm font-semibold rounded hover:bg-[#FF2D78]/90 transition disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Instagram Grid'}
      </button>

      {message.text && (
        <p className={`text-sm mt-4 ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}
