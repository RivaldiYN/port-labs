-- =============================================================================
-- Antigravity Portfolio — PostgreSQL Schema + Seed
-- Database : port-labs
-- Encoding : UTF-8
-- =============================================================================
-- Jalankan:
--   psql -U postgres -d port-labs -f antigravity_portfolio.sql
-- =============================================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- uuid_generate_v4() fallback

-- ── Drop tables (safe re-run) ─────────────────────────────────────────────────
DROP TABLE IF EXISTS refresh_tokens  CASCADE;
DROP TABLE IF EXISTS admin_users     CASCADE;
DROP TABLE IF EXISTS media           CASCADE;
DROP TABLE IF EXISTS experiences     CASCADE;
DROP TABLE IF EXISTS posts           CASCADE;
DROP TABLE IF EXISTS projects        CASCADE;
DROP TABLE IF EXISTS skills          CASCADE;
DROP TABLE IF EXISTS profile         CASCADE;

-- =============================================================================
-- TABLES
-- =============================================================================

-- ── profile ───────────────────────────────────────────────────────────────────
CREATE TABLE profile (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  tagline      TEXT,
  bio          TEXT,
  avatar_url   TEXT,
  resume_url   TEXT,
  email        VARCHAR(150),
  github_url   TEXT,
  linkedin_url TEXT,
  location     VARCHAR(100),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── skills ────────────────────────────────────────────────────────────────────
CREATE TABLE skills (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(80)  NOT NULL,
  category     VARCHAR(50),
  icon_url     TEXT,
  proficiency  SMALLINT     CHECK (proficiency BETWEEN 1 AND 5),
  sort_order   SMALLINT     DEFAULT 0
);

-- ── projects ──────────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title          VARCHAR(150) NOT NULL,
  slug           VARCHAR(170) UNIQUE NOT NULL,
  description    TEXT,
  content        TEXT,
  thumbnail_url  TEXT,
  demo_url       TEXT,
  repo_url       TEXT,
  tech_stack     TEXT[],
  is_featured    BOOLEAN      DEFAULT FALSE,
  is_published   BOOLEAN      DEFAULT FALSE,
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ  DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  DEFAULT NOW()
);

-- ── posts ─────────────────────────────────────────────────────────────────────
CREATE TABLE posts (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(200) NOT NULL,
  slug         VARCHAR(220) UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  cover_url    TEXT,
  tags         TEXT[],
  is_published BOOLEAN      DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ── experiences ───────────────────────────────────────────────────────────────
CREATE TABLE experiences (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  company      VARCHAR(120) NOT NULL,
  role         VARCHAR(120) NOT NULL,
  description  TEXT,
  tech_stack   TEXT[],
  start_date   DATE         NOT NULL,
  end_date     DATE,
  is_current   BOOLEAN      DEFAULT FALSE,
  sort_order   SMALLINT     DEFAULT 0
);

-- ── media ─────────────────────────────────────────────────────────────────────
CREATE TABLE media (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  filename       VARCHAR(255) NOT NULL,
  original_name  VARCHAR(255),
  mime_type      VARCHAR(80),
  size_bytes     INTEGER,
  url            TEXT         NOT NULL,
  alt_text       TEXT,
  uploaded_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ── admin_users ───────────────────────────────────────────────────────────────
CREATE TABLE admin_users (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(60)  UNIQUE NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ── refresh_tokens ────────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id   UUID         REFERENCES admin_users(id) ON DELETE CASCADE,
  token      TEXT         NOT NULL,
  expires_at TIMESTAMPTZ  NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_refresh_tokens_token    ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_admin_id ON refresh_tokens(admin_id);
CREATE INDEX idx_projects_slug           ON projects(slug);
CREATE INDEX idx_posts_slug              ON posts(slug);
CREATE INDEX idx_projects_is_published   ON projects(is_published);
CREATE INDEX idx_posts_is_published      ON posts(is_published);

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- ── Profile ───────────────────────────────────────────────────────────────────
INSERT INTO profile (name, tagline, bio, email, github_url, linkedin_url, location)
VALUES (
  'Rivaldi Yonathan Nainggolan',
  'Full Stack Developer · ITERA GPA 3.45',
  'Passionate developer crafting digital experiences where logic meets artistry. Specializing in React, Elysia.js, and PostgreSQL. Based in Lampung, Indonesia.',
  'aldinggln9@gmail.com',
  'https://github.com/RivaldiYN',
  'https://linkedin.com/in/rivaldiyn',
  'Lampung, Indonesia'
);

-- ── Skills ────────────────────────────────────────────────────────────────────
INSERT INTO skills (name, category, proficiency, sort_order) VALUES
  ('JavaScript',   'language',  5, 1),
  ('TypeScript',   'language',  4, 2),
  ('React',        'frontend',  5, 3),
  ('Next.js',      'frontend',  4, 4),
  ('Tailwind CSS', 'frontend',  5, 5),
  ('Elysia.js',    'backend',   4, 6),
  ('Laravel',      'backend',   4, 7),
  ('PostgreSQL',   'database',  4, 8),
  ('Redis',        'database',  3, 9),
  ('Drizzle ORM',  'database',  4, 10),
  ('Docker',       'devops',    3, 11),
  ('Git',          'devops',    5, 12),
  ('OpenStreetMap','tools',     3, 13),
  ('Figma',        'tools',     4, 14),
  ('Node.js',      'backend',   4, 15);

-- ── Experiences ───────────────────────────────────────────────────────────────
INSERT INTO experiences (company, role, description, tech_stack, start_date, is_current, sort_order)
VALUES
  (
    'PT Technova Solusi Integrasi',
    'Frontend Developer',
    'Developing ReactJS monitoring dashboard with OpenStreetMap & Machine Learning integration. Led UI/UX for field management system used by hundreds of users daily.',
    ARRAY['ReactJS', 'TypeScript', 'OpenStreetMap', 'Machine Learning', 'REST API'],
    '2025-01-01',
    TRUE, 1
  ),
  (
    'PT Kimia Farma Tbk',
    'Full Stack Developer Intern',
    'Built internal HRIS system including payroll automation, QR-based attendance, and Redis-cached reporting for optimized performance.',
    ARRAY['Laravel', 'PostgreSQL', 'Redis', 'PHP', 'Bootstrap'],
    '2025-01-01',
    TRUE, 2
  );

-- ── Projects ──────────────────────────────────────────────────────────────────
INSERT INTO projects (title, slug, description, tech_stack, is_featured, is_published, published_at)
VALUES
  (
    'Dashboard ML Monitoring',
    'dashboard-ml-monitoring',
    'Real-time monitoring dashboard with Machine Learning integration and OpenStreetMap heatmap for PT Technova Solusi Integrasi.',
    ARRAY['ReactJS', 'TypeScript', 'OpenStreetMap', 'REST API'],
    TRUE, TRUE, NOW()
  ),
  (
    'HRIS — PT Kimia Farma',
    'hris-kimia-farma',
    'Internal Human Resource Information System with payroll automation, QR attendance, and Redis-cached reporting.',
    ARRAY['Laravel', 'PostgreSQL', 'Redis', 'PHP'],
    TRUE, TRUE, NOW()
  ),
  (
    'Antigravity Portfolio',
    'antigravity-portfolio',
    'This portfolio with CMS — Elysia.js API + React frontend + Drizzle ORM. WCAG 2.1 AA compliant with glassmorphism design.',
    ARRAY['Elysia.js', 'React', 'TypeScript', 'Drizzle ORM', 'PostgreSQL', 'Tailwind CSS'],
    TRUE, TRUE, NOW()
  );

-- ── Posts ─────────────────────────────────────────────────────────────────────
INSERT INTO posts (title, slug, excerpt, content, tags, is_published, published_at)
VALUES
  (
    'Architecting the Antigravity Interface',
    'architecting-the-antigravity-interface',
    'Modern web design has become a series of boxes within boxes. To break free, we must embrace a philosophy where elements exist in a state of weightless orbit.',
    '# Architecting the Antigravity Interface

Modern web design has become a series of boxes within boxes. To break free, we must embrace a philosophy where elements exist in a state of weightless orbit—anchored by intent rather than rigid grids.

## The Kinetic Void Principle

The "Kinetic Void" isn''t just an aesthetic; it''s a structural mandate. Space is active, not passive.

## Implementation

Applying this to code requires a departure from standard component libraries.',
    ARRAY['engineering', 'design', 'react', 'elysia'],
    TRUE, NOW()
  ),
  (
    'Kenapa Saya Memilih Elysia.js untuk Backend Portfolio',
    'kenapa-memilih-elysia-js',
    'Elysia.js menawarkan type-safety end-to-end, performa tinggi, dan ekosistem plugin yang lengkap — pilihan ideal untuk portfolio modern.',
    '# Kenapa Saya Memilih Elysia.js

Elysia.js menawarkan type-safety end-to-end dengan Eden Treaty, performa tinggi berbasis Bun/Node, dan ekosistem plugin lengkap.',
    ARRAY['backend', 'elysia', 'nodejs', 'typescript'],
    FALSE, NULL
  );

-- =============================================================================
-- ADMIN USER
-- =============================================================================
-- PENTING: Ganti password hash di bawah dengan hash bcrypt yang benar!
-- Untuk generate hash, jalankan: npm run create-admin (di folder backend)
-- Password dibawah adalah: admin123 (HANYA UNTUK DEVELOPMENT)
-- JANGAN gunakan di production tanpa mengganti password!
-- =============================================================================
-- Hash bcrypt untuk "admin123" (cost 12):
INSERT INTO admin_users (username, email, password_hash)
VALUES (
  'admin',
  'aldinggln9@gmail.com',
  '$2a$12$e8fXBYrS0oXqFGGgY2as8epEkD0iWIXiqiv5xO6a0B6vXkPaUwbwG'
)
ON CONFLICT (username) DO NOTHING;
-- Password: admin123 (bcrypt cost 12)
-- GANTI password via: UPDATE admin_users SET password_hash = '$2a$12$...' WHERE username = 'admin';

-- =============================================================================
-- VERIFICATION QUERIES (run after import to verify)
-- =============================================================================
-- SELECT 'profile'     AS tbl, COUNT(*) FROM profile;
-- SELECT 'skills'      AS tbl, COUNT(*) FROM skills;
-- SELECT 'experiences' AS tbl, COUNT(*) FROM experiences;
-- SELECT 'projects'    AS tbl, COUNT(*) FROM projects;
-- SELECT 'posts'       AS tbl, COUNT(*) FROM posts;
-- SELECT 'admin_users' AS tbl, COUNT(*) FROM admin_users;
-- =============================================================================
