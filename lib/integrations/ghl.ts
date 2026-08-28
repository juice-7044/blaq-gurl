import 'server-only'

const API_BASE = 'https://services.leadconnectorhq.com'
const API_VERSION = '2021-07-28'
const TIMEOUT_MS = 8000
const PIPELINE_NAME = 'BGM | Trip Reservations'

export const GHL_STAGES = {
  tripInterest: '02f077a0-1ca8-4706-a1d0-89a9ec5c28e7',
  waitlisted: 'a83bde08-1c02-4386-98b5-385f6c5bba80',
  reservationStarted: '7d69e647-983a-4171-ba14-cb423d43f122',
  depositPending: 'b848f308-f2d0-4443-83e5-8dac4149103b',
  depositPaid: '1b55a9f9-5536-4beb-85ef-12ca051f47e0',
  paidInFull: '217f2534-6260-4329-a5ba-4a3d5d2f368c',
  refunded: '22bf476f-3f13-4d76-bc24-d52fe9770967',
} as const

export type GhlSyncResult = { ok: boolean; skipped?: boolean; id?: string }
export type GhlContactInput = {
  email: string
  firstname?: string
  lastname?: string
  source?: string
  tags?: string[]
  customFields?: Record<string, string | boolean | number>
}

function config() {
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN
  const locationId = process.env.GHL_LOCATION_ID
  return token && locationId ? { token, locationId } : null
}

async function ghlFetch(path: string, init: RequestInit = {}) {
  const auth = config()
  if (!auth) return null
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
        Version: API_VERSION,
        ...(init.headers ?? {}),
      },
    })
    if (response.status === 429 || response.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return fetch(`${API_BASE}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
          Version: API_VERSION,
          ...(init.headers ?? {}),
        },
      })
    }
    return response
  } finally {
    clearTimeout(timer)
  }
}

export async function upsertBgmContact(input: GhlContactInput): Promise<GhlSyncResult> {
  const auth = config()
  if (!auth) return { ok: false, skipped: true }
  try {
    const fields = Object.fromEntries(
      Object.entries(input.customFields ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ''),
    )
    const response = await ghlFetch('/contacts/upsert', {
      method: 'POST',
      body: JSON.stringify({
        locationId: auth.locationId,
        email: input.email,
        firstName: input.firstname,
        lastName: input.lastname,
        source: input.source ?? 'Blaq Gurl Moves Website',
        customFields: fields,
      }),
    })
    if (!response?.ok) {
      console.log('[v0] GHL contact sync failed:', response?.status ?? 'not configured')
      return { ok: false }
    }
    const body = (await response.json()) as { contact?: { id?: string } }
    const id = body.contact?.id
    if (id && input.tags?.length) {
      const tagResponse = await ghlFetch(`/contacts/${id}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tags: input.tags }),
      })
      if (!tagResponse?.ok) console.log('[v0] GHL tag sync failed:', tagResponse?.status ?? 'unknown')
    }
    return { ok: Boolean(id), id }
  } catch (error) {
    console.log('[v0] GHL contact sync error:', (error as Error).message)
    return { ok: false }
  }
}

async function pipelineId() {
  const auth = config()
  if (!auth) return null
  const response = await ghlFetch(`/opportunities/pipelines?locationId=${auth.locationId}`)
  if (!response?.ok) return null
  const body = (await response.json()) as { pipelines?: Array<{ id: string; name: string; stages?: Array<{ id: string }> }> }
  const pipeline = body.pipelines?.find((item) => item.name === PIPELINE_NAME)
  if (!pipeline) return null
  const knownStageIds = new Set<string>(Object.values(GHL_STAGES))
  if (!pipeline.stages?.some((stage) => knownStageIds.has(stage.id))) return null
  return pipeline.id
}

export async function upsertBgmOpportunity(input: {
  contactId: string
  name: string
  stageId: string
  externalId: string
  amount?: number
  customFields?: Record<string, string | number | boolean>
}): Promise<GhlSyncResult> {
  const auth = config()
  if (!auth) return { ok: false, skipped: true }
  try {
    const pid = await pipelineId()
    if (!pid) return { ok: false }
    const response = await ghlFetch('/opportunities/', {
      method: 'POST',
      body: JSON.stringify({
        locationId: auth.locationId,
        pipelineId: pid,
        pipelineStageId: input.stageId as (typeof GHL_STAGES)[keyof typeof GHL_STAGES],
        contactId: input.contactId,
        name: input.name,
        status: 'open',
        monetaryValue: input.amount,
        source: 'Blaq Gurl Moves Website',
        customFields: {
          external_reservation_id: input.externalId,
          ...(input.customFields ?? {}),
        },
      }),
    })
    if (!response?.ok) console.log('[v0] GHL opportunity sync failed:', response?.status ?? 'unknown')
    return { ok: Boolean(response?.ok) }
  } catch (error) {
    console.log('[v0] GHL opportunity sync error:', (error as Error).message)
    return { ok: false }
  }
}

export async function syncNewsletter(input: { email: string }) {
  return upsertBgmContact({
    email: input.email,
    tags: ['bgm | newsletter'],
    customFields: {
      newsletter_subscriber: true,
      bgm_contact_type: 'Newsletter Subscriber',
      last_website_activity: new Date().toISOString(),
    },
  })
}

export async function syncWaitlist(input: { email: string; firstname?: string; lastname?: string; tripId: string; tripName: string }) {
  return upsertBgmContact({
    email: input.email,
    firstname: input.firstname,
    lastname: input.lastname,
    tags: ['bgm | waitlist', 'bgm | trip prospect'],
    customFields: {
      traveler_status: 'Waitlisted',
      trip_interests: input.tripName,
      last_trip_interest: input.tripName,
      last_website_activity: new Date().toISOString(),
    },
  })
}

export async function syncTripInterest(input: { email: string; tripId: string; tripName: string }) {
  return upsertBgmContact({
    email: input.email,
    tags: ['bgm | trip prospect'],
    customFields: {
      trip_interests: input.tripName,
      last_trip_interest: input.tripName,
      last_website_activity: new Date().toISOString(),
    },
  })
}

export async function syncReservationStarted(input: { email: string; tripId: string; tripName: string; reservationId: string; amount: number; stripeSessionId: string }) {
  const contact = await upsertBgmContact({
    email: input.email,
    tags: ['bgm | trip prospect'],
    customFields: {
      last_trip_interest: input.tripName,
      last_website_activity: new Date().toISOString(),
    },
  })
  if (!contact.ok || !contact.id) return contact
  return upsertBgmOpportunity({
    contactId: contact.id,
    name: `${input.tripName} — Reservation`,
    stageId: GHL_STAGES.reservationStarted,
    externalId: input.reservationId,
    amount: input.amount,
    customFields: {
      stripe_checkout_session_id: input.stripeSessionId,
      destination: input.tripName,
      reservation_status: 'Reservation Started',
      booking_source: 'Website',
    },
  })
}

export async function syncPaymentEvent(input: { email: string; tripName: string; reservationId: string; stageId: string; amount?: number; stripeSessionId?: string; paymentIntentId?: string }) {
  const contact = await upsertBgmContact({ email: input.email, tags: input.stageId === GHL_STAGES.depositPaid ? ['bgm | active traveler'] : undefined })
  if (!contact.ok || !contact.id) return contact
  return upsertBgmOpportunity({
    contactId: contact.id,
    name: `${input.tripName} — Reservation`,
    stageId: input.stageId,
    externalId: input.reservationId,
    amount: input.amount,
    customFields: {
      stripe_checkout_session_id: input.stripeSessionId ?? '',
      stripe_payment_intent_id: input.paymentIntentId ?? '',
      payment_status: input.stageId === GHL_STAGES.depositPaid ? 'Paid' : 'Failed',
      last_stripe_sync: new Date().toISOString(),
    },
  })
}
