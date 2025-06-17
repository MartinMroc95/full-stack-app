import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from 'components/ui/button'

interface CheckoutButtonProps {
  tier: 'basic' | 'pro' | 'premium'
  label?: string
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ tier, label = 'Subscribe' }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          successUrl: `${window.location.origin}/account?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      })

      const { url }: { url: string } = await response.json()

      // Redirect to checkout
      if (url) {
        void router.push(url)
      }
    } catch (error) {
      console.error('Error initiating checkout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Button disabled>Loading...</Button>
  }

  return (
    <Button
      onClick={() => {
        void handleCheckout()
      }}
    >
      {label}
    </Button>
  )
}

export default CheckoutButton
