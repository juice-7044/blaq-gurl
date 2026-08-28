'use server'

import { upsertContact, sendTransactionalEmail } from '@/lib/hubspot'

export type LeadState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

function splitName(full: string) {
  const [firstname, ...rest] = full.trim().split(/\s+/)
  return { firstname: firstname ?? '', lastname: rest.join(' ') }
}

/**
 * Waitlist signup for a specific 2027 trip. Collects name + email + trip
 * details, upserts the contact in HubSpot with waitlist tags, and sends a
 * confirmation email.
 */
export async function reserveTrip(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const tripId = String(formData.get('tripId') ?? '').trim()
  const tripTitle = String(formData.get('tripTitle') ?? '').trim()
  const tripMonth = String(formData.get('tripMonth') ?? '').trim()

  if (!name) return { status: 'error', message: 'Please enter your name.' }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }
  if (!phone || phone.replace(/\D/g, '').length < 7) {
    return { status: 'error', message: 'Please enter a valid phone number.' }
  }
  if (!tripId || !tripTitle || !tripMonth) {
    return { status: 'error', message: 'Please select a trip to reserve.' }
  }

  const { firstname, lastname } = splitName(name)
  const trip = `${tripMonth} 2027 — ${tripTitle}`
  const result = await upsertContact({
    email,
    firstname,
    lastname,
    properties: {
      phone,
      bgm_reserved_trip: trip,
      bgm_reserved_trip_id: tripId,
    },
    tags: ['#reservation', `#${tripMonth.toLowerCase()}-${tripTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`],
  })

  if (result.skipped) {
    console.log('[v0] Reservation: HubSpot not configured, lead not persisted.')
    return { status: 'success', message: `Thanks! We received your reservation request for ${trip}. We’ll be in touch shortly.` }
  }
  if (!result.ok) return { status: 'error', message: 'Something went wrong on our end. Please try again shortly.' }

  return { status: 'success', message: `Thanks! Your reservation request for ${trip} is in. We’ll be in touch shortly.` }
}

/**
 * Newsletter subscription. Upserts the contact and tags them #newsletter.
 */
export async function subscribeNewsletter(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const email = String(formData.get('email') ?? '').trim()

  if (!email || !email.includes('@')) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const result = await upsertContact({
    email,
    tags: ['#newsletter'],
  })

  if (result.skipped) {
    console.log('[v0] Newsletter: HubSpot not configured, lead not persisted.')
    return { status: 'success', message: 'You\u2019re in! Watch your inbox.' }
  }

  if (!result.ok) {
    return {
      status: 'error',
      message: 'Something went wrong. Please try again shortly.',
    }
  }

  await sendTransactionalEmail({
    emailId: process.env.HUBSPOT_NEWSLETTER_EMAIL_ID,
    to: email,
  })

  return { status: 'success', message: 'You\u2019re in! Watch your inbox.' }
}
