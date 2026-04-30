"use client"

import * as React from "react"

import { AudioPreferencesProvider } from "@/components/theme-provider"
import { MarketingThemeReset } from "@/components/marketing-theme-reset"
import { buildMarketingThemeCss } from "@/lib/color-theme"
import { getThemeById } from "@/lib/themes"

const MARKETING_THEME_ID = "rootly"

const theme = getThemeById(MARKETING_THEME_ID)
const css = buildMarketingThemeCss(MARKETING_THEME_ID)
const themeStyle = theme
  ? (Object.fromEntries(
      Object.entries(theme.light).map(([key, value]) => [`--${key}`, value])
    ) as React.CSSProperties)
  : undefined

export function MarketingRootlyShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style
        data-marketing-theme-id={MARKETING_THEME_ID}
        suppressHydrationWarning
      >
        {css}
      </style>
      <MarketingThemeReset />
      <AudioPreferencesProvider>
        <div
          data-marketing-theme-id={MARKETING_THEME_ID}
          style={themeStyle}
          className="min-h-svh bg-background text-foreground"
        >
          {children}
        </div>
      </AudioPreferencesProvider>
    </>
  )
}
