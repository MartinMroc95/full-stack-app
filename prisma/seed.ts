import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      email: `testemail2@gmail.com`,
      role: 'ADMIN',
    },
  })
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)

  // await prisma.link.createMany({
  //   data: links,
  // })
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
