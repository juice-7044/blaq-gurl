import Image from 'next/image'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'

export const metadata: Metadata = {
  title: 'Origin of Our Colors & Logo | Blaq Gurl Moves',
  description:
    'Everything we do has a purpose — from our Blaxploitation-inspired logo to the meaning behind black, turquoise, and orange.',
}

const colorMeanings = [
  {
    name: 'Black',
    subtitle: 'Mysterious & protective',
    swatch: 'bg-[oklch(0.2_0.01_40)]',
    text: 'text-white',
    paragraphs: [
      'Black symbolizes how the world refers to us. In color psychology, black means power and control. It can be seen as intimidating because of the natural power it exudes.',
      'Black implies self-control and discipline, independence and a strong will, giving an impression of authority. It absorbs negative energy — it is useful to carry something black to protect you from harm when traveling.',
      'Black also symbolizes elegance, sophistication, and an air of mystery. It is the end, but the end always implies a new beginning.',
    ],
  },
  {
    name: 'Turquoise',
    subtitle: 'Open communication & clarity',
    swatch: 'bg-[oklch(0.55_0.09_195)]',
    text: 'text-white',
    paragraphs: [
      'Turquoise helps open the lines of communication between the heart and the spoken word. It is a friendly, happy color that enjoys life.',
      'It controls and heals the emotions, creating balance and stability. It recharges our spirits during mental stress and tiredness, and helps with clear thinking and decision-making.',
      'Turquoise encourages inner healing through empathy and caring. It heightens intuition and opens the door to spiritual growth. It is the color of the evolved soul.',
    ],
  },
  {
    name: 'Orange',
    subtitle: 'Adventure & social communication',
    swatch: 'bg-[oklch(0.7_0.16_55)]',
    text: 'text-white',
    paragraphs: [
      'Orange radiates warmth and happiness, combining the physical energy of red with the cheerfulness of yellow. It relates to our gut instincts.',
      'Orange offers emotional strength in difficult times, helping us bounce back from disappointment. It is optimistic and uplifting, rejuvenating our spirit.',
      'With its enthusiasm for life, orange relates to adventure and risk-taking, inspiring confidence and independence. It stimulates two-way conversation — it gets people thinking and talking.',
    ],
  },
]

export default function ColorsLogoPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="The Origins"
          title="A dose of Blaq Gurl Magick"
          description="Everything we do has a purpose and a meaning — down to our logo designs and the colors we chose to represent the company."
          image="/images/experience-spa.png"
        />

        <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-20">
          <div className="rounded-2xl bg-foreground p-8 md:p-12">
            <Image
              src="/images/bgm-logo.png"
              alt="Blaq Gurl Moves logo"
              width={706}
              height={150}
              className="mx-auto h-auto w-full max-w-md"
            />
          </div>
          <div className="mt-8 space-y-5 text-pretty text-lg leading-relaxed text-foreground/90">
            <p>
              The logos in every iteration were created to give you a dose of Blaq
              Gurl Magick. The Blaq Gurl Moves font is reminiscent of 1970s
              Blaxploitation, invoking that very BLAQ feel along with the elements
              of travel — the Eiffel Tower, flip flops, luggage tags, and, of
              course, the globe.
            </p>
            <p>
              Our flag — yes, we created our own flag — is a rising sun over a sea
              with thirteen rays, symbolizing the founding members of Blaq Gurl
              Moves. And our beautiful melanated, Afro-headed mascot further
              invokes Blaq Gurl Magick with full lips, a luscious Afro, and
              everything tying it to travel and Blaq Gurl dopeness.
            </p>
            <p>
              The colors were chosen purposely and with careful thought. As you
              read about each one, you will understand why we chose them to
              represent our company.
            </p>
          </div>
        </section>

        <section className="border-t border-border">
          {colorMeanings.map((color) => (
            <div key={color.name} className="border-b border-border">
              <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[280px_1fr] md:px-8 md:py-16">
                <div>
                  <div
                    className={`flex h-40 items-end rounded-2xl ${color.swatch} p-5`}
                  >
                    <span className={`font-serif text-2xl font-bold ${color.text}`}>
                      {color.name}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {color.subtitle}
                  </p>
                </div>
                <div className="space-y-4">
                  {color.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-pretty leading-relaxed text-foreground/90"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Our logos were brought to life by XRT Design Labs. Every color, every
            ray, and every curve of the lettering carries intention — because Blaq
            Gurl Magick lives in the details.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
