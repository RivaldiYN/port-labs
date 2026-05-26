import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCmsProjects, type Project } from '../../hooks/useProjects'
import { MediaPickerButton } from '../../components/MediaPickerButton'

// â �� ��â �� �� Form state â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��
const emptyForm = (): Partial<Project> => ({
  title: '', description: '', content: '', thumbnailUrl: '',
  demoUrl: '', repoUrl: '', techStack: [], isFeatured: false, isPublished: false,
})

// â �� ��â �� �� Modal: Create / Edit â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��
function ProjectModal({
  project, token, onClose, onSave, onSaveSuccess,
}: {
  project: Project | null
  token: string | null
  onClose: () => void
  onSave: (data: Partial<Project>) => Promise<void>
  onSaveSuccess: () => void
}) {
  const [form, setForm] = useState<Partial<Project>>(project ?? emptyForm())
  const [techInput, setTech] = useState((project?.techStack ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = (k: keyof Project, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      const techStack = techInput.split(',').map(s => s.trim()).filter(Boolean)
      await onSave({ ...form, techStack })
      // API call succeeded    let parent close modal and refresh
      onSaveSuccess()
    } catch (e) {
      setErr((e as Error).message)
      setSaving(false)
    }
    // Note: setSaving(false) intentionally NOT in finally
    // because onSaveSuccess() unmounts this component
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E5E7EB] shadow-xl">
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#E5E7EB]">
          <h2 className="font-headline text-xl font-bold text-[#1F2937]">
            {project ? 'Edit Project' : 'Buat Project Baru'}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-all">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {err && (
            <div className="flex items-center gap-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-[#DC2626] text-lg">error</span>
              <p className="text-[#DC2626] text-sm">{err}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2 block">
              Judul <span className="text-[#D4A373]">*</span>
            </label>
            <input required value={form.title ?? ''}
              onChange={e => set('title', e.target.value)}
              placeholder="Dashboard ML Monitoring"
              className="w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 px-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)] placeholder:text-[#9CA3AF]" />
          </div>

          {/* Description */}
          <div>
            <label className="font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2 block">Deskripsi</label>
            <textarea value={form.description ?? ''} rows={3}
              onChange={e => set('description', e.target.value)}
              placeholder="Deskripsi singkat project..."
              className="w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 px-4 text-[#e5e2e1] text-sm transition-all resize-none focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]" />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2 block">
              Tech Stack <span className="text-[#9CA3AF]">(pisahkan dengan koma)</span>
            </label>
            <input value={techInput}
              onChange={e => setTech(e.target.value)}
              placeholder="ReactJS, TypeScript, TailwindCSS"
              className="w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 px-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)] placeholder:text-[#9CA3AF]" />
          </div>

          {/* URLs row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2 block">Demo URL</label>
              <input type="url" value={form.demoUrl ?? ''}
                onChange={e => set('demoUrl', e.target.value)}
                placeholder="https://..."
                className="w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 px-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)] placeholder:text-[#9CA3AF]" />
            </div>
            <div>
              <label className="font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2 block">Repo URL</label>
              <input type="url" value={form.repoUrl ?? ''}
                onChange={e => set('repoUrl', e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 px-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)] placeholder:text-[#9CA3AF]" />
            </div>
          </div>

          {/* Thumbnail URL + Media Picker */}
          <div>
            <label className="font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2 block">Thumbnail</label>
            <div className="flex gap-2">
              <input type="url" value={form.thumbnailUrl ?? ''}
                onChange={e => set('thumbnailUrl', e.target.value)}
                placeholder="https://... atau pilih dari media library"
                className="w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 px-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)] placeholder:text-[#9CA3AF]" />
              <MediaPickerButton token={token} onPick={url => set('thumbnailUrl', url)} />
            </div>
            {form.thumbnailUrl && form.thumbnailUrl.startsWith('http') && (
              <img
                src={form.thumbnailUrl}
                alt="Thumbnail preview"
                className="mt-2 w-full h-32 object-cover rounded-xl border border-[#3d4a3d]/20"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            {[
              { key: 'isFeatured' as const, label: 'Featured' },
              { key: 'isPublished' as const, label: 'Published' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div onClick={() => set(key, !form[key])}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${form[key] ? 'bg-[#D4A373]' : 'bg-[#D1D5DB]'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${form[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="font-body text-xs uppercase tracking-widest text-[#6B7280] group-hover:text-[#1F2937] transition-colors font-semibold">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#F3F4F6] transition-all">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#CA8A04] text-white font-body font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {saving ? 'Menyimpan...' : project ? 'Simpan Perubahan' : 'Buat Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// â �� ��â �� �� Confirm Delete Modal â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��
function ConfirmModal({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full border border-[#FECACA] shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] flex items-center justify-center mb-5 mx-auto">
          <span className="material-symbols-outlined text-[#DC2626] text-3xl">delete</span>
        </div>
        <h3 className="font-headline text-lg font-bold text-center text-[#1F2937] mb-2">Hapus Project?</h3>
        <p className="text-[#e5e2e1]/50 text-sm text-center mb-6 font-body">
          "<span className="text-[#1F2937]">{title}</span>" akan dihapus permanen dan tidak dapat dikembalikan.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#F3F4F6] transition-all">
            Batal
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[#DC2626] text-white font-body font-bold text-xs uppercase tracking-widest hover:bg-[#991B1B] transition-all">
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

// â �� ��â �� �� Main CMS Projects Page â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��â �� ��
export default function CmsProjectsPage() {
  const { admin, logout, accessToken } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [editProject, setEditProject] = useState<Project | null | 'new'>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [toast, setToast] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  const { data, loading, error, fetchAll, createProject, updateProject, deleteProject, togglePublish } =
    useCmsProjects()

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    fetchAll(search)
  }, [search, fetchAll])

  // onSave: ONLY does the API call    no fetchAll here.
  // fetchAll is triggered by handleModalClose AFTER the modal unmounts,
  // preventing the race condition: fetchAll setState + setEditProject(null) conflicting mid-render.
  const handleSave = async (formData: Partial<Project>) => {
    if (editProject === 'new') {
      await createProject(formData)
    } else if (editProject) {
      await updateProject(editProject.id, formData)
    }
    // fetchAll intentionally NOT called here
  }

  // Called when modal closes (cancel OR successful save)
  const handleModalClose = async (saved = false) => {
    setEditProject(null)          // unmount modal first
    if (saved) {
      await fetchAll(search)      // THEN refresh data
      showToast(' �� Project berhasil disimpan')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteProject(deleteTarget.id)
    setDeleteTarget(null)
    showToast('ðŸ   ��ï � � Project berhasil dihapus')
    await fetchAll(search)
  }

  const handleToggle = async (id: string) => {
    await togglePublish(id)
    showToast('ðŸ �� � Status publikasi diubah')
    await fetchAll(search)
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
    <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FFFFFF] to-[#FAF8F3] text-[#1F2937] font-body min-h-screen flex">
      {/* Modals */}
      {editProject !== null && (
        <ProjectModal
          project={editProject === 'new' ? null : editProject}
          token={accessToken}
          onClose={() => handleModalClose(false)}
          onSave={handleSave}
          onSaveSuccess={() => handleModalClose(true)}
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#F0FDF4] border border-[#BBF7D0] px-6 py-3 rounded-full font-body font-semibold text-sm text-[#166534] shadow-lg animate-slide-up">
          {toast}
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white flex flex-col py-8 shadow-lg border-r border-[#E5E7EB] z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-8 mb-10">
          <Link to="/" className="inline-flex items-center gap-2 font-headline font-bold text-lg text-[#1F2937] hover:text-[#D4A373] transition-colors"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A373] to-[#0891B2] flex items-center justify-center text-white text-sm font-bold">AC</div><span>Admin</span></Link>
          <p className="font-body uppercase tracking-wider text-[10px] text-[#9CA3AF] mt-2">CMS Portal</p>
        </div>
        <nav className="flex-1 space-y-1 pr-4 overflow-y-auto">
          {NAV.map(({ icon, label, path, active }) => (
            <Link key={label} to={path}
              className={`flex items-center gap-4 px-8 py-4 font-label uppercase tracking-widest text-xs rounded-r-full transition-all duration-200 hover:translate-x-1 ${active ? 'text-white bg-gradient-to-r from-[#D4A373] to-[#CA8A04] shadow-md' : 'text-[#6B7280] hover:text-[#D4A373] hover:bg-[#FFF8F0]'}`}>
              <span className="material-symbols-outlined text-xl" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-8 mt-auto space-y-4 pt-8 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#166534] flex items-center justify-center shrink-0">
              <span className="font-bold text-white text-sm">{admin?.username?.[0]?.toUpperCase() ?? 'A'}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1F2937] truncate">{admin?.username ?? 'Admin'}</p>
              <p className="text-[10px] text-[#9CA3AF] font-body tracking-wider uppercase">SUPER USER</p>
            </div>
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            className="flex items-center gap-3 text-[#DC2626] hover:text-[#991B1B] transition-all font-body font-semibold text-sm disabled:opacity-50 w-full cursor-pointer">
            {loggingOut ? <span className="w-4 h-4 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-sm">logout</span>}
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 min-h-screen flex-1 p-6 md:p-10 xl:p-12">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-4 mb-8">
          <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-[#FFF8F0] transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-headline font-bold text-[#1F2937] uppercase text-sm">Projects</span>
        </div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-[#1F2937] leading-none mb-2">
              Projects<span className="text-[#D4A373]">.</span>
            </h1>
            <p className="text-[#6B7280] text-sm mt-1">Manage all projects, published & drafts</p>
          </div>
          <button onClick={() => setEditProject('new')}
            className="bg-gradient-to-r from-[#D4A373] to-[#CA8A04] hover:brightness-110 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-md group shrink-0">
            <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform duration-300">add</span>
            <span className="font-label text-xs uppercase tracking-widest">New Project</span>
          </button>
        </header>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-md group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-[#D4A373] transition-colors text-xl">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari project..."
              className="w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 pl-12 pr-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)]" />
          </div>
          <button type="submit" className="px-5 py-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D4A373] text-[#6B7280] hover:text-[#D4A373] font-body text-xs uppercase tracking-widest font-semibold transition-all">
            Cari
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); fetchAll('') }}
              className="px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#9CA3AF] hover:text-[#1F2937] transition-all">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#D4A373] border-t-transparent animate-spin" />
            <p className="font-body text-sm text-[#9CA3AF] uppercase tracking-widest">Memuat...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-[#DC2626]/40 mb-3 block">error</span>
            <p className="text-[#DC2626] font-body text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left px-6 py-5 font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Project</th>
                      <th className="text-left px-4 py-5 font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Tech Stack</th>
                      <th className="text-center px-4 py-5 font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Featured</th>
                      <th className="text-center px-4 py-5 font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Status</th>
                      <th className="text-right px-6 py-5 font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {data.map(p => (
                      <tr key={p.id} className="group hover:bg-[#FAFAF9] transition-colors border-b border-[#F3F4F6] last:border-b-0">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-sm text-[#1F2937] max-w-xs truncate">{p.title}</p>
                          <p className="text-[#9CA3AF] font-body text-[10px] mt-0.5">{p.slug}</p>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(p.techStack ?? []).slice(0, 3).map(t => (
                              <span key={t} className="bg-[#FFF8F0] text-[#D4A373] font-body text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{t}</span>
                            ))}
                            {(p.techStack?.length ?? 0) > 3 && (
                              <span className="text-[#9CA3AF] font-body text-[9px]">+{(p.techStack?.length ?? 0) - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className={`material-symbols-outlined text-lg ${p.isFeatured ? 'text-[#D4A373]' : 'text-[#D1D5DB]'}`}>
                            {p.isFeatured ? 'star' : 'star_border'}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <button onClick={() => handleToggle(p.id)}
                            title={p.isPublished ? 'Klik untuk jadikan Draft' : 'Klik untuk Publish'}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 ${p.isPublished ? 'bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0]' : 'bg-[#F3F4F6] text-[#9CA3AF] hover:bg-[#E5E7EB]'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.isPublished ? 'bg-[#166534] animate-pulse' : 'bg-[#D1D5DB]'}`} />
                            {p.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setEditProject(p)}
                              className="w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#D4A373]/20 hover:text-[#D4A373] transition-all">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button onClick={() => setDeleteTarget(p)}
                              className="w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all">
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
                  <span className="material-symbols-outlined text-5xl text-[#D1D5DB] mb-3 block">folder_open</span>
                  <p className="text-[#9CA3AF] font-body text-xs uppercase tracking-widest font-semibold">Belum ada project</p>
                  <button onClick={() => setEditProject('new')}
                    className="mt-4 text-[#D4A373] font-body text-xs font-bold uppercase tracking-widest border-b border-[#D4A373] pb-1 hover:text-[#CA8A04] transition-colors">
                    + Buat Project Pertama
                  </button>
                </div>
              )}
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {data.map(p => (
                <div key={p.id} className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1F2937] truncate">{p.title}</p>
                      <p className="text-[#9CA3AF] font-body text-[10px] mt-0.5">{p.slug}</p>
                    </div>
                    <button onClick={() => handleToggle(p.id)}
                      className={`shrink-0 px-3 py-1 rounded-full font-body text-[10px] font-bold uppercase tracking-wider<!--l text-[10px] font-bold uppercase tracking-wider ${p.isPublished ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(p.techStack ?? []).slice(0, 4).map(t => (
                      <span key={t} className="bg-[#FFF8F0] text-[#D4A373] font-body text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-[#E5E7EB]">
                    <button onClick={() => setEditProject(p)}
                      className="flex-1 py-2 rounded-xl bg-[#F3F4F6] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#D4A373]/20 hover:text-[#D4A373] transition-all flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">edit</span> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(p)}
                      className="flex-1 py-2 rounded-xl bg-[#F3F4F6] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">delete</span> Hapus
                    </button>
                  </div>
                </div>
              ))}
              {data.length === 0 && !loading && (
                <div className="text-center py-16 border border-dashed border-[#E5E7EB] rounded-xl">
                  <span className="material-symbols-outlined text-5xl text-[#D1D5DB] mb-3 block">folder_open</span>
                  <p className="text-[#9CA3AF] font-body text-xs uppercase tracking-widest font-semibold">Belum ada project</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

