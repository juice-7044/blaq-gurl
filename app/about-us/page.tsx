import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { Button } from '@/components/ui/button'
import { tribeList } from '@/lib/tribes'
import { team } from '@/lib/team'

export const metadata: Metadata = {
  title: 'About Us | Blaq Gurl Moves',
  description:
    'Meet the sisterhood behind Blaq Gurl Moves — thirteen phenomenal Black women organized into four tribes, each shaping the journey.',
}

export default function AboutUsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Our Journey"
          title="The women who move the world with us"
          description="Blaq Gurl Moves is a company of thirteen amazing, beautiful, and phenomenal Black women of all shades, origins, and backgrounds — organized into four tribes, each carrying its own magic."
          image="/images/sisterhood.png"
        />

        <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Four tribes, one sisterhood
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Every trip has a theme, and every person who joins our excursions has
            a purpose to fulfill. Our leadership is grouped into four tribes that
            guide the small-group sessions on each retreat.
          </p>
        </section>

        {tribeList.map((tribe) => {
          const members = team.filter((m) => m.tribe === tribe.id)
          return (
            <section
              key={tribe.id}
              className="border-t border-border py-16 md:py-20"
            >
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tribe.accentClass} font-serif text-2xl font-bold text-white`}
                  >
                    {tribe.id}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                      {tribe.name} &middot; {tribe.title}
                    </h3>
                    <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
                      {tribe.description}
                    </p>
                  </div>
                </div>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((member) => (
                    <article
                      key={member.name}
                      className="flex flex-col rounded-2xl bg-card p-6 ring-1 ring-border"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${tribe.accentClass} font-serif text-lg font-bold text-white`}
                          aria-hidden
                        >
                          {member.name.charAt(0)}
                        </span>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-foreground">
                            {member.name}
                          </h4>
                          <p className={`text-sm font-medium ${tribe.textClass}`}>
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {member.bio}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        <section className="bg-secondary py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
            <h2 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
              Which tribe do you belong to?
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              The sisterhood is not just for our founders. Take the quiz to
              discover your tribe and find resources aligned to your journey.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/quiz">Find Your Tribe</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/who-are-we">Read Our Origin Story</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
