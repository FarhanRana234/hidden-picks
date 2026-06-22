import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug, getProducts } from '../firebase/products'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import ProductCard from '../components/ProductCard'

export default function Product() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const toast = useToast()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const mainImgRef = useRef(null)
  const touchStartX = useRef(0)

  useEffect(() => {
    setLoading(true)
    getProductBySlug(slug).then(p => {
      setProduct(p)
      setSelectedImage(0)
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

  function prevImage() {
    if (!product?.images?.length) return
    setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length)
  }

  function nextImage() {
    if (!product?.images?.length) return
    setSelectedImage(prev => (prev + 1) % product.images.length)
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage()
      else prevImage()
    }
  }

  function handleMouseMove(e) {
    if (!zoomed || !mainImgRef.current) return
    const rect = mainImgRef.current.getBoundingClientRect()
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  function toggleZoom() {
    setZoomed(!zoomed)
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-[#555]">Loading...</div>
  if (!product) return <div className="max-w-6xl mx-auto px-4 py-20 text-center font-heading text-2xl text-white">Camera not found</div>

  const soldOut = product.isSoldOut

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/shop" className="text-sm text-[#999] hover:text-[#FF2D78] transition mb-6 inline-block">&larr; Back to Shop</Link>

      <div className="product-detail-layout">
        <div className="product-gallery">
          <div
            className={`gallery-main ${zoomed ? 'zoomed' : ''}`}
            ref={mainImgRef}
            onClick={toggleZoom}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
          >
            {product.images?.length > 0 ? (
              <img src={product.images[selectedImage]} alt={product.name} className="gallery-main-img" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#555] font-heading">No image</div>
            )}

            {product.images?.length > 1 && !zoomed && (
              <>
                <button className="gallery-arrow prev" onClick={e => { e.stopPropagation(); prevImage() }} aria-label="Previous">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="gallery-arrow next" onClick={e => { e.stopPropagation(); nextImage() }} aria-label="Next">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="gallery-dots">
              {product.images.map((_, i) => (
                <button key={i} className={`gallery-dot ${i === selectedImage ? 'active' : ''}`} onClick={() => setSelectedImage(i)} aria-label={`Image ${i + 1}`} />
              ))}
            </div>
          )}

          {product.images?.length > 1 && (
            <div className="product-thumbnails">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={i === selectedImage ? 'active' : ''}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-info-header">
            <span className="product-brand-label">{product.brand}</span>
            <span className={`product-condition ${(product.condition || '').toLowerCase().replace(/\s+/g, '-')}`}>{product.condition}</span>
          </div>
          <h1>{product.name}</h1>
          <p className="product-price">{formatPrice(product.price)}</p>
          {product.description && <p className="product-description">{product.description}</p>}

          <hr className="border-[#222] my-6" />

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-6">
              <table className="product-specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <tr key={k}>
                      <td className="spec-key">{k}</td>
                      <td className="spec-value">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <hr className="border-[#222] my-6" />

          {soldOut ? (
            <div className="sold-out-notice">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              This item is sold out
            </div>
          ) : (
            <button
              onClick={() => {
                addItem({ id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.images?.[0], maxQty: product.isUnique ? 1 : 99, qty: 1 })
                toast('Added to cart')
              }}
              className="product-add-cart-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              Add to Cart
            </button>
          )}

          <hr className="border-[#222] my-6" />

          <div className="delivery-info">
            <div className="delivery-info-row">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF2D78]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <span>Ships across Pakistan</span>
            </div>
            <div className="delivery-info-row">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF2D78]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Tested and verified</span>
            </div>
            <div className="delivery-info-row">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF2D78]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>Based in Lahore</span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="related-products">
          <h2>You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
