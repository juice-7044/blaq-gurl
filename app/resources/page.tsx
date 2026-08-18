import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { ResourceHub } from '@/components/resource-hub'
import type { TribeId } from '@/lib/tribes'

export const metadata: Metadata = {
  title: 'Resource Hub | Blaq Gurl Moves',
  description:
    'Books, destinations, and recommendations curated for your Blaq Gurl Moves tribe — Architects, Balancers, Hustlers, and Healers.',
}

const validTribes: TribeId[] = ['A', 'B', 'C', 'D']

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ tribe?: string }>
}) {
  const { tribe } = await searchParams
  const initialTribe: TribeId =
    tribe && validTribes.includes(tribe.toUpperCase() as TribeId)
      ? (tribe.toUpperCase() as TribeId)
      : 'A'

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Resource Hub"
          title="Curated for Your Tribe"
          description="Books, destinations, and practices aligned to who you are. Explore recommendations tailored to each of the four tribes."
          image="/images/experience-spa.png"
        />
        <section className="bg-background py-16 md:py-24">
          <ResourceHub initialTribe={initialTribe} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
