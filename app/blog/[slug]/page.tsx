import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Newsletter } from '@/components/newsletter'
import { blogPosts } from '@/lib/site-data'

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Post not found | Blaq Gurl Moves' }
  return {
    title: `${post.title} | Blaq Gurl Moves`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="absolute inset-0">
            <img
              src={post.image || '/placeholder.svg'}
              alt={post.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/65" />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-8">
            <div className="flex items-center justify-center gap-3 text-xs text-background/85">
              <span className="rounded-full bg-accent px-3 py-1 font-semibold text-accent-foreground">
                {post.category}
              </span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="mt-5 text-balance font-serif text-3xl font-bold leading-tight text-background md:text-5xl">
              {post.title}
            </h1>
          </div>
        </section>

        {/* Body */}
        <article className="bg-background py-16 md:py-20">
          <div className="mx-auto max-w-2xl px-4 md:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to journal
            </Link>
            <p className="mt-8 text-pretty text-xl leading-relaxed text-foreground">
              {post.excerpt}
            </p>
            <div className="mt-6 space-y-6">
              {post.content.map((para, i) => (
                <p
                  key={i}
                  className="text-pretty leading-relaxed text-muted-foreground"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Related */}
        <section className="bg-secondary py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Keep reading
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {related.map((rp) => (
                <article key={rp.slug} className="group flex flex-col">
                  <Link
                    href={`/blog/${rp.slug}`}
                    className="overflow-hidden rounded-2xl"
                  >
                    <img
                      src={rp.image || '/placeholder.svg'}
                      alt={rp.title}
                      className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <h3 className="mt-4 font-serif text-xl font-bold text-foreground">
                    <Link
                      href={`/blog/${rp.slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {rp.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                    {rp.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <SiteFooter />
    </>
  )
}
