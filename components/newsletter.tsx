'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Send, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { subscribeNewsletter, type LeadState } from '@/app/actions/leads'

const initialState: LeadState = { status: 'idle', message: '' }

function SubscribeButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-accent text-accent-foreground hover:bg-accent/90"
    >
      {pending ? (
        <>
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          Subscribing
        </>
      ) : (
        <>
          Subscribe
          <Send className="ml-1 h-4 w-4" />
        </>
      )}
    </Button>
  )
}

export function Newsletter() {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState)

  return (
    <section id="newsletter" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center md:px-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Stay in the know
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
            Get first dibs on new escapes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-primary-foreground/85">
            Join our newsletter for early trip drops, member-only deals, and
            travel inspiration delivered straight to your inbox.
          </p>

          {state.status === 'success' ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-xl bg-background/10 px-4 py-4 text-primary-foreground">
              <Check className="h-5 w-5 text-accent" aria-hidden />
              {state.message}
            </div>
          ) : (
            <form
              action={formAction}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                required
                type="email"
                placeholder="you@email.com"
                className="flex-1 rounded-lg border border-transparent bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
              />
              <SubscribeButton />
            </form>
          )}
          {state.status === 'error' && (
            <p
              className="mx-auto mt-3 max-w-md text-sm text-accent"
              role="alert"
            >
              {state.message}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
