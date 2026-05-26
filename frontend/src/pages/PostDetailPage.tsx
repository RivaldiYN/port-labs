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

  const readTime = post?.content ? `${Math.ceil(post.content.split(/\s+/).length / 200)} MIN READ` : "— MIN READ"

  return (
    <div className="bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] text-[#0F172A] min-h-screen font-body">
      {/* Ambient glows */}
      <div className="blob blob-primary w-96 h-96 -top-20 -right-20" style={{ opacity: 0.15 }} />
      <div className="blob blob-secondary w-96 h-96 top-1/2 -left-20" style={{ opacity: 0.15 }} />

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

      <main className="pt-20">
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" role="status">
            <div className="w-12 h-12 rounded-full border-2 border-[#4F46E5] border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-[#94A3B8] uppercase tracking-widest">Loading article...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
            <span className="material-symbols-outlined text-6xl text-[#FF6B6B] opacity-60" aria-hidden="true">article_shortcut</span>
            <h1 className="font-headline text-2xl font-bold text-[#0F172A]">Post tidak ditemukan</h1>
            <p className="text-[#64748B] max-w-md">{error}</p>
            <Link to="/posts" className="btn-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span> Kembali ke Halaman Artikel
            </Link>
          </div>
        )}

        {post && !loading && (
          <>
            {/* Header / Hero Section */}
            <header className="relative w-full h-[400px] md:h-[500px] flex items-end overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-br from-[#2d1769] to-[#CFFAFE]">
              {post.coverUrl ? (
                <>
                  <img src={post.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="material-symbols-outlined text-[#4F46E5]" style={{ fontSize: "300px" }} aria-hidden="true">article</span>
                </div>
              )}
              
              <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-8 pb-10 md:pb-16 text-white">
                <Link to="/posts" className="inline-flex items-center gap-2 text-[#E6B849] hover:text-[#FFF8F0] font-medium text-xs uppercase tracking-widest mb-6 transition-all">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span> Back to Articles
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(post.tags ?? []).map(t => (
                    <span key={t} className="px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-white font-medium text-xs uppercase tracking-wider border border-white/10">
                      {t}
                    </span>
                  ))}
                  <span className="px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-white/80 font-medium text-xs uppercase tracking-wider border border-white/10">
                    {readTime}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight leading-none max-w-4xl">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 mt-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/25 flex items-center justify-center shrink-0">
                    <span className="text-lg font-headline font-black text-white" aria-hidden="true">R</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rivaldi Yonathan Nainggolan</p>
                    <p className="text-white/60 text-xs font-body tracking-wider uppercase">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
              {/* Sidebar Left: Tags & Share */}
              <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-fit space-y-8">
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                  <h2 className="font-headline text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {(post.tags ?? []).map(t => (
                      <Link key={t} to={`/posts?tag=${t}`} className="px-3 py-1.5 bg-[#E0E7FF] border border-[#CFFAFE] rounded-lg text-[#4F46E5] font-bold text-xs uppercase tracking-wider hover:border-[#4F46E5] transition-all">
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                  <h2 className="font-headline text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-4">Share Article</h2>
                  <div className="flex gap-3">
                    {["share", "link"].map(icon => (
                      <button key={icon} aria-label={icon === "share" ? "Share post" : "Copy link"} className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#FFF8F0] hover:text-[#D4A373] hover:border-[#D4A373] transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-base" aria-hidden="true">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Article Body */}
              <article className="lg:col-span-7 prose prose-slate max-w-none pt-4">
                {post.excerpt && (
                  <p className="text-xl text-[#475569] leading-relaxed font-body font-medium mb-8 pb-6 border-b border-[#E2E8F0]">
                    {post.excerpt}
                  </p>
                )}
                {post.content && (
                  <div style={{ whiteSpace: "pre-wrap" }} className="text-[#334155] leading-relaxed text-base font-body">
                    {post.content}
                  </div>
                )}
              </article>

              {/* Sidebar Right: Hire CTA */}
              <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-28 h-fit">
                <div className="bg-gradient-to-br from-[#D4A373]/10 to-[#0891B2]/10 border border-[#E2E8F0] rounded-2xl p-6 text-center space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4A373] font-bold block">Hire Me</span>
                  <h3 className="text-[#0F172A] font-headline font-bold text-sm">Ready to build your next web project?</h3>
                  <a href="mailto:aldinggln9@gmail.com" className="btn-primary block text-center py-2.5">
                    Get in Touch
                  </a>
                </div>
                <div className="text-center">
                  <Link to="/posts" className="inline-flex items-center gap-1 text-[#4F46E5] hover:text-[#06B6D4] font-semibold text-xs uppercase tracking-widest transition-colors">
                    <span className="material-symbols-outlined text-xs">arrow_back</span> All Articles
                  </Link>
                </div>
              </aside>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white/50 backdrop-blur-sm mt-20">
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
