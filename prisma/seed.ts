import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const links = [
  {
    category: 'Open Source',
    description: 'Fullstack React framework',
    id: '1',
    imageUrl: 'https://github.com/vercel.png',
    title: 'Next.js',
    url: 'https://nextjs.org',
    userId: 'kpZleRhQUgRnktjeyLBI3EVSFoWH1Ver',
  },
  {
    category: 'Open Source',
    description: 'Next Generation ORM for TypeScript and JavaScript',
    id: '2',
    imageUrl: 'https://github.com/prisma.png',
    title: 'Prisma',
    url: 'https://prisma.io',
    userId: 'kpZleRhQUgRnktjeyLBI3EVSFoWH1Ver',
  },
  {
    category: 'Open Source',
    description: 'Utility-fist css framework',
    id: '3',
    imageUrl: 'https://github.com/tailwindlabs.png',
    title: 'TailwindCSS',
    url: 'https://tailwindcss.com',
    userId: 'kpZleRhQUgRnktjeyLBI3EVSFoWH1Ver',
  },
  {
    category: 'Open Source',
    description: 'GraphQL implementation ',
    id: '4',
    imageUrl: 'https://www.apollographql.com/apollo-home.jpg',
    title: 'Apollo GraphQL',
    url: 'https://apollographql.com',
    userId: 'kpZleRhQUgRnktjeyLBI3EVSFoWH1Ver',
  },
]

async function main() {
  await prisma.user.create({
    data: {
      id: 'kpZleRhQUgRnktjeyLBI3EVSFoWH1Ver',
      email: 'example@example.com',
      role: 'ADMIN',
    },
  })

  const allUsers = await prisma.user.findMany()

  await prisma.link.createMany({
    data: links,
  })
  console.log(allUsers)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
