import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { seedNewUser } from "@/lib/supabase/seed-new-user"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // if "next" is in search params, use it as the redirect URL
  const next = searchParams.get("next") ?? "/overview"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { count, error: countError } = await supabase
            .from("courses")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)

          if (!countError && (count ?? 0) === 0) {
            await seedNewUser(user.id)
          }
        }
      } catch (err) {
        console.error("auth callback: seedNewUser failed", err)
      }

      const isInternalRedirect = next.startsWith("/")
      const redirectTo = isInternalRedirect ? next : "/overview"
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
