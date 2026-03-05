import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ROUTES = ['/', ...PUBLIC_AUTH_ROUTES];
const TOKEN_COOKIE = 'access_token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  // Usuário autenticado em rota de auth → redireciona para o app
  if (PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/subscriptions', request.url));
    }
    return NextResponse.next();
  }

  // Rotas públicas liberadas
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Rotas privadas — exige token
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.*|apple-icon.*).*)',
  ],
};
