import { initAuth0 } from '@auth0/nextjs-auth0'

// Helper na získanie správnej base URL
const getBaseUrl = () => {
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.AUTH0_BASE_URL
}

// Helper na získanie callback URL
const getCallbackUrl = () => {
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/auth/callback`
  }
  return `${process.env.AUTH0_BASE_URL ?? ''}/api/auth/callback`
}

console.log('Callback URL:', getCallbackUrl())

const auth0Config = {
  baseURL: getBaseUrl(),
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
  session: {
    absoluteDuration: 24 * 60 * 60,
  },
  httpTimeout: 10000,
}

export default initAuth0(auth0Config)
