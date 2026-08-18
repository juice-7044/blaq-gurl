export type EventType = 'trip' | 'local' | 'virtual'

export type BgmEvent = {
  id: string
  title: string
  type: EventType
  date: string // ISO yyyy-mm-dd (start)
  endDate?: string
  location: string
  description: string
  href?: string
  /** Ticket price in cents. Omit for free events. */
  priceInCents?: number
}

export const events: BgmEvent[] = [
  {
    id: 'tulum-retreat',
    title: 'Tulum Wellness Retreat',
    type: 'trip',
    date: '2026-02-14',
    endDate: '2026-02-21',
    location: 'Tulum, Mexico',
    description:
      'A week of cenote swims, beachfront yoga, and Tribe D-led healing sessions on the Riviera Maya.',
  },
  {
    id: 'accra-experience',
    title: 'Accra Homecoming Experience',
    type: 'trip',
    date: '2026-03-06',
    endDate: '2026-03-14',
    location: 'Accra, Ghana',
    description:
      'A Diaspora homecoming \u2014 history, markets, drumming, and a Year of Return celebration.',
  },
  {
    id: 'atl-brunch',
    title: 'Sisterhood Brunch & Networking',
    type: 'local',
    date: '2026-08-22',
    location: 'Atlanta, GA',
    description:
      'A Tribe A-hosted brunch focused on networking, financial literacy, and building your circle.',
    priceInCents: 4500,
  },
  {
    id: 'nyc-meetup',
    title: 'NYC Book Club: Passport Stamps',
    type: 'local',
    date: '2026-08-29',
    location: 'Brooklyn, NY',
    description:
      'Our Resource Hub book club meets IRL to discuss this month\u2019s travel memoir pick.',
    priceInCents: 2000,
  },
  {
    id: 'virtual-money',
    title: 'Virtual: Building Passive Income',
    type: 'virtual',
    date: '2026-08-14',
    location: 'Online (Zoom)',
    description:
      'A Tribe C masterclass on turning your passion into multiple streams of income.',
    priceInCents: 1500,
  },
  {
    id: 'santorini-trip',
    title: 'Santorini Summer Escape',
    type: 'trip',
    date: '2026-06-12',
    endDate: '2026-06-19',
    location: 'Santorini, Greece',
    description:
      'Cliffside villas, caldera sails, and sunset dinners in Oia with the sisterhood.',
  },
  {
    id: 'cape-town-trip',
    title: 'Cape Town Heritage Journey',
    type: 'trip',
    date: '2026-09-18',
    endDate: '2026-09-27',
    location: 'Cape Town, South Africa',
    description:
      'Table Mountain, the Winelands, and a soul-deep connection to the Mother City.',
  },
  {
    id: 'dc-wellness',
    title: 'DMV Wellness & Sound Bath',
    type: 'local',
    date: '2026-09-12',
    location: 'Washington, DC',
    description:
      'A Tribe D restorative afternoon of meditation, sound healing, and community.',
    priceInCents: 3500,
  },
  {
    id: 'virtual-vision',
    title: 'Virtual: 2026 Vision Board Party',
    type: 'virtual',
    date: '2026-01-10',
    location: 'Online (Zoom)',
    description:
      'Kick off the year by mapping your travel and life goals with the tribe.',
  },
]

export const eventTypeLabels: Record<EventType, string> = {
  trip: 'Trip',
  local: 'Local Event',
  virtual: 'Virtual',
}
