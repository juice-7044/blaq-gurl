import { NextResponse } from 'next/server'
import { tribes, hybridFor, type TribeId } from '@/lib/tribes'
import { upsertContact } from '@/lib/hubspot'
import { sendQuizResultsEmail } from '@/lib/email'

type QuizPayload = {
  name?: string
  email?: string
  birthday?: string
  tribe?: TribeId
  secondary?: TribeId | null
  isHybrid?: boolean
  mbti?: string
  restSeason?: boolean
  scores?: Record<string, number>
  percentages?: Record<string, number>
}

const isTribe = (v: unknown): v is TribeId =>
  typeof v === 'string' && ['A', 'B', 'C', 'D'].includes(v)

function resultLabel(data: QuizPayload): string {
  if (!isTribe(data.tribe)) return ''
  if (data.isHybrid && isTribe(data.secondary)) {
    const h = hybridFor(data.tribe, data.secondary)
    return `${tribes[data.tribe].name}/${tribes[data.secondary].name} — ${h.title}`
  }
  return `${tribes[data.tribe].name} — ${tribes[data.tribe].title}`
}

async function sendToAirtable(data: QuizPayload) {
  const apiKey = process.env.AIRTABLE_API_KEY
  const rawBase = process.env.AIRTABLE_BASE_ID
  const rawTable = process.env.AIRTABLE_TABLE_NAME
  if (!apiKey || !rawBase || !rawTable) return { ok: false, skipped: true as const }

  // Be forgiving about pasted values. Airtable URLs look like
  // ".../appXXXX/tblYYYY/viwZZZZ" and people often paste the whole path into
  // AIRTABLE_BASE_ID. Extract the real base id (app...) and, if a table id
  // (tbl...) was included, prefer it over the human-readable table name.
  const parts = rawBase.split('/').filter(Boolean)
  const baseId = parts.find((p) => p.startsWith('app')) ?? parts[0]
  const tableFromBase = parts.find((p) => p.startsWith('tbl'))
  const table = rawTable.startsWith('tbl') ? rawTable : (tableFromBase ?? rawTable)

  // Build a percentage breakdown string like "A: 40% · B: 25% · C: 20% · D: 15%".
  const scoreSummary = data.percentages
    ? Object.entries(data.percentages)
        .map(([k, v]) => `${k}: ${v}%`)
        .join(' · ')
    : data.scores
      ? JSON.stringify(data.scores)
      : ''

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typecast: true,
          fields: {
            Timestamp: new Date().toISOString(),
            Name: data.name ?? '',
            Email: data.email ?? '',
            'Date of Birth': data.birthday || undefined,
            'Primary Tribe': data.tribe ?? '',
            'Tribe Title': data.tribe ? tribes[data.tribe].title : '',
            Hybrid: !!data.isHybrid,
            'Secondary Tribe':
              data.isHybrid && data.secondary ? tribes[data.secondary].name : '',
            'MBTI Type': data.mbti ?? '',
            'Rest Season': !!data.restSeason,
            'Tribe Scores': scoreSummary,
            'Result Label': resultLabel(data),
          },
        }),
      },
    )
    if (!res.ok) {
      console.log('[v0] Airtable error:', res.status, await res.text())
    }
    return { ok: res.ok, skipped: false as const }
  } catch (err) {
    console.log('[v0] Airtable error:', (err as Error).message)
    return { ok: false, skipped: false as const }
  }
}

async function sendToHubSpot(data: QuizPayload) {
  if (!data.email) return { ok: false, skipped: true as const }
  const [firstname, ...last] = (data.name ?? '').trim().split(' ')

  const tags = ['#quiz', `#tribe-${data.tribe}`]
  if (data.isHybrid && data.secondary) tags.push(`#tribe-${data.secondary}`, '#hybrid')
  if (data.restSeason) tags.push('#rest-season')

  const result = await upsertContact({
    email: data.email,
    firstname: firstname || '',
    lastname: last.join(' '),
    tags,
    properties: {
      // These map to HubSpot contact properties. `primary_tribe`, `tribe_scores`,
      // and `mbti_type` are custom properties; `date_of_birth` is a standard
      // HubSpot property (format YYYY-MM-DD).
      ...(data.tribe ? { primary_tribe: data.tribe } : {}),
      tribe_scores: resultLabel(data),
      ...(data.mbti ? { mbti_type: data.mbti } : {}),
      ...(data.birthday ? { date_of_birth: data.birthday } : {}),
    },
  })
  return result
}

export async function POST(request: Request) {
  let body: QuizPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!isTribe(body.tribe)) {
    return NextResponse.json({ error: 'Invalid tribe' }, { status: 400 })
  }
  if (!body.email || !body.email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const origin = new URL(request.url).origin
  const resourceUrl = `${origin}/resources?tribe=${body.tribe}`

  const [airtable, hubspot, email] = await Promise.all([
    sendToAirtable(body),
    sendToHubSpot(body),
    sendQuizResultsEmail({
      to: body.email,
      name: body.name,
      tribeName: tribes[body.tribe].name,
      tribeTitle: tribes[body.tribe].title,
      resultLabel: resultLabel(body),
      mbti: body.mbti,
      isHybrid: body.isHybrid,
      restSeason: body.restSeason,
      resourceUrl,
    }),
  ])

  return NextResponse.json({
    success: true,
    integrations: {
      airtable: airtable.skipped ? 'not_configured' : airtable.ok ? 'sent' : 'error',
      hubspot: hubspot.skipped ? 'not_configured' : hubspot.ok ? 'sent' : 'error',
      email: email.skipped ? 'not_configured' : email.ok ? 'sent' : 'error',
    },
  })
}
