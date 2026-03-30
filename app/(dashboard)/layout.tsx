import type * as React from "react"

import { DashboardShell } from "@/app/ui/dashboard-shell"
import { getDashboardShellUser } from "@/lib/dashboard-session"
import { privateRouteMetadata } from "@/lib/private-route-metadata"

export const metadata = privateRouteMetadata

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getDashboardShellUser()

  return <DashboardShell user={user}>{children}</DashboardShell>
}
