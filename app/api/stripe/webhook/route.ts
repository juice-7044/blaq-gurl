import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { crmSyncState, payments, reservations, stripeWebhookEvents } from '@/lib/db/schema'
import { GHL_STAGES, syncPaymentEvent, syncReservationStarted } from '@/lib/integrations/ghl'

export const runtime = 'nodejs'

const successEvents = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded'])

function paymentType(metadata: Stripe.Metadata): 'deposit' | 'installment' | 'full_payment' | 'adjustment' {
  if (metadata.paymentType === 'trip-deposit') return 'deposit'
  if (metadata.paymentType === 'installment') return 'installment'
  if (metadata.paymentType === 'full_payment') return 'full_payment'
  return 'adjustment'
}

async function syncAndRecord(externalReservationId: string, operation: () => Promise<{ ok: boolean; id?: string }>) {
  try { const result = await operation(); await recordCrmSync(externalReservationId, result); return result } catch (error) { await recordCrmSync(externalReservationId, { ok: false }, error); return { ok: false } }
}

async function recordCrmSync(externalReservationId: string, result: { ok: boolean; id?: string }, error?: unknown) {
  const message = error instanceof Error ? error.message : 'GHL synchronization failed'
  await db.insert(crmSyncState).values({ externalReservationId, ghlOpportunityId: result.id, lastSyncStatus: result.ok ? 'synced' : 'failed', lastSuccessfulSync: result.ok ? new Date() : undefined, retryCount: result.ok ? 0 : 1, lastError: result.ok ? null : message }).onConflictDoUpdate({ target: crmSyncState.externalReservationId, set: { ghlOpportunityId: result.id, lastSyncStatus: result.ok ? 'synced' : 'failed', lastSuccessfulSync: result.ok ? new Date() : undefined, retryCount: result.ok ? 0 : sql`${crmSyncState.retryCount} + 1`, lastError: result.ok ? null : message, updatedAt: new Date() } })
}

async function refreshReservation(externalReservationId: string, refundDelta = 0) {
  const paid = await db
    .select({ total: sql<number>`coalesce(sum(case when ${payments.status} = 'succeeded' then ${payments.amountMinor} - ${payments.refundedAmountMinor} else 0 end), 0)` })
    .from(payments).where(eq(payments.externalReservationId, externalReservationId))
  const reservation = await db.query.reservations.findFirst({ where: eq(reservations.externalReservationId, externalReservationId) })
  if (!reservation) return null
  const amountPaid = Math.max(0, Number(paid[0]?.total ?? 0) - refundDelta)
  const balance = Math.max(0, reservation.tripPriceMinor - amountPaid)
  const full = balance === 0
  await db.update(reservations).set({ amountPaidMinor: amountPaid, balanceDueMinor: balance, paymentStatus: full ? 'paid_in_full' : amountPaid > 0 ? 'paid' : reservation.paymentStatus, reservationStatus: full ? 'paid_in_full' : reservation.reservationStatus, updatedAt: new Date() }).where(eq(reservations.externalReservationId, externalReservationId))
  return { ...reservation, amountPaid, balance, full }
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!signature || !secret || !stripeKey) return NextResponse.json({ error: 'Webhook verification is not configured' }, { status: 503 })
  let event: Stripe.Event
  try { event = new Stripe(stripeKey).webhooks.constructEvent(await request.text(), signature, secret) as Stripe.Event }
  catch { return NextResponse.json({ error: 'Invalid signature' }, { status: 400 }) }

  await db.insert(stripeWebhookEvents).values({ stripeEventId: event.id, eventType: event.type }).onConflictDoNothing()
  const claim = await db.update(stripeWebhookEvents).set({ processingStatus: 'processing' }).where(and(eq(stripeWebhookEvents.stripeEventId, event.id), eq(stripeWebhookEvents.processed, false), sql`${stripeWebhookEvents.processingStatus} <> 'processing'`)).returning({ id: stripeWebhookEvents.id })
  if (!claim.length) return NextResponse.json({ received: true, duplicate: true })

  try {
    const object = event.data.object as Stripe.Checkout.Session | Stripe.Charge
    const metadata = object.metadata ?? {}
    const reservationId = metadata.externalReservationId
    if (!reservationId) throw new Error('Missing external reservation ID')

    if (event.type === 'charge.refunded' || event.type === 'refund.created') {
      const charge = object as Stripe.Charge
      const refundAmount = charge.amount_refunded ?? 0
      const existing = await db.query.payments.findFirst({ where: eq(payments.stripeChargeId, charge.id) })
      if (existing) await db.update(payments).set({ refundedAmountMinor: refundAmount, status: refundAmount >= existing.amountMinor ? 'refunded' : 'partially_refunded', updatedAt: new Date() }).where(eq(payments.id, existing.id))
      const current = await refreshReservation(reservationId)
      if (current) await syncPaymentEvent({ email: current.travelerEmail, tripName: current.tripName, reservationId, stageId: GHL_STAGES.refunded, amount: current.amountPaid, amountPaid: current.amountPaid, balanceDue: current.balance, stripeSessionId: existing?.stripeCheckoutSessionId ?? '' })
    } else if (event.type.startsWith('charge.dispute.')) {
      const charge = object as Stripe.Charge
      const current = await refreshReservation(reservationId)
      if (current) {
        await db.update(reservations).set({ reservationStatus: 'human_review', updatedAt: new Date() }).where(eq(reservations.externalReservationId, reservationId))
        await db.insert(crmSyncState).values({ externalReservationId: reservationId, lastSyncStatus: 'human_review', lastError: `Stripe dispute requires review: ${event.type}` }).onConflictDoUpdate({ target: crmSyncState.externalReservationId, set: { lastSyncStatus: 'human_review', lastError: `Stripe dispute requires review: ${event.type}`, updatedAt: new Date() } })
        await syncPaymentEvent({ email: current.travelerEmail, tripName: current.tripName, reservationId, stageId: GHL_STAGES.paymentPastDue, amount: current.amountPaid, amountPaid: current.amountPaid, balanceDue: current.balance, stripeSessionId: charge.id })
      }
    } else if (successEvents.has(event.type) || event.type === 'checkout.session.async_payment_failed') {
      const session = object as Stripe.Checkout.Session
      const email = session.customer_details?.email
      if (!email || !metadata.tripName) throw new Error('Checkout session is missing customer or trip metadata')
      const amount = session.amount_total ?? Number(metadata.depositAmountMinor ?? 0)
      await db.transaction(async (tx) => {
        await tx.insert(reservations).values({ externalReservationId: reservationId, travelerEmail: email, tripId: metadata.tripId ?? '', tripName: metadata.tripName, destination: metadata.destination ?? metadata.tripName, tripPriceMinor: Number(metadata.tripPriceMinor ?? amount), depositAmountMinor: Number(metadata.depositAmountMinor ?? amount), balanceDueMinor: Math.max(Number(metadata.tripPriceMinor ?? amount) - amount, 0), stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined, stripeCheckoutSessionId: session.id, stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined, reservationStatus: event.type.endsWith('failed') ? 'payment_failed' : 'started', paymentStatus: event.type.endsWith('failed') ? 'failed' : 'paid', amountPaidMinor: event.type.endsWith('failed') ? 0 : amount }).onConflictDoNothing()
        if (!event.type.endsWith('failed')) await tx.insert(payments).values({ externalReservationId: reservationId, stripeEventId: event.id, stripeCheckoutSessionId: session.id, stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined, paymentType: paymentType(metadata), amountMinor: amount, currency: session.currency ?? 'usd', status: 'succeeded', paidAt: new Date() }).onConflictDoNothing()
      })
      const current = await refreshReservation(reservationId)
      if (current) await syncAndRecord(reservationId, () => event.type.endsWith('failed') ? syncPaymentEvent({ email, tripName: current.tripName, reservationId, stageId: GHL_STAGES.depositPending, amount, amountPaid: current.amountPaid, balanceDue: current.balance, stripeSessionId: session.id }) : current.full ? syncPaymentEvent({ email, tripName: current.tripName, reservationId, stageId: GHL_STAGES.paidInFull, amount, amountPaid: current.amountPaid, balanceDue: current.balance, stripeSessionId: session.id }) : syncReservationStarted({ email, tripId: current.tripId, tripName: current.tripName, reservationId, amount, stripeSessionId: session.id }))
    }
    await db.update(stripeWebhookEvents).set({ processed: true, processingStatus: 'processed', processedAt: new Date(), externalReservationId: reservationId }).where(eq(stripeWebhookEvents.stripeEventId, event.id))
    return NextResponse.json({ received: true })
  } catch (error) {
    await db.update(stripeWebhookEvents).set({ processingStatus: 'failed', errorMessage: error instanceof Error ? error.message : 'Unknown error' }).where(eq(stripeWebhookEvents.stripeEventId, event.id))
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
