import type * as React from "react"

import { MarketingRootlyShell } from "@/components/marketing-rootly-shell"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MarketingRootlyShell>{children}</MarketingRootlyShell>
}
