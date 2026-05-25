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
  { label: 'Total Projects', value: '3', icon: 'rocket_launch', progress: 60, color: 'bg-gradient-to-r from-[#D4A373] to-[#E6B849]' },
  { label: 'Total Posts', value: '2', icon: 'article', progress: 40, color: 'bg-gradient-to-r from-[#0891B2] to-[#06B6D4]' },
  { label: 'Published', value: '5', icon: 'check_circle', progress: 80, color: 'bg-gradient-to-r from-[#166534] to-[#15803D]' },
  { label: 'Drafts', value: '0', icon: 'pending', progress: 10, color: 'bg-gradient-to-r from-[#CA8A04] to-[#EAB308]' },
]

const ACTIVITY = [
  { name: 'Dashboard ML Monitoring', type: 'Project', status: 'Published', time: '2h ago', live: true },
  { name: 'HRIS PT Kimia Farma', type: 'Project', status: 'Published', time: '5h ago', live: true },
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
    <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FFFFFF] to-[#FAF8F3] text-[#1F2937] min-h-screen font-body flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white flex flex-col py-8 shadow-lg z-50 transition-transform duration-300 border-r border-[#E5E7EB] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>

        <div className="px-8 mb-10">
          <Link to="/" className="inline-flex items-center gap-2 font-headline font-bold text-lg text-[#1F2937] hover:text-[#D4A373] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A373] to-[#0891B2] flex items-center justify-center text-white text-sm font-bold">
              AC
            </div>
            <span>Admin</span>
          </Link>
          <p className="font-body uppercase tracking-wider text-[10px] text-[#9CA3AF] mt-2">CMS Portal</p>
        </div>

        <nav className="flex-1 space-y-1 pr-4 overflow-y-auto">
          {NAV_ITEMS.map(({ icon, label, path }) => {
            const active = path === '/cms'
            return (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-4 px-6 py-4 font-body font-semibold text-sm rounded-r-xl transition-all duration-200 hover:translate-x-1 ${
                  active
                    ? 'text-white bg-gradient-to-r from-[#D4A373] to-[#CA8A04] shadow-md'
                    : 'text-[#6B7280] hover:text-[#D4A373] hover:bg-[#FFF8F0]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="material-symbols-outlined text-xl" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User + actions */}
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
            className="flex items-center gap-3 text-[#DC2626] hover:text-[#991B1B] transition-all font-body font-semibold text-sm disabled:opacity-50 w-full"
            aria-label={loggingOut ? 'Logging out' : 'Logout'}
          >
            {loggingOut
              ? <span className="w-4 h-4 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
              : <span className="material-symbols-outlined text-lg">logout</span>
            }
            <span>{loggingOut ? 'Signing out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex-1 p-4 sm:p-6 md:p-8 xl:p-10">

        {/* Mobile top-bar */}
        <div className="lg:hidden flex items-center gap-4 mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-[#FFF8F0] transition-colors"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-headline font-bold text-[#1F2937] uppercase text-sm">Dashboard</span>
        </div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-[#1F2937] leading-none mb-3">
              Welcome Back<span className="text-[#D4A373]">.</span>
            </h1>
            <p className="text-[#6B7280] text-sm md:text-base font-body">
              Hey, <span className="text-[#D4A373] font-semibold">{admin?.username ?? 'Admin'}</span> — everything is running smoothly.
            </p>
          </div>
          <button className="bg-gradient-to-r from-[#D4A373] to-[#CA8A04] hover:shadow-lg text-white font-bold py-3 px-6 md:px-8 rounded-xl flex items-center gap-2 transition-all active:scale-95 group shrink-0 shadow-md">
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">add</span>
            <span className="font-body text-sm uppercase tracking-wider hidden sm:inline">Create New</span>
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {STATS.map(({ label, value, icon, progress, color }) => (
            <div key={label} className="bg-white p-5 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all group">
              <p className="font-body text-[11px] uppercase tracking-widest text-[#9CA3AF] mb-3 font-semibold">{label}</p>
              <div className="flex items-end justify-between mb-4">
                <span className="text-3xl md:text-4xl font-headline font-bold text-[#1F2937]">{value}</span>
                <span className={`material-symbols-outlined text-3xl text-transparent bg-gradient-to-r bg-clip-text ${color}`}>
                  {icon}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} />
              </div>
            </div>
          ))}
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">

          {/* Activity table */}
          <section className="xl:col-span-8 bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-6 md:px-8 py-6 border-b border-[#E5E7EB]">
              <h2 className="text-xl md:text-2xl font-headline font-bold text-[#1F2937]">Recent Activity</h2>
              <a href="#" className="text-[#D4A373] font-body text-xs uppercase tracking-widest font-semibold hover:text-[#CA8A04] transition-colors">
                View All →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[420px]">
                <thead>
                  <tr className="font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] border-b border-[#E5E7EB] bg-[#FAFAF9]">
                    <th className="pb-4 px-6">Item</th>
                    <th className="pb-4 px-4">Type</th>
                    <th className="pb-4 px-4">Status</th>
                    <th className="pb-4 px-6 text-right">Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVITY.map(({ name, type, status, time, live }) => (
                    <tr key={name} className="group hover:bg-[#FAFAF9] transition-colors border-b border-[#F3F4F6] last:border-b-0">
                      <td className="py-4 px-6 font-semibold text-[#1F2937] text-sm max-w-[180px] truncate">{name}</td>
                      <td className="py-4 px-4">
                        <span className="bg-[#FFF8F0] text-[#D4A373] px-3 py-1 rounded-full font-body text-[10px] uppercase tracking-widest font-semibold">
                          {type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`flex items-center gap-1.5 font-body text-[10px] uppercase tracking-widest font-semibold ${
                          live ? 'text-[#166534]' : 'text-[#9CA3AF]'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${live ? 'bg-[#166534] animate-pulse' : 'bg-[#D1D5DB]'}`} />
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-[#9CA3AF] font-body text-xs">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Side Widgets */}
          <section className="xl:col-span-4 space-y-6">
            {/* Storage Widget */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-[#D4A373]/10 to-[#0891B2]/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
              <h3 className="text-lg font-headline font-bold mb-5 text-[#1F2937] relative z-10">Cloud Storage</h3>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-body uppercase tracking-widest text-[#9CA3AF] font-semibold">32% Capacity</span>
                <span className="text-sm font-bold text-[#1F2937] font-headline">3.2 / 10 GB</span>
              </div>
              <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-gradient-to-r from-[#D4A373] to-[#CA8A04] rounded-full" style={{ width: '32%' }} />
              </div>
              <div className="mt-6 flex gap-3 relative z-10">
                <button className="flex-1 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] font-body text-xs uppercase tracking-widest font-bold py-2.5 rounded-lg transition-all">
                  Manage
                </button>
                <button className="flex-1 border border-[#D4A373] hover:bg-[#FFF8F0] text-[#D4A373] font-body text-xs uppercase tracking-widest font-bold py-2.5 rounded-lg transition-all">
                  Upgrade
                </button>
              </div>
            </div>

            {/* Server Health Widget */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0891B2] to-[#166534] rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">analytics</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937] text-sm font-headline">Server Health</h3>
                  <p className="text-xs font-body text-[#166534] uppercase tracking-widest font-semibold">Operational</p>
                </div>
              </div>
              <div className="space-y-4">
                {[['Response Time', '24ms'], ['Uptime', '99.98%'], ['Active Users', '1,024']].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center pb-4 border-b border-[#F3F4F6] last:border-b-0 last:pb-0">
                    <span className="text-sm text-[#6B7280] font-body">{k}</span>
                    <span className="font-body text-xs font-bold text-[#1F2937]">{ v}</span>
                  </div>
                ))}
              </div>
              {/* Mini bar chart */}
              <div className="mt-6 h-16 w-full flex items-end gap-1.5">
                {BAR_HEIGHTS.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md transition-all hover:brightness-110" style={{
                    height: `${h}%`,
                    background: i === 5 ? 'linear-gradient(135deg, #D4A373 0%, #0891B2 100%)' : `rgba(212, 163, 115, ${0.15 + h / 300})`
                  }} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
