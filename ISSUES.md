# 🚀 Antigravity Portfolio — GitHub Issues (Vibe Code Edition)

> **Tema:** Spotify Green · WCAG 2.1 AA Compliant · Antigravity Aesthetic  
> **Stack:** Elysia.js · React · Tailwind CSS · PostgreSQL  
> **Package Manager:** npm  
> **Owner:** Rivaldi Yonathan Nainggolan

---

## 🗂️ Struktur Folder Project

```
portfolio-antigravity/
├── backend/                  → Elysia.js API Server (Bun runtime)
│   ├── src/
│   │   ├── db/
│   │   │   ├── migrations/   → File SQL migration
│   │   │   ├── schema.ts     → Drizzle ORM schema
│   │   │   └── seed.ts       → Data awal / seeder
│   │   ├── modules/
│   │   │   ├── auth/         → Login, JWT, refresh token
│   │   │   ├── profile/      → Endpoint profil
│   │   │   ├── projects/     → CRUD project
│   │   │   ├── posts/        → CRUD berita
│   │   │   ├── media/        → Upload file
│   │   │   ├── experiences/  → Work experience
│   │   │   └── skills/       → Tech skills
│   │   ├── lib/
│   │   │   ├── db.ts         → Drizzle client
│   │   │   └── storage.ts    → File storage helper
│   │   └── index.ts          → Entry point Elysia
│   ├── drizzle.config.ts
│   └── package.json
│
├── frontend/                 → React + Tailwind (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           → Atom components (Button, Card, Badge...)
│   │   │   ├── layout/       → Navbar, Footer, Sidebar
│   │   │   └── sections/     → Hero, Projects, Timeline...
│   │   ├── pages/
│   │   │   ├── public/       → Home, Projects, Posts, PostDetail
│   │   │   └── cms/          → Login, Dashboard, editors
│   │   ├── hooks/            → useAuth, useTypewriter, useDebounce
│   │   ├── lib/
│   │   │   ├── api.ts        → Axios instance + interceptors
│   │   │   └── queryClient.ts
│   │   └── main.tsx
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml        → PostgreSQL + MinIO local
├── .env.example
└── README.md
```

---

## 🛠️ SETUP & INFRA

---

### [ISSUE-001] 🏗️ Project Scaffolding & Struktur Folder

**Labels:** `setup` `infra` `priority:high`

**Deskripsi:**  
Inisialisasi dua project terpisah: `backend/` dan `frontend/`.

**Tasks:**
- [ ] Buat root folder `portfolio-antigravity/`
- [ ] Buat folder `backend/` — init dengan `npm init -y`
- [ ] Buat folder `frontend/` — scaffold dengan Vite
- [ ] Buat `.env.example` dengan semua environment variables yang diperlukan
- [ ] Buat `.gitignore` root: node_modules, .env, dist, .DS_Store
- [ ] Buat `README.md` dengan instruksi singkat cara jalankan

**Perintah Awal:**
```bash
mkdir portfolio-antigravity && cd portfolio-antigravity
mkdir backend frontend

# Init backend
cd backend && npm init -y

# Scaffold frontend
cd ../frontend
npm create vite@latest . -- --template react-ts
npm install
```

**Acceptance Criteria:**
- Struktur folder sesuai diagram di atas
- `.env.example` berisi semua key yang diperlukan

---

### [ISSUE-002] 🐘 Database Setup & Schema PostgreSQL

**Labels:** `database` `infra` `priority:high`

**Deskripsi:**  
Setup PostgreSQL dengan schema lengkap untuk semua fitur portfolio.

**Schema Tables:**

```sql
-- Profil pemilik website
CREATE TABLE profile (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  tagline    TEXT,
  bio        TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  email      VARCHAR(150),
  github_url TEXT,
  linkedin_url TEXT,
  location   VARCHAR(100),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill / Tech Stack
CREATE TABLE skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(80) NOT NULL,
  category    VARCHAR(50),  -- 'frontend'|'backend'|'database'|'tools'
  icon_url    TEXT,
  proficiency SMALLINT CHECK (proficiency BETWEEN 1 AND 5),
  sort_order  SMALLINT DEFAULT 0
);

-- Portfolio Projects
CREATE TABLE projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(150) NOT NULL,
  slug         VARCHAR(170) UNIQUE NOT NULL,
  description  TEXT,
  content      TEXT,          -- Markdown
  thumbnail_url TEXT,
  demo_url     TEXT,
  repo_url     TEXT,
  tech_stack   TEXT[],        -- array nama teknologi
  is_featured  BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Berita / Blog Posts
CREATE TABLE posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(200) NOT NULL,
  slug         VARCHAR(220) UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,          -- Markdown
  cover_url    TEXT,
  tags         TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Work Experience
CREATE TABLE experiences (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company     VARCHAR(120) NOT NULL,
  role        VARCHAR(120) NOT NULL,
  description TEXT,
  tech_stack  TEXT[],
  start_date  DATE NOT NULL,
  end_date    DATE,           -- NULL = present / masih berjalan
  is_current  BOOLEAN DEFAULT FALSE,
  sort_order  SMALLINT DEFAULT 0
);

-- Media / File Uploads
CREATE TABLE media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  mime_type     VARCHAR(80),
  size_bytes    INTEGER,
  url           TEXT NOT NULL,
  alt_text      TEXT,
  uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Admin CMS
CREATE TABLE admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(60) UNIQUE NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id   UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token      TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tasks:**
- [ ] Buat folder `backend/src/db/migrations/`
- [ ] Tulis migration SQL sebagai file terpisah tiap tabel
- [ ] Setup Drizzle ORM + koneksi PostgreSQL
- [ ] Buat `seed.ts` dengan data: profil Rivaldi, 3 sample project, 2 sample post
- [ ] Test koneksi database berhasil di development

**Acceptance Criteria:**
- `npm run db:migrate` create semua tabel tanpa error
- `npm run db:seed` insert data awal berhasil

---

### [ISSUE-003] 🐳 Docker Compose — Database & Storage Lokal

**Labels:** `infra` `devops`

**Deskripsi:**  
Docker Compose untuk menjalankan PostgreSQL dan MinIO (local S3) saat development.

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: portfolio_db
      POSTGRES_USER: portfolio_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfolio_user"]
      interval: 5s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"   # API endpoint
      - "9001:9001"   # Web console
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    volumes:
      - miniodata:/data

volumes:
  pgdata:
  miniodata:
```

**Tasks:**
- [ ] Buat `docker-compose.yml` di root project
- [ ] Dokumentasikan perintah docker di README
- [ ] Test `docker compose up -d` berhasil start keduanya

---

## ⚙️ BACKEND — Elysia.js

---

### [ISSUE-004] 🦊 Elysia.js Server Bootstrap

**Labels:** `backend` `setup` `priority:high`

**Deskripsi:**  
Setup server Elysia.js dengan semua plugin, middleware, dan konfigurasi dasar.

> ⚠️ **Catatan:** Elysia.js berjalan di atas **Bun runtime**, bukan Node.js.  
> Install Bun terpisah: `curl -fsSL https://bun.sh/install | bash`  
> Tapi dependency tetap di-manage dengan `npm` di `package.json`.

**Install Dependencies:**
```bash
cd backend

# Runtime dependencies
npm install elysia @elysiajs/cors @elysiajs/jwt @elysiajs/bearer \
  @elysiajs/swagger drizzle-orm postgres zod slugify bcryptjs

# Dev dependencies
npm install -D drizzle-kit @types/bcryptjs tsx
```

**Konfigurasi `package.json` backend:**
```json
{
  "name": "portfolio-backend",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "bun src/db/migrate.ts",
    "db:seed": "bun src/db/seed.ts",
    "db:studio": "drizzle-kit studio",
    "create-admin": "bun src/scripts/create-admin.ts"
  }
}
```

**Entry point `src/index.ts`:**
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { swagger } from '@elysiajs/swagger'
import { authRoutes } from './modules/auth/routes'
import { publicRoutes } from './modules/public/routes'
import { cmsRoutes } from './modules/cms/routes'

const app = new Elysia()
  .use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  }))
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET!,
  }))
  .use(swagger({
    path: '/docs',
    documentation: {
      info: { title: 'Antigravity Portfolio API', version: '1.0.0' },
      tags: [
        { name: 'Auth', description: 'Autentikasi admin' },
        { name: 'Public', description: 'Endpoint publik' },
        { name: 'CMS', description: 'Content management (auth required)' },
      ],
    },
  }))
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }))
  .use(authRoutes)
  .use(publicRoutes)
  .use(cmsRoutes)
  .listen(process.env.PORT ?? 3000)

console.log(`🚀 Server berjalan di http://localhost:${app.server?.port}`)
console.log(`📚 Swagger UI: http://localhost:${app.server?.port}/docs`)
```

**Tasks:**
- [ ] Install semua dependencies
- [ ] Setup entry point server
- [ ] Konfigurasi CORS, JWT, Swagger
- [ ] Global error handler dengan format response konsisten:
  ```json
  { "success": true, "data": {}, "message": "OK", "meta": { "page": 1 } }
  ```
- [ ] Health check endpoint `GET /health`
- [ ] Request logging dengan timestamp dan duration

**Acceptance Criteria:**
- `npm run dev` berhasil start server di port 3000
- `GET /health` return 200 dengan status ok
- Swagger UI bisa diakses di `/docs`

---

### [ISSUE-005] 🔐 Auth — JWT Authentication untuk CMS

**Labels:** `backend` `auth` `security` `priority:high`

**Deskripsi:**  
Sistem autentikasi admin dengan access token (15 menit) dan refresh token (7 hari).

**Endpoints:**

| Method | Path | Deskripsi |
|--------|------|-----------|
| `POST` | `/auth/login` | Login admin |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/logout` | Revoke refresh token |
| `GET`  | `/auth/me` | Info admin yang sedang login |

**Flow:**
```
POST /auth/login
  → validasi email + password (bcrypt.compare)
  → generate accessToken (JWT, 15m)
  → generate refreshToken (random 64 bytes, simpan hash di DB)
  → return { accessToken, refreshToken, admin: { id, username, email } }

POST /auth/refresh
  → cek refreshToken di DB (belum expired, belum di-revoke)
  → generate accessToken baru
  → rotate refreshToken (hapus lama, insert baru)
  → return { accessToken, refreshToken }

POST /auth/logout
  → hapus refreshToken dari DB
  → return { success: true }
```

**Tasks:**
- [ ] Buat `authPlugin` Elysia — `derive` untuk inject `currentAdmin` ke context
- [ ] Middleware `requireAuth` — cek Bearer token, return 401 jika invalid
- [ ] Hash password dengan bcryptjs (salt rounds: 12)
- [ ] Rate limiting login: max 5 attempt per IP per menit
- [ ] Script CLI `create-admin.ts` untuk buat admin pertama:
  ```bash
  npm run create-admin
  # → prompt: username, email, password
  ```

**Acceptance Criteria:**
- Login berhasil return token pair
- Access protected route tanpa token → 401
- Access protected route dengan token expired → 401
- Refresh token rotation bekerja

---

### [ISSUE-006] 👤 API — Profile

**Labels:** `backend` `feature`

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| `GET` | `/api/profile` | Public | Ambil data profil |
| `PUT` | `/api/cms/profile` | ✅ Admin | Update profil |
| `POST` | `/api/cms/profile/avatar` | ✅ Admin | Upload avatar (multipart) |

**Tasks:**
- [ ] `GET /api/profile` — return semua field publik profil
- [ ] `PUT /api/cms/profile` — update dengan validasi Zod
- [ ] Upload avatar: simpan ke MinIO, update `avatar_url` di DB

---

### [ISSUE-007] 🗂️ API — Projects CRUD

**Labels:** `backend` `feature` `priority:high`

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| `GET` | `/api/projects` | Public | List project published |
| `GET` | `/api/projects/:slug` | Public | Detail project |
| `GET` | `/api/cms/projects` | ✅ Admin | List semua (termasuk draft) |
| `POST` | `/api/cms/projects` | ✅ Admin | Buat project baru |
| `PUT` | `/api/cms/projects/:id` | ✅ Admin | Update project |
| `DELETE` | `/api/cms/projects/:id` | ✅ Admin | Hapus project |
| `PATCH` | `/api/cms/projects/:id/publish` | ✅ Admin | Toggle published |

**Query Params (GET /api/projects):**
```
?page=1&limit=6
?featured=true
?tech=ReactJS
?search=dashboard
?sort=newest|oldest
```

**Tasks:**
- [ ] Implementasi semua endpoint dengan Drizzle ORM
- [ ] Auto-generate slug dari title menggunakan `slugify`
- [ ] Validasi Zod pada semua request body
- [ ] Pagination dengan meta: `{ page, limit, total, totalPages }`
- [ ] Filter multi-param support
- [ ] Upload thumbnail via multipart ke MinIO

---

### [ISSUE-008] 📰 API — Posts (Berita/Blog) CRUD

**Labels:** `backend` `feature` `priority:high`

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| `GET` | `/api/posts` | Public | List post published |
| `GET` | `/api/posts/:slug` | Public | Detail post |
| `GET` | `/api/posts/tags` | Public | Semua tags yang ada |
| `GET` | `/api/cms/posts` | ✅ Admin | List semua (termasuk draft) |
| `POST` | `/api/cms/posts` | ✅ Admin | Buat post baru |
| `PUT` | `/api/cms/posts/:id` | ✅ Admin | Update post |
| `DELETE` | `/api/cms/posts/:id` | ✅ Admin | Hapus post |
| `PATCH` | `/api/cms/posts/:id/publish` | ✅ Admin | Toggle published |

**Tasks:**
- [ ] Semua endpoint dengan pagination
- [ ] Full-text search PostgreSQL menggunakan `to_tsvector` + `to_tsquery`
- [ ] Filter by tags: `?tags=golang,react`
- [ ] Auto-generate excerpt dari content jika field kosong (potong 160 karakter)

---

### [ISSUE-009] 🖼️ API — Media Upload

**Labels:** `backend` `feature`

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| `POST` | `/api/cms/media/upload` | ✅ Admin | Upload file |
| `GET` | `/api/cms/media` | ✅ Admin | List semua media |
| `DELETE` | `/api/cms/media/:id` | ✅ Admin | Hapus media |

**Tasks:**
- [ ] Upload multipart/form-data ke MinIO
- [ ] Validasi: max 5MB, allowed types: `jpg`, `png`, `webp`, `pdf`
- [ ] Generate unique filename: `{timestamp}-{random}-{original}`
- [ ] Return public URL setelah upload berhasil
- [ ] Simpan metadata ke tabel `media`
- [ ] Hapus file dari MinIO saat record di-delete

---

### [ISSUE-010] 💼 API — Experiences & Skills

**Labels:** `backend` `feature`

```
GET    /api/experiences          → Public list (sorted by sort_order)
GET    /api/skills               → Public list, grouped by category
POST   /api/cms/experiences      → Tambah experience
PUT    /api/cms/experiences/:id  → Update experience
DELETE /api/cms/experiences/:id  → Hapus experience
POST   /api/cms/skills           → Tambah skill
PUT    /api/cms/skills/:id       → Update skill
DELETE /api/cms/skills/:id       → Hapus skill
```

**Tasks:**
- [ ] CRUD lengkap untuk kedua resource
- [ ] Response skills digroup per category:
  ```json
  {
    "frontend": [...],
    "backend": [...],
    "database": [...],
    "tools": [...]
  }
  ```
- [ ] Sort order support untuk drag-and-drop reorder

---

## 🎨 FRONTEND — React + Tailwind CSS

---

### [ISSUE-011] ⚛️ React App Bootstrap & Design System

**Labels:** `frontend` `setup` `priority:high`

**Install Dependencies:**
```bash
cd frontend

# UI & Routing
npm install react-router-dom @tanstack/react-query axios

# Animation & Icons
npm install framer-motion lucide-react

# Markdown rendering
npm install react-markdown remark-gfm rehype-highlight

# Form management
npm install react-hook-form @hookform/resolvers zod

# Notifications
npm install react-hot-toast

# Tailwind plugins
npm install -D @tailwindcss/typography
```

**Design Token — `tailwind.config.ts`:**
```typescript
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./src/**/*.{tsx,ts,jsx,js}'],
  theme: {
    extend: {
      colors: {
        // Spotify Green Palette
        'sg': {
          50:  '#edfff4',
          100: '#d4ffea',
          200: '#acffd5',
          300: '#6efdb6',
          400: '#29f284',
          500: '#1db954',  // ← Spotify Green utama
          600: '#0d9f42',
          700: '#0a7d34',
          800: '#0d622c',
          900: '#0c5126',
          950: '#022e14',
        },
        // Dark surfaces (Spotify dark)
        'surface': {
          base:     '#121212',  // Background utama
          elevated: '#181818',  // Card / panel
          overlay:  '#282828',  // Modal / dropdown
          muted:    '#535353',  // Disabled / border
          subtle:   '#b3b3b3',  // Secondary text
        },
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in':    'fadeIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(29,185,84,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(29,185,84,0.6)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config
```

**Load Fonts di `index.html`:**
```html
<!-- Fontshare CDN (gratis, no API key) -->
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=dm-sans@400,500&display=swap" rel="stylesheet">
<!-- JetBrains Mono dari Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Global CSS Reset `src/index.css`:**
```css
@import "tailwindcss";

:root {
  color-scheme: dark;
}

* {
  scroll-behavior: smooth;
}

body {
  background-color: #121212;
  color: #ffffff;
  font-family: 'DM Sans', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Clash Display', sans-serif;
}

/* Skip to content — aksesibilitas */
.skip-to-content {
  position: absolute;
  left: -9999px;
  top: 1rem;
  z-index: 9999;
  padding: 0.5rem 1rem;
  background: #1db954;
  color: #000;
  font-weight: 600;
  border-radius: 4px;
}
.skip-to-content:focus {
  left: 1rem;
}

/* Focus indicator WCAG compliant */
:focus-visible {
  outline: 2px solid #1db954;
  outline-offset: 3px;
  border-radius: 4px;
}
```

**Tasks:**
- [ ] Setup Vite + React + Tailwind CSS
- [ ] Load font Clash Display + DM Sans + JetBrains Mono
- [ ] Buat `src/lib/api.ts` — axios instance dengan auto-attach Authorization header + auto-refresh token on 401
- [ ] Setup React Query `QueryClient` dengan defaults
- [ ] Setup React Router v6 dengan layout routes
- [ ] Buat atom components: `Button`, `Badge`, `Card`, `Skeleton`, `Modal`, `Avatar`
- [ ] `useAuth` hook — manage login state, token storage
- [ ] Verifikasi kontras WCAG AA: `#1db954` on `#121212` → 5.93:1 ✅

---

### [ISSUE-012] 🏠 Halaman Beranda (Public Homepage)

**Labels:** `frontend` `feature` `priority:high`

**Deskripsi:**  
Homepage utama dengan nuansa Antigravity — elemen melayang, energi Spotify Green, scroll reveal.

**Section 1: Hero**
- Avatar dengan `animate-float` + green glow pulse
- Typewriter effect pada subtitle: cycling ["Full Stack Developer", "Frontend Engineer", "Open Source Contributor"]
- Background: `FloatingOrbs` — SVG circles animated dengan blur, opacity rendah, warna hijau-hitam
- Noise texture overlay via CSS
- Counter stats dengan animasi number counting saat scroll into view

**Section 2: About Snippet**
- Foto + bio 2-3 kalimat
- Tombol "Baca Selengkapnya"

**Section 3: Featured Projects**
- 3 cards terfeatured dari API
- Hover: scale(1.02) + green border glow + "Lihat Detail" CTA muncul

**Section 4: Skills Constellation**
- SVG animated — tiap skill sebagai node melayang
- Grouped by category dengan color coding

**Section 5: Latest Posts**
- 3 artikel terbaru — card: cover image + tanggal + tags + excerpt

**Section 6: Experience Timeline**
- Vertical timeline dengan company, role, periode, tech stack

**Section 7: Contact CTA**
- "Punya project keren? Let's build it together."
- Button email + GitHub + LinkedIn

**Tasks:**
- [ ] `HomePage.tsx` dengan semua sections
- [ ] `FloatingOrbs.tsx` — background animated SVG orbs
- [ ] `useTypewriter` hook
- [ ] `useCountUp` hook — animasi counter stats
- [ ] `ProjectCard.tsx` — hover glow effect
- [ ] `PostCard.tsx`
- [ ] `Timeline.tsx` — vertical timeline
- [ ] `SkillsConstellation.tsx` — SVG floating nodes
- [ ] Scroll reveal via Framer Motion `whileInView`
- [ ] Responsif: mobile-first, breakpoint sm/md/lg/xl

---

### [ISSUE-013] 🗂️ Halaman Projects

**Labels:** `frontend` `feature`

**Route:** `/projects` dan `/projects/:slug`

**Tasks:**
- [ ] Grid 3-col desktop / 2-col tablet / 1-col mobile
- [ ] Filter tab by category/tech
- [ ] Search dengan debounce 300ms
- [ ] Infinite scroll atau Load More button (pagination)
- [ ] Skeleton loading saat fetching
- [ ] Halaman detail `/projects/:slug`:
  - Hero image full-width
  - Render Markdown content (`react-markdown` + `remark-gfm`)
  - Tech stack badges
  - Demo URL + Repo URL buttons
  - "← Kembali ke Projects"
  - Related projects (3 project lain)

---

### [ISSUE-014] 📰 Halaman Posts / Berita

**Labels:** `frontend` `feature`

**Route:** `/posts` dan `/posts/:slug`

**Tasks:**
- [ ] List posts: card grid dengan filter tags dan search
- [ ] Tag filter: multi-select (pill buttons)
- [ ] Search dengan debounce
- [ ] Detail `/posts/:slug`:
  - Cover image
  - Title, tanggal, tags, estimated read time
  - Render Markdown: heading, code block (syntax highlight), list, blockquote, table
  - Table of Contents sidebar (auto-generate dari heading H2/H3)
  - Share: copy link ke clipboard
  - "← Kembali ke Berita"

---

### [ISSUE-015] 📱 Navbar, Footer & Layout Responsif

**Labels:** `frontend` `feature` `priority:high`

**Tasks:**
- [ ] `Navbar.tsx`:
  - Logo kiri: nama + dot hijau animasi
  - Links: Beranda / Projects / Berita / Kontak
  - Active state: green underline animated
  - Sticky dengan `backdrop-blur` + semi-transparent background
  - Mobile: hamburger → slide-in overlay menu dengan `aria-expanded` + `aria-controls`
- [ ] `Footer.tsx`: social icons GitHub, LinkedIn, Email + copyright
- [ ] `ScrollToTop.tsx` — button muncul setelah scroll 300px, accessible
- [ ] Skip-to-content link `<a href="#main">` di paling atas dokumen
- [ ] `PublicLayout.tsx` — wrapper Navbar + main + Footer
- [ ] `CMSLayout.tsx` — wrapper Sidebar + main untuk CMS pages

**Responsive Breakpoints:**
| Screen | Layout |
|--------|--------|
| `< 640px` | 1 kolom, hamburger nav |
| `640px–1024px` | 2 kolom, condensed nav |
| `> 1024px` | Full layout, horizontal nav |

---

## 🖥️ CMS (Content Management System)

---

### [ISSUE-016] 🔑 CMS Login Page

**Labels:** `frontend` `cms` `priority:high`

**Route:** `/cms/login`

**Tasks:**
- [ ] Form login: email + password + validasi (React Hook Form + Zod)
- [ ] Toggle show/hide password dengan icon Lucide
- [ ] Loading spinner saat request
- [ ] Error toast merah saat gagal (wrong credentials, network error)
- [ ] Redirect otomatis ke `/cms/dashboard` setelah berhasil
- [ ] Jika sudah login → redirect langsung ke dashboard
- [ ] Design: centered card, logo atas, subtle green glow

---

### [ISSUE-017] 📊 CMS Dashboard

**Labels:** `frontend` `cms`

**Route:** `/cms/dashboard`

**Tasks:**
- [ ] Sidebar dengan active state dan semua navigasi CMS
- [ ] Stats cards: Total Projects, Total Posts, Published, Draft
- [ ] Recent items: 5 project/post terakhir yang diupdate
- [ ] Quick action: "Buat Project Baru", "Tulis Post Baru"
- [ ] Protected route: redirect ke `/cms/login` jika belum auth
- [ ] Token refresh otomatis via axios interceptor

---

### [ISSUE-018] ✏️ CMS — Project Manager

**Labels:** `frontend` `cms` `priority:high`

**Routes:**
- `/cms/projects` — tabel semua project
- `/cms/projects/new` — form buat baru
- `/cms/projects/:id/edit` — form edit

**Form Fields:**
- Title → slug auto-generate (editable)
- Description (textarea, max 300 char)
- Content → **Markdown editor** dengan split preview live
- Tech Stack → tag input (ketik + Enter untuk tambah, klik × untuk hapus)
- Thumbnail → drag & drop upload, preview langsung
- Demo URL + Repo URL
- Featured toggle
- Status (Draft / Published)

**Tasks:**
- [ ] Tabel dengan sort, filter status
- [ ] Confirm modal sebelum delete
- [ ] Toggle publish langsung dari tabel (tanpa masuk form)
- [ ] Form dengan React Hook Form + Zod validation
- [ ] Markdown editor: split view (kiri: tulis, kanan: preview render)
- [ ] Tag input component yang reusable
- [ ] Thumbnail upload dengan preview + hapus
- [ ] Auto-save draft ke `sessionStorage` setiap 30 detik
- [ ] Success/error toast notification

---

### [ISSUE-019] ✏️ CMS — Post Manager (Berita)

**Labels:** `frontend` `cms` `priority:high`

**Routes:**
- `/cms/posts` — tabel semua post
- `/cms/posts/new` — form buat baru
- `/cms/posts/:id/edit` — form edit

**Form Fields:**
- Title → slug auto-generate
- Excerpt (max 200 char, character counter)
- Tags → tag input (multi)
- Cover image → upload + preview
- Content → **Markdown editor** fullscreen-capable dengan toolbar dan live preview
- Status toggle (Draft / Published)

**Tasks:**
- [ ] Semua field dengan validasi
- [ ] Markdown toolbar: Bold, Italic, Heading, Link, Code, Image Insert, List
- [ ] Auto-save draft tiap 30 detik ke `sessionStorage`
- [ ] Word count + read time display realtime
- [ ] Insert gambar dari Media Library modal
- [ ] Preview mode fullscreen

---

### [ISSUE-020] 🖼️ CMS — Media Library

**Labels:** `frontend` `cms`

**Route:** `/cms/media`

**Tasks:**
- [ ] Grid tampilan semua media yang terupload
- [ ] Upload area: drag & drop + klik untuk browse
- [ ] Progress bar + percentage saat upload
- [ ] Copy URL dengan satu klik (ikon clipboard)
- [ ] Preview gambar dalam modal saat diklik
- [ ] Delete dengan konfirmasi (tidak bisa undo)
- [ ] Filter: All / Images / Documents
- [ ] Search by filename

---

### [ISSUE-021] 👤 CMS — Edit Profile

**Labels:** `frontend` `cms`

**Route:** `/cms/profile`

**Tasks:**
- [ ] Form dengan semua field profil
- [ ] Avatar: upload baru / lihat yang sekarang
- [ ] Resume: upload PDF baru
- [ ] Preview perubahan sebelum save (compare mode)
- [ ] Success toast setelah save

---

### [ISSUE-022] 💼 CMS — Experience & Skills Manager

**Labels:** `frontend` `cms`

**Tasks:**
- [ ] List experience: drag-to-reorder (ubah `sort_order`)
- [ ] Modal form add/edit experience: company, role, description, tech stack, start/end date, is_current
- [ ] List skills: grouped by category
- [ ] Modal form add/edit skill: nama, category dropdown, proficiency (1-5 bintang), icon URL
- [ ] Delete dengan konfirmasi untuk keduanya

---

## ♿ AKSESIBILITAS & WCAG

---

### [ISSUE-023] ♿ WCAG 2.1 AA Full Audit & Implementasi

**Labels:** `accessibility` `priority:high`

**1. Perceivable:**
- [ ] Semua text kontras ≥ 4.5:1 (normal) / ≥ 3:1 (large text > 18pt)
- [ ] Semua `<img>` punya `alt` attribute (kosong `alt=""` untuk dekoratif)
- [ ] Informasi tidak disampaikan hanya lewat warna

**2. Operable:**
- [ ] Semua interaksi bisa dilakukan via keyboard
- [ ] Focus order logis (Tab key ikuti visual layout)
- [ ] Focus indicator visible: `outline: 2px solid #1db954; outline-offset: 3px`
- [ ] Skip-to-content link di paling atas dokumen
- [ ] Tidak ada keyboard trap (terutama modal — ESC untuk tutup)
- [ ] Tidak ada konten berkedip > 3x/detik

**3. Understandable:**
- [ ] `<html lang="id">` di semua halaman
- [ ] Semua `<input>` punya `<label>` atau `aria-label`
- [ ] Error message deskriptif
- [ ] Navigasi konsisten di semua halaman

**4. Robust:**
- [ ] Semantic HTML: `<nav>`, `<main id="main">`, `<article>`, `<section>`, `<header>`, `<footer>`
- [ ] Custom components punya ARIA roles: Modal `role="dialog"`, Toast `role="alert"`, Loading `aria-busy="true"`
- [ ] Icon-only buttons punya `aria-label`
- [ ] Hamburger button: `aria-expanded={isOpen}` + `aria-controls="mobile-menu"`

**Tools:**
```bash
npx @axe-core/cli http://localhost:5173 --tags wcag2a,wcag2aa
```

---

## 🧪 TESTING

---

### [ISSUE-024] 🧪 Backend API Testing

**Labels:** `testing` `backend`

```bash
cd backend
npm install -D vitest supertest @types/supertest
```

**Tasks:**
- [ ] Test auth flow: login → access protected → refresh → logout
- [ ] Test CRUD projects: create, read, update, delete, publish
- [ ] Test CRUD posts: semua operasi
- [ ] Test upload: valid file, invalid type, oversized → correct error
- [ ] Test unauthorized: semua CMS route return 401 tanpa token

---

### [ISSUE-025] 🧪 Frontend Testing — Aksesibilitas & Responsif

**Labels:** `testing` `frontend` `accessibility`

```bash
cd frontend
npm install -D @testing-library/react @testing-library/jest-dom jest-axe vitest jsdom
```

**Tasks:**
- [ ] Unit test aksesibilitas pada komponen utama menggunakan `jest-axe`
- [ ] Test keyboard navigation: Tab order, Enter/Space on buttons
- [ ] Visual test responsive di width: 375px, 768px, 1280px

---

## 📦 DEPLOYMENT

---

### [ISSUE-026] 🚀 Production Deployment

**Labels:** `devops` `deployment`

**Rekomendasi Hosting:**
| Service | Untuk | Biaya |
|---------|-------|-------|
| **Railway** | Backend Elysia.js + PostgreSQL | Free tier ada |
| **Vercel** | Frontend React (Vite) | Free tier |
| **Supabase Storage** | File uploads (ganti MinIO prod) | Free 1GB |

**Tasks:**
- [ ] Environment variables production di Railway
- [ ] Build frontend: `npm run build` → output `dist/`
- [ ] `Dockerfile` untuk backend Elysia.js dengan `FROM oven/bun:1`
- [ ] Ganti MinIO dengan Supabase Storage di production
- [ ] Setup CORS production: hanya allow domain Vercel
- [ ] GitHub Actions CI/CD: lint → test → build → deploy ke Railway + Vercel

---

## 📋 Priority Summary

| 🔴 High Priority | 🟡 Medium Priority |
|------------------|--------------------|
| ISSUE-001 (Scaffolding) | ISSUE-003 (Docker) |
| ISSUE-002 (Database Schema) | ISSUE-006 (Profile API) |
| ISSUE-004 (Backend Bootstrap) | ISSUE-009 (Media Upload) |
| ISSUE-005 (Auth JWT) | ISSUE-010 (Experience & Skills) |
| ISSUE-007 (Projects API) | ISSUE-013 (Projects Page) |
| ISSUE-008 (Posts API) | ISSUE-014 (Posts Page) |
| ISSUE-011 (Frontend Setup) | ISSUE-017 (CMS Dashboard) |
| ISSUE-012 (Homepage) | ISSUE-020 (Media Library) |
| ISSUE-015 (Layout & Nav) | ISSUE-021 (Profile CMS) |
| ISSUE-016 (CMS Login) | ISSUE-022 (Exp & Skills CMS) |
| ISSUE-018 (Projects CMS) | ISSUE-024 (Backend Test) |
| ISSUE-019 (Posts CMS) | ISSUE-025 (Frontend Test) |
| ISSUE-023 (WCAG Audit) | ISSUE-026 (Deployment) |

---

## 🏷️ Label Definitions

| Label | Deskripsi |
|-------|-----------|
| `setup` | Konfigurasi awal project |
| `infra` | Infrastructure & DevOps |
| `backend` | Elysia.js API development |
| `frontend` | React UI development |
| `cms` | Fitur Content Management System |
| `database` | Schema & migration PostgreSQL |
| `auth` | Autentikasi & otorisasi JWT |
| `accessibility` | WCAG 2.1 AA compliance |
| `testing` | Unit & integration test |
| `security` | Keamanan: rate limit, sanitasi input |
| `deployment` | Build & hosting |
| `priority:high` | Dikerjakan di sprint pertama |
| `feature` | Fitur baru |
| `bug` | Perbaikan bug |

---

*Generated for Rivaldi Yonathan Nainggolan*  
*Antigravity Portfolio v1.0 — npm · Elysia.js · React · Tailwind CSS · PostgreSQL*
