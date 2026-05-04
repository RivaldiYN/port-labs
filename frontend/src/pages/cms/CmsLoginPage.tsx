import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function CmsLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/cms'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    setLoading(false)

    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.message)
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute w-96 h-96 rounded-full bg-[#1db954]/8 blur-[100px] -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-[#1c5329]/10 blur-[100px] bottom-0 -right-20 pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#53e076 1px, transparent 1px), linear-gradient(to right, #53e076 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Card */}
      <div className={`relative z-10 w-full max-w-md transition-all duration-300 ${shake ? 'translate-x-2' : ''}`}
        style={{ animation: shake ? 'shake 0.5s ease-in-out' : undefined }}>

        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/">
            <span className="font-headline text-3xl font-black tracking-tighter text-[#e5e2e1]">
              Rivaldi<span className="text-[#1DB954]">.</span>
            </span>
          </Link>
          <p className="font-label text-xs uppercase tracking-[0.3em] text-[#e5e2e1]/40 mt-3">CMS Admin Console</p>
        </div>

        {/* Login box */}
        <div className="bg-[#1c1b1b] rounded-3xl p-8 md:p-10 border border-[#3d4a3d]/20 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tighter text-[#e5e2e1] mb-2">
              Selamat Datang<span className="text-[#1DB954]">.</span>
            </h1>
            <p className="text-[#bccbb9] text-sm font-body">Masuk ke panel admin Antigravity Portfolio</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-[#93000a]/20 border border-[#ffb4ab]/20 rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-[#ffb4ab] text-xl shrink-0">error</span>
              <p className="text-[#ffb4ab] text-sm font-label">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="cms-username" className="font-label text-xs uppercase tracking-widest text-[#e5e2e1]/60">
                Username
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e5e2e1]/30 group-focus-within:text-[#1db954] transition-colors text-xl pointer-events-none">
                  person
                </span>
                <input
                  id="cms-username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="admin"
                  className="w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3.5 pl-12 pr-4 text-[#e5e2e1] placeholder:text-[#e5e2e1]/20 font-body text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="cms-password" className="font-label text-xs uppercase tracking-widest text-[#e5e2e1]/60">
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e5e2e1]/30 group-focus-within:text-[#1db954] transition-colors text-xl pointer-events-none">
                  lock
                </span>
                <input
                  id="cms-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder=" €¢ €¢ €¢ €¢ €¢ €¢ €¢ €¢"
                  className="w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3.5 pl-12 pr-12 text-[#e5e2e1] placeholder:text-[#e5e2e1]/20 font-body text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e5e2e1]/30 hover:text-[#e5e2e1] transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient-btn text-[#002108] py-4 rounded-xl font-label font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_25px_rgba(83,224,118,0.35)] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-[#002108] border-t-transparent animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">login</span>
                  Masuk ke CMS
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-[#3d4a3d]/20 flex items-center justify-between">
            <Link to="/" className="text-[#e5e2e1]/40 hover:text-[#1db954] transition-colors font-label text-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Kembali ke Portfolio
            </Link>
            <span className="font-label text-[10px] text-[#e5e2e1]/20 uppercase tracking-widest">v1.0.0</span>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center mt-6 font-label text-[10px] text-[#e5e2e1]/20 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-sm">shield</span>
          Dilindungi JWT + Bcrypt  · Max 5 login/menit
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
