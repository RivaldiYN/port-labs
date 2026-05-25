ALTER TABLE "profile" ADD COLUMN IF NOT EXISTS "stats" text[];
--> statement-breakpoint
-- Seed default stats for existing profile rows
UPDATE "profile"
SET "stats" = ARRAY['4+|Years Building', '20+|Projects Shipped', '3.45|GPA Excellence']
WHERE "stats" IS NULL;
