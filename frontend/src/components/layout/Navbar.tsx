import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/posts', label: 'Articles' },
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
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 h-20 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 ${
          scrolled
            ? 'bg-white/95 shadow-sm border-b border-[#E5E7EB]'
            : 'bg-gradient-to-b from-white/80 to-transparent'
        } backdrop-blur-xl`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 font-headline font-bold text-[#1F2937] shrink-0 group hover:opacity-80 transition-opacity"
          aria-label="Rivaldi Yonathan - Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A373] to-[#0891B2] flex items-center justify-center text-white text-xs font-bold group-hover:shadow-md transition-shadow">
            RY
          </div>
          <span className="hidden sm:inline text-lg tracking-tight">Rivaldi</span>
        </Link>

        {/* Desktop Nav - Centered */}
        <div className="hidden md:flex gap-10 items-center absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname === to || (label === 'Articles' && pathname.startsWith('/posts'))
            return (
              <Link
                key={to}
                to={to}
                className={`font-body text-sm font-medium transition-all duration-200 relative group ${
                  active ? 'text-[#D4A373]' : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#D4A373] to-[#0891B2] rounded-full" />
                )}
              </Link>
            )
          })}
        </div>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="mailto:aldinggln9@gmail.com"
            className="hidden sm:inline-block bg-gradient-to-r from-[#D4A373] to-[#E6B849] hover:shadow-lg text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all active:scale-95 font-body uppercase tracking-wider"
            aria-label="Send email to connect"
          >
            Let's Connect
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-white border-b border-[#E5E7EB] shadow-md md:hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col divide-y divide-[#E5E7EB]">
            {NAV_LINKS.map(({ to, label }) => {
              const active = pathname === to || (label === 'Articles' && pathname.startsWith('/posts'))
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-4 font-body text-sm font-medium ${
                    active
                      ? 'text-[#D4A373] bg-[#FFF8F0]'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </Link>
              )
            })}
            <a
              href="mailto:aldinggln9@gmail.com"
              className="px-4 py-4 bg-gradient-to-r from-[#D4A373] to-[#E6B849] text-white font-bold text-sm text-center uppercase tracking-wider"
            >
              Let's Connect
            </a>
          </div>
        </div>
      )}
    </>
  )
}
