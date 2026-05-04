import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'

const FILTER_TABS = ['All', 'ReactJS', 'Laravel', 'Next.js', 'Elysia.js', 'TypeScript']

const FALLBACK_ICONS: Record<string, string> = {
  ReactJS: 'monitoring', Laravel: 'groups', 'Elysia.js': 'rocket_launch',
  'Next.js': 'hub', PostgreSQL: 'storage', Docker: 'cloud',
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

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl shadow-2xl shadow-black/40 h-20 flex justify-between items-center px-6 md:px-8">
        <Link to="/" className="text-xl font-bold text-[#e5e2e1] font-headline tracking-tighter">
          Rivaldi<span className="text-[#1DB954]">.</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {[['/', 'Home'], ['/projects', 'Projects'], ['/posts', 'Notes']].map(([to, label]) => (
            <Link key={to} to={to}
              className={`font-headline tracking-tighter text-sm px-2 py-1 rounded transition-all duration-300 ${to === '/projects' ? 'text-[#1DB954] font-bold border-b-2 border-[#1DB954]' : 'text-[#e5e2e1]/70 hover:text-[#e5e2e1] hover:bg-[#1DB954]/10'}`}>
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
        <div className="absolute w-96 h-96 rounded-full bg-[#1db954]/8 blur-[120px] -top-40 -right-40 pointer-events-none" />
        <div className="absolute w-96 h-96 rounded-full bg-[#1c5329]/6 blur-[120px] top-1/2 -left-40 pointer-events-none" />

        {/* Header */}
        <header className="mb-16 relative z-10">
          <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter mb-8 text-[#e5e2e1]">
            Digital <span className="text-[#53e076]">Artifacts</span>
          </h1>

          {meta && (
            <p className="text-[#e5e2e1]/40 font-label text-xs uppercase tracking-widest mb-8">
              {meta.total} project{meta.total !== 1 ? 's' : ''} tersedia
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-[#1c1b1b] rounded-full w-fit">
              {FILTER_TABS.map(tab => (
                <button key={tab} onClick={() => handleFilterTab(tab)}
                  className={`px-4 py-2 rounded-full font-label text-xs font-bold tracking-widest uppercase transition-all ${(tab === 'All' && !activeTech) || tab === activeTech
                    ? 'bg-[#1db954] text-[#002108]'
                    : 'text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-[#2a2a2a]'
                    }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative group w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e5e2e1]/40 group-focus-within:text-[#53e076] transition-colors text-xl">search</span>
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Cari project..."
                type="text"
                className="w-full bg-[#1c1b1b] border-b-2 border-[#3d4a3d] focus:border-[#1db954] focus:outline-none py-3 pl-12 pr-4 font-label text-sm placeholder:text-[#e5e2e1]/30 transition-all rounded-t-lg text-[#e5e2e1]"
              />
            </form>
          </div>
        </header>

        {/* Content */}
        <div className="relative z-10">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#53e076] border-t-transparent animate-spin" />
              <p className="font-label text-xs uppercase tracking-widest text-[#e5e2e1]/40">Memuat project...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center py-24 gap-4 text-center">
              <span className="material-symbols-outlined text-5xl text-[#ffb4ab]/60">wifi_off</span>
              <p className="text-[#ffb4ab] font-label text-sm">{error}</p>
              <p className="text-[#e5e2e1]/40 font-body text-xs">Pastikan backend berjalan di http://localhost:3000</p>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map(project => (
                <div key={project.id}
                  className="bg-[#1c1b1b] rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col border border-[#3d4a3d]/10 hover:border-[#53e076]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                  {/* Image/Icon */}
                  <div className="h-48 relative bg-[#131313] overflow-hidden">
                    {project.thumbnailUrl ? (
                      <img src={project.thumbnailUrl} alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1db954]/10 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#1db954]/20 group-hover:text-[#1db954]/30 transition-colors" style={{ fontSize: '140px' }}>
                            {getIcon(project.techStack)}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/80 via-transparent to-transparent" />
                    {project.isFeatured && (
                      <span className="absolute top-4 right-4 bg-[#1db954] text-[#002108] font-label text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(project.techStack ?? []).slice(0, 3).map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-md bg-[#353534] text-[#72fe8f] font-label text-[9px] font-bold uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                      {(project.techStack?.length ?? 0) > 3 && (
                        <span className="px-2.5 py-1 rounded-md bg-[#353534] text-[#e5e2e1]/40 font-label text-[9px]">
                          +{(project.techStack?.length ?? 0) - 3}
                        </span>
                      )}
                    </div>

                    <h3 className="font-headline text-xl font-bold mb-2 text-[#e5e2e1] group-hover:text-[#53e076] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[#e5e2e1]/50 text-sm mb-4 line-clamp-2 font-body leading-relaxed flex-grow">
                      {project.description ?? '—'}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#3d4a3d]/10">
                      <span className="text-[#e5e2e1]/30 font-label text-xs">
                        {project.publishedAt ? new Date(project.publishedAt).getFullYear() : '—'}
                      </span>
                      <div className="flex gap-2">
                        {project.repoUrl && (
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#53e076] hover:text-[#002108] transition-all">
                            <span className="material-symbols-outlined text-sm">code</span>
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#53e076] hover:text-[#002108] transition-all">
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </a>
                        )}
                        <button className="flex items-center gap-1.5 text-[#53e076] font-label text-xs font-bold uppercase tracking-widest hover:gap-2.5 transition-all">
                          Detail
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-32 border border-dashed border-[#3d4a3d]/30 rounded-3xl">
              <span className="material-symbols-outlined text-6xl text-[#e5e2e1]/20 mb-4 block">search_off</span>
              <h4 className="font-headline text-2xl font-bold mb-2 text-[#e5e2e1]">The Void is Empty</h4>
              <p className="text-[#e5e2e1]/50 font-body text-sm mb-6">Tidak ada project yang cocok dengan filter ini.</p>
              <button onClick={() => { setActiveTech(''); setSearch(''); setSearchInput(''); setPage(1) }}
                className="text-[#53e076] font-label text-xs font-bold uppercase tracking-widest border-b border-[#53e076] pb-1 hover:text-[#72fe8f] transition-colors">
                Reset Filter
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="w-10 h-10 rounded-xl bg-[#1c1b1b] flex items-center justify-center disabled:opacity-30 hover:bg-[#2a2a2a] transition-all">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>

              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl font-label text-xs font-bold transition-all ${p === page ? 'bg-[#1db954] text-[#002108]' : 'bg-[#1c1b1b] text-[#e5e2e1]/60 hover:bg-[#2a2a2a]'
                    }`}>
                  {p}
                </button>
              ))}

              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="w-10 h-10 rounded-xl bg-[#1c1b1b] flex items-center justify-center disabled:opacity-30 hover:bg-[#2a2a2a] transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </div>
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
