import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug, getProducts } from '../firebase/products'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

export default function Product() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [showSpecs, setShowSpecs] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProductBySlug(slug).then(p => {
      setProduct(p)
      setSelectedImage(0)
      setQty(1)
      if (p) {
        getProducts().then(all => {
          setRelated(all.filter(r => r.id !== p.id && !r.isSoldOut).slice(0, 4))
        })
      }
    }).finally(() => setLoading(false))
    window.scrollTo(0, 0)
  }, [slug])

  function formatPrice(pkr) {
    return '₨ ' + Number(pkr).toLocaleString('en-PK')
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-[#555]">Loading...</div>
  if (!product) return <div className="max-w-6xl mx-auto px-4 py-20 text-center font-heading text-2xl text-white">camera not found</div>

  const soldOut = product.isSoldOut

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/shop" className="text-sm text-[#999] hover:text-[#FF2D78] transition mb-6 inline-block">&larr; back to shop</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="aspect-[4/3] bg-[#111] rounded-lg mb-3 overflow-hidden">
            {product.images?.length > 0 ? (
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#555] font-heading">no image</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded overflow-hidden border-2 ${i === selectedImage ? 'border-[#FF2D78]' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.condition === 'Like New' ? 'bg-[#FF2D78]/20 text-[#FF2D78]' : 'bg-[#222] text-[#999]'}`}>{product.condition}</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mt-3 mb-3">{product.name}</h1>
          <p className="font-heading text-3xl text-[#FFD700] font-bold mb-6">{formatPrice(product.price)}</p>
          <p className="text-sm leading-relaxed text-[#999] mb-6">{product.description}</p>

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-6">
              <button onClick={() => setShowSpecs(!showSpecs)} className="text-sm font-semibold text-[#FF2D78] hover:underline">
                {showSpecs ? 'hide' : 'show'} specifications
              </button>
              {showSpecs && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  {Object.entries(product.specs).map(([k, v], i) => (
                    <div key={k} className={`flex px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-[#111]' : 'bg-[#0A0A0A]'}`}>
                      <span className="w-1/2 font-semibold text-white capitalize">{k}</span>
                      <span className="w-1/2 text-[#999]">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-[#222] rounded">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-sm text-[#999] hover:text-white hover:bg-[#222] transition rounded-l">-</button>
              <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center text-white">{qty}</span>
              <button onClick={() => setQty(Math.min(product.isUnique ? 1 : 99, qty + 1))} className="px-3 py-2 text-sm text-[#999] hover:text-white hover:bg-[#222] transition rounded-r">+</button>
            </div>
            <button
              disabled={soldOut}
              onClick={() => addItem({ id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.images?.[0], maxQty: product.isUnique ? 1 : 99, qty })}
              className={`flex-1 py-3 font-semibold text-sm rounded transition ${soldOut ? 'bg-[#222] text-[#555] cursor-not-allowed' : 'bg-[#FF2D78] text-white hover:bg-[#FF2D78]/90'}`}
            >
              {soldOut ? 'sold out' : 'add to cart'}
            </button>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" listed at ₨${product.price} on Hidden Picks.`)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 text-sm font-semibold rounded hover:bg-[#25D366]/90 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            ask on whatsapp
          </a>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl font-bold mb-6 lowercase">you might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
