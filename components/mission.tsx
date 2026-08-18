import { Compass, Eye, Sparkles } from 'lucide-react'

const pillars = [
  {
    icon: Sparkles,
    title: 'Our Mission',
    body: 'To create luxury, culturally rich, and unforgettable travel experiences that bring our community together while showcasing incredible destinations around the world. We aren\u2019t simply booking vacations \u2014 we\u2019re creating experiences that inspire connection, celebration, and adventure.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    body: 'To become known for hosting beautifully curated travel experiences that people look forward to year after year. When someone travels with Blaq Gurl Moves, they should know they\u2019re receiving more than an itinerary \u2014 they\u2019re becoming part of an experience.',
  },
  {
    icon: Compass,
    title: 'Our Philosophy',
    body: 'Every traveler deserves a luxury experience. Our trips accommodate different budgets and preferences, but no traveler should ever feel they received a lesser experience. Every trip should feel intentional, elevated, polished, and memorable.',
  },
]

export function Mission() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Who we are
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            More than a trip. It&apos;s a whole experience.
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Thoughtfully curated experiences that inspire connection,
            celebration, adventure, and lifelong memories.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <pillar.icon className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <h3 className="mt-5 font-serif text-xl font-bold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
