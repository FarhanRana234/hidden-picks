import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getBanners, updateBanners } from '../../firebase/banners'
import { uploadVideoToCloudinary } from '../../firebase/cloudinary'

const defaultBanners = {
  banner1: { videoUrl: '', heading: 'the flip era', subtext: 'pocket-sized. iconic. never forgotten.' },
  banner2: { videoUrl: '', heading: "shoot like it's 2004", subtext: 'ccd sensors. warm tones. real memories.' },
  banner3: { videoUrl: '', heading: 'every shot tells a story', subtext: 'hidden picks brings you hand-picked digicams from lahore.' },
}

export default function AdminBanners() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [banners, setBanners] = useState(defaultBanners)
  const [saving, setSaving] = useState({})
  const [messages, setMessages] = useState({})
  const [uploadProgress, setUploadProgress] = useState({})

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/admin/login'); return }
    getBanners().then(data => {
      if (data) {
        setBanners({
          banner1: { ...defaultBanners.banner1, ...data.banner1 },
          banner2: { ...defaultBanners.banner2, ...data.banner2 },
          banner3: { ...defaultBanners.banner3, ...data.banner3 },
        })
      }
    }).catch(() => {})
  }, [user, authLoading, navigate])

  function handleChange(slot, field, value) {
    setBanners(prev => ({ ...prev, [slot]: { ...prev[slot], [field]: value } }))
  }

  async function handleFileUpload(slot, file) {
    if (!file) return

    if (!file.name.endsWith('.mp4') && !file.type.startsWith('video/')) {
      setMessages(prev => ({ ...prev, [slot]: 'only .mp4 video files are allowed.' }))
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setMessages(prev => ({ ...prev, [slot]: 'file must be under 50MB.' }))
      return
    }

    setUploadProgress(prev => ({ ...prev, [slot]: 0 }))
    setMessages(prev => ({ ...prev, [slot]: '' }))

    try {
      const url = await uploadVideoToCloudinary(file)
      setUploadProgress(prev => ({ ...prev, [slot]: 100 }))
      setBanners(prev => ({ ...prev, [slot]: { ...prev[slot], videoUrl: url } }))
      setMessages(prev => ({ ...prev, [slot]: 'video uploaded successfully! save the banner to apply.' }))
    } catch {
      setMessages(prev => ({ ...prev, [slot]: 'upload failed. check your cloudinary preset.' }))
    } finally {
      setTimeout(() => setUploadProgress(prev => ({ ...prev, [slot]: undefined })), 2000)
    }
  }

  async function handleSave(slot) {
    setSaving(prev => ({ ...prev, [slot]: true }))
    setMessages(prev => ({ ...prev, [slot]: '' }))
    try {
      await updateBanners({ [slot]: banners[slot] })
      setMessages(prev => ({ ...prev, [slot]: `${slot === 'banner1' ? 'banner 1' : slot === 'banner2' ? 'banner 2' : 'banner 3'} updated successfully` }))
    } catch {
      setMessages(prev => ({ ...prev, [slot]: 'error saving banner.' }))
    } finally {
      setSaving(prev => ({ ...prev, [slot]: false }))
    }
  }

  const slots = [
    { key: 'banner1', label: 'Banner 1 — "The Flip Era"' },
    { key: 'banner2', label: 'Banner 2 — "Shoot Like It\'s 2004"' },
    { key: 'banner3', label: 'Banner 3 — "Every Shot Tells a Story" (4:3 or 1:1 recommended)' },
  ]

  if (authLoading) return <div className="p-8 text-center text-[#555]">Loading...</div>

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="bg-[#111] text-white px-4 py-3 flex items-center justify-between border-b border-[#222]">
        <Link to="/admin" className="font-heading font-bold text-lg">hidden picks admin</Link>
        <div className="flex items-center gap-4 text-sm text-[#999]">
          <Link to="/admin/products" className="hover:text-[#FF2D78] transition">products</Link>
          <Link to="/admin/orders" className="hover:text-[#FF2D78] transition">orders</Link>
          <Link to="/admin/settings" className="hover:text-[#FF2D78] transition">settings</Link>
          <Link to="/admin/instagram" className="hover:text-[#FF2D78] transition">instagram</Link>
          <Link to="/" className="hover:text-[#FF2D78] transition">view store</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-2">Video Banners</h1>
        <p className="text-[#999] text-sm mb-8">Manage the 3 homepage video banners. Upload .mp4 files (max 50MB each).</p>
        <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-8 text-sm text-[#999] space-y-1">
          <p><strong className="text-white">Banner 1 (Hero background):</strong> 16:9 landscape, 1920x1080+, close-up digicam footage</p>
          <p><strong className="text-white">Banner 2 (Full-width cinematic):</strong> 21:9 ultrawide, 2560x1080+, lifestyle/city footage</p>
          <p><strong className="text-white">Banner 3 (Split right side):</strong> 4:3 or 1:1, 1080x1080+, close-up unboxing/details</p>
        </div>

        <div className="space-y-8">
          {slots.map(slot => (
            <div key={slot.key} className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h2 className="font-heading text-lg font-bold mb-4">{slot.label}</h2>

              {/* Video Preview */}
              <div className="aspect-video bg-[#0A0A0A] rounded-lg mb-4 overflow-hidden relative">
                {banners[slot.key].videoUrl ? (
                  <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                    <source src={banners[slot.key].videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#555]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <span className="text-sm">no video uploaded yet</span>
                  </div>
                )}
              </div>

              {/* Upload progress bar */}
              {uploadProgress[slot.key] !== undefined && (
                <div className="w-full bg-[#0A0A0A] rounded-full h-2 mb-4 overflow-hidden">
                  <div className="bg-[#FF2D78] h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress[slot.key]}%` }} />
                </div>
              )}

              {/* Heading + Subtext fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[#999] mb-1">heading text</label>
                  <input
                    value={banners[slot.key].heading}
                    onChange={e => handleChange(slot.key, 'heading', e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#999] mb-1">subtext</label>
                  <input
                    value={banners[slot.key].subtext}
                    onChange={e => handleChange(slot.key, 'subtext', e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded"
                  />
                </div>
              </div>

              {/* Upload + Save buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label className="cursor-pointer bg-[#0A0A0A] border border-[#222] text-[#999] px-4 py-2 text-sm rounded hover:text-white hover:border-[#FF2D78] transition">
                  choose file
                  <input type="file" accept=".mp4,video/*" className="hidden" onChange={e => handleFileUpload(slot.key, e.target.files[0])} />
                </label>
                <button
                  onClick={() => handleSave(slot.key)}
                  disabled={saving[slot.key]}
                  className="bg-[#FF2D78] text-white px-6 py-2 text-sm font-semibold rounded hover:bg-[#FF2D78]/90 transition disabled:opacity-50"
                >
                  {saving[slot.key] ? 'saving...' : 'save banner'}
                </button>
              </div>

              {messages[slot.key] && (
                <p className={`text-sm mt-3 ${messages[slot.key].includes('failed') || messages[slot.key].includes('only') || messages[slot.key].includes('must') || messages[slot.key].includes('error') ? 'text-red-400' : 'text-green-400'}`}>
                  {messages[slot.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
