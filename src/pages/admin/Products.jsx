import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../firebase/products'
import { uploadToCloudinary } from '../../firebase/cloudinary'

const brandList = ['Sony', 'Canon', 'Fujifilm', 'Nikon', 'Kodak', 'Samsung', 'Vashica', 'Polaroid', 'Sanyo', 'Olympus', 'Casio']

export default function AdminProducts() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '', brand: '', era: '', condition: '', price: '', description: '',
    isUnique: false, isSoldOut: false, isActive: true,
  })
  const [specRows, setSpecRows] = useState([])
  const specIdRef = useRef(0)
  const [slug, setSlug] = useState('')
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) { navigate('/admin/login'); return }
    getProducts().then(setProducts)
  }, [user, loading, navigate])

  function formatPrice(pkr) {
    return '₨ ' + Number(pkr).toLocaleString('en-PK')
  }

  function resetForm() {
    setForm({ name: '', brand: '', era: '', condition: '', price: '', description: '', isUnique: false, isSoldOut: false, isActive: true })
    setSpecRows([])
    setSlug('')
    setFiles([])
    setEditing(null)
    setShowForm(false)
  }

  function openEdit(p) {
    setForm({
      name: p.name || '', brand: p.brand || '', era: p.era || '', condition: p.condition || '',
      price: p.price || '', description: p.description || '',
      isUnique: p.isUnique || false, isSoldOut: p.isSoldOut || false, isActive: p.isActive ?? true,
    })
    if (p.specs && typeof p.specs === 'object') {
      const rows = Object.entries(p.specs).map(([k, v]) => {
        specIdRef.current += 1
        return { id: specIdRef.current, key: k, value: v }
      })
      setSpecRows(rows)
    } else {
      setSpecRows([])
    }
    setSlug(p.slug || '')
    setEditing(p.id)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  function addSpec() {
    specIdRef.current += 1
    setSpecRows(prev => [...prev, { id: specIdRef.current, key: '', value: '' }])
  }

  function updateSpecKey(id, newKey) {
    setSpecRows(prev => prev.map(r => r.id === id ? { ...r, key: newKey } : r))
  }

  function updateSpecValue(id, newValue) {
    setSpecRows(prev => prev.map(r => r.id === id ? { ...r, value: newValue } : r))
  }

  function removeSpec(id) {
    setSpecRows(prev => prev.filter(r => r.id !== id))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...form,
        price: String(form.price),
        slug: slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        specs: Object.fromEntries(specRows.filter(r => r.key.trim() && r.value.trim()).map(r => [r.key, r.value])),
      }

      const urls = []
      if (files.length > 0) {
        for (const file of files) {
          const url = await uploadToCloudinary(file)
          urls.push(url)
        }
      }

      if (editing) {
        if (urls.length > 0) data.images = urls
        await updateProduct(editing, data)
      } else {
        const docRef = await addProduct(data)
        if (urls.length > 0) {
          await updateProduct(docRef.id, { images: urls })
        }
      }
      resetForm()
      getProducts().then(setProducts)
    } catch (err) {
      alert('Error saving product: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    getProducts().then(setProducts)
  }

  async function toggleSoldOut(id, current) {
    await updateProduct(id, { isSoldOut: !current })
    getProducts().then(setProducts)
  }

  if (loading) return <div className="p-8 text-center text-[#555]">Loading...</div>

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="bg-[#FF2D78] text-white px-6 py-2 text-sm font-semibold rounded hover:bg-[#FF2D78]/90 transition">
          + Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#222] p-6 rounded-lg mb-8 space-y-4">
          <h2 className="font-heading text-xl font-bold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#999] mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#999] mb-1">Slug (auto from name)</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#999] mb-1">Brand *</label>
              <select value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded">
                <option value="" className="bg-[#0A0A0A]">Select brand</option>
                {brandList.map(b => <option key={b} value={b} className="bg-[#0A0A0A]">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#999] mb-1">Era</label>
              <select value={form.era} onChange={e => setForm({ ...form, era: e.target.value })} className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded">
                <option value="" className="bg-[#0A0A0A]">Select</option>
                <option value="Y2K (2000–2006)" className="bg-[#0A0A0A]">Y2K (2000–2006)</option>
                <option value="Vintage (pre-2000)" className="bg-[#0A0A0A]">Vintage (pre-2000)</option>
                <option value="Modern (2007+)" className="bg-[#0A0A0A]">Modern (2007+)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#999] mb-1">Condition</label>
              <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded">
                <option value="" className="bg-[#0A0A0A]">Select</option>
                <option value="Like New" className="bg-[#0A0A0A]">Like New</option>
                <option value="Good" className="bg-[#0A0A0A]">Good</option>
                <option value="Fair" className="bg-[#0A0A0A]">Fair</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#999] mb-1">Price (PKR) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#999] mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[#0A0A0A] border border-[#222] text-white px-3 py-2 text-sm rounded" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#999]">Specifications</label>
              <button type="button" onClick={addSpec} className="text-xs text-[#FF2D78] hover:underline">+ Add spec</button>
            </div>
            <div className="space-y-2">
              {specRows.map(r => (
                <div key={r.id} className="flex gap-2 items-center">
                  <input value={r.key} onChange={e => updateSpecKey(r.id, e.target.value)} placeholder="Key (e.g. Megapixels)" className="flex-1 bg-[#0A0A0A] border border-[#222] text-white px-3 py-1.5 text-sm rounded" />
                  <input value={r.value} onChange={e => updateSpecValue(r.id, e.target.value)} placeholder="Value (e.g. 10MP)" className="flex-1 bg-[#0A0A0A] border border-[#222] text-white px-3 py-1.5 text-sm rounded" />
                  <button type="button" onClick={() => removeSpec(r.id)} className="text-[#FF2D78] text-xs hover:underline">Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-[#ccc]">
              <input type="checkbox" checked={form.isUnique} onChange={e => setForm({ ...form, isUnique: e.target.checked })} className="accent-[#FF2D78]" />
              Unique item (max qty 1)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-[#ccc]">
              <input type="checkbox" checked={form.isSoldOut} onChange={e => setForm({ ...form, isSoldOut: e.target.checked })} className="accent-[#FF2D78]" />
              Sold out
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-[#ccc]">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-[#FF2D78]" />
              Active
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#999] mb-1">Images (up to 5)</label>
            <input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} className="text-sm text-[#999]" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-[#FF2D78] text-white px-6 py-2 text-sm font-semibold rounded hover:bg-[#FF2D78]/90 transition disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={resetForm} className="border border-[#222] text-[#999] px-6 py-2 text-sm rounded hover:text-white">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-[#111] border border-[#222] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0A0A0A] text-[#999] text-xs tracking-wider">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Condition</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-[#0A0A0A]">
                <td className="p-3">
                  <div className="w-10 h-10 bg-[#0A0A0A] rounded overflow-hidden">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="p-3 font-semibold">{p.name}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3 text-xs text-[#999]">{p.condition}</td>
                <td className="p-3">
                  <button onClick={() => toggleSoldOut(p.id, p.isSoldOut)} className={`text-xs px-2 py-0.5 font-semibold rounded ${p.isSoldOut ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
                    {p.isSoldOut ? 'Sold out' : 'Active'}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-xs text-[#FF2D78] hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-[#555]">No products yet.</p>}
      </div>
    </div>
  )
}
