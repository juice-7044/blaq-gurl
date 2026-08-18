import { Quote } from 'lucide-react'
import { testimonials } from '@/lib/site-data'

export function Testimonials() {
  return (
    <section id="stories" className="scroll-mt-24 bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Traveler stories
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
            Loved by women who move
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl bg-background p-8 shadow-lg"
            >
              <Quote className="h-8 w-8 text-accent" aria-hidden />
              <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <p className="font-serif text-lg font-bold text-foreground">
                  {t.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.location} &middot; {t.trip}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
