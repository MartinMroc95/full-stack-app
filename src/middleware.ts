import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function verifyBasicAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return false
  }

  try {
    const [scheme, encoded] = authHeader.split(' ')
    if (!encoded || scheme !== 'Basic') {
      return false
    }

    const buffer = Buffer.from(encoded, 'base64')
    const [username, password] = buffer.toString('ascii').split(':')

    const isValid =
      username === process.env.PREVIEW_USERNAME && password === process.env.PREVIEW_PASSWORD

    return isValid
  } catch {
    return false
  }
}

export const middleware = (request: NextRequest) => {
  // Check for preview deployment
  const hostname = request.headers.get('host') || ''
  const isPreviewDomain = hostname.includes('vercel.app')

  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon') ||
    request.nextUrl.pathname.includes('.') ||
    // Dôležité: povoľ všetky auth-related cesty
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  const isPreview = process.env.VERCEL_ENV === 'preview' || isPreviewDomain

  if (isPreview && !verifyBasicAuth(request)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Preview deployment"',
      },
    })
  }
  return NextResponse.next()
}

// Definition where should be middleware applied
export const config = {
  matcher: [
    // Apply for every routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
