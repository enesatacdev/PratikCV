import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Korumalı rotalar - kimlik doğrulama gerektiren sayfalar
const protectedRoutes = [
  '/dashboard',
  '/my-cvs',
  '/create-cv',
  '/profile'
];

// Kimlik doğrulama sayfaları - giriş yapmış kullanıcılar erişemez
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/sign-in',
  '/auth/sign-up'
];

// Basit token formatı kontrolü (JWT benzeri)
function isValidTokenFormat(token: string): boolean {
  try {
    // JWT format kontrolü: 3 bölüm nokta ile ayrılmış
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Base64 decode test
    const payload = JSON.parse(atob(parts[1]));
    
    // Expiration kontrolü (varsa)
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Auth token'ı kontrol et
  const token = request.cookies.get('authToken')?.value;

  // Korumalı rotalar için token kontrolü
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token || !isValidTokenFormat(token)) {
      // Token yoksa veya geçersizse login sayfasına yönlendir
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      if (token) {
        // Geçersiz token'ı temizle
        response.cookies.delete('authToken');
      }
      return response;
    }
  }

  // Auth sayfaları için token kontrolü
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isAuthRoute && token) {
    // Token formatı geçerliyse dashboard'a yönlendir
    if (isValidTokenFormat(token)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      // Geçersiz token'ı temizle ve auth sayfasında kalmaya izin ver
      const response = NextResponse.next();
      response.cookies.delete('authToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
