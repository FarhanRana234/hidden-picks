import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getInstagramImages } from '../firebase/instagram'
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

export default function Home() {
  const { products } = useProducts()
  const [instagramImages, setInstagramImages] = useState([])
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
    getInstagramImages().then(data => {
      if (data?.images) setInstagramImages(data.images)
    }).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero relative min-h-screen flex items-center justify-center px-4 grain corner-bracket overflow-hidden">
        {banners.banner1.videoUrl ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={banners.banner1.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 banner-placeholder" />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D78]/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 py-24">
          <h1 className="font-heading text-[40px] md:text-[72px] font-bold leading-[1.1] mb-6">
            Shoot Different.<br />
            <span className="text-[#FF2D78]">Capture Everything.</span>
          </h1>
          <p className="font-body text-base md:text-lg text-[#999] max-w-xl mx-auto mb-10 leading-relaxed">
            Lahore's only curated digicam store. Y2K, CCD & vintage cameras shipped across Pakistan.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="bg-[#FF2D78] text-white font-semibold px-8 py-3 text-sm hover:bg-[#FF2D78]/90 transition rounded" style={{ letterSpacing: '0.04em' }}>
              Shop Now
            </Link>
            <a href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="border border-[#333] text-white font-semibold px-8 py-3 text-sm hover:border-white transition rounded" style={{ letterSpacing: '0.04em' }}>
              View on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Video Banner 2 — Shoot Like It's 2004 */}
      <section className="banner-2">
        {banners.banner2.videoUrl ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={banners.banner2.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="banner-placeholder">
            <i className="ti ti-video" />
            <p>Upload video from Admin → Banners</p>
            <span>Recommended: 21:9 cinematic</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">{banners.banner2.heading}</h2>
          <p className="text-[#999] text-lg">{banners.banner2.subtext}</p>
        </div>
      </section>

      {/* Video Banner 3 — 50/50 Split */}
      <section className="banner-3">
        <div className="text-side bg-[#0A0A0A] flex flex-col items-center justify-center px-8 py-16 text-center md:text-left md:items-start">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">{banners.banner3.heading}</h2>
          <p className="text-[#999] max-w-md mb-8 leading-relaxed">{banners.banner3.subtext}</p>
          <Link to="/shop" className="bg-[#FF2D78] text-white font-semibold px-8 py-3 text-sm hover:bg-[#FF2D78]/90 transition rounded" style={{ letterSpacing: '0.04em' }}>
            Shop Now
          </Link>
        </div>
        <div className="video-side relative overflow-hidden">
          {banners.banner3.videoUrl ? (
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src={banners.banner3.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="banner-placeholder">
              <i className="ti ti-video" />
              <p>Upload video from Admin → Banners</p>
              <span>Recommended: 9:16 or 1:1</span>
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

      {/* Instagram Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">@hiddenpicks.co_</h2>
          <p className="text-[#999] text-sm mb-8">Follow us for daily drops & digicam inspo</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
            {Array.from({ length: 6 }, (_, i) => {
              const img = instagramImages[i] || {}
              return (
                <a key={i} href={img.link || 'https://instagram.com/hiddenpicks.co_'} target="_blank" rel="noopener noreferrer" className={`aspect-square bg-[#111] rounded border border-[#222] flex items-center justify-center hover:border-[#FF2D78] transition overflow-hidden group ${img.url ? 'p-0' : ''}`}>
                  {img.url ? (
                    <img src={img.url} alt={`instagram ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#555] group-hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                </a>
              )
            })}
          </div>
          <a href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#FF2D78] text-white font-semibold px-8 py-3 text-sm hover:bg-[#FF2D78]/90 transition rounded" style={{ letterSpacing: '0.04em' }}>
            Follow on Instagram
          </a>
        </div>
      </section>
    </div>
  )
}
