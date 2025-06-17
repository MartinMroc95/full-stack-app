import prisma from '../../lib/prisma'
import { builder } from '../builder'

export const UpdateCarInput = builder.inputType('UpdateCarInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    brand: t.string({ required: true }),
    model: t.string({ required: true }),
    year: t.int({ required: true }),
    mileage: t.int({ required: true }),
    fuelType: t.string({ required: true }),
    enginePower: t.int({ required: true }),
    price: t.int({ required: true }),
    description: t.string({ required: false }),
  }),
})

builder.prismaObject('Car', {
  fields: (t) => ({
    id: t.exposeID('id'),
    brand: t.exposeString('brand'),
    model: t.exposeString('model'),
    year: t.exposeInt('year'),
    mileage: t.exposeInt('mileage'),
    fuelType: t.exposeString('fuelType'),
    enginePower: t.exposeInt('enginePower'),
    price: t.exposeInt('price'),
    description: t.exposeString('description'),
    userId: t.relation('User'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
})

builder.queryField('cars', (t) =>
  t.prismaConnection({
    type: 'Car',
    cursor: 'id',
    resolve: async (query, _parent, _args, ctx) => {
      const { user } = await ctx
      return prisma.car.findMany({
        ...query,
        where: { userId: user?.id },
      })
    },
  }),
)

builder.mutationField('updateCar', (t) =>
  t.prismaField({
    type: 'Car',
    args: {
      input: t.arg({ type: UpdateCarInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id, ...data } = args.input
      const { user } = await ctx

      if (!user) {
        throw new Error('You have to be logged in to perform this action')
      }

      const car = await prisma.car.findUnique({
        where: { id },
      })

      if (!car || car.userId !== user.id) {
        throw new Error('Car not found or you do not have permission to update it')
      }

      return prisma.car.update({
        ...query,
        where: { id },
        data,
      })
    },
  }),
)

builder.mutationField('addCar', (t) =>
  t.prismaField({
    type: 'Car',
    args: {
      brand: t.arg.string({ required: true }),
      model: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      mileage: t.arg.int({ required: true }),
      fuelType: t.arg.string({ required: true }),
      enginePower: t.arg.int({ required: true }),
      price: t.arg.int({ required: true }),
      description: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { brand, model, year, mileage, fuelType, enginePower, price, description } = args
      const { user } = await ctx

      console.log('user', user)

      if (!user) {
        throw new Error('You have to be logged in to perform this action')
      }

      return prisma.car.create({
        ...query,
        data: {
          userId: user.id,
          brand,
          model,
          year,
          mileage,
          fuelType,
          enginePower,
          price,
          description,
        },
      })
    },
  }),
)

builder.mutationField('removeCar', (t) =>
  t.prismaField({
    type: 'Car',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id } = args
      const { user } = await ctx

      if (!user) {
        throw new Error('You have to be logged in to perform this action')
      }

      const car = await prisma.car.findUnique({
        where: { id },
      })

      if (!car || car.userId !== user.id) {
        throw new Error('Car not found or you do not have permission to delete it')
      }

      return prisma.car.delete({
        ...query,
        where: { id },
      })
    },
  }),
)
