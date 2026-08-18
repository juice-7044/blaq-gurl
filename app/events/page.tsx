import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { EventCalendar } from '@/components/event-calendar'
import { Newsletter } from '@/components/newsletter'

export const metadata: Metadata = {
  title: 'Events & Trips Calendar | Blaq Gurl Moves',
  description:
    'Explore upcoming Blaq Gurl Moves trips, local meetups, and virtual sessions on our community calendar.',
}

export default function EventsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Calendar"
          title="Trips, meetups & moments to move"
          description="From international retreats to hometown brunches and virtual masterclasses, here is everything happening in the sisterhood."
          image="/images/hero-resort.png"
        />
        <section className="bg-background py-16 md:py-20">
          <EventCalendar />
        </section>
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  )
}
