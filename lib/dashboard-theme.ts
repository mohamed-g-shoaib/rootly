export const DASHBOARD_THEME_COOKIE_NAME = "rootly.dashboard.theme"
export const DASHBOARD_THEME_ROOT_ID = "dashboard-theme-root"
export const LEGACY_DASHBOARD_THEME_STORAGE_KEY = "rootly-dashboard-theme"

export type DashboardThemeMode = "light" | "dark"

export function normalizeDashboardTheme(
  value: string | null | undefined
): DashboardThemeMode {
  return value === "dark" ? "dark" : "light"
}
