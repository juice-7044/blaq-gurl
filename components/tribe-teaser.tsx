import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { tribeList } from '@/lib/tribes'

export function TribeTeaser() {
  return (
    <section id="tribes" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-medium uppercase tracking-[0.2em] text-[oklch(0.5_0.12_60)]">
            Find Your Tribe
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Every sister has a purpose to fulfill
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Blaq Gurl Moves is built on four tribes, each carrying a piece of the
            sisterhood&apos;s magic. Take our quiz to discover which one is yours
            and unlock resources made just for you.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tribeList.map((tribe) => (
            <div
              key={tribe.id}
              className="flex flex-col rounded-2xl bg-card p-6 ring-1 ring-border transition-shadow hover:shadow-lg"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full ${tribe.accentClass} font-serif text-xl font-bold text-white`}
              >
                {tribe.id}
              </span>
              <h3 className="mt-4 font-serif text-xl font-bold text-foreground">
                {tribe.title}
              </h3>
              <p className={`text-sm font-medium ${tribe.textClass}`}>
                {tribe.name}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {tribe.essence}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/quiz">
              Take the Tribe Quiz
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
