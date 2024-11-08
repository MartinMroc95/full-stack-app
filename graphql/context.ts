import { getSession } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../lib/prisma'

export const createContext = async ({
  req,
  res,
}: {
  req: NextApiRequest
  res: NextApiResponse
}) => {
  const session = await getSession(req, res)

  // if the user is not logged in, return an empty object
  if (!session || typeof session === 'undefined') {
    return {}
  }

  const { user, accessToken } = session

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } })

  return {
    user: dbUser,
    accessToken,
  }
}
