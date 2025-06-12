import { builder } from '../builder'

builder.prismaObject('UserSubscription', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    status: t.exposeString('status'),
    tier: t.exposeString('tier'),
    stripePriceId: t.exposeString('stripePriceId'),
    stripeCustomerId: t.exposeString('stripeCustomerId', { nullable: true }),
    stripeSubscriptionId: t.exposeString('stripeSubscriptionId', { nullable: true }),
    stripeCurrentPeriodEnd: t.expose('stripeCurrentPeriodEnd', {
      type: 'DateTime',
      nullable: true,
    }),
    userId: t.exposeString('userId'),
    user: t.relation('user'),
    invoices: t.relation('invoices'),
  }),
})
