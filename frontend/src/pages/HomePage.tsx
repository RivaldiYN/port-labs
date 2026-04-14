import { Link } from 'react-router-dom'

const STATS = [
  { value: '4+', label: 'Years Experience' },
  { value: '8+', label: 'High-End Projects' },
  { value: '3.45', label: 'GPA Excellence' },
]

export default function HomePage() {
  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl shadow-2xl shadow-black/40 h-20 flex justify-between items-center px-6 md:px-8">
        <div className="text-xl font-bold text-[#e5e2e1] font-headline tracking-tighter">
          Rivaldi<span className="text-[#1DB954]">.</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          {[
            { to: '/', label: 'Home', active: true },
            { to: '/projects', label: 'Projects', active: false },
            { to: '/news/architecting-the-antigravity-interface', label: 'News', active: false },
          ].map(({ to, label, active }) => (
            <Link
              key={to}
              to={to}
              className={`font-headline tracking-tighter text-sm transition-all duration-300 px-2 py-1 rounded ${
                active
                  ? 'text-[#1DB954] font-bold border-b-2 border-[#1DB954]'
                  : 'text-[#e5e2e1]/70 hover:text-[#e5e2e1] hover:bg-[#1DB954]/10'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <a
          href="mailto:aldinggln9@gmail.com"
          className="primary-gradient-btn text-[#002108] px-5 py-2 rounded-full font-label font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(83,224,118,0.4)] transition-all active:scale-95"
        >
          Hire Me
        </a>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 md:px-8 overflow-hidden noise-bg">
        {/* Orbs */}
        <div className="orb w-72 h-72 md:w-96 md:h-96 bg-[#53e076]/10 -top-20 -left-20" />
        <div className="orb w-[400px] h-[400px] bg-[#1c5329]/10 bottom-0 -right-40" />

        <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#1db954]/10 border border-[#1db954]/20">
              <span className="w-2 h-2 rounded-full bg-[#1db954] animate-pulse" />
              <span className="font-label text-xs tracking-widest text-[#1db954] uppercase">Available for work</span>
            </div>
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[#e5e2e1] mb-6 leading-none">
              Building the{' '}
              <span className="text-[#53e076] italic">Impossible</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <div className="h-[2px] w-10 bg-[#1db954]" />
              <p className="font-label text-lg text-[#1db954] font-medium tracking-tight">Full Stack Developer</p>
            </div>
            <p className="text-[#bccbb9] text-base md:text-lg max-w-xl mb-8 leading-relaxed font-body mx-auto md:mx-0">
              Passionate developer from ITERA (GPA 3.45) crafting digital experiences where logic meets artistry. Navigating the kinetic void of modern web architecture with precision and purpose.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/projects"
                className="primary-gradient-btn text-[#002108] px-7 py-4 rounded-full font-label font-bold tracking-widest uppercase text-sm hover:shadow-[0_0_20px_rgba(83,224,118,0.4)] transition-all active:scale-95"
              >
                Explore My Work
              </Link>
              <a
                href="mailto:aldinggln9@gmail.com"
                className="bg-[#2a2a2a]/40 border border-[#3d4a3d]/30 backdrop-blur-md text-[#e5e2e1] px-7 py-4 rounded-full font-label font-bold tracking-widest uppercase text-sm hover:bg-[#2a2a2a] transition-all"
              >
                Get In Touch
              </a>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex-1 relative flex justify-center">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full bg-[#53e076]/20 animate-pulse blur-2xl" />
              <div className="absolute -inset-4 rounded-full border border-[#53e076]/20 animate-spin-slow" />
              {/* Avatar placeholder - gradient */}
              <div className="relative z-10 w-full h-full rounded-full shadow-2xl shadow-black/60 border-4 border-[#2a2a2a] bg-gradient-to-br from-[#1db954]/30 via-[#1c1b1b] to-[#131313] flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="text-5xl md:text-7xl font-headline font-black text-[#53e076] tracking-tighter leading-none">RYN</div>
                  <div className="text-xs font-label text-[#bccbb9]/60 tracking-widest mt-2">ITERA · 3.45</div>
                </div>
              </div>
              {/* Floating nodes */}
              <div className="absolute top-0 -right-4 bg-[#2a2a2a] p-3 rounded-xl shadow-xl glass-card animate-float">
                <span className="material-symbols-outlined text-[#53e076] text-2xl">terminal</span>
              </div>
              <div className="absolute bottom-8 -left-8 bg-[#2a2a2a] p-3 rounded-xl shadow-xl glass-card animate-float" style={{ animationDelay: '1.5s' }}>
                <span className="material-symbols-outlined text-[#53e076] text-2xl">deployed_code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-label text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#e5e2e1] to-transparent" />
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-8 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="bg-[#1c1b1b] p-10 md:p-12 rounded-3xl flex flex-col items-center text-center shadow-2xl transition-transform hover:-translate-y-2 group"
            >
              <span className="font-headline text-4xl md:text-5xl font-extrabold text-[#53e076] mb-2 group-hover:scale-110 transition-transform">
                {value}
              </span>
              <span className="font-label text-[10px] uppercase tracking-widest text-[#bccbb9]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Projects (Bento Grid) ─────────────────────── */}
      <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-3 text-[#e5e2e1]">
              Curated <span className="text-[#1db954]">Orbits</span>
            </h2>
            <p className="text-[#bccbb9] font-body text-base max-w-md">A selection of technical explorations and architectural achievements.</p>
          </div>
          <Link
            to="/projects"
            className="font-label text-[#53e076] hover:text-[#72fe8f] transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold"
          >
            View All Lab Work <span className="material-symbols-outlined text-base">arrow_outward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Project 1 — Large */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-[2rem] bg-[#1c1b1b] aspect-video md:aspect-auto md:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1db954]/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="material-symbols-outlined text-[#53e076]" style={{ fontSize: '200px' }}>monitoring</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 md:p-10 z-20 w-full">
              <div className="flex gap-2 mb-3">
                {['ReactJS', 'TypeScript', 'OpenStreetMap'].map(t => (
                  <span key={t} className="bg-[#353534]/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-label uppercase tracking-widest text-[#72fe8f]">{t}</span>
                ))}
              </div>
              <h3 className="font-headline text-2xl md:text-3xl font-bold mb-2 text-[#e5e2e1]">Dashboard ML Monitoring</h3>
              <p className="text-[#bccbb9] font-body text-sm max-w-md mb-4">Real-time monitoring dashboard with Machine Learning integration and OpenStreetMap heatmap for PT Technova.</p>
              <button className="w-10 h-10 rounded-full border border-[#3d4a3d]/30 flex items-center justify-center group-hover:bg-[#53e076] group-hover:text-[#002108] transition-all duration-300">
                <span className="material-symbols-outlined text-lg">east</span>
              </button>
            </div>
          </div>

          {/* Project 2 — Vertical */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-[2rem] bg-[#1c1b1b] min-h-[280px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c5329]/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="material-symbols-outlined text-[#53e076]" style={{ fontSize: '180px' }}>groups</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <div className="flex gap-2 mb-3">
                <span className="bg-[#353534]/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-label uppercase tracking-widest text-[#72fe8f]">Laravel</span>
              </div>
              <h3 className="font-headline text-xl md:text-2xl font-bold mb-2 text-[#e5e2e1]">HRIS — Kimia Farma</h3>
              <p className="text-[#bccbb9] font-body text-sm">Intern HR system with payroll, attendance & Redis caching.</p>
            </div>
          </div>

          {/* Project 3 — Wide */}
          <div className="md:col-span-12 group relative overflow-hidden rounded-[2rem] bg-[#1c1b1b] h-64 md:h-72">
            <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/40 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#1db954]/5 to-transparent" />
            <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-10">
              <span className="material-symbols-outlined text-[#53e076]" style={{ fontSize: '300px' }}>cloud</span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 z-20">
              <div className="flex gap-2 mb-3">
                <span className="bg-[#353534]/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-label uppercase tracking-widest text-[#72fe8f]">Elysia.js</span>
                <span className="bg-[#353534]/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-label uppercase tracking-widest text-[#72fe8f]">React</span>
              </div>
              <h3 className="font-headline text-2xl md:text-3xl font-bold mb-2 text-[#e5e2e1]">Antigravity Portfolio</h3>
              <p className="text-[#bccbb9] font-body text-sm max-w-lg">This portfolio — Elysia.js backend + React frontend + Drizzle ORM. WCAG 2.1 AA compliant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ────────────────────────────────────────────── */}
      <section className="py-28 px-6 md:px-8 overflow-hidden bg-[#0e0e0e] relative">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="font-label text-xs uppercase tracking-[0.4em] text-[#53e076] mb-4">Technological Core</h2>
          <h3 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-[#e5e2e1]">The Arsenal</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {[
            { icon: 'javascript', label: 'JavaScript' },
            { icon: 'data_object', label: 'TypeScript' },
            { icon: 'token', label: 'React / Next.js' },
            { icon: 'storage', label: 'PostgreSQL' },
            { icon: 'cloud', label: 'Docker / DevOps' },
            { icon: 'palette', label: 'Tailwind CSS' },
            { icon: 'animation', label: 'Framer Motion' },
            { icon: 'api', label: 'Elysia.js' },
            { icon: 'code', label: 'Laravel / PHP' },
            { icon: 'database', label: 'Drizzle ORM' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-[#2a2a2a]/40 border border-[#3d4a3d]/10 px-5 py-3 rounded-full glass-card hover:border-[#53e076]/50 hover:shadow-[0_0_20px_rgba(83,224,118,0.1)] transition-all cursor-default group"
            >
              <span className="material-symbols-outlined text-[#53e076] text-xl group-hover:scale-110 transition-transform">{icon}</span>
              <span className="font-label font-bold text-xs tracking-widest uppercase text-[#e5e2e1]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Experience Timeline ────────────────────────────────── */}
      <section className="py-28 px-6 md:px-8 max-w-4xl mx-auto">
        <div className="mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-3 text-[#e5e2e1]">Journey</h2>
          <div className="h-1 w-16 bg-[#53e076] rounded-full" />
        </div>
        <div className="space-y-12 md:space-y-16 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#3d4a3d]/40">
          {[
            {
              period: '2025 — 2026',
              role: 'Frontend Developer',
              company: 'PT Technova Solusi Integrasi',
              desc: 'Developing ReactJS monitoring dashboard with OpenStreetMap & ML integration. Led UI/UX for field management system used by hundreds of users.',
              active: true,
            },
            {
              period: '2025 — 2026',
              role: 'Full Stack Developer Intern',
              company: 'PT Kimia Farma Tbk',
              desc: 'Built internal HRIS (payroll, attendance, reports) using Laravel + PostgreSQL + Redis caching for optimized performance.',
              active: false,
            },
            {
              period: '2021 — Present',
              role: 'Bachelor of Informatics',
              company: 'ITERA — Institut Teknologi Sumatera',
              desc: 'GPA 3.45. Specialized in distributed systems and human-computer interaction.',
              active: false,
              icon: 'school',
            },
          ].map(({ period, role, company, desc, active, icon }) => (
            <div key={role} className="relative pl-14">
              <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center z-10 ${active ? 'bg-[#2a2a2a] border-2 border-[#53e076]' : 'bg-[#2a2a2a] border-2 border-[#3d4a3d]'}`}>
                <span className={`material-symbols-outlined text-xl ${active ? 'text-[#53e076]' : 'text-[#bccbb9]'}`}>
                  {icon || 'work'}
                </span>
              </div>
              <span className={`font-label text-xs font-bold tracking-widest uppercase mb-1 block ${active ? 'text-[#53e076]' : 'text-[#bccbb9]'}`}>{period}</span>
              <h3 className="font-headline text-xl md:text-2xl font-bold mb-1 text-[#e5e2e1]">{role}</h3>
              <p className="text-[#bccbb9] font-label text-xs uppercase tracking-wider mb-3">{company}</p>
              <p className="text-[#bccbb9] font-body leading-relaxed text-sm max-w-2xl">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="w-full py-12 border-t border-[#e5e2e1]/10 bg-[#131313]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <p className="font-label text-sm text-[#e5e2e1]/40">
            © {new Date().getFullYear()} Rivaldi Yonathan Nainggolan. Built for the orbit.
          </p>
          <div className="flex gap-8">
            {[
              { label: 'LinkedIn', href: 'https://linkedin.com/in/rivaldiyn' },
              { label: 'GitHub', href: 'https://github.com/RivaldiYN' },
              { label: 'Email', href: 'mailto:aldinggln9@gmail.com' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="text-[#e5e2e1]/40 hover:text-[#1DB954] transition-colors font-label text-sm">
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
