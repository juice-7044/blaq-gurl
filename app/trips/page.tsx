import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { TripsLineup } from '@/components/trips-lineup'
import { Newsletter } from '@/components/newsletter'

export const metadata: Metadata = {
  title: '2027 Trip Lineup | Blaq Gurl Moves',
  description:
    'Explore the full 2027 Blaq Gurl Moves lineup — a themed getaway every month, with multiple itineraries across the globe.',
}

export default function TripsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="2027 Multi-Itineraries"
          title="A New Move Every Month"
          description="Twelve months, twelve themes, and a world of ways to experience each one. Explore the 2027 lineup and join the waitlist for the journeys calling your name."
          image="/images/trips-2027.png"
        />
        <TripsLineup />
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  )
}
