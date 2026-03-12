"use client"

import * as React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/app/auth/actions"
import type { User } from "@supabase/supabase-js"

export function FooterAccountLink() {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  if (user) {
    return (
      <form action={signOut}>
        <button
          type="submit"
          className="transition-colors hover:text-foreground text-muted-foreground text-sm"
        >
          Logout
        </button>
      </form>
    )
  }

  return (
    <Link
      href="/login"
      className="transition-colors hover:text-foreground"
    >
      Login
    </Link>
  )
}
