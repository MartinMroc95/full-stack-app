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

    const { description, amount, items = [] } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: 'User does not have a Stripe customer ID' })
    }

    // Create invoice items
    const invoiceItems = []

    // Add main item if provided
    if (description) {
      const invoiceItem = await stripe.invoiceItems.create({
        customer: user.stripeCustomerId,
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'eur',
        description,
      })
      invoiceItems.push(invoiceItem)
    }

    // Add any additional line items
    const additionalItems = await Promise.all(
      (items as Array<{ description: string; amount: number }>).map((item) =>
        stripe.invoiceItems.create({
          customer: user.stripeCustomerId ?? '',
          amount: Math.round(item.amount * 100),
          currency: 'eur',
          description: item.description,
        }),
      ),
    )
    invoiceItems.push(...additionalItems)

    // Create and finalize the invoice
    const invoice = await stripe.invoices.create({
      customer: user.stripeCustomerId,
      auto_advance: true, // Auto-finalize and send the invoice
      collection_method: 'send_invoice',
      days_until_due: 30,
    })

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)

    // Send the invoice
    await stripe.invoices.sendInvoice(finalizedInvoice.id)

    // Create a record in our database
    const userSubscription = await prisma.userSubscription.findFirst({
      where: { userId: user.id },
      select: { id: true },
    })

    const createdInvoice = await prisma.invoice.create({
      data: {
        stripeInvoiceId: finalizedInvoice.id,
        userId: user.id,
        amount: finalizedInvoice.amount_due,
        status: finalizedInvoice.status || '',
        subscriptionId: userSubscription?.id || '',
      },
    })

    return res.status(200).json({
      invoice: {
        id: createdInvoice.id,
        stripeInvoiceId: createdInvoice.stripeInvoiceId,
        amount: finalizedInvoice.amount_due / 100, // Convert back to dollars
        status: finalizedInvoice.status,
        url: finalizedInvoice.hosted_invoice_url,
      },
    })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
