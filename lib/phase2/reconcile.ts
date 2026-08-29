import 'server-only'

import { and, asc, eq, or, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { crmSyncState, reservations } from '@/lib/db/schema'
import { syncPaymentEvent } from '@/lib/integrations/ghl'

const MAX_RETRIES = 5
const ERROR_LIMIT = 240

function sanitizeError(error: unknown) {
  return (error instanceof Error ? error.message : 'CRM synchronization failed')
    .replace(/[\r\n]+/g, ' ')
    .replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
    .slice(0, ERROR_LIMIT)
}

export async function reconcileCrm(limit = 25) {
  const candidates = await db
    .select({ reservation: reservations, sync: crmSyncState })
    .from(crmSyncState)
    .innerJoin(reservations, eq(reservations.externalReservationId, crmSyncState.externalReservationId))
    .where(or(eq(crmSyncState.lastSyncStatus, 'failed'), eq(crmSyncState.lastSyncStatus, 'pending'), sql`${crmSyncState.lastSuccessfulSync} is null`))
    .orderBy(asc(crmSyncState.updatedAt))
    .limit(Math.min(Math.max(limit, 1), 100))

  const results: Array<{ reservationId: string; ok: boolean; error?: string }> = []
  for (const { reservation, sync } of candidates) {
    if (sync.retryCount >= MAX_RETRIES) {
      results.push({ reservationId: reservation.externalReservationId, ok: false, error: 'retry limit reached' })
      continue
    }
    try {
      const stageId = reservation.paymentStatus === 'paid_in_full' ? '217f2534-6260-4329-a5ba-4a3d5d2f368c' : reservation.paymentStatus === 'failed' ? 'b848f308-f2d0-4443-83e5-8dac4149103b' : '1b55a9f9-5536-4beb-85ef-12ca051f47e0'
      const synced = await syncPaymentEvent({ email: reservation.travelerEmail, tripName: reservation.tripName, reservationId: reservation.externalReservationId, stageId, amount: reservation.amountPaidMinor, amountPaid: reservation.amountPaidMinor, balanceDue: reservation.balanceDueMinor, stripeSessionId: reservation.stripeCheckoutSessionId ?? '', paymentIntentId: reservation.stripePaymentIntentId ?? '' })
      if (!synced.ok) throw new Error('GHL sync returned an unsuccessful response')
      await db.update(crmSyncState).set({ lastSuccessfulSync: new Date(), lastSyncStatus: 'synchronized', retryCount: 0, lastError: null, ghlOpportunityId: synced.id ?? sync.ghlOpportunityId, updatedAt: new Date() }).where(eq(crmSyncState.externalReservationId, reservation.externalReservationId))
      results.push({ reservationId: reservation.externalReservationId, ok: true })
    } catch (error) {
      const message = sanitizeError(error)
      await db.update(crmSyncState).set({ lastSyncStatus: 'failed', retryCount: sync.retryCount + 1, lastError: message, updatedAt: new Date() }).where(eq(crmSyncState.externalReservationId, reservation.externalReservationId))
      results.push({ reservationId: reservation.externalReservationId, ok: false, error: message })
    }
  }
  return { processed: results.length, succeeded: results.filter((result) => result.ok).length, failed: results.filter((result) => !result.ok).length, results }
}
