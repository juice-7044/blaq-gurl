import { NextResponse } from 'next/server'
import { reconcileCrm } from '@/lib/phase2/reconcile'

export const runtime = 'nodejs'

function authorized(request: Request) {
  const configured = process.env.CRM_RECONCILIATION_SECRET ?? process.env.VERCEL_CRON_SECRET
  if (!configured) return false
  return request.headers.get('authorization') === `Bearer ${configured}` || request.headers.get('x-vercel-cron') === '1'
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const url = new URL(request.url)
  const limit = Number(url.searchParams.get('limit') ?? 25)
  return NextResponse.json(await reconcileCrm(Number.isFinite(limit) ? limit : 25))
}

export async function GET(request: Request) {
  return POST(request)
}
