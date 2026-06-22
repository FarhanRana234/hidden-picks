import { useState, useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

const brands = ['Canon', 'Fujifilm', 'Sony', 'Olympus', 'Casio', 'Nikon', 'Panasonic', 'Kodak']
const eras = ['Y2K 2000-2006', 'Vintage pre-2000', 'Modern']
const conditions = ['Like New', 'Good', 'Fair']

export default function Shop() {
  const { products, loading } = useProducts()
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedEras, setSelectedEras] = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  function toggle(arr, val) {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
  }

  const filtered = useMemo(() => {
    let result = [...products]

    if (selectedBrands.length) result = result.filter(p => selectedBrands.includes(p.brand))
    if (selectedEras.length) result = result.filter(p => selectedEras.includes(p.era))
    if (selectedConditions.length) result = result.filter(p => selectedConditions.includes(p.condition))
    result = result.filter(p => Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1])

    switch (sort) {
      case 'price-asc': result.sort((a, b) => Number(a.price) - Number(b.price)); break
      case 'price-desc': result.sort((a, b) => Number(b.price) - Number(a.price)); break
      default: result.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '') * -1); break
    }

    return result
  }, [products, selectedBrands, selectedEras, selectedConditions, priceRange, sort])

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-dark/50">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">Shop All</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - mobile toggle */}
        <button className="md:hidden bg-dark text-white px-4 py-2 text-sm uppercase tracking-wider mb-4" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Sidebar */}
        <aside className={`md:w-56 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
          {/* Brand */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Brand</h4>
            <div className="space-y-1">
              {brands.map(b => (
                <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => setSelectedBrands(toggle(selectedBrands, b))} className="accent-accent" />
                  {b}
                </label>
              ))}
            </div>
          </div>

          {/* Era */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Era</h4>
            <div className="space-y-1">
              {eras.map(e => (
                <label key={e} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectedEras.includes(e)} onChange={() => setSelectedEras(toggle(selectedEras, e))} className="accent-accent" />
                  {e}
                </label>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Condition</h4>
            <div className="space-y-1">
              {conditions.map(c => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectedConditions.includes(c)} onChange={() => setSelectedConditions(toggle(selectedConditions, c))} className="accent-accent" />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Price (PKR)</h4>
            <input type="range" min="0" max="200000" step="1000" value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-full accent-accent" />
            <p className="text-xs text-dark/60 mt-1">₨ 0 — ₨ {Number(priceRange[1]).toLocaleString('en-PK')}</p>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Sort & count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-dark/60">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
            <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm border border-dark/20 bg-white px-3 py-1.5 rounded-none">
              <option value="newest">Newest</option>
              <option value="price-asc">Price Low–High</option>
              <option value="price-desc">Price High–Low</option>
            </select>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <p className="text-center py-20 text-dark/40 font-heading text-xl">No cameras match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
