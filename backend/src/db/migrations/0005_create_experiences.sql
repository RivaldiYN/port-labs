CREATE TABLE IF NOT EXISTS experiences (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company     VARCHAR(120) NOT NULL,
  role        VARCHAR(120) NOT NULL,
  description TEXT,
  tech_stack  TEXT[],
  start_date  DATE NOT NULL,
  end_date    DATE,
  is_current  BOOLEAN DEFAULT FALSE,
  sort_order  SMALLINT DEFAULT 0
);
