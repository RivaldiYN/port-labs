import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'

const FILTER_TABS = ['All', 'ReactJS', 'Laravel', 'Next.js', 'Elysia.js', 'TypeScript']

const FALLBACK_ICONS: Record<string, string> = {
  ReactJS: 'monitor', Laravel: 'backend', 'Elysia.js': 'code',
  'Next.js': 'web', PostgreSQL: 'storage', Docker: 'cloud',
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
    <div className="bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] text-[#0F172A] min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] h-20 flex justify-between items-center px-6 md:px-8 shadow-sm">
        <Link to="/" className="text-xl font-bold gradient-text font-headline tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">RY</span>
          Rivaldi
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {[["Home", "/"], ["Projects", "/projects"], ["Articles", "/posts"]].map(([label, to]) => (
            <Link key={to} to={to} className={`font-medium text-sm transition-colors duration-200 ${
              to === '/projects' ? 'text-[#4F46E5] font-bold' : 'text-[#475569] hover:text-[#4F46E5]'
            }`}>
              {label}
            </Link>
          ))}
        </div>
        <a href="mailto:aldinggln9@gmail.com" className="btn-primary">
          Let's Connect
        </a>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Ambient glows */}
        <div className="blob blob-primary w-96 h-96 -top-40 -right-40" />
        <div className="blob blob-secondary w-96 h-96 top-1/2 -left-40" style={{ opacity: 0.3 }} />

        {/* Header */}
        <header className="mb-16 relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-headline text-[#0F172A] mb-4 tracking-tight">
            All Projects
          </h1>
          {meta && (
            <p className="text-[#64748B] text-sm font-medium uppercase tracking-widest mb-8">
              {meta.total} project{meta.total !== 1 ? 's' : ''} available
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => handleFilterTab(tab)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all cursor-pointer ${
                    (tab === 'All' && !activeTech) || tab === activeTech
                      ? 'bg-gradient-primary text-white shadow-lg'
                      : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#4F46E5] hover:text-[#4F46E5]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-xl" aria-hidden="true">
                search
              </span>
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search projects..."
                type="text"
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 py-3 pl-12 pr-4 font-body text-sm placeholder:text-[#94A3B8] rounded-lg transition-all"
                aria-label="Search projects"
              />
            </form>
          </div>
        </header>

        {/* Content */}
        <div className="relative z-10">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#4F46E5] border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-[#94A3B8] uppercase tracking-widest">Loading projects...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center py-24 gap-4 text-center">
              <span className="material-symbols-outlined text-5xl text-[#FF6B6B] opacity-60">wifi_off</span>
              <p className="text-[#FF6B6B] font-body text-sm">{error}</p>
              <p className="text-[#94A3B8] font-body text-xs">Please ensure the backend is running</p>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map(project => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="card group relative overflow-hidden"
                >
                  {/* Image/Icon */}
                  <div className="h-48 relative bg-gradient-to-br from-[#E0E7FF] to-[#CFFAFE] rounded-lg overflow-hidden mb-4">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#4F46E5]/20 group-hover:text-[#4F46E5]/40 transition-colors" style={{ fontSize: '80px' }}>
                          {getIcon(project.techStack)}
                        </span>
                      </div>
                    )}
                    {project.isFeatured && (
                      <span className="absolute top-4 right-4 bg-[#22C55E] text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(project.techStack ?? []).slice(0, 3).map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded bg-[#E0E7FF] text-[#4F46E5] font-bold text-[10px] uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                      {(project.techStack?.length ?? 0) > 3 && (
                        <span className="px-2.5 py-1 rounded bg-[#F1F5F9] text-[#94A3B8] font-bold text-[10px]">
                          +{(project.techStack?.length ?? 0) - 3}
                        </span>
                      )}
                    </div>

                    <h3 className="font-headline text-lg font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[#64748B] text-sm line-clamp-2 font-body leading-relaxed">
                      {project.description ?? '—'}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                      <span className="text-[#94A3B8] font-body text-xs">
                        {project.publishedAt ? new Date(project.publishedAt).getFullYear() : '—'}
                      </span>
                      <span className="text-[#4F46E5] font-body font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-32 border border-dashed border-[#E2E8F0] rounded-2xl">
              <span className="material-symbols-outlined text-5xl text-[#CBD5E1] mb-4 block">search_off</span>
              <h4 className="font-headline text-2xl font-bold mb-2 text-[#0F172A]">No Projects Found</h4>
              <p className="text-[#64748B] font-body text-sm mb-6">No projects match your filters.</p>
              <button
                onClick={() => {
                  setActiveTech('')
                  setSearch('')
                  setSearchInput('')
                  setPage(1)
                }}
                className="text-[#4F46E5] font-body text-sm font-bold border-b border-[#4F46E5] pb-1 hover:text-[#06B6D4] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && meta && meta.totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center disabled:opacity-30 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
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
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                      p === page
                        ? 'bg-gradient-primary text-white'
                        : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#4F46E5] hover:text-[#4F46E5]'
                    }`}
                    aria-label={`Go to page ${p}`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ) : null
              })}

              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center disabled:opacity-30 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                aria-label="Next page"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </nav>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-12 px-6 md:px-8 gap-6">
          <p className="text-sm text-[#64748B]">© {new Date().getFullYear()} Rivaldi Yonathan. Crafted with ❤️ for the web.</p>
          <div className="flex gap-6">
            {[['LinkedIn', 'https://linkedin.com/in/rivaldiyn'], ['GitHub', 'https://github.com/RivaldiYN']].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noopener noreferrer" className="text-[#64748B] hover:text-[#4F46E5] transition-colors font-body text-sm font-medium">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
