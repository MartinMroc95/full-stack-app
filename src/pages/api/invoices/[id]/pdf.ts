import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/prisma'
import stripe from '../../../../../lib/stripe'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession(req, res)
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { id } = req.query
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid invoice ID' })
    }

    // Get invoice from database
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' })
    }

    // Verify user owns this invoice
    if (invoice.user.email !== session.user.email) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    if (!invoice.stripeInvoiceId) {
      return res.status(404).json({ error: 'Stripe invoice ID not found' })
    }

    // Get invoice PDF from Stripe
    const stripeInvoice = await stripe.invoices.retrieve(invoice.stripeInvoiceId, {
      expand: ['payment_intent'],
    })

    if (!stripeInvoice.invoice_pdf) {
      return res.status(404).json({ error: 'Invoice PDF not found' })
    }

    // Redirect to Stripe's hosted PDF
    res.redirect(stripeInvoice.invoice_pdf)
    return res.end()
  } catch (error) {
    console.error('Error downloading invoice:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler
