import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

const PROTECTED_PREFIXES = [
  "/overview",
  "/courses",
  "/notes",
  "/daily-entries",
  "/review",
] as const

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Refresh session and get the updated response
  const { supabaseResponse, user } = await updateSession(request)
  const isAuthenticated = !!user

  // 2. Redirect authenticated users away from public home and login
  if ((pathname === "/" || pathname === "/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/overview", request.url))
  }

  // 3. Redirect unauthenticated users to login for protected routes
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return supabaseResponse
}

export const proxyConfig = {
  matcher: [
    "/",
    "/login",
    "/overview/:path*",
    "/courses/:path*",
    "/notes/:path*",
    "/daily-entries/:path*",
    "/review/:path*",
  ],
}
