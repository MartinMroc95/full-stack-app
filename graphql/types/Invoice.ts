import { builder } from '../builder'

builder.prismaObject('Invoice', {
  fields: (t) => ({
    id: t.exposeID('id'),
    amount: t.exposeInt('amount'),
    currency: t.exposeString('currency'),
    status: t.exposeString('status'),
    stripeInvoiceId: t.exposeString('stripeInvoiceId', { nullable: true }),
    stripePaymentIntentId: t.exposeString('stripePaymentIntentId', { nullable: true }),
    subscriptionId: t.exposeString('subscriptionId', { nullable: true }),
    userId: t.exposeString('userId'),
    paidAt: t.expose('paidAt', { type: 'DateTime', nullable: true }),
    user: t.relation('user'),
    subscription: t.relation('subscription', { nullable: true }),
  }),
})
