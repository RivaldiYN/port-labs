import { Link } from 'react-router-dom'

const TOC = [
  { id: 'introduction', label: '01. Introduction' },
  { id: 'the-kinetic-void', label: '02. The Kinetic Void' },
  { id: 'obsidian-spectrum', label: '03. Obsidian Spectrum' },
  { id: 'implementation', label: '04. Implementation' },
  { id: 'summary', label: '05. Summary' },
]

const RECENT = [
  { date: 'Mar 20', title: "Membangun WCAG 2.1 AA Compliant Website dari Awal" },
  { date: 'Mar 10', title: "Kenapa Saya Memilih Elysia.js untuk Backend Portfolio" },
]

export default function PostDetailPage() {
  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen font-body">
      {/* Kinetic blurs */}
      <div className="kinetic-blur fixed w-[40vw] h-[40vw] top-[-10%] left-[-10%] z-0" />
      <div className="kinetic-blur fixed w-[40vw] h-[40vw] bottom-[-10%] right-[-10%] z-0" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl shadow-2xl shadow-black/40 h-20 flex justify-between items-center px-6 md:px-8">
        <Link to="/" className="text-xl font-bold text-[#e5e2e1] font-headline tracking-tighter">
          Rivaldi<span className="text-[#1DB954]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {[['/', 'Home', false], ['/projects', 'Projects', false], ['#', 'News', true]].map(([to, label, active]) => (
            <Link key={String(to)} to={String(to)}
              className={`font-headline tracking-tighter text-sm px-2 py-1 rounded transition-all duration-300 ${active ? 'text-[#1DB954] font-bold border-b-2 border-[#1DB954]' : 'text-[#e5e2e1]/70 hover:text-[#e5e2e1] hover:bg-[#1DB954]/10'}`}>
              {label}
            </Link>
          ))}
        </div>
        <a href="mailto:aldinggln9@gmail.com" className="bg-[#1DB954] text-[#003914] px-5 py-2 rounded-full font-bold font-label text-xs uppercase tracking-widest active:scale-95 transition-all">
          Hire Me
        </a>
      </nav>

      <main className="pt-20">
        {/* Cover Hero */}
        <header className="relative w-full h-64 sm:h-80 md:h-[480px] lg:h-[600px] flex items-end justify-start overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1db954]/20 via-[#1c1b1b] to-[#131313]">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="material-symbols-outlined text-[#53e076]" style={{ fontSize: '400px' }}>architecture</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/40 to-transparent z-10" />

          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-8 pb-10 md:pb-16">
            <Link to="/" className="flex items-center gap-2 text-[#53e076] font-label text-xs uppercase tracking-widest mb-6 hover:-translate-x-1 transition-transform duration-300 w-fit">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to News
            </Link>
            <div className="flex gap-2 mb-4">
              <span className="px-4 py-1 bg-[#353534] rounded-full text-[#53e076] font-label text-xs tracking-wider border border-[#3d4a3d]/20">ENGINEERING</span>
              <span className="px-4 py-1 bg-[#353534] rounded-full text-[#e5e2e1]/60 font-label text-xs tracking-wider border border-[#3d4a3d]/20">8 MIN READ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-headline font-extrabold tracking-tighter leading-none text-[#e5e2e1] max-w-4xl">
              Architecting the <span className="text-[#53e076]">Antigravity</span> Interface
            </h1>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border-2 border-[#53e076]/30 flex items-center justify-center overflow-hidden">
                <span className="text-lg font-headline font-black text-[#53e076]">R</span>
              </div>
              <div>
                <p className="text-[#e5e2e1] font-semibold text-sm">Rivaldi Yonathan Nainggolan</p>
                <p className="text-[#e5e2e1]/40 text-xs font-label uppercase tracking-tighter">Full Stack Developer • Apr 14, 2026</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* ToC Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <h4 className="font-label text-xs uppercase tracking-[0.2em] text-[#e5e2e1]/40 mb-6">Contents</h4>
            <nav className="flex flex-col gap-3">
              {TOC.map((item, i) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`font-medium text-sm hover:translate-x-1 transition-transform pl-4 ${
                    i === 0
                      ? 'text-[#53e076] border-l-2 border-[#53e076]'
                      : 'text-[#e5e2e1]/40 hover:text-[#e5e2e1] border-l-2 border-transparent'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-12">
              <h4 className="font-label text-xs uppercase tracking-[0.2em] text-[#e5e2e1]/40 mb-6">Share Story</h4>
              <div className="flex gap-3">
                {['share', 'link'].map(icon => (
                  <button key={icon} className="w-10 h-10 rounded-full bg-[#1c1b1b] flex items-center justify-center hover:bg-[#53e076]/20 hover:text-[#53e076] transition-all">
                    <span className="material-symbols-outlined text-base">{icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Article */}
          <article className="lg:col-span-7 prose">
            <div id="introduction">
              <p className="text-xl text-[#e5e2e1]/90 leading-relaxed font-medium mb-12">
                Modern web design has become a series of boxes within boxes. To break free, we must embrace a philosophy where elements exist in a state of weightless orbit—anchored by intent rather than rigid grids.
              </p>
            </div>

            <h2 id="the-kinetic-void">The Kinetic Void Principle</h2>
            <p>
              The "Kinetic Void" isn't just an aesthetic; it's a structural mandate. It dictates that space is active, not passive. By removing traditional 1px borders and heavy dividers, we force the eye to follow tonal transitions and shadow depth.
            </p>
            <blockquote>
              "Design is not what it looks like and feels like. Design is how it works when the gravity of conventionality is removed."
            </blockquote>

            <h3 id="obsidian-spectrum">Navigating the Obsidian Spectrum</h3>
            <p>
              Working with near-black palettes requires a surgical approach to lighting. We utilize a layering system that mimics physical depth. Elements aren't just 'on top'; they are 'closer' to the viewer's eye.
            </p>
            <ul>
              <li><strong>Surface Layer:</strong> The base infinite dark matter (#131313).</li>
              <li><strong>Container Layer:</strong> Soft-recessed modules for content grouping (#1c1b1b).</li>
              <li><strong>Interactive Layer:</strong> High-glow actuators that react to proximity (#2a2a2a).</li>
            </ul>

            <h2 id="implementation">Implementation & Syntax</h2>
            <p>Applying this to code requires a departure from standard component libraries. We leverage utility-first frameworks to inject energy into static layouts.</p>
            <pre><code>{`// The Antigravity Core Logic
const kineticSystem = {
  anchor: "narrative",
  physics: "weightless",
  layers: [
    { name: "Obsidian", depth: 0 },
    { name: "Glass",    blur: "24px" },
    { name: "Kinetic",  glow: "#1DB954" }
  ],
  isWeightless: true
};

function orbit(element) {
  return element.defyGravity();
}`}</code></pre>
            <p>The code above illustrates how we treat UI elements as objects within a physics engine rather than just DOM nodes.</p>

            <div className="my-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {['architecture', 'code_blocks'].map(icon => (
                <div key={icon} className="aspect-square rounded-2xl bg-[#2a2a2a] overflow-hidden flex items-center justify-center group">
                  <span className="material-symbols-outlined text-[#1db954]/30 group-hover:text-[#1db954]/60 transition-colors" style={{ fontSize: '120px' }}>
                    {icon}
                  </span>
                </div>
              ))}
            </div>

            <h2 id="summary">Summary</h2>
            <p>
              By embracing the Kinetic Void, we create experiences that feel alive. It's about more than just dark mode and green accents; it's about a fundamental shift in how we perceive the digital canvas.
            </p>
          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-2 space-y-10">
            <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#3d4a3d]/10">
              <p className="font-label text-[10px] uppercase tracking-widest text-[#53e076] mb-4">Hire Me</p>
              <h5 className="text-[#e5e2e1] font-headline font-bold text-sm mb-4">Ready to launch your project into the void?</h5>
              <a href="mailto:aldinggln9@gmail.com"
                className="block w-full py-3 bg-[#53e076] text-[#002108] font-bold rounded-full text-sm text-center hover:shadow-[0_0_20px_rgba(83,224,118,0.3)] transition-all active:scale-95">
                Get in Touch
              </a>
            </div>
            <div>
              <h4 className="font-label text-xs uppercase tracking-[0.2em] text-[#e5e2e1]/40 mb-6">Recent Notes</h4>
              <div className="space-y-6">
                {RECENT.map(({ date, title }) => (
                  <a key={title} href="#" className="group block">
                    <p className="text-[#e5e2e1]/60 font-label text-[10px] uppercase mb-1">{date}</p>
                    <h6 className="text-[#e5e2e1] group-hover:text-[#53e076] transition-colors font-headline font-bold text-sm leading-tight">{title}</h6>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-[#e5e2e1]/10 bg-[#131313] mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-12 w-full max-w-7xl mx-auto gap-6">
          <p className="font-label text-sm text-[#e5e2e1]/40">© {new Date().getFullYear()} Rivaldi Yonathan Nainggolan.</p>
          <div className="flex gap-8">
            {[['LinkedIn', 'https://linkedin.com/in/rivaldiyn'], ['GitHub', 'https://github.com/RivaldiYN']].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                className="font-label text-sm text-[#e5e2e1]/40 hover:text-[#1DB954] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
