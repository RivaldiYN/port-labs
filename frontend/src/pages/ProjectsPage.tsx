import { useState } from 'react'
import { Link } from 'react-router-dom'

const FILTER_TABS = ['All', 'Frontend', 'Backend', 'Full Stack']

const PROJECTS = [
  {
    id: 1,
    title: 'Dashboard ML Monitoring',
    desc: 'Real-time monitoring dashboard with Machine Learning integration and OpenStreetMap heatmap deployed for PT Technova Solusi Integrasi.',
    tags: ['ReactJS', 'TypeScript', 'OpenStreetMap'],
    category: 'Frontend',
    year: '2025',
    icon: 'monitoring',
  },
  {
    id: 2,
    title: 'HRIS — PT Kimia Farma',
    desc: 'Internal Human Resource Information System with payroll automation, QR attendance, and Redis-cached reporting for faster data retrieval.',
    tags: ['Laravel', 'PostgreSQL', 'Redis'],
    category: 'Full Stack',
    year: '2025',
    icon: 'groups',
  },
  {
    id: 3,
    title: 'Antigravity Portfolio',
    desc: 'This portfolio website with CMS — Elysia.js API + React frontend + Drizzle ORM. WCAG 2.1 AA compliant with glassmorphism design.',
    tags: ['Elysia.js', 'React', 'Drizzle ORM'],
    category: 'Full Stack',
    year: '2026',
    icon: 'rocket_launch',
  },
  {
    id: 4,
    title: 'Neural Nexus Dashboard',
    desc: 'High-performance data visualization interface simulating synaptic firing patterns in real-time using Three.js and WebGL.',
    tags: ['React', 'Three.js', 'WebGL'],
    category: 'Frontend',
    year: '2024',
    icon: 'hub',
  },
  {
    id: 5,
    title: 'Pulse API Gateway',
    desc: 'Low-latency global distribution layer designed for sub-millisecond edge synchronization using Redis pub/sub architecture.',
    tags: ['Node.js', 'Redis', 'Docker'],
    category: 'Backend',
    year: '2023',
    icon: 'api',
  },
  {
    id: 6,
    title: 'Void Commerce',
    desc: 'Headless shopping experience built with a focus on buttery-smooth kinetic interactions and optimized Core Web Vitals.',
    tags: ['Next.js', 'Tailwind', 'Stripe'],
    category: 'Full Stack',
    year: '2024',
    icon: 'shopping_bag',
  },
]

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = PROJECTS.filter(p => {
    const matchCat = activeFilter === 'All' || p.category === activeFilter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl shadow-2xl shadow-black/40 h-20 flex justify-between items-center px-6 md:px-8">
        <Link to="/" className="text-xl font-bold text-[#e5e2e1] font-headline tracking-tighter">
          Rivaldi<span className="text-[#1DB954]">.</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {[
            { to: '/', label: 'Home', active: false },
            { to: '/projects', label: 'Projects', active: true },
            { to: '/news/architecting-the-antigravity-interface', label: 'News', active: false },
          ].map(({ to, label, active }) => (
            <Link key={to} to={to}
              className={`font-headline tracking-tighter text-sm px-2 py-1 rounded transition-all duration-300 ${active ? 'text-[#1DB954] font-bold border-b-2 border-[#1DB954]' : 'text-[#e5e2e1]/70 hover:text-[#e5e2e1] hover:bg-[#1DB954]/10'}`}>
              {label}
            </Link>
          ))}
        </div>
        <a href="mailto:aldinggln9@gmail.com" className="bg-[#1db954] text-[#002108] px-5 py-2 rounded-full font-label font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">
          Hire Me
        </a>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Ambient glows */}
        <div className="kinetic-blur w-96 h-96 -top-40 -right-40 pointer-events-none" />
        <div className="kinetic-blur w-96 h-96 top-1/2 -left-40 opacity-50 pointer-events-none" />

        {/* Header */}
        <header className="mb-16 relative z-10">
          <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter mb-8 text-[#e5e2e1]">
            Digital <span className="text-[#53e076]">Artifacts</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-[#1c1b1b] rounded-full w-fit">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-5 py-2 rounded-full font-label text-xs font-bold tracking-widest uppercase transition-all ${
                    activeFilter === tab
                      ? 'bg-[#1db954] text-[#002108]'
                      : 'text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-[#2a2a2a]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative group w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e5e2e1]/40 group-focus-within:text-[#53e076] transition-colors text-xl">search</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                type="text"
                className="w-full bg-[#1c1b1b] border-b-2 border-[#3d4a3d] focus:border-[#1db954] focus:outline-none py-3 pl-12 pr-4 font-label text-sm placeholder:text-[#e5e2e1]/30 transition-all rounded-t-lg text-[#e5e2e1]"
              />
            </div>
          </div>
        </header>

        {/* Projects Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
            {filtered.map(project => (
              <div
                key={project.id}
                className="glass-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col border border-[#3d4a3d]/10"
              >
                {/* Image / Icon area */}
                <div className="h-56 overflow-hidden relative bg-[#1c1b1b]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1db954]/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#1db954]/20 group-hover:text-[#1db954]/30 transition-colors" style={{ fontSize: '160px' }}>
                      {project.icon}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-md bg-[#353534] text-[#72fe8f] font-label text-[10px] font-bold uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-headline text-xl md:text-2xl font-bold mb-2 text-[#e5e2e1]">{project.title}</h3>
                  <p className="text-[#e5e2e1]/60 text-sm mb-6 line-clamp-2 font-body leading-relaxed">{project.desc}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[#e5e2e1]/40 font-label text-xs">{project.year}</span>
                    <button className="flex items-center gap-2 text-[#53e076] font-label text-xs font-bold uppercase tracking-widest group/btn hover:gap-3 transition-all">
                      Explore
                      <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-24 text-center py-24 border border-dashed border-[#3d4a3d]/30 rounded-3xl">
            <span className="material-symbols-outlined text-6xl text-[#e5e2e1]/20 mb-4 block">search_off</span>
            <h4 className="font-headline text-2xl font-bold mb-2 text-[#e5e2e1]">The Void is Empty</h4>
            <p className="text-[#e5e2e1]/50 font-body">No projects match your current filters. Try exploring other dimensions.</p>
            <button onClick={() => { setActiveFilter('All'); setSearch('') }}
              className="mt-8 text-[#53e076] font-label text-xs font-bold uppercase tracking-widest border-b border-[#53e076] pb-1 hover:text-[#72fe8f] transition-colors">
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-[#e5e2e1]/10 bg-[#131313]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <p className="font-label text-sm text-[#e5e2e1]/40">© {new Date().getFullYear()} Rivaldi Yonathan Nainggolan.</p>
          <div className="flex gap-8">
            {[['LinkedIn', 'https://linkedin.com/in/rivaldiyn'], ['GitHub', 'https://github.com/RivaldiYN']].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                className="text-[#e5e2e1]/40 hover:text-[#1DB954] transition-colors font-label text-sm">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
