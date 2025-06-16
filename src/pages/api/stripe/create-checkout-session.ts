import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import stripe from '../../../../lib/stripe'

// Price IDs for different subscription tiers
const priceIds = {
  basic: process.env.STRIPE_BASIC_PRICE_ID || '',
  pro: process.env.STRIPE_PRO_PRICE_ID || '',
  premium: process.env.STRIPE_PREMIUM_PRICE_ID || '',
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const session = await getSession(req, res)
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { tier = 'basic', successUrl, cancelUrl } = req.body

    // Get or create Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      // Create new customer in Stripe
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })

      customerId = customer.id

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds[tier as keyof typeof priceIds],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/account?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        tier,
        email: session.user.email,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier,
          email: session.user.email,
        },
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
      },
      allow_promotion_codes: true,
    })

    return res.status(200).json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
