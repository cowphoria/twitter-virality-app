import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow access to public pages
  if (request.nextUrl.pathname.startsWith('/auth') || 
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname === '/landing') {
    return NextResponse.next()
  }
  
  // If no Google OAuth is configured, allow access to all routes (demo mode)
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.next()
  }
  
  // For protected routes when OAuth is configured, check for session
  // This will be handled by NextAuth middleware when OAuth is properly set up
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/app/:path*',
    '/api/analyze-tweet',
  ]
}
