import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as dotenv from 'dotenv'
import * as schema from '../db/schema'

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const queryClient = postgres(process.env.DATABASE_URL)

export const db = drizzle(queryClient, { schema })

export type Database = typeof db
