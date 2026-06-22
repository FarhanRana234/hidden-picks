import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../firebase/products'
import { uploadToCloudinary } from '../../firebase/cloudinary'

export default function AdminProducts() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '', brand: '', era: '', condition: '', price: '', description: '',
    isUnique: false, isSoldOut: false, isActive: true, specs: {},
  })
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
    setForm({ name: '', brand: '', era: '', condition: '', price: '', description: '', isUnique: false, isSoldOut: false, isActive: true, specs: {} })
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
      specs: p.specs || {},
    })
    setSlug(p.slug || '')
    setEditing(p.id)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  function handleSpecKeyChange(oldKey, newKey) {
    setForm(prev => {
      const specs = { ...prev.specs }
      if (oldKey !== newKey) {
        specs[newKey] = specs[oldKey]
        delete specs[oldKey]
      }
      return { ...prev, specs }
    })
  }

  function handleSpecValueChange(key, value) {
    setForm(prev => ({ ...prev, specs: { ...prev.specs, [key]: value } }))
  }

  function addSpec() {
    setForm(prev => ({ ...prev, specs: { ...prev.specs, '': '' } }))
  }

  function removeSpec(key) {
    setForm(prev => {
      const specs = { ...prev.specs }
      delete specs[key]
      return { ...prev, specs }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...form,
        price: String(form.price),
        slug: slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        specs: Object.fromEntries(Object.entries(form.specs).filter(([k, v]) => k.trim() && v.trim())),
      }

      const urls = []
      if (files.length > 0) {
        for (const file of files) {
          const url = await uploadToCloudinary(file)
          urls.push(url)
        }
      }

      if (editing) {
        await updateProduct(editing, { ...data, images: urls.length > 0 ? urls : undefined })
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

  if (loading) return <div className="p-8 text-center text-dark/50">Loading...</div>

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-dark text-white px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="font-heading font-bold text-lg">Hidden Picks Admin</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/admin/orders" className="hover:text-accent transition">Orders</Link>
          <Link to="/admin/settings" className="hover:text-accent transition">Settings</Link>
          <Link to="/" className="hover:text-accent transition">View Store</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold">Products</h1>
          <button onClick={() => { resetForm(); setShowForm(true) }} className="bg-dark text-white px-6 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-accent transition">
            + Add Product
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm mb-8 space-y-4">
            <h2 className="font-heading text-xl font-bold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border border-dark/20 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Slug (auto from name)</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full border border-dark/20 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Brand *</label>
                <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required className="w-full border border-dark/20 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Era</label>
                <select value={form.era} onChange={e => setForm({ ...form, era: e.target.value })} className="w-full border border-dark/20 bg-white px-3 py-2 text-sm">
                  <option value="">Select</option>
                  <option value="Y2K 2000-2006">Y2K 2000-2006</option>
                  <option value="Vintage pre-2000">Vintage pre-2000</option>
                  <option value="Modern">Modern</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Condition</label>
                <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} className="w-full border border-dark/20 bg-white px-3 py-2 text-sm">
                  <option value="">Select</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Price (PKR) *</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className="w-full border border-dark/20 px-3 py-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-dark/20 px-3 py-2 text-sm" />
            </div>

            {/* Specs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold">Specifications</label>
                <button type="button" onClick={addSpec} className="text-xs text-accent hover:underline">+ Add Spec</button>
              </div>
              <div className="space-y-2">
                {Object.entries(form.specs).map(([key, val]) => (
                  <div key={key} className="flex gap-2 items-center">
                    <input value={key} onChange={e => handleSpecKeyChange(key, e.target.value)} placeholder="Key (e.g. Megapixels)" className="flex-1 border border-dark/20 px-3 py-1.5 text-sm" />
                    <input value={val} onChange={e => handleSpecValueChange(key, e.target.value)} placeholder="Value (e.g. 10MP)" className="flex-1 border border-dark/20 px-3 py-1.5 text-sm" />
                    <button type="button" onClick={() => removeSpec(key)} className="text-red-500 text-xs hover:underline">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isUnique} onChange={e => setForm({ ...form, isUnique: e.target.checked })} className="accent-accent" />
                Unique item (max qty 1)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isSoldOut} onChange={e => setForm({ ...form, isSoldOut: e.target.checked })} className="accent-accent" />
                Sold Out
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-accent" />
                Active
              </label>
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs font-semibold mb-1">Images (up to 5)</label>
              <input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} className="text-sm" />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-dark text-white px-6 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-accent transition disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={resetForm} className="border border-dark/20 px-6 py-2 text-sm hover:bg-dark/5">Cancel</button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Condition</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-cream/50">
                  <td className="p-3">
                    <div className="w-10 h-10 bg-cream overflow-hidden">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{formatPrice(p.price)}</td>
                  <td className="p-3 text-xs uppercase">{p.condition}</td>
                  <td className="p-3">
                    <button onClick={() => toggleSoldOut(p.id, p.isSoldOut)} className={`text-xs px-2 py-0.5 font-semibold uppercase ${p.isSoldOut ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {p.isSoldOut ? 'Sold Out' : 'Active'}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-xs text-accent hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="p-8 text-center text-dark/40">No products yet.</p>}
        </div>
      </div>
    </div>
  )
}
