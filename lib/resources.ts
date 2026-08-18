import type { TribeId } from './tribes'

export type ResourceCategory = 'book' | 'destination' | 'recommendation'

export type Resource = {
  title: string
  category: ResourceCategory
  author?: string
  blurb: string
}

export const resourcesByTribe: Record<TribeId, Resource[]> = {
  A: [
    {
      title: 'Financial Feminist',
      author: 'Tori Dunlap',
      category: 'book',
      blurb: 'A practical playbook for taking control of your money and building wealth.',
    },
    {
      title: 'The 4 Disciplines of Execution',
      author: 'McChesney, Covey & Huling',
      category: 'book',
      blurb: 'Turn big goals into repeatable systems \u2014 an Architect\u2019s favorite.',
    },
    {
      title: 'Dubai, UAE',
      category: 'destination',
      blurb: 'A city built on ambition and vision \u2014 luxury, business, and skyline dreams.',
    },
    {
      title: 'Open a high-yield savings + travel fund',
      category: 'recommendation',
      blurb: 'Automate a monthly transfer so your next trip is always funded.',
    },
  ],
  B: [
    {
      title: 'The Gifts of Imperfection',
      author: 'Bren\u00e9 Brown',
      category: 'book',
      blurb: 'On wholehearted living and letting go of who you think you should be.',
    },
    {
      title: 'Everything Happens for a Reason (and Other Lies I\u2019ve Loved)',
      author: 'Kate Bowler',
      category: 'book',
      blurb: 'A tender meditation on balance, faith, and being human.',
    },
    {
      title: 'Kyoto, Japan',
      category: 'destination',
      blurb: 'Temples, tea, and quiet gardens \u2014 a place to restore your equilibrium.',
    },
    {
      title: 'Start a weekly digital-free ritual',
      category: 'recommendation',
      blurb: 'Protect one evening a week for family, study, or stillness.',
    },
  ],
  C: [
    {
      title: 'Building a StoryBrand',
      author: 'Donald Miller',
      category: 'book',
      blurb: 'Clarify your message so your brand actually converts.',
    },
    {
      title: 'The Passion Economy',
      author: 'Adam Davidson',
      category: 'book',
      blurb: 'How to turn what you love into a durable, profitable business.',
    },
    {
      title: 'Lagos, Nigeria',
      category: 'destination',
      blurb: 'The beating heart of African entrepreneurship, music, and hustle.',
    },
    {
      title: 'Validate one business idea this quarter',
      category: 'recommendation',
      blurb: 'Pre-sell to 10 people before you build. Momentum over perfection.',
    },
  ],
  D: [
    {
      title: 'The Body Keeps the Score',
      author: 'Bessel van der Kolk',
      category: 'book',
      blurb: 'Understanding how healing the body heals the mind.',
    },
    {
      title: 'Pleasure Activism',
      author: 'adrienne maree brown',
      category: 'book',
      blurb: 'Reclaiming joy, rest, and pleasure as radical self-care.',
    },
    {
      title: 'Ubud, Bali',
      category: 'destination',
      blurb: 'Jungle stillness, sound baths, and sacred healing waters.',
    },
    {
      title: 'Build a morning grounding practice',
      category: 'recommendation',
      blurb: 'Five minutes of breathwork or journaling before the world gets loud.',
    },
  ],
}

export const categoryLabels: Record<ResourceCategory, string> = {
  book: 'Book',
  destination: 'Destination',
  recommendation: 'Practice',
}
