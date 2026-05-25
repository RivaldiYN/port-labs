import { useState } from "react"
import { Link } from "react-router-dom"
import { usePosts, useTags } from "../hooks/usePosts"

export default function PostsPage() {
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState("")
  const [page, setPage] = useState(1)
  const [inputVal, setInputVal] = useState("")

  const { data: posts, meta, loading, error } = usePosts({ page, limit: 9, search, tag: activeTag || undefined, sort: "newest" })
  const { tags } = useTags()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(inputVal)
    setPage(1)
  }

  const handleTag = (t: string) => {
    setActiveTag(prev => prev === t ? "" : t)
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
              to === '/posts' ? 'text-[#4F46E5] font-bold' : 'text-[#475569] hover:text-[#4F46E5]'
            }`}>
              {label}
            </Link>
          ))}
        </div>
        <a href="mailto:aldinggln9@gmail.com" className="btn-primary">
          Let's Connect
        </a>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-8 max-w-6xl mx-auto relative z-10">
        {/* Ambient glows */}
        <div className="blob blob-secondary w-96 h-96 -top-40 -left-40" />
        <div className="blob blob-tertiary w-72 h-72 bottom-0 -right-20" style={{ opacity: 0.3 }} />

        <header className="mb-12 relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-headline text-[#0F172A] mb-4 tracking-tight">
            Articles & Insights
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl">Technical writing, development tips, and thoughts on modern web.</p>
        </header>

        <div className="space-y-6 relative z-10 mb-10">
          {/* Search and Filter Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" aria-hidden="true">
                search
              </span>
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 py-3 pl-12 pr-4 font-body text-sm placeholder:text-[#94A3B8] rounded-lg transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-primary text-white font-bold text-sm uppercase tracking-wide transition-all hover:shadow-lg"
            >
              Search
            </button>
            {(search || activeTag) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setInputVal("")
                  setActiveTag("")
                  setPage(1)
                }}
                aria-label="Reset filters"
                className="px-6 py-3 rounded-lg bg-white border border-[#E2E8F0] text-[#4F46E5] font-bold text-sm uppercase tracking-wide hover:border-[#4F46E5] transition-all"
              >
                Reset
              </button>
            )}
          </form>

          {/* Tag Filter */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
              {tags.map(t => (
                <button
                  key={t}
                  onClick={() => handleTag(t)}
                  aria-pressed={activeTag === t}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                    activeTag === t
                      ? 'bg-gradient-secondary text-white'
                      : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#06B6D4] hover:text-[#06B6D4]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-24" role="status" aria-label="Loading articles">
            <div className="w-10 h-10 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div role="alert" className="text-center py-16 relative z-10">
            <span className="material-symbols-outlined text-5xl text-[#FF6B6B] opacity-60 mb-3 block" aria-hidden="true">
              error
            </span>
            <p className="text-[#FF6B6B] font-body text-sm">{error}</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-12">
              {posts.map(post => (
                <Link
                  key={post.id}
                  to={`/news/${post.slug}`}
                  className="card group"
                >
                  {post.coverUrl && (
                    <div className="w-full h-40 relative overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-[#E0E7FF] to-[#CFFAFE]">
                      <img
                        src={post.coverUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(post.tags ?? []).slice(0, 2).map(t => (
                        <span
                          key={t}
                          className="bg-[#CFFAFE] text-[#06B6D4] font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-headline font-bold text-[#0F172A] text-lg leading-tight group-hover:text-[#4F46E5] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[#64748B] text-sm leading-relaxed line-clamp-3">{post.excerpt ?? ""}</p>
                    <p className="text-[#94A3B8] font-body text-xs uppercase tracking-widest pt-2 border-t border-[#E2E8F0]">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </Link>
              ))}
              {posts.length === 0 && (
                <div className="col-span-3 text-center py-20">
                  <span className="material-symbols-outlined text-5xl text-[#CBD5E1] mb-3 block" aria-hidden="true">
                    article
                  </span>
                  <p className="text-[#64748B] font-body text-sm">No articles found.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <nav className="flex items-center justify-center gap-4 relative z-10" aria-label="Pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center disabled:opacity-30 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="font-body text-sm text-[#94A3B8]" aria-live="polite">
                  {page} / {meta.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  aria-label="Next page"
                  className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center disabled:opacity-30 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-12 px-6 md:px-8 gap-6">
          <p className="text-sm text-[#64748B]">© {new Date().getFullYear()} Rivaldi Yonathan. Crafted with ❤️ for the web.</p>
          <div className="flex gap-6">
            {[["LinkedIn", "https://linkedin.com/in/rivaldiyn"], ["GitHub", "https://github.com/RivaldiYN"]].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#64748B] hover:text-[#4F46E5] transition-colors font-body text-sm font-medium"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
