'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalIcon } from 'lucide-react'
import { events, eventTypeLabels, type BgmEvent, type EventType } from '@/lib/events'
import { Button } from '@/components/ui/button'
import { CheckoutModal } from '@/components/checkout-modal'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const typeStyles: Record<EventType, { dot: string; badge: string }> = {
  trip: {
    dot: 'bg-accent',
    badge: 'bg-accent/15 text-[oklch(0.45_0.12_60)]',
  },
  local: {
    dot: 'bg-primary',
    badge: 'bg-primary/15 text-primary',
  },
  virtual: {
    dot: 'bg-[oklch(0.5_0.1_150)]',
    badge: 'bg-[oklch(0.5_0.1_150)]/15 text-[oklch(0.45_0.1_150)]',
  },
}

function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatRange(ev: BgmEvent) {
  const start = parseDate(ev.date)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (ev.endDate) {
    const end = parseDate(ev.endDate)
    return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
  }
  return start.toLocaleDateString('en-US', { ...opts, year: 'numeric' })
}

export function EventCalendar() {
  const firstEvent = parseDate([...events].sort((a, b) => a.date.localeCompare(b.date))[0].date)
  const [cursor, setCursor] = useState(new Date(firstEvent.getFullYear(), firstEvent.getMonth(), 1))
  const [filter, setFilter] = useState<EventType | 'all'>('all')
  const [checkoutEvent, setCheckoutEvent] = useState<BgmEvent | null>(null)

  const filtered = useMemo(
    () => events.filter((e) => filter === 'all' || e.type === filter),
    [filter],
  )

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const eventsByDay = useMemo(() => {
    const map: Record<number, BgmEvent[]> = {}
    filtered.forEach((ev) => {
      const d = parseDate(ev.date)
      if (d.getFullYear() === year && d.getMonth() === month) {
        ;(map[d.getDate()] ||= []).push(ev)
      }
    })
    return map
  }, [filtered, year, month])

  const upcoming = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => a.date.localeCompare(b.date))
        .filter((e) => parseDate(e.endDate || e.date) >= new Date(new Date().toDateString())),
    [filtered],
  )

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {(['all', 'trip', 'local', 'virtual'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === t
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
            }`}
          >
            {t === 'all' ? 'All Events' : eventTypeLabels[t] + 's'}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Calendar grid */}
        <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-foreground md:text-2xl">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCursor(new Date(year, month - 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCursor(new Date(year, month + 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center">
            {DOW.map((d) => (
              <div
                key={d}
                className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              const dayEvents = day ? eventsByDay[day] || [] : []
              return (
                <div
                  key={i}
                  className={`min-h-16 rounded-lg border p-1.5 text-left md:min-h-20 ${
                    day
                      ? dayEvents.length
                        ? 'border-border bg-secondary/50'
                        : 'border-border/60'
                      : 'border-transparent'
                  }`}
                >
                  {day && (
                    <>
                      <span className="text-xs font-medium text-foreground">
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className="flex items-center gap-1"
                            title={ev.title}
                          >
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${typeStyles[ev.type].dot}`}
                            />
                            <span className="truncate text-[10px] leading-tight text-muted-foreground md:text-xs">
                              {ev.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming list */}
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground md:text-2xl">
            Upcoming
          </h2>
          <ul className="mt-5 space-y-4">
            {upcoming.length === 0 && (
              <li className="text-muted-foreground">No upcoming events in this filter.</li>
            )}
            {upcoming.map((ev) => (
              <li
                key={ev.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[ev.type].badge}`}
                  >
                    {eventTypeLabels[ev.type]}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <CalIcon className="h-3.5 w-3.5" aria-hidden />
                    {formatRange(ev)}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-lg font-bold text-foreground">
                  {ev.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {ev.location}
                </p>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {ev.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  {ev.priceInCents ? (
                    <span className="text-sm font-semibold text-foreground">
                      ${(ev.priceInCents / 100).toFixed(2)}
                      <span className="font-normal text-muted-foreground">
                        {' '}
                        / ticket
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-[oklch(0.5_0.1_150)]">
                      Free
                    </span>
                  )}
                  {ev.priceInCents ? (
                    <Button
                      size="sm"
                      onClick={() => setCheckoutEvent(ev)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Buy Ticket
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCheckoutEvent(null)}
                      className="pointer-events-none opacity-70"
                    >
                      RSVP
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {checkoutEvent?.priceInCents && (
        <CheckoutModal
          item={{ kind: 'event-ticket', id: checkoutEvent.id, quantity: 1 }}
          title={checkoutEvent.title}
          onClose={() => setCheckoutEvent(null)}
        />
      )}
    </div>
  )
}
