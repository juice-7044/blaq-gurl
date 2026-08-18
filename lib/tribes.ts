export type TribeId = 'A' | 'B' | 'C' | 'D'

export type Tribe = {
  id: TribeId
  name: string
  title: string
  essence: string
  /** lucide icon key, mapped to a component in the UI */
  symbol: 'compass' | 'scale' | 'rocket' | 'leaf'
  /** Human-readable color name for the color chart */
  colorName: string
  accentClass: string // tailwind bg class (white text safe)
  softClass: string // subtle tinted background
  textClass: string
  ringClass: string
  description: string
  focus: string[]
  traits: string[]
  strengths: string
  growth: string
  /** Empathy line acknowledging the challenge side of this tribe */
  gentleReminder: string
  quote: string
  founders: string[]
  /** MBTI types that tend to align with this tribe */
  mbtiTypes: string[]
  /** A short MBTI-flavored guide title */
  mbtiGuide: string
}

export const tribes: Record<TribeId, Tribe> = {
  A: {
    id: 'A',
    name: 'Tribe A',
    title: 'The Architects',
    essence: 'The organizational and driving force behind every endeavor.',
    symbol: 'compass',
    colorName: 'Deep Teal',
    accentClass: 'bg-[oklch(0.45_0.07_195)]',
    softClass: 'bg-[oklch(0.95_0.02_195)]',
    textClass: 'text-[oklch(0.42_0.07_195)]',
    ringClass: 'ring-[oklch(0.45_0.07_195)]',
    description:
      'Tribe A is the backbone of the sisterhood — the planners, builders, and stewards who turn vision into reality. On every retreat, they lead small-group sessions rooted in networking, project management, organization, accounting, and financial literacy.',
    focus: [
      'Networking & relationship building',
      'Project management',
      'Organization & systems',
      'Accounting & financial literacy',
    ],
    traits: ['Strategic', 'Grounded', 'Reliable', 'Detail-driven'],
    strengths:
      'Strategists like you keep the sisterhood organized and financially fearless. You bring order to ambition — people trust you to hold the plan and make the big idea actually happen.',
    growth:
      'Your journey invites you to build wealth, master systems, and lead with structure — while leaving room for spontaneity and rest.',
    gentleReminder:
      'Even the best planners need breaks — don’t forget to delegate and breathe.',
    quote: '“Measure twice, cut once.”',
    founders: ['Carly', 'Nicole', 'Jillian'],
    mbtiTypes: ['ENTJ', 'ESTJ', 'INTJ', 'ISTJ'],
    mbtiGuide: 'How Thinker-Judgers Build Financial Freedom',
  },
  B: {
    id: 'B',
    name: 'Tribe B',
    title: 'The Balancers',
    essence: 'The wholeness force behind BGM.',
    symbol: 'scale',
    colorName: 'Warm Clay',
    accentClass: 'bg-[oklch(0.55_0.09_45)]',
    softClass: 'bg-[oklch(0.95_0.03_45)]',
    textClass: 'text-[oklch(0.48_0.09_45)]',
    ringClass: 'ring-[oklch(0.55_0.09_45)]',
    description:
      'Tribe B holds space for balance — between educational pursuits, single and mommy life, and the spirit that carries you through it all. Their group sessions center harmony across every role a woman carries.',
    focus: [
      'Balance of educational pursuits',
      'Single & mommy life',
      'Spiritual grounding',
      'Whole-self alignment',
    ],
    traits: ['Nurturing', 'Wise', 'Balanced', 'Present'],
    strengths:
      'You are the calm in the chaos — the one who reminds the group that growth and rest can coexist. You lead by embodying wholeness.',
    growth:
      'Your journey invites you to honor every role you carry without losing yourself, and to model sustainable, spirit-led living.',
    gentleReminder:
      'You can’t pour from an empty cup — protecting your own peace is part of the work.',
    quote: '“You can’t pour from an empty cup.”',
    founders: ['Brittany', 'Ann', 'Darlene “Goodie”'],
    mbtiTypes: ['ENFJ', 'ESFJ', 'INFJ', 'ISFJ'],
    mbtiGuide: 'Feeler-Judgers: Holding Balance Without Burning Out',
  },
  C: {
    id: 'C',
    name: 'Tribe C',
    title: 'The Hustlers',
    essence: 'Here to awaken and inspire the entrepreneurial drive.',
    symbol: 'rocket',
    colorName: 'Gold',
    accentClass: 'bg-[oklch(0.58_0.12_72)]',
    softClass: 'bg-[oklch(0.95_0.04_80)]',
    textClass: 'text-[oklch(0.5_0.12_68)]',
    ringClass: 'ring-[oklch(0.58_0.12_72)]',
    description:
      'Tribe C awakens the entrepreneur within. From marketing yourself and your brand, to building passive income, to following your passion into your own company — they bring the fire to every group session on retreat.',
    focus: [
      'Personal & brand marketing',
      'Finance & passive income',
      'Passion-to-profit',
      'Entrepreneurship',
    ],
    traits: ['Ambitious', 'Bold', 'Visionary', 'Magnetic'],
    strengths:
      'You see opportunity everywhere and you move on it. You inspire the sisterhood to bet on themselves and build something of their own.',
    growth:
      'Your journey invites you to turn passion into legacy, diversify your income, and build a brand that outlives the hustle.',
    gentleReminder:
      'The hustle is real, but so is rest — legacy is built at a sustainable pace.',
    quote: '“If you don’t build your dream, someone will hire you to build theirs.”',
    founders: ['Nia', 'Erika'],
    mbtiTypes: ['ENTP', 'ENFP', 'ESTP', 'ESFP'],
    mbtiGuide: 'From Spreadsheets to Startups: Organizing Your Hustle',
  },
  D: {
    id: 'D',
    name: 'Tribe D',
    title: 'The Healers',
    essence: 'Caretakers of the whole self — mind, body, and spirit.',
    symbol: 'leaf',
    colorName: 'Sage Green',
    accentClass: 'bg-[oklch(0.52_0.08_150)]',
    softClass: 'bg-[oklch(0.95_0.03_150)]',
    textClass: 'text-[oklch(0.45_0.08_150)]',
    ringClass: 'ring-[oklch(0.52_0.08_150)]',
    description:
      'Tribe D wraps the sisterhood in care — tending to mental, spiritual, physical, and sexual health so every guest can be whole in every aspect. Their sessions restore and rejuvenate.',
    focus: [
      'Mental & emotional wellness',
      'Spiritual healing',
      'Physical health',
      'Sexual health & intimacy',
    ],
    traits: ['Intuitive', 'Compassionate', 'Restorative', 'Deep'],
    strengths:
      'You feel what others cannot name and you help them heal it. You are the sanctuary the sisterhood returns to.',
    growth:
      'Your journey invites you to protect your own energy while holding space for others, and to lead the community toward whole health.',
    gentleReminder:
      'Healers often prioritize others’ wellness first — your retreat sessions will help you refill your own cup, too.',
    quote: '“Healing is not linear, but it is possible.”',
    founders: ['Mocha', 'Ameerah', 'Kimani'],
    mbtiTypes: ['INFP', 'ISFP', 'INFJ', 'ISFJ'],
    mbtiGuide: 'Protecting Your Energy as a Healer',
  },
}

export const tribeList = Object.values(tribes)

/* ---------------------------------------------------------------------------
 * Hybrids — every unique two-tribe pairing (order-independent).
 * ------------------------------------------------------------------------- */

export type HybridKey = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD'

export type Hybrid = {
  key: HybridKey
  pair: [TribeId, TribeId]
  title: string
  description: string
}

export const hybrids: Record<HybridKey, Hybrid> = {
  AB: {
    key: 'AB',
    pair: ['A', 'B'],
    title: 'The Grounded Strategist',
    description:
      'You build the plan and hold the heart of the room at the same time. You bring structure to the sisterhood without ever losing sight of the people inside it — organized, wise, and deeply steady.',
  },
  AC: {
    key: 'AC',
    pair: ['A', 'C'],
    title: 'The Empire Builder',
    description:
      'Spreadsheets meet startups. You pair an Architect’s systems with a Hustler’s vision, which means you don’t just dream the business — you operationalize it. Your workshops turn ambition into infrastructure.',
  },
  AD: {
    key: 'AD',
    pair: ['A', 'D'],
    title: 'The Mindful Architect',
    description:
      'You bring order and care in equal measure — the one who builds sustainable systems and remembers that people (including you) are not machines. Structure with soul.',
  },
  BC: {
    key: 'BC',
    pair: ['B', 'C'],
    title: 'The Soulful Hustler',
    description:
      'You chase the vision while keeping yourself whole. You prove that ambition and balance aren’t opposites — that you can build something bold without abandoning your spirit or the people you love.',
  },
  BD: {
    key: 'BD',
    pair: ['B', 'D'],
    title: 'The Nurturing Healer',
    description:
      'You thrive when supporting others’ balance and holistic health, but lately you might be pouring from an empty cup. Your retreat sessions will help you recharge while empowering others. Remember: rest is part of the journey.',
  },
  CD: {
    key: 'CD',
    pair: ['C', 'D'],
    title: 'The Visionary Healer',
    description:
      'You build and you heal — turning passion into purpose-driven work that leaves people better than you found them. Your gift is making wellness and ambition move together.',
  },
}

export function hybridFor(a: TribeId, b: TribeId): Hybrid {
  const key = ([a, b].sort().join('') as HybridKey)
  return hybrids[key]
}
