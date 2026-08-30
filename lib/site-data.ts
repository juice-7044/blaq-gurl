export type Destination = {
  slug: string
  name: string
  country: string
  image: string
  price: number
  duration: string
  spots: number
  tagline: string
  description: string
}

export const destinations: Destination[] = [
  {
    slug: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    image: '/images/dest-santorini.png',
    price: 3450,
    duration: '7 days',
    spots: 12,
    tagline: 'Whitewashed cliffs & endless Aegean blues',
    description:
      'Sip local wine at sunset in Oia, cruise the caldera on a private catamaran, and unwind in a cliffside infinity pool. This is the Mediterranean at its most cinematic.',
  },
  {
    slug: 'cape-town',
    name: 'Cape Town',
    country: 'South Africa',
    image: '/images/dest-capetown.png',
    price: 4200,
    duration: '9 days',
    spots: 14,
    tagline: 'Where mountains meet two oceans',
    description:
      'Ascend Table Mountain, tour the Cape Winelands, and connect with the vibrant culture of the Mother City. A soul-stirring blend of adventure and heritage.',
  },
  {
    slug: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    image: '/images/dest-bali.png',
    price: 3890,
    duration: '8 days',
    spots: 10,
    tagline: 'Jungle villas & sacred stillness',
    description:
      'Wake to rice-terrace views, flow through sunrise yoga, and be pampered in a private-pool villa. Bali is the reset your spirit has been craving.',
  },
]

export type Tier = {
  name: string
  price: string
  cadence: string
  description: string
  perks: string[]
  featured?: boolean
}

export const tiers: Tier[] = [
  {
    name: 'Discover',
    price: '$0',
    cadence: 'to join',
    description: 'For the curious traveler ready to explore with the community.',
    perks: [
      'Access to all group trips',
      'Members-only travel guides',
      'Community newsletter',
      'Early trip announcements',
    ],
  },
  {
    name: 'Immerse',
    price: '$29',
    cadence: 'per month',
    description: 'For frequent movers who want deeper access and savings.',
    perks: [
      'Everything in Discover',
      '10% off every booked trip',
      'Priority trip waitlists',
      'Quarterly virtual meetups',
      'Curated packing concierge',
    ],
    featured: true,
  },
  {
    name: 'Indulge',
    price: '$89',
    cadence: 'per month',
    description: 'The full white-glove experience for the luxury seeker.',
    perks: [
      'Everything in Immerse',
      '20% off every booked trip',
      'Private room guarantee',
      'Personal travel planner',
      'Airport lounge access',
    ],
  },
]

export type Testimonial = {
  name: string
  location: string
  quote: string
  trip: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Amara Johnson',
    location: 'Atlanta, GA',
    trip: 'Santorini 2024',
    quote:
      'I came alone and left with a whole tribe. Every detail was handled — I just had to show up and glow. Best trip of my life, hands down.',
  },
  {
    name: 'Nia Williams',
    location: 'Brooklyn, NY',
    trip: 'Cape Town 2024',
    quote:
      'Blaq Gurl Moves does luxury differently. It felt curated, intentional, and deeply rooted in culture. I already booked my next one.',
  },
  {
    name: 'Zara Bennett',
    location: 'Houston, TX',
    trip: 'Bali 2023',
    quote:
      'From the villa to the sunrise yoga, everything was elevated. I finally traveled without the mental load of planning. Pure bliss.',
  },
]

export type Tip = {
  title: string
  body: string
}

export const travelTips: Tip[] = [
  {
    title: 'Pack in a capsule',
    body: 'Choose a two-color palette and build outfits that mix and match. You will look intentional in every photo and travel lighter.',
  },
  {
    title: 'Book the window',
    body: 'For long-haul flights, a window seat means uninterrupted rest and the best skyline arrivals. Worth every point.',
  },
  {
    title: 'Local first',
    body: 'Eat where the locals eat. Ask your trip host for the neighborhood spots — that is where the real memories live.',
  },
  {
    title: 'Protect your glow',
    body: 'Reef-safe SPF, a silk bonnet, and a hydrating mist. Travel is hard on skin and hair — pack the essentials.',
  },
]

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  image: string
  content: string[]
  archived?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'airport-choice-budget-2026',
    title: 'Flying on a Budget in 2026? Your Airport Choice Might Matter More Than You Think',
    excerpt:
      'The airport you fly from can make a bigger difference to your travel budget than you expect. Here is how to compare nearby airports and keep more money for the trip itself.',
    category: 'Travel Tips',
    date: 'August 30, 2026',
    readTime: '7 min read',
    image: '/images/blog-airport-budget.png',
    content: [
      'If you are trying to keep travel costs down this year, there is a simple lever a lot of people overlook: which airport you actually fly out of. New government data on 2025 domestic airfares shows just how big the gap can be between the cheapest and most expensive major airports in the country — and the difference is not small change.',
      'According to fare data from the U.S. Bureau of Transportation Statistics, the average domestic airfare in 2025 was around $387 — actually down slightly from the year before, marking a third straight year of falling ticket prices. But that national average hides a lot of variation.',
      'On the low end, South Florida stood out. Fort Lauderdale-Hollywood International posted the cheapest average departing fare of any major U.S. airport, with Orlando close behind. Several other Florida airports also landed among the most affordable in the country.',
      'On the high end, Anchorage had the priciest average fare among the nation’s busiest airports — over $500 on average. In the lower 48, Birmingham, Alabama topped the list for highest average fares. That is a swing of more than $250 between the cheapest and priciest major airports for what might otherwise be a similar trip.',
      'Before you book, check nearby alternate airports. If you live within driving distance of more than one, a slightly longer drive to a lower-cost hub can offset the extra gas or rideshare fare many times over.',
      'Regional airports deserve a look, too. Smaller airports can sometimes undercut nearby major hubs thanks to lower operating costs and less demand-driven pricing. If one is reasonable for your route, add it to your fare comparison.',
      'Remember that these are averages, not guarantees. An airport with a low average fare will not be cheap on every route or date. Demand, seasonality, and how far out you book still matter.',
      'Factor in the full cost, not just the ticket. Parking, baggage fees, and ground transportation can eat into savings, especially at airports farther from where you are headed.',
      'Domestic airfare has fallen for three consecutive years, which is good news for budget-conscious travelers. But rising jet fuel costs have started pushing prices back up more recently, so booking sooner rather than later is not unreasonable when you find a good rate.',
      'Airport choice is one of the few travel costs fully within your control before you even start comparing ticket prices. A little research into nearby airports can make a real dent in your travel budget this year.',
      'Fare figures referenced are based on 2025 domestic itinerary fare data from the U.S. Bureau of Transportation Statistics, covering major and regional U.S. airports.',
    ],
  },
  {
    slug: 'solo-but-never-alone',
    title: 'Solo, But Never Alone: The Magic of Group Travel',
    excerpt:
      'Why traveling with a curated community of women unlocks a kind of freedom that going it alone never could.',
    category: 'Community',
    date: 'June 12, 2026',
    readTime: '5 min read',
    image: '/images/experience-spa.png',
    content: [
      'There is a particular kind of joy that comes from arriving somewhere new and being met by people who get it. Group travel, when done right, is not about losing your independence — it is about amplifying it.',
      'At Blaq Gurl Moves, every trip is designed so you can do as much or as little as you want. Wander off for a solo museum morning, then reunite with the group for a sunset dinner. The structure is there when you need it and invisible when you do not.',
      'The friendships formed on these trips outlast the flights home. We have seen strangers become bridesmaids, business partners, and lifelong travel buddies. That is the real souvenir.',
    ],
  },
  {
    slug: 'santorini-off-season',
    title: 'Why Santorini Hits Different in the Off-Season',
    excerpt:
      'Skip the crowds and catch the island at its most serene. Here is how to plan the perfect shoulder-season escape.',
    category: 'Destinations',
    date: 'May 28, 2026',
    readTime: '6 min read',
    image: '/images/dest-santorini.png',
    content: [
      'Everyone pictures Santorini in peak July — packed alleys, long waits, and prices to match. But visit in late spring or early fall and you get the same impossible blues with a fraction of the crowds.',
      'The light is softer, the caldera boat tours are calmer, and the local tavernas have time to actually chat with you. You will feel like the island is yours.',
      'Pack layers — evenings can be breezy — and book your cliffside dinners in advance. Even off-season, the best sunset tables go fast.',
    ],
  },
  {
    slug: 'packing-like-a-pro',
    title: 'Packing Like a Pro: The Carry-On Only Challenge',
    excerpt:
      'Everything you need for a week of luxury in one bag. Our tried-and-tested system for traveling light without sacrificing style.',
    category: 'Travel Tips',
    date: 'May 10, 2026',
    readTime: '4 min read',
    image: '/images/dest-bali.png',
    content: [
      'The secret to carry-on-only travel is not sacrifice — it is strategy. Start with a color story, roll everything, and let accessories do the heavy lifting.',
      'A few versatile pieces beat a suitcase full of maybes. Two dresses that dress up or down, one great pair of sandals, and jewelry that transforms a look.',
      'Your reward? No baggage claim, no lost luggage, and the freedom to move through the world unbothered. That is the real luxury.',
    ],
  },
  {
    slug: 'italy-to-puerto-rico',
    title: 'From Italy to Puerto Rico: A Year of Moves',
    excerpt:
      'Two very different destinations, one unforgettable sisterhood. Here is what a year of Blaq Gurl Moves taught us about culture, connection, and joy.',
    category: 'Destinations',
    date: 'April 22, 2026',
    readTime: '7 min read',
    image: '/images/blog-puerto-rico.png',
    content: [
      'When we planned Rome, we thought we knew what to expect: ancient ruins, incredible food, and a whole lot of walking. What we did not expect was how deeply the city would fold us into its rhythm. Long dinners turned into longer conversations. The tribe bonded over gelato runs and getting deliciously lost in cobblestone alleys.',
      'Then came Puerto Rico — a completely different energy. Where Rome was history and grandeur, San Juan was color, music, and Caribbean warmth. We danced in Old San Juan, kayaked a bioluminescent bay, and felt the Diaspora connection in every plate of mofongo.',
      'The lesson? The destination sets the stage, but the sisterhood is the show. Whether we are marveling at the Colosseum or floating under glowing water, what stays with us is each other.',
      'That is the heart of Blaq Gurl Moves. We do not just visit places — we experience them together, and we come home changed.',
    ],
  },
  {
    slug: 'budget-destinations-2026',
    title: 'Budget-Friendly Destinations That Still Feel Luxe',
    excerpt:
      'You do not need a five-figure budget to travel well. These destinations deliver luxury experiences without the luxury price tag.',
    category: 'Travel Tips',
    date: 'April 3, 2026',
    readTime: '6 min read',
    image: '/images/blog-budget.png',
    content: [
      'Luxury is not about how much you spend — it is about how intentional you are. Some of the most memorable trips happen in places where your dollar stretches and the experiences run deep.',
      'Think Mexico City for world-class food and art, Marrakech for palaces and souks, or Cartagena for colonial charm on the Caribbean. In each, boutique stays and private guides cost a fraction of what you would pay in Western Europe.',
      'Our tips: travel in shoulder season, book group experiences to split costs, and prioritize one or two splurges (a spa day, a private dinner) rather than spreading thin.',
      'The result is a trip that feels indulgent and looks incredible — without the post-vacation credit card dread.',
    ],
  },
  {
    slug: 'best-places-black-women',
    title: 'The Best Places for Black Women to Travel Solo',
    excerpt:
      'Safety, community, and warm welcomes. Our community-sourced guide to destinations where Black women thrive on the road.',
    category: 'Community',
    date: 'March 15, 2026',
    readTime: '8 min read',
    image: '/images/sisterhood.png',
    content: [
      'Solo travel as a Black woman comes with its own set of questions. Where will I feel safe? Where will I feel seen? Where will I find community? We asked our members, and the answers were beautiful.',
      'Ghana consistently tops the list — the Year of Return opened doors and hearts, and Accra offers a homecoming like no other. Portugal earns love for its safety, affordability, and welcoming pace. And closer to home, cities like Cartagena and Salvador, Brazil, pulse with Afro-Diaspora culture.',
      'Beyond the destination, our members emphasized the power of connecting with local Black communities and women-led tour operators. That is where the magic happens.',
      'Of course, the safest, most joyful way to explore is with a tribe. That is exactly why we do what we do — so you never have to choose between adventure and belonging.',
    ],
  },
  {
    slug: 'group-travel-etiquette',
    title: 'Group Travel Etiquette: The Unspoken Rules',
    excerpt:
      'How to be the travel companion everyone wants on the trip. A gentle guide to keeping group harmony on the road.',
    category: 'Travel Tips',
    date: 'February 20, 2026',
    readTime: '5 min read',
    image: '/images/experience-spa.png',
    archived: true,
    content: [
      'Group travel is a joy, but it thrives on a little grace. Be on time, be flexible, and communicate your needs early.',
      'Everyone travels differently — some want every hour planned, others crave free time. Respecting both is the secret to harmony.',
    ],
  },
  {
    slug: 'why-we-toast',
    title: "The World's Longest Toast: Our Origin Ritual",
    excerpt:
      'How a single toast in Napa became the ritual that defines every Blaq Gurl Moves trip.',
    category: 'Community',
    date: 'January 30, 2026',
    readTime: '4 min read',
    image: '/images/experience-spa.png',
    archived: true,
    content: [
      'It started in Napa, on the trip that birthed the sisterhood. One toast turned into the longest, most heartfelt round of gratitude any of us had ever shared.',
      'Now, every trip includes The Toast — a moment to honor each other, our journeys, and the bonds we build. It is our favorite tradition.',
    ],
  },
  {
    slug: 'travel-skincare-ritual',
    title: 'Protecting Your Glow: A Travel Skincare Ritual',
    excerpt:
      'From long-haul flights to sun-soaked beaches, keep your skin luminous with this member-approved routine.',
    category: 'Travel Tips',
    date: 'January 12, 2026',
    readTime: '5 min read',
    image: '/images/experience-spa.png',
    archived: true,
    content: [
      'Travel is hard on skin. Cabin air dehydrates, sun exposure spikes, and routines fall apart. The fix is a simple, portable ritual.',
      'Hydrate on the plane, layer reef-safe SPF by day, and repair with a rich mask at night. Your glow is worth the carry-on space.',
    ],
  },
]
