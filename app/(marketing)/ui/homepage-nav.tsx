"use client"

import * as React from "react"
import Link from "next/link"

import { ArrowRight02Icon, Github01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import RootlyLogo from "@/components/rootly-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"

export default function HomepageNav() {
  const [scrolled, setScrolled] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      return null
    })
  }, [])

  React.useEffect(() => {
    function onScroll() {
      setScrolled((prev) => {
        const next = window.scrollY > 40
        return prev === next ? prev : next
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-colors",
        scrolled
          ? "border-border bg-background/80 backdrop-blur"
          : "border-transparent bg-transparent"
      )}
    >
      <PageContainer>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" aria-label="Rootly">
            <div className="flex items-center gap-2">
              <RootlyLogo className="size-6" />
              <div className="text-sm font-medium">Rootly</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              render={
                <a
                  href="https://github.com/mohamed-g-shoaib/rootly"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Star on GitHub"
                />
              }
              variant="outline"
              className="hidden sm:inline-flex"
            >
              <HugeiconsIcon icon={Github01Icon} size={18} />
              Star on GitHub
            </Button>

            {user ? (
              <Button
                render={<Link href="/overview" />}
                variant="ghost"
                size="icon"
                aria-label="Go to dashboard"
                className="rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      user.user_metadata?.avatar_url ??
                      user.user_metadata?.picture ??
                      ""
                    }
                    alt={
                      user.user_metadata?.full_name ??
                      user.user_metadata?.name ??
                      "User"
                    }
                  />
                  <AvatarFallback>
                    {(
                      user.user_metadata?.full_name ??
                      user.user_metadata?.name ??
                      user.email ??
                      "U"
                    )
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button render={<Link href="/login" />} className="group">
                <span className="inline-flex items-center gap-2">
                  Get started
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
              </Button>
            )}
          </div>
        </div>
      </PageContainer>
    </header>
  )
}
