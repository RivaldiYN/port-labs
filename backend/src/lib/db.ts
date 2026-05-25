import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../db/schema.js'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('[DB] WARNING: DATABASE_URL environment variable is not set!')
}

const queryClient = postgres(DATABASE_URL ?? '', {
  ssl: 'require',
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(queryClient, { schema })

export type Database = typeof db
