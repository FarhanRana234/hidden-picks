import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { addOrder } from '../firebase/orders'
import { getSettings } from '../firebase/settings'

const pakCities = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Gujranwala', 'Peshawar', 'Quetta', 'Sialkot',
  'Bahawalpur', 'Sargodha', 'Sukkur', 'Hyderabad', 'Gujrat',
]

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [settings, setSettings] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
    paymentMethod: 'JazzCash',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {})
  }, [])

  function formatPrice(pkr) {
    return '₨ ' + Number(pkr).toLocaleString('en-PK')
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.customerName.trim() || !form.phone.trim() || !form.city || !form.address.trim()) {
      setError('please fill in all required fields.')
      return
    }

    if (!/^03\d{2}\d{7}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('phone must be a valid pakistani number (03XXXXXXXXX).')
      return
    }

    setSubmitting(true)
    try {
      await addOrder({
        ...form,
        total: String(total),
        items: items.map(i => ({ id: i.id, name: i.name, price: String(i.price), qty: i.qty })),
        status: 'Pending',
      })
      clearCart()
      navigate('/order-confirmation', { state: { ...form, total: formatPrice(total), items: [...items] } })
    } catch {
      setError('something went wrong. please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const paymentMethods = ['JazzCash', 'EasyPaisa', 'Bank Transfer']

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">full name *</label>
            <input name="customerName" value={form.customerName} onChange={handleChange} required className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">phone (03xx) *</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="03XXXXXXXXX" required className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">city *</label>
            <select name="city" value={form.city} onChange={handleChange} required className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded">
              <option value="" className="bg-[#111]">select city</option>
              {pakCities.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">address *</label>
            <textarea name="address" value={form.address} onChange={handleChange} required rows={3} className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#999] mb-2">payment method *</label>
            <div className="space-y-2">
              {paymentMethods.map(m => (
                <label key={m} className="flex items-center gap-2 text-sm cursor-pointer text-white">
                  <input type="radio" name="paymentMethod" value={m} checked={form.paymentMethod === m} onChange={handleChange} className="accent-[#FF2D78]" />
                  {m}
                </label>
              ))}
            </div>
            {settings?.bankDetails && form.paymentMethod === 'Bank Transfer' && (
              <div className="mt-3 p-3 bg-[#111] border border-[#222] rounded text-sm text-[#ccc] space-y-1">
                <p><strong className="text-white">Bank:</strong> {settings.bankDetails.bankName}</p>
                <p><strong className="text-white">Account:</strong> {settings.bankDetails.accountNumber}</p>
                <p><strong className="text-white">Title:</strong> {settings.bankDetails.accountTitle}</p>
              </div>
            )}
          </div>

          {error && <p className="text-[#FF2D78] text-sm">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full bg-[#FF2D78] text-white py-3 font-semibold text-sm rounded hover:bg-[#FF2D78]/90 transition disabled:opacity-50">
            {submitting ? 'placing order...' : `place order — ${formatPrice(total)}`}
          </button>
        </form>

        <div className="md:col-span-2">
          <div className="bg-[#111] border border-[#222] p-4 rounded-lg sticky top-24">
            <h3 className="font-heading font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 divide-y divide-[#222]">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 pt-3 first:pt-0">
                  <div className="w-12 h-12 shrink-0 bg-[#0A0A0A] rounded overflow-hidden">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <p className="text-xs text-[#999]">{item.qty} &times; {formatPrice(item.price)}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#222] mt-4 pt-4 flex justify-between font-heading text-lg font-bold">
              <span className="text-white">total</span>
              <span className="text-[#FFD700]">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
