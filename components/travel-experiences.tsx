import { Check, Star } from 'lucide-react'

const tiers = [
  {
    name: 'Discover',
    tagline: 'Our most accessible luxury experience.',
    description:
      'Perfect for travelers looking to experience a beautifully curated BGM trip while enjoying the camaraderie of the group.',
    highlight: false,
    includes: [
      'Shared accommodations',
      'Curated BGM welcome gift bag',
      'Welcome reception',
      'Farewell celebration',
      'One featured group excursion each day',
      'Nightly group dinners',
      'Professional photography & videography',
      'Dedicated free time for independent exploration',
    ],
  },
  {
    name: 'Immerse',
    tagline: 'Deeper comfort, deeper connection.',
    description:
      'Designed for travelers who want additional comfort while diving deeper into the destination. Everything in Discover, plus:',
    highlight: true,
    includes: [
      'Private room or upgraded accommodations',
      'Additional curated experiences',
      'Premium amenities',
      'Enhanced destination experiences',
    ],
  },
  {
    name: 'Indulge',
    tagline: 'Our signature luxury experience.',
    description:
      'Designed for travelers who want the ultimate BGM experience. Everything in Immerse, plus:',
    highlight: false,
    includes: [
      'Highest available room category',
      'VIP amenities',
      'Exclusive luxury experiences',
      'Enhanced welcome gifts',
      'Concierge-style touches throughout the trip',
    ],
  },
]

export function TravelExperiences() {
  return (
    <section id="experiences" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our travel experiences
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Three ways to experience the world
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Three curated experiences designed to accommodate different travel
            styles while maintaining the same BGM luxury standard.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.highlight
                  ? 'relative rounded-3xl border-2 border-primary bg-card p-8 shadow-xl'
                  : 'rounded-3xl border border-border bg-card p-8'
              }
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-8 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Star className="h-3 w-3" aria-hidden />
                  Most popular
                </span>
              )}
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {tier.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">
                {tier.tagline}
              </p>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {tier.description}
              </p>
              <ul className="mt-6 space-y-3">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span className="text-sm leading-relaxed text-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Shared BGM experience */}
        <div className="mt-16 grid gap-8 rounded-3xl bg-primary p-8 text-primary-foreground md:grid-cols-2 md:p-12">
          <div>
            <h3 className="text-balance font-serif text-2xl font-bold md:text-3xl">
              However you travel, we experience the destination together
            </h3>
            <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/85">
              Regardless of the experience level selected, every itinerary is
              built around meaningful shared moments &mdash; while giving everyone
              the flexibility to enjoy the destination in their own way.
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-accent">
              To begin, we host one signature group trip each quarter.
            </p>
          </div>
          <ul className="grid gap-3 self-center">
            {[
              'Welcome reception',
              'Farewell celebration',
              'One featured group excursion each day',
              'Nightly group dinners',
              'Dedicated free time for independent exploration',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  aria-hidden
                />
                <span className="leading-relaxed text-primary-foreground/90">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
