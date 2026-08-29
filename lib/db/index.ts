import 'server-only'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

const connectionString = process.env.BGM_DB_DATABASE_URL ?? process.env.DATABASE_URL

// Keep route modules build-safe; the runtime route still fails clearly if Neon
// is missing when a webhook is actually received.
export const pool = new Pool({ connectionString: connectionString ?? undefined, max: 5 })
export const db = drizzle(pool, { schema })
