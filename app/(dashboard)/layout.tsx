import type * as React from "react"

import { DashboardShell } from "@/app/ui/dashboard-shell"
import { privateRouteMetadata } from "@/lib/private-route-metadata"
import { getDashboardShellUser } from "@/lib/dashboard-session"
import { DashboardColorThemeStyle } from "@/components/dashboard-color-theme-style"

export const metadata = privateRouteMetadata

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getDashboardShellUser()

  return (
    <>
      <DashboardColorThemeStyle />
      <DashboardShell user={user}>{children}</DashboardShell>
    </>
  )
}
