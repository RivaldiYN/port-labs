import { Link } from "react-router-dom"
import { useProfile } from "../hooks/useProfile"
import { usePosts } from "../hooks/usePosts"
import { useProjects } from "../hooks/useProjects"

export default function HomePage() {
  const { data: profile } = useProfile()
  const { data: latestPosts, loading: postsLoading } = usePosts({ limit: 3, sort: "newest" })
  const { data: featuredProjects, loading: projectsLoading } = useProjects({ limit: 4, featured: true })

  const heroName = profile?.name ?? "Rivaldi Yonathan Nainggolan"
  const heroTagline = profile?.tagline ?? "Full Stack Developer"
  const heroBio = profile?.bio ?? "Passionate developer crafting scalable, accessible, and engaging web products that feel alive. Specializing in modern tech stack with React, TypeScript, and thoughtful design."
  const contactEmail = profile?.email ?? "aldinggln9@gmail.com"
  const githubUrl = profile?.githubUrl ?? "https://github.com/RivaldiYN"
  const linkedinUrl = profile?.linkedinUrl ?? "https://linkedin.com/in/rivaldiyn"

  return (
    <div className="bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] text-[#0F172A] min-h-screen font-body">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] h-20 flex justify-between items-center px-6 md:px-8 shadow-sm">
        <Link to="/" className="text-xl font-bold gradient-text font-headline tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">RY</span>
          Rivaldi
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {[["Home", "/"], ["Projects", "/projects"], ["Articles", "/posts"]].map(([label, to]) => (
            <Link key={to} to={to} className="font-medium text-sm text-[#475569] hover:text-[#4F46E5] transition-colors duration-200">
              {label}
            </Link>
          ))}
        </div>
        <a href={`mailto:${contactEmail}`} className="btn-primary">
          Let's Connect
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 md:px-8 overflow-hidden">
        {/* Floating Blobs */}
        <div className="blob blob-primary w-96 h-96 -top-40 -left-40" />
        <div className="blob blob-secondary w-72 h-72 -bottom-20 -right-20" />
        <div className="blob blob-tertiary w-80 h-80 top-1/3 right-1/4" style={{ opacity: 0.3 }} />

        <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-slide-in-left" style={{ animationDelay: "0s" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0E7FF] border border-[#C7D2FE] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse-soft" aria-hidden="true" />
              <span className="text-sm font-semibold text-[#4F46E5] tracking-wide">Available for work</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-headline text-[#0F172A] leading-tight tracking-tight">
                Designing Digital Experiences That Feel Alive
              </h1>
              <p className="text-lg md:text-xl text-[#475569] leading-relaxed max-w-xl">
                {heroBio}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/projects" className="btn-primary">
                View Projects
              </Link>
              <a href={`mailto:${contactEmail}`} className="btn-secondary">
                Get In Touch
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-[#E2E8F0]">
              {[
                { value: "4+", label: "Years Building" },
                { value: "20+", label: "Projects Shipped" },
                { value: "3.45", label: "GPA Excellence" },
              ].map(({ value, label }) => (
                <div key={label} className="space-y-1">
                  <p className="text-2xl font-bold gradient-text">{value}</p>
                  <p className="text-xs font-medium text-[#64748B] uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative flex justify-center animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
              {/* Gradient Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-10 blur-3xl" />
              <div className="absolute -inset-4 rounded-full border border-[#4F46E5] opacity-20 animate-[spin_20s_linear_infinite]" />

              {/* Avatar */}
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={heroName}
                  className="relative z-10 w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="relative z-10 w-full h-full rounded-full shadow-2xl border-4 border-white bg-gradient-primary flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">{heroName[0]}</span>
                </div>
              )}

              {/* Floating Cards */}
              <div className="absolute top-0 -right-8 glass-card p-4 rounded-xl shadow-lg animate-float" style={{ animationDelay: "0s" }}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4F46E5] text-xl">code</span>
                  <span className="text-sm font-semibold text-[#0F172A]">React</span>
                </div>
              </div>
              <div className="absolute bottom-12 -left-8 glass-card p-4 rounded-xl shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#06B6D4] text-xl">check_circle</span>
                  <span className="text-sm font-semibold text-[#0F172A]">TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-[#0F172A]">
            Why Work With Me
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            I combine technical excellence with thoughtful design to create web experiences that matter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "rocket_launch",
              title: "Performance",
              description: "Fast, optimized applications that load in milliseconds.",
              color: "from-[#4F46E5] to-[#6366F1]",
            },
            {
              icon: "accessibility",
              title: "Accessible",
              description: "WCAG compliant interfaces for everyone.",
              color: "from-[#06B6D4] to-[#22D3EE]",
            },
            {
              icon: "device_hub",
              title: "Responsive",
              description: "Perfect on mobile, tablet, and desktop.",
              color: "from-[#22C55E] to-[#4ADE80]",
            },
            {
              icon: "build",
              title: "Modern Stack",
              description: "Latest technologies and best practices.",
              color: "from-[#F59E0B] to-[#FBBF24]",
            },
          ].map(({ icon, title, description, color }) => (
            <div key={title} className="card group">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-white text-xl" aria-hidden="true">
                  {icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2 font-headline">{title}</h3>
              <p className="text-sm text-[#64748B]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-[#0F172A]">
              Featured Work
            </h2>
            <p className="text-lg text-[#475569]">Handpicked projects showcasing modern development.</p>
          </div>
          <Link to="/projects" className="inline-flex items-center gap-2 text-[#4F46E5] hover:text-[#06B6D4] font-semibold transition-colors">
            View All
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>

        {projectsLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-[#4F46E5] border-t-transparent animate-spin" />
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link key={project.id} to="/projects" className="card group relative overflow-hidden">
                {project.thumbnailUrl && (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(project.techStack ?? []).slice(0, 2).map((tech) => (
                      <span key={tech} className="px-2 py-1 rounded text-xs font-semibold bg-[#E0E7FF] text-[#4F46E5]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors font-headline">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#64748B] line-clamp-2">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#64748B]">No featured projects yet.</div>
        )}
      </section>

      {/* Latest Articles */}
      <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-[#0F172A]">
              Latest Articles
            </h2>
            <p className="text-lg text-[#475569]">Technical insights and development thoughts.</p>
          </div>
          <Link to="/posts" className="inline-flex items-center gap-2 text-[#4F46E5] hover:text-[#06B6D4] font-semibold transition-colors">
            Read All
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>

        {postsLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-[#4F46E5] border-t-transparent animate-spin" />
          </div>
        ) : latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link key={post.id} to={`/news/${post.slug}`} className="card group">
                {post.coverUrl && (
                  <img
                    src={post.coverUrl}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    {(post.tags ?? []).slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded text-xs font-semibold bg-[#CFFAFE] text-[#06B6D4]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors font-headline">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#64748B] line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-[#94A3B8] pt-2 border-t border-[#E2E8F0]">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#64748B]">No articles published yet.</div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 md:px-8 max-w-4xl mx-auto text-center mb-12">
        <div className="blob blob-primary w-96 h-96 -top-40 -left-40" />
        <div className="blob blob-secondary w-72 h-72 -bottom-20 -right-20" />

        <div className="relative z-10 space-y-6 glass-card p-8 md:p-12 rounded-2xl">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-[#0F172A]">
            Ready to start something amazing?
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Let's collaborate and create digital experiences that make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`mailto:${contactEmail}`} className="btn-primary">
              Send Me an Email
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-12 px-6 md:px-8 gap-6">
          <p className="text-sm text-[#64748B]">
            © {new Date().getFullYear()} {heroName}. Crafted with ❤️ for the web.
          </p>
          <div className="flex gap-6">
            {[
              ["GitHub", githubUrl],
              ["LinkedIn", linkedinUrl],
              ["Email", `mailto:${contactEmail}`],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#64748B] hover:text-[#4F46E5] transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
