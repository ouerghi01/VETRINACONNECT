import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from './app/lib/dal'
const protectedRoutes = ['/admin']
const publicRoutes = ['/login', '/signup', '/']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.find(route => path.endsWith(route)) !== undefined
  const isPublicRoute = publicRoutes.find(route => path.endsWith(route)) !== undefined

  const session = await verifySession()

  // 2. Redirect to /login if the user is not authenticated on protected routes
  if (isProtectedRoute && !session?.userId && !session?.isAuth) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
  if (!isPublicRoute && session?.userId) {
    if (session.role === 'admin' && !req.nextUrl.pathname.startsWith(`/admin/${session.userId}`)) {
      return NextResponse.redirect(new URL(`/admin/${session.userId}`, req.url));
    }
    if (session.role === 'user' && path !== '/') {
      return NextResponse.redirect(new URL(`/clients/${session.userId}`, req.url));

    }
  }


  return NextResponse.next()
}

export const config = {
  // The matcher should apply middleware logic to both public and protected routes
  matcher: ['/','/login','/signup','/admin/:path*'],
}
