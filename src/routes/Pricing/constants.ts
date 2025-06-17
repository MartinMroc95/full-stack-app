// Pricing tiers with features
type PricingTier = {
  name: string
  tier: 'basic' | 'pro' | 'premium'
  price: string
  period: string
  description: string
  features: readonly string[]
  featured?: boolean
}

export const pricingTiers: readonly PricingTier[] = [
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
