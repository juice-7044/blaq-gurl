import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { blogPosts } from '@/lib/site-data'
import { Button } from '@/components/ui/button'

export function BlogPreview() {
  return (
    <section id="blog" className="scroll-mt-24 bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              The journal
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
              Stories from the road
            </h2>
          </div>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/blog">
              View all posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {blogPosts.map((post) => (
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
      </div>
    </section>
  )
}
