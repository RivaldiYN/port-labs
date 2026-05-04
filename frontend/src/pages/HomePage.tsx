import { Link } from "react-router-dom"
import { useProfile } from "../hooks/useProfile"
import { usePosts } from "../hooks/usePosts"
import { useProjects } from "../hooks/useProjects"

export default function HomePage() {
  const { data: profile } = useProfile()
  const { data: latestPosts, loading: postsLoading } = usePosts({ limit: 3, sort: "newest" })
  const { data: featuredProjects, loading: projectsLoading } = useProjects({ limit: 4, featured: true })

  const heroName = profile?.name ?? "Rivaldi Yonathan Nainggolan"
  const heroInitials = heroName.split(" ").map((n: string) => n[0]).slice(0, 3).join("").toUpperCase()
  const heroTagline = profile?.tagline ?? "Full Stack Developer"
  const heroBio = profile?.bio ?? "Passionate developer from ITERA (GPA 3.45) crafting digital experiences where logic meets artistry. Navigating the kinetic void of modern web architecture with precision and purpose."
  const contactEmail = profile?.email ?? "aldinggln9@gmail.com"
  const githubUrl = profile?.githubUrl ?? "https://github.com/RivaldiYN"
  const linkedinUrl = profile?.linkedinUrl ?? "https://linkedin.com/in/rivaldiyn"

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl shadow-2xl shadow-black/40 h-20 flex justify-between items-center px-6 md:px-8">
        <div className="text-xl font-bold text-[#e5e2e1] font-headline tracking-tighter">Rivaldi<span className="text-[#1DB954]">.</span></div>
        <div className="hidden md:flex gap-8 items-center">
          {([["/", " Home", true], ["/projects", "Projects", false], ["/posts", "Notes", false]] as [string, string, boolean][]).map(([to, label, active]) => (
            <Link key={to} to={to} aria-current={active ? "page" : undefined} className={`font-headline tracking-tighter text-sm transition-all duration-300 px-2 py-1 rounded ${active ? "text-[#1DB954] font-bold border-b-2 border-[#1DB954]" : "text-[#e5e2e1]/70 hover:text-[#e5e2e1] hover:bg-[#1DB954]/10"}`}>{label}</Link>
          ))}
        </div>
        <a href={`mailto:${contactEmail}`} className="primary-gradient-btn text-[#002108] px-5 py-2 rounded-full font-label font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(83,224,118,0.4)] transition-all active:scale-95">Hire Me</a>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 md:px-8 overflow-hidden noise-bg">
        <div className="orb w-72 h-72 md:w-96 md:h-96 bg-[#53e076]/10 -top-20 -left-20" />
        <div className="orb w-[400px] h-[400px] bg-[#1c5329]/10 bottom-0 -right-40" />
        <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <div data-aos="fade-down" className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#1db954]/10 border border-[#1db954]/20">
              <span className="w-2 h-2 rounded-full bg-[#1db954] animate-pulse" aria-hidden="true" />
              <span className="font-label text-xs tracking-widest text-[#1db954] uppercase">Available for work</span>
            </div>
            <h1 data-aos="fade-up" data-aos-delay="200" className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[#e5e2e1] mb-6 leading-none">Building the{" "}<span className="text-[#53e076] italic">Impossible</span></h1>
            <div data-aos="fade-up" data-aos-delay="300" className="flex items-center justify-center md:justify-start gap-4 mb-6"><div className="h-[2px] w-10 bg-[#1db954]" /><p className="font-label text-lg text-[#1db954] font-medium tracking-tight">{heroTagline}</p></div>
            <p data-aos="fade-up" data-aos-delay="400" className="text-[#bccbb9] text-base md:text-lg max-w-xl mb-8 leading-relaxed font-body mx-auto md:mx-0">{heroBio}</p>
            <div data-aos="fade-up" data-aos-delay="500" className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/projects" className="primary-gradient-btn text-[#002108] px-7 py-4 rounded-full font-label font-bold tracking-widest uppercase text-sm hover:shadow-[0_0_20px_rgba(83,224,118,0.4)] transition-all active:scale-95">Explore My Work</Link>
              <a href={`mailto:${contactEmail}`} className="bg-[#2a2a2a]/40 border border-[#3d4a3d]/30 backdrop-blur-md text-[#e5e2e1] px-7 py-4 rounded-full font-label font-bold tracking-widest uppercase text-sm hover:bg-[#2a2a2a] transition-all">Get In Touch</a>
            </div>
          </div>
          <div className="flex-1 relative flex justify-center" data-aos="zoom-in" data-aos-delay="400">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full bg-[#53e076]/20 animate-pulse blur-2xl" />
              <div className="absolute -inset-4 rounded-full border border-[#53e076]/20 animate-spin-slow" />
              {profile?.avatarUrl
                ? <img src={profile.avatarUrl} alt={heroName} className="relative z-10 w-full h-full rounded-full object-cover shadow-2xl shadow-black/60 border-4 border-[#2a2a2a]" />
                : <div className="relative z-10 w-full h-full rounded-full shadow-2xl shadow-black/60 border-4 border-[#2a2a2a] bg-gradient-to-br from-[#1db954]/30 via-[#1c1b1b] to-[#131313] flex items-center justify-center"><div className="text-center"><div className="text-5xl md:text-7xl font-headline font-black text-[#53e076] tracking-tighter leading-none">{heroInitials}</div><div className="text-xs font-label text-[#bccbb9]/60 tracking-widest mt-2">{profile?.location ?? "ITERA  · 3.45"}</div></div></div>
              }
              <div className="absolute top-0 -right-4 bg-[#2a2a2a] p-3 rounded-xl shadow-xl glass-card animate-float"><span className="material-symbols-outlined text-[#53e076] text-2xl" aria-hidden="true">terminal</span></div>
              <div className="absolute bottom-8 -left-8 bg-[#2a2a2a] p-3 rounded-xl shadow-xl glass-card animate-float" style={{ animationDelay: "1.5s" }}><span className="material-symbols-outlined text-[#53e076] text-2xl" aria-hidden="true">deployed_code</span></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40" data-aos="fade-in" data-aos-delay="1000"><span className="font-label text-[10px] tracking-widest uppercase">Scroll</span><div className="w-px h-8 bg-gradient-to-b from-[#e5e2e1] to-transparent" /></div>
      </section>

      <section className="py-20 px-6 md:px-8 relative" aria-label="Statistik">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[{ value: "4+", label: "Years Experience" }, { value: "8+", label: "High-End Projects" }, { value: "3.45", label: "GPA Excellence" }].map(({ value, label }, idx) => (
            <div key={label} data-aos="fade-up" data-aos-delay={idx * 150} className="bg-[#1c1b1b] p-10 md:p-12 rounded-3xl flex flex-col items-center text-center shadow-2xl transition-transform hover:-translate-y-2 group">
              <span className="font-headline text-4xl md:text-5xl font-extrabold text-[#53e076] mb-2 group-hover:scale-110 transition-transform">{value}</span>
              <span className="font-label text-[10px] uppercase tracking-widest text-[#bccbb9]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto" aria-label="Featured Projects">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div data-aos="fade-right"><h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-3 text-[#e5e2e1]">Curated <span className="text-[#1db954]">Orbits</span></h2><p className="text-[#bccbb9] font-body text-base max-w-md">A selection of technical explorations and architectural achievements.</p></div>
          <div data-aos="fade-left"><Link to="/projects" className="font-label text-[#53e076] hover:text-[#72fe8f] transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold">View All Lab Work <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_outward</span></Link></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {projectsLoading ? (
            <div className="md:col-span-12 py-12 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#1db954] border-t-transparent animate-spin" /></div>
          ) : featuredProjects.length > 0 ? (
            featuredProjects.map((project, index) => {
              const isWide = index % 4 === 0 || index % 4 === 3
              const spanClass = isWide ? "md:col-span-8 aspect-video md:aspect-auto md:h-80" : "md:col-span-4 min-h-[280px]"
              const icon = isWide ? "monitoring" : "deployed_code"

              return (
                <Link data-aos="fade-up" data-aos-delay={index * 150} key={project.id} to="/projects" className={`${spanClass} group relative overflow-hidden rounded-[2rem] bg-[#1c1b1b] block`}>
                  {project.thumbnailUrl ? (
                    <img src={project.thumbnailUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all duration-700 group-hover:scale-105" onError={e => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-br ${isWide ? 'from-[#1db954]/20' : 'from-[#1c5329]/30'} to-transparent`} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <span className="material-symbols-outlined text-[#53e076]" style={{ fontSize: isWide ? "200px" : "180px" }} aria-hidden="true">{icon}</span>
                      </div>
                    </>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/${project.thumbnailUrl ? '80' : 'transparent'} to-transparent z-10 transition-opacity duration-500`} />
                  <div className={`absolute bottom-0 left-0 p-8 ${isWide ? 'md:p-10' : ''} z-20 w-full`}>
                    <div className="flex gap-2 mb-3">
                      {(project.techStack ?? []).slice(0, 3).map(t => (
                        <span key={t} className="bg-[#353534]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-label uppercase tracking-widest text-[#72fe8f] border border-[#72fe8f]/10 shadow-lg">{t}</span>
                      ))}
                    </div>
                    <h3 className={`font-headline ${isWide ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} font-bold mb-2 text-[#e5e2e1] group-hover:text-[#53e076] transition-colors`}>{project.title}</h3>
                    {project.description && (
                      <p className="text-[#bccbb9] font-body text-sm max-w-md line-clamp-2">{project.description}</p>
                    )}
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="md:col-span-12 py-10 text-center text-[#e5e2e1]/30 font-label tracking-widest text-xs uppercase">Tidak ada project unggulan</div>
          )}
        </div>
      </section>

      <section className="py-28 px-6 md:px-8 max-w-4xl mx-auto" aria-label="Experience Timeline">
        <div data-aos="fade-right" className="mb-16"><h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-3 text-[#e5e2e1]">Journey</h2><div className="h-1 w-16 bg-[#53e076] rounded-full" /></div>
        <div className="space-y-12 md:space-y-16 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#3d4a3d]/40">
          {[{ period: "2025    2026", role: "Frontend Developer", company: "PT Technova Solusi Integrasi", desc: "Developing ReactJS monitoring dashboard with OpenStreetMap & ML integration.", active: true }, { period: "2025    2026", role: "Full Stack Developer Intern", company: "PT Kimia Farma Tbk", desc: "Built internal HRIS using Laravel + PostgreSQL + Redis caching.", active: false }, { period: "2021    Present", role: "Bachelor of Informatics", company: "ITERA    Institut Teknologi Sumatera", desc: "GPA 3.45. Specialized in distributed systems and human-computer interaction.", active: false, icon: "school" }].map(({ period, role, company, desc, active, icon }, idx) => (
            <div key={role} data-aos="fade-up" data-aos-delay={idx * 150} className="relative pl-14">
              <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center z-10 ${active ? "bg-[#2a2a2a] border-2 border-[#53e076]" : "bg-[#2a2a2a] border-2 border-[#3d4a3d]"}`}><span className={`material-symbols-outlined text-xl ${active ? "text-[#53e076]" : "text-[#bccbb9]"}`} aria-hidden="true">{icon || "work"}</span></div>
              <span className={`font-label text-xs font-bold tracking-widest uppercase mb-1 block ${active ? "text-[#53e076]" : "text-[#bccbb9]"}`}>{period}</span>
              <h3 className="font-headline text-xl md:text-2xl font-bold mb-1 text-[#e5e2e1]">{role}</h3>
              <p className="text-[#bccbb9] font-label text-xs uppercase tracking-wider mb-3">{company}</p>
              <p className="text-[#bccbb9] font-body leading-relaxed text-sm max-w-2xl">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-8 max-w-6xl mx-auto" aria-label="Latest posts">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div data-aos="fade-right"><h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-[#e5e2e1]">Latest <span className="text-[#1db954]">Notes</span></h2><p className="text-[#bccbb9] text-sm mt-2">Technical writing &amp; thought experiments from the orbit.</p></div>
          <div data-aos="fade-left"><Link to="/posts" className="font-label text-[#53e076] text-sm uppercase tracking-widest font-bold flex items-center gap-2 hover:text-[#72fe8f] transition-colors">All Posts <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_outward</span></Link></div>
        </div>
        {postsLoading ? (
          <div className="flex justify-center py-12" role="status" aria-label="Memuat posts"><div className="w-8 h-8 border-2 border-[#53e076] border-t-transparent rounded-full animate-spin" aria-hidden="true" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post, idx) => (
              <Link key={post.id} data-aos="fade-up" data-aos-delay={idx * 150} to={`/news/${post.slug}`} className="group bg-[#1c1b1b] rounded-3xl p-6 border border-[#3d4a3d]/10 hover:border-[#53e076]/30 transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076]">
                <div className="flex flex-wrap gap-2 mb-4">{(post.tags ?? []).slice(0, 2).map(t => <span key={t} className="bg-[#353534] text-[#72fe8f] font-label text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{t}</span>)}</div>
                <h3 className="font-headline font-bold text-[#e5e2e1] text-lg leading-tight mb-3 group-hover:text-[#53e076] transition-colors">{post.title}</h3>
                <p className="text-[#bccbb9] text-sm leading-relaxed line-clamp-3">{post.excerpt ?? ""}</p>
                <p className="text-[#e5e2e1]/30 font-label text-[10px] uppercase tracking-widest mt-4">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" }) : ""}</p>
              </Link>
            ))}
            {!postsLoading && latestPosts.length === 0 && <p className="text-[#e5e2e1]/30 col-span-3 text-center py-8 font-label text-sm">Belum ada post yang dipublikasikan.</p>}
          </div>
        )}
      </section>

      <footer className="w-full py-12 border-t border-[#e5e2e1]/10 bg-[#131313]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <p className="font-label text-sm text-[#e5e2e1]/40"> © {new Date().getFullYear()} Rivaldi Yonathan Nainggolan. Built for the orbit.</p>
          <div className="flex gap-8">{[[" LinkedIn", linkedinUrl], ["GitHub", githubUrl], ["Email", `mailto:${contactEmail}`]].map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[#e5e2e1]/40 hover:text-[#1DB954] transition-colors font-label text-sm">{label}</a>)}</div>
        </div>
      </footer>
    </div>
  )
}
