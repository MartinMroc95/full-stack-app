import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import stripe from '../../../../lib/stripe'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const session = await getSession(req, res)
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscriptions: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Find the active subscription
    const activeSubscription = user.subscriptions.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing',
    )

    if (!activeSubscription) {
      return res.status(404).json({ error: 'No active subscription found' })
    }

    // Create a billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: activeSubscription.stripeCustomerId ?? '',
      return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/account`,
    })

    // Return the URL of the portal
    return res.status(200).json({ url: portalSession.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
