export type TripOption = {
  /** Sub-trip name / theme, e.g. "Tennessee'ing Double" */
  name?: string
  /** Destinations and highlights for this option */
  highlights: string[]
}

export type MonthlyTrip = {
  id: string
  month: string
  /** e.g. "Blaq and Boozy" (without the "BGM Presents" prefix) */
  title: string
  /** Optional specific date range */
  dates?: string
  /** Short editorial blurb for the month */
  blurb: string
  /** Suggested region label for quick scanning */
  region: string
  /** Hero image for the month */
  image: string
  options: TripOption[]
}

// 2027 Multi-Itineraries. Prices and deposits are intentionally omitted
// until finalized — the UI shows "Pricing coming soon" and a waitlist CTA.
export const trips2027: MonthlyTrip[] = [
  {
    id: 'january-blaq-and-boozy',
    month: 'January',
    title: 'Blaq and Boozy',
    blurb:
      'Ring in the year with spirited tastings and elevated escapes — from whiskey country to wine country to a guided reset.',
    region: 'USA',
    image: '/images/trips/january.png',
    options: [
      {
        name: "Tennessee'ing Double — Nashville",
        highlights: [
          'Uncle Nearest Whiskey Tour',
          'Downtown Shelbyville',
        ],
      },
      {
        name: 'Napa Valley Wine Up',
        highlights: [
          'Napa Valley guided wine tours',
          'Hot air balloon rides',
          'Michelin-starred French Laundry',
        ],
      },
      {
        name: 'The Great Reset: Guided Elevated Experience',
        highlights: ['Austin, TX', 'With Urbin Herbin'],
      },
    ],
  },
  {
    id: 'february-roll-it-gyal',
    month: 'February',
    title: 'Roll It Gyal',
    dates: 'Feb 8 – 15, 2027',
    blurb:
      'Carnival season, three ways. Feathers, soca, and celebration across the Diaspora.',
    region: 'Carnival',
    image: '/images/trips/february.png',
    options: [
      { name: 'New Orleans Mardi Gras', highlights: ['New Orleans, USA'] },
      { name: 'Brazilian Carnivale', highlights: ['Brazil'] },
      { name: 'Trinidadian Carnival', highlights: ['Trinidad & Tobago'] },
    ],
  },
  {
    id: 'march-blaq-gurl-luxe',
    month: 'March',
    title: 'Blaq Gurl Luxe',
    blurb:
      'Pure opulence across the Gulf and the Indian Ocean — skyline glamour meets island serenity.',
    region: 'Middle East & Asia',
    image: '/images/trips/march.png',
    options: [
      { name: 'Dubai & Bali', highlights: ['Dubai, UAE', 'Bali, Indonesia'] },
      {
        name: 'Abu Dhabi & Singapore',
        highlights: ['Abu Dhabi, UAE', 'Singapore'],
      },
    ],
  },
  {
    id: 'april-blaq-in-the-americas',
    month: 'April',
    title: 'Blaq in the Americas',
    blurb:
      'Trace the African Diaspora across Central America, South America, and the Caribbean.',
    region: 'The Americas',
    image: '/images/trips/april.png',
    options: [
      {
        name: 'Afro-Latino Central American View',
        highlights: ['Lima', 'Costa Rica / Roatán & La Ceiba'],
      },
      {
        name: 'Black in South America',
        highlights: ['Guyana', 'Suriname'],
      },
      {
        name: 'Black in the Dutch Caribbean',
        highlights: ['Sint Maarten', 'Curaçao'],
      },
      {
        name: 'Black in the French Caribbean',
        highlights: ['St. Lucia', 'Guadeloupe'],
      },
    ],
  },
  {
    id: 'may-its-all-greeq-to-me',
    month: 'May',
    title: "It's All Greeq To Me",
    blurb:
      'Sail, wander, and sun across the Mediterranean, the Black Sea, and the Iberian coast.',
    region: 'Mediterranean & Europe',
    image: '/images/trips/may.png',
    options: [
      {
        name: 'European Yacht Week',
        highlights: ['Croatia start', 'or Greek (Athens) start'],
      },
      {
        name: 'Blaq Sea Babes',
        highlights: [
          'Türkiye — Istanbul, Izmir',
          'Romania — București, Brașov',
        ],
      },
      {
        name: 'Give Me Moor',
        highlights: [
          'Lisbon & Albufeira, Portugal (or Azores / Madeira islands)',
          'Madrid & Córdoba, Spain (or Balearic Isles)',
        ],
      },
    ],
  },
  {
    id: 'june-sapporo-or-soju',
    month: 'June',
    title: 'Sapporo or Soju',
    blurb:
      'East Asia at its most beautiful — ancient temples, island escapes, and modern megacities.',
    region: 'East Asia',
    image: '/images/trips/june.png',
    options: [
      {
        name: 'Japan',
        highlights: ['Tokyo & Mt. Fuji', 'Okinawa Island', 'Kyoto'],
      },
      {
        name: 'South Korea',
        highlights: ['Seoul', 'Jeju Island', 'Busan'],
      },
    ],
  },
  {
    id: 'july-eurodelux',
    month: 'July',
    title: 'EuroDeLux Trip',
    blurb:
      'A grand European tour of shopping, coastlines, and old-world capitals — starting with a London layover.',
    region: 'Europe',
    image: '/images/trips/july.png',
    options: [
      {
        name: 'France',
        highlights: ['Shopping', 'South of France (Tête de Chien / wine tour)'],
      },
      { name: 'Italy', highlights: ['Shopping', 'Amalfi Coast tour'] },
      {
        name: "Do We Have A Prague-lem?",
        highlights: ['Prague, Czech Republic', 'Vienna, Austria'],
      },
    ],
  },
  {
    id: 'august-cowgirl-deluxe',
    month: 'August',
    title: 'Cowgirl DeLuxe',
    blurb:
      'The rugged, jaw-dropping Pacific Northwest and the Canadian Rockies — national parks and big skies.',
    region: 'North America',
    image: '/images/trips/august.png',
    options: [
      {
        name: 'Coastal & Alaska',
        highlights: [
          'Seattle, WA',
          'Vancouver, BC',
          'Alaska — Kenai Fjords National Park',
        ],
      },
      {
        name: 'Rockies',
        highlights: [
          'Jackson Hole, Wyoming',
          'Calgary, AB — Banff National Park',
        ],
      },
    ],
  },
  {
    id: 'september-luxe-multi',
    month: 'September',
    title: 'The Luxe Below · Luxe Dynasty · Mor Luxure',
    blurb:
      'Three signature journeys — the South Pacific, the wonders of Egypt, and the magic of Morocco.',
    region: 'Oceania & North Africa',
    image: '/images/trips/september.png',
    options: [
      {
        name: 'The Luxe Below',
        highlights: ['Australia — Sydney', 'New Zealand — Christchurch'],
      },
      {
        name: 'Luxe Dynasty',
        highlights: ['Egypt — Alexandria, Cairo, Luxor'],
      },
      {
        name: 'Mor Luxure',
        highlights: ['Morocco — Casablanca, Marrakech, Tangiers'],
      },
    ],
  },
  {
    id: 'october-temple-run',
    month: 'October',
    title: 'Temple Run',
    blurb:
      'The perfect time of year to explore Southeast Asia — temples, street food, and turquoise coasts.',
    region: 'Southeast Asia',
    image: '/images/trips/october.png',
    options: [
      { name: 'Cambodia & Vietnam', highlights: ['Cambodia', 'Vietnam'] },
      { name: 'Thailand & Malaysia', highlights: ['Thailand', 'Malaysia'] },
    ],
  },
  {
    id: 'november-tale-of-two-vacays',
    month: 'November',
    title: 'A Tale of Two Vacays',
    blurb:
      'Snow or sand — choose your adventure across four very different escapes.',
    region: 'Multi-region',
    image: '/images/trips/november.png',
    options: [
      { name: 'SnowTime', highlights: ['Vermont', 'Montréal'] },
      {
        name: "Life's a Beach",
        highlights: ['St. Thomas, USVI', 'Puerto Rico'],
      },
      {
        name: 'Far East',
        highlights: ['The Philippines', 'Hong Kong'],
      },
      {
        name: 'Nordic',
        highlights: ['Iceland', 'Norway', 'Sweden'],
      },
    ],
  },
  {
    id: 'december-blaq-to-our-roots',
    month: 'December',
    title: 'Blaq to our Roots',
    blurb:
      'Close the year with a homecoming across the Motherland — culture, festivals, and safari.',
    region: 'Africa',
    image: '/images/trips/december.png',
    options: [
      {
        name: 'South Africa',
        highlights: [
          'Johannesburg / Cape Town',
          'Possibly Afropunk festival',
        ],
      },
      {
        name: 'Ghana',
        highlights: ['Accra — Afrofuture (formerly Afrochella)'],
      },
      { name: 'Tanzania', highlights: ['Zanzibar'] },
      { name: 'Namibia', highlights: ['Safari'] },
    ],
  },
]
