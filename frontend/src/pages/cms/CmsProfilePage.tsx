import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCmsProfile } from '../../hooks/useProfile'

const NAV = [
  { icon: 'dashboard', label: 'Dashboard', path: '/cms' },
  { icon: 'person', label: 'Profile', path: '/cms/profile', active: true },
  { icon: 'rocket_launch', label: 'Projects', path: '/cms/projects' },
  { icon: 'edit_note', label: 'Posts', path: '/cms/posts' },
  { icon: 'perm_media', label: 'Media', path: '/cms/media' },
]

interface FormState {
  name: string
  tagline: string
  bio: string
  email: string
  githubUrl: string
  linkedinUrl: string
  location: string
  resumeUrl: string
}

export default function CmsProfilePage() {
  const { admin, logout, accessToken } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: profile, loading, error, fetchProfile, updateProfile, uploadAvatar } =
    useCmsProfile(accessToken)

  const [form, setForm] = useState<FormState>({
    name: '',
    tagline: '',
    bio: '',
    email: '',
    githubUrl: '',
    linkedinUrl: '',
    location: '',
    resumeUrl: '',
  })

  // Sync form with fetched profile once
  const [synced, setSynced] = useState(false)
  if (profile && !synced) {
    setForm({
      name: profile.name ?? '',
      tagline: profile.tagline ?? '',
      bio: profile.bio ?? '',
      email: profile.email ?? '',
      githubUrl: profile.githubUrl ?? '',
      linkedinUrl: profile.linkedinUrl ?? '',
      location: profile.location ?? '',
      resumeUrl: profile.resumeUrl ?? '',
    })
    setSynced(true)
  }

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/cms/login', { replace: true })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: Record<string, string | null> = {}
      for (const [k, v] of Object.entries(form)) {
        payload[k] = v.trim() === '' ? null : v.trim()
      }
      await updateProfile(payload)
      showToast('✅ Profil berhasil disimpan')
    } catch (err) {
      showToast(`❌ ${(err as Error).message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('❌ File harus berupa gambar', 'error')
      return
    }
    const preview = URL.createObjectURL(file)
    setAvatarPreview(preview)
    setUploading(true)
    try {
      await uploadAvatar(file)
      showToast('✅ Avatar berhasil diupload')
    } catch (err) {
      showToast(`❌ ${(err as Error).message}`, 'error')
      setAvatarPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const avatarSrc = avatarPreview ?? profile?.avatarUrl ?? null
  const initials = (form.name || admin?.username || 'A').charAt(0).toUpperCase()

  const inputCls = `w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373]
    focus:outline-none rounded-xl py-3 px-4 text-[#1F2937] text-sm transition-all
    focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)] placeholder:text-[#9CA3AF]`

  return (
    <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FFFFFF] to-[#FAF8F3] text-[#1F2937] min-h-screen font-body flex">

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full
            font-body font-semibold text-sm shadow-lg animate-slide-up border
            ${toast.type === 'error'
              ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
              : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'}`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Mobile overlay ────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        aria-label="Sidebar navigasi CMS"
        className={`fixed left-0 top-0 h-screen w-64 bg-white flex flex-col py-8
          shadow-lg z-50 transition-transform duration-300 border-r border-[#E5E7EB]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="px-8 mb-10">
          <Link to="/" className="inline-flex items-center gap-2 font-headline font-bold text-lg text-[#1F2937] hover:text-[#D4A373] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A373] to-[#0891B2] flex items-center justify-center text-white text-sm font-bold">
              AC
            </div>
            <span>Admin</span>
          </Link>
          <p className="font-body uppercase tracking-wider text-[10px] text-[#9CA3AF] mt-2">CMS Portal</p>
        </div>

        <nav className="flex-1 space-y-1 pr-4 overflow-y-auto" aria-label="Menu utama">
          {NAV.map(({ icon, label, path, active }) => (
            <Link
              key={label}
              to={path}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-4 px-6 py-4 font-body font-semibold text-sm
                rounded-r-xl transition-all duration-200 hover:translate-x-1
                ${active
                  ? 'text-white bg-gradient-to-r from-[#D4A373] to-[#CA8A04] shadow-md'
                  : 'text-[#6B7280] hover:text-[#D4A373] hover:bg-[#FFF8F0]'}`}
            >
              <span
                className="material-symbols-outlined text-xl"
                aria-hidden="true"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-6 mt-auto space-y-4 pt-6 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#166534] flex items-center justify-center shrink-0 text-white font-bold text-sm">
              {admin?.username?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1F2937] truncate">{admin?.username ?? 'Admin'}</p>
              <p className="text-[10px] text-[#9CA3AF] font-body tracking-wider uppercase truncate">SUPER USER</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Logout dari CMS"
            className="flex items-center gap-3 text-[#DC2626] hover:text-[#991B1B]
              transition-all font-body font-semibold text-sm
              disabled:opacity-50 w-full cursor-pointer focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-[#DC2626] rounded"
          >
            {loggingOut
              ? <span className="w-4 h-4 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              : <span className="material-symbols-outlined text-lg" aria-hidden="true">logout</span>}
            <span>{loggingOut ? 'Signing out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <main className="lg:ml-64 min-h-screen flex-1 p-4 sm:p-6 md:p-8 xl:p-10">

        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-4 mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu navigasi"
            className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center
              hover:bg-[#FFF8F0] transition-colors focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-[#D4A373]"
          >
            <span className="material-symbols-outlined" aria-hidden="true">menu</span>
          </button>
          <span className="font-headline font-bold text-[#1F2937] uppercase text-sm">Profile</span>
        </div>

        {/* Header */}
        <header className="mb-10">
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-[#1F2937] leading-none mb-2">
            Profile<span className="text-[#D4A373]">.</span>
          </h1>
          <p className="text-[#6B7280] text-sm">
            Kelola informasi profil publik portofoliomu
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3" role="status" aria-label="Memuat data profil">
            <div className="w-8 h-8 rounded-full border-2 border-[#D4A373] border-t-transparent animate-spin" aria-hidden="true" />
            <p className="font-body text-sm text-[#9CA3AF] uppercase tracking-widest">Memuat...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div role="alert" className="flex items-center gap-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-6 py-4 mb-8">
            <span className="material-symbols-outlined text-[#DC2626]" aria-hidden="true">error</span>
            <p className="text-[#DC2626] text-sm">{error}</p>
            <button
              onClick={fetchProfile}
              className="ml-auto font-body text-xs uppercase tracking-widest text-[#DC2626] hover:text-[#991B1B] transition-colors font-semibold"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSave} noValidate>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">

              {/* ── Left: Avatar card ─────────────────────────────── */}
              <section
                aria-label="Foto profil"
                className="xl:col-span-4 bg-white rounded-xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center"
              >
                {/* Avatar drop zone */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Klik atau drag-and-drop untuk upload foto profil"
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
                  className={`relative w-32 h-32 rounded-full cursor-pointer group transition-all duration-300
                    ${dragOver ? 'ring-4 ring-[#D4A373] ring-offset-4 ring-offset-white' : ''}`}
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Foto profil"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D4A373]/20 to-[#0891B2]/20 border-2 border-dashed border-[#D4A373]/40 flex items-center justify-center">
                      <span className="font-headline font-black text-4xl text-[#D4A373]" aria-hidden="true">
                        {initials}
                      </span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploading
                      ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      : <span className="material-symbols-outlined text-white text-2xl" aria-hidden="true">photo_camera</span>}
                  </div>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  aria-label="Pilih file gambar avatar"
                  onChange={handleFileChange}
                />

                <p className="mt-4 font-headline font-bold text-lg text-[#1F2937]">
                  {form.name || 'Nama belum diisi'}
                </p>
                <p className="text-[#6B7280] text-sm mt-1">
                  {form.tagline || 'Tagline belum diisi'}
                </p>

                <div className="mt-6 w-full pt-6 border-t border-[#E5E7EB] space-y-3 text-left">
                  {[
                    { icon: 'location_on', val: form.location, label: 'Lokasi' },
                    { icon: 'mail', val: form.email, label: 'Email' },
                    { icon: 'code', val: form.githubUrl, label: 'GitHub' },
                    { icon: 'work', val: form.linkedinUrl, label: 'LinkedIn' },
                  ].map(({ icon, val, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#D4A373] text-base shrink-0" aria-hidden="true">{icon}</span>
                      <span className="text-xs text-[#6B7280] truncate" title={val || undefined}>
                        {val || <span className="italic text-[#9CA3AF]">{label} belum diisi</span>}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-[10px] text-[#9CA3AF] font-body leading-relaxed">
                  Klik avatar atau drag &amp; drop gambar.<br />Maks 5MB · JPEG, PNG, WebP
                </p>

                {profile?.updatedAt && (
                  <p className="mt-3 text-[10px] text-[#9CA3AF] font-body">
                    Diupdate: {new Date(profile.updatedAt).toLocaleString('id-ID')}
                  </p>
                )}
              </section>

              {/* ── Right: Form fields ────────────────────────────── */}
              <section
                aria-label="Form edit profil"
                className="xl:col-span-8 bg-white rounded-xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm"
              >
                <h2 className="font-headline text-lg font-bold text-[#1F2937] mb-6">
                  Informasi Dasar
                </h2>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="profile-name" className="font-body text-[11px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2 block">
                      Nama Lengkap <span className="text-[#D4A373]" aria-label="wajib diisi">*</span>
                    </label>
                    <input
                      id="profile-name"
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Rivaldi Yonathan Nainggolan"
                      maxLength={100}
                      autoComplete="name"
                      className={inputCls}
                    />
                  </div>

                  {/* Tagline */}
                  <div>
                    <label htmlFor="profile-tagline" className="font-body text-[11px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2 block">
                      Tagline
                    </label>
                    <input
                      id="profile-tagline"
                      type="text"
                      value={form.tagline}
                      onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                      placeholder="Full-Stack Developer · UI/UX Enthusiast"
                      className={inputCls}
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="profile-bio" className="font-body text-[11px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2 block">
                      Bio
                    </label>
                    <textarea
                      id="profile-bio"
                      rows={5}
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder="Ceritakan sedikit tentang dirimu..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Email + Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="profile-email" className="font-body text-[11px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2 block">
                        Email
                      </label>
                      <input
                        id="profile-email"
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="hello@example.com"
                        autoComplete="email"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-location" className="font-body text-[11px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2 block">
                        Lokasi
                      </label>
                      <input
                        id="profile-location"
                        type="text"
                        value={form.location}
                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="Jakarta, Indonesia"
                        maxLength={100}
                        autoComplete="address-level2"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-headline text-sm font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#D4A373]" aria-hidden="true">link</span>
                      Tautan &amp; Sosial
                    </h3>
                    <div className="space-y-4">
                      {/* GitHub */}
                      <div>
                        <label htmlFor="profile-github" className="font-body text-[11px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2 block">
                          GitHub URL
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base" aria-hidden="true">code</span>
                          <input
                            id="profile-github"
                            type="url"
                            value={form.githubUrl}
                            onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
                            placeholder="https://github.com/username"
                            className={`${inputCls} pl-11`}
                          />
                        </div>
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <label htmlFor="profile-linkedin" className="font-body text-[11px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2 block">
                          LinkedIn URL
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base" aria-hidden="true">work</span>
                          <input
                            id="profile-linkedin"
                            type="url"
                            value={form.linkedinUrl}
                            onChange={e => setForm(f => ({ ...f, linkedinUrl: e.target.value }))}
                            placeholder="https://linkedin.com/in/username"
                            className={`${inputCls} pl-11`}
                          />
                        </div>
                      </div>

                      {/* Resume */}
                      <div>
                        <label htmlFor="profile-resume" className="font-body text-[11px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2 block">
                          Resume URL
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base" aria-hidden="true">description</span>
                          <input
                            id="profile-resume"
                            type="url"
                            value={form.resumeUrl}
                            onChange={e => setForm(f => ({ ...f, resumeUrl: e.target.value }))}
                            placeholder="https://drive.google.com/..."
                            className={`${inputCls} pl-11`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[#E5E7EB]">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-[#D4A373] to-[#CA8A04] hover:brightness-110
                        text-white font-bold py-3 px-8 rounded-full flex items-center gap-2
                        transition-all active:scale-95 shadow-md
                        disabled:opacity-60 focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-[#D4A373] focus-visible:ring-offset-2"
                    >
                      {saving
                        ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                        : <span className="material-symbols-outlined text-base" aria-hidden="true">save</span>}
                      <span className="font-body text-sm font-semibold uppercase tracking-widest cursor-pointer">
                        {saving ? 'Menyimpan...' : 'Simpan Profil'}
                      </span>
                    </button>
                    <p className="text-[11px] text-[#9CA3AF] font-body">
                      Perubahan langsung terlihat di halaman publik
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
