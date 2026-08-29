import { Pool } from 'pg'

export function requireIsolatedTestDatabase() {
  const url = process.env.PHASE2_TEST_DATABASE_URL
  if (!url) throw new Error('PHASE2_TEST_DATABASE_URL is required; refusing to run Phase II integration tests without an isolated database')
  if (/quiet-night-03253538|BGM_DB_DATABASE_URL|DATABASE_URL/.test(url)) throw new Error('Refusing to run Phase II integration tests against the connected production database')
  return new Pool({ connectionString: url, max: 2 })
}

export async function resetPhase2TestData(pool: Pool) {
  await pool.query('TRUNCATE TABLE payments, crm_sync_state, stripe_webhook_events, reservations RESTART IDENTITY CASCADE')
}
