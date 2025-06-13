import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const session = await getSession(req, res)

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if the user has an active subscription
    const subscription = user.subscriptions[0]

    if (!subscription || !['active', 'trialing'].includes(subscription.status)) {
      return res.status(200).json({ subscription: null })
    }

    return res.status(200).json({ subscription })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
