import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_COOKIE = "sb-gforbcrkqdowocyfrrjj-auth-token"

const PROTECTED_PREFIXES = [
  "/overview",
  "/courses",
  "/notes",
  "/daily-entries",
  "/review",
] as const

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has(AUTH_COOKIE)

  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/overview", request.url))
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const proxyConfig = {
  matcher: ["/", "/overview/:path*", "/courses/:path*", "/notes/:path*", "/daily-entries/:path*", "/review/:path*"],
}
