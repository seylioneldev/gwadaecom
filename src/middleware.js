import { NextResponse } from 'next/server';

export function middleware(request) {
  // Définir MAINTENANCE_MODE à true pour activer le mode maintenance
  const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';

  // Autoriser l'accès à la page de maintenance elle-même
  if (request.nextUrl.pathname === '/maintenance.html') {
    return NextResponse.next();
  }

  // Autoriser l'accès aux webhooks même en mode maintenance
  if (request.nextUrl.pathname.startsWith('/api/webhooks/')) {
    return NextResponse.next();
  }

  // Si en mode maintenance, rediriger vers la page de maintenance
  if (MAINTENANCE_MODE) {
    return NextResponse.rewrite(new URL('/maintenance.html', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
