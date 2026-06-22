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
  const [filtersOpen, setFiltersOpen] = useState(false)

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

  function clearAllFilters() {
    setSelectedBrands([])
    setSelectedEras([])
    setSelectedConditions([])
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-[#555]">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Shop All</h1>
      <p className="text-[#999] text-sm mb-8">Find Your Perfect Digicam</p>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <div className="filters-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
            <span>Filters</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>

          <div className={`filters-content ${filtersOpen ? 'open' : ''}`}>
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
          </div>
        </aside>

        <div className="shop-main">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#999]">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
            <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm bg-[#111] text-white border border-[#222] px-3 py-1.5 rounded">
              <option value="newest">Newest</option>
              <option value="price-asc">Price Low–High</option>
              <option value="price-desc">Price High–Low</option>
            </select>
          </div>

          {activeFilters.length > 0 && (
            <div className="active-filters-row">
              {activeFilters.map(f => (
                <span key={f} className="active-filter-pill">
                  {f}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={() => removeFilter(f)}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </span>
              ))}
              <button className="clear-all" onClick={clearAllFilters}>Clear All</button>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="text-center py-20 text-[#555] font-heading text-xl">No cameras match your filters.</p>
          ) : (
            <div className="product-grid">
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
