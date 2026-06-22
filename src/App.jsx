import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBanner from './components/AnnouncementBanner'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Budget from './pages/Budget'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminBanners from './pages/admin/Banners'
import AdminInstagram from './pages/admin/Instagram'
import AdminSettings from './pages/admin/Settings'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/*" element={
          <>
            <AnnouncementBanner />
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/product/:slug" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/banners" element={<AdminBanners />} />
                <Route path="/admin/instagram" element={<AdminInstagram />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppFloat />
          </>
        } />
      </Routes>
    </div>
  )
}
