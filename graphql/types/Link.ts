import prisma from '../../lib/prisma'
import { builder } from '../builder'

builder.prismaObject('Link', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    url: t.exposeString('url'),
    description: t.exposeString('description'),
    imageUrl: t.exposeString('imageUrl'),
    category: t.exposeString('category'),
    userId: t.relation('User'),
  }),
})

builder.queryField('links', (t) =>
  t.prismaConnection({
    type: 'Link',
    cursor: 'id',
    resolve: async (query, _parent, _args, ctx) => {
      const { user } = await ctx
      return prisma.link.findMany({
        ...query,
        where: { userId: user?.id },
      })
    },
  })
)

builder.mutationField('createLink', (t) =>
  t.prismaField({
    type: 'Link',
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      url: t.arg.string({ required: true }),
      imageUrl: t.arg.string({ required: true }),
      category: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { title, description, url, imageUrl, category } = args
      const { user } = await ctx

      if (!user) {
        throw new Error('You have to be logged in to perform this action')
      }

      return prisma.link.create({
        ...query,
        data: {
          userId: user.id,
          title,
          description,
          url,
          imageUrl,
          category,
        },
      })
    },
  })
)
