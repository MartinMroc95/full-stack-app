import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from 'components/ui/button'

interface ManageSubscriptionButtonProps {
  label?: string
}

const ManageSubscriptionButton: React.FC<ManageSubscriptionButtonProps> = ({
  label = 'Manage Subscription',
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { url: redirectUrl }: { url: string } = await response.json()

      // Redirect to Stripe Billing Portal
      if (redirectUrl) {
        void router.push(redirectUrl)
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
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
        void handleManageSubscription()
      }}
    >
      {label}
    </Button>
  )
}

export default ManageSubscriptionButton
