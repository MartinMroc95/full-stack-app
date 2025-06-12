import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Check } from 'lucide-react'
import { useRouter } from 'next/router'
import { cn } from 'src/lib/utils'
import CheckoutButton from 'components/Subscription/CheckoutButton'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader } from 'components/ui/card'

// Pricing tiers with features
const pricingTiers = [
  {
    name: 'Basic',
    tier: 'basic',
    price: '$9.99',
    period: '/month',
    description: 'Perfect for individual users',
    features: ['Up to 10 cars', 'Basic analytics', 'Email support', '1 user account'],
  },
  {
    name: 'Pro',
    tier: 'pro',
    price: '$29.99',
    period: '/month',
    description: 'Ideal for small businesses',
    features: [
      'Up to 100 cars',
      'Advanced analytics',
      'Priority email support',
      '5 user accounts',
      'Custom exports',
    ],
    featured: true,
  },
  {
    name: 'Premium',
    tier: 'premium',
    price: '$79.99',
    period: '/month',
    description: 'For enterprises and large fleets',
    features: [
      'Unlimited cars',
      'Premium analytics',
      '24/7 phone support',
      'Unlimited user accounts',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
    ],
  },
]

const PricingPage = () => {
  const router = useRouter()
  const { user, isLoading } = useUser()

  return (
    <div className="w-full px-4 py-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => {
            void router.push('/account')
          }}
        >
          ← Back to Account
        </Button>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground">Select the perfect plan for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              'relative',
              tier.featured && 'lg:scale-105 z-10 bg-blue-50 dark:bg-blue-950/50',
            )}
          >
            <CardHeader className="p-6">
              <p
                className={cn(
                  'font-bold uppercase text-sm tracking-wide mb-2',
                  tier.featured ? 'text-blue-500' : 'text-muted-foreground',
                )}
              >
                {tier.name}
              </p>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="ml-1 text-muted-foreground">{tier.period}</span>
              </div>
              <p className="text-muted-foreground mb-6">{tier.description}</p>

              {!isLoading && (
                <div className="mb-6">
                  {user ? (
                    <CheckoutButton
                      tier={tier.tier as 'basic' | 'pro' | 'premium'}
                      label="Subscribe Now"
                    />
                  ) : (
                    <Button
                      variant={tier.featured ? 'default' : 'outline'}
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <a href="/api/auth/login?returnTo=/pricing">Sign Up</a>
                    </Button>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PricingPage
