import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
// import { type NextApiHandler } from 'next'
// import auth0Config from '../../../../auth0-config'
// import { getAuth0Instance, getAuth0Urls } from '../../../../lib/auth'
// import prisma from '../../../../lib/prisma'

function getUrls(req: NextApiRequest) {
  const { host } = req.headers
  console.log('host', host)
  const protocol = process.env.VERCEL_URL ? 'https' : 'http'
  const redirectUri = `${protocol}://${host || ''}/api/auth/callback`
  const returnTo = `${protocol}://${host ?? ''}`
  return {
    redirectUri,
    returnTo,
  }
}

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { redirectUri } = getUrls(req)
      console.log('callback', redirectUri)
      await handleCallback(req, res, { redirectUri })
    } catch (error) {
      const { status = 500, message } = (error as { status?: number; message: string }) || {}
      res.status(status).end(message)
    }
  },
  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { redirectUri, returnTo } = getUrls(req)
      console.log('login', redirectUri)
      await handleLogin(req, res, {
        authorizationParams: {
          redirect_uri: redirectUri,
        },
        returnTo,
      })
    } catch (error) {
      const { status = 400, message } = (error as { status?: number; message: string }) || {}
      res.status(status).end(message)
    }
  },
  async logout(req: NextApiRequest, res: NextApiResponse) {
    const { returnTo } = getUrls(req)
    console.log('logout', returnTo)
    await handleLogout(req, res, {
      returnTo,
    })
  },
})

// export default handleAuth({
//   async callback(req: NextApiRequest, res: NextApiResponse) {
//     try {
//       const auth0Response = await handleCallback(req, res, {
//         afterCallback: async (_req: NextApiRequest, _res: NextApiResponse, session: Session) => {
//           const existingUser = await prisma.user.findUnique({
//             where: {
//               email: session.user.email,
//             },
//           })
//           if (!existingUser) {
//             await prisma.user.create({
//               data: {
//                 id: session.user.sid,
//                 email: session.user.email,
//                 image: session.user.picture,
//               },
//             })
//           }
//           return session
//         },
//       })
//       return auth0Response
//     } catch (error) {
//       console.error('Auth callback error:', error)
//       res.status(500).json({ error: 'Authentication failed' })
//       return undefined
//     }
//   },
// })
