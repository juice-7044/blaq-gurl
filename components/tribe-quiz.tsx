'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Compass,
  Scale,
  Rocket,
  Leaf,
  Moon,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  quizQuestions,
  mbtiQuestions,
  buildResult,
  type TribeAnswer,
  type MbtiLetter,
  type QuizResult,
} from '@/lib/quiz'
import { tribes, hybridFor, type TribeId, type Tribe } from '@/lib/tribes'
import { resourcesByTribe, categoryLabels } from '@/lib/resources'

type Stage = 'intro' | 'tribe' | 'mbti' | 'result'

const symbolIcon = {
  compass: Compass,
  scale: Scale,
  rocket: Rocket,
  leaf: Leaf,
} as const

function TribeIcon({ tribe, className }: { tribe: Tribe; className?: string }) {
  const Icon = symbolIcon[tribe.symbol]
  return <Icon className={className} aria-hidden />
}

function FounderAvatars({ tribe }: { tribe: Tribe }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {tribe.founders.map((f) => {
        const initials = f
          .replace(/[“”"]/g, '')
          .split(' ')[0]
          .slice(0, 2)
          .toUpperCase()
        return (
          <div key={f} className="flex items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${tribe.accentClass} text-sm font-semibold text-white`}
            >
              {initials}
            </div>
            <span className="text-sm font-medium text-foreground">{f}</span>
          </div>
        )
      })}
    </div>
  )
}

export function TribeQuiz() {
  const [stage, setStage] = useState<Stage>('intro')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')

  const [step, setStep] = useState(0)
  const [tribeAnswers, setTribeAnswers] = useState<(TribeAnswer | null)[]>(
    Array(quizQuestions.length).fill(null),
  )

  const [mbtiStep, setMbtiStep] = useState(0)
  const [mbtiAnswers, setMbtiAnswers] = useState<(MbtiLetter | null)[]>(
    Array(mbtiQuestions.length).fill(null),
  )

  const [result, setResult] = useState<QuizResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const confettiFired = useRef(false)

  /* Multi-colored confetti cascading down the page for ~9s on results. */
  useEffect(() => {
    if (stage !== 'result' || confettiFired.current) return
    confettiFired.current = true

    const colors = [
      '#1f7a72', // deep teal
      '#e0a33e', // gold
      '#c8683f', // warm clay
      '#7a9b5e', // sage green
      '#f4e4c1', // cream
      '#d94f6b', // rose
    ]
    const durationMs = 9000
    const end = Date.now() + durationMs

    const frame = () => {
      const timeLeft = end - Date.now()
      if (timeLeft <= 0) return
      // Cascade down from across the top edge.
      confetti({
        particleCount: 5,
        startVelocity: 32,
        angle: 90,
        spread: 70,
        gravity: 1.05,
        ticks: 320,
        origin: { x: Math.random(), y: -0.1 },
        colors,
        disableForReducedMotion: true,
      })
      requestAnimationFrame(frame)
    }
    frame()

    // Two celebratory bursts from the lower corners at the start.
    const burst = (x: number) =>
      confetti({
        particleCount: 90,
        spread: 80,
        startVelocity: 55,
        origin: { x, y: 0.9 },
        colors,
        disableForReducedMotion: true,
      })
    burst(0.15)
    burst(0.85)
  }, [stage])

  const tribeTotal = quizQuestions.length
  const mbtiTotal = mbtiQuestions.length
  const grandTotal = tribeTotal + mbtiTotal

  const answeredSoFar =
    tribeAnswers.filter(Boolean).length + mbtiAnswers.filter(Boolean).length
  const progress = Math.round((answeredSoFar / grandTotal) * 100)

  function startQuiz(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.includes('@')) return
    setStage('tribe')
  }

  function selectTribe(value: TribeAnswer) {
    const next = [...tribeAnswers]
    next[step] = value
    setTribeAnswers(next)
    setTimeout(() => {
      if (step < tribeTotal - 1) setStep(step + 1)
      else setStage('mbti')
    }, 200)
  }

  function selectMbti(letter: MbtiLetter) {
    const next = [...mbtiAnswers]
    next[mbtiStep] = letter
    setMbtiAnswers(next)
    setTimeout(() => {
      if (mbtiStep < mbtiTotal - 1) setMbtiStep(mbtiStep + 1)
      else finish(next)
    }, 200)
  }

  async function finish(finalMbti: (MbtiLetter | null)[]) {
    const cleanTribe = tribeAnswers.filter(
      (a): a is TribeAnswer => a !== null,
    )
    const cleanMbti = finalMbti.filter((a): a is MbtiLetter => a !== null)
    const res = buildResult(cleanTribe, cleanMbti)
    setResult(res)
    setStage('result')
    setSubmitting(true)
    try {
      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          birthday,
          tribe: res.primary,
          secondary: res.secondary,
          isHybrid: res.isHybrid,
          mbti: res.mbti,
          restSeason: res.restSeason,
          scores: res.scores,
          percentages: res.percentages,
        }),
      })
    } catch {
      // Result still shows even if the lead sync fails.
    } finally {
      setSubmitting(false)
    }
  }

  /* ----------------------------- INTRO ----------------------------- */
  if (stage === 'intro') {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 md:p-10">
        <div className="flex items-center gap-2 text-[oklch(0.5_0.12_60)]">
          <Sparkles className="h-5 w-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-widest">
            What Tribe Are You?
          </span>
        </div>
        <h2 className="mt-4 font-serif text-3xl font-bold text-foreground">
          Discover where you thrive
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Are you a Strategist, Balancer, Hustler, or Healer? Answer{' '}
          {grandTotal} quick questions — {tribeTotal} to find your Tribe and{' '}
          {mbtiTotal} to reveal your personality type — and unlock a Resource
          Hub curated just for you.
        </p>

        <div className="mt-5 rounded-xl border border-border bg-secondary/50 p-4 text-sm leading-relaxed text-muted-foreground">
          This is a <strong className="text-foreground">self-discovery tool</strong>
          , not a clinical assessment. Your Tribe reflects your strengths and
          aspirations, not your struggles. If you’re feeling overwhelmed, know
          you’re not alone — reach out to our community for support.
        </div>

        <form onSubmit={startQuiz} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              First name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none ring-ring/50 focus:ring-2"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none ring-ring/50 focus:ring-2"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label htmlFor="birthday" className="text-sm font-medium text-foreground">
              Birthday{' '}
              <span className="font-normal text-muted-foreground">
                (so we can celebrate you)
              </span>
            </label>
            <input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none ring-ring/50 focus:ring-2"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Start the Quiz
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            We&apos;ll email your results and occasional travel inspiration. No
            spam.
          </p>
        </form>
      </div>
    )
  }

  /* --------------------------- PROGRESS BAR --------------------------- */
  const ProgressBar = ({ label }: { label: string }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )

  /* --------------------------- TRIBE QUESTIONS --------------------------- */
  if (stage === 'tribe') {
    const current = quizQuestions[step]
    return (
      <div className="mx-auto max-w-2xl">
        <ProgressBar label={`Part 1 · Question ${step + 1} of ${tribeTotal}`} />
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <h2 className="text-balance font-serif text-2xl font-bold text-foreground md:text-3xl">
            {current.question}
          </h2>
          <div className="mt-6 space-y-3">
            {current.options.map((opt) => {
              const selected = tribeAnswers[step] === opt.value
              const isRest = opt.value === 'E'
              return (
                <button
                  key={opt.text}
                  onClick={() => selectTribe(opt.value)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                    selected
                      ? 'border-accent bg-accent/10'
                      : isRest
                        ? 'border-dashed border-border bg-secondary/40 hover:border-accent/50'
                        : 'border-border bg-background hover:border-accent/50 hover:bg-secondary/50'
                  }`}
                >
                  <span className="flex items-center gap-2 text-foreground">
                    {isRest && (
                      <Moon
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    )}
                    {opt.text}
                  </span>
                  {selected && (
                    <Check className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    )
  }

  /* ----------------------------- MBTI QUESTIONS ----------------------------- */
  if (stage === 'mbti') {
    const current = mbtiQuestions[mbtiStep]
    return (
      <div className="mx-auto max-w-2xl">
        <ProgressBar label={`Part 2 · Personality ${mbtiStep + 1} of ${mbtiTotal}`} />
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.5_0.12_60)]">
            A quick gut-check
          </p>
          <h2 className="mt-2 text-balance font-serif text-2xl font-bold text-foreground md:text-3xl">
            {current.question}
          </h2>
          <div className="mt-6 space-y-3">
            {current.options.map((opt) => {
              const selected = mbtiAnswers[mbtiStep] === opt.letter
              return (
                <button
                  key={opt.letter}
                  onClick={() => selectMbti(opt.letter)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                    selected
                      ? 'border-accent bg-accent/10'
                      : 'border-border bg-background hover:border-accent/50 hover:bg-secondary/50'
                  }`}
                >
                  <span className="text-foreground">{opt.text}</span>
                  {selected && (
                    <Check className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              if (mbtiStep === 0) setStage('tribe')
              else setMbtiStep(mbtiStep - 1)
            }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    )
  }

  /* ------------------------------- RESULT ------------------------------- */
  if (!result) return null
  const primary = tribes[result.primary]
  const hybrid =
    result.isHybrid && result.secondary
      ? hybridFor(result.primary, result.secondary)
      : null
  const secondaryTribe = result.secondary ? tribes[result.secondary] : null
  const resources = resourcesByTribe[primary.id]

  const headline = hybrid
    ? `${primary.name}/${secondaryTribe!.name} · ${hybrid.title}`
    : `${primary.name} · ${primary.title}`

  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        {/* Badge header */}
        <div className={`${primary.accentClass} px-8 py-12 text-center text-white`}>
          <p className="text-sm font-semibold uppercase tracking-widest opacity-90">
            {name ? `${name}, you belong to` : 'You belong to'}
          </p>
          <div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
            {hybrid ? (
              <Heart className="h-9 w-9" aria-hidden />
            ) : (
              <TribeIcon tribe={primary} className="h-9 w-9" />
            )}
          </div>
          <h2 className="mt-4 text-balance font-serif text-3xl font-bold md:text-4xl">
            {headline}
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-4 w-4" aria-hidden />
            Personality type: {result.mbti}
          </div>
        </div>

        <div className="p-8 md:p-10">
          {/* Rest-season sensitivity */}
          {result.restSeason && (
            <div className="mb-8 flex gap-3 rounded-2xl border border-border bg-secondary/50 p-5">
              <Moon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your answers suggest you’re in a{' '}
                <strong className="text-foreground">season of rest</strong> — and
                that’s okay. Your Tribe reflects your strengths, but we see you
                might need extra support right now. You’re still a vital part of
                the sisterhood. Explore our self-care resources or reach out to
                your Tribe for encouragement.
              </p>
            </div>
          )}

          {/* Description */}
          <p className="leading-relaxed text-foreground/90">
            {hybrid ? hybrid.description : primary.description}
          </p>

          {/* Hybrid breakdown */}
          {hybrid && secondaryTribe && (
            <div className="mt-6 space-y-3">
              {[primary, secondaryTribe].map((t) => (
                <div key={t.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <TribeIcon tribe={t} className={`h-4 w-4 ${t.textClass}`} />
                      {t.name} · {t.title}
                    </span>
                    <span className="text-muted-foreground">
                      {result.percentages[t.id]}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${t.accentClass}`}
                      style={{ width: `${result.percentages[t.id]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Strengths / journey */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Your strengths
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {primary.strengths}
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Your journey
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {primary.growth}
              </p>
            </div>
          </div>

          {/* Gentle reminder — the soft background is always a pale tint, so pin
              the text to a fixed dark color for legibility inside the dark card. */}
          <div className={`mt-6 rounded-2xl ${primary.softClass} p-5`}>
            <p className="text-sm leading-relaxed text-[oklch(0.24_0.02_40)]">
              <span className="font-semibold">A gentle reminder: </span>
              {primary.gentleReminder}
            </p>
          </div>

          {/* Traits */}
          <div className="mt-6 flex flex-wrap gap-2">
            {primary.traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
              >
                {trait}
              </span>
            ))}
          </div>

          {/* MBTI guide */}
          <div className="mt-6 rounded-2xl border border-border p-5">
            <p className="text-sm text-muted-foreground">
              Because you’re a{' '}
              <strong className="text-foreground">{result.mbti}</strong>, your
              recommended guide is:
            </p>
            <p className={`mt-1 font-serif text-lg font-bold ${primary.textClass}`}>
              {primary.mbtiGuide}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Types that often align with {primary.name}:{' '}
              {primary.mbtiTypes.join(', ')}
            </p>
          </div>

          {/* Founders */}
          <div className="mt-8 border-t border-border pt-8">
            <h3 className="font-serif text-xl font-bold text-foreground">
              Your Tribe founders
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You’re in tune with the women who lead {primary.name} — the same
              energy they bring to every retreat session.
            </p>
            <div className="mt-4">
              <FounderAvatars tribe={primary} />
            </div>
          </div>

          {/* Resource preview */}
          <div className="mt-8 border-t border-border pt-8">
            <h3 className="font-serif text-xl font-bold text-foreground">
              Curated for {primary.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              A taste of your Resource Hub — books, destinations, and practices
              aligned to your tribe.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {resources.slice(0, 3).map((r) => (
                <div
                  key={r.title}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${primary.textClass}`}
                  >
                    {categoryLabels[r.category]}
                  </span>
                  <p className="mt-1 font-medium text-foreground">{r.title}</p>
                  {r.author && (
                    <p className="text-xs text-muted-foreground">{r.author}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href={`/resources?tribe=${primary.id}`}>
                Explore Your Resource Hub
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/trips">See Upcoming Trips</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {submitting
              ? 'Saving your results...'
              : 'Your results have been saved. Check your inbox soon.'}
          </p>
        </div>
      </div>
    </div>
  )
}
