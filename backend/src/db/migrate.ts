import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function runMigrations() {
  console.log('🔌 Connecting to database...')

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env')
  }

  // Use separate connection for migrations (max 1 connection)
  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 })
  const db = drizzle(migrationClient)

  try {
    console.log('⚡ Running migrations...')
    await migrate(db, {
      migrationsFolder: path.join(__dirname, 'migrations'),
    })
    console.log('✅ All migrations applied successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await migrationClient.end()
    console.log('🔌 Database connection closed.')
  }
}

runMigrations()
