'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckoutModal } from '@/components/checkout-modal'

type Props = {
  destination: string
  price: number
  slug: string
}

export function BookTripButton({ destination, price, slug }: Props) {
  const [open, setOpen] = useState(false)
  const deposit = Math.round(price * 0.2)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Reserve · ${deposit.toLocaleString()} deposit
      </Button>

      {open && (
        <CheckoutModal
          item={{ kind: 'trip-deposit', id: slug }}
          title={`Reserve ${destination}`}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
