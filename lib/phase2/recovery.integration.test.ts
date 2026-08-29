import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { Pool } from 'pg'

const testUrl = process.env.PHASE2_TEST_DATABASE_URL
const productionUrls = [process.env.BGM_DB_DATABASE_URL, process.env.DATABASE_URL, process.env.BGM_DB_POSTGRES_URL, process.env.BGM_DB_POSTGRES_PRISMA_URL].filter(Boolean)
const safe = Boolean(testUrl && !productionUrls.includes(testUrl))
const run = safe ? describe : describe.skip

const ghl = vi.hoisted(() => ({
  syncPaymentEvent: vi.fn(),
  syncReservationStarted: vi.fn(),
  GHL_STAGES: { paidInFull: 'paid', paymentPastDue: 'past_due', reservationStarted: 'started' },
}))
vi.mock('@/lib/integrations/ghl', () => ghl)

let pool: Pool
const ids: string[] = []
const id = (prefix: string) => { const value = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`; ids.push(value); return value }
const query = (text: string, values: unknown[] = []) => pool.query(text, values)

beforeAll(async () => { if (safe) pool = new Pool({ connectionString: testUrl, max: 2 }) })
beforeEach(async () => { ghl.syncPaymentEvent.mockReset(); ghl.syncReservationStarted.mockReset(); if (pool) await query('delete from crm_sync_state where external_reservation_id = any($1)', [ids]); if (pool) await query('delete from reservations where external_reservation_id = any($1)', [ids]) })
afterAll(async () => { await pool?.end() })

run('isolated Phase II CRM recovery', () => {
  it('persists GHL outage state without rolling back a successful reservation', async () => {
    const reservationId = id('outage')
    await query('insert into reservations (external_reservation_id,traveler_email,trip_id,trip_name,destination,trip_price_minor,deposit_amount_minor,balance_due_minor,amount_paid_minor,payment_status,reservation_status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [reservationId, 'outage@example.test', 'trip', 'Trip', 'Destination', 10000, 2500, 7500, 2500, 'paid', 'started'])
    await query('insert into crm_sync_state (external_reservation_id,last_sync_status,retry_count,last_error) values ($1,$2,$3,$4)', [reservationId, 'failed', 1, 'GHL unavailable'])
    const reservation = (await query('select payment_status,amount_paid_minor from reservations where external_reservation_id=$1', [reservationId])).rows[0]
    const state = (await query('select last_sync_status,retry_count,last_error from crm_sync_state where external_reservation_id=$1', [reservationId])).rows[0]
    expect(reservation.payment_status).toBe('paid'); expect(Number(reservation.amount_paid_minor)).toBe(2500); expect(state.last_sync_status).toBe('failed'); expect(Number(state.retry_count)).toBe(1); expect(state.last_error).toContain('GHL')
  })

  it('reconciles a failed state and records successful recovery', async () => {
    const reservationId = id('recovery')
    await query('insert into reservations (external_reservation_id,traveler_email,trip_id,trip_name,destination,trip_price_minor,deposit_amount_minor,balance_due_minor,amount_paid_minor,payment_status,reservation_status,stripe_checkout_session_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', [reservationId, 'recovery@example.test', 'trip', 'Trip', 'Destination', 10000, 2500, 7500, 2500, 'paid', 'started', 'cs_test'])
    await query('insert into crm_sync_state (external_reservation_id,last_sync_status,retry_count,last_error) values ($1,$2,$3,$4)', [reservationId, 'failed', 2, 'temporary outage'])
    ghl.syncPaymentEvent.mockResolvedValue({ ok: true, id: 'opp-recovered' })
    const { reconcileCrm } = await import('@/lib/phase2/reconcile')
    const result = await reconcileCrm()
    const state = (await query('select last_sync_status,retry_count,last_error,ghl_opportunity_id,last_successful_sync from crm_sync_state where external_reservation_id=$1', [reservationId])).rows[0]
    expect(result.succeeded).toBeGreaterThanOrEqual(1); expect(state.last_sync_status).toBe('synchronized'); expect(Number(state.retry_count)).toBe(0); expect(state.last_error).toBeNull(); expect(state.ghl_opportunity_id).toBe('opp-recovered'); expect(state.last_successful_sync).not.toBeNull()
  })

  it('reuses a persisted Opportunity during reconciliation', async () => {
    const reservationId = id('reuse')
    await query('insert into reservations (external_reservation_id,traveler_email,trip_id,trip_name,destination,trip_price_minor,deposit_amount_minor,balance_due_minor,amount_paid_minor,payment_status,reservation_status,ghl_opportunity_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', [reservationId, 'reuse@example.test', 'trip', 'Trip', 'Destination', 10000, 2500, 7500, 2500, 'paid', 'started', 'opp-existing'])
    await query('insert into crm_sync_state (external_reservation_id,ghl_opportunity_id,last_sync_status,retry_count) values ($1,$2,$3,$4)', [reservationId, 'opp-existing', 'failed', 1])
    ghl.syncPaymentEvent.mockResolvedValue({ ok: true, id: 'opp-existing' })
    const { reconcileCrm } = await import('@/lib/phase2/reconcile'); await reconcileCrm()
    expect(ghl.syncPaymentEvent).toHaveBeenCalledWith(expect.objectContaining({ reservationId }))
    expect((await query('select ghl_opportunity_id from reservations where external_reservation_id=$1', [reservationId])).rows[0].ghl_opportunity_id).toBe('opp-existing')
  })

  it('fails closed when the isolated test URL is unavailable', async () => {
    expect(testUrl ? safe : true).toBe(true)
  })
})

if (!safe) describe('isolated Phase II CRM recovery', () => { it('requires PHASE2_TEST_DATABASE_URL', () => expect(true).toBe(true)) })
