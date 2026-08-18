import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Newsletter } from '@/components/newsletter'
import { blogPosts } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'The Journal | Blaq Gurl Moves',
  description:
    'Travel stories, destination guides, and tips from the Blaq Gurl Moves community.',
}

export default function BlogPage() {
  const fullPosts = blogPosts.filter((p) => !p.archived)
  const archivedPosts = blogPosts.filter((p) => p.archived)
  const [featured, ...rest] = fullPosts

  return (
    <>
      <SiteHeader />
      <main>
        {/* Header band */}
        <section className="relative overflow-hidden pt-32 pb-16 text-center md:pt-44 md:pb-24">
          <div className="absolute inset-0">
            <img
              src="/images/blog-header.jpg"
              alt="A joyful woman celebrating"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-foreground/60" />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              The journal
            </p>
            <h1 className="mt-3 text-balance font-serif text-4xl font-bold text-background md:text-5xl">
              Stories, guides & travel inspiration
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-background/90">
              Wisdom from the road, dispatches from our destinations, and
              everything you need to move through the world in style.
            </p>
          </div>
        </section>

        <section className="bg-background py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            {/* Featured post */}
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-6 overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2"
            >
              <div className="overflow-hidden">
                <img
                  src={featured.image || '/placeholder.svg'}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-10">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
                    {featured.category}
                  </span>
                  <span>{featured.date}</span>
                  <span>{featured.readTime}</span>
                </div>
                <h2 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                  {featured.title}
                </h2>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
                <span className="mt-5 font-medium text-primary">
                  Read the story &rarr;
                </span>
              </div>
            </Link>

            {/* Rest */}
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <article key={post.slug} className="group flex flex-col">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="overflow-hidden rounded-2xl"
                  >
                    <img
                      src={post.image || '/placeholder.svg'}
                      alt={post.title}
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-foreground">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>

            {/* Archive */}
            {archivedPosts.length > 0 && (
              <div className="mt-16 border-t border-border pt-12">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  From the Archive
                </h2>
                <p className="mt-2 text-muted-foreground">
                  More stories and dispatches from the sisterhood.
                </p>
                <ul className="mt-8 divide-y divide-border">
                  {archivedPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
                              {post.category}
                            </span>
                            <span>{post.date}</span>
                          </div>
                          <h3 className="mt-2 font-serif text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                            {post.title}
                          </h3>
                          <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                            {post.excerpt}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-medium text-primary">
                          Read &rarr;
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <Newsletter />
      </main>
      <SiteFooter />
    </>
  )
}
