import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCmsProjects, type Project } from '../../hooks/useProjects'

// ── Form state ────────────────────────────────────────────────────────────────
const emptyForm = (): Partial<Project> => ({
  title: '', description: '', content: '', thumbnailUrl: '',
  demoUrl: '', repoUrl: '', techStack: [], isFeatured: false, isPublished: false,
})

// ── Modal: Create / Edit ──────────────────────────────────────────────────────
function ProjectModal({
  project, onClose, onSave,
}: {
  project: Project | null
  onClose: () => void
  onSave: (data: Partial<Project>) => Promise<void>
}) {
  const [form, setForm]       = useState<Partial<Project>>(project ?? emptyForm())
  const [techInput, setTech]  = useState((project?.techStack ?? []).join(', '))
  const [saving, setSaving]   = useState(false)
  const [err, setErr]         = useState('')

  const set = (k: keyof Project, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      const techStack = techInput.split(',').map(s => s.trim()).filter(Boolean)
      await onSave({ ...form, techStack })
      onClose()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1b1b] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#3d4a3d]/20 shadow-2xl">
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#3d4a3d]/20">
          <h2 className="font-headline text-xl font-bold text-[#e5e2e1]">
            {project ? 'Edit Project' : 'Buat Project Baru'}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#353534] transition-all">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {err && (
            <div className="flex items-center gap-3 bg-[#93000a]/20 border border-[#ffb4ab]/20 rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-[#ffb4ab] text-lg">error</span>
              <p className="text-[#ffb4ab] text-sm">{err}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-[#e5e2e1]/50 mb-2 block">
              Judul <span className="text-[#53e076]">*</span>
            </label>
            <input required value={form.title ?? ''}
              onChange={e => set('title', e.target.value)}
              placeholder="Dashboard ML Monitoring"
              className="w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3 px-4 text-[#e5e2e1] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]" />
          </div>

          {/* Description */}
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-[#e5e2e1]/50 mb-2 block">Deskripsi</label>
            <textarea value={form.description ?? ''} rows={3}
              onChange={e => set('description', e.target.value)}
              placeholder="Deskripsi singkat project..."
              className="w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3 px-4 text-[#e5e2e1] text-sm transition-all resize-none focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]" />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-[#e5e2e1]/50 mb-2 block">
              Tech Stack <span className="text-[#e5e2e1]/30">(pisahkan dengan koma)</span>
            </label>
            <input value={techInput}
              onChange={e => setTech(e.target.value)}
              placeholder="ReactJS, TypeScript, TailwindCSS"
              className="w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3 px-4 text-[#e5e2e1] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]" />
          </div>

          {/* URLs row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label text-[10px] uppercase tracking-widest text-[#e5e2e1]/50 mb-2 block">Demo URL</label>
              <input type="url" value={form.demoUrl ?? ''}
                onChange={e => set('demoUrl', e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3 px-4 text-[#e5e2e1] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]" />
            </div>
            <div>
              <label className="font-label text-[10px] uppercase tracking-widest text-[#e5e2e1]/50 mb-2 block">Repo URL</label>
              <input type="url" value={form.repoUrl ?? ''}
                onChange={e => set('repoUrl', e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3 px-4 text-[#e5e2e1] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]" />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-[#e5e2e1]/50 mb-2 block">Thumbnail URL</label>
            <input type="url" value={form.thumbnailUrl ?? ''}
              onChange={e => set('thumbnailUrl', e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3 px-4 text-[#e5e2e1] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]" />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            {[
              { key: 'isFeatured' as const, label: 'Featured' },
              { key: 'isPublished' as const, label: 'Published' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div onClick={() => set(key, !form[key])}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${form[key] ? 'bg-[#1db954]' : 'bg-[#353534]'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${form[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="font-label text-xs uppercase tracking-widest text-[#e5e2e1]/70 group-hover:text-[#e5e2e1] transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#3d4a3d]/20">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#3d4a3d]/30 text-[#e5e2e1]/60 font-label text-xs uppercase tracking-widest hover:bg-[#2a2a2a] transition-all">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#1db954] text-[#002108] font-label font-bold text-xs uppercase tracking-widest hover:bg-[#53e076] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <span className="w-4 h-4 border-2 border-[#002108] border-t-transparent rounded-full animate-spin" /> : null}
              {saving ? 'Menyimpan...' : project ? 'Simpan Perubahan' : 'Buat Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Confirm Delete Modal ──────────────────────────────────────────────────────
function ConfirmModal({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1b1b] rounded-3xl p-8 max-w-sm w-full border border-[#ffb4ab]/20 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#93000a]/20 flex items-center justify-center mb-5 mx-auto">
          <span className="material-symbols-outlined text-[#ffb4ab] text-3xl">delete</span>
        </div>
        <h3 className="font-headline text-lg font-bold text-center text-[#e5e2e1] mb-2">Hapus Project?</h3>
        <p className="text-[#e5e2e1]/50 text-sm text-center mb-6 font-body">
          "<span className="text-[#e5e2e1]/80">{title}</span>" akan dihapus permanen dan tidak dapat dikembalikan.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-[#3d4a3d]/30 text-[#e5e2e1]/60 font-label text-xs uppercase tracking-widest hover:bg-[#2a2a2a] transition-all">
            Batal
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[#93000a]/80 text-[#ffb4ab] font-label font-bold text-xs uppercase tracking-widest hover:bg-[#93000a] transition-all">
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main CMS Projects Page ────────────────────────────────────────────────────
export default function CmsProjectsPage() {
  const { admin, logout, accessToken }    = useAuth()
  const navigate                          = useNavigate()
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [search, setSearch]               = useState('')
  const [editProject, setEditProject]     = useState<Project | null | 'new'>(null)
  const [deleteTarget, setDeleteTarget]   = useState<Project | null>(null)
  const [toast, setToast]                 = useState('')
  const [loggingOut, setLoggingOut]       = useState(false)

  const { data, loading, error, fetchAll, createProject, updateProject, deleteProject, togglePublish } =
    useCmsProjects(accessToken)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    fetchAll(search)
  }, [search, fetchAll])

  const handleSave = async (data: Partial<Project>) => {
    if (editProject === 'new') {
      await createProject(data)
      showToast('✅ Project berhasil dibuat')
    } else if (editProject) {
      await updateProject(editProject.id, data)
      showToast('✅ Project berhasil diupdate')
    }
    fetchAll(search)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteProject(deleteTarget.id)
    setDeleteTarget(null)
    showToast('🗑️ Project berhasil dihapus')
    fetchAll(search)
  }

  const handleToggle = async (id: string) => {
    await togglePublish(id)
    showToast('📡 Status publikasi diubah')
    fetchAll(search)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/cms/login', { replace: true })
  }

  const NAV = [
    { icon: 'dashboard', label: 'Dashboard', path: '/cms' },
    { icon: 'person', label: 'Profile', path: '/cms/profile' },
    { icon: 'rocket_launch', label: 'Projects', path: '/cms/projects', active: true },
    { icon: 'edit_note', label: 'Posts', path: '/cms/posts' },
    { icon: 'perm_media', label: 'Media', path: '/cms/media' },
  ]

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex">
      {/* Modals */}
      {editProject !== null && (
        <ProjectModal
          project={editProject === 'new' ? null : editProject}
          onClose={() => setEditProject(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a2a] border border-[#53e076]/30 px-6 py-3 rounded-full font-label text-sm text-[#e5e2e1] shadow-2xl animate-slide-up">
          {toast}
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-[#1c1b1b] flex flex-col py-8 shadow-[20px_0_40px_rgba(0,0,0,0.4)] z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-8 mb-10">
          <Link to="/" className="text-base font-black text-[#1DB954] font-headline uppercase tracking-widest">Admin Console</Link>
          <p className="font-label uppercase tracking-widest text-[10px] text-[#e5e2e1]/50 mt-1">Antigravity CMS</p>
        </div>
        <nav className="flex-1 space-y-1 pr-4 overflow-y-auto">
          {NAV.map(({ icon, label, path, active }) => (
            <Link key={label} to={path}
              className={`flex items-center gap-4 px-8 py-4 font-label uppercase tracking-widest text-xs rounded-r-full transition-all duration-200 hover:translate-x-1 ${active ? 'text-[#1DB954] bg-[#1DB954]/10 border-r-4 border-[#1DB954]' : 'text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-[#2a2a2a]'}`}>
              <span className="material-symbols-outlined text-xl" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-8 mt-auto space-y-4 pt-8 border-t border-[#3d4a3d]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#3d4a3d]/40 flex items-center justify-center shrink-0">
              <span className="font-headline font-black text-[#53e076] text-sm">{admin?.username?.[0]?.toUpperCase() ?? 'A'}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#e5e2e1] truncate">{admin?.username ?? 'Admin'}</p>
              <p className="text-[10px] text-[#e5e2e1]/40 font-label tracking-widest">SUPER USER</p>
            </div>
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            className="flex items-center gap-4 text-[#ffb4ab]/70 hover:text-[#ffb4ab] transition-all font-label uppercase tracking-widest text-xs disabled:opacity-50 w-full">
            {loggingOut ? <span className="w-4 h-4 border border-[#ffb4ab] border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-sm">logout</span>}
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 min-h-screen flex-1 p-6 md:p-10 xl:p-12">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-4 mb-8">
          <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 rounded-xl bg-[#1c1b1b] flex items-center justify-center border border-[#3d4a3d]/20">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-headline font-bold text-[#1DB954] tracking-widest text-sm uppercase">Projects</span>
        </div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-[#e5e2e1]">
              Projects<span className="text-[#53e076]">.</span>
            </h1>
            <p className="text-[#e5e2e1]/50 text-sm mt-1">Kelola semua project — published & drafts</p>
          </div>
          <button onClick={() => setEditProject('new')}
            className="bg-[#53e076] hover:bg-[#1db954] text-[#002108] font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all active:scale-95 group shrink-0">
            <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform duration-300">add</span>
            <span className="font-label text-xs uppercase tracking-widest">New Project</span>
          </button>
        </header>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-md group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e5e2e1]/30 group-focus-within:text-[#53e076] transition-colors text-xl">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari project..."
              className="w-full bg-[#1c1b1b] border border-[#3d4a3d]/20 focus:border-[#1db954] focus:outline-none rounded-xl py-3 pl-12 pr-4 text-[#e5e2e1] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]" />
          </div>
          <button type="submit" className="px-5 py-3 rounded-xl bg-[#1c1b1b] border border-[#3d4a3d]/20 hover:border-[#53e076]/40 text-[#e5e2e1]/70 hover:text-[#53e076] font-label text-xs uppercase tracking-widest transition-all">
            Cari
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); fetchAll('') }}
              className="px-4 py-3 rounded-xl bg-[#1c1b1b] border border-[#3d4a3d]/10 text-[#e5e2e1]/40 hover:text-[#e5e2e1] transition-all">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#53e076] border-t-transparent animate-spin" />
            <p className="font-label text-xs uppercase tracking-widest text-[#e5e2e1]/40">Memuat...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-[#ffb4ab]/60 mb-3 block">error</span>
            <p className="text-[#ffb4ab] font-label text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-[#1c1b1b] rounded-3xl border border-[#3d4a3d]/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#3d4a3d]/10">
                      <th className="text-left px-6 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-[#e5e2e1]/30">Project</th>
                      <th className="text-left px-4 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-[#e5e2e1]/30">Tech Stack</th>
                      <th className="text-center px-4 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-[#e5e2e1]/30">Featured</th>
                      <th className="text-center px-4 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-[#e5e2e1]/30">Status</th>
                      <th className="text-right px-6 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-[#e5e2e1]/30">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3d4a3d]/5">
                    {data.map(p => (
                      <tr key={p.id} className="group hover:bg-[#2a2a2a]/50 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-headline font-bold text-sm text-[#e5e2e1] max-w-xs truncate">{p.title}</p>
                          <p className="text-[#e5e2e1]/30 font-label text-[10px] mt-0.5">{p.slug}</p>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(p.techStack ?? []).slice(0, 3).map(t => (
                              <span key={t} className="bg-[#353534] text-[#72fe8f] font-label text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{t}</span>
                            ))}
                            {(p.techStack?.length ?? 0) > 3 && (
                              <span className="text-[#e5e2e1]/30 font-label text-[9px]">+{(p.techStack?.length ?? 0) - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className={`material-symbols-outlined text-lg ${p.isFeatured ? 'text-[#53e076]' : 'text-[#e5e2e1]/20'}`}>
                            {p.isFeatured ? 'star' : 'star_border'}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <button onClick={() => handleToggle(p.id)}
                            title={p.isPublished ? 'Klik untuk jadikan Draft' : 'Klik untuk Publish'}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 ${p.isPublished ? 'bg-[#1db954]/20 text-[#53e076] hover:bg-[#1db954]/30' : 'bg-[#353534] text-[#e5e2e1]/50 hover:bg-[#2a2a2a]'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.isPublished ? 'bg-[#53e076] animate-pulse' : 'bg-[#e5e2e1]/30'}`} />
                            {p.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setEditProject(p)}
                              className="w-8 h-8 rounded-xl bg-[#2a2a2a] flex items-center justify-center hover:bg-[#53e076]/20 hover:text-[#53e076] transition-all">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button onClick={() => setDeleteTarget(p)}
                              className="w-8 h-8 rounded-xl bg-[#2a2a2a] flex items-center justify-center hover:bg-[#93000a]/30 hover:text-[#ffb4ab] transition-all">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.length === 0 && (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined text-5xl text-[#e5e2e1]/20 mb-3 block">folder_open</span>
                  <p className="text-[#e5e2e1]/40 font-label text-xs uppercase tracking-widest">Belum ada project</p>
                  <button onClick={() => setEditProject('new')}
                    className="mt-4 text-[#53e076] font-label text-xs font-bold uppercase tracking-widest border-b border-[#53e076] pb-1 hover:text-[#72fe8f] transition-colors">
                    + Buat Project Pertama
                  </button>
                </div>
              )}
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {data.map(p => (
                <div key={p.id} className="bg-[#1c1b1b] rounded-2xl p-5 border border-[#3d4a3d]/10">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-headline font-bold text-sm text-[#e5e2e1] truncate">{p.title}</p>
                      <p className="text-[#e5e2e1]/30 font-label text-[10px] mt-0.5">{p.slug}</p>
                    </div>
                    <button onClick={() => handleToggle(p.id)}
                      className={`shrink-0 px-3 py-1 rounded-full font-label text-[10px] font-bold uppercase tracking-wider ${p.isPublished ? 'bg-[#1db954]/20 text-[#53e076]' : 'bg-[#353534] text-[#e5e2e1]/50'}`}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(p.techStack ?? []).slice(0, 4).map(t => (
                      <span key={t} className="bg-[#353534] text-[#72fe8f] font-label text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-[#3d4a3d]/10">
                    <button onClick={() => setEditProject(p)}
                      className="flex-1 py-2 rounded-xl bg-[#2a2a2a] text-[#e5e2e1]/70 font-label text-xs uppercase tracking-widest hover:bg-[#53e076]/20 hover:text-[#53e076] transition-all flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">edit</span> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(p)}
                      className="flex-1 py-2 rounded-xl bg-[#2a2a2a] text-[#e5e2e1]/70 font-label text-xs uppercase tracking-widest hover:bg-[#93000a]/20 hover:text-[#ffb4ab] transition-all flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">delete</span> Hapus
                    </button>
                  </div>
                </div>
              ))}
              {data.length === 0 && !loading && (
                <div className="text-center py-16 border border-dashed border-[#3d4a3d]/20 rounded-2xl">
                  <span className="material-symbols-outlined text-5xl text-[#e5e2e1]/20 mb-3 block">folder_open</span>
                  <p className="text-[#e5e2e1]/40 font-label text-xs uppercase tracking-widest">Belum ada project</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
