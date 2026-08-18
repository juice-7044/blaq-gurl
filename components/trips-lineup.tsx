'use client'

import { useState } from 'react'
import { MapPin, Sparkles, CalendarDays } from 'lucide-react'
import { trips2027, type MonthlyTrip } from '@/lib/trips-2027'
import { WaitlistModal } from '@/components/waitlist-modal'

function TripCard({
  trip,
  onJoin,
}: {
  trip: MonthlyTrip
  onJoin: (trip: MonthlyTrip) => void
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={trip.image || '/placeholder.svg'}
          alt={`${trip.title} — ${trip.region}`}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
        <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          {trip.region}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-background/90">
            {trip.month} 2027
          </p>
          <h3 className="mt-1 text-balance font-serif text-2xl font-bold text-background">
            {trip.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {trip.dates && (
          <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-primary">
            <CalendarDays className="h-4 w-4" aria-hidden />
            {trip.dates}
          </p>
        )}
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {trip.blurb}
        </p>

        <ul className="mt-6 space-y-4">
          {trip.options.map((opt, i) => (
            <li key={i} className="rounded-xl bg-secondary/60 p-4">
              {opt.name && (
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                  {opt.name}
                </p>
              )}
              <ul className="mt-2 flex flex-wrap gap-2">
                {opt.highlights.map((h, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                  >
                    <MapPin className="h-3 w-3 text-primary" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <span className="text-sm font-medium text-muted-foreground">
            Pricing coming soon
          </span>
          <button
            type="button"
            onClick={() => onJoin(trip)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Join the waitlist
          </button>
        </div>
      </div>
    </article>
  )
}

export function TripsLineup() {
  const regions = ['All', ...Array.from(new Set(trips2027.map((t) => t.region)))]
  const [region, setRegion] = useState('All')
  const [waitlistTrip, setWaitlistTrip] = useState<MonthlyTrip | null>(null)

  const filtered =
    region === 'All'
      ? trips2027
      : trips2027.filter((t) => t.region === region)

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap gap-2">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                region === r
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} onJoin={setWaitlistTrip} />
          ))}
        </div>
      </div>

      {waitlistTrip && (
        <WaitlistModal
          trip={{
            id: waitlistTrip.id,
            title: waitlistTrip.title,
            month: waitlistTrip.month,
          }}
          onClose={() => setWaitlistTrip(null)}
        />
      )}
    </section>
  )
}
