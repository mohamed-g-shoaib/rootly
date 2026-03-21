import type * as React from "react"

import { ColorThemeReset } from "@/components/color-theme-reset"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ColorThemeReset />
      <div className="flex min-h-svh items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </>
  )
}
