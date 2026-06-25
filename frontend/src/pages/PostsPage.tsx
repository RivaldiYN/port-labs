import { useState, useEffect } from "react"
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
                  to === '/posts' ? 'text-amber-500 font-bold' : ''
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
              <Link to="/projects" className="p-2 font-silkscreen text-xs border border-transparent hover:border-amber-600/20 hover:bg-amber-600/5 flex items-center gap-2 transition-all">
                <span>⚔️</span> Projects Inventory
              </Link>
              <Link to="/posts" className="p-2 font-silkscreen text-xs border border-amber-600/20 bg-amber-600/5 hover:bg-amber-600/10 flex items-center gap-2 transition-all">
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
              <span className="font-silkscreen text-[10px] text-yellow-300 font-bold">SYSTEM: CODEX</span>
              <h1 className="font-silkscreen text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                CHRONICLES &amp; TOMES
              </h1>
              {meta ? (
                <span className="font-silkscreen text-[10px] text-yellow-300 font-bold">
                  QTY: {meta.total} SCROLLS
                </span>
              ) : (
                <span className="font-silkscreen text-[10px] text-yellow-300 font-bold">QTY: 0 SCROLLS</span>
              )}
            </div>

            {/* Search & Filter widget box */}
            <div className={`${theme.boxClass} p-4 flex flex-col gap-4 rounded-sm`}>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                
                {/* Tag Filters list */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(t => {
                      const isActive = activeTag === t
                      return (
                        <button
                          key={t}
                          onClick={() => handleTag(t)}
                          className={`font-silkscreen text-[9px] py-1.5 px-3 border border-dashed transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-green-800/20 text-green-400 border-green-400 font-bold'
                              : 'bg-black/5 dark:bg-black/20 text-inherit border-black/10 hover:border-green-600/40 hover:text-green-400'
                          }`}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Search query box */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <form onSubmit={handleSearch} className="relative flex-1 lg:w-72">
                    <input
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      placeholder="Search codex pages..."
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

                  {(search || activeTag) && (
                    <button
                      onClick={() => {
                        setSearch("")
                        setInputVal("")
                        setActiveTag("")
                        setPage(1)
                      }}
                      className={`${theme.btnClass} py-2 px-4 text-[9px] font-silkscreen`}
                    >
                      RESET FILTERS
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-silkscreen text-[10px] text-amber-500 uppercase tracking-widest">LOADING SCROLLS...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className={`${theme.boxClass} p-12 text-center flex flex-col items-center gap-3`}>
                <span className="material-symbols-outlined text-5xl text-red-500/70">error</span>
                <p className="text-red-500 font-silkscreen text-xs">{error}</p>
                <p className="text-[10px] opacity-75">Please verify connection parameters.</p>
              </div>
            )}

            {/* Posts Grid */}
            {!loading && !error && (
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map(post => (
                    <Link
                      key={post.id}
                      to={`/news/${post.slug}`}
                      className={`group ${theme.boxClass} p-5 flex flex-col gap-3 rounded-sm hover:-translate-y-1 hover:border-amber-500 transition-all`}
                    >
                      {post.coverUrl && (
                        <div className="w-full h-40 relative border-2 border-black/40 overflow-hidden bg-black/10 rounded-xs">
                          <img
                            src={post.coverUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pixelated"
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1.5">
                        <span className="font-silkscreen text-[8px] text-green-500 font-bold">
                          {new Date(post.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        
                        <h2 className="font-silkscreen text-[11px] font-bold text-amber-500 group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h2>
                        
                        <span className="font-silkscreen text-[7px] text-purple-400 font-bold uppercase tracking-wider">
                          ✦ CHRONICLE CODEX
                        </span>
                      </div>

                      <p className="text-xs opacity-80 leading-relaxed line-clamp-3 h-12">
                        {post.excerpt ?? ""}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-dashed border-amber-600/20">
                          {post.tags.slice(0, 2).map(tag => (
                            <span 
                              key={tag} 
                              className="text-[8px] font-silkscreen bg-black/10 text-green-400 px-1.5 py-0.5 border border-black/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>

                {posts.length === 0 && (
                  <div className={`${theme.boxClass} text-center py-20 rounded-sm`}>
                    <span className="material-symbols-outlined text-5xl text-amber-600/40 mb-3 block">article</span>
                    <p className="font-silkscreen text-xs text-amber-500 font-bold">Chronicles are empty</p>
                    <p className="text-xs opacity-75 mt-1">No matching codices exist in selected tag archives.</p>
                  </div>
                )}

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-4 mt-8 mb-4" aria-label="Pagination">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`${theme.btnClass} w-8 h-8 flex items-center justify-center disabled:opacity-30`}
                      aria-label="Previous page"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    
                    <span className="font-silkscreen text-[10px] text-amber-500">
                      PAGE {page} OF {meta.totalPages}
                    </span>
                    
                    <button
                      onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                      disabled={page === meta.totalPages}
                      className={`${theme.btnClass} w-8 h-8 flex items-center justify-center disabled:opacity-30`}
                      aria-label="Next page"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </nav>
                )}

              </div>
            )}
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
