import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, secret } = req.body

  if (req.method !== 'POST') {
    return res.status(403).json({ message: 'Method not allowed' })
  }

  if (secret !== process.env.AUTH0_HOOK_SECRET) {
    return res.status(403).json({ message: `You must provide the secret 🤫` })
  }

  if (!email) {
    return res.status(403).json({ message: `You must provide the email` })
  }

  await prisma.user.create({
    data: { email },
  })
  return res.status(200).json({
    message: `User with email: ${email as string} has been created successfully!`,
  })
}

export default handler
