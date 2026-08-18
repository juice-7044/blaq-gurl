import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Who Are We | Blaq Gurl Moves',
  description:
    'The Genesis of Blaq Gurl Moves — how a 35th birthday trip to Napa became a sisterhood on the move.',
}

const story: string[] = [
  'What is Blaq Gurl Moves? Who are we? Why are you here?',
  'Blaq Gurl Moves, LLC is a company of thirteen amazing, beautiful, and phenomenal Black women of all shades, origins, and backgrounds.',
  'For my 35th birthday, I invited a group of women I admired and had a close bond with to join me for festivities in Napa and Sonoma Wine Country, and to stay together in an Airbnb so we could laugh, cook, clean, and bond as a group. All of them knew and had a personal relationship with me — but they did not all know one another.',
  'If you have ever planned a group trip, and especially a large one, you are probably rolling your eyes right now. But what ensued was nothing short of Blaq Gurl Magick.',
  'From "The World\u2019s Longest Toast, Ever!" to our first dinner and pajama jammy jam, to a morning facial before a short hike to see one of the oldest trees in North America, to Coppola\u2019s Vineyard and a great dinner in Oakland — we had a blast.',
  'And it rained the whole time until departure day, which turned out to be one of the most beautiful you could imagine. I was raised to see rain not as a bad omen but as a blessing, because without it nothing can grow. It sure did nurture and nourish our bonds.',
  'Out of all those women, not one complained or was anti-social. I was able to have one-on-one time with every woman. We spoke about our goals and our lives. We laughed, we cried, we networked, we supported each other, we discussed business, finance, and investments — and most importantly, we became a SISTERHOOD.',
  'High off that weekend, the next week I asked the group chat: "What if we could provide this EXPERIENCE to other Black women — on trips just like ours — so that people are thrust out of their comfort zones and have no choice but to step outside of their fears and heal, grow, connect, and build?"',
  'Every single lady replied: WHEN DO WE START?',
  'That was February 2019. We received our LLC in April 2019. Every trip has a theme. Every person who comes on our excursions has a purpose to fulfill.',
  'We are practicing group economics, together. We uplift, encourage, love, support, and cross-market each other in every way we can. Just because I am doing well does not mean you cannot do well too. What I eat takes no food from your mouth — and if we cook together, we will have more food.',
  'We come from every aspect of Mother Africa and her Diaspora. We are every shade from caf\u00e9 au lait to deep mahogany. Whether Afro-American, Afro-Latina, Afro-European, African, Afro-Asian, or Afro-Caribbean — it does not matter.',
  'This is the sisterhood you did not know you needed. We carry the world on our backs, and only we understand this burden. So let us unite in that sisterhood and pack our bags to travel at the same time.',
  'Whether you are a student, educator, entrepreneur, corporate boss, techie, or simply someone who wants to be around other Black women for inspiration and camaraderie — this is the company FOR YOU, by women who are JUST LIKE YOU.',
]

export default function WhoAreWePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="The Genesis"
          title="The sisterhood you didn't know you needed"
          description="How a 35th birthday weekend in wine country became a movement of Black women traveling, healing, and building together."
          image="/images/sisterhood.png"
        />

        <article className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-20">
          {story.map((para, i) => (
            <p
              key={i}
              className={`text-pretty leading-relaxed text-foreground/90 ${
                i === 0
                  ? 'font-serif text-2xl font-bold text-foreground'
                  : 'mt-6 text-lg'
              }`}
            >
              {para}
            </p>
          ))}

          <div className="mt-10 border-l-4 border-accent pl-6">
            <p className="font-serif text-xl italic text-foreground">
              Thank you and welcome,
            </p>
            <p className="mt-1 font-serif text-lg font-bold text-foreground">
              Carly
            </p>
            <p className="text-sm text-muted-foreground">
              CEO of Blaq Gurl Moves
            </p>
          </div>
        </article>

        <section className="bg-secondary py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
            <h2 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
              Ready to move with us?
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Discover your tribe and explore the journeys we have planned for the
              sisterhood.
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
                <Link href="/#destinations">Explore Trips</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
