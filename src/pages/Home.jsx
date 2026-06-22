import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import PolaroidCard from '../components/PolaroidCard'
import ProductCard from '../components/ProductCard'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

const brands = ['Sony', 'Canon', 'Fujifilm', 'Nikon', 'Kodak', 'Samsung', 'Vashica', 'Polaroid', 'Sanyo', 'Olympus', 'Casio']

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
    title: 'tested & verified',
    desc: 'every camera checked before shipping',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
    title: 'based in lahore',
    desc: 'same-day delivery in lahore, 2-3 days nationwide',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    ),
    title: 'whatsapp support',
    desc: 'quick replies, 7 days a week',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    ),
    title: 'safe packaging',
    desc: 'bubble wrap & box, nationwide shipping',
  },
]

const instagramPosts = Array(6).fill(null)

export default function Home() {
  const { products } = useProducts()
  const featured = products.filter(p => !p.isSoldOut).slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 grain corner-bracket overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D78]/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 py-24">
          <h1 className="font-heading text-[40px] md:text-[72px] font-bold leading-[1.1] tracking-tight mb-6">
            shoot different.<br />
            <span className="text-[#FF2D78]">capture everything.</span>
          </h1>
          <p className="font-body text-base md:text-lg text-[#999] max-w-xl mx-auto mb-10 leading-relaxed">
            lahore's only curated digicam store. y2k, ccd & vintage cameras shipped across pakistan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="bg-[#FF2D78] text-white font-semibold px-8 py-3 text-sm hover:bg-[#FF2D78]/90 transition rounded">
              shop now
            </Link>
            <a href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="border border-[#333] text-white font-semibold px-8 py-3 text-sm hover:border-white transition rounded">
              view on instagram
            </a>
          </div>
        </div>
      </section>

      {/* Video Banner 1 — The Flip Era */}
      <section className="relative w-full min-h-[500px] overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/flip-era.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">the flip era</h2>
          <p className="text-[#999] text-lg">pocket-sized. iconic. never forgotten.</p>
        </div>
      </section>

      {/* Video Banner 2 — Shoot Like It's 2004 */}
      <section className="relative w-full min-h-[500px] overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/digicam-footage.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">shoot like it's 2004</h2>
          <p className="text-[#999] text-lg">ccd sensors. warm tones. real memories.</p>
        </div>
      </section>

      {/* Video Banner 3 — 50/50 Split */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        <div className="bg-[#0A0A0A] flex flex-col items-center justify-center px-8 py-16 text-center md:text-left md:items-start">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">every shot tells a story</h2>
          <p className="text-[#999] max-w-md mb-8 leading-relaxed">
            hidden picks brings you hand-picked digicams from lahore. tested, verified, shipped across pakistan.
          </p>
          <Link to="/shop" className="bg-[#FF2D78] text-white font-semibold px-8 py-3 text-sm hover:bg-[#FF2D78]/90 transition rounded">
            shop now
          </Link>
        </div>
        <div className="relative min-h-[300px] md:min-h-full overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/videos/cinematic-broll.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Fresh Drops */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold lowercase">fresh drops</h2>
            <div className="w-12 h-0.5 bg-[#FF2D78] mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {featured.map(p => (
              <PolaroidCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-10 bg-[#0A0A0A] border-y border-[#222] overflow-hidden">
        <div className="flex marquee-track whitespace-nowrap">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="font-heading text-lg md:text-xl text-[#555] tracking-[0.2em] uppercase mx-8">{b}</span>
          ))}
        </div>
      </section>

      {/* Why Hidden Picks */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center lowercase mb-12">why hidden picks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-[#111] border border-[#222] rounded-lg p-6 text-center">
                <div className="text-[#FF2D78] flex justify-center mb-4">{f.icon}</div>
                <h4 className="font-heading text-base font-bold mb-2 lowercase">{f.title}</h4>
                <p className="text-sm text-[#999] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pack an Order With Me */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">pack an order with me 📦</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'browse & pick', desc: 'find your perfect digicam from our curated collection.' },
              { num: '02', title: 'order via whatsapp', desc: 'message us on whatsapp or place order directly on site.' },
              { num: '03', title: 'packed & shipped with love', desc: 'we carefully pack and ship your camera across pakistan.' },
            ].map(s => (
              <div key={s.num} className="bg-[#0A0A0A] border border-[#222] rounded-lg p-6">
                <span className="text-[#FF2D78] font-heading text-3xl font-bold block mb-3">{s.num}</span>
                <h4 className="font-heading text-lg font-bold mb-2 lowercase">{s.title}</h4>
                <p className="text-sm text-[#999]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">@hiddenpicks.co_</h2>
          <p className="text-[#999] text-sm mb-8">follow us for daily drops & digicam inspo</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
            {instagramPosts.map((_, i) => (
              <a key={i} href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="aspect-square bg-[#111] rounded border border-[#222] flex items-center justify-center text-[#555] hover:border-[#FF2D78] transition overflow-hidden group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </a>
            ))}
          </div>
          <a href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#FF2D78] text-white font-semibold px-8 py-3 text-sm hover:bg-[#FF2D78]/90 transition rounded">
            follow on instagram
          </a>
        </div>
      </section>
    </div>
  )
}
