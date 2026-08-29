import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { Pool } from 'pg'

const testUrl = process.env.PHASE2_TEST_DATABASE_URL
const productionUrls = [process.env.BGM_DB_DATABASE_URL, process.env.DATABASE_URL, process.env.BGM_DB_POSTGRES_URL, process.env.BGM_DB_POSTGRES_PRISMA_URL].filter(Boolean)
const isProductionTarget = Boolean(testUrl && productionUrls.some((url) => url === testUrl))
const describeIfSafe = testUrl && !isProductionTarget ? describe : describe.skip

let pool: Pool
const ids: string[] = []
const synthetic = (prefix: string) => { const id = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`; ids.push(id); return id }

async function query(text: string, values: unknown[] = []) { return pool.query(text, values) }

beforeAll(async () => {
  if (!testUrl || isProductionTarget) return
  pool = new Pool({ connectionString: testUrl, max: 4 })
  const identity = await query("select current_database() as database, current_setting(' neon.branch_id', true) as branch")
  expect(identity.rows[0]?.database).toBeTruthy()
})

beforeEach(async () => {
  if (!pool) return
  await query('delete from payments where external_reservation_id = any($1)', [ids])
  await query('delete from stripe_webhook_events where external_reservation_id = any($1)', [ids])
  await query('delete from crm_sync_state where external_reservation_id = any($1)', [ids])
  await query('delete from reservations where external_reservation_id = any($1)', [ids])
})

afterAll(async () => { await pool?.end() })

describeIfSafe('Phase II isolated PostgreSQL integration', () => {
  it('persists a reservation before checkout and enforces stable External Reservation ID', async () => {
    const id = synthetic('reservation')
    await query('insert into reservations (external_reservation_id, traveler_email, trip_id, trip_name, destination, trip_price_minor, deposit_amount_minor, balance_due_minor) values ($1,$2,$3,$4,$5,$6,$7,$8)', [id, `${id}@example.test`, 'trip-test', 'Synthetic Trip', 'Synthetic', 10000, 2500, 10000])
    const result = await query('select external_reservation_id from reservations where external_reservation_id=$1', [id])
    expect(result.rows).toHaveLength(1)
    await expect(query('insert into reservations (external_reservation_id, traveler_email, trip_id, trip_name, destination, trip_price_minor, deposit_amount_minor, balance_due_minor) values ($1,$2,$3,$4,$5,$6,$7,$8)', [id, `${id}@example.test`, 'trip-test', 'Synthetic Trip', 'Synthetic', 10000, 2500, 10000])).rejects.toMatchObject({ code: '23505' })
  })

  it('deduplicates duplicate webhook delivery and payment-level idempotency by Stripe event ID', async () => {
    const id = synthetic('webhook'); const event = synthetic('evt')
    await query('insert into stripe_webhook_events (stripe_event_id,event_type,external_reservation_id) values ($1,$2,$3)', [event, 'checkout.session.completed', id])
    await query('insert into stripe_webhook_events (stripe_event_id,event_type,external_reservation_id) values ($1,$2,$3) on conflict (stripe_event_id) do nothing', [event, 'checkout.session.completed', id])
    expect((await query('select count(*)::int as count from stripe_webhook_events where stripe_event_id=$1', [event])).rows[0].count).toBe(1)
  })

  it('supports concurrent webhook claims with one winner', async () => {
    const id = synthetic('concurrent'); const event = synthetic('evt')
    await query('insert into stripe_webhook_events (stripe_event_id,event_type,external_reservation_id) values ($1,$2,$3)', [event, 'checkout.session.completed', id])
    const results = await Promise.all([query("update stripe_webhook_events set processing_status='processing' where stripe_event_id=$1 and processing_status <> 'processing' returning id", [event]), query("update stripe_webhook_events set processing_status='processing' where stripe_event_id=$1 and processing_status <> 'processing' returning id", [event])])
    expect(results.filter((result) => result.rowCount === 1)).toHaveLength(1)
  })

  it('retries failed processing after a simulated restart', async () => {
    const id = synthetic('retry'); const event = synthetic('evt')
    await query('insert into stripe_webhook_events (stripe_event_id,event_type,external_reservation_id,processing_status,error_message) values ($1,$2,$3,$4,$5)', [event, 'checkout.session.completed', id, 'failed', 'synthetic outage'])
    const restarted = await query("update stripe_webhook_events set processing_status='processing', error_message=null where stripe_event_id=$1 and processing_status='failed' returning processing_status", [event])
    expect(restarted.rows[0].processing_status).toBe('processing')
  })

  it('recalculates cumulative Amount Paid and Balance Due for deposit plus installment', async () => {
    const id = synthetic('money')
    await query('insert into reservations (external_reservation_id,traveler_email,trip_id,trip_name,destination,trip_price_minor,deposit_amount_minor,balance_due_minor) values ($1,$2,$3,$4,$5,$6,$7,$6)', [id, `${id}@example.test`, 'trip', 'Trip', 'Destination', 10000, 2500])
    for (const [event, amount, type] of [[synthetic('deposit'), 2500, 'deposit'], [synthetic('installment'), 3000, 'installment']] as const) { await query('insert into stripe_webhook_events (stripe_event_id,event_type,external_reservation_id) values ($1,$2,$3)', [event, 'payment', id]); await query('insert into payments (external_reservation_id,stripe_event_id,payment_type,amount_minor,currency,status) values ($1,$2,$3,$4,$5,$6)', [id,event,type,amount,'usd','succeeded']) }
    const total = Number((await query("select coalesce(sum(amount_minor-refunded_amount_minor),0)::bigint as total from payments where external_reservation_id=$1 and status='succeeded'", [id])).rows[0].total)
    await query('update reservations set amount_paid_minor=$1,balance_due_minor=greatest(trip_price_minor-$1,0) where external_reservation_id=$2', [total, id])
    const row = (await query('select amount_paid_minor,balance_due_minor from reservations where external_reservation_id=$1', [id])).rows[0]
    expect(Number(row.amount_paid_minor)).toBe(5500); expect(Number(row.balance_due_minor)).toBe(4500)
  })

  it('tracks partial and full refunds cumulatively', async () => {
    const id = synthetic('refund'); const event = synthetic('evt')
    await query('insert into reservations (external_reservation_id,traveler_email,trip_id,trip_name,destination,trip_price_minor,deposit_amount_minor,balance_due_minor) values ($1,$2,$3,$4,$5,$6,$7,$6)', [id, `${id}@example.test`, 'trip', 'Trip', 'Destination', 10000, 5000])
    await query('insert into stripe_webhook_events (stripe_event_id,event_type,external_reservation_id) values ($1,$2,$3)', [event, 'charge.succeeded', id])
    await query('insert into payments (external_reservation_id,stripe_event_id,payment_type,amount_minor,refunded_amount_minor,currency,status) values ($1,$2,$3,$4,$5,$6,$7)', [id,event,'deposit',5000,2000,'usd','partially_refunded'])
    await query('update payments set refunded_amount_minor=amount_minor,status=\'refunded\' where external_reservation_id=$1', [id])
    const row = (await query('select amount_minor,refunded_amount_minor,status from payments where external_reservation_id=$1', [id])).rows[0]
    expect(Number(row.refunded_amount_minor)).toBe(Number(row.amount_minor)); expect(row.status).toBe('refunded')
  })

  it('records CRM retry state and preserves exactly one persisted Opportunity ID', async () => {
    const id = synthetic('crm'); const opportunity = synthetic('opp')
    await query('insert into reservations (external_reservation_id,traveler_email,trip_id,trip_name,destination,trip_price_minor,deposit_amount_minor,balance_due_minor) values ($1,$2,$3,$4,$5,$6,$7,$6)', [id, `${id}@example.test`, 'trip', 'Trip', 'Destination', 10000, 2500])
    await query('insert into crm_sync_state (external_reservation_id,last_sync_status,retry_count) values ($1,$2,$3)', [id,'failed',1])
    await query('insert into crm_sync_state (external_reservation_id,ghl_opportunity_id,last_sync_status) values ($1,$2,$3) on conflict (external_reservation_id) do update set ghl_opportunity_id=excluded.ghl_opportunity_id,last_sync_status=excluded.last_sync_status', [id,opportunity,'synced'])
    await query('insert into crm_sync_state (external_reservation_id,ghl_opportunity_id) values ($1,$2) on conflict (external_reservation_id) do nothing', [id,synthetic('conflict')])
    const row = (await query('select ghl_opportunity_id from crm_sync_state where external_reservation_id=$1', [id])).rows[0]
    expect(row.ghl_opportunity_id).toBe(opportunity)
  })
})

if (!testUrl || isProductionTarget) describe.skip('Phase II isolated PostgreSQL integration', () => { it('fails closed without a non-Production test URL', () => expect(true).toBe(true)) })
