import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { payments, reservations, stripeWebhookEvents } from '@/lib/db/schema'
import { GHL_STAGES, syncPaymentEvent, syncReservationStarted } from '@/lib/integrations/ghl'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!signature || !secret || !stripeKey) return NextResponse.json({ error: 'Webhook verification is not configured' }, { status: 503 })
  const payload = await request.text()
  let event: Stripe.Event
  try { event = new Stripe(stripeKey).webhooks.constructEvent(payload, signature, secret) as Stripe.Event }
  catch { return NextResponse.json({ error: 'Invalid signature' }, { status: 400 }) }

  const inserted = await db.insert(stripeWebhookEvents).values({ stripeEventId: event.id, eventType: event.type }).onConflictDoNothing().returning({ id: stripeWebhookEvents.id })
  if (!inserted.length) return NextResponse.json({ received: true, duplicate: true })

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded' || event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session
      const m = session.metadata ?? {}
      if (m.paymentType === 'trip-deposit' && m.externalReservationId && m.tripName) {
        const email = session.customer_details?.email
        if (!email) throw new Error('Stripe checkout session has no customer email')
        const amount = session.amount_total ?? Number(m.depositAmountMinor ?? 0)
        await db.insert(reservations).values({ externalReservationId: m.externalReservationId, travelerEmail: email, tripId: m.tripId ?? '', tripName: m.tripName, destination: m.destination ?? m.tripName, tripPriceMinor: Number(m.tripPriceMinor ?? amount), depositAmountMinor: Number(m.depositAmountMinor ?? amount), balanceDueMinor: Math.max(Number(m.tripPriceMinor ?? amount) - amount, 0), stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined, stripeCheckoutSessionId: session.id, stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined, reservationStatus: event.type === 'checkout.session.async_payment_failed' ? 'payment_failed' : 'started', paymentStatus: event.type === 'checkout.session.async_payment_failed' ? 'failed' : event.type === 'checkout.session.completed' ? 'paid' : 'paid', amountPaidMinor: event.type === 'checkout.session.async_payment_failed' ? 0 : amount }).onConflictDoNothing()
        if (event.type !== 'checkout.session.async_payment_failed') await db.insert(payments).values({ externalReservationId: m.externalReservationId, stripeEventId: event.id, stripeCheckoutSessionId: session.id, stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined, paymentType: 'deposit', amountMinor: amount, currency: session.currency ?? 'usd', status: 'succeeded', paidAt: new Date() }).onConflictDoNothing()
        if (event.type === 'checkout.session.completed') await syncReservationStarted({ email, tripId: m.tripId ?? '', tripName: m.tripName, reservationId: m.externalReservationId, amount, stripeSessionId: session.id })
        if (event.type === 'checkout.session.async_payment_succeeded') await syncPaymentEvent({ email, tripName: m.tripName, reservationId: m.externalReservationId, stageId: GHL_STAGES.depositPaid, amount, stripeSessionId: session.id })
        if (event.type === 'checkout.session.async_payment_failed') await syncPaymentEvent({ email, tripName: m.tripName, reservationId: m.externalReservationId, stageId: GHL_STAGES.depositPending, amount, stripeSessionId: session.id })
      }
    }
    await db.update(stripeWebhookEvents).set({ processed: true, processingStatus: 'processed', processedAt: new Date() }).where(eq(stripeWebhookEvents.stripeEventId, event.id))
  } catch (error) {
    await db.update(stripeWebhookEvents).set({ processingStatus: 'failed', errorMessage: error instanceof Error ? error.message : 'Unknown error' }).where(eq(stripeWebhookEvents.stripeEventId, event.id))
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
  return NextResponse.json({ received: true })
}
