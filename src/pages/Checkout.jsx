import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { addOrder } from '../firebase/orders'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

const pakCities = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Gujranwala', 'Peshawar', 'Quetta', 'Sialkot',
  'Bahawalpur', 'Sargodha', 'Sukkur', 'Hyderabad', 'Gujrat',
]

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  })
  const [error, setError] = useState('')

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
      setError('Please fill in all required fields.')
      return
    }

    if (!/^03\d{2}\d{7}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('Phone must be a valid Pakistani number (03XXXXXXXXX).')
      return
    }

    setSubmitting(true)
    try {
      const orderData = {
        ...form,
        total: String(total),
        items: items.map(i => ({ id: i.id, name: i.name, price: String(i.price), qty: i.qty })),
        status: 'Pending',
        paymentMethod: 'WhatsApp',
      }

      const docRef = await addOrder(orderData)
      const orderId = docRef.id

      const itemsList = items.map(i => `- ${i.name} x${i.qty} — ₨${Number(i.price).toLocaleString('en-PK')}`).join('\n')

      const message = encodeURIComponent(
        `Hi there! I just placed an order on Hidden Picks.\n\n` +
        `Order ID: ${orderId.slice(0, 8)}...\n` +
        `Name: ${form.customerName}\n` +
        `Phone: ${form.phone}\n` +
        `City: ${form.city}\n` +
        `Address: ${form.address}\n` +
        (form.notes ? `Notes: ${form.notes}\n\n` : '\n') +
        `Items:\n${itemsList}\n\n` +
        `Total: ${formatPrice(total)}\n\n` +
        `Please confirm my order. Thank you!`
      )

      clearCart()

      window.open(`https://wa.me/${WHATSAPP}?text=${message}`, '_blank')

      navigate('/order-confirmation', {
        state: {
          customerName: form.customerName,
          phone: form.phone,
          city: form.city,
          total: formatPrice(total),
          items: [...items],
        },
      })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">Full Name *</label>
            <input name="customerName" value={form.customerName} onChange={handleChange} required className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">Phone (03xx) *</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="03XXXXXXXXX" required className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">City *</label>
            <select name="city" value={form.city} onChange={handleChange} required className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded">
              <option value="" className="bg-[#111]">Select City</option>
              {pakCities.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">Address *</label>
            <textarea name="address" value={form.address} onChange={handleChange} required rows={3} className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#999] mb-1">Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full bg-[#111] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>

          <div className="checkout-info-box">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>After confirming your order, we will contact you on WhatsApp to arrange payment and delivery.</span>
          </div>

          {error && <p className="text-[#FF2D78] text-sm">{error}</p>}

          <button type="submit" disabled={submitting} className="checkout-wa-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {submitting ? 'Processing...' : 'Confirm Order on WhatsApp'}
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
              <span className="text-white">Total</span>
              <span className="text-[#FFD700]">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
