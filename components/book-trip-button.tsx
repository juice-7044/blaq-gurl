'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { WaitlistModal } from '@/components/waitlist-modal'

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
        <WaitlistModal
          trip={{ id: slug, title: destination, month: 'Featured trip' }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
