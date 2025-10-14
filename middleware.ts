// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // خريطة تحويل المسارات القديمة ➜ الجديدة
  const map: Record<string, string> = {
    // عام
    "/login": "/auth/login",
    "/signup": "/auth/signup",

    // قديم بدون /dashboard
    "/apps": "/dashboard/apps",
    "/apps/new": "/dashboard/deploy",
    "/deploy": "/dashboard/deploy",
    "/monitor": "/dashboard/monitor",

    // إدارة
    "/admin/tenants": "/dashboard/admin/tenants",
  };

  const dest = map[url.pathname];
  if (dest) {
    url.pathname = dest;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// فعّل على الجذور الشائعة
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/apps/:path*",
    "/deploy",
    "/monitor",
    "/admin/:path*",
  ],
};

