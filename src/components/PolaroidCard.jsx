import { Link } from 'react-router-dom'

export default function PolaroidCard({ product }) {
  const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-3', 'rotate-3']
  const isNew = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000

  return (
    <Link to={`/product/${product.slug}`} className="block relative group">
      {isNew && (
        <span className="absolute -top-1 -right-1 z-10 bg-[#FF2D78] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">New</span>
      )}
      <div className={`bg-[#111] p-2 pb-6 rounded-lg border border-[#222] ${rotations[Math.floor(Math.random() * rotations.length)]} hover:scale-105 transition-transform duration-300`}>
        <div className="aspect-square overflow-hidden rounded mb-2 bg-[#0A0A0A]">
          {product.images?.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#555] font-heading text-sm">no image</div>
          )}
        </div>
        <p className="font-heading text-xs text-center text-[#999] tracking-wide">{product.name}</p>
        <p className="font-body text-xs text-center text-[#FFD700] font-bold mt-1">₨ {Number(product.price).toLocaleString('en-PK')}</p>
      </div>
    </Link>
  )
}
