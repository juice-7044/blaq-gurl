import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { GHL_STAGES, syncPaymentEvent, syncReservationStarted } from '@/lib/integrations/ghl'

export const runtime = 'nodejs'

// Temporary process-local guard. Durable replay protection requires a database
// or another durable store; this route never treats redirects as payment proof.
const processed = new Set<string>()

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) {
    return NextResponse.json({ error: 'Webhook verification is not configured' }, { status: 503 })
  }

  const payload = await request.text()
  let event
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    event = stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    console.log('[v0] Stripe webhook signature rejected:', (error as Error).message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (processed.has(event.id)) return NextResponse.json({ received: true, duplicate: true })
  processed.add(event.id)

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = session.metadata ?? {}
      if (metadata.paymentType === 'trip-deposit' && metadata.externalReservationId && metadata.tripName) {
        const email = session.customer_details?.email
        if (email) {
          await syncReservationStarted({
            email,
            tripId: metadata.tripId ?? '',
            tripName: metadata.tripName,
            reservationId: metadata.externalReservationId,
            amount: session.amount_total ?? 0,
            stripeSessionId: session.id,
          })
        }
      }
    }

    if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object
      const metadata = session.metadata ?? {}
      const email = session.customer_details?.email
      if (metadata.paymentType === 'trip-deposit' && email && metadata.externalReservationId && metadata.tripName) {
        await syncPaymentEvent({
          email,
          tripName: metadata.tripName,
          reservationId: metadata.externalReservationId,
          stageId: GHL_STAGES.depositPaid,
          amount: session.amount_total ?? undefined,
          stripeSessionId: session.id,
        })
      }
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object
      const metadata = session.metadata ?? {}
      const email = session.customer_details?.email
      if (metadata.paymentType === 'trip-deposit' && email && metadata.externalReservationId && metadata.tripName) {
        await syncPaymentEvent({
          email,
          tripName: metadata.tripName,
          reservationId: metadata.externalReservationId,
          stageId: GHL_STAGES.depositPending,
          amount: session.amount_total ?? undefined,
          stripeSessionId: session.id,
        })
      }
    }
  } catch (error) {
    // Stripe remains authoritative; optional CRM failures are acknowledged and logged.
    console.log('[v0] GHL Stripe sync failed:', (error as Error).message)
  }

  return NextResponse.json({ received: true })
}
