import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { neon } from '@neondatabase/serverless'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function runMigrations() {
  console.log('Connecting to Neon database...')

  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in .env')
  }

  const sql = neon(connectionString)
  const db = drizzle(sql)

  try {
    console.log('Running migrations...')
    await migrate(db, {
      migrationsFolder: path.join(__dirname, 'migrations'),
    })
    console.log('All migrations applied successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
