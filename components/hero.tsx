'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
  { src: '/images/mocha-italy.jpg', alt: 'A Blaq Gurl Moves traveler exploring Italy' },
  { src: '/images/lisbon.jpg', alt: 'The colorful cityscape of Lisbon, Portugal' },
  { src: '/images/four-women.jpg', alt: 'Four joyful women celebrating together' },
]

export function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden">
      {/* Fading background slideshow */}
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src || '/placeholder.svg'}
            alt={slide.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Readability overlays */}
        <div className="absolute inset-0 bg-foreground/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/65 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/30" />
      </div>

      <div className="mx-auto flex min-h-[92vh] w-full max-w-7xl items-center px-4 pt-32 pb-20 md:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-4 py-1.5 text-sm font-medium text-background backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-accent" aria-hidden />
            The BGM Experience
          </span>
          <h1 className="mt-6 text-balance font-serif text-4xl font-bold leading-tight text-background sm:text-5xl lg:text-6xl">
            Creating luxury travel experiences that celebrate culture, community
            &amp; connection
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-background/90">
            We create thoughtfully curated experiences that bring our community
            together while showcasing incredible destinations around the world.
            We aren&apos;t simply booking vacations — we&apos;re creating
            memories that last a lifetime.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="#experiences">
                Explore the Experience
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/40 bg-background/10 text-background backdrop-blur-sm hover:bg-background/20 hover:text-background"
            >
              <Link href="/quiz">Find Your Tribe</Link>
            </Button>
          </div>

          <dl className="mt-12 flex flex-wrap gap-8">
            {[
              { value: '4', label: 'Signature trips a year' },
              { value: '25+', label: 'Destinations explored' },
              { value: '100%', label: 'Luxury standard' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-serif text-3xl font-bold text-background">
                  {stat.value}
                </dt>
                <dd className="text-sm text-background/80">{stat.label}</dd>
              </div>
            ))}
          </dl>

          {/* Slide indicators */}
          <div className="mt-10 flex gap-2" role="tablist" aria-label="Hero images">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-selected={i === active}
                role="tab"
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-8 bg-accent' : 'w-4 bg-background/40 hover:bg-background/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
