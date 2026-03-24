import type * as React from "react"
import { DashboardRouteLayout } from "@/app/ui/dashboard-route-layout"
import { privateRouteMetadata } from "@/lib/private-route-metadata"

export const metadata = privateRouteMetadata

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardRouteLayout>{children}</DashboardRouteLayout>
}
