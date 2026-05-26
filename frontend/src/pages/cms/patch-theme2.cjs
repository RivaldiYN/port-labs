const fs = require('fs')
const path = require('path')

const files = [
  'CmsProjectsPage.tsx',
  'CmsPostsPage.tsx',
  'CmsMediaPage.tsx'
]

const replacements = [
  // Remaining asterisk required star
  ['text-[#53e076]">*</span>', 'text-[#D4A373]">*</span>'],
  // Remaining inline input in modal
  ['w-full bg-[#131313] border border-[#3d4a3d]/30 focus:border-[#1db954] focus:outline-none ro', 'w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none ro'],
  // Tech stack "more" counter  
  ['text-[#e5e2e1]/30 font-label text-[9px]">', 'text-[#9CA3AF] font-body text-[9px]">'],
  // Mobile card title  
  ['font-headline font-bold text-sm text-[#e5e2e1] truncate">', 'font-semibold text-sm text-[#1F2937] truncate">'],
  // Mobile card divider
  ['flex gap-2 pt-3 border-t border-[#3d4a3d]/10">', 'flex gap-2 pt-3 border-t border-[#E5E7EB]">'],
  // Mobile topbar button remaining
  ['w-10 h-10 rounded-xl bg-[#1', 'w-10 h-10 rounded-lg border border-[#E5E7EB] hover:bg-[#FFF8F0] transition-colors">\n            <span className="material-symbols-outlined" aria-hidden="true">menu</span>\n          </button><!--'],
  // Posts page: new post button
  ['bg-[#53e076] hover:bg-[#1db954] text-[#002108] font-', 'bg-gradient-to-r from-[#D4A373] to-[#CA8A04] hover:brightness-110 text-white font-'],
  // Posts close btn in modal
  ['w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#353534] transition-all', 'w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-all'],
  // Posts error (text-center py-16 variant)  
  ['text-5xl text-[#ffb4ab]/60 mb-3 block">', 'text-5xl text-[#DC2626]/40 mb-3 block">'],
  ['text-[#ffb4ab] font-label text-sm">', 'text-[#DC2626] font-body text-sm">'],
  // Posts status published dot
  ['bg-[#53e076] animate-pulse"', 'bg-[#166534] animate-pulse"'],
  // Posts action edit button
  ['w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#D4A373]/20 hover:text-[#D4A373] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076]">', 'w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#D4A373]/20 hover:text-[#D4A373] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]">'],
  // Posts action delete button
  ['w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb4ab]">', 'w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]">'],
  // Posts empty state
  ['text-center py-16">', 'text-center py-16">'],
  // Posts mobile status
  ['shrink-0 px-3 py-1 rounded-full font-labe', 'shrink-0 px-3 py-1 rounded-full font-body text-[10px] font-bold uppercase tracking-wider<!--'],
  // Media card bg remaining
  ['group bg-[#1c1b1b] rounded-2xl overflow-hidden border', 'group bg-white rounded-2xl overflow-hidden border'],
  // Media card hover buttons bg
  ['bg-[#1c1b1b]/80 rounded-xl flex items-center justify-center hover:bg-[#D4A373]/30', 'bg-white/80 rounded-xl flex items-center justify-center hover:bg-[#D4A373]/30'],
  ['bg-[#1c1b1b]/80 rounded-xl flex items-center justify-center hover:bg-[#FEE2E2]', 'bg-white/80 rounded-xl flex items-center justify-center hover:bg-[#FEE2E2]'],
  // Media toast variant (error)
  ['bg-[#2d1b1b] border-[#ffb4ab]/30 text-[#ffb4ab]', 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'],
  ['bg-[#2a2a2a] border-[#53e076]/30 text-[#e5e2e1]', 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'],
  // Media error alert
  ['bg-[#93000a]/20 border border-[#ffb4ab]/20 rounded-2xl px-6 py-4 mb-8">', 'bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-6 py-4 mb-8">'],
  ['material-symbols-outlined text-[#ffb4ab]" aria-hidden="true">error', 'material-symbols-outlined text-[#DC2626]" aria-hidden="true">error'],
  ['text-[#ffb4ab] text-sm">', 'text-[#DC2626] text-sm">'],
  // Media empty state
  ['border border-dashed border-[#3d4a3d]/20 rounded-3xl">', 'border border-dashed border-[#E5E7EB] rounded-2xl">'],
  ['text-6xl text-[#e5e2e1]/20 mb-4 block"', 'text-6xl text-[#D1D5DB] mb-4 block"'],
  ['text-[#e5e2e1]/40 font-label text-xs uppercase tracking-widest mb-2">', 'text-[#9CA3AF] font-body text-xs uppercase tracking-widest font-semibold mb-2">'],
  ['text-[#e5e2e1]/25 text-sm">', 'text-[#9CA3AF] text-sm">'],
  // Tech stack helper text in modal
  ['text-[#e5e2e1]/30">(pisahkan dengan koma)', 'text-[#9CA3AF]">(pisahkan dengan koma)'],
  // Thumbnail border
  ['border border-[#3d4a3d]/20">', 'border border-[#E5E7EB]">'],
  // Mobile topbar remaining (Posts and Media)  
  ['w-10 h-10 rounded-xl bg-[#1c1b1b] flex items-center justify-center border border-[#3d4a3d]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1db954]">', 'w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-[#FFF8F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]">'],
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
