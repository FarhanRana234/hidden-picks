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
      alert('Error saving settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-dark/50">Loading...</div>

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-dark text-white px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="font-heading font-bold text-lg">Hidden Picks Admin</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/admin/products" className="hover:text-accent transition">Products</Link>
          <Link to="/admin/orders" className="hover:text-accent transition">Orders</Link>
          <Link to="/" className="hover:text-accent transition">View Store</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Store Settings</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">WhatsApp Number (with country code, no +)</label>
            <input value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="923XXXXXXXXX" className="w-full border border-dark/20 px-3 py-2 text-sm" />
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-3">Bank Details (shown for Bank Transfer)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Bank Name</label>
                <input value={form.bankDetails.bankName} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, bankName: e.target.value } })} className="w-full border border-dark/20 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Account Number</label>
                <input value={form.bankDetails.accountNumber} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })} className="w-full border border-dark/20 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Account Title</label>
                <input value={form.bankDetails.accountTitle} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountTitle: e.target.value } })} className="w-full border border-dark/20 px-3 py-2 text-sm" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-3">Announcement Banner</h3>
            <div className="space-y-3">
              <textarea value={form.announcementBanner.text} onChange={e => setForm({ ...form, announcementBanner: { ...form.announcementBanner, text: e.target.value } })} rows={2} placeholder="Free shipping on orders over ₨ 5,000!" className="w-full border border-dark/20 px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.announcementBanner.show} onChange={e => setForm({ ...form, announcementBanner: { ...form.announcementBanner, show: e.target.checked } })} className="accent-accent" />
                Show banner sitewide
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving} className="bg-dark text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-accent transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <p className="text-green-600 text-sm">Settings saved!</p>}
        </form>
      </div>
    </div>
  )
}
