import type * as React from "react"

import { DashboardColorThemeStyle } from "@/components/dashboard-color-theme-style"

export async function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardColorThemeStyle />
      {children}
    </>
  )
}
