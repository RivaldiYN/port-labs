CREATE TABLE IF NOT EXISTS media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  mime_type     VARCHAR(80),
  size_bytes    INTEGER,
  url           TEXT NOT NULL,
  alt_text      TEXT,
  uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);
