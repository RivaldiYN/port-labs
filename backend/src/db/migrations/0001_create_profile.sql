CREATE TABLE IF NOT EXISTS profile (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
