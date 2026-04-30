import type * as React from "react"
import { Suspense } from "react"
import { cookies } from "next/headers"

import { ThemeProvider } from "@/components/theme-provider"
import { DashboardShell } from "@/app/ui/dashboard-shell"
import { ColorThemeApplicator } from "@/components/color-theme-applicator"
import { DashboardColorThemeStyle } from "@/components/dashboard-color-theme-style"
import {
  DASHBOARD_THEME_COOKIE_NAME,
  DASHBOARD_THEME_ROOT_ID,
  normalizeDashboardTheme,
} from "@/lib/dashboard-theme"
import { getDashboardShellUser } from "@/lib/dashboard-session"
import { privateRouteMetadata } from "@/lib/private-route-metadata"

export const metadata = privateRouteMetadata

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getDashboardShellUser()
  const cookieStore = await cookies()
  const initialTheme = normalizeDashboardTheme(
    cookieStore.get(DASHBOARD_THEME_COOKIE_NAME)?.value
  )

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <div
        id={DASHBOARD_THEME_ROOT_ID}
        className={initialTheme === "dark" ? "dark min-h-svh" : "min-h-svh"}
        style={{ colorScheme: initialTheme }}
      >
        <Suspense fallback={null}>
          <DashboardColorThemeStyle />
        </Suspense>
        <ColorThemeApplicator />
        <DashboardShell user={user}>{children}</DashboardShell>
      </div>
    </ThemeProvider>
  )
}
