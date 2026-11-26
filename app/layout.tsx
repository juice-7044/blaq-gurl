import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Blaq Gurl Moves | Luxury Group Travel Club',
  description:
    'Blaq Gurl Moves is a luxury travel club curating unforgettable group trips to the world\u2019s most beautiful destinations. Discover featured escapes, travel tips, and join our community.',
  generator: 'v0.app',
  keywords: [
    'luxury travel',
    'group travel',
    'travel club',
    'black women travel',
    'curated trips',
    'travel blog',
  ],
  openGraph: {
    title: 'Blaq Gurl Moves | Luxury Group Travel Club',
    description:
      'Curated luxury group travel to the world\u2019s most beautiful destinations.',
    type: 'website',
  },
  icons: {
    shortcut: '/favicon.ico',
    icon: [
      {
        url: '/favicon-96x96.png',
        type: 'image/png',
        sizes: '96x96',
      },
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
        sizes: 'any',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1a4d47',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          src="https://links.getcaros.com/js/external-tracking.js"
          data-tracking-id="tk_7f4c4441a3904c37a0ef258ab0f600e2"
        />
      </body>
    </html>
  )
}
