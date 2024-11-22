// middleware.ts
// auth0-config.ts
import { initAuth0 } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const verifyBasicAuth = (authHeader: string | null, username: string, password: string) => {
  if (!authHeader) {
    return false
  }

  const base64Credentials = authHeader.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [providedUsername, providedPassword] = credentials.split(':')

  return providedUsername === username && providedPassword === password
}

export const middleware = (request: NextRequest) => {
  // Check for preview deployment
  const isPreview = process.env.VERCEL_ENV === 'preview'

  if (isPreview) {
    const authHeader = request.headers.get('authorization')

    // If credentials are wrong, get back auth request
    if (
      !verifyBasicAuth(
        authHeader,
        process.env.PREVIEW_USERNAME || '',
        process.env.PREVIEW_PASSWORD || ''
      )
    ) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Preview deployment"',
        },
      })
    }
  }
  return NextResponse.next()
}

// Definition where should be middleware applied
export const config = {
  matcher: [
    // Apply for every routes except API routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export default initAuth0({
  // Basic Auth0 config
  baseURL: process.env.VERCEL_URL || process.env.AUTH0_BASE_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // Important: Allow wildcard callback URLs for preview deployments
  // @ts-ignore
  callbacks: {
    // @ts-ignore
    redirect: (req: NextRequest, location: string) => {
      // If it's preview mode, use VERCEL_URL
      if (process.env.VERCEL_ENV === 'preview') {
        const previewUrl = new URL(location)
        previewUrl.host = process.env.VERCEL_URL || previewUrl.host
        return previewUrl.toString()
      }
      return location
    },
  },
})
