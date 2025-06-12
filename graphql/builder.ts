import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import RelayPlugin from '@pothos/plugin-relay'
import { GraphQLDateTime } from 'graphql-scalars'
import prisma from '../lib/prisma'
import { createContext } from './context'

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: ReturnType<typeof createContext>
  Scalars: {
    DateTime: {
      Input: Date
      Output: Date
    }
  }
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  prisma: {
    client: prisma,
  },
})

builder.addScalarType('DateTime', GraphQLDateTime)

builder.queryType({
  fields: (t) => ({
    ok: t.boolean({
      resolve: () => true,
    }),
  }),
})

builder.mutationType({})
