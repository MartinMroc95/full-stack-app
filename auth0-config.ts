import { initAuth0 } from '@auth0/nextjs-auth0'

const auth0Config = {
  baseURL: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.AUTH0_BASE_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  authorizationParams: {
    response_type: 'code' as 'code' | 'id_token' | 'code id_token',
    scope: 'openid profile email',
  },
  routes: {
    callback: '/api/auth/callback',
    postLogoutRedirect: '/',
  },
}

export default initAuth0(auth0Config)
