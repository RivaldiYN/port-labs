import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'

const FILTER_TABS = ['All', 'ReactJS', 'Laravel', 'Next.js', 'Elysia.js', 'TypeScript']

const FALLBACK_ICONS: Record<string, string> = {
  ReactJS: 'monitor', Laravel: 'settings', 'Elysia.js': 'code',
  'Next.js': 'globe', PostgreSQL: 'database', Docker: 'dns',
}

function getIcon(techStack: string[] | null): string {
  if (!techStack) return 'code'
  for (const t of techStack) {
    if (FALLBACK_ICONS[t]) return FALLBACK_ICONS[t]
  }
  return 'code'
}

export default function ProjectsPage() {
  const [activeTech, setActiveTech] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)

  const { data: projects, meta, loading, error } = useProjects({
    page,
    limit: 9,
    tech: activeTech || undefined,
    search: search || undefined,
    sort: 'newest',
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleFilterTab = (tab: string) => {
    setActiveTech(tab === 'All' ? '' : tab)
    setPage(1)
  }

  // ── Theme State ──────────────────────────────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('rpg-theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    localStorage.setItem('rpg-theme', isDarkMode ? 'dark' : 'light')
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const theme = isDarkMode ? {
    mode: 'dark',
    outerBg: 'bg-[#0f1118]/85 grayscale-[20%] brightness-[45%]',
    mainBg: 'bg-[#121620]',
    borderColor: 'border-[#C89B3C]',
    textColor: 'text-[#F5F3EF]',
    textColorMuted: 'text-[#9FA3AF]',
    bannerClass: 'rpg-banner-red-dark',
    boxClass: 'rpg-box-dark',
    btnClass: 'rpg-btn-gold-dark',
    dividerClass: 'rpg-pixel-divider-dark',
    scrollbarClass: 'rpg-scrollbar',
  } : {
    mode: 'light',
    outerBg: 'bg-[#f0e6cf]/40 sepia-[15%] brightness-[92%]',
    mainBg: 'bg-[#FAF6EE]',
    borderColor: 'border-[#7D5832]',
    textColor: 'text-[#2E2218]',
    textColorMuted: 'text-[#685547]',
    bannerClass: 'rpg-banner-red-light',
    boxClass: 'rpg-box-light',
    btnClass: 'rpg-btn-gold-light',
    dividerClass: 'rpg-pixel-divider-light',
    scrollbarClass: 'rpg-scrollbar-light',
  }

  return (
    <div className={`relative min-h-screen font-body overflow-x-hidden ${theme.textColor} transition-colors duration-250`}>
      {/* Fixed Immersive RPG Map Background */}
      <div 
        className={`fixed inset-0 -z-50 bg-[url('/src/assets/fantasy_map_bg.png')] bg-cover bg-center bg-no-repeat transition-all duration-300 ${theme.outerBg}`} 
      />

      {/* Main Game Wiki Frame */}
      <div className={`w-full max-w-[1300px] mx-auto min-h-screen ${theme.mainBg} border-x-4 ${theme.borderColor} shadow-2xl flex flex-col relative z-10`}>
        
        {/* RPG Style Top Header */}
        <header className={`sticky top-0 z-50 border-b-4 ${theme.borderColor} ${theme.mainBg} h-20 flex justify-between items-center px-4 md:px-6`}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className={`w-9 h-9 border-2 ${theme.borderColor} bg-red-800 flex items-center justify-center text-white font-press-start text-xs shadow-[2px_2px_0px_#000]`}>
              RY
            </span>
            <div className="flex flex-col">
              <span className="font-silkscreen text-xs uppercase tracking-widest text-amber-500 font-bold group-hover:text-amber-400 transition-colors">
                RIVALDI
              </span>
              <span className="font-silkscreen text-[9px] uppercase tracking-wider opacity-60">
                v1.2.0-alpha
              </span>
            </div>
          </Link>

          {/* Navigation Links inside Retro Boxes */}
          <nav className="hidden md:flex gap-4">
            {[
              ["Home", "/", "🏡"], 
              ["Projects", "/projects", "⚔️"], 
              ["Articles", "/posts", "📜"]
            ].map(([label, to, icon]) => (
              <Link 
                key={to} 
                to={to} 
                className={`font-silkscreen text-xs px-3 py-1.5 border border-transparent hover:border-amber-600 hover:bg-amber-600/10 flex items-center gap-1.5 transition-all ${
                  to === '/projects' ? 'text-amber-500 font-bold' : ''
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Action Area (Theme Switch & Email Connect) */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`${theme.btnClass} py-2 px-3 flex items-center gap-2`}
              title="Toggle Theme Mode"
            >
              <span>{isDarkMode ? '🌙' : '☀️'}</span>
              <span className="hidden sm:inline font-silkscreen text-[10px]">
                {isDarkMode ? 'DARK' : 'LIGHT'}
              </span>
            </button>

            <a 
              href="mailto:aldinggln9@gmail.com" 
              className={`${theme.btnClass} py-2 px-4 font-silkscreen text-[10px] hidden sm:block`}
            >
              LET'S CONNECT
            </a>
          </div>
        </header>

        {/* Outer Split Pane Layout: Sidebar + Main Content */}
        <div className="flex-1 flex flex-col md:flex-row relative">
          
          {/* Left Navigation & Stats Sidebar */}
          <aside className={`hidden md:flex flex-col w-64 border-r-4 ${theme.borderColor} p-4 shrink-0 gap-6 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto ${theme.scrollbarClass} ${theme.mainBg}`}>
            
            {/* Section: Wiki Menu */}
            <div className="flex flex-col gap-2.5">
              <div className="text-[10px] font-silkscreen font-bold tracking-widest text-amber-500 mb-1">
                [ WIKI MENU ]
              </div>
              <Link to="/" className="p-2 font-silkscreen text-xs border border-transparent hover:border-amber-600/20 hover:bg-amber-600/5 flex items-center gap-2 transition-all">
                <span>🏡</span> Profile Home
              </Link>
              <Link to="/projects" className="p-2 font-silkscreen text-xs border border-amber-600/20 bg-amber-600/5 hover:bg-amber-600/10 flex items-center gap-2 transition-all">
                <span>⚔️</span> Projects Inventory
              </Link>
              <Link to="/posts" className="p-2 font-silkscreen text-xs border border-transparent hover:border-amber-600/20 hover:bg-amber-600/5 flex items-center gap-2 transition-all">
                <span>📜</span> Codex Chronicles
              </Link>
            </div>

            {/* Section: External Guild Links */}
            <div className="flex flex-col gap-2.5 mt-auto pt-4 border-t-2 border-dashed border-amber-600/20">
              <div className="text-[10px] font-silkscreen font-bold tracking-widest text-amber-500 mb-1">
                [ GUILD WEB ]
              </div>
              <a 
                href="https://github.com/RivaldiYN" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 font-silkscreen text-[11px] hover:text-amber-500 flex items-center gap-2"
              >
                <span>📦</span> GitHub
              </a>
              <a 
                href="https://linkedin.com/in/rivaldiyn" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 font-silkscreen text-[11px] hover:text-amber-500 flex items-center gap-2"
              >
                <span>💼</span> LinkedIn
              </a>
            </div>
          </aside>

          {/* Main Scrollable Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
            
            {/* Header Banner */}
            <div className={`${theme.bannerClass} py-3.5 px-4 flex justify-between items-center rounded-sm`}>
              <span className="font-silkscreen text-[10px] text-yellow-300 font-bold">SYSTEM: INDEX</span>
              <h1 className="font-silkscreen text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                PROJECTS INVENTORY
              </h1>
              {meta ? (
                <span className="font-silkscreen text-[10px] text-yellow-300 font-bold">
                  QTY: {meta.total} ITEMS
                </span>
              ) : (
                <span className="font-silkscreen text-[10px] text-yellow-300 font-bold">QTY: 0 ITEMS</span>
              )}
            </div>

            {/* Filter and Search Bar widget */}
            <div className={`${theme.boxClass} p-4 flex flex-col gap-4 rounded-sm`}>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                
                {/* Inventory Filter Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {FILTER_TABS.map(tab => {
                    const isActive = (tab === 'All' && !activeTech) || tab === activeTech
                    return (
                      <button
                        key={tab}
                        onClick={() => handleFilterTab(tab)}
                        className={`font-silkscreen text-[9px] py-1.5 px-3 border border-dashed transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-amber-600/20 text-amber-500 border-amber-500 font-bold'
                            : 'bg-black/5 dark:bg-black/20 text-inherit border-black/10 hover:border-amber-600/40 hover:text-amber-500'
                        }`}
                      >
                        {tab}
                      </button>
                    )
                  })}
                </div>

                {/* Search Item field */}
                <form onSubmit={handleSearch} className="relative w-full lg:w-72">
                  <input
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Filter by name..."
                    type="text"
                    className="w-full bg-black/10 border-2 border-black/20 focus:border-amber-600/40 py-2 pl-4 pr-10 font-silkscreen text-[10px] focus:outline-none focus:bg-black/20 transition-all rounded-xs"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400"
                    aria-label="Search"
                  >
                    <span className="material-symbols-outlined text-base">search</span>
                  </button>
                </form>

              </div>
            </div>

            {/* Content section */}
            <div className="relative z-10 flex-1">
              
              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  <p className="font-silkscreen text-[10px] text-amber-500 uppercase tracking-widest">LOADING ARTIFACTS...</p>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className={`${theme.boxClass} p-12 text-center flex flex-col items-center gap-3`}>
                  <span className="material-symbols-outlined text-5xl text-red-500/70">wifi_off</span>
                  <p className="text-red-500 font-silkscreen text-xs">{error}</p>
                  <p className="text-[10px] opacity-75">Please verify the database connection.</p>
                </div>
              )}

              {/* Projects Grid */}
              {!loading && !error && projects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.slug}`}
                      className={`group ${theme.boxClass} p-4 flex flex-col gap-3 rounded-sm hover:-translate-y-1 hover:border-amber-500 transition-all`}
                    >
                      {/* Image/Icon */}
                      <div className="h-44 relative bg-black/10 border-2 border-black/40 rounded-xs overflow-hidden shrink-0">
                        {project.thumbnailUrl ? (
                          <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pixelated"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-amber-500/20 group-hover:text-amber-500/40 transition-colors" style={{ fontSize: '64px' }}>
                              {getIcon(project.techStack)}
                            </span>
                          </div>
                        )}
                        {project.isFeatured && (
                          <span className="absolute top-2 right-2 bg-red-800 border border-amber-500 text-white font-silkscreen text-[8px] px-2 py-0.5 shadow-md uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-2.5 flex-1">
                        <div className="flex flex-wrap gap-1">
                          {(project.techStack ?? []).slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-black/20 text-amber-500 font-silkscreen text-[8px] uppercase border border-black/10">
                              {tag}
                            </span>
                          ))}
                          {(project.techStack?.length ?? 0) > 3 && (
                            <span className="px-1.5 py-0.5 bg-black/15 text-[8px] font-silkscreen opacity-60">
                              +{(project.techStack?.length ?? 0) - 3}
                            </span>
                          )}
                        </div>

                        <h3 className="font-silkscreen text-[11px] font-bold text-amber-500 group-hover:text-amber-400 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs opacity-80 line-clamp-2 leading-relaxed h-8">
                          {project.description ?? '—'}
                        </p>

                        <div className="flex items-center justify-between pt-2.5 border-t border-dashed border-amber-600/25 mt-auto">
                          <span className="opacity-60 font-silkscreen text-[9px]">
                            YR: {project.publishedAt ? new Date(project.publishedAt).getFullYear() : '—'}
                          </span>
                          <span className="text-amber-500 font-silkscreen text-[9px] group-hover:translate-x-0.5 transition-transform">
                            INSPECT [⚔️]
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && projects.length === 0 && (
                <div className={`${theme.boxClass} text-center py-20 rounded-sm`}>
                  <span className="material-symbols-outlined text-5xl text-amber-600/40 mb-3 block">search_off</span>
                  <h4 className="font-silkscreen text-xs font-bold text-amber-500 mb-1">No Projects Found</h4>
                  <p className="text-xs opacity-75 mb-4">No matching artifacts exist in current slot filters.</p>
                  <button
                    onClick={() => {
                      setActiveTech('')
                      setSearch('')
                      setSearchInput('')
                      setPage(1)
                    }}
                    className="font-silkscreen text-[10px] text-amber-500 hover:text-amber-400 border-b border-dashed border-amber-500 pb-0.5 cursor-pointer"
                  >
                    RESET FILTER SLOTS
                  </button>
                </div>
              )}

              {/* Pagination */}
              {!loading && meta && meta.totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2 mt-8 mb-4" aria-label="Pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className={`${theme.btnClass} w-8 h-8 flex items-center justify-center disabled:opacity-30`}
                    aria-label="Previous page"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>

                  {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                    const p = page > 3 ? page - 2 + i : i + 1
                    return p <= meta.totalPages ? (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 font-silkscreen text-[10px] transition-all cursor-pointer flex items-center justify-center ${
                          p === page
                            ? 'bg-amber-600/20 text-amber-500 border border-amber-500 font-bold'
                            : 'border border-amber-600/30 hover:border-amber-500'
                        }`}
                        aria-label={`Go to page ${p}`}
                      >
                        {p}
                      </button>
                    ) : null
                  })}

                  <button
                    disabled={page === meta.totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className={`${theme.btnClass} w-8 h-8 flex items-center justify-center disabled:opacity-30`}
                    aria-label="Next page"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </nav>
              )}

            </div>
          </main>

        </div>

        {/* Footer info bar */}
        <footer className={`border-t-4 ${theme.borderColor} py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-3 ${theme.mainBg}`}>
          <span className="font-silkscreen text-[9px] opacity-60">
            © {new Date().getFullYear()} Rivaldi Yonathan Nainggolan. All Rights Reserved.
          </span>
          <span className="font-silkscreen text-[9px] text-amber-500 font-semibold">
            DESIGNED BY RIVALDI
          </span>
        </footer>

      </div>
    </div>
  )
}
