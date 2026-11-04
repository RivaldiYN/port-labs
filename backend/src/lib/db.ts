import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '../db/schema.js'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('[DB] WARNING: DATABASE_URL environment variable is not set!')
}

const sql = neon(DATABASE_URL ?? '')

export const db = drizzle(sql, { schema })

export type Database = typeof db
