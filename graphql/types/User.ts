import { builder } from '../builder'

const Role = builder.enumType('Role', {
  values: ['USER', 'ADMIN'] as const,
})

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email', { nullable: true }),
    image: t.exposeString('image', { nullable: true }),
    role: t.expose('role', { type: Role }),
    cars: t.relation('cars'),
    invoices: t.relation('invoices'),
    subscriptions: t.relation('subscriptions'),
  }),
})
