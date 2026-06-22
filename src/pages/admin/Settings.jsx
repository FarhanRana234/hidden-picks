import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getSettings, updateSettings } from '../../firebase/settings'

export default function AdminSettings() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    whatsappNumber: '',
    bankDetails: { bankName: '', accountNumber: '', accountTitle: '' },
    announcementBanner: { text: '', show: false },
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) { navigate('/admin/login'); return }
    getSettings().then(s => {
      if (s) {
        setForm({
          whatsappNumber: s.whatsappNumber || '',
          bankDetails: s.bankDetails || { bankName: '', accountNumber: '', accountTitle: '' },
          announcementBanner: s.announcementBanner || { text: '', show: false },
        })
      }
    })
  }, [user, loading, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateSettings(form)
      setSaved(true)
    } catch {
      alert('error saving settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-[#555]">Loading...</div>

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="bg-[#111] text-white px-4 py-3 flex items-center justify-between border-b border-[#222]">
        <Link to="/admin" className="font-heading font-bold text-lg">hidden picks admin</Link>
        <div className="flex items-center gap-4 text-sm text-[#999]">
          <Link to="/admin/products" className="hover:text-[#FF2D78] transition">products</Link>
          <Link to="/admin/orders" className="hover:text-[#FF2D78] transition">orders</Link>
          <Link to="/admin/banners" className="hover:text-[#FF2D78] transition">banners</Link>
          <Link to="/admin/instagram" className="hover:text-[#FF2D78] transition">instagram</Link>
          <Link to="/" className="hover:text-[#FF2D78] transition">view store</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Store Settings</h1>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#222] p-6 rounded-lg space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">whatsapp number (with country code, no +)</label>
            <input value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="923XXXXXXXXX" className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-3">bank details (shown for bank transfer)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#999] mb-1">bank name</label>
                <input value={form.bankDetails.bankName} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, bankName: e.target.value } })} className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#999] mb-1">account number</label>
                <input value={form.bankDetails.accountNumber} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })} className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#999] mb-1">account title</label>
                <input value={form.bankDetails.accountTitle} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountTitle: e.target.value } })} className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-3">announcement banner</h3>
            <div className="space-y-3">
              <textarea value={form.announcementBanner.text} onChange={e => setForm({ ...form, announcementBanner: { ...form.announcementBanner, text: e.target.value } })} rows={2} placeholder="free shipping on orders over Rs 5,000!" className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
              <label className="flex items-center gap-2 text-sm cursor-pointer text-[#ccc]">
                <input type="checkbox" checked={form.announcementBanner.show} onChange={e => setForm({ ...form, announcementBanner: { ...form.announcementBanner, show: e.target.checked } })} className="accent-[#FF2D78]" />
                show banner sitewide
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving} className="bg-[#FF2D78] text-white px-8 py-3 text-sm font-semibold rounded hover:bg-[#FF2D78]/90 transition disabled:opacity-50">
            {saving ? 'saving...' : 'save settings'}
          </button>
          {saved && <p className="text-green-400 text-sm">settings saved!</p>}
        </form>
      </div>
    </div>
  )
}
