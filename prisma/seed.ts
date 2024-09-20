import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// const links = [
//   {
//     description: 'Fullstack React framework',
//     id: '1',
//     title: 'Next.js',
//     url: 'https://nextjs.org',
//   },
//   {
//     description: 'Next Generation ORM for TypeScript and JavaScript',
//     id: '2',
//     title: 'Prisma',
//     url: 'https://prisma.io',
//   },
//   {
//     description: 'Utility-fist css framework',
//     id: '3',
//     title: 'TailwindCSS',
//     url: 'https://tailwindcss.com',
//   },
//   {
//     description: 'GraphQL implementation ',
//     id: '4',
//     title: 'Apollo GraphQL',
//     url: 'https://apollographql.com',
//   },
// ]

async function main() {
  await prisma.user.create({
    data: {
      email: `testemail@gmail.com`,
      role: 'ADMIN',
    },
  })

  const allUsers = await prisma.user.findMany()
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
