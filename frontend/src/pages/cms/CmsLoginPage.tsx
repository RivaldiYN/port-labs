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
    <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-[#FFFFFF] to-[#F3F4F6] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Soft Background Blobs */}
      <div className="absolute w-96 h-96 rounded-full bg-[#5B7DDD]/8 blur-[100px] -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-[#3CB9D4]/8 blur-[100px] bottom-0 -right-20 pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-[#4CB582]/6 blur-[100px] top-1/3 right-1/4 pointer-events-none" />

      {/* Card */}
      <div className={`relative z-10 w-full max-w-sm transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
        {/* Logo & Header */}
        <div className="text-center mb-8 md:mb-12">
          <Link to="/" className="inline-block mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
              RY
            </div>
          </Link>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-[#1F2937] mb-2">
            Admin Panel
          </h1>
          <p className="font-body text-sm text-[#6B7280]">Secure access to portfolio management</p>
        </div>

        {/* Login Card */}
        <div className="card mb-6 relative z-20">
          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-[#FEE8E8] border border-[#FED7D7] rounded-lg px-4 py-3" role="alert">
              <span className="material-symbols-outlined text-[#D4494D] text-xl shrink-0 mt-0.5">error</span>
              <p className="text-[#B42624] text-sm font-body">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="cms-username" className="block font-body text-sm font-semibold text-[#1F2937]">
                Username
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-[#5B7DDD] transition-colors text-xl pointer-events-none">
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
                  className="w-full bg-white border border-[#E5E7EB] focus:border-[#5B7DDD] focus:outline-none focus:ring-2 focus:ring-[#5B7DDD]/10 rounded-lg py-3 pl-12 pr-4 text-[#1F2937] placeholder:text-[#D1D5DB] font-body text-sm transition-all"
                  aria-label="Username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="cms-password" className="block font-body text-sm font-semibold text-[#1F2937]">
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-[#5B7DDD] transition-colors text-xl pointer-events-none">
                  lock
                </span>
                <input
                  id="cms-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E5E7EB] focus:border-[#5B7DDD] focus:outline-none focus:ring-2 focus:ring-[#5B7DDD]/10 rounded-lg py-3 pl-12 pr-12 text-[#1F2937] placeholder:text-[#D1D5DB] font-body text-sm transition-all"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5B7DDD] transition-colors p-1"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
            <Link to="/" className="text-[#9CA3AF] hover:text-[#5B7DDD] transition-colors font-body text-xs flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Portfolio
            </Link>
            <span className="font-body text-[10px] text-[#D1D5DB] uppercase tracking-wider">v1.0.0</span>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center font-body text-[11px] text-[#9CA3AF] uppercase tracking-wider flex items-center justify-center gap-1.5 px-4">
          <span className="material-symbols-outlined text-sm">shield</span>
          Protected with JWT + Bcrypt · Max 5 attempts/min
        </p>
      </div>
    </div>
  )
}
