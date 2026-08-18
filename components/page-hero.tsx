type PageHeroProps = {
  eyebrow: string
  title: string
  description?: string
  image: string
}

export function PageHero({ eyebrow, title, description, image }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[52vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || '/placeholder.svg'}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/75 via-foreground/55 to-foreground/80" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pt-28 pb-16 text-center md:px-8">
        <p className="font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-balance font-serif text-4xl font-bold leading-tight text-background md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-background/85">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  )
}
