import { useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

export default function Budget() {
  const { products, loading } = useProducts()

  const budgetProducts = useMemo(() => {
    return products.filter(p => !p.isSoldOut && Number(p.price) < 16000)
      .sort((a, b) => Number(a.price) - Number(b.price))
  }, [products])

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-[#555]">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Digicams Under ₨16,000</h1>
      <p className="text-[#999] text-sm mb-8">Real cameras. Real memories. Real budget.</p>

      {budgetProducts.length === 0 ? (
        <p className="text-center py-20 text-[#555] font-heading text-xl">Nothing under 16k right now — check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {budgetProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
