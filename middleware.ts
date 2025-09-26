// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const PUBLIC_PATHS = ['/login', '/_next', '/favicon.ico'];

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

//   const hasJWT = req.cookies.get('jwt')?.value;
//   if (!hasJWT) {
//     const url = req.nextUrl.clone();
//     url.pathname = '/login';
//     url.searchParams.set('next', pathname);
//     return NextResponse.redirect(url);
//   }
//   return NextResponse.next();
// }
// export const config = { matcher: ['/((?!api).*)'] };
