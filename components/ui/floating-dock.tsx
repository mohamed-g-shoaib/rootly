"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

export type FloatingDockItem = {
  label: string;
  icon: React.ReactNode;
  link: string;
};

function DockIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid size-4.5 place-items-center [&_svg]:block">
      <div className="flex items-center justify-center translate-y-[0.5px]">
        {children}
      </div>
    </div>
  );
}

function isDockItemActive(pathname: string, link: string) {
  if (link === "/overview") return pathname === "/overview";
  return pathname === link;
}

export function FloatingDock({
  navigationItems,
  desktopClassName,
  mobileClassName,
}: {
  navigationItems: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) {
  return (
    <>
      <FloatingDockDesktop
        navigationItems={navigationItems}
        className={desktopClassName}
      />
      <FloatingDockMobile
        navigationItems={navigationItems}
        className={mobileClassName}
      />
    </>
  );
}

function FloatingDockMobile({
  navigationItems,
  className,
}: {
  navigationItems: FloatingDockItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const prefetch = React.useCallback(
    (href: string) => {
      if (href === pathname) return;
      router.prefetch(href);
    },
    [pathname, router],
  );

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const item of navigationItems) {
        prefetch(item.link);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [navigationItems, prefetch]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+var(--dashboard-floating-gap-mobile))] z-30 flex justify-center md:hidden",
        className,
      )}
      style={{
        viewTransitionName: "dashboard-dock",
      }}
    >
      <nav className="mx-auto flex items-center gap-1 rounded-[calc(var(--radius)+4px)] border bg-background/95 p-1 shadow-sm backdrop-blur-sm">
        {navigationItems.map((item) => {
          const isActive = isDockItemActive(pathname, item.link);
          const transitionTypes =
            item.link === "/overview" || pathname === "/overview"
              ? undefined
              : (["dashboard-lateral"] as string[]);

          return (
            <Link
              key={item.label}
              href={item.link}
              prefetch
              transitionTypes={transitionTypes}
              aria-label={item.label}
              onMouseEnter={() => prefetch(item.link)}
              onFocus={() => prefetch(item.link)}
              onTouchStart={() => prefetch(item.link)}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-lg border transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-accent/80 hover:text-accent-foreground",
              )}
            >
              <DockIcon>{item.icon}</DockIcon>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function FloatingDockDesktop({
  navigationItems,
  className,
}: {
  navigationItems: FloatingDockItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const prefetch = React.useCallback(
    (href: string) => {
      if (href === pathname) return;
      router.prefetch(href);
    },
    [pathname, router],
  );

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const item of navigationItems) {
        prefetch(item.link);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [navigationItems, prefetch]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-[var(--dashboard-floating-gap-desktop)] z-30 hidden justify-center md:flex",
        className,
      )}
      style={{
        viewTransitionName: "dashboard-dock",
      }}
    >
      <nav className="mx-auto flex items-center gap-1 rounded-[calc(var(--radius)+4px)] border bg-background/95 p-1 shadow-sm backdrop-blur-sm">
        {navigationItems.map((item) => (
          <DesktopDockItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            link={item.link}
            active={isDockItemActive(pathname, item.link)}
            onPrefetch={prefetch}
            transitionTypes={
              item.link === "/overview" || pathname === "/overview"
                ? undefined
                : (["dashboard-lateral"] as string[])
            }
          />
        ))}
      </nav>
    </div>
  );
}

function DesktopDockItem({
  label,
  icon,
  link,
  active,
  onPrefetch,
  transitionTypes,
}: {
  label: string;
  icon: React.ReactNode;
  link: string;
  active: boolean;
  onPrefetch: (href: string) => void;
  transitionTypes?: string[];
}) {
  return (
    <Link
      href={link}
      prefetch
      transitionTypes={transitionTypes}
      aria-label={label}
      onMouseEnter={() => onPrefetch(link)}
      onFocus={() => onPrefetch(link)}
      onTouchStart={() => onPrefetch(link)}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium tracking-[-0.01em] transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-accent/80 hover:text-accent-foreground",
      )}
    >
      <DockIcon>{icon}</DockIcon>
      <span className="leading-none whitespace-nowrap">{label}</span>
    </Link>
  );
}
