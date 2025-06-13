import prisma from '../lib/prisma'

export const resolvers = {
  Query: {
    cars: () => prisma.car.findMany(),
  },
}
