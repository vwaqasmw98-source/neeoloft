import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Edge middleware for role-based route protection.
 *
 * - `/admin/*`      → admins only (others → /dashboard)
 * - `/dashboard/*`  → members only (admins → /admin)
 * - Everything else is allowed through.
 *
 * The matcher below intentionally skips Next internals, public assets, and
 * the public auth pages so we don't hit the JWT decoder for every request.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith('/admin');
  const isDashboardArea = pathname.startsWith('/dashboard');
  if (!isAdminArea && !isDashboardArea) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    // Without a secret we can't decode the JWT — fail closed for protected routes.
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  const token = await getToken({ req, secret });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  const role = (token as { role?: string }).role;

  if (isAdminArea && role !== 'admin') {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isDashboardArea && role === 'admin') {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run middleware only for protected areas; skip Next internals, public assets, and auth pages.
    '/admin/:path*',
    '/dashboard/:path*',
  ],
};
