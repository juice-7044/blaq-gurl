'use server'

import { stripe } from '@/lib/stripe'
import { destinations } from '@/lib/site-data'
import { events } from '@/lib/events'

export type CheckoutItem =
  | { kind: 'trip-deposit'; id: string }
  | { kind: 'event-ticket'; id: string; quantity?: number }

type LineItem = {
  name: string
  description: string
  unitAmount: number
  quantity: number
}

/**
 * Resolve a checkout item to a secure, server-side priced line item.
 * Prices are NEVER taken from the client — only the item id (and quantity for
 * tickets) is trusted, and everything else is looked up here.
 */
function resolveLineItem(item: CheckoutItem): LineItem {
  if (item.kind === 'trip-deposit') {
    const trip = destinations.find((d) => d.slug === item.id)
    if (!trip) throw new Error(`Trip "${item.id}" not found`)
    const deposit = Math.round(trip.price * 0.2)
    return {
      name: `${trip.name} Trip Deposit`,
      description: `Refundable 20% deposit to reserve your spot on the ${trip.name}, ${trip.country} journey (${trip.duration}).`,
      unitAmount: deposit * 100,
      quantity: 1,
    }
  }

  const event = events.find((e) => e.id === item.id)
  if (!event) throw new Error(`Event "${item.id}" not found`)
  if (!event.priceInCents) throw new Error(`Event "${item.id}" is not ticketed`)
  const quantity = Math.min(Math.max(item.quantity ?? 1, 1), 10)
  return {
    name: `${event.title} — Ticket`,
    description: `${event.location} • ${event.date}`,
    unitAmount: event.priceInCents,
    quantity,
  }
}

export async function startCheckoutSession(item: CheckoutItem) {
  const line = resolveLineItem(item)

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: line.name,
            description: line.description,
          },
          unit_amount: line.unitAmount,
        },
        quantity: line.quantity,
      },
    ],
    mode: 'payment',
  })

  return session.client_secret
}
