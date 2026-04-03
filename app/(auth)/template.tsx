import type * as React from "react";

import { PageTransitionShell } from "@/components/ui/page-transition-shell";

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransitionShell>{children}</PageTransitionShell>;
}
