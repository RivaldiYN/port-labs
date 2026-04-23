import { useState, useRef, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCmsMedia, type MediaItem } from "../../hooks/useMedia"

const NAV = [
  { icon: "dashboard",     label: "Dashboard", path: "/cms" },
  { icon: "person",        label: "Profile",   path: "/cms/profile" },
  { icon: "rocket_launch", label: "Projects",  path: "/cms/projects" },
  { icon: "edit_note",     label: "Posts",     path: "/cms/posts" },
  { icon: "perm_media",    label: "Media",     path: "/cms/media", active: true },
]

function fmt(bytes: number | null) {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function isImage(mime: string | null) { return mime?.startsWith("image/") ?? false }

function ConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Konfirmasi hapus">
      <div className="bg-[#1c1b1b] rounded-3xl p-8 max-w-sm w-full border border-[#ffb4ab]/20 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#93000a]/20 flex items-center justify-center mb-5 mx-auto"><span className="material-symbols-outlined text-[#ffb4ab] text-3xl" aria-hidden="true">delete</span></div>
        <h3 className="font-headline text-lg font-bold text-center text-[#e5e2e1] mb-2">Hapus Media?</h3>
        <p className="text-[#e5e2e1]/50 text-sm text-center mb-6 break-all">"{name}" akan dihapus dari MinIO &amp; database.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-[#3d4a3d]/30 text-[#e5e2e1]/60 font-label text-xs uppercase tracking-widest hover:bg-[#2a2a2a] transition-all">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-[#93000a]/80 text-[#ffb4ab] font-label font-bold text-xs uppercase tracking-widest hover:bg-[#93000a] transition-all">Hapus</button>
        </div>
      </div>
    </div>
  )
}

function MediaCard({ item, onDelete, onCopy }: { item: MediaItem; onDelete: () => void; onCopy: () => void }) {
  const [editAlt, setEditAlt] = useState(false)
  return (
    <div className="group bg-[#1c1b1b] rounded-2xl overflow-hidden border border-[#3d4a3d]/10 hover:border-[#53e076]/20 transition-all">
      <div className="aspect-square bg-[#131313] flex items-center justify-center relative overflow-hidden">
        {isImage(item.mimeType)
          ? <img src={item.url} alt={item.altText ?? item.originalName ?? ""} className="w-full h-full object-cover" loading="lazy" />
          : <div className="flex flex-col items-center gap-2 opacity-40"><span className="material-symbols-outlined text-5xl" aria-hidden="true">{item.mimeType === "application/pdf" ? "picture_as_pdf" : "insert_drive_file"}</span><span className="font-label text-[10px] uppercase tracking-widest text-[#e5e2e1]/60">{item.mimeType?.split("/")[1] ?? "FILE"}</span></div>
        }
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={onCopy} aria-label="Copy URL" title="Copy URL" className="w-10 h-10 bg-[#1c1b1b]/80 rounded-xl flex items-center justify-center hover:bg-[#53e076]/30 hover:text-[#53e076] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076]"><span className="material-symbols-outlined text-lg" aria-hidden="true">content_copy</span></button>
          <button onClick={onDelete} aria-label="Hapus media" title="Hapus" className="w-10 h-10 bg-[#1c1b1b]/80 rounded-xl flex items-center justify-center hover:bg-[#93000a]/40 hover:text-[#ffb4ab] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb4ab]"><span className="material-symbols-outlined text-lg" aria-hidden="true">delete</span></button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-[#e5e2e1] text-xs font-medium truncate mb-0.5" title={item.originalName ?? item.filename}>{item.originalName ?? item.filename}</p>
        <p className="text-[#e5e2e1]/30 font-label text-[10px]">{fmt(item.sizeBytes)} · {item.mimeType?.split("/")[1]?.toUpperCase() ?? "?"}</p>
      </div>
    </div>
  )
}

export default function CmsMediaPage() {
  const { admin, logout, accessToken } = useAuth()
  const navigate  = useNavigate()
  const fileRef   = useRef<HTMLInputElement>(null)
  const dropRef   = useRef<HTMLDivElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut]   = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [dragOver, setDragOver]       = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null)
  const [toast, setToast]             = useState<{ msg: string; type?: "error" } | null>(null)
  const [page, setPage]               = useState(1)
  const [copied, setCopied]           = useState("")

  const { data, meta, loading, error, fetchMedia, uploadFile, deleteMedia } = useCmsMedia(accessToken)

  const showToast = useCallback((msg: string, type?: "error") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }, [])

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files)
    setUploading(true)
    let uploaded = 0
    for (const file of arr) {
      try { await uploadFile(file); uploaded++ }
      catch (e) { showToast(`❌ ${file.name}: ${(e as Error).message}`, "error") }
    }
    if (uploaded > 0) { showToast(`✅ ${uploaded} file berhasil diupload`); await fetchMedia(page) }
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files) }
  const handleDelete = async () => { if (!deleteTarget) return; try { await deleteMedia(deleteTarget.id); showToast("🗑️ Media dihapus"); await fetchMedia(page) } catch (e) { showToast(`❌ ${(e as Error).message}`, "error") } finally { setDeleteTarget(null) } }

  const copyUrl = (url: string, id: string) => { navigator.clipboard.writeText(url).then(() => { setCopied(id); setTimeout(() => setCopied(""), 2000) }) }
  const handleLogout = async () => { setLoggingOut(true); await logout(); navigate("/cms/login", { replace: true }) }

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex">
      {deleteTarget && <ConfirmModal name={deleteTarget.originalName ?? deleteTarget.filename} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {toast && <div role="status" aria-live="polite" className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-label text-sm shadow-2xl animate-slide-up border ${toast.type === "error" ? "bg-[#2d1b1b] border-[#ffb4ab]/30 text-[#ffb4ab]" : "bg-[#2a2a2a] border-[#53e076]/30 text-[#e5e2e1]"}`}>{toast.msg}</div>}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      <aside aria-label="Sidebar navigasi CMS" className={`fixed left-0 top-0 h-screen w-64 bg-[#1c1b1b] flex flex-col py-8 shadow-[20px_0_40px_rgba(0,0,0,0.4)] z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-8 mb-10"><Link to="/" className="text-base font-black text-[#1DB954] font-headline uppercase tracking-widest">Admin Console</Link><p className="font-label uppercase tracking-widest text-[10px] text-[#e5e2e1]/50 mt-1">Antigravity CMS</p></div>
        <nav className="flex-1 space-y-1 pr-4 overflow-y-auto" aria-label="Menu utama">
          {NAV.map(({ icon, label, path, active }) => (
            <Link key={label} to={path} aria-current={active ? "page" : undefined} className={`flex items-center gap-4 px-8 py-4 font-label uppercase tracking-widest text-xs rounded-r-full transition-all duration-200 hover:translate-x-1 ${active ? "text-[#1DB954] bg-[#1DB954]/10 border-r-4 border-[#1DB954]" : "text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-[#2a2a2a]"}`}>
              <span className="material-symbols-outlined text-xl" aria-hidden="true" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-8 mt-auto pt-8 border-t border-[#3d4a3d]/20">
          <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#3d4a3d]/40 flex items-center justify-center shrink-0"><span className="font-headline font-black text-[#53e076] text-sm" aria-hidden="true">{admin?.username?.[0]?.toUpperCase() ?? "A"}</span></div><div className="min-w-0"><p className="text-sm font-bold text-[#e5e2e1] truncate">{admin?.username ?? "Admin"}</p><p className="text-[10px] text-[#e5e2e1]/40 font-label tracking-widest">SUPER USER</p></div></div>
          <button onClick={handleLogout} disabled={loggingOut} aria-label="Logout" className="flex items-center gap-4 text-[#ffb4ab]/70 hover:text-[#ffb4ab] transition-all font-label uppercase tracking-widest text-xs disabled:opacity-50 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb4ab] rounded">
            {loggingOut ? <span className="w-4 h-4 border border-[#ffb4ab] border-t-transparent rounded-full animate-spin" aria-hidden="true" /> : <span className="material-symbols-outlined text-sm" aria-hidden="true">logout</span>}
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen flex-1 p-6 md:p-10 xl:p-12">
        <div className="lg:hidden flex items-center gap-4 mb-8">
          <button onClick={() => setSidebarOpen(true)} aria-label="Buka menu" className="w-10 h-10 rounded-xl bg-[#1c1b1b] flex items-center justify-center border border-[#3d4a3d]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1db954]"><span className="material-symbols-outlined" aria-hidden="true">menu</span></button>
          <span className="font-headline font-bold text-[#1DB954] tracking-widest text-sm uppercase">Media Library</span>
        </div>
        <header className="mb-10">
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-[#e5e2e1]">Media<span className="text-[#53e076]">.</span></h1>
          <p className="text-[#e5e2e1]/50 text-sm mt-1">Upload &amp; kelola file gambar dan dokumen {meta ? `· ${meta.total} file` : ""}</p>
        </header>

        {/* Drop Zone */}
        <div
          ref={dropRef}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Klik atau drag-and-drop untuk upload file"
          onKeyDown={e => e.key === "Enter" && fileRef.current?.click()}
          className={`mb-8 border-2 border-dashed rounded-3xl p-10 md:p-16 text-center cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076] ${dragOver ? "border-[#53e076] bg-[#1db954]/10" : "border-[#3d4a3d]/30 bg-[#1c1b1b] hover:border-[#53e076]/50 hover:bg-[#1c1b1b]/80"}`}
        >
          {uploading
            ? <div className="flex flex-col items-center gap-3"><div className="w-10 h-10 border-2 border-[#53e076] border-t-transparent rounded-full animate-spin" aria-hidden="true" /><p className="font-label text-sm text-[#53e076] uppercase tracking-widest">Mengupload...</p></div>
            : <><span className="material-symbols-outlined text-5xl text-[#53e076]/50 mb-4 block" aria-hidden="true">cloud_upload</span>
               <p className="font-headline font-bold text-[#e5e2e1] mb-2">Drag &amp; drop atau klik untuk upload</p>
               <p className="text-[#e5e2e1]/30 text-sm font-label">JPG, PNG, WebP, GIF, PDF · Maks 5MB per file · Multi-upload didukung</p></>
          }
        </div>
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf" className="sr-only" aria-label="Pilih file untuk upload" onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = "" }} />

        {loading && <div className="flex items-center justify-center py-24 gap-3" role="status" aria-label="Memuat"><div className="w-8 h-8 rounded-full border-2 border-[#53e076] border-t-transparent animate-spin" aria-hidden="true" /><p className="font-label text-xs uppercase tracking-widest text-[#e5e2e1]/40">Memuat...</p></div>}
        {error && !loading && <div role="alert" className="flex items-center gap-3 bg-[#93000a]/20 border border-[#ffb4ab]/20 rounded-2xl px-6 py-4 mb-8"><span className="material-symbols-outlined text-[#ffb4ab]" aria-hidden="true">error</span><p className="text-[#ffb4ab] text-sm">{error}</p></div>}

        {!loading && !error && data.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#3d4a3d]/20 rounded-3xl">
            <span className="material-symbols-outlined text-6xl text-[#e5e2e1]/20 mb-4 block" aria-hidden="true">perm_media</span>
            <p className="text-[#e5e2e1]/40 font-label text-xs uppercase tracking-widest mb-2">Media library kosong</p>
            <p className="text-[#e5e2e1]/25 text-sm">Upload file pertamamu dengan drag &amp; drop di atas</p>
          </div>
        )}

        {data.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {data.map(item => (
                <div key={item.id} className="relative">
                  {copied === item.id && <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1db954] text-[#002108] text-[10px] font-bold px-2 py-1 rounded-full font-label uppercase tracking-widest whitespace-nowrap z-10">Copied!</div>}
                  <MediaCard item={item} onDelete={() => setDeleteTarget(item)} onCopy={() => copyUrl(item.url, item.id)} />
                </div>
              ))}
            </div>
            {meta && meta.totalPages > 1 && (
              <nav className="flex items-center justify-center gap-4 mt-10" aria-label="Pagination">
                <button onClick={() => { setPage(p => Math.max(1,p-1)); fetchMedia(Math.max(1,page-1)) }} disabled={page===1} aria-label="Halaman sebelumnya" className="w-10 h-10 rounded-full bg-[#1c1b1b] border border-[#3d4a3d]/20 flex items-center justify-center hover:border-[#53e076]/40 hover:text-[#53e076] transition-all disabled:opacity-30"><span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_left</span></button>
                <span className="font-label text-sm text-[#e5e2e1]/50">{page} / {meta.totalPages}</span>
                <button onClick={() => { setPage(p => Math.min(meta.totalPages,p+1)); fetchMedia(Math.min(meta.totalPages,page+1)) }} disabled={page===meta.totalPages} aria-label="Halaman berikutnya" className="w-10 h-10 rounded-full bg-[#1c1b1b] border border-[#3d4a3d]/20 flex items-center justify-center hover:border-[#53e076]/40 hover:text-[#53e076] transition-all disabled:opacity-30"><span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_right</span></button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  )
}
