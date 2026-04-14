$Token = $env:GH_TOKEN  # Set dengan: $env:GH_TOKEN = "ghp_..."
$Repo  = "RivaldiYN/port-labs"

$headers = @{
    Authorization = "Bearer $Token"
    Accept        = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}
$base = "https://api.github.com/repos/$Repo"

function New-Label($name, $color, $desc) {
    $body = @{ name = $name; color = $color; description = $desc } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "$base/labels" -Method POST -Headers $headers -Body $body -ContentType "application/json" | Out-Null
        Write-Host "  label created: $name"
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        if ($code -eq 422) { Write-Host "  label exists: $name" }
        else { Write-Host "  label error: $name - $code" }
    }
    Start-Sleep -Milliseconds 300
}

function New-Issue($title, $body, [string[]]$labels) {
    $payload = [ordered]@{ title = $title; body = $body; labels = $labels }
    $json = $payload | ConvertTo-Json -Depth 10
    try {
        $r = Invoke-RestMethod -Uri "$base/issues" -Method POST -Headers $headers -Body $json -ContentType "application/json"
        Write-Host "OK #$($r.number) - $title"
    } catch {
        Write-Host "FAIL: $title - $($_.Exception.Message)"
    }
    Start-Sleep -Milliseconds 600
}

# ── Labels ────────────────────────────────────────────────────
Write-Host "Creating labels..."
New-Label "setup"         "0075ca" "Konfigurasi awal project"
New-Label "infra"         "e4e669" "Infrastructure and DevOps"
New-Label "database"      "1d76db" "Schema and migration PostgreSQL"
New-Label "backend"       "d93f0b" "Elysia.js API development"
New-Label "frontend"      "0e8a16" "React UI development"
New-Label "cms"           "5319e7" "Fitur Content Management System"
New-Label "auth"          "b60205" "Autentikasi dan otorisasi JWT"
New-Label "accessibility" "f9d0c4" "WCAG 2.1 AA compliance"
New-Label "testing"       "bfd4f2" "Unit and integration test"
New-Label "security"      "e11d48" "Keamanan: rate limit, sanitasi"
New-Label "deployment"    "006b75" "Build and hosting"
New-Label "priority:high" "ee0701" "Dikerjakan di sprint pertama"
New-Label "feature"       "84b6eb" "Fitur baru"
New-Label "devops"        "c2e0c6" "DevOps and containerization"

# ── Issues ────────────────────────────────────────────────────
Write-Host ""
Write-Host "Creating issues..."

New-Issue "[ISSUE-001] Project Scaffolding dan Struktur Folder" @"
## Deskripsi
Inisialisasi dua project terpisah: backend/ dan frontend/.

## Tasks
- [ ] Buat root folder portfolio-antigravity/
- [ ] Buat folder backend/ dan init dengan npm init -y
- [ ] Buat folder frontend/ dan scaffold dengan Vite (npm create vite@latest . -- --template react-ts)
- [ ] Buat .env.example dengan semua environment variables yang diperlukan
- [ ] Buat .gitignore root: node_modules, .env, dist, .DS_Store
- [ ] Buat README.md dengan instruksi singkat cara jalankan

## Perintah Awal
```bash
mkdir portfolio-antigravity && cd portfolio-antigravity
mkdir backend frontend

cd backend && npm init -y

cd ../frontend
npm create vite@latest . -- --template react-ts
npm install
```

## Acceptance Criteria
- Struktur folder sesuai diagram arsitektur
- .env.example berisi semua key yang diperlukan
"@ @("setup","infra","priority:high")

New-Issue "[ISSUE-002] Database Setup dan Schema PostgreSQL" @"
## Deskripsi
Setup PostgreSQL dengan schema lengkap untuk semua fitur portfolio.

## Tables yang Dibuat
- profile: Profil pemilik website
- skills: Skill / Tech Stack dengan proficiency 1-5
- projects: Portfolio Projects dengan Markdown content
- posts: Berita / Blog Posts dengan tags array
- experiences: Work Experience dengan date range
- media: File Uploads metadata
- admin_users: Admin CMS
- refresh_tokens: JWT refresh token management

## Tasks
- [ ] Buat folder backend/src/db/migrations/
- [ ] Tulis migration SQL sebagai file terpisah tiap tabel
- [ ] Setup Drizzle ORM + koneksi PostgreSQL (drizzle-orm + postgres package)
- [ ] Buat drizzle.config.ts
- [ ] Buat seed.ts dengan data: profil Rivaldi, 3 sample project, 2 sample post
- [ ] Test koneksi database berhasil di development

## Acceptance Criteria
- npm run db:migrate membuat semua tabel tanpa error
- npm run db:seed insert data awal berhasil
"@ @("database","infra","priority:high")

New-Issue "[ISSUE-003] Docker Compose untuk Database dan Storage Lokal" @"
## Deskripsi
Docker Compose untuk menjalankan PostgreSQL dan MinIO (local S3) saat development.

## Services
- postgres:16-alpine (port 5432) dengan healthcheck pg_isready
- minio:latest (port 9000 API, port 9001 Web Console)

## Tasks
- [ ] Buat docker-compose.yml di root project dengan postgres dan minio services
- [ ] Tambah named volumes: pgdata dan miniodata
- [ ] Dokumentasikan perintah docker di README
- [ ] Test docker compose up -d berhasil start keduanya

## Quick Commands
```bash
docker compose up -d     # Start all services
docker compose ps        # Check status
docker compose down      # Stop all services
```

Akses MinIO Console: http://localhost:9001 (user: minioadmin, pass: minioadmin123)
Buat bucket portfolio-media setelah MinIO berjalan.
"@ @("infra","devops")

New-Issue "[ISSUE-004] Elysia.js Server Bootstrap" @"
## Deskripsi
Setup server Elysia.js dengan semua plugin, middleware, dan konfigurasi dasar.

CATATAN: Elysia.js berjalan di atas Bun runtime, bukan Node.js.
Install Bun: curl -fsSL https://bun.sh/install | bash
Dependency tetap di-manage dengan npm di package.json.

## Install Dependencies
```bash
cd backend

npm install elysia @elysiajs/cors @elysiajs/jwt @elysiajs/bearer @elysiajs/swagger drizzle-orm postgres zod slugify bcryptjs

npm install -D drizzle-kit @types/bcryptjs tsx
```

## package.json scripts
```json
{
  "dev": "bun --watch src/index.ts",
  "start": "bun src/index.ts",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "bun src/db/migrate.ts",
  "db:seed": "bun src/db/seed.ts",
  "db:studio": "drizzle-kit studio",
  "create-admin": "bun src/scripts/create-admin.ts"
}
```

## Tasks
- [ ] Install semua dependencies
- [ ] Setup entry point src/index.ts
- [ ] Konfigurasi CORS (allow frontend URL), JWT plugin, Swagger UI di /docs
- [ ] Global error handler: { success, data, message, meta }
- [ ] Health check endpoint GET /health -> { status: "ok", timestamp, version }
- [ ] Request logging dengan timestamp dan duration

## Acceptance Criteria
- npm run dev berhasil start server di port 3000
- GET /health return 200 dengan status ok
- Swagger UI bisa diakses di /docs
"@ @("backend","setup","priority:high")

New-Issue "[ISSUE-005] Auth JWT Authentication untuk CMS" @"
## Deskripsi
Sistem autentikasi admin dengan access token (15 menit) dan refresh token (7 hari).

## Endpoints
| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | /auth/login | Login admin |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/logout | Revoke refresh token |
| GET | /auth/me | Info admin yang sedang login |

## Auth Flow
1. POST /auth/login: validasi bcrypt -> generate accessToken (JWT 15m) + refreshToken (64 bytes random, hash disimpan di DB)
2. POST /auth/refresh: cek token di DB -> generate accessToken baru -> rotate refreshToken
3. POST /auth/logout: hapus refreshToken dari DB

## Tasks
- [ ] Buat authPlugin Elysia dengan derive untuk inject currentAdmin ke context
- [ ] Middleware requireAuth: cek Bearer token, return 401 jika invalid/expired
- [ ] Hash password dengan bcryptjs (salt rounds: 12)
- [ ] Rate limiting login: max 5 attempt per IP per menit
- [ ] Script CLI create-admin.ts untuk buat admin pertama

## Acceptance Criteria
- Login berhasil return token pair (accessToken + refreshToken)
- Protected route tanpa token -> 401
- Protected route dengan token expired -> 401
- Refresh token rotation bekerja
"@ @("backend","auth","security","priority:high")

New-Issue "[ISSUE-006] API Profile" @"
## Endpoints
| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| GET | /api/profile | Public | Ambil data profil |
| PUT | /api/cms/profile | Admin | Update profil |
| POST | /api/cms/profile/avatar | Admin | Upload avatar (multipart) |

## Tasks
- [ ] GET /api/profile: return semua field publik profil
- [ ] PUT /api/cms/profile: update dengan validasi Zod (name, tagline, bio, email, github_url, linkedin_url, location, resume_url)
- [ ] Upload avatar: simpan ke MinIO, update avatar_url di DB
- [ ] Return type-safe response dengan format { success, data, message }
"@ @("backend","feature")

New-Issue "[ISSUE-007] API Projects CRUD" @"
## Endpoints
| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| GET | /api/projects | Public | List project published |
| GET | /api/projects/:slug | Public | Detail project |
| GET | /api/cms/projects | Admin | List semua termasuk draft |
| POST | /api/cms/projects | Admin | Buat project baru |
| PUT | /api/cms/projects/:id | Admin | Update project |
| DELETE | /api/cms/projects/:id | Admin | Hapus project |
| PATCH | /api/cms/projects/:id/publish | Admin | Toggle published |

## Query Params untuk GET /api/projects
- ?page=1&limit=6 (pagination)
- ?featured=true (filter featured only)
- ?tech=ReactJS (filter by tech stack)
- ?search=dashboard (full text search)
- ?sort=newest|oldest

## Tasks
- [ ] Implementasi semua endpoint dengan Drizzle ORM
- [ ] Auto-generate slug dari title menggunakan slugify
- [ ] Validasi Zod pada semua request body
- [ ] Pagination dengan meta: { page, limit, total, totalPages }
- [ ] Filter multi-param support
- [ ] Upload thumbnail via multipart ke MinIO
"@ @("backend","feature","priority:high")

New-Issue "[ISSUE-008] API Posts Blog CRUD" @"
## Endpoints
| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| GET | /api/posts | Public | List post published |
| GET | /api/posts/:slug | Public | Detail post |
| GET | /api/posts/tags | Public | Semua tags yang ada |
| GET | /api/cms/posts | Admin | List semua termasuk draft |
| POST | /api/cms/posts | Admin | Buat post baru |
| PUT | /api/cms/posts/:id | Admin | Update post |
| DELETE | /api/cms/posts/:id | Admin | Hapus post |
| PATCH | /api/cms/posts/:id/publish | Admin | Toggle published |

## Tasks
- [ ] Semua endpoint dengan pagination
- [ ] Full-text search PostgreSQL menggunakan to_tsvector + to_tsquery
- [ ] Filter by tags: ?tags=golang,react
- [ ] Auto-generate excerpt dari content jika field kosong (potong 160 karakter)
- [ ] Auto-generate slug dari title menggunakan slugify
"@ @("backend","feature","priority:high")

New-Issue "[ISSUE-009] API Media Upload" @"
## Endpoints
| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| POST | /api/cms/media/upload | Admin | Upload file |
| GET | /api/cms/media | Admin | List semua media |
| DELETE | /api/cms/media/:id | Admin | Hapus media |

## Tasks
- [ ] Upload multipart/form-data ke MinIO
- [ ] Validasi: max 5MB, allowed types: jpg, png, webp, pdf
- [ ] Generate unique filename: {timestamp}-{random}-{original}
- [ ] Return public URL setelah upload berhasil
- [ ] Simpan metadata ke tabel media
- [ ] Hapus file dari MinIO saat record di-delete (cascade delete)
"@ @("backend","feature")

New-Issue "[ISSUE-010] API Experiences dan Skills" @"
## Endpoints
```
GET    /api/experiences          -> Public list (sorted by sort_order)
GET    /api/skills               -> Public list, grouped by category
POST   /api/cms/experiences      -> Tambah experience
PUT    /api/cms/experiences/:id  -> Update experience
DELETE /api/cms/experiences/:id  -> Hapus experience
POST   /api/cms/skills           -> Tambah skill
PUT    /api/cms/skills/:id       -> Update skill
DELETE /api/cms/skills/:id       -> Hapus skill
```

## Tasks
- [ ] CRUD lengkap untuk kedua resource dengan Drizzle ORM + Zod validation
- [ ] Response skills digroup per category: { frontend, backend, database, tools }
- [ ] Sort order support untuk drag-and-drop reorder
"@ @("backend","feature")

New-Issue "[ISSUE-011] React App Bootstrap dan Design System" @"
## Install Dependencies
```bash
npm install react-router-dom @tanstack/react-query axios framer-motion lucide-react react-markdown remark-gfm rehype-highlight react-hook-form @hookform/resolvers zod react-hot-toast
npm install -D @tailwindcss/typography
```

## Design Tokens Tailwind
- Spotify Green palette: sg-500 = #1db954
- Dark surfaces: base #121212, elevated #181818, overlay #282828
- Fonts: Clash Display (display), DM Sans (body), JetBrains Mono (mono)
- Custom animations: float, glow-pulse, slide-up, fade-in

## WCAG AA Contrast Ratios (semua pass)
- #1db954 on #121212: 5.93:1 (AA Normal dan Large)
- #ffffff on #121212: 21:1
- #b3b3b3 on #121212: 7.49:1
- #ffffff on #1db954: 4.65:1 (AA Normal)

## Tasks
- [ ] Setup Vite + React + Tailwind CSS dengan design tokens lengkap
- [ ] Load font via Fontshare CDN (Clash Display, DM Sans) + Google Fonts (JetBrains Mono)
- [ ] Buat src/lib/api.ts: axios instance dengan auto-attach Authorization header + auto-refresh token on 401
- [ ] Setup React Query QueryClient dengan defaults (staleTime, retry)
- [ ] Setup React Router v6 dengan layout routes
- [ ] Atom components: Button (variant+size), Badge, Card, Skeleton, Modal (focus trap + ESC close), Avatar
- [ ] useAuth hook: manage login state + token storage di localStorage
- [ ] Global CSS: dark background, font setup, skip-to-content link, WCAG focus indicator
"@ @("frontend","setup","priority:high")

New-Issue "[ISSUE-012] Halaman Beranda Public Homepage" @"
## Deskripsi
Homepage utama dengan nuansa Antigravity: elemen melayang, Spotify Green, scroll reveal.

## Section 1: Hero
- Avatar dengan animate-float + green glow pulse
- Typewriter effect cycling: Full Stack Developer, Frontend Engineer, Open Source Contributor
- Background: FloatingOrbs animated SVG circles dengan blur
- Counter stats: 4+ Pengalaman, 8+ Project, 3.45 IPK ITERA, 2024 Sejak aktif

## Section 2: About Snippet
- Foto + bio 2-3 kalimat + tombol Baca Selengkapnya

## Section 3: Featured Projects
- 3 cards terfeatured dari API
- Hover: scale(1.02) + green border glow + Lihat Detail CTA muncul

## Section 4: Skills Constellation
- SVG animated: tiap skill sebagai node melayang, grouped by category dengan color coding

## Section 5: Latest Posts
- 3 artikel terbaru: cover + tanggal + tags + excerpt

## Section 6: Experience Timeline
- Vertical timeline: PT Kimia Farma Tbk (Des 2025 - Jun 2026), PT Technova Solusi Integrasi (Okt 2025 - Okt 2026)

## Section 7: Contact CTA
- Tombol email + GitHub + LinkedIn

## Tasks
- [ ] HomePage.tsx dengan semua sections
- [ ] FloatingOrbs.tsx: background animated SVG orbs
- [ ] useTypewriter hook
- [ ] useCountUp hook: animasi counter stats
- [ ] ProjectCard.tsx dengan hover glow effect
- [ ] PostCard.tsx
- [ ] Timeline.tsx: vertical timeline dengan Framer Motion
- [ ] SkillsConstellation.tsx: SVG floating nodes
- [ ] Scroll reveal via Framer Motion whileInView
- [ ] Responsif: mobile-first, breakpoint sm/md/lg/xl
"@ @("frontend","feature","priority:high")

New-Issue "[ISSUE-013] Halaman Projects" @"
## Routes
- /projects: list semua project
- /projects/:slug: detail project

## Tasks

### List Page /projects
- [ ] Grid layout: 3-col desktop / 2-col tablet / 1-col mobile
- [ ] Filter tab by category/tech stack
- [ ] Search dengan debounce 300ms
- [ ] Load More button (pagination offset-based)
- [ ] Skeleton loading saat fetching data

### Detail Page /projects/:slug
- [ ] Hero image full-width
- [ ] Render Markdown content dengan react-markdown + remark-gfm
- [ ] Tech stack badges
- [ ] Demo URL + Repo URL buttons dengan icon Lucide
- [ ] Kembali ke Projects link
- [ ] Related projects (3 project lain)
"@ @("frontend","feature")

New-Issue "[ISSUE-014] Halaman Posts Berita" @"
## Routes
- /posts: list semua post
- /posts/:slug: detail post

## Tasks

### List Page /posts
- [ ] Card grid dengan filter tags dan search (debounce 300ms)
- [ ] Tag filter: multi-select pill buttons
- [ ] Pagination / Load More button

### Detail Page /posts/:slug
- [ ] Cover image full-width
- [ ] Title, tanggal, tags, estimated read time (~X menit)
- [ ] Render Markdown: heading, code block dengan syntax highlight, list, blockquote, table
- [ ] Table of Contents sidebar (auto-generate dari heading H2/H3)
- [ ] Share: copy link ke clipboard dengan feedback toast
- [ ] Kembali ke Berita link
"@ @("frontend","feature")

New-Issue "[ISSUE-015] Navbar Footer dan Layout Responsif" @"
## Tasks

### Navbar
- [ ] Logo kiri: nama + dot hijau animasi blink
- [ ] Links: Beranda / Projects / Berita / Kontak
- [ ] Active state: green underline animated
- [ ] Sticky dengan backdrop-blur + semi-transparent background
- [ ] Mobile: hamburger button -> slide-in overlay menu
  - aria-expanded={isOpen} + aria-controls="mobile-menu"
  - ESC untuk tutup, focus trap saat terbuka

### Footer
- [ ] Teks: Dibuat dengan cinta oleh Rivaldi
- [ ] Social icons: GitHub, LinkedIn, Email dengan Lucide icons
- [ ] Copyright

### Utilities
- [ ] ScrollToTop.tsx: button muncul setelah scroll 300px dengan aria-label
- [ ] Skip-to-content link di paling atas dokumen

### Layouts
- [ ] PublicLayout.tsx: Navbar + main#main + Footer
- [ ] CMSLayout.tsx: Sidebar + main content untuk halaman CMS

## Responsive Breakpoints
| Screen | Layout |
|--------|--------|
| < 640px | 1 kolom, hamburger nav |
| 640-1024px | 2 kolom, condensed nav |
| > 1024px | Full layout, horizontal nav |
"@ @("frontend","feature","priority:high")

New-Issue "[ISSUE-016] CMS Login Page" @"
## Route: /cms/login

## Tasks
- [ ] Form login: email + password dengan validasi (React Hook Form + Zod)
- [ ] Toggle show/hide password dengan icon Lucide Eye/EyeOff
- [ ] Loading spinner saat request berlangsung
- [ ] Error toast merah saat gagal (wrong credentials, network error)
- [ ] Redirect otomatis ke /cms/dashboard setelah berhasil login
- [ ] Jika sudah login, redirect langsung ke dashboard
- [ ] Design: centered card, logo di atas, subtle green glow effect
- [ ] aria-label pada semua input fields untuk aksesibilitas
"@ @("frontend","cms","priority:high")

New-Issue "[ISSUE-017] CMS Dashboard" @"
## Route: /cms/dashboard

## Sidebar Navigation
Dashboard, Profile, Projects, Posts, Media, Experience, Skills, Logout

## Tasks
- [ ] Sidebar dengan active state berdasarkan current route
- [ ] Stats cards: Total Projects, Total Posts, Published count, Draft count
- [ ] Recent items: 5 project/post terakhir yang diupdate
- [ ] Quick action buttons: Buat Project Baru, Tulis Post Baru
- [ ] Protected route: redirect ke /cms/login jika belum auth
- [ ] Token refresh otomatis via axios interceptor (retry request setelah refresh)
- [ ] Loading state saat fetch dashboard data
"@ @("frontend","cms")

New-Issue "[ISSUE-018] CMS Project Manager" @"
## Routes
- /cms/projects: tabel semua project
- /cms/projects/new: form buat project baru
- /cms/projects/:id/edit: form edit project

## Form Fields
- Title -> slug auto-generate (bisa diedit manual)
- Description (textarea, max 300 karakter)
- Content: Markdown editor dengan split view (kiri edit, kanan preview live)
- Tech Stack: tag input (ketik + Enter tambah, klik X hapus)
- Thumbnail: drag and drop upload dengan preview langsung
- Demo URL + Repo URL
- Featured toggle (checkbox/switch)
- Status: Draft / Published

## Tasks
- [ ] Tabel dengan sort kolom, filter by status (All / Published / Draft)
- [ ] Confirm modal sebelum delete
- [ ] Toggle publish langsung dari tabel tanpa masuk form
- [ ] Form dengan React Hook Form + Zod validation
- [ ] Markdown editor split view dengan debounced preview render
- [ ] Tag input component reusable yang keyboard accessible
- [ ] Thumbnail upload dengan preview + tombol hapus
- [ ] Auto-save draft ke sessionStorage setiap 30 detik
- [ ] Success/error toast notification
"@ @("frontend","cms","priority:high")

New-Issue "[ISSUE-019] CMS Post Manager Berita" @"
## Routes
- /cms/posts: tabel semua post
- /cms/posts/new: form buat post baru
- /cms/posts/:id/edit: form edit post

## Form Fields
- Title -> slug auto-generate
- Excerpt (max 200 karakter, dengan character counter)
- Tags: tag input multi-select
- Cover image: upload + preview
- Content: Markdown editor fullscreen-capable dengan toolbar
- Status toggle (Draft / Published)

## Tasks
- [ ] Semua field dengan React Hook Form + Zod validation
- [ ] Markdown toolbar: Bold, Italic, H2, H3, Link, Code, Code Block, Image Insert, Unordered List, Ordered List
- [ ] Auto-save draft tiap 30 detik ke sessionStorage
- [ ] Word count + estimated read time display realtime (ceil(words / 200) menit)
- [ ] Insert gambar dari Media Library modal (browse dan select uploaded files)
- [ ] Preview mode fullscreen toggle
- [ ] Character counter untuk excerpt field
"@ @("frontend","cms","priority:high")

New-Issue "[ISSUE-020] CMS Media Library" @"
## Route: /cms/media

## Tasks
- [ ] Grid tampilan semua media yang terupload (uniform grid)
- [ ] Upload area: drag and drop zone + klik untuk browse file
- [ ] Progress bar + percentage saat upload berlangsung
- [ ] Copy URL dengan satu klik (ikon clipboard Lucide + feedback toast)
- [ ] Preview gambar dalam modal saat diklik (role dialog)
- [ ] Delete dengan konfirmasi dialog (tidak bisa undo, warning jelas)
- [ ] Filter tabs: All / Images / Documents
- [ ] Search by filename dengan debounce
- [ ] File info: nama file, ukuran, tanggal upload
"@ @("frontend","cms")

New-Issue "[ISSUE-021] CMS Edit Profile" @"
## Route: /cms/profile

## Form Fields
- Name, Tagline, Bio (textarea)
- Email, GitHub URL, LinkedIn URL, Location
- Avatar: upload baru / preview yang sekarang
- Resume: upload PDF baru

## Tasks
- [ ] Form dengan semua field profil + React Hook Form + Zod validation
- [ ] Avatar upload: preview langsung setelah pilih file
- [ ] Resume PDF upload dengan nama file display
- [ ] Preview perubahan sebelum save
- [ ] Success toast setelah save berhasil
- [ ] Error handling jika upload gagal
"@ @("frontend","cms")

New-Issue "[ISSUE-022] CMS Experience dan Skills Manager" @"
## Tasks

### Experience Manager
- [ ] List experience: kartu yang bisa di-reorder (drag-to-reorder mengubah sort_order)
- [ ] Modal form add/edit experience: company, role, description, tech_stack (tag input), start_date, end_date, is_current toggle
- [ ] Delete dengan confirm dialog

### Skills Manager
- [ ] List skills: grouped by category (Frontend / Backend / Database / Tools)
- [ ] Modal form add/edit skill: name, category (dropdown), proficiency UI 1-5 bintang clickable, icon_url dengan preview
- [ ] Delete dengan confirm dialog
- [ ] Drag-to-reorder per category group
"@ @("frontend","cms")

New-Issue "[ISSUE-023] WCAG 2.1 AA Full Audit dan Implementasi" @"
## 1. Perceivable
- [ ] Semua teks kontras >= 4.5:1 (normal) / >= 3:1 (large text > 18pt)
- [ ] Semua img punya alt attribute (alt kosong untuk dekoratif)
- [ ] Informasi tidak disampaikan hanya lewat warna

## 2. Operable
- [ ] Semua interaksi bisa dilakukan via keyboard
- [ ] Focus order logis (Tab key ikuti visual layout)
- [ ] Focus indicator visible: outline 2px solid #1db954, outline-offset 3px
- [ ] Skip-to-content link di paling atas dokumen
- [ ] Tidak ada keyboard trap (modal: ESC untuk tutup, focus trap aktif saat buka)
- [ ] Tidak ada konten berkedip lebih dari 3x per detik

## 3. Understandable
- [ ] html lang="id" di semua halaman
- [ ] Semua input punya label atau aria-label
- [ ] Error message deskriptif: "Email tidak valid" bukan hanya outline merah
- [ ] Navigasi konsisten di semua halaman

## 4. Robust
- [ ] Semantic HTML: nav, main#main, article, section, header, footer
- [ ] Modal: role="dialog" + aria-modal="true" + aria-labelledby
- [ ] Toast: role="alert" + aria-live="assertive"
- [ ] Loading: aria-busy="true" + aria-label="Memuat..."
- [ ] Icon-only buttons: aria-label deskriptif
- [ ] Hamburger: aria-expanded + aria-controls="mobile-menu"

## Audit Command
```bash
npx @axe-core/cli http://localhost:5173 --tags wcag2a,wcag2aa
```
"@ @("accessibility","priority:high")

New-Issue "[ISSUE-024] Backend API Testing" @"
## Setup
```bash
cd backend
npm install -D vitest supertest @types/supertest
```

## Tasks
- [ ] Test auth flow: login -> access protected -> refresh -> logout
- [ ] Test CRUD projects: create, read (list + detail), update, delete, toggle publish
- [ ] Test CRUD posts: semua operasi + full-text search
- [ ] Test upload: valid file, invalid type (non-allowed), oversized (>5MB) -> correct error codes
- [ ] Test unauthorized: semua CMS route return 401 tanpa token
- [ ] Coverage report: target lebih dari 80%

## Commands
```bash
npm run test           # run semua test
npm run test:coverage  # coverage report
```
"@ @("testing","backend")

New-Issue "[ISSUE-025] Frontend Testing Aksesibilitas dan Responsif" @"
## Setup
```bash
cd frontend
npm install -D @testing-library/react @testing-library/jest-dom jest-axe vitest jsdom
```

## Tasks
- [ ] Unit test aksesibilitas pada komponen utama menggunakan jest-axe:
  ```typescript
  import { axe } from 'jest-axe'
  it('HomePage has no a11y violations', async () => {
    const { container } = render(<HomePage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  ```
- [ ] Test komponen: Button, Modal, Navbar, Form fields
- [ ] Test keyboard navigation: Tab order, Enter/Space on buttons, ESC closes modal
- [ ] Visual test responsive di width: 375px (mobile), 768px (tablet), 1280px (desktop)
"@ @("testing","frontend","accessibility")

New-Issue "[ISSUE-026] Production Deployment" @"
## Recommended Hosting Stack
| Service | Untuk | Biaya |
|---------|-------|-------|
| Railway | Backend Elysia.js + PostgreSQL | Free tier tersedia |
| Vercel | Frontend React Vite | Free tier |
| Supabase Storage | File uploads (ganti MinIO di prod) | Free 1GB |

## Tasks

### Backend
- [ ] Environment variables production di Railway
- [ ] Dockerfile untuk backend Elysia.js:
  ```dockerfile
  FROM oven/bun:1 AS base
  WORKDIR /app
  COPY package*.json .
  RUN bun install --production
  COPY src ./src
  EXPOSE 3000
  CMD ["bun", "src/index.ts"]
  ```
- [ ] Ganti MinIO dengan Supabase Storage di production
- [ ] Setup CORS production: hanya allow domain Vercel

### Frontend
- [ ] Build: npm run build -> output dist/
- [ ] Deploy ke Vercel dengan env VITE_API_URL mengarah ke Railway URL

### CI/CD GitHub Actions
- [ ] Workflow: lint -> test -> build -> deploy ke Railway + Vercel
- [ ] Trigger on push ke branch main
"@ @("devops","deployment")

Write-Host ""
Write-Host "Done! Check: https://github.com/$Repo/issues"
