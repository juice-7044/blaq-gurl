'use client'

import { useCallback } from 'react'
import { X } from 'lucide-react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import {
  startCheckoutSession,
  type CheckoutItem,
} from '@/app/actions/stripe'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
)

type Props = {
  item: CheckoutItem
  title: string
  onClose: () => void
}

export function CheckoutModal({ item, title, onClose }: Props) {
  const fetchClientSecret = useCallback(
    () => startCheckoutSession(item),
    [item],
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-label={`Checkout: ${title}`}
    >
      <div
        className="fixed inset-0 bg-foreground/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-card p-4 shadow-2xl md:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-serif text-xl font-bold text-foreground">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close checkout"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-hidden rounded-lg">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}
