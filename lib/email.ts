import 'server-only'

type SendResult = { ok: boolean; skipped: boolean; error?: string }

export type QuizResultsEmailInput = {
  to: string
  name?: string
  tribeName: string
  tribeTitle: string
  resultLabel: string
  mbti?: string
  isHybrid?: boolean
  restSeason?: boolean
  resourceUrl: string
}

/**
 * Sends the quiz taker their results via Resend.
 * Requires RESEND_API_KEY. The "from" address defaults to onboarding@resend.dev
 * for testing, but set RESEND_FROM_EMAIL to a verified domain sender in prod.
 * Skips gracefully when not configured so the quiz never blocks on email.
 */
export async function sendQuizResultsEmail(
  input: QuizResultsEmailInput,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, skipped: true }
  if (!input.to || !input.to.includes('@')) {
    return { ok: false, skipped: false, error: 'invalid_email' }
  }

  const from = process.env.RESEND_FROM_EMAIL || 'Blaq Gurl Moves <onboarding@resend.dev>'
  const firstName = (input.name ?? '').trim().split(' ')[0] || 'Friend'

  const restNote = input.restSeason
    ? `<p style="margin:16px 0;padding:14px 16px;background:#f4efe6;border-radius:12px;color:#5b5346;font-size:14px;line-height:1.6;">
        Your answers suggest you may be in a <strong>season of rest</strong> — and that's okay.
        Your Tribe reflects your strengths, and the sisterhood is here whenever you need support.
      </p>`
    : ''

  const html = `<!doctype html>
  <html>
    <body style="margin:0;background:#faf7f1;font-family:Georgia,'Times New Roman',serif;">
      <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
        <p style="text-transform:uppercase;letter-spacing:3px;font-size:12px;color:#1f7a72;font-family:Arial,sans-serif;margin:0 0 8px;">Blaq Gurl Moves</p>
        <h1 style="font-size:26px;color:#2a2620;margin:0 0 4px;">${firstName}, you belong to</h1>
        <h2 style="font-size:30px;color:#1f7a72;margin:0 0 16px;">${input.tribeName} · ${input.tribeTitle}</h2>
        ${
          input.mbti
            ? `<p style="display:inline-block;background:#1f7a72;color:#fff;padding:6px 14px;border-radius:999px;font-family:Arial,sans-serif;font-size:13px;margin:0 0 16px;">Personality type: ${input.mbti}</p>`
            : ''
        }
        <p style="font-size:16px;color:#4a453d;line-height:1.7;font-family:Arial,sans-serif;">
          Here's your result: <strong>${input.resultLabel}</strong>.
          We've curated a Resource Hub — books, destinations, and practices — just for your Tribe.
        </p>
        ${restNote}
        <a href="${input.resourceUrl}" style="display:inline-block;margin:20px 0;background:#e0a33e;color:#2a2620;text-decoration:none;padding:14px 26px;border-radius:999px;font-family:Arial,sans-serif;font-weight:bold;font-size:15px;">Explore Your Resource Hub</a>
        <p style="font-size:13px;color:#8a8378;line-height:1.6;font-family:Arial,sans-serif;margin-top:24px;">
          You're receiving this because you took the "What Tribe Are You?" quiz at Blaq Gurl Moves.
          Sisterhood on the move.
        </p>
      </div>
    </body>
  </html>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: `${firstName}, your Blaq Gurl Moves Tribe is ${input.tribeName}`,
        html,
      }),
    })
    if (!res.ok) {
      const detail = await res.text()
      console.log('[v0] Resend email error:', res.status, detail)
    }
    return { ok: res.ok, skipped: false }
  } catch (err) {
    console.log('[v0] Resend email error:', (err as Error).message)
    return { ok: false, skipped: false, error: (err as Error).message }
  }
}
