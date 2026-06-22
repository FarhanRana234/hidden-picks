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

  if (loading) return <div className="p-8 text-center text-dark/50">Loading...</div>

  return (
    <div className="min-h-screen bg-cream">
      <AdminNav logout={logout} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>

        {settings?.announcementBanner?.show && (
          <div className="bg-accent/10 border border-accent/30 text-sm p-3 mb-8 text-center">{settings.announcementBanner.text}</div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Products" value={stats.products} />
          <StatCard label="Active Listings" value={stats.active} />
          <StatCard label="Sold Out" value={stats.soldOut} />
          <StatCard label="Total Orders" value={stats.orders} />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/admin/products" className="bg-dark text-white p-6 text-center font-heading text-xl font-bold hover:bg-accent transition">Manage Products</Link>
          <Link to="/admin/orders" className="bg-dark text-white p-6 text-center font-heading text-xl font-bold hover:bg-accent transition">Manage Orders</Link>
          <Link to="/admin/settings" className="bg-dark text-white p-6 text-center font-heading text-xl font-bold hover:bg-accent transition">Store Settings</Link>
        </div>
      </div>
    </div>
  )
}

function AdminNav({ logout }) {
  return (
    <nav className="bg-dark text-white px-4 py-3 flex items-center justify-between">
      <Link to="/admin" className="font-heading font-bold text-lg">Hidden Picks Admin</Link>
      <div className="flex items-center gap-4 text-sm">
        <Link to="/" className="hover:text-accent transition">View Store</Link>
        <button onClick={logout} className="hover:text-accent transition">Logout</button>
      </div>
    </nav>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 shadow-sm text-center">
      <p className="font-heading text-3xl font-bold text-accent">{value}</p>
      <p className="text-xs uppercase tracking-wider text-dark/60 mt-1">{label}</p>
    </div>
  )
}
