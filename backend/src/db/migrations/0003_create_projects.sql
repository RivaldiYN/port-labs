CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(150) NOT NULL,
  slug          VARCHAR(170) UNIQUE NOT NULL,
  description   TEXT,
  content       TEXT,
  thumbnail_url TEXT,
  demo_url      TEXT,
  repo_url      TEXT,
  tech_stack    TEXT[],
  is_featured   BOOLEAN DEFAULT FALSE,
  is_published  BOOLEAN DEFAULT FALSE,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
