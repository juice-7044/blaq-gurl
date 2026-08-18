import { travelTips } from '@/lib/site-data'

export function TravelTips() {
  return (
    <section id="tips" className="scroll-mt-24 bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Travel tips
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Move smarter, not harder
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Little rituals from our most seasoned travelers to keep every
            journey smooth and glowing.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {travelTips.map((tip, i) => (
            <div
              key={tip.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span className="font-serif text-3xl font-bold text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-serif text-lg font-bold text-foreground">
                {tip.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tip.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
