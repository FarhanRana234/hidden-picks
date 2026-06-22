import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getOrders, updateOrderStatus } from '../../firebase/orders'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER
const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (loading) return
    if (!user) { navigate('/admin/login'); return }
    getOrders().then(setOrders)
  }, [user, loading, navigate])

  function formatPrice(pkr) {
    return '₨ ' + Number(pkr).toLocaleString('en-PK')
  }

  async function handleStatusChange(id, status) {
    await updateOrderStatus(id, status)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  if (loading) return <div className="p-8 text-center text-[#555]">Loading...</div>

  return (
    <div className="px-6 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Orders</h1>

      <div className="bg-[#111] border border-[#222] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0A0A0A] text-[#999] text-xs tracking-wider">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">WhatsApp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-[#0A0A0A]">
                <td className="p-3 font-mono text-xs text-[#999]">{o.id.slice(0, 8)}...</td>
                <td className="p-3 font-semibold">{o.customerName}</td>
                <td className="p-3">{o.phone}</td>
                <td className="p-3">{o.city}</td>
                <td className="p-3 text-xs text-[#999]">
                  {o.items?.map(i => `${i.name} x${i.qty}`).join(', ') || '-'}
                </td>
                <td className="p-3 font-semibold text-[#FFD700]">{formatPrice(o.total)}</td>
                <td className="p-3 text-xs text-[#999]">{o.paymentMethod}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={e => handleStatusChange(o.id, e.target.value)}
                    className={`text-xs px-2 py-1 border rounded font-semibold bg-[#0A0A0A] ${o.status === 'Delivered' ? 'text-green-400 border-green-800' : o.status === 'Cancelled' ? 'text-red-400 border-red-800' : 'text-yellow-400 border-yellow-800'}`}
                  >
                    {STATUSES.map(s => <option key={s} value={s} className="bg-[#0A0A0A]">{s}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi ${o.customerName}! Your Hidden Picks order (${o.id.slice(0, 8)}...) is currently: ${o.status}.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline text-xs"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-[#555]">No orders yet.</p>}
      </div>
    </div>
  )
}
