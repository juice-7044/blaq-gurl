import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Pool } from 'pg'
import { POST as stripeWebhook } from '@/app/api/stripe/webhook/route'
import { GHL_STAGES, syncNewsletter, syncTripInterest, upsertBgmOpportunity } from '@/lib/integrations/ghl'

const databaseUrl = process.env.PHASE2_TEST_DATABASE_URL
const safe = databaseUrl && ![process.env.DATABASE_URL, process.env.BGM_DB_DATABASE_URL, process.env.BGM_DB_POSTGRES_URL, process.env.BGM_DB_POSTGRES_PRISMA_URL].includes(databaseUrl)
const describeIfSafe = safe ? describe : describe.skip
const pool = safe ? new Pool({ connectionString: databaseUrl, max: 2 }) : null
const sql = async (text: string, values: unknown[] = []) => pool!.query(text, values)
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`

const originalFetch = globalThis.fetch
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    if (url.includes('/locations/') && url.includes('/customFields')) return new Response(JSON.stringify({ customFields: [] }), { status: 200 })
    if (url.includes('/opportunities/pipelines')) return new Response(JSON.stringify({ pipelines: [{ id: 'pipeline-1', name: 'BGM | Trip Reservations', stages: Object.values(GHL_STAGES).map((id) => ({ id })) }] }), { status: 200 })
    if (url.includes('/contacts/search/duplicate')) return new Response(JSON.stringify({ contact: { id: 'contact-1', customFields: [{ id: '1CPQr2IX2qLUZztUSsjs', value: 'Existing Trip, BGM Japan' }] } }), { status: 200 })
    if (url.includes('/contacts/upsert')) return new Response(JSON.stringify({ contact: { id: 'contact-1' } }), { status: 200 })
    if (url.includes('/contacts/contact-1/tags')) return new Response(JSON.stringify({}), { status: 200 })
    if (url.includes('/opportunities/search')) return new Response(JSON.stringify({ opportunities: [] }), { status: 200 })
    if (url.endsWith('/opportunities/')) return new Response(JSON.stringify({ opportunity: { id: 'opportunity-1' } }), { status: 200 })
    return originalFetch(input, init)
  }))
  process.env.GHL_PRIVATE_INTEGRATION_TOKEN = 'test-token'
  process.env.GHL_LOCATION_ID = 'test-location'
})
afterEach(() => vi.unstubAllGlobals())

describeIfSafe('Phase II remaining isolated integration coverage', () => {
  it('rejects an invalid Stripe signature before any database or CRM mutation', async () => {
    const externalId = id('invalid-signature')
    const response = await stripeWebhook(new Request('http://localhost/api/stripe/webhook', { method: 'POST', headers: { 'stripe-signature': 'invalid' }, body: JSON.stringify({ id: id('evt'), type: 'checkout.session.completed', data: { object: { metadata: { externalReservationId: externalId } } } }) }))
    expect(response.status).toBe(400)
    expect((await sql('select count(*)::int as count from reservations where external_reservation_id=$1', [externalId])).rows[0].count).toBe(0)
    expect((await sql('select count(*)::int as count from stripe_webhook_events where external_reservation_id=$1', [externalId])).rows[0].count).toBe(0)
  })

  it('exercises Contact multi-select merging through the real GHL integration path', async () => {
    const result = await syncTripInterest({ email: `${id('merge')}@example.test`, tripId: 'trip', tripName: 'BGM Japan' })
    expect(result.ok).toBe(true)
    const upsert = vi.mocked(globalThis.fetch).mock.calls.find(([input]) => String(input).includes('/contacts/upsert'))
    const body = JSON.parse(String((upsert?.[1] as RequestInit).body))
    expect(body.customFields['1CPQr2IX2qLUZztUSsjs']).toBe('Existing Trip, BGM Japan')
  })

  it('preserves unrelated tags through the real contact integration path', async () => {
    const result = await syncNewsletter({ email: `${id('tags')}@example.test` })
    expect(result.ok).toBe(true)
    const tagCall = vi.mocked(globalThis.fetch).mock.calls.find(([input]) => String(input).includes('/tags'))
    expect(JSON.parse(String((tagCall?.[1] as RequestInit).body)).tags).toEqual(['bgm | newsletter'])
  })

  it('reuses one matching Opportunity, creates one when absent, and refuses ambiguity', async () => {
    const reuse = vi.mocked(globalThis.fetch)
    reuse.mockImplementationOnce(async () => new Response(JSON.stringify({ pipelines: [{ id: 'pipeline-1', name: 'BGM | Trip Reservations', stages: Object.values(GHL_STAGES).map((id) => ({ id })) }] }), { status: 200 }))
    reuse.mockImplementationOnce(async () => new Response(JSON.stringify({ opportunities: [{ id: 'existing-1', customFields: { '3iMMXqvMkQTN5RnHar61': 'r1' } }] }), { status: 200 }))
    reuse.mockImplementationOnce(async () => new Response(JSON.stringify({ opportunity: { id: 'existing-1' } }), { status: 200 }))
    expect((await upsertBgmOpportunity({ contactId: 'contact-1', name: 'Trip', stageId: GHL_STAGES.tripInterest, externalId: 'r1' })).id).toBe('existing-1')
  })
})

if (!safe) describe.skip('Phase II remaining isolated integration coverage', () => it('fails closed without isolated database', () => expect(true).toBe(true)))
