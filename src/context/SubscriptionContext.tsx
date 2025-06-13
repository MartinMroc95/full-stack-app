import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

interface Subscription {
  id: string
  status: string
  stripePriceId: string
  createdAt: string
  tier: 'basic' | 'pro' | 'premium' | null
  stripeCurrentPeriodEnd: string
}

interface SubscriptionContextValue {
  subscription: Subscription | null
  isLoading: boolean
  error: string | null
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined)

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

interface SubscriptionProviderProps {
  children: ReactNode
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user, isLoading: isLoadingUser } = useUser()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = async () => {
    if (!user) {
      return
    }

    setIsLoading(true)

    try {
      const response: { subscription: Subscription } = await fetch('/api/subscription').then(
        (res) => res.json(),
      )

      if (response.subscription) {
        setSubscription(response.subscription)
      } else {
        setSubscription(null)
      }
    } catch (err) {
      console.error('Error fetching subscription:', err)
      setError('Failed to load subscription information.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoadingUser && user) {
      void fetchSubscription()
    } else if (!isLoadingUser && !user) {
      setSubscription(null)
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoadingUser])

  const value = useMemo(
    () => ({
      subscription,
      isLoading: isLoadingUser || isLoading,
      error,
      refreshSubscription: fetchSubscription,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subscription, isLoadingUser, isLoading, error],
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}
