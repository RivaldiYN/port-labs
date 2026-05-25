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
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 shadow-md border-b border-[#E5E7EB]'
          : 'bg-transparent'
      } backdrop-blur-md h-20 flex items-center justify-between px-4 sm:px-6 md:px-8`}
    >
      {/* Logo */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-headline font-bold text-[#1F2937] shrink-0 group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm font-bold group-hover:shadow-lg transition-shadow">
          RY
        </div>
        <span className="hidden sm:inline text-lg tracking-tight">Rivaldi</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-8 items-center">
        {NAV_LINKS.map(({ to, label }) => {
          const active = pathname === to || (label === 'Articles' && pathname.startsWith('/news'))
          return (
            <Link
              key={to}
              to={to}
              className={`font-body font-medium text-sm transition-all duration-200 ${
                active
                  ? 'text-[#5B7DDD] border-b-2 border-[#5B7DDD] pb-1'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* CTA + Hamburger */}
      <div className="flex items-center gap-3 md:gap-4">
        <a
          href="mailto:aldinggln9@gmail.com"
          className="btn-primary text-sm px-4 md:px-5 py-2 whitespace-nowrap"
        >
          Let's Connect
        </a>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`h-0.5 w-5 bg-[#1F2937] transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-[#1F2937] transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-[#1F2937] transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-20 left-0 right-0 bg-white border-b border-[#E5E7EB] flex flex-col py-6 px-4 gap-4 transition-all duration-300 md:hidden ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {NAV_LINKS.map(({ to, label }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`font-body font-medium text-base py-2 px-2 rounded-lg transition-colors ${
                active ? 'text-[#5B7DDD] bg-[#EEF2FF]' : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              {label}
            </Link>
          )
        })}
        <a href="mailto:aldinggln9@gmail.com" className="btn-primary w-full text-center mt-2">
          Let's Connect
        </a>
      </div>
    </nav>
  )
}
