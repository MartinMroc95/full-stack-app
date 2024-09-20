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
    bookmarks: t.relation('bookmarks'),
  }),
})
