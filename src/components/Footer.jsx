const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-heading text-xl font-bold mb-4">HIDDEN PICKS</h4>
          <p className="text-sm opacity-80 leading-relaxed">
            Curated Y2K & CCD digicams from the heart of Lahore.
            Every camera is tested, verified, and ready to shoot.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="/shop" className="hover:text-accent transition">Shop All</a></li>
            <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">WhatsApp</a></li>
            <li><a href="https://instagram.com/hiddenpicks.co_" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-lg font-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Lahore, Pakistan</li>
            <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">+92{WHATSAPP?.slice(2)}</a></li>
            <li className="flex gap-3 mt-2">
              <span>JazzCash</span>
              <span>EasyPaisa</span>
              <span>Bank Transfer</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs opacity-60 py-4">
        &copy; {new Date().getFullYear()} Hidden Picks. All rights reserved.
      </div>
    </footer>
  )
}
