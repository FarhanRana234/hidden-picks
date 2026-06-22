import { Link } from 'react-router-dom'

export default function PolaroidCard({ product }) {
  const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-3', 'rotate-3']

  return (
    <Link to={`/product/${product.slug}`} className="block">
      <div className={`bg-white p-3 pb-8 shadow-lg ${rotations[Math.floor(Math.random() * rotations.length)]} hover:scale-105 transition-transform duration-300`}>
        <div className="aspect-square overflow-hidden bg-cream mb-2">
          {product.images?.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-dark/30 font-heading">📷</div>
          )}
        </div>
        <p className="font-heading text-sm text-center text-dark/70 tracking-wide">
          {product.name}
        </p>
      </div>
    </Link>
  )
}
