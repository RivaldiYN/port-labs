import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', path: '/cms' },
  { icon: 'person', label: 'Profile', path: '/cms/profile' },
  { icon: 'rocket_launch', label: 'Projects', path: '/cms/projects' },
  { icon: 'edit_note', label: 'Posts', path: '/cms/posts' },
  { icon: 'perm_media', label: 'Media', path: '/cms/media' },
]

const STATS = [
  { label: 'Total Projects', value: '3', icon: 'rocket_launch', progress: 60 },
  { label: 'Total Posts', value: '2', icon: 'article', progress: 40 },
  { label: 'Published', value: '5', icon: 'check_circle', progress: 80 },
  { label: 'Drafts', value: '0', icon: 'pending', progress: 10, secondary: true },
]

const ACTIVITY = [
  { name: 'Dashboard ML Monitoring', type: 'Project', status: 'Published', time: '2h ago', live: true },
  { name: 'HRIS    PT Kimia Farma', type: 'Project', status: 'Published', time: '5h ago', live: true },
  { name: 'Antigravity Portfolio', type: 'Project', status: 'Published', time: '1d ago', live: true },
  { name: 'Kenapa Saya Memilih Elysia.js', type: 'Post', status: 'Published', time: '4d ago', live: true },
  { name: 'Membangun WCAG 2.1 AA Compliant Site', type: 'Post', status: 'Draft', time: '5d ago', live: false },
]

const BAR_HEIGHTS = [50, 65, 80, 52, 75, 100, 68, 55]

export default function CmsDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/cms/login', { replace: true })
  }

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen font-body flex">

      {/*  ”€ ”€ Mobile overlay  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/*  ”€ ”€ Sidebar  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-[#1c1b1b] flex flex-col py-8
        shadow-[20px_0_40px_rgba(0,0,0,0.4)] z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        <div className="px-8 mb-10">
          <Link to="/" className="text-base font-black text-[#1DB954] font-headline uppercase tracking-widest">
            Admin Console
          </Link>
          <p className="font-label uppercase tracking-widest text-[10px] text-[#e5e2e1]/50 mt-1">
            Antigravity CMS
          </p>
        </div>

        <nav className="flex-1 space-y-1 pr-4 overflow-y-auto">
          {NAV_ITEMS.map(({ icon, label, path }) => {
            const active = path === '/cms'
            return (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-4 px-8 py-4 font-label uppercase tracking-widest text-xs
                  rounded-r-full transition-all duration-200 hover:translate-x-1
                  ${active
                    ? 'text-[#1DB954] bg-[#1DB954]/10 border-r-4 border-[#1DB954]'
                    : 'text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-[#2a2a2a]'}`}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User + actions */}
        <div className="px-8 mt-auto space-y-4 pt-8 border-t border-[#3d4a3d]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#3d4a3d]/40 flex items-center justify-center shrink-0">
              <span className="font-headline font-black text-[#53e076] text-sm">
                {admin?.username?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#e5e2e1] truncate">{admin?.username ?? 'Admin'}</p>
              <p className="text-[10px] text-[#e5e2e1]/40 font-label tracking-widest truncate">SUPER USER</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-4 text-[#ffb4ab]/70 hover:text-[#ffb4ab] transition-all font-label uppercase tracking-widest text-xs disabled:opacity-50 w-full"
          >
            {loggingOut
              ? <span className="w-4 h-4 border border-[#ffb4ab] border-t-transparent rounded-full animate-spin" />
              : <span className="material-symbols-outlined text-sm">logout</span>
            }
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/*  ”€ ”€ Main  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ */}
      <main className="lg:ml-64 min-h-screen flex-1 bg-[#131313] p-6 md:p-10 xl:p-12">

        {/* Mobile top-bar */}
        <div className="lg:hidden flex items-center gap-4 mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-[#1c1b1b] flex items-center justify-center border border-[#3d4a3d]/20"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-headline font-bold text-[#1DB954] tracking-widest text-sm uppercase">
            Admin Console
          </span>
        </div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-14 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-headline font-extrabold tracking-tighter text-[#e5e2e1] leading-none mb-2">
              Overview<span className="text-[#53e076]">.</span>
            </h2>
            <p className="text-[#e5e2e1]/60 text-sm md:text-base">
              Halo, <span className="text-[#53e076] font-semibold">{admin?.username ?? '  '}</span>    sistem aktif dan sinkronisasi berjalan.
            </p>
          </div>
          <button className="bg-[#53e076] hover:bg-[#1db954] text-[#002108] font-bold py-3 px-6 md:py-4 md:px-8
            rounded-full flex items-center gap-3 shadow-[0_10px_30px_rgba(83,224,118,0.2)]
            transition-all active:scale-95 group shrink-0">
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">add</span>
            <span className="font-label tracking-wide text-xs uppercase">Create New</span>
          </button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-14">
          {STATS.map(({ label, value, icon, progress, secondary }) => (
            <div key={label}
              className="bg-[#1c1b1b] p-5 md:p-8 rounded-2xl group hover:bg-[#2a2a2a] transition-all duration-500">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#e5e2e1]/40 mb-2">{label}</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl md:text-4xl font-headline font-bold text-[#e5e2e1]">{value}</span>
                <span className={`material-symbols-outlined text-3xl md:text-4xl transition-colors
                  ${secondary ? 'text-[#99d59d]/40 group-hover:text-[#99d59d]' : 'text-[#53e076]/40 group-hover:text-[#53e076]'}`}>
                  {icon}
                </span>
              </div>
              <div className="mt-4 w-full h-1 bg-[#353534] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${secondary ? 'bg-[#99d59d]' : 'bg-[#53e076]'}`}
                  style={{ width: `${progress}%` }} />
              </div>
            </div>
          ))}
        </section>

        {/* Bento */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">

          {/* Activity table */}
          <section className="xl:col-span-8 bg-[#1c1b1b] rounded-3xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl md:text-2xl font-headline font-bold text-[#e5e2e1]">Recent Activity</h3>
              <a href="#" className="text-[#53e076] font-label text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                View All
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[420px]">
                <thead>
                  <tr className="font-label text-[10px] uppercase tracking-[0.2em] text-[#e5e2e1]/30 border-b border-[#3d4a3d]/10">
                    <th className="pb-4 px-2">Item</th>
                    <th className="pb-4 px-2">Type</th>
                    <th className="pb-4 px-2">Status</th>
                    <th className="pb-4 px-2 text-right">Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVITY.map(({ name, type, status, time, live }) => (
                    <tr key={name} className="group hover:bg-[#2a2a2a]/60 transition-colors">
                      <td className="py-4 px-2 font-semibold text-[#e5e2e1] text-sm max-w-[180px] truncate">{name}</td>
                      <td className="py-4 px-2">
                        <span className="bg-[#353534] px-2.5 py-1 rounded-full font-label text-[10px] uppercase tracking-widest text-[#e5e2e1]/70">
                          {type}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest
                          ${live ? 'text-[#53e076]' : 'text-[#99d59d]'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-[#53e076] animate-pulse' : 'bg-[#99d59d]'}`} />
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right text-[#e5e2e1]/40 font-label text-xs">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Side widgets */}
          <section className="xl:col-span-4 space-y-6">
            {/* Storage */}
            <div className="bg-[#2a2a2a] rounded-3xl p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#53e076]/10 rounded-full blur-3xl group-hover:bg-[#53e076]/20 transition-all duration-700" />
              <h3 className="text-lg font-headline font-bold mb-5 text-[#e5e2e1]">Cloud Storage</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-label uppercase tracking-widest text-[#e5e2e1]/50">32% Capacity</span>
                <span className="text-sm font-bold text-[#e5e2e1]">3.2 / 10 GB</span>
              </div>
              <div className="w-full h-2.5 bg-[#0e0e0e] rounded-full overflow-hidden">
                <div className="h-full bg-[#53e076] rounded-full" style={{ width: '32%' }} />
              </div>
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-[#353534] hover:bg-[#393939] text-[#e5e2e1] font-label text-[10px] uppercase tracking-widest py-2.5 rounded-full transition-all">
                  Clean
                </button>
                <button className="flex-1 border border-[#3d4a3d]/30 hover:border-[#53e076]/50 text-[#e5e2e1] font-label text-[10px] uppercase tracking-widest py-2.5 rounded-full transition-all">
                  Upgrade
                </button>
              </div>
            </div>

            {/* Server health */}
            <div className="bg-[#1c1b1b] rounded-3xl p-6 md:p-8 border border-[#3d4a3d]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#99d59d]/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#99d59d] text-xl">analytics</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#e5e2e1] text-sm">Server Health</h3>
                  <p className="text-[10px] font-label text-[#53e076] uppercase tracking-widest">Operational</p>
                </div>
              </div>
              <div className="space-y-3.5">
                {[['Response Time', '24ms'], ['Uptime', '99.98%'], ['Active Users', '1,024']].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center">
                    <span className="text-sm text-[#e5e2e1]/50">{k}</span>
                    <span className="font-label text-xs font-bold text-[#e5e2e1]">{v}</span>
                  </div>
                ))}
              </div>
              {/* Mini bar chart */}
              <div className="mt-6 h-16 w-full flex items-end gap-1">
                {BAR_HEIGHTS.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm"
                    style={{ height: `${h}%`, background: i === 5 ? '#53e076' : `rgba(83,224,118,${0.15 + h / 300})` }} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
