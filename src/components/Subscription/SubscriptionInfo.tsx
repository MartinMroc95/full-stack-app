import React from 'react'
import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
import { Card, CardContent } from 'components/ui/card'
import { Skeleton } from 'components/ui/skeleton'
import { useSubscription } from '../../context/SubscriptionContext'
import ManageSubscriptionButton from './ManageSubscriptionButton'

interface SubscriptionInfoProps {
  showManageButton?: boolean
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ showManageButton = true }) => {
  const { subscription, isLoading, error } = useSubscription()

  const getTierLabel = (tier: string | null) => {
    switch (tier) {
      case 'basic':
        return 'Basic'
      case 'pro':
        return 'Pro'
      case 'premium':
        return 'Premium'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'trialing':
        return 'bg-yellow-500'
      case 'past_due':
        return 'bg-orange-500'
      case 'canceled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5">
          <Skeleton className="h-[30px] mb-2" />
          <Skeleton className="h-[20px] mb-2" />
          <Skeleton className="h-[20px]" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-2 text-red-500">Error</h3>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
          <p className="mb-4">
            You don&apos;t have an active subscription. Visit our pricing page to subscribe.
          </p>
          <Button asChild>
            <a href="/pricing">View Plans</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold">Your Subscription</h3>
          <Badge
            className={`${getStatusColor(subscription.status)} hover:bg-${getStatusColor(subscription.status)} hover:cursor-default`}
          >
            {subscription.status}
          </Badge>
        </div>

        <p className="mb-1">
          <strong>Plan:</strong> {getTierLabel(subscription.tier)}
        </p>

        <p className="mb-1">
          <strong>Started:</strong> {new Date(subscription.createdAt).toLocaleDateString()}
        </p>

        <p className="mb-1">
          <strong>Ends:</strong>{' '}
          {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}
        </p>

        {showManageButton && (
          <div className="mt-4">
            <ManageSubscriptionButton />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SubscriptionInfo
