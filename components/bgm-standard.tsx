import { Gift, Camera, Video, Users, MapPin, FileText, Palette, Sparkles } from 'lucide-react'

const signatureTouches = [
  { icon: Gift, label: 'Beautifully curated welcome gift bags' },
  { icon: Palette, label: 'Cohesive BGM branding throughout' },
  { icon: Camera, label: 'Professional photographer' },
  { icon: Video, label: 'Professional videographer' },
  { icon: Users, label: 'Group photos' },
  { icon: Sparkles, label: 'Trip highlight video' },
  { icon: MapPin, label: 'Destination guide' },
  { icon: FileText, label: 'Beautifully designed itinerary' },
]

const standard = [
  'Beautiful destinations',
  'Luxury experiences',
  'Incredible people',
  'Thoughtful planning',
  'Cultural appreciation',
  'Authentic community',
  'Lasting friendships',
  'Memories they\u2019ll never forget',
]

export function BgmStandard() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Signature touches */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Signature BGM touches
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            The details you&apos;ll remember
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            When someone experiences one of our trips, we want them to
            immediately recognize: &ldquo;This is a Blaq Gurl Moves
            experience.&rdquo;
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {signatureTouches.map((touch) => (
            <div
              key={touch.label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                <touch.icon className="h-5 w-5 text-accent-foreground" aria-hidden />
              </div>
              <span className="text-sm font-medium leading-snug text-foreground">
                {touch.label}
              </span>
            </div>
          ))}
        </div>

        {/* The BGM Standard */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                The BGM standard
              </p>
              <h3 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground">
                When you travel with us, you&apos;re becoming part of the
                experience
              </h3>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                We aren&apos;t simply helping people travel. We&apos;re creating
                opportunities for our community to build friendships, celebrate
                life, experience new cultures, and create memories that last a
                lifetime.
              </p>
            </div>
            <div className="bg-primary p-8 text-primary-foreground md:p-12">
              <p className="font-serif text-xl font-semibold">
                When you hear Blaq Gurl Moves, think:
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {standard.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-primary-foreground/90"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
