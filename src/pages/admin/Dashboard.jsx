import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProducts } from '../../firebase/products'
import { getOrders } from '../../firebase/orders'
import { getSettings } from '../../firebase/settings'

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ products: 0, active: 0, soldOut: 0, orders: 0 })
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (loading) return
    if (!user) { navigate('/admin/login'); return }
    Promise.all([getProducts(), getOrders(), getSettings()]).then(([prods, ords, sets]) => {
      setStats({
        products: prods.length,
        active: prods.filter(p => !p.isSoldOut).length,
        soldOut: prods.filter(p => p.isSoldOut).length,
        orders: ords.length,
      })
      setSettings(sets)
    })
  }, [user, loading, navigate])

  if (loading) return <div className="p-8 text-center text-[#555]">Loading...</div>

  return (
    <div className="px-6 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>

      {settings?.announcementBanner?.show && (
        <div className="bg-[#FF2D78]/10 border border-[#FF2D78]/30 text-sm p-3 mb-8 text-center rounded">
          {settings.announcementBanner.text}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={stats.products} />
        <StatCard label="Active Listings" value={stats.active} />
        <StatCard label="Sold Out" value={stats.soldOut} />
        <StatCard label="Total Orders" value={stats.orders} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <Link to="/admin/products" className="bg-[#111] border border-[#222] text-white p-5 text-center font-heading text-sm font-bold hover:border-[#FF2D78] transition rounded-lg">
          Products
        </Link>
        <Link to="/admin/orders" className="bg-[#111] border border-[#222] text-white p-5 text-center font-heading text-sm font-bold hover:border-[#FF2D78] transition rounded-lg">
          Orders
        </Link>
        <Link to="/admin/banners" className="bg-[#111] border border-[#222] text-white p-5 text-center font-heading text-sm font-bold hover:border-[#FF2D78] transition rounded-lg">
          Banners
        </Link>
        <Link to="/admin/instagram" className="bg-[#111] border border-[#222] text-white p-5 text-center font-heading text-sm font-bold hover:border-[#FF2D78] transition rounded-lg">
          Instagram
        </Link>
        <Link to="/admin/settings" className="bg-[#111] border border-[#222] text-white p-5 text-center font-heading text-sm font-bold hover:border-[#FF2D78] transition rounded-lg">
          Settings
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#111] border border-[#222] p-4 rounded-lg text-center">
      <p className="font-heading text-3xl font-bold text-[#FF2D78]">{value}</p>
      <p className="text-xs tracking-wider text-[#999] mt-1">{label}</p>
    </div>
  )
}
