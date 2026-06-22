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

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-dark/50">Loading...</div>
  if (!product) return <div className="max-w-6xl mx-auto px-4 py-20 text-center font-heading text-2xl">Camera not found</div>

  const soldOut = product.isSoldOut

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/shop" className="text-sm text-dark/50 hover:text-accent transition mb-6 inline-block">&larr; Back to Shop</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="aspect-[4/3] bg-cream mb-3 overflow-hidden">
            {product.images?.length > 0 ? (
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-dark/30 font-heading">No Image</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 overflow-hidden border-2 ${i === selectedImage ? 'border-accent' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs uppercase tracking-wider bg-cream px-2 py-1 text-dark/70">{product.condition}</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-4">{product.name}</h1>
          <p className="font-heading text-3xl text-accent font-bold mb-6">{formatPrice(product.price)}</p>

          <p className="text-sm leading-relaxed text-dark/70 mb-6">{product.description}</p>

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-6">
              <button onClick={() => setShowSpecs(!showSpecs)} className="text-sm font-semibold uppercase tracking-wider text-accent hover:underline">
                {showSpecs ? 'Hide' : 'Show'} Specifications
              </button>
              {showSpecs && (
                <div className="mt-3 border border-dark/10 divide-y divide-dark/10">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex px-3 py-2 text-sm">
                      <span className="w-1/2 font-semibold capitalize">{k}</span>
                      <span className="w-1/2 text-dark/70">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-dark/20">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-sm hover:bg-dark/5">-</button>
              <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(product.isUnique ? 1 : 99, qty + 1))} className="px-3 py-2 text-sm hover:bg-dark/5">+</button>
            </div>
            <button
              disabled={soldOut}
              onClick={() => addItem({ id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.images?.[0], maxQty: product.isUnique ? 1 : 99, qty })}
              className={`flex-1 py-3 font-semibold uppercase tracking-wider text-sm transition ${soldOut ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-dark text-white hover:bg-accent'}`}
            >
              {soldOut ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" — ${formatPrice(product.price)}\n${window.location.href}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-dark text-dark py-3 text-sm font-semibold uppercase tracking-wider hover:bg-dark hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Ask on WhatsApp
          </a>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl font-bold mb-6">You May Also Like</h2>
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
