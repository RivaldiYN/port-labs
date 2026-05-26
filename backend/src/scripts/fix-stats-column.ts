import 'dotenv/config'
import postgres from 'postgres'

async function fix() {
  console.log('🔌 Connecting to database...')
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    max: 1,
  })

  try {
    // Add stats column if missing
    console.log('📊 Adding stats column...')
    await sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS stats text[]`
    console.log('✅ stats column added (or already existed)')

    // Update existing rows that have null stats
    await sql`
      UPDATE profile
      SET stats = ARRAY['4+|Years Building', '20+|Projects Shipped', '3.45|GPA Excellence']
      WHERE stats IS NULL
    `
    console.log('✅ stats populated for existing rows')

    // Check if there's any profile row
    const rows = await sql`SELECT id, name FROM profile LIMIT 1`
    if (rows.length === 0) {
      console.log('⚠️  No profile row found — inserting seed...')
      await sql`
        INSERT INTO profile (name, tagline, bio, email, github_url, linkedin_url, location, stats)
        VALUES (
          'Rivaldi Yonathan Nainggolan',
          'Full Stack Developer — Building the Impossible.',
          'Passionate Full Stack Developer with experience in ReactJS, Elysia.js, Laravel & PostgreSQL.',
          'aldinggln9@gmail.com',
          'https://github.com/RivaldiYN',
          'https://linkedin.com/in/rivaldiyn',
          'Lampung, Indonesia',
          ARRAY['4+|Years Building', '20+|Projects Shipped', '3.45|GPA Excellence']
        )
        ON CONFLICT DO NOTHING
      `
      console.log('✅ Profile seeded')
    } else {
      console.log(`✅ Profile already exists: ${rows[0].name}`)
    }
  } finally {
    await sql.end()
    console.log('🔌 Connection closed.')
  }
}

fix().catch(e => {
  console.error('❌ Fix failed:', e)
  process.exit(1)
})
