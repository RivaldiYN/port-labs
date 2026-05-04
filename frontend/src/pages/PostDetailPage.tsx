import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"

const API = import.meta.env.VITE_API_URL ?? "backend"

interface Post {
  id: string; title: string; slug: string; excerpt: string|null; content: string|null
  coverUrl: string|null; tags: string[]|null; isPublished: boolean
  publishedAt: string|null; createdAt: string; updatedAt: string
}

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post|null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

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
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen font-body">
      <div className="kinetic-blur fixed w-[40vw] h-[40vw] top-[-10%] left-[-10%] z-0" />
      <div className="kinetic-blur fixed w-[40vw] h-[40vw] bottom-[-10%] right-[-10%] z-0" />

      <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl shadow-2xl shadow-black/40 h-20 flex justify-between items-center px-6 md:px-8">
        <Link to="/" className="text-xl font-bold text-[#e5e2e1] font-headline tracking-tighter">Rivaldi<span className="text-[#1DB954]">.</span></Link>
        <div className="hidden md:flex items-center gap-8">
          {([["/"," Home",false],["/projects","Projects",false],["/posts","Notes",true]] as [string,string,boolean][]).map(([to,label,active]) => (
            <Link key={to} to={to} aria-current={active?"page":undefined} className={`font-headline tracking-tighter text-sm px-2 py-1 rounded transition-all ${active?"text-[#1DB954] font-bold border-b-2 border-[#1DB954]":"text-[#e5e2e1]/70 hover:text-[#e5e2e1] hover:bg-[#1DB954]/10"}`}>{label}</Link>
          ))}
        </div>
        <a href="mailto:aldinggln9@gmail.com" className="bg-[#1DB954] text-[#003914] px-5 py-2 rounded-full font-bold font-label text-xs uppercase tracking-widest active:scale-95 transition-all">Hire Me</a>
      </nav>

      <main className="pt-20">
        {loading && <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Memuat"><div className="w-12 h-12 border-2 border-[#53e076] border-t-transparent rounded-full animate-spin" aria-hidden="true" /></div>}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
            <span className="material-symbols-outlined text-6xl text-[#ffb4ab]/50" aria-hidden="true">article_shortcut</span>
            <h1 className="font-headline text-2xl font-bold text-[#e5e2e1]">Post tidak ditemukan</h1>
            <p className="text-[#e5e2e1]/50">{error}</p>
            <Link to="/posts" className="bg-[#53e076] text-[#002108] px-6 py-3 rounded-full font-label font-bold text-xs uppercase tracking-widest hover:bg-[#1db954] transition-all">? Kembali ke Posts</Link>
          </div>
        )}

        {post && !loading && (
          <>
            <header className="relative w-full h-64 sm:h-80 md:h-[480px] lg:h-[560px] flex items-end overflow-hidden">
              {post.coverUrl
                ? <><img src={post.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent" /></>
                : <div className="absolute inset-0 bg-gradient-to-br from-[#1db954]/20 via-[#1c1b1b] to-[#131313]"><div className="absolute inset-0 flex items-center justify-center opacity-10"><span className="material-symbols-outlined text-[#53e076]" style={{fontSize:"400px"}} aria-hidden="true">article</span></div><div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/40 to-transparent" /></div>
              }
              <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-8 pb-10 md:pb-16">
                <Link to="/posts" className="flex items-center gap-2 text-[#53e076] font-label text-xs uppercase tracking-widest mb-6 hover:-translate-x-1 transition-transform w-fit">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span> Back to Notes
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(post.tags ?? []).map(t => <span key={t} className="px-4 py-1 bg-[#353534] rounded-full text-[#53e076] font-label text-xs tracking-wider border border-[#3d4a3d]/20">{t.toUpperCase()}</span>)}
                  <span className="px-4 py-1 bg-[#353534] rounded-full text-[#e5e2e1]/60 font-label text-xs tracking-wider border border-[#3d4a3d]/20">{readTime}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-tighter leading-none text-[#e5e2e1] max-w-4xl">{post.title}</h1>
                <div className="flex items-center gap-4 mt-6">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border-2 border-[#53e076]/30 flex items-center justify-center"><span className="text-lg font-headline font-black text-[#53e076]" aria-hidden="true">R</span></div>
                  <div><p className="text-[#e5e2e1] font-semibold text-sm">Rivaldi Yonathan Nainggolan</p><p className="text-[#e5e2e1]/40 text-xs font-label uppercase tracking-tighter">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}) : ""}</p></div>
                </div>
              </div>
            </header>

            <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
                <div className="mb-12">
                  <h2 className="font-label text-xs uppercase tracking-[0.2em] text-[#e5e2e1]/40 mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">{(post.tags ?? []).map(t => <Link key={t} to={`/posts?tag=${t}`} className="px-3 py-1 bg-[#1c1b1b] border border-[#3d4a3d]/20 rounded-full text-[#53e076] font-label text-[10px] uppercase tracking-widest hover:border-[#53e076]/40 transition-all">{t}</Link>)}</div>
                </div>
                <div>
                  <h2 className="font-label text-xs uppercase tracking-[0.2em] text-[#e5e2e1]/40 mb-6">Share</h2>
                  <div className="flex gap-3">
                    {["share","link"].map(icon => <button key={icon} aria-label={icon==="share"?"Share post":"Copy link"} className="w-10 h-10 rounded-full bg-[#1c1b1b] flex items-center justify-center hover:bg-[#53e076]/20 hover:text-[#53e076] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076]"><span className="material-symbols-outlined text-base" aria-hidden="true">{icon}</span></button>)}
                  </div>
                </div>
              </aside>

              <article className="lg:col-span-7 prose">
                {post.excerpt && <p className="text-xl text-[#e5e2e1]/90 leading-relaxed font-medium mb-12">{post.excerpt}</p>}
                {post.content && <div style={{whiteSpace:"pre-wrap"}} className="text-[#bccbb9] leading-relaxed">{post.content}</div>}
              </article>

              <aside className="lg:col-span-2 space-y-10">
                <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#3d4a3d]/10">
                  <p className="font-label text-[10px] uppercase tracking-widest text-[#53e076] mb-4">Hire Me</p>
                  <h3 className="text-[#e5e2e1] font-headline font-bold text-sm mb-4">Ready to launch your project?</h3>
                  <a href="mailto:aldinggln9@gmail.com" className="block w-full py-3 bg-[#53e076] text-[#002108] font-bold rounded-full text-sm text-center hover:shadow-[0_0_20px_rgba(83,224,118,0.3)] transition-all active:scale-95">Get in Touch</a>
                </div>
                <div>
                  <Link to="/posts" className="text-[#53e076] font-label text-xs uppercase tracking-widest hover:underline">? All Notes</Link>
                </div>
              </aside>
            </section>
          </>
        )}
      </main>

      <footer className="w-full py-12 border-t border-[#e5e2e1]/10 bg-[#131313] mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto gap-6">
          <p className="font-label text-sm text-[#e5e2e1]/40">© {new Date().getFullYear()} Rivaldi Yonathan Nainggolan.</p>
          <div className="flex gap-8">{[["LinkedIn","https://linkedin.com/in/rivaldiyn"],["GitHub","https://github.com/RivaldiYN"]].map(([l,h]) => <a key={l} href={h} target="_blank" rel="noopener noreferrer" className="font-label text-sm text-[#e5e2e1]/40 hover:text-[#1DB954] transition-colors">{l}</a>)}</div>
        </div>
      </footer>
    </div>
  )
}
