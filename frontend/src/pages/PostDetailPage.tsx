import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface Post {
  id: string; title: string; slug: string; excerpt: string | null; content: string | null
  coverUrl: string | null; tags: string[] | null; isPublished: boolean
  publishedAt: string | null; createdAt: string; updatedAt: string
}

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true); setError(null)
    fetch(`${API}/api/posts/${slug}`)
      .then(r => r.json())
      .then(j => { if (j.success) setPost(j.data); else setError(j.message ?? "Post tidak ditemukan") })
      .catch(() => setError("Gagal memuat post"))
      .finally(() => setLoading(false))
  }, [slug])

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

  const readTime = post?.content ? `${Math.ceil(post.content.split(/\s+/).length / 200)} MIN READ` : "— MIN READ"

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
          <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
            
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3" role="status">
                <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                <p className="font-silkscreen text-[10px] text-amber-500 uppercase tracking-widest">LOADING SCROLL CHRONICLE...</p>
              </div>
            )}

            {error && !loading && (
              <div className={`${theme.boxClass} p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto w-full`}>
                <span className="material-symbols-outlined text-5xl text-red-500/70">article_shortcut</span>
                <h1 className="font-silkscreen text-xs font-bold text-amber-500">CHRONICLE NOT FOUND</h1>
                <p className="text-xs opacity-75">{error}</p>
                <Link to="/posts" className={`${theme.btnClass} py-2.5 px-4 font-silkscreen text-[10px] flex items-center gap-1.5`}>
                  <span>←</span> BACK TO CHRONICLES
                </Link>
              </div>
            )}

            {post && !loading && (
              <div className="flex flex-col gap-6">
                
                {/* Back Link */}
                <div>
                  <Link 
                    to="/posts" 
                    className={`${theme.btnClass} py-1.5 px-3 font-silkscreen text-[9px] inline-flex items-center gap-1.5`}
                  >
                    <span>←</span> BACK TO ARTICLES
                  </Link>
                </div>

                {/* Cover Banner Image with Gold Borders */}
                <div className={`border-4 ${theme.borderColor} relative w-full aspect-[21/9] bg-black/25 flex items-end overflow-hidden shadow-md`}>
                  {post.coverUrl ? (
                    <>
                      <img src={post.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover pixelated" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent z-10" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="material-symbols-outlined text-amber-500" style={{ fontSize: "160px" }}>article</span>
                    </div>
                  )}

                  <div className="relative z-20 w-full p-4 sm:p-6 text-white flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(post.tags ?? []).map(t => (
                        <span key={t} className="px-2 py-0.5 bg-black/45 border border-white/20 text-white font-silkscreen text-[8px] uppercase">
                          {t}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 bg-black/45 border border-white/20 text-white/80 font-silkscreen text-[8px] uppercase">
                        {readTime}
                      </span>
                    </div>

                    <h1 className="font-silkscreen text-xs sm:text-sm md:text-base font-bold text-amber-400 tracking-tight line-clamp-2 uppercase">
                      {post.title}
                    </h1>

                    <div className="flex items-center gap-3.5 mt-1 border-t border-dashed border-white/20 pt-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-silkscreen font-bold text-amber-500">RY</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-silkscreen text-[9px] font-semibold text-white/95">RIVALDI YONATHAN NAINGGOLAN</span>
                        <span className="font-silkscreen text-[8px] text-white/60 tracking-wider">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase() : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom details layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start">
                  
                  {/* Left Column Sidebar: share & tags */}
                  <aside className="lg:col-span-3 flex flex-col gap-4 lg:sticky lg:top-24">
                    
                    {/* Tags block */}
                    <div className={`${theme.boxClass} p-4 rounded-sm flex flex-col gap-3`}>
                      <h2 className="font-silkscreen text-[9px] font-bold uppercase tracking-wider text-amber-500">
                        TAGS SLOTS
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {(post.tags ?? []).map(t => (
                          <Link 
                            key={t} 
                            to={`/posts?tag=${t}`} 
                            className="px-2 py-0.5 bg-black/20 text-amber-500 font-silkscreen text-[8px] uppercase border border-black/10 hover:border-amber-500 transition-all"
                          >
                            {t}
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    {/* Share block */}
                    <div className={`${theme.boxClass} p-4 rounded-sm flex flex-col gap-3`}>
                      <h2 className="font-silkscreen text-[9px] font-bold uppercase tracking-wider text-amber-500">
                        SHARE CHRONICLE
                      </h2>
                      <div className="flex gap-2">
                        {["share", "link"].map(icon => (
                          <button 
                            key={icon} 
                            aria-label={icon === "share" ? "Share post" : "Copy link"} 
                            onClick={() => {
                              if (icon === "link") {
                                navigator.clipboard.writeText(window.location.href)
                                alert("Link copied to clipboard!")
                              }
                            }}
                            className={`${theme.btnClass} w-8 h-8 flex items-center justify-center`}
                          >
                            <span className="material-symbols-outlined text-xs">{icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </aside>

                  {/* Main Article parchment */}
                  <article className={`${theme.boxClass} p-6 lg:col-span-6 rounded-sm flex flex-col gap-4`}>
                    {post.excerpt && (
                      <p className="text-xs leading-relaxed font-bold border-b border-dashed border-amber-600/30 pb-4 opacity-90">
                        {post.excerpt}
                      </p>
                    )}
                    {post.content && (
                      <div 
                        style={{ whiteSpace: "pre-wrap" }} 
                        className="leading-relaxed text-xs opacity-85"
                      >
                        {post.content}
                      </div>
                    )}
                  </article>

                  {/* Right Column Sidebar: quest info */}
                  <aside className="lg:col-span-3 flex flex-col gap-4 lg:sticky lg:top-24">
                    
                    <div className={`${theme.boxClass} p-5 rounded-sm text-center flex flex-col gap-3`}>
                      <span className="text-[8px] font-silkscreen text-amber-500 font-bold uppercase tracking-wider">
                        CONTRACTS INFO
                      </span>
                      <h3 className="font-silkscreen text-[10px] font-bold text-amber-500">
                        READY FOR HIRE
                      </h3>
                      <p className="text-[10px] opacity-80 leading-relaxed">
                        Looking for a clean frontend or backend API developer for your next product? Let's connect.
                      </p>
                      <a 
                        href="mailto:aldinggln9@gmail.com" 
                        className={`${theme.btnClass} py-2 px-4 font-silkscreen text-[9px] block`}
                      >
                        SEND MESSAGE [✉]
                      </a>
                    </div>

                    <div className="text-center">
                      <Link 
                        to="/posts" 
                        className="inline-flex items-center gap-1 font-silkscreen text-[9px] text-amber-500 hover:text-amber-400"
                      >
                        <span>←</span> ALL CHRONICLES
                      </Link>
                    </div>
                  </aside>

                </div>
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
