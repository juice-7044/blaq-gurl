import 'server-only'

const HUBSPOT_BASE = 'https://api.hubapi.com'

type HubSpotResult = {
  ok: boolean
  skipped: boolean
  error?: string
}

function getToken() {
  return process.env.HUBSPOT_ACCESS_TOKEN
}

/**
 * HubSpot has no native "tags" concept, so we store them in a custom contact
 * property named `bgm_tags` (create this as a multi-line text property in
 * HubSpot). Tags are merged with any existing values so we never overwrite.
 */
async function fetchExistingTags(email: string, token: string): Promise<string[]> {
  try {
    const res = await fetch(
      `${HUBSPOT_BASE}/crm/v3/objects/contacts/${encodeURIComponent(
        email,
      )}?idProperty=email&properties=bgm_tags`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!res.ok) return []
    const data = (await res.json()) as { properties?: { bgm_tags?: string } }
    const raw = data.properties?.bgm_tags
    if (!raw) return []
    return raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

export type UpsertContactInput = {
  email: string
  firstname?: string
  lastname?: string
  /** Tags to merge onto the contact's `bgm_tags` property, e.g. ["#newsletter"]. */
  tags?: string[]
  /** Any additional standard/custom contact properties. */
  properties?: Record<string, string>
}

/**
 * Creates or updates a HubSpot contact by email and merges tags.
 */
export async function upsertContact(
  input: UpsertContactInput,
): Promise<HubSpotResult> {
  const token = getToken()
  if (!token) return { ok: false, skipped: true }
  if (!input.email || !input.email.includes('@')) {
    return { ok: false, skipped: false, error: 'invalid_email' }
  }

  try {
    const existingTags = input.tags?.length
      ? await fetchExistingTags(input.email, token)
      : []
    const mergedTags = Array.from(
      new Set([...existingTags, ...(input.tags ?? [])]),
    )

    const properties: Record<string, string> = {
      email: input.email,
      ...(input.firstname ? { firstname: input.firstname } : {}),
      ...(input.lastname ? { lastname: input.lastname } : {}),
      ...(input.properties ?? {}),
      ...(mergedTags.length ? { bgm_tags: mergedTags.join(', ') } : {}),
    }

    // Create first; if the contact already exists (409), update by email.
    const createRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    })

    if (createRes.ok) return { ok: true, skipped: false }

    if (createRes.status === 409) {
      const updateRes = await fetch(
        `${HUBSPOT_BASE}/crm/v3/objects/contacts/${encodeURIComponent(
          input.email,
        )}?idProperty=email`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ properties }),
        },
      )
      if (!updateRes.ok) {
        const detail = await updateRes.text()
        console.log('[v0] HubSpot update error:', updateRes.status, detail)
      }
      return { ok: updateRes.ok, skipped: false }
    }

    const detail = await createRes.text()
    console.log('[v0] HubSpot create error:', createRes.status, detail)
    return { ok: false, skipped: false, error: `status_${createRes.status}` }
  } catch (err) {
    console.log('[v0] HubSpot error:', (err as Error).message)
    return { ok: false, skipped: false, error: (err as Error).message }
  }
}

/**
 * Sends a HubSpot transactional confirmation email via the single-send API.
 * Requires the transactional email add-on and a published transactional email
 * whose id is provided via env. Skips gracefully if not configured.
 */
export async function sendTransactionalEmail(params: {
  emailId?: string
  to: string
  customProperties?: Record<string, string>
}): Promise<HubSpotResult> {
  const token = getToken()
  if (!token || !params.emailId) return { ok: false, skipped: true }

  try {
    const res = await fetch(
      `${HUBSPOT_BASE}/marketing/v3/transactional/single-email/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailId: Number(params.emailId),
          message: { to: params.to },
          customProperties: params.customProperties ?? {},
        }),
      },
    )
    if (!res.ok) {
      const detail = await res.text()
      console.log('[v0] HubSpot email error:', res.status, detail)
    }
    return { ok: res.ok, skipped: false }
  } catch (err) {
    console.log('[v0] HubSpot email error:', (err as Error).message)
    return { ok: false, skipped: false, error: (err as Error).message }
  }
}
