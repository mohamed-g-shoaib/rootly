"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"

export function AuthAwareCta() {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
      return null
    })
  }, [])

  const href = user ? "/overview" : "/login"
  const label = user ? "Dashboard" : "Get started"

  if (loading) {
    // Render a placeholder with the same dimensions to prevent layout shift
    return (
      <Button
        disabled
        className="group w-full opacity-0 sm:w-auto"
        aria-hidden="true"
      >
        <span className="inline-flex items-center gap-2">
          Get started
          <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
        </span>
      </Button>
    )
  }

  return (
    <Button render={<Link href={href} />} className="group w-full sm:w-auto">
      <span className="inline-flex items-center gap-2">
        {label}
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          size={18}
          className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </span>
    </Button>
  )
}
