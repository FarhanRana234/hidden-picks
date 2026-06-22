import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQty, total, count } = useCart()

  function formatPrice(pkr) {
    return '₨ ' + Number(pkr).toLocaleString('en-PK')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl font-bold mb-4">your cart is empty</h1>
        <p className="text-[#999] mb-8">nothing here yet. go grab a digicam!</p>
        <Link to="/shop" className="bg-[#FF2D78] text-white px-8 py-3 text-sm font-semibold rounded hover:bg-[#FF2D78]/90 transition">
          browse cameras
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Cart ({count} item{count !== 1 ? 's' : ''})</h1>

      <div className="space-y-3 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 bg-[#111] border border-[#222] p-4 rounded-lg">
            <div className="w-20 h-20 shrink-0 bg-[#0A0A0A] rounded overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#555] text-xs">no img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.slug}`} className="font-heading font-bold text-white hover:text-[#FF2D78] transition">{item.name}</Link>
              <p className="text-[#FFD700] font-semibold text-sm mt-1">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-[#222] rounded text-sm">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1} className="px-2 py-1 text-[#999] hover:text-white hover:bg-[#222] disabled:opacity-30 rounded-l">-</button>
                  <span className="px-3 py-1 font-semibold text-white">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} disabled={item.qty >= item.maxQty} className="px-2 py-1 text-[#999] hover:text-white hover:bg-[#222] disabled:opacity-30 rounded-r">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-xs text-[#FF2D78] hover:underline">remove</button>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-white">{formatPrice(item.price * item.qty)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#222] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#999]">total</p>
          <p className="font-heading text-2xl font-bold text-[#FFD700]">{formatPrice(total)}</p>
        </div>
        <Link to="/checkout" className="bg-[#FF2D78] text-white px-10 py-3 font-semibold text-sm rounded hover:bg-[#FF2D78]/90 transition">
          proceed to checkout
        </Link>
      </div>
    </div>
  )
}
