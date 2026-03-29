import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables")
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        supabaseResponse = NextResponse.next({
          request,
        })

        cookiesToSet.forEach(({ name, value, options }) => {
          const nextOptions = {
            ...options,
            path: options?.path ?? "/",
          }

          supabaseResponse.cookies.set(name, value, nextOptions)
        })
      },
    },
  })

  // Trigger session initialization/refresh before any response is returned.
  // We only need verified authentication claims here, not a fresh user record.
  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims ?? null

  return { supabaseResponse, claims, error }
}
