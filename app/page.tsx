import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Mission } from '@/components/mission'
import { TravelExperiences } from '@/components/travel-experiences'
import { FeaturedDestinations } from '@/components/featured-destinations'
import { BgmStandard } from '@/components/bgm-standard'
import { TribeTeaser } from '@/components/tribe-teaser'
import { TravelMap } from '@/components/travel-map'
import { Testimonials } from '@/components/testimonials'
import { TravelTips } from '@/components/travel-tips'
import { BlogPreview } from '@/components/blog-preview'
import { Newsletter } from '@/components/newsletter'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Mission />
        <TravelExperiences />
        <FeaturedDestinations />
        <BgmStandard />
        <TribeTeaser />
        <TravelMap />
        <Testimonials />
        <TravelTips />
        <BlogPreview />
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  )
}
