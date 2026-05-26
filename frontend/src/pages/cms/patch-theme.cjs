const fs = require('fs')
const path = require('path')

const files = [
  'CmsProjectsPage.tsx',
  'CmsPostsPage.tsx', 
  'CmsMediaPage.tsx'
]

const replacements = [
  ['bg-[#131313] text-[#e5e2e1] min-h-screen flex', 'bg-gradient-to-br from-[#FFFDF7] via-[#FFFFFF] to-[#FAF8F3] text-[#1F2937] min-h-screen font-body flex'],
  ['bg-[#1c1b1b] flex flex-col py-8 shadow-[20px_0_40px_rgba(0,0,0,0.4)] z-50', 'bg-white flex flex-col py-8 shadow-lg border-r border-[#E5E7EB] z-50'],
  ['text-base font-black text-[#1DB954] font-headline uppercase tracking-widest">Admin Console</Link>', 'inline-flex items-center gap-2 font-headline font-bold text-lg text-[#1F2937] hover:text-[#D4A373] transition-colors"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A373] to-[#0891B2] flex items-center justify-center text-white text-sm font-bold">AC</div><span>Admin</span></Link>'],
  ['font-label uppercase tracking-widest text-[10px] text-[#e5e2e1]/50 mt-1">Antigravity CMS', 'font-body uppercase tracking-wider text-[10px] text-[#9CA3AF] mt-2">CMS Portal'],
  ["'text-[#1DB954] bg-[#1DB954]/10 border-r-4 border-[#1DB954]' : 'text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-[#2a2a2a]'", "'text-white bg-gradient-to-r from-[#D4A373] to-[#CA8A04] shadow-md' : 'text-[#6B7280] hover:text-[#D4A373] hover:bg-[#FFF8F0]'"],
  ['w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#3d4a3d]/40 flex items-center justify-center shrink-0', 'w-10 h-10 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#166534] flex items-center justify-center shrink-0'],
  ['font-headline font-black text-[#53e076] text-sm">', 'font-bold text-white text-sm">'],
  ['text-sm font-bold text-[#e5e2e1] truncate">', 'text-sm font-bold text-[#1F2937] truncate">'],
  ['text-[10px] text-[#e5e2e1]/40 font-label tracking-widest">SUPER USER', 'text-[10px] text-[#9CA3AF] font-body tracking-wider uppercase">SUPER USER'],
  ['border-t border-[#3d4a3d]/20">', 'border-t border-[#E5E7EB]">'],
  ['gap-4 text-[#ffb4ab]/70 hover:text-[#ffb4ab] transition-all font-label uppercase tracking-widest text-xs disabled:opacity-50 w-full">', 'gap-3 text-[#DC2626] hover:text-[#991B1B] transition-all font-body font-semibold text-sm disabled:opacity-50 w-full cursor-pointer">'],
  ['w-4 h-4 border border-[#ffb4ab] border-t-transparent rounded-full animate-spin"', 'w-4 h-4 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin"'],
  ['w-10 h-10 rounded-xl bg-[#1c1b1b] flex items-center justify-center border border-[#3d4a3d]/20">', 'w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-[#FFF8F0] transition-colors">'],
  ['font-headline font-bold text-[#1DB954] tracking-widest text-sm uppercase">', 'font-headline font-bold text-[#1F2937] uppercase text-sm">'],
  ['font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-[#e5e2e1]">', 'font-headline text-3xl md:text-4xl font-bold text-[#1F2937] leading-none mb-2">'],
  ['text-[#e5e2e1]/50 text-sm mt-1">', 'text-[#6B7280] text-sm mt-1">'],
  ['text-[#53e076]">.</span>', 'text-[#D4A373]">.</span>'],
  ['bg-[#53e076] hover:bg-[#1db954] text-[#002108] font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all active:scale-95 group shrink-0">', 'bg-gradient-to-r from-[#D4A373] to-[#CA8A04] hover:brightness-110 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-md group shrink-0">'],
  ['bg-[#1c1b1b] border border-[#3d4a3d]/20 focus:border-[#1db954] focus:outline-none rounded-xl py-3 pl-12 pr-4 text-[#e5e2e1] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]"', 'bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 pl-12 pr-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)]"'],
  ['text-[#e5e2e1]/30 group-focus-within:text-[#53e076] transition-colors text-xl">', 'text-[#9CA3AF] group-focus-within:text-[#D4A373] transition-colors text-xl">'],
  ['px-5 py-3 rounded-xl bg-[#1c1b1b] border border-[#3d4a3d]/20 hover:border-[#53e076]/40 text-[#e5e2e1]/70 hover:text-[#53e076] font-label text-xs uppercase tracking-widest transition-all">', 'px-5 py-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D4A373] text-[#6B7280] hover:text-[#D4A373] font-body text-xs uppercase tracking-widest font-semibold transition-all">'],
  ['px-4 py-3 rounded-xl bg-[#1c1b1b] border border-[#3d4a3d]/10 text-[#e5e2e1]/40 hover:text-[#e5e2e1] transition-all">', 'px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#9CA3AF] hover:text-[#1F2937] transition-all">'],
  ['w-8 h-8 rounded-full border-2 border-[#53e076] border-t-transparent animate-spin"', 'w-8 h-8 rounded-full border-2 border-[#D4A373] border-t-transparent animate-spin"'],
  ['font-label text-xs uppercase tracking-widest text-[#e5e2e1]/40">', 'font-body text-sm text-[#9CA3AF] uppercase tracking-widest">'],
  ['hidden md:block bg-[#1c1b1b] rounded-3xl border border-[#3d4a3d]/10 overflow-hidden">', 'hidden md:block bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">'],
  ['border-b border-[#3d4a3d]/10">', 'border-b border-[#E5E7EB]">'],
  ['font-label text-[10px] uppercase tracking-[0.2em] text-[#e5e2e1]/30">', 'font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold">'],
  ['group hover:bg-[#2a2a2a]/50 transition-colors">', 'group hover:bg-[#FAFAF9] transition-colors border-b border-[#F3F4F6] last:border-b-0">'],
  ['divide-y divide-[#3d4a3d]/5">', 'divide-y divide-[#F3F4F6]">'],
  ['font-headline font-bold text-sm text-[#e5e2e1] max-w-xs truncate">', 'font-semibold text-sm text-[#1F2937] max-w-xs truncate">'],
  ['text-[#e5e2e1]/30 font-label text-[10px] mt-0.5">', 'text-[#9CA3AF] font-body text-[10px] mt-0.5">'],
  ['bg-[#353534] text-[#72fe8f] font-label text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">', 'bg-[#FFF8F0] text-[#D4A373] font-body text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">'],
  ["? 'text-[#53e076]' : 'text-[#e5e2e1]/20'", "? 'text-[#D4A373]' : 'text-[#D1D5DB]'"],
  ["? 'bg-[#1db954]/20 text-[#53e076] hover:bg-[#1db954]/30' : 'bg-[#353534] text-[#e5e2e1]/50 hover:bg-[#2a2a2a]'", "? 'bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0]' : 'bg-[#F3F4F6] text-[#9CA3AF] hover:bg-[#E5E7EB]'"],
  ["? 'bg-[#53e076] animate-pulse' : 'bg-[#e5e2e1]/30'", "? 'bg-[#166534] animate-pulse' : 'bg-[#D1D5DB]'"],
  ["? 'bg-[#1db954]/20 text-[#53e076]' : 'bg-[#353534] text-[#e5e2e1]/50'", "? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#F3F4F6] text-[#9CA3AF]'"],
  ['w-8 h-8 rounded-xl bg-[#2a2a2a] flex items-center justify-center hover:bg-[#53e076]/20 hover:text-[#53e076] transition-all">', 'w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#D4A373]/20 hover:text-[#D4A373] transition-all">'],
  ['w-8 h-8 rounded-xl bg-[#2a2a2a] flex items-center justify-center hover:bg-[#93000a]/30 hover:text-[#ffb4ab] transition-all">', 'w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all">'],
  ['text-5xl text-[#e5e2e1]/20 mb-3 block">', 'text-5xl text-[#D1D5DB] mb-3 block">'],
  ['text-[#e5e2e1]/40 font-label text-xs uppercase tracking-widest">', 'text-[#9CA3AF] font-body text-xs uppercase tracking-widest font-semibold">'],
  ['text-[#53e076] font-label text-xs font-bold uppercase tracking-widest border-b border-[#53e076] pb-1 hover:text-[#72fe8f] transition-colors">', 'text-[#D4A373] font-body text-xs font-bold uppercase tracking-widest border-b border-[#D4A373] pb-1 hover:text-[#CA8A04] transition-colors">'],
  ['bg-[#1c1b1b] rounded-2xl p-5 border border-[#3d4a3d]/10">', 'bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-sm">'],
  ['text-center py-16 border border-dashed border-[#3d4a3d]/20 rounded-2xl">', 'text-center py-16 border border-dashed border-[#E5E7EB] rounded-xl">'],
  ['flex-1 py-2 rounded-xl bg-[#2a2a2a] text-[#e5e2e1]/70 font-label text-xs uppercase tracking-widest hover:bg-[#53e076]/20 hover:text-[#53e076] transition-all flex items-center justify-center gap-1.5">', 'flex-1 py-2 rounded-xl bg-[#F3F4F6] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#D4A373]/20 hover:text-[#D4A373] transition-all flex items-center justify-center gap-1.5">'],
  ['flex-1 py-2 rounded-xl bg-[#2a2a2a] text-[#e5e2e1]/70 font-label text-xs uppercase tracking-widest hover:bg-[#93000a]/20 hover:text-[#ffb4ab] transition-all flex items-center justify-center gap-1.5">', 'flex-1 py-2 rounded-xl bg-[#F3F4F6] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all flex items-center justify-center gap-1.5">'],
  ['fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a2a] border border-[#53e076]/30 px-6 py-3 rounded-full font-label text-sm text-[#e5e2e1] shadow-2xl animate-slide-up">', 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#F0FDF4] border border-[#BBF7D0] px-6 py-3 rounded-full font-body font-semibold text-sm text-[#166534] shadow-lg animate-slide-up">'],
  ['fixed inset-0 bg-black/60 z-40 lg:hidden"', 'fixed inset-0 bg-black/20 z-40 lg:hidden"'],
  ['bg-[#1c1b1b] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#3d4a3d]/20 shadow-2xl">', 'bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E5E7EB] shadow-xl">'],
  ['flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#3d4a3d]/20">', 'flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#E5E7EB]">'],
  ['font-headline text-xl font-bold text-[#e5e2e1]">', 'font-headline text-xl font-bold text-[#1F2937]">'],
  ['w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#353534] transition-all">', 'w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-all">'],
  ['font-label text-[10px] uppercase tracking-widest text-[#e5e2e1]/50 mb-2 block">', 'font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2 block">'],
  ['w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3 px-4 text-[#e5e2e1] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]"', 'w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 px-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)] placeholder:text-[#9CA3AF]"'],
  ["form[key] ? 'bg-[#1db954]' : 'bg-[#353534]'", "form[key] ? 'bg-[#D4A373]' : 'bg-[#D1D5DB]'"],
  ['form.isPublished ? "bg-[#1db954]" : "bg-[#353534]"', 'form.isPublished ? "bg-[#D4A373]" : "bg-[#D1D5DB]"'],
  ["font-label text-xs uppercase tracking-widest text-[#e5e2e1]/70 group-hover:text-[#e5e2e1] transition-colors", "font-body text-xs uppercase tracking-widest text-[#6B7280] group-hover:text-[#1F2937] transition-colors font-semibold"],
  ["font-label text-xs uppercase tracking-widest text-[#e5e2e1]/70", "font-body text-xs uppercase tracking-widest text-[#6B7280] font-semibold"],
  ['flex gap-3 pt-4 border-t border-[#3d4a3d]/20">', 'flex gap-3 pt-4 border-t border-[#E5E7EB]">'],
  ['flex-1 py-3 rounded-xl border border-[#3d4a3d]/30 text-[#e5e2e1]/60 font-label text-xs uppercase tracking-widest hover:bg-[#2a2a2a] transition-all">', 'flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#F3F4F6] transition-all">'],
  ['flex-1 py-3 rounded-xl bg-[#1db954] text-[#002108] font-label font-bold text-xs uppercase tracking-widest hover:bg-[#53e076] transition-all disabled:opacity-60 flex items-center justify-center gap-2">', 'flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#CA8A04] text-white font-body font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md">'],
  ['w-4 h-4 border-2 border-[#002108] border-t-transparent rounded-full animate-spin"', 'w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"'],
  ['bg-[#1c1b1b] rounded-3xl p-8 max-w-sm w-full border border-[#ffb4ab]/20 shadow-2xl">', 'bg-white rounded-2xl p-8 max-w-sm w-full border border-[#FECACA] shadow-xl">'],
  ['w-14 h-14 rounded-2xl bg-[#93000a]/20 flex items-center justify-center mb-5 mx-auto">', 'w-14 h-14 rounded-2xl bg-[#FEE2E2] flex items-center justify-center mb-5 mx-auto">'],
  ['material-symbols-outlined text-[#ffb4ab] text-3xl"', 'material-symbols-outlined text-[#DC2626] text-3xl"'],
  ['font-headline text-lg font-bold text-center text-[#e5e2e1] mb-2">', 'font-headline text-lg font-bold text-center text-[#1F2937] mb-2">'],
  ['text-[#e5e2e1]/50 text-sm text-center mb-6 break-all">', 'text-[#6B7280] text-sm text-center mb-6">'],
  ['text-[#e5e2e1]/50 text-sm text-center mb-6">', 'text-[#6B7280] text-sm text-center mb-6">'],
  ['"text-[#e5e2e1]/80"', '"text-[#1F2937]"'],
  ['flex-1 py-3 rounded-xl bg-[#93000a]/80 text-[#ffb4ab] font-label font-bold text-xs uppercase tracking-widest hover:bg-[#93000a] transition-all">', 'flex-1 py-3 rounded-xl bg-[#DC2626] text-white font-body font-bold text-xs uppercase tracking-widest hover:bg-[#991B1B] transition-all">'],
  ['flex items-center gap-3 bg-[#93000a]/20 border border-[#ffb4ab]/20 rounded-xl px-4 py-3">', 'flex items-center gap-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3">'],
  ['material-symbols-outlined text-[#ffb4ab] text-lg"', 'material-symbols-outlined text-[#DC2626] text-lg"'],
  ['text-[#ffb4ab] text-sm">', 'text-[#DC2626] text-sm">'],
  // Media-specific
  ['border border-[#3d4a3d]/10 hover:border-[#53e076]/20 transition-all">', 'border border-[#E5E7EB] hover:border-[#D4A373]/30 transition-all shadow-sm">'],
  ['aspect-square bg-[#131313] flex items-center justify-center relative overflow-hidden">', 'aspect-square bg-[#F9FAFB] flex items-center justify-center relative overflow-hidden">'],
  ['hover:bg-[#53e076]/30 hover:text-[#53e076] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076]">', 'hover:bg-[#D4A373]/30 hover:text-[#D4A373] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]">'],
  ['hover:bg-[#93000a]/40 hover:text-[#ffb4ab] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb4ab]">', 'hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]">'],
  ['text-[#e5e2e1] text-xs font-medium truncate mb-0.5"', 'text-[#1F2937] text-xs font-medium truncate mb-0.5"'],
  ['text-[#e5e2e1]/30 font-label text-[10px]">', 'text-[#9CA3AF] font-body text-[10px]">'],
  ['border-2 border-dashed rounded-3xl p-10 md:p-16 text-center cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076]', 'border-2 border-dashed rounded-2xl p-10 md:p-16 text-center cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]'],
  ['border-[#53e076] bg-[#1db954]/10', 'border-[#D4A373] bg-[#D4A373]/10'],
  ['border-[#3d4a3d]/30 bg-[#1c1b1b] hover:border-[#53e076]/50 hover:bg-[#1c1b1b]/80', 'border-[#E5E7EB] bg-white hover:border-[#D4A373]/50 hover:bg-[#FFF8F0]'],
  ['border-2 border-[#53e076] border-t-transparent rounded-full animate-spin"', 'border-2 border-[#D4A373] border-t-transparent rounded-full animate-spin"'],
  ['font-label text-sm text-[#53e076] uppercase tracking-widest">', 'font-body text-sm text-[#D4A373] uppercase tracking-widest font-semibold">'],
  ['text-5xl text-[#53e076]/50 mb-4 block"', 'text-5xl text-[#D4A373]/50 mb-4 block"'],
  ['font-headline font-bold text-[#e5e2e1] mb-2">', 'font-headline font-bold text-[#1F2937] mb-2">'],
  ['text-[#e5e2e1]/30 text-sm font-label">', 'text-[#9CA3AF] text-sm font-body">'],
  ['bg-[#1db954] text-[#002108] text-[10px] font-bold px-2 py-1 rounded-full font-label uppercase tracking-widest whitespace-nowrap z-10">', 'bg-[#D4A373] text-white text-[10px] font-bold px-2 py-1 rounded-full font-body uppercase tracking-widest whitespace-nowrap z-10">'],
  ['w-10 h-10 rounded-full bg-[#1c1b1b] border border-[#3d4a3d]/20 flex items-center justify-center hover:border-[#53e076]/40 hover:text-[#53e076] transition-all disabled:opacity-30">', 'w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center hover:border-[#D4A373]/40 hover:text-[#D4A373] transition-all disabled:opacity-30">'],
  ['font-label text-sm text-[#e5e2e1]/50">', 'font-body text-sm text-[#6B7280]">'],
  // Posts-specific fix for inline inputCls
  ['const inputCls = "w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none rounded-xl py-3 px-4 text-[#e5e2e1] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)]"', 'const inputCls = "w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 px-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)] placeholder:text-[#9CA3AF]"'],
]

const dir = __dirname

for (const filename of files) {
  const filepath = path.join(dir, filename)
  let content = fs.readFileSync(filepath, 'utf8')
  let count = 0
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      count++
    }
  }
  fs.writeFileSync(filepath, content, 'utf8')
  console.log(`Updated ${filename}: ${count} replacements`)
}
