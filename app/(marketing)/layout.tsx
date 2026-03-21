import type * as React from "react"

import { ColorThemeReset } from "@/components/color-theme-reset"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ColorThemeReset />
      {children}
    </>
  )
}
