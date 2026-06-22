import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import PolaroidCard from '../components/PolaroidCard'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

const brands = ['Canon', 'Fujifilm', 'Sony', 'Olympus', 'Casio']
const features = [
  { title: 'Tested & Verified', desc: 'Every camera checked before shipping' },
  { title: 'Lahore Based', desc: 'Store in the heart of Punjab' },
  { title: 'WhatsApp Support', desc: 'Quick replies, 7 days a week' },
  { title: 'Secure Packaging', desc: 'Bubble wrap & box, guaranteed' },
]

const instagramPosts = Array(6).fill(null)

export default function Home() {
  const { products } = useProducts()
  const featured = products.filter(p => !p.isSoldOut).slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-dark text-white py-24 md:py-32 px-4 corner-bracket">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
            Shoot Different
          </h1>
          <p className="font-body text-lg md:text-xl opacity-80 max-w-2xl mx-auto mb-10">
            Curated Y2K & CCD digicams from Lahore. Every camera tested, verified, and ready to ship.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="bg-accent text-white font-semibold px-8 py-3 uppercase tracking-widest text-sm hover:bg-accent/90 transition">
              Shop Now
            </Link>
            <a href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="border border-white text-white font-semibold px-8 py-3 uppercase tracking-widest text-sm hover:bg-white hover:text-dark transition">
              View on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="py-10 bg-white border-y border-dark/5">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {brands.map(b => (
            <span key={b} className="font-heading text-xl md:text-2xl text-dark/40 tracking-widest uppercase">{b}</span>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">Featured Cameras</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featured.map(p => (
              <PolaroidCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Row */}
      <section className="py-12 md:py-16 bg-dark text-white px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map(f => (
            <div key={f.title} className="text-center">
              <h4 className="font-heading text-lg font-bold mb-2">{f.title}</h4>
              <p className="text-sm opacity-70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Follow Us</h2>
          <p className="text-dark/60 mb-10">@hiddenpicks.co_</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {instagramPosts.map((_, i) => (
              <a key={i} href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="aspect-square bg-dark/10 flex items-center justify-center text-dark/30 font-heading text-sm hover:bg-accent/10 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
