import { useState, useEffect } from 'react'
import { getSettings } from '../firebase/settings'

const STORAGE_KEY = 'hp_banner_dismissed'

export default function AnnouncementBanner() {
  const [text, setText] = useState('')
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')

  useEffect(() => {
    getSettings().then(s => {
      if (s?.announcementBanner?.show && s?.announcementBanner?.text) {
        setText(s.announcementBanner.text)
      }
    }).catch(() => {
      setText('🎥 New digicams just dropped — Shop now before they\'re gone!')
    })
  }, [])

  if (!text || dismissed) return null

  function handleDismiss() {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  return (
    <div className="bg-[#FF2D78] text-white text-xs md:text-sm py-2 relative overflow-hidden">
      <div className="marquee-banner whitespace-nowrap">
        <span className="mx-8">{text}</span>
        <span className="mx-8">{text}</span>
        <span className="mx-8">{text}</span>
        <span className="mx-8">{text}</span>
      </div>
      <button onClick={handleDismiss} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-lg leading-none z-10">&times;</button>
    </div>
  )
}
