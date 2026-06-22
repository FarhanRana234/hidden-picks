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
        <h1 className="font-heading text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-dark/60 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-dark text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-accent transition">
          Browse Cameras
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Cart ({count} item{count !== 1 ? 's' : ''})</h1>

      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 bg-white p-4 shadow-sm">
            <div className="w-20 h-20 shrink-0 bg-cream overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-dark/20 text-xs">No img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.slug}`} className="font-heading font-bold text-dark hover:text-accent transition">{item.name}</Link>
              <p className="text-accent font-semibold text-sm mt-1">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-dark/20 text-sm">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1} className="px-2 py-1 hover:bg-dark/5 disabled:opacity-30">-</button>
                  <span className="px-3 py-1 font-semibold">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} disabled={item.qty >= item.maxQty} className="px-2 py-1 hover:bg-dark/5 disabled:opacity-30">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold">{formatPrice(item.price * item.qty)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dark/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-dark/60">Total</p>
          <p className="font-heading text-2xl font-bold text-accent">{formatPrice(total)}</p>
        </div>
        <Link
          to="/checkout"
          className="bg-dark text-white px-10 py-3 font-semibold uppercase tracking-wider text-sm hover:bg-accent transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
