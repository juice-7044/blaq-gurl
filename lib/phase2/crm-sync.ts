import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { crmSyncState, reservations } from '@/lib/db/schema'
import { mergeMultiSelectValues } from './merge-utils'

export type OpportunityPersistence = { ok: boolean; conflict?: boolean; id?: string }

export async function persistGhlOpportunityId(externalReservationId: string, opportunityId: string): Promise<OpportunityPersistence> {
  if (!externalReservationId || !opportunityId) return { ok: false }
  return db.transaction(async (tx) => {
    const reservation = await tx.query.reservations.findFirst({
      where: eq(reservations.externalReservationId, externalReservationId),
      columns: { ghlOpportunityId: true },
    })
    if (!reservation) return { ok: false }
    if (reservation.ghlOpportunityId && reservation.ghlOpportunityId !== opportunityId) {
      await tx.update(crmSyncState).set({ lastSyncStatus: 'conflict_human_review', lastError: `Stored GHL opportunity conflict for ${externalReservationId}`, updatedAt: new Date() }).where(eq(crmSyncState.externalReservationId, externalReservationId))
      return { ok: false, conflict: true, id: reservation.ghlOpportunityId }
    }
    await tx.update(reservations).set({ ghlOpportunityId: opportunityId, updatedAt: new Date() }).where(and(eq(reservations.externalReservationId, externalReservationId), isNull(reservations.ghlOpportunityId)))
    await tx.insert(crmSyncState).values({ externalReservationId, ghlOpportunityId: opportunityId, lastSyncStatus: 'opportunity_id_persisted' }).onConflictDoUpdate({ target: crmSyncState.externalReservationId, set: { ghlOpportunityId: opportunityId, updatedAt: new Date() } })
    return { ok: true, id: opportunityId }
  })
}

