"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function PageTransitionShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={cn("page-transition-shell", className)}
      data-route={pathname}
    >
      {children}
    </div>
  );
}
