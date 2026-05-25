import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 border-t border-[#E5E7EB] bg-gradient-to-b from-white to-[#FAFAF9]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-4 sm:px-6 md:px-10 lg:px-16 gap-8">
        <div>
          <Link
            to="/"
            className="text-lg font-bold font-headline tracking-tight text-[#1F2937] inline-flex items-center gap-2 group hover:opacity-80 transition-opacity"
          >
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-[#D4A373] to-[#0891B2] flex items-center justify-center text-white text-xs font-bold">
              RY
            </span>
            <span>Rivaldi</span>
          </Link>
          <p className="font-body text-xs text-[#9CA3AF] mt-3 tracking-widest uppercase font-semibold">
            © {new Date().getFullYear()} Rivaldi Yonathan Nainggolan.
            <br />
            Full Stack Developer & Digital Nomad.
          </p>
        </div>
        <div className="flex gap-8 md:gap-12">
          {[
            { label: 'LinkedIn', href: 'https://linkedin.com/in/rivaldiyn' },
            { label: 'GitHub', href: 'https://github.com/RivaldiYN' },
            { label: 'Email', href: 'mailto:aldinggln9@gmail.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[#9CA3AF] hover:text-[#D4A373] transition-colors font-body text-sm font-medium uppercase tracking-wider"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
