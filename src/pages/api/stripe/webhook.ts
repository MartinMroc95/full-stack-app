import { buffer } from 'micro'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import prisma from '../../../../lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

// Disable body parser to get raw request body
export const config = {
  api: {
    bodyParser: false,
  },
}

function determineTier(priceId: string): 'basic' | 'pro' | 'premium' {
  const priceMappings: Record<string, 'basic' | 'pro' | 'premium'> = {
    [process.env.STRIPE_BASIC_PRICE_ID || '']: 'basic',
    [process.env.STRIPE_PRO_PRICE_ID || '']: 'pro',
    [process.env.STRIPE_PREMIUM_PRICE_ID || '']: 'premium',
  }

  return priceMappings[priceId] || 'basic'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Webhook endpoint is working!' })
  }

  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const buf = await buffer(req)

    const sig = req.headers['stripe-signature'] as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !webhookSecret) {
      return res.status(400).json({ error: 'Missing signature or webhook secret' })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return res.status(400).json({ error: 'Webhook signature verification failed' })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        try {
          // Get the subscription
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
            expand: ['customer', 'items.data.price.product'],
          })
          console.log('📋 Retrieved subscription:', subscription)

          // Create subscription in database
          const subscriptionRecord = await prisma.userSubscription.create({
            data: {
              tier: determineTier(subscription.items.data[0].price.id),
              stripeSubscriptionId: subscription.id,
              userId: session.metadata?.userId || '',
              stripeCustomerId: session.customer as string,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              status: subscription.status,
            },
          })
          console.log('✅ Created subscription record:', subscriptionRecord)
        } catch (error) {
          console.error('❌ Error processing subscription:', error)
          return res.status(500).json({ error: 'Error processing subscription' })
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object

        if (invoice.subscription) {
          const subscription = await prisma.userSubscription.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string },
          })

          if (subscription) {
            // Create invoice record
            await prisma.invoice.create({
              data: {
                stripeInvoiceId: invoice.id,
                subscriptionId: subscription.id,
                userId: subscription.userId,
                amount: invoice.amount_paid,
                status: 'paid',
                createdAt: new Date(),
              },
            })
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object

        if (invoice.subscription) {
          const subscription = await prisma.userSubscription.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string },
          })

          if (subscription) {
            // Create invoice record
            await prisma.invoice.create({
              data: {
                stripeInvoiceId: invoice.id,
                subscriptionId: subscription.id,
                userId: subscription.userId,
                amount: invoice.amount_paid,
                status: 'paid',
                currency: invoice.currency,
                createdAt: new Date(),
                paidAt: new Date(),
              },
            })
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object

        if (invoice.subscription) {
          const subscription = await prisma.userSubscription.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string },
          })

          if (subscription) {
            // Create failed invoice record
            await prisma.invoice.create({
              data: {
                stripeInvoiceId: invoice.id,
                subscriptionId: subscription.id,
                userId: subscription.userId,
                amount: invoice.amount_due,
                status: 'failed',
              },
            })
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object

        // Update subscription status in your database
        await prisma.userSubscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            stripePriceId: subscription.items.data[0].price.id,
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        // Update subscription status to canceled
        await prisma.userSubscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'canceled' },
        })
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return res.status(500).json({ error: 'Webhook error' })
  }
}
