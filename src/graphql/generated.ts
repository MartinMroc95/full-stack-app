import type { Car, Invoice, Prisma, User, UserSubscription } from '@prisma/client'

export default interface PrismaTypes {
  User: {
    Name: 'User'
    Shape: User
    Include: Prisma.UserInclude
    Select: Prisma.UserSelect
    OrderBy: Prisma.UserOrderByWithRelationInput
    WhereUnique: Prisma.UserWhereUniqueInput
    Where: Prisma.UserWhereInput
    Create: object
    Update: object
    RelationName: 'cars' | 'invoices' | 'subscriptions'
    ListRelations: 'cars' | 'invoices' | 'subscriptions'
    Relations: {
      cars: {
        Shape: Car[]
        Name: 'Car'
        Nullable: false
      }
      invoices: {
        Shape: Invoice[]
        Name: 'Invoice'
        Nullable: false
      }
      subscriptions: {
        Shape: UserSubscription[]
        Name: 'UserSubscription'
        Nullable: false
      }
    }
  }
  Car: {
    Name: 'Car'
    Shape: Car
    Include: Prisma.CarInclude
    Select: Prisma.CarSelect
    OrderBy: Prisma.CarOrderByWithRelationInput
    WhereUnique: Prisma.CarWhereUniqueInput
    Where: Prisma.CarWhereInput
    Create: object
    Update: object
    RelationName: 'User'
    ListRelations: never
    Relations: {
      User: {
        Shape: User
        Name: 'User'
        Nullable: false
      }
    }
  }
  UserSubscription: {
    Name: 'UserSubscription'
    Shape: UserSubscription
    Include: Prisma.UserSubscriptionInclude
    Select: Prisma.UserSubscriptionSelect
    OrderBy: Prisma.UserSubscriptionOrderByWithRelationInput
    WhereUnique: Prisma.UserSubscriptionWhereUniqueInput
    Where: Prisma.UserSubscriptionWhereInput
    Create: object
    Update: object
    RelationName: 'invoices' | 'user'
    ListRelations: 'invoices'
    Relations: {
      invoices: {
        Shape: Invoice[]
        Name: 'Invoice'
        Nullable: false
      }
      user: {
        Shape: User
        Name: 'User'
        Nullable: false
      }
    }
  }
  Invoice: {
    Name: 'Invoice'
    Shape: Invoice
    Include: Prisma.InvoiceInclude
    Select: Prisma.InvoiceSelect
    OrderBy: Prisma.InvoiceOrderByWithRelationInput
    WhereUnique: Prisma.InvoiceWhereUniqueInput
    Where: Prisma.InvoiceWhereInput
    Create: object
    Update: object
    RelationName: 'subscription' | 'user'
    ListRelations: never
    Relations: {
      subscription: {
        Shape: UserSubscription | null
        Name: 'UserSubscription'
        Nullable: true
      }
      user: {
        Shape: User
        Name: 'User'
        Nullable: false
      }
    }
  }
}
