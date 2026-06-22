import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import PolaroidCard from '../components/PolaroidCard'

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
  const [banners, setBanners] = useState({
    banner1: { videoUrl: '', heading: 'The Flip Era', subtext: 'Pocket-sized. Iconic. Never Forgotten.' },
    banner2: { videoUrl: '', heading: "Shoot Like It's 2004", subtext: 'CCD Sensors. Warm Tones. Real Memories.' },
    banner3: { videoUrl: '', heading: 'Every Shot Tells a Story', subtext: 'Hidden Picks brings you hand-picked digicams from Lahore.' },
  })
  const featured = products.filter(p => !p.isSoldOut).slice(0, 6)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'banners')).then(snap => {
      if (snap.exists()) {
        setBanners(prev => ({ ...prev, ...snap.data() }))
      }
    }).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 grain corner-bracket overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D78]/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 py-24">
          <h1 className="font-heading text-[40px] md:text-[72px] font-bold leading-[1.1] mb-6">
            Shoot Different.<br />
            <span className="text-[#FF2D78]">Capture Everything.</span>
          </h1>
          <p className="font-body text-base md:text-lg text-[#999] max-w-xl mx-auto mb-10 leading-relaxed">
            Lahore's only curated digicam store. Y2K, CCD & vintage cameras shipped across Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="bg-[#FF2D78] text-white font-semibold px-8 py-3 text-sm hover:bg-[#FF2D78]/90 transition rounded" style={{ letterSpacing: '0.04em' }}>
              Shop Now
            </Link>
            <a href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="border border-[#333] text-white font-semibold px-8 py-3 text-sm hover:border-white transition rounded" style={{ letterSpacing: '0.04em' }}>
              View on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Video Banner 1 — The Flip Era */}
      <section className="relative w-full min-h-[500px] overflow-hidden">
        {banners.banner1.videoUrl ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={banners.banner1.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-[#111] flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <p className="text-[#444] text-sm mt-3">No video uploaded yet</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">{banners.banner1.heading}</h2>
          <p className="text-[#999] text-lg">{banners.banner1.subtext}</p>
        </div>
      </section>

      {/* Video Banner 2 — Shoot Like It's 2004 */}
      <section className="relative w-full min-h-[500px] overflow-hidden">
        {banners.banner2.videoUrl ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={banners.banner2.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-[#111] flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <p className="text-[#444] text-sm mt-3">No video uploaded yet</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">{banners.banner2.heading}</h2>
          <p className="text-[#999] text-lg">{banners.banner2.subtext}</p>
        </div>
      </section>

      {/* Video Banner 3 — 50/50 Split */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        <div className="bg-[#0A0A0A] flex flex-col items-center justify-center px-8 py-16 text-center md:text-left md:items-start">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">{banners.banner3.heading}</h2>
          <p className="text-[#999] max-w-md mb-8 leading-relaxed">{banners.banner3.subtext}</p>
          <Link to="/shop" className="bg-[#FF2D78] text-white font-semibold px-8 py-3 text-sm hover:bg-[#FF2D78]/90 transition rounded" style={{ letterSpacing: '0.04em' }}>
            shop now
          </Link>
        </div>
        <div className="relative min-h-[300px] md:min-h-full overflow-hidden">
          {banners.banner3.videoUrl ? (
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src={banners.banner3.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-[#111] flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <p className="text-[#444] text-sm mt-3">No video uploaded yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Fresh Drops */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold">Fresh Drops</h2>
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
            <span key={i} className="font-heading text-lg md:text-xl text-[#555] tracking-[0.2em] mx-8">{b}</span>
          ))}
        </div>
      </section>

      {/* Why Hidden Picks */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-center mb-12">Why Hidden Picks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-[#111] border border-[#222] rounded-lg p-6 text-center">
                <div className="text-[#FF2D78] flex justify-center mb-4">{f.icon}</div>
                <h4 className="font-heading text-base font-bold mb-2">{f.title}</h4>
                <p className="text-sm text-[#999] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pack an Order With Me */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">Pack an Order With Me 📦</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Browse & Pick', desc: 'Find your perfect digicam from our curated collection.' },
              { num: '02', title: 'Order via WhatsApp', desc: 'Message us on WhatsApp or place order directly on site.' },
              { num: '03', title: 'Packed & Shipped With Love', desc: 'We carefully pack and ship your camera across Pakistan.' },
            ].map(s => (
              <div key={s.num} className="bg-[#0A0A0A] border border-[#222] rounded-lg p-6">
                <span className="text-[#FF2D78] font-heading text-3xl font-bold block mb-3">{s.num}</span>
                <h4 className="font-heading text-lg font-bold mb-2">{s.title}</h4>
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
          <p className="text-[#999] text-sm mb-8">Follow us for daily drops & digicam inspo</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
            {instagramPosts.map((_, i) => (
              <a key={i} href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="aspect-square bg-[#111] rounded border border-[#222] flex items-center justify-center text-[#555] hover:border-[#FF2D78] transition overflow-hidden group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </a>
            ))}
          </div>
          <a href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#FF2D78] text-white font-semibold px-8 py-3 text-sm hover:bg-[#FF2D78]/90 transition rounded" style={{ letterSpacing: '0.04em' }}>
            Follow on Instagram
          </a>
        </div>
      </section>
    </div>
  )
}
