import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

function isNewProduct(createdAt) {
  if (!createdAt) return false
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt)
  return date > sevenDaysAgo
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const toast = useToast()

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0],
      maxQty: product.isUnique ? 1 : 99,
      qty: 1,
    })
    toast('Added to cart')
  }

  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-card-image-wrap">
        {product.images?.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="product-card-image" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#555] text-xs">No image</div>
        )}

        {product.isSoldOut && (
          <div className="product-card-soldout-overlay">
            <span>Sold Out</span>
          </div>
        )}

        {isNewProduct(product.createdAt) && !product.isSoldOut && (
          <span className="product-card-new-badge">New</span>
        )}

        <span className={`product-card-condition ${(product.condition || '').toLowerCase().replace(/\s+/g, '-')}`}>
          {product.condition}
        </span>

        {!product.isSoldOut && (
          <button className="product-card-cart-btn" onClick={handleAddToCart} aria-label="Add to cart">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
          </button>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-card-brand">{product.brand}</p>
        <h3 className="product-card-name">{product.name}</h3>

        <div className="product-card-footer">
          <span className="product-card-price">₨ {Number(product.price).toLocaleString('en-PK')}</span>
        </div>
      </div>
    </Link>
  )
}
