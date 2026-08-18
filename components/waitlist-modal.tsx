'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { X, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { joinWaitlist, type LeadState } from '@/app/actions/leads'

const initialState: LeadState = { status: 'idle', message: '' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {pending ? (
        <>
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Join the waitlist'
      )}
    </Button>
  )
}

export type WaitlistTrip = {
  id: string
  title: string
  month: string
}

export function WaitlistModal({
  trip,
  onClose,
}: {
  trip: WaitlistTrip
  onClose: () => void
}) {
  const [state, formAction] = useActionState(joinWaitlist, initialState)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {state.status === 'success' ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
              <Check className="h-6 w-6 text-accent" aria-hidden />
            </div>
            <h3 className="mt-4 font-serif text-2xl font-bold text-foreground">
              You&apos;re on the list
            </h3>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              {state.message}
            </p>
            <Button
              onClick={onClose}
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {trip.month} 2027
            </p>
            <h3
              id="waitlist-title"
              className="mt-1 text-balance font-serif text-2xl font-bold text-foreground"
            >
              Join the {trip.title} waitlist
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              Leave your details and we&apos;ll notify you the moment
              reservations open for this trip.
            </p>

            <form action={formAction} className="mt-6 space-y-4">
              <input type="hidden" name="tripId" value={trip.id} />
              <input type="hidden" name="tripTitle" value={trip.title} />
              <input type="hidden" name="tripMonth" value={trip.month} />

              <div>
                <label
                  htmlFor="wl-name"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  Full name
                </label>
                <input
                  id="wl-name"
                  name="name"
                  required
                  type="text"
                  placeholder="Jane Traveler"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="wl-email"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <input
                  id="wl-email"
                  name="email"
                  required
                  type="email"
                  placeholder="you@email.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {state.status === 'error' && (
                <p className="text-sm text-destructive" role="alert">
                  {state.message}
                </p>
              )}

              <SubmitButton />
            </form>
          </>
        )}
      </div>
    </div>
  )
}
