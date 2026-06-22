import { useLocation, Link } from 'react-router-dom'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

export default function OrderConfirmation() {
  const location = useLocation()
  const order = location.state

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl font-bold mb-4">no order found</h1>
        <Link to="/shop" className="bg-[#FF2D78] text-white px-8 py-3 text-sm font-semibold rounded hover:bg-[#FF2D78]/90 transition">browse cameras</Link>
      </div>
    )
  }

  const message = encodeURIComponent(
    `hey hidden picks! 👋\n\njust placed an order:\nname: ${order.customerName}\nphone: ${order.phone}\ncity: ${order.city}\ntotal: ${order.total}\n\nplease confirm, thanks!`
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-6">📸</div>
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">order placed!</h1>
      <p className="text-[#999] mb-6 max-w-md mx-auto leading-relaxed">
        thanks, <strong className="text-white">{order.customerName}</strong>! we've received your order and will hit you up on whatsapp shortly to confirm payment & shipping.
      </p>

      <div className="bg-[#111] border border-[#222] p-6 rounded-lg text-left mb-8 max-w-sm mx-auto">
        <h3 className="font-heading font-bold text-lg mb-3">Order Summary</h3>
        <div className="space-y-1 text-sm text-[#ccc]">
          <p><strong className="text-white">name:</strong> {order.customerName}</p>
          <p><strong className="text-white">phone:</strong> {order.phone}</p>
          <p><strong className="text-white">city:</strong> {order.city}</p>
          <p><strong className="text-white">total:</strong> {order.total}</p>
          <p className="pt-2 text-xs text-[#555]">we'll share order id via whatsapp.</p>
        </div>
      </div>

      <a
        href={`https://wa.me/${WHATSAPP}?text=${message}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 font-semibold text-sm rounded hover:bg-[#25D366]/90 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        follow up on whatsapp
      </a>

      <div className="mt-6">
        <Link to="/shop" className="text-sm text-[#999] hover:text-[#FF2D78] underline">continue shopping</Link>
      </div>
    </div>
  )
}
