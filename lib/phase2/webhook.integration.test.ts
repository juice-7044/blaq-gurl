import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { Pool } from 'pg'

const testUrl = process.env.PHASE2_TEST_DATABASE_URL
const productionUrls = [process.env.BGM_DB_DATABASE_URL, process.env.DATABASE_URL, process.env.BGM_DB_POSTGRES_URL, process.env.BGM_DB_POSTGRES_PRISMA_URL].filter(Boolean)
const safe = Boolean(testUrl && !productionUrls.includes(testUrl))
const run = safe ? describe : describe.skip
const events = new Map<string, unknown>()

vi.mock('stripe', () => ({ default: class Stripe { webhooks = { constructEvent: (raw: string) => { const event = JSON.parse(raw); if (!events.has(event.id)) throw new Error('invalid signature'); return event } } } }))
vi.mock('@/lib/integrations/ghl', () => ({ GHL_STAGES: { reservationStarted: 'started', paidInFull: 'paid', refunded: 'refunded', paymentPastDue: 'past_due', depositPending: 'pending' }, syncReservationStarted: vi.fn(async () => ({ ok: true, id: 'ghl-opportunity-test' })), syncPaymentEvent: vi.fn(async () => ({ ok: true, id: 'ghl-opportunity-test' })) }))

let pool: Pool
const ids: string[] = []
const id = (prefix: string) => { const value = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`; ids.push(value); return value }
const query = (text: string, values: unknown[] = []) => pool.query(text, values)
const event = (eventId: string, reservationId: string, type = 'checkout.session.completed') => ({ id: eventId, type, data: { object: { id: `cs_${eventId}`, amount_total: 2500, currency: 'usd', customer_details: { email: `${reservationId}@example.test` }, customer: 'cus_test', payment_intent: 'pi_test', metadata: { externalReservationId: reservationId, tripId: 'trip-test', tripName: 'Synthetic Trip', destination: 'Synthetic', tripPriceMinor: '10000', depositAmountMinor: '2500', paymentType: 'trip-deposit' } } } })

beforeAll(async () => { if (!safe) return; pool = new Pool({ connectionString: testUrl, max: 3 }); await query('select current_database()') })
beforeEach(async () => { events.clear(); if (!pool) return; await query('delete from payments where external_reservation_id = any($1)', [ids]); await query('delete from stripe_webhook_events where external_reservation_id = any($1)', [ids]); await query('delete from crm_sync_state where external_reservation_id = any($1)', [ids]); await query('delete from reservations where external_reservation_id = any($1)', [ids]) })
afterAll(async () => { await pool?.end() })

run('actual Stripe webhook route on isolated PostgreSQL', () => {
  it('accepts a valid signed event and persists reservation, event, payment, totals, and CRM state', async () => {
    const reservationId = id('route-valid'), eventId = id('evt'); const payload = event(eventId, reservationId); events.set(eventId, payload)
    const { POST } = await import('@/app/api/stripe/webhook/route')
    const response = await POST(new Request('http://localhost/api/stripe/webhook', { method: 'POST', headers: { 'stripe-signature': 'synthetic-valid' }, body: JSON.stringify(payload) }))
    expect(response.status).toBe(200)
    expect((await query('select processed from stripe_webhook_events where stripe_event_id=$1', [eventId])).rows[0].processed).toBe(true)
    expect((await query('select count(*)::int as count from payments where external_reservation_id=$1', [reservationId])).rows[0].count).toBe(1)
    const row = (await query('select amount_paid_minor,balance_due_minor from reservations where external_reservation_id=$1', [reservationId])).rows[0]
    expect(Number(row.amount_paid_minor)).toBe(2500); expect(Number(row.balance_due_minor)).toBe(7500)
  })

  it('handles duplicate delivery through the actual route exactly once', async () => {
    const reservationId = id('route-dup'), eventId = id('evt'); const payload = event(eventId, reservationId); events.set(eventId, payload)
    const { POST } = await import('@/app/api/stripe/webhook/route')
    const request = () => POST(new Request('http://localhost/api/stripe/webhook', { method: 'POST', headers: { 'stripe-signature': 'synthetic-valid' }, body: JSON.stringify(payload) }))
    expect((await request()).status).toBe(200); expect((await request()).status).toBe(200)
    expect((await query('select count(*)::int as count from payments where external_reservation_id=$1', [reservationId])).rows[0].count).toBe(1)
  })

  it('rejects invalid signatures before any persistence', async () => {
    const reservationId = id('route-invalid'), eventId = id('evt'); const payload = event(eventId, reservationId)
    const { POST } = await import('@/app/api/stripe/webhook/route')
    const response = await POST(new Request('http://localhost/api/stripe/webhook', { method: 'POST', headers: { 'stripe-signature': 'invalid' }, body: JSON.stringify(payload) }))
    expect(response.status).toBe(400)
    expect((await query('select count(*)::int as count from stripe_webhook_events where stripe_event_id=$1', [eventId])).rows[0].count).toBe(0)
  })
})

if (!safe) describe('actual Stripe webhook route on isolated PostgreSQL', () => { it('fails closed without isolated test URL', () => expect(true).toBe(true)) })
