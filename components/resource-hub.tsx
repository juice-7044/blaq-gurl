'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, MapPin, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { tribeList, type TribeId } from '@/lib/tribes'
import {
  resourcesByTribe,
  categoryLabels,
  type ResourceCategory,
} from '@/lib/resources'

const categoryIcon: Record<ResourceCategory, typeof BookOpen> = {
  book: BookOpen,
  destination: MapPin,
  recommendation: Sparkles,
}

export function ResourceHub({ initialTribe }: { initialTribe: TribeId }) {
  const [active, setActive] = useState<TribeId>(initialTribe)
  const tribe = tribeList.find((t) => t.id === active)!
  const resources = resourcesByTribe[active]

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Tribe switcher */}
      <div className="flex flex-wrap justify-center gap-2">
        {tribeList.map((t) => {
          const selected = t.id === active
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                selected
                  ? `${t.accentClass} border-transparent text-white`
                  : 'border-border bg-card text-foreground hover:border-accent/50'
              }`}
            >
              {t.name} &middot; {t.title}
            </button>
          )
        })}
      </div>

      {/* Active tribe header */}
      <div className="mt-10 rounded-3xl border border-border bg-card p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${tribe.accentClass} font-serif text-4xl font-bold text-white`}
          >
            {tribe.id}
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              {tribe.name} &middot; {tribe.title}
            </h2>
            <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              {tribe.description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {tribe.focus.map((f) => (
            <span
              key={f}
              className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Resources grid */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => {
          const Icon = categoryIcon[r.category]
          return (
            <div
              key={r.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${tribe.accentClass} text-white`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className={`text-xs font-semibold uppercase tracking-wide ${tribe.textClass}`}>
                  {categoryLabels[r.category]}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-foreground">
                {r.title}
              </h3>
              {r.author && (
                <p className="text-sm text-muted-foreground">by {r.author}</p>
              )}
              <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                {r.blurb}
              </p>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-3xl border border-border bg-secondary/50 p-8 text-center md:p-12">
        <h3 className="font-serif text-2xl font-bold text-foreground">
          Not sure this is your tribe?
        </h3>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Take the quiz to discover where you truly belong in the sisterhood.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href="/quiz">
            Take the Tribe Quiz
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
