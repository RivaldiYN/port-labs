import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-12 border-t border-[#e5e2e1]/10 bg-[#131313]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
        <div>
          <Link to="/" className="text-lg font-bold font-headline tracking-tighter text-[#e5e2e1]">
            Rivaldi<span className="text-[#1DB954]">.</span>
          </Link>
          <p className="font-label text-xs text-[#e5e2e1]/40 mt-1 tracking-widest">
            © {new Date().getFullYear()} Rivaldi Yonathan Nainggolan. Built for the orbit.
          </p>
        </div>
        <div className="flex gap-8">
          {[
            { label: 'LinkedIn', href: 'https://linkedin.com/in/rivaldiyn' },
            { label: 'GitHub', href: 'https://github.com/RivaldiYN' },
            { label: 'Email', href: 'mailto:aldinggln9@gmail.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e5e2e1]/40 hover:text-[#1DB954] transition-colors font-label text-sm"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
