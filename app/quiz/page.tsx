import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { TribeQuiz } from '@/components/tribe-quiz'

export const metadata: Metadata = {
  title: 'What Tribe Are You? | Blaq Gurl Moves',
  description:
    'Take the Blaq Gurl Moves tribe quiz to discover whether you are an Architect, Balancer, Hustler, or Healer — and unlock a Resource Hub curated for you.',
}

export default function QuizPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Find Your Tribe"
          title="What Tribe Are You?"
          description="Every sister brings a distinct gift to the collective. Answer a few questions and discover which of our four tribes is yours."
          image="/images/quiz-hero.png"
        />
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <TribeQuiz />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
