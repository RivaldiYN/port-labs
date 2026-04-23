import { useState } from "react"
import { Link } from "react-router-dom"
import { usePosts, useTags } from "../hooks/usePosts"

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export default function PostsPage() {
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState("")
  const [page, setPage] = useState(1)
  const [inputVal, setInputVal] = useState("")

  const { data: posts, meta, loading, error } = usePosts({ page, limit: 9, search, tag: activeTag || undefined, sort: "newest" })
  const { tags } = useTags()
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(inputVal); setPage(1) }
  const handleTag = (t: string) => { setActiveTag(prev => prev === t ? "" : t); setPage(1) }

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen font-body">
      <div className="kinetic-blur fixed w-[40vw] h-[40vw] top-[-10%] left-[-10%] z-0" />
      <div className="kinetic-blur fixed w-[40vw] h-[40vw] bottom-[-10%] right-[-10%] z-0" />

      <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl shadow-2xl shadow-black/40 h-20 flex justify-between items-center px-6 md:px-8">
        <Link to="/" className="text-xl font-bold text-[#e5e2e1] font-headline tracking-tighter">Rivaldi<span className="text-[#1DB954]">.</span></Link>
        <div className="hidden md:flex items-center gap-8">
          {([["/"," Home",false],["/projects","Projects",false],["/posts","Notes",true]] as [string,string,boolean][]).map(([to,label,active]) => (
            <Link key={to} to={to} aria-current={active ? "page" : undefined} className={`font-headline tracking-tighter text-sm px-2 py-1 rounded transition-all duration-300 ${active ? "text-[#1DB954] font-bold border-b-2 border-[#1DB954]" : "text-[#e5e2e1]/70 hover:text-[#e5e2e1] hover:bg-[#1DB954]/10"}`}>{label}</Link>
          ))}
        </div>
        <a href="mailto:aldinggln9@gmail.com" className="bg-[#1DB954] text-[#003914] px-5 py-2 rounded-full font-bold font-label text-xs uppercase tracking-widest active:scale-95 transition-all">Hire Me</a>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-8 max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter text-[#e5e2e1] mb-4">Notes &amp; <span className="text-[#53e076]">Thoughts</span></h1>
          <p className="text-[#bccbb9] text-base max-w-xl">Technical writing &amp; experiments from the orbit.</p>
        </header>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-md group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e5e2e1]/30 group-focus-within:text-[#53e076] transition-colors" aria-hidden="true">search</span>
            <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Cari post..." aria-label="Cari post" className="w-full bg-[#1c1b1b] border border-[#3d4a3d]/20 focus:border-[#1db954] focus:outline-none rounded-xl py-3 pl-12 pr-4 text-[#e5e2e1] text-sm transition-all" />
          </div>
          <button type="submit" className="px-5 py-3 rounded-xl bg-[#1c1b1b] border border-[#3d4a3d]/20 hover:border-[#53e076]/40 text-[#e5e2e1]/70 hover:text-[#53e076] font-label text-xs uppercase tracking-widest transition-all">Cari</button>
          {(search || activeTag) && <button type="button" onClick={() => { setSearch(""); setInputVal(""); setActiveTag(""); setPage(1) }} aria-label="Reset filter" className="px-4 py-3 rounded-xl bg-[#1c1b1b] border border-[#3d4a3d]/10 text-[#e5e2e1]/40 hover:text-[#e5e2e1] transition-all"><span className="material-symbols-outlined text-lg" aria-hidden="true">close</span></button>}
        </form>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by tag">
            {tags.map(t => (
              <button key={t} onClick={() => handleTag(t)} aria-pressed={activeTag === t} className={`px-4 py-1.5 rounded-full font-label text-[10px] uppercase tracking-widest font-bold transition-all ${activeTag === t ? "bg-[#1db954] text-[#002108]" : "bg-[#2a2a2a] text-[#e5e2e1]/60 hover:text-[#e5e2e1] hover:bg-[#353534]"}`}>{t}</button>
            ))}
          </div>
        )}

        {loading && <div className="flex justify-center py-24" role="status" aria-label="Memuat"><div className="w-10 h-10 border-2 border-[#53e076] border-t-transparent rounded-full animate-spin" aria-hidden="true" /></div>}
        {error && !loading && <div role="alert" className="text-center py-16"><span className="material-symbols-outlined text-5xl text-[#ffb4ab]/60 mb-3 block" aria-hidden="true">error</span><p className="text-[#ffb4ab]">{error}</p></div>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {posts.map(post => (
                <Link key={post.id} to={`/news/${post.slug}`} className="group bg-[#1c1b1b] rounded-3xl overflow-hidden border border-[#3d4a3d]/10 hover:border-[#53e076]/30 transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076]">
                  {post.coverUrl ? (<div className="w-full h-48 relative overflow-hidden bg-gradient-to-br from-[#1db954]/10 to-[#131313]"><img src={post.coverUrl} alt="" className="w-full h-full object-cover absolute inset-0" onError={e => { e.currentTarget.style.display="none" }} /><div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="material-symbols-outlined text-[#53e076]/20" style={{fontSize:"80px"}} aria-hidden="true">article</span></div></div>) : (<div className="w-full h-48 bg-gradient-to-br from-[#1db954]/10 to-[#131313] flex items-center justify-center"><span className="material-symbols-outlined text-[#53e076]/20" style={{fontSize:"80px"}} aria-hidden="true">article</span></div>)}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">{(post.tags ?? []).slice(0,2).map(t => <span key={t} className="bg-[#353534] text-[#72fe8f] font-label text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{t}</span>)}</div>
                    <h2 className="font-headline font-bold text-[#e5e2e1] text-lg leading-tight mb-2 group-hover:text-[#53e076] transition-colors">{post.title}</h2>
                    <p className="text-[#bccbb9] text-sm leading-relaxed line-clamp-3">{post.excerpt ?? ""}</p>
                    <p className="text-[#e5e2e1]/30 font-label text-[10px] uppercase tracking-widest mt-4">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("id-ID",{year:"numeric",month:"short",day:"numeric"}) : ""}</p>
                  </div>
                </Link>
              ))}
              {posts.length === 0 && <div className="col-span-3 text-center py-20"><span className="material-symbols-outlined text-5xl text-[#e5e2e1]/20 mb-3 block" aria-hidden="true">article</span><p className="text-[#e5e2e1]/40 font-label text-sm uppercase tracking-widest">Belum ada post</p></div>}
            </div>

            {meta && meta.totalPages > 1 && (
              <nav className="flex items-center justify-center gap-4" aria-label="Pagination">
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page === 1} aria-label="Halaman sebelumnya" className="w-10 h-10 rounded-full bg-[#1c1b1b] border border-[#3d4a3d]/20 flex items-center justify-center hover:border-[#53e076]/40 hover:text-[#53e076] transition-all disabled:opacity-30"><span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_left</span></button>
                <span className="font-label text-sm text-[#e5e2e1]/50">{page} / {meta.totalPages}</span>
                <button onClick={() => setPage(p => Math.min(meta.totalPages,p+1))} disabled={page === meta.totalPages} aria-label="Halaman berikutnya" className="w-10 h-10 rounded-full bg-[#1c1b1b] border border-[#3d4a3d]/20 flex items-center justify-center hover:border-[#53e076]/40 hover:text-[#53e076] transition-all disabled:opacity-30"><span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_right</span></button>
              </nav>
            )}
          </>
        )}
      </main>

      <footer className="w-full py-12 border-t border-[#e5e2e1]/10 bg-[#131313]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <p className="font-label text-sm text-[#e5e2e1]/40">© {new Date().getFullYear()} Rivaldi Yonathan Nainggolan.</p>
          <div className="flex gap-8">{[["LinkedIn","https://linkedin.com/in/rivaldiyn"],["GitHub","https://github.com/RivaldiYN"]].map(([l,h]) => <a key={l} href={h} target="_blank" rel="noopener noreferrer" className="font-label text-sm text-[#e5e2e1]/40 hover:text-[#1DB954] transition-colors">{l}</a>)}</div>
        </div>
      </footer>
    </div>
  )
}
