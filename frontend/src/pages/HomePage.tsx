import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { usePosts } from '../hooks/usePosts'
import { useProjects } from '../hooks/useProjects'
import { useStats } from '../hooks/useStats'
import heroAvatar from '../assets/hero.png'

export default function HomePage() {
  const { data: profile } = useProfile()
  const { data: latestPosts, loading: postsLoading } = usePosts({ limit: 3, sort: 'newest' })
  const { data: featuredProjects, loading: projectsLoading } = useProjects({ limit: 4, featured: true })

  const heroName = profile?.name ?? 'Rivaldi Yonathan Nainggolan'
  const heroTagline = profile?.tagline ?? 'Full Stack Developer'
  const heroBio = profile?.bio ?? 'Passionate developer crafting scalable, accessible, and engaging web products that feel alive. Specializing in modern tech stack with React, TypeScript, and thoughtful design.'
  const contactEmail = profile?.email ?? 'aldinggln9@gmail.com'
  const githubUrl = profile?.githubUrl ?? 'https://github.com/RivaldiYN'
  const linkedinUrl = profile?.linkedinUrl ?? 'https://linkedin.com/in/rivaldiyn'

  // ── Auto-computed from DB ────────────────────────────────────────────────
  const { data: stats } = useStats()
  // Show '—' for years if no experience data yet; show count directly for projects
  const yearsLabel = stats
    ? stats.yearsExperience > 0 ? `${stats.yearsExperience}+` : '—'
    : '...'
  const projectsLabel = stats ? `${stats.totalProjects}` : '...'

  // ── GPA comes from CMS profile.stats (pipe-delimited "value|label") ──────
  const gpaEntry = (profile?.stats ?? []).find((s) => s.toLowerCase().includes('gpa'))
  const gpaValue = gpaEntry ? gpaEntry.split('|')[0] : '3.45'

  // ── Theme State ──────────────────────────────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('rpg-theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    localStorage.setItem('rpg-theme', isDarkMode ? 'dark' : 'light')
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const theme = isDarkMode ? {
    mode: 'dark',
    outerBg: 'bg-[#0f1118]/85 grayscale-[20%] brightness-[45%]',
    mainBg: 'bg-[#121620]',
    borderColor: 'border-[#C89B3C]',
    textColor: 'text-[#F5F3EF]',
    textColorMuted: 'text-[#9FA3AF]',
    bannerClass: 'rpg-banner-red-dark',
    boxClass: 'rpg-box-dark',
    btnClass: 'rpg-btn-gold-dark',
    dividerClass: 'rpg-pixel-divider-dark',
    scrollbarClass: 'rpg-scrollbar',
  } : {
    mode: 'light',
    outerBg: 'bg-[#f0e6cf]/40 sepia-[15%] brightness-[92%]',
    mainBg: 'bg-[#FAF6EE]',
    borderColor: 'border-[#7D5832]',
    textColor: 'text-[#2E2218]',
    textColorMuted: 'text-[#685547]',
    bannerClass: 'rpg-banner-red-light',
    boxClass: 'rpg-box-light',
    btnClass: 'rpg-btn-gold-light',
    dividerClass: 'rpg-pixel-divider-light',
    scrollbarClass: 'rpg-scrollbar-light',
  }

  return (
    <div className={`relative min-h-screen font-body overflow-x-hidden ${theme.textColor} transition-colors duration-250`}>
      {/* Fixed Immersive RPG Map Background */}
      <div 
        className={`fixed inset-0 -z-50 bg-[url('/src/assets/fantasy_map_bg.png')] bg-cover bg-center bg-no-repeat transition-all duration-300 ${theme.outerBg}`} 
      />

      {/* Main Game Wiki Frame */}
      <div className={`w-full max-w-[1300px] mx-auto min-h-screen ${theme.mainBg} border-x-4 ${theme.borderColor} shadow-2xl flex flex-col relative z-10`}>
        
        {/* RPG Style Top Header */}
        <header className={`sticky top-0 z-50 border-b-4 ${theme.borderColor} ${theme.mainBg} h-20 flex justify-between items-center px-4 md:px-6`}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className={`w-9 h-9 border-2 ${theme.borderColor} bg-red-800 flex items-center justify-center text-white font-press-start text-xs shadow-[2px_2px_0px_#000]`}>
              RY
            </span>
            <div className="flex flex-col">
              <span className="font-silkscreen text-xs uppercase tracking-widest text-amber-500 font-bold group-hover:text-amber-400 transition-colors">
                RIVALDI
              </span>
              <span className="font-silkscreen text-[9px] uppercase tracking-wider opacity-60">
                v1.2.0-alpha
              </span>
            </div>
          </Link>

          {/* Navigation Links inside Retro Boxes */}
          <nav className="hidden md:flex gap-4">
            {[
              ["Home", "/", "🏡"], 
              ["Projects", "/projects", "⚔️"], 
              ["Articles", "/posts", "📜"]
            ].map(([label, to, icon]) => (
              <Link 
                key={to} 
                to={to} 
                className={`font-silkscreen text-xs px-3 py-1.5 border border-transparent hover:border-amber-600 hover:bg-amber-600/10 flex items-center gap-1.5 transition-all ${
                  to === '/' ? 'text-amber-500 font-bold' : ''
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Action Area (Theme Switch & Email Connect) */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`${theme.btnClass} py-2 px-3 flex items-center gap-2`}
              title="Toggle Theme Mode"
            >
              <span>{isDarkMode ? '🌙' : '☀️'}</span>
              <span className="hidden sm:inline font-silkscreen text-[10px]">
                {isDarkMode ? 'DARK' : 'LIGHT'}
              </span>
            </button>

            <a 
              href={`mailto:${contactEmail}`} 
              className={`${theme.btnClass} py-2 px-4 font-silkscreen text-[10px] hidden sm:block`}
            >
              LET'S CONNECT
            </a>
          </div>
        </header>

        {/* Outer Split Pane Layout: Sidebar + Main Content */}
        <div className="flex-1 flex flex-col md:flex-row relative">
          
          {/* Left Navigation & Stats Sidebar */}
          <aside className={`hidden md:flex flex-col w-64 border-r-4 ${theme.borderColor} p-4 shrink-0 gap-6 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto ${theme.scrollbarClass} ${theme.mainBg}`}>
            
            {/* Section: Wiki Menu */}
            <div className="flex flex-col gap-2.5">
              <div className="text-[10px] font-silkscreen font-bold tracking-widest text-amber-500 mb-1">
                [ WIKI MENU ]
              </div>
              <Link to="/" className="p-2 font-silkscreen text-xs border border-amber-600/20 bg-amber-600/5 hover:bg-amber-600/10 flex items-center gap-2 transition-all">
                <span>🏡</span> Profile Home
              </Link>
              <Link to="/projects" className="p-2 font-silkscreen text-xs border border-transparent hover:border-amber-600/20 hover:bg-amber-600/5 flex items-center gap-2 transition-all">
                <span>⚔️</span> Projects Inventory
              </Link>
              <Link to="/posts" className="p-2 font-silkscreen text-xs border border-transparent hover:border-amber-600/20 hover:bg-amber-600/5 flex items-center gap-2 transition-all">
                <span>📜</span> Codex Chronicles
              </Link>
            </div>

            {/* Section: Shortcuts */}
            <div className="flex flex-col gap-2.5">
              <div className="text-[10px] font-silkscreen font-bold tracking-widest text-amber-500 mb-1">
                [ SHORTCUTS ]
              </div>
              <a href="#stats" className="p-2 font-silkscreen text-xs border border-transparent hover:border-amber-600/20 hover:bg-amber-600/5 flex items-center gap-2 transition-all">
                <span>📊</span> Core Attributes
              </a>
              <a href="#skills" className="p-2 font-silkscreen text-xs border border-transparent hover:border-amber-600/20 hover:bg-amber-600/5 flex items-center gap-2 transition-all">
                <span>🛡️</span> Special Passives
              </a>
              <a href="#projects" className="p-2 font-silkscreen text-xs border border-transparent hover:border-amber-600/20 hover:bg-amber-600/5 flex items-center gap-2 transition-all">
                <span>🏆</span> Legendary Artifacts
              </a>
              <a href="#articles" className="p-2 font-silkscreen text-xs border border-transparent hover:border-amber-600/20 hover:bg-amber-600/5 flex items-center gap-2 transition-all">
                <span>📖</span> Codex Insights
              </a>
            </div>

            {/* Section: External Guild Links */}
            <div className="flex flex-col gap-2.5 mt-auto pt-4 border-t-2 border-dashed border-amber-600/20">
              <div className="text-[10px] font-silkscreen font-bold tracking-widest text-amber-500 mb-1">
                [ GUILD WEB ]
              </div>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 font-silkscreen text-[11px] hover:text-amber-500 flex items-center gap-2"
              >
                <span>📦</span> GitHub
              </a>
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 font-silkscreen text-[11px] hover:text-amber-500 flex items-center gap-2"
              >
                <span>💼</span> LinkedIn
              </a>
            </div>
          </aside>

          {/* Main Scrollable Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-10">
            
            {/* Header Banner */}
            <div className={`${theme.bannerClass} py-3.5 px-4 flex justify-between items-center rounded-sm`}>
              <span className="font-silkscreen text-[10px] text-yellow-300 font-bold">SYSTEM: PORTFOLIO</span>
              <h1 className="font-silkscreen text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                CHARACTER SHEET
              </h1>
              <span className="font-silkscreen text-[10px] text-yellow-300 font-bold">LV. {stats?.totalProjects ?? '12'}</span>
            </div>

            {/* Section: Profile Info (Character Card + Story Scroll) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Profile Card (Left) */}
              <div className={`${theme.boxClass} p-5 lg:col-span-5 flex flex-col gap-4 rounded-sm`}>
                <div className="relative border-4 border-black/40 bg-black/10 overflow-hidden aspect-square flex items-center justify-center max-w-[240px] mx-auto w-full">
                  <img 
                    src={heroAvatar} 
                    alt="Rivaldi Yonathan Nainggolan" 
                    className="w-full h-full object-cover pixelated"
                    onError={(e) => {
                      // Fallback if avatar image fails
                      e.currentTarget.src = "https://placehold.co/240x240/252d3d/c89b3c?text=HERO+AVATAR"
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center">
                    <span className="font-silkscreen text-[9px] text-green-400 font-bold animate-pulse">
                      ● ONLINE AVAILABLE
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="font-silkscreen text-sm font-bold tracking-tight text-amber-500">
                    {heroName}
                  </h2>
                  <p className="font-silkscreen text-[10px] opacity-70 mt-1">
                    {heroTagline}
                  </p>
                </div>

                <div className={`border-t-2 border-dashed ${theme.borderColor} my-1`} />

                {/* RPG Attributes Grid */}
                <div id="stats" className="flex flex-col gap-2.5">
                  <div className="text-[10px] font-silkscreen font-bold text-amber-500 tracking-wider">
                    CORE ATTRIBUTES:
                  </div>
                  
                  {[
                    { shortcut: "EXP", attr: "Years Building", value: yearsLabel, desc: "Professional journey duration" },
                    { shortcut: "SHP", attr: "Projects Shipped", value: projectsLabel, desc: "Working software artifacts" },
                    { shortcut: "GPA", attr: "Academic GPA", value: gpaValue, desc: "GPA scale excellence" }
                  ].map(({ shortcut, attr, value, desc }) => (
                    <div key={attr} className="flex justify-between items-center bg-black/5 dark:bg-black/20 p-2 border border-black/10 hover:border-amber-600/40 group relative transition-all">
                      <div className="flex items-center gap-2">
                        <span className="font-silkscreen text-[10px] text-amber-500 font-bold bg-black/10 px-1 py-0.5 border border-black/20">
                          {shortcut}
                        </span>
                        <span className="font-silkscreen text-[10px] font-semibold">{attr}</span>
                      </div>
                      <span className="font-silkscreen text-xs font-bold text-amber-500">{value}</span>

                      {/* Info Tooltip on hover */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-[#121620] border border-amber-600 text-white font-silkscreen text-[9px] py-1 px-2 whitespace-nowrap z-30 shadow-md">
                        {desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Story Scroll / Quest Log (Right) */}
              <div className={`${theme.boxClass} p-6 lg:col-span-7 flex flex-col gap-5 rounded-sm`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <h3 className="font-silkscreen text-xs font-bold uppercase tracking-wider text-amber-500">
                    Quest Chronicle &amp; Bio
                  </h3>
                </div>

                <div className={`p-4 border-2 border-dashed ${theme.borderColor} bg-amber-600/5 leading-relaxed text-sm`}>
                  <p className="font-body">
                    {heroBio}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-2">
                  <Link 
                    to="/projects"
                    className={`${theme.btnClass} py-3 px-5 flex items-center gap-2`}
                  >
                    <span>⚔️</span>
                    <span className="font-silkscreen text-[10px]">VIEW PROJECTS</span>
                  </Link>
                  <a 
                    href={`mailto:${contactEmail}`}
                    className={`${theme.btnClass} py-3 px-5 flex items-center gap-2`}
                  >
                    <span>✉️</span>
                    <span className="font-silkscreen text-[10px]">SEND INQUIRY</span>
                  </a>
                </div>
              </div>
            </section>

            <div className={theme.dividerClass} />

            {/* Section: Special Passives (Why Work With Me) */}
            <section id="skills" className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <h2 className="font-silkscreen text-xs font-bold uppercase tracking-wider text-amber-500">
                  SPECIAL PASSIVE ABILITIES
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: '⚡', title: 'Overclocked Load', desc: 'Lightning-fast load times & lightweight bundle sizes' },
                  { icon: '♿', title: 'Universal Access', desc: 'WCAG 2.1 AA+ compliant & complete keyboard accessibility' },
                  { icon: '📱', title: 'Adaptive Frame', desc: 'Fluid retro layouts scaling smoothly to phone/desktop' },
                  { icon: '🛠️', title: 'Modern Arsenal', desc: 'React, TypeScript, Tailwind CSS, Vite & best practices' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className={`${theme.boxClass} p-4 flex flex-col gap-2.5 rounded-sm hover:scale-[1.02] transition-transform`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{icon}</span>
                      <h3 className="font-silkscreen text-[11px] font-bold text-amber-500 leading-tight">
                        {title}
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed opacity-80">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className={theme.dividerClass} />

            {/* Section: Featured Projects (Artifacts Loot) */}
            <section id="projects" className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <h2 className="font-silkscreen text-xs font-bold uppercase tracking-wider text-amber-500">
                    LEGENDARY ARTIFACTS
                  </h2>
                </div>
                <Link 
                  to="/projects" 
                  className="font-silkscreen text-[9px] hover:text-amber-500 border-b border-dashed border-amber-600/60 pb-0.5"
                >
                  VIEW ALL [⚔️]
                </Link>
              </div>

              {projectsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`${theme.boxClass} p-4 animate-pulse h-60 flex flex-col justify-between`}>
                      <div className="bg-black/20 h-28 rounded-sm" />
                      <div className="bg-black/20 h-4 w-3/4 rounded-sm" />
                      <div className="bg-black/20 h-3 w-1/2 rounded-sm" />
                    </div>
                  ))}
                </div>
              ) : featuredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {featuredProjects.slice(0, 3).map((project) => (
                    <Link 
                      key={project.id} 
                      to={`/projects/${project.slug}`}
                      className={`group ${theme.boxClass} p-4 flex flex-col gap-3 rounded-sm hover:-translate-y-1 hover:border-amber-500 transition-all`}
                    >
                      {project.thumbnailUrl && (
                        <div className="relative border-2 border-black/40 overflow-hidden h-36 bg-black/10">
                          <img 
                            src={project.thumbnailUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pixelated"
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-col">
                        <h3 className="font-silkscreen text-[11px] font-bold text-amber-500 group-hover:text-amber-400 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <span className="font-silkscreen text-[8px] text-purple-400 font-bold uppercase tracking-wider mt-0.5">
                          ✦ LEGENDARY ARTIFACT
                        </span>
                      </div>

                      <p className="text-xs opacity-75 line-clamp-2 leading-relaxed h-8">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-dashed border-amber-600/20">
                        {project.techStack?.slice(0, 2).map((tech) => (
                          <span 
                            key={tech} 
                            className="text-[9px] font-silkscreen bg-black/20 text-amber-500 px-2 py-0.5 border border-black/20 rounded-xs uppercase"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={`${theme.boxClass} p-12 text-center`}>
                  <p className="text-3xl mb-2">🚀</p>
                  <p className="font-silkscreen text-xs font-semibold text-amber-500">No legendary items slotted yet.</p>
                  <p className="text-[10px] opacity-70 mt-1">Check back soon for new quest logs!</p>
                </div>
              )}
            </section>

            <div className={theme.dividerClass} />

            {/* Section: Latest Articles (Codex Tomes) */}
            <section id="articles" className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h2 className="font-silkscreen text-xs font-bold uppercase tracking-wider text-amber-500">
                    CODEX &amp; CHRONICLES
                  </h2>
                </div>
                <Link 
                  to="/posts" 
                  className="font-silkscreen text-[9px] hover:text-amber-500 border-b border-dashed border-amber-600/60 pb-0.5"
                >
                  READ ALL [📜]
                </Link>
              </div>

              {postsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`${theme.boxClass} p-4 animate-pulse h-40`} />
                  ))}
                </div>
              ) : latestPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {latestPosts.slice(0, 3).map((post) => (
                    <Link 
                      key={post.id} 
                      to={`/posts/${post.slug}`}
                      className={`group ${theme.boxClass} p-5 flex flex-col gap-2 rounded-sm hover:-translate-y-1 hover:border-amber-500 transition-all`}
                    >
                      <span className="font-silkscreen text-[8px] text-green-500 font-bold">
                        {new Date(post.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      
                      <h3 className="font-silkscreen text-[11px] font-bold text-amber-500 group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>

                      <p className="text-xs opacity-75 line-clamp-3 leading-relaxed mt-1">
                        {post.excerpt}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-dashed border-amber-600/20">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span 
                              key={tag} 
                              className="text-[8px] font-silkscreen bg-black/10 text-green-400 px-1.5 py-0.5 border border-black/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={`${theme.boxClass} p-12 text-center`}>
                  <p className="text-3xl mb-2">✍️</p>
                  <p className="font-silkscreen text-xs font-semibold text-amber-500">Chronicle pages are empty.</p>
                  <p className="text-[10px] opacity-70 mt-1">Check back later for writings!</p>
                </div>
              )}
            </section>

            <div className={theme.dividerClass} />

            {/* Section: BOSS QUEST (CTA) */}
            <section id="contact" className={`${theme.boxClass} p-6 md:p-8 flex flex-col items-center text-center gap-5 rounded-sm relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-800/10 rotate-45 translate-x-12 -translate-y-12 border border-red-800/20 pointer-events-none" />
              
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl animate-bounce">⚔️</span>
                <span className="font-silkscreen text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">
                  [ ACTIVE BOSS QUEST ]
                </span>
                <h2 className="font-silkscreen text-sm md:text-base font-bold text-amber-500 uppercase tracking-wider">
                  COLLABORATE &amp; BUILD
                </h2>
              </div>

              <p className="text-xs max-w-lg leading-relaxed opacity-85">
                Initiate a contract quest to craft high-quality software, scalable systems, and fully responsive, premium user interfaces. Let's conquer the web!
              </p>

              {/* Quest Rewards */}
              <div className="border border-black/10 bg-black/5 dark:bg-black/20 p-4 max-w-md w-full flex flex-col gap-2 rounded-sm text-left">
                <div className="font-silkscreen text-[9px] text-amber-500 font-bold uppercase tracking-wider">
                  QUEST REWARDS:
                </div>
                <div className="flex items-center gap-2 font-silkscreen text-[9px] opacity-80">
                  <span className="text-green-500">✔</span> Premium React &amp; TypeScript Code
                </div>
                <div className="flex items-center gap-2 font-silkscreen text-[9px] opacity-80">
                  <span className="text-green-500">✔</span> Pixel-Perfect UI &amp; Rich Aesthetics
                </div>
                <div className="flex items-center gap-2 font-silkscreen text-[9px] opacity-80">
                  <span className="text-green-500">✔</span> Exceptional Performance &amp; Accessibility
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
                <a 
                  href={`mailto:${contactEmail}`}
                  className={`${theme.btnClass} py-3 px-8 text-xs font-silkscreen uppercase tracking-wider`}
                >
                  ACCEPT CONTRACT [✉️]
                </a>
                <a 
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${theme.btnClass} py-3 px-8 text-xs font-silkscreen uppercase tracking-wider`}
                >
                  VIEW GITHUB [📦]
                </a>
              </div>
            </section>

          </main>
        </div>

        {/* Footer info bar */}
        <footer className={`border-t-4 ${theme.borderColor} py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-3 ${theme.mainBg}`}>
          <span className="font-silkscreen text-[9px] opacity-60">
            © {new Date().getFullYear()} Rivaldi Yonathan Nainggolan. All Rights Reserved.
          </span>
          <span className="font-silkscreen text-[9px] text-amber-500 font-semibold">
            DESIGNED BY RIVALDI
          </span>
        </footer>

      </div>
    </div>
  )
}
