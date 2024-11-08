import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      const auth0Response = await handleCallback(req, res, {
        afterCallback: async (_req: NextApiRequest, _res: NextApiResponse, session: Session) => {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: session.user.email,
            },
          })
          if (!existingUser) {
            await prisma.user.create({
              data: {
                id: session.user.sid,
                email: session.user.email,
                image: session.user.picture,
              },
            })
          }
          return session
        },
      })
      return auth0Response
    } catch (error) {
      console.error('Auth callback error:', error)
      res.status(500).json({ error: 'Authentication failed' })
      return undefined
    }
  },
})
