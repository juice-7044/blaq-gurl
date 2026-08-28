'use server'

import { upsertContact, sendTransactionalEmail } from '@/lib/hubspot'
import { syncNewsletter, syncWaitlist } from '@/lib/integrations/ghl'

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
export async function joinWaitlist(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const tripId = String(formData.get('tripId') ?? '').trim()
  const tripTitle = String(formData.get('tripTitle') ?? '').trim()
  const tripMonth = String(formData.get('tripMonth') ?? '').trim()

  if (!name) return { status: 'error', message: 'Please enter your name.' }
  if (!email || !email.includes('@')) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const { firstname, lastname } = splitName(name)

  const ghl = await syncWaitlist({
    email,
    firstname,
    lastname,
    tripId,
    tripName: tripTitle ? `${tripMonth} 2027 — ${tripTitle}` : '2027 lineup',
  })
  if (!ghl.ok && !ghl.skipped) console.log('[v0] GHL waitlist sync unavailable')

  const result = await upsertContact({
    email,
    firstname,
    lastname,
    tags: ['#waitlist', tripTitle ? `#${tripMonth}-trip` : '#trip-waitlist'],
    properties: {
      bgm_waitlist_trip: tripTitle
        ? `${tripMonth} 2027 — ${tripTitle}`
        : 'General 2027 waitlist',
      bgm_waitlist_trip_id: tripId,
    },
  })

  if (result.skipped) {
    // HubSpot not configured yet — still show success so the UX isn't blocked.
    console.log('[v0] Waitlist: HubSpot not configured, lead not persisted.')
    return {
      status: 'success',
      message:
        'Thanks! We\u2019ve received your request and will reach out as soon as reservations open.',
    }
  }

  if (!result.ok) {
    return {
      status: 'error',
      message: 'Something went wrong on our end. Please try again shortly.',
    }
  }

  await sendTransactionalEmail({
    emailId: process.env.HUBSPOT_WAITLIST_EMAIL_ID,
    to: email,
    customProperties: {
      trip: tripTitle ? `${tripMonth} 2027 — ${tripTitle}` : '2027 lineup',
      firstname,
    },
  })

  return {
    status: 'success',
    message:
      'You\u2019re on the list! We\u2019ve emailed a confirmation and will update you the moment we open reservations.',
  }
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

  const ghl = await syncNewsletter({ email })
  if (!ghl.ok && !ghl.skipped) console.log('[v0] GHL newsletter sync unavailable')

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
