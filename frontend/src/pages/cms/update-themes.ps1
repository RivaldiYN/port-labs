# Update CmsProjectsPage, CmsPostsPage, CmsMediaPage to light theme

$files = @(
  'frontend\src\pages\cms\CmsProjectsPage.tsx',
  'frontend\src\pages\cms\CmsPostsPage.tsx',
  'frontend\src\pages\cms\CmsMediaPage.tsx'
)

foreach ($file in $files) {
  $content = Get-Content $file -Raw

  # Background
  $content = $content -replace "bg-\[#131313\] text-\[#e5e2e1\] min-h-screen flex", "bg-gradient-to-br from-[#FFFDF7] via-[#FFFFFF] to-[#FAF8F3] text-[#1F2937] min-h-screen font-body flex"

  # Sidebar background
  $content = $content -replace "bg-\[#1c1b1b\] flex flex-col py-8 shadow-\[20px_0_40px_rgba\(0,0,0,0\.4\)\] z-50", "bg-white flex flex-col py-8 shadow-lg border-r border-[#E5E7EB] z-50"

  # Sidebar logo - Admin Console green -> warm
  $content = $content -replace 'text-base font-black text-\[#1DB954\] font-headline uppercase tracking-widest">Admin Console', 'inline-flex items-center gap-2 font-headline font-bold text-lg text-[#1F2937] hover:text-[#D4A373] transition-colors"><div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A373] to-[#0891B2] flex items-center justify-center text-white text-sm font-bold">AC</div><span>Admin</span'

  # Sidebar subtitle
  $content = $content -replace 'font-label uppercase tracking-widest text-\[10px\] text-\[#e5e2e1\]/50 mt-1">Antigravity CMS', 'font-body uppercase tracking-wider text-[10px] text-[#9CA3AF] mt-2">CMS Portal'

  # Nav active link
  $content = $content -replace "active \? 'text-\[#1DB954\] bg-\[#1DB954\]/10 border-r-4 border-\[#1DB954\]' : 'text-\[#e5e2e1\]/50 hover:text-\[#e5e2e1\] hover:bg-\[#2a2a2a\]'", "active ? 'text-white bg-gradient-to-r from-[#D4A373] to-[#CA8A04] shadow-md' : 'text-[#6B7280] hover:text-[#D4A373] hover:bg-[#FFF8F0]'"

  # Sidebar user avatar
  $content = $content -replace 'w-10 h-10 rounded-full bg-\[#2a2a2a\] border border-\[#3d4a3d\]/40 flex items-center justify-center shrink-0', 'w-10 h-10 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#166534] flex items-center justify-center shrink-0'

  # Sidebar user initials color
  $content = $content -replace 'font-headline font-black text-\[#53e076\] text-sm', 'font-bold text-white text-sm'

  # Sidebar username
  $content = $content -replace 'text-sm font-bold text-\[#e5e2e1\] truncate', 'text-sm font-bold text-[#1F2937] truncate'

  # Sidebar role
  $content = $content -replace 'text-\[10px\] text-\[#e5e2e1\]/40 font-label tracking-widest', 'text-[10px] text-[#9CA3AF] font-body tracking-wider'

  # Sidebar border
  $content = $content -replace 'border-t border-\[#3d4a3d\]/20', 'border-t border-[#E5E7EB]'

  # Logout button
  $content = $content -replace 'text-\[#ffb4ab\]/70 hover:text-\[#ffb4ab\] transition-all font-label uppercase tracking-widest text-xs disabled:opacity-50 w-full', 'text-[#DC2626] hover:text-[#991B1B] transition-all font-body font-semibold text-sm disabled:opacity-50 w-full cursor-pointer'
  $content = $content -replace 'w-4 h-4 border border-\[#ffb4ab\] border-t-transparent rounded-full animate-spin', 'w-4 h-4 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin'

  # Mobile topbar bg
  $content = $content -replace 'w-10 h-10 rounded-xl bg-\[#1c1b1b\] flex items-center justify-center border border-\[#3d4a3d\]/20', 'w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-[#FFF8F0] transition-colors'

  # Mobile topbar title color
  $content = $content -replace 'font-headline font-bold text-\[#1DB954\] tracking-widest text-sm uppercase', 'font-headline font-bold text-[#1F2937] uppercase text-sm'

  # H1 title
  $content = $content -replace 'font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-\[#e5e2e1\]', 'font-headline text-3xl md:text-4xl font-bold text-[#1F2937] leading-none'

  # H1 dot color
  $content = $content -replace 'text-\[#53e076\]">\.', 'text-[#D4A373]">.'

  # Subtitle text
  $content = $content -replace 'text-\[#e5e2e1\]/50 text-sm mt-1', 'text-[#6B7280] text-sm mt-1'

  # New button (green primary action)
  $content = $content -replace 'bg-\[#53e076\] hover:bg-\[#1db954\] text-\[#002108\] font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all active:scale-95 group shrink-0', 'bg-gradient-to-r from-[#D4A373] to-[#CA8A04] hover:brightness-110 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-md group shrink-0'

  # Search input bg
  $content = $content -replace "bg-\[#1c1b1b\] border border-\[#3d4a3d\]/20 focus:border-\[#1db954\] focus:outline-none rounded-xl py-3 pl-12 pr-4 text-\[#e5e2e1\] text-sm transition-all focus:shadow-\[0_0_0_3px_rgba\(29,185,84,0\.1\)\]", "bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 pl-12 pr-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)]"

  # Search icon color
  $content = $content -replace 'text-\[#e5e2e1\]/30 group-focus-within:text-\[#53e076\] transition-colors text-xl', 'text-[#9CA3AF] group-focus-within:text-[#D4A373] transition-colors text-xl'

  # Search submit btn
  $content = $content -replace "px-5 py-3 rounded-xl bg-\[#1c1b1b\] border border-\[#3d4a3d\]/20 hover:border-\[#53e076\]/40 text-\[#e5e2e1\]/70 hover:text-\[#53e076\] font-label text-xs uppercase tracking-widest transition-all", "px-5 py-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D4A373] text-[#6B7280] hover:text-[#D4A373] font-body text-xs uppercase tracking-widest font-semibold transition-all"

  # Search clear btn
  $content = $content -replace "px-4 py-3 rounded-xl bg-\[#1c1b1b\] border border-\[#3d4a3d\]/10 text-\[#e5e2e1\]/40 hover:text-\[#e5e2e1\] transition-all", "px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#9CA3AF] hover:text-[#1F2937] transition-all"

  # Loading spinner
  $content = $content -replace 'w-8 h-8 rounded-full border-2 border-\[#53e076\] border-t-transparent animate-spin', 'w-8 h-8 rounded-full border-2 border-[#D4A373] border-t-transparent animate-spin'
  $content = $content -replace 'font-label text-xs uppercase tracking-widest text-\[#e5e2e1\]/40', 'font-body text-sm text-[#9CA3AF] uppercase tracking-widest'

  # Error state
  $content = $content -replace 'text-\[#ffb4ab\] font-label text-sm', 'text-[#DC2626] font-body text-sm'
  $content = $content -replace 'text-5xl text-\[#ffb4ab\]/60 mb-3 block', 'text-5xl text-[#DC2626]/40 mb-3 block'

  # Table container
  $content = $content -replace "hidden md:block bg-\[#1c1b1b\] rounded-3xl border border-\[#3d4a3d\]/10 overflow-hidden", "hidden md:block bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden"

  # Table header row
  $content = $content -replace 'border-b border-\[#3d4a3d\]/10', 'border-b border-[#E5E7EB]'
  $content = $content -replace 'font-label text-\[10px\] uppercase tracking-\[0\.2em\] text-\[#e5e2e1\]/30', 'font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold'

  # Table row hover
  $content = $content -replace 'group hover:bg-\[#2a2a2a\]/50 transition-colors', 'group hover:bg-[#FAFAF9] transition-colors'

  # Table divider
  $content = $content -replace 'divide-y divide-\[#3d4a3d\]/5', 'divide-y divide-[#F3F4F6]'

  # Table project title
  $content = $content -replace 'font-headline font-bold text-sm text-\[#e5e2e1\] max-w-xs truncate', 'font-semibold text-sm text-[#1F2937] max-w-xs truncate'

  # Table slug / subtitle
  $content = $content -replace 'text-\[#e5e2e1\]/30 font-label text-\[10px\] mt-0\.5', 'text-[#9CA3AF] font-body text-[10px] mt-0.5'

  # Tech stack badges
  $content = $content -replace "bg-\[#353534\] text-\[#72fe8f\] font-label text-\[9px\] font-bold px-2 py-0\.5 rounded-md uppercase tracking-wider", "bg-[#FFF8F0] text-[#D4A373] font-body text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"

  # Featured star
  $content = $content -replace "p\.isFeatured \? 'text-\[#53e076\]' : 'text-\[#e5e2e1\]/20'", "p.isFeatured ? 'text-[#D4A373]' : 'text-[#D1D5DB]'"

  # Status toggle (published)
  $content = $content -replace "p\.isPublished \? 'bg-\[#1db954\]/20 text-\[#53e076\] hover:bg-\[#1db954\]/30' : 'bg-\[#353534\] text-\[#e5e2e1\]/50 hover:bg-\[#2a2a2a\]'", "p.isPublished ? 'bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0]' : 'bg-[#F3F4F6] text-[#9CA3AF] hover:bg-[#E5E7EB]'"
  $content = $content -replace "p\.isPublished \? 'bg-\[#53e076\] animate-pulse' : 'bg-\[#e5e2e1\]/30'", "p.isPublished ? 'bg-[#166534] animate-pulse' : 'bg-[#D1D5DB]'"

  # mobile status toggle
  $content = $content -replace "p\.isPublished \? 'bg-\[#1db954\]/20 text-\[#53e076\]' : 'bg-\[#353534\] text-\[#e5e2e1\]/50'", "p.isPublished ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#F3F4F6] text-[#9CA3AF]'"

  # Action buttons
  $content = $content -replace "w-8 h-8 rounded-xl bg-\[#2a2a2a\] flex items-center justify-center hover:bg-\[#53e076\]/20 hover:text-\[#53e076\] transition-all", "w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#D4A373]/20 hover:text-[#D4A373] transition-all"
  $content = $content -replace "w-8 h-8 rounded-xl bg-\[#2a2a2a\] flex items-center justify-center hover:bg-\[#93000a\]/30 hover:text-\[#ffb4ab\] transition-all", "w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all"

  # Empty state
  $content = $content -replace 'text-5xl text-\[#e5e2e1\]/20 mb-3 block', 'text-5xl text-[#D1D5DB] mb-3 block'
  $content = $content -replace "text-\[#e5e2e1\]/40 font-label text-xs uppercase tracking-widest", "text-[#9CA3AF] font-body text-xs uppercase tracking-widest font-semibold"
  $content = $content -replace "mt-4 text-\[#53e076\] font-label text-xs font-bold uppercase tracking-widest border-b border-\[#53e076\] pb-1 hover:text-\[#72fe8f\] transition-colors", "mt-4 text-[#D4A373] font-body text-xs font-bold uppercase tracking-widest border-b border-[#D4A373] pb-1 hover:text-[#CA8A04] transition-colors"

  # Mobile cards
  $content = $content -replace "bg-\[#1c1b1b\] rounded-2xl p-5 border border-\[#3d4a3d\]/10", "bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-sm"

  $content = $content -replace "text-center py-16 border border-dashed border-\[#3d4a3d\]/20 rounded-2xl", "text-center py-16 border border-dashed border-[#E5E7EB] rounded-xl"

  # Mobile edit/delete buttons
  $content = $content -replace "flex-1 py-2 rounded-xl bg-\[#2a2a2a\] text-\[#e5e2e1\]/70 font-label text-xs uppercase tracking-widest hover:bg-\[#53e076\]/20 hover:text-\[#53e076\] transition-all flex items-center justify-center gap-1\.5", "flex-1 py-2 rounded-xl bg-[#F3F4F6] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#D4A373]/20 hover:text-[#D4A373] transition-all flex items-center justify-center gap-1.5"
  $content = $content -replace "flex-1 py-2 rounded-xl bg-\[#2a2a2a\] text-\[#e5e2e1\]/70 font-label text-xs uppercase tracking-widest hover:bg-\[#93000a\]/20 hover:text-\[#ffb4ab\] transition-all flex items-center justify-center gap-1\.5", "flex-1 py-2 rounded-xl bg-[#F3F4F6] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all flex items-center justify-center gap-1.5"

  # Toast (success)
  $content = $content -replace "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-\[#2a2a2a\] border border-\[#53e076\]/30 px-6 py-3 rounded-full font-label text-sm text-\[#e5e2e1\] shadow-2xl animate-slide-up", "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#F0FDF4] border border-[#BBF7D0] px-6 py-3 rounded-full font-body font-semibold text-sm text-[#166534] shadow-lg animate-slide-up"

  # Mobile overlay bg
  $content = $content -replace 'fixed inset-0 bg-black/60 z-40 lg:hidden', 'fixed inset-0 bg-black/20 z-40 lg:hidden'

  # Modal background
  $content = $content -replace "bg-\[#1c1b1b\] rounded-3xl w-full max-w-2xl max-h-\[90vh\] overflow-y-auto border border-\[#3d4a3d\]/20 shadow-2xl", "bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E5E7EB] shadow-xl"

  # Modal header border
  $content = $content -replace 'flex items-center justify-between px-8 pt-8 pb-6 border-b border-\[#3d4a3d\]/20', 'flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#E5E7EB]'

  # Modal title
  $content = $content -replace 'font-headline text-xl font-bold text-\[#e5e2e1\]', 'font-headline text-xl font-bold text-[#1F2937]'

  # Modal close btn
  $content = $content -replace "w-9 h-9 rounded-full bg-\[#2a2a2a\] flex items-center justify-center hover:bg-\[#353534\] transition-all", "w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-all"

  # Modal labels
  $content = $content -replace 'font-label text-\[10px\] uppercase tracking-widest text-\[#e5e2e1\]/50 mb-2 block', 'font-body text-[11px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2 block'

  # Modal inputs
  $content = $content -replace "w-full bg-\[#131313\] border border-\[#3d4a3d\]/30 focus:border-\[#1db954\] focus:outline-none rounded-xl py-3 px-4 text-\[#e5e2e1\] text-sm transition-all focus:shadow-\[0_0_0_3px_rgba\(29,185,84,0\.1\)\]", "w-full bg-white border border-[#E5E7EB] focus:border-[#D4A373] focus:outline-none rounded-xl py-3 px-4 text-[#1F2937] text-sm transition-all focus:shadow-[0_0_0_3px_rgba(212,163,115,0.15)] placeholder:text-[#9CA3AF]"

  # Modal tech stack span
  $content = $content -replace 'text-\[#e5e2e1\]/30', 'text-[#9CA3AF]'

  # Modal toggle off
  $content = $content -replace "form\[key\] \? 'bg-\[#1db954\]' : 'bg-\[#353534\]'", "form[key] ? 'bg-[#D4A373]' : 'bg-[#D1D5DB]'"
  $content = $content -replace "form\.isPublished \? \"bg-\[#1db954\]\" : \"bg-\[#353534\]\"", "form.isPublished ? 'bg-[#D4A373]' : 'bg-[#D1D5DB]'"

  # Modal toggle label
  $content = $content -replace "font-label text-xs uppercase tracking-widest text-\[#e5e2e1\]/70 group-hover:text-\[#e5e2e1\] transition-colors", "font-body text-xs uppercase tracking-widest text-[#6B7280] group-hover:text-[#1F2937] transition-colors font-semibold"
  $content = $content -replace "font-label text-xs uppercase tracking-widest text-\[#e5e2e1\]/70", "font-body text-xs uppercase tracking-widest text-[#6B7280] font-semibold"

  # Modal action buttons border
  $content = $content -replace "flex gap-3 pt-4 border-t border-\[#3d4a3d\]/20", "flex gap-3 pt-4 border-t border-[#E5E7EB]"

  # Modal cancel btn
  $content = $content -replace "flex-1 py-3 rounded-xl border border-\[#3d4a3d\]/30 text-\[#e5e2e1\]/60 font-label text-xs uppercase tracking-widest hover:bg-\[#2a2a2a\] transition-all", "flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#F3F4F6] transition-all"

  # Modal save btn
  $content = $content -replace "flex-1 py-3 rounded-xl bg-\[#1db954\] text-\[#002108\] font-label font-bold text-xs uppercase tracking-widest hover:bg-\[#53e076\] transition-all disabled:opacity-60 flex items-center justify-center gap-2", "flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#CA8A04] text-white font-body font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"

  # Modal spinner
  $content = $content -replace "w-4 h-4 border-2 border-\[#002108\] border-t-transparent rounded-full animate-spin", "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"

  # Delete modal
  $content = $content -replace "bg-\[#1c1b1b\] rounded-3xl p-8 max-w-sm w-full border border-\[#ffb4ab\]/20 shadow-2xl", "bg-white rounded-2xl p-8 max-w-sm w-full border border-[#FECACA] shadow-xl"
  $content = $content -replace "w-14 h-14 rounded-2xl bg-\[#93000a\]/20 flex items-center justify-center mb-5 mx-auto", "w-14 h-14 rounded-2xl bg-[#FEE2E2] flex items-center justify-center mb-5 mx-auto"
  $content = $content -replace 'material-symbols-outlined text-\[#ffb4ab\] text-3xl', 'material-symbols-outlined text-[#DC2626] text-3xl'
  $content = $content -replace 'font-headline text-lg font-bold text-center text-\[#e5e2e1\] mb-2', 'font-headline text-lg font-bold text-center text-[#1F2937] mb-2'
  $content = $content -replace "text-\[#e5e2e1\]/50 text-sm text-center mb-6( break-all| font-body)?", "text-[#6B7280] text-sm text-center mb-6"
  $content = $content -replace "text-\[#e5e2e1\]/80", "text-[#1F2937]"
  $content = $content -replace "flex-1 py-3 rounded-xl bg-\[#93000a\]/80 text-\[#ffb4ab\] font-label font-bold text-xs uppercase tracking-widest hover:bg-\[#93000a\] transition-all", "flex-1 py-3 rounded-xl bg-[#DC2626] text-white font-body font-bold text-xs uppercase tracking-widest hover:bg-[#991B1B] transition-all"

  # Error alert
  $content = $content -replace "flex items-center gap-3 bg-\[#93000a\]/20 border border-\[#ffb4ab\]/20 rounded-xl px-4 py-3", "flex items-center gap-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3"
  $content = $content -replace 'material-symbols-outlined text-\[#ffb4ab\] text-lg', 'material-symbols-outlined text-[#DC2626] text-lg'
  $content = $content -replace "text-\[#ffb4ab\] text-sm", "text-[#DC2626] text-sm"

  Set-Content $file $content
  Write-Host "Updated: $file"
}
