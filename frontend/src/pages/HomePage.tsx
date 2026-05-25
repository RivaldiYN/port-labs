import { Link } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { usePosts } from '../hooks/usePosts'
import { useProjects } from '../hooks/useProjects'

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

  const DEFAULT_STATS = [
    { value: '4+', label: 'Years Building' },
    { value: '20+', label: 'Projects Shipped' },
    { value: '3.45', label: 'GPA Excellence' },
  ]

  // Parse "value|label" pipe-delimited strings from the API
  const heroStats = (profile?.stats ?? []).length > 0
    ? profile!.stats!.map((entry) => {
        const [value, ...labelParts] = entry.split('|')
        return { value: value ?? '', label: labelParts.join('|') }
      })
    : DEFAULT_STATS

  return (
    <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FFFFFF] to-[#FAF8F3] text-[#1F2937] min-h-screen font-body">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden">
        {/* Floating blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#D4A373]/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-br from-[#0891B2]/10 to-transparent rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] shadow-sm mb-8 hover:shadow-md transition-shadow">
            <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#166534] font-body">Available for work</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold leading-tight mb-6 text-[#1F2937]">
            Designing Digital
            <br />
            <span className="bg-gradient-to-r from-[#D4A373] to-[#0891B2] bg-clip-text text-transparent">
              Experiences That Feel Alive
            </span>
          </h1>

          {/* Bio */}
          <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed mb-8 max-w-2xl font-body">
            {heroBio}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-10 pb-10 border-b border-[#E5E7EB]">
            {heroStats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl md:text-4xl font-headline font-bold text-[#1F2937]">{value}</p>
                <p className="text-xs uppercase tracking-widest text-[#9CA3AF] font-bold mt-2 font-body">{label}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              to="/projects"
              className="bg-gradient-to-r from-[#D4A373] to-[#E6B849] hover:shadow-lg text-white font-bold py-3.5 px-8 rounded-lg transition-all active:scale-95 flex items-center gap-2 group font-body uppercase tracking-wider text-sm"
              aria-label="View my projects"
            >
              <span>View Projects</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a
              href={`mailto:${contactEmail}`}
              className="border-2 border-[#D4A373] text-[#D4A373] hover:bg-[#FFF8F0] font-bold py-3.5 px-8 rounded-lg transition-all flex items-center gap-2 font-body uppercase tracking-wider text-sm"
              aria-label="Send me an email"
            >
              <span>Get In Touch</span>
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-16 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-[#1F2937] mb-4 text-left">
            Why Work With Me
            <span className="text-[#D4A373]">.</span>
          </h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mb-16 font-body text-left">
            I combine technical excellence with thoughtful design to create web experiences that matter.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⚡', title: 'Performance', desc: 'Lightning-fast load times & optimized bundle sizes' },
              { icon: '♿', title: 'Accessibility', desc: 'WCAG 2.1 AA+ compliant & keyboard navigation' },
              { icon: '📱', title: 'Responsive', desc: 'Seamless experience across all devices' },
              { icon: '🛠️', title: 'Modern Stack', desc: 'React, TypeScript, Tailwind & best practices' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-white to-[#FAFAF9] hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-3 inline-block group-hover:scale-110 transition-transform">{icon}</span>
                <h3 className="font-headline font-bold text-[#1F2937] mb-2">{title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-[#1F2937] mb-4">
                  Featured Projects
                  <span className="text-[#D4A373]">.</span>
                </h2>
                <p className="text-[#6B7280] text-lg font-body">Showcase of recent work and experiments</p>
              </div>
              <Link
                to="/projects"
                className="text-[#D4A373] font-body font-bold text-sm uppercase tracking-wider hover:text-[#0891B2] transition-colors flex items-center gap-2 group"
              >
                View All
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="group rounded-xl overflow-hidden border border-[#E5E7EB] bg-white hover:shadow-lg transition-all"
                >
                  {project.thumbnailUrl && (
                    <div className="overflow-hidden h-48 bg-gradient-to-br from-[#D4A373]/10 to-[#0891B2]/10">
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-headline font-bold text-[#1F2937] mb-2 group-hover:text-[#D4A373] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-[#FFF8F0] text-[#D4A373] px-3 py-1 rounded-full font-body font-semibold uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-16 bg-white border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-[#1F2937] mb-4">
                  Articles & Insights
                  <span className="text-[#D4A373]">.</span>
                </h2>
                <p className="text-[#6B7280] text-lg font-body">Thoughts on development, design, and the web</p>
              </div>
              <Link
                to="/posts"
                className="text-[#D4A373] font-body font-bold text-sm uppercase tracking-wider hover:text-[#0891B2] transition-colors flex items-center gap-2 group"
              >
                Read All
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.slug}`}
                  className="group rounded-xl p-6 border border-[#E5E7EB] bg-gradient-to-br from-[#FAFAF9] to-white hover:shadow-md hover:border-[#D4A373] transition-all"
                >
                  <span className="text-xs uppercase tracking-widest font-bold text-[#9CA3AF] font-body mb-3 inline-block">
                    {new Date(post.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <h3 className="text-lg font-headline font-bold text-[#1F2937] mb-3 group-hover:text-[#D4A373] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] line-clamp-3">{post.excerpt}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-[#E0F7ED] text-[#166534] px-2.5 py-1 rounded-full font-body font-semibold uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4A373]/10 to-[#0891B2]/10 rounded-3xl -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-[#1F2937] mb-6">
            Let's create something amazing
            <span className="text-[#D4A373]">.</span>
          </h2>
          <p className="text-lg text-[#6B7280] mb-8 font-body max-w-2xl mx-auto">
            Whether you have a project in mind or just want to chat about web technologies, I'm always open to exciting opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${contactEmail}`}
              className="bg-gradient-to-r from-[#D4A373] to-[#E6B849] hover:shadow-lg text-white font-bold py-3.5 px-10 rounded-lg transition-all active:scale-95 font-body uppercase tracking-wider inline-block"
            >
              Send Me An Email
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#0891B2] text-[#0891B2] hover:bg-[#CFFAFE]/20 font-bold py-3.5 px-10 rounded-lg transition-all font-body uppercase tracking-wider inline-block"
            >
              View GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
