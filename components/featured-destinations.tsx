import { MapPin, Clock, Users } from 'lucide-react'
import { destinations } from '@/lib/site-data'
import { BookTripButton } from '@/components/book-trip-button'

export function FeaturedDestinations() {
  return (
    <section id="destinations" className="scroll-mt-24 bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Featured escapes
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
              Where we&apos;re moving next
            </h2>
          </div>
          <a
            href="/trips"
            className="shrink-0 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            See the full 2027 lineup
          </a>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <article
              key={dest.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={dest.image || '/placeholder.svg'}
                  alt={`${dest.name}, ${dest.country}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {dest.spots} spots left
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden />
                  {dest.country}
                </div>
                <h3 className="mt-1 font-serif text-2xl font-bold text-foreground">
                  {dest.name}
                </h3>
                <p className="mt-1 text-pretty text-muted-foreground">
                  {dest.tagline}
                </p>

                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" aria-hidden />
                    {dest.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" aria-hidden />
                    Group trip
                  </span>
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-serif text-2xl font-bold text-foreground">
                      ${dest.price.toLocaleString()}
                    </p>
                  </div>
                  <BookTripButton
                    destination={dest.name}
                    price={dest.price}
                    slug={dest.slug}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
