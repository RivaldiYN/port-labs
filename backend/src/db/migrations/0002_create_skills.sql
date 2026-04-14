CREATE TABLE IF NOT EXISTS skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(80) NOT NULL,
  category    VARCHAR(50),
  icon_url    TEXT,
  proficiency SMALLINT CHECK (proficiency BETWEEN 1 AND 5),
  sort_order  SMALLINT DEFAULT 0
);
