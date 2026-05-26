import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  thumbnailUrl: string | null
  demoUrl: string | null
  repoUrl: string | null
  techStack: string[] | null
  isFeatured: boolean
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)
    fetch(`${API}/api/projects/${slug}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setProject(json.data)
        } else {
          setError(json.message ?? 'Project tidak ditemukan')
        }
      })
      .catch(() => setError('Gagal memuat detail project'))
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] text-[#0F172A] min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] h-20 flex justify-between items-center px-6 md:px-8 shadow-sm">
        <Link to="/" className="text-xl font-bold gradient-text font-headline tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">RY</span>
          Rivaldi
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {[["Home", "/"], ["Projects", "/projects"], ["Articles", "/posts"]].map(([label, to]) => (
            <Link key={to} to={to} className={`font-medium text-sm transition-colors duration-200 ${
              to === '/projects' ? 'text-[#4F46E5] font-bold' : 'text-[#475569] hover:text-[#4F46E5]'
            }`}>
              {label}
            </Link>
          ))}
        </div>
        <a href="mailto:aldinggln9@gmail.com" className="btn-primary">
          Let's Connect
        </a>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" role="status">
            <div className="w-12 h-12 rounded-full border-2 border-[#4F46E5] border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-[#94A3B8] uppercase tracking-widest">Loading details...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
            <span className="material-symbols-outlined text-6xl text-[#FF6B6B] opacity-60">search_off</span>
            <h1 className="font-headline text-2xl font-bold text-[#0F172A]">Project Tidak Ditemukan</h1>
            <p className="text-[#64748B] max-w-md">{error}</p>
            <Link to="/projects" className="btn-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Kembali ke Projects
            </Link>
          </div>
        )}

        {project && !loading && (
          <article className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16 relative">
            {/* Ambient glows */}
            <div className="blob blob-primary w-96 h-96 -top-20 -right-20" style={{ opacity: 0.15 }} />
            <div className="blob blob-secondary w-96 h-96 top-1/2 -left-20" style={{ opacity: 0.15 }} />

            {/* Back Button */}
            <Link to="/projects" className="inline-flex items-center gap-2 text-[#4F46E5] hover:text-[#06B6D4] font-medium text-sm mb-8 transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Projects
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
              {/* Left Column: Hero & Media & Content */}
              <div className="lg:col-span-8 space-y-8">
                {/* Header Info */}
                <header className="space-y-4">
                  {project.isFeatured && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F7ED] text-[#166534] text-xs font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#166534]" />
                      Featured Project
                    </span>
                  )}
                  <h1 className="text-4xl sm:text-5xl font-headline font-bold text-[#0F172A] tracking-tight">
                    {project.title}
                  </h1>
                  <p className="text-[#475569] text-lg font-body leading-relaxed max-w-3xl">
                    {project.description}
                  </p>
                </header>

                {/* Cover Image */}
                <div className="h-64 sm:h-[400px] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#E0E7FF] to-[#CFFAFE] border border-[#E2E8F0]">
                  {project.thumbnailUrl ? (
                    <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#4F46E5]/10" style={{ fontSize: '120px' }}>
                        rocket_launch
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Details Content */}
                {project.content ? (
                  <section className="prose max-w-none prose-slate pt-6 border-t border-[#E2E8F0]">
                    <h2 className="font-headline text-2xl font-bold text-[#0F172A] mb-4">Project Overview</h2>
                    <div style={{ whiteSpace: 'pre-wrap' }} className="text-[#334155] leading-relaxed text-base font-body">
                      {project.content}
                    </div>
                  </section>
                ) : (
                  <section className="pt-6 border-t border-[#E2E8F0] text-center py-12 text-[#94A3B8]">
                    <p className="text-sm">Tidak ada detail konten tambahan untuk project ini.</p>
                  </section>
                )}
              </div>

              {/* Right Column: Meta Info & Actions */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 h-fit">
                {/* Meta details card */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-headline text-sm font-bold text-[#0F172A] mb-3 uppercase tracking-wider">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map(tech => (
                        <span key={tech} className="px-3 py-1.5 rounded-lg bg-[#E0E7FF] text-[#4F46E5] font-bold text-xs uppercase tracking-wider">
                          {tech}
                        </span>
                      )) ?? <span className="text-xs text-[#94A3B8]">—</span>}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E2E8F0] space-y-4">
                    {project.publishedAt && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#64748B]">Published</span>
                        <span className="font-semibold text-[#0F172A]">
                          {new Date(project.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-[#E2E8F0] flex flex-col gap-3">
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center justify-center gap-2 text-center py-3.5">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        <span>Visit Live Site</span>
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center justify-center gap-2 text-center py-3.5">
                        <span className="material-symbols-outlined text-sm">code</span>
                        <span>View Source Code</span>
                      </a>
                    )}
                    {!project.demoUrl && !project.repoUrl && (
                      <div className="text-center py-4 text-[#94A3B8] text-xs font-body">
                        Internal or proprietary project (no public link).
                      </div>
                    )}
                  </div>
                </div>

                {/* Hire CTA */}
                <div className="bg-gradient-to-br from-[#D4A373]/10 to-[#0891B2]/10 border border-[#E2E8F0] rounded-2xl p-6 text-center space-y-4">
                  <h3 className="font-headline text-lg font-bold text-[#0F172A]">Interested in working together?</h3>
                  <p className="text-xs text-[#64748B] font-body">Let's talk about how I can help you build your next dynamic web app.</p>
                  <a href="mailto:aldinggln9@gmail.com" className="btn-primary block text-center">
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>
          </article>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-12 px-6 md:px-8 gap-6">
          <p className="text-sm text-[#64748B]">© {new Date().getFullYear()} Rivaldi Yonathan. Crafted with ❤️ for the web.</p>
          <div className="flex gap-6">
            {[['LinkedIn', 'https://linkedin.com/in/rivaldiyn'], ['GitHub', 'https://github.com/RivaldiYN']].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noopener noreferrer" className="text-[#64748B] hover:text-[#4F46E5] transition-colors font-body text-sm font-medium">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
