export type TravelLocation = {
  name: string
  country: string
  coordinates: [number, number] // [longitude, latitude]
  year: string
  blurb: string
}

export const travelLocations: TravelLocation[] = [
  {
    name: 'Napa & Sonoma',
    country: 'USA',
    coordinates: [-122.2869, 38.2975],
    year: '2019',
    blurb: 'Where it all began \u2014 the wine country weekend that birthed the sisterhood.',
  },
  {
    name: 'Rome',
    country: 'Italy',
    coordinates: [12.4964, 41.9028],
    year: '2022',
    blurb: 'Ancient wonders, long dinners, and la dolce vita with the tribe.',
  },
  {
    name: 'San Juan',
    country: 'Puerto Rico',
    coordinates: [-66.1057, 18.4655],
    year: '2023',
    blurb: 'Bioluminescent bays, Old San Juan color, and Caribbean rhythm.',
  },
  {
    name: 'Sahara',
    country: 'Morocco',
    coordinates: [-6.0, 31.0],
    year: '2023',
    blurb: 'Camel treks and desert nights beneath an ocean of stars.',
  },
  {
    name: 'Ulaanbaatar',
    country: 'Mongolia',
    coordinates: [106.9057, 47.8864],
    year: '2024',
    blurb: 'Nomadic culture, vast steppe, and a journey off the beaten path.',
  },
  {
    name: 'Beijing',
    country: 'China',
    coordinates: [116.4074, 39.9042],
    year: '2024',
    blurb: 'The Great Wall, imperial history, and unforgettable flavors.',
  },
  {
    name: 'Almaty',
    country: 'Kazakhstan',
    coordinates: [76.8512, 43.222],
    year: '2024',
    blurb: 'Snow-capped peaks and Silk Road heritage in Central Asia.',
  },
  {
    name: 'Banff',
    country: 'Canada',
    coordinates: [-115.5708, 51.1784],
    year: '2024',
    blurb: 'Turquoise lakes and Rocky Mountain majesty.',
  },
  {
    name: 'Rio de Janeiro',
    country: 'Brazil',
    coordinates: [-43.1729, -22.9068],
    year: '2025',
    blurb: 'Samba, sunshine, and the soul of the Diaspora in South America.',
  },
  {
    name: 'Sydney',
    country: 'Australia',
    coordinates: [151.2093, -33.8688],
    year: '2025',
    blurb: 'Harbour views, coastal walks, and down-under adventure.',
  },
  {
    name: 'Nuuk',
    country: 'Greenland',
    coordinates: [-51.6941, 64.1836],
    year: '2025',
    blurb: 'Icebergs, northern light, and the edge of the world.',
  },
]
