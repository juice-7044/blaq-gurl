import 'server-only'

const API_BASE = 'https://services.leadconnectorhq.com'
const API_VERSION = '2021-07-28'
const TIMEOUT_MS = 8000
const PIPELINE_NAME = 'BGM | Trip Reservations'

const CONTACT_FIELDS = {
  contactType: 'bHtRBiDGgKvXfAcOyK71',
  tripInterests: '1CPQr2IX2qLUZztUSsjs',
} as const

const OPPORTUNITY_FIELDS = {
  externalReservationId: '3iMMXqvMkQTN5RnHar61',
  paymentStatus: 'FOzNBrzVgkF9tK9oaVtY',
  amountPaid: 'utAFokVSwVFdcJuwe4Sl',
  balanceDue: 'YrNCWXMLdDm52Pk3oDfG',
  tripPrice: 'YnrqiJhBQrnX2DtxEYV5',
  depositAmount: 'HpT1ctolulYKpmeXp7pp',
  depositStatus: '2POlI98Z7pCBb5yWsF3P',
  depositPaidDate: 'mTSeLPN5N2ZF2dMg6GLB',
  nextPaymentDate: '7bY6RQfvy4tUTrDZsJqt',
  paymentPlan: 'MEld59hOCQf4v9RvLOeC',
  checkoutSessionId: 'G40fKfH2n4MCm9OJtP4O',
  stripeCustomerId: 'tlH8xcdRokqurLEXv4J2',
  paymentIntentId: 'mzTmFNSBFVQyX13YMjnG',
  subscriptionId: 'otQbOAjlN49rUACBiwgp',
  lastStripeSync: '8GOUOux87P3umGsPAxrI',
  bookingSource: '7ip2SJDAPJQ5CXBFbNMP',
  destination: 'QDQeq5h3AjR0p3w0G7CN',
  travelers: 'UbRJicAQtXHQVplD4R72',
  reservationStatus: 'O2Z9cgNbl3OuxEVSAcX6',
} as const

export const GHL_STAGES = {
  tripInterest: '02f077a0-1ca8-4706-a1d0-89a9ec5c28e7',
  waitlisted: 'a83bde08-1c02-4386-98b5-385f6c5bba80',
  reservationStarted: '7d69e647-983a-4171-ba14-cb423d43f122',
  depositPending: 'b848f308-f2d0-4443-83e5-8dac4149103b',
  depositPaid: '1b55a9f9-5536-4beb-85ef-12ca051f47e0',
  paidInFull: '217f2534-6260-4329-a5ba-4a3d5d2f368c',
  refunded: '22bf476f-3f13-4d76-bc24-d52fe9770967',
  paymentPastDue: process.env.GHL_PAYMENT_PAST_DUE_STAGE_ID ?? 'payment-past-due',
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

async function mergeContactFields(email: string, fields: Record<string, string | boolean | number>) {
  const response = await ghlFetch(`/contacts/search/duplicate?locationId=${encodeURIComponent(config()!.locationId)}&email=${encodeURIComponent(email)}`)
  if (!response?.ok) return fields
  const body = (await response.json()) as { contact?: { customFields?: Record<string, unknown> } }
  const existing = body.contact?.customFields ?? {}
  const merged = { ...fields }
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== 'string' || !value.includes(',')) continue
    const oldValues = Array.isArray(existing[key]) ? existing[key].map(String) : String(existing[key] ?? '').split(',').map((v) => v.trim()).filter(Boolean)
    merged[key] = Array.from(new Set([...oldValues, ...value.split(',').map((v) => v.trim()).filter(Boolean)])).join(', ')
  }
  return merged
}

export async function upsertBgmContact(input: GhlContactInput): Promise<GhlSyncResult> {
  const auth = config()
  if (!auth) return { ok: false, skipped: true }
  try {
    const rawFields = Object.fromEntries(Object.entries(input.customFields ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ''))
    const fields = await mergeContactFields(input.email, {
      ...rawFields,
      ...(rawFields.bgm_contact_type !== undefined ? { [CONTACT_FIELDS.contactType]: rawFields.bgm_contact_type } : {}),
      ...(rawFields.trip_interests !== undefined ? { [CONTACT_FIELDS.tripInterests]: rawFields.trip_interests } : {}),
    })
    delete fields.bgm_contact_type
    delete fields.trip_interests
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

async function findExistingOpportunity(contactId: string, externalId: string, pid: string) {
  const auth = config()
  if (!auth) return { id: undefined, multiple: false }
  const response = await ghlFetch(`/opportunities/search?location_id=${encodeURIComponent(auth.locationId)}&pipeline_id=${encodeURIComponent(pid)}&contact_id=${encodeURIComponent(contactId)}&page=1&limit=100`)
  if (!response?.ok) return { id: undefined, multiple: false }
  const body = (await response.json()) as { opportunities?: Array<{ id: string; customFields?: Record<string, unknown> }> }
  const matches = (body.opportunities ?? []).filter((opportunity) => String(opportunity.customFields?.[OPPORTUNITY_FIELDS.externalReservationId] ?? opportunity.customFields?.external_reservation_id ?? '') === externalId)
  return { id: matches.length === 1 ? matches[0].id : undefined, multiple: matches.length > 1 }
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
    const existing = await findExistingOpportunity(input.contactId, input.externalId, pid)
    if (existing.multiple) return { ok: false }
    const response = await ghlFetch(existing.id ? `/opportunities/${existing.id}` : '/opportunities/', {
      method: existing.id ? 'PUT' : 'POST',
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
          [OPPORTUNITY_FIELDS.externalReservationId]: input.externalId,
          ...Object.fromEntries(Object.entries(input.customFields ?? {}).map(([key, value]) => {
            const map: Record<string, string> = { payment_status: OPPORTUNITY_FIELDS.paymentStatus, amount_paid: OPPORTUNITY_FIELDS.amountPaid, balance_due: OPPORTUNITY_FIELDS.balanceDue, trip_price: OPPORTUNITY_FIELDS.tripPrice, deposit_amount: OPPORTUNITY_FIELDS.depositAmount, deposit_status: OPPORTUNITY_FIELDS.depositStatus, deposit_paid_date: OPPORTUNITY_FIELDS.depositPaidDate, next_payment_date: OPPORTUNITY_FIELDS.nextPaymentDate, payment_plan: OPPORTUNITY_FIELDS.paymentPlan, stripe_checkout_session_id: OPPORTUNITY_FIELDS.checkoutSessionId, stripe_customer_id: OPPORTUNITY_FIELDS.stripeCustomerId, stripe_payment_intent_id: OPPORTUNITY_FIELDS.paymentIntentId, stripe_subscription_id: OPPORTUNITY_FIELDS.subscriptionId, last_stripe_sync: OPPORTUNITY_FIELDS.lastStripeSync, booking_source: OPPORTUNITY_FIELDS.bookingSource, destination: OPPORTUNITY_FIELDS.destination, number_of_travelers: OPPORTUNITY_FIELDS.travelers, reservation_status: OPPORTUNITY_FIELDS.reservationStatus }
            return [map[key] ?? key, value]
          })),
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

export async function syncPaymentEvent(input: { email: string; tripName: string; reservationId: string; stageId: string; amount?: number; amountPaid?: number; balanceDue?: number; stripeSessionId?: string; paymentIntentId?: string }) {
  const contact = await upsertBgmContact({ email: input.email, tags: input.stageId === GHL_STAGES.depositPaid || input.stageId === GHL_STAGES.paidInFull ? ['bgm | active traveler'] : undefined })
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
      payment_status: input.stageId === GHL_STAGES.paidInFull ? 'Paid In Full' : input.stageId === GHL_STAGES.depositPaid ? 'Paid' : input.stageId === GHL_STAGES.refunded ? 'Refunded' : 'Payment Past Due',
      amount_paid: input.amountPaid ?? input.amount ?? 0,
      balance_due: input.balanceDue ?? 0,
      last_stripe_sync: new Date().toISOString(),
    },
  })
}
