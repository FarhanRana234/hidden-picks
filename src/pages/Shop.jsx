import { useState, useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

const brands = ['Sony', 'Canon', 'Fujifilm', 'Nikon', 'Kodak', 'Samsung', 'Vashica', 'Polaroid', 'Sanyo', 'Olympus', 'Casio']
const eras = ['Y2K (2000–2006)', 'Vintage (pre-2000)', 'Modern (2007+)']
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

  const activeFilters = [...selectedBrands, ...selectedEras, ...selectedConditions]

  function removeFilter(val) {
    if (selectedBrands.includes(val)) setSelectedBrands(prev => prev.filter(v => v !== val))
    if (selectedEras.includes(val)) setSelectedEras(prev => prev.filter(v => v !== val))
    if (selectedConditions.includes(val)) setSelectedConditions(prev => prev.filter(v => v !== val))
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-[#555]">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Shop All</h1>
      <p className="text-[#999] text-sm mb-8">find your perfect digicam</p>

      <div className="flex flex-col md:flex-row gap-8">
        <button className="md:hidden bg-[#111] text-white px-4 py-2 text-sm rounded mb-4 border border-[#222]" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'hide filters' : 'show filters'}
        </button>

        <aside className={`md:w-56 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div>
            <h4 className="font-heading text-xs font-bold tracking-wider text-[#999] mb-3">Brand</h4>
            <div className="space-y-1.5">
              {brands.map(b => (
                <label key={b} className="flex items-center gap-2 text-sm cursor-pointer text-[#ccc]">
                  <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => setSelectedBrands(toggle(selectedBrands, b))} className="accent-[#FF2D78]" />
                  {b}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading text-xs font-bold tracking-wider text-[#999] mb-3">Era</h4>
            <div className="space-y-1.5">
              {eras.map(e => (
                <label key={e} className="flex items-center gap-2 text-sm cursor-pointer text-[#ccc]">
                  <input type="checkbox" checked={selectedEras.includes(e)} onChange={() => setSelectedEras(toggle(selectedEras, e))} className="accent-[#FF2D78]" />
                  {e}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading text-xs font-bold tracking-wider text-[#999] mb-3">Condition</h4>
            <div className="space-y-1.5">
              {conditions.map(c => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer text-[#ccc]">
                  <input type="checkbox" checked={selectedConditions.includes(c)} onChange={() => setSelectedConditions(toggle(selectedConditions, c))} className="accent-[#FF2D78]" />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading text-xs font-bold tracking-wider text-[#999] mb-3">Price (PKR)</h4>
            <input type="range" min="0" max="200000" step="1000" value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-full" />
            <p className="text-xs text-[#999] mt-1">₨ 0 — ₨ {Number(priceRange[1]).toLocaleString('en-PK')}</p>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#999]">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
            <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm bg-[#111] text-white border border-[#222] px-3 py-1.5 rounded">
              <option value="newest">newest</option>
              <option value="price-asc">price low–high</option>
              <option value="price-desc">price high–low</option>
            </select>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map(f => (
                <button key={f} onClick={() => removeFilter(f)} className="text-xs bg-[#FF2D78]/10 text-[#FF2D78] border border-[#FF2D78]/30 px-2.5 py-1 rounded-full hover:bg-[#FF2D78]/20 transition">
                  {f} &times;
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="text-center py-20 text-[#555] font-heading text-xl">no cameras match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
