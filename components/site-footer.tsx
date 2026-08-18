import Link from 'next/link'
import Image from 'next/image'
import { Camera, AtSign, MessageCircle } from 'lucide-react'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: '2027 Lineup', href: '/trips' },
      { label: 'Featured Escapes', href: '/#destinations' },
      { label: 'Events', href: '/events' },
      { label: 'Where We\u2019ve Been', href: '/#map' },
      { label: 'Chronicles', href: '/blog' },
    ],
  },
  {
    title: 'The Sisterhood',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Who Are We', href: '/who-are-we' },
      { label: 'Our Colors & Logo', href: '/origin-of-our-colors-and-logo' },
      { label: 'Find Your Tribe', href: '/quiz' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Resource Hub', href: '/resources' },
      { label: 'Travel Tips', href: '/#tips' },
      { label: 'Newsletter', href: '/#newsletter' },
      { label: 'Contact the Tribe', href: '/#newsletter' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="Blaq Gurl Moves home">
              <Image
                src="/images/bgm-logo.png"
                alt="Blaq Gurl Moves"
                width={706}
                height={150}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-pretty leading-relaxed text-background/70">
              Sisterhood on the move. A Black women&apos;s travel collective curating
              unforgettable group escapes rooted in culture, healing, and joy.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Camera, label: 'Instagram' },
                { icon: AtSign, label: 'Threads' },
                { icon: MessageCircle, label: 'TikTok' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <social.icon className="h-5 w-5" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-serif text-lg font-bold text-background">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-background/70 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/15 pt-8 text-sm text-background/60 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Blaq Gurl Moves. All rights reserved.</p>
          <p>Move with us. The world is waiting.</p>
        </div>
      </div>
    </footer>
  )
}
