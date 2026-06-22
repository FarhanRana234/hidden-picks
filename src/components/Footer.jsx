const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white mt-auto border-t border-[#222]">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-heading text-lg font-bold mb-4">Hidden Picks</h4>
          <p className="text-sm text-[#999] leading-relaxed">
            Lahore's only curated digicam store. Y2K, CCD & vintage cameras shipped across Pakistan.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-bold mb-4 tracking-wider text-[#999]">Quick Links</h4>
          <ul className="space-y-2 text-sm text-[#999]">
            <li><a href="/shop" className="hover:text-[#FF2D78] transition">Shop All</a></li>
            <li><a href="/budget" className="hover:text-[#FF2D78] transition">Budget Picks</a></li>
            <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF2D78] transition">WhatsApp</a></li>
            <li><a href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF2D78] transition">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-sm font-bold mb-4 tracking-wider text-[#999]">Contact</h4>
          <ul className="space-y-2 text-sm text-[#999]">
            <li>Lahore, Pakistan</li>
            <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF2D78] transition">+92{WHATSAPP?.slice(2)}</a></li>
            <li className="flex gap-3 mt-2 text-xs">
              <span className="bg-[#111] px-2 py-1 rounded">jazzcash</span>
              <span className="bg-[#111] px-2 py-1 rounded">easypaisa</span>
              <span className="bg-[#111] px-2 py-1 rounded">bank transfer</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#222] text-center text-xs text-[#555] py-4">
        &copy; {new Date().getFullYear()} Hidden Picks. All rights reserved.
      </div>
    </footer>
  )
}
