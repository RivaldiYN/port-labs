import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/posts', label: 'Notes' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#131313]/80 shadow-2xl shadow-black/40' : 'bg-transparent'
        } backdrop-blur-xl h-20 flex items-center justify-between px-6 md:px-8`}
    >
      {/* Logo */}
      <Link
        to="/"
        className="text-lg md:text-xl font-bold text-[#e5e2e1] font-headline tracking-tighter shrink-0"
      >
        Rivaldi<span className="text-[#1DB954]">.</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-8 items-center">
        {NAV_LINKS.map(({ to, label }) => {
          const active = pathname === to || (label === 'Notes' && pathname.startsWith('/news'))
          return (
            <Link
              key={to}
              to={to}
              className={`font-headline tracking-tighter text-sm transition-all duration-300 px-2 py-1 rounded ${active
                ? 'text-[#1DB954] font-bold border-b-2 border-[#1DB954] pb-0'
                : 'text-[#e5e2e1]/70 hover:text-[#e5e2e1] hover:bg-[#1DB954]/10'
                }`}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* CTA + Hamburger */}
      <div className="flex items-center gap-4">
        <a
          href="mailto:aldinggln9@gmail.com"
          className="primary-gradient-btn text-[#002108] px-5 py-2 rounded-full font-label font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(83,224,118,0.4)] transition-all active:scale-95 hidden sm:block"
        >
          Hire Me
        </a>
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-[#e5e2e1] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-6 bg-[#e5e2e1] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-[#e5e2e1] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-20 left-0 right-0 bg-[#1c1b1b]/95 backdrop-blur-xl border-b border-[#3d4a3d]/30 flex flex-col py-6 px-8 gap-4 transition-all duration-300 md:hidden ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        {NAV_LINKS.map(({ to, label }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`font-headline tracking-tighter text-xl py-2 transition-colors ${active ? 'text-[#1DB954]' : 'text-[#e5e2e1]/70'}`}
            >
              {label}
            </Link>
          )
        })}
        <a href="mailto:aldinggln9@gmail.com" className="primary-gradient-btn text-[#002108] px-6 py-3 rounded-full font-label font-bold text-xs uppercase tracking-widest text-center mt-2">
          Hire Me
        </a>
      </div>
    </nav>
  )
}
